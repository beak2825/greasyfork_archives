// ==UserScript==
// @name         Pornolab 帖子预览图 + 下载按钮 + 调试日志
// @namespace    http://tampermonkey.net/
// @version      2025-08-08
// @description  给 Pornolab 帖子列表自动加载首图预览，并输出调试信息🤓🖼️ + 下载按钮💦
// @match        https://pornolab.net/*
// @grant        GM_xmlhttpRequest
// @connect      pornolab.net
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/562437/Pornolab%20%E5%B8%96%E5%AD%90%E9%A2%84%E8%A7%88%E5%9B%BE%20%2B%20%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%20%2B%20%E8%B0%83%E8%AF%95%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/562437/Pornolab%20%E5%B8%96%E5%AD%90%E9%A2%84%E8%A7%88%E5%9B%BE%20%2B%20%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%20%2B%20%E8%B0%83%E8%AF%95%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- 全屏查看器 ---------- */
  function createFullscreenViewer(imgUrl) {
    if (document.querySelector('#dan-img-viewer')) return;

    const overlay = document.createElement('div');
    overlay.id = 'dan-img-viewer';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0,0,0,0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      cursor: zoom-out;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    `;

    const img = document.createElement('img');
    img.src = imgUrl;
    img.style.cssText = `
      max-width: 100vw;
      max-height: 100vh;
      width: 100%;
      height: auto;
      object-fit: contain;
      box-shadow: 0 0 40px rgba(255,255,255,0.3);
      border-radius: 10px;
      transition: transform 0.3s ease;
      display: block;
    `;

    overlay.appendChild(img);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  }

  /* ---------- 主流程 ---------- */
  console.log('[预览图脚本] 🟣 启动中...');

  const isTrackerPage = location.pathname.includes('/tracker.php');
  const rows = isTrackerPage
    ? document.querySelectorAll('tr.tCenter')
    : document.querySelectorAll('tr[id^="tr-"]');

  console.log(
    `[预览图脚本] 🎯 检测到 ${rows.length} 条帖子，当前页面类型: ${
      isTrackerPage ? '搜索结果' : '普通页面'
    }`
  );

  rows.forEach((row, index) => {
    let anchor, td, fullLink;

    if (isTrackerPage) {
      td = row.querySelector('td.row4.tLeft');
      anchor = td?.querySelector('a.tLink');
    } else {
      td = row.querySelector('td.tt');
      anchor = td?.querySelector('.torTopic a');
    }

    if (!anchor) return;

    const rawHref = anchor.getAttribute('href');
    const href = rawHref.startsWith('http')
      ? rawHref
      : new URL(rawHref.replace(/^\.\//, '/forum/'), window.location.origin).href;
    fullLink = href;

    console.log(`[第${index + 1}条] 🔗 解析链接: ${fullLink}`);

    GM_xmlhttpRequest({
      method: 'GET',
      url: fullLink,
      headers: {
        Referer: fullLink,
        'User-Agent': navigator.userAgent,
      },
      onload(response) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, 'text/html');
        const postContent = doc.querySelector('.post_body');

        if (!postContent) {
          console.warn(`[跳过] ❌ 找不到内容区: ${fullLink}`);
          return;
        }

        const vars = Array.from(postContent.querySelectorAll('var.postImg'));
        const dl = postContent.querySelector('.dl-stub.dl-link');

        console.log(`[内容分析] ✅ 找到 ${vars.length} 张图`);

        if (!td) return;

        const container = document.createElement('div');
        const downloadBtn = document.createElement('a');

        /* ---------- 下载按钮 ---------- */
        if (dl) {
          downloadBtn.href = dl.href;
          downloadBtn.textContent = '🍑 下载种子';
          downloadBtn.target = '_blank';
          downloadBtn.style.cssText = `
            padding: 1px 8px;
            border-radius: 6px;
            background-color: #ff69b4;
            color: white;
            font-size: 13px;
            text-decoration: none;
            font-weight: normal;
            width: fit-content;
            cursor: pointer;
            transition: background-color 0.3s;
            display: inline-block;
            margin-right: 10px;
          `;
          downloadBtn.onmouseenter = () =>
            (downloadBtn.style.backgroundColor = '#e7549f');
          downloadBtn.onmouseleave = () =>
            (downloadBtn.style.backgroundColor = '#ff69b4');
        }

        /* ---------- 预览图 ---------- */
        let imgCount = 0;
        for (const v of vars) {
                if (imgCount >= 20) {
        console.log(`[限制] 🚫 已经20张，跳过剩余的图片`);
        break;
    }
    
          const imgUrl = v.getAttribute('title');
          if (!imgUrl) continue;

          const tempImg = new Image();
          tempImg.src = imgUrl;

          tempImg.onload = () => {
            const { width, height } = tempImg;
            console.log(`[图尺寸] ${imgUrl} = ${width}x${height}`);

            if (width >= 200 && height >= 200) {
              container.style.cssText = `
                margin-top: 5px;
                display: flex;
                overflow: hidden;
                max-width: 1500px;
                gap: 6px;
                flex-wrap: wrap;
              `;

              const preview = document.createElement('img');
              preview.src = imgUrl;
              preview.style.cssText = `
                max-height: 200px;
                display: block;
                cursor: zoom-in;
                border-radius: 4px;
              `;
              preview.loading = 'lazy';
              preview.addEventListener('click', () =>
                createFullscreenViewer(imgUrl)
              );

              container.appendChild(preview);
            } else {
              console.log(`[图忽略] ❌ 尺寸太小 ${imgUrl}`);
            }
          };

          tempImg.onerror = () => {
            console.warn(`[加载失败] 💩 ${imgUrl}`);
          };
        }

        td.appendChild(container);
        td.appendChild(downloadBtn);
      },
      onerror(err) {
        console.error(`[第${index + 1}条] ❌ 请求失败: ${fullLink}`, err);
      },
    });
  });
})();
