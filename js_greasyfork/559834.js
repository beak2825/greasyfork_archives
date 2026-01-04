// ==UserScript==
// @name         Countdown Special Days
// @namespace    https://greasyfork.org/users/1300060
// @description  Counter Days on your screen
// @version      1.0
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559834/Countdown%20Special%20Days.user.js
// @updateURL https://update.greasyfork.org/scripts/559834/Countdown%20Special%20Days.meta.js
// ==/UserScript==

(() => {
  const EVENTS = [
    { name: "Thi HK 1", date: "2026-01-03" },
    { name: "Tết 2027", date: "2027-02-01" },
    { name: "TNTHPTQG", date: "2027-07-01" }
  ];

  const isFS = () =>
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  const init = () => {
    if (!document.body) return setTimeout(init, 200);

    const box = document.createElement("div");
    box.style.cssText =
      "position:fixed;bottom:8px;right:8px;background:rgba(0,0,0,.55);color:#f1f1f1;" +
      "padding:10px 14px;border-radius:10px;font:14px Arial,sans-serif;" +
      "z-index:2147483647;cursor:move;user-select:none;white-space:nowrap;" +
      "box-shadow:0 4px 12px rgba(0,0,0,.25)";
    document.body.appendChild(box);

    let lastDay = -1;

    const render = () => {
      box.style.display = isFS() ? "none" : "";

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const t = now.getTime();
      if (t === lastDay) return;
      lastDay = t;

      box.textContent = "";

      for (const e of EVENTS) {
        const [y, m, d] = e.date.split("-").map(Number);
        const diff = Math.ceil(
          (new Date(y, m - 1, d).setHours(0, 0, 0, 0) - t) / 86400000
        );

        const line = document.createElement("div");

        if (diff > 1) {
          line.textContent = `${e.name}: ${diff} ngày nữa`;
        } else if (diff === 1) {
          line.textContent = `${e.name}: còn 1 ngày`;
          line.style.textDecoration = "underline";
        } else if (diff === 0) {
          line.textContent = `${e.name}: hôm nay nèee`;
          line.style.fontWeight = "bold";
          line.style.textDecoration = "underline";
        } else {
          line.textContent = `${e.name}: đã qua rồi!`;
          line.style.textDecoration = "line-through";
          line.style.opacity = "0.6";
        }

        box.appendChild(line);
      }
    };

    render();
    setInterval(render, 60000);

    [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange"
    ].forEach(e => document.addEventListener(e, render));

    let down = false, drag = false, sx = 0, sy = 0, ox = 0, oy = 0;

    box.addEventListener("mousedown", e => {
      down = true;
      drag = false;
      sx = e.clientX;
      sy = e.clientY;
      ox = box.offsetLeft;
      oy = box.offsetTop;
    });

    document.addEventListener("mousemove", e => {
      if (!down) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (!drag) {
        if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
        drag = true;
        box.style.right = box.style.bottom = "auto";
      }
      box.style.left = ox + dx + "px";
      box.style.top = oy + dy + "px";
    });

    document.addEventListener("mouseup", () => {
        down = false;
        drag = false;
    });
  };
  init();
})();
