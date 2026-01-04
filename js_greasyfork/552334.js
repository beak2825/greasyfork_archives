// ==UserScript==
// @name         VideoControlReset
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  视频增强插件：手动增强、跨域安全、Lucide图标、美化控制条、音量调节、进度条、iframe支持、键盘快捷键等。
// @author       DM
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552334/VideoControlReset.user.js
// @updateURL https://update.greasyfork.org/scripts/552334/VideoControlReset.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log("[🎬 Video Enhancer] 脚本加载成功 ✅");

  /*** 引入 Lucide 图标库 ***/
  const ICON_URL = "https://unpkg.com/lucide@latest/dist/umd/lucide.js";
  if (!window.lucide) {
    const script = document.createElement("script");
    script.src = ICON_URL;
    script.onload = () => window.lucide.createIcons();
    document.head.appendChild(script);
  }

  /** 样式 **/
  const style = document.createElement("style");
  style.textContent = `
    .ve-enhance-btn-box {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      gap: 6px;
      z-index: 999999;
    }
    .ve-btn {
      border: none;
      background: rgba(0,0,0,0.5);
      color: #fff;
      border-radius: 8px;
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      transition: all .2s ease;
    }
    .ve-btn:hover {
      background: rgba(0,0,0,0.8);
      transform: scale(1.15);
    }
    .ve-bar {
      position: absolute;
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0,0,0,0.45);
      padding: 8px 14px;
      border-radius: 20px;
      backdrop-filter: blur(6px);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 999999;
    }
    .video-wrapper:hover .ve-bar {
      opacity: 1;
    }
    .ve-progress {
      width: 160px;
      height: 5px;
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .ve-progress-inner {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg,#4fc3f7,#81c784,#f06292);
      border-radius: 3px;
      transition: width 0.1s linear;
    }
    .ve-volume { width: 80px; }
  `;
  document.head.appendChild(style);

  /** 工具函数 **/
  const createIcon = (name, size = 20) => {
    const i = document.createElement("i");
    i.dataset.lucide = name;
    i.style.width = `${size}px`;
    i.style.height = `${size}px`;
    return i;
  };

  const createButton = (icon, title, onClick) => {
    const btn = document.createElement("button");
    btn.className = "ve-btn";
    btn.title = title;
    btn.appendChild(createIcon(icon));
    btn.onclick = onClick;
    return btn;
  };

  /** 截图功能 **/
  function captureFrame(video) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "screenshot.png";
    link.click();
  }

  /** 增强核心函数 **/
  function enhanceVideo(video) {
    if (video.dataset.enhanced) return;
    video.dataset.enhanced = "true";
    const wrapper = video.parentElement;
    wrapper.classList.add("video-wrapper");

    const bar = document.createElement("div");
    bar.className = "ve-bar";

    const playBtn = createButton("play", "播放/暂停", () => {
      video.paused ? video.play() : video.pause();
    });

    const backBtn = createButton("rewind", "后退5秒", () => video.currentTime -= 5);
    const forwardBtn = createButton("fast-forward", "前进5秒", () => video.currentTime += 5);

    const speedBtn = createButton("gauge", "倍速切换", () => {
      const speeds = [1, 1.25, 1.5, 2];
      const next = speeds[(speeds.indexOf(video.playbackRate) + 1) % speeds.length];
      video.playbackRate = next;
      speedBtn.title = `倍速：${next}x`;
    });

    const pipBtn = createButton("monitor-up", "画中画", () => video.requestPictureInPicture());
    const fsBtn = createButton("maximize", "全屏", () => video.requestFullscreen());
    const shotBtn = createButton("camera", "截图", () => captureFrame(video));

    // 进度条
    const progress = document.createElement("div");
    progress.className = "ve-progress";
    const inner = document.createElement("div");
    inner.className = "ve-progress-inner";
    progress.appendChild(inner);
    progress.onclick = (e) => {
      const rect = progress.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      video.currentTime = percent * video.duration;
    };
    video.addEventListener("timeupdate", () => {
      inner.style.width = `${(video.currentTime / video.duration) * 100}%`;
    });

    // 音量
    const volBox = document.createElement("div");
    volBox.style.display = "flex";
    volBox.style.alignItems = "center";
    const volIcon = createIcon("volume-2");
    const volSlider = document.createElement("input");
    volSlider.type = "range";
    volSlider.className = "ve-volume";
    volSlider.min = 0;
    volSlider.max = 1;
    volSlider.step = 0.05;
    volSlider.value = video.volume;
    volSlider.oninput = () => {
      video.volume = volSlider.value;
      volIcon.dataset.lucide = video.volume == 0 ? "volume-x" : "volume-2";
      window.lucide && window.lucide.createIcons();
    };
    volBox.append(volIcon, volSlider);

    [playBtn, backBtn, forwardBtn, speedBtn, pipBtn, fsBtn, shotBtn, progress, volBox].forEach(b => bar.appendChild(b));
    wrapper.appendChild(bar);

    // 播放状态联动
    const updatePlayIcon = () => {
      playBtn.firstChild.dataset.lucide = video.paused ? "play" : "pause";
      window.lucide && window.lucide.createIcons();
    };
    video.addEventListener("play", updatePlayIcon);
    video.addEventListener("pause", updatePlayIcon);

    window.lucide && window.lucide.createIcons();
  }

  /** 添加增强/下载按钮 **/
  function addEnhanceButton(video) {
    if (video.dataset.hasBtn) return;
    video.dataset.hasBtn = "true";

    const box = document.createElement("div");
    box.className = "ve-enhance-btn-box";

    const enhance = createButton("sparkles", "增强视频", () => enhanceVideo(video));
    const download = createButton("download", "下载视频", () => {
      const a = document.createElement("a");
      a.href = video.src;
      a.download = "video.mp4";
      a.click();
    });

    box.append(enhance, download);
    video.parentElement.style.position = "relative";
    video.parentElement.appendChild(box);
    window.lucide && window.lucide.createIcons();
  }

  /** 扫描所有视频（支持 iframe） **/
  function scanVideos(root = document) {
    root.querySelectorAll("video").forEach(v => addEnhanceButton(v));

    root.querySelectorAll("iframe").forEach(frame => {
      try {
        const doc = frame.contentDocument || frame.contentWindow.document;
        if (!doc) return;
        const vids = doc.querySelectorAll("video");
        vids.forEach(v => addEnhanceButton(v));
      } catch {
        // 跨域 iframe 忽略
      }
    });
  }

  scanVideos();

  /** 监听增量变化 **/
  const obs = new MutationObserver(mutations => {
    for (const m of mutations)
      m.addedNodes.forEach(n => n.nodeType === 1 && scanVideos(n));
  });
  obs.observe(document.body, { childList: true, subtree: true });

})();