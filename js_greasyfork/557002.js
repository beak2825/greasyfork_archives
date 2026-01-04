// ==UserScript==
// @name         Supplementary Watcher
// @namespace    http://tampermonkey.net/
// @version      2025-12-09
// @description  Add video players for supplementary movie files on Science and Nature articles.
// @author       RebelPotato
// @match        https://www.science.org/doi/*
// @match        https://www.nature.com/articles/*
// @grant        none
// @run-at       document-end
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/557002/Supplementary%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/557002/Supplementary%20Watcher.meta.js
// ==/UserScript==
// This is free and unencumbered software released into the public domain.
// For more information, please refer to <https://unlicense.org/>

class VideoPlayerWrapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
    this.shadowRoot
      .querySelector("button")
      .addEventListener("click", () => this.reload());
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;margin-top:10px}
        .container{border:1px solid #ddd;border-radius:4px;padding:10px;background:#f9f9f9}
        button{background:#007bff;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;margin-bottom:10px;font-size:14px}
        button:hover{background:#0056b3}
        video{width:100%;max-width:800px;border-radius:4px;background:#000;display:block}
      </style>
      <div class="container">
        <button>🔄 Reload Video</button>
        <video controls src="${this.getAttribute("src")}"></video>
      </div>
    `;
  }
  reload() {
    const video = this.shadowRoot.querySelector("video");
    const src = video.src;
    video.src = "";
    video.load();
    setTimeout(() => {
      video.src = src;
      video.load();
    }, 100);
  }
}

const names = ["movie", "video"];
const has_video_name = (url) =>
  names.some((name) => url.toLowerCase().includes(name));
const suffixes = [".mp4", ".mov", ".avi", ".wmv", ".flv", ".mkv"];
const has_video_suffix = (url) => suffixes.some((suf) => url.endsWith(suf));

function collectNature(acc) {
  const items = document.querySelectorAll(".c-article-supplementary__item");
  items.forEach((item) => {
    const link = item.querySelector("a");
    if (
      link &&
      (has_video_name(link.dataset.trackLabel) || has_video_suffix(link.href))
    ) {
      acc.push({ item, src: link.href });
    }
  });
}

function collectScience(acc) {
  const items = document.querySelectorAll(".core-supplementary-material");
  items.forEach((item) => {
    const filename = item.querySelector(".core-filename");
    if (
      filename &&
      (has_video_name(filename.textContent) ||
        has_video_suffix(filename.textContent.slice(0, -1)))
    ) {
      const link = item.querySelector("a");
      if (link) acc.push({ item, src: link.href });
    }
  });
}

(function () {
  console.log("Supplementary movie watcher script running...");
  if (!customElements.get("video-player-wrapper")) {
    customElements.define("video-player-wrapper", VideoPlayerWrapper);
  }

  const acc = [];
  collectNature(acc);
  collectScience(acc);
  let count = 0;

  acc.forEach(({ item, src }) => {
    if (item.querySelector("video-player-wrapper")) return;
    const wrapper = document.createElement("video-player-wrapper");
    wrapper.setAttribute("src", src);
    item.appendChild(wrapper);
    count++;
  });

  console.log(`Added ${count} video player(s) to the page`);
})();
