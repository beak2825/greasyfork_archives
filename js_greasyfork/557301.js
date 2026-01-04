// ==UserScript==
// @name         Monster-Siren 音樂下載器
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  自動取得專輯名稱 + 曲名 + sourceUrl，支援 SSR 與 API 動態載入
// @match        https://monster-siren.hypergryph.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557301/Monster-Siren%20%E9%9F%B3%E6%A8%82%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557301/Monster-Siren%20%E9%9F%B3%E6%A8%82%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastAudioURL = null;
    let lastTitle = "未知曲名";
    let lastAlbumCid = null;
    let albumMap = {};  // albumCid → albumName

    const BTN_ID = "msr-download-btn";

    //---------------------------------------------------
    // ① SSR 掃描（直接進入歌曲頁或專輯頁）
    //---------------------------------------------------
    function scanInitialHTML() {
        const html = document.documentElement.innerHTML;

        // 抓取歌曲
        const musicUrlMatch = html.match(/"sourceUrl"\s*:\s*"([^"]+)"/);
        const musicNameMatch = html.match(/"name"\s*:\s*"([^"]+)"/);
        const albumCidMatch = html.match(/"albumCid"\s*:\s*"([^"]+)"/);

        if (musicUrlMatch) lastAudioURL = musicUrlMatch[1];
        if (musicNameMatch) lastTitle = musicNameMatch[1];
        if (albumCidMatch) lastAlbumCid = albumCidMatch[1];

        // 抓專輯（name + cid）
        const albumNameMatch = html.match(/"name"\s*:\s*"([^"]+OST[^"]*)"/); // OST 專輯通常含此字
        const albumCid2Match = html.match(/"cid"\s*:\s*"(\d+)"/);

        if (albumNameMatch && albumCid2Match) {
            albumMap[albumCid2Match[1]] = albumNameMatch[1];
        }

        ensureButton();
    }

    scanInitialHTML();


    //---------------------------------------------------
    // ② 注入原生 script 攔截所有 fetch / XHR
    //---------------------------------------------------
    const injected = `
        (function() {
            const origFetch = window.fetch;
            window.fetch = async function(...args) {
                const response = await origFetch.apply(this, args);
                try {
                    const cloned = response.clone();
                    cloned.json().then(j => {
                        if (j?.data) {
                            // 曲目資訊
                            if (j.data.sourceUrl) {
                                window.postMessage({
                                    type: "MSR_TRACK",
                                    url: j.data.sourceUrl,
                                    title: j.data.name,
                                    albumCid: j.data.albumCid
                                }, "*");
                            }
                            // 專輯資訊
                            if (j.data.coverUrl && j.data.name && j.data.cid) {
                                window.postMessage({
                                    type: "MSR_ALBUM",
                                    albumCid: j.data.cid,
                                    albumName: j.data.name
                                }, "*");
                            }
                        }
                    });
                } catch(e) {}
                return response;
            };

            const origSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(...args) {
                this.addEventListener("load", () => {
                    try {
                        const j = JSON.parse(this.responseText);
                        if (j?.data) {
                            if (j.data.sourceUrl) {
                                window.postMessage({
                                    type: "MSR_TRACK",
                                    url: j.data.sourceUrl,
                                    title: j.data.name,
                                    albumCid: j.data.albumCid
                                }, "*");
                            }
                            if (j.data.coverUrl && j.data.name && j.data.cid) {
                                window.postMessage({
                                    type: "MSR_ALBUM",
                                    albumCid: j.data.cid,
                                    albumName: j.data.name
                                }, "*");
                            }
                        }
                    } catch(e) {}
                });
                return origSend.apply(this, args);
            };
        })();
    `;

    const s = document.createElement("script");
    s.textContent = injected;
    document.documentElement.appendChild(s);
    s.remove();


    //---------------------------------------------------
    // ③ 接收 TRACK + ALBUM 並組合
    //---------------------------------------------------
    window.addEventListener("message", e => {
        const d = e.data;

        if (d?.type === "MSR_TRACK") {
            lastAudioURL = d.url;
            lastTitle = d.title;
            lastAlbumCid = d.albumCid;
            updateButtonText();
            ensureButton();
        }

        if (d?.type === "MSR_ALBUM") {
            albumMap[d.albumCid] = d.albumName;
            updateButtonText();
            ensureButton();
        }
    });


    //---------------------------------------------------
    // ④ 顯示下載按鈕（只有抓到音樂才顯示）
    //---------------------------------------------------
    function ensureButton() {
        if (!document.body) return;
        if (!lastAudioURL) return;

        let btn = document.getElementById(BTN_ID);
        if (!btn) {
            btn = document.createElement("button");
            btn.id = BTN_ID;
            btn.onclick = download;

            Object.assign(btn.style, {
                position: "fixed",
                right: "20px",
                bottom: "20px",
                zIndex: "999999",
                padding: "12px 18px",
                background: "#ff7e20",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
            });

            document.body.appendChild(btn);
        }

        updateButtonText();
    }

    setInterval(ensureButton, 500);


    //---------------------------------------------------
    // ⑤ 更新按鈕顯示文字（專輯 + 曲名）
    //---------------------------------------------------
    function updateButtonText() {
        const btn = document.getElementById(BTN_ID);
        if (!btn || !lastAudioURL) return;

        const albumName = lastAlbumCid && albumMap[lastAlbumCid]
            ? `【${albumMap[lastAlbumCid]}】`
            : "";

        btn.innerText = `下載「${albumName}${lastTitle}」`;
    }


    //---------------------------------------------------
    // ⑥ Blob 強制下載，不跳轉
    //---------------------------------------------------
    async function download() {
        if (!lastAudioURL) {
            alert("尚未偵測到音樂連結！");
            return;
        }

        const ext = lastAudioURL.split(".").pop().split("?")[0] || "wav";
        const albumName =
            lastAlbumCid && albumMap[lastAlbumCid]
                ? `【${albumMap[lastAlbumCid]}】`
                : "";

        const filename = `${albumName}${lastTitle}.${ext}`;

        try {
            const res = await fetch(lastAudioURL);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            URL.revokeObjectURL(url);

        } catch (e) {
            alert("下載失敗：" + e);
            console.error(e);
        }
    }

})();
