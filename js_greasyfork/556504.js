// ==UserScript==
// @name         IMG → Right-Click Save to Google Drive (prompt filename, CSP-safe)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Right-click image → menu → browser prompt for filename → send base64 to GAS Web App → save to Google Drive. No innerHTML (TrustedHTML/CSP safe), prompt allows typing + Ctrl+V even on strict sites like gemini.google.com.
// @author       Mark
// @match        *://*/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/556504/IMG%20%E2%86%92%20Right-Click%20Save%20to%20Google%20Drive%20%28prompt%20filename%2C%20CSP-safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556504/IMG%20%E2%86%92%20Right-Click%20Save%20to%20Google%20Drive%20%28prompt%20filename%2C%20CSP-safe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- KEYS ----------
  const KEY_WEBAPP_URL = 'img2gdrive_webapp_url';
  const KEY_FOLDER_ID  = 'img2gdrive_folder_id';

  // ---------- STYLE ----------
  GM_addStyle(`
    #img2gdrive-gear {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: #111827;
      color: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #img2gdrive-gear:hover {
      background: #1f2937;
    }

    #img2gdrive-settings {
      position: fixed;
      bottom: 60px;
      right: 20px;
      width: 320px;
      background: #020617;
      color: #e5e7eb;
      border-radius: 10px;
      padding: 12px 14px;
      box-shadow: 0 18px 40px rgba(0,0,0,0.45);
      z-index: 999999;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 12px;
      display: none;
    }
    #img2gdrive-settings h3 {
      margin: 0 0 6px;
      font-size: 13px;
      font-weight: 600;
    }
    #img2gdrive-settings label {
      display: block;
      margin-top: 6px;
      font-size: 11px;
      opacity: 0.85;
    }
    #img2gdrive-settings input[type="text"] {
      width: 100%;
      padding: 4px 6px;
      margin-top: 2px;
      border-radius: 6px;
      border: 1px solid #374151;
      background: #020617;
      color: #e5e7eb;
      font-size: 11px;
    }
    #img2gdrive-settings-actions {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
      gap: 6px;
    }
    #img2gdrive-settings button {
      border-radius: 999px;
      border: none;
      font-size: 11px;
      padding: 4px 10px;
      cursor: pointer;
    }
    #img2gdrive-settings-save {
      background: #22c55e;
      color: #022c22;
      font-weight: 600;
    }
    #img2gdrive-settings-cancel {
      background: #111827;
      color: #e5e7eb;
    }

    #img2gdrive-menu {
      position: absolute;
      z-index: 999999;
      background: #111827;
      color: #f9fafb;
      border-radius: 6px;
      padding: 4px 0;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 12px;
      min-width: 230px;
      display: none;
    }
    #img2gdrive-menu .menu-title {
      font-size: 11px;
      font-weight: 600;
      padding: 6px 10px 4px;
      opacity: 0.7;
      border-bottom: 1px solid #374151;
      margin-bottom: 2px;
    }
    #img2gdrive-menu button {
      display: block;
      width: 100%;
      padding: 6px 10px;
      border: none;
      background: transparent;
      color: inherit;
      text-align: left;
      cursor: pointer;
      white-space: nowrap;
    }
    #img2gdrive-menu button:hover {
      background: #1f2937;
    }

    #img2gdrive-toast {
      position: fixed;
      bottom: 20px;
      right: 60px;
      background: #111827;
      color: #e5e7eb;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-out, transform 0.2s ease-out;
      transform: translateY(8px);
      z-index: 999999;
    }
    #img2gdrive-toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  `);

  // ---------- TOAST ----------
  let toastEl = null;
  function getToast() {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'img2gdrive-toast';
      document.body.appendChild(toastEl);
    }
    return toastEl;
  }
  function showToast(msg, ms = 2500) {
    const t = getToast();
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      t.classList.remove('show');
    }, ms);
  }

  // ---------- SETTINGS UI ----------
  let settingsEl = null;

  function createGear() {
    const div = document.createElement('div');
    div.id = 'img2gdrive-gear';
    div.title = 'Image → Google Drive settings';
    div.textContent = '⚙';
    div.addEventListener('click', toggleSettings);
    document.body.appendChild(div);
  }

  function createSettings() {
    const wrap = document.createElement('div');
    wrap.id = 'img2gdrive-settings';

    const savedUrl = GM_getValue(KEY_WEBAPP_URL, '');
    const savedFolder = GM_getValue(KEY_FOLDER_ID, '');

    const h3 = document.createElement('h3');
    h3.textContent = 'Image → Google Drive Settings';
    wrap.appendChild(h3);

    const labelWeb = document.createElement('label');
    labelWeb.textContent = 'Web App URL (GAS)';
    const inpWeb = document.createElement('input');
    inpWeb.type = 'text';
    inpWeb.id = 'img2gdrive-input-webapp';
    inpWeb.placeholder = 'https://script.google.com/macros/s/XXXX/exec';
    inpWeb.value = savedUrl || '';
    labelWeb.appendChild(inpWeb);
    wrap.appendChild(labelWeb);

    const labelFolder = document.createElement('label');
    labelFolder.textContent = 'Drive Folder ID';
    const inpFolder = document.createElement('input');
    inpFolder.type = 'text';
    inpFolder.id = 'img2gdrive-input-folder';
    inpFolder.placeholder = 'Folder ID where images will be stored';
    inpFolder.value = savedFolder || '';
    labelFolder.appendChild(inpFolder);
    wrap.appendChild(labelFolder);

    const actions = document.createElement('div');
    actions.id = 'img2gdrive-settings-actions';

    const btnCancel = document.createElement('button');
    btnCancel.id = 'img2gdrive-settings-cancel';
    btnCancel.type = 'button';
    btnCancel.textContent = 'Close';
    btnCancel.addEventListener('click', hideSettings);
    actions.appendChild(btnCancel);

    const btnSave = document.createElement('button');
    btnSave.id = 'img2gdrive-settings-save';
    btnSave.type = 'button';
    btnSave.textContent = 'Save';
    btnSave.addEventListener('click', () => {
      const webapp = inpWeb.value.trim();
      const folder = inpFolder.value.trim();
      GM_setValue(KEY_WEBAPP_URL, webapp);
      GM_setValue(KEY_FOLDER_ID, folder);
      showToast('✅ Settings saved');
      hideSettings();
    });
    actions.appendChild(btnSave);

    wrap.appendChild(actions);

    // Stop propagation so page scripts don't interfere
    wrap.addEventListener('mousedown', e => e.stopPropagation());
    wrap.addEventListener('click', e => e.stopPropagation());
    wrap.addEventListener('keydown', e => e.stopPropagation());

    document.body.appendChild(wrap);
    settingsEl = wrap;
  }

  function toggleSettings() {
    if (!settingsEl) createSettings();
    if (settingsEl.style.display === 'none' || settingsEl.style.display === '') {
      settingsEl.style.display = 'block';
    } else {
      settingsEl.style.display = 'none';
    }
  }

  function hideSettings() {
    if (settingsEl) {
      settingsEl.style.display = 'none';
    }
  }

  // ---------- RIGHT-CLICK MENU ----------
  let menuEl = null;
  let currentImg = null;

  function createMenu() {
    const menu = document.createElement('div');
    menu.id = 'img2gdrive-menu';

    const title = document.createElement('div');
    title.className = 'menu-title';
    title.textContent = 'Image → Google Drive';
    menu.appendChild(title);

    const btnSave = document.createElement('button');
    btnSave.type = 'button';
    btnSave.setAttribute('data-action', 'save');
    btnSave.textContent = 'Save image to Google Drive…';
    menu.appendChild(btnSave);

    const btnSettings = document.createElement('button');
    btnSettings.type = 'button';
    btnSettings.setAttribute('data-action', 'open-settings');
    btnSettings.textContent = 'Open settings';
    menu.appendChild(btnSettings);

    document.body.appendChild(menu);
    menuEl = menu;
  }

  function showMenu(x, y, img) {
    if (!menuEl) createMenu();
    currentImg = img;

    const menuRect = { width: 240, height: 90 };
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    let left = x;
    let top = y;

    if (left + menuRect.width > vpWidth - 10) left = vpWidth - menuRect.width - 10;
    if (top + menuRect.height > vpHeight - 10) top = vpHeight - menuRect.height - 10;

    menuEl.style.left = left + 'px';
    menuEl.style.top = top + 'px';
    menuEl.style.display = 'block';
  }

  function hideMenu() {
    if (menuEl) menuEl.style.display = 'none';
    currentImg = null;
  }

  // ---------- HELPERS ----------
  function getFilenameFromUrl(url) {
    try {
      const u = new URL(url, window.location.href);
      const pathname = u.pathname;
      const lastPart = pathname.split('/').filter(Boolean).pop() || 'image';
      return lastPart.split('?')[0].split('#')[0];
    } catch (e) {
      const parts = url.split('/').filter(Boolean);
      return (parts.pop() || 'image').split('?')[0].split('#')[0];
    }
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // ---------- CORE LOGIC ----------
  function sendImageToDrive(imgSrc, overrideName) {
    const webAppUrl = GM_getValue(KEY_WEBAPP_URL, '').trim();
    const folderId  = GM_getValue(KEY_FOLDER_ID, '').trim();

    if (!webAppUrl || !webAppUrl.includes('script.google.com')) {
      showToast('⚠️ Set Web App URL in settings');
      toggleSettings();
      return;
    }
    if (!folderId) {
      showToast('⚠️ Set Drive Folder ID in settings');
      toggleSettings();
      return;
    }

    const baseName = overrideName && overrideName.length > 0
      ? overrideName
      : (getFilenameFromUrl(imgSrc) || 'image');

    showToast('⏳ Downloading image...');

    GM_xmlhttpRequest({
      method: 'GET',
      url: imgSrc,
      responseType: 'arraybuffer',
      onload: function (res) {
        try {
          const buffer = res.response;
          if (!buffer) {
            showToast('❌ No image data received');
            return;
          }

          const base64 = arrayBufferToBase64(buffer);
          const headers = res.responseHeaders || '';
          const ctMatch = /content-type:\s*([^\n\r]+)/i.exec(headers);
          const mimeType = ctMatch ? ctMatch[1].trim() : 'application/octet-stream';

          const payload = {
            folderId: folderId,
            filename: baseName,
            mimeType: mimeType,
            dataBase64: base64
          };

          showToast('⏳ Uploading to Drive...');

          GM_xmlhttpRequest({
            method: 'POST',
            url: webAppUrl,
            data: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json'
            },
            onload: function (resp) {
              try {
                const data = JSON.parse(resp.responseText || '{}');
                if (data && data.ok) {
                  showToast('✅ ' + (data.message || 'Image saved to Drive'));
                } else {
                  console.warn('GAS response:', data);
                  showToast('⚠️ Drive error: check GAS logs');
                }
              } catch (e) {
                console.error('GAS parse error:', e, resp.responseText);
                showToast('⚠️ Invalid response from GAS');
              }
            },
            onerror: function (err) {
              console.error('GAS request error:', err);
              showToast('❌ Upload to Drive failed');
            }
          });

        } catch (e) {
          console.error('Download/encode error:', e);
          showToast('❌ Failed to process image');
        }
      },
      onerror: function (err) {
        console.error('Image download error:', err);
        showToast('❌ Image download failed');
      }
    });
  }

  // ---------- EVENTS ----------

  // Right-click on images → show menu
  document.addEventListener('contextmenu', function (e) {
    const img = e.target.closest('img');
    if (img) {
      e.preventDefault();
      showMenu(e.pageX, e.pageY, img);
    } else {
      hideMenu();
    }
  }, true);

  // Menu clicks
  document.addEventListener('click', function (e) {
    if (!menuEl || menuEl.style.display === 'none') return;

    if (menuEl.contains(e.target)) {
      const action = e.target.getAttribute('data-action');
      if (action === 'save' && currentImg) {
        const src = currentImg.src || currentImg.getAttribute('src');

        if (src) {
          const suggested = getFilenameFromUrl(src) || '';
          const answer = window.prompt(
            'Filename (optional):\nLeave blank to auto-use the URL filename.',
            suggested
          );

          if (answer === null) {
            hideMenu();
            return;
          }

          const override = answer.trim();
          sendImageToDrive(src, override);
        } else {
          showToast('⚠️ No image src found');
        }
        hideMenu();
      } else if (action === 'open-settings') {
        toggleSettings();
        hideMenu();
      }
    } else {
      hideMenu();
    }
  });

  // Hide menu/settings on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      hideMenu();
      hideSettings();
    }
  });

  // Hide menu on scroll/resize
  window.addEventListener('scroll', hideMenu, true);
  window.addEventListener('resize', hideMenu);

  // Init
  createGear();
})();
