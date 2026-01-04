// ==UserScript==
// @name         そうだねソート
// @namespace    http://2chan.net/
// @version      1.0.0
// @description  ふたば掲示板のレスをそうだね順にソートしたりハイライトやフィルタ機能を追加する(過去ログサイト対応)
// @author       futaba
// @match        http://*.2chan.net/*/res/*
// @match        https://*.2chan.net/*/res/*
// @match        http://kako.futakuro.com/futa/*/*/
// @match        https://kako.futakuro.com/futa/*/*/
// @match        https://*.ftbucket.info/*/*/
// @match        https://tsumanne.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551504/%E3%81%9D%E3%81%86%E3%81%A0%E3%81%AD%E3%82%BD%E3%83%BC%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/551504/%E3%81%9D%E3%81%86%E3%81%A0%E3%81%AD%E3%82%BD%E3%83%BC%E3%83%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================
    // 定数定義
    // ========================================

    const DEFAULT_STATE = {
        sortOrder: 'original',
        enableFilter: false,
        minSodane: 1,
        highlightPositive: false,
        highlightNegative: false,
        highlightText: false,
        autoUpdate: false,
        updateInterval: 30,
        buttonPosition: 'center'
    };

    // フィルターベースのハイライト（相対的な色調整）
    const HIGHLIGHT_FILTERS = {
        positive: {
            high: 'brightness(1.08) saturate(1.08) contrast(1.00)',   // 10以上: 明るく鮮やか
            medium: 'brightness(1.04) saturate(1.04) contrast(1.00)', // 5-9: やや明るく
            low: 'brightness(1.02) saturate(1.02) contrast(1.00)'                    // 3-4: ほんのり明るく
        },
        negative: {
            zero: 'brightness(0.92) saturate(0.70) contrast(1.00)',   // 0: 暗く地味に
            low: 'brightness(0.96) saturate(0.85) contrast(1.00)'     // 1-2: やや暗く
        }
    };

    // テキストハイライトは絶対色指定（視認性重視）
    const TEXT_COLORS = {
        high: '#B00000',
        medium: '#C04000',
        low: '#A04000'
    };

    const SODANE_THRESHOLD = {
        HIGH: 10,
        MEDIUM: 5,
        LOW: 3
    };

    const UI_COLORS = {
        primary: '#800000',
        background: 'rgb(254, 255, 238)',
        border: '#800000'
    };

    const KAKOLOG_HOSTS = ['kako.futakuro.com', 'ftbucket.info', 'tsumanne.net'];
    const STORAGE_KEY = 'futaba_sodane_settings';
    const TIMING = {
        DOM_UPDATE_WAIT: 500,
        PANEL_CLICK_DELAY: 100
    };

    // ========================================
    // 状態管理
    // ========================================

    let state = { ...DEFAULT_STATE };
    let updateTimer = null;
    let isUpdating = false;

    // ========================================
    // ユーティリティ関数
    // ========================================

    function isKakologSite() {
        return KAKOLOG_HOSTS.some(host => location.hostname.includes(host));
    }

    function parseSodaneCount(text) {
        if (!text) return 0;
        const match = text.match(/そうだね[x×](\d+)/);
        if (match) return parseInt(match[1]);
        return text.trim() === '+' ? 0 : -1;
    }

    function formatSodaneCount(count) {
        return count === 0 ? '+' : `そうだねx${count}`;
    }

    function safeQuerySelector(selector, parent = document) {
        try {
            return parent.querySelector(selector);
        } catch (e) {
            return null;
        }
    }

    function safeQuerySelectorAll(selector, parent = document) {
        try {
            return parent.querySelectorAll(selector);
        } catch (e) {
            return [];
        }
    }

    /**
     * レス番号を取得（data-sno優先、フォールバックとしてid属性）
     */
    function getPostNumber(sodaneElement) {
        const dataSno = sodaneElement.getAttribute('data-sno');
        if (dataSno) return dataSno;

        const id = sodaneElement.getAttribute('id');
        if (id && id.startsWith('sd')) {
            return id.replace('sd', '');
        }

        return null;
    }

    // ========================================
    // コア機能
    // ========================================

    function getThreadContainer() {
        return safeQuerySelector('.thre');
    }

    function getAllPosts() {
        const posts = [];
        const sodaneMap = new Map();

        safeQuerySelectorAll('a.sod').forEach(sodane => {
            const postNum = getPostNumber(sodane);
            if (!postNum) return;

            const count = parseSodaneCount(sodane.textContent);
            if (count >= 0) {
                sodaneMap.set(postNum, count);
            }
        });

        const threDiv = getThreadContainer();
        if (!threDiv) return posts;

        safeQuerySelectorAll('table[border="0"]', threDiv).forEach(table => {
            const td = safeQuerySelector('td.rtd', table);
            const cno = safeQuerySelector('.cno', td);
            const postNum = cno?.textContent.replace('No.', '');

            if (!postNum) return;

            const sodaneCount = sodaneMap.get(postNum);
            let sodaneElement = safeQuerySelector(`a.sod[data-sno="${postNum}"]`, td);
            if (!sodaneElement) {
                sodaneElement = safeQuerySelector(`a.sod[id="sd${postNum}"]`, td);
            }

            posts.push({
                postNum: postNum,
                count: sodaneCount !== undefined ? sodaneCount : 0,
                element: table,
                sodaneElement: sodaneElement,
                td: td
            });
        });

        return posts;
    }

    /**
     * 個別のレスにハイライトを適用（フィルターベース）
     */
    function applyHighlightToPost(post) {
        if (!post.td) return;

        const count = post.count;

        // クリア
        post.td.style.filter = '';
        if (post.sodaneElement) {
            post.sodaneElement.style.color = '';
            post.sodaneElement.style.fontWeight = '';
        }

        // 背景フィルター（ポジティブ: 3以上）
        if (state.highlightPositive && count >= SODANE_THRESHOLD.LOW) {
            if (count >= SODANE_THRESHOLD.HIGH) {
                post.td.style.filter = HIGHLIGHT_FILTERS.positive.high;
            } else if (count >= SODANE_THRESHOLD.MEDIUM) {
                post.td.style.filter = HIGHLIGHT_FILTERS.positive.medium;
            } else {
                post.td.style.filter = HIGHLIGHT_FILTERS.positive.low;
            }
        }

        // 背景フィルター（ネガティブ: 0-2）
        if (state.highlightNegative && count <= 2) {
            if (count === 0) {
                post.td.style.filter = HIGHLIGHT_FILTERS.negative.zero;
            } else {
                post.td.style.filter = HIGHLIGHT_FILTERS.negative.low;
            }
        }

        // テキストハイライト（3以上、絶対色指定）
        if (state.highlightText && post.sodaneElement && count >= SODANE_THRESHOLD.LOW) {
            if (count >= SODANE_THRESHOLD.HIGH) {
                post.sodaneElement.style.color = TEXT_COLORS.high;
                post.sodaneElement.style.fontWeight = 'bold';
            } else if (count >= SODANE_THRESHOLD.MEDIUM) {
                post.sodaneElement.style.color = TEXT_COLORS.medium;
                post.sodaneElement.style.fontWeight = 'bold';
            } else {
                post.sodaneElement.style.color = TEXT_COLORS.low;
            }
        }
    }

    function cleanupDuplicateExtensionElements(element) {
        const titles = safeQuerySelectorAll('.userjs-title', element);
        if (titles.length > 1) {
            for (let i = 1; i < titles.length; i++) {
                titles[i].remove();
            }
        }

        const iframes = safeQuerySelectorAll('iframe[src*="youtube"]', element);
        if (iframes.length > 1) {
            for (let i = 1; i < iframes.length; i++) {
                const parent = iframes[i].parentElement;
                if (parent && parent.tagName === 'DIV' && parent.hasAttribute('*pageexpand*')) {
                    parent.remove();
                } else {
                    iframes[i].remove();
                }
            }
        }
    }

    function cleanupAllDuplicates() {
        const posts = getAllPosts();
        posts.forEach(post => {
            cleanupDuplicateExtensionElements(post.element);
        });
    }

    function applySettings(skipSort = false) {
        const posts = getAllPosts();
        if (posts.length === 0) return;

        // フィルタリング
        posts.forEach(post => {
            const shouldHide = state.enableFilter && post.count < state.minSodane;
            post.element.style.display = shouldHide ? 'none' : '';
        });

        // ハイライト
        posts.forEach(post => applyHighlightToPost(post));

        // ソート
        if (!skipSort) {
            sortPosts(posts);
        }
    }

    function sortPosts(posts) {
        const sorted = [...posts].sort((a, b) => {
            if (state.sortOrder === 'original') {
                return parseInt(a.postNum) - parseInt(b.postNum);
            }
            return (b.count - a.count) || (parseInt(a.postNum) - parseInt(b.postNum));
        });

        const threDiv = getThreadContainer();
        const firstTable = safeQuerySelector('table[border="0"]', threDiv);
        if (!threDiv || !firstTable) return;

        cleanupAllDuplicates();

        let insertAfter = firstTable;
        sorted.forEach(post => {
            threDiv.insertBefore(post.element, insertAfter.nextSibling);
            insertAfter = post.element;
        });
    }

    // ========================================
    // UI関連
    // ========================================

    function getButtonPositionStyle() {
        switch (state.buttonPosition) {
            case 'top':
                return 'top: 10px; transform: translateY(0);';
            case 'bottom':
                return 'bottom: 10px; top: auto; transform: translateY(0);';
            default:
                return 'top: 50%; transform: translateY(-50%);';
        }
    }

    function addMainButton() {
        const existing = document.getElementById('sodane-main-button');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'sodane-main-button';
        container.style.cssText = `
            position: fixed;
            right: 10px;
            z-index: 9999;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            ${getButtonPositionStyle()}
        `;

        container.innerHTML = `
            <div id="sodane-sort-toggle" style="padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.3);"></div>
            <div id="sodane-filter-toggle" style="display: flex; align-items: center; padding: 6px 10px;">
                <input type="checkbox" id="sodane-filter-checkbox" style="margin-right: 6px; cursor: pointer;">
                <span id="sodane-panel-opener">フィルタ</span>
            </div>
        `;

        document.body.appendChild(container);
        updateMainButtonAppearance();
        bindMainButtonEvents();
    }

    function bindMainButtonEvents() {
        const sortToggle = document.getElementById('sodane-sort-toggle');
        if (sortToggle) {
            sortToggle.onclick = () => {
                state.sortOrder = (state.sortOrder === 'desc') ? 'original' : 'desc';
                updateMainButtonAppearance();
                applySettings();
                saveSettings();
            };
        }

        const filterCheckbox = document.getElementById('sodane-filter-checkbox');
        if (filterCheckbox) {
            filterCheckbox.checked = state.enableFilter;
            filterCheckbox.onclick = (e) => {
                e.stopPropagation();
                state.enableFilter = filterCheckbox.checked;

                const panelCheckbox = document.getElementById('panel-filter-enable');
                if (panelCheckbox) panelCheckbox.checked = state.enableFilter;

                updateMainButtonAppearance();
                applySettings(true);
                saveSettings();
            };
        }

        const panelOpener = document.getElementById('sodane-panel-opener');
        if (panelOpener) {
            panelOpener.onclick = () => {
                const panel = document.getElementById('sodane-control-panel');
                if (panel) {
                    panel.remove();
                } else {
                    createControlPanel();
                }
            };
        }
    }

    function updateMainButtonAppearance() {
        const sortToggle = document.getElementById('sodane-sort-toggle');
        const filterToggle = document.getElementById('sodane-filter-toggle');
        if (!sortToggle || !filterToggle) return;

        sortToggle.textContent = 'そうだね順';
        if (state.sortOrder === 'desc') {
            sortToggle.style.backgroundColor = UI_COLORS.primary;
            sortToggle.style.color = 'white';
            sortToggle.style.border = `1px solid ${UI_COLORS.border}`;
        } else {
            sortToggle.style.backgroundColor = UI_COLORS.background;
            sortToggle.style.color = UI_COLORS.primary;
            sortToggle.style.border = `1px solid ${UI_COLORS.border}`;
        }

        if (state.enableFilter) {
            filterToggle.style.backgroundColor = UI_COLORS.primary;
            filterToggle.style.color = 'white';
            filterToggle.style.border = `1px solid ${UI_COLORS.border}`;
        } else {
            filterToggle.style.backgroundColor = UI_COLORS.background;
            filterToggle.style.color = UI_COLORS.primary;
            filterToggle.style.border = `1px solid ${UI_COLORS.border}`;
        }
    }

    function createControlPanel() {
        const existing = document.getElementById('sodane-control-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'sodane-control-panel';
        panel.style.cssText = `
            position: fixed;
            right: 130px;
            width: 340px;
            background: white;
            border: 2px solid ${UI_COLORS.primary};
            padding: 12px;
            z-index: 10000;
            font-family: sans-serif;
            font-size: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            border-radius: 5px;
            ${getButtonPositionStyle()}
        `;

        const isKakolog = isKakologSite();
        const disabledAttr = isKakolog ? 'disabled' : '';
        const kakoLogNote = isKakolog
            ? '<span style="font-size: 9px; color: #999;"> (過去ログ無効)</span>'
            : '<span id="update-status" style="font-size: 10px; color: #666; margin-left: 5px;"></span>';

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #ccc;">
                <strong style="font-size: 14px;">設定パネル</strong>
                <button id="close-panel" style="cursor: pointer; background: ${UI_COLORS.primary}; color: white; border: none; padding: 2px 8px; border-radius: 3px;">✕</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <div style="margin-bottom: 15px;">
                        <strong style="display: block; margin-bottom: 8px;">並び順</strong>
                        <label style="display: block; cursor: pointer;"><input type="radio" name="sort" value="original"> デフォルト</label>
                        <label style="display: block; cursor: pointer;"><input type="radio" name="sort" value="desc"> そうだね順</label>
                    </div>
                    <div>
                        <strong style="display: block; margin-bottom: 8px;">ハイライト</strong>
                        <label style="display: block; cursor: pointer;"><input type="checkbox" name="highlight" value="positive"> 背景+</label>
                        <label style="display: block; cursor: pointer;"><input type="checkbox" name="highlight" value="negative"> 背景-</label>
                        <label style="display: block; cursor: pointer;"><input type="checkbox" name="highlight" value="text"> そうだね色</label>
                    </div>
                </div>
                <div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: flex; align-items: center; cursor: pointer; white-space: nowrap;">
                            <input type="checkbox" id="panel-filter-enable">
                            <strong style="margin: 0 4px;">そうだね</strong>
                            <input type="number" id="panel-filter-value" min="0" style="width: 40px; margin-right: 4px;"> 未満を非表示
                        </label>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: flex; align-items: center; cursor: pointer; white-space: nowrap;">
                            <input type="checkbox" id="panel-autoupdate-enable" ${disabledAttr}>
                            <strong style="margin: 0 4px;">自動更新</strong>
                            <input type="number" id="panel-autoupdate-interval" min="10" style="width: 40px; margin-right: 4px;" ${disabledAttr}> 秒間隔
                        </label>
                        ${kakoLogNote}
                    </div>
                    <div>
                        <strong style="display: block; margin-bottom: 8px;">ボタン位置</strong>
                        <label style="display: block; cursor: pointer;"><input type="radio" name="button-position" value="top"> 右上</label>
                        <label style="display: block; cursor: pointer;"><input type="radio" name="button-position" value="center"> 右中央</label>
                        <label style="display: block; cursor: pointer;"><input type="radio" name="button-position" value="bottom"> 右下</label>
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 15px; border-top: 1px solid #ccc; padding-top: 10px;">
                <button id="re-apply-settings" style="flex: 3; padding: 6px; background: ${UI_COLORS.primary}; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 12px; font-weight: bold;">再適用</button>
                <button id="reset-settings" style="flex: 1; padding: 6px; background: #666; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 11px;">リセット</button>
            </div>
        `;

        document.body.appendChild(panel);
        bindPanelEvents();
        loadSettingsToPanel();
        setupPanelOutsideClick(panel);

        const closeBtn = document.getElementById('close-panel');
        if (closeBtn) {
            closeBtn.onclick = () => panel.remove();
        }

        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.onclick = resetSettings;
        }
    }

    function setupPanelOutsideClick(panel) {
        setTimeout(() => {
            function closeOnOutsideClick(e) {
                const mainButton = document.getElementById('sodane-main-button');
                if (!panel.contains(e.target) && !mainButton?.contains(e.target)) {
                    panel.remove();
                    document.removeEventListener('click', closeOnOutsideClick);
                }
            }
            document.addEventListener('click', closeOnOutsideClick);
        }, TIMING.PANEL_CLICK_DELAY);
    }

    // ========================================
    // イベント処理
    // ========================================

    function bindPanelEvents() {
        const applyAndSave = () => {
            applySettings();
            saveSettings();
        };

        const applyFilterOnly = () => {
            applySettings(true);
            saveSettings();
        };

        // 並び順
        safeQuerySelectorAll('input[name="sort"]').forEach(radio => {
            radio.onchange = () => {
                state.sortOrder = radio.value;
                updateMainButtonAppearance();
                applyAndSave();
            };
        });

        // ハイライト
        safeQuerySelectorAll('input[name="highlight"]').forEach(checkbox => {
            checkbox.onchange = () => {
                state.highlightPositive = safeQuerySelector('input[name="highlight"][value="positive"]')?.checked || false;
                state.highlightNegative = safeQuerySelector('input[name="highlight"][value="negative"]')?.checked || false;
                state.highlightText = safeQuerySelector('input[name="highlight"][value="text"]')?.checked || false;
                applyFilterOnly();
            };
        });

        // フィルタ
        const filterEnable = document.getElementById('panel-filter-enable');
        const filterValue = document.getElementById('panel-filter-value');

        if (filterEnable) {
            filterEnable.onchange = () => {
                state.enableFilter = filterEnable.checked;
                const mainCheckbox = document.getElementById('sodane-filter-checkbox');
                if (mainCheckbox) mainCheckbox.checked = state.enableFilter;
                updateMainButtonAppearance();
                applyFilterOnly();
            };
        }

        if (filterValue) {
            filterValue.oninput = () => {
                state.minSodane = parseInt(filterValue.value) || 0;
                if (state.enableFilter) {
                    applyFilterOnly();
                } else {
                    saveSettings();
                }
            };
        }

        // 自動更新
        const autoUpdateEnable = document.getElementById('panel-autoupdate-enable');
        const autoUpdateInterval = document.getElementById('panel-autoupdate-interval');

        if (autoUpdateEnable) {
            autoUpdateEnable.onchange = () => {
                state.autoUpdate = autoUpdateEnable.checked;
                toggleAutoUpdate();
                saveSettings();
            };
        }

        if (autoUpdateInterval) {
            autoUpdateInterval.oninput = () => {
                state.updateInterval = parseInt(autoUpdateInterval.value) || 30;
                if (state.autoUpdate) {
                    toggleAutoUpdate();
                }
                saveSettings();
            };
        }

        // ボタン位置
        safeQuerySelectorAll('input[name="button-position"]').forEach(radio => {
            radio.onchange = () => {
                state.buttonPosition = radio.value;
                addMainButton();
                const panel = document.getElementById('sodane-control-panel');
                if (panel) panel.remove();
                createControlPanel();
                saveSettings();
            };
        });

        // 再適用ボタン
        const reApplyBtn = document.getElementById('re-apply-settings');
        if (reApplyBtn) {
            reApplyBtn.onclick = () => {
                loadSettingsFromPanel();
                applyAndSave();
            };
        }
    }

    // ========================================
    // データ管理
    // ========================================

    function loadSettingsToPanel() {
        const sortRadio = safeQuerySelector(`input[name="sort"][value="${state.sortOrder}"]`);
        if (sortRadio) sortRadio.checked = true;

        const highlightPositive = safeQuerySelector('input[name="highlight"][value="positive"]');
        const highlightNegative = safeQuerySelector('input[name="highlight"][value="negative"]');
        const highlightText = safeQuerySelector('input[name="highlight"][value="text"]');
        if (highlightPositive) highlightPositive.checked = state.highlightPositive;
        if (highlightNegative) highlightNegative.checked = state.highlightNegative;
        if (highlightText) highlightText.checked = state.highlightText;

        const filterEnable = document.getElementById('panel-filter-enable');
        const filterValue = document.getElementById('panel-filter-value');
        if (filterEnable) filterEnable.checked = state.enableFilter;
        if (filterValue) filterValue.value = state.minSodane;

        const autoUpdateEnable = document.getElementById('panel-autoupdate-enable');
        const autoUpdateInterval = document.getElementById('panel-autoupdate-interval');
        if (autoUpdateEnable) autoUpdateEnable.checked = state.autoUpdate;
        if (autoUpdateInterval) autoUpdateInterval.value = state.updateInterval;

        const buttonPosRadio = safeQuerySelector(`input[name="button-position"][value="${state.buttonPosition}"]`);
        if (buttonPosRadio) buttonPosRadio.checked = true;
    }

    function loadSettingsFromPanel() {
        const sortRadio = safeQuerySelector('input[name="sort"]:checked');
        if (sortRadio) state.sortOrder = sortRadio.value;

        const highlightPositive = safeQuerySelector('input[name="highlight"][value="positive"]');
        const highlightNegative = safeQuerySelector('input[name="highlight"][value="negative"]');
        const highlightText = safeQuerySelector('input[name="highlight"][value="text"]');
        state.highlightPositive = highlightPositive?.checked || false;
        state.highlightNegative = highlightNegative?.checked || false;
        state.highlightText = highlightText?.checked || false;

        const filterEnable = document.getElementById('panel-filter-enable');
        const filterValue = document.getElementById('panel-filter-value');
        if (filterEnable) state.enableFilter = filterEnable.checked;
        if (filterValue) state.minSodane = parseInt(filterValue.value) || 0;

        const autoUpdateEnable = document.getElementById('panel-autoupdate-enable');
        const autoUpdateInterval = document.getElementById('panel-autoupdate-interval');
        if (autoUpdateEnable) state.autoUpdate = autoUpdateEnable.checked;
        if (autoUpdateInterval) state.updateInterval = parseInt(autoUpdateInterval.value) || 30;

        const buttonPosRadio = safeQuerySelector('input[name="button-position"]:checked');
        if (buttonPosRadio) state.buttonPosition = buttonPosRadio.value;
    }

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('設定の保存に失敗:', e);
        }
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                state = { ...DEFAULT_STATE, ...parsed };
            }
        } catch (e) {
            console.error('設定の読み込みに失敗:', e);
            state = { ...DEFAULT_STATE };
        }
    }

    function resetSettings() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            state = { ...DEFAULT_STATE };
            location.reload();
        } catch (e) {
            console.error('設定のリセットに失敗:', e);
        }
    }

    // ========================================
    // 自動更新機能
    // ========================================

    function toggleAutoUpdate() {
        if (updateTimer) {
            clearInterval(updateTimer);
            updateTimer = null;
        }

        if (state.autoUpdate && !isKakologSite()) {
            updateTimer = setInterval(fetchLatestSodane, state.updateInterval * 1000);
        }
    }

    async function fetchLatestSodane() {
        if (isUpdating) return;
        isUpdating = true;

        const statusEl = document.getElementById('update-status');
        if (statusEl) {
            statusEl.textContent = '更新中...';
            statusEl.style.color = '#0066cc';
        }

        try {
            const response = await fetch(location.href, { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            const html = new TextDecoder('shift_jis').decode(buffer);
            const doc = new DOMParser().parseFromString(html, 'text/html');

            // スレ落ちチェック
            const bodyText = doc.body.textContent || '';
            if (bodyText.includes('スレッドがありません') || bodyText.includes('Not Found')) {
                state.autoUpdate = false;
                toggleAutoUpdate();
                if (statusEl) {
                    statusEl.textContent = 'スレ落ち';
                    statusEl.style.color = '#cc0000';
                }
                return;
            }

            // サーバーから取得したそうだね要素をマップ化
            const newSodaneElementsMap = new Map();
            doc.querySelectorAll('a.sod').forEach(sodane => {
                const postNum = getPostNumber(sodane);
                if (!postNum) return;

                const count = parseSodaneCount(sodane.textContent);
                if (count >= 0) {
                    newSodaneElementsMap.set(postNum, {
                        count: count,
                        element: sodane.cloneNode(true)
                    });
                }
            });

            // 現在のページの全レスを走査
            let hasUpdates = false;
            const threDiv = getThreadContainer();
            if (!threDiv) return;

            safeQuerySelectorAll('table[border="0"]', threDiv).forEach(table => {
                const td = safeQuerySelector('td.rtd', table);
                if (!td) return;

                const cno = safeQuerySelector('.cno', td);
                const postNum = cno?.textContent.replace('No.', '');
                if (!postNum) return;

                // 既存のそうだね要素を検索
                let existingSodane = safeQuerySelector(`a.sod[data-sno="${postNum}"]`, td);
                if (!existingSodane) {
                    existingSodane = safeQuerySelector(`a.sod[id="sd${postNum}"]`, td);
                }

                const newSodaneData = newSodaneElementsMap.get(postNum);

                // サーバーにもクライアントにもそうだね要素が無い場合（投稿直後の新規レス）
                if (!newSodaneData && !existingSodane) {
                    // デフォルトのそうだね要素を作成（data-sno属性は設定しない）
                    const defaultSodane = document.createElement('a');
                    defaultSodane.className = 'sod';
                    defaultSodane.id = `sd${postNum}`;
                    defaultSodane.href = 'javascript:void(0);';
                    defaultSodane.rel = 'noreferrer';
                    defaultSodane.textContent = '+';

                    if (cno && cno.nextSibling) {
                        td.insertBefore(document.createTextNode(' '), cno.nextSibling);
                        td.insertBefore(defaultSodane, cno.nextSibling.nextSibling);
                    } else if (cno) {
                        td.appendChild(document.createTextNode(' '));
                        td.appendChild(defaultSodane);
                    }

                    hasUpdates = true;
                    return;
                }

                // サーバーにそうだね情報が無い場合はスキップ
                if (!newSodaneData) return;

                if (existingSodane) {
                    // 既存レス: そうだね数が変わっていれば更新
                    const currentCount = parseSodaneCount(existingSodane.textContent);
                    if (currentCount !== newSodaneData.count) {
                        existingSodane.textContent = formatSodaneCount(newSodaneData.count);
                        hasUpdates = true;
                    }
                } else {
                    // 新規レス: そうだね要素自体を挿入
                    const newSodaneElement = newSodaneData.element;

                    if (cno && cno.nextSibling) {
                        td.insertBefore(document.createTextNode(' '), cno.nextSibling);
                        td.insertBefore(newSodaneElement, cno.nextSibling.nextSibling);
                    } else if (cno) {
                        td.appendChild(document.createTextNode(' '));
                        td.appendChild(newSodaneElement);
                    }

                    hasUpdates = true;
                }
            });

            // DOM更新が完全に反映されるのを待ってから
            // 常にハイライトとフィルタを再適用（更新の有無に関わらず）
            setTimeout(() => {
                applySettings(true); // skipSort = true
                cleanupAllDuplicates();
            }, TIMING.DOM_UPDATE_WAIT);

            // ステータス更新
            if (statusEl) {
                const timeStr = new Date().toLocaleTimeString('ja-JP');
                statusEl.textContent = `最終更新: ${timeStr}`;
                statusEl.style.color = '#008000';
            }

        } catch (error) {
            console.error('自動更新エラー:', error);
            if (statusEl) {
                statusEl.textContent = '更新失敗';
                statusEl.style.color = '#cc0000';
            }
        } finally {
            isUpdating = false;
        }
    }

    // ========================================
    // 初期化
    // ========================================

    /**
     * MutationObserverでDOM変更を監視（リアルタイム削除）
     */
    function startDOMMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // タイトル要素の追加を検出して即座に重複削除
                        if (node.className?.includes('userjs-title')) {
                            const parent = node.closest('table[border="0"]');
                            if (parent) {
                                const titles = parent.querySelectorAll('.userjs-title');
                                if (titles.length > 1) {
                                    Array.from(titles).slice(1).forEach(t => t.remove());
                                }
                            }
                        }

                        // YouTube iframe重複も即削除
                        if (node.tagName === 'IFRAME' && node.src?.includes('youtube')) {
                            const parent = node.closest('table[border="0"]');
                            if (parent) {
                                const iframes = parent.querySelectorAll('iframe[src*="youtube"]');
                                if (iframes.length > 1) {
                                    Array.from(iframes).slice(1).forEach(iframe => {
                                        const iframeParent = iframe.parentElement;
                                        if (iframeParent && iframeParent.tagName === 'DIV' && iframeParent.hasAttribute('*pageexpand*')) {
                                            iframeParent.remove();
                                        } else {
                                            iframe.remove();
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * スクリプトの初期化
     */
    function initialize() {
        try {
            loadSettings();
            startDOMMutationObserver();
            addMainButton();
            applySettings();
            toggleAutoUpdate();
        } catch (e) {
            console.error('初期化エラー:', e);
        }
    }

    // ======================================
    // 他スクリプトとの競合を避け、確実に実行
    // ======================================

    // 即時実行関数で囲む（グローバル汚染防止）
    (function () {
        'use strict';

        // ページ構築が落ち着くまで少し待つ
        // （ふたば系など、赤福spや他の拡張と競合しないように）
        setTimeout(() => {
            try {
                initialize();
            } catch (e) {
                console.error('遅延初期化エラー:', e);
            }
        }, 2000); // ← 2秒は実戦的な安全マージン

    })();

})();