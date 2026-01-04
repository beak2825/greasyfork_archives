// ==UserScript==
// @name         NodeSeek 图片上传
// @version      1.0.0
// @license      MIT
// @description  在 Nodeseek编辑器旁新增上传图标，上传至 skyimg图床并将返回的 Markdown链接自动插入编辑器。
// @author       skyimg.net
// @connect      skyimg.net
// @match        https://www.nodeseek.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/1444254
// @downloadURL https://update.greasyfork.org/scripts/554993/NodeSeek%20%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/554993/NodeSeek%20%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_SELECTOR = 'span.toolbar-item.i-icon.i-icon-pic:not(.tm-upload-btn)';
  const UPLOAD_API_URL = 'https://skyimg.net/api/upload';
  const CONFIG_KEYS = {
    convertWebp: 'tm_nodeseek_upload_webp',
    syncToken: 'tm_nodeseek_upload_token',
  };

  const cfg = {
    convertWebp: GM_getValue(CONFIG_KEYS.convertWebp, true),
    syncToken: GM_getValue(CONFIG_KEYS.syncToken, ''),
  };
  let currentClickOrigin = null;

  GM_registerMenuCommand('打开图片上传设置', openSettingsDialog);

  injectStyle(`
    .tm-upload-btn {
      display: inline-flex; align-items: center; justify-content: center;
      margin-left: 6px; cursor: pointer; user-select: none; color: inherit;
    }
    .tm-upload-btn svg { pointer-events: none; }
    .tm-toast {
      position: fixed; right: 16px; bottom: 16px;
      background: rgba(0,0,0,0.8); color: #fff; padding: 10px 16px;
      border-radius: 6px; font-size: 14px; z-index: 99999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .tm-settings-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 99998;
    }
    .tm-settings-dialog {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #fff; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      width: 90%; max-width: 400px; padding: 20px; color: #333;
    }
    .tm-settings-dialog h3 { margin: 0 0 20px; font-size: 18px; }
    .tm-settings-dialog .form-group { margin-bottom: 15px; }
    .tm-settings-dialog label { display: block; margin-bottom: 5px; font-weight: bold; }
    .tm-settings-dialog input[type="text"] { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .tm-settings-dialog .actions { text-align: right; margin-top: 20px; }
    .tm-settings-dialog button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; }
    .tm-settings-dialog .btn-save { background: #007bff; color: white; }
    .tm-settings-dialog .btn-cancel { background: #f0f0f0; }
  `);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  fileInput.addEventListener('change', async () => {
    const files = Array.from(fileInput.files || []);
    fileInput.value = '';
    if (!files.length) return;

    const toast = showToast(`Uploading ${files.length} image(s)...`);
    try {
      const responses = await Promise.all(files.map(file => uploadSingleImage(file)));

      const urls = responses.map(r => {
          const data = Array.isArray(r) ? r[0] : r;
          return data?.url;
      }).filter(Boolean);

      if (urls.length === 0 && files.length > 0) {
          throw new Error('No valid URLs returned from API');
      }

      const markdown = urls.map(u => `![image](${u})`).join('\n') + '\n';

      const inserted = insertIntoCodeMirror(currentClickOrigin, markdown);
      await copyToClipboard(urls.join('\n'));

      toast.update(inserted
        ? `Uploaded ${urls.length}/${files.length}. Inserted & Copied.`
        : `Uploaded ${urls.length}/${files.length}. Copied (Editor not found).`);
      setTimeout(() => toast.close(), 3000);
    } catch (err) {
      console.error('[TM-Upload] Upload failed:', err);
      toast.update(`Upload failed: ${err.message}. See console.`);
      setTimeout(() => toast.close(), 5000);
    } finally {
      currentClickOrigin = null;
    }
  });

  const observer = new MutationObserver(debounce(scanAndInject, 200));
  const container = document.querySelector('#app, body');
  observer.observe(container, { childList: true, subtree: true });
  scanAndInject();

  function scanAndInject() {
    document.querySelectorAll(TARGET_SELECTOR).forEach(el => {
      if (el.nextElementSibling?.classList.contains('tm-upload-btn')) return;
      const btn = createUploadBtn();
      el.insertAdjacentElement('afterend', btn);
      btn.addEventListener('click', (ev) => {
        if (ev.shiftKey) {
          ev.preventDefault();
          openSettingsDialog();
          return;
        }
        currentClickOrigin = el;
        fileInput.click();
      });
    });
  }

  function createUploadBtn() {
    const btn = document.createElement('span');
    btn.className = 'tm-upload-btn toolbar-item i-icon';
    btn.title = 'Upload Image (Shift+Click for Settings)';
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 30v8a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M24 8v24" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 16l8-8 8 8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    return btn;
  }

  function uploadSingleImage(file) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file, file.name || 'image');

      const headers = {};
      if (cfg.syncToken) headers['x-sync-token'] = cfg.syncToken;

      const url = cfg.convertWebp ? `${UPLOAD_API_URL}?webp=true` : UPLOAD_API_URL;

      GM_xmlhttpRequest({
        method: 'POST', url: url, data: formData, headers: headers,
        responseType: 'json', timeout: 120000,
        onload: (resp) => {
          if (resp.status >= 200 && resp.status < 300) {
            resolve(resp.response);
          } else {
            const errorMsg = resp.response?.error || resp.responseText || 'Unknown error';
            reject(new Error(`HTTP ${resp.status}: ${errorMsg}`));
          }
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Timeout')),
      });
    });
  }

  function insertIntoCodeMirror(originEl, text) {
    try {
      const editorWrapper = originEl?.closest('.editor, .md-editor')?.querySelector('.CodeMirror');
      if (editorWrapper && editorWrapper.CodeMirror) {
        editorWrapper.CodeMirror.focus();
        editorWrapper.CodeMirror.replaceSelection(text);
        return true;
      }
      const focused = document.querySelector('.CodeMirror-focused');
      if (focused && focused.CodeMirror) {
        focused.CodeMirror.replaceSelection(text);
        return true;
      }
    } catch (e) { console.error("[TM-Upload] CM insert failed:", e); }
    return false;
  }

  function openSettingsDialog() {
    document.querySelector('.tm-settings-overlay')?.remove();
    const dialogHtml = `
      <div class="tm-settings-overlay">
        <div class="tm-settings-dialog">
          <h3>Image Upload Settings</h3>
          <div class="form-group">
            <label for="tm-token-input">x-sync-token (optional)</label>
            <input type="text" id="tm-token-input" placeholder="Enter your token">
          </div>
          <div class="form-group">
            <label><input type="checkbox" id="tm-webp-toggle"> Convert to WebP</label>
          </div>
          <div class="actions">
            <button class="btn-cancel">Cancel</button>
            <button class="btn-save">Save</button>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', dialogHtml);
    const overlay = document.querySelector('.tm-settings-overlay');
    const tokenInput = document.getElementById('tm-token-input');
    const webpToggle = document.getElementById('tm-webp-toggle');

    tokenInput.value = cfg.syncToken;
    webpToggle.checked = cfg.convertWebp;

    const close = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('.btn-cancel').addEventListener('click', close);
    overlay.querySelector('.btn-save').addEventListener('click', () => {
      cfg.syncToken = tokenInput.value.trim();
      cfg.convertWebp = webpToggle.checked;
      GM_setValue(CONFIG_KEYS.syncToken, cfg.syncToken);
      GM_setValue(CONFIG_KEYS.convertWebp, cfg.convertWebp);
      showToast('Settings saved.');
      close();
    });
  }

  function showToast(msg) {
    let el = document.querySelector('.tm-toast');
    if (el) el.remove();
    el = document.createElement('div');
    el.className = 'tm-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    const close = () => el?.remove();
    setTimeout(close, 4000);
    return { update: (txt) => { el.textContent = txt; }, close: close };
  }

  function copyToClipboard(text) {
    return new Promise((resolve) => {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text, 'text'); resolve(true);
        } else if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => resolve(true), () => resolve(false));
        } else {
            resolve(false);
        }
    });
  }

  function injectStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
})();