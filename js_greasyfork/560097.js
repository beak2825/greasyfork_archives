// ==UserScript==
// @name         Holotower TS
// @namespace    Holotower-TS
// @version      2.1
// @author       Anonymous
// @license      MIT
// @description  Adds various features to Holotower
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAVFBMVEVHcEwwP4D1w7eCb344MmLhubU6OGc2RIvp1Njyn4r0dBv7eyKUIgHpmWHhYAjpcB3w7/XvpHD1iT+vKQH5+fvOeFrbhV31soLv4OXBPw72vpdmcK6vNWMgAAAACnRSTlMAQnVHIKlv8dwqvTaiTAAAAQBJREFUeNqFz1uOhCAARNGaHt8KiIqC7n+fgwVDIh31/BluCgQZvBiG12BwL4FnngKaDRKt1nXy9CWYXQqElKrr+h4Bj8mlQJ2BTsEcOWdCwIEJkaGVzMqAF+y4JeJA7tM0zYcBX/iltKNdxrINgcCXxo7e0pxBfoEG0Fo7EoPteq6AovTnyxKCfMAZoKoPu3jjAujsF4VbAfzUR1rIBqRc4RX18b+AC8WAG81obYmclFKAqvq3bZFT0p0B1XWB3CalSkHFIB/gFbeEOjHQkSBEHekQ933vP5Q6VxFMKaDJF0ykAu19oBHtKQHtWwAiHRKFW3zKY8CnTHjAp+BFeNYfKeQVY6F7prQAAAAASUVORK5CYII=
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560097/Holotower%20TS.user.js
// @updateURL https://update.greasyfork.org/scripts/560097/Holotower%20TS.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // === Settings ===
  const settings = JSON.parse(localStorage.getItem("Thread Settings")) || {};

  const showDeletedCounter = settings.showDeletedCounter ?? true;
  const showDeletedIcon = settings.showDeletedIcon ?? true;
  const showDeletedText = settings.showDeletedText ?? false;
  const hideDeleted = settings.hideDeletedPosts ?? false;
  const showArchivedMessage = settings.showArchivedMessage ?? true;
  const enableFaviconChanges = settings.faviconUpdater ?? true;
  const notifyNewPost = settings.notifyNewPost ?? true;
  const notifyNewYou = settings.notifyNewYou ?? true;
  const changeFaviconOnArchive = settings.changeFaviconOnArchive ?? true;
  const showUnreadLine = settings.showUnreadLine ?? true;
  const appendQuotes = settings.appendQuotes ?? true;
  const appendCrossThread = settings.appendCrossThread ?? false;
  const optionThreading = settings.optionThreading ?? true;
  const enableThreading = settings.enableThreading ?? false;
  const hidePosts = settings.hidePosts ?? true;
  const recursiveHiding = settings.recursiveHiding ?? true;
  const showStubs = settings.showStubs ?? true;
  const filenameChanger = settings.filenameChanger ?? true;
  const linkPreview = settings.linkPreview ?? true;
  const urlUpload = settings.urlUpload ?? true;
  const thumbnailSwap = settings.thumbnailSwap ?? true;
  const linkEmbed = settings.linkEmbed ?? true;
  const translateAuto = settings.translateAuto ?? false;
  const directButton = settings.directButton ?? false;
  const videoHover = settings.videoHover ?? true;
  const videoScrollVol = settings.videoScrollVol ?? true;
  const showSpoilerText = settings.showSpoilerText ?? false;
  const showSpoilerMedia = settings.showSpoilerMedia ?? false;
  const linkIcon = settings.linkIcon ?? true;
  const linkTitle = settings.linkTitle ?? true;
  const randomizeClipboard = settings.randomizeClipboard ?? false;
  const kbOptions = settings.kbOptions || { ctrl: false, alt: true, shift: false, key: "o" };
  const kbThreadToggle = settings.kbThreadToggle || { ctrl: false, alt: false, shift: true, key: "t" };
  const kbThreadNew = settings.kbThreadNew || { ctrl: false, alt: false, shift: false, key: "t" };
  const kbURL = settings.kbURL || { ctrl: false, alt: true, shift: false, key: "l" };
  const persistentEffect = settings.persistentEffect ?? false;
  const persistentDecor = settings.persistentDecor ?? false;
  const enableKbYou = settings.enableKbYou ?? true;
  const kbYouDown = settings.kbYouDown || { ctrl: false, alt: true, shift: false, key: "ArrowDown" };
  const kbYouUp = settings.kbYouUp || { ctrl: false, alt: true, shift: false, key: "ArrowUp" };
  const enableTowerTunes = settings.enableTowerTunes ?? true;
  const kbTowerTunes = settings.kbTowerTunes || { ctrl: false, alt: true, shift: false, key: "m" };


  const FAVICON_URL = window.location.hostname === 'boards.holotower.org'
  ? 'https://boards.holotower.org/favicon.gif'
  : 'https://holotower.org/favicon.gif';
  let alertState = 'none';
  const notifyPostColor = settings.notifyPostColor || "white";
  const notifyYouColor = settings.notifyYouColor || "red";

  const updaterCheckbox = document.getElementById('auto_update_status');
  const hiddenSet = new Set();

  let lastPostCount = null;
  let lastSeenPostId = 0;
  let lastLine = 0;
  let hasUnreadLine = false;
  let currentBoard = null;
  let currentThreadId = null;
  let lowPostWarningCount = 0;
  let isLargeDrop = false;
  let isThreadArchived = false;
  let updaterDisabled = false;
  let currentLastPostId = 0;
  let lastThreadedId = 0;
  let toggleThread = enableThreading;
  let isChristmas = false;
  let isNewYear = false;

  function setFavicon(url) {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
    if (!link.parentNode) document.head.appendChild(link);
  }

  function updateFavicon(color) {
    if (isThreadArchived) return;
    if (alertState === 'red' && color === 'white') return;
    if (alertState === color) return;

    const drawColor = color === 'red' ? notifyYouColor : notifyPostColor;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      ctx.beginPath();
      ctx.arc(canvas.width - 16, 16, 5, 0, 2 * Math.PI);
      ctx.fillStyle = drawColor;
      ctx.fill();

      setFavicon(canvas.toDataURL('image/x-icon'));
      alertState = color;
    };
    img.src = FAVICON_URL;
  }

  function updateFaviconArchived() {
    if (!changeFaviconOnArchive) return;

    isThreadArchived = true;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      if (alertState === 'red') {
        const drawColor = notifyYouColor;
        ctx.beginPath();
        ctx.arc(canvas.width - 16, 16, 5, 0, 2 * Math.PI);
        ctx.fillStyle = drawColor;
        ctx.fill();
      }

      setFavicon(canvas.toDataURL('image/x-icon'));
    };
    img.src = FAVICON_URL;
  }

  function revertFavicon() {
    if (isThreadArchived) return;
    if (alertState !== 'none') {
      setFavicon(FAVICON_URL);
      alertState = 'none';
    }
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      revertFavicon();
      removeUnreadLine();
    }
  });

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const MAX_DIMENSION = 10000;
  const CONVERTIBLE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp']);

  function showMessageNotification(message, options = {}) {
    const { timeout = 15000, single = null } = options;

    let container = $('#notification_container');

    if (!container.length) {
      container = $('<div id="notification_container"></div>');
      $('body').append(container);
    }

    if (single) {
      const existing = container
      .find(`.message_notification[data-single-key="${single}"]`);
      if (existing.length) return;
    }

    const alert = $(`
      <div class="message_notification">
        <div class="notification_div">
          <a class="notification_close" href="javascript:void(0)">
            <i class="fa fa-times"></i>
          </a>
          <div class="alert_message"></div>
        </div>
      </div>
    `);

    if (single) {
      alert.attr('data-single-key', single);
    }

    alert.find('.alert_message').html(
      String(message).replace(/\n/g, '<br>')
    );

    alert.hide();
    container.append(alert);
    alert.fadeIn(300);

    alert.on('click', '.notification_close', function () {
      alert.stop(true).fadeOut(200, () => alert.remove());
    });

    setTimeout(() => {
      alert.stop(true).fadeOut(400, () => alert.remove());
    }, timeout);
  }

  async function checkImageConversion(file) {
    const isImage = file.type && file.type.startsWith('image/');
    if (!isImage) return file;

    const fileExtMatch = (file.name || '').match(/\.([a-z0-9]+)$/i);
    const ext = fileExtMatch ? fileExtMatch[1].toLowerCase() : (file.type ? file.type.split('/')[1].toLowerCase() : '');

    let bitmap = null;
    let origW = null, origH = null;
    let shouldConvert = false;

    try {
      bitmap = await createImageBitmap(file);
      origW = bitmap.width;
      origH = bitmap.height;

      if (file.size > MAX_FILE_SIZE || bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION) {
        shouldConvert = true;
      }
    } catch (e) {
      if (file.size > MAX_FILE_SIZE) shouldConvert = true;
    }

    let lockedInputs = null;
    let previousValues = null;

    if (shouldConvert && CONVERTIBLE_EXTS.has(ext)) {
      const mobileFilenameInput = typeof mobileInput !== 'undefined' && mobileInput
      ? document.querySelector('#mbReplyForm input[name="filename"]')
      : null;

      const filenameInputs = mobileFilenameInput
      ? [mobileFilenameInput]
      : Array.from(document.querySelectorAll('input[name="filename"]'));

      lockedInputs = filenameInputs.filter(Boolean);
      previousValues = lockedInputs.map(i => i.value);

      for (let i = 0; i < lockedInputs.length; i++) {
        lockedInputs[i].value = 'Converting…';
        lockedInputs[i].disabled = true;
        lockedInputs[i].style.opacity = '0.6';
      }
    }

    try {
      if (shouldConvert && CONVERTIBLE_EXTS.has(ext)) {
        const result = await convertToJpeg(file, bitmap, MAX_FILE_SIZE, 0.6);

        if (result?.file) {
          const origRes = (origW && origH) ? `${origW}×${origH}` : 'unknown';
          const convRes = (result.finalWidth && result.finalHeight) ? `${result.finalWidth}×${result.finalHeight}` : 'unknown';

          showMessageNotification(
            `Image was converted to jpg to fit upload limits. It might have lost transparency.<br><br>` +
            `Original: ${origRes} - ${(result.origSize / 1048576).toFixed(2)} MB<br>` +
            `Converted: ${convRes} - ${(result.newSize / 1048576).toFixed(2)} MB<br>` +
            `Quality ≈ ${Math.round(result.qualityUsed * 100)}%`
          );

          return result.file;
        }
      }
    } catch (e) {
      showMessageNotification('Image conversion failed; using original file.');
    } finally {
      if (lockedInputs) {
        for (let i = 0; i < lockedInputs.length; i++) {
          lockedInputs[i].disabled = false;
          lockedInputs[i].style.opacity = '';
          lockedInputs[i].value = previousValues[i] || '';
        }
      }

      if (bitmap && bitmap.close) bitmap.close();
    }

    return file;
  }

  async function convertToJpeg(file, bitmapOrNull = null, targetBytes = MAX_FILE_SIZE, minQuality = 0.6) {
    const bitmap = bitmapOrNull || await createImageBitmap(file);
    const shouldClose = !bitmapOrNull;

    let srcW = bitmap.width;
    let srcH = bitmap.height;
    let scale = 1;
    if (srcW > MAX_DIMENSION || srcH > MAX_DIMENSION) {
      scale = MAX_DIMENSION / Math.max(srcW, srcH);
      srcW = Math.max(1, Math.round(srcW * scale));
      srcH = Math.max(1, Math.round(srcH * scale));
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let bestBlob = null;
    let bestQ = null;
    let bestW = srcW, bestH = srcH;

    const toBlob = (c, q) => new Promise(r => c.toBlob(r, 'image/jpeg', q));

    async function tryExport(width, height) {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);

      const startPercent = 95;
      const stepPercent = 5;
      const minPercent = Math.round(minQuality * 100);

      for (let p = startPercent; p >= minPercent; p -= stepPercent) {
        const q = p / 100;
        const blob = await toBlob(canvas, q);
        if (!blob) continue;

        if (!bestBlob || blob.size < bestBlob.size) {
          bestBlob = blob;
          bestQ = q;
          bestW = width;
          bestH = height;
        }

        if (blob.size <= targetBytes) {
          const newName = (file.name || 'file').replace(/\.[^.]+$/, '') + '.jpg';
          if (shouldClose && bitmap.close) bitmap.close();
          return {
            file: new File([blob], newName, { type: 'image/jpeg' }),
            origSize: file.size,
            newSize: blob.size,
            qualityUsed: q,
            succeeded: true,
            finalWidth: width,
            finalHeight: height
          };
        }
      }

      return null;
    }

    let attempt = await tryExport(srcW, srcH);
    if (attempt) return attempt;

    let currentW = srcW;
    let currentH = srcH;
    const MIN_DIM = 64;
    let passes = 0;
    while (passes < 10 && Math.max(currentW, currentH) >= MIN_DIM) {
      passes++;
      currentW = Math.max(MIN_DIM, Math.round(currentW * 0.9));
      currentH = Math.max(MIN_DIM, Math.round(currentH * 0.9));
      const res = await tryExport(currentW, currentH);
      if (res) return res;
    }

    if (shouldClose && bitmap.close) bitmap.close();

    if (bestBlob) {
      const newName = (file.name || 'file').replace(/\.[^.]+$/, '') + '.jpg';
      const newFile = new File([bestBlob], newName, { type: 'image/jpeg' });
      return {
        file: newFile,
        origSize: file.size,
        newSize: newFile.size,
        qualityUsed: bestQ,
        succeeded: newFile.size <= targetBytes,
        finalWidth: bestW,
        finalHeight: bestH
      };
    }

    throw new Error('Conversion produced no blob');
  }

  function initializeImageConverter() {

    document.addEventListener('paste', () => {
      markClipboardPaste();
    }, true);

    document.addEventListener('change', (e) => {
      const input = e.target;
      if (input.tagName !== 'INPUT' || input.type !== 'file') return;
      if (mobileInput) return;

      const file = input.files?.[0];
      if (!file) return;

      (async () => {
        const converted = await checkImageConversion(file);
        if (converted === file) return;

        const dt = new DataTransfer();
        dt.items.add(converted);
        input.files = dt.files;
      })();
    });

    function simDragDrop(dropzoneEl, file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      try {
        const dragEvent = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt });
        dropzoneEl.dispatchEvent(dragEvent);
        return true;
      } catch (e) {}
      try {
        const evt = document.createEvent('Event');
        evt.initEvent('drop', true, true);
        try { Object.defineProperty(evt, 'dataTransfer', { value: dt }); } catch (defineErr) { evt.dataTransfer = dt; }
        dropzoneEl.dispatchEvent(evt);
        return true;
      } catch (e) {
        return false;
      }
    }

    const thumbs = document.querySelector('.file-thumbs');
    if (thumbs) {
      const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
          const { addedNodes } = mutations[i];

          for (let j = 0; j < addedNodes.length; j++) {
            const node = addedNodes[j];
            if (
              node.nodeType !== 1 ||
              !node.classList.contains('tmb-container')
            ) continue;

            const file = $(node).data('file-ref');
            if (!file) continue;

            (async () => {
              const wasClipboard = isClipboardFile(file);

              const converted = await checkImageConversion(file);
              if (converted === file) return;

              const dropzone = node.closest('.dropzone, .dropzone-wrap, form');
              if (!dropzone) return;

              const removeBtn = node.querySelector('.remove-btn');
              if (removeBtn) removeBtn.click();

              if (wasClipboard) {
                clipboardFiles.add(converted);
              }

              simDragDrop(dropzone, converted);
            })();
          }
        }
      });

      observer.observe(thumbs, { childList: true });
    }

    if (checkMobile()) {
      waitForElement('#mbFileInput', (mbFileInput) => {
        mbFileInput.addEventListener('change', () => {
          const file = mbFileInput.files?.[0];
          if (!file) return;

          (async () => {
            const converted = await checkImageConversion(file);
            if (converted === file) return;

            const dt = new DataTransfer();
            dt.items.add(converted);
            mbFileInput.files = dt.files;
          })();
        });
      });
    }
  }

  function hoverQuoteReplies() {
    document.body.addEventListener('mouseenter', (e) => {
      const link = e.target.closest('a[href*="#"]');
      if (!link) return;

      const match = link.href.match(/#(\d+)$/);
      if (!match) return;
      const postId = match[1];

      requestAnimationFrame(() => {
        const hover = document.getElementById(`post-hover-${postId}`);
        if (!hover) return;

        const originalPost = document.getElementById(`reply_${postId}`) ||
              document.getElementById(`op_${postId}`);
        if (!originalPost) return;
        const mentioned = originalPost.querySelector('.mentioned.unimportant');
        if (!mentioned) return;

        const intro = hover.querySelector('p.intro');
        if (intro && !intro.querySelector('.mentioned.unimportant')) {
          intro.appendChild(mentioned.cloneNode(true));
        }
      });
    }, { capture: true });
  }

  const appendedPostIds = new Set();

  function appendPosts(post, body, smallTags) {
    if (!body) return;

    const postId = post.id.split('_')[1];
    appendedPostIds.add(postId);

    let visibleCount = 0;

    for (let j = 0; j < smallTags.length; j++) {
      if (getComputedStyle(smallTags[j]).display !== 'none') visibleCount++;
    }

    const skipAppendingYou = visibleCount < smallTags.length;

    for (let j = 0; j < smallTags.length; j++) {
      const small = smallTags[j];
      const label = small.textContent.trim();
      if (label !== '(You)' && label !== '(OP)') continue;

      const isVisible = getComputedStyle(small).display !== 'none';
      let target = small.previousSibling;
      while (target && (target.nodeType !== 1 || target.tagName !== 'A')) {
        target = target.previousSibling;
      }

      if (target?.tagName !== 'A') continue;

      if (isVisible) {
        small.setAttribute('style', 'display: none !important;');
        if (label === '(You)' && skipAppendingYou) continue;
        if (!target.textContent.includes(label)) {
          target.textContent += ` ${label}`;
        }
      } else if (label !== '(You)' && !target.textContent.includes(label)) {
        target.textContent += ` ${label}`;
      }
    }

    const links = body.querySelectorAll('a[href*="/res/"]');
    for (let j = 0; j < links.length; j++) {
      const link = links[j];
      const href = link.getAttribute('href');
      const match = href?.match(/\/res\/(\d+)\.html#(\d+)/);
      if (!match) continue;

      const linkThreadId = match[1];
      const quotedPostId = match[2];

      const hasFollowingSmall = link.nextSibling &&
            link.nextSibling.nodeType === 1 &&
            link.nextSibling.tagName === 'SMALL';

      if (quotedPostId === currentThreadId && !hasFollowingSmall && !link.textContent.includes('(OP)')) {
        link.textContent += ' (OP)';
      }

      if (linkThreadId !== currentThreadId && !hasFollowingSmall && !link.textContent.includes('→') && !link.textContent.includes('(Cross-thread)')) {
        link.textContent += appendCrossThread ? ' (Cross-thread)' : ' →';
      }
    }
  }

  function addHideButton(post) {
    if (!hidePosts || post.dataset.hideButton) return;

    post.dataset.hideButton = '1';

    const btn = document.createElement('a');
    btn.className = 'reply hide-button';
    btn.setAttribute('for', post.id);
    btn.href = 'javascript:void(0)';
    btn.innerHTML = `
      <span class="hide-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="minus" viewBox="0 0 448 512">
          <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z" fill="currentColor"/>
        </svg>
      </span>
    `;
    btn.addEventListener('click', () => toggleHidePost(post, btn));
    post.insertAdjacentElement('beforebegin', btn);
  }

  function toggleHidePost(post, btn, recursive = false, originPostId = null, suppressSave = false) {
    const postId = post.id.split('_')[1];
    const isHidden = post.classList.toggle('hidden-post');

    if (!showStubs) {
      post.classList.toggle('hidden-post', isHidden);
      if (btn) btn.classList.toggle('hidden-post', isHidden);

      const br = post.nextElementSibling;
      if (br?.tagName === 'BR') br.classList.toggle('hidden-post', isHidden);
    } else {
      if (isHidden) {
        btn.className = 'reply show-button';
        btn.innerHTML = `
          <span class="show-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="plus" viewBox="0 0 448 512">
              <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" fill="currentColor"/>
            </svg>
          </span>
        `;

        const nameSpan = post.querySelector('p.intro span.name');
        const name = nameSpan ? nameSpan.textContent.trim() : 'Anonymous';

        const hideName = document.createElement('span');
        hideName.className = 'hide-name';
        hideName.textContent = name;

        const hideReason = document.createElement('span');
        hideReason.className = 'hide-reason';
        hideReason.textContent = recursive
          ? ` (Hidden recursively from ${originPostId})`
          : ' (Hidden manually)';

        btn.appendChild(hideName);
        btn.appendChild(hideReason);
      } else {
        btn.className = 'reply hide-button';
        btn.innerHTML = `
          <span class="hide-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="minus" viewBox="0 0 448 512">
              <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z" fill="currentColor"/>
            </svg>
          </span>
        `;
      }
    }

    if (isHidden) {
      hiddenSet.add(postId);
    } else {
      hiddenSet.delete(postId);
    }

    if (!recursive && !suppressSave) {
      const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      if (!latest.hiddenPosts) latest.hiddenPosts = {};
      if (!latest.hiddenPosts[currentBoard]) latest.hiddenPosts[currentBoard] = {};
      if (!latest.hiddenPosts[currentBoard][currentThreadId]) latest.hiddenPosts[currentBoard][currentThreadId] = [];

      const postList = latest.hiddenPosts[currentBoard][currentThreadId];
      const index = postList.indexOf(postId);

      if (isHidden) {
        if (index === -1) postList.push(postId);
      } else {
        if (index !== -1) postList.splice(index, 1);
      }

      localStorage.setItem("Thread Settings", JSON.stringify(latest));
    }

    if (!recursive) {
      toggleRecursive(postId, isHidden ? 'hide' : 'unhide');
    }

    if (
      isHidden &&
      postId === lastLine &&
      showUnreadLine &&
      !hasUnreadLine
    ) {
      removeUnreadLine();
    }

  }

  function toggleRecursive(postId, action = 'hide', visited = new Set()) {
    if (visited.has(postId)) return;
    visited.add(postId);

    const anchors = document.querySelectorAll(`.post.reply .body a[href$="#${postId}"]`);
    for (let i = 0; i < anchors.length; i++) {
      const link = anchors[i];
      const container = link.closest('.post.reply');
      if (!container) continue;

      const replyId = container.id;
      const btn = document.querySelector(`a.reply[for="${replyId}"].hide-button, a.reply[for="${replyId}"].show-button`);
      const alreadyHidden = container.classList.contains('hidden-post');

      if (recursiveHiding) {
        if (action === 'hide' && !alreadyHidden) {
          toggleHidePost(container, btn, true, postId);
          toggleRecursive(replyId.split('_')[1], 'hide', visited);
        } else if (action === 'unhide' && alreadyHidden) {
          toggleHidePost(container, btn, true, postId);
          toggleRecursive(replyId.split('_')[1], 'unhide', visited);
        }
      }

      if (action === 'hide') {
        link.style.textDecoration = 'underline line-through';
      } else {
        link.style.textDecoration = '';
      }
    }
  }

  const threadedPostIds = new Set();
  let threadButton = null;

  const iconStreamable = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOwgAADsIBFShKgAAAAFdQTFRFR3BMD5D6F5T7DpD6DpD6DpD6D5D6EZH6DY79DpD6D5D8D5D6DpD7TqD7D5D6M5v7MZr7DpD6/f7/PZ378Pj/Wqn7ebT84e7+jr/8IpX7xt7+oMb8l8L8dvSONQAAABF0Uk5TAIArtvqSzvIGiCPWHpKm1dj2KFEKAAAAkUlEQVR42k3PbRLBMBSG0ee++bpRjO5/lfxApUkNhnF2cHjZWy4l1x0fbnF+i9V5Oc4/wQGb/1S0D4AciA5NZieimtRjU1xYlUDk3Euv4SEkI7ax3MJd15XEXQAG5o0MoI2oMeW+FBmNatVJY0hbh7yw2u5xwNcxUOgDzlDnPwmxXfi5BACv31xyPpSmUqYkgCeZritCO6onSAAAAABJRU5ErkJggg==';
  const iconPixiv = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAC1QTFRFAJb6AJb6AJb6AJb6////8Pj/5PL+2Or+xeD+qtH9kcP8dLb7Q6X7Epr6AJX6FLjp4QAAAAR0Uk5T/wJx52ZYi2kAAABZSURBVHjaYxAyYAACZkUGBQYwYGIwgDCYgXjP7TVgNl9ZiksNmFHi3uoOYTTwpGwAMzYwTJkAZixgaFkAZkSfdD0AZri4eEEUT8/YAGa0HQBRcCsQlsKcAQAM1xU5J7LrcwAAAABJRU5ErkJggg==';
  const iconVocaroo = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAh1BMVEVHcEw9aRGOrVvH63RjrCAzUxGgxFUhQQNjiC09ZRJfnSMOKACSuktPdiRBYxx3mESEp0N4nD6v0WaQtFGgwlxXhyFEgQ5mqCSqwIat0GLV+X6+4WuTwkmpz1202GOasWTM8HizwGfjOVO/1XjEoGFbY0nW9JGAj1vNzc2pt4d9hmf19fXNYlSGMR5dAAAAGnRSTlMAbW3+/CGfE2ZG3wnukDBDnsPr4cS5j+Wz2uQ4lkcAAACuSURBVHjaBcEFYsMwAATBNUpmCLUnMCbF/78vMwAAppvK0gIAphquwTkXYwUASXdkkuTcCADpS5Ik+fwGwIckrV+HQl4DNJf4u2n5firzCUDvl7+n1p9FChWAqdclZG6VdDFAUzSz5KLkygJI27oZPmMI/pZUAEWf3zHj5H30vgLA5l29vbQd4ZFbAOb2bs99/3fltQWgLyi2fT/VPhIAAGZ3Kpu8BQAgLdPBMFreBWQOpOs51woAAAAASUVORK5CYII=';
  const iconTwitch = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAuIgAALiIBquLdkgAAAB5QTFRFR3BMZEGlZEGlZEGlZEGlZEGlZEGlZEGlZEGlZEGlVumfBAAAAAl0Uk5TABAlQFV/o8vvnShU+QAAAFRJREFUeNpjYJkJBhMY2KeFAkH4BAbOyQxAwApmKDMYQRiRDFMJMoCADcbILGDgnGosaGw6XYCBc+ZM95kzCxlAjM6ZQAEGZuPMGc6GDCAQ2cSADAD/Qx99Dm+XMQAAAABJRU5ErkJggg==';
  const iconTwitter = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAuIgAALiIBquLdkgAAAC1QTFRFR3BMHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHy+JamXQAAAA50Uk5TAAQQHDVMXnaIn8DS4vLdwynJAAAAYUlEQVR42o3OQQ6AMAhE0V8s2NbC/Y9rImqauPHtGIYEPmQjtYguWjHPpMfF0AgFtpxdEY84jJrBDiW7/lygsarAWOZZAFmSBqyV/IA6PJKRyt3Zc9+P96eLtOnuc1jhpxP+pwcBWPTPAQAAAABJRU5ErkJggg==';
  const iconX = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAuIgAALiIBquLdkgAAAJ9JREFUeNqFkcENhCAUROdoC5ZhLGUr2AJswAZswg6sgwaILXDn6mmWDE5icKOZAxPyCA8+MCB2xJ90RMQARPAhEV2lletp7wMEJx7KSihL6ZvhuqxMnJk5nXggHJfAXdiXubT+DoxM3Bh4MJWOOwCdnYWhBZzAbJMWsHuSSebYAnbvT5O9BT52V1uuJn6B3H2VUk381c2YFLX3Yb2N+wd00i149msMYgAAAABJRU5ErkJggg==';

  (function addStyle() {
    if (location.pathname === '/') {
      return;
    }

    const style = document.createElement('style');
    style.id = 'htsu-style';
    let css = `
      .threadingContainer {
        margin-left: 20px;
        background: inherit !important;
        border-color: inherit !important;
        border-width: inherit !important;
        border-style: inherit !important;
        border-left: 1px solid rgba(128, 128, 128, 0.3) !important;
      }
      .reply.hide-button {
        float: left;
        padding: 2px;
        background: inherit !important;
        border-color: inherit !important;
        border-width: inherit !important;
        border-style: inherit !important;
        border-left: none !important;
      }
      .reply.hide-button:not(:hover) {
        opacity: 0.4;
        background: inherit !important;
        border-color: inherit !important;
        border-width: inherit !important;
        border-style: inherit !important;
        border-left: none !important;
      }
      .reply.show-button {
        padding: 2px;
        text-decoration: initial;
        background: inherit !important;
        border-color: inherit !important;
        border-width: inherit !important;
        border-style: inherit !important;
        border-left: none !important;
      }
      .threadingContainer .reply.hide-button {
        margin-left: 2px !important;
        position: relative;
        left: 1px;
      }
      .threadingContainer .reply.show-button {
        margin-left: 2px !important;
        position: relative;
        left: 1px;
      }
      .threadingContainer.post-hover {
        display: none !important;
      }
      svg.plus {
        height: 1em;
        width: 1em;
        display: inline-flex;
        vertical-align: -.150em;
        margin-right: 0.5ch;
      }
      svg.minus {
        height: 1em;
        width: 1em;
        display: inline-flex;
        vertical-align: -.500em;
      }
      .hidden-post {
        display: none !important;
      }
      .hidden-post.post-hover {
        display: inline-block !important;
      }
      .hidden-post.inline-cloned-post {
        display: inline-block !important;
      }
      div.qp[id^="iq-preview-"] > .post {
        display: inline-block !important;
      }
      :root.reply-fit-width .post.reply.hidden-post {
        display: none !important;
      }
      :root.reply-fit-width .post.reply.hidden-post.post-hover {
        display: inline-block !important;
      }
      :root.reply-fit-width .post.reply.hidden-post.inline-cloned-post {
        display: inline-block !important;
      }
      :root.reply-fit-width div.qp[id^="iq-preview-"] > .post {
        display: inline-block !important;
      }
      .post-hover .mentioned {
        word-break: break-word;
      }
      html.mobile-style-new.desktop-floating-mode #mbDesktopFloat #mbRandomizerBtn.active {
        border: 3px solid #ff511c;
        background: rgba(255,81,28,.15)
      }
      html.mobile-style-new #mobileReplyDrawer #mbRandomizerBtn {
        border: 3px solid rgba(255,255,255,.25);
        box-sizing: border-box;
        transition: background-color .15s,border-color .15s,box-shadow .15s;
        padding: .45rem .55rem
      }
      html.mobile-style-new #mobileReplyDrawer #mbRandomizerBtn.active {
        border-color: #ff511c;
        background: rgba(255,81,28,.15)
      }
      #notification_container {
        position: fixed;
        top: 25px;
        left: 0;
        right: 0;
        z-index: 9901;
        pointer-events: none;
        text-align: center;
        background: inherit;
        visibility: hidden;
      }
      .message_notification {
        margin-top: 10px;
        pointer-events: auto;
        background: inherit;
      }
      .notification_div {
        border: 1px solid black;
        display: inline-block;
        position: relative;
        background: inherit;
        visibility: visible;
      }
      .notification_close {
        top: 0px;
        right: 0px;
        position: absolute;
        margin-right: 3px;
        z-index: 100;
      }
      .alert_message {
        margin: 13px;
        font-size: 110%;
      }
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .reply.hide-button,
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .reply.show-button {
        position: absolute;
        transform: translate(-6px, -10px);
      }
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .threadingContainer .reply.hide-button,
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .threadingContainer .reply.show-button {
        transform: translate(0px, 0px);
      }
      .twt-embed,
      .twt-threadwrapper {
        margin: 6px 0;
        background: inherit;
        max-width: 550px;
      }
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .twt-embed,
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .twt-threadwrapper {
        max-width: 100%;
      }
      .twt-header {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 6px;
        justify-self: start;
        color: inherit !important;
        text-decoration: inherit !important;
      }
      .twt-header img.twt-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        flex: 0 0 auto;
      }
      .twt-meta {
        font-size: 13px;
      }
      .twt-meta .handle {
        opacity: 0.5;
        display: block;
      }
      .twt-text {
        margin-bottom: 6px;
      }
      .twt-translate {
        font-size: 12px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
      }
      .twt-translate span {
        opacity: 0.4;
      }
      .photos-grid {
        display: grid;
        gap: 2px;
        grid-template-columns: 1fr 1fr;
      }
      .photos-grid.single {
        grid-template-columns: 1fr;
      }
      .photo-link {
        justify-self: start;
        display: inline-block;
        pointer-events: none;
      }
      .photo-img {
        display: block;
        max-width: 100%;
        max-height: 550px;
        pointer-events: auto;
      }
      .photo-img.expanded {
        max-width: 100%;
        max-height: 100%;
      }
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .photo-img {
        max-height: 100%;
      }
      .twt-video {
        max-width: 100%;
        max-height: 100vh;
        display: block;
      }
      .twt-footer {
        margin-top: 6px;
        font-size: 12px;
        opacity: 0.6;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }
      .twt-footer i.fa {
        opacity: 0.7;
        margin-top: -2px !important;
      }
      .twt-footer span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .twt-embed a {
        text-decoration: none;
        color: inherit;
      }
      .twt-quote {
        border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
        border-radius: 12px;
        max-width: 100%;
        padding: 6px;
      }
      .twt-threadwrapper {
        border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
        border-radius: 12px;
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
      }
      .twt-threadwrapper .twt-replychain {
        border: none !important;
        background: inherit;
        position: relative;
      }
      .twt-threadwrapper .twt-replychain > *:not(.twt-header) {
        margin-left: 45px;
      }
      .twt-replychain::before {
        content: '';
        position: absolute;
        top: 38px;
        left: 16px;
        width: 4px;
        height: calc(100% - 16px);
        background-color: currentColor;
        opacity: 0.2;
        z-index: 0;
      }
      .twt-threadwrapper > .twt-replychain:last-child::before {
        height: 0px;
      }
      .twt-poll {
        border-radius: 6px;
      }
      .twt-poll-choices {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .twt-poll-choice {
        position: relative;
      }
      .twt-poll-bar-bg {
        position: relative;
        background: rgba(0, 0, 0, 0.06);
        padding: 6px 50px 6px 8px;
        overflow: hidden;
      }
      .twt-poll-bar {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, color-mix(in srgb, currentColor 50%, transparent), color-mix(in srgb, currentColor 40%, transparent));
        border-radius: 6px 0 0 6px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 0;
      }
      .twt-poll-label {
        position: relative;
        z-index: 1;
        color: currentColor;
        cursor: default;
      }
      .twt-poll-pct {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        color: currentColor;
      }
      .twt-poll-footer {
        display: flex;
        flex-direction: row;
        margin-top: 6px;
        font-size: 12px;
        opacity: 0.6;
        gap: 8px;
      }
      .embed-active {
        font-weight: bolder;
        text-decoration: underline dotted;
      }
      div.post i.fa-youtube-play,
      div.post i.fa-streamable,
      div.post i.fa-pixiv,
      div.post i.fa-twt,
      div.post i.fa-x,
      div.post i.fa-vocaroo,
      div.post i.fa-twitchtv,
      div.post i.fa-image,
      div.post i.fa-music,
      div.post i.fa-film {
        position: relative;
        display: inline;
        top: 2px !important;
        margin-right: 4px;
      }
      div.post i.fa-youtube-play {
        color: #ff0033;
      }
      .fa-streamable::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconStreamable}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-pixiv::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconPixiv}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-vocaroo::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconVocaroo}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-twitchtv::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconTwitch}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-twt::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconTwitter}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-x::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconX}') center left no-repeat !important;
        padding-left: 16px;
      }
      div.post i.fa-music {
        margin-right: 6px;
      }
      div.post i.fa-film {
        top: 1px !important;
      }
      span.spoiler:hover span.embed-button {
        color: inherit !important;
      }
      span.spoiler span.embed-button {
        color: inherit !important;
      }
      div.boardlist:nth-child(1) {
        transition: all .1s .05s ease-in-out;
      }
      .boardlist:nth-child(1) #watch-pinned {
        display: none !important;
      }
      .desktop-style div.boardlist.fixed,
      .desktop-floating-mode div.boardlist.fixed {
        padding: 4px;
        font-size: 13px;
      }
      div.boardlist.fixed {
      position: fixed !important;
        box-shadow: -5px 1px 10px rgba(0, 0, 0, 0.20) !important;
        border-bottom: 1px solid color-mix(in srgb, currentColor 20%, transparent) !important;
      }
      div.boardlist.fixed.autohide:not(:hover) {
        box-shadow: none !important;
        transition: all .8s .6s cubic-bezier(.55, .055, .675, .19);
        margin-bottom: -1em;
        transform: translateY(-100%);
      }
      .boardlist #autohide-marker {
        left: 0;
        right: 0;
        height: 10px;
        position: absolute;
      }
      .boardlist.fixed #autohide-marker {
        top: 100%;
      }
      .boardlist:not(.autohide) #autohide-marker {
        pointer-events: none;
      }
      .boardlist.fixed ~ a.quick-reply-btn {
        top: 3%;
      }
      .desktop-floating-mode div.boardlist:nth-child(1),
      html:not(.desktop-style) div.boardlist:nth-child(1) {
        margin-top: 0;
      }
      :where(.desktop-floating-mode) :where(.boardlist:nth-child(1)),
      :where(html:not(.desktop-style) .boardlist:nth-child(1)) {
        position: static;
        top: 0;
        left: 0;
        right: 0;
        z-index: 30;
        box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
        border-bottom: 1px solid;
        background: inherit;
      }
      .hb-menu {
        position: absolute;
        display: none;
        background: inherit;
        border: 1px solid rgba(0,0,0,.2);
        padding: 6px;
        z-index: 9999;
        right: 4px;
        border-radius: 3px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        font-size: 9pt;
      }
      .hb-thread-stats,
      .hb-update-secs {
        float: right;
        margin-right: 6px;
        opacity: 0.85;
        white-space: nowrap;
      }
      @layer side-reset;
      @layer side-reset {
        .side-panel.side-extra,
        .side-panel.side-extra * {
          margin: 0;
          padding: 0;
        }
      }
      .side-panel.side-extra,
      .side-panel.side-extra * {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #333333;
        box-sizing: border-box;
      }
      .side-panel.side-extra {
        width: 242px;
        background-color: #ffea93;
        border: 1px solid #cc9933;
        margin-bottom: 10px;
        padding: 6px 5px;
      }
      .side-heading {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-bottom: 4px;
      }
      .side-heading span {
        font-weight: bold;
        cursor: default;
      }
      .side-section-body {
        font-size: 11px;
        line-height: 1.4;
      }
      .music-art {
        display: block;
        margin: 0 auto 4px auto;
        height: 80px;
        width: auto;
      }
      .music-player {
        border: 1px solid #cc9933;
        background-color: #fffdf0;
        padding: 4px;
      }
      .music-display {
        background-color: #fff6c0;
        border: 1px solid #ffdd88;
        padding: 3px 4px;
        margin-bottom: 4px;
      }
      .music-label {
        font-size: 10px;
        text-transform: uppercase;
        color: #666666;
      }
      .music-title {
        font-size: 11px;
        font-weight: bold;
      }
      .music-seek-row {
        margin: 3px 0 5px 0;
      }
      .music-seek {
        width: 100%;
        -webkit-appearance: none;
        appearance: none;
        height: 10px;
        background-color: #ffecb3;
        border: 1px solid #cc9933;
        padding: 0;
      }
      .music-seek::-webkit-slider-runnable-track {
        height: 8px;
        background-color: #fff6c0;
      }
      .music-seek::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 10px;
        height: 14px;
        background-color: #ffcc66;
        border: 1px solid #996600;
        margin-top: -3px;
      }
      .music-seek::-moz-range-track {
        height: 8px;
        background-color: #fff6c0;
      }
      .music-seek::-moz-range-thumb {
        width: 10px;
        height: 14px;
        background-color: #ffcc66;
        border: 1px solid #996600;
      }
      .music-seek::-ms-track {
        height: 8px;
        background-color: transparent;
        border-color: transparent;
        color: transparent;
      }
      .music-seek::-ms-fill-lower,
      .music-seek::-ms-fill-upper {
        background-color: #fff6c0;
      }
      .music-seek::-ms-thumb {
        width: 10px;
        height: 14px;
        background-color: #ffcc66;
        border: 1px solid #996600;
      }
      .music-controls {
        text-align: center;
        margin-bottom: 4px;
      }
      .music-button,
      .tt-reset {
        font-size: 10px;
        padding: 1px 6px;
        margin-right: 2px;
        border: 1px solid #996600;
        background-color: #ffdd77;
        cursor: pointer;
      }
      .music-button:hover,
      .tt-reset:hover {
        background-color: #ffeeaa;
      }
      .music-playlist {
        list-style: square inside;
        font-size: 10px;
        max-height: 80px;
        overflow-y: auto;
      }
      .music-playlist li {
        cursor: pointer;
      }
      .music-playlist li.active {
        background-color: #fff0aa;
        font-weight: bold;
      }
      .tt-menu-btn,
      .tt-close-btn {
        font-family: FontAwesome !important;
        cursor: pointer;
      }
      .tt-volume-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .music-volume {
        width: 100%;
        -webkit-appearance: none;
        appearance: none;
        height: 8px;
        background-color: #ffecb3;
        border: 1px solid #cc9933;
      }
      .music-volume::-webkit-slider-runnable-track {
        height: 6px;
        background-color: #fff6c0;
      }
      .music-volume::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 10px;
        height: 12px;
        background-color: #ffcc66;
        border: 1px solid #996600;
        margin-top: -3px;
      }
      .music-volume::-moz-range-track {
        height: 6px;
        background-color: #fff6c0;
      }
      .music-volume::-moz-range-thumb {
        width: 10px;
        height: 12px;
        background-color: #ffcc66;
        border: 1px solid #996600;
      }
      .music-volume::-ms-track {
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
      .music-volume::-ms-fill-lower,
      .music-volume::-ms-fill-upper {
        background-color: #fff6c0;
      }
      .music-volume::-ms-thumb {
        width: 10px;
        height: 12px;
        background-color: #ffcc66;
        border: 1px solid #996600;
      }
    `;

    if (showSpoilerText) {
      css += `
        span.spoiler {
          color: white !important;
        }
      `;
    } else {
      css += `
        span.spoiler i.fa {
          visibility: hidden;
        }
        span.spoiler:hover i.fa {
          visibility: visible;
        }
      `;
    }

    checkDate();
    if (isChristmas) {
      if (persistentEffect) {
        snowEffect();
      }
      css += `
        .twt-embed a:has(> .twt-avatar)::before {
          content: "";
          position: absolute;
          transform: translate(-16%, 9%);
          width: 54px;
          height: 64px;
          pointer-events: none;
          background: url("https://files.fatbox.moe/4nt2ne.png") no-repeat center/contain;
        }
        .twt-text {
          content: "";
          position: relative;
        }
      `;
      if (persistentDecor) {
        css += `
          .file a:has(> .post-image) {
            position: relative;
          }
          .file a:has(> .post-image)::before {
            content: "";
            position: absolute;
            width: 138px;
            height: var(--decor-height);
            margin-top: -5px;
            margin-left: -138px;
            background: url("https://files.fatbox.moe/4nt2ne.png") no-repeat center/contain;
            pointer-events: none;
            z-index: 2;
          }
        `;
      }
    }

    style.textContent = css;
    document.head.appendChild(style);
  })();

  function applyDecorHeight(context, img) {
    const image = img || context.querySelector('.file a > .post-image');
    if (!image) return;

    const link = image.parentElement;
    const h = image.getBoundingClientRect().height - 10;
    if (h <= 0) return;

    const newHeight = Math.round(h * 1.3);
    link.style.setProperty('--decor-height', `${newHeight}px`);
  }

  function findOverallParentPost(container) {
    let topContainer = container;
    while (topContainer.parentElement?.classList?.contains('threadingContainer')) {
      topContainer = topContainer.parentElement;
    }

    let node = topContainer.previousSibling;
    while (node) {
      if (node.nodeType === 1 && node.tagName === 'BR') {
        let prev = node.previousSibling;
        while (prev) {
          if (
            prev.nodeType === 1 &&
            prev.tagName === 'DIV' &&
            prev.classList.contains('post') &&
            prev.classList.contains('reply')
          ) {
            return prev;
          }
          prev = prev.previousSibling;
        }
      }
      node = node.previousSibling;
    }

    return null;
  }

  const newThreadPosts = new Set();

  function getThreadTargetContainer(post) {
    const body = post.querySelector('.body');
    if (!body) return null;

    const postId = post.id.split('_')[1];
    threadedPostIds.add(postId);

    const links = body.querySelectorAll('a[href*="/res/"]');
    const parentPosts = new Map();
    const containerByPostId = new Map();

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.getAttribute('href');
      const match = href?.match(/\/res\/(\d+)\.html#(\d+)/);
      if (!match) continue;

      const threadId = match[1];
      const targetPostId = match[2];
      if (threadId !== currentThreadId) continue;

      const targetPost = document.getElementById(`reply_${targetPostId}`);
      if (!targetPost) continue;

      let sibling = targetPost.nextSibling;
      while (sibling && !(sibling.nodeType === 1 && sibling.tagName === 'BR')) {
        sibling = sibling.nextSibling;
      }
      if (!sibling) continue;

      let container = sibling.nextSibling;
      if (!(container instanceof HTMLElement) || !container.classList.contains('threadingContainer')) {
        container = document.createElement('div');
        container.className = 'reply threadingContainer';

        const threadWrapper = targetPost.closest('.thread');
        if (threadWrapper) {
          const threadId = threadWrapper.getAttribute('id');
          const board = threadWrapper.getAttribute('data-board');

          if (threadId) container.id = threadId;
          if (board) container.setAttribute('data-board', board);
        }

        sibling.parentNode.insertBefore(container, sibling.nextSibling);
      }

      const parentPost = findOverallParentPost(container);
      if (parentPost) {
        parentPosts.set(targetPostId, parentPost);
        containerByPostId.set(targetPostId, container);
      }
    }

    if (parentPosts.size === 0) return null;

    const uniqueParents = new Set();
    const parentValues = Array.from(parentPosts.values());
    for (let i = 0; i < parentValues.length; i++) {
      uniqueParents.add(parentValues[i]);
    }
    if (uniqueParents.size > 1) return null;

    let highestId = 0;
    const keys = Array.from(containerByPostId.keys());
    for (let i = 0; i < keys.length; i++) {
      const num = parseInt(keys[i], 10);
      if (num > highestId) highestId = num;
    }

    return containerByPostId.get(String(highestId));
  }

  function threadPosts(post) {
    const container = getThreadTargetContainer(post);
    if (!container) return;

    const postId = post.id.split('_')[1];
    const wasLastPost = postId === currentLastPostId;

    const prev = post.previousElementSibling;
    const isHideButton = prev && (prev.classList.contains('hide-button') || prev.classList.contains('show-button'));

    const next = post.nextSibling;
    const hasBr = next && next.nodeType === 1 && next.tagName === 'BR';

    if (isHideButton) container.appendChild(prev);
    container.appendChild(post);
    if (hasBr) container.appendChild(next);

    if (wasLastPost && showUnreadLine) {
      removeUnreadLine();
    }
  }

  function checkThreadable(post) {
    const container = getThreadTargetContainer(post);
    if (!container) return;
    showThreadButton();
  }

  function showThreadButton() {
    if (threadButton) return;

    const container = document.querySelector('#thread-links');
    if (!container) return;

    threadButton = document.createElement('a');
    threadButton.href = 'javascript:void(0)';
    threadButton.className = 'threading-new';
    threadButton.textContent = '[Thread New Posts]';

    threadButton.onclick = () => {
      const ids = Array.from(newThreadPosts);
      ids.sort((a, b) => Number(a) - Number(b));

      let maxThreaded = lastThreadedId;
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const post = document.getElementById(`reply_${id}`);
        if (!post) continue;

        threadPosts(post);

        const num = Number(id);
        if (num > maxThreaded) maxThreaded = num;
      }

      lastThreadedId = maxThreaded;
      newThreadPosts.clear();

      threadButton.remove();
      threadButton = null;
    };

    container.appendChild(threadButton);
  }

  function initializeThreadingToggle() {
    if (!optionThreading) return;

    waitForElement("#watch-thread", (expandImages) => {

      const createToggle = (container, floatDir) => {
        const label = document.createElement('label');
        label.style.cssText = `float: ${floatDir};`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.verticalAlign = 'middle';
        checkbox.checked = enableThreading;

        const linkText = document.createElement('a');
        linkText.href = 'javascript:void(0)';
        linkText.className = 'threading-toggle';
        linkText.textContent = '[Threading]';

        linkText.onclick = () => {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        };

        label.appendChild(checkbox);
        label.appendChild(linkText);
        container.appendChild(label);
        return checkbox;
      };

      const bottomContainer = document.querySelector('#thread-interactions');
      if (!bottomContainer) return;

      const topWrapper = document.createElement('div');

      expandImages.parentNode.insertBefore(topWrapper, expandImages);

      const bottomCheckbox = createToggle(bottomContainer, 'right');
      const topCheckbox = createToggle(topWrapper, 'left');

      const onToggle = (checked) => {
        const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
        toggleThread = checked;
        latest.enableThreading = checked;
        localStorage.setItem('Thread Settings', JSON.stringify(latest));
        bottomCheckbox.checked = checked;
        topCheckbox.checked = checked;

        const posts = document.querySelectorAll('div.post.reply');
        if (checked) {
          for (let i = 0; i < posts.length; i++) {
            threadPosts(posts[i]);
          }
        } else {
          unthreadPosts(posts);
        }
      };

      bottomCheckbox.addEventListener('change', () => onToggle(bottomCheckbox.checked));
      topCheckbox.addEventListener('change', () => onToggle(topCheckbox.checked));
    });
  }

  function unthreadPosts(posts) {
    const threadEl = document.getElementById('thread_' + currentThreadId);
    if (!threadEl) return;

    const opPost = threadEl.querySelector('.post.op');
    if (!opPost) return;

    const sortedPosts = Array.from(posts)
    .filter(post => {
      const postThread = post.closest('.thread');
      return postThread && postThread.id === 'thread_' + currentThreadId;
    })
    .map(post => ({
      id: parseInt(post.id.split('_')[1], 10),
      element: document.getElementById(post.id)
    }))
    .filter(p => p.element)
    .sort((a, b) => a.id - b.id);

    let insertAfter = opPost;

    for (let i = 0; i < sortedPosts.length; i++) {
      const postEl = sortedPosts[i].element;

      const br = (postEl.nextSibling && postEl.nextSibling.tagName === 'BR') ? postEl.nextSibling : null;
      const hideBtn = postEl.previousElementSibling;
      const isHideButton = hideBtn && (hideBtn.classList.contains('hide-button') || hideBtn.classList.contains('show-button'));

      if (isHideButton) {
        threadEl.insertBefore(hideBtn, insertAfter.nextSibling);
        insertAfter = hideBtn;
      }

      threadEl.insertBefore(postEl, insertAfter.nextSibling);
      insertAfter = postEl;

      if (br) {
        threadEl.insertBefore(br, insertAfter.nextSibling);
        insertAfter = br;
      }
    }

    if (threadButton) {
      threadButton.remove();
      threadButton = null;
    }

    const containers = document.querySelectorAll('.threadingContainer');
    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];
      if (!container.querySelector('.post')) {
        container.remove();
      }
    }
    if (showUnreadLine) {
      removeUnreadLine();
    }
  }

  function getYouTubeThumbnail(url) {
    const id = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    );
    return id ? `https://img.youtube.com/vi/${id[1]}/0.jpg` : null;
  }

  function getStreamableThumbnail(url) {
    const id = url.match(/streamable\.com(?:\/e)?\/([a-zA-Z0-9]+)/);
    return id ? `https://thumbs-east.streamable.com/image/${id[1]}.jpg?width=480` : null;
  }

  function waitForDimensions(media, callback) {
    if (media.videoWidth || media.naturalWidth) {
      callback();
      return;
    }
    const check = () => {
      if (media.videoWidth || media.naturalWidth) {
        callback();
      } else {
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  }

  function handleLinkHover(e, allowImages = true) {
    const link = e.currentTarget;
    const href = link.href;
    let src = null;
    let isVideo = false;
    link.isHovering = true;

    if (allowImages && /\.(jpg|jpeg|png|gif|webp|jfif|bmp|avif|jxl)$/i.test(href)) {
      src = href;
    } else if (videoHover && /\.(mp4|webm)$/i.test(href)) {
      src = href;
      isVideo = true;
    } else if (/youtu(?:\.be|be\.com)/.test(href)) {
      const playlistMatch = href.match(/youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/);
      if (playlistMatch) {
        if (link.dataset.videoId) {
          src = `https://img.youtube.com/vi/${link.dataset.videoId}/0.jpg`;
        } else {
          const apiUrl = `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/playlist%3Flist%3D${playlistMatch[1]}&format=json`;
          fetch(apiUrl)
            .then(r => r.json())
            .then(data => {
            if (!link.isHovering) return;

            if (data.thumbnail_url) {
              const vidMatch = data.thumbnail_url.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
              if (vidMatch) {
                link.dataset.videoId = vidMatch[1];
                const thumb = `https://img.youtube.com/vi/${vidMatch[1]}/0.jpg`;
                if (link.isHovering) {
                  handleLinkHover({ currentTarget: link }, allowImages);
                }
              }
            }
          })
            .catch(() => {});
          return;
        }
      } else {
        src = getYouTubeThumbnail(href);
      }
    } else if (/streamable\.com/.test(href)) {
      src = getStreamableThumbnail(href);
    } else if (/^https?:\/\/pbs\.twimg\.com\/media\//.test(href)) {
      src = href;
    }

    if (!src) return;

    let media;
    if (isVideo) {
      media = document.createElement('video');
      media.src = src;
      media.loop = true;
      media.autoplay = true;
      media.id = 'chx_hoverVideo';
      media.style.maxWidth = '100vw';
      media.style.maxHeight = '100vh';
      media.style.position = 'absolute';
      media.style.zIndex = '101';
      media.style.pointerEvents = 'none';

      const savedTime = parseFloat(link.dataset.hoverTime);
      if (!isNaN(savedTime) && savedTime > 0) {
        media.addEventListener('loadedmetadata', () => {
          media.currentTime = savedTime;
        }, { once: true });
      }

      const savedVolume = parseFloat(localStorage.getItem('videovolume'));
      media.volume = !isNaN(savedVolume) ? Math.min(Math.max(savedVolume, 0), 1) : 0.5;

      media.addEventListener('volumechange', () => {
        localStorage.setItem('videovolume', media.volume);
      });
    } else {
      media = document.createElement('img');
      media.src = src;
      media.id = 'chx_hoverImage';
      media.style.position = 'absolute';
      media.style.zIndex = '101';
      media.style.pointerEvents = 'none';
      media.style.maxWidth = '100vw';
      media.style.maxHeight = '100vh';
    }

    document.body.appendChild(media);

    const updatePos = (ev) => {
      const marginBottom = 15;
      const cursorOffsetX = 20;
      const cursorOffsetY = 20;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const w = media.videoWidth || media.naturalWidth;
      const h = media.videoHeight || media.naturalHeight;
      const scale = Math.min(1, (vw - 30) / w, (vh - marginBottom) / h);
      const displayWidth = w * scale;
      const displayHeight = h * scale;

      media.style.width = displayWidth + 'px';
      media.style.height = displayHeight + 'px';

      let left = ev.pageX + cursorOffsetX;
      let top = ev.pageY + cursorOffsetY;

      left = Math.min(left, vw - displayWidth - cursorOffsetX);
      left = Math.max(0, left);

      top = Math.min(top, window.scrollY + vh - displayHeight - marginBottom);
      top = Math.max(0, top);

      media.style.left = left + 'px';
      media.style.top = top + 'px';
    };

    waitForDimensions(media, () => {
      updatePos(e);
    });

    document.addEventListener('mousemove', updatePos);
    link.hoverMove = updatePos;
    link.hoverMedia = media;

    if (isVideo && videoScrollVol) {
      const onWheel = (ev) => {
        ev.preventDefault();
        const delta = ev.deltaY < 0 ? 0.05 : -0.05;
        media.volume = Math.min(1, Math.max(0, media.volume + delta));
        localStorage.setItem('videovolume', media.volume);
      };
      document.addEventListener('wheel', onWheel, { passive: false });
      link.hoverWheel = onWheel;
    }
  }

  function handleLinkOut(e) {
    const link = e.currentTarget;
    const media = link.hoverMedia;
    link.isHovering = false;

    if (media && media.tagName === 'VIDEO') {
      const time = media.currentTime;
      if (time > 0.1) {
        link.dataset.hoverTime = time;
      }
    }

    if (media) media.remove();

    if (link.hoverMove) {
      document.removeEventListener('mousemove', link.hoverMove);
      delete link.hoverMove;
    }
    if (link.hoverWheel) {
      document.removeEventListener('wheel', link.hoverWheel);
      delete link.hoverWheel;
    }
    delete link.hoverMedia;
  }

  function bindLinkPreviews(linkElements, allowImages = true) {
    for (let i = 0; i < linkElements.length; i++) {
      const link = linkElements[i];
      if (link.hoverBound) continue;
      link.addEventListener('mouseenter', (e) => handleLinkHover(e, allowImages));
      link.addEventListener('mouseleave', handleLinkOut);
      link.hoverBound = true;
    }
  }

  const fetchTasks = [];
  let fetchProcessing = false;

  async function fetchQueue(limit = 5) {
    if (fetchProcessing) return;
    fetchProcessing = true;

    async function worker() {
      while (fetchTasks.length > 0) {
        const task = fetchTasks.shift();
        try {
          await task();
        } catch (e) {
        }
      }
    }

    const workers = Array.from({ length: limit }, worker);
    await Promise.all(workers);

    fetchProcessing = false;
  }

  const thumbCanvas = document.createElement('canvas');
  const thumbCtx = thumbCanvas.getContext('2d', { willReadFrequently: true });

  let canvasMutex = Promise.resolve();
  async function withCanvasLock(callback) {
    const prior = canvasMutex;
    let release;
    canvasMutex = new Promise(resolve => { release = resolve; });
    await prior;
    try {
      return await callback();
    } finally {
      release();
    }
  }

  async function checkThumb(imgEl, skip = 4) {
    if (!imgEl.complete) {
      await new Promise(res => {
        imgEl.addEventListener('load', res, { once: true });
        imgEl.addEventListener('error', res, { once: true });
      });
    } else if (typeof imgEl.decode === 'function') {
      try { await imgEl.decode(); } catch (e) {}
    }

    return withCanvasLock(() => {
      try {
        const w = imgEl.naturalWidth || imgEl.width;
        const h = imgEl.naturalHeight || imgEl.height;
        if (!w || !h) return true;

        thumbCanvas.width = w;
        thumbCanvas.height = h;
        thumbCtx.clearRect(0, 0, w, h);
        thumbCtx.drawImage(imgEl, 0, 0, w, h);
        const data = thumbCtx.getImageData(0, 0, w, h).data;

        for (let i = 0; i < data.length; i += 4 * skip) {
          if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
            return true;
          }
        }
        return false;
      } catch {
        return true;
      }
    });
  }

  function thumbSwap(post, fileLink, img, queue = false) {
    if (!thumbnailSwap) return;
    if (!fileLink || !img) return;

    const href = fileLink.getAttribute('href');
    if (!href) return;

    const isPng = href.endsWith('.png');
    const isGif = href.endsWith('.gif');
    const isWebp = href.endsWith('.webp');
    if (!isPng && !isGif && !isWebp) return;
    if (img.src.includes('/static/spoiler')) return;

    function getThumbContainer() {
      let container = document.getElementById('hidden-thumbs');
      if (!container) {
        container = document.createElement('div');
        container.id = 'hidden-thumbs';
        container.style.display = 'none';
        document.body.appendChild(container);
      }
      return container;
    }

    function preserveThumbnail(imgEl) {
      const src = imgEl.getAttribute('src');
      if (!src) return;
      const container = getThumbContainer();
      if (!container.querySelector(`img[data-thumb="${src}"]`)) {
        const hidden = document.createElement('img');
        hidden.src = src;
        hidden.setAttribute('data-thumb', src);
        container.appendChild(hidden);
      }
    }

    const processThumb = async () => {
      try {
        const thumbHasAlpha = await checkThumb(img, 4);
        if (!thumbHasAlpha) return;

        if (isPng || isWebp) {
          preserveThumbnail(img);
          img.src = href;
          return;
        }

        if (isGif) {
          try {
            const resp = await fetch(href);
            const blob = await resp.blob();
            const bitmap = await createImageBitmap(blob, { imageOrientation: 'none' });
            try {
              const cv = document.createElement('canvas');
              const w = img.naturalWidth || img.width || bitmap.width;
              const h = img.naturalHeight || img.height || bitmap.height;
              cv.width = w;
              cv.height = h;
              const cctx = cv.getContext('2d');
              cctx.drawImage(bitmap, 0, 0, w, h);
              preserveThumbnail(img);
              img.src = cv.toDataURL('image/png');
            } finally {
              if (bitmap && typeof bitmap.close === 'function') bitmap.close();
            }
          } catch (e) {}
        }
      } catch (e) {}
    };

    function enqueueOrRun(task) {
      if (queue) {
        if (img.complete) {
          fetchTasks.push(task);
          if (!fetchProcessing) fetchQueue(5);
        } else {
          img.addEventListener('load', () => {
            fetchTasks.push(task);
            if (!fetchProcessing) fetchQueue(5);
          }, { once: true });
        }
      } else {
        task();
      }
    }

    enqueueOrRun(processThumb);
  }

  function handleSpoilerMedia(post, unimportant, fileLink, spoilerImg) {
    if (!showSpoilerMedia) return;
    if (!unimportant || !unimportant.textContent.includes('Spoiler Image')) return;
    if (!fileLink) return;
    if (!spoilerImg) return;

    spoilerImg.removeAttribute('style');
    spoilerImg.style.maxWidth = '125px';
    spoilerImg.style.maxHeight = '125px';

    const href = fileLink.getAttribute('href');
    if (!href) return;

    const isGif = href.endsWith('.gif');
    const isVideo = href.includes('/player.php?v=');

    if (isGif) {
      fetch(href)
        .then(resp => resp.blob())
        .then(async blob => {
        try {
          const bitmap = await createImageBitmap(blob, { imageOrientation: 'none' });
          const cv = document.createElement('canvas');
          cv.width = bitmap.width;
          cv.height = bitmap.height;
          const ctx = cv.getContext('2d');
          ctx.drawImage(bitmap, 0, 0);
          spoilerImg.src = cv.toDataURL('image/png');
          if (typeof bitmap.close === 'function') bitmap.close();
        } catch (e) {}
      })
        .catch(() => {});
      return;
    }

    if (isVideo) {
      const match = href.match(/\/player\.php\?v=([^&]+)/);
      if (match && match[1]) {
        let videoPath = decodeURIComponent(match[1]);
        const thumbPath = videoPath.replace('/src/', '/thumb/').replace(/\.\w+$/, '.jpg');
        spoilerImg.src = thumbPath;
      }
      return;
    }

    spoilerImg.src = href;
  }

  const TWEET_LINK_RE = /^https?:\/\/(?:\w+\.)?(?:twitter|x)\.com\/([^\/]+)\/status\/(\d+)/i;
  const API_PREFIX = 'https://api.fxtwitter.com/';
  const YT_LINK_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const YT_PLAYLIST_RE = /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i;
  const STREAMABLE_LINK_RE = /streamable\.com(?:\/e)?\/([a-zA-Z0-9]+)/i;
  const VOCAROO_LINK_RE = /(?:vocaroo\.com|voca\.ro)\/([a-zA-Z0-9]+)/i;
  const TWITCH_LINK_RE = /(?:www\.)?twitch\.tv\/(?:videos\/(\d+)(?:\?t(?:ime)?=([\dhms]+))?|([a-zA-Z0-9_]+))(?:$|[?#])/i;
  const TWITCH_CLIP_RE = /(?:www\.)?twitch\.tv\/(?:[a-zA-Z0-9_]+\/clip\/|clips\/)([A-Za-z0-9\-]+)/i;
  const IMAGE_RE = /\.(?:jpg|jpeg|png|gif|webp|jfif|bmp|avif|jxl)(?:[?#].*)?$/i;
  const MEDIA_FILE_RE = /\.(?:ogg|mp3|wav|webm|mp4)(?:[?#].*)?$/i;
  const TWIMG_RE = /^https?:\/\/pbs\.twimg\.com\/media\/[^\s]+/i;
  const PIXIV_LINK_RE = /https?:\/\/(?:www\.)?pixiv\.net\/(?:en\/)?artworks\/(\d+)/;
  const LINKIFY_REGEX = /(https?:\/\/[^\s]+)|([@#][^\s]+)/g;
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const translateFrom = settings.translateFrom || "ja, id";
  const isMobileTheme = document.documentElement.matches(
    'html.mobile-style:not(.desktop-floating-mode), html.mobile-style-new:not(.desktop-floating-mode)'
  );
  const gmRequest = (typeof GM !== 'undefined' && GM?.xmlHttpRequest) || (typeof GM_xmlhttpRequest !== 'undefined' && GM_xmlhttpRequest);

  function makeEmbedButton(originalUrl) {
    const wrapper = document.createElement('span');
    wrapper.className = 'embed-container';
    const btn = document.createElement('span');
    btn.className = 'embed-button';
    btn.style.fontWeight = 'bold';
    btn.style.textDecoration = 'underline';
    btn.style.color = 'rgb(221, 0, 0)';
    btn.style.cursor = 'pointer';
    btn.setAttribute('data-embedurl', originalUrl);
    btn.textContent = 'Embed';
    wrapper.appendChild(document.createTextNode(' ['));
    wrapper.appendChild(btn);
    wrapper.appendChild(document.createTextNode('] '));
    return wrapper;
  }

  function revokeObjectURLs(node) {
    if (!node) return;
    const imgs = node.querySelectorAll('img[data-objurl]');
    for (let i = 0; i < imgs.length; i++) {
      const u = imgs[i].dataset.objurl;
      if (u) {
        try { URL.revokeObjectURL(u); } catch {}
        delete imgs[i].dataset.objurl;
      }
    }
    const vids = node.querySelectorAll('video[data-objurl]');
    for (let i = 0; i < vids.length; i++) {
      const u = vids[i].dataset.objurl;
      if (u) {
        try { URL.revokeObjectURL(u); } catch {}
        delete vids[i].dataset.objurl;
      }
      try { vids[i].removeAttribute('src'); vids[i].load(); } catch {}
    }
  }

  function removeEmbedThread(btn) {
    const container = btn.closest('.embed-container') || btn;
    if (!container) return;
    let next = container.nextSibling;
    while (next && next.classList && (next.classList.contains('twt-embed') || next.classList.contains('media-embed'))) {
      const toRemove = next;
      next = next.nextSibling;
      revokeObjectURLs(toRemove);
      toRemove.remove();
    }
    btn.classList.remove('embed-active');
    if (btn.tagName.toLowerCase() !== 'a') {
      btn.textContent = 'Embed';
    }
  }

  function formatTimestamp(unix) {
    if (!unix) return '';
    const date = new Date(unix * 1000);
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2,'0');
    const dd = String(date.getDate()).padStart(2,'0');
    const day = DAYS[date.getDay()];
    const hh = String(date.getHours()).padStart(2,'0');
    const min = String(date.getMinutes()).padStart(2,'0');
    const ss = String(date.getSeconds()).padStart(2,'0');
    return `${mm}/${dd}/${yy} (${day}) ${hh}:${min}:${ss}`;
  }

  function linkifyText(inputText) {
    const fragment = document.createDocumentFragment();
    if (!inputText) return fragment;
    let lastIndex = 0;
    let match;
    LINKIFY_REGEX.lastIndex = 0;
    while ((match = LINKIFY_REGEX.exec(inputText)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(inputText.slice(lastIndex, match.index)));
      }
      const a = document.createElement('a');
      a.target = '_blank';
      a.referrerPolicy = 'no-referrer';
      a.style.textDecoration = 'none';
      a.style.color = 'inherit';
      if (match[1]) {
        a.href = match[1];
        a.textContent = match[1];
      } else {
        const tag = match[2];
        if (tag.startsWith('#')) a.href = `https://x.com/hashtag/${encodeURIComponent(tag.slice(1))}`;
        else a.href = `https://x.com/${tag.slice(1)}`;
        a.textContent = tag;
      }
      fragment.appendChild(a);
      lastIndex = LINKIFY_REGEX.lastIndex;
    }
    if (lastIndex < inputText.length) {
      fragment.appendChild(document.createTextNode(inputText.slice(lastIndex)));
    }
    return fragment;
  }

  async function fetchTweetData(apiUrl) {
    const path = apiUrl.replace(/^https?:\/\/(?:\w+\.)?api\.fxtwitter\.com\//i, '');
    const resp = await fetch(API_PREFIX + path + '/en', { credentials: 'omit' });
    if (!resp.ok) throw new Error('API ' + resp.status);
    const data = await resp.json();
    if (!data || !data.tweet) throw new Error('Invalid API response');
    return data.tweet;
  }

  function makeFailEmbed(replyContext) {
    const embed = document.createElement('div');
    embed.className = 'twt-embed';
    const failText = document.createElement('div');
    failText.style.color = 'red';
    failText.textContent = 'Embed failed';
    embed.appendChild(failText);
    return embed;
  }

  async function fetchGMBlob(url) {
    if (!gmRequest) throw new Error('GM.xmlHttpRequest not available');

    return new Promise((resolve, reject) => {
      gmRequest({
        method: 'GET',
        url,
        responseType: 'blob',
        onload: (resp) => {
          if (resp.status >= 200 && resp.status < 300 && resp.response) resolve(resp.response);
          else reject(new Error('HTTP ' + resp.status));
        },
        onerror: () => reject(new Error('HTTP network error')),
        ontimeout: () => reject(new Error('HTTP request timed out'))
      });
    });
  }

  async function mediaGM(el) {
    if (!el) return;
    const tag = (el.tagName || '').toLowerCase();
    if (tag !== 'img' && tag !== 'video') return;

    if (el.dataset.gmtry === '1') return;
    el.dataset.gmtry = '1';

    if (!gmRequest) {
      try { el.onerror = null; } catch {}
      return;
    }

    const origVisibility = el.style.visibility || '';
    const origSrc = el.getAttribute('src') || '';
    const origPoster = tag === 'video' ? el.getAttribute('poster') || '' : '';
    const origOnerror = el.onerror;

    try { el.onerror = null; } catch {}
    el.style.visibility = 'hidden';

    try {
      const blob = await fetchGMBlob(origSrc || (tag === 'video' && el.currentSrc) || '');
      if (!blob) throw new Error('no blob');

      const objUrl = URL.createObjectURL(blob);
      el.dataset.objurl = objUrl;

      if (tag === 'img') {
        el.removeAttribute('src');
        el.src = objUrl;
        await new Promise((res) => {
          el.onload = el.onerror = function () { el.onload = el.onerror = null; res(); };
        });
        el.style.visibility = origVisibility || '';
      } else {
        try { el.pause(); } catch (e) {}
        const sources = el.querySelectorAll('source');
        for (let i = 0; i < sources.length; i++) sources[i].remove();
        el.removeAttribute('src');
        el.src = objUrl;
        el.load();
        await new Promise((res) => {
          el.onloadeddata = el.onerror = function () { el.onloadeddata = el.onerror = null; res(); };
        });
        el.style.visibility = origVisibility || '';
        if (el.paused && !el.controls) el.controls = true;
      }
    } catch (e) {
      el.style.visibility = origVisibility || '';
      try { el.onerror = null; } catch {}
    } finally {
      try {} catch {}
    }
  }

  function renderTweetEmbed(tweet, replyContext) {
    const embed = document.createElement('div');
    embed.className = 'twt-embed';

    const fragment = document.createDocumentFragment();

    const headerLink = document.createElement('a');
    headerLink.className = 'twt-header';
    headerLink.href = tweet.author?.url || '#';
    headerLink.title = tweet.author?.description || '';
    headerLink.target = '_blank';
    headerLink.referrerPolicy = 'no-referrer';

    const avatar = document.createElement('img');
    avatar.className = 'twt-avatar';
    avatar.src = tweet.author?.avatar_url || '';
    avatar.onerror = () => mediaGM(avatar);
    avatar.alt = '';
    headerLink.appendChild(avatar);

    const meta = document.createElement('div');
    meta.className = 'twt-meta';
    meta.innerHTML = `<strong>${escapeHtml(tweet.author?.name || '')}</strong><br><span class="handle">@${escapeHtml(tweet.author?.screen_name || '')}</span>`;
    headerLink.appendChild(meta);

    fragment.appendChild(headerLink);

    const textBox = document.createElement('div');
    textBox.className = 'twt-text';
    const originalFragment = linkifyText(tweet.text || '');
    const translatedFragment = tweet.translation?.text ? linkifyText(tweet.translation.text) : null;
    textBox.appendChild(originalFragment.cloneNode(true));
    fragment.appendChild(textBox);

    const translation = tweet.translation;

    function normalizeText(text) {
      return (text || '')
        .replace(/@\w+/g, '')
        .replace(/[\p{P}\p{S}]/gu, '')
        .replace(/\s+/g, '')
        .toLowerCase()
        .trim();
    }

    const normalizedOriginal = normalizeText(tweet.text);
    const normalizedTranslation = normalizeText(translation?.text);

    if (
      translation &&
      translation.text &&
      translation.source_lang &&
      translation.target_lang &&
      translation.source_lang !== translation.target_lang &&
      translation.text !== tweet.text &&
      /^[a-z]{2}$/i.test(translation.source_lang) &&
      normalizedOriginal !== normalizedTranslation
    ) {
      const translateContainer = document.createElement('div');
      translateContainer.className = 'twt-translate';

      const sourceLangText = document.createElement('span');
      sourceLangText.textContent = '';

      const translateLink = document.createElement('a');
      translateLink.href = 'javascript:void(0)';
      translateLink.textContent = 'Translate post';

      let isTranslated = false;

      let srcLang = translation.source_lang?.toLowerCase();
      if (srcLang === 'in') srcLang = 'id';

      let srcLangEn = translation.source_lang_en;
      if (!srcLangEn) {
        if (srcLang === 'ja') {
          srcLangEn = 'Japanese';
        } else if (srcLang === 'id') {
          srcLangEn = 'Indonesian';
        }
      } else {
        if (srcLangEn === 'language_in' || srcLangEn === 'language_id') {
          srcLangEn = 'Indonesian';
        } else if (srcLangEn === 'language_ja') {
          srcLangEn = 'Japanese';
        }
      }

      const sourceLang = srcLangEn || srcLang.toUpperCase();

      function applyTranslation(state) {
        textBox.innerHTML = '';
        if (state) {
          textBox.appendChild(translatedFragment.cloneNode(true));
          translateLink.textContent = 'Show original';
          sourceLangText.textContent = `Translated from ${sourceLang} `;
          isTranslated = true;
        } else {
          textBox.appendChild(originalFragment.cloneNode(true));
          translateLink.textContent = 'Translate post';
          sourceLangText.textContent = '';
          isTranslated = false;
        }
      }

      translateLink.addEventListener('click', () => applyTranslation(!isTranslated));

      if (translateAuto && translation.source_lang) {
        const fromList = translateFrom.toLowerCase().split(/[\s,]+/).filter(Boolean);

        if (fromList.includes('all') || fromList.includes('any') || fromList.includes(srcLang)) {
          applyTranslation(true);
        }
      }

      translateContainer.appendChild(sourceLangText);
      translateContainer.appendChild(translateLink);
      fragment.appendChild(translateContainer);
    }

    if (tweet.poll) {
      const p = tweet.poll;
      const pollEl = document.createElement('div');
      pollEl.className = 'twt-poll';

      const choicesWrap = document.createElement('div');
      choicesWrap.className = 'twt-poll-choices';

      const choices = Array.isArray(p.choices) ? p.choices : [];
      if (!choices.length) return;

      let maxPct = -1;
      for (let i = 0; i < choices.length; i++) {
        const val = Number(choices[i].percentage) || 0;
        if (val > maxPct) maxPct = val;
      }

      for (let i = 0; i < choices.length; i++) {
        const ch = choices[i];
        const pct = Math.max(0, Math.min(100, Number(ch.percentage) || 0));
        const pctText = (Math.abs(pct - Math.round(pct)) >= 0.05) ? pct.toFixed(1) + '%' : Math.round(pct) + '%';

        const choiceEl = document.createElement('div');
        choiceEl.className = 'twt-poll-choice';
        const barBg = document.createElement('div');
        barBg.className = 'twt-poll-bar-bg';

        const bar = document.createElement('div');
        bar.className = 'twt-poll-bar';
        bar.style.width = '0%';
        barBg.appendChild(bar);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'twt-poll-label';
        labelSpan.textContent = ch.label || '';
        barBg.appendChild(labelSpan);

        const pctSpan = document.createElement('span');
        pctSpan.className = 'twt-poll-pct';
        pctSpan.textContent = pctText;
        barBg.appendChild(pctSpan);

        if (pct === maxPct) {
          const linkColor = getComputedStyle(document.querySelector('a')).color;

          bar.style.background = `linear-gradient(90deg,
            color-mix(in srgb, ${linkColor} 50%, transparent),
            color-mix(in srgb, ${linkColor} 40%, transparent)
          )`;
          labelSpan.style.fontWeight = 'bolder';
          pctSpan.style.fontWeight = 'bolder';
        }

        choiceEl.appendChild(barBg);
        choicesWrap.appendChild(choiceEl);

        requestAnimationFrame(() => {
          setTimeout(() => {
            bar.style.width = pct + '%';
          }, 10);
        });
      }

      pollEl.appendChild(choicesWrap);

      const footer = document.createElement('div');
      footer.className = 'twt-poll-footer';

      if (typeof p.total_votes === 'number') {
        const votesSpan = document.createElement('span');
        votesSpan.className = 'twt-poll-total';
        votesSpan.textContent = `${p.total_votes} vote${p.total_votes === 1 ? '' : 's'}`;
        footer.appendChild(votesSpan);
      }

      if (p.time_left_en) {
        const timeSpan = document.createElement('span');
        timeSpan.className = 'twt-poll-timeleft';
        timeSpan.textContent = p.time_left_en;
        footer.appendChild(timeSpan);
      }

      pollEl.appendChild(footer);
      fragment.appendChild(pollEl);
    }

    const media = tweet.media || {};
    if (media.all?.length) {
      const items = media.all;
      const photos = [];
      const others = [];

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it.type === 'photo') photos.push(it);
        else others.push(it);
      }

      if (photos.length) {
        const grid = document.createElement('div');
        grid.className = 'photos-grid ' + (photos.length === 1 ? 'single' : '');

        for (let i = 0; i < photos.length; i++) {
          const p = photos[i];
          const a = document.createElement('a');
          a.className = 'photo-link';
          a.href = p.url;
          a.target = '_blank';

          const img = document.createElement('img');
          img.className = 'photo-img';
          img.src = p.url;
          img.onerror = () => mediaGM(img);
          img.dataset.expanded = '0';

          a.appendChild(img);
          grid.appendChild(a);
        }

        const allImagesArray = Array.from(grid.querySelectorAll('img.photo-img'));

        grid.addEventListener('click', (e) => {
          const t = e.target;
          const img = t && (t.matches && t.matches('img.photo-img') ? t : t.closest && t.closest('img.photo-img'));
          if (!img || !grid.contains(img)) return;
          e.preventDefault();

          const expanded = img.dataset.expanded === '1';
          if (!expanded) {
            img.classList.add('expanded');
            img.dataset.expanded = '1';
            for (let j = 0; j < allImagesArray.length; j++) {
              const iel = allImagesArray[j];
              if (iel !== img) iel.style.display = 'none';
            }
            grid.style.gridTemplateColumns = '1fr';
          } else {
            img.classList.remove('expanded');
            img.dataset.expanded = '0';
            for (let j = 0; j < allImagesArray.length; j++) {
              const iel = allImagesArray[j];
              iel.style.removeProperty('display');
            }
            grid.style.removeProperty('grid-template-columns');
          }
        });

        fragment.appendChild(grid);
      }

      for (let k = 0; k < others.length; k++) {
        const item = others[k];
        if ((item.type === 'video' || item.type === 'gif') && item.variants?.length) {
          const videoWrapper = document.createElement('div');
          videoWrapper.className = 'videos-single';

          const video = document.createElement('video');
          video.className = 'twt-video';
          video.controls = true;
          video.loop = item.type === 'gif';
          video.autoplay = item.type === 'gif';

          let best = null;
          const variants = item.variants;
          for (let vi = 0; vi < variants.length; vi++) {
            const v = variants[vi];
            if (v.content_type !== 'video/mp4') continue;
            if (!best || (v.bitrate || 0) > (best.bitrate || 0)) best = v;
          }
          video.src = (best && best.url) || item.url;
          video.onerror = () => mediaGM(video);

          const savedVolume = parseFloat(localStorage.getItem('videovolume'));
          video.volume = !isNaN(savedVolume) ? Math.min(Math.max(savedVolume, 0), 1) : 0.5;
          video.addEventListener('volumechange', () => localStorage.setItem('videovolume', video.volume));
          if (item.thumbnail_url) video.poster = item.thumbnail_url;

          videoWrapper.appendChild(video);
          fragment.appendChild(videoWrapper);
        }
      }
    }

    if (tweet.quote) {
      const quoted = renderTweetEmbed(tweet.quote, replyContext);
      quoted.classList.add('twt-quote');
      fragment.appendChild(quoted);
    }

    const footer = document.createElement('div');
    footer.className = 'twt-footer';

    const formattedTime = formatTimestamp(tweet.created_timestamp);
    const timeEl = document.createElement('span');
    timeEl.textContent = formattedTime;
    footer.appendChild(timeEl);

    if (tweet.replies != null) {
      const repliesEl = document.createElement('span');
      repliesEl.innerHTML = `<i class="fa fa-commenting"></i> ${tweet.replies}`;
      footer.appendChild(repliesEl);
    }
    if (tweet.retweets != null) {
      const retweetsEl = document.createElement('span');
      retweetsEl.innerHTML = `<i class="fa fa-retweet"></i> ${tweet.retweets}`;
      footer.appendChild(retweetsEl);
    }
    if (tweet.likes != null) {
      const likesEl = document.createElement('span');
      likesEl.innerHTML = `<i class="fa fa-heart"></i> ${tweet.likes}`;
      footer.appendChild(likesEl);
    }

    fragment.appendChild(footer);

    embed.appendChild(fragment);
    return embed;
  }

  async function loadThreadAndInsert(initialApiPath, replyContext, insertionPoint, maxDepth = 5) {
    const wrapper = document.createElement('div');
    wrapper.className = 'twt-embed twt-threadwrapper';
    if (!isMobileTheme) {
      const margin = computeEmbedMargin(replyContext);
      if (margin) wrapper.style.marginLeft = margin;
    }

    async function loadReplies(fromTweet, depthLimit) {
      const parents = [];
      let current = fromTweet;

      for (let depth = 0; depth < depthLimit - 1; depth++) {
        const parentUser = current.replying_to || current.replying_to_user || current.replying_to_screen_name || null;
        const parentId = current.replying_to_status || null;
        if (!parentUser || !parentId) break;

        const parentApiPath = encodeURIComponent(parentUser) + '/status/' + encodeURIComponent(parentId);
        try {
          const parentTweet = await fetchTweetData(parentApiPath);
          parents.push(parentTweet);
          current = parentTweet;
        } catch (e) {
          parents.push({ __failed: true });
          break;
        }
      }

      return { parents, lastParent: current };
    }

    let initialTweet;
    try {
      initialTweet = await fetchTweetData(initialApiPath);
    } catch (e) {
      insertionPoint.parentNode.insertBefore(makeFailEmbed(replyContext), insertionPoint.nextSibling);
      return;
    }

    const { parents, lastParent } = await loadReplies(initialTweet, maxDepth);
    const ordered = parents.slice().reverse();
    ordered.push(initialTweet);

    for (let i = 0; i < ordered.length; i++) {
      const item = ordered[i];
      const embedEl = item && !item.__failed
      ? renderTweetEmbed(item, replyContext)
      : makeFailEmbed(replyContext);
      if (i < ordered.length - 1) embedEl.classList.add('twt-replychain');
      wrapper.appendChild(embedEl);
    }

    const hasMore = !!(lastParent.replying_to || lastParent.replying_to_user || lastParent.replying_to_screen_name);

    if (hasMore) {
      const loadMore = document.createElement('a');
      loadMore.href = 'javascript:void(0)';
      loadMore.textContent = 'Load more replies';
      loadMore.className = 'twt-loadmore';
      loadMore.style.textAlign = 'center';
      loadMore.style.marginTop = '6px';
      loadMore.style.marginBottom = '-12px';
      loadMore.style.cursor = 'pointer';

      wrapper.insertBefore(loadMore, wrapper.firstChild);

      loadMore.addEventListener('click', async () => {
        loadMore.textContent = 'Loading…';
        loadMore.style.pointerEvents = 'none';

        const { parents: moreParents, lastParent: newLast } = await loadReplies(lastParent, 5);

        const newOrdered = moreParents.slice();
        for (const parent of newOrdered) {
          const el = parent && !parent.__failed
          ? renderTweetEmbed(parent, replyContext)
          : makeFailEmbed(replyContext);
          el.classList.add('twt-replychain');
          wrapper.insertBefore(el, wrapper.firstChild.nextSibling);
        }

        Object.assign(lastParent, newLast);

        const stillHasMore = !!(newLast.replying_to || newLast.replying_to_user || newLast.replying_to_screen_name);

        if (stillHasMore) {
          loadMore.textContent = 'Load more replies';
          loadMore.style.pointerEvents = '';
        } else {
          loadMore.remove();
        }
      });
    }

    insertionPoint.parentNode.insertBefore(wrapper, insertionPoint.nextSibling);
  }

  function computeEmbedMargin(container) {
    const replyContext = container?.closest?.('.post.reply');
    if (!replyContext || isMobileTheme) return '';

    const thumb = replyContext.querySelector?.('.files .file .post-image');
    if (!thumb) return '';

    const w = thumb.style.width;
    if (!w) return '131px';

    const base = parseFloat(w) || 0;
    return (base + 6) + 'px';
  }

  function makeEmbedWrapper(container) {
    const wrap = document.createElement('div');
    wrap.className = 'media-embed';
    wrap.style.marginTop = '6px';
    wrap.style.marginBottom = '6px';
    const ml = computeEmbedMargin(container);
    if (ml) wrap.style.marginLeft = ml;
    return wrap;
  }

  function createImageEmbed(container, src) {
    const wrap = makeEmbedWrapper(container);

    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.style.maxWidth = '100%';
    img.style.display = 'block';
    img.loading = 'lazy';

    img.addEventListener('error', () => {
      const replyContext = container.closest('.post.reply');
      const failEmbed = makeFailEmbed(replyContext);
      wrap.replaceWith(failEmbed);
    });

    wrap.appendChild(img);
    container.parentNode.insertBefore(wrap, container.nextSibling);
    return wrap;
  }

  function createMediaEmbed(container, src, isAudio = false) {
    const wrap = makeEmbedWrapper(container);

    const tag = isAudio ? 'audio' : 'video';
    const media = document.createElement(tag);
    media.controls = true;
    media.preload = 'metadata';

    if (!isAudio) {
      media.width = 360;
      media.height = 270;
      media.style.maxWidth = '100%';
      media.style.display = 'block';
    } else {
      media.style.display = 'block';
    }

    media.src = src;

    wrap.appendChild(media);
    container.parentNode.insertBefore(wrap, container.nextSibling);
    return wrap;
  }

  async function onEmbedClick(ev) {
    ev.preventDefault?.();
    const btn = ev.currentTarget;
    if (!btn) return;
    const url = btn.getAttribute('data-embedurl');
    if (!url) return;

    const container = btn.closest('.embed-container') || btn;
    const nextEmbed = container?.nextElementSibling;
    const isLink = btn.tagName.toLowerCase() === 'a';

    if (nextEmbed && nextEmbed.classList && (nextEmbed.classList.contains('twt-embed') || nextEmbed.classList.contains('media-embed'))) {
      removeEmbedThread(btn);
      return;
    }

    if (btn.dataset.loading === '1') return;
    btn.dataset.loading = '1';
    btn.classList.add('embed-active');
    if (!isLink) btn.textContent = 'Loading…';

    try {
      const replyContext = btn.closest('.post.reply');
      const insertionPoint = btn.closest('.embed-container') || btn;

      const tweetMatch = url.match(TWEET_LINK_RE);
      if (tweetMatch) {
        const user = tweetMatch[1];
        const id = tweetMatch[2];
        const apiUrl = API_PREFIX + encodeURIComponent(user) + '/status/' + encodeURIComponent(id);
        await loadThreadAndInsert(apiUrl, replyContext, insertionPoint, 5);
        if (!isLink) btn.textContent = 'Remove';
        delete btn.dataset.loading;
        return;
      }

      if (IMAGE_RE.test(url) || TWIMG_RE.test(url)) {
        createImageEmbed(container, url);
        if (!isLink) btn.textContent = 'Remove';
        delete btn.dataset.loading;
        return;
      }

      if (MEDIA_FILE_RE.test(url) || /video\.twimg\.com/i.test(url)) {
        const isAudio = /\.(?:mp3|wav|ogg)(?:[?#].*)?$/i.test(url);
        createMediaEmbed(container, url, isAudio);
        if (!isLink) btn.textContent = 'Remove';
        delete btn.dataset.loading;
        return;
      }

      const embedWrapper = makeEmbedWrapper(container);

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = 360;
      iframe.height = 270;
      iframe.frameBorder = 0;
      iframe.style.margin = '10px 0 0 0';
      iframe.allowFullscreen = true;

      if (url.includes('vocaroo.com')) {
        iframe.height = 75;
        iframe.allowFullscreen = false;
      } else if (url.includes('pixiv.net')) {
        iframe.width = 400;
        iframe.height = 210;
      }

      embedWrapper.appendChild(iframe);
      container.parentNode.insertBefore(embedWrapper, container.nextSibling);
      if (!isLink) btn.textContent = 'Remove';
    } catch (e) {
      const replyContext = btn.closest('.post.reply');
      const insertionPoint = container || btn;
      insertionPoint.parentNode.insertBefore(makeFailEmbed(replyContext), insertionPoint.nextSibling);
      if (!isLink) btn.textContent = 'Remove';
    } finally {
      delete btn.dataset.loading;
    }
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;');
  }

  function processLinks(links, queue = false) {
    if (!linkEmbed && !linkIcon && !linkTitle) return;

    const oembedCache = new Map();

    function bindEmbed(a, embedUrl) {
      if (!linkEmbed) return;
      if (a.dataset.embedBound) return;

      if (directButton) {
        a.classList.add('embed-button');
        a.dataset.embedurl = embedUrl;
        a.addEventListener('click', onEmbedClick);
        a.dataset.embedBound = '1';
      } else {
        const btnWrap = makeEmbedButton(embedUrl);
        const btn = btnWrap.querySelector('.embed-button');
        if (btn) btn.addEventListener('click', onEmbedClick);
        a.parentNode?.insertBefore(btnWrap, a.nextSibling);
        a.dataset.embedBound = '1';
      }
    }

    function enqueueOembed(link, apiUrl, label, iconName) {
      let task;

      if (oembedCache.has(apiUrl)) {
        task = () => oembedCache.get(apiUrl).then(data => applyOembed(link, data, label, iconName));
      } else {
        const promise = fetch(apiUrl)
        .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
        .catch(() => null);
        oembedCache.set(apiUrl, promise);
        task = async () => applyOembed(link, await promise, label, iconName);
      }

      if (queue) {
        fetchTasks.push(task);
        if (!fetchProcessing) fetchQueue(5);
      } else {
        task();
      }
    }

    function applyOembed(link, data, label, iconName) {
      if (!data || !data.title) return;
      const iconHTML = linkIcon ? `<i class="fa fa-${iconName}"></i>` : "";
      link.innerHTML = `${iconHTML}${label} ${data.title}`;
      link.style.textDecoration = "none";
      link.dataset.decorated = '1';
    }

    function prependIcon(link, faName) {
      if (!linkIcon) return;
      if (link.dataset.iconAdded) return;
      link.dataset.iconAdded = "1";
      const icon = document.createElement('i');
      icon.className = `fa fa-${faName}`;
      link.prepend(icon);
      link.dataset.decorated = link.dataset.decorated || '1';
    }

    for (let i = 0; i < links.length; i++) {
      const a = links[i];
      if (!a.href || !a.href.startsWith('http')) continue;

      const host = a.hostname;
      let match;

      if ((linkEmbed && a.dataset.embedBound) && ((linkIcon || linkTitle) && a.dataset.decorated)) continue;

      const maybeNext = a.nextElementSibling;
      if (linkEmbed && maybeNext && maybeNext.classList?.contains('embed-container')) {
        const existingBtn = maybeNext.querySelector('.embed-button');

        if (existingBtn && (IMAGE_RE.test(a.href) || TWIMG_RE.test(a.href))) {
          if (directButton) {
            const embedUrl = existingBtn.getAttribute('data-embedurl') || a.href;
            a.classList.add('embed-button');
            a.setAttribute('data-embedurl', embedUrl);
            a.addEventListener('click', onEmbedClick);
            a.dataset.embedBound = '1';
            maybeNext.remove();
          } else {
            const newBtnWrap = makeEmbedButton(a.href);
            const newBtn = newBtnWrap.querySelector('.embed-button');
            if (newBtn && !newBtn.getAttribute('data-embedurl')) newBtn.setAttribute('data-embedurl', a.href);

            try {
              existingBtn.parentNode.replaceChild(newBtn, existingBtn);
            } catch {
              a.parentNode?.insertBefore(newBtnWrap, a.nextSibling);
              maybeNext.remove();
            }

            newBtn?.addEventListener('click', onEmbedClick);
            a.dataset.embedBound = '1';
            newBtn && (newBtn.dataset.embedBound = '1');
          }
        } else if (existingBtn) {
          if (directButton) {
            const embedUrl = existingBtn.getAttribute('data-embedurl') || a.href;
            a.classList.add('embed-button');
            a.dataset.embedurl = embedUrl;
            a.addEventListener('click', onEmbedClick);
            a.dataset.embedBound = '1';
            maybeNext.remove();
          } else {
            a.dataset.embedBound = '1';
          }
        }
      }

      if (linkEmbed && a.classList.contains('embed-button')) {
        a.dataset.embedBound = '1';
      }

      if ((host.includes('youtube.com') || host === 'youtu.be')) {
        if ((match = a.href.match(YT_LINK_RE))) {
          const videoId = match[1];

          let startSeconds = 0;
          const tMatch = a.href.match(/[?&#](?:t|start)=([\dhms]+)/i);
          if (tMatch) {
            const raw = tMatch[1];
            if (/^\d+$/.test(raw)) {
              startSeconds = +raw;
            } else {
              const hh = raw.match(/(\d+)h/);
              const mm = raw.match(/(\d+)m/);
              const ss = raw.match(/(\d+)s/);
              startSeconds = (hh ? +hh[1] * 3600 : 0) + (mm ? +mm[1] * 60 : 0) + (ss ? +ss[1] : 0);
            }
          }

          if (linkEmbed && !a.dataset.embedBound) {
            let embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
            if (startSeconds > 0) embedUrl += `?start=${startSeconds}`;
            bindEmbed(a, embedUrl);
          }

          if (linkIcon || linkTitle) {
            if (linkIcon) prependIcon(a, 'youtube-play');

            if (linkTitle) {
              const timeLabel = startSeconds > 0
              ? (Math.floor(startSeconds / 3600) > 0
                 ? ` <b>[${Math.floor(startSeconds / 3600)}:${String(Math.floor((startSeconds % 3600) / 60)).padStart(2, "0")}:${String(startSeconds % 60).padStart(2, "0")}]</b>`
                 : ` <b>[${Math.floor(startSeconds / 60)}:${String(startSeconds % 60).padStart(2, "0")}]</b>`)
              : "";

              const apiUrl = `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D${videoId}&format=json`;
              enqueueOembed(a, apiUrl, `[YouTube]${timeLabel}`, 'youtube-play');
            }
          }

          if ((linkEmbed && a.dataset.embedBound) || (linkIcon || linkTitle)) {
            a.dataset.decorated = a.dataset.decorated || '1';
          }
          continue;
        }

        if ((match = a.href.match(YT_PLAYLIST_RE))) {
          const playlistId = match[1];

          if (linkEmbed && !a.dataset.embedBound) {
            bindEmbed(a, `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`);
          }

          if (linkIcon || linkTitle) {
            if (linkIcon) prependIcon(a, 'youtube-play');
            if (linkTitle) {
              const apiUrl = `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/playlist%3Flist%3D${playlistId}&format=json`;
              enqueueOembed(a, apiUrl, `[Playlist]`, 'youtube-play');
            }
          }

          a.dataset.decorated = a.dataset.decorated || '1';
          continue;
        }

        continue;
      }

      if ((host === 'x.com' || host.includes('twitter.com')) && TWEET_LINK_RE.test(a.href)) {
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, a.href);
        if (linkIcon) prependIcon(a, host === 'x.com' ? 'x' : 'twt');
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if (host.includes('streamable.com') && (match = a.href.match(STREAMABLE_LINK_RE))) {
        const id = match[1];
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, `https://streamable.com/e/${id}`);
        if (linkIcon || linkTitle) {
          if (linkIcon) prependIcon(a, 'streamable');
          if (linkTitle) enqueueOembed(a, `https://api.streamable.com/oembed?url=https://streamable.com/${id}`, '[Streamable]', 'streamable');
        }
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if ((host.includes('vocaroo.com') || host === 'voca.ro') && (match = a.href.match(VOCAROO_LINK_RE))) {
        const id = match[1];
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, `https://vocaroo.com/embed/${id}`);
        if (linkIcon) prependIcon(a, 'vocaroo');
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if (host.includes('twitch.tv')) {
        if ((match = a.href.match(TWITCH_CLIP_RE))) {
          const clipId = match[1];
          if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, `https://clips.twitch.tv/embed?clip=${clipId}&parent=${location.hostname}`);
          if (linkIcon) prependIcon(a, 'twitchtv');
          a.dataset.decorated = a.dataset.decorated || '1';
          continue;
        }

        if ((match = a.href.match(TWITCH_LINK_RE))) {
          const vodId = match[1];
          const vodTime = match[2];
          const channel = match[3];
          if (linkEmbed && !a.dataset.embedBound) {
            let embedUrl;
            if (vodId) {
              embedUrl = `https://player.twitch.tv/?video=${vodId}`;
              if (vodTime) embedUrl += `&time=${vodTime}`;
            } else if (channel) {
              embedUrl = `https://player.twitch.tv/?channel=${channel}`;
            }
            embedUrl += `&parent=${location.hostname}`;
            bindEmbed(a, embedUrl);
          }
          if (linkIcon) prependIcon(a, 'twitchtv');
          a.dataset.decorated = a.dataset.decorated || '1';
          continue;
        }
      }

      if (IMAGE_RE.test(a.href) || TWIMG_RE.test(a.href)) {
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, a.href);
        if (linkIcon) prependIcon(a, 'image');
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if (MEDIA_FILE_RE.test(a.href) || host === 'video.twimg.com') {
        if (linkIcon) {
          const ext = a.href.split('.').pop().split(/[?#]/)[0].toLowerCase();
          const isAudio = ext === 'ogg' || ext === 'mp3' || ext === 'wav';
          prependIcon(a, isAudio ? 'music' : 'film');
        }
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, a.href);
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }
    }
  }

  const youPostIds = new Set();

  function trackYouPost(post, smallTags) {
    const postId = post.id.split('_')[1];

    for (let i = 0; i < smallTags.length; i++) {
      if (smallTags[i].textContent.trim() === '(You)') {
        if (!youPostIds.has(postId)) {
          youPostIds.add(postId);
        }
        return;
      }
    }
  }

  function headerBar() {
    const boardlist = document.querySelector('.boardlist');
    if (!boardlist) return;

    const optionsLink = boardlist.querySelector('a[title="Options"]');
    const sub = boardlist.querySelector('.sub[data-description="1"]');
    if (!optionsLink || !sub) return;

    if (!sub.querySelector('a[href$="/catalog.html"]')) {
      const homeLink = sub.querySelector('a[href="/"]');
      if (homeLink) {
        homeLink.insertAdjacentHTML(
          'afterend',
          ` / <a href="/${currentBoard}/catalog.html">catalog</a>`
        );
      }
    }

    const stats = document.createElement('span');
    stats.className = 'hb-thread-stats';

    optionsLink.insertAdjacentElement('afterend', stats);

    function syncThreadStats() {
      const statsRoot = document.getElementById('thread_stats');
      if (!statsRoot) {
        stats.textContent = '';
        stats.removeAttribute('title');
        return;
      }

      const actualEl = statsRoot.querySelector('#thread_stats_posts_actual') || statsRoot.querySelector('#thread_stats_posts');
      const actual = actualEl ? actualEl.textContent.trim() : '0';
      const deletedMatch = statsRoot .querySelector('#thread_stats_posts_deleted') ?.textContent.match(/\d+/);
      const deleted = deletedMatch ? Number(deletedMatch[0]) : 0;
      const images = statsRoot.querySelector('#thread_stats_images')?.textContent.trim() || '0';
      const page = statsRoot.querySelector('#thread_stats_page')?.textContent.trim() || '1';
      const showDeleted = showDeletedCounter && deleted > 0;

      if (showDeleted) {
        stats.textContent = `${actual} / ${deleted} / ${images} / ${page}`;
        stats.title = 'Posts / Deleted / Files / Page';
      } else {
        stats.textContent = `${actual} / ${images} / ${page}`;
        stats.title = 'Posts / Files / Page';
      }
    }

    setTimeout(syncThreadStats, 0);

    headerBar.syncThreadStats = syncThreadStats;

    const updateDisplay = document.createElement('span');
    updateDisplay.className = 'hb-update-secs';
    updateDisplay.title = 'Update now';
    updateDisplay.style.cssText = 'cursor:pointer;';

    stats.insertAdjacentElement('afterend', updateDisplay);

    function syncUpdateSecs() {
      const updateEl = document.getElementById('update_secs');
      if (!updateEl) {
        updateDisplay.textContent = '';
        return;
      }

      const text = updateEl.textContent.trim();
      updateDisplay.textContent =
        /updating/i.test(text) ? '...' : text;
    }

    updateDisplay.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('update_thread')?.click();
    });

    setTimeout(syncUpdateSecs, 0);
    headerBar.syncUpdateSecs = syncUpdateSecs;

    const updateObserverEl = document.getElementById('update_secs');
    if (updateObserverEl) {
      new MutationObserver(syncUpdateSecs).observe(updateObserverEl, {
        childList: true,
        characterData: true
      });
    }

    function applyDefaults(obj, defaults) {
      for (const k in defaults) {
        if (!(k in obj)) obj[k] = defaults[k];
      }
    }

    const towerBtn = document.createElement('a');
    towerBtn.href = 'javascript:void(0)';
    towerBtn.title = 'Tower Tunes';
    towerBtn.style.cssText = 'float:right; margin-right:6px; cursor:pointer;';
    towerBtn.innerHTML = '<i class="fa fa-music"></i>';

    optionsLink.insertAdjacentElement('afterend', towerBtn);

    let ttState = JSON.parse(localStorage.getItem("Tower Tunes") || '{}');

    function saveTT() {
      localStorage.setItem("Tower Tunes", JSON.stringify(ttState));
    }

    applyDefaults(ttState, {
      volume: 0.2,
      shuffle: false,
      repeat: false,
      autoOpen: false,
      x: null,
      y: null
    });

    let panel = null;
    let audio = null;

    let playlist = [];
    let originalPlaylist = [];
    let currentIndex = 0;
    let fetched = false;

    function createPanel() {
      if (panel) return;

      panel = document.createElement('div');
      panel.className = 'side-panel side-extra';
      panel.style.position = 'fixed';
      panel.style.top = ttState.y !== null ? ttState.y + 'px' : '30px';
      panel.style.left = ttState.x !== null ? ttState.x + 'px' : '8px';

      panel.innerHTML = `
        <section class="side-section">
          <h2 class="side-heading" style="display:flex; justify-content:space-between; align-items:center;">
            <span>Tower Tunes</span>
            <span class="tt-controls">
              <i class="fa fa-caret-down tt-menu-btn"></i>
              <i class="fa fa-times tt-close-btn"></i>
            </span>
          </h2>

          <div class="side-section-body">
            <div class="music-player">
              <img src="/static/music.png" class="music-art">

              <div class="music-display">
                <div class="music-label">Now Playing:</div>
                <div id="music-title" class="music-title"></div>
              </div>

              <div class="music-seek-row">
                <input type="range" id="music-seek" class="music-seek" min="0" value="0" step="1">
              </div>

              <div class="music-controls">
                <button id="music-prev" class="music-button">«</button>
                <button id="music-play" class="music-button">Play</button>
                <button id="music-pause" class="music-button">Pause</button>
                <button id="music-next" class="music-button">»</button>
              </div>

              <ul id="music-playlist" class="music-playlist"></ul>
              <audio id="music-audio"></audio>
            </div>
          </div>
        </section>
      `;

      document.body.appendChild(panel);

      setupMenu(panel);
      setupPlayer(panel);
      makeDraggable(panel);

      panel.style.display = 'block';

      requestAnimationFrame(() => {
        viewportCheck(panel);
      });
    }

    function fetchMusic() {
      if (fetched) return;
      fetched = true;

      fetch('/static/homepage_content.json')
        .then(r => r.json())
        .then(data => {
          originalPlaylist = data.music.slice();
          playlist = originalPlaylist.slice();

          if (ttState.shuffle) applyShuffle();

          populatePlaylist();
          loadTrack(0);
        });
    }

    function applyShuffle() {
      const cur = playlist[currentIndex];
      shuffleArray(playlist);
      currentIndex = playlist.indexOf(cur);
    }

    function removeShuffle() {
      const cur = playlist[currentIndex];
      playlist = originalPlaylist.slice();
      currentIndex = playlist.indexOf(cur);
    }

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    function populatePlaylist() {
      const ul = panel.querySelector('#music-playlist');
      ul.innerHTML = '';

      for (let i = 0; i < playlist.length; i++) {
        const track = playlist[i];
        const li = document.createElement('li');
        li.textContent = track.title;
        li.onclick = () => loadTrack(i, true);
        ul.appendChild(li);
      }

      updateActive();
    }

    function updateActive() {
      const lis = panel.querySelectorAll('#music-playlist li');

      for (let i = 0; i < lis.length; i++) {
        lis[i].classList.toggle('active', i === currentIndex);
      }
    }

    let lastNotifiedTrack = null;

    function loadTrack(i, autoplay) {
      if (!playlist[i]) return;

      const track = playlist[i];
      const isNewTrack = currentIndex !== i;

      currentIndex = i;
      audio.src = track.path;
      panel.querySelector('#music-title').textContent = playlist[i].title;
      panel.querySelector('#music-seek').value = 0;
      updateActive();

      if (autoplay) audio.play();

      if (isNewTrack && lastNotifiedTrack !== track.title && panel && panel.style.display === 'none') {
        lastNotifiedTrack = track.title;

        showMessageNotification(
          `Now Playing: ${track.title}`,
          { timeout: 5000 }
        );
      }
    }

    function nextTrack(auto = false) {
      if (auto && ttState.repeat) {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      if (ttState.shuffle && auto) {
        let next;
        do {
          next = Math.floor(Math.random() * playlist.length);
        } while (next === currentIndex && playlist.length > 1);
        loadTrack(next, true);
      } else {
        loadTrack((currentIndex + 1) % playlist.length, true);
      }
    }

    function setupPlayer(container) {
      audio = container.querySelector('#music-audio');
      audio.volume = ttState.volume;

      const seek = container.querySelector('#music-seek');

      audio.addEventListener('timeupdate', () => {
        seek.max = Math.floor(audio.duration || 0);
        seek.value = Math.floor(audio.currentTime);
      });

      seek.oninput = () => { audio.currentTime = seek.value; };

      audio.addEventListener('ended', () => nextTrack(true));

      container.querySelector('#music-play').onclick = () => audio.play();
      container.querySelector('#music-pause').onclick = () => audio.pause();
      container.querySelector('#music-prev').onclick = () => loadTrack((currentIndex - 1 + playlist.length) % playlist.length, true);
      container.querySelector('#music-next').onclick = () => nextTrack(false);
    }

    function setupMenu(container) {
      const menu = document.createElement('div');
      menu.className = 'tt-menu';
      menu.style.display = 'none';

      menu.innerHTML = `
        <div class="tt-volume-row"><label>Volume</label><input type="range" class="music-volume" min="0" max="1" step="0.01"></div>
        <div><label><input type="checkbox" data-key="shuffle"> Shuffle</label></div>
        <div><label><input type="checkbox" data-key="repeat"> Repeat</label></div>
        <div><label><input type="checkbox" data-key="autoOpen"> Auto-open</label></div>
        <div><button class="tt-reset">Reset position</button></div>
      `;

      container.appendChild(menu);

      const vol = menu.querySelector('input[type=range]');
      vol.value = ttState.volume;
      vol.oninput = () => {
        audio.volume = vol.value;
        ttState.volume = +vol.value;
        saveTT();
      };

      const cbs = menu.querySelectorAll('input[type=checkbox]');
      for (let i = 0; i < cbs.length; i++) {
        const cb = cbs[i];

        cb.checked = !!ttState[cb.dataset.key];
        cb.onchange = () => {
          ttState[cb.dataset.key] = cb.checked;

          if (cb.dataset.key === 'shuffle') {
            if (cb.checked) {
              applyShuffle();
            } else {
              removeShuffle();
            }
            populatePlaylist();
          }

          saveTT();
        };
      }

      menu.querySelector('.tt-reset').onclick = () => {
        ttState.x = ttState.y = null;
        saveTT();
        panel.style.top = '30px';
        panel.style.left = '8px';
      };

      container.querySelector('.tt-menu-btn').onclick = () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      };
      container.querySelector('.tt-close-btn').onclick = () => {
        panel.style.display = 'none';
      };
    }

    function makeDraggable(el) {
      let sx, sy, dx, dy;

      el.querySelector('.side-heading').onmousedown = e => {
        sx = e.clientX;
        sy = e.clientY;
        dx = el.offsetLeft;
        dy = el.offsetTop;

        document.onmousemove = m => {
          el.style.left = dx + m.clientX - sx + 'px';
          el.style.top = dy + m.clientY - sy + 'px';
        };

        document.onmouseup = () => {
          ttState.x = el.offsetLeft;
          ttState.y = el.offsetTop;
          saveTT();
          document.onmousemove = document.onmouseup = null;
        };
      };
    }

    function viewportCheck(el) {
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const outside =
        rect.left < 0 ||
        rect.top < 0 ||
        rect.right > vw ||
        rect.bottom > vh;

      if (!outside) return;

      ttState.x = null;
      ttState.y = null;
      saveTT();

      el.style.left = '8px';
      el.style.top = '30px';
    }

    towerBtn.onclick = () => {
      const wasCreated = !!panel;

      createPanel();
      fetchMusic();

      if (wasCreated) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    };

    if (ttState.autoOpen) {
      setTimeout(() => {
        createPanel();
        fetchMusic();
      }, 0);
    }

    if (boardlist.querySelector('.hb-toggle')) return;

    const toggle = document.createElement('a');
    toggle.href = 'javascript:void(0)';
    toggle.title = 'Menu';
    toggle.className = 'hb-toggle';
    toggle.style.cssText = 'float:right; cursor:pointer;';

    const icon = document.createElement('i');
    icon.className = 'fa fa-caret-down';
    toggle.appendChild(icon);

    const menu = document.createElement('div');
    menu.className = 'hb-menu';

    optionsLink.style.marginRight = '4px';
    boardlist.insertBefore(menu, optionsLink);
    boardlist.insertBefore(toggle, optionsLink);

    if (!boardlist.querySelector('#autohide-marker')) {
      const marker = document.createElement('div');
      marker.id = 'autohide-marker';
      boardlist.appendChild(marker);
    }

    function addLinkCheckbox({ label, get, set }) {
      const wrapper = document.createElement('label');
      wrapper.style.display = 'block';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.style.margin = '0 4px 0 0';
      cb.checked = !!get();

      const link = document.createElement('a');
      link.href = 'javascript:void(0)';
      link.textContent = label;

      wrapper.appendChild(cb);
      wrapper.appendChild(link);
      menu.appendChild(wrapper);

      function sync() {
        cb.checked = !!get();
      }

      link.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        set(!get());
        sync();
      });

      cb.addEventListener('click', e => {
        e.stopPropagation();
        set(cb.checked);
      });

      return sync;
    }

    const watchEntry = document.createElement('a');
    watchEntry.href = 'javascript:void(0)';
    watchEntry.style.display = 'block';
    watchEntry.style.cursor = 'pointer';

    menu.appendChild(watchEntry);

    function getWatchLink() {
      return document.querySelector('#watch-thread a');
    }

    function syncWatchLabel() {
      const link = getWatchLink();
      watchEntry.textContent = link && /stop watching/i.test(link.textContent) ? 'Unwatch thread' : 'Watch thread';
    }

    watchEntry.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const link = getWatchLink();
      if (link) link.click();
      setTimeout(syncWatchLabel, 0);
    });

    let syncThreading = null;

    if (optionThreading) {
      syncThreading = addLinkCheckbox({
        label: 'Threading',
        get() {
          return document.querySelector('.threading-toggle')
            ?.closest('label')
            ?.querySelector('input[type="checkbox"]')?.checked;
        },
        set(val) {
          const siteCb = document.querySelector('.threading-toggle')
            ?.closest('label')
            ?.querySelector('input[type="checkbox"]');
          if (siteCb && siteCb.checked !== val) siteCb.click();
        }
      });
    }

    let scrollHandler = null;

    const threadSettings = JSON.parse(localStorage.getItem("Thread Settings") || '{}');

    applyDefaults(threadSettings, {
      headerFixed: true,
      headerAutohide: false,
      headerHideScroll: false
    });

    function saveHeaderSettings() {
      const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      Object.assign(latest, {
        headerFixed: threadSettings.headerFixed,
        headerAutohide: threadSettings.headerAutohide,
        headerHideScroll: threadSettings.headerHideScroll
      });
      localStorage.setItem("Thread Settings", JSON.stringify(latest));
    }

    function applyHeaderClasses() {
      boardlist.classList.toggle('fixed', threadSettings.headerFixed);
      boardlist.classList.toggle('autohide', threadSettings.headerAutohide);
    }

    function setScrollHeader(enabled) {
      if (enabled && !scrollHandler) {
        let prevOffset = 0;

        scrollHandler = () => {
          const offsetY = window.pageYOffset;

          if (offsetY > prevOffset) {
            boardlist.classList.add('autohide', 'scroll');
          } else {
            boardlist.classList.remove('autohide', 'scroll');
          }

          prevOffset = offsetY;
        };

        window.addEventListener('scroll', scrollHandler);
      }
      else if (!enabled && scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;

        boardlist.classList.remove('scroll');

        applyHeaderClasses();
      }
    }

    const headerToggles = [
      {
        label: 'Fixed Header',
        get: () => threadSettings.headerFixed,
        set: v => {
          threadSettings.headerFixed = v;
          applyHeaderClasses();
          saveHeaderSettings();
        }
      },
      {
        label: 'Auto-hide Header',
        get: () => threadSettings.headerAutohide,
        set: v => {
          threadSettings.headerAutohide = v;
          applyHeaderClasses();
          saveHeaderSettings();
        }
      },
      {
        label: 'Auto-hide Header on Scroll',
        get: () => threadSettings.headerHideScroll,
        set: v => {
          threadSettings.headerHideScroll = v;
          setScrollHeader(v);
          saveHeaderSettings();
        }
      }
    ];

    const headerSyncs = headerToggles.map(opt => addLinkCheckbox(opt));

    applyHeaderClasses();
    setScrollHeader(threadSettings.headerHideScroll);

    let open = false;

    function setMenu(openState) {
      if (open === openState) return;
      open = openState;

      menu.style.display = open ? 'block' : 'none';

      if (open) {
        syncWatchLabel();
        syncThreading?.();

        for (let i = 0; i < headerSyncs.length; i++) {
          headerSyncs[i]();
        }

        menu.style.top = `${toggle.offsetHeight}px`;
        document.addEventListener('mousedown', onOutsideClick, true);
      } else {
        document.removeEventListener('mousedown', onOutsideClick, true);
      }
    }

    toggle.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      setMenu(!open);
    };

    function onOutsideClick(e) {
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      setMenu(false);
    }

    menu.addEventListener('mousedown', e => e.stopPropagation());
  }

  function processPost(post) {
    const postId = post.id.split('_')[1];
    const body = post.querySelector('.body') || null;
    const smallTags = body ? body.querySelectorAll('small') : [];
    const bodyLinks = body ? Array.from(body.querySelectorAll('a')) : [];
    const fileLink = post.querySelector('.file a[target="_blank"]') || null;
    const fileImg = fileLink ? fileLink.querySelector('img.post-image') : null;
    const unimportant = post.querySelector('.fileinfo .unimportant') || null;

    trackYouPost(post, smallTags);

    if (optionThreading && toggleThread) {
      newThreadPosts.add(postId);
    }

    if (appendQuotes && !appendedPostIds.has(postId)) {
      appendPosts(post, body, smallTags);
    }

    if (hidePosts) {
      addHideButton(post);

      for (let i = 0; i < bodyLinks.length; i++) {
        const link = bodyLinks[i];
        if (link.getAttribute('rel') === 'nofollow') continue;
        const match = link.textContent.match(/^>>(\d+)/);
        if (!match) continue;
        const quotedId = match[1];
        if (!hiddenSet.has(quotedId)) continue;

        link.style.textDecoration = 'underline line-through';

        if (recursiveHiding) {
          const btn = post.previousElementSibling;
          if (btn && (btn.classList.contains('hide-button') || btn.classList.contains('show-button'))) {
            toggleHidePost(post, btn, true, quotedId, true);
          }
          break;
        }
      }
    }

    if (linkPreview) {
      bindLinkPreviews(bodyLinks, true);
    }

    if (thumbnailSwap) {
      thumbSwap(post, fileLink, fileImg);
    }

    if (linkEmbed || linkIcon || linkTitle) {
      processLinks(bodyLinks);
    }

    if (showSpoilerMedia) {
      handleSpoilerMedia(post, unimportant, fileLink, fileImg);
    }

    if (isChristmas) {
      applyDecorHeight(post, fileImg);
    }
  }

  function initializePosts() {
    const lastPostCountEl = document.getElementById("thread_stats_posts");
    if (lastPostCountEl) {
      lastPostCount = parseInt(lastPostCountEl.textContent, 10);
    }

    const opPost = document.querySelector('.post.op');
    const opImage = opPost ? opPost.previousElementSibling : null;

    const posts = Array.from(document.querySelectorAll('div.post.reply'));

    if (opPost && linkPreview) {
      const opLinks = Array.from(opPost.querySelectorAll('.body a'));
      if (opLinks.length) bindLinkPreviews(opLinks, true);
    }

    if (opImage && thumbnailSwap) {
      const opFileLink = opImage.querySelector ? opImage.querySelector('.file a[target="_blank"]') : null;
      const opImg = opFileLink ? opFileLink.querySelector('img.post-image') : null;

      thumbSwap(opImage, opFileLink, opImg, true);
    }

    if (opImage && showSpoilerMedia) {
      const opUnimportant = opImage.querySelector ? opImage.querySelector('.fileinfo .unimportant') : null;
      const opFileLink = opImage.querySelector ? opImage.querySelector('.file a[target="_blank"]') : null;
      const opSpoilerImg = opFileLink ? opFileLink.querySelector('img.post-image') : null;
      handleSpoilerMedia(opImage, opUnimportant, opFileLink, opSpoilerImg);
    }

    if (linkEmbed || linkIcon || linkTitle) {
      const allPostLinks = Array.from(document.querySelectorAll('.post.reply .body a, .post.op .body a'));
      if (allPostLinks.length) processLinks(allPostLinks, true);
    }

    if (posts.length) {
      const lastPost = posts[posts.length - 1];
      const lastPostId = lastPost.id.split('_')[1];
      lastSeenPostId = lastPostId;
      lastLine = lastPostId;
      lastThreadedId = lastPostId;
      currentLastPostId = lastPostId;
    }

    const hiddenList = settings.hiddenPosts?.[currentBoard]?.[currentThreadId] || [];
    hiddenSet.clear();
    for (let i = 0; i < hiddenList.length; i++) {
      hiddenSet.add(hiddenList[i]);
    }

    const needPerPostProcessing = appendQuotes ||
          (optionThreading && enableThreading) ||
          hidePosts ||
          linkPreview ||
          thumbnailSwap ||
          showSpoilerMedia ||
          linkEmbed || linkIcon || linkTitle ||
          isChristmas;

    if (!needPerPostProcessing) return;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const postId = post.id.split('_')[1];

      processPost(post);

      if (optionThreading && enableThreading) {
        setTimeout(() => {
          threadPosts(post);
        }, 0);
      }

      if (hidePosts && hiddenList.includes(postId)) {
        const btn = document.querySelector(`a.reply[for="${post.id}"].hide-button, a.reply[for="${post.id}"].show-button`);
        if (btn) {
          setTimeout(() => {
            const alreadyHidden = post.classList.contains('hidden-post');
            if (!alreadyHidden) {
              toggleHidePost(post, btn, false, null, true);
            }
          }, 0);
        } else {
          addHideButton(post);
          const createdBtn = document.querySelector(`a.reply[for="${post.id}"].hide-button, a.reply[for="${post.id}"].show-button`);
          if (createdBtn) {
            setTimeout(() => {
              const alreadyHidden = post.classList.contains('hidden-post');
              if (!alreadyHidden) {
                toggleHidePost(post, createdBtn, false, null, true);
              }
            }, 0);
          }
        }
      }
    }

    if (optionThreading) {
      document.addEventListener('click', function (e) {
        const img = e.target;
        if (!img.classList.contains('full-image')) return;

        const anchor = img.closest('a');
        if (!anchor) return;

        const threadingContainer = anchor.closest('.threadingContainer');
        if (!threadingContainer) return;

        const thumb = anchor.querySelector('.post-image');
        if (!thumb) return;

        thumb.style.display = '';
        thumb.style.opacity = '';
        thumb.style.filter = '';
        img.remove();
        $(anchor).removeData('expanded');

        const post_body = $(thumb).closest('.post.reply');
        const still_open = post_body.find('.post-image').filter(function () {
          return $(this).parent().data('expanded') === 'true';
        }).length;

        let padding = 5;

        const boardlist = document.querySelector('.boardlist');
        if (boardlist && getComputedStyle(boardlist).position === 'fixed') {
          padding += boardlist.getBoundingClientRect().height;
        }

        const headerBar = document.querySelector('#header-bar.dialog');
        if (headerBar) {
          const classList = headerBar.classList;

          const hasOnlyAutohide = classList.length === 2 &&
                classList.contains('dialog') &&
                classList.contains('autohide');

          if (!hasOnlyAutohide) {
            const style = getComputedStyle(headerBar);
            const hasBottom = parseFloat(style.bottom) < 1;

            if (style.position === 'fixed' && !hasBottom) {
              padding += headerBar.getBoundingClientRect().height;
            }
          }
        }

        if (still_open > 0) {
          if (thumb.getBoundingClientRect().top - padding < 0) {
            $(document).scrollTop($(thumb).parent().parent().offset().top - padding);
          }
        } else {
          if (post_body[0].getBoundingClientRect().top - padding < 0) {
            $(document).scrollTop(post_body.offset().top - padding);
          }
        }

        e.preventDefault();
        e.stopImmediatePropagation();
      }, true);
    }
  }

  function addUnreadLine() {
    if (!showUnreadLine) return;

    const lastPost = document.querySelector(`#reply_${lastLine}`);
    if (lastPost && !hasUnreadLine) {
      lastPost.style.boxShadow = '0 3px red';
      hasUnreadLine = true;
    }
  }

  function removeUnreadLine() {
    if (!showUnreadLine) return;

    const lastPost = document.querySelector(`#reply_${lastLine}`);
    if (lastPost && hasUnreadLine) {
      lastPost.style.boxShadow = '';
      hasUnreadLine = false;
    }

    const posts = document.querySelectorAll('div.post.reply');
    for (let i = posts.length - 1; i >= 0; i--) {
      const post = posts[i];
      if (
        !post.classList.contains('post-hover') &&
        !post.classList.contains('hidden-post') &&
        !post.classList.contains('deleted-post') &&
        !post.classList.contains('inline-cloned-post')
      ) {
        lastLine = post.id.split('_')[1];
        break;
      }
    }
  }

  function updateThreadStatsActual() {
    if (lastPostCount !== null) {
      const oldElement = document.getElementById('thread_stats_posts');
      if (oldElement) {
        oldElement.style.display = 'none';

        let newElement = document.getElementById('thread_stats_posts_actual');
        if (!newElement) {
          newElement = document.createElement('span');
          newElement.id = 'thread_stats_posts_actual';
          oldElement.parentNode.insertBefore(newElement, oldElement.nextSibling);
        }

        newElement.textContent = lastPostCount;

        const postsDeleted = parseInt(oldElement.textContent) - lastPostCount;

        if (showDeletedCounter) {
          let deletedElement = document.getElementById('thread_stats_posts_deleted');
          if (postsDeleted >= 1) {
            if (!deletedElement) {
              deletedElement = document.createElement('span');
              deletedElement.id = 'thread_stats_posts_deleted';
              const imagesElement = document.getElementById('thread_stats_images');
              if (imagesElement) {
                imagesElement.parentNode.insertBefore(deletedElement, imagesElement);
              }
            }

            deletedElement.textContent = postsDeleted;
            deletedElement.insertAdjacentHTML('beforeend', ' deleted |&nbsp;');
          } else if (deletedElement) {
            deletedElement.remove();
          }
        }

        if (lastPostCount >= 1500) {
          if (enableFaviconChanges && changeFaviconOnArchive) {
            updateFaviconArchived();
          }
          if (showArchivedMessage && !document.getElementById('archived-msg')) {
            addArchivedMessage();
          }
          if (updaterCheckbox?.checked && !updaterDisabled) {
            updaterCheckbox.click();
            updaterDisabled = true;
          }
        } else {
          if (isThreadArchived || updaterDisabled) {
            if (isThreadArchived) {
              isThreadArchived = false;
              setFavicon(FAVICON_URL);
            }
            updaterDisabled = false;
          }
        }
      }
    }
  }

  function snowEffect(duration) {
    if (document.getElementById('snow-container')) return;

    const styleId = 'htsu-snow-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes fall {
          from { transform: translateY(-10vh) translateX(0); }
          to   { transform: translateY(110vh) translateX(var(--wind-shift)); }
        }
        @keyframes spin-only {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .snow-flake {
          position: absolute;
          top: -5vh;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .snow-flake > .inner {
          display: inline-block;
          transform-origin: center;
        }
      `;
      document.head.appendChild(style);
    }

    const layers = [
      {
        weight: 0.50, z: 9995, size: 0.6,
        fall: [14, 20], blur: [1.0, 1.0], op: [0.45, 0.85], wind: 1.4,
        simple: true
      },
      {
        weight: 0.33, z: 9998, size: 1.0,
        fall: [11, 16], blur: [0.9, 1.8], op: [0.55, 0.95], wind: 2.2,
        simple: false
      },
      {
        weight: 0.17, z: 10001, size: 1.4,
        fall: [6, 12], blur: [0.9, 1.7], op: [0.70, 1.0], wind: 2.6,
        simple: false
      }
    ];

    const glyphs = ['✻', '❆', '❅'];
    const rand = (a, b) => a + Math.random() * (b - a);

    function chooseLayer() {
      let r = Math.random();
      for (let i = 0; i < layers.length; i++) {
        r -= layers[i].weight;
        if (r <= 0) return layers[i];
      }
      return layers[2];
    }

    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    Object.assign(snowContainer.style, {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      color: '#f5f5f5',
      zIndex: 9999
    });
    document.body.appendChild(snowContainer);

    let snowActive = true;

    const spawnTimer = setInterval(() => snowActive && spawnFlake(), 150);

    if (duration > 0) {
      setTimeout(() => {
        snowActive = false;
        clearInterval(spawnTimer);
        const cleaner = setInterval(() => {
          if (!snowContainer.hasChildNodes()) {
            snowContainer.remove();
            clearInterval(cleaner);
          }
        }, 500);
      }, duration);
    }

    function spawnFlake() {
      const layer = chooseLayer();

      const fallDur = rand(layer.fall[0], layer.fall[1]);
      const size = (rand(8, 26) * layer.size) | 0;
      const opacity = rand(layer.op[0], layer.op[1]);
      const blur = rand(layer.blur[0], layer.blur[1]);

      const wind = (rand(3, 12) * layer.wind) * (Math.random() < 0.5 ? -1 : 1);
      const windShift = (wind * fallDur) + 'px';

      const flake = document.createElement('div');
      flake.className = 'snow-flake';
      flake.style.left = Math.random() * 100 + '%';
      flake.style.fontSize = size + 'px';
      flake.style.opacity = opacity;
      flake.style.filter = `blur(${blur}px)`;
      flake.style.zIndex = layer.z;
      flake.style.animation = `fall ${fallDur}s linear forwards`;
      flake.style.setProperty('--wind-shift', windShift);

      const inner = document.createElement('span');
      inner.className = 'inner';

      if (layer.simple) {
        inner.textContent = '❆';
        inner.style.transform = 'scale(1)';
      } else {
        inner.textContent = glyphs[Math.floor(Math.random() * 3)];
        inner.style.transform = `scale(${rand(0.85, 1.25)})`;
        inner.style.animation = `spin-only ${rand(1.6, 3.8)}s linear infinite`;
        inner.style.animationDirection = Math.random() < 0.5 ? 'normal' : 'reverse';
      }

      flake.appendChild(inner);
      snowContainer.appendChild(flake);

      setTimeout(() => {
        flake.style.opacity = '0';
        setTimeout(() => flake.remove(), 450);
      }, (fallDur + 0.25) * 1000);
    }
  }

  function checkDate() {
    const nowLocal = new Date();
    const nowJST = new Date(nowLocal.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

    const isMD = (d, m, day) => d.getMonth() === m && d.getDate() === day;

    if (isMD(nowJST, 11, 25) || isMD(nowLocal, 11, 25)) {
      isChristmas = true;
      isNewYear = false;
      return "christmas";
    }

    const isLocalNYE = isMD(nowLocal, 11, 31);
    const isLocalNY = isMD(nowLocal, 0, 1);
    const isJSTNYE = isMD(nowJST, 11, 31);
    const isJSTNY = isMD(nowJST, 0, 1);

    if (isLocalNYE || isLocalNY || isJSTNYE || isJSTNY) {
      isChristmas = false;
      isNewYear = true;
      return "newyear";
    }

    isChristmas = false;
    isNewYear = false;
    return null;
  }

  function addArchivedMessage() {
    const postControlsForm = document.forms["postcontrols"];
    if (!postControlsForm) return;

    function scaleLength(value, factor) {
      if (typeof value !== 'string') return value;

      const match = value.trim().match(/^([\d.]+)([a-z%]+)$/i);
      if (!match) return value;

      const num = parseFloat(match[1]);
      const unit = match[2];

      return (num * factor) + unit;
    }

    const holiday = checkDate();
    const isChristmas = holiday === "christmas";

    const archivedMsg = document.createElement('div');
    archivedMsg.id = 'archived-msg';
    archivedMsg.style.marginTop = '-25px';
    archivedMsg.style.marginBottom = '20px';

    const messageText = settings.archivedMessageText || "THREAD ARCHIVED";
    const imageURL = settings.archivedImageURL || "https://i.imgur.com/LQHVLil.png";
    const fontSize = settings.archivedMessageFontSize || "14px";
    const imageSize = settings.archivedImageSize || "7%";
    const useHeight = settings.archivedImageUseHeight;
    const christmasURL = "https://files.fatbox.moe/4nt2ne.png";
    const christmasSize = scaleLength(imageSize, 1.3);

    archivedMsg.innerHTML = `
      <strong style="color: red; font-size: ${fontSize};">${messageText}</strong><br>
      <img src="${imageURL}" alt="Archived Image" style="margin-top: 5px; ${useHeight ? `height` : `width`}: ${imageSize};">
      ${isChristmas ? `
        <img src="${christmasURL}" alt="" class="archived-christmas" style="position: absolute; ${useHeight ? 'height' : 'width'}: ${christmasSize}; transform: translateY(-5%) translateX(-82%); pointer-events: none;">
      ` : ''}
    `;

    postControlsForm.parentNode.insertBefore(archivedMsg, postControlsForm.nextSibling);

    if (!holiday) return;

    if (holiday === "christmas") {
      snowEffect(25000);
    } else if (holiday === "newyear") {
      // fireworksEffect(25000);
      return;
    }

    const cloned = archivedMsg.cloneNode(true);
    cloned.id = 'archived-msg-clone';

    Object.assign(cloned.style, {
      position: 'fixed',
      bottom: '1%',
      left: '1%',
      zIndex: 10000,
      opacity: 0,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: 'none'
    });

    document.body.appendChild(cloned);

    requestAnimationFrame(() => {
      cloned.style.opacity = 1;
    });

    let cloneRemoved = false;

    function removeClone() {
      if (cloneRemoved) return;
      cloneRemoved = true;
      cloned.style.opacity = 0;
      setTimeout(() => cloned.remove(), 500);
      observer.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          removeClone();
        }
      },
      {
        threshold: 0,
        rootMargin: "20% 0px"
      }
    );

    observer.observe(archivedMsg);

    setTimeout(removeClone, 25000);
  }

  const justPostedIds = new Set();

  function threadMonitoring() {
    (function(open) {
      XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;

        if (currentThreadId) {
          const target = `/res/${currentThreadId}.html`;
          this._monitored = url.includes(target) && url.indexOf(target) + target.length === url.length;
        } else {
          this._monitored = false;
        }

        this._isThreadsJson = monitorThreadsJson && url.includes("/threads.json");
        return open.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.open);

    (function(send) {
      XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', () => {
          if (this._monitored) {
            if (this.status === 200) {
              const lastModified = this.getResponseHeader("Last-Modified");
              if (checkSync(lastModified)) {
                syncPostStatus(this.responseText);
                headerBar.syncThreadStats();
              }
            } else if (this.status === 404) {
              if (enableFaviconChanges && changeFaviconOnArchive) {
                updateFaviconArchived();
              }
              if (showArchivedMessage && !document.getElementById('archived-msg')) {
                addArchivedMessage();
              }
              const pageEl = document.getElementById('thread_stats_page');
              if (pageEl?.textContent.trim() === '???' && updaterCheckbox?.checked) {
                updaterCheckbox.click();
              }
            }
          }

          if (this._isThreadsJson && this.status === 200) {
            cleanThreadStorage(this.responseText);
          }
        });
        return send.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.send);

    let lastModifiedPrevious = null;

    function checkSync(lastModified) {
      if (!lastModified) {
        return false;
      }

      if (lastModified === lastModifiedPrevious) {
        return false;
      }

      lastModifiedPrevious = lastModified;
      return true;
    }

    $(document).on('ajax_after_post', function(e, post_response) {
      if (post_response && post_response.id) {
        const idStr = String(post_response.id);
        justPostedIds.add(idStr);
        setTimeout(() => justPostedIds.delete(idStr), 10000);
      }
    });

    $(document).on('new_post', (e, post) => {
      processPost(post);
    });

    $(document).ajaxError(function (e, xhr) {
      if (
        xhr &&
        xhr.status === 403 &&
        typeof xhr.responseText === 'string' &&
        xhr.responseText.includes('<title>Managed challenge</title>')
      ) {
        loadChallengeOverlay();
      }
    });
  }

  let sitekey = null;

  function extractSitekey(callback) {
    const script = document.createElement('script');
    script.textContent = `
      (() => {
        let key = null;
        if (typeof window.loadChallenge === "function") {
          const match = window.loadChallenge.toString().match(/sitekey\\s*=\\s*['"]([^'"]+)['"]/);
          key = match ? match[1] : null;
        }
        window.dispatchEvent(new CustomEvent("cf-sitekey", { detail: key }));
      })();
    `;
    document.documentElement.appendChild(script);
    script.remove();

    window.addEventListener("cf-sitekey", (e) => {
      callback(e.detail);
    }, { once: true });
  }

  function initializeSiteKey() {
    if (sitekey) return;
    extractSitekey((result) => {
      if (result) {
        sitekey = result;
      }
    });
  }

  function loadChallengeOverlay() {
    if (!sitekey) {
      initializeSiteKey();
    }

    if (!sitekey) {
      return;
    }

    if (document.getElementById('cf-challenge-overlay')) return;

    const dimmer = document.createElement('div');
    dimmer.id = 'cf-challenge-overlay';
    dimmer.style.position = 'fixed';
    dimmer.style.top = '0';
    dimmer.style.left = '0';
    dimmer.style.width = '100vw';
    dimmer.style.height = '100vh';
    dimmer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dimmer.style.zIndex = '9999';
    dimmer.style.display = 'flex';
    dimmer.style.alignItems = 'center';
    dimmer.style.justifyContent = 'center';

    const box = document.createElement('div');
    const siteBg = getComputedStyle(document.body).background || '#fff';
    box.style.background = siteBg;
    box.style.position = 'relative';
    box.style.padding = '20px';
    box.style.borderRadius = '10px';
    box.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
    box.style.textAlign = 'center';

    const closeBtn = document.createElement('a');
    closeBtn.id = 'alert_close';
    closeBtn.href = 'javascript:void(0)';
    closeBtn.style.display = 'none';
    closeBtn.innerHTML = '<i class="fa fa-times"></i>';
    closeBtn.addEventListener('click', () => {
      dimmer.remove();
    });

    const challengeDiv = document.createElement('div');
    challengeDiv.id = 'cf-turnstile';

    box.appendChild(closeBtn);
    box.appendChild(challengeDiv);
    dimmer.appendChild(box);
    document.body.appendChild(dimmer);

    const fallbackTimer = setTimeout(() => {
      closeBtn.style.display = 'inline-block';
    }, 10000);

    turnstile.render('#cf-turnstile', {
      sitekey,
      callback: () => {
        clearTimeout(fallbackTimer);
        dimmer.remove();
      },
      'error-callback': () => {
        clearTimeout(fallbackTimer);
        closeBtn.style.display = 'inline-block';
      },
    });
  }

  function syncPostStatus(responseText) {
    if (!currentThreadId) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(responseText, "text/html");
    const currentPosts = document.querySelectorAll('div.post.reply');
    const updatePosts = doc.querySelectorAll('div.post.reply');
    const postCount = updatePosts.length;
    const lastPost = currentPosts[currentPosts.length - 1];

    if (lastPost) {
      currentLastPostId = lastPost.id.split('_')[1];
    }

    if (postCount > 0) {
      const postDrop = lastPostCount - postCount;
      isLargeDrop = lastPostCount > 200 ? postDrop >= 100 : (postDrop / lastPostCount) >= 0.3;

      if (isLargeDrop && lastPostCount >= 10) {
        lowPostWarningCount++;

        if (lowPostWarningCount >= 2) {
          lastPostCount = postCount;
          updateThreadStatsActual();
        }
      } else {
        lowPostWarningCount = 0;
        lastPostCount = postCount;
        updateThreadStatsActual();
      }
    }

    if (postCount === 0) return;

    const updatePostIds = new Set();
    let seenRed = false;
    let seenWhite = false;
    let ownPostIds = new Set();
    if (enableFaviconChanges && notifyNewYou && alertState !== 'red') {
      try {
        const board = document.querySelector('input[name="board"]')?.value;
        const ownPosts = JSON.parse(localStorage.own_posts || '{}');
        ownPostIds = board && ownPosts[board] ? new Set(ownPosts[board]) : new Set();
      } catch (e) {

      }
    }

    let lastInsertedNode = null;

    for (let i = 0; i < updatePosts.length; i++) {
      const post = updatePosts[i];
      const postId = post.id.split('_')[1];
      updatePostIds.add(postId);

      if (Number(postId) > Number(lastSeenPostId)) {
        lastSeenPostId = postId;
        if (!hasUnreadLine) addUnreadLine();

        if (enableFaviconChanges) {
          if (notifyNewYou && alertState !== 'red') {
            const bodyLinks = post.querySelectorAll('div.body a:not([rel="nofollow"])');
            for (let j = 0; j < bodyLinks.length; j++) {
              const match = bodyLinks[j].textContent.match(/^>>(\d+)$/);
              if (match && ownPostIds.has(match[1])) {
                seenRed = true;
                break;
              }
            }
          }

          if (!seenRed && notifyNewPost) {
            seenWhite = true;
          }
        }
      }

      let currentPost = null;

      const updateBans = post.querySelector('span.public_ban');
      if (updateBans) {
        currentPost = currentPost || document.getElementById('reply_' + postId);
        if (currentPost && !currentPost.querySelector('span.public_ban')) {
          const currentBody = currentPost.querySelector('div.body');
          if (currentBody) {
            currentBody.appendChild(updateBans.cloneNode(true));
          }
        }
      }

      if (optionThreading && toggleThread && !threadedPostIds.has(postId)) {
        const currentPost = document.getElementById('reply_' + postId);
        if (currentPost) {
          const container = currentPost.closest('.threadingContainer');
          if (container) {
            let topContainer = container;
            while (topContainer.parentElement?.classList?.contains('threadingContainer')) {
              topContainer = topContainer.parentElement;
            }

            const parent = topContainer.parentNode;
            const prev = currentPost.previousElementSibling;
            const isHideButton = prev && (prev.classList.contains('hide-button') || prev.classList.contains('show-button'));
            const br = currentPost.nextSibling;
            const hasBr = br && br.nodeType === 1 && br.tagName === 'BR';
            const insertAfter = lastInsertedNode || topContainer;

            let insertPoint = insertAfter.nextSibling;

            if (isHideButton) {
              parent.insertBefore(prev, insertPoint);
              lastInsertedNode = prev;
              insertPoint = lastInsertedNode.nextSibling;
            }

            parent.insertBefore(currentPost, insertPoint);
            lastInsertedNode = currentPost;
            insertPoint = lastInsertedNode.nextSibling;

            if (hasBr) {
              parent.insertBefore(br, insertPoint);
              lastInsertedNode = br;
            }
          }

          if (!threadButton) {
            checkThreadable(currentPost);
          }
        }
      }
    }

    if (seenRed) {
      updateFavicon('red');
    } else if (seenWhite) {
      updateFavicon('white');
    }

    if ((hideDeleted || showDeletedIcon) && (!isLargeDrop || lowPostWarningCount >= 2)) {
      for (let i = 0; i < currentPosts.length; i++) {
        const post = currentPosts[i];
        if (post.closest('.post.qp.reply') || post.classList.contains('post-hover')) continue;

        const postId = post.id.split('_')[1];
        const threadEl = post.closest('.thread');
        if (!threadEl) continue;
        const xthreadId = threadEl.id.split('_')[1];
        if (xthreadId !== currentThreadId) continue;

        const inlineQuoteContainer = post.closest('.inline-quote-container');
        const refId = inlineQuoteContainer?.getAttribute('data-inlined-id') || postId;

        const isDeleted = !updatePostIds.has(refId) && !justPostedIds.has(refId);

        let btn = null;
        const prev = post.previousElementSibling;
        if (prev && (prev.classList.contains('hide-button') || prev.classList.contains('show-button'))) {
          btn = prev;
        }

        if (isDeleted) {
          if (hideDeleted) {
            if (!inlineQuoteContainer) {
              post.classList.add('deleted-post');
              post.style.setProperty("display", "none", "important");
              const br = post.nextElementSibling;
              if (br?.tagName === "BR") {
                br.style.setProperty("display", "none", "important");
              }
            }
            if (btn) {
              btn.style.setProperty("display", "none", "important");
            }
          } else {
            addDeletedIcon(post);
          }
        } else {
          post.classList.remove('deleted-post');
          post.style.removeProperty("display");
          const br = post.nextElementSibling;
          if (br?.tagName === "BR") {
            br.style.removeProperty("display");
          }
          if (btn) {
            btn.style.removeProperty("display");
          }
          if (!hideDeleted && post.querySelector('.deleted-post')) {
            removeDeletedIcon(post);
          }
        }
      }
    }
  }

  function addDeletedIcon(post) {
    if (!showDeletedIcon) return;
    if (!post.querySelector('.post-btn')) return;

    const postNoLink = post.querySelector('.post_no');
    if (!postNoLink || post.querySelector('.deleted-post')) return;

    if (showDeletedText) {
      const span = document.createElement('span');
      span.textContent = ' [Deleted]';
      span.className = 'deleted-post';
      span.style.color = 'red';
      span.style.fontWeight = 'bolder';
      postNoLink.parentNode.insertBefore(span, postNoLink.nextSibling?.nextSibling || null);
    } else {
      const icon = document.createElement('i');
      icon.classList.add('fa', 'fa-trash', 'deleted-post');
      icon.title = 'Deleted';
      icon.style.opacity = '0.5';
      icon.style.marginRight = '0px';
      postNoLink.parentNode.insertBefore(icon, postNoLink.nextSibling?.nextSibling || null);
    }
  }

  function removeDeletedIcon(post) {
    if (!showDeletedIcon) return;

    const postNoLink = post.querySelector('.post_no');
    const deletedPost = postNoLink?.nextSibling?.nextSibling;
    if (deletedPost?.classList.contains('deleted-post')) {
      deletedPost.remove();
    }
  }

  let firstThreadSet = null;
  let waitingForSecondCheck = false;
  let monitorThreadsJson = true;

  function cleanThreadStorage(responseText) {
    if (!monitorThreadsJson) return;

    try {
      const parsed = JSON.parse(responseText);
      const currentThreads = new Set();

      for (const page of parsed) {
        for (const thread of page.threads) {
          currentThreads.add(thread.no);
        }
      }

      const latestSettings = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      const board = currentBoard;
      const hidden = latestSettings.hiddenPosts?.[board] || {};
      const missing = [];

      for (const threadId in hidden) {
        if (!currentThreads.has(parseInt(threadId, 10))) {
          missing.push(threadId);
        }
      }

      if (!firstThreadSet) {
        if (missing.length === 0) {
          monitorThreadsJson = false;
          return;
        }
        firstThreadSet = currentThreads;
        waitingForSecondCheck = true;
      } else if (waitingForSecondCheck) {
        waitingForSecondCheck = false;

        const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
        const freshHidden = latest.hiddenPosts?.[board] || {};
        let changed = false;

        for (const threadId in freshHidden) {
          if (!currentThreads.has(parseInt(threadId, 10))) {
            delete freshHidden[threadId];
            changed = true;
          }
        }

        if (changed) {
          latest.hiddenPosts[board] = freshHidden;
          localStorage.setItem("Thread Settings", JSON.stringify(latest));
        }

        firstThreadSet = null;
        monitorThreadsJson = false;
      }
    } catch (e) {

    }
  }

  const DAY = 24 * 60 * 60 * 1000;
  let originalFilenameBase = '';
  let clipboardPasteActive = false;
  let clipboardPasteTimer = null;
  const clipboardFiles = new WeakSet();

  function markClipboardPaste() {
    clipboardPasteActive = true;
    clearTimeout(clipboardPasteTimer);
    clipboardPasteTimer = setTimeout(() => {
      clipboardPasteActive = false;
    }, 100);
  }

  function isClipboardFile(file) {
    if (file && clipboardFiles.has(file)) return true;
    return (
      randomizeClipboard &&
      clipboardPasteActive &&
      file &&
      file.name === 'ClipboardImage.png'
    );
  }

  function sanitizeFilenameInput(name) {
    return String(name || '').replace(/[\\\/:\*\?"<>\|]/g, '');
  }

  function sanitizeFilename(name) {
    return sanitizeFilenameInput(name).trim();
  }

  function syncFilename(value) {
    const clean = sanitizeFilenameInput(value);
    const inputs = document.querySelectorAll('input[name="filename"]');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = clean;
    }
  }

  function randomizeFilename(formData) {
    const textbox = document.querySelector('input[name="filename"]');
    let inputName = sanitizeFilename(textbox?.value || '');

    const entries = Array.from(formData.entries());
    const toRename = [];

    for (let i = 0; i < entries.length; i++) {
      const [key, val] = entries[i];
      if (val instanceof File) {
        toRename.push({ key, file: val });
      }
    }

    if (toRename.length === 0) return;

    for (let i = 0; i < toRename.length; i++) {
      formData.delete(toRename[i].key);
    }

    for (let i = 0; i < toRename.length; i++) {
      const { key, file } = toRename[i];
      const parts = file.name.split('.');
      const ext = parts.length > 1 ? '.' + parts.pop() : '';
      const base = sanitizeFilename(inputName || parts.join('.'));
      const finalName = base || originalFilenameBase || 'file';

      const newFile = new File([file], finalName + ext, { type: file.type });
      formData.append(key, newFile);
    }
  }

  function initializeRandomizerToggle() {
    if (!filenameChanger) return;

    const row = document.getElementById('upload_settings');
    if (!row) return;
    const td = row.querySelector('td');
    if (!td) return;

    const filenameRow = document.createElement('tr');
    filenameRow.id = 'upload_filename';
    filenameRow.innerHTML = `
      <th>Filename</th>
      <td><input type="text" name="filename" size="30" maxlength="255" autocomplete="off"></td>
    `;
    row.parentNode.insertBefore(filenameRow, row.nextSibling);

    const filenameInput = filenameRow.querySelector('input[name="filename"]');

    const spoilerInput = td.querySelector('input');
    const spoilerLabel = td.querySelector('label');
    spoilerLabel.removeAttribute('for');
    spoilerLabel.innerHTML = ' Spoiler Image';
    spoilerLabel.prepend(spoilerInput);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'randfn';
    input.id = 'randfn';

    const label = document.createElement('label');
    label.appendChild(input);
    label.appendChild(document.createTextNode(' Randomize Filename'));
    td.appendChild(label);

    document.addEventListener('change', (e) => {
      const target = e.target;

      if (target.tagName === 'INPUT' && target.type === 'file') {
        if (mobileInput) return;
        let file = target.files?.[0];
        if (!file) return;

        const parts = file.name.split('.');
        const ext = parts.length > 1 ? parts.pop() : '';
        originalFilenameBase = sanitizeFilename(parts.join('.'));
        filenameInput.maxLength = 255 - (ext.length > 0 ? ext.length + 1 : 0);

        const soundpost = originalFilenameBase.includes('[sound=');
        if (input.checked && !soundpost) {
          const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
          syncFilename(timestamp);
        } else {
          syncFilename(originalFilenameBase);
        }
      }

      if (target.name === 'spoiler') {
        const checked = target.checked;
        const boxes = document.querySelectorAll('input[name="spoiler"]');
        for (let i = 0; i < boxes.length; i++) {
          boxes[i].checked = checked;
        }
      }

      if (target.name === 'randfn') {
        const checked = target.checked;
        const boxes = document.querySelectorAll('input[name="randfn"]');
        for (let i = 0; i < boxes.length; i++) {
          boxes[i].checked = checked;
        }
        if (checked) {
          const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
          syncFilename(timestamp);
        } else {
          syncFilename(originalFilenameBase || '');
        }
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target.name === 'filename') {
        let val = e.target.value || '';
        if (val.length > filenameInput.maxLength) {
          val = val.substring(0, filenameInput.maxLength);
        }
        syncFilename(val);
      }
    });

    $(document).on('ajax_before_post', (e, formData) => {
      randomizeFilename(formData);
    });

    const thumbs = document.querySelector('.file-thumbs');
    if (thumbs) {
      const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
          const { addedNodes, removedNodes } = mutations[i];
          for (let j = 0; j < addedNodes.length; j++) {
            const node = addedNodes[j];
            if (node.nodeType !== 1 || !node.classList.contains('tmb-container')) continue;
            const file = $(node).data('file-ref');
            if (file) {
              const parts = file.name.split('.');
              const ext = parts.length > 1 ? parts.pop() : '';
              originalFilenameBase = sanitizeFilename(parts.join('.'));
              filenameInput.maxLength = 255 - (ext.length > 0 ? ext.length + 1 : 0);

              const soundpost = originalFilenameBase.includes('[sound=');
              const clipboardImage = randomizeClipboard && isClipboardFile(file);

              if (!soundpost && (input.checked || clipboardImage)) {
                const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
                syncFilename(timestamp);
              } else {
                syncFilename(originalFilenameBase);
              }
            }
          }

          if (removedNodes.length > 0) {
            const remainingFiles = thumbs.querySelectorAll('.tmb-container');
            if (remainingFiles.length === 0) {
              syncFilename('');
              originalFilenameBase = '';
            }
          }
        }
      });

      observer.observe(thumbs, { childList: true });
    }
  }

  let mobileInput = false;
  let mobileURLBtn = false;

  function checkMobile() {
    const mobileHtml = document.documentElement.matches('html.mobile-style, html.mobile-style-new');
    const forceMobileTheme = localStorage.getItem('forceMobileTheme') === 'on';
    const mobileStyleNew = localStorage.getItem('mobileStyle') === 'new';

    if (!mobileStyleNew) return false;

    return mobileHtml || forceMobileTheme;
  }

  function waitForElement(selector, callback, timeout = 5000) {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        cleanup();
        callback(el);
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    let timer = null;
    if (timeout) {
      timer = setTimeout(cleanup, timeout);
    }

    function cleanup() {
      observer.disconnect();
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
  }

  function initializeMobileRandomizer() {
    if (!filenameChanger) return;
    if (!checkMobile()) return;

    waitForElement('#mbReplyForm', (mbForm) => {
      if (mbForm.querySelector('#mbRandomizerBtn')) return;

      const embedInput = mbForm.querySelector('input[name="embed"]');
      if (!embedInput) return;

      const mbFilenameInput = document.createElement('input');
      mbFilenameInput.name = 'filename';
      mbFilenameInput.placeholder = 'Filename';
      mbFilenameInput.maxLength = 255;
      embedInput.insertAdjacentElement('afterend', mbFilenameInput);

      const mbSpoilerBtn = document.getElementById('mbSpoilerBtn');
      if (!mbSpoilerBtn) return;

      const mbRandBtn = document.createElement('button');
      mbRandBtn.type = 'button';
      mbRandBtn.id = 'mbRandomizerBtn';
      mbRandBtn.className = 'outline';
      mbRandBtn.setAttribute('aria-pressed', 'false');
      mbRandBtn.textContent = 'Randomize';
      mbSpoilerBtn.insertAdjacentElement('beforebegin', mbRandBtn);

      const mbFileInput = document.getElementById('mbFileInput');
      mbFileInput.addEventListener('change', () => {
        const file = mbFileInput.files?.[0];
        if (file) {
          const parts = file.name.split('.');
          const ext = parts.length > 1 ? parts.pop() : '';
          originalFilenameBase = sanitizeFilename(parts.join('.'));
          mbFilenameInput.maxLength = 255 - (ext ? ext.length + 1 : 0);

          const soundpost = originalFilenameBase.includes('[sound=');
          const clipboardImage = randomizeClipboard && isClipboardFile(file);

          if (!soundpost && (mbRandBtn.getAttribute('aria-pressed') === 'true' || clipboardImage)) {
            const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
              mbFilenameInput.value = timestamp;
          } else {
              mbFilenameInput.value = originalFilenameBase;
          }
        }
      });

      mbRandBtn.addEventListener('click', () => {
        const isOn = mbRandBtn.getAttribute('aria-pressed') === 'true';
        if (isOn) {
          mbRandBtn.setAttribute('aria-pressed', 'false');
          mbRandBtn.classList.remove('active');
          mbFilenameInput.value = originalFilenameBase || '';
        } else {
          mbRandBtn.setAttribute('aria-pressed', 'true');
          mbRandBtn.classList.add('active');
          const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
          mbFilenameInput.value = timestamp;
        }
      });

      mbFilenameInput.addEventListener('input', () => {
        let val = mbFilenameInput.value || '';
        if (val.length > mbFilenameInput.maxLength) {
          val = val.substring(0, mbFilenameInput.maxLength);
        }
        mbFilenameInput.value = sanitizeFilenameInput(val);
      });

      mbForm.addEventListener('submit', (e) => {
        const mbFileInput = document.getElementById('mbFileInput');
        const file = mbFileInput?.files?.[0];
        if (!file) return;

        const parts = file.name.split('.');
        const ext = parts.length > 1 ? '.' + parts.pop() : '';
        const base = sanitizeFilename(mbFilenameInput.value || '');
        const finalName = base || originalFilenameBase || 'file';

        const newFile = new File([file], finalName + ext, { type: file.type });
        const dt = new DataTransfer();
        dt.items.add(newFile);
        mbFileInput.files = dt.files;
      }, true);

      const mbFileStatus = document.getElementById("mbFileStatus");
      if (mbFileStatus) {
        const observer = new MutationObserver(() => {
          if (!mbFileStatus.textContent.trim()) {
            mbFilenameInput.value = '';
            originalFilenameBase = '';
          }
        });
        observer.observe(mbFileStatus, { childList: true, characterData: true, subtree: true });
      }
    });
    mobileInput = true;
  }

  function initializeURLUpload() {
    if (!urlUpload) return;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const CONVERTIBLE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp']);
    const MAX_DIMENSION = 10000;

    async function fetchFile(url) {

      function httpStatusText(status) {
        const codes = {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'Not Found',
          408: 'Request Timeout',
          429: 'Too Many Requests',
          500: 'Internal Server Error',
          502: 'Bad Gateway',
          503: 'Service Unavailable',
          504: 'Gateway Timeout'
        };
        return codes[status] || 'Error';
      }

      async function fetchNormal(url) {
        const resp = await fetch(url, { mode: 'cors' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status} (${httpStatusText(resp.status)})`);
        const blob = await resp.blob();
        return { blob, finalUrl: resp.url || url };
      }

      async function fetchGM(url) {
        if (!gmRequest) throw new Error('GM API not detected. Use a userscript manager for best compatibility.');

        return new Promise((resolve, reject) => {
          gmRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onload: (resp) => {
              if (resp.status >= 200 && resp.status < 300 && resp.response) {
                resolve({ blob: resp.response, finalUrl: resp.finalUrl || resp.responseURL || url });
              } else {
                reject(new Error(`HTTP ${resp.status} (${httpStatusText(resp.status)})`));
              }
            },
            onerror: () => reject(new Error('HTTP network error')),
            ontimeout: () => reject(new Error('HTTP request timed out'))
          });
        });
      }

      async function tryFetch(url, yt = false) {
        try {
          return await fetchNormal(url);
        } catch (e) {
          try {
            return await fetchGM(url);
          } catch (gmErr) {
            if (yt && /maxresdefault/.test(url) && (/HTTP 404/.test(e.message) || /HTTP 404/.test(gmErr.message))) {
              return tryFetch(url.replace('maxresdefault', 'hqdefault'), true);
            }

            if (!gmRequest) throw new Error(`${e.message}<br>${gmErr.message}`);
            throw gmErr;
          }
        }
      }

      const ytMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
      );
      const isYouTube = !!ytMatch;
      if (isYouTube) {
        const id = ytMatch[1];
        url = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
      }

      url = url.replace(
        /^https?:\/\/(?:\w+\.)?(?:twitter|x)\.com\//i,
        'https://d.fxtwitter.com/'
      );

      const { blob, finalUrl = url } = await tryFetch(url, isYouTube);

      let filename = 'file';
      try {
        const p = new URL(finalUrl, location.href).pathname;
        const parts = p.split('/');
        const last = parts.pop() || parts.pop();
        if (last) filename = decodeURIComponent(last);
      } catch (e) {}

      if (!/\.[a-z0-9]+$/i.test(filename) && blob.type) {
        const ext = blob.type.split('/')[1] || '';
        if (ext) filename += '.' + ext;
      }
      return new File([blob], filename, { type: blob.type || 'application/octet-stream' });
    }

    function simDragDrop(dropzoneEl, file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      try {
        const dragEvent = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt });
        dropzoneEl.dispatchEvent(dragEvent);
        return true;
      } catch (e) {}
      try {
        const evt = document.createEvent('Event');
        evt.initEvent('drop', true, true);
        try { Object.defineProperty(evt, 'dataTransfer', { value: dt }); } catch (defineErr) { evt.dataTransfer = dt; }
        dropzoneEl.dispatchEvent(evt);
        return true;
      } catch (e) {
        return false;
      }
    }

    function setFileInputFiles(inputEl, file) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        inputEl.files = dt.files;
        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      } catch (e) {
        return false;
      }
    }

    function addFileToContainer(container, file) {
      if (!container) return false;
      const dropzone = container.querySelector('.dropzone') || container.querySelector('.dropzone-wrap .dropzone');
      if (dropzone && simDragDrop(dropzone, file)) return true;
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput && setFileInputFiles(fileInput, file)) return true;
      const mbFileInput = container.querySelector('#mbFileInput');
      if (mbFileInput && setFileInputFiles(mbFileInput, file)) return true;
      return false;
    }

    function showUrlAlert(callback) {
      const alert = $(`
        <div id="alert_handler">
          <div id="alert_background"></div>
          <div id="alert_div" style="max-width:90%;">
            <a id="alert_close" href="javascript:void(0)">
              <i class="fa fa-times"></i>
            </a>
            <form id="url_form" style="margin-bottom:0;">
              <div id="alert_message">
                <strong><i class="fa fa-external-link"></i> URL Upload</strong><br><br>
                Enter a URL:<br><br>
                <input type="text" id="url_input_field" style="width:100%;box-sizing:border-box;padding:6px;">
              </div>
              <div style="margin:0 13px;display:flex;justify-content:flex-end;gap:.2rem;">
                <button type="submit" class="button alert_button" id="urlOk">Upload</button>
                <button type="button" class="button alert_button" id="urlCancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `);

      $('body').append(alert);
      const urlField = $('#url_input_field');
      urlField.focus();

      $('#url_form').on('submit', function (e) {
        e.preventDefault();
        const url = urlField.val().trim();
        $('#alert_handler').remove();
        callback(url || null);
      });

      $('#urlCancel, #alert_close, #alert_background').on('click', function () {
        $('#alert_handler').remove();
        callback(null);
      });

      urlField.on('keydown', function (e) {
        if (e.key === 'Escape') {
          $('#alert_handler').remove();
          callback(null);
        }
      });
    }

    function createURLButton(noMargin = false) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'outline url-upload';
      btn.textContent = 'URL';
      if (!noMargin) {
        btn.style.marginLeft = '2px';
        btn.style.marginRight = '2px';
        btn.style.padding = '0 2px';
      }
      return btn;
    }

    if (!document.querySelector('.url-upload')) {
      const uploadTd = document.querySelector('#upload_settings td');
      const filenameRow = document.getElementById('upload_filename');

      if (filenameRow && uploadTd) {
        const td = filenameRow.querySelector('td');
        const filenameInput = td && td.querySelector('input[name="filename"]');
        if (td && filenameInput && !td.querySelector('.url-upload')) {
          let wrapper = td.querySelector('.upload-filename-wrapper');
          if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'upload-filename-wrapper';
            wrapper.style.display = 'flex';
            filenameInput.style.flex = '1 1 auto';
            td.appendChild(wrapper);
            wrapper.appendChild(filenameInput);
          }
          const btn = createURLButton(false);
          wrapper.appendChild(btn);
        } else if (uploadTd && !uploadTd.querySelector('.url-upload')) {
          const btn = createURLButton(false);
          btn.style.float = 'right';
          uploadTd.appendChild(btn);
        }
      } else if (uploadTd && !uploadTd.querySelector('.url-upload')) {
        const btn = createURLButton(false);
        btn.style.float = 'right';
        uploadTd.appendChild(btn);
      }
    }

    if (checkMobile()) {
      waitForElement('#mbReplyForm', (mbForm) => {
        const mbSend = mbForm.querySelector('#mbSend');
        const existing = mbForm.querySelector('.url-upload');

        if (!existing && mbSend) {
          const btn = createURLButton(true);
          mbSend.parentNode.insertBefore(btn, mbSend);
          mobileURLBtn = true;
        } else if (existing) {
          mobileURLBtn = true;
        }
      });
    }

    document.addEventListener('click', async (ev) => {
      const btn = ev.target.closest && ev.target.closest('.url-upload');
      if (!btn) return;
      ev.preventDefault();

      const container = btn.closest('form') || btn.closest('.dropzone-wrap') || document.getElementById('mbReplyForm') || document.querySelector('#upload_settings td') || document.body;

      showUrlAlert(async (url) => {
        if (!url) return;

        const dropzoneWrap = document.querySelector('.dropzone-wrap');
        if (dropzoneWrap) {
          const removeBtn = dropzoneWrap.querySelector('.remove-btn');
          if (removeBtn) removeBtn.click();
        }

        btn.disabled = true;
        const oldText = btn.textContent;
        btn.textContent = 'Fetching…';

        try {
          let file = await fetchFile(url);
          file = await checkImageConversion(file);

          if (!addFileToContainer(container, file)) {
            alert('Could not add file to uploader.');
          }
        } catch (e) {
          alert('Failed to fetch file: ' + (e.message || e));
        } finally {
          btn.disabled = false;
          btn.textContent = oldText;
        }
      });
    });
  }

  function checkStyles() {
    if (!(linkEmbed || linkPreview)) return;

    function checkHolidayAvatar() {
      try {
        let mainSheet = null;
        const sheets = document.styleSheets;
        for (let i = 0; i < sheets.length; i++) {
          const sheet = sheets[i];
          if (sheet.href && sheet.href.includes('/stylesheets/style.css')) {
            mainSheet = sheet;
            break;
          }
        }
        if (!mainSheet) return;

        function getAllRules(sheet, collected) {
          if (!collected) collected = [];
          try {
            const rules = sheet.cssRules || [];
            for (let i = 0; i < rules.length; i++) {
              const rule = rules[i];
              if (rule instanceof CSSImportRule && rule.styleSheet) {
                getAllRules(rule.styleSheet, collected);
              } else {
                collected.push(rule);
              }
            }
          } catch (e) {}
          return collected;
        }

        const allRules = getAllRules(mainSheet);
        let beforeBg = '';
        let afterBg = '';

        for (let i = 0; i < allRules.length; i++) {
          const rule = allRules[i];
          if (rule.selectorText && rule.selectorText.includes('.file a:has(> .post-image)::before')) {
            beforeBg = rule.style.background || '';
          } else if (rule.selectorText && rule.selectorText.includes('.file a:has(> .post-image)::after')) {
            afterBg = rule.style.background || '';
          }
        }

        if (!beforeBg && !afterBg) return;

        let styleEl = document.getElementById('twt-avatar-holiday-style');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'twt-avatar-holiday-style';
          document.head.appendChild(styleEl);
        }

        let css = '';
        if (beforeBg) {
          css += `
            .twt-embed a:has(> .twt-avatar)::before {
              content: "";
              position: absolute;
              transform: translate(-5%, -50%);
              width: 40px;
              height: 31px;
              pointer-events: none;
              z-index: 2;
              background: ${beforeBg};
            }
          `;
        }

        if (afterBg) {
          css += `
            .twt-embed a:has(> .twt-avatar)::after {
              content: "";
              position: absolute;
              transform: translateX(100%);
              width: 27px;
              height: 36px;
              pointer-events: none;
              z-index: 2;
              background: ${afterBg};
            }
          `;
        }

        styleEl.textContent = css;
      } catch (e) {}
    }

    let retries = 0;

    function checkInlineQuote() {
      let found = false;
      const styleTags = document.querySelectorAll('style');
      for (let i = 0; i < styleTags.length; i++) {
        const text = styleTags[i].textContent;
        if (text && text.includes('.inline-quote-container')) {
          found = true;
          break;
        }
      }

      if (found) {
        document.addEventListener('click', function (e) {
          const link = e.target.closest('a');
          if (!link) return;
          if (!/^>>(\d+)/.test(link.textContent?.trim() || '')) return;

          setTimeout(() => {
            let node = link.parentNode;
            while (node && node !== document.body) {
              const container = node.querySelector(':scope > .inline-quote-container');
              if (container) {
                if (linkPreview) {
                  const links = container.querySelectorAll('a');
                  bindLinkPreviews(links, false);
                }
                if (linkEmbed) {
                  const btns = container.querySelectorAll('.embed-button[data-embedurl]');
                  for (let i = 0; i < btns.length; i++) {
                    const btn = btns[i];
                    const url = btn.getAttribute('data-embedurl');
                    if (url) {
                      btn.addEventListener('click', onEmbedClick);
                    }
                  }
                }
                break;
              }
              node = node.parentNode;
            }
          }, 0);
        }, true);
      } else if (++retries < 3) {
        setTimeout(checkInlineQuote, 3000);
      }
    }

    if (linkEmbed) {
      checkHolidayAvatar();
    }

    checkInlineQuote();
  }

  function catalogLastReply() {
    const sortSelect = document.querySelector('#sort_by');
    if (!sortSelect) return;

    if (isChristmas) {
      snowEffect();
    } else if (isNewYear) {
      // fireworksEffect();
    }

    let lastOption = sortSelect.querySelector('option[value="last:desc"]');
    if (!lastOption) {
      lastOption = document.createElement('option');
      lastOption.value = 'last:desc';
      lastOption.textContent = 'Last reply';
      const timeOption = sortSelect.querySelector('option[value="time:desc"]');
      sortSelect.insertBefore(lastOption, timeOption);
    }

    let dataLoaded = false;
    let loadingInterval = null;

    const mixEls = Array.from(document.querySelectorAll('.mix[data-id]'));
    const visibleThreadIds = new Set(mixEls.map(el => el.dataset.id));

    async function loadReplyData() {
      if (dataLoaded) return;
      dataLoaded = true;

      const baseText = 'Last reply';
      let dots = 0;
      let completed = 0;
      let totalTasks = 0;

      function updateLoadingText() {
        const dotStr = '.'.repeat(dots) + '\u00A0'.repeat(3 - dots);
        const pct = totalTasks > 0 ? Math.min(100, Math.floor((completed / totalTasks) * 100)) : 0;
        lastOption.textContent = `Loading${dotStr} ${pct}%`;
      }

      loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        const renderDots = dots === 0 ? 0 : dots;
        dots = renderDots;
        updateLoadingText();
      }, 400);

      const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      if (!latest.lastPosts) latest.lastPosts = {};
      if (!latest.lastPosts[currentBoard]) latest.lastPosts[currentBoard] = {};
      const stored = latest.lastPosts[currentBoard];

      const threadTimes = new Map();

      for (let i = 0; i < mixEls.length; i++) {
        const mixEl = mixEls[i];
        const threadId = mixEl.dataset.id;

        const replies = Number(mixEl.dataset.reply);
        const bump = Number(mixEl.dataset.bump);

        if (replies <= 749) {
          threadTimes.set(threadId, bump);
        } else {
          if (stored[threadId] && stored[threadId].replies === replies) {
            threadTimes.set(threadId, stored[threadId].lastModified);
          } else {
            totalTasks++;
            fetchTasks.push(async () => {
              try {
                const res = await fetch(`/${currentBoard}/res/${threadId}.json`, {
                  headers: { "Range": "bytes=-1024" },
                  cache: "reload"
                });
                if (!res.ok && res.status !== 206) throw new Error("Failed tail fetch");

                const text = await res.text();
                const matches = Array.from(text.matchAll(/"last_modified"\s*:\s*(\d+)/g));
                if (matches.length > 0) {
                  const lastModified = Number(matches[matches.length - 1][1]);
                  threadTimes.set(threadId, lastModified);
                  stored[threadId] = { replies, lastModified };
                } else if (stored[threadId]) {
                  threadTimes.set(threadId, stored[threadId].lastModified);
                } else {
                  threadTimes.set(threadId, bump);
                }
              } catch (e) {
                if (stored[threadId]) {
                  threadTimes.set(threadId, stored[threadId].lastModified);
                } else {
                  threadTimes.set(threadId, bump);
                }
              } finally {
                completed++;
                updateLoadingText();
              }
            });
          }
        }
      }

      updateLoadingText();

      await fetchQueue(5);

      for (let i = 0; i < mixEls.length; i++) {
        const mixEl = mixEls[i];
        const threadId = mixEl.dataset.id;
        if (threadTimes.has(threadId)) {
          mixEl.setAttribute('data-last', threadTimes.get(threadId));
        }
      }

      latest.lastPosts[currentBoard] = stored;
      localStorage.setItem("Thread Settings", JSON.stringify(latest));

      clearInterval(loadingInterval);
      lastOption.textContent = baseText;

      sortSelect.dispatchEvent(new Event('change'));
    }

    (function cleanup() {
      const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      if (!latest.lastPosts || !latest.lastPosts[currentBoard]) return;
      const stored = latest.lastPosts[currentBoard];
      for (const storedId of Object.keys(stored)) {
        if (!visibleThreadIds.has(storedId)) {
          delete stored[storedId];
        }
      }
      latest.lastPosts[currentBoard] = stored;
      localStorage.setItem("Thread Settings", JSON.stringify(latest));
    })();

    sortSelect.addEventListener('change', () => {
      if (sortSelect.value === 'last:desc') {
        loadReplyData();
      }
    });

    let autoselectLast = false;
    try {
      const catalog = JSON.parse(localStorage.catalog || '{}');
      const sort = catalog.sort_by;
      if (sort === 'last:desc' || sort === '') {
        autoselectLast = true;
        catalog.sort_by = 'last:desc';
        localStorage.catalog = JSON.stringify(catalog);
      }
    } catch (e) {}

    if (autoselectLast) {
      sortSelect.value = 'last:desc';
      sortSelect.dispatchEvent(new Event('change'));
    }
  }

  function matchKeybind(e, keybind) {
    if (!keybind || typeof keybind !== "object") return false;

    if (!!keybind.ctrl !== e.ctrlKey) return false;
    if (!!keybind.alt !== e.altKey) return false;
    if (!!keybind.shift !== e.shiftKey) return false;

    const key = e.key === " " ? " " : e.key.toLowerCase();
    return key === keybind.key.toLowerCase();
  }

  function initializeKeybinds(optionsOnly = false) {
    waitForElement("a[title='Options']", (optionsBtn) => {
      let optionsChecked = false;

      document.addEventListener("keydown", function (ev) {
        const targetTag = ev.target.tagName;
        const inInput = targetTag === "INPUT" || targetTag === "TEXTAREA";

        if (matchKeybind(ev, kbOptions)) {
          const handler = document.getElementById("options_handler");
          if (!handler) return;

          const isHidden = handler.style.display === "none";
          if (inInput && isHidden) return;

          ev.preventDefault();

          if (isHidden) {
            if (!optionsChecked) {
              optionsChecked = true;
              const tabList = handler.querySelector("#options_tablist");
              const hasActive = !!(tabList && tabList.querySelector(".options_tab_icon.active"));

              if (!hasActive) {
                Options.select_tab("thread-status");
              }
            }
            optionsBtn.click();
          } else {
            Options.hide();
          }
          return;
        }

        if (optionsOnly) return;

        if (urlUpload && matchKeybind(ev, kbURL)) {
          const cancelBtn = document.getElementById("urlCancel");
          ev.preventDefault();

          if (cancelBtn) {
            cancelBtn.click();
            return;
          }

          let btn;
          if (mobileURLBtn) {
            const mbForm = document.querySelector('#mbReplyForm');
            btn = mbForm && mbForm.querySelector('.url-upload');
          } else {
            btn = document.querySelector('.url-upload');
          }

          if (btn) {
            btn.click();
            return;
          }
        }

        if (inInput) return;

        if (optionThreading && matchKeybind(ev, kbThreadToggle)) {
          const btn = document.querySelector(".threading-toggle");
          if (btn) {
            ev.preventDefault();
            btn.click();
            return;
          }
        }

        if (optionThreading && toggleThread && matchKeybind(ev, kbThreadNew)) {
          const btn = document.querySelector(".threading-new");
          if (btn) {
            ev.preventDefault();
            btn.click();
            return;
          }
        }

        if (enableKbYou && (matchKeybind(ev, kbYouDown) || matchKeybind(ev, kbYouUp))) {
          ev.preventDefault();

          if (!youPostIds || youPostIds.size === 0) {
            showMessageNotification(
              'No posts replying to (You)',
              { timeout: 5000, single: 'notifyYou' }
            );
            return;
          }

          const ids = Array.from(youPostIds).sort((a, b) => a - b);

          const currentMatch = location.hash.match(/#(\d+)/);
          const currentId = currentMatch ? currentMatch[1] : null;

          let idx = currentId ? ids.indexOf(currentId) : -1;

          if (matchKeybind(ev, kbYouDown)) {
            idx = (idx + 1) % ids.length;
          } else {
            idx = (idx - 1 + ids.length) % ids.length;
          }

          const targetId = ids[idx];

          const prev = document.querySelector('.highlighted');
          if (prev) prev.classList.remove('highlighted');

          const el = document.getElementById(`reply_${targetId}`);
          if (!el) return;

          el.classList.add('highlighted');

          let padding = 5;

          const boardlist = document.querySelector('.boardlist');
          if (boardlist && getComputedStyle(boardlist).position === 'fixed') {
            padding += boardlist.getBoundingClientRect().height;
          }

          const headerBar = document.querySelector('#header-bar.dialog');
          if (headerBar && getComputedStyle(headerBar).position === 'fixed') {
            padding += headerBar.getBoundingClientRect().height;
          }

          history.replaceState(null, '', `#${targetId}`);

          {
            const top = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - padding;
            window.scrollTo({ top, behavior: 'auto' });
          }

          return;
        }

        if (enableTowerTunes && matchKeybind(ev, kbTowerTunes)) {
          const btn = document.querySelector('a[title="Tower Tunes"]');
          if (btn) {
            ev.preventDefault();
            btn.click();
            return;
          }
        }
      });
    });
  }

  $(function () {
    if (typeof Options === "undefined") return;

    const SETTINGS_KEY = "Thread Settings";

    const settingsList = [
      { key: "filenameChanger", label: "Filename Changer", description: "Enable filename changer and randomizer" },
      { key: "linkPreview", label: "Media Hover", description: "Show images and videos of supported links on mouseover" },
      { key: "showDeletedCounter", label: "Deleted Count", description: "Show deleted post counter" },
      { key: "hideDeletedPosts", label: "Hide Deleted Posts", description: "Hide posts upon deletion" },
      { key: "showDeletedIcon", label: "Deleted Icon", description: 'Add an icon <i class="fa fa-trash deleted-post"title="Deleted"style="opacity:0.5;margin-right:0px;"></i> next to deleted posts' },
      { key: "faviconUpdater", label: "Favicon Updater", description: "Enable favicon changes" },
      { key: "showUnreadLine", label: "Unread Line", description: "Show a line below the last post" },
      { key: "showArchivedMessage", label: "Archived Message", description: "Show archived message on post limit" },
      { key: "appendQuotes", label: "Append Quotes", description: "Append '(OP)' '(You)' '→' to applicable quotes" },
      { key: "urlUpload", label: "URL Upload", description: "Add button to upload files via URL" },
      { key: "linkTitle", label: "Link Title", description: "Replace supported links with their actual titles" },
      { key: "linkIcon", label: "Link Icon", description: "Add icons next to supported links" },
      { key: "linkEmbed", label: "Link Embedding", description: "Add embed buttons to supported links" },
      { key: "thumbnailSwap", label: "Transparent Thumbnails", description: "Images with transparency replace their thumbnails" },
      { key: "enableTowerTunes", label: "Tower Tunes", description: "Enable keybind for Tower Tunes" },
      { key: "showSpoilerText", label: "Reveal Spoilers", description: "Show all spoilers in text" },
      { key: "showSpoilerMedia", label: "Reveal Spoiler Thumbnails", description: "Replace spoiler thumbnails with the original image" },
      { key: "optionThreading", label: "Quote Threading", description: "Add option to thread conversations" },
      { key: "enableKbYou", label: "(You) Keybinds", description: "Scrolls to posts that quote (You)" },
      { key: "hidePosts", label: "Post Hiding Buttons", description: "Add buttons to hide posts" }
    ];

    const subSettings = [
      { key: "showDeletedText", label: "Deleted Text", description: 'Add <span style="color:red;font-weight:bolder">[Deleted]</span> text instead', parentKey: "showDeletedIcon" },
      { key: "notifyNewPost", label: "New Post", description: "White circle in favicon on new posts", parentKey: "faviconUpdater" },
      { key: "notifyNewYou", label: "New (You)", description: "Red circle in favicon on new (You) quotes", parentKey: "faviconUpdater" },
      { key: "changeFaviconOnArchive", label: "Archived", description: "Favicon turns red on post limit", parentKey: "faviconUpdater" },
      { key: "appendCrossThread", label: "Append (Cross-thread)", description: "Use (Cross-thread) instead", parentKey: "appendQuotes" },
      { key: "archivedMessageText", label: "Text", parentKey: "showArchivedMessage", type: "text" },
      { key: "archivedImageURL", label: "Image URL", parentKey: "showArchivedMessage", type: "text" },
      { key: "archivedMessageFontSize", label: "Font Size", description: "Use with 'px' or '%'", parentKey: "showArchivedMessage", type: "text", size: "1", after: "archivedMessageText" },
      { key: "archivedImageSize", label: "Image Width", description: "Use with 'px' or '%'", parentKey: "showArchivedMessage", type: "text", size: "1", after: "archivedImageURL" },
      { key: "archivedImageUseHeight", label: "Use Height", description: "Instead of width for image", parentKey: "showArchivedMessage", after: "archivedImageSize" },
      { key: "showStubs", label: "Stubs", description: "Show stubs of hidden posts", parentKey: "hidePosts" },
      { key: "recursiveHiding", label: "Recursive Hiding", description: "Hide replies of hidden posts, recursively", parentKey: "hidePosts" },
      { key: "translateAuto", label: "Auto Translate", description: "If original language is:", parentKey: "linkEmbed" },
      { key: "translateFrom", label: "", parentKey: "linkEmbed", type: "text", size: "3", after: "translateAuto" },
      { key: "notifyPostColor", label: "", parentKey: "faviconUpdater", type: "text", size: "3", after: "notifyNewPost" },
      { key: "notifyYouColor", label: "", parentKey: "faviconUpdater", type: "text", size: "3", after: "notifyNewYou" },
      { key: "directButton", label: "Direct Embed", description: "Use the link itself as an embed button", parentKey: "linkEmbed" },
      { key: "videoScrollVol", label: "Scroll Volume", description: "Adjust hover video volume with the scroll wheel", parentKey: "linkPreview" },
      { key: "randomizeClipboard", label: "Randomize Clipboard", description: "Always randomize pasted image filenames", parentKey: "filenameChanger" },
      { key: "kbThreadNew", label: "[Thread New Posts]", description: "Keybind", parentKey: "optionThreading", type: "keybind", size: "6" },
      { key: "kbThreadToggle", label: "", parentKey: "optionThreading", type: "keybind", size: "6" },
      { key: "kbURL", label: "", parentKey: "urlUpload", type: "keybind", size: "6" },
      { key: "kbYouDown", label: "", parentKey: "enableKbYou", type: "keybind", size: "6" },
      { key: "kbYouUp", label: "", parentKey: "enableKbYou", type: "keybind", size: "6" },
      { key: "kbTowerTunes", label: "", parentKey: "enableTowerTunes", type: "keybind", size: "6" }
    ];

    const defaultSettings = {
      showDeletedCounter: true,
      showDeletedIcon: true,
      hideDeletedPosts: false,
      showArchivedMessage: true,
      faviconUpdater: true,
      optionThreading: true,
      showUnreadLine: true,
      appendQuotes: true,
      notifyNewPost: true,
      notifyNewYou: true,
      changeFaviconOnArchive: true,
      showDeletedText: false,
      appendCrossThread: false,
      archivedMessageText: "THREAD ARCHIVED",
      archivedImageURL: "https://i.imgur.com/LQHVLil.png",
      archivedMessageFontSize: "14px",
      archivedImageSize: "7%",
      archivedImageUseHeight: false,
      appendQuotesWarning: false,
      hidePosts: true,
      recursiveHiding: true,
      showStubs: true,
      filenameChanger: true,
      linkPreview: true,
      urlUpload: true,
      linkEmbed: true,
      translateAuto: false,
      translateFrom: "ja, id",
      thumbnailSwap: true,
      notifyPostColor: "white",
      notifyYouColor: "red",
      directButton: false,
      videoScrollVol: true,
      showSpoilerText: false,
      showSpoilerMedia: false,
      linkIcon: true,
      linkTitle: true,
      randomizeClipboard: false,
      kbOptions: { ctrl: false, alt: true, shift: false, key: "o" },
      kbThreadToggle: { ctrl: false, alt: false, shift: true, key: "t" },
      kbThreadNew: { ctrl: false, alt: false, shift: false, key: "t" },
      kbURL: { ctrl: false, alt: true, shift: false, key: "l" },
      persistentEffect: false,
      persistentDecor: false,
      enableKbYou: true,
      kbYouDown: { ctrl: false, alt: true, shift: false, key: "ArrowDown" },
      kbYouUp: { ctrl: false, alt: true, shift: false, key: "ArrowUp" },
      enableTowerTunes: true,
      kbTowerTunes: { ctrl: false, alt: true, shift: false, key: "m" },
    };

    let threadSettings = {};
    try {
      threadSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    } catch {
      threadSettings = {};
    }

    for (const key in defaultSettings) {
      if (!(key in threadSettings)) {
        threadSettings[key] = defaultSettings[key];
      }
    }

    const saveSettings = () => {
      let latest = {};
      try {
        latest = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
      } catch {
        latest = {};
      }

      const toSave = {
        ...threadSettings,
        hiddenPosts: latest.hiddenPosts,
        enableThreading: latest.enableThreading,
        lastPosts: latest.lastPosts,
        headerFixed: latest.headerFixed,
        headerAutohide: latest.headerAutohide,
        headerHideScroll: latest.headerHideScroll,
      };

      localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
    };

    const content = $("<div></div>");

    settingsList.forEach(({ key, label, description }) => {
      const isChecked = threadSettings[key];
      const descSpan = description ? `<span class="description">: ${description}</span>` : "";

      let style = "";
      if (key === "urlUpload" || key === "optionThreading" || key === "enableKbYou" || key === "enableTowerTunes") {
        style = "display:inline-block;";
      }

      const checkbox = $(`
        <div id="${key}-container" style="${style}">
          <label style="text-decoration: underline; cursor: pointer;">
            <input type="checkbox" id="${key}" ${isChecked ? "checked" : ""} name="${label}">${label}</label>${descSpan}
        </div>
      `);
      content.append(checkbox);
    });

    subSettings.forEach((s) => {
      const { key, label, description, type = "checkbox" } = s;
      const value = threadSettings[key];
      const descSpan = description ? `<span class="description">: ${description}</span>` : "";

      let input;
      if (type === "keybind") {
        const displayValue = formatKeybind(value);
        input = `<input type="text" id="${key}" value="${displayValue}" size="${s.size || 6}" class="keybind-box" style="margin-right:3px;">`;
      } else if (type === "text") {
        const inputSize = s.size || "20";
        input = `<input type="text" id="${key}" value="${value}" size="${inputSize}" style="margin-right: 3px;">`;
      } else {
        input = `<input type="checkbox" id="${key}" ${value ? "checked" : ""}>`;
      }

      let style = "margin-left: 1.5em;";
      if (key === "translateAuto" || key === "notifyNewPost" || key === "notifyNewYou") style += " display:inline-block;";
      if (key === "translateFrom" || key === "notifyPostColor" || key === "notifyYouColor" || key === "kbThreadToggle" || key === "kbURL" || key === "kbYouDown" || key === "kbYouUp" || key === "kbTowerTunes") style += " display:inline-block; margin-left:0.5em;";

      const container = $(`
         <div id="${key}-container" style="${style}">
            <label style="text-decoration: underline; cursor: pointer;">
              ${input}${label}</label>${descSpan}
         </div>
      `);

      content.append(container);
    });

    const previewWrapper = $(`
      <div id="archived-preview" style="
        position: absolute;
        top: 287px;
        right: 0px;
        width: 220px;
        height: 90px;
        overflow: hidden;
        pointer-events: none;
        transform-origin: top left;
      ">
      </div>
    `);
    content.css("position", "relative");
    content.append(previewWrapper);

    function renderArchivedPreview() {
      const rawFontSize = threadSettings.archivedMessageFontSize || defaultSettings.archivedMessageFontSize || "14px";
      const rawImageSize = threadSettings.archivedImageSize || defaultSettings.archivedImageSize || "7%";
      const useHeight = threadSettings.archivedImageUseHeight;
      const msg = threadSettings.archivedMessageText || defaultSettings.archivedMessageText || "THREAD ARCHIVED";
      const img = threadSettings.archivedImageURL || defaultSettings.archivedImageURL || "https://i.imgur.com/LQHVLil.png";

      const convertSize = (raw, isHeight = false) => {
        if (raw.endsWith('%')) {
          const percent = parseFloat(raw);
          const base = isHeight ? window.innerHeight : window.innerWidth;
          return `${(percent / 100) * base}px`;
        }
        return raw;
      };

      const fontSize = convertSize(rawFontSize);
      const imageSize = convertSize(rawImageSize, useHeight);

      const previewContent = $(`
        <div style="display: inline-block; white-space: nowrap;">
          <div style="display: inline-block;">
            <strong style="color: red; font-size: ${fontSize}; display: inline-block; white-space: nowrap;">${msg}</strong><br>
            <img src="${img}" style="margin-top: 5px; display: inline-block; ${useHeight ? 'height' : 'width'}: ${imageSize};">
          </div>
        </div>
      `);

      previewWrapper.empty().append(previewContent);

      const imageEl = previewContent.find('img')[0];

      const applyScale = (scale) => {
        previewContent.css({
          transform: `scale(${scale})`,
          transformOrigin: "top left"
        });
      };

      const tryScale = () => {
        const bounds = previewContent[0].getBoundingClientRect();
        const width = bounds.width;
        const height = bounds.height;

        if (width && height) {
          const scaleX = 220 / width;
          const scaleY = 90 / height;
          const scale = Math.min(scaleX, scaleY, 1);

          applyScale(scale);
          threadSettings.archivedPreviewScale = scale.toFixed(6);
        } else {
          const fallbackScale = parseFloat(threadSettings.archivedPreviewScale);
          if (fallbackScale && isFinite(fallbackScale)) {
            applyScale(fallbackScale);
          }
        }
      };

      if (imageEl.complete) {
        tryScale();
      } else {
        imageEl.onload = tryScale;
      }
    }

    function positionArchivedPreview() {
      const target = document.getElementById("archivedImageUseHeight-container");
      const preview = document.getElementById("archived-preview");
      const container = content[0];

      if (!target || !preview || !container) return;

      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const top = targetRect.top - containerRect.top + targetRect.height / 2 - preview.offsetHeight / 2;

      preview.style.top = `${Math.round(top)}px`;
      preview.style.right = `0px`;
    }

    function getTotalHiddenCount() {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
      const hp = settings.hiddenPosts || {};
      let total = 0;

      const boards = Object.keys(hp);
      for (let i = 0; i < boards.length; i++) {
        const board = boards[i];
        const threads = Object.keys(hp[board]);
        for (let j = 0; j < threads.length; j++) {
          const thread = threads[j];
          const arr = hp[board][thread];
          if (Array.isArray(arr)) total += arr.length;
        }
      }
      return total;
    }

    function updateHiddenCountDisplay() {
      const count = getTotalHiddenCount();
      $('#clear-hidden').text(`Hidden: ${count}`);
    }

    const clearBtn = $(`
      <div id="clear-hidden-container">
        <button id="clear-hidden">Hidden: ${getTotalHiddenCount()}</button>
        <span class="description">: Clear manually-hidden posts</span>
      </div>
    `);
    content.append(clearBtn);

    Options.add_tab("thread-status", "cog", "Thread Options", content);

    $('#clear-hidden').on('click', () => {
      const latest = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
      latest.hiddenPosts = {};
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(latest));
      updateHiddenCountDisplay();
    });

    subSettings.forEach(({ key, parentKey, after }) => {
      const parent = $(`#${parentKey}-container`);
      const insertAfter = after ? $(`#${after}-container`) : parent;
      $(`#${key}-container`).insertAfter(insertAfter);
    });

    function settingsStatus() {
      subSettings.forEach(({ key, parentKey, after }) => {
        const parentChecked = parentKey ? !!threadSettings[parentKey] : true;
        const afterChecked = after ? !!threadSettings[after] : true;

        const disabled = !(parentChecked && afterChecked);

        const $input = $(`#${key}`);
        const $label = $input.closest("label");
        const $desc = $label.next(".description");

        $input.prop("disabled", disabled);
        $label.css("opacity", disabled ? 0.5 : 1);
        $desc.css("opacity", disabled ? 0.5 : 1);
      });

      $("#archived-preview").toggle(!!threadSettings.showArchivedMessage);
    }

    subSettings.forEach(({ key, type = "checkbox" }) => {
      const $input = $(`#${key}`);
      $input.on("change input", function () {
        if (type === "text") {
          const trimmed = this.value.trim();
          if (key === "archivedImageSize" && !trimmed) {
            threadSettings[key] = defaultSettings[key];
            threadSettings.archivedImageUseHeight = defaultSettings.archivedImageUseHeight;
            $(`#archivedImageUseHeight`).prop("checked", defaultSettings.archivedImageUseHeight);
          } else {
            threadSettings[key] = trimmed || defaultSettings[key];
          }
        } else {
          threadSettings[key] = this.checked;
        }
        saveSettings();
        renderArchivedPreview();
      });
    });

    const kbOptionsBox = $(`
      <div id="kbOptions-container" style="position: absolute; top: -22px; right: 0px;">
        <label>Open Settings <input type="text" id="kbOptions" class="keybind-box" size="6">
        </label>
        <div style="font-size: 0.75em; text-align: right;">Backspace resets keybind</div>
      </div>
    `);

    content.css("position", "relative");
    content.append(kbOptionsBox);

    $("#kbOptions").val(formatKeybind(threadSettings.kbOptions));

    if (isChristmas) {
      content.css('position', 'relative');

      const controls = $(`
        <div id="persistent-controls" style="
          position: absolute;
          top: -22px;
          left: 0;
          display: flex;
          gap: 12px;
          align-items: center;
        ">
        <label for="persistentEffect" style="text-decoration: underline; cursor: pointer;">
          <input type="checkbox" id="persistentEffect" name="persistentEffect">Effect</label>
        <label for="persistentDecor" style="text-decoration: underline; cursor: pointer;">
          <input type="checkbox" id="persistentDecor" name="persistentDecor">Decor</label>
        </div>
      `);

      $('#persistentEffect', controls).prop('checked', !!threadSettings.persistentEffect);
      $('#persistentDecor', controls).prop('checked', !!threadSettings.persistentDecor);

      content.append(controls);
    }

    function formatKeybind(obj) {
      if (!obj || typeof obj !== "object") return "";

      const parts = [];
      if (obj.ctrl) parts.push("Ctrl");
      if (obj.alt) parts.push("Alt");
      if (obj.shift) parts.push("Shift");

      if (obj.key) {
        const keyMap = {
          " ": "Space",
          ArrowUp: "Up",
          ArrowDown: "Down",
          ArrowLeft: "Left",
          ArrowRight: "Right",
        };

        let main = keyMap[obj.key] ?? (obj.key.length === 1 ? obj.key.toUpperCase() : obj.key);

        parts.push(main);
      }

      return parts.join("+");
    }

    $(".keybind-box").each(function () {
      const $box = $(this);
      const key = $box.attr("id");
      const def = defaultSettings[key];

      $box.on("keydown", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.key === "Backspace") {
          threadSettings[key] = defaultSettings[key];
          $box.val(formatKeybind(defaultSettings[key]));
          saveSettings();
          return;
        }

        if (["Alt", "Control", "Shift", "Meta"].includes(e.key)) return;

        const keybind = {
          ctrl: e.ctrlKey,
          alt: e.altKey,
          shift: e.shiftKey,
          key: e.key === " " ? " " : e.key
        };

        threadSettings[key] = keybind;
        $box.val(formatKeybind(keybind));
        saveSettings();
      });
    });

    const $brTarget = $('#notifyNewPost-container');
    if ($brTarget.length) {
      $('<br>').insertBefore($brTarget);
    }

    $("#appendQuotes").on("change", function () {
      const checked = $(this).is(":checked");

      if (checked && !threadSettings.appendQuotesWarning) {
        const alert = $(`
          <div id="alert_handler">
            <div id="alert_background"></div>
            <div id="alert_div">
              <a id="alert_close" href="javascript:void(0)">
                <i class="fa fa-times"></i>
              </a>
              <div id="alert_message">
                <strong>⚠ Compatibility Notice</strong><br><br>
                This feature is compatible with the latest version of the <em>Inline Quoting</em> script.<br><br>
                Update to <strong>version 2.1</strong> or later if you are experiencing issues with inline quoting appended replies.
              </div>
              <div style="margin: 13px;">
                <label><input type="checkbox" id="appendQuotesWarning">Don't show this message again</label>
              </div>
              <div>
                <button class="button alert_button" id="appendQuotesOk">OK</button>
              </div>
            </div>
          </div>
        `);

        $("body").append(alert);

        $("#appendQuotesOk").on("click", function () {
          if ($("#appendQuotesWarning").is(":checked")) {
            threadSettings.appendQuotesWarning = true;
            saveSettings();
          }
          $("#alert_handler").remove();
        });

        $("#alert_close").on("click", function () {
          $("#appendQuotes").prop("checked", false);
          threadSettings.appendQuotes = false;
          saveSettings();
          $("#alert_handler").remove();
        });
      }
    });

    content.on("change input", "input", function () {
      const key = this.id;
      if (!key) return;

      const isCheckbox = this.type === "checkbox";

      if (isCheckbox) {
        threadSettings[key] = this.checked;
      } else {
        const trimmed = this.value.trim();
        threadSettings[key] = trimmed || defaultSettings[key];
      }

      saveSettings();
      settingsStatus();
      renderArchivedPreview();
    });

    $("a[title='Options'], .options_tab_icon:has(.fa-cog)").on("click", () => {
      setTimeout(updateHiddenCountDisplay, 0);
      renderArchivedPreview();
      positionArchivedPreview();
    });
    settingsStatus();
    saveSettings();
  });

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  function onReady() {
    const path = window.location.pathname;
    const mobileNewTheme = localStorage.getItem('forceMobileTheme') === 'on' && localStorage.getItem('mobileStyle') === 'new';

    if (mobileNewTheme) {
      waitForElement('#mbDesktopClose', (closeBtn) => {
        closeBtn.click();
        setTimeout(() => {
          try {
            const geo = JSON.parse(localStorage.getItem('mbDF_geometry_last'));
            if (geo && typeof geo.l === 'number' && typeof geo.t === 'number') {
              const float = document.getElementById('mbDesktopFloat');
              if (float) {
                float.style.left = geo.l + 'px';
                float.style.top = geo.t + 'px';
              }
            }
          } catch (e) {}
        }, 0);
      });
    }

    const threadMatch = path.match(/^\/([^/]+)\/res\/(\d+)\.html/);
    if (threadMatch) {
      currentBoard = threadMatch[1];
      currentThreadId = threadMatch[2];

      headerBar();
      initializePosts();
      hoverQuoteReplies();
      threadMonitoring();
      initializeThreadingToggle();
      initializeImageConverter();
      initializeRandomizerToggle();
      initializeMobileRandomizer();
      initializeSiteKey();
      initializeURLUpload();
      initializeKeybinds();
      checkStyles();
      return;
    } else {
      initializeKeybinds(true);
    }

    const catalogMatch = path.match(/^\/([^/]+)\/catalog\.html$/);
    if (catalogMatch) {
      currentBoard = catalogMatch[1];
      checkDate();
      catalogLastReply();
      return;
    }
  }
})();