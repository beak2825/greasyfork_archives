// ==UserScript==
// @name         Video Side Controller
// @name:zh-CN   侧边视频控制器
// @author       Wizos
// @supportURL   wizos@qq.com
// @namespace    https://blog.wizos.me
// @version      1.1.7
// @description  A controller displayed on the side of the video
// @description:zh-CN   展示在视频侧边的控制器
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      GPL3.0
// @noframes
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561670/Video%20Side%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/561670/Video%20Side%20Controller.meta.js
// ==/UserScript==

// 2025-12-30_1.1.7  修复侧边按钮图标方向不对的问题。调整控制条收起时的图标。
// 2025-12-30_1.1.6  修复移除节点处理的变量错误，修复下载功能，清理事件监听器。
// 2025-12-28_1.1.5  去掉使用 innerHTML 函数，会造成异常。
// 2025-10-15_1.1.4  针对小视频（长或宽小于控制器）调整控制器的显示逻辑：默认显示折叠条，视频暂停或结束时也计时折叠。
// 2025-10-13_1.1.3  增加监听视频元素的位置变化，解决偶发控制器位置不正确问题。
// 2025-09-30_1.1.2  增加监听视频元素的动态变化，解决偶发控制器不显示问题。
// 2025-09-29_1.1.1  调整视频控制器比 video 节点链上最大的 z-index + 1。
// 2025-09-28_1.1.0  增加画中画功能。并且支持删减控件、调整控件排序。
// 2025-09-27_1.0.0  初始版本。
(() => {
  "use strict";

  /* ---------- 1. 配置 ---------- */
  const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const SPEED_CACHE_KEY = "wiz-side-controller_global-speed";
  const AUTO_COLLAPSE_MS = 2000;
  const CTRL_CONFIG = ["play", "speed", "pip", "full", "down", "side"];

  /* ---------- SVG 工厂 ---------- */
  const SVG_NS = "http://www.w3.org/2000/svg";
  function svg(id, d) {
    const el = document.createElementNS(SVG_NS, "svg");
    el.setAttribute("viewBox", "0 0 24 24");
    el.id = id;
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    el.appendChild(path);
    return el;
  }
  const SVG_FRAGS = (() => {
    const frag = document.createDocumentFragment();
    const dict = {
      play: "M8 5v14l11-7z",
      pause: "M6 4h4v16H6zm8 0h4v16h-4z",
      full:
        "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zm-3-12v2h3v3h2V5h-5z",
      pip:
        "M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z",
      exitpip:
        "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z",
      down: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
      left: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
      right: "M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z",
      dots: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
    };
    Object.entries(dict).forEach(([id, d]) => frag.appendChild(svg(id, d)));
    return frag;
  })();
  const cloneSvg = (() => {
    const cache = new Map();
    return (id) => {
      if (!cache.has(id)) {
        const el = SVG_FRAGS.querySelector("#" + id);
        if (el) cache.set(id, el);
      }
      return cache.get(id)?.cloneNode(true);
    };
  })();

  /* ---------- 工具 ---------- */
  const getGlobalSpeed = () => {
    const s = localStorage.getItem(SPEED_CACHE_KEY);
    return SPEED_OPTIONS.includes(+s) ? +s : 1;
  };
  const setGlobalSpeed = (s) => localStorage.setItem(SPEED_CACHE_KEY, s);

  const getVideoHostName = (v) => {
    try {
      return new URL(v.currentSrc || v.src || v.querySelector('source[src]')?.src || location.href).host;
    } catch {
      return location.host;
    }
  };
  const getSideCacheKey = (v) => `wiz-side-controller_direction-${getVideoHostName(v)}`;
  const getCachedSide = (v) => localStorage.getItem(getSideCacheKey(v)) !== 'left';
  const setCachedSide = (v, isRight) => localStorage.setItem(getSideCacheKey(v), isRight ? 'right' : 'left');

  const getVideoSrc = (v) => v.currentSrc || v.src || v.querySelector('source[src]')?.src;
  const canDownload = (v) => {
    const url = getVideoSrc(v);
    return url && !url.startsWith('blob:');
  };

  const getMaxAncestorZ = (el, tolerance = 0.01) => {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return 0;
    const targetArea = el.getBoundingClientRect().width * el.getBoundingClientRect().height;
    const isClose = (node) => {
      const a = node.getBoundingClientRect();
      const area = a.width * a.height;
      return Math.abs(area - targetArea) / targetArea <= tolerance;
    };
    let maxZ = 0;
    for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
      if (node !== el && !isClose(node)) continue;
      const z = Number(window.getComputedStyle(node).zIndex);
      if (!Number.isNaN(z)) maxZ = Math.max(maxZ, z);
    }
    return maxZ + 1;
  };

  /* ---------- Constructable Stylesheet ---------- */
  const BASE_ST = new CSSStyleSheet();
  BASE_ST.replaceSync(`
:host{all:initial;display:none;position:absolute}
.wrap{position:relative;backdrop-filter:blur(2px)}
.box{display:flex;flex-direction:column;gap:4px;padding:4px;background:rgba(0,0,0,.15);border-radius:4px}
button{width:28px;height:28px;border:none;background:transparent;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:3px;font-size:17px}
button:hover{background:rgba(0,0,0,.1)}
.speed{font-size:13px;white-space:nowrap}
svg{width:18px;height:18px;fill:currentColor}
.down.hide{display:none}
.bar{cursor:pointer;width:20px;height:40px;background:rgba(0,0,0,.15);border-radius:4px;display:flex;align-items:center;justify-content:center}
.bar svg{width:16px;height:16px;fill:#fff}
`);

  /* ---------- 按钮元数据 ---------- */
  const BUTTON_META = {
    play: { ico: () => "play", title: "play/pause", render: () => true },
    speed: { ico: (vc) => vc.curSpdValue, title: "speed", render: () => true },
    full: {
      ico: () => "full",
      title: "fullscreen",
      render: (v) => Boolean(
        v.requestFullscreen ||
        v.webkitRequestFullscreen ||
        v.mozRequestFullScreen ||
        v.msRequestFullscreen
      )
    },
    pip: {
      ico: () => "pip",
      title: "pip",
      render: () => "requestPictureInPicture" in HTMLVideoElement.prototype,
    },
    down: {
      ico: () => "down",
      title: "download",
      render: (v) => canDownload(v),
    },
    side: {
      ico: (vc) => vc.isRight ? "left" : "right",
      title: "switch side",
      render: () => true,
    },
  };

  /* ---------- WizSideController / Web Component ---------- */
  const instances = new Map();
  class WizSideController {
    constructor(video) {
      if (instances.has(video)) return;
      instances.set(video, this);
      this.video = video;
      this.speedOptions = SPEED_OPTIONS;
      this.curSpdValue = getGlobalSpeed();
      video.playbackRate = this.curSpdValue;
      this.curSpdIdx = this.speedOptions.indexOf(this.curSpdValue);
      this.isRight = getCachedSide(video);
      this._boundHandlers = {}; // 存储需要清理的事件处理器

      /* DOM 骨架 */
      this.root = document.createElement("wiz-side-controller");
      this.shadow = this.root.attachShadow({ mode: "open" });
      this.shadow.adoptedStyleSheets = [BASE_ST];
      this.buildSkeleton();

      document.documentElement.appendChild(this.root);
      this.root.style.zIndex = getMaxAncestorZ(this.video);
      this.renderButtons();
      this.syncSpeed();
      this.followVideo();
      this.updateDownBtn();
      this.collapsed = false;
      this.collapseTimer = null;
    }

    /* 建立静态骨架（只一次） */
    buildSkeleton() {
      this.wrap = document.createElement("div");
      this.wrap.className = "wrap";
      this.box = document.createElement("div");
      this.box.className = "box";
      this.bar = document.createElement("div");
      this.bar.className = "bar";
      this.bar.style.display = "none";
      this.bar.appendChild(cloneSvg("dots"));
      this.wrap.append(this.box, this.bar);
      this.shadow.appendChild(this.wrap);
      this.btnEls = {}; // 缓存按钮引用
    }

    /* diff 更新按钮（不重建骨架） */
    renderButtons() {
      const needed = CTRL_CONFIG.filter((name) => {
        const meta = BUTTON_META[name];
        return meta && meta.render(this.video);
      });
      /* 1. 删多余 */
      Object.keys(this.btnEls).forEach((n) => {
        if (!needed.includes(n)) {
          this.btnEls[n].remove();
          delete this.btnEls[n];
        }
      });
      /* 2. 按顺序插入或复用 */
      const frag = document.createDocumentFragment();
      needed.forEach((name) => {
        if (this.btnEls[name]) {
          const b = this.btnEls[name];

          if (name !== "speed") {
            const meta = BUTTON_META[name];
            const icoName = typeof meta.ico === "function"
              ? meta.ico(this)
              : meta.ico;

            const icon = cloneSvg(icoName);
            if (icon) b.replaceChildren(icon);
          }

          frag.append(b);
          return;
        }
        const meta = BUTTON_META[name];
        const b = document.createElement("button");
        b.className = name;
        b.title = meta.title;
        const icoName = typeof meta.ico === "function"
          ? meta.ico(this)
          : meta.ico;

        /* 关键判断：speed 按钮直接显示文字，其余克隆 SVG */
        if (name === "speed") {
          b.textContent = icoName;
        } else {
          const icon = cloneSvg(icoName);
          if (icon) b.appendChild(icon);
        }

        this.btnEls[name] = b;
        frag.append(b);
      });
      this.box.replaceChildren(frag);
      this.bindButtonEvents();
    }

    bindButtonEvents() {
      const v = this.video;

      /* play */
      const playBtn = this.btnEls.play;
      if (playBtn) {
        const syncPlayIcon = () => {
          const icon = cloneSvg(v.paused ? "play" : "pause");
          if (icon) playBtn.replaceChildren(icon);
        };
        playBtn.onclick = () => v.paused ? v.play() : v.pause();

        this._boundHandlers.onPlay = () => {
          syncPlayIcon();
          this.pauseOthersOnPlay();
          if (!this.isVideoSmall) this.expand();
          this.resetCollapseTimer();
        };
        this._boundHandlers.onPause = () => {
          syncPlayIcon();
          if (!this.isVideoSmall) {
            this.expand();
            this.clearCollapseTimer();
          } else {
            this.resetCollapseTimer();
          }
        };
        this._boundHandlers.onEnded = async () => {
          syncPlayIcon();
          if (!this.isVideoSmall) {
            this.expand();
            this.clearCollapseTimer();
          } else {
            this.resetCollapseTimer();
          }
          if (v === document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          }
        };

        v.addEventListener("play", this._boundHandlers.onPlay);
        v.addEventListener("pause", this._boundHandlers.onPause);
        v.addEventListener("ended", this._boundHandlers.onEnded);
        syncPlayIcon();
      }

      /* speed */
      const speedBtn = this.btnEls.speed;
      if (speedBtn) {
        speedBtn.onclick = () => {
          this.curSpdIdx = (this.curSpdIdx + 1) % this.speedOptions.length;
          const spd = this.speedOptions[this.curSpdIdx];
          v.playbackRate = spd;
          setGlobalSpeed(spd);
          this.curSpdValue = spd;
          this.syncSpeed();
          instances.forEach((ins, vid) => {
            if (vid !== v) {
              vid.playbackRate = spd;
              ins.curSpdValue = spd;
              ins.curSpdIdx = this.curSpdIdx;
              ins.syncSpeed();
            }
          });
        };
      }

      /* 全屏按钮 */
      const fullBtn = this.btnEls.full;
      if (fullBtn) {
        fullBtn.onclick = () => {
          v.requestFullscreen?.() || v.webkitRequestFullscreen?.() || v.msRequestFullscreen?.();
        }
      }
      // 下载按钮
      const downBtn = this.btnEls.down;
      if (downBtn) {
        downBtn.onclick = () => {
          const url = getVideoSrc(v);
          if (!url) return;
            const a = document.createElement("a");
            a.href = url;
            a.download = url.split("/").pop()?.split("?")[0] || "video";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
      }

      /* 画中画按钮 */
      const pipBtn = this.btnEls.pip;
      if (pipBtn) {
        pipBtn.onclick = async () => {
          try {
              const el = document.pictureInPictureElement;
              if (el) await document.exitPictureInPicture();
              if (el !== v) {
                await v.requestPictureInPicture();
                if (v.paused) v.play();
              }
          } catch { /* ignore */ }
        };

        this._boundHandlers.onEnterPip = () => {
          const icon = cloneSvg("exitpip");
          if (icon) pipBtn.replaceChildren(icon);
        };
        this._boundHandlers.onLeavePip = () => {
          const icon = cloneSvg("pip");
          if (icon) pipBtn.replaceChildren(icon);
        };

        v.addEventListener("enterpictureinpicture", this._boundHandlers.onEnterPip);
        v.addEventListener("leavepictureinpicture", this._boundHandlers.onLeavePip);
      }

      /* side */
      const sideBtn = this.btnEls.side;
      if (sideBtn) {
        sideBtn.onclick = () => {
          this.isRight = !this.isRight;
          setCachedSide(v, this.isRight);
          this.renderButtons();
          this.snapToVideo();
        };
      }

      // 折叠条
      this.bar.onclick = () => this.expand();

      /* 交互计时 */
      this._boundHandlers.onInteract = () => {
        if (!v.paused) this.resetCollapseTimer();
      };
      ["click", "mousemove", "touchstart"].forEach((ev) =>
        v.addEventListener(ev, this._boundHandlers.onInteract, { passive: true })
      );
      this.box.addEventListener("mouseenter", () => this.clearCollapseTimer());
      this.box.addEventListener("mouseleave", () => this.resetCollapseTimer());
    }

    // 同步速度显示
    syncSpeed() {
      const b = this.btnEls.speed;
      if (b) b.textContent = this.curSpdValue;
    }

    // 更新下载按钮状态
    updateDownBtn() {
      const b = this.btnEls.down;
      if (b) b.classList.toggle("hide", !canDownload(this.video));
    }

    // 播放时暂停其他视频
    pauseOthersOnPlay() {
      if (this.video.muted || this.root.style.display === "none") return;
      instances.forEach((ins, vid) => {
        if (vid !== this.video && !vid.paused) vid.pause();
      });
    }

    // 展开控制器
    expand() {
      if (!this.collapsed) return;
      this.collapsed = false;
      this.box.style.display = "flex";
      this.bar.style.display = "none";
      requestAnimationFrame(() => this.snapToVideo());
      this.resetCollapseTimer();
    }

    // 折叠控制器
    collapse() {
      if (this.collapsed) return;
      this.collapsed = true;
      this.box.style.display = "none";
      this.bar.style.display = "flex";
      requestAnimationFrame(() => this.snapToVideo());
    }

    // 重置折叠计时器
    resetCollapseTimer() {
      this.clearCollapseTimer();
      if (!this.isVideoSmall || (this.isVideoSmall && !this.video.paused)) {
        this.collapseTimer = setTimeout(() => this.collapse(), AUTO_COLLAPSE_MS);
      }
    }

    // 清除折叠计时器
    clearCollapseTimer() {
      clearTimeout(this.collapseTimer);
      this.collapseTimer = null;
    }

    // 跟随视频位置
    followVideo() {
      intersectionObserver.observe(this.video);
      resizeObserver.observe(this.video);

      const onLoad = () => {
        if (this.video.videoWidth || this.video.readyState >= 2) {
          ["loadedmetadata", "loadeddata", "play"].forEach((ev) =>
            this.video.removeEventListener(ev, onLoad)
          );
          this.snapToVideo();
        }
      };
      ["loadedmetadata", "loadeddata", "play"].forEach((ev) =>
        this.video.addEventListener(ev, onLoad, { once: true })
      );

      let rafPending = false;
      const onMove = () => {
        if (rafPending || !this.visible) return;
        rafPending = true;
        requestAnimationFrame(() => {
          rafPending = false;
          if (this.visible) this.snapToVideo();
        });
      };
      addEventListener("scroll", onMove, { passive: true });
      addEventListener("resize", onMove);

      this._stop = () => {
        intersectionObserver.unobserve(this.video);
        positionObserver.unobserve(this.video);
        resizeObserver.unobserve(this.video);
        removeEventListener("scroll", onMove);
        removeEventListener("resize", onMove);

        // 清理 video 上的事件监听器
        const v = this.video;
        const h = this._boundHandlers;
        if (h.onPlay) v.removeEventListener("play", h.onPlay);
        if (h.onPause) v.removeEventListener("pause", h.onPause);
        if (h.onEnded) v.removeEventListener("ended", h.onEnded);
        if (h.onEnterPip) v.removeEventListener("enterpictureinpicture", h.onEnterPip);
        if (h.onLeavePip) v.removeEventListener("leavepictureinpicture", h.onLeavePip);
        if (h.onInteract) {
          ["click", "mousemove", "touchstart"].forEach((ev) =>
            v.removeEventListener(ev, h.onInteract)
          );
        }

        this.clearCollapseTimer();
        this.root.remove();
        instances.delete(this.video);
      };
    }

    snapToVideo() {
      if (this.root.style.display === "none") return;
      const pad = 8;
      const vRect = this.video.getBoundingClientRect();
      const left =
        (this.isRight
          ? vRect.right - this.root.offsetWidth - pad
          : vRect.left + pad) + window.scrollX;
      const top = vRect.top + (vRect.height - this.root.offsetHeight) / 2 + window.scrollY;
      this.root.style.left = left + "px";
      this.root.style.top = top + "px";
    }
  }

  /* ---------- 观察者 ---------- */
  class PositionObserver {
    constructor(callback) {
      this.callback = callback;
      this.targets = new Map();
      this.rafId = null;
    }
    observe(el) {
      if (this.targets.has(el)) return;
      this.targets.set(el, null);
      this._schedule();
    }
    unobserve(el) {
      this.targets.delete(el);
      if (this.targets.size === 0) this._stop();
    }
    disconnect() {
      this.targets.clear();
      this._stop();
    }
    _schedule() {
      if (!this.rafId) this.rafId = requestAnimationFrame(() => this._tick());
    }
    _stop() {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    _tick() {
      this.rafId = null;
      const changes = [];
      for (const [el, last] of this.targets) {
        const rect = el.getBoundingClientRect();
        if (!last || rect.left !== last.left || rect.top !== last.top) {
          changes.push({ target: el, contentRect: rect });
          this.targets.set(el, rect);
        }
      }
      if (changes.length) this.callback(changes, this);
      if (this.targets.size) this._schedule();
    }
  }

  const positionObserver = new PositionObserver((entries) => {
    entries.forEach((entry) => {
      instances.get(entry.target)?.snapToVideo();
    });
  });

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const controller = instances.get(entry.target);
      if (!controller) return;
      controller.visible = entry.isIntersecting && entry.intersectionRatio > 0.05;
      if (!controller.visible) {
        controller.root.style.display = "none";
        positionObserver.unobserve(controller.video);
        return;
      }
      controller.root.style.display = "block";
      const vRect = controller.video.getBoundingClientRect();
      const cRect = controller.root.getBoundingClientRect();
      controller.isVideoSmall = vRect.width < cRect.width || vRect.height < cRect.height;

      if (controller.isVideoSmall) {
        controller.collapse();
      }
      positionObserver.observe(controller.video);
      controller.snapToVideo();
      controller.updateDownBtn();
    });
  }, { threshold: [0, 0.1, 1] });

  // 创建 ResizeObserver 监听视频元素的大小变化
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => instances.get(entry.target)?.snapToVideo());
  });

  /* ---------- DOM 监听 ---------- */
  const mutationObserver = new MutationObserver((mutations) => {
    requestAnimationFrame(() => {
      mutations.forEach((mutation) => {
        // 处理新增节点
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === "VIDEO") {
              new WizSideController(node);
            } else if (node.querySelectorAll) {
              node.querySelectorAll("video").forEach((v) =>
                new WizSideController(v)
              );
            }
          }
        });

        // 处理移除节点
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === "VIDEO") {
              instances.get(node)?._stop();
            } else if (node.querySelectorAll) {
              node.querySelectorAll("video").forEach((v) =>
                instances.get(v)?._stop()
              );
            }
          }
        });

        // 处理属性变化（src变化）
        if (
          mutation.type === "attributes" &&
          mutation.target.tagName === "VIDEO" &&
          mutation.attributeName === "src"
        ) {
          if (mutation.oldValue) {
            instances.get(mutation.target)?._stop();
          }
          new WizSideController(mutation.target);
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
    attributeOldValue: true,
  });

  function scanAllVideos() {
    document.querySelectorAll("video").forEach((v) => {
      if (!instances.has(v)) new WizSideController(v);
    });
  }

  /* SPA 路由补丁 */
  const patchHistory = (method) => {
    const orig = history[method];
    history[method] = function (...a) {
      const res = orig.apply(this, a);
      setTimeout(scanAllVideos, 100);
      return res;
    };
  };
  patchHistory("pushState");
  patchHistory("replaceState");
  document.addEventListener('popstate', () => setTimeout(scanAllVideos, 100));

  /**
   * 添加 viewport meta 标签
   */
  function addViewportMeta() {
    if (document.querySelector('meta[name="viewport"]')) return;
    const m = document.createElement("meta");
    m.name = "viewport";
    m.content = "width=device-width,initial-scale=1.0,user-scalable=no";
    document.head.appendChild(m);
  }

  /**
   * 处理特殊平台的视频播放器
   */
  function handleSpecialPlatforms() {
    const url = location.href;
    if (url.includes("player.youku.com/embed")) {
      addViewportMeta();
      document.querySelector('.ykplayer')?.style.setProperty('position', 'inherit', 'important');
      document.querySelector("#youku-playerBox")?.removeAttribute("style");
      document.body.style.background = "black";
    } else if (url.includes("tv.sohu.com/s/sohuplayer/iplay.html")) {
      addViewportMeta();
      document.querySelector("#sohuplayer div.x-download-panel")?.remove();
    } else if (url.includes("m.bilibili.com/video")) {
      // 处理B站移动端
      [
        ".m-float-openapp",
        ".m-video2-main-img",
        ".mplayer-control-dot",
        ".mplayer-widescreen-callapp",
        ".mplayer-comment-text",
        ".mplayer-control-btn-quality",
        ".mplayer-control-btn-speed",
      ].forEach((s) =>
        document.querySelectorAll(s).forEach((el) => el.remove())
      );
    } else if (url.includes("m.iqiyi.com/v_")) {
      document.querySelector(".m-iqylink-guide")?.remove();
    } else if (url.includes("video.zhihu.com/video/")) {
      document.querySelectorAll("video").forEach((v) => {
        v.style.height = "auto";
        v.style.maxHeight = "100%";
        v.style.maxWidth = "100%";
      });
    }
  }

  // 执行特殊平台处理
  handleSpecialPlatforms();

  /* ---------- 初始扫描 ---------- */
  scanAllVideos();
})();