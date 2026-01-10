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

    const STORAGE_KEY = 'hitomi_filter_settings_v6';
    
    // ★追加: メモリキャッシュ用変数
    let cachedSettings = null;

    const DEFAULT_SETTINGS = {
        syncMode: true,
        excludeList: [
            'tag:anthology',
            'male:shota',
            'male:urethra_insertion',
            'female:futanari',
            'female:dickgirl_on_female',
            'female:yuri',
            'female:scat',
            'female:anal_intercourse',
            'female:pregnant',
            'female:tentacles',
        ],
        strongBlockList: [
            'male:cuntboy',
            'male:yaoi',
            'male:males_only',
            'male:insect',
            'female:insect',
            'female:bestiality',
            'female:amputee',
            'female:vore',
            'female:guro',
            'female:eggs',
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
            activeExclusions: []
        },
        ui: {
            seriesFilter: false,
            layoutMode: 'list',
            gridColumns: 4,
            thumbnailScale: 1.0,
            strongBlockEnabled: true // ★追加: デフォルトON
        }
    };

    // ★追加: 別タブでの変更を検知してキャッシュを更新する (同期機能の維持)
    if (typeof GM_addValueChangeListener !== 'undefined') {
        GM_addValueChangeListener(STORAGE_KEY, (name, oldVal, newVal, remote) => {
            if (remote) { // 他のタブで変更された場合のみ
                console.log('[Storage] Sync from other tab');
                try {
                    cachedSettings = JSON.parse(newVal);
                } catch (e) {
                    cachedSettings = null; // エラー時はキャッシュ破棄して次回リロードさせる
                }
            }
        });
    }

    function loadSettings() {
        // エラーオブジェクトを生成し、そのスタックトレース（呼び出し履歴の文字列）を取得
        // const stack = new Error().stack;
        // const callerLine = stack.split('\n')[2].trim();
        // console.log('[Storage] loadSettings called from:', callerLine);

        // ★変更: キャッシュがあればそれを返す (高速化)
        if (cachedSettings) {
            // console.log('[Storage] Load from Cache', cachedSettings); // デバッグ用
            return cachedSettings;
        }

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
                    // ★追加: uiオブジェクトのマージ
                    ui: { ...DEFAULT_SETTINGS.ui, ...(saved.ui || {}) },
                    excludeList: saved.excludeList || DEFAULT_SETTINGS.excludeList,
                    externalSites: (saved.externalSites || DEFAULT_SETTINGS.externalSites).map(site => ({
                        ...site,
                        spaceReplacement: site.spaceReplacement || '+' 
                    }))
                };
            }
            // ★追加: 読み込んだ内容をキャッシュする
            cachedSettings = settings;
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
            // ★追加: 保存時にキャッシュも更新する
            cachedSettings = settings;
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

    // ★変更: strongBlockEnabled も受け取るように引数を追加
    function updateConfig(newExcludeList, newStrongBlockList, newExternalSites, newStrongBlockEnabled) {
        const settings = loadSettings();
        if(newExcludeList) settings.excludeList = newExcludeList;
        if(newStrongBlockList) settings.strongBlockList = newStrongBlockList;
        if(newExternalSites) settings.externalSites = newExternalSites;
        
        // ★追加: UI設定だがConfig画面で管理するためここで保存
        if(newStrongBlockEnabled !== undefined) {
            if (!settings.ui) settings.ui = {};
            settings.ui.strongBlockEnabled = newStrongBlockEnabled;
        }
        
        _save(settings);
    }

    function setSyncMode(isSyncOn) {
        const settings = loadSettings();
        settings.syncMode = isSyncOn;
        _save(settings);
    }

    // ★新規追加: UI設定を保存する汎用関数
    function updateUI(key, value) {
        const settings = loadSettings();
        if (!settings.syncMode) return; // Sync OFFなら保存しない
        
        if (!settings.ui) settings.ui = {};
        settings.ui[key] = value;
        _save(settings);
    }

    window.HitomiFilterStorage = {
        loadSettings,
        updateState,
        updateAllStates,
        updateConfig,
        setSyncMode,
        updateUI, // ★追加
        defaults: DEFAULT_SETTINGS
    };
})(window);