// ==UserScript==
// @name         StripRip
// @namespace    https://strips.be/
// @description  A download manager for strips.be that saves albums as .cbz files.
// @version      1.0
// @match        https://strips.be/app/
// @match        https://*.app.strips.be/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.app.strips.be
// @connect      content.app.strips.be
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://unpkg.com/lucide@latest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560953/StripRip.user.js
// @updateURL https://update.greasyfork.org/scripts/560953/StripRip.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Alleen uitvoeren als we op https://api.app.strips.be/api/accounts zijn
    if (window.location.href !== 'https://api.app.strips.be/api/accounts') return;
    function clearpage() {
        document.documentElement.innerHTML = '<div id="strips-container"></div>';
    }
    function applyStyles() {
        const s = document.createElement('style');
        s.textContent = `
            :root {
                --vp-c-brand: #f56565;
                --vp-button-brand-bg: #f56565;
                --vp-c-bg: #ffffff;
                --vp-c-bg-soft: #f6f6f7;
                --vp-c-text-1: #213547;
                --vp-c-text-2: #3c3c43;
                --standard-radius: 8px;
            }
            body {
                background: url(https://strips.be/wp-content/themes/understrap-child-1.2.0/img/strips_background.jpg);
                color: var(--vp-c-text-1);
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 10px;
            }
            #strips-container {
                max-width: 400px;
                margin: 100px auto;
                padding: 20px;
                background: var(--vp-c-bg-soft);
                border-radius: var(--standard-radius);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .VPButton {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                border: 1px solid transparent;
                font-weight: 600;
                cursor: pointer;
                border-radius: var(--standard-radius);
                padding: 0 10px;
                height: 40px;
                font-size: 14px;
            }
            .VPButton.brand {
                color: #fff;
                background-color: var(--vp-button-brand-bg);
                width: 100%;
            }
            .fake-input {
                background: var(--vp-c-bg);
                border-radius: var(--standard-radius);
                color: var(--vp-c-text-2);
                padding: 0 10px;
                height: 40px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }
            .fake-input input {
                background: transparent;
                border: none;
                outline: none;
                width: 100%;
                color: var(--vp-c-text-1);
                font-family: inherit;
            }
        `;
        document.head.appendChild(s);

        // Favicon toevoegen
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = 'https://strips.be/favicon.ico';
        document.head.appendChild(link);

        // Tabtitle instellen
        document.title = 'Strips.be - Login';
    }



    function createEmailUI() {
        const container = document.getElementById('strips-container');

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'fake-input';
        const input = document.createElement('input');
        input.type = 'email';
        input.placeholder = 'Vul je e-mailadres in';
        inputWrapper.appendChild(input);

        const button = document.createElement('button');
        button.className = 'VPButton brand';
        button.textContent = 'OK';

        button.addEventListener('click', () => {
            const email = input.value.trim();
            if (email) {
                step1(email);
                container.innerHTML = '';
                createOTPUI(email, container);
            }
        });

        container.appendChild(inputWrapper);
        container.appendChild(button);
    }

    function createOTPUI(email, container) {
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'fake-input';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '6-cijferige code';
        input.maxLength = 6;
        inputWrapper.appendChild(input);

        const button = document.createElement('button');
        button.className = 'VPButton brand';
        button.textContent = 'OK';

        button.addEventListener('click', () => {
            const code = input.value.trim();
            if (code.length === 6) step2(email, code);
        });

        container.appendChild(inputWrapper);
        container.appendChild(button);
    }

    function saveToLocalStorage(profileId, jwt) {
        const timestamp = Math.floor(Date.now() / 1000);
        localStorage.setItem('strips_timesinceJWT', timestamp);
        localStorage.setItem('strips_profileid', profileId);
        localStorage.setItem('strips_jwt', jwt);
    }

    function step1(email) {
        const url = 'https://zwvswktotnbuvulyumuf.supabase.co/auth/v1/otp?redirect_to=be.standaarduitgeverij.strips%3A%2F%2Fauth';
        const body = { email, data: {}, create_user: true, gotrue_meta_security: { captcha_token: null }, code_challenge: null, code_challenge_method: null };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dnN3a3RvdG5idXZ1bHl1bXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NjM1NzIsImV4cCI6MjAxNjIzOTU3Mn0.pRmhQrxH8tnvxMS04a1MR4OJXlmHykeHTy4ybtaP76M',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dnN3a3RvdG5idXZ1bHl1bXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NjM1NzIsImV4cCI6MjAxNjIzOTU3Mn0.pRmhQrxH8tnvxMS04a1MR4OJXlmHykeHTy4ybtaP76M',
                'x-client-info': 'supabase-dart/1.11.11'
            },
            data: JSON.stringify(body)
        });
    }

    function step2(email, token) {
        const url = 'https://zwvswktotnbuvulyumuf.supabase.co/auth/v1/verify';
        const body = { email, token, type: 'email', redirect_to: null, gotrue_meta_security: { captchaToken: null } };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dnN3a3RvdG5idXZ1bHl1bXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NjM1NzIsImV4cCI6MjAxNjIzOTU3Mn0.pRmhQrxH8tnvxMS04a1MR4OJXlmHykeHTy4ybtaP76M',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dnN3a3RvdG5idXZ1bHl1bXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA2NjM1NzIsImV4cCI6MjAxNjIzOTU3Mn0.pRmhQrxH8tnvxMS04a1MR4OJXlmHykeHTy4ybtaP76M',
                'x-client-info': 'supabase-dart/1.11.11'
            },
            data: JSON.stringify(body),
            onload: res => {
                try {
                    const json = JSON.parse(res.responseText);
                    const accessToken = json.access_token;
                    step3(accessToken);
                } catch (e) {
                    console.log('Step2 parse error:', res.responseText);
                }
            }
        });
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const deviceId = generateUUID();

    function step3(accessToken) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.app.strips.be/api/accounts/tradeSupabaseJwt',
            headers: {
                'accept-encoding': 'gzip',
                'appversion': '1.24.9',
                'authorization': 'Bearer ' + accessToken,
                'host': 'api.app.strips.be',
                'user-agent': 'Dart/3.5 (dart:io)',
                'x-device-id': deviceId,
                'x-device-os': 'android',
                'x-device-os-version': 'ANDROID',
                'x-device-type': 'PHONE'
            },
            onload: res => {
                console.log('Step3:', res.responseText);
                const json = JSON.parse(res.responseText);
                step4(json.jwt);
            }
        });
    }

    function step4(jwt) {
        const timestamp = new Date().toISOString();
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.app.strips.be/api/accounts/refreshJwt',
            headers: {
                'accept-encoding': 'gzip',
                'authorization': 'Bearer ' + jwt,
                'host': 'api.app.strips.be',
                'user-agent': 'Dart/3.5 (dart:io)',
                'x-device-id': deviceId,
                'x-timestamp': timestamp
            },
            onload: res => {
                console.log('Step4:', res.responseText);
                const json = JSON.parse(res.responseText);
                step5(json.jwt);
            }
        });
    }


    function step5(refreshedJwt) {
        const timestamp = new Date().toISOString();
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.app.strips.be/api/accounts',
            headers: {
                'accept-encoding': 'gzip',
                'authorization': 'Bearer ' + refreshedJwt,
                'host': 'api.app.strips.be',
                'user-agent': 'Dart/3.5 (dart:io)',
                'x-timestamp': timestamp
            },
            onload: res => {
                const json = JSON.parse(res.responseText);
                const profileId = json.profiles[0].id;
                saveToLocalStorage(profileId, refreshedJwt);
                step6(refreshedJwt, profileId);
            }
        });
    }

    // step6(jwt, profileId) doet saveToLocalStorage(profileId, jwt) en redirect
    function step6(jwt, profileId) {
        const timestamp = new Date().toISOString();
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://api.app.strips.be/api/accounts/profiles/${profileId}`,
            headers: {
                'accept-encoding': 'gzip',
                'authorization': 'Bearer ' + jwt,
                'content-type': 'application/json',
                'host': 'api.app.strips.be',
                'user-agent': 'Dart/3.5 (dart:io)',
                'x-timestamp': timestamp
            },
            data: JSON.stringify({ pin: null }),
            onload: res => {
                const json = JSON.parse(res.responseText);
                saveToLocalStorage(profileId, json.jwt);
                // Redirect na opslaan
                location.href = 'https://strips.be/app';
            }
        });
    }
    clearpage();
    applyStyles();
    createEmailUI();

})();

(function () {
    const target = "https://api.app.strips.be/api/series?searchText";
    if (location.href.startsWith("https://strips.be/app/")) {
        location.replace(target);
    }
})();

(function() {
    'use strict';

    let CURRENT_TOKEN = localStorage.getItem('strips_jwt');
    let PROFILE_ID = localStorage.getItem('strips_profileid');
    let LAST_REFRESH = localStorage.getItem('strips_timesinceJWT');

    // --- QUEUE SYSTEM VARIABLES ---
    // Get saved value or default to 2
    let MAX_CONCURRENT_DOWNLOADS = GM_getValue("max_downloads", 2);

    // Add option to the Violentmonkey menu to change the limit
    GM_registerMenuCommand("Set Max Concurrent Downloads", () => {
        const current = GM_getValue("max_downloads", 3);
        const newVal = prompt("How many downloads at once?", current);

        if (newVal !== null && !isNaN(newVal)) {
            const num = parseInt(newVal, 10);
            GM_setValue("max_downloads", num);
            MAX_CONCURRENT_DOWNLOADS = num; // Update live
            alert(`Limit set to ${num}. Please refresh to apply fully.`);
        }
    });
    let activeDownloads = 0;
    const downloadQueue = [];

    function processQueue() {
        if (activeDownloads >= MAX_CONCURRENT_DOWNLOADS || downloadQueue.length === 0) return;
        activeDownloads++;
        const nextTask = downloadQueue.shift();
        nextTask();
    }
    // ------------------------------

    async function initializeAuth() {
        if (!CURRENT_TOKEN) {
            window.location.href = 'https://api.app.strips.be/api/accounts';
            return;
        }
        if (!PROFILE_ID) {
            window.location.href = 'https://api.app.strips.be/api/accounts';
            return;
        }
        const tweeWekenInMs = 14 * 24 * 60 * 60 * 1000;
        if (LAST_REFRESH && (Date.now() - parseInt(LAST_REFRESH)) > tweeWekenInMs) {
            await refreshAccessToken();
        }
    }

    async function refreshAccessToken() {
        const refreshHeaders = {
            "accept-encoding": "gzip",
            "appversion": "1.24.9",
            "authorization": `Bearer ${CURRENT_TOKEN}`,
            "content-type": "application/json",
            "user-agent": "Dart/3.5 (dart:io)",
            "x-timestamp": new Date().toISOString()
        };
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `https://api.app.strips.be/api/accounts/profiles/${PROFILE_ID}`,
                headers: refreshHeaders,
                data: JSON.stringify({ "pin": null }),
                onload: (res) => {
                    if (res.status === 200 || res.status === 201) {
                        const data = JSON.parse(res.responseText);
                        if (data.jwt) {
                            CURRENT_TOKEN = data.jwt;
                            localStorage.setItem('strips_jwt', data.jwt);
                        }
                        localStorage.setItem('strips_timesinceJWT', Date.now().toString());
                        resolve(CURRENT_TOKEN);
                    } else { reject(res.status); }
                },
                onerror: (err) => reject(err)
            });
        });
    }

    async function fetchEx(url, type = "arraybuffer", retry = true) {
        const isApi = url.includes("api.app.strips.be");
        const headers = isApi ? {
            "Authorization": `Bearer ${CURRENT_TOKEN}`,
            "User-Agent": "Dart/3.5 (dart:io)",
            "appversion": "1.24.9",
            "x-timestamp": new Date().toISOString(),
            "Accept": "application/json"
        } : {};
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: type,
                headers: headers,
                onload: async (res) => {
                    if (res.status === 401 && retry && isApi) {
                        await refreshAccessToken();
                        resolve(await fetchEx(url, type, false));
                    } else if (res.status >= 200 && res.status < 300) {
                        resolve(res.response);
                    } else { reject(res.status); }
                },
                onerror: (err) => reject("Network Error")
            });
        });
    }

    function createIcon(name, size = 18) {
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', name);
        icon.style.width = `${size}px`;
        icon.style.height = `${size}px`;
        return icon;
    }

    function refreshIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    async function AuthWrapper(renderFunc) {
        await initializeAuth();
        if (document.getElementById('strips-container')) { renderFunc(); return; }

        document.documentElement.innerHTML = `
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
            </head>
            <body>
                <div id="loader-wrapper">
                    <i data-lucide="loader-pinwheel" id="main-loader"></i>
                    <div id="loader-text">Laden.</div>
                </div>
            </body>`;
        injectStyles();
        refreshIcons();

        let dots = 1;
        const dotInterval = setInterval(() => {
            const el = document.getElementById('loader-text');
            if (el) {
                dots = (dots % 3) + 1;
                el.textContent = `Laden${'.'.repeat(dots)}`;
            } else {
                clearInterval(dotInterval);
            }
        }, 500);

        try {
            const jsonText = await fetchEx(location.href, "text");
            clearInterval(dotInterval);
            document.body.innerHTML = `<div id="strips-container"><pre id="raw-data" style="display:none;">${jsonText}</pre></div>`;
            createAdminButtons();
            renderFunc();
        } catch (e) {
            clearInterval(dotInterval);
            document.body.innerHTML = `<div style="color:#f56565;padding:1rem;text-align:center;">Fout bij laden: ${e}.</div>`;
        }
    }

    function AllPage() {
        document.title = "Strips.be - Zoeken";
        injectStyles();
        const raw = document.getElementById('raw-data');
        let data; try { data = JSON.parse(raw.textContent); if (data.data) data = data.data; } catch(e) { return; }

        const bar = document.createElement('div');
        bar.className = 'action-bar';

        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'fake-input';
        const search = document.createElement('input');
        search.placeholder = 'Zoeken...';
        searchWrapper.append(createIcon('search', 16), search);

        const nieuwBtn = document.createElement('button');
        nieuwBtn.className = 'VPButton medium brand nav-btn-logic';
        nieuwBtn.innerHTML = `<span>Nieuw</span>`;
        nieuwBtn.prepend(createIcon('sparkles', 16));
        nieuwBtn.onclick = () => location.href = 'https://api.app.strips.be/api/albums/categories';

        bar.append(searchWrapper, nieuwBtn);
        const listContainer = document.createElement('div');
        listContainer.className = 'list-container';

        function render(q = '') {
            listContainer.innerHTML = '';
            const items = data.series || data.items || [];
            items.filter(s => s.name?.toLowerCase().includes(q.toLowerCase())).forEach(s => {
                const div = document.createElement('div');
                div.className = 'list-item';
                div.innerHTML = `<span class="item-title">${s.name}</span>`;
                div.append(createIcon('chevron-right', 18));
                div.onclick = () => {
                    const b64 = btoa(unescape(encodeURIComponent(s.name)));
                    location.href = `https://api.app.strips.be/api/series/${s.id}?seriesTitle=${b64}`;
                };
                listContainer.appendChild(div);
            });
            refreshIcons();
        }
        search.oninput = (e) => render(e.target.value);
        const root = document.getElementById('strips-container');
        root.innerHTML = ''; root.append(bar, listContainer);
        render(); search.focus();
    }

    function createAlbumItem(name, albumId) {
        const row = document.createElement('div');
        row.className = 'list-item-album';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'album-title-text';
        titleSpan.textContent = name;

        const actionArea = document.createElement('div');
        actionArea.className = 'item-action-area';

        const divider = document.createElement('div');
        divider.className = 'item-divider';

        const btn = document.createElement('div');
        btn.className = 'square-download-btn cbz-btn-logic';
        btn.append(createIcon('download', 20));
        btn.onclick = (e) => {
            e.stopPropagation();
            return processAlbumDownload(`https://api.app.strips.be/api/albums/${albumId}/content`, name, btn);
        };

        actionArea.append(divider, btn);
        row.append(titleSpan, actionArea);
        return row;
    }

    function CategoriesPage() {
        document.title = "Strips.be - Nieuw";
        injectStyles();
        const raw = document.getElementById('raw-data');
        let data; try { data = JSON.parse(raw.textContent); } catch(e) { return; }
        const root = document.getElementById('strips-container');
        root.innerHTML = '';

        const bar = document.createElement('div');
        bar.className = 'action-bar';
        const backBtn = document.createElement('button');
        backBtn.className = 'VPButton medium brand';
        backBtn.style.flex = "1";
        backBtn.innerHTML = `<span>Terug naar zoeken</span>`;
        backBtn.prepend(createIcon('arrow-left', 16));
        backBtn.onclick = () => location.href = 'https://api.app.strips.be/api/series?searchText';
        bar.appendChild(backBtn);
        root.appendChild(bar);

        data.categories.filter(cat => ["Nieuwe albums", "Nieuwe reeksen"].includes(cat.name)).forEach(cat => {
            const section = document.createElement('div');
            const headerContainer = document.createElement('div');
            headerContainer.className = 'category-header';
            headerContainer.innerHTML = `<h2>${cat.name}</h2>`;

            const list = document.createElement('div');
            if (cat.name === "Nieuwe albums") {
                const dlAllCat = document.createElement('button');
                dlAllCat.className = 'VPButton medium brand nested-btn';
                dlAllCat.style.height = '32px';
                dlAllCat.innerHTML = `<span>Alles</span>`;
                dlAllCat.prepend(createIcon('download-cloud', 14));
                dlAllCat.onclick = async () => {
                    const btns = Array.from(list.querySelectorAll('.cbz-btn-logic'));
                    dlAllCat.disabled = true;
                    const promises = btns.map(b => !b.getAttribute('disabled') ? b.onclick(new MouseEvent('click')) : Promise.resolve());
                    await Promise.all(promises);
                    dlAllCat.disabled = false;
                };
                headerContainer.appendChild(dlAllCat);
            }
            section.appendChild(headerContainer);
            cat.categoryItems.forEach(item => {
                if (item.type === "ALBUM" && item.album) {
                    const seq = String(item.album.sequence || 0).padStart(2, '0');
                    const albumName = `${item.album.series.name} - ${seq} - ${item.album.title}`;
                    list.appendChild(createAlbumItem(albumName, item.album.id));
                } else if (item.type === "SERIES" && item.series) {
                    const row = document.createElement('div');
                    row.className = 'list-item';
                    row.style.cursor = 'pointer';
                    row.innerHTML = `<span class="item-title">${item.series.name}</span>`;
                    row.append(createIcon('chevron-right', 18));
                    row.onclick = () => {
                        const b64 = btoa(unescape(encodeURIComponent(item.series.name)));
                        location.href = `https://api.app.strips.be/api/series/${item.series.id}?seriesTitle=${b64}`;
                    };
                    list.appendChild(row);
                }
            });
            section.appendChild(list);
            root.appendChild(section);
        });
        refreshIcons();
    }

    function SeriesPage() {
        const raw = document.getElementById('raw-data');
        let data; try { data = JSON.parse(raw.textContent); } catch(e){return;}
        const params = new URLSearchParams(location.search);
        let title = ''; try { title = decodeURIComponent(escape(atob(params.get('seriesTitle')))); } catch(e){}
        document.title = `Strips.be - ${title}`;
        injectStyles();
        const root = document.getElementById('strips-container');
        root.innerHTML = '';

        const bar = document.createElement('div');
        bar.className = 'action-bar';

        const backBtn = document.createElement('button');
        backBtn.className = 'VPButton medium brand back-btn-icon';
        backBtn.append(createIcon('arrow-left', 20));
        backBtn.onclick = () => location.href = 'https://api.app.strips.be/api/series?searchText';

        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'fake-input';
        const search = document.createElement('input');
        search.placeholder = 'Zoeken...';
        searchWrapper.append(createIcon('search', 16), search);

        const dlAll = document.createElement('button');
        dlAll.className = 'VPButton medium brand';
        dlAll.innerHTML = '<span>Alles</span>';
        dlAll.prepend(createIcon('download-cloud', 16));

        bar.append(backBtn, searchWrapper, dlAll);
        const listContainer = document.createElement('div');
        const albums = (data.albums || []).sort((a,b) => (a.sequence||0) - (b.sequence||0));

        function render(q = '') {
            listContainer.innerHTML = '';
            albums.filter(a => a.title?.toLowerCase().includes(q.toLowerCase())).forEach(a => {
                const name = `${title} - ${String(a.sequence||0).padStart(2,'0')} - ${a.title}`;
                listContainer.appendChild(createAlbumItem(name, a.id));
            });
            refreshIcons();
        }
        dlAll.onclick = async () => {
            const btns = Array.from(listContainer.querySelectorAll('.cbz-btn-logic'));
            dlAll.disabled = true;
            const promises = btns.map(b => !b.getAttribute('disabled') ? b.onclick(new MouseEvent('click')) : Promise.resolve());
            await Promise.all(promises);
            dlAll.disabled = false;
        };
        search.oninput = (e) => render(e.target.value);
        root.append(bar, listContainer);
        render(); search.focus();
    }

    async function processAlbumDownload(url, filename, btn) {
        if (btn.getAttribute('disabled')) return;
        const original = btn.innerHTML;
        btn.setAttribute('disabled', 'true');
        btn.style.opacity = '0.7';

        btn.innerHTML = '<span><i data-lucide="loader-2" class="spinning-icon" style="width:18px"></i></span>';
        refreshIcons();

        return new Promise((resolveOuter) => {
            const performDownload = async () => {
                try {
                    const content = JSON.parse(await fetchEx(url, "text"));
                    const [base, query] = content.uri.split('?');
                    const playbook = JSON.parse(await fetchEx(`${base}/playbook-classic.json?${query}`, "text"));
                    const imgs = (playbook.logicalBooks?.[0]?.assets?.images || playbook.assets?.images || []).sort((a,b) => a.path.localeCompare(b.path, undefined, {numeric:true}));
                    const zipData = {};
                    const total = imgs.length;

                    for(let i=0; i<total; i++) {
                        btn.innerHTML = `<span style="font-size:10px; font-weight:bold;">${i+1}/${total}</span>`;
                        let buf = await fetchEx(`${base}/${imgs[i].path}?${query}`, "arraybuffer");
                        let finalData = new Uint8Array(buf);

                        // --- CROP LOGIC START ---
                        if (i === 0 || i === total - 1) {
                            try {
                                const blob = new Blob([buf]);
                                const bmp = await createImageBitmap(blob);
                                if (bmp.width > bmp.height) { // If Landscape
                                    const canvas = document.createElement('canvas');
                                    canvas.width = bmp.width / 2;
                                    canvas.height = bmp.height;
                                    const ctx = canvas.getContext('2d');

                                    if (i === 0) {
                                        // First image: Cut Left (Keep Right)
                                        // drawImage(source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                                        ctx.drawImage(bmp, bmp.width / 2, 0, bmp.width / 2, bmp.height, 0, 0, canvas.width, canvas.height);
                                    } else {
                                        // Last image: Cut Right (Keep Left)
                                        ctx.drawImage(bmp, 0, 0, bmp.width / 2, bmp.height, 0, 0, canvas.width, canvas.height);
                                    }

                                    const processedBlob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.95));
                                    finalData = new Uint8Array(await processedBlob.arrayBuffer());
                                }
                            } catch (err) {
                                console.warn("Crop failed for image index " + i, err);
                                // Fallback: just use original buffer if crop fails
                            }
                        }
                        // --- CROP LOGIC END ---

                        zipData[imgs[i].path.split('/').pop()] = [finalData, { level: 0 }];
                    }

                    btn.innerHTML = '<span><i data-lucide="package" style="width:18px"></i></span>';
                    refreshIcons();

                    fflate.zip(zipData, (err, data) => {
                        saveAs(new Blob([data]), `${filename.replace(/[<>:"/\\|?*]/g, '')}.cbz`);

                        btn.innerHTML = '';
                        btn.append(createIcon('check', 20));
                        btn.querySelector('i').style.color = '#48bb78';
                        refreshIcons();

                        setTimeout(() => {
                            btn.innerHTML = original;
                            btn.removeAttribute('disabled');
                            btn.style.opacity = '1';
                            refreshIcons();
                        }, 1500);

                        activeDownloads--;
                        processQueue();
                        resolveOuter();
                    });
                } catch(e) {
                    btn.innerHTML = '';
                    btn.append(createIcon('circle-x', 20));
                    btn.querySelector('i').style.color = '#f56565';
                    refreshIcons();

                    setTimeout(() => {
                        btn.innerHTML = original;
                        btn.removeAttribute('disabled');
                        btn.style.opacity = '1';
                        refreshIcons();
                    }, 1500);

                    activeDownloads--;
                    processQueue();
                    resolveOuter();
                }
            };

            downloadQueue.push(performDownload);
            processQueue();
        });
    }

    function createAdminButtons() {
        const container = document.createElement('div');
        container.className = 'admin-pill-container';

        const refreshBtn = document.createElement('div');
        refreshBtn.className = 'admin-pill-btn';
        refreshBtn.innerHTML = `
            <i data-lucide="rotate-ccw-key" class="admin-icon"></i>
            <span class="admin-label">Refresh account</span>
        `;
        refreshBtn.onclick = async () => { try { await refreshAccessToken(); alert("Account Ververst!"); } catch(e) { alert("Fout bij verversen."); } };

        const divider = document.createElement('div');
        divider.className = 'admin-pill-divider';

        const resetBtn = document.createElement('div');
        resetBtn.className = 'admin-pill-btn';
        resetBtn.innerHTML = `
            <i data-lucide="log-out" class="admin-icon"></i>
            <span class="admin-label">Logout</span>
        `;
        resetBtn.onclick = () => { if(confirm("Alle data wissen en resetten?")) { localStorage.clear(); location.reload(); } };

        container.append(refreshBtn, divider, resetBtn);
        document.body.appendChild(container);
        refreshIcons();
    }

    if (location.href.includes('/api/series?searchText')) AuthWrapper(AllPage);
    else if (location.href.includes('/api/albums/categories')) AuthWrapper(CategoriesPage);
    else if (location.href.match(/\/api\/series\/[a-z0-9-]+/)) AuthWrapper(SeriesPage);

    function injectStyles() {
        if (document.getElementById('strips-styles')) return;
        const s = document.createElement('style');
        s.id = 'strips-styles';
        s.textContent = `
            :root {
                --vp-c-brand: #f56565;
                --vp-button-brand-bg: #f56565;
                --vp-c-bg: #ffffff;
                --vp-c-bg-soft: #f6f6f7;
                --vp-c-text-1: #213547;
                --vp-c-text-2: #3c3c43;
                --standard-radius: 8px;
            }

            body {
                background-color: var(--vp-c-bg); color: var(--vp-c-text-1);
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                margin: 0; padding: 10px; -webkit-font-smoothing: antialiased;
            }

            #loader-wrapper {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                background: var(--vp-c-bg); z-index: 10000;
            }
            #main-loader { width: 48px; height: 48px; color: var(--vp-c-brand); animation: spin 1.5s linear infinite; margin-bottom: 10px; }
            #loader-text { font-size: 14px; font-weight: 600; color: var(--vp-c-text-2); width: 60px; text-align: center; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

            .spinning-icon { animation: spin 1s linear infinite; }

            #strips-container { max-width: 800px; margin: 0 auto; padding-bottom: 80px; }

            .VPButton {
                display: inline-flex; align-items: center; justify-content: center;
                gap: 10px; border: 1px solid transparent; font-weight: 600;
                white-space: nowrap; cursor: pointer; transition: background-color .25s;
                border-radius: var(--standard-radius); padding: 0 10px;
            }
            .VPButton.brand { color: #fff; background-color: var(--vp-button-brand-bg); }
            .VPButton.medium { height: 40px; font-size: 14px; }

            .fake-input {
                background: var(--vp-c-bg-soft); border-radius: var(--standard-radius);
                color: var(--vp-c-text-2); padding: 0 10px; height: 40px;
                font-size: 14px; display: flex; align-items: center; gap: 10px; flex: 1;
            }
            .fake-input input { background: transparent; border: none; outline: none; width: 100%; color: var(--vp-c-text-1); font-family: inherit; }

            .action-bar { display: flex; gap: 10px; margin-bottom: 10px; }

            .list-item, .list-item-album {
                background: var(--vp-c-bg-soft); margin-bottom: 10px;
                border-radius: var(--standard-radius);
                display: flex; justify-content: space-between; align-items: center; overflow: hidden;
            }
            .list-item { padding: 10px; cursor: pointer; }
            .list-item-album { padding-left: 12px; height: 50px; }

            .item-title, .album-title-text { flex: 1; font-weight: 500; font-size: 15px; line-height: 1.4; }

            .item-action-area { display: flex; align-items: center; height: 100%; flex-shrink: 0; }
            .item-divider { width: 1px; height: 24px; background-color: rgba(60, 60, 67, 0.15);}

            .square-download-btn {
                width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; color: var(--vp-c-text-2); transition: background-color 0.2s;
                text-align: center;
            }
            .square-download-btn:hover { background-color: rgba(0,0,0,0.05); }

            h2 { font-size: 18px; font-weight: 600; margin: 0; }
            .category-header {
                display: flex; justify-content: space-between; align-items: center;
                margin: 24px 0 12px 0; padding-bottom: 10px; border-bottom: 2px solid var(--vp-c-bg-soft);
            }

            .admin-pill-container {
                position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                display: flex; align-items: center; background-color: #f6f6f7;
                border-radius: var(--standard-radius); padding: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 9999;
            }
            .admin-pill-btn {
                display: flex; align-items: center; gap: 10px; padding: 10px;
                cursor: pointer; color: #3c3c43; font-size: 12px; font-weight: 600; transition: opacity 0.2s;
            }
            .admin-pill-btn:hover { opacity: 0.7; }
            .admin-pill-divider { width: 1px; height: 20px; background-color: rgba(60, 60, 67, 0.2); }
            .admin-icon { width: 16px; height: 16px; }

            @media (max-width: 600px) {
                body { padding: 10px; }
                .action-bar .VPButton.medium span { display: none; }
                .action-bar .VPButton.medium { padding: 0; width: 40px; }
                .admin-label { display: none; }
                .category-header h2 { font-size: 16px; }
                .album-title-text { font-size: 13px; }
                .list-item-album { height: 44px; }
                .square-download-btn { width: 50px; height: 44px; }
            }
        `;
        document.head.appendChild(s);
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = 'https://strips.be/favicon.ico';
        document.head.appendChild(favicon);
    }
})();

