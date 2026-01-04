// ==UserScript==
// @name         YouTube Minimal Video Saver
// @namespace    https://github.com/Beyazprens/youtube-minimal-video-saver
// @version      2.1.0
// @description  Records video progress, displays aesthetic notifications within the player.
// @author       Beyazprens
// @match        https://www.youtube.com/*
// @license      MIT
// @homepageURL  https://github.com/Beyazprens/youtube-minimal-video-saver
// @supportURL   https://github.com/Beyazprens/youtube-minimal-video-saver/issues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559815/YouTube%20Minimal%20Video%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/559815/YouTube%20Minimal%20Video%20Saver.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        PREFIX: "yt_min_save_2_",
        DELETE_THRESHOLD: 0.95,
        SAVE_INTERVAL: 3000,
        MIN_DURATION: 60
    };


    let currentVideoElement = null;
    let timeUpdateListener = null;
    let lastSaveTime = 0;
    let currentVideoId = null;


    GM_addStyle(`
        /* Toast Notification */
        .yms-toast {
            position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85); border-left: 4px solid #ff0000; color: #fff;
            padding: 10px 20px; border-radius: 4px; font-family: 'Roboto', sans-serif;
            font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 10px;
            opacity: 0; pointer-events: none; z-index: 60; transition: opacity 0.6s ease-in-out;
            backdrop-filter: blur(2px); box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        .yms-toast.show { opacity: 1; }
        .yms-toast svg { fill: #ff0000; filter: drop-shadow(0 0 5px rgba(255,0,0,0.6)); }

        /* Modal UI */
        #yms-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
            font-family: 'Roboto', sans-serif; opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        #yms-modal.open { opacity: 1; pointer-events: auto; }
        .yms-window {
            width: 600px; max-height: 80vh; background: #1f1f1f;
            border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
            display: flex; flex-direction: column; overflow: hidden;
            border: 1px solid #333; transform: scale(0.95); transition: transform 0.3s ease;
        }
        #yms-modal.open .yms-window { transform: scale(1); }
        .yms-header { padding: 20px; background: #282828; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .yms-header h2 { margin: 0; font-size: 20px; color: #fff; font-weight: 500; }
        .yms-close { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
        .yms-close:hover { color: #fff; }
        .yms-list { overflow-y: auto; padding: 10px; flex-grow: 1; }
        .yms-list::-webkit-scrollbar { width: 8px; }
        .yms-list::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
        .yms-item { display: flex; gap: 15px; padding: 12px; margin-bottom: 8px; background: #2a2a2a; border-radius: 12px; transition: background 0.2s; position: relative; }
        .yms-item:hover { background: #333; }
        .yms-thumb { width: 120px; height: 68px; border-radius: 8px; object-fit: cover; background: #000; }
        .yms-info { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; }
        .yms-title { color: #fff; text-decoration: none; font-size: 14px; font-weight: 500; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .yms-meta { color: #aaa; font-size: 12px; display: flex; align-items: center; gap: 10px; }
        .yms-progress-bar { height: 4px; background: #444; border-radius: 2px; width: 100%; margin-top: 8px; overflow: hidden; }
        .yms-progress-fill { height: 100%; background: #ff0000; }
        .yms-actions { display: flex; flex-direction: column; justify-content: center; gap: 5px; }
        .yms-btn-del { background: rgba(255, 69, 58, 0.1); color: #ff453a; border: none; padding: 8px; border-radius: 8px; cursor: pointer; }
        .yms-btn-del:hover { background: rgba(255, 69, 58, 0.2); }
        .yms-footer { padding: 15px; border-top: 1px solid #333; text-align: right; background: #282828; }
        .yms-clear-btn { background: transparent; color: #aaa; border: 1px solid #444; padding: 8px 16px; border-radius: 18px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
        .yms-clear-btn:hover { border-color: #ff453a; color: #ff453a; }
        .yms-empty { text-align: center; padding: 40px; color: #666; font-style: italic; }
    `);


    window.addEventListener("yt-navigate-finish", init, false);
    init();

    function init() {
        cleanup();

        if (location.pathname.includes('/shorts/')) return;

        const params = new URLSearchParams(location.search);
        currentVideoId = params.get("v");
        if (!currentVideoId) return;

        waitForVideo().then(videoEl => {
            currentVideoElement = videoEl;

            if (videoEl.readyState >= 1) {
                restore(currentVideoId, videoEl);
            } else {
                videoEl.addEventListener('loadedmetadata', () => restore(currentVideoId, videoEl), { once: true });
            }

            timeUpdateListener = () => handleTimeUpdate(videoEl);
            videoEl.addEventListener("timeupdate", timeUpdateListener);
        });
    }

    function cleanup() {
        if (currentVideoElement && timeUpdateListener) {
            currentVideoElement.removeEventListener("timeupdate", timeUpdateListener);
            timeUpdateListener = null;
            currentVideoElement = null;
        }
    }

    function waitForVideo() {
        return new Promise(resolve => {
            const v = document.querySelector("video.html5-main-video");
            if (v) return resolve(v);
            const obs = new MutationObserver(() => {
                const v = document.querySelector("video.html5-main-video");
                if (v) {
                    obs.disconnect();
                    resolve(v);
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        });
    }

    function handleTimeUpdate(vid) {
        if (!vid.duration || !isFinite(vid.duration)) return;
        if (vid.paused) return;
        if (vid.duration < CONFIG.MIN_DURATION) return;

        const percent = vid.currentTime / vid.duration;

        if (percent > CONFIG.DELETE_THRESHOLD) {
            if (GM_getValue(CONFIG.PREFIX + currentVideoId)) {
                GM_deleteValue(CONFIG.PREFIX + currentVideoId);
            }
            return;
        }

        const now = Date.now();
        if (now - lastSaveTime > CONFIG.SAVE_INTERVAL && vid.currentTime > 5) {
            save(currentVideoId, vid.currentTime, vid.duration);
            lastSaveTime = now;
        }
    }

    function save(id, time, duration) {
        const titleEl = document.querySelector("ytd-watch-metadata h1") || document.querySelector("#title h1");
        let title = titleEl ? titleEl.innerText : document.title;

        title = title.replace(/^\(\d+\)\s+/, "").replace(" - YouTube", "");

        const data = {
            id,
            time,
            duration,
            title: title || "Unknown Video",
            thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
            date: Date.now()
        };
        GM_setValue(CONFIG.PREFIX + id, JSON.stringify(data));
    }

    function restore(id, vid) {
        const raw = GM_getValue(CONFIG.PREFIX + id);
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            if (!data.time) return;
            if (vid.duration && data.time > vid.duration * CONFIG.DELETE_THRESHOLD) {
                GM_deleteValue(CONFIG.PREFIX + id);
                return;
            }

            vid.currentTime = data.time;

            const mins = Math.floor(data.time / 60);
            const secs = String(Math.floor(data.time % 60)).padStart(2, "0");
            showToast(`Resuming at: ${mins}:${secs}`);

        } catch (e) {
            console.error("Restore error:", e);
        }
    }


    GM_registerMenuCommand("📂 Manage Saved Videos", toggleUI);

    function showToast(message) {
        const playerContainer = document.querySelector('#movie_player') || document.body;
        const old = playerContainer.querySelector('.yms-toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.className = 'yms-toast';
        toast.innerHTML = `
            <svg style="width:22px;height:22px;" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <span>${message}</span>
        `;
        playerContainer.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 600);
        }, 3500);
    }

    function toggleUI() {
        let modal = document.getElementById("yms-modal");
        if (!modal) {
            createModal();
            modal = document.getElementById("yms-modal");
        }
        if (modal.classList.contains("open")) {
            modal.classList.remove("open");
        } else {
            renderList();
            modal.classList.add("open");
        }
    }

    function createModal() {
        const modal = document.createElement("div");
        modal.id = "yms-modal";
        modal.innerHTML = `
            <div class="yms-window">
                <div class="yms-header">
                    <h2>Library</h2>
                    <button class="yms-close">✖</button>
                </div>
                <div class="yms-list"></div>
                <div class="yms-footer">
                    <button class="yms-clear-btn">Clear History</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector(".yms-close").onclick = () => modal.classList.remove("open");
        modal.onclick = (e) => { if (e.target === modal) modal.classList.remove("open"); };
        modal.querySelector(".yms-clear-btn").onclick = () => {
            if (confirm("Are you sure you want to delete all saved videos?")) {
                const keys = GM_listValues().filter(k => k.startsWith(CONFIG.PREFIX));
                keys.forEach(k => GM_deleteValue(k));
                renderList();
            }
        };
    }

    function renderList() {
        const list = document.querySelector(".yms-list");
        list.innerHTML = "";
        const keys = GM_listValues().filter(k => k.startsWith(CONFIG.PREFIX));

        if (keys.length === 0) {
            list.innerHTML = `<div class="yms-empty">List is empty.</div>`;
            return;
        }

        const items = keys.map(k => {
            try { return JSON.parse(GM_getValue(k)); } catch(e){ return null; }
        }).filter(i => i !== null).sort((a, b) => b.date - a.date);

        items.forEach(item => {
            const date = new Date(item.date).toLocaleDateString("en-US");
            const mins = Math.floor(item.time / 60);
            const secs = String(Math.floor(item.time % 60)).padStart(2, "0");
            const progressPercent = item.duration ? (item.time / item.duration) * 100 : 0;

            const row = document.createElement("div");
            row.className = "yms-item";
            row.innerHTML = `
                <img src="${item.thumbnail}" class="yms-thumb" onerror="this.style.backgroundColor='#333'">
                <div class="yms-info">
                    <a class="yms-title" href="/watch?v=${item.id}&t=${Math.floor(item.time)}s">${item.title}</a>
                    <div class="yms-meta">
                        <span>🕒 ${mins}:${secs}</span>
                        <span>📅 ${date}</span>
                    </div>
                    <div class="yms-progress-bar">
                        <div class="yms-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                <div class="yms-actions">
                    <button class="yms-btn-del">🗑️</button>
                </div>
            `;
            row.querySelector(".yms-btn-del").onclick = function() {
                GM_deleteValue(CONFIG.PREFIX + item.id);
                row.style.opacity = '0';
                setTimeout(() => renderList(), 200);
            };
            list.appendChild(row);
        });
    }

})();
