// ==UserScript==
// @name         ProProProgs.ru - Dark Theme
// @namespace    https://proproprogs.ru/
// @version      1.2
// @description  Adds dark theme and improves readability.
// @author       napHiwka
// @match        https://proproprogs.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551791/ProProProgsru%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/551791/ProProProgsru%20-%20Dark%20Theme.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Create theme toggle button
  const themeButton = document.createElement("button");
  themeButton.id = "theme-toggle";
  themeButton.innerHTML = "🌙";
  themeButton.title = "Switch theme";

  Object.assign(themeButton.style, {
    position: "fixed",
    bottom: "40px",
    right: "40px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#3F4137",
    color: "#fdc073",
    fontSize: "24px",
    cursor: "pointer",
    zIndex: "10000",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s ease",
  });

  document.body.appendChild(themeButton);

  const savedTheme = localStorage.getItem("proproprogs-theme") || "light";

  // Inject CSS styles
  const style = document.createElement("style");
  style.id = "custom-styles";
  style.textContent = `
  /* ===== Base layout ===== */
  .content-text {
    max-width: 1000px !important;
    width: 100% !important;
    margin: 60px auto 0 auto !important;
    padding: 0 40px !important;
    line-height: 1.8 !important;
    font-size: 20px !important;
    font-family: Open Sans, Arial, sans-serif !important;
  }
  .content-text p {
    margin-bottom: 1.2em !important;
  }
  .highlight {
    max-width: 100% !important;
    margin: 20px 0 !important;
  }
  .content-text img {
    display: block !important;
    margin: 20px auto !important;
    padding: 20px auto;
  }
  ol {
    display: inline;
    padding: 0;
    margin: 0;
  }
  .content-text h1 {
    margin: 40px 0 20px 0 !important;
    line-height: 1.4 !important;
  }
  .topic-text {
    color: #000 !important;
    margin: 40px 0 20px 0 !important;
    background: none !important;
  }
  .topic-line {
    border-bottom: 2px solid #fda83d !important;
  }
  .video_container {
    max-width: 1000px !important;
    margin: 40px auto !important;
  }
  ul.control,
  ul.breadcrumbs {
    max-width: 1000px !important;
    margin: 60px auto !important;
    padding: 0 40px !important;
  }
  .content {
    padding-right: 20px !important;
  }
  .quote {
    max-width: 800px !important;
    margin: 20px auto !important;
  }

  /* ===== Dark theme ===== */
  body.dark-theme {
    background-color: #1a1a1a !important;
    color: #e0e0e0 !important;
  }
  body.dark-theme .header {
    background: #2a2a2a !important;
    border-bottom: 1px solid #404040 !important;
  }
  body.dark-theme ul.mainmenu li a {
    color: #fdc073 !important;
  }
  body.dark-theme ul.mainmenu li a:hover {
    color: #ffa726 !important;
  }
  body.dark-theme .left-chapters {
    background: #242424 !important;
    border-right: 1px solid #404040 !important;
  }
  body.dark-theme .left-chapters ul li {
    color: #888 !important;
  }
  body.dark-theme .left-chapters ul li.selected {
    color: #64b5f6 !important;
  }
  body.dark-theme .left-chapters ul li a {
    color: #b0b0b0 !important;
  }
  body.dark-theme .left-chapters ul li a:hover {
    color: #ff7043 !important;
  }
  body.dark-theme .content {
    background-color: #1a1a1a !important;
  }
  body.dark-theme .content-text {
    color: #e0e0e0 !important;
  }
  body.dark-theme .content-text h1,
  body.dark-theme .topic-text {
    color: #fdc073 !important;
  }
  body.dark-theme .topic-line {
    border-bottom: 1px solid #fda83d !important;
  }
  body.dark-theme a,
  body.dark-theme ul.breadcrumbs li a,
  body.dark-theme ul.control li a {
    color: #64b5f6 !important;
  }
  body.dark-theme a:hover,
  body.dark-theme ul.breadcrumbs li a:hover,
  body.dark-theme ul.control li a:hover {
    color: #ff7043 !important;
  }
  body.dark-theme .highlight {
    background: #2a2a2a !important;
    border: 1px solid #404040 !important;
  }
  body.dark-theme .highlight pre {
    background: #2a2a2a !important;
    color: #e0e0e0 !important;
  }
  body.dark-theme .quote {
    color: #b0b0b0 !important;
    background: linear-gradient(to right, #2a2a2a 0%, transparent 100%) !important;
  }
  body.dark-theme .container {
    border-color: #404040 !important;
  }
  body.dark-theme .container p {
    border-left-color: #ff7043 !important;
  }
  body.dark-theme .video_container {
    background: #242424 !important;
    padding: 20px !important;
    border-radius: 8px !important;
  }
  body.dark-theme .video_item {
    background: #2a2a2a !important;
    border-radius: 4px !important;
    padding: 10px !important;
  }
  body.dark-theme .video_item:hover {
    background: #333 !important;
  }
  body.dark-theme .video_title {
    color: #fdc073 !important;
  }
  body.dark-theme .video_item_title {
    color: #e0e0e0 !important;
  }
  body.dark-theme #footer {
    background: #2a2a2a !important;
    color: #888 !important;
    border-top: 1px solid #404040 !important;
  }
  body.dark-theme #footer a {
    color: #888 !important;
  }
  body.dark-theme #footer a:hover {
    color: #64b5f6 !important;
  }
  body.dark-theme ul.lang-list {
    background: #2a2a2a !important;
    border-top-color: #404040 !important;
  }
  body.dark-theme ul.lang-list li a {
    color: #b0b0b0 !important;
  }
  body.dark-theme ul.lang-list li a:hover {
    color: #fdc073 !important;
  }
  body.dark-theme ul.lang-list li.selected {
    color: #fdc073 !important;
    border-bottom-color: #fdc073 !important;
  }
  body.dark-theme table,
  body.dark-theme td {
    border-color: #404040 !important;
    background: transparent !important;
  }
  body.dark-theme .topmenu-toggle {
    background: #2a2a2a !important;
    border-top-color: #404040 !important;
  }
  body.dark-theme ul.mobile-list li a {
    color: #fdc073 !important;
  }
  body.dark-theme ul.mobile-list li a:hover {
    color: #ffa726 !important;
  }
  body.dark-theme ul.mobile-list-expand li a {
    color: #b0b0b0 !important;
  }
  body.dark-theme ul.mobile-list-expand li a:hover {
    color: #ff7043 !important;
  }
  body.dark-theme #theme-toggle {
    background-color: #424242 !important;
    color: #ffc107 !important;
  }

  /* Code blocks */
  body.dark-theme .block {
    background: #2a2a2a !important;
  }

  body.dark-theme .block pre span {
    mix-blend-mode: difference;
    filter: saturate(150%) brightness(1.5);
  }

  /* Code blocks - blue variants */
  body.dark-theme .block span[style*="color: #0000dd"],
  body.dark-theme .block span[style*="color: #000066;"],
  body.dark-theme .block span[style*="color: #003399;"],
  body.dark-theme .block span[style*="color: #000099;"],
  body.dark-theme .block span[style*="color: #0000ff;"],
  body.dark-theme .block span[style*="color: #483d8b;"],
  body.dark-theme .block span[style*="color: #003366;"],
  body.dark-theme .block span[style*="color: #0000cd;"] {
    color: #68adfd !important;
    mix-blend-mode: normal !important;
  }

  /* Code blocks - red variants */
  body.dark-theme .block span[style*="color: #993333"],
  body.dark-theme .block span[style*="color: #ff0000;"],
  body.dark-theme .block span[style*="color: #dc143c;"] {
    color: #fa5050 !important;
    mix-blend-mode: normal !important;
  }

  /* Code blocks - purple variants */
  body.dark-theme .block span[style*="color: #800080"],
  body.dark-theme .block span[style*="color: #660066"] {
    color: #c487ec !important;
    mix-blend-mode: normal !important;
  }

  /* Code blocks - yellow variants */
  body.dark-theme .block span[style*="color: #b1b100"] {
    color: #ffcb6b !important;
    mix-blend-mode: normal !important;
  }

  /* Code blocks - black text */
  body.dark-theme .block span[style*="color: black;"],
  body.dark-theme .block span[style*="color: #000000;"] {
    color: #e0e0e0 !important;
    mix-blend-mode: normal !important;
  }

  /* ===== Image inversion ===== */
  .invert-img { filter: invert(1) !important; }

  /* ===== Responsive design ===== */
  @media (max-width: 1400px) {
    .content-text {
      max-width: 800px !important;
    }
  }
  @media (max-width: 1000px) {
    .content-text {
      max-width: 100% !important;
      padding: 0 20px !important;
    }
    ul.control,
    ul.breadcrumbs {
      padding: 0 20px !important;
    }
    #theme-toggle {
      bottom: 20px !important;
      right: 20px !important;
      width: 45px !important;
      height: 45px !important;
    }
  }
    `;
  document.head.appendChild(style);

  // Apply theme
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      themeButton.innerHTML = "☀️";
      themeButton.title = "Light theme";
      invertDarkImages();
    } else {
      document.body.classList.remove("dark-theme");
      themeButton.innerHTML = "🌙";
      themeButton.title = "Dark theme";
      resetInvertedImages();
    }
    localStorage.setItem("proproprogs-theme", theme);
  }

  applyTheme(savedTheme);

  // Handle button click
  themeButton.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });

  // Button hover animation
  themeButton.addEventListener("mouseenter", () => (themeButton.style.transform = "scale(1.1)"));
  themeButton.addEventListener("mouseleave", () => (themeButton.style.transform = "scale(1)"));

  // ===== Invert images with dark content =====
  function invertDarkImages() {
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.onload = () => checkAndInvert(img);
      } else {
        checkAndInvert(img);
      }
    });
  }

  function checkAndInvert(img) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      let count = 0;
      for (let i = 0; i < data.length; i += 4 * 10) { // sample every 10 pixels for performance
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        sum += brightness;
        count++;
      }
      const avgBrightness = sum / count;
      if (avgBrightness < 100) img.classList.add("invert-img"); // dark image
    } catch (e) {
      // cross-origin images may fail
    }
  }

  function resetInvertedImages() {
    document.querySelectorAll("img.invert-img").forEach((img) => img.classList.remove("invert-img"));
  }
})();