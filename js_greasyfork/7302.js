// ==UserScript==
// @name            Pixiv Show bookmark count
// @name:zh-CN      Pixiv 显示每个插图的书签数量
// @name:zh-TW      Pixiv 顯示每個插圖的書籤數量
// @version         6.0.2
// @match           https://www.pixiv.net/*
// @namespace       https://greasyfork.org/users/7945
// @description        検索ページ、作者作品一覧ページなどにて、各イラストのブックマーク数を表示します。
// @description:en     Displays the number of bookmarks for each illustration on the search page, author work list page, etc.
// @description:zh-CN  在搜索页面，作者工作列表页面等上显示每个插图的书签数量。
// @description:zh-TW  在搜索頁面，作者工作列表頁面等上顯示每個插圖的書籤數量。
// @downloadURL https://update.greasyfork.org/scripts/7302/Pixiv%20Show%20bookmark%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/7302/Pixiv%20Show%20bookmark%20count.meta.js
// ==/UserScript==

document.head.insertAdjacentHTML("beforeend", '<style>.bmcount{text-align:center!important;padding-bottom:20px!important}.JoCpVnw .bmcount{padding-bottom:0!important}.bmcount a{height:initial!important;width:initial!important;border-radius:3px!important;padding:3px 6px 3px 18px!important;font-size:12px!important;font-weight:bold!important;text-decoration:none!important;color:#0069b1!important;background-color:#cef!important;background-image:url("data:image/svg+xml;charset=utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%2210%22 viewBox=%220 0 12 12%22><path fill=%22%230069B1%22 d=%22M9,1 C10.6568542,1 12,2.34314575 12,4 C12,6.70659075 10.1749287,9.18504759 6.52478604,11.4353705 L6.52478518,11.4353691 C6.20304221,11.6337245 5.79695454,11.6337245 5.4752116,11.4353691 C1.82507053,9.18504652 0,6.70659017 0,4 C1.1324993e-16,2.34314575 1.34314575,1 3,1 C4.12649824,1 5.33911281,1.85202454 6,2.91822994 C6.66088719,1.85202454 7.87350176,1 9,1 Z%22/></svg>")!important;background-position:center left 6px!important;background-repeat:no-repeat!important}</style>');
const done = '.bmcount , .bookmark-count , a[href*="/bookmark_detail.php?illust_id="]';
new MutationObserver(() => {
  document.querySelectorAll('.sc-98699d11-1.hHLaTl li:not([data-dummybmc]) , .sc-bf8cea3f-1.bCxfvI li:not([data-dummybmc]) , .sc-e6de33c8-0.fhUcsb li:not([data-dummybmc]) , .ranking-item:not([data-dummybmc]) , .gtm-illust-recommend-zone[data-gtm-recommend-zone="discovery"] li:not([data-dummybmc])').forEach(async (Each) => {
    Each.dataset.dummybmc = "";
    const id = /\d+/.exec(Each.querySelector('a[href*="/artworks/"]')?.href)?.[0];
    if (!id || !Each.hasAttribute("data-dummybmc") || Each.querySelectorAll(done).length || Each.hasAttribute("data-bmcount")) return;
    const bmcount = (await (await fetch("https://www.pixiv.net/ajax/illust/" + id, { credentials: "omit" })).json()).body.bookmarkCount;
    if (bmcount && !Each.querySelectorAll(done).length && !Each.hasAttribute("data-bmcount")) Each.insertAdjacentHTML("beforeend", '<div class="bmcount"><a href="/bookmark_detail.php?illust_id=' + id + '">' + bmcount + "</a></div>");
    Each.dataset.bmcount = bmcount;
  });
}).observe(document.body, { childList: true, subtree: true });