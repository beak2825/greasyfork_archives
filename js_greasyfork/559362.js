// ==UserScript==
// @name        Stremio Addon Manager
// @version     1.6.0
// @description Reorganize, rename, and manage Stremio addons directly from the web client.
// @author      Zcc09
// @match       https://web.stremio.com/*
// @match       https://web.strem.io/*
// @match       https://app.strem.io/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @license     MIT
// @namespace https://greasyfork.org/users/1439319
// @downloadURL https://update.greasyfork.org/scripts/559362/Stremio%20Addon%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/559362/Stremio%20Addon%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONFIG ---
    const STREMIO_API_BASE = "https://api.strem.io/api/";
    const DEFAULT_LOGO_URL = "https://www.stremio.com/website/stremio-logo-small.png";
    const CUSTOM_CONFIG_KEY = "stremio-addon-manager-custom-config";
    const AUTH_KEY_STORAGE = "stremio-addon-manager-auth-key";

    // --- STATE ---
    let stremioAuthKey = null;
    let addons = [];
    let draggingElement = null;

    // --- STYLES ---
    function addStyles() {
        const style = document.createElement("style");
        style.textContent = `
            :root { --theme-purple: #7b5bf5; --theme-green: #22b365; --theme-dark-bg: #1e1e1e; --theme-light-bg: #2a2a2a; --theme-border: #444; --theme-text: white; --theme-danger: #c62828; --theme-danger-hover: #b71c1c; }

            #addon-manager-btn { display: none; position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 12px 20px; background-color: var(--theme-purple); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.4); transition: opacity 0.3s; }
            #addon-manager-btn:hover { background-color: #6145b8; }

            .sam-modal { display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.8); }
            .sam-modal-content { background-color: var(--theme-dark-bg); color: var(--theme-text); margin: 5vh auto; width: 90%; max-width: 600px; border-radius: 8px; border-top: 4px solid var(--theme-purple); display: flex; flex-direction: column; max-height: 90vh; }

            .sam-header { padding: 15px 20px; border-bottom: 1px solid var(--theme-border); display: flex; justify-content: space-between; align-items: center; }
            .sam-header h2 { margin: 0; color: var(--theme-purple); }
            .sam-close { font-size: 28px; cursor: pointer; color: #aaa; }

            .sam-body { padding: 20px; overflow-y: auto; flex-grow: 1; }
            .sam-footer { padding: 15px 20px; background-color: var(--theme-light-bg); text-align: right; border-top: 1px solid var(--theme-border); border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }

            /* Login Form */
            .sam-login-form { display: flex; flex-direction: column; gap: 15px; max-width: 300px; margin: 0 auto; text-align: center; }
            .sam-login-desc { color: #ccc; margin-bottom: 10px; font-size: 0.9em; }

            /* Lists */
            .sam-addon-list { list-style: none; padding: 0; margin: 0; }
            .sam-addon-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background-color: #2c2c2c; border-radius: 4px; cursor: grab; border: 1px solid transparent; }
            .sam-addon-item:hover { background-color: #333; }
            .sam-addon-item.dragging { opacity: 0.5; border: 1px dashed var(--theme-purple); }

            .sam-addon-left { display: flex; align-items: center; gap: 10px; overflow: hidden; }
            .sam-addon-logo { width: 32px; height: 32px; object-fit: contain; background: #000; border-radius: 4px; }
            .sam-addon-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }

            .sam-addon-actions { display: flex; gap: 5px; flex-shrink: 0; }

            .sam-btn { padding: 6px 10px; border: none; border-radius: 4px; cursor: pointer; color: white; font-size: 12px; font-weight: bold; }
            .sam-btn-primary { background-color: var(--theme-purple); }
            .sam-btn-danger { background-color: var(--theme-danger); }
            .sam-btn-secondary { background-color: #555; }
            .sam-btn:disabled { opacity: 0.3; cursor: default; }

            .sam-input { width: 100%; padding: 10px; margin-bottom: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px; box-sizing: border-box; }
            .sam-label { display: block; margin-bottom: 5px; font-size: 0.9em; color: #ccc; }

            .sam-catalog-row { border: 1px solid var(--theme-border); padding: 10px; margin-bottom: 10px; border-radius: 4px; }
            .sam-badge { background: #555; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 5px; vertical-align: middle; }
            .sam-badge.search { background: #d38f18; color: black; }
        `;
        document.head.appendChild(style);
    }

    // --- AUTH UTILS ---
    function listenForAuthKey() {
        window.addEventListener("message", (event) => {
            if (event.source !== window) return;
            if (event.data && event.data.type === "FROM_STREMIO_PAGE" && event.data.authKey) {
                console.log("Stremio Addon Manager: Auth key detected from page.");
                stremioAuthKey = event.data.authKey;
                GM_setValue(AUTH_KEY_STORAGE, stremioAuthKey); // Cache it
            }
        });
    }

    function triggerAuthKeyRetrieval() {
        const existing = document.getElementById("sam-auth-injector");
        if (existing) existing.remove();

        const script = document.createElement('script');
        script.id = "sam-auth-injector";
        script.textContent = `
            try {
                const profileStr = localStorage.getItem("profile");
                if (profileStr) {
                    const profile = JSON.parse(profileStr);
                    if (profile && profile.auth && profile.auth.key) {
                        window.postMessage({ type: "FROM_STREMIO_PAGE", authKey: profile.auth.key }, "*");
                    }
                }
            } catch (e) {}
        `;
        (document.head || document.documentElement).appendChild(script);
        setTimeout(() => { if(script.parentNode) script.remove(); }, 1000);
    }

    async function loginWithCredentials(email, password) {
        try {
            const resp = await fetch(`${STREMIO_API_BASE}login`, {
                method: "POST",
                body: JSON.stringify({ type: "Login", email, password, facebook: false })
            });
            const data = await resp.json();

            if (data.result && data.result.authKey) {
                stremioAuthKey = data.result.authKey;
                GM_setValue(AUTH_KEY_STORAGE, stremioAuthKey);
                return true;
            } else {
                alert("Login failed: " + (data.result?.error || "Unknown error"));
                return false;
            }
        } catch (e) {
            alert("Network error: " + e.message);
            return false;
        }
    }

    function logout() {
        if(confirm("Log out of Addon Manager script?")) {
            stremioAuthKey = null;
            GM_setValue(AUTH_KEY_STORAGE, null);
            renderLoginView();
        }
    }

    // --- LOGIC ---
    async function fetchOriginalManifest(url) {
        try {
            const manifestUrl = url.endsWith('/manifest.json') ? url : `${url.replace(/\/$/, "")}/manifest.json`;
            const resp = await fetch(manifestUrl);
            if (!resp.ok) throw new Error(`Status ${resp.status}`);
            const data = await resp.json();
            return data.manifest || data;
        } catch (e) {
            console.warn(`Could not fetch original manifest for ${url}`, e);
            return null;
        }
    }

    async function loadAddons() {
        // 1. Try Cached Key
        if (!stremioAuthKey) {
            stremioAuthKey = GM_getValue(AUTH_KEY_STORAGE, null);
        }

        // 2. Try Page Injection (Wait briefly)
        if (!stremioAuthKey) {
            triggerAuthKeyRetrieval();
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // 3. Fallback: Manual Login
        if (!stremioAuthKey) {
            renderLoginView();
            return;
        }

        // If we have a key, load list
        const container = document.getElementById("sam-list-container");
        container.innerHTML = "Loading addons...";
        // Show normal footer
        document.getElementById("sam-footer-main").style.display = "block";
        document.getElementById("sam-footer-login").style.display = "none";

        try {
            const resp = await fetch(`${STREMIO_API_BASE}addonCollectionGet`, {
                method: "POST",
                body: JSON.stringify({ type: "AddonCollectionGet", authKey: stremioAuthKey, update: true })
            });
            const data = await resp.json();

            if (data.error || (data.result && data.result.error)) {
                // If error is related to auth, clear key and ask for login
                if (JSON.stringify(data).toLowerCase().includes("auth")) {
                    GM_setValue(AUTH_KEY_STORAGE, null);
                    stremioAuthKey = null;
                    renderLoginView();
                    return;
                }
                throw new Error("API Error: " + (data.error || data.result.error));
            }

            if (!data.result || !data.result.addons) throw new Error("Failed to fetch addons.");

            const remoteAddons = data.result.addons;
            const customConfig = GM_getValue(CUSTOM_CONFIG_KEY, {});

            addons = [];

            for (const addon of remoteAddons) {
                const baseManifest = await fetchOriginalManifest(addon.transportUrl) || addon.manifest;

                const workingManifest = JSON.parse(JSON.stringify(baseManifest));
                const savedConfig = customConfig[addon.transportUrl];

                if (savedConfig) {
                    if (savedConfig.name) workingManifest.name = savedConfig.name;
                    if (savedConfig.description) workingManifest.description = savedConfig.description;
                    if (savedConfig.logo) workingManifest.logo = savedConfig.logo;
                    if (savedConfig.background) workingManifest.background = savedConfig.background;

                    if (workingManifest.catalogs && savedConfig.catalogs) {
                        workingManifest.catalogs.forEach(baseCat => {
                            const savedCat = savedConfig.catalogs.find(c => c.id === baseCat.id && c.type === baseCat.type);
                            if (savedCat) {
                                baseCat.name = savedCat.name;
                                baseCat.hidden = savedCat.hidden;
                            }
                        });
                    }
                }

                const processedAddon = {
                    transportUrl: addon.transportUrl,
                    flags: addon.flags || {},
                    manifest: workingManifest
                };

                addons.push(processedAddon);
            }

            renderAddonList();

        } catch (error) {
            container.innerHTML = `<div style="color:var(--theme-danger); padding:10px;">Error: ${error.message}</div>`;
            console.error(error);
        }
    }

    async function syncToStremio() {
        const btn = document.getElementById("sam-sync-btn");
        btn.textContent = "Syncing...";
        btn.disabled = true;

        try {
            const addonsToSync = JSON.parse(JSON.stringify(addons));

            addonsToSync.forEach(addon => {
                if (addon.manifest.catalogs) {
                    addon.manifest.catalogs = addon.manifest.catalogs.filter(c => !c.hidden);
                }
            });

            const resp = await fetch(`${STREMIO_API_BASE}addonCollectionSet`, {
                method: "POST",
                body: JSON.stringify({
                    type: "AddonCollectionSet",
                    authKey: stremioAuthKey,
                    addons: addonsToSync
                })
            });
            const data = await resp.json();

            if (data.result && data.result.success) {
                alert("Synced successfully! Refresh the page to see changes.");
                location.reload();
            } else {
                throw new Error(data.result?.error || "Unknown error");
            }

        } catch (e) {
            alert("Sync failed: " + e.message);
        } finally {
            btn.textContent = "Sync to Stremio";
            btn.disabled = false;
        }
    }

    async function saveLocalConfig(transportUrl, newManifest) {
        const customConfig = GM_getValue(CUSTOM_CONFIG_KEY, {});

        const configEntry = {
            name: newManifest.name,
            description: newManifest.description,
            logo: newManifest.logo,
            background: newManifest.background,
            catalogs: newManifest.catalogs ? newManifest.catalogs.map(c => ({
                id: c.id,
                type: c.type,
                name: c.name,
                hidden: !!c.hidden
            })) : []
        };

        customConfig[transportUrl] = configEntry;
        GM_setValue(CUSTOM_CONFIG_KEY, customConfig);
    }

    // --- UI RENDERERS ---

    function renderLoginView() {
        const container = document.getElementById("sam-list-container");
        document.getElementById("sam-footer-main").style.display = "none"; // Hide main footer
        document.getElementById("sam-footer-login").style.display = "block"; // Show login footer placeholder if needed, mostly empty

        container.innerHTML = `
            <div class="sam-login-form">
                <p class="sam-login-desc">Could not auto-detect login. Please log in to Stremio manually to manage your addons.</p>
                <input type="email" id="sam-email" class="sam-input" placeholder="Email">
                <input type="password" id="sam-password" class="sam-input" placeholder="Password">
                <button id="sam-login-submit" class="sam-btn sam-btn-primary" style="padding:10px; font-size:14px;">Log In</button>
            </div>
        `;

        document.getElementById("sam-login-submit").onclick = async () => {
            const email = document.getElementById("sam-email").value;
            const pass = document.getElementById("sam-password").value;
            if(!email || !pass) return alert("Please fill in fields");

            document.getElementById("sam-login-submit").textContent = "Logging in...";
            const success = await loginWithCredentials(email, pass);
            if(success) {
                loadAddons();
            } else {
                document.getElementById("sam-login-submit").textContent = "Log In";
            }
        };
    }

    function renderAddonList() {
        const container = document.getElementById("sam-list-container");
        container.innerHTML = "";
        const ul = document.createElement("ul");
        ul.className = "sam-addon-list";

        addons.forEach((addon, index) => {
            const li = document.createElement("li");
            li.className = "sam-addon-item";
            li.draggable = true;
            li.dataset.index = index;

            const logo = addon.manifest.logo || DEFAULT_LOGO_URL;

            li.innerHTML = `
                <div class="sam-addon-left">
                    <img src="${logo}" class="sam-addon-logo" onerror="this.src='${DEFAULT_LOGO_URL}'">
                    <span class="sam-addon-name">${addon.manifest.name}</span>
                </div>
                <div class="sam-addon-actions">
                    <button class="sam-btn sam-btn-secondary move-up-btn" title="Move Up" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="sam-btn sam-btn-secondary move-down-btn" title="Move Down" ${index === addons.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="sam-btn sam-btn-primary edit-btn">Edit</button>
                    <button class="sam-btn sam-btn-danger del-btn" ${addon.flags.protected ? "disabled" : ""}>Del</button>
                </div>
            `;

            li.addEventListener("dragstart", (e) => { draggingElement = index; li.classList.add('dragging'); });
            li.addEventListener("dragend", (e) => { li.classList.remove('dragging'); draggingElement = null; });
            li.addEventListener("dragover", (e) => { e.preventDefault(); });
            li.addEventListener("drop", (e) => handleDrop(e, index));

            li.querySelector(".move-up-btn").onclick = () => moveAddon(index, -1);
            li.querySelector(".move-down-btn").onclick = () => moveAddon(index, 1);
            li.querySelector(".edit-btn").onclick = () => openEditModal(index);
            li.querySelector(".del-btn").onclick = () => deleteAddon(index);

            ul.appendChild(li);
        });

        container.appendChild(ul);
    }

    function moveAddon(index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < addons.length) {
            [addons[index], addons[newIndex]] = [addons[newIndex], addons[index]];
            renderAddonList();
        }
    }

    function handleDrop(e, targetIndex) {
        e.preventDefault();
        if (draggingElement === null || draggingElement === targetIndex) return;
        const movedItem = addons.splice(draggingElement, 1)[0];
        addons.splice(targetIndex, 0, movedItem);
        renderAddonList();
    }

    function deleteAddon(index) {
        if (confirm(`Remove ${addons[index].manifest.name}?`)) {
            const customConfig = GM_getValue(CUSTOM_CONFIG_KEY, {});
            delete customConfig[addons[index].transportUrl];
            GM_setValue(CUSTOM_CONFIG_KEY, customConfig);
            addons.splice(index, 1);
            renderAddonList();
        }
    }

    function openEditModal(index) {
        const addon = addons[index];
        const manifest = addon.manifest;
        const modalBody = document.querySelector("#sam-modal .sam-body");

        const isSearch = c => c.id?.includes('search') || (c.extra || []).some(e => e.name === 'search');
        const catalogs = (manifest.catalogs || []).map((c, i) => ({...c, _idx: i}));
        catalogs.sort((a, b) => isSearch(a) ? -1 : isSearch(b) ? 1 : 0);

        let catalogsHtml = catalogs.map(c => `
            <div class="sam-catalog-row">
                <label class="sam-label">
                    Catalog: ${c.type}
                    ${isSearch(c) ? '<span class="sam-badge search">Search</span>' : ''}
                    <span class="sam-badge">${c.id}</span>
                </label>
                <input type="text" class="sam-input cat-name" data-idx="${c._idx}" value="${c.name || ''}" placeholder="Catalog Name">
                <select class="sam-input cat-hidden" data-idx="${c._idx}">
                    <option value="visible" ${!c.hidden ? 'selected' : ''}>Visible</option>
                    <option value="hidden" ${c.hidden ? 'selected' : ''}>Hidden</option>
                </select>
            </div>
        `).join('');

        modalBody.innerHTML = `
            <h3 style="margin-top:0; color:var(--theme-purple)">Edit ${manifest.name}</h3>
            <label class="sam-label">Name</label>
            <input type="text" id="edit-name" class="sam-input" value="${manifest.name}">

            <label class="sam-label">Description</label>
            <textarea id="edit-desc" class="sam-input" rows="2">${manifest.description || ''}</textarea>

            <details>
                <summary style="cursor:pointer; margin-bottom:10px; color:#aaa">Advanced (Logos & Backgrounds)</summary>
                <label class="sam-label">Logo URL</label>
                <input type="text" id="edit-logo" class="sam-input" value="${manifest.logo || ''}">
                <label class="sam-label">Background URL</label>
                <input type="text" id="edit-bg" class="sam-input" value="${manifest.background || ''}">
            </details>

            <h4 style="border-bottom:1px solid #444; padding-bottom:5px;">Catalogs / Lists</h4>
            <div id="catalog-editor">${catalogsHtml.length ? catalogsHtml : '<p style="color:#777">No configurable catalogs found.</p>'}</div>

            <div style="margin-top:15px; text-align:right;">
                <button id="sam-cancel-edit" class="sam-btn sam-btn-secondary">Cancel</button>
                <button id="sam-save-edit" class="sam-btn sam-btn-primary">Save Changes</button>
            </div>
        `;

        document.getElementById("sam-cancel-edit").onclick = () => renderMainView();
        document.getElementById("sam-save-edit").onclick = () => {
            manifest.name = document.getElementById("edit-name").value;
            manifest.description = document.getElementById("edit-desc").value;
            manifest.logo = document.getElementById("edit-logo").value;
            manifest.background = document.getElementById("edit-bg").value;

            const catNameInputs = document.querySelectorAll(".cat-name");
            const catHiddenInputs = document.querySelectorAll(".cat-hidden");

            catNameInputs.forEach((input, i) => {
                const realIdx = parseInt(input.dataset.idx);
                if (manifest.catalogs[realIdx]) {
                    manifest.catalogs[realIdx].name = input.value;
                    manifest.catalogs[realIdx].hidden = (catHiddenInputs[i].value === "hidden");
                }
            });

            saveLocalConfig(addon.transportUrl, manifest);
            renderMainView();
        };
    }

    function renderMainView() {
        const modalBody = document.querySelector("#sam-modal .sam-body");
        modalBody.innerHTML = `<div id="sam-list-container"></div>`;
        document.getElementById("sam-footer-main").style.display = "block";
        document.getElementById("sam-footer-login").style.display = "none";
        renderAddonList();
    }

    function createUI() {
        const btn = document.createElement("button");
        btn.id = "addon-manager-btn";
        btn.textContent = "Manage Addons";
        btn.onclick = () => {
            document.getElementById("sam-modal").style.display = "block";
            loadAddons();
        };
        document.body.appendChild(btn);

        const modal = document.createElement("div");
        modal.id = "sam-modal";
        modal.className = "sam-modal";
        modal.innerHTML = `
            <div class="sam-modal-content">
                <div class="sam-header">
                    <h2>Addon Manager</h2>
                    <span class="sam-close">&times;</span>
                </div>
                <div class="sam-body">
                    <div id="sam-list-container">Initialize...</div>
                </div>
                <div id="sam-footer-main" class="sam-footer" style="display:none;">
                    <button id="sam-logout-btn" class="sam-btn sam-btn-secondary" style="float:left">Logout</button>
                    <button id="sam-reset-all" class="sam-btn sam-btn-danger" style="margin-right:10px;">Reset Config</button>
                    <button id="sam-sync-btn" class="sam-btn sam-btn-primary">Sync to Stremio</button>
                </div>
                <div id="sam-footer-login" class="sam-footer" style="display:none; text-align:center;">
                    <span style="font-size:10px; color:#666;">Credentials are sent directly to Stremio API.</span>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector(".sam-close").onclick = () => modal.style.display = "none";
        window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

        // Footer Events
        document.getElementById("sam-sync-btn").onclick = syncToStremio;
        document.getElementById("sam-logout-btn").onclick = logout;
        document.getElementById("sam-reset-all").onclick = () => {
            if (confirm("Reset all local customizations (renames, hidden lists)?")) {
                GM_setValue(CUSTOM_CONFIG_KEY, {});
                loadAddons();
            }
        };

        // URL Check
        const checkUrl = () => {
            const hash = window.location.hash;
            const isOnAddonsPage = hash.startsWith('#/addons');
            const btn = document.getElementById('addon-manager-btn');
            if (btn) {
                btn.style.display = isOnAddonsPage ? 'block' : 'none';
            }
        };

        window.addEventListener('popstate', checkUrl);
        window.addEventListener('hashchange', checkUrl);

        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            checkUrl();
        };
        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            checkUrl();
        };

        checkUrl();
    }

    function init() {
        addStyles();
        createUI();
        listenForAuthKey();
    }

    if (document.body) init();
    else window.addEventListener("DOMContentLoaded", init);

})();