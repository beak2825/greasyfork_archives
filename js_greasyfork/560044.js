// ==UserScript==
// @name         在 Google 搜索跳转到 Google 学术
// @description  在 Google 搜索中添加跳转到 Google 学术的 tab
// @version      0.1
// @license      MIT
// @match        https://www.google.com/search*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/570980
// @downloadURL https://update.greasyfork.org/scripts/560044/%E5%9C%A8%20Google%20%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%20Google%20%E5%AD%A6%E6%9C%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/560044/%E5%9C%A8%20Google%20%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%88%B0%20Google%20%E5%AD%A6%E6%9C%AF.meta.js
// ==/UserScript==

(() => {
  const ID = "tm-scholar-tab";
  const TEXT = "学术"; // or "Scholar"
  const href = () =>
    "https://scholar.google.com/scholar?q=" +
    encodeURIComponent(new URLSearchParams(location.search).get("q") || "");

  const findList = () =>
    [...document.querySelectorAll('div[role="list"]')].find(el =>
      (el.textContent || "").includes("全部") &&
      el.querySelectorAll('div[role="listitem"] a').length >= 3
    );

  const upsert = () => {
    const list = findList();
    if (!list) return;

    let a = document.getElementById(ID);
    if (!a) {
      const li = document.createElement("div");
      li.setAttribute("role", "listitem");
      a = document.createElement("a");
      a.id = ID;
      a.className = "C6AK7c";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<div class="mXwfNd"><span class="R1QWuf">${TEXT}</span></div>`;
      li.appendChild(a);

      const more = [...list.querySelectorAll('div[role="listitem"]')].find(x =>
        (x.textContent || "").includes("更多")
      );
      list.insertBefore(li, more || null);
    }
    a.href = href();
  };

  upsert();
  new MutationObserver(upsert).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
