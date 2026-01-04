// ==UserScript==
// @name         X.com/Twitter Original Images + Save with Metadata + Auto-Like (Cromite)
// @namespace    http://cromite.local
// @version      1.7
// @description  Load original images on X and allow "Save with metadata" (embed  DisplayName@handle + post text + media tags into XMP description in saved file) and Auto-Like post when saving image. Compatible with Cromite (no @grant).
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548930/XcomTwitter%20Original%20Images%20%2B%20Save%20with%20Metadata%20%2B%20Auto-Like%20%28Cromite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548930/XcomTwitter%20Original%20Images%20%2B%20Save%20with%20Metadata%20%2B%20Auto-Like%20%28Cromite%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Helpers ----------
  function xmlEscape(s) {
    return String(s || '').replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function toOrigUrl(url) {
    if (!url) return url;
    try {
      const u = new URL(url, location.href);
      if (u.hostname.includes('twimg.com') && u.searchParams.has('name')) {
        u.searchParams.set('name', 'orig');
        return u.toString();
      }
    } catch (e) { /* ignore */ }
    return url;
  }

  function filenameFromUrl(url, contentType) {
    try {
      const u = new URL(url, location.href);
      const fmt = u.searchParams.get('format');
      const ext = fmt ? fmt : (contentType && contentType.includes('png') ? 'png' : (contentType && contentType.includes('webp') ? 'webp' : 'jpg'));
      let seg = u.pathname.split('/').pop() || 'image';
      seg = seg.split('?')[0].split('#')[0];
      if (!seg.includes('.')) {
        return `${seg}.${ext}`;
      } else {
        return seg;
      }
    } catch (e) {
      return `image_${Date.now()}.jpg`;
    }
  }

  function buildXmpPacketBytesWithDescriptionOnly(description) {
    const xmp = `<?xpacket begin='' id='W5M0MpCehiHzreSzNTczkc9d'?>
<x:xmpmeta xmlns:x='adobe:ns:meta/'>
 <rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'>
  <rdf:Description rdf:about='' xmlns:dc='http://purl.org/dc/elements/1.1/'>
   <dc:title><rdf:Alt><rdf:li xml:lang='x-default'></rdf:li></rdf:Alt></dc:title>
   <dc:description><rdf:Alt><rdf:li xml:lang='x-default'>${xmlEscape(description)}</rdf:li></rdf:Alt></dc:description>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end='w'?>`;
    return new TextEncoder().encode(xmp);
  }

  function insertXmpIntoJpegArrayBuffer(arrayBuffer, xmpBytes) {
    const data = new Uint8Array(arrayBuffer);
    if (data.length < 2 || data[0] !== 0xFF || data[1] !== 0xD8) {
      throw new Error('Not a JPEG (missing SOI).');
    }
    const headerBytes = new TextEncoder().encode('http://ns.adobe.com/xap/1.0/\x00');
    const app1Len = headerBytes.length + xmpBytes.length + 2;
    if (app1Len > 0xFFFF) throw new Error('XMP too large');

    const app1 = new Uint8Array(2 + 2 + headerBytes.length + xmpBytes.length);
    app1[0] = 0xFF; app1[1] = 0xE1;
    app1[2] = (app1Len >> 8) & 0xFF;
    app1[3] = app1Len & 0xFF;
    app1.set(headerBytes, 4);
    app1.set(xmpBytes, 4 + headerBytes.length);

    const rest = data.subarray(2);
    const out = new Uint8Array(2 + app1.length + rest.length);
    out.set(data.subarray(0, 2), 0);
    out.set(app1, 2);
    out.set(rest, 2 + app1.length);
    return out.buffer;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'image';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // ---------- Extract user handle ----------
  function extractUserHandleFromTweet(tweet) {
    try {
      const anchors = tweet.querySelectorAll('a[href]');
      for (const a of anchors) {
        const href = a.getAttribute('href');
        if (!href) continue;
        if (/^\/[A-Za-z0-9_]{1,30}\/?$/.test(href) && !href.includes('/status') && !href.includes('/i/')) {
          return href.replace(/^\//, '').replace(/\/$/, '');
        }
      }
      const spans = tweet.querySelectorAll('span');
      for (const s of spans) {
        const t = (s.textContent || '').trim();
        if (t.startsWith('@')) {
          return t.replace(/^@/, '').split(' ')[0];
        }
      }
    } catch (e) { /* ignore */ }
    return '';
  }

  // ---------- Extract media tags ----------
  function extractMediaTags(tweet) {
    try {
      const tagsAnchor = tweet.querySelector('a[href*="/media_tags"]');
      if (!tagsAnchor) return '';
      const spans = tagsAnchor.querySelectorAll('span');
      const names = [];
      spans.forEach(s => {
        const t = (s.textContent || '').trim();
        if (t && t.toLowerCase() !== 'and') {
          names.push(t);
        }
      });
      if (names.length > 0) {
        return names.join(', ');
      }
    } catch (e) { /* ignore */ }
    return '';
  }

  // ---------- Auto-like tweet ----------
// ---------- Auto-like tweet ----------
function autoLikeTweet(tweet) {
  try {
    if (!tweet) return;
    // X 新版 DOM：button[data-testid="like"] 才是真正的按钮
    const likeBtn = tweet.querySelector('button[data-testid="like"]');
    if (likeBtn) {
      likeBtn.click();
      console.log('Auto-liked tweet ✅');
    } else {
      console.log('Tweet already liked or like button not found.');
    }
  } catch (e) {
    console.warn('Auto-like failed:', e);
  }
}


  // ---------- Core save-with-metadata ----------
  async function saveImageWithMetadataFetch(img, origUrl) {
    const tweet = img.closest('article');
    const userEl = tweet ? tweet.querySelector('div[dir="ltr"] span') : null;
    const displayName = userEl ? userEl.innerText.trim() : '';
    const handle = tweet ? extractUserHandleFromTweet(tweet) : '';
    const textEl = tweet ? tweet.querySelector('div[data-testid="tweetText"]') : null;
    const tweetText = textEl ? textEl.innerText.trim() : '';

    const head = handle ? (displayName ? `${displayName}@${handle}` : `@${handle}`) : (displayName || '');
    let description = '';
    if (head && tweetText) description = `${head}\n${tweetText}`;
    else if (head) description = head;
    else if (tweetText) description = tweetText;

    let tweetUrl = '';
    try {
      const anchor = tweet.querySelector('a[href*="/status/"]');
      if (anchor) tweetUrl = new URL(anchor.getAttribute('href'), location.origin).href;
    } catch (e) {}
    if (tweetUrl) description += `\n${tweetUrl}`;

    // media tags
    const mediaTags = extractMediaTags(tweet);
    if (mediaTags) {
      description += `\nMedia tags: ${mediaTags}`;
    }

    let resp;
    try {
      resp = await fetch(origUrl, { mode: 'cors' });
    } catch (e) {
      throw new Error('Fetch failed (possible CORS): ' + e);
    }
    if (!resp.ok) throw new Error('Image fetch failed: ' + resp.status);

    const contentType = (resp.headers.get('Content-Type') || resp.headers.get('content-type') || '').toLowerCase();
    const arrayBuffer = await resp.arrayBuffer();

    const isJpeg = contentType.includes('jpeg') || contentType.includes('jpg') ||
      origUrl.toLowerCase().includes('.jpg') || origUrl.toLowerCase().includes('format=jpg');

    if (isJpeg) {
      const xmpBytes = buildXmpPacketBytesWithDescriptionOnly(description || '');
      let newBuffer;
      try {
        newBuffer = insertXmpIntoJpegArrayBuffer(arrayBuffer, xmpBytes);
      } catch (err) {
        throw new Error('Insert XMP failed: ' + err.message);
      }
      const newBlob = new Blob([newBuffer], { type: 'image/jpeg' });
      const fname = filenameFromUrl(origUrl, 'image/jpeg');
      downloadBlob(newBlob, fname);
      return { ok: true, method: 'xmp', filename: fname };
    } else {
      const blob = new Blob([arrayBuffer], { type: contentType || 'application/octet-stream' });
      const fname = filenameFromUrl(origUrl, contentType || '');
      downloadBlob(blob, fname);
      return { ok: true, method: 'raw', filename: fname };
    }
  }

  // ---------- UI ----------
  function ensureRelative(el) {
    if (!el) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'static' || !cs.position) el.style.position = 'relative';
  }

 function addSaveButtonToImage(img) {
  try {
    if (img.dataset.saveBtnAdded) return;
    let container = img.parentElement;
    if (!container) container = img;
    ensureRelative(container);

    function createSaveBtn(position) {
      const btn = document.createElement('div');
      btn.className = 'x-save-meta-btn';
      btn.textContent = '💾';
      Object.assign(btn.style, {
        position: 'absolute',
        zIndex: '99999',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '3px 6px',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        lineHeight: '1',
        pointerEvents: 'auto'
      });

      if (position === 'bottom-right') {
        btn.style.bottom = '4px';
        btn.style.right = '4px';
      } else if (position === 'bottom-left') {
        btn.style.bottom = '4px';
        btn.style.left = '4px';
      }

      btn.addEventListener('click', async (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        btn.textContent = '…';
        btn.style.opacity = '0.7';
        try {
          const tweet = img.closest('article');
          autoLikeTweet(tweet); // 自动点赞

          const origUrl = toOrigUrl(img.src || img.getAttribute('src') || '');
          const res = await saveImageWithMetadataFetch(img, origUrl);
          if (res && res.ok) {
            btn.style.background = 'rgba(0,150,0,0.8)';
            setTimeout(() => {
              btn.style.background = 'rgba(0,0,0,0.6)';
              btn.textContent = '💾';
              btn.style.opacity = '1';
            }, 1000);
          } else {
            btn.textContent = '💾';
            btn.style.opacity = '1';
          }
        } catch (err) {
          console.error('Save with metadata error:', err);
          btn.textContent = '💾';
          btn.style.opacity = '1';
        }
      }, { passive: false });

      container.appendChild(btn);
    }

    // 在右下角和左下角都加一个按钮
    createSaveBtn('bottom-right');
    createSaveBtn('bottom-left');

    img.dataset.saveBtnAdded = 'true';
  } catch (e) {
    console.warn('addSaveButtonToImage error', e);
  }
}
  function addMetaAttributes(img) {
    if (img.dataset.metaAdded) return;
    try {
      const tweet = img.closest('article');
      if (!tweet) return;
      const userEl = tweet.querySelector('div[dir="ltr"] span');
      const userName = userEl ? userEl.innerText.trim() : '';
      const textEl = tweet.querySelector('div[data-testid="tweetText"]');
      const tweetText = textEl ? textEl.innerText.trim() : '';
      if (userName) img.title = userName;
      if (tweetText) img.setAttribute('data-description', tweetText);
      img.dataset.metaAdded = 'true';
    } catch (e) { /* ignore */ }
  }

  function processImageElement(img) {
    try {
      if (img.dataset.origProcessed) return;
      img.src = toOrigUrl(img.src || img.getAttribute('src') || '');
      addMetaAttributes(img);
      addSaveButtonToImage(img);
      img.dataset.origProcessed = 'true';
    } catch (e) {
      console.warn('processImageElement error', e);
    }
  }

  function scanAndProcess() {
    document.querySelectorAll('img[src*="twimg.com/media/"]').forEach(processImageElement);
  }

  scanAndProcess();
  const observer = new MutationObserver(() => { scanAndProcess(); });
  observer.observe(document.body, { childList: true, subtree: true });

})();