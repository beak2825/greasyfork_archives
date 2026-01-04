// ==UserScript==
// @name          Video Stream Links
// @author        piompie
// @version       0.1
// @description   Gets m3u8, ts and mp4 links and lets you copy them to play with your video player of choice
// @match         *://*/*
// @grant         GM_addStyle
// @grant         GM_setClipboard
// @namespace https://greasyfork.org/users/1516341
// @downloadURL https://update.greasyfork.org/scripts/555319/Video%20Stream%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/555319/Video%20Stream%20Links.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const regex = /\.(m3u8|ts|mp4)(\?.*)?$/i;
  const isTop = window === window.top;

  function sendStreamToTop(url) {
    if (isTop) {
      handleNewStream(window.location.href, url);
    } else {
      window.top.postMessage({ type: 'stream-found', source: window.location.href, url }, '*');
    }
  }

  if (!isTop) {
    interceptNetwork(sendStreamToTop);
    return;
  }

  const streamsBySource = new Map();

  window.addEventListener('message', event => {
    if (event.data?.type === 'stream-found') {
      handleNewStream(event.data.source, event.data.url);
    }
  });

  interceptNetwork(sendStreamToTop);

  // --- UI ---
  const btn = document.createElement('div');
  btn.id = 'streamBtn';
  btn.textContent = '▶️';
  btn.style.display = 'none';
  btn.addEventListener('click', togglePanel);
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'streamPanel';
  panel.style.display = 'none';
  document.body.appendChild(panel);

  const toast = document.createElement('div');
  toast.id = 'streamToast';
  toast.textContent = 'Copied ✅';
  toast.style.display = 'none';
  document.body.appendChild(toast);

  GM_addStyle(`
    #streamBtn {
      position: fixed;
      bottom: 16px;
      right: 16px;
      font-size: 20px;
      cursor: pointer;
      z-index: 999999;
      user-select: none;
      opacity: 0.5;
      transition: opacity 0.2s ease;
    }
    #streamBtn:hover { opacity: 1; }
    #streamPanel {
      position: fixed;
      bottom: 48px;
      right: 16px;
      background: rgba(30, 30, 30, 0.92);
      color: #fff;
      border-radius: 8px;
      max-height: 70vh;
      overflow-y: auto;
      padding: 8px;
      width: 360px;
      z-index: 999999;
      font-family: sans-serif;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }
    .source-group { margin-bottom: 8px; }
    .source-title {
      font-weight: bold;
      margin-bottom: 4px;
      border-bottom: 1px solid #555;
      padding-bottom: 3px;
      font-size: 13px;
    }
    .stream-group { margin: 3px 0; }
    .group-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #333;
      padding: 3px 5px;
      border-radius: 4px;
    }
    .group-header:hover { background: #444; }
    .group-name { flex: 1; cursor: pointer; }
    .group-toggle {
      cursor: pointer;
      margin-left: 6px;
      color: #aaa;
    }
    .group-toggle:hover { color: #fff; }
    .stream-list { display: none; margin-left: 10px; }
    .stream-item {
      color: #aaa;
      font-size: 12px;
      margin: 2px 0;
      cursor: pointer;
      word-break: break-all;
    }
    .stream-item:hover { color: #fff; }

    #streamToast {
      position: fixed;
      bottom: 20px;
      right: 60px;
      background: rgba(40, 40, 40, 0.9);
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-family: sans-serif;
      font-size: 13px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      z-index: 1000000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  `);

  let toastTimer;
  function showToast() {
    clearTimeout(toastTimer);
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => (toast.style.display = 'none'), 300);
    }, 1500);
  }

  function interceptNetwork(callback) {
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
      const url = args[0];
      if (typeof url === 'string' && regex.test(url)) callback(url);
      return origFetch.apply(this, args);
    };
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (typeof url === 'string' && regex.test(url)) callback(url);
      return origOpen.apply(this, arguments);
    };
  }

  function handleNewStream(sourceUrl, url) {
    const origin = new URL(sourceUrl).hostname || 'desconocido';
    let byFile = streamsBySource.get(origin);
    if (!byFile) {
      byFile = new Map();
      streamsBySource.set(origin, byFile);
    }
    const filename = url.split('/').pop().split('?')[0];
    if (!byFile.has(filename)) byFile.set(filename, []);
    byFile.get(filename).push(url);

    btn.style.display = 'block';
  }

  function togglePanel() {
    if (panel.style.display === 'none') {
      renderPanel();
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  }

  function copyAndToast(text) {
    GM_setClipboard(text);
    showToast();
  }

  function renderPanel() {
    panel.innerHTML = '';
    if (streamsBySource.size === 0) {
      btn.style.display = 'none';
      return;
    }

    streamsBySource.forEach((byFile, origin) => {
      const srcGroup = document.createElement('div');
      srcGroup.className = 'source-group';

      const title = document.createElement('div');
      title.className = 'source-title';
      title.textContent = origin;
      srcGroup.appendChild(title);

      byFile.forEach((urls, filename) => {
        const group = document.createElement('div');
        group.className = 'stream-group';

        const header = document.createElement('div');
        header.className = 'group-header';

        const name = document.createElement('div');
        name.className = 'group-name';
        name.textContent = `${filename} (${urls.length})`;
        name.addEventListener('click', () => copyAndToast(urls[urls.length - 1]));

        const toggle = document.createElement('div');
        toggle.className = 'group-toggle';
        toggle.textContent = '▶';
        toggle.addEventListener('click', e => {
          e.stopPropagation();
          const list = group.querySelector('.stream-list');
          const open = list.style.display === 'block';
          list.style.display = open ? 'none' : 'block';
          toggle.textContent = open ? '▶' : '▼';
        });

        header.appendChild(name);
        header.appendChild(toggle);
        group.appendChild(header);

        const list = document.createElement('div');
        list.className = 'stream-list';
        urls.forEach(url => {
          const item = document.createElement('div');
          item.className = 'stream-item';
          item.textContent = url;
          item.addEventListener('click', () => copyAndToast(url));
          list.appendChild(item);
        });
        group.appendChild(list);
        srcGroup.appendChild(group);
      });

      panel.appendChild(srcGroup);
    });
  }
})();
