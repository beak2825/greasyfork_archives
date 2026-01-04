// ==UserScript==
// @name         Web File + DOM Extractor (Dark Theme, Mobile-friendly)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Extract JS, CSS, JSON, HTML, misc files and capture DOM structure. Mobile-friendly, dark theme, activation toggle via TM storage.
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554811/Web%20File%20%2B%20DOM%20Extractor%20%28Dark%20Theme%2C%20Mobile-friendly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554811/Web%20File%20%2B%20DOM%20Extractor%20%28Dark%20Theme%2C%20Mobile-friendly%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === Activation (toggle in Tampermonkey: Storage / Edit Values) ===
  const enabled = GM_getValue('enabled', true);
  if (!enabled) return;

  // === Resource storage ===
  const resources = { js: new Set(), css: new Set(), json: new Map(), misc: new Set() };

  const sanitize = name => (name || 'file').replace(/[^a-z0-9_\-\.]/gi, '_').slice(0, 160);
  const uniqueArray = iter => Array.from(new Set(Array.from(iter)));

  const blobDownload = (blobOrText, filename, type) => {
    const blob = blobOrText instanceof Blob ? blobOrText : new Blob([blobOrText], { type: type || 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // === Static extraction ===
  function extractStatic() {
    document.querySelectorAll('script[src]').forEach(s => resources.js.add(s.src));
    document.querySelectorAll('link[rel="stylesheet"]').forEach(l => resources.css.add(l.href));
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.href;
      if (!href) return;
      const ext = (href.split('?')[0].split('.').pop() || '').toLowerCase();
      if (['js','css','json','html','xml','svg','txt','php','tpl'].includes(ext)) {
        if (ext === 'js') resources.js.add(href);
        else if (ext === 'css') resources.css.add(href);
        else if (ext === 'json') resources.json.set(href, { text: null, t: Date.now() });
        else resources.misc.add(href);
      }
    });
  }

  // === Dynamic JSON capture ===
  (function hookNetwork() {
    const _fetch = window.fetch;
    window.fetch = function (...args) {
      return _fetch.apply(this, args).then(async res => {
        try {
          const url = args[0] ? (typeof args[0] === 'string' ? args[0] : args[0].url) : res?.url;
          if (url && url.toLowerCase().includes('.json')) {
            res.clone().text().then(t => resources.json.set(url, { text: t, t: Date.now() })).catch(() => resources.json.set(url, { text: null, t: Date.now() }));
          }
        } catch (e) {}
        return res;
      });
    };

    const XOpen = XMLHttpRequest.prototype.open;
    const XSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) { this._urlToWatch = url; return XOpen.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function () {
      const url = this._urlToWatch;
      const onLoadHandler = () => {
        try { if (url?.toLowerCase().includes('.json')) resources.json.set(url, { text: this.responseText || null, t: Date.now() }); } catch (e) {}
      };
      this.addEventListener('load', onLoadHandler, { once: true });
      return XSend.apply(this, arguments);
    };
  })();

  // === UI ===
  function buildUI() {
    if (document.getElementById('web-extractor-panel')) return;

    extractStatic();

    const files = {
      js: uniqueArray(resources.js),
      css: uniqueArray(resources.css),
      json: Array.from(resources.json.keys()),
      html: ['CURRENT_PAGE'],
      other: uniqueArray(resources.misc)
    };

    const container = document.createElement('div');
    container.id = 'web-extractor-panel';
    Object.assign(container.style, {
      position: 'fixed', top: '15px', right: '15px',
      width: '300px', maxHeight: '85vh', overflow: 'hidden',
      background: '#1e1e1e', border: '1px solid #555', borderRadius: '8px',
      zIndex: 2147483647, fontFamily: 'sans-serif', boxShadow: '0 6px 18px rgba(0,0,0,0.6)', color: '#eee'
    });

    // header
    const header = document.createElement('div');
    header.textContent = 'Extract Files';
    Object.assign(header.style, {
      background: '#121212', color: '#00ffcc',
      padding: '8px 10px', fontWeight: '700',
      textAlign: 'center', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
    });
    container.appendChild(header);

    // tabs
    const tabBar = document.createElement('div');
    Object.assign(tabBar.style, { display: 'flex', background: '#2b2b2b', borderBottom: '1px solid #444' });
    const tabs = ['JS', 'CSS', 'HTML', 'JSON', 'Other', 'DOM'];
    tabBar.id = 'web-extractor-tabs';

    tabs.forEach((t, i) => {
      const btn = document.createElement('button');
      btn.textContent = t;
      Object.assign(btn.style, {
        flex: '1', padding: '8px 6px', border: 'none', background: 'transparent',
        color: '#eee', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: '0.2s'
      });
      btn.addEventListener('click', () => {
        Array.from(tabBar.children).forEach(x => x.style.background = 'transparent');
        btn.style.background = '#007bff';
        btn.style.color = '#fff';
        showTab(t.toLowerCase());
      });
      tabBar.appendChild(btn);
      if (i === 0) { btn.style.background = '#007bff'; btn.style.color = '#fff'; }
    });
    container.appendChild(tabBar);

    // content area
    const content = document.createElement('div');
    Object.assign(content.style, {
      padding: '8px', overflowY: 'auto', maxHeight: '60vh', fontSize: '13px', color: '#eee'
    });
    container.appendChild(content);

    // close
    const close = document.createElement('button');
    close.textContent = 'Close';
    Object.assign(close.style, { width: '100%', padding: '8px', borderTop: '1px solid #444', background: '#333', color: '#fff', cursor: 'pointer' });
    close.addEventListener('click', () => container.remove());
    container.appendChild(close);

    document.body.appendChild(container);

    function makeDownloadLink(url, suggestedName, type) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = suggestedName || url.split('/').pop().split('?')[0] || url;
      Object.assign(a.style, { display: 'block', color: '#00ffcc', textDecoration: 'none', margin: '4px 0' });
      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (url === 'CURRENT_PAGE') { blobDownload(document.documentElement.outerHTML, sanitize(suggestedName || 'page.html'), 'text/html'); return; }
        if (type === 'json' && resources.json.has(url) && resources.json.get(url).text !== null) {
          blobDownload(resources.json.get(url).text, sanitize(suggestedName || url.split('/').pop() || 'data.json'), 'application/json');
          return;
        }
        fetch(url, { credentials: 'include' }).then(r => r.blob()).then(b => blobDownload(b, sanitize(suggestedName || 'file'))).catch(() => {});
      });
      return a;
    }

    function showTab(type) {
      content.innerHTML = '';
      if (type === 'html') {
        const dl = document.createElement('button');
        dl.textContent = 'Download Current HTML';
        Object.assign(dl.style, { width: '100%', padding: '8px', marginBottom: '6px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' });
        dl.addEventListener('click', () => blobDownload(document.documentElement.outerHTML, sanitize((document.title || 'page') + '.html'), 'text/html'));
        content.appendChild(dl);
        return;
      }
      if (type === 'dom') {
        const domBtn = document.createElement('button');
        domBtn.textContent = 'Download Full DOM JSON';
        Object.assign(domBtn.style, { width: '100%', padding: '8px', marginBottom: '6px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' });
        domBtn.addEventListener('click', () => blobDownload(JSON.stringify(nodeToJSON(document.documentElement), null, 2), sanitize((document.title || 'page') + '.json'), 'application/json'));
        content.appendChild(domBtn);
        return;
      }

      const list = (type === 'js') ? files.js : (type === 'css') ? files.css : (type === 'json') ? files.json : files.other;
      if (!list || list.length === 0) { const n = document.createElement('div'); n.innerHTML = '<i>No files found.</i>'; content.appendChild(n); return; }

      const uniq = Array.from(new Set(list)).sort();
      uniq.forEach((url, idx) => content.appendChild(makeDownloadLink(url, url.split('/').pop() || `${type}_${idx}`, type)));

      // Download All
      const allBtn = document.createElement('button');
      allBtn.textContent = `Download All ${type.toUpperCase()}`;
      Object.assign(allBtn.style, { width: '100%', padding: '8px', marginTop: '8px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' });
      allBtn.addEventListener('click', () => {
        uniq.forEach((url, i) => {
          const name = (url === 'CURRENT_PAGE') ? (document.title || 'page') + '.html' : url.split('/').pop() || `${type}_${i}`;
          if (url === 'CURRENT_PAGE') blobDownload(document.documentElement.outerHTML, sanitize(name), 'text/html');
          else if (type === 'json' && resources.json.has(url) && resources.json.get(url).text !== null) blobDownload(resources.json.get(url).text, sanitize(name), 'application/json');
          else fetch(url, { credentials: 'include' }).then(r => r.blob()).then(b => blobDownload(b, sanitize(name))).catch(()=>{});
        });
      });
      content.appendChild(allBtn);
    }

    showTab('js');
  }

  function nodeToJSON(node, depth = 0, maxDepth = 20) {
    if (!node || depth > maxDepth) return null;
    if (node.nodeType === Node.TEXT_NODE) return { type: 'text', text: node.nodeValue.trim().slice(0, 200) };
    const obj = { type: node.nodeName.toLowerCase() };
    if (node.attributes) obj.attributes = Object.fromEntries(Array.from(node.attributes).map(a => [a.name, a.value]));
    const children = [];
    node.childNodes?.forEach(ch => {
      if (ch.nodeType === Node.TEXT_NODE) {
        const txt = (ch.nodeValue || '').trim();
        if (txt) children.push({ type: 'text', text: txt.slice(0, 300) });
      } else {
        const sub = nodeToJSON(ch, depth + 1, maxDepth);
        if (sub) children.push(sub);
      }
    });
    if (children.length) obj.children = children;
    return obj;
  }

  // === Launcher button ===
  (function addLauncher() {
    if (document.getElementById('web-extractor-launcher')) return;
    const btn = document.createElement('button');
    btn.id = 'web-extractor-launcher';
    btn.textContent = 'Extract Files';
    Object.assign(btn.style, {
      position: 'fixed', top: '15px', left: '15px', zIndex: 2147483646,
      background: '#121212', color: '#00ffcc', border: 'none', borderRadius: '6px',
      padding: '10px 12px', fontSize: '14px', cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
    });
    btn.addEventListener('click', () => { extractStatic(); buildUI(); });
    document.body.appendChild(btn);
  })();

  extractStatic();

})();