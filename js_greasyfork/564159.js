// ==UserScript==
// @name         NicoNico Arrow Buttons
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  ニコニコ動画に 0 / 再生・停止 / 10秒戻る / 10秒進む / 倍速 ボタンを右下サイドバー表示
// @author       kmikrt
// @license      MIT
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564159/NicoNico%20Arrow%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/564159/NicoNico%20Arrow%20Buttons.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (window.top !== window.self) return;

  function getVideo() {
    return document.querySelector("video");
  }

  let sidebar = null;
  let hitbox = null;
  let expanded = true;
  let arrowEl;

  let lastUrl = location.href;

  function shouldShow() {
    return location.pathname.startsWith("/watch/");
  }

  function removeSidebar() {
    if (sidebar) sidebar.remove();
    if (hitbox) hitbox.remove();
    sidebar = null;
    hitbox = null;
  }

  // ===== 倍速自動適用 =====
  let autoTimers = [];
  let userChangedSpeed = false;

  function cancelAutoSpeed() {
    autoTimers.forEach(id => clearTimeout(id));
    autoTimers = [];
  }

  function setPlaybackRate(rate) {
    const v = getVideo();
    if (v) {
      try { v.playbackRate = rate; } catch {}
    }
  }

  function scheduleAutoSpeed() {
    cancelAutoSpeed();
    userChangedSpeed = false;

    const stored = localStorage.getItem("nicoArrowLastSpeed");
    if (!stored) return;
    const rate = parseFloat(stored);
    if (!rate || isNaN(rate)) return;

    const delays = [300, 800, 2000];
    delays.forEach(d => {
      const id = setTimeout(() => {
        if (userChangedSpeed) return;
        setPlaybackRate(rate);
      }, d);
      autoTimers.push(id);
    });
  }

  // ===== UI生成 =====
  function createSidebar() {
    if (sidebar) return;

    hitbox = document.createElement("div");
    Object.assign(hitbox.style, {
      position: "fixed",
      bottom: "20px",
      right: "10px",
      padding: "20px",
      zIndex: 99998,
      background: "rgba(0,0,0,0)",
      touchAction: "none"
    });
    document.body.appendChild(hitbox);

    sidebar = document.createElement("div");
    Object.assign(sidebar.style, {
      position: "fixed",
      bottom: "30px",
      right: "20px",
      width: "150px",
      zIndex: 99999,
      background: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(0,0,0,0.15)",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      padding: "10px",
      fontSize: "14px",
      fontFamily: "sans-serif",
      color: "#000",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      cursor: "grab",
      userSelect: "none"
    });

    const saved = localStorage.getItem("nicoArrowSidebarPos");
    if (saved) {
      try {
        const pos = JSON.parse(saved);
        sidebar.style.left = pos.left + "px";
        sidebar.style.top = pos.top + "px";
        sidebar.style.right = "";
        sidebar.style.bottom = "";
        hitbox.style.left = (pos.left - 20) + "px";
        hitbox.style.top = (pos.top - 20) + "px";
      } catch {}
    }

    const titleWrap = document.createElement("div");
    Object.assign(titleWrap.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "600"
    });

    const title = document.createElement("span");
    title.textContent = "再生操作";

    arrowEl = document.createElement("span");
    arrowEl.textContent = expanded ? "▲" : "▼";

    titleWrap.appendChild(title);
    titleWrap.appendChild(arrowEl);
    sidebar.appendChild(titleWrap);

    const btnBox = document.createElement("div");
    Object.assign(btnBox.style, {
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    });

    function addButton(label, handler) {
      const btn = document.createElement("button");
      btn.textContent = label;
      Object.assign(btn.style, {
        width: "100%",
        padding: "6px",
        fontSize: "13px",
        borderRadius: "6px",
        cursor: "pointer",
        border: "1px solid #bbb",
        background: "#f0f0f0"
      });
      btn.addEventListener("click", e => {
        e.stopPropagation();
        handler();
      });
      btnBox.appendChild(btn);
    }

    addButton("0（最初へ）", () => {
      const v = getVideo();
      if (v) v.currentTime = 0;
    });

    addButton("▶ / II", () => {
      const v = getVideo();
      if (!v) return;
      v.paused ? v.play() : v.pause();
    });

    addButton("← 10秒戻る", () => {
      const v = getVideo();
      if (v) v.currentTime = Math.max(0, v.currentTime - 10);
    });

    addButton("→ 10秒進む", () => {
      const v = getVideo();
      if (v) v.currentTime = Math.min(v.duration || Infinity, v.currentTime + 10);
    });

    // 倍速ボタン
    const speedRow = document.createElement("div");
    Object.assign(speedRow.style, {
      display: "flex",
      gap: "4px",
      marginTop: "5px"
    });

    function addSpeedButton(label, rate) {
      const btn = document.createElement("button");
      btn.textContent = label;
      Object.assign(btn.style, {
        flex: "1",
        padding: "6px 4px",
        fontSize: "12px",
        borderRadius: "6px",
        cursor: "pointer",
        border: "1px solid #bbb",
        background: "#e8e8e8"
      });
      btn.addEventListener("click", e => {
        e.stopPropagation();
        setPlaybackRate(rate);
        localStorage.setItem("nicoArrowLastSpeed", rate.toString());
        userChangedSpeed = true;
        cancelAutoSpeed();
      });
      speedRow.appendChild(btn);
    }

    addSpeedButton("1.00x", 1.0);
    addSpeedButton("1.5x", 1.5);
    addSpeedButton("2.0x", 2.0);

    btnBox.appendChild(speedRow);
    sidebar.appendChild(btnBox);

    sidebar.addEventListener("click", e => {
      if (e.target.tagName.toLowerCase() === "button") return;
      expanded = !expanded;
      arrowEl.textContent = expanded ? "▲" : "▼";
      btnBox.style.display = expanded ? "flex" : "none";
    });

    enableDrag(sidebar, hitbox);
    document.body.appendChild(sidebar);
  }

  function enableDrag(elm, hit) {
    let isDown = false, offsetX = 0, offsetY = 0;

    elm.addEventListener("mousedown", start);
    elm.addEventListener("touchstart", start, { passive: false });

    function start(e) {
      if (e.target.tagName.toLowerCase() === "button") return;
      isDown = true;
      elm.style.cursor = "grabbing";

      const rect = elm.getBoundingClientRect();
      const ev = e.touches ? e.touches[0] : e;
      offsetX = ev.clientX - rect.left;
      offsetY = ev.clientY - rect.top;

      document.addEventListener("mousemove", move);
      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("mouseup", end);
      document.addEventListener("touchend", end);
    }

    function move(e) {
      if (!isDown) return;
      e.preventDefault();

      const ev = e.touches ? e.touches[0] : e;
      let left = ev.clientX - offsetX;
      let top = ev.clientY - offsetY;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = elm.offsetWidth;
      const h = elm.offsetHeight;

      left = Math.max(0, Math.min(vw - w, left));
      top = Math.max(0, Math.min(vh - h, top));

      elm.style.left = left + "px";
      elm.style.top = top + "px";
      elm.style.right = "";
      elm.style.bottom = "";

      hit.style.left = (left - 20) + "px";
      hit.style.top = (top - 20) + "px";
    }

    function end() {
      if (!isDown) return;
      isDown = false;
      elm.style.cursor = "grab";

      const rect = elm.getBoundingClientRect();
      localStorage.setItem("nicoArrowSidebarPos",
        JSON.stringify({ left: rect.left, top: rect.top })
      );

      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("mouseup", end);
      document.removeEventListener("touchend", end);
    }
  }

  function update() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      removeSidebar();
      if (shouldShow()) {
        createSidebar();
        scheduleAutoSpeed();
      }
    }
  }

  const observer = new MutationObserver(update);
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(update, 1000);
  setTimeout(update, 800);

  if (shouldShow()) {
    createSidebar();
    scheduleAutoSpeed();
  }

})();
