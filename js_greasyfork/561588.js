// ==UserScript==
// @name Hitomi.la Type Filter Storage
// @namespace http://tampermonkey.net/
// @version 5.0
// @description Storage library for Hitomi.la Type Filter Buttons
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==
(function(window) {
    'use strict';

    const STORAGE_KEY = 'hitomi_filter_settings_v5';

    const DEFAULT_SETTINGS = {
        syncMode: true,
        layoutMode: 'list', // 追加: 'list', 'grid'
        gridColumns: 4, // ★追加: デフォルトのグリッド列数
        thumbnailScale: 1.0, // ★追加: サムネイル倍率 (デフォルト1倍)
        excludeList: [
            'tag:anthology',
            'male:shota',
            'male:yaoi',
            'male:cuntboy',
            'male:urethra_insertion',
            'female:futanari',
            'female:dickgirl_on_female',
            'female:scat'
        ],
        externalSites: [
            { label: 'Hitomi', url: 'https://hitomi.la/search.html?%query%', spaceReplacement: '%20' },
            { label: 'nH',     url: 'https://nhentai.net/search/?q=%query%',   spaceReplacement: '+' },
            { label: 'EH',     url: 'https://e-hentai.org/?f_search=%query%',  spaceReplacement: '+' },
            { label: 'BH',     url: 'https://www.b-hentai.com/?s=%query%',     spaceReplacement: '+' },
            { label: 'Google', url: 'https://www.google.com/search?q=%query%', spaceReplacement: '+' },
        ],
        states: {
            doujinshi: 'neutral',
            artistcg: 'neutral',
            manga: 'neutral',
            gamecg: 'neutral',
            imageset: 'neutral',
            anime: 'neutral',
            japanese: false,
            seriesFilter: false,
            activeExclusions: []
        }
    };

    function loadSettings() {
        try {
            const json = GM_getValue(STORAGE_KEY, null);
            let settings;
            if (!json) {
                settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
            } else {
                const saved = JSON.parse(json);
                settings = {
                    ...DEFAULT_SETTINGS,
                    ...saved,
                    states: { ...DEFAULT_SETTINGS.states, ...(saved.states || {}) },
                    excludeList: saved.excludeList || DEFAULT_SETTINGS.excludeList,
                    externalSites: (saved.externalSites || DEFAULT_SETTINGS.externalSites).map(site => ({
                        ...site,
                        spaceReplacement: site.spaceReplacement || '+' 
                    }))
                };
            }
            console.log('[Storage] Load:', settings);
            return settings;
        } catch (e) {
            console.error('Hitomi Filter Storage: Load error', e);
            return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        }
    }

    function _save(settings) {
        try {
            console.log('[Storage] Save:', settings);
            GM_setValue(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('Hitomi Filter Storage: Save error', e);
        }
    }

    function updateState(key, value) {
        const settings = loadSettings();
        if (!settings.syncMode) return;

        if (!settings.states) settings.states = {};
        settings.states[key] = value;
        _save(settings);
    }

    function updateAllStates(newStates) {
        const settings = loadSettings();
        if (!settings.syncMode) return;

        settings.states = { ...settings.states, ...newStates };
        _save(settings);
    }

    function updateConfig(newExcludeList, newExternalSites) {
        const settings = loadSettings();
        if(newExcludeList) settings.excludeList = newExcludeList;
        if(newExternalSites) settings.externalSites = newExternalSites;
        _save(settings);
    }

    function setSyncMode(isSyncOn) {
        const settings = loadSettings();
        settings.syncMode = isSyncOn;
        _save(settings);
    }

    // Storage-5.0.js 内に追加
    function updateLayoutMode(mode) {
        const settings = loadSettings();
        settings.layoutMode = mode;
        _save(settings);
    }

    // ★追加: グリッド列数を保存する関数
    function updateGridColumns(cols) {
        const settings = loadSettings();
        settings.gridColumns = parseInt(cols, 10);
        _save(settings);
    }

    // ★追加: サムネイル倍率を保存する関数
    function updateThumbnailScale(scale) {
        const settings = loadSettings();
        settings.thumbnailScale = parseFloat(scale);
        _save(settings);
    }

    window.HitomiFilterStorage = {
        loadSettings,
        updateState,
        updateAllStates,
        updateConfig,
        setSyncMode,
        updateLayoutMode, // 追加
        updateGridColumns, // ★追加
        updateThumbnailScale, // ★追加
        defaults: DEFAULT_SETTINGS
    };
})(window);