// ==UserScript==
// @name         Vegeta Ultra Ego Anti Lag IndexedDB (g-home)
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  Fullscreen instantâneo, salva vídeos no navegador, roda só em g-home
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549180/Vegeta%20Ultra%20Ego%20Anti%20Lag%20IndexedDB%20%28g-home%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549180/Vegeta%20Ultra%20Ego%20Anti%20Lag%20IndexedDB%20%28g-home%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Só roda se a página for g-home
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

    // Apaga a página só depois de confirmar g-home
    document.body.innerHTML = "";

    // Cria container fullscreen
    const container = document.createElement("div");
    container.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        z-index: 999999;
        overflow: hidden;
    `;
    document.body.appendChild(container);

    // IndexedDB helper
    async function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('VegetaVideosDB', 1);
            request.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('videos')) {
                    db.createObjectStore('videos');
                }
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

    // Pré-carrega todos os vídeos (IndexedDB)
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

    // Função pra criar e tocar vídeo
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
            width: 100vw;
            height: 100vh;
            object-fit: cover;
            position: fixed;
            top: 0;
            left: 0;
            background-color: black;
        `;
        container.appendChild(vid);
        videoElement = vid;

        vid.addEventListener('canplay', () => vid.play().catch(()=>{}));
        vid.addEventListener('error', () => {
            console.warn("Erro no vídeo, pulando...");
            currentIndex = (currentIndex + 1) % videoBlobs.length;
            playVideo(currentIndex);
        });
    }

    // Toca primeiro vídeo
    playVideo(currentIndex);

    // Troca manual com P
    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === 'p') {
            currentIndex = (currentIndex + 1) % videoBlobs.length;
            playVideo(currentIndex);
        }
    });

    // WakeLock pra não desligar a tela
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').catch(()=>{});
    }

})();
