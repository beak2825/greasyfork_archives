// ==UserScript==
// @name         bilibili Banner+
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  替换B站首页banner，并添加左下角悬浮按钮切换主题
// @match        https://www.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      code.juejin.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548294/bilibili%20Banner%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/548294/bilibili%20Banner%2B.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  GM_addStyle(`
    .layer {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .layer img {
      user-select: none;
      pointer-events: none;
    }
    #themeSwitcher {
      position: absolute;
      bottom: 12px;
      left: 12px;
      z-index: 9999;
      display: flex;
      gap: 8px;
      background: linear-gradient(135deg, #ffffffcc, #f0f0f0cc);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      padding: 6px 10px;
      font-size: 14px;
      font-family: sans-serif;
      user-select: none;
      transition: all 0.3s ease;
    }
    #themeSwitcher button {
      background: #fff;
      border: none;
      border-radius: 6px;
      padding: 4px 8px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    #themeSwitcher button:hover {
      background: #e3e3e3;
    }
    #themeSwitcher button.active {
      background: #00a1d6;
      color: white;
      font-weight: bold;
    }
  `);

  const MODULE_URL = 'https://code.juejin.cn/api/raw/7267103634863702050?id=7267103634863751202';
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  let allImagesData = null;
  let layers = [];
  let compensate = 1;
  let initX = 0, moveX = 0, startTime = 0;
  const duration = 300;
  let banner = null;
  let datasets = [];
  let currentThemeIndex = 0; // ⭐ 新增：记录当前主题索引

  banner = await waitForBanner();
  banner.innerHTML = '';
  banner.style.position = 'relative';
  banner.style.overflow = 'hidden';
  banner.style.minWidth = '1000px';
  banner.style.minHeight = '155px';
  banner.style.height = '10vw';
  banner.style.maxHeight = '240px';

  const mod = await loadJuejinModule();
  datasets = [mod.barnerImagesData1, mod.barnerImagesData2];
  allImagesData = datasets[currentThemeIndex];

  initItems();
  createThemeSwitcher();

  banner.addEventListener('mouseover', e => initX = e.pageX);
  banner.addEventListener('mousemove', e => {
    moveX = e.pageX - initX;
    requestAnimationFrame(mouseMove);
  });
  banner.addEventListener('mouseleave', leave);
  window.onblur = leave;
  window.addEventListener('resize', initItems);

  function initItems() {
    compensate = window.innerWidth > 1650 ? window.innerWidth / 1650 : 1;

    // ⭐ 保留按钮，不清空它
    const switcher = document.getElementById('themeSwitcher');
    if (switcher) switcher.remove(); // 临时移除，稍后重新挂载

    banner.innerHTML = '';
    for (let i = 0; i < allImagesData.length; i++) {
      const item = allImagesData[i];
      const layer = document.createElement('div');
      layer.classList.add('layer');
      layer.style.transform = new DOMMatrix(item.transform);
      if (item.opacity) layer.style.opacity = item.opacity[0];
      const img = document.createElement('img');
      img.src = item.url;
      img.style.filter = `blur(${item.blur}px)`;
      img.style.width = `${item.width * compensate}px`;
      layer.appendChild(img);
      banner.appendChild(layer);
    }
    layers = banner.querySelectorAll('.layer');

    // 重新挂载按钮并恢复高亮
    createThemeSwitcher();
  }

  function mouseMove() {
    animate();
  }

  function leave() {
    startTime = 0;
    requestAnimationFrame(homing);
  }

  function homing(timestamp) {
    !startTime && (startTime = timestamp);
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    animate(progress);
    progress < 1 && requestAnimationFrame(homing);
  }

  function animate(progress) {
    if (layers.length <= 0) return;
    const isHoming = typeof progress === 'number';
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const item = allImagesData[i];
      let m = new DOMMatrix(item.transform);
      let move = moveX * item.a;
      let s = item.f ? item.f * moveX + 1 : 1;
      let g = moveX * (item.g || 0);
      if (isHoming) {
        m.e = lerp(moveX * item.a + item.transform[4], item.transform[4], progress);
        move = 0;
        s = lerp(item.f ? item.f * moveX + 1 : 1, 1, progress);
        g = lerp(item.g ? item.g * moveX : 0, 0, progress);
      }
      m = m.multiply(new DOMMatrix([m.a * s, m.b, m.c, m.d * s, move, g]));
      if (item.deg) {
        const deg = isHoming ? lerp(item.deg * moveX, 0, progress) : item.deg * moveX;
        m = m.multiply(new DOMMatrix([Math.cos(deg), Math.sin(deg), -Math.sin(deg), Math.cos(deg), 0, 0]));
      }
      if (item.opacity) {
        layer.style.opacity = isHoming && moveX > 0
          ? lerp(item.opacity[1], item.opacity[0], progress)
          : lerp(item.opacity[0], item.opacity[1], moveX / window.innerWidth * 2);
      }
      layer.style.transform = m;
    }
  }

  function createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'themeSwitcher';

    ['🐢 水下世界', '🐊 大海之上'].forEach((label, idx) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.id = `theme-${idx}`;
      if (idx === currentThemeIndex) btn.classList.add('active'); // ⭐ 根据当前主题高亮
      btn.onclick = () => {
        currentThemeIndex = idx; // ⭐ 更新当前主题索引
        allImagesData = datasets[idx];
        initItems();
      };
      switcher.appendChild(btn);
    });

    banner.appendChild(switcher);
  }

  function waitForBanner() {
    return new Promise(resolve => {
      const check = () => {
        const el = document.querySelector('.bili-header__banner');
        if (el) return resolve(el);
        requestAnimationFrame(check);
      };
      check();
    });
  }

  async function loadJuejinModule() {
    const codeText = await gmGet(MODULE_URL);
    const blobUrl = URL.createObjectURL(new Blob([codeText], { type: 'text/javascript' }));
    const mod = await import(/* webpackIgnore: true */ blobUrl);
    URL.revokeObjectURL(blobUrl);
    return mod;
  }

   function gmGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: res => res.status >= 200 && res.status < 300 ? resolve(res.responseText) : reject(new Error(`HTTP ${res.status}`)),
        onerror: err => reject(err),
        ontimeout: () => reject(new Error('Request timeout'))
      });
    });
  }

})();
