// ==UserScript==
// @name         Kour.io Menu
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Demo version
// @author       Czelowiek
// @match        *://kour.io/*
// @match        *://*.kour.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562713/Kourio%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/562713/Kourio%20Menu.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* -------------------- STORAGE WRAPPER -------------------- */
    const LS = {
        get(key, def = null) {
            return localStorage.getItem(key) ?? def;
        },
        getBool(key) {
            return localStorage.getItem(key) === "true";
        },
        set(key, val) {
            localStorage.setItem(key, val);
        }
    };
    /* -------------------- SETTINGS -------------------- */
    const weaponAssetPaths = [
        "/StreamingAssets/awp","/StreamingAssets/usps","/StreamingAssets/deagle",
        "/StreamingAssets/uzi","/StreamingAssets/pkm","/StreamingAssets/revolver",
        "/StreamingAssets/mp5","/StreamingAssets/scar","/StreamingAssets/minigun",
        "/StreamingAssets/famas","/StreamingAssets/vector1","/StreamingAssets/vector2",
        "/StreamingAssets/vector3","/StreamingAssets/flamethrower","/StreamingAssets/kar98",
        "/StreamingAssets/m4a4","/StreamingAssets/tec9","/StreamingAssets/beretta",
        "/StreamingAssets/cz","/StreamingAssets/ak109","/StreamingAssets/p90",
        "/StreamingAssets/thompson","/StreamingAssets/ump45","/StreamingAssets/xm1014",
        "/StreamingAssets/lasergun1","/StreamingAssets/lasergun2","/StreamingAssets/grenade",
        "/StreamingAssets/knife","/StreamingAssets/butterfly", "/StreamingAssets/bayonet","/StreamingAssets/karambit"
    ];
    let menuKey  = LS.get("tm_menuKey", "p");

    let blockWeapon = LS.getBool("tm_hideWeapon");
    let blockSkins   = LS.getBool("tm_hideSkins");

    let originalFetch = null;
    let originalXHROpen = null;
    /* -------------------- MENU -------------------- */

    const menu = document.createElement("div");
    menu.id = "tmSettingsMenu";
    menu.style = `
        position: fixed;
        top: 20px;
        left: 20px;
        padding: 18px;
        background: #1e1e1e;
        color: #fff;
        border: 1px solid #444;
        width: 260px;
        display: none;
        z-index: 999999;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.35);
        font-family: Arial, sans-serif;
        opacity: 0;
        transform: scale(0.9);
        transition: opacity .2s ease, transform .2s ease;
    `;

    menu.innerHTML = `
        <h3 style="margin-top:0; text-align:center; font-size:20px;">⚙ Settings</h3>

        <label style="display:block; margin-top:15px;">Button for showing menu:
            <input id="tm_menuKey" type="text" maxlength="1"
                style="width:100%; padding:6px; margin-top:5px; border-radius:6px;
                       border:1px solid #555; background:#2a2a2a; color:#fff;">
        </label>

        <label style="display:flex; align-items:center; margin-top:15px; gap:8px;">
            <input id="tm_hideWeapon" type="checkbox" style="width:16px; height:16px;">
            <span>Hide weapon (refresh page)</span>
        </label>

        <label style="display:flex; align-items:center; margin-top:15px; gap:8px;">
            <input id="tm_hideSkins" type="checkbox" style="width:16px; height:16px;">
            <span>Hide skins (refresh page)</span>
        </label>

        <button id="tm_closeMenu"
            style="margin-top:20px; width:100%; padding:10px; border:none; border-radius:8px;
                   background:#3a7bfd; color:#fff; font-size:15px; cursor:pointer;">
            Close and save
        </button>
    `;

    document.body.appendChild(menu);

    function toggleMenu(show) {
        if (show) {
            menu.style.display = "block";
            setTimeout(() => {
                menu.style.opacity = "1";
                menu.style.transform = "scale(1)";
            }, 10);

            document.getElementById("tm_menuKey").value = menuKey;

            document.getElementById("tm_hideWeapon").checked = blockWeapon;
            document.getElementById("tm_hideSkins").checked = blockSkins;

        } else {
            menu.style.opacity = "0";
            menu.style.transform = "scale(0.9)";
            setTimeout(() => menu.style.display = "none", 200);
        }
    }

    document.getElementById("tm_closeMenu").onclick = () => {
        menuKey  = document.getElementById("tm_menuKey").value.trim().toLowerCase();

        blockWeapon = document.getElementById("tm_hideWeapon").checked;
        blockSkins   = document.getElementById("tm_hideSkins").checked;

        LS.set("tm_menuKey", menuKey);
        LS.set("tm_hideWeapon", blockWeapon);
        LS.set("tm_hideSkins", blockSkins);

        if (blockWeapon || blockSkins) {
            enableBlockers();
        }
        else {
            disableBlockers();
        }

        toggleMenu(false);
    };

    /* -------------------- HOTKEYS -------------------- */

    window.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();

        if (key === menuKey) {
            toggleMenu(menu.style.display !== "block");
            return;
        }
    });

    /* -------------------- WEAPON/SKIN BLOCKER -------------------- */

    const isWeaponAsset = (url) => {
        return weaponAssetPaths.some(path => url.includes(path));
    };
    function isSkinAsset(url) {
        return url.includes('content/stream/characters/textures');
    }
    function createCanvasBlob(width, height, fillColor) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (fillColor === 'black') {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, width, height);
            } else if (fillColor === 'transparent') {
                ctx.clearRect(0, 0, width, height);
            }

            canvas.toBlob(blob => {
                resolve(blob);
            }, 'image/png');
        });
    }
    async function handleImageRequest(url, fillType) {
        const img = new Image();
        return new Promise((resolve, reject) => {
            img.onload = () => {
                createCanvasBlob(img.width, img.height, fillType).then(blob => {
                    resolve(blob);
                });
            };
            img.onerror = reject;
            img.src = url;
        });
    }
    function enableBlockers() {
        if (!originalFetch) {
            originalFetch = window.fetch;
        }
        if (!originalXHROpen) {
            originalXHROpen = XMLHttpRequest.prototype.open;
        }
        window.fetch = function (url, options) {
            const requestUrl = typeof url === "string" ? url : url.url;
            if (blockWeapon && isWeaponAsset(requestUrl)) {
                return new Response("", { status: 200 });
            }

            if (blockSkins && isSkinAsset(requestUrl)) {
                if (!requestUrl.includes('/body/')) {
                    return handleImageRequest(requestUrl, 'transparent').then(blob => {
                        return new Response(blob, { headers: { 'Content-Type': 'image/png' } });
                    });
                }
                if (requestUrl.includes('/body/') && requestUrl.endsWith('.png')) {
                    return handleImageRequest(requestUrl, 'black').then(blob => {
                        return new Response(blob, { headers: { 'Content-Type': 'image/png' } });
                    });
                }
            }
            return originalFetch.apply(this, arguments);
        };
        XMLHttpRequest.prototype.open = function (method, url, ...args) {
            if (blockWeapon && isWeaponAsset(url)) {
                this.send = function () {
                    if (this.onload) this.onload();
                };
                return;
            }
            if (blockSkins && isSkinAsset(url)) {
                if (!url.includes('/body/')) {
                    this.send = function () {
                        if (this.onload) this.onload();
                    };
                    return;
                }
                if (url.includes('/body/') && url.endsWith('.png')) {
                    handleImageRequest(url, 'black').then(blob => {
                    });
                    this.send = function () {
                        if (this.onload) this.onload();
                    };
                    return;
                }
            }
            return originalXHROpen.apply(this, [method, url, ...args]);
        };
    }
    function disableBlockers() {
        if (originalFetch) {
            window.fetch = originalFetch;
            originalFetch = null;
        }
        if (originalXHROpen) {
            XMLHttpRequest.prototype.open = originalXHROpen;
            originalXHROpen = null;
        }
    }
    if (blockWeapon || blockSkins) {
        enableBlockers();
    }
})();