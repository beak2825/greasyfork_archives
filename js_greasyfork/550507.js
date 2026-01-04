// ==UserScript==
// @name          Facebook Video & Story Downloader
// @namespace     King1x32
// @icon          https://www.facebook.com/favicon.ico
// @match         https://www.facebook.com/*
// @exclude-match https://www.facebook.com/
// @version       2.1
// @description   Download any video on Facebook (post/chat/comment) and stories
// @license       MIT
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_download
// @downloadURL https://update.greasyfork.org/scripts/550507/Facebook%20Video%20%20Story%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550507/Facebook%20Video%20%20Story%20Downloader.meta.js
// ==/UserScript==

(() => {
  function getOverlapScore(el) {
    const rect = el.getBoundingClientRect();
    return (
      Math.min(rect.bottom, window.innerHeight || document.documentElement.clientHeight) -
      Math.max(0, rect.top)
    );
  }

  function getVideoIdFromVideoElement(video) {
    try {
      const src = video.src;
      if (src && src.includes('blob:')) {
        const wrapper = video.closest('[data-instancekey]');
        if (wrapper) {
          const instanceKey = wrapper.getAttribute('data-instancekey');
          if (instanceKey) {
            const match = instanceKey.match(/id-vpuid-([a-f0-9-]+)/);
            if (match) return match[1];
          }
        }
      }
    } catch (e) {}

    try {
      let currentElement = video;
      for (let i = 0; i < 10; i++) {
        if (!currentElement) break;
        for (let k in currentElement) {
          if (k.startsWith("__reactProps") || k.startsWith("__reactInternalInstance")) {
            try {
              const props = currentElement[k];
              if (props && props.children && props.children.props) {
                const videoFBID = props.children.props.videoFBID || props.children.props.videoId;
                if (videoFBID) return videoFBID;
              }
              if (props && props.videoFBID) return props.videoFBID;
              if (props && props.videoId) return props.videoId;
            } catch (e) {}
          }
        }
        currentElement = currentElement.parentElement;
      }
    } catch (e) {}

    try {
      const url = window.location.href;
      const videoIdMatch = url.match(/\/videos\/(\d+)/);
      if (videoIdMatch) return videoIdMatch[1];
      const watchMatch = url.match(/\/watch\/?\?.*[&?]v=(\d+)/);
      if (watchMatch) return watchMatch[1];
    } catch (e) {}

    try {
      let parent = video.parentElement;
      for (let i = 0; i < 20; i++) {
        if (!parent) break;
        const videoId = parent.getAttribute('data-video-id') ||
                       parent.getAttribute('data-video-fbid') ||
                       parent.getAttribute('data-videoid');
        if (videoId) return videoId;
        parent = parent.parentElement;
      }
    } catch (e) {}

    try {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        if (script.textContent) {
          const match = script.textContent.match(/"videoFBID":"(\d+)"/);
          if (match) return match[1];
          const match2 = script.textContent.match(/"video_id":"(\d+)"/);
          if (match2) return match2[1];
        }
      }
    } catch (e) {}

    return null;
  }

  function findVideoIdInPageData() {
    try {
      if (window.__initialData) {
        const dataStr = JSON.stringify(window.__initialData);
        const match = dataStr.match(/"videoFBID":"(\d+)"/);
        if (match) return [match[1]];
      }

      if (window.require && typeof window.require.getData === 'function') {
        const data = window.require.getData();
        if (data) {
          const dataStr = JSON.stringify(data);
          const matches = dataStr.match(/"videoFBID":"(\d+)"/g) || [];
          return matches.map(m => m.match(/"videoFBID":"(\d+)"/)[1]);
        }
      }

      const pageHtml = document.documentElement.innerHTML;
      const matches = pageHtml.match(/"videoFBID":"(\d+)"/g) || [];
      const videoIds = matches.map(m => m.match(/"videoFBID":"(\d+)"/)[1]);
      if (videoIds.length > 0) return [...new Set(videoIds)];
    } catch (e) {}
    return [];
  }

  async function getWatchingVideoId() {
    const allVideos = Array.from(document.querySelectorAll("video"));
    const result = [];
    for (const video of allVideos) {
      const videoId = getVideoIdFromVideoElement(video);
      if (videoId) {
        result.push({
          videoId,
          overlapScore: getOverlapScore(video),
          playing:
            video.currentTime > 0 &&
            !video.paused &&
            !video.ended &&
            video.readyState > 2,
        });
      }
    }
    if (result.length === 0) {
      const pageVideoIds = findVideoIdInPageData();
      for (const videoId of pageVideoIds) {
        result.push({ videoId, overlapScore: 100, playing: false });
      }
    }
    const playingVideo = result.find((_) => _.playing);
    if (playingVideo) return [playingVideo.videoId];
    return result
      .filter((_) => _.videoId && (_.overlapScore > 0 || _.playing))
      .sort((a, b) => b.overlapScore - a.overlapScore)
      .map((_) => _.videoId);
  }

  async function getVideoUrlFromVideoId(videoId) {
    const dtsg = await getDtsg();
    try {
      return await getLinkFbVideo2(videoId, dtsg);
    } catch (e) {
      try {
        return await getLinkFbVideo1(videoId, dtsg);
      } catch (e2) {
        throw new Error(`Both download methods failed for video ${videoId}`);
      }
    }
  }

  async function getLinkFbVideo2(videoId, dtsg) {
    const res = await fetch(
      "https://www.facebook.com/video/video_data_async/?video_id=" + videoId,
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "x-requested-with": "XMLHttpRequest",
        },
        body: stringifyVariables({
          __a: "1",
          fb_dtsg: dtsg,
        }),
      }
    );
    let text = await res.text();
    text = text.replace("for (;;);", "");
    const json = JSON.parse(text);
    const { hd_src, hd_src_no_ratelimit, sd_src, sd_src_no_ratelimit } =
      json?.payload || {};
    const videoUrl = hd_src_no_ratelimit || hd_src || sd_src_no_ratelimit || sd_src;
    if (!videoUrl) throw new Error('No video URL found in response');
    return videoUrl;
  }

  async function getLinkFbVideo1(videoId, dtsg) {
    const res = await fetchGraphQl(
      "5279476072161634",
      {
        UFI2CommentsProvider_commentsKey: "CometTahoeSidePaneQuery",
        caller: "CHANNEL_VIEW_FROM_PAGE_TIMELINE",
        videoID: videoId,
      },
      dtsg
    );
    const text = await res.text();
    const lines = text.split("\n");
    if (lines.length === 0) throw new Error('Empty response from GraphQL');
    const a = JSON.parse(lines[0]);
    if (!a.data || !a.data.video) throw new Error('No video data in GraphQL response');
    const videoUrl = a.data.video.playable_url_quality_hd || a.data.video.playable_url;
    if (!videoUrl) throw new Error('No playable URL found in video data');
    return videoUrl;
  }

  function fetchGraphQl(doc_id, variables, dtsg) {
    return fetch("https://www.facebook.com/api/graphql/", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest",
      },
      body: stringifyVariables({
        doc_id: doc_id,
        variables: JSON.stringify(variables),
        fb_dtsg: dtsg,
        server_timestamps: true,
      }),
    });
  }

  function stringifyVariables(d, e) {
    const f = [];
    for (const a in d) {
      if (d.hasOwnProperty(a)) {
        const g = e ? e + "[" + a + "]" : a,
          b = d[a];
        f.push(
          b !== null && typeof b === "object"
            ? stringifyVariables(b, g)
            : encodeURIComponent(g) + "=" + encodeURIComponent(b)
        );
      }
    }
    return f.join("&");
  }

  async function getDtsg() {
    try {
      if (window.require) {
        return require("DTSGInitialData").token;
      }
    } catch (e) {}
    try {
      const dtsgMatch = document.documentElement.innerHTML.match(/"token":"([^"]+)"/);
      if (dtsgMatch) return dtsgMatch[1];
    } catch (e) {}
    try {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        if (script.textContent && script.textContent.includes('DTSGInitialData')) {
          const match = script.textContent.match(/"token":"([^"]+)"/);
          if (match) return match[1];
        }
      }
    } catch (e) {}
    throw new Error('Could not find DTSG token');
  }

  async function downloadURL(url, name) {
    if (typeof GM_download !== 'undefined') {
      GM_download({
        url: url,
        name: name,
        saveAs: false,
        onload: () => console.log('Download completed: ' + name),
        onerror: (error) => {
          console.error('GM_download failed:', error);
          downloadUsingFetch(url, name);
        }
      });
      return;
    }

    downloadUsingFetch(url, name);
  }

  async function downloadUsingFetch(url, name) {
    try {
      if (typeof GM_xmlhttpRequest !== 'undefined') {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          responseType: 'blob',
          onload: function(response) {
            const blob = response.response;
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = name;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
          },
          onerror: function(error) {
            console.error('Download failed:', error);
            window.open(url, '_blank');
          }
        });
      } else {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      }
    } catch (error) {
      console.error('Download failed:', error);
      if (confirm('Direct download failed. Would you like to open the video in a new tab? You can right-click and save from there.')) {
        window.open(url, '_blank');
      }
    }
  }

  async function downloadWatchingVideo() {
    try {
      const listVideoId = await getWatchingVideoId();
      if (!listVideoId?.length) {
        throw Error("No video found on the page.");
      }
      let downloadCount = 0;
      for (const videoId of listVideoId) {
        try {
          const videoUrl = await getVideoUrlFromVideoId(videoId);
          if (videoUrl) {
            await downloadURL(videoUrl, `fb_video_${videoId}.mp4`);
            downloadCount++;
          }
        } catch (e) {}
      }
      if (downloadCount === 0) {
        throw new Error("Could not download any videos.");
      }
    } catch (e) {
      alert("ERROR: " + e.message);
    }
  }

  function createDownloadIcon(storySaver = null) {
    const icon = document.createElement('div');
    icon.className = 'fb-video-download-icon';
    icon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7,10 12,15 17,10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    `;
    icon.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 1001;
      backdrop-filter: blur(4px);
      opacity: 0.8;
    `;
    icon.addEventListener('mouseenter', () => {
      icon.style.opacity = '1';
      icon.style.background = 'rgba(0, 0, 0, 0.8)';
      icon.style.transform = 'scale(1.1)';
    });
    icon.addEventListener('mouseleave', () => {
      if (!icon.classList.contains('downloading')) {
        icon.style.opacity = '0.8';
        icon.style.background = 'rgba(0, 0, 0, 0.6)';
        icon.style.transform = 'scale(1)';
      }
    });
    icon.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (icon.classList.contains('downloading')) return;
      icon.classList.add('downloading');
      icon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      `;
      icon.style.background = 'rgba(66, 165, 245, 0.9)';
      icon.style.opacity = '1';
      try {
        if (/\/stories\//.test(window.location.href) && storySaver) {
          await storySaver.handleDownload();
        } else {
          await downloadWatchingVideo();
        }
        icon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        `;
        icon.style.background = 'rgba(76, 175, 80, 0.9)';
        setTimeout(() => {
          icon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          `;
          icon.style.background = 'rgba(0, 0, 0, 0.6)';
          icon.style.opacity = '0.8';
          icon.classList.remove('downloading');
        }, 2000);
      } catch (error) {
        icon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        `;
        icon.style.background = 'rgba(244, 67, 54, 0.9)';
        setTimeout(() => {
          icon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          `;
          icon.style.background = 'rgba(0, 0, 0, 0.6)';
          icon.style.opacity = '0.8';
          icon.classList.remove('downloading');
        }, 3000);
      }
    });
    return icon;
  }

  function shouldShowDownloadButton() {
    const url = window.location.href;
    if (/\/watch\?v=/.test(url)) return false;
    if (/facebook\.com\/stories\//.test(url)) return false;
    return true;
  }

  function addDownloadIconToVideo(videoElement) {
    if (!shouldShowDownloadButton()) return;
    if (videoElement.parentElement.querySelector('.fb-video-download-icon')) return;

    const videoContainer = videoElement.closest('[data-instancekey]') ||
                          videoElement.closest('[class*="x5yr21d"][class*="x1n2onr6"]') ||
                          videoElement.parentElement;
    if (videoContainer) {
      const containerStyle = window.getComputedStyle(videoContainer);
      if (containerStyle.position === 'static') {
        videoContainer.style.position = 'relative';
      }
      const icon = createDownloadIcon();
      videoContainer.appendChild(icon);
      videoContainer.addEventListener('mouseenter', () => {
        icon.style.opacity = '0.8';
      });
      videoContainer.addEventListener('mouseleave', () => {
        if (!icon.classList.contains('downloading')) {
          icon.style.opacity = '0.6';
        }
      });
      icon.style.opacity = '0.6';
    }
  }

  function observeForVideos() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
            if (node.tagName === 'VIDEO') {
              addDownloadIconToVideo(node);
            }
            videos.forEach(video => {
              setTimeout(() => addDownloadIconToVideo(video), 300);
            });
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
  }

  class StorySaver {
    constructor() {
      this.mediaUrl = null;
      this.detectedVideo = null;
      this.init();
    }

    init() {
      this.setupMutationObserver();
    }

    setupMutationObserver() {
      const observer = new MutationObserver(() => this.checkPageStructure());
      observer.observe(document.body, { childList: true, subtree: true });
    }

    get isFacebookPage() {
      return /(facebook)/.test(window.location.href);
    }

    checkPageStructure() {
      const btn = document.getElementById("downloadBtn");
      if (/(\/stories\/)/.test(window.location.href)) {
        this.createButtonWithPolling();
      } else if (btn) {
        btn.remove();
      }
    }

    createButtonWithPolling() {
      let attempts = 0;
      const interval = setInterval(() => {
        if (document.getElementById("downloadBtn")) {
          clearInterval(interval);
          return;
        }
        const createdBtn = this.createButton();
        if (createdBtn || attempts >= 5) clearInterval(interval);
        attempts++;
      }, 500);
    }

    createButton() {
      if (document.getElementById("downloadBtn")) return null;
      const topBars = this.isFacebookPage
        ? Array.from(document.querySelectorAll("div.xtotuo0"))
        : Array.from(document.querySelectorAll("div.x1xmf6yo"));
      const topBar = topBars.find(
        (bar) => bar instanceof HTMLElement && bar.offsetHeight > 0
      );
      if (!topBar) return null;

      const btn = document.createElement("button");
      btn.id = "downloadBtn";
      btn.textContent = "⬇";
      btn.style.fontSize = "20px";
      btn.style.background = "transparent";
      btn.style.border = "none";
      btn.style.color = "white";
      btn.style.cursor = "pointer";
      btn.style.zIndex = "9999";

      btn.addEventListener("click", () => this.handleDownload());
      topBar.appendChild(btn);
      return btn;
    }

    async handleDownload() {
      try {
        await this.detectMedia();
        if (!this.mediaUrl) return;
        const filename = this.generateFileName();
        await this.downloadMedia(this.mediaUrl, filename);
      } catch {}
    }

    async detectMedia() {
      const video = this.findVideo();
      const image = this.findImage();
      if (video) {
        this.mediaUrl = video;
        this.detectedVideo = true;
      } else if (image) {
        this.mediaUrl = image.src;
        this.detectedVideo = false;
      }
    }

    findVideo() {
      const videos = Array.from(document.querySelectorAll("video")).filter(
        (v) => v.offsetHeight > 0
      );
      for (const video of videos) {
        const url = this.searchVideoSource(video);
        if (url) return url;
      }
      return null;
    }

    searchVideoSource(video) {
      const reactFiberKey = Object.keys(video).find(
        (key) => key.startsWith("__reactFiber")
      );
      if (!reactFiberKey) return null;
      const reactKey = reactFiberKey.replace("__reactFiber", "");
      const parent =
        video.parentElement?.parentElement?.parentElement?.parentElement;
      const reactProps = parent?.[`__reactProps${reactKey}`];
      const implementations =
        reactProps?.children?.[0]?.props?.children?.props?.implementations ??
        reactProps?.children?.props?.children?.props?.implementations;
      if (implementations) {
        for (const index of [1, 0, 2]) {
          const source = implementations[index]?.data;
          const url =
            source?.hdSrc || source?.sdSrc || source?.hd_src || source?.sd_src;
          if (url) return url;
        }
      }
      const videoData =
        video[reactFiberKey]?.return?.stateNode?.props?.videoData?.$1;
      return videoData?.hd_src || videoData?.sd_src || null;
    }

    findImage() {
      const images = Array.from(document.querySelectorAll("img")).filter(
        (img) => img.offsetHeight > 0 && img.src.includes("cdn")
      );
      return images.find((img) => img.height > 400) || null;
    }

    generateFileName() {
      const timestamp = new Date().toISOString().split("T")[0];
      let userName = "unknown";
      if (this.isFacebookPage) {
        const user = Array.from(
          document.querySelectorAll("span.xuxw1ft.xlyipyv")
        ).find((e) => e instanceof HTMLElement && e.offsetWidth > 0);
        userName = user?.innerText || userName;
      } else {
        const user = Array.from(document.querySelectorAll(".x1i10hfl")).find(
          (u) =>
            u instanceof HTMLAnchorElement &&
            u.offsetHeight > 0 &&
            u.offsetHeight < 35
        );
        userName = user?.pathname.replace(/\//g, "") || userName;
      }
      const extension = this.detectedVideo ? "mp4" : "jpg";
      return `${userName}-${timestamp}.${extension}`;
    }

    async downloadMedia(url, filename) {
      try {
        // Use the same improved download method
        await downloadURL(url, filename);
      } catch (error) {
        console.error('Story download failed:', error);
      }
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    const existingVideos = document.querySelectorAll('video');
    existingVideos.forEach(video => {
      addDownloadIconToVideo(video);
    });
  }, 1000);

  observeForVideos();

  if (/\/stories\//.test(window.location.href)) {
    new StorySaver();
  }

  GM_registerMenuCommand("Download Video", downloadWatchingVideo);

  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      downloadWatchingVideo();
    }
  });
})();