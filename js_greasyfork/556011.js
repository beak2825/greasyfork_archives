// Source file: /mnt/data/Valentines Firefly — Comments & Dashboard.js
// ==UserScript==
// @name         Valentines Firefly — Comments & Dashboard (with images, composer preview fix)
// @namespace    https://valentines.fireflycloud.net/
// @version      1.3
// @license      MIT
// @description  Add personal comments tied to /set-tasks/<id> links and manage them in a dashboard. Now supports saving images per comment and shows previews in the composer; allows saving comments that only contain images.
// @match        https://valentines.fireflycloud.net/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556011/Valentines%20Firefly%20%E2%80%94%20Comments%20%20Dashboard%20%28with%20images%2C%20composer%20preview%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556011/Valentines%20Firefly%20%E2%80%94%20Comments%20%20Dashboard%20%28with%20images%2C%20composer%20preview%20fix%29.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  /* ---------- Storage helpers (modern GM.* + fallbacks) ---------- */
  async function gmGet(key, defaultValue) {
    try {
      if (typeof GM !== 'undefined' && GM.getValue) {
        const val = await GM.getValue(key);
        return val === undefined ? defaultValue : val;
      }
      if (typeof GM_getValue !== 'undefined') {
        const val = GM_getValue(key);
        return val === undefined ? defaultValue : val;
      }
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      console.error('gmGet error', e);
      return defaultValue;
    }
  }

  async function gmSet(key, value) {
    try {
      if (typeof GM !== 'undefined' && GM.setValue) {
        await GM.setValue(key, value);
        return;
      }
      if (typeof GM_setValue !== 'undefined') {
        GM_setValue(key, value);
        return;
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('gmSet error', e);
    }
  }

  async function gmDelete(key) {
    try {
      if (typeof GM !== 'undefined' && GM.deleteValue) {
        await GM.deleteValue(key);
        return;
      }
      if (typeof GM_deleteValue !== 'undefined') {
        GM_deleteValue(key);
        return;
      }
      localStorage.removeItem(key);
    } catch (e) {
      console.error('gmDelete error', e);
    }
  }

  /* ---------- Data model ---------- */
  const STORAGE_KEY = 'vf_comments_v1';

  async function loadAllComments() {
    const data = await gmGet(STORAGE_KEY, null);
    return Array.isArray(data) ? data : [];
  }

  async function saveAllComments(arr) {
    await gmSet(STORAGE_KEY, arr);
  }

  function makeId() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  }

  async function addComment(url, title, text, images = []) {
    const all = await loadAllComments();
    const item = {
      id: makeId(),
      url,
      title: title || document.title || url,
      text,
      images: Array.isArray(images) ? images : [], // images as data URLs
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    all.unshift(item);
    await saveAllComments(all);
    return item;
  }

  async function updateComment(id, newText, newTitle, newImages) {
    const all = await loadAllComments();
    const idx = all.findIndex(it => it.id === id);
    if (idx === -1) return null;
    all[idx].text = newText;
    if (newTitle !== undefined) all[idx].title = newTitle;
    if (Array.isArray(newImages)) all[idx].images = newImages;
    all[idx].updatedAt = new Date().toISOString();
    await saveAllComments(all);
    return all[idx];
  }

  async function appendImagesToComment(id, imagesToAdd) {
    const all = await loadAllComments();
    const idx = all.findIndex(it => it.id === id);
    if (idx === -1) return null;
    all[idx].images = all[idx].images || [];
    all[idx].images.push(...imagesToAdd);
    all[idx].updatedAt = new Date().toISOString();
    await saveAllComments(all);
    return all[idx];
  }

  async function deleteImageFromComment(id, imageIndex) {
    const all = await loadAllComments();
    const idx = all.findIndex(it => it.id === id);
    if (idx === -1) return null;
    if (!Array.isArray(all[idx].images)) return all[idx];
    all[idx].images.splice(imageIndex, 1);
    all[idx].updatedAt = new Date().toISOString();
    await saveAllComments(all);
    return all[idx];
  }

  async function deleteComment(id) {
    const all = await loadAllComments();
    const filtered = all.filter(it => it.id !== id);
    await saveAllComments(filtered);
    return filtered;
  }

  /* ---------- Utilities ---------- */
  function isSetTasksUrl(href) {
    try {
      const u = new URL(href);
      return /^\/set-tasks\/\d+\/?$/.test(u.pathname);
    } catch (e) {
      return false;
    }
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function readFilesAsDataURLs(files) {
    // returns Promise<string[]> of data URLs
    const arr = Array.from(files || []);
    return Promise.all(arr.map(f => new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(new Error('File read error'));
      r.readAsDataURL(f);
    })));
  }

  function downloadDataUrl(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || 'image';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /* ---------- State to prevent duplicates ---------- */
  let modalOpen = false;
  let activeModalType = null; // 'dashboard' or 'perUrl'
  let currentBackdrop = null;
  let floatingButtons = { addBtn: null, dashBtn: null };

  /* ---------- Styles including Medium Gemini-style glow ---------- */
  GM_addStyle(`
  /* Base floating buttons */
  .vf-floating-btn {
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 99999;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: linear-gradient(180deg,#ff7aa2,#ff6a88);
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    color: white;
    font-weight: 700;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    user-select:none;
    transition: box-shadow .18s, transform .12s;
  }
  .vf-floating-btn:hover { transform: translateY(-3px); }

  .vf-floating-dashboard {
    position: fixed;
    right: 18px;
    bottom: 86px;
    z-index: 99999;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: #444;
    color: #fff;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    transition: box-shadow .18s, transform .12s;
  }
  .vf-floating-dashboard:hover { transform: translateY(-2px); }

  /* Glow (Medium Gemini-style) */
  .vf-glow-medium {
    /* soft inner highlight + diffused outer purple glow */
    box-shadow:
      0 2px 8px rgba(124,58,237,0.35),
      0 6px 20px rgba(124,58,237,0.22),
      0 0 30px rgba(124,58,237,0.14);
    outline: 2px solid rgba(124,58,237,0.12);
  }

  /* Modal/backdrop */
  .vf-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 99998;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .vf-modal {
    width: min(920px, 96%);
    max-height: 86vh;
    overflow: auto;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    padding: 16px;
    z-index: 99999;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    position: relative;
  }
  .vf-modal h2 { margin: 0 0 8px 0; font-size: 18px; }

  /* Top-right X for dashboard */
  .vf-modal .vf-close-x {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    border: none;
    background: transparent;
    font-size: 18px;
    color: #666;
  }
  .vf-modal .vf-close-x:hover { color: #222; background: rgba(0,0,0,0.04); }

  /* Other UI */
  .vf-row { display:flex; gap:8px; margin-bottom:8px; }
  .vf-modal textarea { width: 100%; min-height:110px; padding:8px; border-radius:8px; border:1px solid #ddd; resize:vertical; font-family: inherit; }
  .vf-list { margin-top:8px; display:flex; flex-direction:column; gap:8px; }
  .vf-item { border:1px solid #eee; padding:8px; border-radius:8px; background:#fafafa; }
  .vf-item .meta { font-size:12px; color:#666; margin-bottom:6px; display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; }
  .vf-item .controls button { margin-right:6px; }
  .vf-btn { padding:8px 12px; border-radius:8px; border:none; cursor:pointer; }
  .vf-btn-primary { background: #2563eb; color:white; }
  .vf-btn-ghost { background: transparent; border:1px solid #ddd; }
  .vf-small { padding:6px 8px; font-size:13px; }

  /* image thumbnails */
  .vf-thumb-row { display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; }
  .vf-thumb { width:96px; height:96px; border-radius:8px; background:#fff; border:1px solid #eee; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; }
  .vf-thumb img { max-width:100%; max-height:100%; display:block; }
  .vf-thumb .vf-thumb-actions { position:absolute; bottom:4px; left:4px; right:4px; display:flex; gap:4px; justify-content:center; }
  .vf-thumb .vf-thumb-actions button { padding:4px 6px; font-size:11px; border-radius:6px; }

  /* composer preview area */
  .vf-compose-preview { margin-top:8px; border:1px dashed #eee; padding:8px; border-radius:8px; background:#fff; }
  `);

  /* ---------- Floating buttons creation ---------- */
  function createFloatingButtons(onAddClick, onDashboardClick, countForThisUrl) {
    const addBtn = document.createElement('div');
    addBtn.className = 'vf-floating-btn';
    addBtn.title = 'Add / view comments for this link';
    addBtn.innerHTML = '&#9998;'; // pencil icon

    const dashBtn = document.createElement('div');
    dashBtn.className = 'vf-floating-dashboard';
    dashBtn.title = 'Open comments dashboard';
    dashBtn.innerHTML = '&#9776;'; // menu icon

    // small badge with per-url count
    if (countForThisUrl && countForThisUrl > 0) {
      const badge = document.createElement('div');
      badge.style.position = 'absolute';
      badge.style.top = '-6px';
      badge.style.right = '-6px';
      badge.style.minWidth = '20px';
      badge.style.height = '20px';
      badge.style.padding = '0 6px';
      badge.style.borderRadius = '999px';
      badge.style.background = '#111';
      badge.style.color = '#fff';
      badge.style.fontSize = '12px';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.innerText = String(countForThisUrl);
      addBtn.style.position = 'fixed';
      addBtn.appendChild(badge);
    }

    // click handlers: respect modalOpen state to prevent duplicates
    addBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (modalOpen) return; // do nothing while any modal is open
      onAddClick();
    });

    dashBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (modalOpen) return; // do nothing while any modal is open
      onDashboardClick();
    });

    document.body.appendChild(addBtn);
    document.body.appendChild(dashBtn);

    return { addBtn, dashBtn };
  }

  /* ---------- Modal helper (single place to create and track) ---------- */
  function showModal({ htmlContent, onCloseCallback, modalType, addCloseX = false, onBackdropClickClose = true }) {
    // create backdrop and modal
    const backdrop = document.createElement('div');
    backdrop.className = 'vf-modal-backdrop';
    const modal = document.createElement('div');
    modal.className = 'vf-modal';
    modal.innerHTML = htmlContent;

    if (addCloseX) {
      const x = document.createElement('button');
      x.className = 'vf-close-x';
      x.innerHTML = '&#10005;'; // X
      x.title = 'Close';
      modal.appendChild(x);
      x.addEventListener('click', () => {
        close();
      });
    }

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // set global tracking
    modalOpen = true;
    activeModalType = modalType;
    currentBackdrop = backdrop;

    function close() {
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      modalOpen = false;
      activeModalType = null;
      currentBackdrop = null;
      if (typeof onCloseCallback === 'function') onCloseCallback();
    }

    // backdrop click closes when clicking outside modal
    if (onBackdropClickClose) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) close();
      });
    }

    return { modal, close, backdrop };
  }

  /* ---------- Per-URL modal (composer preview + allow image-only comments) ---------- */
  async function openPerUrlModal(url) {
    const all = await loadAllComments();
    const entries = all.filter(it => it.url === url);

    const html = `
      <h2>Comments for this link</h2>
      <div style="margin-bottom:8px;color:#444;font-size:13px;">${url}</div>
      <div class="vf-row">
        <input id="vf-title" placeholder="Optional title (eg. task name)" style="flex:1;padding:8px;border-radius:8px;border:1px solid #ddd;" />
        <button id="vf-close-internal" class="vf-btn vf-btn-ghost vf-small">Close</button>
      </div>
      <textarea id="vf-text" placeholder="Type a personal comment for this exact link..."></textarea>
      <div style="margin-top:6px;display:flex;gap:8px;align-items:center;">
        <button id="vf-add" class="vf-btn vf-btn-primary">Add comment</button>
        <label class="vf-btn vf-btn-ghost" style="display:inline-block;cursor:pointer;">
          Attach images
          <input id="vf-image-files" type="file" accept="image/*" multiple style="display:none" />
        </label>
        <button id="vf-export" class="vf-btn vf-btn-ghost">Export all</button>
        <label class="vf-btn vf-btn-ghost" style="display:inline-block;cursor:pointer;">
          Import
          <input id="vf-import-file" type="file" accept="application/json" style="display:none" />
        </label>
      </div>

      <!-- Composer preview area for attached images (new) -->
      <div id="vf-compose-preview" class="vf-compose-preview" style="display:none;">
        <strong>Attached images (preview)</strong>
        <div id="vf-compose-thumbs" class="vf-thumb-row"></div>
      </div>

      <hr style="margin:12px 0;" />
      <div>
        <strong>Existing comments for this URL (${entries.length})</strong>
        <div class="vf-list" id="vf-list">
          ${entries.map(it => `
            <div class="vf-item" data-id="${it.id}">
              <div class="meta">
                <div><strong>${escapeHtml(it.title || '(no title)')}</strong> — <span style="font-size:12px;color:#666;">${new Date(it.createdAt).toLocaleString()}</span></div>
                <div style="text-align:right">
                  <span style="font-size:12px;color:#888;">Updated ${new Date(it.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              <div class="body" style="white-space:pre-wrap">${escapeHtml(it.text)}</div>
              ${renderThumbnailsHtml(it.images)}
              <div class="controls" style="margin-top:8px">
                <button class="vf-edit vf-btn vf-small">Edit</button>
                <button class="vf-delete vf-btn vf-small">Delete</button>
                <button class="vf-copy vf-btn vf-small">Copy</button>
                <label class="vf-btn vf-btn-ghost vf-small" style="display:inline-block;cursor:pointer;">
                  Attach image
                  <input class="vf-attach-file" type="file" accept="image/*" multiple style="display:none" />
                </label>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // show modal (no X, allow backdrop click to close)
    const { modal, close } = showModal({
      htmlContent: html,
      onCloseCallback: () => {
        // remove glow from addBtn
        if (floatingButtons.addBtn) floatingButtons.addBtn.classList.remove('vf-glow-medium');
        refreshFloatingBadge();
      },
      modalType: 'perUrl',
      addCloseX: false,
      onBackdropClickClose: true
    });

    // apply glow to add button
    if (floatingButtons.addBtn) floatingButtons.addBtn.classList.add('vf-glow-medium');

    // wire elements
    const textarea = modal.querySelector('#vf-text');
    const addBtn = modal.querySelector('#vf-add');
    const listRoot = modal.querySelector('#vf-list');
    const exportBtn = modal.querySelector('#vf-export');
    const importFile = modal.querySelector('#vf-import-file');
    const inputTitle = modal.querySelector('#vf-title');
    const closeBtnInternal = modal.querySelector('#vf-close-internal');
    const imageFilesInput = modal.querySelector('#vf-image-files');
    const composePreviewArea = modal.querySelector('#vf-compose-preview');
    const composeThumbs = modal.querySelector('#vf-compose-thumbs');

    // hold pending images selected in composer (data URLs)
    let pendingComposeImages = [];

    closeBtnInternal.addEventListener('click', () => {
      // call the modal close function by simulating backdrop removal
      if (currentBackdrop && currentBackdrop.parentNode) currentBackdrop.parentNode.removeChild(currentBackdrop);
      modalOpen = false;
      activeModalType = null;
      currentBackdrop = null;
      if (floatingButtons.addBtn) floatingButtons.addBtn.classList.remove('vf-glow-medium');
      refreshFloatingBadge();
    });

    // When the composer file input changes, read and preview images
    imageFilesInput.addEventListener('change', async (ev) => {
      const files = ev.target.files;
      if (!files || files.length === 0) return;
      try {
        const dataUrls = await readFilesAsDataURLs(files);
        // append to pending compose images
        pendingComposeImages.push(...dataUrls);
        renderComposePreviews();
      } catch (e) {
        console.error('Image read failed', e);
        alert('Failed to read attached images.');
      } finally {
        // clear native input to allow selecting same files again if desired
        imageFilesInput.value = '';
      }
    });

    // Render the compose preview thumbnails area
    function renderComposePreviews() {
      composeThumbs.innerHTML = '';
      if (!pendingComposeImages || pendingComposeImages.length === 0) {
        composePreviewArea.style.display = 'none';
        return;
      }
      composePreviewArea.style.display = '';
      pendingComposeImages.forEach((dataUrl, idx) => {
        const el = document.createElement('div');
        el.className = 'vf-thumb';
        el.dataset.idx = String(idx);
        el.innerHTML = `<img src="${escapeHtml(dataUrl)}" alt="preview-${idx}" />
          <div class="vf-thumb-actions">
            <button class="vf-download-image vf-btn vf-small">Download</button>
            <button class="vf-remove-image vf-btn vf-small">Remove</button>
          </div>`;
        // download handler
        el.querySelector('.vf-download-image').addEventListener('click', () => {
          const ext = guessImageExtensionFromDataUrl(dataUrl) || 'png';
          downloadDataUrl(dataUrl, `compose-${idx + 1}.${ext}`);
        });
        // remove handler (only from pending compose list)
        el.querySelector('.vf-remove-image').addEventListener('click', () => {
          pendingComposeImages.splice(idx, 1);
          renderComposePreviews();
        });
        composeThumbs.appendChild(el);
      });
    }

    addBtn.addEventListener('click', async () => {
      const text = textarea.value.trim();
      // allow creating comment if text OR images are present
      if (!text && (!pendingComposeImages || pendingComposeImages.length === 0)) {
        alert('Please type a comment or attach at least one image first.');
        return;
      }
      const title = inputTitle.value.trim() || document.title || url;
      // images are pendingComposeImages
      let images = pendingComposeImages.slice();

      const created = await addComment(url, title, text, images);
      const itemEl = createListItemFor(created);
      listRoot.insertBefore(itemEl, listRoot.firstChild);
      // clear composer state
      textarea.value = '';
      inputTitle.value = '';
      pendingComposeImages = [];
      renderComposePreviews();
      refreshFloatingBadge();
    });

    exportBtn.addEventListener('click', async () => {
      const all = await loadAllComments();
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlObj;
      a.download = 'vf-comments-export.json';
      a.click();
      URL.revokeObjectURL(urlObj);
    });

    importFile.addEventListener('change', async (ev) => {
      const f = ev.target.files[0];
      if (!f) return;
      try {
        const txt = await f.text();
        const parsed = JSON.parse(txt);
        if (!Array.isArray(parsed)) throw new Error('Invalid format: expected array');
        const existing = await loadAllComments();
        const ids = new Set(existing.map(x => x.id));
        parsed.forEach(it => {
          if (!it.id || ids.has(it.id)) it.id = makeId();
          // ensure images property exists
          if (!Array.isArray(it.images)) it.images = [];
          existing.unshift(it);
        });
        await saveAllComments(existing);
        alert('Imported comments. Refreshing modal.');
        // close and reopen to reflect changes
        if (currentBackdrop && currentBackdrop.parentNode) currentBackdrop.parentNode.removeChild(currentBackdrop);
        modalOpen = false;
        activeModalType = null;
        currentBackdrop = null;
        if (floatingButtons.addBtn) floatingButtons.addBtn.classList.remove('vf-glow-medium');
        // reopen
        openPerUrlModal(url);
        refreshFloatingBadge();
      } catch (e) {
        alert('Import failed: ' + (e.message || e));
      } finally {
        importFile.value = '';
      }
    });

    // helper to create list item element with handlers
    function createListItemFor(it) {
      const el = document.createElement('div');
      el.className = 'vf-item';
      el.dataset.id = it.id;
      el.innerHTML = `
        <div class="meta">
          <div><strong>${escapeHtml(it.title || '(no title)')}</strong> — <span style="font-size:12px;color:#666;">${new Date(it.createdAt).toLocaleString()}</span></div>
          <div style="text-align:right">
            <span style="font-size:12px;color:#888;">Updated ${new Date(it.updatedAt).toLocaleString()}</span>
          </div>
        </div>
        <div class="body" style="white-space:pre-wrap">${escapeHtml(it.text)}</div>
        ${renderThumbnailsHtml(it.images)}
        <div class="controls" style="margin-top:8px">
          <button class="vf-edit vf-btn vf-small">Edit</button>
          <button class="vf-delete vf-btn vf-small">Delete</button>
          <button class="vf-copy vf-btn vf-small">Copy</button>
          <label class="vf-btn vf-btn-ghost vf-small" style="display:inline-block;cursor:pointer;">
            Attach image
            <input class="vf-attach-file" type="file" accept="image/*" multiple style="display:none" />
          </label>
        </div>
      `;

      // Edit
      el.querySelector('.vf-edit').addEventListener('click', async () => {
        const currentText = it.text;
        const newText = prompt('Edit comment text:', currentText);
        if (newText === null) return;
        const newTitle = prompt('Edit title (optional):', it.title || '');
        const updated = await updateComment(it.id, newText, newTitle);
        if (updated) {
          el.querySelector('.body').textContent = updated.text;
          el.querySelector('.meta strong').textContent = updated.title || '(no title)';
          el.querySelector('.meta div span:last-child').textContent = new Date(updated.updatedAt).toLocaleString();
        }
      });

      // Delete
      el.querySelector('.vf-delete').addEventListener('click', async () => {
        if (!confirm('Delete this comment?')) return;
        await deleteComment(it.id);
        if (el.parentNode) el.parentNode.removeChild(el);
        refreshFloatingBadge();
      });

      // Copy
      el.querySelector('.vf-copy').addEventListener('click', () => {
        navigator.clipboard?.writeText(it.text).then(() => {
          alert('Comment copied to clipboard');
        }).catch(() => {
          prompt('Copy the comment text:', it.text);
        });
      });

      // Attach images to existing comment
      const attachInput = el.querySelector('.vf-attach-file');
      attachInput.addEventListener('change', async (ev) => {
        const files = ev.target.files;
        if (!files || files.length === 0) return;
        try {
          const dataUrls = await readFilesAsDataURLs(files);
          const updated = await appendImagesToComment(it.id, dataUrls);
          // update UI thumbnails: find existing thumb-row or insert new
          const thumbRowOld = el.querySelector('.vf-thumb-row');
          if (thumbRowOld) thumbRowOld.remove();
          const thumbsHtml = renderThumbnailsHtml(updated.images || []);
          const temp = document.createElement('div');
          temp.innerHTML = thumbsHtml;
          const newThumbRow = temp.querySelector('.vf-thumb-row');
          if (newThumbRow) {
            el.insertBefore(newThumbRow, el.querySelector('.controls'));
            wireThumbnailHandlers(el, updated);
          }
          // update local 'it' object and updatedAt
          it.images = updated.images;
          it.updatedAt = updated.updatedAt;
        } catch (e) {
          console.error('Failed attaching images', e);
          alert('Failed to attach images.');
        } finally {
          attachInput.value = '';
        }
      });

      // wire thumbnail handlers for initial item
      wireThumbnailHandlers(el, it);

      return el;
    }

    // wire up pre-existing items (we already created markup)
    const preItems = modal.querySelectorAll('.vf-item');
    preItems.forEach(pi => {
      const id = pi.dataset.id;
      const it = entries.find(x => x.id === id);
      if (!it) return;
      const editBtn = pi.querySelector('.vf-edit');
      const delBtn = pi.querySelector('.vf-delete');
      const copyBtn = pi.querySelector('.vf-copy');

      editBtn.addEventListener('click', async () => {
        const newText = prompt('Edit comment text:', it.text);
        if (newText === null) return;
        const newTitle = prompt('Edit title (optional):', it.title || '');
        const updated = await updateComment(it.id, newText, newTitle);
        if (updated) {
          pi.querySelector('.body').textContent = updated.text;
          const strong = pi.querySelector('.meta strong');
          strong.textContent = updated.title || '(no title)';
          pi.querySelector('.meta div span:last-child').textContent = new Date(updated.updatedAt).toLocaleString();
        }
      });

      delBtn.addEventListener('click', async () => {
        if (!confirm('Delete this comment?')) return;
        await deleteComment(it.id);
        if (pi.parentNode) pi.parentNode.removeChild(pi);
        refreshFloatingBadge();
      });

      copyBtn.addEventListener('click', () => {
        navigator.clipboard?.writeText(it.text).then(() => {
          alert('Comment copied to clipboard');
        }).catch(() => {
          prompt('Copy the comment text:', it.text);
        });
      });

      // Attach image input wiring already exists in markup; get reference
      const attachInput = pi.querySelector('.vf-attach-file');
      attachInput.addEventListener('change', async (ev) => {
        const files = ev.target.files;
        if (!files || files.length === 0) return;
        try {
          const dataUrls = await readFilesAsDataURLs(files);
          const updated = await appendImagesToComment(it.id, dataUrls);
          // rebuild thumbnail row
          const thumbRowOld = pi.querySelector('.vf-thumb-row');
          if (thumbRowOld) thumbRowOld.remove();
          const thumbsHtml = renderThumbnailsHtml(updated.images || []);
          const temp = document.createElement('div');
          temp.innerHTML = thumbsHtml;
          const newThumbRow = temp.querySelector('.vf-thumb-row');
          if (newThumbRow) {
            pi.insertBefore(newThumbRow, pi.querySelector('.controls'));
            wireThumbnailHandlers(pi, updated);
          }
          it.images = updated.images;
          it.updatedAt = updated.updatedAt;
        } catch (e) {
          console.error('attach images failed', e);
          alert('Failed to attach images.');
        } finally {
          attachInput.value = '';
        }
      });

      // wire thumbnails
      wireThumbnailHandlers(pi, it);
    });

    function wireThumbnailHandlers(containerEl, it) {
      const thumbRow = containerEl.querySelector('.vf-thumb-row');
      if (!thumbRow) return;
      const thumbEls = thumbRow.querySelectorAll('.vf-thumb');
      thumbEls.forEach((tEl, idx) => {
        const downloadBtn = tEl.querySelector('.vf-download-image');
        const deleteBtn = tEl.querySelector('.vf-delete-image');
        // download
        downloadBtn?.addEventListener('click', () => {
          const dataUrl = (it.images && it.images[idx]) || null;
          if (!dataUrl) {
            alert('Image not found.');
            return;
          }
          const extension = guessImageExtensionFromDataUrl(dataUrl) || 'png';
          downloadDataUrl(dataUrl, `${it.id}-${idx + 1}.${extension}`);
        });
        // delete
        deleteBtn?.addEventListener('click', async () => {
          if (!confirm('Delete this image from the comment?')) return;
          const updated = await deleteImageFromComment(it.id, idx);
          if (!updated) return;
          // update UI: remove thumb and re-render
          const thumbRowOld = containerEl.querySelector('.vf-thumb-row');
          if (thumbRowOld) thumbRowOld.remove();
          const thumbsHtml = renderThumbnailsHtml(updated.images || []);
          const temp = document.createElement('div');
          temp.innerHTML = thumbsHtml;
          const newThumbRow = temp.querySelector('.vf-thumb-row');
          if (newThumbRow) {
            containerEl.insertBefore(newThumbRow, containerEl.querySelector('.controls'));
            // update local item and wire again
            it.images = updated.images;
            wireThumbnailHandlers(containerEl, it);
          }
        });
      });
    }

    function guessImageExtensionFromDataUrl(dataUrl) {
      // data:image/png;base64,...
      try {
        const m = /^data:(image\/[a-zA-Z0-9.+-]+);/.exec(dataUrl);
        if (!m) return null;
        const mime = m[1];
        const map = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' };
        return map[mime] || mime.split('/')[1] || null;
      } catch (e) {
        return null;
      }
    }
  }

  /* ---------- Dashboard modal (has top-right X) ---------- */
  async function openDashboard() {
    const all = await loadAllComments();

    const html = `
      <h2>Comments dashboard</h2>
      <div style="margin-bottom:8px;color:#444;font-size:13px;">Manage all saved personal comments (across URLs)</div>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <input id="vf-search" placeholder="Filter by URL, title or text..." style="flex:1;padding:8px;border-radius:8px;border:1px solid #ddd;" />
        <button id="vf-clear-all" class="vf-btn vf-btn-ghost vf-small">Clear all</button>
        <button id="vf-export-all" class="vf-btn vf-btn-ghost vf-small">Export</button>
      </div>
      <div class="vf-list" id="vf-dashboard-list">
        ${all.map(it => `
          <div class="vf-item" data-id="${it.id}">
            <div class="meta">
              <div><strong>${escapeHtml(it.title || '(no title)')}</strong></div>
              <div style="text-align:right"><a href="${escapeHtml(it.url)}" target="_blank" rel="noreferrer noopener">Open</a></div>
            </div>
            <div style="font-size:12px;color:#666;margin-bottom:6px;">${escapeHtml(it.url)}</div>
            <div class="body" style="white-space:pre-wrap">${escapeHtml(it.text)}</div>
            ${renderThumbnailsHtml(it.images)}
            <div class="controls" style="margin-top:8px">
              <button class="vf-edit vf-btn vf-small">Edit</button>
              <button class="vf-delete vf-btn vf-small">Delete</button>
              <button class="vf-copy vf-btn vf-small">Copy</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const { modal, close } = showModal({
      htmlContent: html,
      onCloseCallback: () => {
        // remove glow from dashBtn
        if (floatingButtons.dashBtn) floatingButtons.dashBtn.classList.remove('vf-glow-medium');
        refreshFloatingBadge();
      },
      modalType: 'dashboard',
      addCloseX: true,
      onBackdropClickClose: true
    });

    // glow on dash button
    if (floatingButtons.dashBtn) floatingButtons.dashBtn.classList.add('vf-glow-medium');

    const listRoot = modal.querySelector('#vf-dashboard-list');
    const search = modal.querySelector('#vf-search');
    const clearAllBtn = modal.querySelector('#vf-clear-all');
    const exportAllBtn = modal.querySelector('#vf-export-all');

    // Wire items
    listRoot.querySelectorAll('.vf-item').forEach(el => {
      const id = el.dataset.id;
      const body = el.querySelector('.body');
      const editBtn = el.querySelector('.vf-edit');
      const delBtn = el.querySelector('.vf-delete');
      const copyBtn = el.querySelector('.vf-copy');

      editBtn.addEventListener('click', async () => {
        const all = await loadAllComments();
        const it = all.find(x => x.id === id);
        if (!it) return;
        const newText = prompt('Edit comment text:', it.text);
        if (newText === null) return;
        const newTitle = prompt('Edit title (optional):', it.title || '');
        const updated = await updateComment(it.id, newText, newTitle);
        if (updated) {
          body.textContent = updated.text;
          el.querySelector('.meta strong').textContent = updated.title || '(no title)';
        }
      });

      delBtn.addEventListener('click', async () => {
        if (!confirm('Delete this comment?')) return;
        await deleteComment(id);
        if (el.parentNode) el.parentNode.removeChild(el);
        refreshFloatingBadge();
      });

      copyBtn.addEventListener('click', () => {
        navigator.clipboard?.writeText(body.textContent || '').then(() => {
          alert('Comment copied to clipboard');
        }).catch(() => {
          prompt('Copy the comment text:', body.textContent || '');
        });
      });

      // wire thumbnail handlers in dashboard view
      const thumbRow = el.querySelector('.vf-thumb-row');
      if (thumbRow) {
        const thumbs = thumbRow.querySelectorAll('.vf-thumb');
        thumbs.forEach((tEl, idx) => {
          const downloadBtn = tEl.querySelector('.vf-download-image');
          const deleteBtn = tEl.querySelector('.vf-delete-image');
          downloadBtn?.addEventListener('click', async () => {
            const allNow = await loadAllComments();
            const it = allNow.find(x => x.id === id);
            const dataUrl = it && it.images && it.images[idx];
            if (!dataUrl) return alert('Image not found.');
            const extension = guessImageExtensionFromDataUrl(dataUrl) || 'png';
            downloadDataUrl(dataUrl, `${id}-${idx + 1}.${extension}`);
          });
          deleteBtn?.addEventListener('click', async () => {
            if (!confirm('Delete this image from the comment?')) return;
            await deleteImageFromComment(id, idx);
            // refresh dashboard view by closing and reopening modal for simplicity
            if (currentBackdrop && currentBackdrop.parentNode) currentBackdrop.parentNode.removeChild(currentBackdrop);
            modalOpen = false;
            activeModalType = null;
            currentBackdrop = null;
            openDashboard();
          });
        });
      }
    });

    search.addEventListener('input', () => {
      const q = (search.value || '').toLowerCase().trim();
      listRoot.querySelectorAll('.vf-item').forEach(itEl => {
        const text = (itEl.textContent || '').toLowerCase();
        itEl.style.display = text.includes(q) ? '' : 'none';
      });
    });

    clearAllBtn.addEventListener('click', async () => {
      if (!confirm('Remove ALL saved comments? This cannot be undone.')) return;
      await saveAllComments([]);
      alert('All comments removed.');
      if (currentBackdrop && currentBackdrop.parentNode) currentBackdrop.parentNode.removeChild(currentBackdrop);
      modalOpen = false;
      activeModalType = null;
      currentBackdrop = null;
      if (floatingButtons.dashBtn) floatingButtons.dashBtn.classList.remove('vf-glow-medium');
      refreshFloatingBadge();
    });

    exportAllBtn.addEventListener('click', async () => {
      const all = await loadAllComments();
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlObj;
      a.download = 'vf-comments-export.json';
      a.click();
      URL.revokeObjectURL(urlObj);
    });
  }

  /* ---------- Badge refresh ---------- */
  async function refreshFloatingBadge() {
    const nodes = Array.from(document.querySelectorAll('.vf-floating-btn'));
    if (!nodes.length) return;
    const url = location.href;
    const all = await loadAllComments();
    const count = all.filter(it => it.url === url).length;
    nodes.forEach(addBtn => {
      // remove any existing badge
      const existing = addBtn.querySelector('div[style*="position: absolute"]');
      if (existing) existing.remove();
      if (count > 0) {
        const badge = document.createElement('div');
        badge.style.position = 'absolute';
        badge.style.top = '-6px';
        badge.style.right = '-6px';
        badge.style.minWidth = '20px';
        badge.style.height = '20px';
        badge.style.padding = '0 6px';
        badge.style.borderRadius = '999px';
        badge.style.background = '#111';
        badge.style.color = '#fff';
        badge.style.fontSize = '12px';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.innerText = String(count);
        addBtn.appendChild(badge);
      }
    });
  }

  /* ---------- Initialization (create buttons based on URL matching) ---------- */
  const currentUrl = location.href;
  const shouldShow = isSetTasksUrl(currentUrl);

  // create initial count and buttons
  const all = await loadAllComments();
  const count = all.filter(it => it.url === currentUrl).length;

  const { addBtn, dashBtn } = createFloatingButtons(
    () => openPerUrlModal(currentUrl),
    () => openDashboard(),
    count
  );

  floatingButtons.addBtn = addBtn;
  floatingButtons.dashBtn = dashBtn;

  refreshFloatingBadge();

  // If on other pages of the same host, still show dashboard button but in our layout they are both created
  // Recompute badge when page becomes visible (handles SPA navigation)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshFloatingBadge();
  });

  // Observe title changes to refresh badge (optional)
  const titleNode = document.querySelector('title');
  if (titleNode) {
    const titleObserver = new MutationObserver(() => refreshFloatingBadge());
    titleObserver.observe(titleNode, { childList: true });
  }

  // Ensure closing via ESC key also closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpen && currentBackdrop) {
      if (currentBackdrop.parentNode) currentBackdrop.parentNode.removeChild(currentBackdrop);
      modalOpen = false;
      activeModalType = null;
      currentBackdrop = null;
      if (floatingButtons.addBtn) floatingButtons.addBtn.classList.remove('vf-glow-medium');
      if (floatingButtons.dashBtn) floatingButtons.dashBtn.classList.remove('vf-glow-medium');
      refreshFloatingBadge();
    }
  });

  /* ---------- Helper renderers used above ---------- */
  function renderThumbnailsHtml(images) {
    if (!Array.isArray(images) || images.length === 0) return '';
    // render each image as a thumb with download + delete icons
    return `
      <div class="vf-thumb-row">
        ${images.map((img, idx) => `
          <div class="vf-thumb" data-index="${idx}">
            <img src="${escapeHtml(img)}" alt="img-${idx}" />
            <div class="vf-thumb-actions">
              <button class="vf-download-image vf-btn vf-small">Download</button>
              <button class="vf-delete-image vf-btn vf-small">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function guessImageExtensionFromDataUrl(dataUrl) {
    // data:image/png;base64,...
    try {
      const m = /^data:(image\/[a-zA-Z0-9.+-]+);/.exec(dataUrl);
      if (!m) return null;
      const mime = m[1];
      const map = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp' };
      return map[mime] || mime.split('/')[1] || null;
    } catch (e) {
      return null;
    }
  }

})();
