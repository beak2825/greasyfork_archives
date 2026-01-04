// ==UserScript==
// @name         YouTube Comments Archive Viewer (API-only, compliant)
// @namespace    https://example.com/
// @version      0.1.0
// @description  Shows comments only when available via YouTube Data API. If comments are disabled (e.g., made-for-kids), it displays a "not available" message.
// @author       you
// @match        https://www.youtube.com/watch*
// @grant        GM_xmlhttpRequest
// @connect      www.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/560131/YouTube%20Comments%20Archive%20Viewer%20%28API-only%2C%20compliant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560131/YouTube%20Comments%20Archive%20Viewer%20%28API-only%2C%20compliant%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ====== CONFIG ======
  // Prefer a backend proxy instead of a raw key in a public script.
  const YT_API_KEY = 'AIzaSyAKgVrgZHLkH7j90NYa0irIy6XmhDWBpvQ';

  // How many top-level comments to fetch (YouTube API max is typically 100 per page).
  const MAX_RESULTS = 50;

  // ====== HELPERS ======
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function getVideoIdFromUrl() {
    const url = new URL(location.href);
    return url.searchParams.get('v');
  }

  function apiGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { 'Accept': 'application/json' },
        onload: (resp) => {
          try {
            const data = JSON.parse(resp.responseText);
            resolve({ status: resp.status, data });
          } catch (e) {
            reject(new Error('Failed to parse API response JSON'));
          }
        },
        onerror: () => reject(new Error('Network error calling YouTube API')),
      });
    });
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'style') node.setAttribute('style', v);
      else node.setAttribute(k, v);
    });
    for (const c of children) {
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  function ensurePanel() {
    const existing = document.getElementById('yt-archive-comments-panel');
    if (existing) return existing;

    const panel = el('div', {
      id: 'yt-archive-comments-panel',
      style: [
        'margin-top:16px;',
        'padding:12px;',
        'border:1px solid rgba(128,128,128,0.35);',
        'border-radius:12px;',
        'font-family: Roboto, Arial, sans-serif;',
      ].join(''),
    });

    const header = el('div', { style: 'display:flex;align-items:center;gap:10px;margin-bottom:10px;' }, [
      el('div', { style: 'font-size:16px;font-weight:700;' }, ['Archived comments (API-only)']),
      el('span', {
        id: 'yt-archive-comments-status',
        style: 'font-size:12px;opacity:0.8;'
      }, ['Idle']),
    ]);

    const body = el('div', { id: 'yt-archive-comments-body' }, [
      el('div', { style: 'font-size:13px;opacity:0.9;' }, [
        'This panel only shows comments that are available via the YouTube Data API. ',
        'If comments are disabled (including many made-for-kids videos), there may be nothing to display.'
      ]),
    ]);

    panel.appendChild(header);
    panel.appendChild(body);

    // Try to insert near the top of the watch page content.
    const target =
      document.querySelector('#below #primary-inner') ||
      document.querySelector('#primary #primary-inner') ||
      document.querySelector('#primary') ||
      document.body;

    target.prepend(panel);
    return panel;
  }

  function setStatus(text) {
    const s = document.getElementById('yt-archive-comments-status');
    if (s) s.textContent = text;
  }

  function renderComments(items) {
    const body = document.getElementById('yt-archive-comments-body');
    body.innerHTML = '';

    if (!items || items.length === 0) {
      body.appendChild(el('div', { style: 'margin-top:10px;font-size:14px;' }, [
        'No comments are available via the API for this video. ',
        'This commonly happens when comments are disabled (including many made-for-kids videos).'
      ]));
      return;
    }

    const list = el('div', { style: 'margin-top:10px;display:flex;flex-direction:column;gap:10px;' });

    for (const it of items) {
      const snippet = it?.snippet?.topLevelComment?.snippet;
      const author = snippet?.authorDisplayName || 'Unknown';
      const text = snippet?.textDisplay || '';
      const publishedAt = snippet?.publishedAt ? new Date(snippet.publishedAt).toLocaleString() : '';

      const card = el('div', {
        style: [
          'padding:10px;',
          'border:1px solid rgba(128,128,128,0.25);',
          'border-radius:10px;'
        ].join('')
      }, [
        el('div', { style: 'font-size:13px;font-weight:700;margin-bottom:6px;' }, [
          `${author} `,
          el('span', { style: 'font-weight:400;opacity:0.75;' }, [publishedAt])
        ]),
        el('div', { style: 'font-size:14px;line-height:1.35;' }, [])
      ]);

      // textDisplay contains HTML; insert safely into a container (still not “safe” if you don’t trust it,
      // but it originates from YouTube). If you want stricter safety, strip tags.
      const textBox = card.querySelector('div:last-child');
      textBox.innerHTML = text;

      list.appendChild(card);
    }

    body.appendChild(list);
  }

  async function loadComments(videoId) {
    if (!videoId) return;

    ensurePanel();
    setStatus('Loading…');

    const url =
      'https://www.googleapis.com/youtube/v3/commentThreads' +
      `?part=snippet&videoId=${encodeURIComponent(videoId)}` +
      `&maxResults=${MAX_RESULTS}` +
      `&key=${encodeURIComponent(YT_API_KEY)}`;

    try {
      const { status, data } = await apiGet(url);

      // Typical failures:
      // - 403 / commentsDisabled
      // - 404 / video not found
      // - quota issues
      if (status !== 200 || data?.error) {
        const msg = data?.error?.message || `API error (HTTP ${status})`;
        setStatus('Unavailable');
        const body = document.getElementById('yt-archive-comments-body');
        body.innerHTML = '';
        body.appendChild(el('div', { style: 'margin-top:10px;font-size:14px;' }, [
          'Comments could not be loaded from the YouTube Data API: ',
          msg
        ]));
        return;
      }

      renderComments(data.items || []);
      setStatus(`Loaded ${data.items?.length || 0}`);
    } catch (e) {
      setStatus('Error');
      const body = document.getElementById('yt-archive-comments-body');
      body.innerHTML = '';
      body.appendChild(el('div', { style: 'margin-top:10px;font-size:14px;' }, [
        'Failed to load comments: ',
        String(e.message || e)
      ]));
    }
  }

  // YouTube is an SPA; watch for navigation changes.
  let lastVideoId = null;

  async function tick() {
    const vid = getVideoIdFromUrl();
    if (vid && vid !== lastVideoId) {
      lastVideoId = vid;

      // Give the page time to render on navigation.
      await sleep(800);
      loadComments(vid);
    }
  }

  // Polling is simplest for SPA; MutationObserver also works.
  setInterval(tick, 1000);
})();
