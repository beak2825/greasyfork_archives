// ==UserScript==
// @name         LLMs.txt Detector
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  检测 llms.txt；空文件 & text/html 忽略；无图标，弹出带动画
// @author       TinsFox
// @match        *://*/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554714/LLMstxt%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/554714/LLMstxt%20Detector.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const filesToCheck = [
    'llms.txt',
    'llms-full.txt',
    'LLMS.txt',
    'LLMS-FULL.txt',
    '.well-known/llms.txt',
    '.well-known/llms-full.txt'
  ];
  const base = location.origin.replace(/\/$/, '');

  const toast = m => {
    const d = document.createElement('div');
    d.textContent = m;
    d.style = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#111;color:#fff;padding:8px 14px;border-radius:6px;font-size:14px;z-index:99999;transition:.2s;opacity:0`;
    document.body.appendChild(d);
    requestAnimationFrame(() => d.style.opacity = 1);
    setTimeout(() => (d.style.opacity = 0, setTimeout(() => d.remove(), 200)), 1500);
  };

  /* ---------- 带动画的卡片 ---------- */
  let panel = null;

  const createPanel = found => {
    if (panel) panel.remove();

    const p = document.createElement('div');
    p.id = 'llms-panel-' + Math.random().toString(36).slice(2, 8);
    p.style = `position:fixed;bottom:20px;right:20px;width:340px;background:#fff;border:2px solid #007cba;border-radius:8px;padding:12px;box-shadow:0 4px 12px rgba(0,0,0,.15);font:14px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;z-index:10000;opacity:0;transform:translateY(8px);transition:opacity .3s ease,transform .3s ease`;
    document.body.appendChild(p);
    panel = p;

    p.innerHTML = `
      <div style="margin-bottom:10px;font-weight:bold;color:#333">🔍 LLMs.txt 检测结果
        <button onclick="closePanel()" style="float:right;background:#f0f0f0;border:none;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:12px">×</button>
      </div>
      <div style="margin-bottom:8px">✅ 找到 ${found.length} 个文件：</div>
      ${found.map(r => `
        <div class="file-row" style="display:flex;align-items:center;margin:6px 0;padding:6px;background:#e8f5e8;border-radius:4px">
          <div style="flex:1">
            <a href="${r.url}" target="_blank" style="color:#2d7d2d;text-decoration:none">📄 ${r.file}</a>
            <div style="font-size:11px;color:#666;margin-top:2px">状态 ${r.status} · 长度 ${r.len ?? '-'} · 类型 ${r.mime ?? '-'}</div>
          </div>
          <button data-url="${r.url}" class="copy-btn" style="margin-left:6px;background:#007cba;color:#fff;border:none;padding:4px 8px;border-radius:4px;font-size:12px;cursor:pointer;display:none">复制</button>
        </div>`).join('')}`;

    /* 事件绑定 */
    p.querySelectorAll('.file-row').forEach(row => {
      const btn = row.querySelector('.copy-btn');
      row.addEventListener('mouseenter', () => btn.style.display = 'inline-block');
      row.addEventListener('mouseleave', () => btn.style.display = 'none');
      btn.addEventListener('click', e => {
        e.preventDefault();
        navigator.clipboard.writeText(btn.dataset.url).then(() => toast('已复制'));
      });
    });

    /* 入场动画 */
    requestAnimationFrame(() => {
      p.style.opacity = '1';
      p.style.transform = 'translateY(0)';
    });

    /* ESC 关闭 */
    const escClose = e => {
      if (e.key === 'Escape') closePanel();
    };
    document.addEventListener('keydown', escClose);
    p._escClose = escClose;
  };

  const closePanel = () => {
    if (!panel) return;
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(8px)';
    setTimeout(() => {
      document.removeEventListener('keydown', panel._escClose);
      panel.remove();
      panel = null;
    }, 300);
  };

  const check = f => new Promise(r => {
    const u = `${base}/${f.replace(/^\//, '')}`;
    const cb = (ok, st, len, mime) => {
      const reallyOk = ok && (len > 0) && !mime.includes('text/html');
      r({file: f, url: u, found: reallyOk, status: st, len, mime});
    };
    if (typeof GM_xmlhttpRequest !== 'undefined') {
      GM_xmlhttpRequest({
        method: 'HEAD',
        url: u,
        onload: x => cb(x.status >= 200 && x.status < 300, x.status,
          parseInt(x.responseHeaders.match(/content-length:\s*(\d+)/i)?.[1] || 0, 10),
          x.responseHeaders.match(/content-type:\s*([^;\r\n]+)/i)?.[1].trim() ?? ''),
        onerror: x => cb(false, x.status || 'error', 0, '')
      });
    } else {
      fetch(u, {method: 'HEAD'})
        .then(x => {
          const len = parseInt(x.headers.get('content-length') || 0, 10);
          const mime = x.headers.get('content-type')?.split(';')[0].trim() || '';
          cb(x.ok, x.status, len, mime);
        })
        .catch(() => cb(false, 'error', 0, ''));
    }
  });

  const run = () => Promise.all(filesToCheck.map(check)).then(res => {
    const found = res.filter(r => r.found);
    if (found.length) createPanel(found);
  });

  document.addEventListener('keydown', e => { if (e.ctrlKey && e.shiftKey && e.key === 'L') { e.preventDefault(); run(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 1000)); else setTimeout(run, 1000);
})();
