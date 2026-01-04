// ==UserScript==
// @name         Blur Box Overlay
// @namespace    https://greasyfork.org/en/users/1413127-tumoxep
// @version      1.0
// @description  Blur Box Overlay for safe browsing (i.e. hiding ad spaces or disturbing parts of the videos). Can be moved, resized and toggled
// @license      WTFPL
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549106/Blur%20Box%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/549106/Blur%20Box%20Overlay.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let current = null;
  const BOX_DEFAULTS = {
    top: 120,
    left: 120,
    width: 80,
    height: 80,
    borderRadius: 8,
    blurAmount: 32,
    saturation: 120,
  };
  const BUTTTON_DEFAULT_STYLES = {
    position: "absolute",
    width: "18px",
    height: "18px",
    borderRadius: "4px",
    display: "grid",
    placeItems: "center",
    fontSize: "10px",
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.9)",
    color: "#111",
    pointerEvents: "auto",
  };

  function makeBlurBox() {
    if (current) return current;

    const box = document.createElement("div");
    Object.assign(box.style, {
      position: "absolute",
      top: `${BOX_DEFAULTS.top}px`,
      left: `${BOX_DEFAULTS.left}px`,
      width: `${BOX_DEFAULTS.width}px`,
      height: `${BOX_DEFAULTS.height}px`,
      borderRadius: `${BOX_DEFAULTS.borderRadius}px`,
      zIndex: 2147483647,
      userSelect: "none",
    });

    const blur = document.createElement("div");
    Object.assign(blur.style, {
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background: "rgba(255,255,255,0.015)",
      backdropFilter: `blur(${BOX_DEFAULTS.blurAmount}px) saturate(${BOX_DEFAULTS.saturation}%)`,
      pointerEvents: "none",
    });

    const drag = document.createElement("div");
    Object.assign(drag.style, BUTTTON_DEFAULT_STYLES, {
      top: "6px",
      left: "6px",
      cursor: "move",
    });
    drag.textContent = "⇅";

    const resize = document.createElement("div");
    Object.assign(resize.style, BUTTTON_DEFAULT_STYLES, {
      right: "6px",
      bottom: "6px",
      cursor: "nwse-resize",
    });
    resize.textContent = "↘";

    const toggleBtn = document.createElement("button");
    Object.assign(toggleBtn.style, BUTTTON_DEFAULT_STYLES, {
      top: "6px",
      right: "6px",
      cursor: "pointer",
    });
    toggleBtn.textContent = "x";

    let blurEnabled = true;
    toggleBtn.addEventListener("click", () => {
      blurEnabled = !blurEnabled;
      blur.style.backdropFilter = blurEnabled
        ? `blur(${BOX_DEFAULTS.blurAmount}px) saturate(${BOX_DEFAULTS.saturation}%)`
        : "none";
      toggleBtn.textContent = blurEnabled ? "x" : "o";
    });

    box.appendChild(blur);
    box.appendChild(drag);
    box.appendChild(resize);
    box.appendChild(toggleBtn);
    document.body.appendChild(box);

    let dragging = false;
    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let startW = 0;
    let startH = 0;

    drag.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dragging = true;
      drag.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      const r = box.getBoundingClientRect();
      startLeft = r.left + window.scrollX;
      startTop = r.top + window.scrollY;
    });

    resize.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      resizing = true;
      resize.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      const r = box.getBoundingClientRect();
      startW = r.width;
      startH = r.height;
      startLeft = r.left + window.scrollX;
      startTop = r.top + window.scrollY;
    });

    function onMove(e) {
      if (dragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        box.style.left = `${startLeft + dx}px`;
        box.style.top = `${startTop + dy}px`;
      } else if (resizing) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        box.style.width = `${Math.max(40, startW + dx)}px`;
        box.style.height = `${Math.max(30, startH + dy)}px`;
      }
    }
    function endInteraction(e) {
      if (dragging) {
        dragging = false;
        try {
          drag.releasePointerCapture(e.pointerId);
        } catch (e) {}
      }
      if (resizing) {
        resizing = false;
        try {
          resize.releasePointerCapture(e.pointerId);
        } catch (e) {}
      }
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", endInteraction);
    window.addEventListener("pointercancel", endInteraction);

    current = box;
    return box;
  }

  makeBlurBox();
})();