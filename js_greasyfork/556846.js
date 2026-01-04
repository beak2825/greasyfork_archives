// ==UserScript==
// @name         X/Twitter Mass Blocker (v8.1 - Custom Page Crawler)
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  Crawls index.html, page2.html, page3.html... until 404. Syncs & Blocks.
// @author       Haolong
// @match        https://x.com/*
// @match        https://twitter.com/*
// @connect      pluto0x0.github.io
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556846/XTwitter%20Mass%20Blocker%20%28v81%20-%20Custom%20Page%20Crawler%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556846/XTwitter%20Mass%20Blocker%20%28v81%20-%20Custom%20Page%20Crawler%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const BASE_URL = "https://pluto0x0.github.io/X_based_china/";
    const BEARER_TOKEN = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
    const COOLDOWN_TIME = 180000; // 3 minutes pause on 429 error

    // --- State ---
    let isPaused = false;
    let activeThreads = 0;
    let successCount = 0;
    let todoList = [];
    let concurrency = 2;
    let existingBlocks = new Set();
    let stopSignal = false;

    // --- UI Construction ---
    function createUI() {
        if (document.getElementById("xb-panel")) return;
        const panel = document.createElement('div');
        panel.id = "xb-panel";
        Object.assign(panel.style, {
            position: "fixed", bottom: "20px", left: "20px", zIndex: "99999",
            background: "rgba(10, 10, 10, 0.98)", color: "#e7e9ea", padding: "16px",
            borderRadius: "12px", width: "340px", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            border: "1px solid #333", boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
        });
        
        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <span style="font-weight:800;color:#f91880;font-size:14px;">Mass Blocker v8.1</span>
                <span id="xb-threads-disp" style="font-size:10px;background:#333;padding:2px 6px;borderRadius:4px;">Threads: 2</span>
            </div>

            <div style="margin-bottom:12px;">
                <input type="range" id="xb-speed" min="1" max="5" value="2" style="width:100%;accent-color:#f91880;">
            </div>

            <div id="xb-log" style="height:130px;overflow-y:auto;background:#000;border:1px solid #333;padding:8px;font-size:11px;color:#888;margin-bottom:12px;border-radius:4px;font-family:monospace;white-space:pre-wrap;">Ready.</div>

            <div style="background:#333;height:6px;width:100%;margin-bottom:12px;border-radius:3px;overflow:hidden;">
                <div id="xb-bar" style="background:#f91880;height:100%;width:0%;transition:width 0.3s ease;"></div>
            </div>
            
            <div style="display:flex;gap:10px;">
                <button id="xb-btn" style="flex:1;padding:10px;background:#f91880;color:white;border:none;border-radius:20px;cursor:pointer;font-weight:bold;font-size:13px;">START</button>
                <button id="xb-stop" style="flex:0.4;padding:10px;background:#333;color:white;border:none;border-radius:20px;cursor:pointer;font-weight:bold;font-size:13px;">STOP</button>
            </div>
        `;
        document.body.appendChild(panel);
        
        document.getElementById("xb-btn").onclick = runFullProcess;
        document.getElementById("xb-stop").onclick = () => { stopSignal = true; log("🛑 Stopping...", "red"); };
        
        document.getElementById("xb-speed").oninput = (e) => {
            concurrency = parseInt(e.target.value);
            document.getElementById("xb-threads-disp").innerText = `Threads: ${concurrency}`;
        };
    }

    function log(msg, color="#888") {
        const el = document.getElementById("xb-log");
        const time = new Date().toLocaleTimeString([], {hour12:false});
        el.innerHTML = `<div style="color:${color}"><span style="opacity:0.5">[${time}]</span> ${msg}</div>` + el.innerHTML;
    }

    function updateProgress(done, total) {
        if(total < 1) return;
        const pct = Math.floor((done / total) * 100);
        document.getElementById("xb-bar").style.width = `${pct}%`;
        document.getElementById("xb-btn").innerText = `${pct}% (${done})`;
    }

    // --- Helpers ---
    function getCsrfToken() {
        const match = document.cookie.match(/(^|;\s*)ct0=([^;]*)/);
        return match ? match[2] : null;
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // --- Step 1: Sync Existing Blocks ---
    async function fetchExistingBlocks() {
        log("🔄 Syncing existing blocks from X...", "#1d9bf0");
        let cursor = -1;
        existingBlocks.clear();
        stopSignal = false;

        try {
            while (cursor !== 0 && cursor !== "0" && !stopSignal) {
                const csrf = getCsrfToken();
                if (!csrf) throw new Error("Logged out");

                const url = `https://x.com/i/api/1.1/blocks/ids.json?count=5000&cursor=${cursor}&stringify_ids=true`;
                
                const res = await fetch(url, {
                    headers: {
                        "authorization": BEARER_TOKEN,
                        "x-csrf-token": csrf,
                        "content-type": "application/json"
                    }
                });

                if (!res.ok) {
                    if(res.status === 429) {
                        log("⚠️ Sync 429. Waiting 30s...", "orange");
                        await sleep(30000);
                        continue;
                    }
                    throw new Error(`API Error ${res.status}`);
                }

                const data = await res.json();
                if (data.ids) data.ids.forEach(id => existingBlocks.add(String(id)));
                cursor = data.next_cursor_str;
                await sleep(200); 
            }
            if(stopSignal) return false;
            log(`✅ Sync Complete: ${existingBlocks.size} already blocked.`, "#00ba7c");
            return true;
        } catch (e) {
            log(`❌ Sync Error: ${e.message}`, "red");
            return false;
        }
    }

    // --- Step 2: Crawl (Corrected URL Pattern) ---
    function fetchUrlText(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (res) => {
                    if (res.status === 200) resolve(res.responseText);
                    else reject(res.status);
                },
                onerror: () => reject("Network Error")
            });
        });
    }

    async function crawlTargetList() {
        let allFoundIds = new Set();
        let page = 1;
        let keepCrawling = true;
        
        log("🕸️ Starting Crawler...", "#1d9bf0");

        while(keepCrawling && !stopSignal) {
            // URL Logic: Page 1 = index.html, Page 2 = page2.html
            let url = (page === 1) 
                ? `${BASE_URL}index.html` 
                : `${BASE_URL}page${page}.html`;
            
            document.getElementById("xb-btn").innerText = `Scan Pg ${page}`;

            try {
                const html = await fetchUrlText(url);
                
                // Extract IDs
                const matches = [...html.matchAll(/ID:\s*(\d+)/g)];
                const idsOnPage = matches.map(m => m[1]);

                if (idsOnPage.length === 0) {
                    log(`⚠️ Page ${page} loaded but no IDs found.`);
                } else {
                    idsOnPage.forEach(id => allFoundIds.add(id));
                }

                page++;
                await sleep(200); // Gentle crawl delay

            } catch (err) {
                if (err === 404) {
                    log(`✅ End of list at Page ${page-1}.`, "#00ba7c");
                    keepCrawling = false; // Stop on 404
                } else {
                    log(`❌ Crawl Error Pg ${page}: ${err}`, "red");
                    keepCrawling = false;
                }
            }
        }
        return [...allFoundIds];
    }

    // --- Main Logic ---
    async function runFullProcess() {
        const btn = document.getElementById("xb-btn");
        btn.disabled = true;
        stopSignal = false;
        
        // 1. Check Login
        if (!getCsrfToken()) {
            log("❌ Error: Logged out.", "red");
            btn.disabled = false;
            return;
        }

        // 2. Sync Blocks
        const syncSuccess = await fetchExistingBlocks();
        if (!syncSuccess) {
            btn.disabled = false;
            btn.innerText = "Retry";
            return;
        }

        // 3. Crawl Pages
        const githubIds = await crawlTargetList();
        if (!githubIds || githubIds.length === 0) {
            log("❌ No IDs found during crawl.", "red");
            btn.disabled = false;
            return;
        }

        // 4. Diffing
        todoList = githubIds.filter(id => !existingBlocks.has(id));
        const total = todoList.length;
        const blockedAlready = githubIds.length - total;

        log(`📄 Found: ${githubIds.length} total.`);
        log(`⏭️ Skipped: ${blockedAlready} (Already blocked).`);
        
        if (total === 0) {
            log("🎉 All targets are already blocked!", "#00ba7c");
            updateProgress(1,1);
            btn.disabled = false;
            btn.innerText = "Done";
            return;
        }

        log(`🎯 <b>Queued to Block: ${total}</b>`, "#f91880");
        
        // 5. Start Blocking
        startManager(total);
    }

    async function startManager(totalInitial) {
        let processedCount = 0; 

        while ((todoList.length > 0 || activeThreads > 0) && !stopSignal) {
            if (isPaused) { await sleep(1000); continue; }

            while (activeThreads < concurrency && todoList.length > 0 && !isPaused && !stopSignal) {
                const uid = todoList.shift();
                processUser(uid, totalInitial);
            }
            await sleep(200);
        }
        
        document.getElementById("xb-btn").innerText = stopSignal ? "Stopped" : "Finished";
        document.getElementById("xb-btn").disabled = false;
        if(!stopSignal) log("🏁 Job Finished.", "#00ba7c");
        alert("Batch Complete");
    }

    async function processUser(uid, totalInitial) {
        activeThreads++;
        try {
            await sleep(Math.floor(Math.random() * 500) + 300);

            const csrf = getCsrfToken();
            if(!csrf) throw new Error("Logout detected");

            const res = await fetch("https://x.com/i/api/1.1/blocks/create.json", {
                method: "POST",
                headers: {
                    "authorization": BEARER_TOKEN,
                    "x-csrf-token": csrf,
                    "content-type": "application/x-www-form-urlencoded",
                    "x-twitter-active-user": "yes",
                    "x-twitter-auth-type": "OAuth2Session"
                },
                body: `user_id=${uid}`
            });

            if (res.ok || res.status === 200 || res.status === 403 || res.status === 404) {
                successCount++;
                if (successCount % 5 === 0) log(`Blocked: ${uid}`);
            } else if (res.status === 401) {
                log(`❌ 401 Session Died. Stopping.`, "red");
                stopSignal = true; 
            } else if (res.status === 429) {
                if (!isPaused) {
                    isPaused = true;
                    log(`🛑 Rate Limit 429. Pausing 3m...`, "red");
                    setTimeout(() => { 
                        isPaused = false; 
                        log("🟢 Resuming...", "#00ba7c");
                    }, COOLDOWN_TIME);
                }
                todoList.push(uid); 
                successCount--;
            } else {
                log(`⚠️ ${res.status} on ${uid}`, "orange");
            }
        } catch (e) {
            log(`❌ Err: ${e.message}`, "red");
            if(e.message.includes("Logout")) stopSignal = true;
            else todoList.push(uid);
            successCount--;
        }

        activeThreads--;
        updateProgress(successCount, totalInitial);
    }

    setTimeout(createUI, 1500);
    GM_registerMenuCommand("Open Blocker", createUI);

})();