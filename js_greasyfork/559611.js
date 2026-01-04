// ==UserScript==
// @name         ULR steam lite
// @namespace    http://tampermonkey.net/
// @version      0.0.0
// @description  Make steam ulr playable as a browser bookmark
// @author       Me
// @match        https://www.playunlight.online/?*
// @run-at       document-start
// @connect      update.greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559611/ULR%20steam%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/559611/ULR%20steam%20lite.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const WAIT_SEC = 0;
  const TITLE = "UNLIGHT:Revive";
  const FAVICON = "rose";

  const SCRIPTS = [
    [
      "client/runtime.4b9635bf9adb56349157.js",
      "client/main.b1021f9314abcd3d0c36.js",
    ],
  ];
  const FAVICON_MAP = {
    blank: "data:,",
    green:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==",
    rose: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAJQAlAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAALCAAgACABAREA/8QAGAABAQEBAQAAAAAAAAAAAAAABwgGAAH/xAAuEAACAQMDAwIFAwUAAAAAAAABAgMEBREGEiEACBMiQQcUIzGBJFFhYmNxwfD/2gAIAQEAAD8AlUDJwOqF0d29UItlJXfEPVdJYpKlFdKASRpKob7bmc4Df0gH/PWq1f222C9WGGt+Gd4jeenjZHWWcTx1bj+4DhH9iMY+3C8kyvX0dRb66oo62F4KqnkaKWJxhkdTgg/yCOlntg0BFrXXhqa9pFt1nVKqTxsVZ5N301yORyCcjn0/nqnaW60tFd6yooLJb8wVs9MtVWSrSU9IkeFdg21izM+MsByXVSfTx5Vag31du1JZLUy10jSCqjpp0kiudKgkEjRspxIyFVZSwUkHaMBjiZO6ukgT4rVFxoU/SXGmgnWVR6JW8YyR+Np/PST2Uags8SXqweBob5ORVGdnyJ4k9IQD2K7iffO4n26T7d8jU2qG3RfIzansNRVeW31snhNTv3+QhiPtIJFcOAQCRn367Td007QoklHW09wvlDC9NbLLA4/SZUAwoABuJK4MhHAz9gCSId11spNO6e0FYPmfm7nSQTNNM2NxXESA49l9GFHsEx0B2O719iu1Nc7PVS0lfTPvimjOCp/2McEHgjjpjtvcRcXqI5NT6as18zjz+RAnlK8K+CGVXA43AcjAI4BG5m7s4IYoUoNGFVUAFXrwoUfsuI/+/bqefiNq6s1xrC436vBjapf6cO/eIYxwqA8cAfwMnJ9+v//Z",
  };
  const favicon_url = FAVICON_MAP[FAVICON] || FAVICON;
  const total = SCRIPTS.flat().length;
  window.SERVER = "steam";
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  window.auth_string = params.get("steamid");
  document.body.textContent = "";
  document.title = TITLE;
  const div = document.createElement("div");
  div.textContent = "Loading";
  document.body.appendChild(div);
  const wait_ms = WAIT_SEC * 1000;

  function addcss() {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "stylesheets/style-steam.css";
    document.head.appendChild(css);
  }

  function addCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "myCustomCanvas";
    canvas.width = 760;
    canvas.height = 680;
    document.body.appendChild(canvas);
  }

  function addIcon() {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/x-icon";
    icon.href = favicon_url;
    document.head.appendChild(icon);
  }

  let i = 0;
  function addScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        i++;
        console.debug(`Loaded: ${src}`);
        div.textContent = `Loaded: ${src} (${i}/${total})`;
        resolve(`Loaded: ${src}`);
      };
      script.onerror = () => {
        div.textContent = `Failed to load: ${src}`;
        reject(`Failed to load: ${src}`);
      };
      document.head.appendChild(script);
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function checkPort() {
    if (location.port === "") {
      const port = 14012 + Math.trunc(Math.random() * 10);
      const newUrl = `${location.origin}:${port}${location.pathname}${location.search}${location.hash}`;
      location.href = newUrl;
    }
  }

  function loadScripts(scripts) {
    scripts
      .reduce((promise, srcs) => {
        return promise.then(() =>
          Promise.all(srcs.map((src) => addScript(src))).then(() =>
            sleep(wait_ms),
          ),
        );
      }, Promise.resolve())
      .then(() => div.remove())
      .catch((error) => {
        div.textContent = `Error: ${error}`;
      });
  }

  function main() {
    checkPort();
    addcss();
    addCanvas();
    addIcon();
    loadScripts(SCRIPTS);
  }

  main();
})();
