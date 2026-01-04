// ==UserScript==
// @name         Pixiv作品发送到Eagle
// @namespace    https://github.com/yourusername/pixiv4eagle
// @version      1.0.0
// @description  在Pixiv作品页添加按钮，一键将所有图片、作品链接与标签发送到Eagle
// @author       ikamusume7
// @match        https://www.pixiv.net/artworks/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      pixiv.net
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555405/Pixiv%E4%BD%9C%E5%93%81%E5%8F%91%E9%80%81%E5%88%B0Eagle.user.js
// @updateURL https://update.greasyfork.org/scripts/555405/Pixiv%E4%BD%9C%E5%93%81%E5%8F%91%E9%80%81%E5%88%B0Eagle.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const EAGLE_ENDPOINT = 'http://localhost:41595/api/item/addFromURL';
  const BTN_ID = 'pixiv-to-eagle-btn';

  function log(...args){ console.log('[Pixiv->Eagle]', ...args); }

  function gmFetch(url, opts = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: opts.method || 'GET',
        url,
        headers: opts.headers || (opts.json ? { 'Content-Type': 'application/json' } : {}),
        data: opts.body || (opts.json ? JSON.stringify(opts.json) : undefined),
        responseType: 'json',
        onload: res => {
          if (res.status >= 200 && res.status < 300) {
            resolve(res.response || res);
          } else {
            reject(new Error('Request failed ' + res.status + ' ' + res.finalUrl));
          }
        },
        onerror: err => reject(err)
      });
    });
  }

  function createButton() {
    if (document.getElementById(BTN_ID)) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.textContent = '发送到Eagle';
    btn.title = '将本作品所有原图与标签发送到Eagle';
    btn.type = 'button';
    btn.addEventListener('click', onClick);
    document.body.appendChild(btn);
  }

  function injectStyle() {
    GM_addStyle(`
      #${BTN_ID} { position: fixed; top: 90px; right: 20px; z-index: 99999; background: #0096fa; color: #fff; border: none; border-radius: 6px; padding: 10px 14px; font-size: 14px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.25); }
      #${BTN_ID}:hover { background: #0073c2; }
      #${BTN_ID}.loading { background: #ffa500; cursor: progress; }
      #${BTN_ID}.success { background: #34c759; }
      #${BTN_ID}.error { background: #ff3b30; }
    `);
  }

  function getIllustId() {
    const m = location.pathname.match(/\/artworks\/(\d+)/);
    return m ? m[1] : null;
  }

  async function fetchIllustMeta(id) {
    const url = `https://www.pixiv.net/ajax/illust/${id}`;
    const json = await gmFetch(url);
    return json.body;
  }

  async function fetchIllustPages(id) {
    const url = `https://www.pixiv.net/ajax/illust/${id}/pages`;
    const json = await gmFetch(url);
    return json.body; // array of {urls:{original,small,thumb_mini}} etc
  }

  async function fetchUgoiraMeta(id) {
    const url = `https://www.pixiv.net/ajax/illust/${id}/ugoira/meta`;
    const json = await gmFetch(url);
    return json.body; // has originalSrc(zip), src (mp4?)
  }

  function buildTags(meta) {
    const tags = (meta?.tags?.tags || []).map(t => t.tag).filter(Boolean);
    // 追加来源
    tags.push('Pixiv');
    if (meta?.userName) tags.push('Artist:' + meta.userName);
    if (meta?.illustType === 2) tags.push('Ugoira');
    return Array.from(new Set(tags));
  }

  async function onClick(e) {
    const btn = e.currentTarget;
    if (btn.classList.contains('loading')) return;
    btn.classList.remove('success','error');
    btn.classList.add('loading');
    btn.textContent = '处理中...';

    const id = getIllustId();
    if (!id) { fail(btn, '未识别ID'); return; }

    try {
      const meta = await fetchIllustMeta(id);
      const pages = await fetchIllustPages(id);
      let urls = pages.map(p => p.urls.original);

      // 处理Ugoira (动图zip)
      if (meta.illustType === 2) {
        try {
          const ugoira = await fetchUgoiraMeta(id);
          if (ugoira.originalSrc) urls.unshift(ugoira.originalSrc); // 将zip放前面
        } catch (err) { log('Ugoira元数据获取失败', err); }
      }

      urls = urls.filter(Boolean);
      if (!urls.length) throw new Error('未获取到图片链接');

      const tags = buildTags(meta);
      const website = location.href;
      const annotation = `${meta.title || ''}\n作者: ${meta.userName || ''}\nID: ${id}\n链接: ${website}`;

      for (const url of urls) {
        const payload = { url, name: meta.title, website, tags, annotation };
        log('准备发送到Eagle', payload);
        await gmFetch(EAGLE_ENDPOINT, { method: 'POST', json: payload });
      }
      btn.classList.remove('loading');
      btn.classList.add('success');
      btn.textContent = '已发送 (' + urls.length + ')';
      log('发送成功');
    } catch (err) {
      fail(btn, err.message || String(err));
    }
  }

  function fail(btn, msg) {
    btn.classList.remove('loading','success');
    btn.classList.add('error');
    btn.textContent = '失败，重试';
    log('错误:', msg);
  }

  async function init() {
    injectStyle();
    createButton();
    // 可选：等待主要容器出现后再允许点击（略）
  }

  // 页面可能是SPA，监听path变化
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      if (/\/artworks\/(\d+)/.test(lastPath)) {
        createButton();
      } else {
        const btn = document.getElementById(BTN_ID);
        if (btn) btn.remove();
      }
    }
  }, 1000);

  init();
})();
