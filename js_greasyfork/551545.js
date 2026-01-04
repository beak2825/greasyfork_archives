// ==UserScript==
// @name         移花宫增强
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  优化显示
// @author       You
// @match        https://yhg007.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yhg007.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551545/%E7%A7%BB%E8%8A%B1%E5%AE%AB%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/551545/%E7%A7%BB%E8%8A%B1%E5%AE%AB%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 标题过滤
  const filter = /\d+\.xyz/i;
  // 中文字幕
  const subtitle = /(\-(U)*C|ch)\./i;
  // 无码/破解
  const uncensored = /(\-U(C)*|_000(\^)*|(\-|_)unc(ensored)*)\./i;
  // 网站
  const websites = {
    hhd800: /^hhd800\.com@/i,
    2048: /^(gc|guochan)*2048/,
    桃花族: /(ThZu\.Cc|thz\.la)/i,
  };

  const multiple = {
    Bytes: 1,
    kB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };
  const size2Value = (size) => {
    let [value, unit] = size.match(/([\d.]+) (.+)/).slice(1);
    return value * multiple[unit];
  };

  const items = [...document.querySelectorAll(".ssbox")].map(($item) => {
    const $title = $item.querySelector(".title>h3");
    const files = [...$item.querySelectorAll(".slist>ul>li")].map(($file) => {
      const $clone = $file.cloneNode(true);
      const $size = $clone.querySelector(".lightColor");
      $size.remove();
      const size = $size.textContent.trim();
      const filename = $clone.textContent.trim();
      const split = filename.split(".");
      const ext = split.length > 1 ? "." + split.pop() : "";
      const base = split.join(".");
      return {
        $el: $file,
        filename,
        base,
        ext,
        size,
        sizeValue: size2Value(size),
      };
    });
    files.sort((a, b) => b.sizeValue - a.sizeValue);
    files[0].$el.style["font-weight"] = "bold";

    const $bar = $item.querySelector(".sbar");
    const getSubItem = (i) => ({ $el: $bar.children[i], text: $bar.children[i].querySelector("b").textContent.trim() });
    return {
      $el: $item,
      title: {
        $el: $title,
        text: $title.textContent.trim(),
      },
      files,
      magnet: { $el: $bar.children[0], text: $bar.children[0].querySelector("a").href },
      addDate: getSubItem(1),
      size: getSubItem(2),
      lastDownloadDate: getSubItem(3),
      popular: getSubItem(4),
    };
  });

  const testTitle = (item, rule) => rule.test(item.title.text);
  const testFile = (item, rule) => item.files.some((file) => rule.test(file.filename));
  const testItem = (item, rule) => testTitle(item, rule) || testFile(item, rule);

  items.forEach((item) => {
    // 过滤
    if (testItem(item, filter)) {
      item.$el.style.display = "none";
    }
    // 中文字幕
    if (testItem(item, subtitle)) {
      const $tag = createTag("subtitle", "字幕");
      item.title.$el.insertBefore($tag, item.title.$el.firstChild);
    }
    // 无码/破解
    if (testItem(item, uncensored)) {
      const $tag = createTag("uncensored", "无码");
      item.title.$el.insertBefore($tag, item.title.$el.firstChild);
    }
    // 网站
    for (let name in websites) {
      if (testItem(item, websites[name])) {
        const $tag = createTag("website", name);
        item.title.$el.insertBefore($tag, item.title.$el.firstChild);
      }
    }
  });

  function createTag(type, label) {
    const $tag = document.createElement("span");
    $tag.classList.add("cpill", type);
    $tag.dataset.label = label;
    return $tag;
  }

  let $lastVisitItem;
  function setLastVisitItem($item) {
    if ($lastVisitItem) $lastVisitItem.classList.remove("last-visit");
    $lastVisitItem = $item.closest(".ssbox");
    localStorage.lastVisitItem = $lastVisitItem.querySelector(".title>h3>a").href;
    $lastVisitItem.classList.add("last-visit");
  }

  // 顶部显示页码副本
  const $pager = document.querySelector(".pager");
  const $searchBox = document.querySelector(".sort-box");
  if ($pager && $searchBox) {
    const $pagerClone = $pager.cloneNode(true);
    $searchBox.parentNode.insertBefore($pagerClone, $searchBox.nextElementSibling);
  }

  // 搜索标题
  document.querySelectorAll(".title>h3").forEach(($h3) => {
    if (localStorage.lastVisitItem === $h3.querySelector("a").href) {
      setLastVisitItem($h3);
    }

    const text = $h3.textContent.replace(/\.(720p|1080p|2160p|4k)\..*/i, "").trim();
    const $box = document.createElement("div");
    $box.style.float = "right";
    $box.appendChild(createLink("[Google]", `https://www.google.co.jp/search?q=${text}`));
    $box.appendChild(createLink("[Image]", `https://www.google.co.jp/search?tbm=isch&q=${text}`));
    $h3.appendChild($box);
  });

  // 复制磁力链接
  document.querySelectorAll(".sbar>span:nth-child(1)>a").forEach(($a) => {
    const $copy = createLink("[复制]", () => {
      navigator.clipboard.writeText($a.href).then(() => {
        $copy.textContent = "[复制✅]";
        setTimeout(() => ($copy.textContent = "[复制]"), 1000);
      });
    });
    $a.parentNode.insertBefore($copy, $a.nextElementSibling);
  });

  function createLink(label, hrefOrClick) {
    const $a = document.createElement("a");
    $a.textContent = label;
    $a.href = "#";
    if (typeof hrefOrClick === "string") {
      const href = hrefOrClick;
      hrefOrClick = () => {
        window.open(href, "_blank");
      };
    }
    $a.addEventListener("click", (e) => {
      hrefOrClick();
      $a.classList.add("visited");
      setLastVisitItem($a);
      e.preventDefault();
    });
    return $a;
  }

  GM_addStyle(`
    .ssbox.last-visit {
      border: 2px solid orange;
    }
    .ssbox .title h3 > div a {
      color: #777;
      font-size: 13px;
    }
    a.visited {
      color: #ccc !important;
    }
    a + a {
      margin-left: 5px;
    }
    .cpill::after {
      content: attr(data-label);
    }
    .cpill + .cpill {
      margin-left: 5px;
    }
    .cpill.website {
      background-color: dodgerblue;
    }
    .cpill.subtitle {
      background-color: green;
    }
    .cpill.uncensored {
      background-color: deeppink;
    }
  `);
})();
