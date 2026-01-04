// ==UserScript==
// @name         MP3PoolOnline – DIY Continuous Player (global, 1 per song)
// @namespace    panaflex.tools
// @version      1.5
// @description  Continuous player using direct download links; 1 version per song, on any mp3poolonline.com page
// @match        *://mp3poolonline.com/*
// @run-at       document-idle
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/557025/MP3PoolOnline%20%E2%80%93%20DIY%20Continuous%20Player%20%28global%2C%201%20per%20song%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557025/MP3PoolOnline%20%E2%80%93%20DIY%20Continuous%20Player%20%28global%2C%201%20per%20song%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG = (...args) => console.log('[MP3Pool DIY Player]', ...args);

  const state = {
    playlist: [],
    index: -1,
  };

  // --- Helpers to clean title/artist & build label ---
  function cleanTitleAndArtist(rawTitle, rawArtist) {
    let title = (rawTitle || '').trim();
    let artist = (rawArtist || '').trim();

    if (!title && !artist) {
      return { title: '', artist: '' };
    }

    // If the title contains the artist (like "Do You Want It Future Cartel, Hoodia New"),
    // strip the artist portion out of the title.
    if (title && artist) {
      const tLower = title.toLowerCase();
      const aLower = artist.toLowerCase();
      const pos = tLower.lastIndexOf(aLower);
      if (pos > -1) {
        title = title.slice(0, pos).trim();
      }
    }

    // Strip a trailing "New" (badge) from the title
    title = title.replace(/\bNew\b$/i, '').trim();

    // Strip stray trailing dashes / en-dashes
    title = title.replace(/[–-]\s*$/u, '').trim();

    return { title, artist };
  }

  function makeLabel(artist, title, versionBits, fallbackIndex) {
    let base;

    if (artist && title) {
      base = `${artist} - ${title}`;
    } else if (title) {
      base = title;
    } else if (artist) {
      base = artist;
    } else {
      base = `Track ${fallbackIndex}`;
    }

    if (versionBits) {
      base += ` (${versionBits})`;
    }

    return base;
  }

  // --- Build playlist: 1 version per track-container, deduped by cleaned title+artist ---
  function buildPlaylist() {
    const trackContainers = Array.from(document.querySelectorAll('.track-container'));
    const seenKeys = new Set();
    const playlist = [];

    trackContainers.forEach((tc, idx) => {
      const link = tc.querySelector(
        '.download-wrap_download a.download-version[href*="/api/v1/tracks"]'
      );
      if (!link) return;

      let rawTitle = '';
      let rawArtist = '';

      const titleNode =
        tc.querySelector('.track__name, .track__title') ||
        tc.querySelector('.track__card h4, .track__card h3');
      if (titleNode) rawTitle = titleNode.textContent.trim();

      const artistNode =
        tc.querySelector('.track__artist, .track__author') ||
        tc.querySelector('.track__card a[href*="/artist/"], .track__card a[href*="/artists/"]');
      if (artistNode) rawArtist = artistNode.textContent.trim();

      if (!rawTitle) {
        rawTitle = link.getAttribute('download') || `Track ${idx + 1}`;
      }

      const { title, artist } = cleanTitleAndArtist(rawTitle, rawArtist);

      const baseKey = (title + '|' + artist)
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

      if (baseKey && seenKeys.has(baseKey)) return;
      if (baseKey) seenKeys.add(baseKey);

      const versionRow = link.closest('.version-row, .list-wrap, .version-actions');
      let versionBits = '';
      if (versionRow) {
        const b = versionRow.querySelector('.version-name b, .version-name strong');
        if (b) versionBits = b.textContent.trim();
      }

      const label = makeLabel(artist, title, versionBits, idx + 1);

      playlist.push({
        href: link.href,
        label,
        anchor: link,
        trackContainer: tc,
        title,
        artist,
        versionBits,
        baseKey,
      });
    });

    LOG(`Built playlist with ${playlist.length} unique songs (1 per track-container)`);
    return playlist;
  }

  // --- Inject UI ---
  function injectUI() {
    if (document.getElementById('mp3pool-diy-player')) return;

    const container = document.createElement('div');
    container.id = 'mp3pool-diy-player';
    Object.assign(container.style, {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: '999999',
      background: 'rgba(0,0,0,0.85)',
      color: '#fff',
      padding: '8px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
      maxWidth: '360px',
    });

    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">
        <strong style="font-size:12px;">DIY Continuous (1 per song)</strong>
        <div style="display:flex;gap:4px;">
          <button id="mp3pool-diy-prev" type="button"
                  style="background:#444;border:none;color:#fff;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:11px;">
            ◀
          </button>
          <button id="mp3pool-diy-start" type="button"
                  style="background:#00a5ff;border:none;color:#fff;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:11px;">
            ▶ Start
          </button>
          <button id="mp3pool-diy-next" type="button"
                  style="background:#444;border:none;color:#fff;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:11px;">
            ▶
          </button>
        </div>
      </div>
      <div id="mp3pool-diy-current"
           style="font-size:11px;line-height:1.3;max-height:2.6em;overflow:hidden;text-overflow:ellipsis;"></div>
      <audio id="mp3pool-diy-audio"
             style="width:100%;margin-top:4px;"
             controls
             preload="none"></audio>
    `;

    document.body.appendChild(container);
    LOG('UI injected');
  }

  function getAudioAndLabel() {
    return {
      audio: document.getElementById('mp3pool-diy-audio'),
      labelEl: document.getElementById('mp3pool-diy-current'),
    };
  }

  function playIndex(idx, source = 'unknown') {
    const { audio, labelEl } = getAudioAndLabel();
    if (!audio || !labelEl) {
      LOG('playIndex: missing audio or labelEl');
      return;
    }

    const list = state.playlist;
    LOG('playIndex: playlist length =', list ? list.length : 0);

    if (!list || !list.length) {
      LOG('playIndex: playlist empty');
      return;
    }

    const item = list[idx];
    if (!item) {
      LOG('playIndex: no item at index', idx);
      return;
    }

    state.index = idx;

    audio._autoFlag = false; // reset per track
    audio.src = item.href;
    labelEl.textContent = `(${idx + 1}/${list.length}) ${item.label}`;

    try {
      const row =
        item.anchor.closest('.track-container, .version-row, .list-wrap') || item.anchor;
      row.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } catch (_) {}

    LOG(`[${source}] Playing index ${idx}:`, item.label, '→', item.href);

    audio.play().catch((err) => {
      LOG('audio.play() failed:', err);
    });
  }

  function next(source = 'unknown') {
    const list = state.playlist;
    LOG('next(): playlist length =', list ? list.length : 0);

    if (!list || !list.length) {
      LOG('next(): playlist empty');
      return;
    }

    let idx = state.index;
    if (idx < 0) idx = 0;
    const nextIdx = idx + 1;

    if (nextIdx >= list.length) {
      LOG(`next(): reached end of playlist (len=${list.length})`);
      return;
    }

    LOG(`next(): advancing from ${idx} to ${nextIdx} (${source})`);
    playIndex(nextIdx, `AUTO:${source}`);
  }

  function prev(source = 'unknown') {
    const list = state.playlist;
    LOG('prev(): playlist length =', list ? list.length : 0);

    if (!list || !list.length) {
      LOG('prev(): playlist empty');
      return;
    }

    let idx = state.index;
    if (idx <= 0) {
      idx = 0;
    } else {
      idx = idx - 1;
    }

    LOG(`prev(): going to ${idx} (${source})`);
    playIndex(idx, `AUTO:${source}`);
  }

  function startContinuous() {
    state.playlist = buildPlaylist();
    state.index = -1;

    if (!state.playlist.length) {
      alert('No download links found to build playlist. (Maybe this page has no tracks or you are logged out?)');
      return;
    }

    playIndex(0, 'START');
  }

  function setupLogic() {
    injectUI();

    const startBtn = document.getElementById('mp3pool-diy-start');
    const nextBtn = document.getElementById('mp3pool-diy-next');
    const prevBtn = document.getElementById('mp3pool-diy-prev');
    const { audio } = getAudioAndLabel();

    if (!startBtn || !audio) {
      LOG('Missing UI or audio; aborting setup.');
      return;
    }

    startBtn.addEventListener('click', () => {
      LOG('Start button clicked');
      startContinuous();
    });

    nextBtn?.addEventListener('click', () => {
      LOG('Next button clicked');
      next('button');
    });

    prevBtn?.addEventListener('click', () => {
      LOG('Prev button clicked');
      prev('button');
    });

    audio.addEventListener('ended', () => {
      LOG('audio ended event fired');
      if (audio._autoFlag) {
        LOG('audio ended: _autoFlag already set, ignoring');
        return;
      }
      audio._autoFlag = true;
      next('ended');
    });

    audio.addEventListener('timeupdate', () => {
      if (!isFinite(audio.duration) || audio.duration <= 0) return;
      const ratio = audio.currentTime / audio.duration;
      if (ratio >= 0.99 && !audio._autoFlag) {
        LOG(
          'timeupdate: near end',
          audio.currentTime.toFixed(2),
          '/',
          audio.duration.toFixed(2),
          '(ratio=',
          ratio.toFixed(3),
          ')'
        );
        audio._autoFlag = true;
        next('timeupdate');
      }
    });

    // For debugging in console:
    window.__mp3poolState = state;
    window.__mp3poolNext = () => next('window');
    window.__mp3poolPrev = () => prev('window');

    LOG('Logic wired up; playlist will persist until you hit Start again');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLogic);
  } else {
    setupLogic();
  }
})();