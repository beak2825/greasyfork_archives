// ==UserScript==
// @name        Kick Embed Volume and Playback Speed
// @namespace   yuniDev.kickembedcontrols
// @match       https://player.kick.com/*
// @grant       none
// @version     1.1
// @author      yuniDev
// @description 04/11/2025, 20:20:30
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/554798/Kick%20Embed%20Volume%20and%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/554798/Kick%20Embed%20Volume%20and%20Playback%20Speed.meta.js
// ==/UserScript==

function waitForElement(selector, root = document.body) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  });
}

function addTooltip(element, tooltipText) {
  element.addEventListener("mouseenter", () => {
    const tooltip = document.createElement("div");
    tooltip.setAttribute("data-side", "top");
    tooltip.setAttribute("data-align", "center");
    tooltip.setAttribute("data-state", "delayed-open");
    tooltip.className = "z-tooltip select-none rounded-md bg-white p-[5px] text-sm font-medium leading-5 text-black data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade will-change-[transform,opacity]";
    tooltip.style.cssText = `
      position: fixed;
      z-index: 801;
      pointer-events: none;
    `;
    tooltip.innerHTML = `
      ${tooltipText}
      <span style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);">
        <svg class="fill-white" width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none"><polygon points="0,0 30,0 15,10"></polygon></svg>
      </span>
    `;
    document.body.appendChild(tooltip);
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + "px";
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 2.5) + "px";
    element._tooltip = tooltip;
  });
  element.addEventListener("mouseleave", () => {
    if (element._tooltip) {
      element._tooltip.remove();
      element._tooltip = null;
    }
  });
}

function createSpeedSelector(video, toolbar) {
  const btn = document.createElement("button");
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-timer-icon lucide-timer"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`;
  btn.style.cssText = `
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin-right: -8px;
    color: white;
  `;

  addTooltip(btn, "Playback Speed");

  const menu = document.createElement("div");
  menu.setAttribute("data-side", "top");
  menu.setAttribute("data-align", "center");
  menu.setAttribute("data-state", "delayed-open");
  menu.style.cssText = `
    position: fixed;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    display: none;
    z-index: 100;
    overflow: hidden;
  `;
  menu.className = "data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade will-change-[transform,opacity]";

  let closeTimeout;

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  speeds.forEach((speed) => {
    const option = document.createElement("div");
    option.textContent = speed + "x";
    option.style.cssText = `
      padding: 8px 16px;
      cursor: pointer;
      color: black;
      font-size: 14px;
      transition: background-color 0.2s;
    `;
    option.addEventListener("mouseenter", () => {
      option.style.backgroundColor = "#f0f0f0";
    });
    option.addEventListener("mouseleave", () => {
      option.style.backgroundColor = "transparent";
    });
    option.addEventListener("click", () => {
      video.playbackRate = speed;
      menu.style.display = "none";
    });
    menu.appendChild(option);
  });

  document.body.appendChild(menu);

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (btn._tooltip) {
      btn._tooltip.remove();
      btn._tooltip = null;
    }
    if (menu.style.display === "none") {
      menu.style.display = "block";
      const rect = btn.getBoundingClientRect();
      menu.style.left = (rect.left + rect.width / 2 - menu.offsetWidth / 2) + "px";
      menu.style.top = (rect.top - menu.offsetHeight - 8) + "px";
    } else {
      menu.style.display = "none";
    }
  });

  btn.addEventListener("mouseleave", () => {
    closeTimeout = setTimeout(() => {
      menu.style.display = "none";
    }, 100);
  });

  menu.addEventListener("mouseenter", () => {
    clearTimeout(closeTimeout);
  });

  menu.addEventListener("mouseleave", () => {
    menu.style.display = "none";
  });

  toolbar.lastChild.prepend(btn);
}

(async () => {
  const video = await waitForElement("video");
  const toolbar = video.previousElementSibling;
  const lastButton = toolbar.querySelector("button:last-of-type");

  video.addEventListener("timeupdate", () => {
    if (video.buffered.length <= 0) return;
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    const isLive = Math.abs(bufferedEnd - video.currentTime) < 1;
    if (isLive && video.playbackRate > 1) video.playbackRate = 1;
  });

  const reloadBtn = lastButton.cloneNode(true);
  reloadBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-cw-icon lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`;
  reloadBtn.addEventListener("click", () => {
    location.reload();
  });
  reloadBtn.firstChild.style = "fill: none;"; // Existing styling likes to fill, breaking the svg
  addTooltip(reloadBtn, "Reload");
  lastButton.before(reloadBtn);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "1";
  slider.step = "0.01";
  slider.value = 1; // Kick defaults to this with a random-ish delay idk why

  slider.addEventListener("input", (e) => {
    const value = parseFloat(e.target.value);
    video.volume = value;
    video.muted = value === 0;
  });

  video.addEventListener("volumechange", () => {
    if (video.muted) return;
    if (parseFloat(slider.value) == 0) slider.value = 1;
    video.volume = slider.value;
  });

  lastButton.after(slider);

  createSpeedSelector(video, toolbar);
})();