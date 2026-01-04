// ==UserScript==
// @name         Süre Limitsiz ABB Seyret
// @namespace    SinirsizABBSeyret
// @version      5.0
// @description  Ağ trafiğinden yayın linkini yakalar. Her yeni araca tıklandığında linki günceller.
// @author       Runterya
// @match        https://seyret.ankara.bel.tr/*
// @grant        none
// @icon         https://seyret.ankara.bel.tr/abb-logo.ac25b9a737d55332230b4e746de8ce97.svg
// @require      https://update.greasyfork.org/scripts/443005/1037700/hls.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561214/S%C3%BCre%20Limitsiz%20ABB%20Seyret.user.js
// @updateURL https://update.greasyfork.org/scripts/561214/S%C3%BCre%20Limitsiz%20ABB%20Seyret.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.currentStreamUrl = "";
    window.currentStreamID = "";
    let hlsInstance = null;

    function getStreamID(url) {
        const match = url.match(/\/live\/([^\/]+)\/index\.m3u8/);
        return match ? match[1] : null;
    }

    const handleUrlCapture = (url) => {
        if (typeof url === "string" && url.includes(".m3u8") && url.includes("onstream.ankara.bel.tr")) {
            const newID = getStreamID(url);

            if (newID && newID !== window.currentStreamID) {
                console.log(`Eski: ${window.currentStreamID} -> Yeni: ${newID}`);

                window.currentStreamID = newID;
                window.currentStreamUrl = url;

                showToast(`${newID}`);
                updateButtonState();
            }
        }
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        handleUrlCapture(url);
        return originalOpen.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        handleUrlCapture(args[0]);
        return originalFetch.apply(this, args);
    };

    function showToast(message) {
        const oldToast = document.getElementById('seyret-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.id = 'seyret-toast';
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(39, 174, 96, 0.95)';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '30px';
        toast.style.zIndex = '100001';
        toast.style.fontWeight = 'bold';
        toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        toast.style.transition = 'all 0.3s ease';
        toast.innerText = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(()=> toast.remove(), 500);
        }, 2500);
    }

    function updateButtonState() {
        let btn = document.getElementById('seyret-unlimited-btn');
        if (!btn) {
            createButton();
            btn = document.getElementById('seyret-unlimited-btn');
        }

        btn.style.transform = "scale(1.1)";
        btn.style.backgroundColor = "#2ecc71";
        setTimeout(() => {
            btn.style.transform = "scale(1)";
            btn.style.backgroundColor = "#e74c3c";
        }, 300);
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.id = 'seyret-unlimited-btn';
        btn.innerHTML = 'SINIRSIZ İZLE';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '99999';
        btn.style.padding = '15px 25px';
        btn.style.backgroundColor = '#e74c3c';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.transition = 'transform 0.2s';

        btn.onclick = function() {
            if(!window.currentStreamUrl) {
                return;
            }
            openCustomPlayer(window.currentStreamUrl);
        };

        document.body.appendChild(btn);
    }

    function openCustomPlayer(videoUrl) {
        closeCustomPlayer();

        const originalVideo = document.querySelector('video');
        if (originalVideo) originalVideo.pause();

        const overlay = document.createElement('div');
        overlay.id = 'custom-player-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'black';
        overlay.style.zIndex = '100000';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'KAPAT';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '25px';
        closeBtn.style.right = '25px';
        closeBtn.style.padding = '12px 24px';
        closeBtn.style.backgroundColor = '#c0392b';
        closeBtn.style.color = '#fff';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.fontSize = '14px';

        closeBtn.onclick = closeCustomPlayer;

        const video = document.createElement('video');
        video.id = 'hls-video';
        video.controls = true;
        video.autoplay = true;
        video.style.width = '90%';
        video.style.height = '80vh';
        video.style.boxShadow = '0 0 30px rgba(255,255,255,0.1)';

        overlay.appendChild(closeBtn);
        overlay.appendChild(video);
        document.body.appendChild(overlay);

        if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(videoUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
            video.addEventListener('loadedmetadata', function() {
                video.play();
            });
        }
    }

    function closeCustomPlayer() {
        const overlay = document.getElementById('custom-player-overlay');

        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }

        if (overlay) {
            const video = overlay.querySelector('video');
            if (video) {
                video.pause();
                video.src = "";
                video.load();
            }
            overlay.remove();
        }
    }

})();