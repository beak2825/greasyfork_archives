// ==UserScript==
// @name         Vegeta Ultra Ego Fullscreen Switcher V7 Beta
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Vídeos fullscreen com anúncios a cada 10s, botão X após 20s
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548853/Vegeta%20Ultra%20Ego%20Fullscreen%20Switcher%20V7%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/548853/Vegeta%20Ultra%20Ego%20Fullscreen%20Switcher%20V7%20Beta.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const videoURLs = [
        "https://files.catbox.moe/pdoowu.mp4",
        "https://files.catbox.moe/8rghdx.mp4",
        "https://files.catbox.moe/3q0sj1.mp4",
        "https://files.catbox.moe/0ecjn5.mp4",
        "https://files.catbox.moe/rwc0em.mp4",
        "https://files.catbox.moe/uww9y2.mp4",
        "https://files.catbox.moe/da9j9t.mp4",
        "https://files.catbox.moe/9eeurq.mp4"
    ];

    const adURLs = [
        "https://files.catbox.moe/fkzd6w.mp4"
        // Pode adicionar mais links de anúncios aqui
    ];

    if (!document.body.className.includes("g-home")) return;

    document.documentElement.innerHTML = "";

    const container = document.createElement("div");
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background-color: black;
        overflow: hidden;
    `;
    document.body.appendChild(container);

    // Vídeos normais
    const videos = videoURLs.map((url, i) => {
        const vid = document.createElement("video");
        vid.src = url;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: ${i === 0 ? "block" : "none"};
        `;
        container.appendChild(vid);
        return vid;
    });

    let index = 0;
    let normalInterval = setInterval(() => {
        videos[index].style.display = "none";
        index = (index + 1) % videos.length;
        videos[index].style.display = "block";
    }, 10000);

    let adIndex = 0;
    let adVideo;
    let adButton;
    let adInterval;
    let showXTimeout;
    let adActive = false;

    function startAd() {
        if (adActive) return;
        adActive = true;

        // Pausa vídeos normais
        clearInterval(normalInterval);
        videos.forEach(v => v.style.display = "none");

        adVideo = document.createElement("video");
        adVideo.src = adURLs[adIndex];
        adVideo.autoplay = true;
        adVideo.loop = true;
        adVideo.muted = true;
        adVideo.playsInline = true;
        adVideo.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 10000;
        `;
        container.appendChild(adVideo);

        adButton = document.createElement("button");
        adButton.textContent = "X";
        adButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: red;
            color: white;
            border: none;
            font-size: 20px;
            padding: 10px;
            cursor: pointer;
            z-index: 10001;
            display: none;
        `;
        container.appendChild(adButton);

        showXTimeout = setTimeout(() => {
            adButton.style.display = "block";
        }, 20000); // X aparece 20s depois

        adButton.addEventListener("click", endAd);

        // Troca anúncio a cada 10s
        adInterval = setInterval(() => {
            adIndex = (adIndex + 1) % adURLs.length;
            adVideo.src = adURLs[adIndex];
            adVideo.play();
        }, 10000);
    }

    function endAd() {
        adActive = false;
        clearInterval(adInterval);
        clearTimeout(showXTimeout);
        adVideo.remove();
        adButton.remove();
        normalInterval = setInterval(() => {
            videos[index].style.display = "none";
            index = (index + 1) % videos.length;
            videos[index].style.display = "block";
        }, 10000);
        videos[index].style.display = "block";
    }

    // A cada 10 segundos, dispara anúncio
    setInterval(() => {
        startAd();
    }, 10000);

    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p" && !adActive) {
            clearInterval(normalInterval);
            videos[index].style.display = "none";
            index = (index + 1) % videos.length;
            videos[index].style.display = "block";
            normalInterval = setInterval(() => {
                videos[index].style.display = "none";
                index = (index + 1) % videos.length;
                videos[index].style.display = "block";
            }, 10000);
        }
    });
})();
