// ==UserScript==
// @name Hitomi.la Type Filter Storage
// @namespace http://tampermonkey.net/
// @version 5.0
// @description Storage library for Hitomi.la Type Filter Buttons
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// ==/UserScript==
(function(window) {
    'use strict';

    // ★新規追加: jsonbin.io の設定
    // ここに取得した BIN_ID と API_KEY を入力してください
    const JSONBIN_CONFIG = {
        BIN_ID: "6976f6caae596e708ff65042",      // 例: "65a1b2..."
        API_KEY: "$2a$10$RGLr4Eo/GYLCm.lcxSYSUOQuCfiJwE5lrEw7/3mX2wfDWGs/FE/HK"  // 例: "$2a$10$..."
    };

    const STORAGE_KEY = 'hitomi_filter_settings_v6';
    
    // ★追加: メモリキャッシュ用変数
    let cachedSettings = null;

    const DEFAULT_SETTINGS = {
        syncMode: true,
        excludeList: [
            'tag:anthology',
            'tag:no_penetration',
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
            showGridDetails: false,
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

    // ★新規追加: クラウド保存・読み込みロジック
    function _saveCloudData(data) {
        return new Promise((resolve, reject) => {
            if (!JSONBIN_CONFIG.BIN_ID || !JSONBIN_CONFIG.API_KEY) {
                // 設定が空なら何もしない
                return resolve();
            }
            GM_xmlhttpRequest({
                method: "PUT",
                url: `https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.BIN_ID}`,
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": JSONBIN_CONFIG.API_KEY
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response);
                        console.log('[Cloud] Save:', response);
                    } else {
                        console.error('[Storage] Cloud Save Error:', response.statusText);
                        reject(new Error(`Save Error: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    console.error('[Storage] Cloud Network Error:', err);
                    reject(err);
                }
            });
        });
    }

    function _fetchCloudData() {
        return new Promise((resolve, reject) => {
            if (!JSONBIN_CONFIG.BIN_ID || !JSONBIN_CONFIG.API_KEY) {
                return resolve(null);
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.BIN_ID}`,
                headers: {
                    "X-Master-Key": JSONBIN_CONFIG.API_KEY
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const json = JSON.parse(response.responseText);
                            // Jsonbin v3 は "record" キーの中にデータが入っている
                            resolve(json.record);
                            console.log('[Cloud] fetch:', json.record);
                        } catch (e) {
                            reject(new Error("JSON Parse Error"));
                        }
                    } else {
                        console.error('[Storage] Cloud Load Error:', response.statusText);
                        reject(new Error(`Load Error: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    console.error('[Storage] Cloud Network Error:', err);
                    reject(err);
                }
            });
        });
    }

    // ★新規追加: クラウドからデータを取得してローカル設定を更新 (起動時用)
    async function syncFromCloud() {
        if (!JSONBIN_CONFIG.BIN_ID || !JSONBIN_CONFIG.API_KEY) return;
        try {
            // console.log('[Storage] Syncing from cloud...');
            const cloudData = await _fetchCloudData();
            if (cloudData) {
                const settings = loadSettings();
                let changed = false;

                // excludeList の同期
                if (Array.isArray(cloudData.excludeList)) {
                    settings.excludeList = cloudData.excludeList;
                    changed = true;
                }
                // strongBlockList の同期
                if (Array.isArray(cloudData.strongBlockList)) {
                    settings.strongBlockList = cloudData.strongBlockList;
                    changed = true;
                }

                if (changed) {
                    _save(settings); // ローカル保存 & キャッシュ更新
                    console.log('[Storage] Synced with cloud data.');
                }
            }
        } catch (e) {
            console.warn('[Storage] Sync skipped or failed:', e);
        }
    }

    // ★新規追加: 現在のローカル設定の一部をクラウドへアップロード (保存時用)
    async function syncToCloud() {
        if (!JSONBIN_CONFIG.BIN_ID || !JSONBIN_CONFIG.API_KEY) return;
        const settings = loadSettings();
        // 共有したいデータのみ抽出
        const dataToSave = {
            excludeList: settings.excludeList,
            strongBlockList: settings.strongBlockList
        };
        try {
            await _saveCloudData(dataToSave);
            console.log('[Storage] Uploaded to cloud.');
        } catch (e) {
            console.warn('[Storage] Upload failed:', e);
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

        // ★追加: 設定保存時にクラウドへも同期する (非同期実行)
        syncToCloud();
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
        syncFromCloud, // ★追加
        syncToCloud,   // ★追加
        defaults: DEFAULT_SETTINGS
    };
})(window);