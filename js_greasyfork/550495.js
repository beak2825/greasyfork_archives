// ==UserScript==
// @name         Vegeta Ultra Ego Anti Lag IndexedDB + Widgets Flutuantes Separados
// @namespace    http://tampermonkey.net/
// @version      11.2
// @description  Vídeos fullscreen sem fundo preto + barra e widgets flutuando separados, toggle M
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550495/Vegeta%20Ultra%20Ego%20Anti%20Lag%20IndexedDB%20%2B%20Widgets%20Flutuantes%20Separados.user.js
// @updateURL https://update.greasyfork.org/scripts/550495/Vegeta%20Ultra%20Ego%20Anti%20Lag%20IndexedDB%20%2B%20Widgets%20Flutuantes%20Separados.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    if (!document.body.className.includes("g-home")) return;

    const videoURLs = [
        "https://files.catbox.moe/pdoowu.mp4",
        "https://files.catbox.moe/8rghdx.mp4",
        "https://files.catbox.moe/3q0sj1.mp4",
        "https://files.catbox.moe/0ecjn5.mp4",
        "https://files.catbox.moe/rwc0em.mp4",
        "https://files.catbox.moe/uww9y2.mp4",
        "https://files.catbox.moe/da9j9t.mp4",
        "https://files.catbox.moe/9eeurq.mp4",
        "https://files.catbox.moe/v6a5t2.mp4",
        "https://files.catbox.moe/qdrmsf.mp4",
        "https://files.catbox.moe/j9rb4i.mp4"
    ];

    let currentIndex = 0;
    let videoElement = null;
    document.body.innerHTML = "";

    // Garantir fundo transparente
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";

    const container = document.createElement("div");
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: 1;
        overflow: hidden;
        background: transparent;
    `;
    document.body.appendChild(container);

    // IndexedDB helpers
    async function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('VegetaVideosDB', 1);
            request.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('videos')) db.createObjectStore('videos');
            };
            request.onsuccess = e => resolve(e.target.result);
            request.onerror = e => reject(e);
        });
    }

    async function saveVideoToDB(name, blob) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('videos', 'readwrite');
            tx.objectStore('videos').put(blob, name);
            tx.oncomplete = () => resolve();
            tx.onerror = e => reject(e);
        });
    }

    async function getVideoFromDB(name) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction('videos', 'readonly');
            const req = tx.objectStore('videos').get(name);
            req.onsuccess = () => resolve(req.result);
            req.onerror = e => reject(e);
        });
    }

    // Pré-carrega vídeos
    const videoBlobs = [];
    for (let i = 0; i < videoURLs.length; i++) {
        let blob = await getVideoFromDB(`video${i}`);
        if (!blob) {
            const res = await fetch(videoURLs[i]);
            blob = await res.blob();
            await saveVideoToDB(`video${i}`, blob);
        }
        videoBlobs[i] = URL.createObjectURL(blob);
    }

    function playVideo(index) {
        if (videoElement) {
            videoElement.pause();
            videoElement.remove();
        }
        const vid = document.createElement("video");
        vid.src = videoBlobs[index];
        vid.autoplay = true;
        vid.loop = false;
        vid.muted = true;
        vid.playsInline = true;
        vid.style.cssText = `
            width: 100vw; height: 100vh;
            object-fit: cover;
            position: fixed; top: 0; left: 0;
            z-index: 1;
        `;
        container.appendChild(vid);
        videoElement = vid;
        vid.addEventListener('canplay', () => vid.play().catch(()=>{}));
        vid.addEventListener('error', () => {
            currentIndex = (currentIndex + 1) % videoBlobs.length;
            playVideo(currentIndex);
        });
    }

    playVideo(currentIndex);

    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === 'p') {
            currentIndex = (currentIndex + 1) % videoBlobs.length;
            playVideo(currentIndex);
        }
    });

    // =====================
    // Painel da barra de pesquisa
    // =====================
    const searchPanel = document.createElement("div");
    searchPanel.style.cssText = `
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.15);
        padding: 15px;
        border-radius: 12px;
        backdrop-filter: blur(5px);
        display: none;
        z-index: 999998;
        text-align: center;
    `;
    document.body.appendChild(searchPanel);

    const searchForm = document.createElement("form");
    searchForm.action = "https://www.google.com/search";
    searchForm.method = "GET";
    searchForm.target = "_blank";
    searchForm.style.marginBottom = "10px";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.name = "q";
    searchInput.placeholder = "Pesquisar no Google...";
    searchInput.style.cssText = `
        width: 100%;
        padding: 8px;
        border-radius: 10px;
        border: none;
        outline: none;
        font-size: 14px;
        background: rgba(255,255,255,0.15);
        color: white;
    `;
    searchForm.appendChild(searchInput);
    searchPanel.appendChild(searchForm);

    // =====================
    // Painel dos widgets
    // =====================
    const widgetPanel = document.createElement("div");
    widgetPanel.style.cssText = `
        position: fixed;
        top: 52%; /* logo abaixo da barra */
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.15);
        padding: 15px;
        border-radius: 12px;
        backdrop-filter: blur(5px);
        display: none;
        z-index: 999999;
        text-align: center;
    `;
    document.body.appendChild(widgetPanel);

    const widgets = [
        { name: "PortalNet", icon: "https://files.catbox.moe/8a0z73.png", url: "https://portalnetescola.educacao.go.gov.br/" },
        { name: "YouTube", icon: "https://files.catbox.moe/6q683c.png", url: "https://youtube.com" },
        { name: "ChatGPT", icon: "https://files.catbox.moe/30b97a.jpeg", url: "https://chatgpt.com" },
        { name: "Google Earth", icon: "https://files.catbox.moe/35mc7e.jpeg", url: "https://earth.google.com" }
    ];

    const widgetContainer = document.createElement("div");
    widgetContainer.style.cssText = `
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
    `;

    widgets.forEach(w => {
        const btn = document.createElement("div");
        btn.style.cssText = `
            width: 70px;
            cursor: pointer;
            text-align: center;
        `;
        const img = document.createElement("img");
        img.src = w.icon;
        img.style.cssText = "width:55px;height:55px;border-radius:10px;";

        const span = document.createElement("div");
        span.textContent = w.name;
        span.style.fontSize = "12px";

        btn.appendChild(img);
        btn.appendChild(span);

        btn.onclick = () => window.open(w.url, "_blank");

        widgetContainer.appendChild(btn);
    });

    widgetPanel.appendChild(widgetContainer);

    // Toggle painel com M
    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === "m") {
            const show = searchPanel.style.display === "none";
            searchPanel.style.display = show ? "block" : "none";
            widgetPanel.style.display = show ? "flex" : "none";
        }
    });

    if ('wakeLock' in navigator) navigator.wakeLock.request('screen').catch(()=>{});

})();
