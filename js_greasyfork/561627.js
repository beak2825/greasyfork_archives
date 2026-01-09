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

    function addExternalSearchButtons() {
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

    function applyLayout(mode) {
        const container = document.querySelector('.gallery-content');
        if (!container) return;

        container.classList.remove('layout-grid');

        if (mode === 'grid') {
            container.classList.add('layout-grid');
            // グリッドモードになったら列数を適用
            applyGridColumns();
        }

        if (Storage.updateLayoutMode) {
            Storage.updateLayoutMode(mode);
        }
    }

    // ★変更: ターゲットを「消えゆくgallery-content」から「不滅のdocumentElement」に変更
    function applyGridColumns() {
        const settings = Storage.loadSettings();
        const cols = settings.gridColumns || 4;
        
        // <html>タグにCSS変数をセットする。
        // これにより、gallery-contentがHitomiによって書き換えられても、
        // 設定値は維持され、自動的に継承される。
        document.documentElement.style.setProperty('--grid-cols', String(cols));
    }

    function changeGridColumns(cols) {
        const val = parseInt(cols, 10);
        
        // 永続化
        if (Storage.updateGridColumns) {
            Storage.updateGridColumns(val);
        }
        
        // 即時反映 (applyGridColumnsを呼ぶだけでOK)
        applyGridColumns();
    }

    // ★変更: ブラックリストに含まれるタグをハイライト＆先頭へ移動＆強制表示する関数
    function highlightExcludedTags() {
        const settings = Storage.loadSettings();
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

    // -------------------------------------------------------------------------
    //  Thumbnail Resizer Logic (Detail Page)
    // -------------------------------------------------------------------------

    // 初期化: 元のサイズを記録し、保存された倍率を適用する
    function initThumbnailResizer() {
        const containers = document.querySelectorAll('.thumbnail-container');
        if (containers.length === 0) return;
        
        containers.forEach(div => {
            // 既に記録済みならスキップ
            if (div.dataset.origW) return;
            
            // HTMLのstyle属性から元のサイズを取得 (例: width: 96.5px)
            const wStr = div.style.width;
            const hStr = div.style.height;
            
            if (wStr && hStr) {
                div.dataset.origW = parseFloat(wStr);
                div.dataset.origH = parseFloat(hStr);
            }
        });
        
        // 保存された設定を適用
        const settings = Storage.loadSettings();
        const scale = settings.thumbnailScale || 1.0;
        applyThumbnailScale(scale);
    }

    // 倍率を適用する関数
    function applyThumbnailScale(scale) {
        const containers = document.querySelectorAll('.thumbnail-container');
        containers.forEach(div => {
            const w = parseFloat(div.dataset.origW);
            const h = parseFloat(div.dataset.origH);
            
            if (!isNaN(w) && !isNaN(h)) {
                // 元の比率を維持したまま倍率を掛ける
                div.style.width = (w * scale) + 'px';
                div.style.height = (h * scale) + 'px';
            }
        });
    }

    // グローバル公開に追加
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
        applyGridColumns, // ★追加: Mainスクリプトから呼べるようにする
        highlightExcludedTags, // ★追加
        initThumbnailResizer, // ★追加
        applyThumbnailScale   // ★追加
    };
    
})(window);