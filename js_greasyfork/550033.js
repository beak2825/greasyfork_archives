// ==UserScript==
// @name         绅士漫画增强
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  优化显示样式，划词搜索，画廊页面显示“一键下载”按钮（可以少操作一步）
// @author       ssnangua
// @match        https://www.wnacg.com/*
// @match        http://m.wnacg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wnacg.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550033/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550033/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 配置
  const WNACG = "/search/?q=%s&f=_all&s=create_time_DESC&syn=yes";
  const EH = "https://exhentai.org/?f_search=%s";
  const ES = "es:%s";
  const SEARCH_BAR = [
    {
      label: `<img src="https://www.wnacg.com/favicon.ico"> 搜索`,
      append: "",
      url: WNACG,
    },
    {
      label: `<img src="https://www.wnacg.com/favicon.ico" style="filter: hue-rotate(90deg)"> 无修`,
      append: "修正",
      url: WNACG,
    },
    {
      label: `<img src="https://e-hentai.org/favicon.ico"> EH`,
      append: "",
      url: EH,
    },
    {
      label: `<img src="https://www.voidtools.com/favicon.ico"> ES`,
      append: "",
      url: ES,
    },
  ];

  // ┌──────√──────┐
  // └─────────────┘

  // 导航栏添加子菜单
  const NAV = [
    // 首頁
    [],
    // 更新
    [
      {
        text: "無修正",
        url: "/search/?q=修正&f=_all&s=create_time_DESC&syn=yes",
      },
      {
        text: "全彩",
        url: "/search/?q=全彩&f=_all&s=create_time_DESC&syn=yes",
      },
      {
        text: "完結",
        url: "/search/?q=完結&f=_all&s=create_time_DESC&syn=yes",
      },
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
      const $navItem = document.querySelector(
        `#album_tabs>li:nth-child(${index + 1})`,
      );
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

  // ┌───┬─────┬───┐
  // │ √ │     │   │
  // └───┴─────┴───┘

  // 简化操作按钮
  const $thumb = document.querySelector(".uwthumb");
  if ($thumb) {
    const $thumbBar = document.createElement("div");
    const buttonMap = {
      下拉閱讀: "📖 閱讀",
      加入書架: "📚 書架",
      下載漫畫: "📥 下載",
      本地下載一: "⬇下載一",
      本地下載二: "➡下載二",
    };
    let downHref;

    $thumb.querySelectorAll("a").forEach(($a) => {
      const label = buttonMap[$a.textContent];
      let $button;
      if ($a.href) {
        $button = createButton(label, () => (location.href = $a.href));
        $button.dataset.href = $a.href;
        if ($a.textContent === "下載漫畫") downHref = $a.href;
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

    // 获取下载链接
    if (downHref) {
      const $downBar = document.createElement("div");
      $downBar.classList.add("down_bar");
      $thumb.appendChild($downBar);

      // let timer = -1;
      // const $copyBtn = createLink("複製標題", null, async () => {
      //   await navigator.clipboard.writeText(title);
      //   $copyBtn.classList.add("copied");
      //   clearTimeout(timer);
      //   timer = setTimeout(() => $copyBtn.classList.remove("copied"), 1000);
      // });
      // $copyBtn.classList.add("down_btn", "copy_btn");
      // $downBar.appendChild($copyBtn);

      // fetch(downHref)
      //   .then((res) => res.text())
      //   .then((text) => {
      //     const doc = Document.parseHTMLUnsafe(text);
      //     doc.querySelectorAll(".down_btn").forEach(($downBtn) => {
      //       $downBtn.textContent = buttonMap[$downBtn.textContent.trim()];
      //       $downBtn.classList.remove("ads");
      //       $downBar.appendChild($downBtn);
      //     });
      //   });

      const $downBtn = document.createElement("button");
      $downBtn.textContent = "一鍵下載";
      $downBtn.classList.add("one-click-down_btn");
      const aid = location.pathname.match(/(?<=aid-)\d+/)?.[0];
      let downURL = GM_getValue(aid);
      if (downURL) $downBtn.classList.add("success");
      $downBtn.onclick = () => {
        if (downURL) {
          window.location.href = downURL; // 触发下载
        } else {
          $downBtn.textContent = "獲取中…";
          $downBtn.classList.add("loading");
          getDownURL(downHref)
            .then((url) => {
              if (url) {
                downURL = url;
                GM_setValue(aid, downURL); // 缓存
                window.location.href = downURL; // 触发下载
                $downBtn.classList.remove("loading");
                $downBtn.classList.add("success");
                $downBtn.textContent = "一鍵下載";
              } else {
                return Promise.reject();
              }
            })
            .catch(() => {
              $downBtn.classList.remove("loading");
              $downBtn.classList.add("error");
            });
        }
      };
      $downBar.appendChild($downBtn);
    }
  }

  async function getDownURL(downHref) {
    // 读取下载页面，解析文件配置信息
    const text = await fetch(downHref).then((res) => res.text());
    const CONFIG = new Function(`
      ${text.match(/const CONFIG = {([\s\S]*?)}/)[0]};
      return CONFIG;
    `)();

    // 获取下载链接
    const data = await fetch(CONFIG.WORKER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_key: CONFIG.FILE_KEY,
        file_name: CONFIG.FILE_NAME,
      }),
    }).then((res) => res.json());
    return data.success ? data.url : "";
  }

  // ┌───┬─────┬───┐
  // │   │  √  │   │
  // └───┴─────┴───┘

  const $tags = document.querySelector(".addtags");

  // 显示上传时间
  const upload = document.querySelector(".info_col")?.textContent.trim();
  if ($tags && upload) {
    const $upload = document.createElement("div");
    $upload.textContent = upload.replace("上傳於", "上傳於：");
    $tags.parentElement.insertBefore($upload, $tags);
  }

  // 标签：包含在标题中的标签加粗显示，按Ctrl键点击搜索无修正
  const title = document.querySelector("h2")?.textContent;
  if (title) {
    const artist = title.trim().match(/^\[.*?\]/)?.[0];
    document.querySelectorAll("a.tagshow").forEach(($a) => {
      if (title.includes($a.textContent)) {
        $a.classList.add("title-word");
      }
      if (artist && artist.includes($a.textContent)) {
        $a.classList.add("artist-word");
      }
      $a.addEventListener("click", (e) => {
        const url = e.ctrlKey
          ? WNACG.replace("%s", `${$a.textContent} 修正`)
          : $a.href;
        window.open(url);
        e.preventDefault();
      });
    });
  }

  // 折叠简介
  wrapDetails($tags?.nextElementSibling, "📝 簡介");

  // ┌───┬─────┬───┐
  // │   │     │ √ │
  // └───┴─────┴───┘

  // 折叠简介
  wrapDetails(document.querySelector(".uwuinfo>div"), "💬 說明");

  // 包裹内容
  function wrapDetails($el, title) {
    if ($el) {
      const $details = document.createElement("div");
      $details.classList.add("details");
      $details.innerHTML = `
        <div class="summary">${title}</div>
        <p>${$el.innerHTML}</p>
      `;
      $el.replaceWith($details);
      // 计算内容区域高度
      setTimeout(() => {
        const $box = $details.closest(".asTBcell");
        const $p = $details.children[1];
        const { top: T, height: H } = $box.getBoundingClientRect();
        const { top: t } = $p.getBoundingClientRect();
        const h =
          H - (t - T) - /*padding*/ 10 * 2 - /*border*/ 1 * 3 - /*margin*/ 10;
        $p.style.height = h + "px";
      }, 0);
      // 点击标题展开
      $details.children[0].onclick = () => {
        document.querySelectorAll(".details").forEach(($details) => {
          $details.classList.toggle("extend");
        });
      };
    }
  }

  // □□□□■■■■■■■|□□□□
  //             ┌───┬───┬───┬───┐
  //             └───┴───┴───┴───┘

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
      const left = Math.min(
        e.x,
        window.innerWidth - $searchBar.offsetWidth - 20,
      );
      const top = Math.min(
        e.y + 20,
        window.innerHeight - $searchBar.offsetHeight,
      );
      $searchBar.style.left = left + "px";
      $searchBar.style.top = top + "px";
    } else {
      $searchBar.style.display = "none";
    }
  });

  function createLink(label, href, onclick) {
    const $link = document.createElement("a");
    $link.textContent = label;
    if (href) {
      $link.href = href;
    }
    if (onclick) {
      $link.href = "javascript:;";
      $link.onclick = onclick;
    }
    return $link;
  }

  function createButton(label, onClick) {
    const $button = document.createElement("button");
    $button.innerHTML = label;
    if (onClick) $button.addEventListener("click", onClick);
    return $button;
  }

  // 🎨
  GM_addStyle(`
    #bread .result, #bread .dlh {
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
    a.tagshow.artist-word {
      color: #35a218;
    }

    .summary {
      border: 1px solid #ccc;
      background-color: #f9f9f9;
      padding: 0 10px;
      color: #666;
      cursor: pointer;
      font-size: 14px;
      line-height: 27px;
      position: relative;

      &::after {
        content: "▲";
        position: absolute;
        right: 10px;
      }

      &:hover {
        background-color: #35a218;
        color: #fff;
      }

      &+p {
        padding: 10px;
        background-color: rgba(241, 241, 241, 0.2);
        border: 1px solid #ccc;
        border-top: none;
        overflow: auto;
        height: 0;
      }
    }
    .details.extend > .summary {
      &::after {
        content: "▼";
      }
      &+p {
        height: auto !important;
      }
    }

    .uwconn .details {
      margin: 10px 20px 0 0;
    }
    .uwuinfo .details, .uwuinfo .details div {
      margin: 0;
    }

    #meiu_float_box>form {
      padding: 10px 20px;
    }
    
    .down_bar {
      margin-top: 5px;
    }
    .down_btn {
      text-decoration: none !important;
      width: initial !important;
      margin: 5px !important;
      &:hover {
        color: #35a218;
      }
      &:active {
        color: #c74b49;
      }
    }
    .copy_btn {
      position: relative;
      &.copied:before {
        position: absolute;
        left: -22px;
        content: "✅️";
      }
      &:hover {
        color: #36c;
      }
      &:active {
        color: #c74b49;
      }
    }
    .one-click-down_btn {
      &.loading {
        opacity: 0.5;
        pointer-events: none;
      }
      &.success {
        color: #35a218;
      }
      &.error {
        color: #c74b49;
      }
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
