// ==UserScript==
// @name         Nodeseek Google Site Search Icon Button
// @namespace    https://www.baixiaosheng.de/
// @version      1.7
// @description  在 nodeseek.com 搜索框右侧增加一个 Google site 搜索图标按钮，并支持回车触发搜索
// @author       baixiaosheng
// @match        *://nodeseek.com/*
// @match        *://*.nodeseek.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550247/Nodeseek%20Google%20Site%20Search%20Icon%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/550247/Nodeseek%20Google%20Site%20Search%20Icon%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SITE_DOMAIN = 'nodeseek.com';

  function googleSearch(q) {
    if (!q) return;
    const full = `site:${SITE_DOMAIN} ${q}`;
    window.open('https://www.google.com/search?q=' + encodeURIComponent(full), '_blank');
  }

  function addButton(input) {
    if (!input || input.dataset.gsiteBtnAdded) return;
    input.dataset.gsiteBtnAdded = "1";

    const btn = document.createElement("button");
    btn.title = "用 Google 搜索";
    btn.innerHTML = "🔍G";
    btn.style.position = "absolute";
    btn.style.right = "2.2em";
    btn.style.top = "50%";
    btn.style.transform = "translateY(-50%)";
    btn.style.border = "none";
    btn.style.background = "transparent";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
    btn.style.color = "#4285F4";
    btn.style.padding = "0 4px";

    const searchHandler = () => {
      const q = input.value.trim();
      if (q) googleSearch(q);
    };

    // 点击按钮触发
    btn.addEventListener("click", searchHandler);

    // 回车触发
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // 防止表单提交或页面刷新
        searchHandler();
      }
    });

    const wrapper = input.parentElement;
    if (wrapper && getComputedStyle(wrapper).position === "static") {
      wrapper.style.position = "relative";
    }
    wrapper.appendChild(btn);
  }

  function findAndAttach() {
    // 优先用 id="search-site2"，其次 name="q"
    const input = document.getElementById("search-site2") || document.querySelector('input[name="q"]');
    if (input) addButton(input);
  }

  // 初次运行
  findAndAttach();

  // 监听 SPA 动态渲染
  const mo = new MutationObserver(findAndAttach);
  mo.observe(document.body, { childList: true, subtree: true });
})();
