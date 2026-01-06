// ==UserScript==
// @name         GeoGuessr Avatar Customizer
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Custom avatar images for your profile. Go to the "Edit Avatar" site and at the bottom you will see a UI.
// @author       calle
// @match        https://www.geoguessr.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561524/GeoGuessr%20Avatar%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/561524/GeoGuessr%20Avatar%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let userData = {
        userId: null,
        equippedIds: [],
        equippedBadgeId: null,
        mugshotB64: null,
        avatarB64: null
    };

    const TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const TARGET_URL_PART = "/shop/avatar/";

    async function init() {
        try {
            const profileRes = await fetch("https://www.geoguessr.com/me/profile");
            const html = await profileRes.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const scriptTag = doc.getElementById("__NEXT_DATA__");

            if (!scriptTag) return;
            const json = JSON.parse(scriptTag.textContent);
            userData.userId = json.props.pageProps.userProfile.user.userId;

            const avatarRes = await fetch(`https://www.geoguessr.com/api/v4/avatar/user/${userData.userId}`);
            const avatarData = await avatarRes.json();

            userData.equippedIds = avatarData.equipped.map(i => i.id);
            userData.equippedBadgeId = avatarData.equippedBadge ? avatarData.equippedBadge.id : null;

            if (document.body) setupApp();
            else window.addEventListener('DOMContentLoaded', setupApp);
        } catch (e) { console.error("Init failed", e); }
    }

    function setupApp() {
        createUI();
        checkUrlVisibility();

        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                checkUrlVisibility();
            }
        }).observe(document, {subtree: true, childList: true});
    }

    function checkUrlVisibility() {
        const container = document.getElementById('custom-avatar-tool');
        if (!container) return;
        container.style.display = window.location.href.includes(TARGET_URL_PART) ? 'block' : 'none';
    }

    function createUI() {
        const container = document.createElement('div');
        container.id = 'custom-avatar-tool';
        container.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;background:#1a1a2e;color:white;padding:15px;border-radius:12px;border:2px solid #7950E5;width:320px;font-family:sans-serif;box-shadow: 0 -5px 25px rgba(0,0,0,0.5);text-align:center;display:none;`;

        const style = document.createElement('style');
        style.textContent = `
            .info-trigger { display: inline-block; width: 16px; height: 16px; background: #7950E5; border-radius: 50%; font-size: 11px; line-height: 16px; cursor: help; margin-left: 5px; vertical-align: middle; }
            .info-wrapper { position: relative; display: inline-block; }
            .tooltip-box { visibility: hidden; width: 220px; background-color: #2a2a40; color: #fff; text-align: left; border-radius: 6px; padding: 10px; position: absolute; z-index: 100000; bottom: 125%; left: 50%; transform: translateX(-50%); opacity: 0; transition: opacity 0.3s; font-size: 13px; border: 1px solid #7950E5; box-shadow: 0 5px 15px rgba(0,0,0,0.4); pointer-events: none; }
            .info-wrapper:hover .tooltip-box { visibility: visible; opacity: 1; }
            .tool-btn { border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: opacity 0.2s; }
            .tool-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        `;
        document.head.appendChild(style);

        container.innerHTML = `
            <div style="font-size:15px;margin-bottom:10px;opacity:0.6;letter-spacing:1px; display: flex; align-items: center; justify-content: center;">
               CUSTOM AVATAR IMAGE
                <div class="info-wrapper">
                    <span class="info-trigger">i</span>
                    <div class="tooltip-box">
                        <strong>Image Info:</strong><br>
                        • Mugshot: 840x840px (1:1)<br>
                        • Avatar: 1080x1440px (3:4)<br><br>
                        <strong>Notes:</strong><br>
                        • Images are auto-resized and cropped to fit.<br>
                        • Missing images are replaced with a transparent canvas.<br>
                        • Changing any skin, item or animation resets the custom images!<br>
                        • For the full effect turn off animations in the Settings.
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:10px;margin-bottom:10px;">
                <div style="flex:1">
                    <label style="display:block;font-size:11px;margin-bottom:4px">Mugshot <span id="check-mug"></span></label>
                    <input type="file" id="input-mug" accept="image/*" style="width:100%;font-size:10px;">
                </div>
                <div style="flex:1">
                    <label style="display:block;font-size:11px;margin-bottom:4px">Avatar <span id="check-av"></span></label>
                    <input type="file" id="input-av" accept="image/*" style="width:100%;font-size:10px;">
                </div>
            </div>
            <div id="status-msg" style="font-size:12px;margin-bottom:8px;min-height:15px;color:#bada55;font-weight:bold;"></div>
            <div style="display:flex; gap:10px;">
                <button id="clear-btn" class="tool-btn" style="flex:1; background:#444; color:white;">CLEAR</button>
                <button id="save-btn" class="tool-btn" style="flex:2; background:#7950E5; color:white;">SAVE IMAGES</button>
            </div>
        `;

        document.body.appendChild(container);

        document.getElementById('input-mug').onchange = (e) => processAndStore(e.target.files[0], 840, 840, 'mugshotB64', 'check-mug');
        document.getElementById('input-av').onchange = (e) => processAndStore(e.target.files[0], 1080, 1440, 'avatarB64', 'check-av');
        document.getElementById('save-btn').onclick = postData;
        document.getElementById('clear-btn').onclick = () => { resetUploads(); showStatus("Cleared selections"); };
    }

    function resizeImage(dataUrl, width, height) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                const scale = Math.max(width / img.width, height / img.height);
                const x = (width / 2) - (img.width / 2) * scale;
                const y = (height / 2) - (img.height / 2) * scale;
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                const finalB64 = canvas.toDataURL('image/png');
                resolve(finalB64 + md5(finalB64));
            };
            img.src = dataUrl;
        });
    }

    async function processAndStore(file, w, h, key, checkId) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            userData[key] = await resizeImage(e.target.result, w, h);
            document.getElementById(checkId).innerText = "✅";
            showStatus(`Ready: ${w}x${h}`);
        };
        reader.readAsDataURL(file);
    }

    function showStatus(text, isError = false) {
        const msg = document.getElementById('status-msg');
        if (!msg) return;
        msg.innerText = text;
        msg.style.color = isError ? "#ff4444" : "#bada55";
    }

    function resetUploads() {
        userData.mugshotB64 = null;
        userData.avatarB64 = null;
        const mugInput = document.getElementById('input-mug');
        const avInput = document.getElementById('input-av');
        if (mugInput) mugInput.value = "";
        if (avInput) avInput.value = "";
        const mugCheck = document.getElementById('check-mug');
        const avCheck = document.getElementById('check-av');
        if (mugCheck) mugCheck.innerText = "";
        if (avCheck) avCheck.innerText = "";
        setTimeout(() => { showStatus(""); }, 3000);
    }

    async function postData() {
        const btn = document.getElementById('save-btn');
        showStatus("Processing Request...");
        btn.disabled = true;

        const mugshot = userData.mugshotB64 || await resizeImage(TRANSPARENT_PIXEL, 840, 840);
        const avatar = userData.avatarB64 || await resizeImage(TRANSPARENT_PIXEL, 1080, 1440);

        const payload = {
            equippedIds: userData.equippedIds,
            mugshotPin: mugshot,
            fullBodyPin: avatar,
            equippedBadgeId: userData.equippedBadgeId
        };

        try {
            const res = await fetch("https://www.geoguessr.com/api/v4/avatar/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showStatus("Profile Updated Successfully!");
                resetUploads();
            } else {
                showStatus(`Server rejected: ${res.status}`, true);
            }
        } catch (e) {
            showStatus("Network Error", true);
        } finally {
            btn.disabled = false;
        }
    }

    init();
})();