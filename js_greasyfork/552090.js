// ==UserScript==
// @name         Altcoinstalks Editor + Image Uploader
// @namespace    Royal Cap
// @version      1.0
// @description  Toggle SCEditor with native preview + upload images to hostmeme.com for Altcoinstalks
// @match        https://www.altcoinstalks.com/index.php?*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/sceditor@3/minified/sceditor.min.js
// @require      https://cdn.jsdelivr.net/npm/sceditor@3/minified/formats/bbcode.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552090/Altcoinstalks%20Editor%20%2B%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/552090/Altcoinstalks%20Editor%20%2B%20Image%20Uploader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const THEME_UI = 'https://cdn.jsdelivr.net/npm/sceditor@3/minified/themes/default.min.css';
  const THEME_CONTENT = 'https://cdn.jsdelivr.net/npm/sceditor@3/minified/themes/content/default.min.css';
  const STORAGE_KEY = 'alt_sceditor_enabled';

  GM_addStyle(`
    .tm-sce-toolbar{display:flex;gap:.5rem;align-items:center;margin:8px 0 6px 0;}
    .tm-sce-btn{cursor:pointer;padding:.35rem .6rem;border:1px solid #aaa;border-radius:8px;background:#f4f4f4;font:inherit}
    .tm-sce-btn:hover{background:#e9e9e9}
    .tm-sce-badge{font-size:.85em;color:#444}
  `);

  addStylesheetOnce(THEME_UI);

  waitForTextarea().then(init).catch(() => {});

  function normalizeImgSizeAttrs(bbcode) {
    return bbcode.replace(/\[img=(\d+)x(\d+)\]([^\[]+?)\[\/img\]/gi, '[img width=$1 height=$2]$3[/img]');
  }

  function init(textarea) {
    if (textarea.dataset.tmSceReady) return;
    textarea.dataset.tmSceReady = '1';

    const ui = buildUI();
    textarea.parentElement.insertBefore(ui.toolbar, textarea);

    const lastEnabled = tryGetBool(STORAGE_KEY, false);

    ui.toggleBtn.addEventListener('click', () => {
      if (textarea.dataset.tmSceEnabled === '1') {
        destroyEditor(textarea, ui);
        GM_setValue(STORAGE_KEY, false);
      } else {
        createEditor(textarea, ui);
        GM_setValue(STORAGE_KEY, true);
      }
    });

    const form = textarea.closest('form');
    if (form) {
      form.addEventListener('submit', () => {
        const inst = getInstance(textarea);
        if (inst) {
          try { inst.updateOriginal(); } catch (e) {}
        }
        textarea.value = normalizeImgSizeAttrs(textarea.value);
      });
    }

    if (lastEnabled) createEditor(textarea, ui);

    // Try repeatedly until the button appears
    const interval = setInterval(() => {
      if (addUploadButton()) clearInterval(interval);
    }, 1000);
  }

  function buildUI() {
    const toolbar = document.createElement('div');
    toolbar.className = 'tm-sce-toolbar';

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'tm-sce-btn';
    toggleBtn.textContent = 'Enable Editor';

    const badge = document.createElement('span');
    badge.className = 'tm-sce-badge';
    badge.textContent = '(native textarea)';

    toolbar.append(toggleBtn, badge);

    return { toolbar, toggleBtn, badge };
  }

  function overrideImgBBCode() {
    if (!window.sceditor || !sceditor.formats || !sceditor.formats.bbcode) return;

    sceditor.formats.bbcode.set('img', {
      tags: { img: { width: null, height: null, src: null } },
      isInline: true,
      allowsEmpty: false,
      format: function (element, content) {
        if (!element || !element.getAttribute) return content;
        const src = element.getAttribute('src') || '';
        const w = element.getAttribute('width');
        const h = element.getAttribute('height');
        const parts = [];
        if (w) parts.push('width=' + w);
        if (h) parts.push('height=' + h);
        const attr = parts.length ? ' ' + parts.join(' ') : '';
        return `[img${attr}]${src}[/img]`;
      },
      html: function (token, attrs, content) {
        let w = attrs.width || null;
        let h = attrs.height || null;
        const def = attrs.defaultattr || attrs.defaultAttr || null;
        if ((!w || !h) && def && /^(\d+)x(\d+)$/i.test(def)) {
          const m = String(def).match(/^(\d+)x(\d+)$/i);
          if (m) { w = w || m[1]; h = h || m[2]; }
        }
        const wAttr = w ? ` width="${w}"` : '';
        const hAttr = h ? ` height="${h}"` : '';
        const safeSrc = String(content || '').trim();
        return `<img src="${safeSrc}"${wAttr}${hAttr} />`;
      },
      quoteType: sceditor.BBCodeParser.QuoteType.never
    });
  }

  function createEditor(textarea, ui) {
    try {
      overrideImgBBCode();

      sceditor.create(textarea, {
        format: 'bbcode',
        style: THEME_CONTENT,
        autoExpand: true,
        autofocus: true,
        enablePasteFiltering: true,
        autoUpdate: true
      });

      const inst = getInstance(textarea);

      inst.bind('valuechanged', () => {
        try {
          inst.updateOriginal();
          textarea.value = normalizeImgSizeAttrs(textarea.value);
          const previewEl = document.querySelector('#preview_body');
          if (previewEl) previewEl.innerHTML = inst.fromBBCode(textarea.value, true);
        } catch (e) {}
      });

      textarea.dataset.tmSceEnabled = '1';
      ui.toggleBtn.textContent = 'Disable Editor';
      ui.badge.textContent = '(Editor active)';
    } catch (err) {
      console.error('[SCEditor Toggle] Failed:', err);
      alert('Could not initialize SCEditor.');
    }
  }

  function destroyEditor(textarea, ui) {
    const inst = getInstance(textarea);
    if (inst) {
      try { inst.updateOriginal(); } catch (e) {}
      try { inst.unbind('valuechanged'); inst.destroy(); } catch (e) {}
    }
    textarea.dataset.tmSceEnabled = '0';
    ui.toggleBtn.textContent = 'Enable Editor';
    ui.badge.textContent = '(native textarea)';
  }

  function getInstance(textarea) {
    try { return sceditor.instance(textarea); } catch { return null; }
  }

  function addStylesheetOnce(href) {
    if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.documentElement.appendChild(link);
  }

  function waitForTextarea() {
    return new Promise((resolve, reject) => {
      const direct = findTextarea();
      if (direct) return resolve(direct);
      const obs = new MutationObserver(() => {
        const ta = findTextarea();
        if (ta) {
          obs.disconnect();
          resolve(ta);
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); reject(new Error('No textarea found')); }, 8000);
    });
  }

  function findTextarea() {
    return (
      document.querySelector('textarea[name="message"]') ||
      document.querySelector('textarea[name="post"]') ||
      document.querySelector('textarea')
    );
  }

  function tryGetBool(key, defVal) {
    try { return !!GM_getValue(key, defVal); } catch { return defVal; }
  }

  function addUploadButton() {
    let postBtn =
      document.querySelector("input[name='post'], input[name='postmodify'], input[value='Post'], input[value='Save']");

    if (!postBtn || document.getElementById("uploadImageBtn")) return false;

    const uploadBtn = document.createElement("button");
    uploadBtn.id = "uploadImageBtn";
    uploadBtn.innerText = "Upload Image";
    uploadBtn.type = "button";
    uploadBtn.style.marginLeft = "10px";
    uploadBtn.style.padding = "5px 10px";

    postBtn.parentNode.insertBefore(uploadBtn, postBtn.nextSibling);

    uploadBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        uploadBtn.innerText = "Uploading...";

        try {
          const response = await fetch("https://hostmeme.com/bitcointalk.php", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          if (data.success && data.url && data.width && data.height) {
            const bbcode = `[img height=${data.height}]${data.url}[/img]`;

            const textarea = findTextarea();
            const inst = textarea ? getInstance(textarea) : null;
            if (inst) {
              inst.insert(bbcode);
              inst.updateOriginal();
              textarea.value = normalizeImgSizeAttrs(textarea.value);
            } else if (textarea) {
              textarea.value += `\n${bbcode}\n`;
            }
          } else {
            alert("Upload failed: " + (data.error || "Unknown error"));
          }
        } catch (err) {
          alert("Upload error: " + err.message);
        } finally {
          uploadBtn.innerText = "Upload Image";
        }
      };

      input.click();
    });

    return true;
  }

})();
