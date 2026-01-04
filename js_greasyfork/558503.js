// ==UserScript==
// @name         Spotify Mini Player v5.5
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  Spotify mini-player
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558503/Spotify%20Mini%20Player%20v55.user.js
// @updateURL https://update.greasyfork.org/scripts/558503/Spotify%20Mini%20Player%20v55.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let lastTrackId = "";
    let cached = {};
    let adBlockEnabled = localStorage.getItem("spMiniAdBlock") === "true";
    let adObserver, adInterval;

    function waitFor(selector, callback) {
        const check = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(check);
                callback(el);
            }
        }, 500);
    }

    function createMiniPlayer() {
        if (document.getElementById("spMiniPlayer")) return;

        const box = document.createElement("div");
        box.id = "spMiniPlayer";

        Object.assign(box.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "270px",
            minWidth: "200px",
            maxWidth: "400px",
            background: "rgba(18,18,18,0.95)",
            borderRadius: "16px",
            padding: "10px",
            zIndex: "99999999999",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
            fontFamily: "Segoe UI, Arial",
            userSelect: "none",
            cursor: "default",
            backdropFilter: "blur(5px)",
            resize: "both",
            overflow: "hidden",
            boxSizing: "border-box"
        });

        box.innerHTML = `
            <div style="width:100%; display:flex; justify-content:center;">
                <img id="mpCover" src="" style="width:100%; border-radius:12px; object-fit:cover; max-height:250px; margin-bottom:8px;">
            </div>
            <div id="mpTitle" style="font-size:15px; font-weight:600; text-align:center; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>
            <div id="mpArtist" style="font-size:12px; color:#b3b3b3; text-align:center; margin-bottom:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"></div>

            <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap; margin-bottom:6px; width:100%;">
                <button class="mpBtn" data-tid="shuffle">🔀</button>
                <button class="mpBtn" data-tid="skip-back">⏮</button>
                <button class="mpBtn" data-tid="play-pause">⏯</button>
                <button class="mpBtn" data-tid="skip-forward">⏭</button>
                <button class="mpBtn" data-tid="repeat">🔁</button>
            </div>

            <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap; margin-bottom:4px; width:100%;">
                <button class="mpBtn" data-tid="like">❤️</button>
                <button class="mpBtn" data-tid="queue">📄</button>
            </div>

            <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap; margin-bottom:4px; width:100%;">
                <button class="mpBtn" id="toggleAdBlock">${adBlockEnabled ? "🚫 Ads ON" : "🚫 Ads OFF"}</button>
            </div>

            <div style="font-size:10px; color:#888; text-align:center; margin-top:2px;">by ._.clownz_</div>
        `;

        document.body.appendChild(box);

        document.querySelectorAll(".mpBtn").forEach(btn => {
            Object.assign(btn.style, {
                padding: "5px",
                fontSize: "14px",
                background: "transparent",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.15s"
            });
            btn.onmouseenter = () => btn.style.color = "#1DB954";
            btn.onmouseleave = () => btn.style.color = "white";
        });

        makeDraggable(box);
        attachControls();
        startUpdates();

        if (adBlockEnabled) startAdBlock();
    }

    function makeDraggable(el) {
        let active = false, startX, startY;
        el.addEventListener("mousedown", e => {
            if (e.target.tagName === "BUTTON") return;
            active = true;
            startX = e.clientX - el.offsetLeft;
            startY = e.clientY - el.offsetTop;
        });
        document.addEventListener("mousemove", e => {
            if (!active) return;
            el.style.left = e.clientX - startX + "px";
            el.style.top = e.clientY - startY + "px";
        });
        document.addEventListener("mouseup", () => active = false);
    }

    function clickButton(tid, selectors) {
        if (!cached[tid]) cached[tid] = selectors.map(s => document.querySelector(s)).filter(Boolean)[0];
        if (cached[tid]) cached[tid].click();
    }

    function clickPlayPause() { clickButton("play", ['[data-testid="control-button-playpause"]','button[aria-label="Play"]','button[aria-label="Pause"]']); }
    function clickShuffle() { clickButton("shuffle", ['[data-testid="control-button-shuffle"]']); }
    function clickSkipBack() { clickButton("skip-back", ['[data-testid="control-button-skip-back"]']); }
    function clickSkipForward() { clickButton("skip-forward", ['[data-testid="control-button-skip-forward"]']); }
    function clickRepeat() { clickButton("repeat", ['[data-testid="control-button-repeat"]']); }
    function clickLike() { clickButton("like", ['[data-testid="add-button"]']); }
    function clickQueue() { clickButton("queue", ['[data-testid="control-button-queue"]']); }

    function attachControls() {
        document.querySelectorAll(".mpBtn").forEach(btn => {
            const tid = btn.getAttribute("data-tid");
            if (!tid) return;
            btn.onclick = () => {
                switch (tid) {
                    case "play-pause": clickPlayPause(); break;
                    case "shuffle": clickShuffle(); break;
                    case "skip-back": clickSkipBack(); break;
                    case "skip-forward": clickSkipForward(); break;
                    case "repeat": clickRepeat(); break;
                    case "like": clickLike(); break;
                    case "queue": clickQueue(); break;
                }
            };
        });

        const toggleBtn = document.getElementById("toggleAdBlock");
        toggleBtn.onclick = () => {
            adBlockEnabled = !adBlockEnabled;
            localStorage.setItem("spMiniAdBlock", adBlockEnabled);
            toggleBtn.textContent = adBlockEnabled ? "🚫 Ads ON" : "🚫 Ads OFF";
            if (adBlockEnabled) startAdBlock(); else stopAdBlock();
        };
    }

    function startUpdates() {
        function update() {
            const coverEl = document.querySelector('[data-testid="now-playing-widget"] img');
            const titleEl = document.querySelector('[data-testid="context-item-info-title"]');
            const artistEl = document.querySelector('[data-testid="context-item-info-subtitle"]');

            if (titleEl) {
                const currentTrack = titleEl.innerText + ' - ' + (artistEl ? artistEl.innerText : '');
                if (currentTrack !== lastTrackId) {
                    lastTrackId = currentTrack;

                    // Better quality image
                    let coverUrl = coverEl ? coverEl.src : "";
                    if (coverUrl) {
                        coverUrl = coverUrl.replace(/\/\d+x\d+bb\.jpg$/, "/640x640bb.jpg");
                        document.getElementById("mpCover").src = coverUrl;
                    }

                    document.getElementById("mpTitle").innerText = titleEl.innerText;
                    if (artistEl) document.getElementById("mpArtist").innerText = artistEl.innerText;
                }
            }

            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const removeElements = selector => document.querySelectorAll(selector).forEach(el => el.remove());
    const handleAudioAds = () => {
        const audioAd = document.querySelector('audio[src*="spotify.com/ad"]');
        if (audioAd) {
            audioAd.src = "";
            audioAd.pause();
        }
    };

    function startAdBlock() {
        adObserver = new MutationObserver(() => {
            removeElements('[data-testid="ad-slot-container"], [class*="ad-"]');
            handleAudioAds();
        });
        adObserver.observe(document.body, { childList: true, subtree: true });

        adInterval = setInterval(() => {
            removeElements('[data-testid="ad-slot-container"], [class*="ad-"]');
            handleAudioAds();
        }, 1000);
    }

    function stopAdBlock() {
        if (adObserver) adObserver.disconnect();
        if (adInterval) clearInterval(adInterval);
    }

    waitFor('[data-testid="now-playing-widget"]', () => createMiniPlayer());
})();
