// ==UserScript==
// @name         百度首页bing壁纸
// @author       俭少
// @version      1.3
// @license      MIT License
// @description  百度首页每日自动更新 Bing 壁纸，仅首页显示，搜索后自动淡出；去广告，移除底栏，打造沉浸式首页。
// @match        *://www.baidu.com/*
// @match        *://ipv6.baidu.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.bing.com
// @namespace https://github.com/designedbyzhu
// @downloadURL https://update.greasyfork.org/scripts/555679/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5bing%E5%A3%81%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/555679/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5bing%E5%A3%81%E7%BA%B8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const wallpaperClass = 'bing-bg';
  const bingApi = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN';

  // --- 加载 Bing 壁纸 ---
  async function loadWallpaper() {
    const today = new Date().toDateString();
    const cache = GM_getValue('bingBgCache');

    if (cache && cache.date === today && cache.data) {
      setBg(cache.data);
      return;
    }

    GM_xmlhttpRequest({
      method: 'GET',
      url: bingApi,
      onload: (res) => {
        const json = JSON.parse(res.responseText);
        const url = 'https://www.bing.com' + json.images[0].url;
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          responseType: 'blob',
          onload: (imgRes) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result;
              GM_setValue('bingBgCache', { date: today, data: base64 });
              setBg(base64);
            };
            reader.readAsDataURL(imgRes.response);
          },
        });
      },
    });
  }

  // --- 设置背景 ---
  function setBg(src) {
    if (document.querySelector(`.${wallpaperClass}`)) return;
    const div = document.createElement('div');
    div.className = wallpaperClass;
    div.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: url(${src}) center/cover no-repeat;
      z-index: -1;
      opacity: 0;
      transition: opacity 1s ease;
    `;
    document.body.appendChild(div);
    requestAnimationFrame(() => div.style.opacity = 1);
  }

  // --- 淡出背景 ---
  function fadeOutBg() {
    const bg = document.querySelector(`.${wallpaperClass}`);
    if (bg) {
      bg.style.opacity = 0;
      setTimeout(() => bg.remove(), 600);
    }
  }

  // --- 判断是否首页 ---
  function isHome() {
    return !location.search.includes('wd=');
  }

  // --- 去广告 ---
  function removeAds() {
    const adSelectors = [
      '#content_right',
      '.ec_tuiguang',
      '#s-bottom-layer',
      '.s-sponsored',
      '.left-ad'
    ];
    adSelectors.forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
  }

  // --- 移除底栏，打造沉浸式首页 ---
  function removeFooterBar() {
    const footerSelectors = [
      '#bottom_layer',
      '#s-bottom-layer',
      '#ftCon',
      '.s-bottom-ctner',
      '.s-hotsearch-wrapper'
    ];
    footerSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
    document.body.style.marginBottom = '0';
  }

  // --- 初始化 ---
  function init() {
    if (isHome()) {
      loadWallpaper();
      removeAds();
      removeFooterBar();
    } else {
      fadeOutBg();
    }
  }

  init();

  // --- 监听搜索动作 ---
  const handleSearch = () => setTimeout(() => {
    if (!isHome()) fadeOutBg();
  }, 500);

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.id === 'su' || t.closest('#su')) handleSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // --- 监听 URL 变化（兼容单页应用） ---
  let lastURL = location.href;
  new MutationObserver(() => {
    if (location.href !== lastURL) {
      lastURL = location.href;
      init();
    }
  }).observe(document.body, { childList: true, subtree: true });

})();
