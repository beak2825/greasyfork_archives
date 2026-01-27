// ==UserScript==
// @name         EH Enhance（E绅士增强）
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Scroll to top/comment/bottom, copy gallery title, search selected text, search multiple tags, torrent magnet.（滚动到顶部/讨论区/底部，复制画廊标题，搜索选中文本，多标签搜索，种子磁力链接）
// @author       ssnangua
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @icon         https://e-hentai.org/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550066/EH%20Enhance%EF%BC%88E%E7%BB%85%E5%A3%AB%E5%A2%9E%E5%BC%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550066/EH%20Enhance%EF%BC%88E%E7%BB%85%E5%A3%AB%E5%A2%9E%E5%BC%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const chinese = {
    search: "搜索",
    language: "中文",
    uncensored: "无修",
    wnacg: "绅漫",
    hitomi: "hitomi",
    yhg: "移花宫",
    es: "ES",
    copy: "复制",
    searchSelectedTags: "搜索选中的标签",
    toTop: "滚动到顶部",
    toComment: "滚动到评论区",
    toBottom: "滚动到底部",
    toggleLanguage: "Change To English",
    goFirst: "第一页",
    goPrev: "上一页",
    backGallery: "回画廊",
    goNext: "下一页",
    goLast: "最后一页",
    magnet: "磁力",
  };
  const english = {
    search: "Search",
    language: "English",
    uncensored: "Uncensored",
    wnacg: "wnacg",
    hitomi: "hitomi",
    yhg: "yhg",
    es: "ES",
    copy: "Copy",
    searchSelectedTags: "Search Selected Tags",
    toTop: "Scroll To Top",
    toComment: "Scroll To Comment",
    toBottom: "Scroll To Bottom",
    toggleLanguage: "切换为中文",
    goFirst: "First",
    goPrev: "Prev",
    backGallery: "Gallery",
    goNext: "Next",
    goLast: "Last",
    magnet: "Magnet",
  };
  const lang = localStorage.language || navigator.language;
  const isChinese = lang === "zh-CN";
  const t = isChinese ? chinese : english;

  const EH = location.origin + "/?f_search=%s";
  const WNACG =
    "https://www.wnacg.com/search/?q=%s&f=_all&s=create_time_DESC&syn=yes";
  const HITOMI = "https://hitomi.la/search.html?%s";
  const YHG = "https://yhg007.com/search-%s-0-0-1.html";
  const ES = "es:%s";

  const SEARCH_BAR = [
    {
      label: '<img src="https://e-hentai.org/favicon.ico">' + t.search,
      append: "",
      url: EH,
    },
    {
      label:
        '<img src="https://e-hentai.org/favicon.ico" style="filter: hue-rotate(135deg) brightness(1.5)">' +
        t.language,
      append: isChinese ? "language:chinese$" : "language:english$",
      url: EH,
    },
    {
      label:
        '<img src="https://e-hentai.org/favicon.ico" style="filter: hue-rotate(135deg) invert(1)">' +
        t.uncensored,
      append: "other:uncensored$",
      url: EH,
    },
    {
      label: '<img src="https://www.wnacg.com/favicon.ico">' + t.wnacg,
      append: "",
      url: WNACG,
    },
    {
      label:
        '<img src="https://ltn.gold-usergeneratedcontent.net/favicon-192x192.png">' +
        t.hitomi,
      append: "",
      url: HITOMI,
    },
    {
      label: '<img src="https://yhg007.com/static/favicon.ico">' + t.yhg,
      append: "",
      url: YHG,
    },
    {
      label: '<img src="https://www.voidtools.com/favicon.ico">' + t.es,
      append: "",
      url: ES,
    },
  ];

  const isListPage = document.querySelector(".itg.gld");
  const isGalleryPage = location.pathname.startsWith("/g/");
  const isReaderPage = location.pathname.startsWith("/s/");
  const isTorrentsPage = location.pathname === "/gallerytorrents.php";

  /**********************************************/
  /*                   工具条                   */
  /**********************************************/

  if (isListPage || isGalleryPage || isReaderPage) {
    const $scrollToBar = document.createElement("div");
    $scrollToBar.className = "eh-toolbar";
    document.body.appendChild($scrollToBar);

    // 滚动到顶部⬆️
    $scrollToBar.appendChild(createToolbarButton("🔝", t.toTop, 0));

    // （如果是画廊）
    if (isGalleryPage) {
      const $comments = document.querySelector("#cdiv");
      const $toCommentBtn = createToolbarButton("💬", t.toComment, $comments);
      let count = $comments.querySelectorAll(".c1").length;
      if (count > 0) {
        if ($comments.querySelector("#chd a").href.endsWith("#comments"))
          count += "+";
        const $count = document.createElement("span");
        $count.className = "comments-count";
        $count.textContent = count;
        $toCommentBtn.appendChild($count);
      }
      // 滚动到评论区💬
      $scrollToBar.appendChild($toCommentBtn);
    }

    // 滚动到底部
    $scrollToBar.appendChild(createToolbarButton("⬇️", t.toBottom, 1000000));

    // const $langButton = createButton(isChinese ? "🇨🇳" : "🇬🇧", () => {
    //   localStorage.language = isChinese ? "en-US" : "zh-CN";
    //   location.reload();
    // });
    // $langButton.dataset.tip = t.toggleLanguage;
    // $langButton.style.marginTop = "20px";
    // $scrollToBar.appendChild($langButton);

    // （如果是阅读器）
    if (isReaderPage) {
      const buttons = [
        ["⏮", t.goFirst],
        ["⮜", t.goPrev],
        ["🏠︎", t.backGallery],
        ["⮞", t.goNext],
        ["⏭", t.goLast],
      ];
      const $buttons = buttons.map(([label, tip]) => {
        const $button = createButton(label);
        $button.dataset.tip = tip;
        $scrollToBar.appendChild($button);
        return $button;
      });
      $buttons[0].style.marginTop = "20px";

      function updateGoToButton() {
        const [$first, $prev, $next, $last] =
          document.querySelectorAll("#i4 a");
        const $gallery = document.querySelector("#i5 a");
        [$first, $prev, $gallery, $next, $last].forEach(($a, i) => {
          $buttons[i].onclick = $a.onclick || (() => (location.href = $a.href));
        });
      }
      updateGoToButton();

      const observer = new MutationObserver(updateGoToButton);
      observer.observe(document.querySelector("#i4"), { childList: true });
    }

    function createToolbarButton(label, tip, scrollTopOrElement) {
      const $button = createButton(label, () => {
        if (typeof scrollTopOrElement === "number") {
          document.body.parentElement.scrollTo({
            top: scrollTopOrElement,
            behavior: "smooth",
          });
        } else {
          scrollTopOrElement.scrollIntoView({ behavior: "smooth" });
        }
      });
      $button.dataset.tip = tip;
      return $button;
    }
  }

  /**********************************************/
  /*                    列表                    */
  /**********************************************/

  // 标题
  const host =
    location.hostname === "e-hentai.org"
      ? "E-Hentai Galleries"
      : "ExHentai.org";

  const searches = Object.fromEntries(
    new URLSearchParams(location.search.slice(1)),
  );
  if (searches.f_search) {
    document.title = `search:${decodeURIComponent(searches.f_search)} - ${host}`;
  }

  const uploader = location.pathname.match(/\/uploader\/(.*)/)?.[1];
  if (uploader) {
    document.title = `uploader:${decodeURIComponent(uploader)} - ${host}`;
  }

  /**********************************************/
  /*                    画廊                    */
  /**********************************************/

  if (isGalleryPage) {
    // 复制标题
    document.querySelectorAll("h1#gn, h1#gj").forEach(($h1) => {
      const text = $h1.textContent.trim();
      if (text) {
        const $copyButton = createButton("", async () => {
          await navigator.clipboard.writeText(text);
          $copyButton.dataset.label = t.copy + "✔️";
          setTimeout(() => ($copyButton.dataset.label = t.copy), 1000);
        });
        $copyButton.dataset.label = t.copy;
        $copyButton.className = "eh-copy";
        $h1.appendChild($copyButton);
      }
    });

    // 多标签搜索
    const $taglist = document.querySelector("#taglist");
    if ($taglist) {
      const $tags = [...$taglist.querySelectorAll("a")];
      $tags.forEach(($tag) => {
        $tag.addEventListener("click", () => {
          $tag.selected = !$tag.selected;
          $tag.parentNode.classList.toggle("selected", $tag.selected);
          $act2.style.display = $tags.some(($tag) => $tag.selected)
            ? ""
            : "none";
        });
      });

      const $act2 = document.createElement("div");
      $act2.id = "tagmenu_act2";
      $act2.style.display = "none";
      $act2.innerHTML = `
        <img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;">
        <a id="search_tags" href="#">${t.searchSelectedTags}</a>
      `;
      $taglist.appendChild($act2);

      $act2.querySelector("#search_tags").addEventListener("click", () => {
        const tags = $tags
          .filter(($tag) => $tag.selected)
          .map(($tag) => {
            const [tc, td] = $tag.onclick
              .toString()
              .match(/'(.*?)'/)[1]
              .split(":");
            return `${tc}:"${td}$"`;
          });
        window.open(EH.replace("%s", tags.join("+")));
      });
    }
  }

  /**********************************************/
  /*                    种子                    */
  /**********************************************/

  if (isTorrentsPage) {
    document.querySelectorAll("form").forEach(($form) => {
      const hash = $form.querySelector("a")?.href.match(/([0-9a-f]{40})/i)?.[0];
      if (hash) {
        const $infoBtn = $form.querySelector('[name="torrent_info"]');
        const $magnetBtn = $infoBtn.cloneNode();
        $magnetBtn.type = "button";
        $magnetBtn.name = "torrent_magnet";
        $magnetBtn.textContent = $magnetBtn.value = `🧲 ${t.magnet}`;
        $magnetBtn.onclick = () => {
          const magnet = `magnet:?xt=urn:btih:${hash}`;
          // navigator.clipboard.writeText(magnet);
          location.href = magnet;
        };
        // $infoBtn.textContent = $infoBtn.value = `ℹ️ ${$infoBtn.textContent || $infoBtn.value}`;
        $infoBtn.parentNode.appendChild($magnetBtn);
      }
    });

    GM_addStyle(`
      .stuffbox {
        height: 594px !important;
      }
      #torrentinfo {
        height: 545px !important;
      }
    `);
  }

  /**********************************************/
  /*                    全局                    */
  /**********************************************/

  // 划词搜索
  let selectedText;

  const $searchBar = document.createElement("div");
  $searchBar.className = `eh-search-bar`;
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

  function createButton(label, onclick) {
    const $button = document.createElement("button");
    $button.innerHTML = label;
    if (onclick) $button.addEventListener("click", onclick);
    return $button;
  }

  document
    .querySelector("html")
    .classList.add(
      location.hostname === "e-hentai.org" ? "enhance-eh" : "enhance-ex",
    );

  GM_addStyle(`
    .enhance-eh {
      --panel-bg: #edebdf;
      --panel-border: 1px solid #5c0d12;
      --tag-selected-bg: #d5c5c6;
      --tag-selected-color: royalblue;

      & .eh-toolbar button, & button.eh-copy {
        color: #5c0d11;
        border-radius: 2px;
        border: 1px solid #767676;
        background: #efefef;
        &:hover {
          background: #e5e5e5;
        }
        &:active {
          background: #f5f5f5;
        }
      }
      button[data-label]::after {
        color: #5c0d11;
      }
    }
    .enhance-ex {
      --panel-bg: #4f535b;
      --panel-border: 1px solid #000000;
      --tag-selected-bg: #34353b;
      --tag-selected-color: skyblue;

      & .eh-toolbar button, & button.eh-copy {
        color: #faf8fa;
        border-radius: 2px;
        border: none;
        background: #6b6b6b;
        &:hover {
          background: #7b7b7b;
        }
        &:active {
          background: #616161;
        }
      }
      button[data-label]::after {
        color: #faf8fa;
      }
    }

    .eh-toolbar {
      display: flex;
      flex-flow: column;
      gap: 10px;
      z-index: 10;
      position: fixed;
      right: 30px;
      top: 20px;
      & button {
        width: 40px;
        height: 40px;
        font-size: 18px;
        cursor: pointer;
        position: relative;

        /*&:hover::after {
          content: attr(data-tip);
          display: inline-block;
          white-space: nowrap;
          font-size: 14px;
          background: var(--panel-bg);
          border: var(--panel-border);
          padding: 5px 10px;
          position: absolute;
          right: 42px;
          top: 50%;
          transform: translateY(-50%);
        }*/

        & .comments-count {
          display: inline-block;
          width: 16px;
          height: 16px;
          text-align: center;
          align-content: center;
          position: absolute;
          top: -8px;
          right: -12px;
          font-size: 9px;
          background: red;
          border-radius: 50%;
          padding: 2px;
          color: #ffffff;
        }
      }
    }

    .eh-copy {
      margin-left: 5px;
      cursor: pointer;
    }

    button[data-label]::after {
      content: attr(data-label);
    }

    .eh-search-bar {
      display: none;
      position: fixed;
      z-index: 10000;
      padding: 5px;
      background: var(--panel-bg);
      border: var(--panel-border);

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

    body td.tc {
      user-select: none;
    }

    #taglist td>div a[style="color: blue;"] {
      color: var(--tag-selected-color) !important;
    }
    #taglist td>div.selected {
      background: var(--tag-selected-bg);
    }

    #tagmenu_act2 {
      margin: 0;
      float: left;
      width: 554px;
      height: 26px;
      font-size: 9pt;
    }
    #tagmenu_act2 img {
      padding-bottom: 1px;
    }
    #tagmenu_act2 a {
      text-decoration: none;
      font-weight: bold;
    }

    button[name="torrent_info"] {
      cursor: pointer;
    }
    button[name="torrent_magnet"] {
      cursor: pointer;
      margin-top: 2px !important;
    }
  `);
})();
