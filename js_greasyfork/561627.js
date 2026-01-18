// ==UserScript==
// @name         Hitomi.la Type Filter Logic
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  フィルタリングロジック、検索クエリの解析、状態の同期、外部サイトリンク生成、Series Filterの適用など、「計算・処理」に関する機能。
// ==/UserScript==

(function(window) {
    'use strict';

    if (typeof window.HitomiFilterStorage === 'undefined') {
        console.error('Hitomi.la Type Filter Logic: Storage library not loaded.');
        return;
    }
    const Storage = window.HitomiFilterStorage;

    // -------------------------------------------------------------------------
    //  State / Filter Logic
    // -------------------------------------------------------------------------

    function toggleState(btn, targetState) {
        const currentState = btn.dataset.state;
        setButtonVisual(btn, currentState === targetState ? 'neutral' : targetState);
    }

    function setButtonVisual(btn, state) {
        btn.dataset.state = state;
        btn.classList.remove('state-include', 'state-exclude');
        if (state === 'include') btn.classList.add('state-include');
        else if (state === 'exclude') btn.classList.add('state-exclude');
    }

    function toggleLanguage(lang) {
        const inputField = document.getElementById('query-input');
        if (!inputField) return;
        let currentVal = inputField.value;
        const langQuery = `language:${lang}`;
        const regex = new RegExp(`(^|\\s)${langQuery}(\\s|$)`, 'i');
        if (regex.test(currentVal)) {
            currentVal = currentVal.replace(regex, ' ').replace(/\s{2,}/g, ' ').trim();
        } else {
            currentVal = (currentVal.trim() + ' ' + langQuery).trim();
        }
        inputField.value = currentVal;
        inputField.dispatchEvent(new Event('input'));
    }

    function toggleExclusionTag(tagValue) {
        const inputField = document.getElementById('query-input');
        if (!inputField) return;
        let currentVal = inputField.value;
        const negativeTag = `-${tagValue}`;
        if (currentVal.includes(negativeTag)) {
            currentVal = currentVal.replace(negativeTag, '').replace(/\s{2,}/g, ' ').trim();
        } else {
            currentVal = (currentVal.trim() + ' ' + negativeTag).trim();
        }
        inputField.value = currentVal;
        inputField.dispatchEvent(new Event('input'));
    }

    // -------------------------------------------------------------------------
    //  Sync / Update Logic
    // -------------------------------------------------------------------------

    function updateSearchQuery() {
        const inputField = document.getElementById('query-input');
        let currentQuery = inputField.value;
        let tokens = currentQuery.split(/[\s\n]+/);
        let cleanTokens = tokens.filter(token => {
            const lower = token.toLowerCase();
            if (lower.startsWith('type:') || lower.startsWith('-type:')) return false;
            if (lower === 'or') return false;
            if (token.trim() === '') return false;
            return true;
        });
        const buttons = document.querySelectorAll('.type-filter-btn');
        let includes = [];
        let excludes = [];
        buttons.forEach(btn => {
            const state = btn.dataset.state;
            const type = btn.dataset.type;
            if (state === 'include') includes.push(`type:${type}`);
            else if (state === 'exclude') excludes.push(`-type:${type}`);
        });
        let newTypeString = "";
        if (includes.length > 0) newTypeString += includes.join(' or ');
        if (excludes.length > 0) {
            if (newTypeString.length > 0) newTypeString += " ";
            newTypeString += excludes.join(' ');
        }
        let finalQuery = cleanTokens.join(' ');
        if (finalQuery.length > 0 && newTypeString.length > 0) finalQuery += " " + newTypeString;
        else finalQuery += newTypeString;
        inputField.value = finalQuery;
        inputField.style.height = 'auto';
        inputField.style.height = (inputField.scrollHeight + 2) + 'px';
    }

    function syncButtonsFromInput() {
        const inputField = document.getElementById('query-input');
        if(!inputField) return;
        const query = inputField.value.toLowerCase();
        const buttons = document.querySelectorAll('.type-filter-btn');
        buttons.forEach(btn => {
            const type = btn.dataset.type;
            if (query.includes(`-type:${type}`)) setButtonVisual(btn, 'exclude');
            else if (query.includes(`type:${type}`)) setButtonVisual(btn, 'include');
            else setButtonVisual(btn, 'neutral');
        });
        const langBtn = document.querySelector('.tool-btn.lang-btn');
        if (langBtn) {
            if (query.includes('language:japanese')) langBtn.classList.add('active');
            else langBtn.classList.remove('active');
        }
    }

    function syncDropdownItems() {
        const inputField = document.getElementById('query-input');
        if (!inputField) return;
        const currentVal = inputField.value;
        const items = document.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            const val = item.dataset.value;
            const negativeTag = `-${val}`;
            if (currentVal.includes(negativeTag)) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    function saveCurrentButtonStates() {
        const buttons = document.querySelectorAll('.type-filter-btn');
        const newStates = {};
        buttons.forEach(btn => {
            newStates[btn.dataset.type] = btn.dataset.state;
        });
        const inputField = document.getElementById('query-input');
        if (inputField) {
            const val = inputField.value.toLowerCase();
            newStates['japanese'] = val.includes('language:japanese');
            const settings = Storage.loadSettings();
            const activeExclusions = [];
            settings.excludeList.forEach(tag => {
                const negativeTag = `-${tag}`.toLowerCase();
                if (val.includes(negativeTag)) {
                    activeExclusions.push(tag);
                }
            });
            newStates['activeExclusions'] = activeExclusions;
        }
        Storage.updateAllStates(newStates);
    }

    function restoreSearchFromStates(settings) {
        // settings が渡されていなければロードする (フォールバック)
        settings = settings || Storage.loadSettings();

        const inputField = document.getElementById('query-input');
        if (!inputField) return;
        const states = settings.states;
        let partsToAdd = [];
        let includes = [];
        let excludes = [];
        if (window.HitomiFilterUtils && window.HitomiFilterUtils.TYPE_BUTTONS) {
             window.HitomiFilterUtils.TYPE_BUTTONS.forEach(t => {
                const st = states[t.value];
                if (st === 'include') includes.push(`type:${t.value}`);
                if (st === 'exclude') excludes.push(`-type:${t.value}`);
            });
        }
        if (includes.length > 0) partsToAdd.push(includes.join(' or '));
        if (excludes.length > 0) partsToAdd.push(excludes.join(' '));
        if (states.japanese) partsToAdd.push('language:japanese');
        if (states.activeExclusions && Array.isArray(states.activeExclusions)) {
            states.activeExclusions.forEach(tag => {
                partsToAdd.push(`-${tag}`);
            });
        }
        if (partsToAdd.length === 0) return;
        let currentVal = inputField.value.trim();
        partsToAdd = partsToAdd.filter(part => !currentVal.includes(part));
        if (partsToAdd.length > 0) {
            if (currentVal.length > 0) {
                inputField.value = currentVal + ' ' + partsToAdd.join(' ');
            } else {
                inputField.value = partsToAdd.join(' ');
            }
        }
    }

    function cleanInputForSync() {
        const inputField = document.getElementById('query-input');
        if (!inputField) return;
        let tokens = inputField.value.split(/\s+/);
        const settings = Storage.loadSettings();
        const shouldRemove = (token) => {
            const lower = token.toLowerCase();
            if (lower.startsWith('type:') || lower.startsWith('-type:')) return true;
            if (lower === 'language:japanese') return true;
            if (lower === 'or') return true;
            return settings.excludeList.some(tag => lower === `-${tag}`.toLowerCase());
        };
        const newTokens = tokens.filter(t => !shouldRemove(t));
        inputField.value = newTokens.join(' ');
    }

    function resetUI() {
        cleanInputForSync();
        const inputField = document.getElementById('query-input');
        if(inputField) {
            inputField.value = inputField.value.replace(/\s{2,}/g, ' ').trim();
            inputField.style.height = 'auto';
            inputField.style.height = (inputField.scrollHeight + 2) + 'px';
        }
        syncButtonsFromInput();
        syncDropdownItems();
        resetSeriesFilter();
        const sBtn = document.querySelector('.series-filter-btn');
        if(sBtn) sBtn.classList.remove('active');
    }

    // -------------------------------------------------------------------------
    //  Series Filter Logic
    // -------------------------------------------------------------------------

    function applySeriesFilter() {
        const galleries = document.querySelectorAll('.gallery-content > div');
        galleries.forEach(gallery => {
            if (gallery.style.display === 'none') return;
            const rows = gallery.querySelectorAll('.dj-content table tr');
            let seriesName = 'N/A';
            rows.forEach(row => {
                const header = row.querySelector('td:first-child');
                if (header && header.textContent.includes('Series')) {
                    const seriesLink = row.querySelector('td:last-child a');
                    if (seriesLink) seriesName = seriesLink.textContent.trim();
                }
            });
            const isOriginal = seriesName.toLowerCase().includes('original');
            const isNA = seriesName === 'N/A';
            if (!isOriginal && !isNA) gallery.style.display = 'none';
        });
    }

    function resetSeriesFilter() {
        const galleries = document.querySelectorAll('.gallery-content > div');
        galleries.forEach(gallery => gallery.style.display = '');
    }

    // -------------------------------------------------------------------------
    //  External Search Links
    // -------------------------------------------------------------------------

    function createExternalLink(query, siteConfig) {
        const a = document.createElement('a');
        a.className = 'external-search-link';
        a.textContent = siteConfig.label;
        a.target = '_blank';
        const spaceChar = siteConfig.spaceReplacement || '+';
        const parts = query.trim().split(/\s+/);
        const safeQuery = parts.map(encodeURIComponent).join(spaceChar);
        a.href = siteConfig.url.replace('%query%', safeQuery);
        a.addEventListener('click', (e) => e.stopPropagation());
        return a;
    }

    function addExternalSearchButtons(settings) {
        settings = settings || Storage.loadSettings(); // ★変更: 引数 settings を追加

        const currentSites = Storage.loadSettings().externalSites;
        const appendLinks = (targetElement, queryText) => {
            if (!queryText) return;
            [...currentSites].reverse().forEach(site => {
                const existing = Array.from(targetElement.parentNode.querySelectorAll('.external-search-link'))
                                      .find(el => el.textContent === site.label);
                if (existing) return;
                const link = createExternalLink(queryText, site);
                if (targetElement.nextSibling) {
                    targetElement.parentNode.insertBefore(link, targetElement.nextSibling);
                } else {
                    targetElement.parentNode.appendChild(link);
                }
            });
        };
        const titleLink = document.querySelector('#gallery-brand a');
        if (titleLink) appendLinks(titleLink, titleLink.textContent.trim());
        const artistLinks = document.querySelectorAll('#artists a');
        artistLinks.forEach(link => appendLinks(link, link.textContent.trim()));
    }
    
    // -------------------------------------------------------------------------
    //  Layout Logic (New)
    // -------------------------------------------------------------------------
    
    // ★追加: 画面幅に応じたデフォルトのグリッド列数を返す関数
    function getDefaultGridColumns() {
        const width = window.innerWidth;
        if (width <= 767) return 3; // スマホ縦
        if (width <= 1024) return 4; // スマホ横・タブレット
        return 5; // PC
    }

    // ★変更: 初期値を固定の4ではなく、画面幅に合わせる
    let runtimeLayoutMode = 'list';
    let runtimeGridColumns = getDefaultGridColumns();

    // 初期化用
    function initLayout(settings) {
        settings = settings || Storage.loadSettings();
        
        if (settings.syncMode) {
            runtimeLayoutMode = (settings.ui && settings.ui.layoutMode) || 'list';
            // ★変更: 保存値がない場合は画面幅に合わせる
            runtimeGridColumns = (settings.ui && settings.ui.gridColumns) || getDefaultGridColumns();
        } else {
            // 同期OFFならデフォルト
            runtimeLayoutMode = 'list';
            // ★変更: 固定の4ではなく画面幅に合わせる
            runtimeGridColumns = getDefaultGridColumns();
        }
        
        reapplyCurrentLayout();
    }

    // ★変更: ユーザー操作によるレイアウト変更
    function applyLayout(mode) {
        // ランタイム値を更新
        runtimeLayoutMode = mode;
        
        // 適用
        reapplyCurrentLayout();

        // 保存 (Storage側でSyncチェックが入る)
        if (Storage.updateUI) {
            Storage.updateUI('layoutMode', mode);
        }
    }

    // ★追加: 現在のランタイム設定をDOMに適用する (MutationObserverからも使う)
    function reapplyCurrentLayout() {
        const container = document.querySelector('.gallery-content');
        if (!container) return;

        // クラスのリセットと適用
        container.classList.remove('layout-grid');
        if (runtimeLayoutMode === 'grid') {
            container.classList.add('layout-grid');
            // グリッド列数の適用
            applyGridColumns();
        }
    }

    // ★変更: グリッド列数の適用 (ランタイム値 vs ストレージ値の判断)
    function applyGridColumns(settings) {
        settings = settings || Storage.loadSettings();
        
        // 同期ONならストレージの値を正としてランタイムを更新
        // 同期OFFならランタイム値を維持（何もしない）
        if (settings.syncMode) {
            runtimeGridColumns = (settings.ui && settings.ui.gridColumns) || getDefaultGridColumns();
        }
        
        // CSS変数をセット (常に runtimeGridColumns を使う)
        document.documentElement.style.setProperty('--grid-cols', String(runtimeGridColumns));
    }

    // ★変更: ユーザー操作による列数変更
    function changeGridColumns(cols) {
        const val = parseInt(cols, 10);
        
        // ランタイム値を更新
        runtimeGridColumns = val;
        
        // 即時反映
        document.documentElement.style.setProperty('--grid-cols', String(val));
        
        // 保存 (Storage側でSyncチェックが入る)
        if (Storage.updateUI) {
            Storage.updateUI('gridColumns', val);
        }
    }

    // ★追加: 同期OFF切り替え時のリセット
    function resetLayoutSettings() {
        runtimeLayoutMode = 'list';
        reapplyCurrentLayout();
    }

    // ★変更: ブラックリストに含まれるタグをハイライト＆先頭へ移動＆強制表示する関数
    function highlightExcludedTags(settings) {
        settings = settings || Storage.loadSettings();
        const excludeList = settings.excludeList;
        if (!excludeList || excludeList.length === 0) return;

        const excludeSet = new Set(excludeList);
        
        const targetUls = document.querySelectorAll('.relatedtags ul:not(.htf-processed)');

        targetUls.forEach(ul => {
            ul.classList.add('htf-processed');

            const items = Array.from(ul.querySelectorAll('li'));
            const matchedItems = [];

            items.forEach(li => {
                const a = li.querySelector('a');
                if (!a) return;

                const href = decodeURIComponent(a.getAttribute('href'));
                const match = href.match(/\/tag\/(.+)-all\.html/);
                
                if (match) {
                    const tagName = match[1];
                    // ★追加: URL内のスペースをアンダースコアに変換したバージョンも作成
                    // (例: "dickgirl on female" -> "dickgirl_on_female")
                    const tagNameUnderscored = tagName.replace(/ /g, '_');
                    
                    // ブラックリストと照合 (オリジナル と アンダースコア版 の両方をチェック)
                    let isMatch = excludeSet.has(tagName) || excludeSet.has(tagNameUnderscored);
                    
                    if (!isMatch && !tagName.includes(':')) {
                        isMatch = excludeSet.has(`tag:${tagName}`) || excludeSet.has(`tag:${tagNameUnderscored}`);
                    }

                    if (isMatch) {
                        matchedItems.push(li);
                        li.classList.remove('hidden-list-item');
                        a.style.backgroundColor = '#c70000ff';
                    }
                }
            });

            for (let i = matchedItems.length - 1; i >= 0; i--) {
                ul.prepend(matchedItems[i]);
            }
        });
    }

    // ★新規追加: 強力なブラックリスト適用関数 (要素ごと削除/非表示)
    function applyStrongBlock(settings) {
        settings = settings || Storage.loadSettings();
        
        // ★追加: 無効化されている場合は、クラスを削除して終了
        const isEnabled = (settings.ui && settings.ui.strongBlockEnabled !== undefined) 
                          ? settings.ui.strongBlockEnabled 
                          : true; // デフォルトtrue

        if (!isEnabled) {
            document.querySelectorAll('.htf-hidden-strong').forEach(el => {
                el.classList.remove('htf-hidden-strong');
            });
            return;
        }

        const blockList = settings.strongBlockList;
        
        // リストが空でも、過去に非表示にしたものを再表示するために処理は続行する
        const blockSet = new Set(blockList || []);
        
        const galleries = document.querySelectorAll('.gallery-content > div');

        galleries.forEach(gallery => {
            // タグ情報の取得 (highlightExcludedTagsと同様のロジック)
            const ul = gallery.querySelector('.relatedtags ul');
            let shouldHide = false;

            if (ul && blockSet.size > 0) {
                const links = ul.querySelectorAll('a');
                for (const a of links) {
                    const href = decodeURIComponent(a.getAttribute('href'));
                    const match = href.match(/\/tag\/(.+)-all\.html/);
                    if (match) {
                        const tagName = match[1];
                        const tagNameUnderscored = tagName.replace(/ /g, '_');
                        
                        // マッチするか確認
                        if (blockSet.has(tagName) || 
                            blockSet.has(tagNameUnderscored) || 
                            blockSet.has(`tag:${tagName}`) || 
                            blockSet.has(`tag:${tagNameUnderscored}`)) {
                            shouldHide = true;
                            break; // 1つでもヒットすれば非表示確定
                        }
                    }
                }
            }

            // クラスの着脱で表示/非表示を切り替え
            if (shouldHide) {
                gallery.classList.add('htf-hidden-strong');
            } else {
                gallery.classList.remove('htf-hidden-strong');
            }
        });
    }

    // -------------------------------------------------------------------------
    //  Thumbnail Resizer Logic (Detail Page)
    // -------------------------------------------------------------------------

    // ★追加: 実行中の倍率を保持する変数 (初期値 1.0)
    // これにより、同期OFF中に操作した一時的な値を維持できる
    let runtimeScale = 1.0;

    function initThumbnailResizer(settings) {
        const containers = document.querySelectorAll('.thumbnail-container');
        if (containers.length === 0) return;
        
        containers.forEach(div => {
            if (div.dataset.origW) return;
            const wStr = div.style.width;
            const hStr = div.style.height;
            if (wStr && hStr) {
                div.dataset.origW = parseFloat(wStr);
                div.dataset.origH = parseFloat(hStr);
            }
        });
        
        settings = settings || Storage.loadSettings();
        
        // ★修正: 適用する倍率の決定ロジック
        let targetScale;
        
        if (settings.syncMode) {
            // 同期ON: ストレージの設定値を優先し、ランタイム値もそれに更新する
            // (OFF -> ON の復元時や、リロード時に保存値を適用するため)
            targetScale = (settings.ui && settings.ui.thumbnailScale) || 1.0;
            runtimeScale = targetScale; 
        } else {
            // 同期OFF: ストレージの値は無視し、現在のランタイム値を維持する
            // (これにより、MutationObserverで再描画されても、操作中の値が勝手に戻らなくなる)
            targetScale = runtimeScale;
        }
        
        applyThumbnailScale(targetScale);
        syncThumbnailSliderUI(targetScale);
    }

    function applyThumbnailScale(scale) {
        // ★追加: 適用された値をランタイム値として記憶
        runtimeScale = parseFloat(scale);

        const containers = document.querySelectorAll('.thumbnail-container');
        containers.forEach(div => {
            const w = parseFloat(div.dataset.origW);
            const h = parseFloat(div.dataset.origH);
            
            if (!isNaN(w) && !isNaN(h)) {
                div.style.width = (w * scale) + 'px';
                div.style.height = (h * scale) + 'px';
            }
        });
    }

    function syncThumbnailSliderUI(scale) {
        const slider = document.querySelector('.thumbnail-slider');
        const valDisplay = document.querySelector('.thumbnail-scale-val');
        
        if (slider) {
            let val;
            if (scale < 1.0) {
                val = Math.log2(scale);
            } else {
                val = Math.log(scale) / Math.log(3.4);
            }
            slider.value = val;
        }
        // valDisplay (倍率表示) は削除済みの仕様なら不要ですが、もし残っているならここで更新
    }

    // ★修正: リセット時はランタイム値も1.0に戻す
    function resetThumbnailSlider() {
        runtimeScale = 1.0;
        applyThumbnailScale(1.0);
        syncThumbnailSliderUI(1.0);
    }

    // -------------------------------------------------------------------------
    //  Grid Details Logic
    // -------------------------------------------------------------------------

    // 実行中の状態保持
    let runtimeShowGridDetails = false;

    function initGridDetails(settings) {
        settings = settings || Storage.loadSettings();
        
        if (settings.syncMode) {
            runtimeShowGridDetails = (settings.ui && settings.ui.showGridDetails) || false;
        } else {
            runtimeShowGridDetails = false;
        }
        
        applyGridDetails();
    }

    function toggleGridDetails(isActive) {
        runtimeShowGridDetails = isActive;
        applyGridDetails();
        
        // 保存
        if (Storage.updateUI) {
            Storage.updateUI('showGridDetails', isActive);
        }
    }

    function applyGridDetails() {
        // htmlタグにクラスを付与することで制御 (DOM書き換えに強い)
        if (runtimeShowGridDetails) {
            document.documentElement.classList.add('htf-show-grid-details');
        } else {
            document.documentElement.classList.remove('htf-show-grid-details');
        }
    }

    function resetGridDetails() {
        runtimeShowGridDetails = false;
        applyGridDetails();
        
        // ボタンの見た目もリセットする必要があるため、UI側でクラス操作が必要だが、
        // LogicからはDOM操作(クラス着脱)のみ行う。
        // ボタンのactiveクラス操作はUI側のイベントリスナーや保存時処理で行う。
        const btn = document.querySelector('.tool-btn.details-btn');
        if (btn) btn.classList.remove('active');
    }

    // --- 新規追加: 個別詳細ボタンの注入ロジック ---
    function injectDetailToggleButtons() {
        // グリッドレイアウトのカード要素を取得
        const cards = document.querySelectorAll('.gallery-content > div');
        
        cards.forEach(card => {
            const artistList = card.querySelector('.artist-list');
            if (!artistList) return;
            
            // 既にボタンがある場合はスキップ
            if (artistList.querySelector('.detail-toggle-btn')) return;
            
            const btn = document.createElement('div');
            btn.className = 'detail-toggle-btn';
            btn.title = 'Toggle Details';
            // Configのアコーディオンと同じパスを使用
            btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 親への伝播(作品リンク移動など)を阻止
                e.preventDefault();
                
                // カード要素にクラスをトグルして表示/非表示を切り替え
                card.classList.toggle('show-local-detail');
            });
            
            artistList.appendChild(btn);
        });
    }

    // グローバル公開
    window.HitomiFilterLogic = {
        toggleState,
        toggleLanguage,
        toggleExclusionTag,
        updateSearchQuery,
        syncButtonsFromInput,
        syncDropdownItems,
        saveCurrentButtonStates,
        restoreSearchFromStates,
        cleanInputForSync,
        resetUI,
        applySeriesFilter,
        resetSeriesFilter,
        addExternalSearchButtons,
        applyLayout,
        changeGridColumns,
        applyGridColumns,
        highlightExcludedTags,
        applyStrongBlock, // ★追加
        initThumbnailResizer,
        applyThumbnailScale,
        syncThumbnailSliderUI,
        resetThumbnailSlider,
        initLayout,           // ★追加
        reapplyCurrentLayout, // ★追加
        resetLayoutSettings,   // ★追加
        getDefaultGridColumns, // ★追加: UI側でも使うため公開
        initGridDetails,   // ★追加
        toggleGridDetails, // ★追加
        applyGridDetails,  // ★追加
        resetGridDetails,   // ★追加
        injectDetailToggleButtons // ★新規追加
    };
})(window);