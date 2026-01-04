// ==UserScript==
// @name            Youtube download button - y2mate
// @namespace       http://tampermonkey.net/
// @version         1.0.5.4
// @author          God Mario
// @match           https://www.youtube.com/watch
// @match           https://*.youtube.com/*
// @run-at          document-start
// @icon            https://cdn.icon-icons.com/icons2/822/PNG/512/download_icon-icons.com_66472.png
// @grant           GM_addStyle
// @license         MIT
// @description     This Script Adds a Download Button on the left side of the subscribe button, you can easily download Audio/Video
// @downloadURL https://update.greasyfork.org/scripts/549935/Youtube%20download%20button%20-%20y2mate.user.js
// @updateURL https://update.greasyfork.org/scripts/549935/Youtube%20download%20button%20-%20y2mate.meta.js
// ==/UserScript==


// ==UserScript==
// @name         YouTube Download Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button to YouTube videos
// @author       Your Name
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    const textButton = "Download";
    const icon = '<div style="height: 84%; margin-left: -8px; fill: currentcolor;"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path></svg></div>';
    const API = "https://www.y2mate.com/download-youtube/";
    const BUTTON_ID = "dwnldBtn";
    const TARGET_BUTTON = ".ytp-left-controls";

    const buttonStyle = `
        #${BUTTON_ID} {
            background-color: var(--yt-spec-additive-background);
            color: var(--yt-spec-text-primary);
            margin: 0px 4px;
            border-radius: 18px;
            width: 120px;
            height: 36px;
            line-height: 37px;
            text-align: center;
            font-style: normal;
            font-size: 14px;
            font-family: Roboto, Noto, sans-serif;
            font-weight: 500;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #${BUTTON_ID}:hover {
            background-color: var(--yt-spec-mono-tonal-hover);
            color: var(--yt-spec-text-primary);
        }
    `;

    GM_addStyle(buttonStyle);

    let lastUrl = null;
    let idVideo = null;

    const observer = new MutationObserver(mutations => {
        if (document.querySelector(TARGET_BUTTON)) {
            observer.disconnect();
            addButton();
        }
    });

    function getIdVideo(url) {
        if (url.includes("v=")) {
            let indice = url.indexOf("v=");
            let id = url.slice(indice + 2);

            return id;
        } else {
            console.error("No se pudo obtener el ID del video de la URL");
            return null;
        }
    }

    function addButton() {
        waitForElement(TARGET_BUTTON).then((btn) => {
            btn.innerHTML += `<a href="${API + idVideo}" target="_blank" id="${BUTTON_ID}">${icon}${textButton}</a>`;
        });
    }

    function updateButton() {
        let url1 = window.location.href;
        if (url1 !== lastUrl) {
            lastUrl = url1;
            idVideo = getIdVideo(url1);
            waitForElement(`#${BUTTON_ID}`).then((btn) => {
                btn.href = API + idVideo;
            });
        }
    }

    function waitForElement(selector) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
    } else {
      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  });
}


    window.onload = function() {
        let url1 = window.location.href;
        idVideo = getIdVideo(url1);
        observer.observe(document.body, { childList: true, subtree: true });
    };

    window.addEventListener("yt-navigate-finish", updateButton, true);
})();