// ==UserScript==
// @name         CYCU ilearning 2.0 PDF downloader
// @namespace    https://github.com/Mono0713/CYCU-ilearning-2.0-pdf-downloader
// @version      1.0.7
// @description  在中原大學 iLearning 2.0 平台自動新增「⬇️ 下載」「⬇️ 下載全部」按鈕
// @description:en  Adds “⬇️ Download” & “⬇️ Download All” to CYCU iLearning 2.0
// @license      MIT
// @match        https://i-learning.cycu.edu.tw/*
// @match        https://ilearning.cycu.edu.tw/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549495/CYCU%20ilearning%2020%20PDF%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/549495/CYCU%20ilearning%2020%20PDF%20downloader.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------- helpers ----------
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const IS_PDF_VIEW    = /\/mod\/pdfannotator\/view\.php/i.test(location.pathname + location.search);
  const IS_COURSE_VIEW = /\/course\/view\.php/i.test(location.pathname + location.search);

  const sanitize = (s = '') =>
    (s || '')
      .toString()
      .replace(/＆/g, '&')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);

  // --- 只動這一條：若被判為 php，強制用 pdf（保留你原本唯一修正）
  function withExt(basename, ext) {
    if (!ext) return basename;
    let need = `.${ext.toLowerCase()}`;
    if (ext.toLowerCase() === 'php') need = '.pdf';
    return basename.toLowerCase().endsWith(need) ? basename : (basename + need);
  }

  function extFromHeadersOrUrl(cd, url, ct) {
    if (cd) {
      let m = /filename\*\s*=\s*[^']+'[^']*'([^;]+)$/i.exec(cd);
      if (m) {
        const n = decodeURIComponent(m[1] || '');
        const mm = /\.([A-Za-z0-9]{2,5})$/.exec(n);
        if (mm) return mm[1].toLowerCase();
      }
      m = /filename\s*=\s*"?(.*?)"?\s*(?:;|$)/i.exec(cd);
      if (m) {
        const n = m[1] || '';
        const mm = /\.([A-Za-z0-9]{2,5})$/.exec(n);
        if (mm) return mm[1].toLowerCase();
      }
    }
    if (url) {
      try {
        const u = new URL(url, location.href);
        const last = decodeURIComponent((u.pathname.split('/').pop() || ''));
        let mm = /\.([A-Za-z0-9]{2,5})(?:$|\?)/.exec(last);
        if (mm) return mm[1].toLowerCase();
        const qsName = new URLSearchParams(u.search).get('filename');
        if (qsName) {
          mm = /\.([A-Za-z0-9]{2,5})$/.exec(decodeURIComponent(qsName));
          if (mm) return mm[1].toLowerCase();
        }
      } catch {}
    }
    if (ct) {
      const mp = {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'application/vnd.ms-powerpoint': 'ppt',
      };
      const t = ct.split(';')[0].trim().toLowerCase();
      if (mp[t]) return mp[t];
    }
    return '';
  }

  // --- 規範化 URL：同網域 + 修正錯誤的 /mod/pdfannotator/pluginfile.php 路徑
  function sameHost(url) {
    try {
      const u = new URL(url, location.href);
      u.protocol = location.protocol;
      u.host = location.host; // i-learning 與 ilearning 統一為當前登入主機
      return u.href;
    } catch { return url; }
  }

  function fixPluginfileUrl(url) {
    try {
      const u = new URL(url, location.href);
      // 先統一主機
      u.protocol = location.protocol;
      u.host = location.host;
      // 把錯誤路徑 /mod/pdfannotator/pluginfile.php 更正為 /pluginfile.php
      u.pathname = u.pathname.replace(/\/mod\/pdfannotator\/pluginfile\.php/i, '/pluginfile.php');
      return u.href;
    } catch {
      return url;
    }
  }

    // 取代原本的 extractPdfUrlFromHtml()
    function extractFileUrlFromHtml(html, baseUrl, exts = ['pdf','ppt','pptx']) {
        const base = new URL(baseUrl, location.href);
        const extRe = exts.map(e => e.replace('.', '')).join('|'); // pdf|ppt|pptx

        // A) 直接出現 pluginfile…(pdf|ppt|pptx)
        let m = html.match(new RegExp(`(pluginfile\\.php[^"'<>]+\\.(${extRe})[^"'<>]*)`, 'i'));
        if (m) return fixPluginfileUrl(new URL(m[1], base).href);

        // B) PDF.js viewer: viewer.html?file=<encoded URL>（若 file 指向的是上述副檔名）
        m = html.match(/viewer\.html\?file=([^"'&<>]+)/i);
        if (m) {
            try {
                const decoded = decodeURIComponent(m[1]);
                if (new RegExp(`\\.(${extRe})(?:$|[?#])`, 'i').test(decoded)) {
                    return fixPluginfileUrl(new URL(decoded, base).href);
                }
            } catch {}
        }

        // C) data-* 或 href/src 屬性裡的 (pdf|ppt|pptx) 連結（單/雙引號）
        const attrs = html.match(/(?:href|src|data-url|data-href|data-file|data-pdf)\s*=\s*(['"])(.*?)\1/gi) || [];
        for (const attr of attrs) {
            const mm = /['"](.*?)['"]/.exec(attr);
            if (!mm) continue;
            const cand = mm[1];
            if (new RegExp(`\\.(${extRe})(?:$|[?#])`, 'i').test(cand)) {
                return fixPluginfileUrl(new URL(cand, base).href);
            }
        }

        // D) JS 變數：fileUrl = "….(pdf|ppt|pptx)"
        m = html.match(new RegExp(`fileUrl\\s*[:=]\\s*['"]([^'"]+\\.(${extRe})[^'"]*)['"]`, 'i'));
        if (m) return fixPluginfileUrl(new URL(m[1], base).href);

        return '';
    }

  // ---------- filename helpers ----------
  function nameFromLink(a) {
    const inst = a.querySelector('.instancename');
    if (inst) {
      const txtNodes = Array.from(inst.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
      const t = txtNodes.map(n => n.textContent || '').join(' ');
      return sanitize(t || inst.textContent || a.textContent);
    }
    return sanitize(a.textContent);
  }

    // 取代原本的 downloadBlob()
    async function downloadBlob(url, name) {
        url = sameHost(url);

        const r = await fetch(url, { credentials: 'include', redirect: 'follow' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);

        const ct = (r.headers.get('content-type') || '').toLowerCase();

        // 直接接受三種正確 MIME
        const isPDF  = /application\/pdf/.test(ct);
        const isPPTX = /application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation/.test(ct);
        const isPPT  = /application\/vnd\.ms-powerpoint/.test(ct);

        if (!(isPDF || isPPT || isPPTX)) {
            // 不是上述三種 ⇒ 很可能是 HTML 容器或登入頁，從 HTML 解析出真正檔案直鏈（pdf|ppt|pptx）
            const html = await r.text();
            const realUrl = extractFileUrlFromHtml(html, r.url || url); // ← 同時找 pdf/ppt/pptx
            if (!realUrl) throw new Error('Not a PDF/PPT and no file link found in HTML');
            return await downloadBlob(realUrl, name); // 重新抓真正檔案
        }

        // 真正是檔案 → 正確命名並儲存
        const cd = r.headers.get('content-disposition') || '';
        const finalUrl = r.url || url;
        const ext = extFromHeadersOrUrl(cd, finalUrl, ct);
        const niceName = withExt(sanitize(name), ext);

        const blob = await r.blob();
        const obj = URL.createObjectURL(blob);
        try {
            const a = document.createElement('a');
            a.href = obj;
            a.download = niceName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } finally {
            URL.revokeObjectURL(obj);
        }
    }


  // 解析 pdfannotator/view.php → 真正的 pluginfile 直鏈
  async function resolveAnnotatorDirect(href) {
    try {
      const res = await fetch(sameHost(href), { credentials: 'include', redirect: 'follow' });
      const finalUrl = res.url || href;

      // A) 已被轉址為 pluginfile…pdf
      if (/\/pluginfile\.php\/.+\.pdf(?:$|[?#])/i.test(finalUrl)) {
        return fixPluginfileUrl(finalUrl);
      }

      // B) 從 HTML 抽出 PDF 直鏈
      const html = await res.text();
      const realUrl = extractPdfUrlFromHtml(html, finalUrl);
      if (realUrl) return fixPluginfileUrl(realUrl);
    } catch (e) {
      console.warn('[iLearn] annotator resolve failed', e);
    }
    return href; // 找不到就讓後續流程處理（downloadBlob 仍會再解析一次）
  }

  // ---------- UI: single (viewer) ----------
  const viewerTitle = () => {
    const h = $('#page-header .page-header-headings h1') || $('header h1') || $('h1');
    const t = (h && h.textContent) || document.title.replace(/\s*\|.*$/, '') || 'document';
    return sanitize(t);
  };

  async function handleSingleDownload() {
    const title = viewerTitle();

    // 先嘗試 PDF.js
    try {
      const app = (window.PDFViewerApplication || {});
      if (app && app.pdfDocument && typeof app.pdfDocument.getData === 'function') {
        const u = (app.url || app.appConfig?.defaultUrl || '');
        if (u && !String(u).startsWith('blob:')) {
          await downloadBlob(u, title);
          return;
        } else {
          const u8 = await app.pdfDocument.getData();
          const blob = new Blob([u8], { type: 'application/pdf' });
          const obj = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = obj; a.download = withExt(title, 'pdf');
          document.body.appendChild(a); a.click(); a.remove();
          URL.revokeObjectURL(obj);
          return;
        }
      }
    } catch {}

    // 從 performance 或 DOM 找到 pluginfile.pdf
    let url = '';
    try {
      const hit = performance.getEntriesByType('resource')
        .map(e => e.name).reverse()
        .find(u => /\/pluginfile\.php\/.+\.pdf(?:$|\?)/i.test(u));
      if (hit) url = hit;
    } catch {}
    if (!url) {
      const a = $('a[href*="/pluginfile.php/"][href*=".pdf"]');
      if (a) url = a.href;
    }
    if (!url) { alert('找不到本頁 PDF，請先翻頁讓檔案載入後再試一次。'); return; }

    await downloadBlob(url, title);
  }

  function mountSingleButton() {
    if (document.getElementById('ilearn-dl-one')) return;
    const btn = document.createElement('button');
    btn.id = 'ilearn-dl-one';
    btn.textContent = '⬇️ 下載';
    Object.assign(btn.style, {
      position:'fixed', right:'14px', bottom:'14px', zIndex:2147483647,
      padding:'10px 14px', background:'#0ea5e9', color:'#fff',
      border:'none', borderRadius:'10px', boxShadow:'0 6px 16px rgba(0,0,0,.2)', cursor:'pointer'
    });
    btn.addEventListener('click', () => { btn.disabled = true; handleSingleDownload().finally(()=>btn.disabled=false); }, {passive:true});
    document.documentElement.appendChild(btn);
  }

  // ---------- UI: course page bulk ----------
  function pickResourceLinks() {
    const res = $$('li.activity.resource.modtype_resource a.aalink[href*="/mod/resource/view.php?id="]');
    const pdf = $$('li.activity.modtype_pdfannotator a.aalink[href*="/mod/pdfannotator/view.php?id="]');
    return [...res, ...pdf];
  }

  async function resolveOne(a) {
    const uiName = nameFromLink(a) || 'file';

    let href = a.href;
    if (/\/mod\/pdfannotator\/view\.php/i.test(href)) {
      href = await resolveAnnotatorDirect(href);
    }
    href = sameHost(href);

    const r = await fetch(href, { credentials:'include', redirect:'follow' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const cd = r.headers.get('content-disposition') || '';
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    const finalUrl = r.url || href;

    const looksPdf =
      /application\/pdf/.test(ct) ||
      /\.pdf(?:$|[?#])/i.test(finalUrl) ||
      /\.pdf/i.test(cd);

    const ext = looksPdf ? 'pdf' : extFromHeadersOrUrl(cd, finalUrl, ct);
    return { url: finalUrl, name: withExt(uiName, ext) };
  }

  async function handleBulkDownload() {
    const links = pickResourceLinks();
    if (!links.length) { alert('這一頁沒有可下載的檔案型資源'); return; }

    // 先解析每個連結的最終 href（含 annotator → pluginfile）
    const items = await Promise.all(links.map(async (a) => {
      const name = nameFromLink(a) || 'file';
      const isAnnotator = /\/mod\/pdfannotator\/view\.php/i.test(a.href);
      let href = isAnnotator ? await resolveAnnotatorDirect(a.href) : a.href;
      href = sameHost(href);
      return { name, href };
    }));

    // 用解析後的 href 去重（避免同檔案重複）
    const seen = new Set();
    const jobs = [];
    for (const it of items) {
      const key = (it.href || '').split('#')[0];
      if (seen.has(key)) continue;
      seen.add(key);
      jobs.push(it);
    }

    for (const { href, name } of jobs) {
      try {
        await downloadBlob(href, name);
      } catch (e) {
        console.warn('下載失敗：', href, e);
      }
      await sleep(300);
    }
  }

  function mountBulkButton() {
    if (document.getElementById('ilearn-dl-all')) return;
    const btn = document.createElement('button');
    btn.id = 'ilearn-dl-all';
    btn.textContent = '⬇️ 下載全部';
    Object.assign(btn.style, {
      position:'fixed', right:'14px', bottom:'14px', zIndex:2147483647,
      padding:'10px 14px', background:'#16a34a', color:'#fff',
      border:'none', borderRadius:'10px', boxShadow:'0 6px 16px rgba(0,0,0,.2)', cursor:'pointer'
    });
    btn.addEventListener('click', () => { btn.disabled = true; handleBulkDownload().finally(()=>btn.disabled=false); }, {passive:true});
    document.documentElement.appendChild(btn);
  }

  // ---------- start ----------
  function start() {
    if (IS_PDF_VIEW) {
      if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mountSingleButton, { once:true });
      else mountSingleButton();
    } else if (IS_COURSE_VIEW) {
      if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mountBulkButton, { once:true });
      else mountBulkButton();
    }
  }
  start();
})();
