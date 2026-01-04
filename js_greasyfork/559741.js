// ==UserScript==
// @name            抖音4K视频免登录下载
// @namespace       none
// @version         1.0.2
// @description     不登录也可以下载(4K/HDR)视频，适用于抖音网页版。圣诞马哥陪你过冬日！
// @author          占南弦 (Gemini协助)
// @match           https://*.douyin.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant           none
// @license         none
// @downloadURL https://update.greasyfork.org/scripts/559741/%E6%8A%96%E9%9F%B34K%E8%A7%86%E9%A2%91%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/559741/%E6%8A%96%E9%9F%B34K%E8%A7%86%E9%A2%91%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  class Config {
    static global = new Config();
    features = {
        convert_webp_to_png: true,
        filename_template: "{nickname}_{id}_{desc}"
    };
    _key = "__douyin-dl-user-js__";
    constructor() { try { this.load(); } catch (error) { console.error(error); } }
    toJSON() { return { features: this.features }; }
    load() {
      if (localStorage.getItem(this._key)) {
        const data = JSON.parse(localStorage.getItem(this._key));
        this.features = { ...this.features, ...data.features };
      }
    }
    save() { localStorage.setItem(this._key, JSON.stringify(this.toJSON())); }
  }

  class Downloader {
    constructor() {}
    async convertWebPToPNG(blob) {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(img.src);
      return new Promise((resolve) => {
        canvas.toBlob((pngBlob) => { resolve(pngBlob); }, "image/png");
        canvas.onerror = (e) => { resolve(blob); };
      });
    }

    async prepare_download_file(imgSrc, filename_input = "") {
      if (imgSrc.startsWith("//")) imgSrc = `${window.location.protocol}${imgSrc}`;
      console.log(`[dy-dl] 正在请求资源: ${imgSrc}`);
      try {
          const response = await fetch(imgSrc, { referrerPolicy: "no-referrer" });
          if (!response.ok) return { ok: false, error: `Fetch failed: ${response.status}` };

          const contentType = response.headers.get("content-type");
          const isImage = contentType && contentType.startsWith("image/");
          const isWebP = contentType && contentType.includes("webp");
          let fileExt = contentType ? contentType.split("/")[1] : "mp4";

          if (fileExt === "jpeg") fileExt = "jpg";
          if (!isImage && !imgSrc.includes(".mp4")) fileExt = "mp4";

          const determinedFileExt = isImage && isWebP ? "png" : fileExt;

          let filename = filename_input || "download";

          // 清理非法字符 (恢复为替换所有特殊字符，包括 /)
          filename = filename.replace(/[\\/:*?"<>|]/g, "_");

          if (!filename.endsWith("." + determinedFileExt)) {
              filename += `.${determinedFileExt}`;
          }

          const blob = await response.blob();
          let pngBlob = null;
          if (isImage && isWebP && Config.global.features.convert_webp_to_png) {
             try { pngBlob = await this.convertWebPToPNG(blob); } catch (e) {}
          }

          return { blob, filename, isImage, isWebP, pngBlob, fileExt: determinedFileExt, ok: true };
      } catch (e) {
          return { ok: false, error: e.message };
      }
    }

    async download_blob(blob, filename) {
      const link = document.createElement("a");
      link.style.display = "none";
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }

    async download_file(source, filename_input = "", fallback_src = []) {
      let url_sources = Array.from(new Set([source, ...fallback_src].filter(x => typeof x === "string" && x.length > 0)));
      for (const url of url_sources) {
        try {
          const result = await this.prepare_download_file(url, filename_input);
          if (result.ok) {
            await this.download_blob(result.pngBlob || result.blob, result.filename);
            return;
          } else {
             console.warn(`[dy-dl] 地址失效: ${url}, 错误: ${result.error}`);
          }
        } catch (e) { console.error(`[dy-dl] Download error for ${url}:`, e); }
      }
      alert(`[dy-dl] 下载失败，可能是链接已过期或需要 Referer，请上下滑动确保抓取到源。等我更新`);
    }
  }

  class MediaHandler {
    player = null;
    current_media = null;
    downloading = false;
    downloader;
    constructor(downloader) {
      this.downloader = downloader;
      this.download_current_media = this._lock_download(this._download_current_media_logic.bind(this, false));
      this.download_best_media = this._lock_download(this._download_current_media_logic.bind(this, true));
    }

    static toShortId(bigintStr) { try { return BigInt(bigintStr).toString(36); } catch (e) { return bigintStr; } }

    _build_filename(media) {
      const { authorInfo: { nickname }, awemeId, desc } = media;
      const short_id = MediaHandler.toShortId(awemeId);
      let rawDesc = desc || "";
      rawDesc = rawDesc.replace(/[#/\?<>\\:\*\|":\n\r]/g, "").trim().substring(0, 80);

      const cfg = Config.global.features;
      // 默认模板
      const f_tmpl = cfg.filename_template || "{nickname}_{id}_{desc}";

      let fileName = f_tmpl
          .replace(/{nickname}/g, nickname || "unknown")
          .replace(/{id}/g, short_id || "0")
          .replace(/{desc}/g, rawDesc || "no_desc");

      return fileName.trim();
    }

    _bind_player_events() {
      if (!this.player) return;
      const update = () => {
          if (this.player?.config?.awemeInfo) {
              this.current_media = this.player.config.awemeInfo;
          }
      };
      update();
      this.player.on("play", update);
      this.player.on("definitionChange", () => {
          console.log("[dy-dl] 检测到画质切换，更新资源数据...");
          update();
      });
    }

    async _start_detect_player_change() {
      while (1) {
        // @ts-ignore
        const currentPlayer = window.player;
        if (this.player !== currentPlayer) {
          this.player = currentPlayer;
          if (this.player) this._bind_player_events();
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    _lock_download(fn) {
      return async (...args) => {
        if (this.downloading) return alert("正在下载中...");
        this.downloading = true;
        try { await fn(...args); } finally { await new Promise(r => setTimeout(r, 300)); this.downloading = false; }
      };
    }

    _get_video_urls(video_obj) {
      if (!video_obj) return [];
      const sources = [];
      if (video_obj.playApi) sources.push(video_obj.playApi);
      if (Array.isArray(video_obj.playAddr)) sources.push(...video_obj.playAddr.map(x => x.src));
      if (video_obj.bitRateList) video_obj.bitRateList.forEach(x => { if (x.playApi) sources.push(x.playApi); });
      return Array.from(new Set(sources.filter(Boolean)));
    }

    _get_best_video_url(video_obj) {
        if (!video_obj) return null;
        console.group("[dy-dl] 开始分析画质数据");
        let candidates = [];
        if (Array.isArray(video_obj.bitRateList) && video_obj.bitRateList.length > 0) {
             candidates = video_obj.bitRateList.map(item => {
                const name = item.gearName || item.gear_name || "未知";
                const bitrate = item.bitRate || item.bit_rate || 0;
                const urlList = [];
                if (item.playApi) urlList.push(item.playApi);
                if (item.playAddr && item.playAddr.urlList) urlList.push(...item.playAddr.urlList);
                return { name, bitrate, urls: urlList, raw: item };
            });
        }
        if (candidates.length === 0) {
            console.warn("未找到 bitRateList，尝试直接读取 playAddr");
            const fallback = this._get_video_urls(video_obj);
            console.groupEnd();
            return fallback[0] || null;
        }
        candidates.sort((a, b) => b.bitrate - a.bitrate);
        const best = candidates[0];
        console.log(`[dy-dl] 自动选定最高码率: ${best.name} (Bitrate: ${best.bitrate})`);
        console.groupEnd();
        return best.urls[0] || null;
    }

    async _download_current_media_logic(forceBestQuality = false) {
      // @ts-ignore
      const realTimeMedia = window.player?.config?.awemeInfo || this.current_media;
      if (!realTimeMedia) return alert("请先播放视频以获取数据。");

      const { video, images } = realTimeMedia;
      const filename_base = this._build_filename(realTimeMedia);

      if (Array.isArray(images) && images.length > 0) {
        let count = 0;
        for (let i = 0; i < images.length; i++) {
          const item = images[i];
          const name = `${filename_base}_${i+1}`;
          const i_urls = item.urlList?.filter(Boolean);
          if (i_urls && i_urls.length) { await this.downloader.download_file(i_urls[0], name, i_urls); count++; }
        }
        if (count === 0) alert("图集下载失败");
        return;
      }

      let targetUrl = "";
      const allUrls = this._get_video_urls(video);

      if (forceBestQuality) {
          targetUrl = this._get_best_video_url(video);
          if (!targetUrl) targetUrl = allUrls[0];
      } else {
          targetUrl = allUrls[0];
      }

      if (targetUrl) {
        const finalName = forceBestQuality ? `${filename_base}_Best` : filename_base;
        await this.downloader.download_file(targetUrl, finalName, allUrls);
      } else {
        alert("未找到视频链接");
      }
    }

    show_media_details() { console.log(this.current_media); }
  }

  class FloatingUI {
    constructor(mediaHandler) {
      this.mh = mediaHandler;
      this.iconSVG = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="64" height="64">

<g transform="matrix(1.3333334 0 0 1.3333334 0 0)">
	<image  x="0" y="0" xlink:href="data:image/png;base64,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" preserveAspectRatio="none" width="48" height="48"/>
</g>
</svg>
`;

      this.initCSS();
      this.render();
      this.makeDraggable();
    }

    initCSS() {
      const style = document.createElement('style');
      style.textContent = `
        #dy-dl-float-container {
            position: fixed;
            top: 20%;
            right: 20px;
            z-index: 99999;
            user-select: none;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
        }

        #dy-dl-ball {
            width: 70px;
            height: 70px;
            background: transparent; 
            box-shadow: none;        
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
        }
        #dy-dl-ball:hover {
            transform: scale(1.1);
            filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));
        }
        #dy-dl-ball:active {
            transform: scale(0.95);
        }

        #dy-dl-ball svg, #dy-dl-ball img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        #dy-dl-menu {
            opacity: 0;
            visibility: hidden;
            background: rgba(0,0,0,0.8);
            border-radius: 8px;
            padding: 6px 0;
            margin-right: 12px;
            color: #fff;
            font-size: 13px;
            width: 130px;
            transform: translateX(10px);
            transition: all 0.2s ease;
            pointer-events: none;
        }

        #dy-dl-float-container:hover #dy-dl-menu,
        #dy-dl-menu:hover {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
            pointer-events: auto;
        }

        .dy-dl-menu-item { padding: 8px 16px; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
        .dy-dl-menu-item:hover { background: rgba(255,255,255,0.2); color: #fe2c55; }
        .dy-dl-divider { height: 1px; background: #444; margin: 4px 10px; }

        #dy-dl-settings-modal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 300px; background: #1f1f1f; border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 100000;
            color: #fff; font-family: sans-serif; padding: 20px;
            display: none; border: 1px solid #333;
        }
        #dy-dl-settings-modal h3 { margin: 0 0 15px 0; font-size: 16px; color: #fe2c55; }
        .dy-dl-form-group { margin-bottom: 12px; }
        .dy-dl-form-group label { display: block; font-size: 12px; color: #aaa; margin-bottom: 4px; }
        .dy-dl-input {
            width: 100%; box-sizing: border-box; background: #333; border: 1px solid #444;
            color: #fff; padding: 6px 8px; border-radius: 4px; font-size: 13px;
        }
        .dy-dl-btn-row { display: flex; justify-content: flex-end; margin-top: 20px; gap: 10px; }
        .dy-dl-btn {
            padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; border: none;
        }
        .dy-dl-btn-primary { background: #fe2c55; color: #fff; }
        .dy-dl-btn-cancel { background: #444; color: #ccc; }
      `;
      document.head.appendChild(style);
    }

    render() {
      // 主浮窗
      const container = document.createElement('div');
      container.id = 'dy-dl-float-container';
      container.innerHTML = `
        <div id="dy-dl-ball" title="点击下载4K画质">${this.iconSVG}</div>
        <div id="dy-dl-menu">
            <div class="dy-dl-menu-item" id="dy-dl-btn-best">🚀 下载 (超清4K)</div>
            <div class="dy-dl-menu-item" id="dy-dl-btn-normal">💾 下载 (高清1080P)</div>
            <div class="dy-dl-divider"></div>
            <div class="dy-dl-menu-item" id="dy-dl-btn-setting" style="font-size:12px;color:#ccc;">⚙️ 菜单</div>
        </div>
      `;
      document.body.appendChild(container);

      // 设置面板
      const modal = document.createElement('div');
      modal.id = 'dy-dl-settings-modal';
      modal.innerHTML = `
        <h3>脚本设置</h3>
        <div class="dy-dl-form-group">
            <label>📄 文件命名规则 (变量: {nickname}, {id}, {desc})</label>
            <input type="text" class="dy-dl-input" id="dy-dl-cfg-ntmpl" placeholder="留空并保存则恢复默认">
        </div>
        <div class="dy-dl-btn-row">
            <button class="dy-dl-btn dy-dl-btn-cancel" id="dy-dl-settings-cancel">取消</button>
            <button class="dy-dl-btn dy-dl-btn-primary" id="dy-dl-settings-save">保存</button>
        </div>
      `;
      document.body.appendChild(modal);

      // 事件绑定
      document.getElementById('dy-dl-btn-best').onclick = () => this.mh.download_best_media();
      document.getElementById('dy-dl-btn-normal').onclick = () => this.mh.download_current_media();
      document.getElementById('dy-dl-btn-setting').onclick = () => this.openSettings();

      document.getElementById('dy-dl-settings-cancel').onclick = () => {
          document.getElementById('dy-dl-settings-modal').style.display = 'none';
      };
      document.getElementById('dy-dl-settings-save').onclick = () => this.saveSettings();
    }

    openSettings() {
        const cfg = Config.global.features;
        const modal = document.getElementById('dy-dl-settings-modal');
        // 填充当前值
        document.getElementById('dy-dl-cfg-ntmpl').value = cfg.filename_template || "{nickname}_{id}_{desc}";
        modal.style.display = 'block';
    }

    saveSettings() {
        const cfg = Config.global.features;
        let n_val = document.getElementById('dy-dl-cfg-ntmpl').value.trim();

        // 逻辑：如果清空了输入框，则恢复默认
        if (!n_val) {
            n_val = "{nickname}_{id}_{desc}";
        }

        cfg.filename_template = n_val;
        Config.global.save();
        document.getElementById('dy-dl-settings-modal').style.display = 'none';
    }

    makeDraggable() {
      const el = document.getElementById('dy-dl-float-container');
      const ball = document.getElementById('dy-dl-ball');

      let isDragging = false;
      let startX, startY, initialLeft, initialTop;
      let hasMoved = false;

      ball.onmousedown = (e) => {
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = el.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.left = initialLeft + 'px';
        el.style.top = initialTop + 'px';
        e.preventDefault();
      };

      window.onmousemove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved = true;
        el.style.left = `${initialLeft + dx}px`;
        el.style.top = `${initialTop + dy}px`;
      };

      window.onmouseup = (e) => {
        if (!isDragging) return;
        isDragging = false;
        if (!hasMoved) this.mh.download_best_media();
      };
    }
  }

  // =========================================================
  // 启动
  // =========================================================

  const downloader = new Downloader();
  const mediaHandler = new MediaHandler(downloader);
  mediaHandler._start_detect_player_change();
  new FloatingUI(mediaHandler);

  console.log("[dy-dl] v1.0.0 已启动");
})();