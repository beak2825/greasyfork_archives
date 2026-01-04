// ==UserScript==
// @name         RON Mod Sync
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  addon that are needed for the tool to work
// @author       SAMURAI
// @match        https://www.nexusmods.com/readyornot/mods/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      Custom; See description for terms.
//
// --- LICENSE TERMS ---
// 1. PERSONAL USE: You are free to use and modify this script for your own personal use.
// 2. CREDITING: If you share a modified version, you MUST keep "Original code by SAMURAI" in the header.
// 3. REDISTRIBUTION: You may NOT re-upload or repost this script to other sites (Nexus, GreasyFork, etc.)
//    without explicit permission or clear credit linking back to the original source.
// 4. ASK FIRST: For commercial use or large-scale redistribution, contact lr9a on discord.
// ------------------------------
// @downloadURL https://update.greasyfork.org/scripts/560085/RON%20Mod%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/560085/RON%20Mod%20Sync.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const panel = document.createElement('div');
    panel.style = "position:fixed; bottom:15px; right:15px; z-index:9999; background:#1a1a1a; color:#27ae60; padding:15px; border:2px solid #27ae60; border-radius:10px; font-family:Impact; text-align:center; min-width:170px; box-shadow:0 0 15px #000;";
    panel.innerHTML = `
        <div style="font-size:18px; margin-bottom:10px; letter-spacing:1px;">RON Mod Sync</div>
        <button id="add-mod" style="background:#27ae60; color:white; border:none; padding:10px; width:100%; cursor:pointer; font-weight:bold; border-radius:5px;">ADD MOD</button>
        <button id="copy-mod" style="background:#2980b9; color:white; border:none; padding:10px; width:100%; cursor:pointer; font-weight:bold; margin-top:5px; border-radius:5px;">COPY LIST</button>
        <button id="refresh-mod" style="background:#c0392b; color:white; border:none; padding:10px; width:100%; cursor:pointer; font-weight:bold; margin-top:5px; border-radius:5px;">REFRESH</button>
        <div style="font-size:11px; color:#7f8c8d; margin-top:10px; border-top:1px solid #333; padding-top:5px; font-family:Arial;">MADE BY SAMURAI</div>
    `;
    document.body.appendChild(panel);

    document.getElementById('add-mod').onclick = () => {
        let mods = JSON.parse(GM_getValue('ron_mods', '[]'));
        let cleanUrl = window.location.origin + window.location.pathname.split('?')[0].replace(/\/$/, "") + "?tab=files";

        // date capture
        let dlDate = "Never";
        const match = document.body.innerText.match(/You last downloaded a file from this mod on (\d{1,2}\s\w{3}\s\d{4})/);
        if (match && match[1]) {
            dlDate = match[1].trim();
        }

        // Remove existing entry for this URL to avoid duplicates
        mods = mods.filter(m => m.url !== cleanUrl);

        mods.push({
            name: document.title.split(' at ')[0].trim(),
            url: cleanUrl,
            last_dl: dlDate
        });

        GM_setValue('ron_mods', JSON.stringify(mods));
        alert("ADDED:\n" + dlDate);
    };

    document.getElementById('copy-mod').onclick = () => {
        navigator.clipboard.writeText(GM_getValue('ron_mods', '[]')).then(() => alert("List Copied!"));
    };
    document.getElementById('refresh-mod').onclick = () => {
        if (confirm("Refresh list?")) { GM_deleteValue('ron_mods'); alert("Reset!"); }
    };
})();