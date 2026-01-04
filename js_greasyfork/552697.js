// ==UserScript==
// @name         维基音频本页播放（不弹窗）
// @name:en      Wikipedia Inline Audio (No Popup)
// @namespace    https://example.com
// @version      1.0
// @description        禁用维基百科 TMH 弹窗，让 OGG/OPUS 音频在页面内直接播放
// @description:en     Disable Wikipedia's TMH popup for audio; play OGG/OPUS inline with native controls 
// @license      GPL-3.0
// @match        *://*.wikipedia.org/*
// @match        *://*.wiktionary.org/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552697/%E7%BB%B4%E5%9F%BA%E9%9F%B3%E9%A2%91%E6%9C%AC%E9%A1%B5%E6%92%AD%E6%94%BE%EF%BC%88%E4%B8%8D%E5%BC%B9%E7%AA%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552697/%E7%BB%B4%E5%9F%BA%E9%9F%B3%E9%A2%91%E6%9C%AC%E9%A1%B5%E6%92%AD%E6%94%BE%EF%BC%88%E4%B8%8D%E5%BC%B9%E7%AA%97%EF%BC%89.meta.js
// ==/UserScript==


(function () {
  "use strict";

  let lastClickedBtn = null;

  // ---------- 工具 ----------
  function toDirectFilePath(href) {
    try {
      const u = new URL(href, location.href);
      const m = u.pathname.match(/\/wiki\/File:(.+\.(?:ogg|oga|opus|ogv))$/i);
      if (!m) return null;
      const fileTitle = decodeURIComponent(m[1]);
      return `${location.origin}/wiki/Special:FilePath/${encodeURIComponent(fileTitle)}`;
    } catch { return null; }
  }

  function pickPlayableUrl(baseUrl, isVideo=false) {
    const el = document.createElement(isVideo ? "video" : "audio");
    // 先试原格式
    if (
      (el.canPlayType && (el.canPlayType('audio/ogg; codecs="vorbis"') || el.canPlayType('audio/ogg') || el.canPlayType('audio/opus'))) ||
      (isVideo && el.canPlayType && el.canPlayType('video/ogg'))
    ) {
      return baseUrl;
    }
    // 很多文件有 mp3/mp4 转码，猜测直链
    try {
      const urlObj = new URL(baseUrl, location.href);
      urlObj.pathname = urlObj.pathname.replace(/\.(ogg|oga|opus|ogv)$/i, isVideo ? ".mp4" : ".mp3");
      return urlObj.href;
    } catch { return baseUrl; }
  }

  function createMiniBar() {
    let bar = document.getElementById("tmh-mini-player");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.id = "tmh-mini-player";
    bar.style.cssText = `
      position: fixed; right: 12px; bottom: 12px; z-index: 2147483647;
      background: #fff; border: 1px solid #a2a9b1; border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.18); padding: 10px 12px; max-width: min(460px, 92vw);
      color: #202122; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Inter,Arial;
    `;
    const head = document.createElement("div");
    head.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:6px;";
    const title = document.createElement("div");
    title.id = "tmh-mini-title";
    title.style.cssText = "flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;";
    title.textContent = "音频";
    const close = document.createElement("button");
    close.textContent = "×";
    close.title = "关闭";
    close.style.cssText = "border:none;background:transparent;cursor:pointer;font-size:18px;padding:2px 6px;border-radius:6px;";
    close.onclick = () => bar.remove();
    head.append(title, close);
    const media = document.createElement("audio");
    media.id = "tmh-mini-media";
    media.controls = true;
    media.style.cssText = "width:100%;display:block;";
    bar.append(head, media);
    document.documentElement.appendChild(bar);
    return bar;
  }

  function inlinePlay(btn, directUrl) {
    // 优先把控件放在原位置的 .mw-tmh-player 容器里；没有就用右下角迷你栏
    const container = btn.closest(".mw-tmh-player");
    const isVideo = /\.ogv(?:$|\?)/i.test(directUrl);
    const src = pickPlayableUrl(directUrl, isVideo);

    if (container) {
      // 清理容器内其它挡视图的层（例如占位 span）
      [...container.children].forEach(ch => {
        if (ch.tagName.toLowerCase() !== "audio" && ch.tagName.toLowerCase() !== "video") {
          // 保留一个 audio/video，其余非控件都删掉
          ch.remove();
        }
      });
      let media = container.querySelector(isVideo ? "video" : "audio");
      if (!media) {
        media = document.createElement(isVideo ? "video" : "audio");
        container.appendChild(media);
      }
      media.controls = true;
      media.removeAttribute("disabled");
      media.setAttribute("playsinline", "playsinline");
      media.style.width = "100%";
      if (media.src !== src) media.src = src;
      media.play().catch(()=>{});
    } else {
      const bar = createMiniBar();
      const media = bar.querySelector("#tmh-mini-media");
      const title = bar.querySelector("#tmh-mini-title");
      title.textContent = decodeURIComponent((directUrl.split("/").pop() || "").replace(/\?.*$/, "")) || "音频";
      media.src = src;
      media.play().catch(()=>{});
    }
  }

  // ---------- 1) 先拦截点击，阻止弹窗 ----------
  function onClickCapture(ev) {
    const t = ev.target;
    if (!(t instanceof Element)) return;
    const btn = t.closest('a.mw-tmh-play[href^="/wiki/File:"]');
    if (!btn) return;
    if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.defaultPrevented) return;

    const href = btn.getAttribute("href") || "";
    const direct = toDirectFilePath(href);
    if (!direct) return;

    lastClickedBtn = btn;

    ev.preventDefault();
    ev.stopPropagation();
    typeof ev.stopImmediatePropagation === "function" && ev.stopImmediatePropagation();

    inlinePlay(btn, direct);
    // 保险：同时触发一次“硬杀弹窗”
    killTMHModal();
  }
  document.addEventListener("click", onClickCapture, true);
  document.addEventListener("keydown", (ev) => {
    const t = ev.target;
    if (!(t instanceof Element)) return;
    const btn = t.closest('a.mw-tmh-play[href^="/wiki/File:"]');
    if (!btn) return;
    if ((ev.key === "Enter" || ev.key === " ") && !ev.metaKey && !ev.ctrlKey && !ev.altKey && !ev.shiftKey) {
      const href = btn.getAttribute("href") || "";
      const direct = toDirectFilePath(href);
      if (!direct) return;

      lastClickedBtn = btn;

      ev.preventDefault();
      ev.stopPropagation();
      typeof ev.stopImmediatePropagation === "function" && ev.stopImmediatePropagation();

      inlinePlay(btn, direct);
      killTMHModal();
    }
  }, true);

  // ---------- 2) 兜底：若弹窗出现，转移媒体并删除整棵弹窗 ----------
  function killTMHModal() {
    // 直接删遮罩 + 窗口管理器（只针对媒体对话框）
    document.querySelectorAll('.mw-tmh-media-dialog').forEach(dlg => {
      const root = dlg.closest('.oo-ui-windowManager');
      // 尝试把 <audio>/<video> 搬走再删
      const av = dlg.querySelector('audio,video');
      if (av) {
        // 优先放回原按钮附近
        const target = lastClickedBtn && lastClickedBtn.closest(".mw-tmh-player");
        if (target) {
          const tag = av.tagName.toLowerCase();
          const holder = target.querySelector(tag) || document.createElement(tag);
          holder.controls = true;
          holder.setAttribute("playsinline", "playsinline");
          holder.style.width = "100%";
          holder.src = av.currentSrc || av.src || "";
          if (!holder.isConnected) target.appendChild(holder);
          try { holder.play().catch(()=>{}); } catch {}
        } else {
          // 放到右下角迷你栏
          const bar = createMiniBar();
          const media = bar.querySelector("#tmh-mini-media");
          media.src = av.currentSrc || av.src || "";
          try { media.play().catch(()=>{}); } catch {}
        }
      }
      // 删除
      if (root) root.remove();
    });

    // 兜底：把任何 OOUI 遮罩隐藏（防止挡住控件）
    const styleId = "tmh-kill-overlay";
    if (!document.getElementById(styleId)) {
      const st = document.createElement("style");
      st.id = styleId;
      st.textContent = `
        .oo-ui-window-overlay,
        .oo-ui-windowManager,
        .vjs-modal-dialog, .vjs-error-display,
        .vjs-text-track-settings { display: none !important; }
      `;
      document.documentElement.appendChild(st);
    }
  }

  // MutationObserver：一旦弹窗节点加入 DOM，立刻处理并删除
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (
          node.matches('.mw-tmh-media-dialog, .oo-ui-windowManager, .oo-ui-window-overlay') ||
          node.querySelector?.('.mw-tmh-media-dialog, .oo-ui-windowManager, .oo-ui-window-overlay')
        ) {
          killTMHModal();
        }
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // 页面就绪后也清一次（有时首屏就挂着遮罩）
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", killTMHModal);
  } else {
    killTMHModal();
  }
})();
