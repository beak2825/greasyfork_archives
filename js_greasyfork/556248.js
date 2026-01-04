// ==UserScript==
// @name         Instagram Video Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Provides enhanced video playback experience on Instagram with floating controls and multiple speed options
// @author       se7
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556248/Instagram%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/556248/Instagram%20Video%20Controls.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // SVG Icons
  const ICONS = {
    play: `<svg height="24" width="24" viewBox="0 0 24 24"><path fill="white" d="M8 5v14l11-7z"></path></svg>`,
    pause: `<svg height="24" width="24" viewBox="0 0 24 24"><path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`,
  };

  function addVideoControls(video) {
    const videoWrapper = video.parentElement;
    if (!videoWrapper || videoWrapper.querySelector(".custom-video-controls")) {
      return;
    }

    videoWrapper.style.position = "relative";

    // --- Main Container for Controls ---
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "custom-video-controls";
    const isStoryPage = window.location.pathname.startsWith('/stories/');

    Object.assign(controlsContainer.style, {
      position: "absolute",
      bottom: isStoryPage ? "75px" : "15px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "1000",
      display: "flex",
      gap: "12px",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: "5px 15px",
      borderRadius: "50px",
      opacity: "0",
      transition: "opacity 0.3s ease-in-out",
      pointerEvents: "none",
    });

    // --- Show/Hide controls on hover ---
    videoWrapper.addEventListener("mouseenter", () => {
      controlsContainer.style.opacity = "1";
      controlsContainer.style.pointerEvents = "auto";
    });
    videoWrapper.addEventListener("mouseleave", () => {
      controlsContainer.style.opacity = "0";
      controlsContainer.style.pointerEvents = "none";
    });

    // --- Play/Pause Button with Icons ---
    const playPauseButton = document.createElement("button");
    playPauseButton.innerHTML = video.paused ? ICONS.play : ICONS.pause;
    Object.assign(playPauseButton.style, {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });
    playPauseButton.addEventListener("click", (e) => {
      e.stopPropagation();
      video.paused ? video.play() : video.pause();
    });
    video.addEventListener(
      "play",
      () => (playPauseButton.innerHTML = ICONS.pause),
    );
    video.addEventListener(
      "pause",
      () => (playPauseButton.innerHTML = ICONS.play),
    );

    // --- Seek Bar ---
    const seekBar = document.createElement("input");
    seekBar.type = "range";
    seekBar.min = 0;
    seekBar.max = 100;
    seekBar.value = 0;
    Object.assign(seekBar.style, { width: "200px", cursor: "pointer" });
    video.addEventListener("timeupdate", () => {
      if (video.duration)
        seekBar.value = (video.currentTime / video.duration) * 100;
    });
    seekBar.addEventListener("input", () => {
      if (video.duration)
        video.currentTime = (seekBar.value / 100) * video.duration;
    });

    // --- Speed Selection Dropdown ---
    const speedSelector = document.createElement("select");
    Object.assign(speedSelector.style, {
      background: "none",
      border: "none",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
      appearance: "none", // Removes default browser styling
      textAlign: "center",
    });

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    speeds.forEach((speed) => {
      const option = document.createElement("option");
      option.value = speed;
      option.innerText = `${speed}x`;
      // Style the options inside the dropdown
      Object.assign(option.style, {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "white",
      });
      speedSelector.appendChild(option);
    });

    speedSelector.value = "1"; // Default speed
    speedSelector.addEventListener("change", (e) => {
      e.stopPropagation();
      video.playbackRate = parseFloat(speedSelector.value);
    });

    // Prevents clicking on the dropdown from pausing the video
    speedSelector.addEventListener("click", (e) => e.stopPropagation());

    // --- Arrange and Add to Page ---
    controlsContainer.appendChild(playPauseButton);
    controlsContainer.appendChild(seekBar);
    controlsContainer.appendChild(speedSelector);
    videoWrapper.appendChild(controlsContainer);
  }

  // --- Observer for Dynamically Loaded Videos ---
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // ELEMENT_NODE
          if (node.tagName === "VIDEO") {
            addVideoControls(node);
          } else {
            node.querySelectorAll("video").forEach(addVideoControls);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll("video").forEach(addVideoControls);
})();
