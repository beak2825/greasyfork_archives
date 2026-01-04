// ==UserScript==
// @name         Last.fm Bulk Remap Scrobbles
// @namespace    https://greasyfork.org/it/users/1554001-nikilite
// @version      1.0.0
// @description  Bulk re-scrobble multiple tracks to a different artist/track name from your library page (no Pro required, 14-day limit)
// @author       Nikilite
// @match        https://www.last.fm/user/*/library/music/*/_/*
// @match        https://www.last.fm/api?*
// @connect      ws.audioscrobbler.com
// @grant        GM.xmlHttpRequest
// @license      Apache-2.0
// @homepageURL  https://greasyfork.org/scripts/560678-last-fm-bulk-remap-scrobbles
// @supportURL   https://greasyfork.org/scripts/560678-last-fm-bulk-remap-scrobbles/feedback
// @downloadURL https://update.greasyfork.org/scripts/560678/Lastfm%20Bulk%20Remap%20Scrobbles.user.js
// @updateURL https://update.greasyfork.org/scripts/560678/Lastfm%20Bulk%20Remap%20Scrobbles.meta.js
// ==/UserScript==

(() => {
"use strict";

const API_KEY = "7bfc3993e87eb839bd1567bd2622dd56";
const DELAY_MS = 1800;
const MAX_AGE_SEC = 14 * 24 * 60 * 60;

let sessionKey = localStorage.getItem("sessionKey");

if (location.pathname === "/api" && location.search.includes("token=")) {
    handleAuthCallback();
} else if (!sessionKey) {
    authenticate();
} else {
    init();
}

function authenticate() {
    const cb = encodeURIComponent(location.href);
    location.href = `https://www.last.fm/api/auth?api_key=${API_KEY}&cb=https://www.last.fm/api?return=${cb}`;
}

function handleAuthCallback() {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const returnUrl = params.get("return");

    if (!token) return;

    document.body.innerHTML = "<h1 style='text-align:center;margin-top:50px'>Connecting...</h1>";

    const data = `api_key=${API_KEY}&method=auth.getsession&token=${token}`;
    GM.xmlHttpRequest({
        method: "GET",
        url: `https://ws.audioscrobbler.com/2.0/?${data}&api_sig=${lfmmd5(data)}&format=json`,
        onload: r => {
            try {
                const j = JSON.parse(r.responseText);
                if (j.session) {
                    localStorage.setItem("sessionKey", j.session.key);
                    localStorage.setItem("username", j.session.name);
                    document.body.innerHTML = "<h1 style='text-align:center;margin-top:50px'>Connected. Redirecting...</h1>";
                    setTimeout(() => location.href = returnUrl || "/", 1000);
                }
            } catch(e) {
                console.error(e);
            }
        }
    });
}

function init() {
    const observer = new MutationObserver(() => {
        if (document.querySelector("table.chartlist tbody tr")) {
            observer.disconnect();
            setTimeout(injectUI, 500);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (document.querySelector("table.chartlist tbody tr")) {
        setTimeout(injectUI, 500);
    }
}

function injectUI() {
    addPanel();
    addCheckboxes();
}

function addPanel() {
    if (document.querySelector("#bulk-remap-panel")) return;

    const header = document.querySelector(".library-header") ||
                   document.querySelector(".page-content h1")?.parentElement ||
                   document.querySelector(".page-content");
    if (!header) return;

    const panel = document.createElement("div");
    panel.id = "bulk-remap-panel";
    panel.innerHTML = `
        <div style="background:#232323;border:1px solid #333;border-radius:3px;padding:12px;margin:12px 0;">
            <div style="margin-bottom:8px;color:#b3b3b3;font-size:13px;font-weight:bold;">Bulk Remap</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                <input type="text" id="new-artist" placeholder="New Artist"
                       style="padding:6px 8px;border-radius:3px;border:1px solid #444;background:#2a2a2a;color:#fff;width:180px;font-size:13px;">
                <input type="text" id="new-track" placeholder="New Track"
                       style="padding:6px 8px;border-radius:3px;border:1px solid #444;background:#2a2a2a;color:#fff;width:220px;font-size:13px;">
                <button id="bulk-remap-btn"
                        style="padding:6px 14px;background:#ba0000;color:#fff;border:none;border-radius:3px;cursor:pointer;font-size:13px;">
                    Remap Selected
                </button>
            </div>
            <div id="bulk-status" style="margin-top:8px;color:#888;font-size:11px;"></div>
        </div>
    `;
    header.insertAdjacentElement("afterend", panel);

    document.getElementById("bulk-remap-btn").onclick = bulkRemap;
}

function addCheckboxes() {
    const rows = document.querySelectorAll("table.chartlist tbody tr");
    rows.forEach(tr => {
        if (tr.querySelector(".bulk-cb")) return;

        const firstTd = tr.querySelector("td");
        if (!firstTd) return;

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "bulk-cb";
        cb.style.cssText = "margin-right:8px;cursor:pointer;";

        const ts = getTimestampFromRow(tr);
        if (ts && (Date.now()/1000 - ts > MAX_AGE_SEC)) {
            cb.disabled = true;
            cb.title = "Scrobble older than 14 days";
            cb.style.opacity = "0.3";
        }

        firstTd.insertBefore(cb, firstTd.firstChild);
    });
}

function updateStatus(msg) {
    const status = document.getElementById("bulk-status");
    if (status) status.textContent = msg || "";
}

function getTimestampFromRow(tr) {
    const input = tr.querySelector('input[name="timestamp"]');
    if (input) return parseInt(input.value);

    const time = tr.querySelector("time[datetime]");
    if (time) return Math.floor(new Date(time.getAttribute("datetime")).getTime() / 1000);

    const dataTs = tr.getAttribute("data-timestamp") || tr.dataset.timestamp;
    if (dataTs) return parseInt(dataTs);

    const timeCell = tr.querySelector("td:last-child");
    if (timeCell) {
        const text = timeCell.textContent.trim().toLowerCase();
        const now = Date.now() / 1000;

        if (text.includes("minute")) {
            const m = parseInt(text) || 1;
            return Math.floor(now - m * 60);
        }
        if (text.includes("hour")) {
            const h = parseInt(text) || 1;
            return Math.floor(now - h * 3600);
        }
        if (text.includes("day")) {
            const d = parseInt(text) || 1;
            return Math.floor(now - d * 86400);
        }
    }

    return null;
}

async function bulkRemap() {
    const newArtist = document.getElementById("new-artist").value.trim();
    const newTrack = document.getElementById("new-track").value.trim();

    if (!newArtist || !newTrack) {
        alert("Enter both artist and track.");
        return;
    }

    const selectedRows = [...document.querySelectorAll(".bulk-cb:checked")].map(cb => cb.closest("tr"));

    if (selectedRows.length === 0) {
        alert("Select at least one scrobble.");
        return;
    }

    if (!confirm(`Remap ${selectedRows.length} scrobble(s) to:\n${newArtist} - ${newTrack}?`)) {
        return;
    }

    const btn = document.getElementById("bulk-remap-btn");
    btn.disabled = true;
    btn.style.opacity = "0.5";

    let success = 0, failed = 0;

    for (let i = 0; i < selectedRows.length; i++) {
        const tr = selectedRows[i];
        const ts = getTimestampFromRow(tr);

        updateStatus(`Processing ${i+1}/${selectedRows.length}...`);

        if (!ts || (Date.now()/1000 - ts > MAX_AGE_SEC)) {
            failed++;
            continue;
        }

        try {
            const scrobbled = await scrobble(newArtist, newTrack, ts);
            if (!scrobbled) { failed++; continue; }

            await sleep(DELAY_MS);

            deleteScrobbleRow(tr);

            await sleep(DELAY_MS);
            success++;

        } catch(e) {
            console.error(e);
            failed++;
        }
    }

    updateStatus(`Done. ${success} success, ${failed} failed.`);
    btn.disabled = false;
    btn.style.opacity = "1";

    if (success > 0) {
        setTimeout(() => location.reload(), 2000);
    }
}

function scrobble(artist, track, ts) {
    return new Promise(resolve => {
        const params = [
            `api_key=${API_KEY}`,
            `artist=${encodeURIComponent(artist)}`,
            `method=track.scrobble`,
            `sk=${sessionKey}`,
            `timestamp=${ts}`,
            `track=${encodeURIComponent(track)}`
        ];
        const data = params.join("&");
        const sig = lfmmd5(data);

        GM.xmlHttpRequest({
            method: "POST",
            url: "https://ws.audioscrobbler.com/2.0/",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            data: data + "&api_sig=" + sig,
            onload: r => {
                resolve(r.responseText.includes('status="ok"'));
            },
            onerror: () => resolve(false)
        });
    });
}

function deleteScrobbleRow(tr) {
    const moreBtn = tr.querySelector(".chartlist-more-button, .more-button, [data-toggle-button]");
    if (moreBtn) moreBtn.click();

    setTimeout(() => {
        const deleteBtn = tr.querySelector('.more-item--delete, [data-analytics-label="Delete scrobble"], button[type="submit"]');
        if (deleteBtn) deleteBtn.click();
    }, 200);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function lfmmd5(f) {
    for(var k=[],i=0;64>i;)k[i]=0|4294967296*Math.sin(++i%Math.PI);
    var c,d,e,h=[c=1732584193,d=4023233417,~c,~d],g=[],
    b=decodeURIComponent(unescape(f=f.split("&").sort().join("").replace(/=/g,"")+
    atob("ZmY4MmMzNTkzZWI3Zjg5OGMzMjhjZmIwN2JiNjk2ZWM=")))+"\u0080",a=b.length;
    f=--a/4+2|15;for(g[--f]=8*a;~a;)g[a>>2]|=b.charCodeAt(a)<<8*a--;
    for(i=b=0;i<f;i+=16){for(a=h;64>b;a=[e=a[3],
    c+((e=a[0]+[c&d|~c&e,e&c|~e&d,c^d^e,d^(c|~e)][a=b>>4]+k[b]+~~g[i|[b,5*b+1,3*b+5,7*b][a]&15])
    <<(a=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][4*a+b++%4])|e>>>-a),c,d])
    c=a[1]|0,d=a[2];for(b=4;b;)h[--b]+=a[b]}
    for(f="";32>b;)f+=(h[b>>3]>>4*(1^b++)&15).toString(16);
    return f;
}

})();