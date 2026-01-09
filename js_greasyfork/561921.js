// ==UserScript==
// @name         pfotoo 投稿原图一键下载
// @namespace    https://pfotoo.com/
// @version      0.1.0
// @description  在 pfotoo 投稿详情页一键下载原图（高清大图）
// @match        https://pfotoo.com/*
// @match        https://www.pfotoo.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @connect      pfotoo.com
// @connect      *.pfotoo.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561921/pfotoo%20%E6%8A%95%E7%A8%BF%E5%8E%9F%E5%9B%BE%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/561921/pfotoo%20%E6%8A%95%E7%A8%BF%E5%8E%9F%E5%9B%BE%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const API_ORIGIN = 'https://h5api.pfotoo.com';

  GM_addStyle(`
    #pfotoo-hd-dl-btn {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2147483647;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,.12);
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 10px 30px rgba(0,0,0,.12);
      font: 14px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
      color: #111;
      cursor: pointer;
      user-select: none;
    }
    #pfotoo-hd-dl-btn[disabled] { opacity: .6; cursor: not-allowed; }
    #pfotoo-hd-dl-toast {
      position: fixed;
      right: 16px;
      bottom: 64px;
      z-index: 2147483647;
      padding: 8px 10px;
      border-radius: 10px;
      background: rgba(0,0,0,.8);
      color: #fff;
      font: 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
      max-width: min(360px, calc(100vw - 32px));
      white-space: pre-wrap;
      display: none;
    }
  `);

  const btn = document.createElement('button');
  btn.id = 'pfotoo-hd-dl-btn';
  btn.type = 'button';
  btn.textContent = '下载原图';
  document.documentElement.appendChild(btn);

  const toastEl = document.createElement('div');
  toastEl.id = 'pfotoo-hd-dl-toast';
  document.documentElement.appendChild(toastEl);

  let busy = false;
  let toastTimer = null;

  function toast(msg, ms = 2200) {
    toastEl.textContent = String(msg ?? '');
    toastEl.style.display = 'block';
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toastEl.style.display = 'none'), ms);
  }

  function isSubmissionPage() {
    return /#\/submission\/[^/]+/.test(location.hash || '');
  }

  function getSubmissionAesId() {
    const hash = location.hash || '';
    const m = hash.match(/#\/submission\/([^/?#]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function sanitizeFileName(name) {
    const s = String(name ?? '').trim() || 'pfotoo';
    return (
      s
        .replace(/[\u0000-\u001f\u007f]/g, '')
        .replace(/[\\/:*?"<>|]/g, '_')
        .replace(/\s+/g, ' ')
        .slice(0, 120)
        .trim() || 'pfotoo'
    );
  }

  async function fetchSubmissionDetail(aesId) {
    const url = `${API_ORIGIN}/submission/getSubmissionDetail/${encodeURIComponent(aesId)}`;
    const resp = await fetch(url, { method: 'GET', cache: 'no-store', credentials: 'omit' });
    if (!resp.ok) throw new Error(`接口请求失败：${resp.status}`);
    const json = await resp.json();
    if (!json || json.code !== '200') throw new Error(json?.message || '接口返回异常');
    return json.data;
  }

  function gmDownload(url, name) {
    return new Promise((resolve, reject) => {
      if (typeof GM_download !== 'function') {
        window.open(url, '_blank', 'noopener,noreferrer');
        resolve();
        return;
      }
      GM_download({
        url,
        name,
        saveAs: false,
        onload: () => resolve(),
        ontimeout: () => reject(new Error('下载超时')),
        onerror: (e) => reject(new Error(e?.error || '下载失败')),
      });
    });
  }

  async function handleDownload() {
    if (busy) return;
    busy = true;
    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = '下载中…';

    try {
      const aesId = getSubmissionAesId();
      if (!aesId) throw new Error('未检测到投稿详情页（URL 需包含 #/submission/...）');

      const detail = await fetchSubmissionDetail(aesId);
      const materials = Array.isArray(detail?.submissionMaterialList) ? detail.submissionMaterialList : [];
      if (!materials.length) throw new Error('未找到可下载的素材');

      const base = sanitizeFileName(detail?.name || `submission_${detail?.id || aesId}`);
      let started = 0;

      for (let i = 0; i < materials.length; i++) {
        const m = materials[i] || {};
        const url = String(m.url || '').trim();
        if (!url) continue;

        const suffixRaw = String(m.suffix || '')
          .trim()
          .replace(/^\./, '');
        const ext = suffixRaw || 'jpg';
        const index = materials.length > 1 ? `_${String(i + 1).padStart(2, '0')}` : '';
        const filename = `${base}${index}.${ext}`;

        await gmDownload(url, filename);
        started++;
      }

      toast(started ? `已开始下载 ${started} 个原图文件` : '未找到可下载的原图 URL');
    } catch (e) {
      toast(`下载失败：${e?.message || e}`);
    } finally {
      btn.textContent = oldText;
      btn.disabled = false;
      busy = false;
    }
  }

  function updateBtnVisibility() {
    btn.style.display = isSubmissionPage() ? 'block' : 'none';
  }

  btn.addEventListener('click', handleDownload);
  window.addEventListener('hashchange', updateBtnVisibility, { passive: true });
  updateBtnVisibility();
})();