// ==UserScript==
// @name         GGN Enhanced Gallery with API & Sorting
// @version      2.2.0
// @namespace    https://github.com/midniteryder
// @match        https://gazellegames.net/torrents.php
// @match        https://gazellegames.net/torrents.php?*
// @exclude      /[?&](id|groupid)=/
// @exclude      /[?&]action=(notify|delete_notify)/
// @exclude      /[?&]type=(seeding|uploaded|leeching|snatched|snatched_not_seeding|extlink|downloaded|hitnrun|viewseed)/
// @description  Enhanced gallery view with cover art, sorting, adjustable columns, and hover preview
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @author       MidniteRyder
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/556742/GGN%20Enhanced%20Gallery%20with%20API%20%20Sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/556742/GGN%20Enhanced%20Gallery%20with%20API%20%20Sorting.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // Configuration with defaults
    const config = {
        async get(key, defaultValue) {
            return await GM.getValue(key, defaultValue);
        },
        async set(key, value) {
            return await GM.setValue(key, value);
        }
    };

    // Load saved settings
    const settings = {
        apikey: await config.get('ggn_apikey', ''),
        enabled: await config.get('ggn_enabled', false),
        columns: await config.get('ggn_columns', 6),
        sortBy: await config.get('ggn_sort_by', 'relevance'),
        sortDirection: await config.get('ggn_sort_direction', 'desc')
    };

    // CSS Styles
    const styles = `
        .gallery-hidden {
            display: none !important;
        }

        /* Control Panel - Match GGN's native styling */
        #ggn-controls {
            background: rgba(20, 30, 40, 0.15);
            padding: 12px 15px;
            margin: 0 0 10px 0;
            border: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
            font-family: Helvetica, Arial, sans-serif;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }

        .ggn-control-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .ggn-control-group label {
            color: #cccccc;
            font-weight: 600;
            font-size: 13px;
            margin-right: 5px;
            line-height: 1.4;
            display: inline-flex;
            align-items: center;
        }

        .ggn-btn {
            padding: 7px 14px;
            border: 1px solid #555;
            border-radius: 3px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
            font-size: 12px;
            background: #2d2d2d;
            color: #e0e0e0;
            font-family: Helvetica, Arial, sans-serif;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
        }

        .ggn-btn:hover {
            background: #3d3d3d;
            border-color: #666;
        }

        .ggn-btn-active {
            background: #4a9eff !important;
            border-color: #4a9eff !important;
            color: #ffffff !important;
        }

        .ggn-btn-warning {
            background: #d9534f !important;
            border-color: #d9534f !important;
            color: #ffffff !important;
        }

        .ggn-btn-warning:hover {
            background: #c9302c !important;
            border-color: #c9302c !important;
        }

        .ggn-btn-success {
            background: #2d2d2d !important;
            border-color: #555 !important;
            color: #5cb85c !important;
            font-size: 16px;
        }

        .ggn-btn-success:hover {
            background: #3d3d3d !important;
            border-color: #666 !important;
        }

        .ggn-status-light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
            margin-left: 10px;
            box-shadow: 0 0 8px currentColor;
            vertical-align: middle;
            position: relative;
            top: -1px;
        }

        .ggn-status-light-green {
            background: #5cb85c;
            color: #5cb85c;
            box-shadow: 0 0 8px #5cb85c, inset 0 0 4px rgba(255,255,255,0.5);
        }

        .ggn-status-light-red {
            background: #d9534f;
            color: #d9534f;
            box-shadow: 0 0 8px #d9534f, inset 0 0 4px rgba(255,255,255,0.5);
        }

        .ggn-select {
            padding: 6px 10px;
            border: 1px solid #555;
            border-radius: 3px;
            background: #2d2d2d;
            color: #e0e0e0;
            font-size: 12px;
            cursor: pointer;
            font-family: Helvetica, Arial, sans-serif;
            min-width: 140px;
            line-height: 1.4;
            height: 30px;
        }

        .ggn-select:hover {
            border-color: #666;
        }

        .ggn-select:focus {
            outline: none;
            border-color: #4a9eff;
        }

        .ggn-input {
            padding: 6px 10px;
            border: 1px solid #555;
            border-radius: 3px;
            background: #2d2d2d;
            color: #e0e0e0;
            font-size: 12px;
            width: 50px;
            text-align: center;
            font-family: Helvetica, Arial, sans-serif;
            line-height: 1.4;
            height: 30px;
            box-sizing: border-box;
        }

        .ggn-input:focus {
            outline: none;
            border-color: #4a9eff;
        }

        /* Gallery Container */
        #gallery-container {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 20px;
            padding: 20px;
            max-width: 100%;
        }

        gallery-item {
            width: 100%;
            position: relative;
            cursor: pointer;
            max-width: 400px;
            margin: 0 auto;
        }

        .gallery-item-link {
            display: block;
            text-decoration: none;
            background: #2a2a2a;
            border-radius: 4px;
            overflow: hidden;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
            border: 1px solid #3a3a3a;
        }

        .gallery-item-link:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.7);
            border-color: #4a9eff;
        }

        .gallery-item-image-container {
            position: relative;
            width: 100%;
            overflow: hidden;
        }

        .gallery-item-image {
            width: 100%;
            height: auto;
            display: block;
            aspect-ratio: 3/4;
            object-fit: cover;
        }

        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }

        .lazy.lazy-loaded {
            opacity: 1;
        }

        .blur-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
            filter: blur(10px);
            z-index: 1;
        }

        .blur-image.lazy-loaded {
            display: none;
        }

        .gallery-item-title {
            padding: 10px;
            text-align: center;
            color: #e0e0e0;
            font-weight: 600;
            font-size: 13px;
            line-height: 1.3;
            min-height: 40px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-family: Helvetica, Arial, sans-serif;
        }

        /* Hover Cover Display */
        #cover_container {
            position: fixed;
            right: 20px;
            top: 80px;
            z-index: 999999;
            display: none;
            pointer-events: none;
        }

        #cover_container > img {
            max-width: 350px;
            max-height: 500px;
            border: 3px solid #4a9eff;
            border-radius: 4px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
        }

        /* Loading Indicator */
        .ggn-loading {
            text-align: center;
            padding: 40px;
            color: #cccccc;
            font-size: 16px;
            font-family: Helvetica, Arial, sans-serif;
        }

        .ggn-loading::after {
            content: '...';
            animation: ellipsis 1.5s infinite;
        }

        @keyframes ellipsis {
            0% { content: '.'; }
            33% { content: '..'; }
            66% { content: '...'; }
        }

        /* API Key Input Modal */
        #ggn-api-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999999;
        }

        #ggn-api-modal-content {
            background: #2a2a2a;
            padding: 30px;
            border-radius: 4px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
            max-width: 500px;
            width: 90%;
            border: 1px solid #3a3a3a;
        }

        #ggn-api-modal h3 {
            color: #e0e0e0;
            margin-top: 0;
            margin-bottom: 15px;
            font-family: Helvetica, Arial, sans-serif;
        }

        #ggn-api-modal p {
            color: #b0b0b0;
            margin-bottom: 15px;
            line-height: 1.6;
            font-size: 13px;
            font-family: Helvetica, Arial, sans-serif;
        }

        #ggn-api-modal a {
            color: #4a9eff;
            text-decoration: none;
        }

        #ggn-api-modal a:hover {
            text-decoration: underline;
        }

        #ggn-api-modal input {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #555;
            border-radius: 3px;
            background: #1a1a1a;
            color: #e0e0e0;
            font-size: 13px;
            box-sizing: border-box;
            font-family: Helvetica, Arial, sans-serif;
        }

        #ggn-api-modal input:focus {
            outline: none;
            border-color: #4a9eff;
        }

        #ggn-api-modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        #ggn-api-modal .ggn-btn {
            padding: 8px 16px;
            font-size: 13px;
        }
    `;

    // Add styles to page
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Create hover cover container
    const coverContainer = document.createElement('div');
    coverContainer.id = 'cover_container';
    document.body.appendChild(coverContainer);

    // API Key Input Modal
    const showAPIKeyModal = () => {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.id = 'ggn-api-modal';
            modal.innerHTML = `
                <div id="ggn-api-modal-content">
                    <h3>🎮 GGN Gallery Setup</h3>
                    <p><strong>Step 1:</strong> Go to your <a href="https://gazellegames.net/user.php?action=edit" target="_blank">Profile → Access Settings</a></p>
                    <p><strong>Step 2:</strong> Find "API Keys" section</p>
                    <p><strong>Step 3:</strong> Create a new API key (no special permissions needed)</p>
                    <p><strong>Step 4:</strong> Copy and paste it below:</p>
                    <input type="text" id="ggn-api-input" placeholder="Paste your API key here..." value="${settings.apikey || ''}">
                    <div id="ggn-api-modal-buttons">
                        <button class="ggn-btn" id="ggn-api-cancel">Cancel</button>
                        <button class="ggn-btn ggn-btn-active" id="ggn-api-ok">Save & Enable Gallery</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            const input = modal.querySelector('#ggn-api-input');
            const okBtn = modal.querySelector('#ggn-api-ok');
            const cancelBtn = modal.querySelector('#ggn-api-cancel');

            setTimeout(() => input.focus(), 100);

            okBtn.addEventListener('click', async () => {
                const key = input.value.trim();
                if (key.length > 6) {
                    await config.set('ggn_apikey', key);
                    settings.apikey = key;
                    modal.remove();
                    resolve(true);
                } else {
                    alert('Please enter a valid API Key (at least 7 characters)');
                }
            });

            cancelBtn.addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    okBtn.click();
                }
            });
        });
    };

    // API Handler
    class API {
        constructor(apiKey) {
            this.apiKey = apiKey;
        }

        async search(searchString) {
            return new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: `https://gazellegames.net/api.php?request=search&search_type=torrents${searchString ? '&' + searchString : ''}`,
                    headers: {
                        'X-API-Key': this.apiKey
                    },
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const regex = /\s*['"](\d+)['"]\s*:/g;
                                const modifiedString = response.responseText.replace(regex, (match, digits) => {
                                    return match.replace(digits, `key${digits}`);
                                });

                                const apiResult = JSON.parse(modifiedString)?.response;
                                const groupData = this.mapGroups(apiResult);
                                resolve(groupData);
                            } catch (error) {
                                reject(error);
                            }
                        } else if (response.status === 401) {
                            alert('❌ Unauthorized API Key.\n\nYour API key is invalid or expired. Please enter a new one.');
                            config.set('ggn_apikey', '');
                            settings.apikey = '';
                            reject(new Error('Unauthorized'));
                        } else {
                            reject(new Error(`API Error: ${response.status}`));
                        }
                    },
                    onerror: (error) => reject(error)
                });
            });
        }

        mapGroups(objects) {
            return Object.values(objects).flatMap((obj) => {
                if (obj.ID !== undefined) {
                    return {
                        id: obj.ID,
                        name: this.unescapeHTML(obj.Name),
                        year: obj.Year,
                        image: (obj.WikiImage ?? '') || `${window.location.origin}/static/common/noartwork/games.png`,
                        platform: obj.Artists?.[0]?.name,
                        category: obj.categoryid
                    };
                }
                return [];
            });
        }

        unescapeHTML(escapedString) {
            return new DOMParser().parseFromString(escapedString, 'text/html').documentElement.textContent;
        }
    }

    // Gallery Item Custom Element
    class GalleryItem extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.render();
        }

        render() {
            const groupName = this.getAttribute('groupName');
            const groupId = this.getAttribute('groupId');
            const image = this.getAttribute('image');
            const year = this.getAttribute('groupYear');

            const link = `torrents.php?id=${groupId}`;

            this.innerHTML = `
                <a href="${link}" class="gallery-item-link" data-group-id="${groupId}">
                    <div class="gallery-item-image-container">
                        <div class="blur-image"></div>
                        <img class="gallery-item-image lazy" data-src="${image}" alt="${groupName}">
                    </div>
                    <div class="gallery-item-title">${groupName}${year ? ` (${year})` : ''}</div>
                </a>
            `;

            const img = this.querySelector('.gallery-item-image');
            const blur = this.querySelector('.blur-image');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const src = img.dataset.src;
                        img.onload = () => {
                            img.classList.add('lazy-loaded');
                            blur.classList.add('lazy-loaded');
                        };
                        img.src = src;
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '300px' });

            observer.observe(img);

            const linkEl = this.querySelector('.gallery-item-link');
            linkEl.addEventListener('mouseenter', () => {
                const coverImg = document.createElement('img');
                coverImg.src = image;
                coverContainer.innerHTML = '';
                coverContainer.appendChild(coverImg);
                coverContainer.style.display = 'block';
            });

            linkEl.addEventListener('mouseleave', () => {
                coverContainer.style.display = 'none';
                coverContainer.innerHTML = '';
            });
        }
    }
    customElements.define('gallery-item', GalleryItem);

    // Main Gallery Class
    class Gallery {
        constructor() {
            this.api = settings.apikey ? new API(settings.apikey) : null;
            this.container = null;
            this.currentPage = 1;
        }

        async init() {
            await this.waitForElements();
            this.createControls();
            
            if (settings.enabled && settings.apikey) {
                await this.loadGallery();
            }
        }

        async waitForElements() {
            return new Promise((resolve) => {
                const check = () => {
                    const table = document.getElementById('torrent_table');
                    if (table) {
                        resolve();
                    } else {
                        setTimeout(check, 100);
                    }
                };
                check();
            });
        }

        createControls() {
            const controls = document.createElement('div');
            controls.id = 'ggn-controls';
            
            const apiButtonContent = settings.apikey ? '🔑' : '🔑 Setup API Key';
            const apiButtonClass = settings.apikey ? 'ggn-btn-success' : 'ggn-btn-warning';
            const apiButtonTitle = settings.apikey ? 'Change API Key' : 'Setup API Key';
            const statusLightClass = settings.apikey ? 'ggn-status-light-green' : 'ggn-status-light-red';
            
            controls.innerHTML = `
                <div class="ggn-control-group">
                    <label>View:</label>
                    <button id="ggn-view-toggle" class="ggn-btn ${settings.enabled ? 'ggn-btn-active' : ''}">
                        ${settings.enabled ? 'Gallery' : 'List'}
                    </button>
                </div>
                
                <div class="ggn-control-group">
                    <button id="ggn-api-setup" class="ggn-btn ${apiButtonClass}" title="${apiButtonTitle}">
                        ${apiButtonContent}
                    </button>
                    <span id="ggn-status-light" class="ggn-status-light ${statusLightClass}"></span>
                </div>
                
                <div class="ggn-control-group" id="ggn-column-control" style="${settings.enabled ? '' : 'display: none;'}">
                    <label>Columns:</label>
                    <input type="number" id="ggn-columns" class="ggn-input" min="2" max="12" value="${settings.columns}">
                </div>
                
                <div class="ggn-control-group">
                    <label>Sort:</label>
                    <select id="ggn-sort-by" class="ggn-select">
                        <option value="relevance">Relevance</option>
                        <option value="time">Time Added</option>
                        <option value="userrating">User Rating</option>
                        <option value="groupname">Title</option>
                        <option value="year">Year</option>
                        <option value="size">Size</option>
                        <option value="snatched">Snatched</option>
                        <option value="seeders">Seeders</option>
                        <option value="leechers">Leechers</option>
                        <option value="metarating">MetaCritic Score</option>
                        <option value="ignrating">IGN Score</option>
                        <option value="gsrating">GameSpot Score</option>
                    </select>
                    <select id="ggn-sort-direction" class="ggn-select" style="min-width: auto; width: 70px;">
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                    <button id="ggn-apply-sort" class="ggn-btn">Apply</button>
                </div>
            `;

            const table = document.getElementById('torrent_table');
            table.parentNode.insertBefore(controls, table);

            document.getElementById('ggn-sort-by').value = settings.sortBy;
            document.getElementById('ggn-sort-direction').value = settings.sortDirection;

            document.getElementById('ggn-view-toggle').addEventListener('click', () => this.toggleView());
            document.getElementById('ggn-api-setup').addEventListener('click', () => this.setupAPIKey());
            document.getElementById('ggn-columns').addEventListener('change', (e) => this.changeColumns(e.target.value));
            document.getElementById('ggn-apply-sort').addEventListener('click', () => this.applySort());
        }

        async setupAPIKey() {
            const hasKey = await showAPIKeyModal();
            if (hasKey && settings.apikey) {
                this.api = new API(settings.apikey);
                
                // Update button to show green key icon
                const btn = document.getElementById('ggn-api-setup');
                btn.textContent = '🔑';
                btn.className = 'ggn-btn ggn-btn-success';
                btn.title = 'Change API Key';
                
                // Update status light to green
                const statusLight = document.getElementById('ggn-status-light');
                statusLight.className = 'ggn-status-light ggn-status-light-green';
                
                if (settings.enabled) {
                    await this.loadGallery();
                }
            }
        }

        async toggleView() {
            if (!settings.apikey) {
                alert('⚠️ Please setup your API key first by clicking the "🔑 Setup API Key" button.');
                return;
            }

            settings.enabled = !settings.enabled;
            await config.set('ggn_enabled', settings.enabled);

            const btn = document.getElementById('ggn-view-toggle');
            const columnControl = document.getElementById('ggn-column-control');
            const table = document.getElementById('torrent_table');

            if (settings.enabled) {
                btn.textContent = 'Gallery';
                btn.classList.add('ggn-btn-active');
                columnControl.style.display = 'flex';
                table.classList.add('gallery-hidden');
                await this.loadGallery();
            } else {
                btn.textContent = 'List';
                btn.classList.remove('ggn-btn-active');
                columnControl.style.display = 'none';
                table.classList.remove('gallery-hidden');
                if (this.container) {
                    this.container.remove();
                    this.container = null;
                }
            }
        }

        async changeColumns(value) {
            settings.columns = parseInt(value);
            await config.set('ggn_columns', settings.columns);
            if (this.container) {
                this.container.style.gridTemplateColumns = `repeat(${settings.columns}, 1fr)`;
            }
        }

        async applySort() {
            settings.sortBy = document.getElementById('ggn-sort-by').value;
            settings.sortDirection = document.getElementById('ggn-sort-direction').value;
            await config.set('ggn_sort_by', settings.sortBy);
            await config.set('ggn_sort_direction', settings.sortDirection);

            const url = new URL(window.location.href);
            url.searchParams.set('order_by', settings.sortBy);
            url.searchParams.set('order_way', settings.sortDirection);
            window.location.href = url.toString();
        }

        async loadGallery() {
            if (!settings.apikey) {
                alert('⚠️ API key required. Please click "🔑 Setup API Key" button.');
                return;
            }

            if (this.container) {
                this.container.remove();
            }

            this.container = document.createElement('div');
            this.container.id = 'gallery-container';
            this.container.style.gridTemplateColumns = `repeat(${settings.columns}, 1fr)`;

            const table = document.getElementById('torrent_table');
            table.parentNode.insertBefore(this.container, table);

            this.container.innerHTML = '<div class="ggn-loading">Loading gallery</div>';

            try {
                const searchParams = new URLSearchParams(window.location.search);
                const games = await this.api.search(searchParams.toString());

                this.container.innerHTML = '';

                if (games.length === 0) {
                    this.container.innerHTML = '<div class="ggn-loading">No results found</div>';
                    return;
                }

                const fragment = document.createDocumentFragment();
                games.forEach(game => {
                    const item = document.createElement('gallery-item');
                    item.setAttribute('groupName', game.name);
                    item.setAttribute('groupYear', game.year);
                    item.setAttribute('groupId', game.id);
                    item.setAttribute('image', game.image);
                    fragment.appendChild(item);
                });

                this.container.appendChild(fragment);
            } catch (error) {
                console.error('Gallery load error:', error);
                this.container.innerHTML = `<div class="ggn-loading">Error loading gallery: ${error.message}<br>Check console for details.</div>`;
                
                // Update status light to red if there's an error
                const statusLight = document.getElementById('ggn-status-light');
                if (statusLight) {
                    statusLight.className = 'ggn-status-light ggn-status-light-red';
                }
            }
        }
    }

    // Initialize
    const gallery = new Gallery();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => gallery.init());
    } else {
        gallery.init();
    }

})();