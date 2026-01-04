// ==UserScript==
// @name         Spotify: MusicBrainz importer
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.4.1
// @tag          ai-created
// @description  Adds buttons for MusicBrainz, ListenBrainz, Harmony, ISRC Hunt and SAMBL to Spotify.
// @author       chaban, garylaski, RustyNova
// @license      MIT
// @icon         https://open.spotify.com/favicon.ico
// @match        *://*.spotify.com/*
// @connect      musicbrainz.org
// @connect      listenbrainz.org
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @require https://update.greasyfork.org/scripts/552392/1689509/MusicBrainz%20API%20Module.js
// @downloadURL https://update.greasyfork.org/scripts/548376/Spotify%3A%20MusicBrainz%20importer.user.js
// @updateURL https://update.greasyfork.org/scripts/548376/Spotify%3A%20MusicBrainz%20importer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TokenManager = {
        _token: null,
        async init() {
            this._token = await GM.getValue('listenbrainz_user_token', null);
            GM.registerMenuCommand('Set ListenBrainz Token', this.setToken.bind(this));
        },
        getTokenValue() {
            return this._token;
        },
        async getToken(forcePrompt = false) {
            if (!this._token || forcePrompt) {
                const success = await this.setToken();
                if (!success) {
                    return null;
                }
            }
            return this._token;
        },
        async setToken() {
            const token = prompt('Please enter your ListenBrainz User Token:', this._token || '');
            if (token && token.trim()) {
                this._token = token.trim();
                await GM.setValue('listenbrainz_user_token', this._token);
                alert('ListenBrainz token saved!');
                return true;
            }
            return false;
        }
    };

    class main {
        static SCRIPT_NAME = GM.info.script.name;
        static SELECTORS = {
            ACTION_BAR: [
                '[data-testid="action-bar-row"]'
            ],
            SORT_BUTTON: 'button[role="combobox"]',
            ARTIST_LINK: [
                '[data-testid="creator-link"]'
            ],
            PAGE_TITLE: [
                '[data-testid="entityTitle"]',
                '.encore-text-headline-large'
            ],
            ALBUM_LINK_ON_TRACK_PAGE: [
                '[data-testid="entityTitle"] ~ div a[href^="/album/"]',
                '[data-testid="track-page"] > div:first-child a[href^="/album/"]'
            ],
        };
        static URLS = {
            MUSICBRAINZ_BASE: 'https://musicbrainz.org',
            HARMONY_BASE: 'https://harmony.pulsewidth.org.uk/release',
            SAMBL_BASE: 'https://sambl.lioncat6.com',
            ISRCHUNT_BASE: 'https://isrchunt.com',
            LISTENBRAINZ_API_BASE: 'https://api.listenbrainz.org/1',
            LISTENBRAINZ_BASE: 'https://listenbrainz.org',
        };

        static BUTTON_CONFIG = {
            HARMONY: {
                id: 'mb-import-harmony-button', text: 'Import with Harmony', className: 'import-button-harmony', color: '#c45555',
                pages: ['album', 'track'],
                invalidateCache: true,
                getUrl: ({ pageInfo, normalizedUrl }) => {
                    let finalReleaseUrl = null;

                    if (pageInfo.type === 'album') {
                        finalReleaseUrl = normalizedUrl;
                    } else if (pageInfo.type === 'track') {
                        const albumLinkEl = main.querySelectorFromAlternatives(main.SELECTORS.ALBUM_LINK_ON_TRACK_PAGE);
                        if (albumLinkEl?.href) {
                            const albumInfo = main.extractInfoFromUrl(albumLinkEl.href);
                            if (albumInfo.type === 'album' && albumInfo.id) {
                                finalReleaseUrl = `https://open.spotify.com/album/${albumInfo.id}`;
                            }
                        }
                    }

                    if (!finalReleaseUrl) return null;

                    return main.constructUrl(main.URLS.HARMONY_BASE, {
                        gtin: '', category: 'preferred', url: finalReleaseUrl,
                    });
                },
            },
            MUSICBRAINZ: {
                id: 'mb-import-lookup-button', text: 'MusicBrainz', className: 'import-button-open', color: '#BA478F',
                pages: ['album', 'artist', 'track'],
                getText: ({ mbInfo }) => mbInfo ? 'Open in MusicBrainz' : 'Search in MusicBrainz',
                getUrl: ({ mbInfo, pageInfo }) => {
                    if (mbInfo) {
                        return new URL(`${mbInfo.targetType}/${mbInfo.mbid}`, main.URLS.MUSICBRAINZ_BASE);
                    }
                    const { title, artist } = main.getReleaseInfo();
                    if (!title) return null;

                    if (pageInfo.type === 'artist') {
                        return main.constructUrl(`${main.URLS.MUSICBRAINZ_BASE}/search`, { query: title, type: 'artist' });
                    }
                    if (pageInfo.type === 'track') {
                        return main.constructUrl(`${main.URLS.MUSICBRAINZ_BASE}/search`, { query: `recording:"${title}" AND artist:"${artist}"`, type: 'recording', method: 'advanced' });
                    }
                    return main.constructUrl(`${main.URLS.MUSICBRAINZ_BASE}/taglookup/index`, { 'tag-lookup.release': title, 'tag-lookup.artist': artist });
                },
            },
            LISTENBRAINZ: {
                id: 'mb-listenbrainz-button', text: 'Open in ListenBrainz', className: 'import-button-listenbrainz', color: '#5555c4',
                pages: ['artist', 'track', 'album'],
                requiresMbInfo: true,
                getUrl: ({ mbInfo }) => {
                    if (!mbInfo?.mbid) return null;
                    let path;
                    switch (mbInfo.targetType) {
                        case 'artist':
                            path = 'artist';
                            break;
                        case 'recording':
                            path = 'track';
                            break;
                        case 'release':
                            path = 'release';
                            break;
                        default:
                            return null;
                    }
                    return new URL(`${path}/${mbInfo.mbid}/`, main.URLS.LISTENBRAINZ_BASE);
                },
            },
            SAMBL: {
                id: 'sambl-button', text: 'Open in SAMBL', className: 'import-button-sambl', color: '#1DB954',
                pages: ['artist'],
                getUrl: ({ mbInfo, pageInfo }) => {
                    if (!pageInfo.id) return null;
                    const isMbidFound = mbInfo?.targetType === 'artist';
                    return isMbidFound
                        ? main.constructUrl(`${main.URLS.SAMBL_BASE}/artist`, { provider_id: pageInfo.id, provider: 'spotify', artist_mbid: mbInfo.mbid })
                        : main.constructUrl(`${main.URLS.SAMBL_BASE}/newartist`, { provider_id: pageInfo.id, provider: 'spotify' });
                },
            },
            ISRCHUNT: {
                id: 'isrc-hunt-button', text: 'Open in ISRC Hunt', className: 'import-button-isrc-hunt', color: '#3B82F6',
                pages: ['playlist'],
                getUrl: ({ normalizedUrl }) => main.constructUrl(main.URLS.ISRCHUNT_BASE, {
                    spotifyPlaylist: normalizedUrl,
                }),
            },
            LISTENBRAINZ_IMPORT_PLAYLIST: {
                id: 'lb-playlist-import-button', text: 'ListenBrainz Playlist', className: 'import-button-listenbrainz', color: '#5555c4',
                pages: ['playlist'],
                getText: ({ lbPlaylistResult, tokenExists }) => {
                    if (!tokenExists) return 'Set LB Token';
                    if (lbPlaylistResult.count === 1) return 'Open in ListenBrainz';
                    if (lbPlaylistResult.count > 1) return 'Find in ListenBrainz';
                    return 'Import to ListenBrainz';
                },
                getUrl: ({ normalizedUrl, lbPlaylistResult }) => {
                    if (lbPlaylistResult.count === 1) {
                        return new URL(lbPlaylistResult.playlists[0].playlist.identifier);
                    }
                    if (lbPlaylistResult.count > 1) {
                        const { title } = main.getReleaseInfo();
                        return main.constructUrl(`${main.URLS.LISTENBRAINZ_BASE}/search`, {
                            search_term: title,
                            search_type: 'playlist'
                        });
                    }
                    return null;
                },
                onClick: async function (context) {
                    const { lbPlaylistResult, button, tokenExists } = context;
                    if (!tokenExists) {
                        const token = await TokenManager.getToken(true);
                        if (token) document.getElementById('mb-script-button-container')?.dispatchEvent(new Event('mb-button-update'));
                        return;
                    }

                    if (lbPlaylistResult.count === 0) {
                        main.setButtonLoading(button, true);
                        try {
                            const importSuccessful = await this.#importSpotifyPlaylist(context);
                            if (importSuccessful) {
                                document.getElementById('mb-script-button-container')?.dispatchEvent(new Event('mb-button-update'));
                            }
                        } catch (error) {
                            console.error('Spotify import failed:', error);
                            main.setButtonText(button, 'Import Failed');
                            button.classList.add('import-button-error');
                            main.setButtonLoading(button, false);
                        }
                    }
                },
            },
        };

        #urlCache = new Map();
        #currentUrl = '';
        #observer = null;
        #debounceTimer = null;
        #buttonContainer = null;
        #runId = 0;
        #mbApi = null;

        constructor() {
            TokenManager.init();
            this.#mbApi = new MusicBrainzAPI({ user_agent: `${main.SCRIPT_NAME}/${GM.info.script.version} ( ${GM.info.script.namespace} )` });
            this.#addStyles();
            this.#currentUrl = location.href;
            this.#initializeObserver();
            this.#run();
        }

        #initializeObserver() {
            this.#observer = new MutationObserver(() => {
                if (location.href !== this.#currentUrl) {
                    this.#currentUrl = location.href;
                    clearTimeout(this.#debounceTimer);
                    this.#debounceTimer = setTimeout(() => this.#run(), 250);
                }
            });
            this.#observer.observe(document.body, { childList: true, subtree: true });
        }

        async #run() {
            const runId = ++this.#runId;
            const urlForThisRun = location.href;
            console.debug(`${main.SCRIPT_NAME}: Starting run #${runId} for ${urlForThisRun}`);
            this.#cleanup();

            const pageInfo = main.extractInfoFromUrl(urlForThisRun);
            const supportedPages = [...new Set(Object.values(main.BUTTON_CONFIG).flatMap(config => config.pages))];

            if (!supportedPages.includes(pageInfo.type)) {
                return;
            }

            try {
                const actionBar = await main.waitForElement(main.SELECTORS.ACTION_BAR, 5000);
                this.#createButtonContainer(actionBar);

                this.#setupButtonsInLoadingState(pageInfo);

                const normalizedUrl = main.normalizeUrl(urlForThisRun);
                const tokenExists = !!TokenManager.getTokenValue();
                const initialContext = { pageInfo, normalizedUrl, tokenExists, runId };

                this.#updateButtonsWithData(initialContext);

                const needsMbInfo = Object.values(main.BUTTON_CONFIG).some(config => config.pages.includes(pageInfo.type) && config.requiresMbInfo);

                if (needsMbInfo) {
                    this.#fetchMusicBrainzInfo(urlForThisRun, pageInfo).then(mbInfo => {
                        if (this.#runId !== runId) return;
                        this.#updateButtonsWithData({ ...initialContext, mbInfo });
                    });
                }

                if (pageInfo.type === 'playlist') {
                    this.#findListenBrainzPlaylist(normalizedUrl).then(lbPlaylistResult => {
                        if (this.#runId !== runId) return;
                        this.#updateButtonsWithData({ ...initialContext, lbPlaylistResult });
                    });
                }

            } catch (error) {
                if (this.#runId !== runId) {
                    console.debug(`${main.SCRIPT_NAME}: Suppressing error from obsolete run #${runId}.`);
                    return;
                }
                console.error(`${main.SCRIPT_NAME}: Failed to initialize buttons for run #${runId}.`, error);
            }
        }

        #setupButtonsInLoadingState(pageInfo) {
            for (const config of Object.values(main.BUTTON_CONFIG)) {
                if (config.pages.includes(pageInfo.type)) {
                    const button = this.#createOrUpdateButton(config);
                    const needsLoading = config.requiresMbInfo || config.id === 'mb-import-lookup-button' || config.id === 'lb-playlist-import-button';
                    if (needsLoading) {
                        main.setButtonLoading(button, true);
                    }
                }
            }
        }

        #updateButtonsWithData(context) {
            for (const config of Object.values(main.BUTTON_CONFIG)) {
                const canSetUp =
                    (!config.requiresMbInfo || context.mbInfo !== undefined) &&
                    (config.id !== 'lb-playlist-import-button' || context.lbPlaylistResult !== undefined);

                if (config.pages.includes(context.pageInfo.type) && canSetUp) {
                    this.#setupButtonFromConfig(config, context);
                }
            }
        }

        #setupButtonFromConfig(config, context) {
            const { pageInfo, mbInfo } = context;
            const button = document.getElementById(config.id);
            if (!button) return;

            if (config.requiresMbInfo && !mbInfo) {
                button.classList.add('disabled');
                main.setButtonLoading(button, false);
                return;
            };

            context.button = button;

            if (config.getText) {
                main.setButtonText(button, config.getText(context));
            }

            const url = config.getUrl(context);
            main.setButtonLoading(button, false);

            if (url) {
                button.href = url.toString();
                button.classList.remove('disabled');
                if (config.invalidateCache) {
                    button.addEventListener('click', () => {
                        this.#mbApi.invalidateCacheForUrl(context.normalizedUrl);
                    });
                }
            } else if (config.onClick) {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    config.onClick.call(this, { ...context, button: newButton });
                });
                newButton.classList.remove('disabled');
            } else {
                button.classList.add('disabled');
            }
        }

        #createButtonContainer(actionBar) {
            this.#buttonContainer = document.createElement('div');
            this.#buttonContainer.id = 'mb-script-button-container';
            this.#buttonContainer.addEventListener('mb-button-update', () => this.#run());

            const sortButton = actionBar.querySelector(main.SELECTORS.SORT_BUTTON);
            if (sortButton) {
                sortButton.parentElement.before(this.#buttonContainer);
            } else {
                actionBar.appendChild(this.#buttonContainer);
            }
        }

        #createOrUpdateButton(config) {
            if (!this.#buttonContainer) return null;
            let button = document.getElementById(config.id);
            if (!button) {
                button = document.createElement("a");
                button.id = config.id;
                button.target = '_blank';
                button.rel = 'noopener noreferrer';
                this.#buttonContainer.appendChild(button);
            }
            button.className = `import-button ${config.className}`;
            button.removeAttribute('href');
            button.classList.remove('disabled', 'loading');

            const textSpan = document.createElement('span');
            textSpan.textContent = config.text;
            button.textContent = '';
            button.appendChild(textSpan);

            const needsLoading = config.id === 'mb-import-lookup-button' || config.requiresMbInfo;
            if (needsLoading) {
                main.setButtonLoading(button, true);
            }

            return button;
        }

        async #findListenBrainzPlaylist(spotifyUrl) {
            const cacheKey = `lb-playlist-search-${spotifyUrl}`;
            if (this.#urlCache.has(cacheKey)) {
                return this.#urlCache.get(cacheKey);
            }

            const result = { count: 0, playlists: [] };
            try {
                const playlistId = spotifyUrl.split('/').pop();
                const searchUrl = main.constructUrl(`${main.URLS.LISTENBRAINZ_API_BASE}/playlist/search`, {
                    query: playlistId,
                });

                const res = await main.gmXmlHttpRequest({ url: searchUrl.toString(), method: 'GET', responseType: 'json' });

                if (res.status === 200 && res.response?.playlists?.length > 0) {
                    const perfectMatches = res.response.playlists.filter(p => p.playlist.annotation === spotifyUrl);
                    result.count = perfectMatches.length;
                    result.playlists = perfectMatches;
                }
            } catch (error) {
                console.error(`${main.SCRIPT_NAME}: ListenBrainz playlist search failed for ${spotifyUrl}`, error);
            }

            this.#urlCache.set(cacheKey, result);
            return result;
        }

        async #importSpotifyPlaylist({ pageInfo, normalizedUrl, button }) {
            const token = await TokenManager.getToken();
            if (!token) {
                main.setButtonLoading(button, false);
                return null;
            }

            main.setButtonText(button, 'Importing...');
            const importUrl = main.constructUrl(`${main.URLS.LISTENBRAINZ_API_BASE}/playlist/spotify/${pageInfo.id}/tracks`, {});
            const importRes = await main.gmXmlHttpRequest({
                method: 'GET', url: importUrl.toString(),
                headers: { 'Authorization': `Token ${token}` },
                responseType: 'json'
            });

            if (importRes.status !== 200) throw new Error(`Import failed: ${importRes.status}`);

            const importedPlaylist = importRes.response.playlist;
            const newMbid = importRes.response.identifier;

            main.setButtonText(button, 'Annotating...');
            const editUrl = main.constructUrl(`${main.URLS.LISTENBRAINZ_API_BASE}/playlist/edit/${newMbid}`, {});

            const jspfPayload = {
                playlist: {
                    title: importedPlaylist.title,
                    annotation: normalizedUrl,
                    extension: {
                        'https://musicbrainz.org/doc/jspf#playlist': {
                            public: importedPlaylist.extension?.['https://musicbrainz.org/doc/jspf#playlist']?.public ?? true
                        }
                    }
                }
            };

            const editRes = await main.gmXmlHttpRequest({
                method: 'POST', url: editUrl.toString(),
                headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
                data: JSON.stringify(jspfPayload),
                responseType: 'json'
            });

            if (editRes.status !== 200) throw new Error(`Annotation failed: ${editRes.status}`);

            const { title } = main.getReleaseInfo();
            const fakeResult = {
                count: 1,
                playlists: [{
                    playlist: {
                        identifier: `${main.URLS.LISTENBRAINZ_BASE}/playlist/${newMbid}`,
                        annotation: normalizedUrl,
                        title: title,
                    }
                }]
            };
            const cacheKey = `lb-playlist-search-${normalizedUrl}`;
            this.#urlCache.set(cacheKey, fakeResult);

            console.log(`${main.SCRIPT_NAME}: Successfully imported and annotated playlist ${newMbid}. Cache updated.`);
            return newMbid;
        }

        #cleanup() {
            document.getElementById('mb-script-button-container')?.remove();
            this.#buttonContainer = null;
        }

        #addStyles() {
            const staticStyles = `
                #mb-script-button-container { display: flex; align-items: center; margin-left: 8px; }
                .import-button {
                    border-radius: 4px; border: none; padding: 8px 12px; font-size: 0.9em; font-weight: 700; color: white;
                    cursor: pointer; margin: 0 4px; transition: all 0.2s ease; position: relative;
                }
                .import-button:focus { text-decoration: none !important; }
                .import-button:hover:not(.disabled) { filter: brightness(1.1); transform: scale(1.05); text-decoration: none; }
                .import-button.disabled { opacity: 0.7; cursor: not-allowed; pointer-events: none; }
                .import-button.loading span { visibility: hidden; }
                .import-button.loading::after {
                    content: ''; position: absolute; top: 50%; left: 50%;
                    width: 16px; height: 16px; transform: translate(-50%, -50%);
                    border: 2px solid rgba(255, 255, 255, 0.5); border-top-color: white;
                    border-radius: 50%; animation: spin 0.8s linear infinite;
                }
                .import-button-error { background-color: #cc0000 !important; }
                @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
            `;

            const dynamicStyles = main.generateDynamicStyles();
            GM.addStyle(staticStyles + dynamicStyles);
        }

        async #fetchMusicBrainzInfo(url, pageInfo) {
            console.debug(`%c[${main.SCRIPT_NAME}] #fetchMusicBrainzInfo`, 'color: blue; font-weight: bold;', { url, pageInfo });
            const normalizedUrl = main.normalizeUrl(url);

            const incMap = {
                album: 'release-rels',
                artist: 'artist-rels',
                track: 'recording-rels',
            };
            const inc = incMap[pageInfo.type];

            const spotifyToMbType = {
                album: 'release',
                artist: 'artist',
                track: 'recording',
            };
            const expectedMbType = spotifyToMbType[pageInfo.type];
            console.debug(`[${main.SCRIPT_NAME}] Expected MB Type: ${expectedMbType}`);

            try {
                // The API module returns a single object for a single URL lookup
                const urlData = await this.#mbApi.lookupUrl(normalizedUrl, [inc]);
                console.debug(`[${main.SCRIPT_NAME}] API Response:`, urlData);

                if (!urlData || !Array.isArray(urlData.relations) || urlData.relations.length === 0) {
                    console.debug(`[${main.SCRIPT_NAME}] No relations found in API response.`);
                    return null;
                }

                // Find the specific relation that matches our expected entity type
                const relation = urlData.relations.find(rel =>
                    rel['target-type'] === expectedMbType && rel[expectedMbType]
                );
                console.debug(`[${main.SCRIPT_NAME}] Found matching relation:`, relation);

                if (!relation) {
                    console.debug(`[${main.SCRIPT_NAME}] No relation found for expected type '${expectedMbType}'.`);
                    return null;
                }

                const mbid = relation[expectedMbType].id;
                if (!mbid) {
                    console.warn(`[${main.SCRIPT_NAME}] Relation found, but MBID is missing.`);
                    return null;
                }

                const result = {
                    targetType: expectedMbType,
                    mbid: mbid
                };
                console.debug(`[${main.SCRIPT_NAME}] Successfully parsed result:`, result);
                return result;

            } catch (error) {
                // The API module might throw a PermanentError for 404s, which is expected.
                if (!error.message || !error.message.includes('404')) {
                    console.error(`${main.SCRIPT_NAME}: MB API request failed for ${normalizedUrl}`, error);
                } else {
                    console.debug(`[${main.SCRIPT_NAME}] API returned 404 (Not Found) for ${normalizedUrl}, as expected for an unlinked entity.`);
                }
                return null;
            }
        }

        static setButtonLoading(button, isLoading) {
            if (!button) return;
            button.classList.toggle('loading', isLoading);
            if (isLoading) {
                button.classList.add('disabled');
            }
        }

        static setButtonText(button, text) {
            const span = button.querySelector('span');
            if (span) span.textContent = text;
        }

        static getReleaseInfo() {
            const titleEl = main.querySelectorFromAlternatives(this.SELECTORS.PAGE_TITLE);
            const artistEl = main.querySelectorFromAlternatives(this.SELECTORS.ARTIST_LINK);
            const title = titleEl?.textContent.trim() || '';
            const artist = this.extractInfoFromUrl(location.href).type !== 'artist' ? (artistEl?.textContent.trim() || '') : '';
            return { title, artist };
        }

        static querySelectorFromAlternatives(selectors) {
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) return element;
            }
            return null;
        }

        static constructUrl(base, params) {
            const url = new URL(base);
            for (const key in params) {
                if (params[key]) url.searchParams.set(key, params[key]);
            }
            return url;
        }

        static normalizeUrl(url) {
            const { type, id } = this.extractInfoFromUrl(url);
            return (type !== 'unknown' && id) ? `https://open.spotify.com/${type}/${id}` : url;
        }

        static extractInfoFromUrl(url) {
            const match = url.match(/(?:https?:\/\/)?(?:play|open)\.spotify\.com\/(?:intl-[a-z]{2,}(?:-[A-Z]{2,})?\/)?(\w+)\/([a-zA-Z0-9]+)/);
            return { type: match?.[1] || 'unknown', id: match?.[2] || null };
        }

        static gmXmlHttpRequest(options) {
            return new Promise((resolve, reject) => GM.xmlHttpRequest({ ...options, onload: resolve, onerror: reject, onabort: reject }));
        }

        static generateDynamicStyles() {
            return Object.values(this.BUTTON_CONFIG).map(config =>
                `.${config.className} { background-color: ${config.color}; }`
            ).join('\n');
        }

        static waitForElement(selectors, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const element = main.querySelectorFromAlternatives(selectors);
                if (element) return resolve(element);
                const observer = new MutationObserver(() => {
                    const el = main.querySelectorFromAlternatives(selectors);
                    if (el) { observer.disconnect(); clearTimeout(timer); resolve(el); }
                });
                const timer = setTimeout(() => { observer.disconnect(); reject(new Error(`Timeout waiting for selectors: ${selectors.join(', ')}`)); }, timeout);
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    }

    new main();
})();