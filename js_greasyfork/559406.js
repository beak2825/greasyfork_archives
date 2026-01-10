// ==UserScript==
// @name         ListenBrainz: Extended Controls
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.1.6
// @tag          ai-created
// @description  Allows customizing which actions are shown in listen controls cards, moving "Open in Music Service" links to the main controls area, displaying source info, and auto-copying text in the "Link Listen" modal.
// @author       chaban
// @match        https://*.listenbrainz.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559406/ListenBrainz%3A%20Extended%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/559406/ListenBrainz%3A%20Extended%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REGISTRY = {
        excludedFromDiscovery: ['open in musicbrainz', 'inspect listen', 'more actions', 'love', 'hate'],
        serviceMappingTable: [
            { domain: 'spotify.com', name: 'Spotify' },
            { domain: 'bandcamp.com', name: 'Bandcamp' },
            { domain: 'youtube.com', name: 'YouTube' },
            { domain: 'music.youtube.com', name: 'YouTube Music' },
            { domain: 'deezer.com', name: 'Deezer' },
            { domain: 'tidal.com', name: 'TIDAL' },
            { domain: 'music.apple.com', name: 'Apple Music' },
            { domain: 'archive.org', name: 'Internet Archive' },
            { domain: 'soundcloud.com', name: 'Soundcloud' },
            { domain: 'jamendo.com', name: 'Jamendo Music' },
            { domain: 'play.google.com', name: 'Google Play Music' }
        ],
        icons: {
            player: 'M512 256A256 256 0 1 1 0 256a256 256 0 1 1 512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z',
            harmony: {
                viewBox: '0 0 200 200',
                d: 'M68.08,122.59c4.17,2.66,9.11,4.23,14.42,4.23,14.82,0,26.84-12.02,26.84-26.84s-12.02-26.84-26.84-26.84c-5.35,0-10.31,1.58-14.5,4.28-.31.02-.63.02-.94.02-2.42,0-4.85-.49-6.9-1.86-2.99-1.99-4.29-6.45-4.77-11.01V21.54L7.74,48.87v102.25l47.64,27.34v-43.03c.49-4.57,1.78-9.02,4.77-11.01,2.06-1.37,4.48-1.86,6.9-1.86.34,0,.68,0,1.02.03Z M63.67,175.1v-39.19c.38-3.11,1.04-4.35,1.25-4.68.26-.13.6-.23,1-.29,5.1,2.74,10.78,4.18,16.58,4.18,19.37,0,35.13-15.76,35.13-35.13s-15.76-35.13-35.13-35.13c-5.83,0-11.53,1.45-16.64,4.21-.38-.06-.69-.16-.94-.28-.21-.33-.87-1.57-1.25-4.68V24.9L107.08,0l85.18,48.87v102.25l-85.18,48.87-43.4-24.9Z'
            }
        }
    };

    const DEFAULT_SETTINGS = {
        moveServiceLinks: false,
        showPlayerIndicator: false,
        showLoveHate: true,
        autoCopyModalText: true,
        enabledActions: ['Link with MusicBrainz'],
        showHarmonyButton: true
    };

    let settings = GM_getValue('UserJS.ListenBrainz.ExtendedListenControls', DEFAULT_SETTINGS);
    const processedCards = new WeakSet();
    const processedCopyButtons = new WeakSet();
    let discoveredActions = new Set();
    let reactFiberKey = null;

    const notify = () => window.dispatchEvent(new CustomEvent('UserJS.ListenBrainz.ExtendedListenControls.settings_changed'));

    // --- Native UI Styles ---
    GM_addStyle(`
        #lb-ext-settings-menu {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            z-index: 10000; width: 340px; max-height: 85vh; overflow-y: auto;
        }
        .lb-setting-item { display: flex; align-items: center; margin-bottom: 10px; cursor: pointer; font-size: 14px; }
        .lb-setting-item input { margin-right: 12px; }
        #lb-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 9999; cursor: pointer; }
        #lb-ext-gear { cursor: pointer; }

        .lb-harmony-btn svg { opacity: 0.9; }
        .lb-harmony-btn:hover svg { opacity: 1; }
    `);

    // --- DOM Helper ---
    function el(tag, props = {}, children = []) {
        const element = (tag === 'svg' || tag === 'path')
            ? document.createElementNS('http://www.w3.org/2000/svg', tag)
            : document.createElement(tag);
        Object.entries(props).forEach(([key, value]) => {
            if (key === 'style' && typeof value === 'object') Object.assign(element.style, value);
            else if (key === 'on') Object.entries(value).forEach(([ev, fn]) => element.addEventListener(ev, fn));
            else if (tag === 'path' || tag === 'svg') element.setAttribute(key === 'className' ? 'class' : key, value);
            else element[key] = value;
        });
        children.forEach(child => {
            if (typeof child === 'string') element.appendChild(document.createTextNode(child));
            else if (child) element.appendChild(child);
        });
        return element;
    }

    function getFriendlyServiceName(info) {
        const val = (info.music_service || info.listening_from || "").toLowerCase();
        const match = REGISTRY.serviceMappingTable.find(item => val.includes(item.domain.toLowerCase()));
        return match ? match.name : (info.music_service_name || (info.listening_from !== info.media_player ? info.listening_from : null));
    }

    // --- UI Logic ---
    function closeSettings() {
        document.getElementById('lb-ext-settings-menu')?.remove();
        document.getElementById('lb-settings-overlay')?.remove();
        document.removeEventListener('keydown', handleEsc);
    }
    function handleEsc(e) { if (e.key === 'Escape') closeSettings(); }

    function createSettingsUI() {
        if (document.getElementById('lb-ext-settings-menu')) return;
        discoverActionsOnPage();

        const createCheckbox = (label, isKey, target) => {
            const input = el('input', {
                type: 'checkbox',
                checked: isKey ? settings[target] : settings.enabledActions.includes(target),
                on: { change: (e) => {
                    if (isKey) settings[target] = e.target.checked;
                    else {
                        if (e.target.checked) !settings.enabledActions.includes(target) && settings.enabledActions.push(target);
                        else settings.enabledActions = settings.enabledActions.filter(a => a !== target);
                    }
                    GM_setValue('UserJS.ListenBrainz.ExtendedListenControls', settings);
                    notify();
                }}
            });
            return el('label', { className: 'lb-setting-item' }, [input, label]);
        };

        const menu = el('div', { id: 'lb-ext-settings-menu', className: 'card p-4 shadow' }, [
            el('h4', { className: 'card-title border-bottom pb-2 mb-3' }, ['Extended Controls']),
            createCheckbox("Show Love/Hate Buttons", true, 'showLoveHate'),
            createCheckbox("Show 'Open in Service' Links", true, 'moveServiceLinks'),
            createCheckbox("Show Source Info", true, 'showPlayerIndicator'),
            createCheckbox("Auto-copy Text in Link Listen Modal", true, 'autoCopyModalText'),
            createCheckbox("Show Harmony Button (unmapped only)", true, 'showHarmonyButton'),
            el('div', { className: 'mt-3 mb-2 small text-muted font-weight-bold text-uppercase' }, ['Quick Buttons']),
            ...Array.from(discoveredActions).sort().map(label => createCheckbox(label, false, label)),
            el('button', { className: 'btn btn-secondary btn-block mt-3', on: { click: closeSettings } }, ['Close'])
        ]);

        document.body.appendChild(el('div', { id: 'lb-settings-overlay', on: { click: closeSettings } }));
        document.body.appendChild(menu);
        document.addEventListener('keydown', handleEsc);
    }

    function discoverActionsOnPage() {
        document.querySelectorAll('.listen-card .dropdown-item').forEach(item => {
            const label = (item.title || item.getAttribute('aria-label') || item.innerText || "").trim();
            const lower = label.toLowerCase();
            if (lower.startsWith('open in ') || REGISTRY.excludedFromDiscovery.includes(lower) || !label) return;
            discoveredActions.add(label);
        });
    }

    function injectSettingsButton() {
        if (document.getElementById('lb-ext-gear')) return;
        const navBottom = document.querySelector('.navbar-bottom');
        if (!navBottom) return;
        navBottom.appendChild(el('a', { id: 'lb-ext-gear', on: { click: (e) => { e.preventDefault(); createSettingsUI(); } } }, ['Extended Controls']));
    }

    // --- Core Logic ---
    function getListenData(domElement) {
        if (!reactFiberKey) reactFiberKey = Object.keys(domElement).find(k => k.startsWith("__reactFiber"));
        const fiber = domElement[reactFiberKey];
        return fiber?.return?.memoizedProps?.listen || fiber?.return?.return?.memoizedProps?.listen || null;
    }

    function createQuickBtn(originalItem, customClass, isLink) {
        const icon = originalItem.querySelector('svg, i, img');
        const children = icon ? [icon.cloneNode(true)] : [(originalItem.title || "X").substring(0, 1)];
        return el(isLink ? 'a' : 'button', {
            className: `btn btn-transparent lb-ext-btn ${customClass}`,
            title: originalItem.title || originalItem.getAttribute('aria-label') || "",
            href: isLink ? originalItem.href : undefined,
            target: isLink ? '_blank' : undefined,
            rel: isLink ? 'noopener noreferrer' : undefined,
            on: isLink ? {} : { click: (e) => { e.stopPropagation(); e.preventDefault(); originalItem.click(); } }
        }, children);
    }

    // --- Harmony helpers ---
    function isCardLinked(card) {
        const titleLink = card.querySelector('.title-duration > div > a[href*="/track/"]');
        return !!titleLink;
    }

 function normalizeSpotifyAlbum(value) {
    if (!value) return null;
    const s = String(value).trim();

    // Full album URL
    const m1 = s.match(/open\.spotify\.com\/album\/([A-Za-z0-9]+)/);
    if (m1) return `https://open.spotify.com/album/${m1[1]}`;

    // spotify:album:<id>
    const m2 = s.match(/^spotify:album:([A-Za-z0-9]+)$/);
    if (m2) return `https://open.spotify.com/album/${m2[1]}`;

    // raw ID
    if (/^[A-Za-z0-9]+$/.test(s)) {
        return `https://open.spotify.com/album/${s}`;
    }

    return null;
}

function getAlbumUrlFromListen(listen) {
    const info = listen?.track_metadata?.additional_info || {};

    // Spotify (LB is inconsistent here)
    const spotify = normalizeSpotifyAlbum(
        info.spotify_album_id ||
        info.spotify_album_uri ||
        info.spotify_album_url
    );
    if (spotify) return spotify;

    // Deezer
    if (info.deezer_album_id) {
        const v = String(info.deezer_album_id);
        return v.startsWith('http')
            ? v
            : `https://www.deezer.com/album/${v}`;
    }

    // TIDAL
    if (info.tidal_album_id) {
        const v = String(info.tidal_album_id);
        return v.startsWith('http')
            ? v
            : `https://tidal.com/browse/album/${v}`;
    }

    // Apple Music (already a URL)
    if (info.apple_music_album_url) return info.apple_music_album_url;

    // Fallback
    if (info.origin_url) return info.origin_url;
    if (info.track_url) return info.track_url;

    return null;
}

function makeHarmonyUrl(albumUrl) {
    const h = new URL('https://harmony.pulsewidth.org.uk/release');
    h.searchParams.set('url', albumUrl);
    h.searchParams.set('category', 'preferred');
    return h.toString();
}

    function getIcon(key) {
        const data = REGISTRY.icons[key];
        const isObj = typeof data === 'object';
        const viewBox = isObj ? data.viewBox : '0 0 512 512';
        const d = isObj ? data.d : data;
        return el('svg', { viewBox: viewBox, style: { width: '1em', height: '1em', fill: 'currentColor', verticalAlign: '-0.125em' } }, [
            el('path', { d: d })
        ]);
    }

    function addQuickButtons(card) {
        const controls = card.querySelector('.listen-controls');
        const menuBtn = controls?.querySelector('.dropdown-toggle');
        if (!controls || !menuBtn) return;

        // --- DYNAMIC PART: Harmony Button (Runs every scan) ---
        // We check the DOM directly to see if the title is a link
        const isLinked = isCardLinked(card);
        const existingHarmony = controls.querySelector('.lb-harmony-btn');

        if (isLinked) {
            // Case A: Listen is now linked -> Remove button immediately
            if (existingHarmony) existingHarmony.remove();
        } else {
            // Case B: Listen is NOT linked
            if (existingHarmony) {
                // Button exists, just ensure visibility matches settings
                existingHarmony.style.display = settings.showHarmonyButton ? '' : 'none';
            } else if (settings.showHarmonyButton) {
                // Button missing, but needed -> Create it
                // We still need React props for the URL data, but we don't trust the "is_mapped" prop there
                const listen = getListenData(card);
                const albumUrl = getAlbumUrlFromListen(listen);
                if (albumUrl) {
                    const harmonyBtn = el('a', {
                        className: 'btn btn-transparent lb-ext-btn lb-harmony-btn',
                        title: 'Open in Harmony (prefilled)',
                        href: makeHarmonyUrl(albumUrl),
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        on: { click: (e) => e.stopPropagation() }
                    }, [ getIcon('harmony') ]);
                    controls.insertBefore(harmonyBtn, menuBtn);
                }
            }
        }

        // --- STATIC PART: Other Buttons (Runs once per card) ---
        if (processedCards.has(card)) return;

        // Native elements to potentially hide
        const nativeLove = controls.querySelector('.love');
        const nativeHate = controls.querySelector('.hate');

        const stateRegistry = { staticMoved: [], originals: [] };

        // 1. Static Actions
        card.querySelectorAll('.dropdown-item').forEach(item => {
            const label = (item.title || item.getAttribute('aria-label') || "").trim();
            const lowerLabel = label.toLowerCase();
            if (!lowerLabel.startsWith('open in ') && !REGISTRY.excludedFromDiscovery.includes(lowerLabel)) {
                const moved = createQuickBtn(item, 'lb-static-moved', false);
                controls.insertBefore(moved, menuBtn);
                stateRegistry.staticMoved.push({ el: moved, name: label });
                stateRegistry.originals.push({ el: item, name: label });
            }
        });

        // 2. Service Link Slot
        let cardServiceOriginal = null, movedServiceBtn = null;
        card.querySelectorAll('.dropdown-item').forEach(item => {
            const title = (item.title || item.getAttribute('aria-label') || "").toLowerCase();
            if (title.startsWith('open in ') && !REGISTRY.excludedFromDiscovery.includes(title)) {
                cardServiceOriginal = item;
                movedServiceBtn = createQuickBtn(item, 'lb-dynamic-moved', true);
                controls.insertBefore(movedServiceBtn, menuBtn);
            }
        });

        // 3. Player Indicator Slot
        let indicator = null;
        const listen = getListenData(card);
        const info = listen?.track_metadata?.additional_info;
        if (info) {
            const player = info.media_player;
            const client = info.submission_client;
            const serviceFriendly = getFriendlyServiceName(info);
            const tooltipLines = [];
            if (serviceFriendly) tooltipLines.push(`Service: ${serviceFriendly}`);
            if (player) tooltipLines.push(`Player: ${player}`);
            if (client && client !== player) tooltipLines.push(`Client: ${client}`);

            if (tooltipLines.length > 0) {
                indicator = el('button', {
                    className: 'btn btn-transparent lb-player-indicator',
                    style: { cursor: 'help' },
                    title: tooltipLines.join('\n'),
                    on: { click: (e) => e.stopPropagation() }
                }, [ getIcon('player') ]);
                controls.insertBefore(indicator, menuBtn);
            }
        }

        const update = () => {
            // Native button visibility
            if (nativeLove) nativeLove.style.display = settings.showLoveHate ? '' : 'none';
            if (nativeHate) nativeHate.style.display = settings.showLoveHate ? '' : 'none';

            // Custom controls visibility
            stateRegistry.staticMoved.forEach(m => m.el.style.display = settings.enabledActions.includes(m.name) ? '' : 'none');
            stateRegistry.originals.forEach(o => o.el.style.display = settings.enabledActions.includes(o.name) ? 'none' : 'block');

            const canMoveService = settings.moveServiceLinks && movedServiceBtn;
            if (movedServiceBtn) movedServiceBtn.style.display = canMoveService ? '' : 'none';
            if (cardServiceOriginal) cardServiceOriginal.style.display = canMoveService ? 'none' : 'block';
            if (indicator) indicator.style.display = (settings.showPlayerIndicator && !canMoveService) ? '' : 'none';

            // Note: Harmony visibility is handled in the dynamic block above
        };

        window.addEventListener('UserJS.ListenBrainz.ExtendedListenControls.settings_changed', update);
        update();
        processedCards.add(card);
    }

    function scanPage() {
        injectSettingsButton();

        if (!window.location.pathname.includes('/settings/link-listens')) {
            discoverActionsOnPage();
            document.querySelectorAll('.listen-card').forEach(addQuickButtons);
        }

        if (settings.autoCopyModalText) {
            const modal = document.getElementById('MBIDMappingModal');
            if (modal) modal.querySelectorAll('button').forEach(btn => {
                if (!processedCopyButtons.has(btn) && btn.innerText.toLowerCase().includes('copy text')) {
                    processedCopyButtons.add(btn);
                    btn.click();
                }
            });
        }
    }

    scanPage();
    new MutationObserver(scanPage).observe(document.body, { childList: true, subtree: true });
})();
