// ==UserScript==
// @name         69shuba auto 書簽1
// @namespace    pl816098
// @version      3.3.39.3
// @description  自動書籤,更改css,可以在看書頁(https://www.69shuba.com/txt/*/*)找到作者連結
// @author       pl816098
// @match        https://69shux.com/txt/*/*
// @match        https://69shux.com/txt/*/end.html
// @match        https://69shux.com/book/*.htm*

// @match        https://www.69shu.top/txt/*/*
// @match        https://www.69shu.top/txt/*/end.html
// @match        https://www.69shu.top/book/*.htm*

// @match        https://www.69shu.cx/txt/*/*
// @match        https://www.69shu.cx/txt/*/end.html
// @match        https://www.69shu.cx/book/*.htm*

// @match        https://www.69shuba.pro/txt/*/*
// @match        https://www.69shuba.pro/txt/*/end.html
// @match        https://www.69shuba.pro/book/*.htm*

// @match        https://www.69shuba.pro/modules/article/bookcase.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=69shuba.com
// @grant        window.close
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @run-at       document-idle
// @license      MIT
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL https://update.greasyfork.org/scripts/551651/69shuba%20auto%20%E6%9B%B8%E7%B0%BD1.user.js
// @updateURL https://update.greasyfork.org/scripts/551651/69shuba%20auto%20%E6%9B%B8%E7%B0%BD1.meta.js
// ==/UserScript==

/* ==UserConfig==
config:
  is_close:
    title: 再結束頁時是否自動關閉
    description: 再結束頁(https://www.69shu.pro/txt/*\/end.html)時是否自動關閉
    type: checkbox
    default: true
  is_hook_alert:
    title: 是否劫持alert
    description: 是否劫持alert
    type: checkbox
    default: true
  auto_bookcase:
    title: 自動書籤
    description: 自動書籤
    type: checkbox
    default: true
---
debug:
  debug_log:
    title: debug log?
    description: debug log?
    type: checkbox
    default: false
 ==/UserConfig== */

// https://github.com/scriptscat/scriptcat/issues/264
// 希望支持// @grant        window.close

const debug_log = GM_getValue("debug.debug_log", false);
const is_close = GM_getValue("config.is_close", true);
const auto_bookcase = GM_getValue("config.auto_bookcase", true);

const _unsafeWindow =
  typeof unsafeWindow === "undefined" ? window : unsafeWindow; //兼容 ios userscripts 的寫法

let _GM_addStyle;
if (typeof GM_addStyle !== "undefined") {
  _GM_addStyle = GM_addStyle;
} else if (typeof GM !== "undefined" && typeof GM.addStyle !== "undefined") {
  _GM_addStyle = GM.addStyle;
} else {
  _GM_addStyle = (cssStr) => {
    let styleEle = document.createElement("style");
    styleEle.classList.add("_GM_addStyle");
    styleEle.innerHTML = cssStr;
    document.head.appendChild(styleEle);
    return styleEle;
  };
}

if (typeof zh_tran === "function") {
  zh_tran("t"); // 網站原有的函數
}

if (debug_log) {
  console.log("set func remove start");
}
function remove_ele(...args) {
  try {
    if (args && args.length > 0) {
      args.forEach((args) => {
        if (debug_log) {
          console.log("args: ", args);
          console.log(
            "document.querySelectorAll(args): ",
            document.querySelectorAll(args)
          );
        }
        if (document.querySelector(args)) {
          document.querySelectorAll(args).forEach((ele) => {
            ele.remove();
          });
        }
      });
    } else {
      throw new Error(
        "fn remove error, args is not a array or args.length =< 0"
      );
    }
  } catch (e) {
    console.error(e);
    return [false, args, e];
  }
  return [true, args];
}
if (debug_log) {
  console.log("set func remove end\n", remove_ele);
}

let url = window.location.href;
let pattern = {
  is_69shux: (host = window.location.host) => {
    if (host === "69shux.com") {
      return true;
    } else {
      return false;
    }
  },
  is_bookshelf: (href = window.location.href) => {
    if (href === "https://www.69shuba.pro/modules/article/bookcase.php") {
      return true;
    } else {
      return false;
    }
  },
  book: {
    get_aid: (href = window.location.href) => {
      let aid;
      try {
        if (typeof bookinfo.articleid == undefined) {
          url = href.split("/");
          aid = url[4];
        } else {
          aid = bookinfo.articleid;
        }
        return aid;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
    get_cid: (href = window.location.href) => {
      let cid;
      try {
        if (typeof bookinfo.chapterid == undefined) {
          url = href.split("/");
          cid = url[5];
        } else {
          cid = bookinfo.chapterid;
        }
        return cid;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
    pattern:
      /^(https?:\/\/)((www\.|)(69shuba|69xinshu|69shu|69shux)\.(com|pro|top|cx))\/txt\/[0-9]+\/(?!end)[0-9]+$/gm,
    is: (url = window.location.href) => {
      if (pattern.book.pattern.test(url)) {
        return true;
      } else {
        return false;
      }
    },
  },
  info: {
    pattern:
      /^(https?:\/\/)((www\.|)(69shuba|69xinshu|69shu|69shux)\.(com|pro|top|cx))\/book\/[0-9]+\.htm$/gm,
    is: (url = window.location.href) => {
      if (pattern.info.pattern.test(url)) {
        return true;
      } else {
        return false;
      }
    },
  },
  end: {
    pattern:
      /^(https?:\/\/)((www\.|)(69shuba|69xinshu|69shu|69shux)\.(com|pro|top|cx))\/txt\/[0-9]+\/end\.html$/gm,
    is: (url = window.location.href) => {
      if (pattern.end.pattern.test(url)) {
        return true;
      } else {
        return false;
      }
    },
  },
  next_is_end: {
    is: (url) => {
      try {
        if (
          document.querySelector("div.page1 > a:nth-child(4)") !== undefined
        ) {
          if (
            document.querySelector("div.page1 > a:nth-child(4)").href !==
            undefined
          ) {
            url = document.querySelector("div.page1 > a:nth-child(4)").href;
          }
        } else {
          console.error("網頁未載入完成");
          return undefined;
        }
      } catch (e) {
        console.error(e);
        return undefined;
      }
      if (pattern.end.pattern.test(url)) {
        return true;
      } else {
        return false;
      }
    },
  },
};
let ele = [];
if (pattern.book.is(url)) {
  if (debug_log) {
    console.log("book");
  }
  if (debug_log) {
    console.log("_GM_addStyle start");
  }
  _GM_addStyle(`#title {
    font-size: large;
    font-weight: bold;
    color: #000;
  }

  .container {
    margin: 0px !important;
    min-height: 0px !important;
    width: 100% !important;
    max-width: none !important;
  }

  .mybox {
    padding: 0px;
    margin: 0px;
  }
  `);
  if (debug_log) {
    console.log("_GM_addStyle end");
  }

  if (debug_log) {
    console.log("set ele start\n", ele);
  }
  ele = [
    ".mytitle",
    ".top_Scroll",
    "#pagefootermenu",
    "body > div.container > div > div.yueduad1",
    "#goTopBtn",
    "#pageheadermenu",
  ];
  if (debug_log) {
    console.log("set ele end\n", ele);
  }
  if (debug_log) {
    console.log("remove(ele) start");
    let remove_return = remove_ele(ele);
    console.log("remove(ele) end\n", remove_return);
  } else {
    remove_ele(ele);
  }
  if (auto_bookcase) {
    document.querySelector("#a_addbookcase").click();
  } else if (debug_log) {
    console.log("auto_bookcase !== true");
  }
  let author = "";
  if (typeof bookinfo.author === "string") {
    author = bookinfo.author; // 網站原有的變量
  } else {
    // 如果變量不存在
    author = document
      .querySelector(
        "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)"
      )
      .textContent.trim()
      .split(" ")[1];
  }
  let spanElement = document.querySelector(
    "body > div.container > div.mybox > div.txtnav > div.txtinfo.hide720 > span:nth-child(2)"
  );
  let aElement = document.createElement("a");
  aElement.href = `${window.location.origin}/modules/article/author.php?author=${author}`;
  aElement.textContent = author;
  aElement.style.color = "#007ead";
  spanElement.textContent = spanElement.textContent.trim().split(" ")[0];
  spanElement.appendChild(aElement);

  let title = document.querySelector(
    "body > div.container > div.mybox > div.tools"
  );

  // 創建新的 <a> 元素
  let link = document.createElement("a");

  // 設置 <a> 元素的內容為 bookinfo.articlename
  link.innerHTML = bookinfo.articlename;

  // 設置 <a> 元素的類名為 "userjs_add"
  link.classList = ["userjs_add"];

  // 設置 <a> 元素的 id 為 "title"
  link.id = "title";

  // 設置 <a> 元素的 href
  link.href = `${window.location.origin}/book/${bookinfo.articleid}.htm`;

  // 將 <a> 元素插入到 title 的父元素中
  title.parentNode.replaceChild(link, title);
}
if (pattern.info.is(url)) {
  if (debug_log) {
    console.log("info");
  }
  document
    .querySelector(
      "body > div.container > ul > li.col-8 > div:nth-child(2) > ul > li:nth-child(2) > a"
    )
    .click();
  document.querySelector(
    "body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(2) > a"
  ).style.color = "#007ead";
  document.querySelector(
    "body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(3) > a"
  ).style.color = "#007ead";
}
if (pattern.end.is(url)) {
  if (debug_log) {
    console.log("end");
  }
  if (is_close) {
    window.close();
  }
}
if (pattern.next_is_end.is()) {
  if (debug_log) {
    console.log("next_is_end");
  }
  document.addEventListener("keydown", function (e) {
    if (!e.repeat) {
      switch (true) {
        case e.key === "ArrowRight": {
          if (debug_log) {
            console.log('(e.key === "ArrowRight") === true');
          }
          if (auto_bookcase) {
            document.querySelector("#a_addbookcase").click();
          } else if (debug_log) {
            console.log("auto_bookcase !== true");
          }
          if (is_close) {
            window.close();
          }
          break;
        }
        default: {
          if (debug_log) {
            console.log("e: ", e);
          }
          break;
        }
      }
    }
  });
  document
    .querySelector(
      "body > div.container > div.mybox > div.page1 > a:nth-child(4)"
    )
    .addEventListener("click", function (e) {
      if (debug_log) {
        console.log("click");
      }
      if (auto_bookcase) {
        document.querySelector("#a_addbookcase").click();
      } else if (debug_log) {
        console.log("auto_bookcase !== true");
      }
      if (is_close) {
        window.close();
      }
    });
}
if (pattern.is_bookshelf()) {
  let n = 0;
  let updata_url = [];
  let block = false;
  let block_aid_list = GM_getValue("Block_cid_list", []);
  let block_aid_list_n = 0;
  let all_updata_label = document.querySelectorAll(".newbox2 h3 label");
  all_updata_label.forEach((up_data_label) => {
    n++;
    let url =
      up_data_label.parentNode.parentNode.parentNode.parentNode.querySelectorAll(
        ".newright > a.btn.btn-tp"
      )[0].href;
    let url_aid = new URLSearchParams(url).get("aid");
    block_aid_list.forEach((l_aid) => {
      if (l_aid == "*") {
        block_aid_list_n++;
        block = true;
        return;
      }
      if (l_aid == url_aid) {
        block_aid_list_n++;
        block = true;
        return;
      }
    });
    if (block === false) {
      updata_url.push(url);
    }
  });
  GM_registerMenuCommand(
    `${n === 0 ? "沒有" : `有${n}個`}更新${
      n === 0
        ? ""
        : block_aid_list_n === 0
        ? ",點擊全部打開"
        : `,點擊打開${n - block_aid_list_n}個`
    }`,
    () => {
      updata_url.forEach((url) => {
        GM_openInTab(url);
      });
    }
  );
}

if (GM_getValue("config.is_hook_alert", true)) {
  const _alert = alert;
  _unsafeWindow.alert = (...args) => {
    let blockade = [["添加成功"], ["删除成功!"]];
    let r = false;
    let n = 0;
    blockade.forEach((ele) => {
      n++;
      if (JSON.stringify(args) === JSON.stringify(ele)) {
        console.log("not alert", args);
        r = true;
      }
    });
    if (r === false) {
      if (debug_log) {
        console.log("alert", args);
      }
      _alert(args);
    }
  };
}
