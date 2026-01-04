// ==UserScript==
// @name         Streamable Downloader
// @namespace    tm-streamable-downloader
// @version      1.0.0
// @description  Downloading streamable videos
// @author       Dramorian
// @match        https://streamable.com/*
// @grant        GM_download
// @connect      streamable.com
// @connect      api.streamable.com
// @connect      cdn.streamable.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555152/Streamable%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/555152/Streamable%20Downloader.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CONFIG = {
    BTN_ID: 'tm-streamable-download-btn',
    API_BASE: 'https://api.streamable.com/videos',
    SELECTORS: {
      infoDiv: 'div[id^="player-"][id$="-info"].flex.flex-wrap.md\\:flex-nowrap',
      actionContainer: '.flex.gap-3',
      shareButton: 'button',
      icon: '.material-icons',
    },
    VIDEO_FORMATS: ['mp4', 'mp4-mobile', 'mp4_720p', 'mp4_480p', 'mp4_360p'],
    TOAST_DURATION: 2500,
    SUCCESS_DISPLAY_DURATION: 1500,
    ERROR_DISPLAY_DURATION: 2000,
  };

  const state = {
    isDownloading: false,
  };

  // UI Management
  class UIManager {
    static createButton(templateBtn) {
      const btn = templateBtn.cloneNode(true);
      btn.id = CONFIG.BTN_ID;

      const icon = btn.querySelector(CONFIG.SELECTORS.icon);
      const label = btn.querySelectorAll('span')[1];

      if (icon) icon.textContent = 'download';
      if (label) label.textContent = 'Download';

      return btn;
    }

    static updateButton(btn, { text, icon = 'download', disabled = false }) {
      btn.disabled = disabled;

      const iconEl = btn.querySelector(CONFIG.SELECTORS.icon);
      const labelEl = btn.querySelectorAll('span')[1];

      if (iconEl) iconEl.textContent = icon;
      if (labelEl) labelEl.textContent = text;
    }

    static showToast(message) {
      const toast = document.createElement('div');

      Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#111',
        color: '#fff',
        padding: '10px 14px',
        borderRadius: '8px',
        zIndex: '999999',
        fontSize: '13px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
        opacity: '0.95',
      });

      toast.textContent = message;
      document.body.appendChild(toast);

      setTimeout(() => toast.remove(), CONFIG.TOAST_DURATION);
    }
  }

  // Video Operations
  class VideoDownloader {
    static getVideoId(pathname) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length === 0) return null;

      let candidate = parts[0];
      const prefixes = ['e', 'o', 'embed', 'm'];

      if (prefixes.includes(candidate) && parts[1]) {
        candidate = parts[1];
      }

      return /^[A-Za-z0-9]+$/.test(candidate) ? candidate : null;
    }

    static async fetchVideoData(videoId) {
      const response = await fetch(`${CONFIG.API_BASE}/${videoId}`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return response.json();
    }

    static extractVideoUrl(data) {
      for (const format of CONFIG.VIDEO_FORMATS) {
        const url = data?.files?.[format]?.url;
        if (url) {
          return url.startsWith('//') ? `${location.protocol}${url}` : url;
        }
      }

      throw new Error('No compatible video format found');
    }

    static sanitizeFilename(name) {
      return name.replace(/[\\/:*?"<>|]+/g, '_').trim();
    }

    static async download(url, filename, onProgress) {
      return new Promise((resolve, reject) => {
        GM_download({
          url,
          name: filename,
          onprogress: onProgress,
          onload: resolve,
          onerror: reject,
        });
      });
    }
  }

  // Button Manager
  class DownloadButtonManager {
    constructor() {
      this.observer = null;
      this.init();
    }

    init() {
      this.observer = new MutationObserver(() => this.ensureButton());
      this.observer.observe(document.body, { childList: true, subtree: true });
      this.ensureButton();
    }

    ensureButton() {
      if (document.getElementById(CONFIG.BTN_ID)) return;

      const infoDiv = document.querySelector(CONFIG.SELECTORS.infoDiv);
      if (!infoDiv) return;

      const actionContainer = infoDiv.querySelector(CONFIG.SELECTORS.actionContainer);
      if (!actionContainer) return;

      const shareBtn = actionContainer.querySelector(CONFIG.SELECTORS.shareButton);
      if (!shareBtn) return;

      const dlBtn = UIManager.createButton(shareBtn);
      dlBtn.addEventListener('click', (e) => this.handleDownload(e));
      actionContainer.appendChild(dlBtn);
    }

    async handleDownload(event) {
      event.preventDefault();

      if (state.isDownloading) return;

      const videoId = VideoDownloader.getVideoId(location.pathname);
      if (!videoId) {
        UIManager.showToast('Video ID not found');
        return;
      }

      state.isDownloading = true;
      const btn = document.getElementById(CONFIG.BTN_ID);
      const originalText = btn.querySelectorAll('span')[1]?.textContent || 'Download';

      UIManager.updateButton(btn, {
        text: 'Preparing...',
        icon: 'hourglass_bottom',
        disabled: true,
      });

      try {
        const data = await VideoDownloader.fetchVideoData(videoId);
        const url = VideoDownloader.extractVideoUrl(data);
        const filename = VideoDownloader.sanitizeFilename(`${data?.title || videoId}.mp4`);

        await VideoDownloader.download(url, filename, (progress) => {
          if (progress?.done && progress?.total) {
            const percent = Math.floor((progress.done / progress.total) * 100);
            UIManager.updateButton(btn, {
              text: `Downloading ${percent}%`,
              icon: 'hourglass_bottom',
              disabled: true,
            });
          }
        });

        UIManager.updateButton(btn, {
          text: 'Downloaded ✓',
          icon: 'check_circle',
          disabled: true,
        });
        UIManager.showToast('Download complete');

        setTimeout(() => {
          UIManager.updateButton(btn, { text: originalText, disabled: false });
          state.isDownloading = false;
        }, CONFIG.SUCCESS_DISPLAY_DURATION);

      } catch (error) {
        console.error('Download failed:', error);

        UIManager.updateButton(btn, {
          text: 'Failed',
          icon: 'error',
          disabled: true,
        });
        UIManager.showToast('Error downloading video');

        setTimeout(() => {
          UIManager.updateButton(btn, { text: originalText, disabled: false });
          state.isDownloading = false;
        }, CONFIG.ERROR_DISPLAY_DURATION);
      }
    }
  }

  // Initialize
  new DownloadButtonManager();
})();