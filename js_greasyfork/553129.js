// ==UserScript==
// @name         🟢 SaveTheVideo Auto-Start & Direct Download
// @version      1.1.0
// @description  Companion script for my X.com Video Downloader. Automatically clicks “Start”, blocks pop-outs, and downloads the video with an animated overlay and checkmark. Requires the X.com Video Downloader script to function properly.
// @match        https://www.savethevideo.com/downloader*
// @author       jayfantz
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/1429572
// @downloadURL https://update.greasyfork.org/scripts/553129/%F0%9F%9F%A2%20SaveTheVideo%20Auto-Start%20%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/553129/%F0%9F%9F%A2%20SaveTheVideo%20Auto-Start%20%20Direct%20Download.meta.js
// ==/UserScript==

// NOTE: This script works only when triggered from the X.com Video Downloader userscript.

(function() {
  'use strict';

  let downloadStarted = false;
  let overlay, pulseDot, messageBox;

  // ---------- Overlay Notification ----------
  function notify(msg) {
    overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      background: '#1e1e1e',
      color: '#eee',
      padding: '24px 32px',
      borderRadius: '12px',
      fontFamily: 'system-ui, sans-serif',
      fontSize: '16px',
      textAlign: 'center',
      maxWidth: '320px',
      boxShadow: '0 0 20px rgba(0,0,0,0.4)',
      position: 'relative'
    });

    // pulse + text + button
box.innerHTML = `
  <div id="dl-message" style="margin-bottom:10px;">${msg}</div>
  <div id="dl-submsg" style="margin-bottom:18px; color:#aaa; font-size:13px;">
    DO NOT CLOSE THIS PAGE UNTIL VIDEO DOWNLOAD IS COMPLETE.
  </div>
  <div id="dl-pulse" style="
    width:12px;height:12px;border-radius:50%;background:#0f0;
    margin:0 auto 16px;animation:pulse 1.2s infinite alternate;
  "></div>
  <button id="dl-close-btn" style="
    background:#444;
    color:#fff;
    border:none;
    border-radius:6px;
    padding:8px 14px;
    font-size:12px;
    cursor:pointer;
  ">OK</button>
  <style>
    @keyframes pulse {
      from {opacity:0.4; transform:scale(0.8);}
      to {opacity:1; transform:scale(1.4);}
    }
    @keyframes pop {
      from {transform:scale(0.5); opacity:0;}
      to {transform:scale(1); opacity:1;}
    }
  </style>
`;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    messageBox = box.querySelector('#dl-message');
    pulseDot = box.querySelector('#dl-pulse');
    box.querySelector('#dl-close-btn').addEventListener('click', () => overlay.remove());
  }

  // ---------- File Downloader ----------
  async function forceDownload(url) {
    if (downloadStarted) return;
    downloadStarted = true;

    const match = decodeURIComponent(location.href).match(/status\/(\d+)/);
    const statusId = match ? match[1] : Date.now();
    const fileName = `tweet_${statusId}.mp4`;

    notify('Video Downloading...');

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();

      // when done, show checkmark + message
      pulseDot.style.animation = 'none';
      pulseDot.style.background = 'transparent';
      pulseDot.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="#0f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
             style="width:20px;height:20px;animation:pop 0.3s ease;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      messageBox.textContent = 'Download Complete!';

const subMsg = overlay.querySelector('#dl-submsg');
if (subMsg) {
  subMsg.style.transition = 'opacity 0.4s ease';
  subMsg.style.opacity = '0';
  setTimeout(() => {
    subMsg.textContent = 'You may now close this page. Enjoy.';
    subMsg.style.opacity = '1';
  }, 300);
}

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      console.log('→ Download complete:', fileName);
    } catch (err) {
      console.error('Download failed:', err);
      messageBox.textContent = 'Download failed.';
      pulseDot.style.background = '#f00';
    }
  }

  // ---------- Block External Popups ----------
  unsafeWindow.open = function (url, name, specs) {
    console.log('Blocked popup tab:', url);
    return null;
  };

  // ---------- Auto-Click Start ----------
  const startWatcher = setInterval(() => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => b.textContent.trim().toLowerCase() === 'start');
    if (btn && btn.offsetParent) {
      console.log('→ Clicking Start');
      btn.click();
      clearInterval(startWatcher);
    }
  }, 300);

  // ---------- Watch for "Download MP4" ----------
  (function watchForDownloadMP4() {
    const re = /\bdownload\b.*\bmp4\b|\bmp4\b.*\bdownload\b/i;

    function visibleText(el) {
      try { return (el.innerText || el.textContent || '').trim(); } catch { return ''; }
    }

    function handleElement(el) {
      if (downloadStarted) return;
      const mp4a = el.querySelector && el.querySelector('a[href*=".mp4"]');
      if (mp4a && mp4a.href) {
        console.log('Found mp4 anchor — forcing download once:', mp4a.href);
        forceDownload(mp4a.href);
        return;
      }
      const parent = el.closest('li, div, [role="menu"], article, section') || document.body;
      const nearby = parent.querySelector && parent.querySelector('a[href*=".mp4"]');
      if (nearby && nearby.href) {
        console.log('Found nearby mp4 anchor — forcing download once:', nearby.href);
        forceDownload(nearby.href);
        return;
      }
    }

    function scanOnce(root = document) {
      if (downloadStarted) return;
      const candidates = [...root.querySelectorAll('a, button, div, span, li, [role="menuitem"]')];
      for (const el of candidates) {
        const txt = visibleText(el);
        if (txt && re.test(txt)) handleElement(el);
      }
    }

    scanOnce();

    const mo = new MutationObserver(muts => {
      if (downloadStarted) return;
      for (const m of muts)
        for (const node of m.addedNodes || [])
          if (node.nodeType === 1) scanOnce(node);
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

    const periodic = setInterval(() => { if (!downloadStarted) scanOnce(); }, 3000);

    watchForDownloadMP4.stop = () => { mo.disconnect(); clearInterval(periodic); };
  })();
})();
