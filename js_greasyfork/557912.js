// ==UserScript==
// @name         Roblox Image Embedder - Share the fun Images with your friends!
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace :ID: -> inline emoji, [Image:ID] or [Image:ID,w,h] -> image with optional custom size.
// @author       NotRoblox
// @license MIT
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://*.roblox.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557912/Roblox%20Image%20Embedder%20-%20Share%20the%20fun%20Images%20with%20your%20friends%21.user.js
// @updateURL https://update.greasyfork.org/scripts/557912/Roblox%20Image%20Embedder%20-%20Share%20the%20fun%20Images%20with%20your%20friends%21.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const EMOJI_SIZE_PX = 24;
  const DEFAULT_BLOCK_HEIGHT_PX = 56;
  const MIN_ID_DIGITS = 3;
  const THUMB_API_BASE = 'https://thumbnails.roblox.com/v1/assets';
  const LEGACY_ASSET_THUMB = (id,w=1024,h=1024,fmt='png') => `https://www.roblox.com/asset-thumbnail/image?assetId=${encodeURIComponent(id)}&width=${encodeURIComponent(w)}&height=${encodeURIComponent(h)}&format=${encodeURIComponent(fmt)}`;
  const DIRECT_ASSET = id => `https://www.roblox.com/asset/?id=${encodeURIComponent(id)}`;
  const SKIP_TAGS = new Set(['SCRIPT','STYLE','TEXTAREA','INPUT','CODE','PRE','NOSCRIPT']);
  const IGNORED_SELECTORS = ['#reputationDiv'];

  // Known-good sizes for Thumbnails API attempts
  const THUMB_SIZES = ['420x420','352x352','512x512','150x150','250x250','300x300','384x216','480x270'];

  function thumbnailsApiUrl(id, size) {
    const p = new URLSearchParams({ assetIds: String(id), size: size, format: 'Png', isCircular: 'false' });
    return `${THUMB_API_BASE}?${p.toString()}`;
  }

  async function tryThumbnailsApiForId(id) {
    for (const size of THUMB_SIZES) {
      try {
        const resp = await fetch(thumbnailsApiUrl(id, size), { method: 'GET', credentials: 'omit' });
        if (!resp.ok) continue;
        const j = await resp.json().catch(()=>null);
        if (j && Array.isArray(j.data) && j.data.length && j.data[0].imageUrl) {
          console.debug('rbe: thumbnails API success', id, size, j.data[0].imageUrl);
          return j.data[0].imageUrl;
        }
      } catch (e) {
        console.debug('rbe: thumbnails try error', id, size, e);
      }
    }
    return null;
  }

  async function resolveFinalImageUrl(id) {
    const thumb = await tryThumbnailsApiForId(id);
    if (thumb) return thumb;

    try {
      const resp = await fetch(DIRECT_ASSET(id), { method: 'GET', redirect: 'follow', credentials: 'omit' });
      if (resp && resp.ok && resp.url) {
        console.debug('rbe: asset/?id fetch resolved', id, resp.status, resp.url);
        return resp.url;
      } else {
        console.debug('rbe: asset/?id fetch not ok', id, resp && resp.status);
      }
    } catch (e) {
      console.debug('rbe: asset/?id fetch error', id, e);
    }

    console.debug('rbe: falling back to legacy asset-thumbnail for', id);
    return LEGACY_ASSET_THUMB(id, 1024, 1024, 'png');
  }

  async function attemptSetImageSrc(imgEl, id) {
    // tiny placeholder while resolving
    imgEl.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    try {
      const finalUrl = await resolveFinalImageUrl(id);
      if (!finalUrl) throw new Error('no url resolved');
      imgEl.crossOrigin = 'anonymous';
      imgEl.src = finalUrl;
      console.info(`rbe: set src for ${id} ->`, finalUrl);
    } catch (e) {
      console.warn('rbe: could not resolve image for', id, e);
      imgEl.style.display = 'none';
    }
    const onErr = () => { imgEl.removeEventListener('error', onErr); imgEl.style.display = 'none'; };
    imgEl.addEventListener('error', onErr);
  }

  // Helper: return true if node is inside any ignored selector container
  function isInsideIgnoredContainer(node) {
    if (!node || !node.parentElement) return false;
    for (const sel of IGNORED_SELECTORS) {
      if (node.parentElement.closest && node.parentElement.closest(sel)) return true;
    }
    return false;
  }

  // Regex for [Image:ID,w,h] and :ID:
  const imagePattern = '\\[Image:\\s*([0-9]{' + MIN_ID_DIGITS + ',})' + '(?:\\s*,\\s*([0-9]{1,5})' + '(?:\\s*,\\s*([0-9]{1,5}))?' + ')?\\s*\\]';
  const emojiPattern = ':([0-9]{' + MIN_ID_DIGITS + ',}):';
  const combinedRegex = new RegExp(imagePattern + '|' + emojiPattern, 'g');

  function parseNumberOrNull(s) {
    if (!s) return null;
    const n = parseInt(s, 10);
    if (Number.isFinite(n) && n > 0) return n;
    return null;
  }

  // Create a block image fragment. Only the default (no custom sizes) will get the rbe-block-default class,
  // which the CSS below controls (width:100%; height:56px). Custom-size nodes keep inline sizing.
  function createBlockImageFragment(id, widthPx, heightPx) {
    const wrapper = document.createElement('div');
    wrapper.className = 'rbe-block-wrapper';
    wrapper.style.display = 'block';
    wrapper.style.lineHeight = '0';
    wrapper.style.margin = '6px 0';
    wrapper.style.overflow = 'hidden';
    wrapper.style.background = 'transparent';
    wrapper.style.position = 'relative';

    const img = document.createElement('img');
    img.alt = `[Image:${id}]`;
    img.style.border = '0';
    img.style.display = 'block';
    img.style.margin = '0 auto';

    if (widthPx && heightPx) {
      // exact custom box: fill box exactly (may stretch) — use inline sizing so page CSS won't override
      wrapper.style.width = widthPx + 'px';
      wrapper.style.height = heightPx + 'px';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'fill';
      img.style.position = 'absolute';
      img.style.left = '0';
      img.style.top = '0';
    } else if (widthPx && !heightPx) {
      // custom width only: wrapper width fixed, preserve aspect ratio
      wrapper.style.width = widthPx + 'px';
      wrapper.style.height = 'auto';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.objectFit = 'contain';
    } else {
      // default behaviour for [Image:ID] (no custom size) — add a class so only these images receive the 100%/56px rule
      img.classList.add('rbe-block-default-img');
      // wrapper stays full width; CSS will size the image
      wrapper.style.width = '100%';
      wrapper.style.height = DEFAULT_BLOCK_HEIGHT_PX + 'px'; // keep container height so layout is consistent
      img.style.position = 'absolute';
      img.style.left = '0';
      img.style.right = '0';
      img.style.top = '0';
      img.style.bottom = '0';
      img.style.margin = 'auto';
    }

    // set src async
    attemptSetImageSrc(img, id).catch(()=>{ wrapper.style.display='none'; });

    wrapper.appendChild(img);
    if (widthPx) {
      wrapper.style.marginLeft = 'auto';
      wrapper.style.marginRight = 'auto';
    }
    return wrapper;
  }

  function createEmojiImage(id) {
    const img = document.createElement('img');
    img.alt = `:${id}:`;
    img.classList.add('rbe-emoji'); // script-only class
    // let CSS control rbe-emoji sizing; avoid making global img rules
    attemptSetImageSrc(img, id).catch(()=>{ img.style.display='none'; });
    return img;
  }

  function replaceTextNode(node) {
    const text = node.nodeValue;
    if (!text) return;
    if (text.indexOf('[Image:') === -1 && text.indexOf(':') === -1) return;
    if (isInsideIgnoredContainer(node)) return;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    let created = false;
    while ((match = combinedRegex.exec(text)) !== null) {
      created = true;
      const idx = match.index;
      if (idx > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, idx)));
      if (match[1]) {
        const id = match[1];
        const w = parseNumberOrNull(match[2]);
        const h = parseNumberOrNull(match[3]);
        frag.appendChild(createBlockImageFragment(id, w, h));
      } else if (match[4]) {
        const id = match[4];
        frag.appendChild(createEmojiImage(id));
      }
      lastIndex = combinedRegex.lastIndex;
    }
    if (!created) return;
    if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    node.parentNode.replaceChild(frag, node);
  }

  function processSubtree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(textNode) {
        if (!textNode.nodeValue) return NodeFilter.FILTER_REJECT;
        const parent = textNode.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (isInsideIgnoredContainer(textNode)) return NodeFilter.FILTER_REJECT;
        if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
        if (textNode.nodeValue.indexOf('[Image:') === -1 && textNode.nodeValue.indexOf(':') === -1) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }, false);

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const nd of nodes) {
      try { replaceTextNode(nd); } catch (e) { console.error('rbe replace error', e); }
    }
  }

  // initial run + observer
  processSubtree(document.body);
  const observer = new MutationObserver((mutations) => {
    setTimeout(() => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType === Node.ELEMENT_NODE && !SKIP_TAGS.has(n.tagName)) processSubtree(n);
          else if (n.nodeType === Node.TEXT_NODE) {
            if (!isInsideIgnoredContainer(n)) replaceTextNode(n);
          }
        }
        if (m.type === 'characterData' && m.target && !isInsideIgnoredContainer(m.target)) replaceTextNode(m.target);
      }
      processSubtree(document.body);
    }, 120);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  window.robloxEmbedRescan = function () { processSubtree(document.body); console.info('rbe: rescanned'); };

  // CSS only targets images the script created (script classes) so other imgs are untouched
  const style = document.createElement('style');
  style.textContent = `
    /* Default block images inserted by the script: full width and 56px height */
    img.rbe-block-default-img {
      width: 100% !important;
      height: ${DEFAULT_BLOCK_HEIGHT_PX}px !important;
      object-fit: contain !important;
      display: block !important;
      max-width: 100% !important;
    }

    /* Emoji images inserted by the script */
    img.rbe-emoji {
      width: ${EMOJI_SIZE_PX}px !important;
      height: ${EMOJI_SIZE_PX}px !important;
      object-fit: contain !important;
      display: inline-block !important;
      vertical-align: middle !important;
      margin: 0 3px !important;
    }

    /* keep wrapper behavior safe */
    .rbe-block-wrapper { background: transparent; position: relative; }
  `;
  document.head && document.head.appendChild(style);

})();
