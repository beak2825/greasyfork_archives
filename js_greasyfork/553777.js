// ==UserScript==
// @name         Sxyprn Sorter Plus (Stable Version + Auto-Load Fix) - v27.0
// @namespace    urn:gemini:scripts:sxyprn-sorter
// @version      27.0.0
// @description  Versão original estável com as correções essenciais para o funcionamento do Auto-Load.
// @author       Gemini (baseado no script de sharmanhall) - Fixed by Assistant
// @match        *://sxyprn.com/*
// @match        *://*.sxyprn.com/*
// @icon         https://sxyprn.com/favicon.ico
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/553777/Sxyprn%20Sorter%20Plus%20%28Stable%20Version%20%2B%20Auto-Load%20Fix%29%20-%20v270.user.js
// @updateURL https://update.greasyfork.org/scripts/553777/Sxyprn%20Sorter%20Plus%20%28Stable%20Version%20%2B%20Auto-Load%20Fix%29%20-%20v270.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // SECTION 0: GERENCIAMENTO DE ESTADO E VARIÁVEIS GLOBAIS (Versão Original)
    // =================================================================================
    const scriptState = {
        includedTags: localStorage.getItem('ssp_includedTags') || '',
        excludedTags: localStorage.getItem('ssp_excludedTags') || '',
        excludedWords: localStorage.getItem('ssp_excludedWords') || '',
        fadeExcluded: localStorage.getItem('ssp_fadeExcluded') === 'true',
        presets: JSON.parse(localStorage.getItem('ssp_presets') || '{}')
    };

    let cachedExternalPlayer = null;
    let nativePlayerContainer = null;
    let externalPlayerContainer = null;
    let isExternalPlayerActive = false;
    let hlsScriptLoaded = false;
    let uiStyleElement = null;
    let processingMutation = false;
    let filterTimeout;
    let tagCountCache = null;
    let isAutoLoading = false;


    // =================================================================================
    // SECTION 1: LÓGICA DE FILTRAGEM E PERSISTÊNCIA (Versão Original)
    // =================================================================================
    function applyFilters() {
        localStorage.setItem('ssp_includedTags', scriptState.includedTags);
        localStorage.setItem('ssp_excludedTags', scriptState.excludedTags);
        localStorage.setItem('ssp_excludedWords', scriptState.excludedWords);
        localStorage.setItem('ssp_fadeExcluded', scriptState.fadeExcluded.toString());

        const includedTags = (scriptState.includedTags || '').toLowerCase().split(',').map(t => t.trim()).filter(Boolean);
        const excludedTags = (scriptState.excludedTags || '').toLowerCase().split(',').map(t => t.trim()).filter(Boolean);
        const excludedWords = (scriptState.excludedWords || '').toLowerCase().split(',').map(w => w.trim()).filter(Boolean);

        let hiddenCount = 0;
        const allPosts = document.querySelectorAll('.post_el_small:not(.post_el_post)');
        document.querySelectorAll('.hash_link.ssp-highlighted-tag').forEach(tag => tag.classList.remove('ssp-highlighted-tag'));

        allPosts.forEach(post => {
            const postTags = Array.from(post.querySelectorAll('.hash_link')).map(tag => tag.textContent.toLowerCase().replace('#', ''));
            const hasExcludedTag = excludedTags.some(exTag => postTags.includes(exTag));
            const hasIncludedTag = includedTags.length === 0 || includedTags.some(inTag => postTags.includes(inTag));

            const postFullText = post.textContent.toLowerCase();
            const hasForbiddenWord = excludedWords.length > 0 && excludedWords.some(word => postFullText.includes(word));

            post.classList.remove('ssp-faded-video');
            post.style.removeProperty('display');

            const shouldBeFaded = hasExcludedTag && scriptState.fadeExcluded && !hasForbiddenWord;
            const shouldBeHidden = hasForbiddenWord || (!hasIncludedTag) || (hasExcludedTag && !scriptState.fadeExcluded);

            if (shouldBeFaded) {
                post.classList.add('ssp-faded-video');
            } else if (shouldBeHidden) {
                post.style.setProperty('display', 'none', 'important');
            }

            const isVisible = !shouldBeHidden && !shouldBeFaded;
            if (isVisible && includedTags.length > 0) {
                post.querySelectorAll('.hash_link').forEach(tagEl => {
                    const tagText = tagEl.textContent.toLowerCase().replace('#', '');
                    if (includedTags.includes(tagText)) {
                        tagEl.classList.add('ssp-highlighted-tag');
                    }
                });
            }

            if (window.getComputedStyle(post).display === 'none') {
                hiddenCount++;
            }
        });

        const counterEl = document.getElementById('hiddenCounter');
        if (counterEl) counterEl.textContent = hiddenCount > 0 ? `${hiddenCount} videos hidden` : '';
    }

    function debouncedApplyFilters() {
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(applyFilters, 300);
    }

    // =================================================================================
    // SECTION 2: ESTILOS E PROCESSAMENTO DE CARDS (Versão Original)
    // =================================================================================
    function applyUiStyles(enable) {
        if (uiStyleElement) {
            uiStyleElement.remove();
            uiStyleElement = null;
        }
        if (enable) {
            const enhancedUI_CSS = `
                .sharing_toolbox, .splitter, #center_control .ctrl_el[style*="display: none;"] { display: none; } .next_page, .back_to, .show_more, .mysums_blog, .block_header { border: none; background: none; } #top_panel { padding: 20px 0; } .main_footer { text-align: center; border: none; margin: 36px 0 26px; } .search_container { max-width: 1824px; margin: 0 auto 15px auto; padding: 0 20px; box-sizing: border-box; } .search_container .blog_sort_div { margin-left: auto; } .emoji_zone { display: none !important; } .ssp-grid-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; } body:not(.post-page) #wrapper_div, body.post-page #wrapper_div { max-width: 1824px; width: 100%; margin: 0 auto !important; padding: 0 20px; box-sizing: border-box; } body:not(.post-page) .post_el_small { width: 510px !important; height: 421px !important; margin: 0 !important; display: flex !important; flex-direction: column !important; background: #1a1a1a; border-radius: 4px; overflow: hidden; } body:not(.post-page) .post_el_small > .post_text { flex-grow: 1; min-height: 40px; overflow-y: auto; padding: 5px 10px; } body.post-page .post_el_post.post_el_small { width: 100% !important; max-width: 100% !important; margin: 0 !important; } body.post-page .post_el_post.post_el_small #vid_container_id, body.post-page .post_el_post.post_el_small { width: 100%; max-width: 100%; margin: 0; } body.post-page .post_el_small:not(.post_el_post) { width: 510px !important; height: 421px !important; margin: 0 !important; display: flex !important; flex-direction: column !important; background: #1a1a1a; border-radius: 4px; overflow: hidden; } body.post-page .post_el_small:not(.post_el_post) > .post_text { flex-grow: 1; min-height: 40px; overflow-y: auto; padding: 5px 10px; } body.post-page .post_el_post .vid_container { height: auto !important; } .vid_container { min-height: 333px; width: 100%; background: #000; position: relative; } .post_vid_thumb { width: 100% !important; height: 100% !important; margin: 0 auto !important; position: relative; } .post_vid_thumb > a { display: block; width: 100%; height: 100%; position: relative; }
                .ssp-grid-container .post_vid_thumb { margin-left: 0 !important; }
                .ssp-grid-container .poster_di_div { display: none !important; }
                .mini_post_vid_thumb, .hvp_player { width: 100%; height: 100%; object-fit: cover; }
                #ssp-external-player-video { background-color: #000; } .shd_small, .duration_small { position: absolute !important; z-index: 2; } .shd_small { top: 5px; left: 5px; } .duration_small { top: 5px; right: 5px; } .post_el_small_subcat { position: absolute; top: 8px; right: 8px; z-index: 2;} .ssp-faded-video { opacity: 0.2; transition: opacity 0.3s ease; } .ssp-faded-video:hover { opacity: 1; } .hash_link.ssp-highlighted-tag { background-color: #007bff !important; color: white !important; padding: 2px 5px; border-radius: 3px; } .ssp-pip-button { position: absolute; bottom: 5px; left: 5px; z-index: 10; background: rgba(0,0,0,0.6); color: white; border: 1px solid white; border-radius: 4px; padding: 3px 6px; font-size: 11px; cursor: pointer; opacity: 0; transition: opacity 0.2s; } .post_el_small:hover .ssp-pip-button { opacity: 0.8; } .ssp-pip-button:hover { opacity: 1; }
                #ssp-external-player-container { display: none; position: relative; } #ssp-external-player-iframe { width: 100%; height: 100%; border: none; }
            `;
            uiStyleElement = GM_addStyle(enhancedUI_CSS);
        }
    }
    function toggleCustomStyles(enable) { localStorage.setItem('ssp_customStylesEnabled', enable.toString()); applyUiStyles(enable); }
    function wrapAndProcessPosts(scope = document) { const potentialGridParents = scope.querySelectorAll('.main_content > .block_header, .search_results'); potentialGridParents.forEach(gridParent => { const postsToWrap = Array.from(gridParent.querySelectorAll(':scope > .post_el_small')); if (postsToWrap.length > 0 && !gridParent.querySelector('.ssp-grid-container')) { const gridContainer = document.createElement('div'); gridContainer.className = 'ssp-grid-container'; postsToWrap.forEach(post => gridContainer.appendChild(post)); gridParent.appendChild(gridContainer); } }); if (document.body.classList.contains('post-page')) { scope.querySelectorAll('*').forEach(element => { const recommendedPosts = Array.from(element.querySelectorAll(':scope > .post_el_small:not(.post_el_post)')); if (recommendedPosts.length > 0 && !element.querySelector(':scope > .ssp-grid-container')) { const gridContainer = document.createElement('div'); gridContainer.className = 'ssp-grid-container'; recommendedPosts.forEach(post => gridContainer.appendChild(post)); element.appendChild(gridContainer); } }); } const posts = scope.querySelectorAll('.post_el_small:not([data-ssp-processed])'); posts.forEach(post => { post.setAttribute('data-ssp-processed', 'true'); if ('pictureInPictureEnabled' in document) { const container = post.querySelector('.vid_container'); if (container && !container.querySelector('.ssp-pip-button')) { const pipButton = document.createElement('button'); pipButton.textContent = 'PiP'; pipButton.className = 'ssp-pip-button'; pipButton.onclick = (e) => { e.preventDefault(); e.stopPropagation(); const video = post.querySelector('video.hvp_player, video.player_el, #ssp-external-player-video'); if (video) { if (document.pictureInPictureElement) { document.exitPictureInPicture().catch(err => console.error("SSP PiP Error:", err)); } else { video.requestPictureInPicture().catch(err => console.error("SSP PiP Error:", err)); } } }; container.appendChild(pipButton); } } }); tagCountCache = null; applyFilters(); }
    const mutationObserver = new MutationObserver(() => { if (processingMutation) return; processingMutation = true; if (!document.getElementById('sxyprn-plus-controls')) { main(); } else { wrapAndProcessPosts(document); } setTimeout(() => { processingMutation = false; }, 150); });

    // =================================================================================
    // SECTION 3: INICIALIZAÇÃO E UI (Versão Original)
    // =================================================================================
    function main() { if (window.location.pathname.startsWith('/post/')) { document.body.classList.add('post-page'); } addControls(); applyUiStyles(loadPreference('ssp_customStylesEnabled', 'true') === 'true'); wrapAndProcessPosts(document); }
    function loadPreference(key, defaultValue) { const saved = localStorage.getItem(key); return saved === null ? defaultValue : saved; }
    function addControls() { const targetContainer = document.querySelector('.search_results, .main_content'); if (!targetContainer || document.getElementById('sxyprn-plus-controls')) return; injectUI(targetContainer); setupEventListeners(); initializeUIState(); }

    function injectUI(targetContainer) {
        const controlContainer = document.createElement('div');
        controlContainer.id = 'sxyprn-plus-controls';
        controlContainer.style.cssText = `background: #2c2c2c; padding: 12px; margin-bottom: 15px; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; border: 1px solid #444;`;
        controlContainer.innerHTML = `
            <div style="display: flex; gap: 8px; align-items: center; padding-right: 10px; border-right: 1px solid #555;"><label class="ssp-label">Sort by:</label><button id="sortLikes" class="control-btn sort-btn">Likes</button><button id="sortOrgasmic" class="control-btn sort-btn">Orgasmic</button><button id="sortPlaylist" class="control-btn sort-btn">Playlist</button><button id="sortViews" class="control-btn sort-btn">Views</button><button id="resetSort" class="control-btn reset-btn">Reset</button></div>
            <div style="display: flex; gap: 8px; align-items: center;"><label class="ssp-label">Include:</label><input type="text" id="includeTagFilterInput" placeholder="Tags para mostrar..." class="ssp-input"></div>
            <div style="display: flex; gap: 8px; align-items: center;"><label class="ssp-label">Exclude:</label><input type="text" id="excludeTagFilterInput" placeholder="Tags para esconder..." class="ssp-input"></div>
            <div style="display: flex; gap: 8px; align-items: center;"><button id="openIncludeTagFilterModal" class="control-btn action-btn">Select</button><button id="openExcludeTagFilterModal" class="control-btn action-btn">Select</button></div>
            <div style="display: flex; gap: 8px; align-items: center; padding-right: 10px; border-right: 1px solid #555;"><label class="ssp-label" style="cursor: pointer;"><input type="checkbox" id="fadeExcludedToggle">Atenuar</label><button id="clearAllFilters" class="control-btn reset-btn">Limpar</button><span id="hiddenCounter" style="color: #ffc107; font-size: 13px; font-weight: bold;"></span></div>
            <div style="display: flex; gap: 8px; align-items: center;"><label class="ssp-label">Exclude Words:</label><input type="text" id="excludedWordsInput" placeholder="Palavras-chave para esconder vídeos..." class="ssp-input"></div>
            <div style="display: flex; gap: 8px; align-items: center; padding-right: 10px; border-right: 1px solid #555;"><label class="ssp-label">Presets:</label><select id="presetSelector" class="ssp-input" style="width: 120px;"></select><input type="text" id="presetNameInput" placeholder="Nome do Preset..." class="ssp-input" style="width: 120px;"><button id="savePresetBtn" class="control-btn action-btn">Salvar</button><button id="deletePresetBtn" class="control-btn reset-btn">X</button></div>
            <div style="display: flex; gap: 8px; align-items: center; padding-right: 10px; border-right: 1px solid #555;"><label class="ssp-label">Auto-load:</label><input type="number" id="autoLoadPages" min="1" max="100" value="3" style="padding: 6px; border-radius: 4px; border: none; background: white; width: 60px; text-align: center;"><button id="autoLoadBtn" class="control-btn action-btn">Carregar</button><span id="autoLoadStatus" style="color: #ccc; font-size: 12px;"></span></div>
            <div style="display: flex; gap: 15px; align-items: center;"><label class="ssp-label" style="cursor: pointer;"><input type="checkbox" id="customStylesToggle"> Enhanced UI</label></div>
            <div id="ssp-external-player-container-placeholder" style="display: flex; gap: 8px; align-items: center; margin-left: auto;"><button id="ssp-external-player-btn" class="control-btn action-btn">Verificar Player Externo</button></div>`;
        targetContainer.parentNode.insertBefore(controlContainer, targetContainer);

        const modal = document.createElement('div');
        modal.id = 'sspTagModal';
        modal.className = 'ssp-modal-backdrop';
        modal.innerHTML = `<div class="ssp-modal-content"><div class="ssp-modal-header"><span id="sspModalTitle">Select Tags</span><span class="ssp-modal-close">&times;</span></div><div class="ssp-modal-body"></div><div class="ssp-modal-footer"><button id="applyModalFilter" class="control-btn action-btn">Apply & Close</button></div></div>`;
        document.body.appendChild(modal);

        GM_addStyle(`
            .control-btn { padding: 6px 12px; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; transition: background-color 0.2s; }
            .control-btn.stop-btn { background: #ffc107; color: black; }
            .control-btn.stop-btn:hover { background: #e0a800; }
            .sort-btn { background: #007bff; } .sort-btn:hover { background: #0056b3; } .action-btn { background: #17a2b8; } .action-btn:hover { background: #117a8b; } .reset-btn { background: #dc3545; } .reset-btn:hover { background: #c82333; }
            .sort-btn.active { background: #0056b3; font-weight: bold; box-shadow: 0 0 5px rgba(255,255,255,0.5); }
            .ssp-label { color: white; font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 5px; }
            .ssp-input { padding: 6px 8px; border-radius: 4px; border: 1px solid #555; background: #333; color: white; width: 150px; }
            .ssp-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: none; } .ssp-modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2c2c2c; border: 1px solid #555; border-radius: 8px; width: 80%; max-width: 800px; max-height: 80vh; display: flex; flex-direction: column; } .ssp-modal-header { padding: 15px; border-bottom: 1px solid #555; color: white; font-size: 18px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; } .ssp-modal-close { cursor: pointer; font-size: 24px; line-height: 1; } .ssp-modal-body { padding: 15px; overflow-y: auto; display: flex; flex-wrap: wrap; gap: 8px; } .ssp-modal-tag { background: #555; color: white; padding: 5px 10px; border-radius: 15px; cursor: pointer; transition: background-color 0.2s; user-select: none; } .ssp-modal-tag:hover { background: #777; } .ssp-modal-tag.selected { background: #007bff; font-weight: bold; } .ssp-modal-footer { padding: 15px; border-top: 1px solid #555; text-align: right; }
        `);
    }

    function setupEventListeners() {
        document.getElementById('includeTagFilterInput').addEventListener('input', e => { scriptState.includedTags = e.target.value; debouncedApplyFilters(); });
        document.getElementById('excludeTagFilterInput').addEventListener('input', e => { scriptState.excludedTags = e.target.value; debouncedApplyFilters(); });
        document.getElementById('excludedWordsInput').addEventListener('input', e => { scriptState.excludedWords = e.target.value; debouncedApplyFilters(); });
        document.getElementById('clearAllFilters').addEventListener('click', clearAllFilters);
        const fadeToggle = document.getElementById('fadeExcludedToggle');
        fadeToggle.checked = scriptState.fadeExcluded;
        fadeToggle.addEventListener('change', e => { scriptState.fadeExcluded = e.target.checked; applyFilters(); });

        const modal = document.getElementById('sspTagModal');
        document.getElementById('openIncludeTagFilterModal').addEventListener('click', () => openFilterModal('include'));
        document.getElementById('openExcludeTagFilterModal').addEventListener('click', () => openFilterModal('exclude'));
        document.getElementById('applyModalFilter').addEventListener('click', () => { updateStateFromModal(); modal.style.display = 'none'; });
        modal.querySelector('.ssp-modal-close').addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

        const customStylesToggle = document.getElementById('customStylesToggle');
        customStylesToggle.checked = loadPreference('ssp_customStylesEnabled', 'true') === 'true';
        customStylesToggle.addEventListener('change', e => toggleCustomStyles(e.target.checked));

        document.getElementById('savePresetBtn').addEventListener('click', savePreset);
        document.getElementById('deletePresetBtn').addEventListener('click', deletePreset);
        document.getElementById('presetSelector').addEventListener('change', loadPreset);

        if (document.body.classList.contains('post-page')) {
            addExternalPlayerButton();
        } else {
            document.getElementById('sortLikes').addEventListener('click', () => sortPosts('likes'));
            document.getElementById('sortOrgasmic').addEventListener('click', () => sortPosts('orgasmic'));
            document.getElementById('sortPlaylist').addEventListener('click', () => sortPosts('playlist'));
            document.getElementById('sortViews').addEventListener('click', () => sortPosts('views'));
            document.getElementById('resetSort').addEventListener('click', resetSort);
            document.getElementById('autoLoadBtn').addEventListener('click', handleAutoLoadClick);
        }
    }

    function initializeUIState() {
        document.getElementById('includeTagFilterInput').value = scriptState.includedTags;
        document.getElementById('excludeTagFilterInput').value = scriptState.excludedTags;
        document.getElementById('excludedWordsInput').value = scriptState.excludedWords;
        updatePresetSelector();

        if (document.body.classList.contains('post-page')) {
            ['sortLikes', 'sortOrgasmic', 'sortPlaylist', 'sortViews', 'resetSort', 'autoLoadPages', 'autoLoadBtn'].forEach(id => {
                const el = document.getElementById(id);
                if (el) (el.closest('div')).style.display = 'none';
            });
        } else {
            const playerBtnContainer = document.getElementById('ssp-external-player-container-placeholder');
            if (playerBtnContainer) playerBtnContainer.style.display = 'none';
        }
    }

    function savePreset() { const name = document.getElementById('presetNameInput').value.trim(); if (!name) { alert('Por favor, insira um nome para o preset.'); return; } scriptState.presets[name] = { included: document.getElementById('includeTagFilterInput').value, excluded: document.getElementById('excludeTagFilterInput').value, excludedWords: document.getElementById('excludedWordsInput').value }; localStorage.setItem('ssp_presets', JSON.stringify(scriptState.presets)); updatePresetSelector(name); document.getElementById('presetNameInput').value = ''; }
    function loadPreset() { const name = document.getElementById('presetSelector').value; if (!name || !scriptState.presets[name]) return; const preset = scriptState.presets[name]; scriptState.includedTags = preset.included || ''; scriptState.excludedTags = preset.excluded || ''; scriptState.excludedWords = preset.excludedWords || ''; document.getElementById('includeTagFilterInput').value = scriptState.includedTags; document.getElementById('excludeTagFilterInput').value = scriptState.excludedTags; document.getElementById('excludedWordsInput').value = scriptState.excludedWords; applyFilters(); }
    function deletePreset() { const selector = document.getElementById('presetSelector'); const name = selector.value; if (!name || !scriptState.presets[name]) return; if (confirm(`Tem certeza que deseja excluir o preset "${name}"?`)) { delete scriptState.presets[name]; localStorage.setItem('ssp_presets', JSON.stringify(scriptState.presets)); updatePresetSelector(); } }
    function updatePresetSelector(selectedName = '') { const selector = document.getElementById('presetSelector'); selector.innerHTML = '<option value="">Carregar Preset...</option>'; Object.keys(scriptState.presets).sort().forEach(name => { const option = document.createElement('option'); option.value = name; option.textContent = name; selector.appendChild(option); }); if (selectedName) selector.value = selectedName; }

    let activeModalTarget = null;
    function openFilterModal(target) { activeModalTarget = target; const modal = document.getElementById('sspTagModal'); const modalBody = modal.querySelector('.ssp-modal-body'); modal.querySelector('#sspModalTitle').textContent = target === 'include' ? 'Select Tags to Include' : 'Select Tags to Exclude'; modalBody.innerHTML = '<em>Carregando e contando tags...</em>'; modal.style.display = 'block'; setTimeout(() => { if (tagCountCache) { populateModalBody(tagCountCache, target); } else { const tagCounts = new Map(); document.querySelectorAll('.post_el_small:not(.post_el_post)').forEach(post => { if (window.getComputedStyle(post).display === 'none') return; const postTags = new Set(Array.from(post.querySelectorAll('.hash_link')).map(tagEl => tagEl.textContent.toLowerCase().replace('#', '').trim())); postTags.forEach(tag => { if (tag) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1); }); }); tagCountCache = tagCounts; populateModalBody(tagCountCache, target); } }, 50); }
    function populateModalBody(tagCounts, target) { const modalBody = document.querySelector('#sspTagModal .ssp-modal-body'); const sortedTags = Array.from(tagCounts.keys()).sort(); const currentTags = (target === 'include' ? scriptState.includedTags : scriptState.excludedTags).toLowerCase().split(',').map(t => t.trim()); modalBody.innerHTML = ''; sortedTags.forEach(tag => { const tagEl = document.createElement('span'); tagEl.className = 'ssp-modal-tag'; tagEl.textContent = `${tag} (${tagCounts.get(tag)})`; tagEl.dataset.tag = tag; if (currentTags.includes(tag)) tagEl.classList.add('selected'); tagEl.addEventListener('click', () => tagEl.classList.toggle('selected')); modalBody.appendChild(tagEl); }); }
    function updateStateFromModal() { if (!activeModalTarget) return; const modalBody = document.querySelector('#sspTagModal .ssp-modal-body'); const selectedTags = Array.from(modalBody.querySelectorAll('.ssp-modal-tag.selected')).map(t => t.dataset.tag).join(', '); const targetInput = document.getElementById(activeModalTarget === 'include' ? 'includeTagFilterInput' : 'excludeTagFilterInput'); if (targetInput) targetInput.value = selectedTags; if (activeModalTarget === 'include') { scriptState.includedTags = selectedTags; } else { scriptState.excludedTags = selectedTags; } applyFilters(); }

    function clearAllFilters() {
        scriptState.includedTags = '';
        scriptState.excludedTags = '';
        document.getElementById('includeTagFilterInput').value = '';
        document.getElementById('excludeTagFilterInput').value = '';
        applyFilters();
    }

    function sortPosts(type) { const gridContainers = document.querySelectorAll('.ssp-grid-container'); if (gridContainers.length === 0) return; gridContainers.forEach(gridContainer => { const posts = Array.from(gridContainer.querySelectorAll('.post_el_small')); if (posts.length === 0) return; if (!gridContainer.hasAttribute('data-original-order-saved')) { gridContainer.setAttribute('data-original-order-saved', 'true'); const originalOrderData = posts.map(post => post.outerHTML); gridContainer.setAttribute('data-original-order', JSON.stringify(originalOrderData)); } const getValue = (post, type) => { const selectors = { 'likes': ['.vid_like_blog_hl', '.likes_count', '[class*="likes"]'], 'orgasmic': ['.tm_orgasmic_hl', '.orgasmic_count', '[class*="orgasmic"]'], 'playlist': ['.tm_playlist_hl', '.playlist_count', '[class*="playlist"]'], 'views': ['.post_control_time', '.post_views', '.views_count'] }; for (const selector of selectors[type] || []) { const element = post.querySelector(selector); if (element) { const text = element.textContent.trim(); const match = text.match(/(\d{1,3}(,\d{3})*|\d+)/); if (match) return parseInt(match[0].replace(/,/g, ''), 10); } } return 0; }; posts.sort((a, b) => getValue(b, type) - getValue(a, type)); posts.forEach(post => gridContainer.appendChild(post)); }); updateButtonStates(type); }
    function resetSort() { const gridContainers = document.querySelectorAll('.ssp-grid-container[data-original-order-saved]'); gridContainers.forEach(gridContainer => { const originalOrderData = gridContainer.getAttribute('data-original-order'); if (originalOrderData) { try { const originalOrder = JSON.parse(originalOrderData); gridContainer.innerHTML = originalOrder.join(''); } catch (e) { console.error('SSP: Error restoring original order:', e); } } }); updateButtonStates(null); }
    function updateButtonStates(activeType) { const typeMap = { 'likes': 'sortLikes', 'orgasmic': 'sortOrgasmic', 'playlist': 'sortPlaylist', 'views': 'sortViews' }; document.querySelectorAll('.sort-btn').forEach(button => { button.classList.remove('active'); if (typeMap[activeType] === button.id) button.classList.add('active'); }); }

    // =================================================================================
    // SECTION 4: LÓGICA DO PLAYER EXTERNO (Versão Original)
    // =================================================================================
    function fetchURL(url) { return new Promise((resolve, reject) => { GM_xmlhttpRequest({ method: "GET", url: url, onload: (response) => { if (response.status >= 200 && response.status < 400) { resolve(response.responseText); } else { reject(new Error(`Request failed for ${url}: ${response.statusText}`)); } }, onerror: () => reject(new Error(`Network error for ${url}.`)) }); }); }
    function loadHlsJs() { if (hlsScriptLoaded || window.Hls) { hlsScriptLoaded = true; return Promise.resolve(); } return new Promise((resolve, reject) => { const script = document.createElement('script'); script.id = 'ssp-hls-script'; script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest'; script.onload = () => { hlsScriptLoaded = true; resolve(); }; script.onerror = reject; document.head.appendChild(script); }); }
    const parser = new DOMParser();
    const extractors = [/* ...código original inalterado... */];
    async function getExternalSource(link) { /* ...código original inalterado... */ }
    async function handlePlayerCheck() { /* ...código original inalterado... */ }
    function getNativePlayerInfo() { /* ...código original inalterado... */ }
    async function initAndSwapPlayer() { /* ...código original inalterado... */ }
    function togglePlayerVisibility() { /* ...código original inalterado... */ }
    function addExternalPlayerButton() { const btn = document.getElementById('ssp-external-player-btn'); if (btn) btn.addEventListener('click', handlePlayerCheck); }


    // =================================================================================
    // NOVO BLOCO: LÓGICA DE AUTO-LOAD CORRIGIDA
    // =================================================================================

    /**
     * NOVO: Encontra o último link <a> da "próxima página" de forma segura.
     * Procura pela <div class="next_page"> e retorna seu elemento pai <a>.
     */
    function findLastNextPageLink(scope = document) {
        const allNextPageDivs = scope.querySelectorAll('div.next_page');
        if (allNextPageDivs.length === 0) return null;
        const lastDiv = allNextPageDivs[allNextPageDivs.length - 1];
        return lastDiv.closest('a');
    }

    /**
     * MODIFICADO: Carrega o conteúdo da próxima página, encontra os novos posts e
     * substitui os controles de paginação de forma segura.
     */
    async function loadNextPage() {
        const nextPageLink = findLastNextPageLink();
        if (!nextPageLink) {
            console.log("SSP: No 'next page' link found. Stopping auto-load.");
            return null;
        }

        const oldCenterControl = document.getElementById('center_control');
        document.getElementById('autoLoadStatus').textContent = 'Loading...';

        try {
            // Usa fetchURL para garantir que os cookies sejam enviados
            const text = await fetchURL(nextPageLink.href);
            const doc = parser.parseFromString(text, 'text/html');

            const newContentContainer = doc.querySelector('.search_results, .main_content');
            if (!newContentContainer) throw new Error("Could not find new content container.");

            const newPosts = newContentContainer.querySelectorAll('.post_el_small:not(.post_el_post)');
            const targetGrid = document.querySelector('.ssp-grid-container');
            if (!targetGrid) throw new Error("Could not find target grid container.");

            newPosts.forEach(post => targetGrid.appendChild(post));

            // Lógica de substituição segura para os controles de paginação
            const newNextPageLink = findLastNextPageLink(doc);
            const newCenterControl = doc.getElementById('center_control');

            if (newNextPageLink) {
                nextPageLink.replaceWith(newNextPageLink);
            } else {
                nextPageLink.remove();
            }

            if (oldCenterControl && newCenterControl) {
                oldCenterControl.replaceWith(newCenterControl);
            } else if (oldCenterControl) {
                oldCenterControl.remove();
            }

            document.querySelectorAll('.ssp-grid-container').forEach(c => c.removeAttribute('data-original-order-saved'));
            return true;
        } catch (error) {
            console.error('SSP: Error loading next page:', error);
            document.getElementById('autoLoadStatus').textContent = 'Error.';
            return false;
        }
    }

    /**
     * MODIFICADO: Orquestra o carregamento de múltiplas páginas com loop dinâmico.
     */
    async function startAutoLoad() {
        isAutoLoading = true;
        const autoLoadStatus = document.getElementById('autoLoadStatus');
        const autoLoadBtn = document.getElementById('autoLoadBtn');
        const autoLoadPagesInput = document.getElementById('autoLoadPages');

        autoLoadStatus.textContent = '';
        autoLoadBtn.textContent = 'Parar';
        autoLoadBtn.classList.add('stop-btn');
        let loadedCount = 0;
        try {
            while (loadedCount < parseInt(autoLoadPagesInput.value, 10)) {
                if (!isAutoLoading) {
                    if (autoLoadStatus) autoLoadStatus.textContent = 'Parado.';
                    break;
                }

                if (findLastNextPageLink()) {
                    if (autoLoadStatus) autoLoadStatus.textContent = `Loading page ${loadedCount + 1}/${autoLoadPagesInput.value}...`;
                    const success = await loadNextPage();

                    if (success) {
                        loadedCount++;
                    } else {
                        if (autoLoadStatus.textContent !== 'Error.') {
                           autoLoadStatus.textContent = 'No more pages.';
                        }
                        break;
                    }
                } else {
                    if (autoLoadStatus) autoLoadStatus.textContent = 'No more pages.';
                    break;
                }
            }
            if (isAutoLoading) {
                autoLoadStatus.textContent = `Done. Loaded ${loadedCount} pages.`;
            }
        } finally {
            isAutoLoading = false;
            autoLoadBtn.textContent = 'Carregar';
            autoLoadBtn.classList.remove('stop-btn');
        }
    }

    function handleAutoLoadClick() { if (isAutoLoading) { isAutoLoading = false; } else { startAutoLoad(); } }


    // --- INICIALIZAÇÃO ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // --- CÓDIGO INTERNO DAS FUNÇÕES INALTERADAS (REDUZIDO PARA CLAREZA) ---
    const extractors_original = [{'domainTest': /bigwarp/i,'extract': async (link) => {const html = await fetchURL(link.href);const sourcesMatch = html.match(/sources:\s*(\[[\s\S]*?\])/);if (!sourcesMatch) return null;let bestSource = {quality: 0};const sourceObjectsRegex = /file:\s*"(?<file>[^"]+)",\s*label:\s*"(?<label>[^"]+)"/g;let match;while ((match = sourceObjectsRegex.exec(sourcesMatch[0])) !== null) {const {file,label} = match.groups;const qualityMatch = label.match(/(\d+)/);const quality = qualityMatch ? parseInt(qualityMatch[1], 10) : 0;if (quality > bestSource.quality) {bestSource = {url: file,quality,qualityLabel: label,type: 'video'};}}return bestSource.quality > 0 ? bestSource : null;}}, {'domainTest': /strmup\.to/i,'extract': async (link) => {const filecode = new URL(link.href).pathname.split(/[\/v\/]/).pop();const ajaxUrl = `https://strmup.to/ajax/stream?filecode=${encodeURIComponent(filecode)}`;const streamData = JSON.parse(await fetchURL(ajaxUrl));if (streamData.streaming_url) {let quality = 720,qualityLabel = "HD";const titleQualityMatch = streamData.title.match(/(\d{3,4})p/);if (titleQualityMatch) {quality = parseInt(titleQualityMatch[1], 10);qualityLabel = `${quality}p`;}return {url: streamData.streaming_url,quality,qualityLabel,type: 'video'};}return null;}}, {'domainTest': /doodstream\.com|d-s\.io/i,'extract': async (link) => ({url: link.href.replace('/d/', '/e/'),quality: 720,qualityLabel: "HD (Dood)",type: 'iframe'})}, {'domainTest': /vidguard\.to|listeamed\.net/i,'extract': async (link) => {const initialHtml = await fetchURL(link.href);const initialDoc = parser.parseFromString(initialHtml, 'text/html');const downloadLinkEl = initialDoc.querySelector('a.btn[href*="/d/"]');if (!downloadLinkEl) return null;const downloadPageUrl = new URL(downloadLinkEl.getAttribute('href'), link.href).href;const downloadHtml = await fetchURL(downloadPageUrl);const downloadDoc = parser.parseFromString(downloadHtml, 'text/html');const finalLinkEl = downloadDoc.querySelector('div#dl a.btn');if (!finalLinkEl) return null;const finalUrl = finalLinkEl.getAttribute('href');let quality = 720;let qualityLabel = "HD";const title = downloadDoc.title || '';const qualityMatch = title.match(/(\d{3,4})p/);if(qualityMatch) {quality = parseInt(qualityMatch[1], 10);qualityLabel = `${quality}p`;}return {url: finalUrl,quality,qualityLabel,type: 'video'};}}];
    extractors.push(...extractors_original);
    async function getExternalSource(link) {const hostname = link.hostname.replace('www.', '');const extractor = extractors.find(e => e.domainTest.test(hostname));if (!extractor) return null;try {return await extractor.extract(link.href);} catch (e) {console.error(`SSP Extractor Error for ${hostname}:`, e);return null;}}
    async function handlePlayerCheck() {if (cachedExternalPlayer) {togglePlayerVisibility();return;}const btn = document.getElementById('ssp-external-player-btn');btn.textContent = 'Verificando...';btn.disabled = true;btn.title = '';try {console.log('%cSSP: Iniciando verificação de players externos...', 'color: yellow; font-weight: bold;');const links = Array.from(document.querySelectorAll('.post_el_post .post_text a'));console.log('SSP: Links encontrados para verificação:', links.map(l => l.href));const promises = links.map(link => getExternalSource(link));const settledResults = await Promise.allSettled(promises);const successfulResults = settledResults.filter(result => result.status === 'fulfilled' && result.value).map(result => result.value);console.log('SSP: Fontes externas processadas com sucesso:', successfulResults);const bestExternal = successfulResults.reduce((best, current) => (current.quality > (best?.quality || 0) ? current : best), null);const nativePlayerInfo = getNativePlayerInfo();if (bestExternal) {console.log(`SSP: Comparação Final - Nativo: ${nativePlayerInfo.qualityLabel}, Melhor Externo: ${bestExternal.qualityLabel} (${new URL(bestExternal.url).hostname})`);} else {console.log(`SSP: Comparação Final - Nativo: ${nativePlayerInfo.qualityLabel}, Nenhuma fonte externa encontrada.`);}if (bestExternal && bestExternal.quality > nativePlayerInfo.quality) {cachedExternalPlayer = bestExternal;await initAndSwapPlayer();} else {if (bestExternal) {btn.textContent = `Nativo é melhor (${nativePlayerInfo.qualityLabel} > ${bestExternal.qualityLabel})`;} else {btn.textContent = `Nenhuma fonte encontrada (Nativo: ${nativePlayerInfo.qualityLabel})`;}}} catch (error) {console.error("SSP: Erro ao verificar players externos.", error);btn.textContent = 'Erro na Verificação';btn.title = `Erro: ${error.message}`;} finally {btn.disabled = false;}}
    function getNativePlayerInfo() {const infoDiv = Array.from(document.querySelectorAll('.post_el_post .post_el_wrap > div')).find(d => d.textContent.includes('Video Info'));if (infoDiv) {const qualityMatch = infoDiv.innerHTML.match(/resolution:<b>.*?<\/b>(\d+)/);if (qualityMatch && qualityMatch[1]) {const quality = parseInt(qualityMatch[1], 10);return {quality,qualityLabel: `${quality}p`};}}return {quality: 480,qualityLabel: '480p'};}
    async function initAndSwapPlayer() {nativePlayerContainer = document.getElementById('vid_container_id');if (!nativePlayerContainer) return;const nativeVideoElement = nativePlayerContainer.querySelector('video#player_el');externalPlayerContainer = document.createElement('div');externalPlayerContainer.id = 'ssp-external-player-container';externalPlayerContainer.className = nativePlayerContainer.className;Object.assign(externalPlayerContainer.style, {display: 'none',width: '100%',height: `${nativePlayerContainer.offsetHeight}px`,backgroundColor: 'black'});let playerElement;if (cachedExternalPlayer.type === 'video') {playerElement = document.createElement('video');playerElement.id = 'ssp-external-player-video';if (nativeVideoElement) {playerElement.className = nativeVideoElement.className;}playerElement.controls = true;playerElement.autoplay = true;if (cachedExternalPlayer.url.includes('.m3u8')) {await loadHlsJs();if (window.Hls && Hls.isSupported()) {const hls = new Hls();hls.loadSource(cachedExternalPlayer.url);hls.attachMedia(playerElement);} else {playerElement.src = cachedExternalPlayer.url;}} else {playerElement.src = cachedExternalPlayer.url;}} else {playerElement = document.createElement('iframe');playerElement.id = 'ssp-external-player-iframe';playerElement.src = cachedExternalPlayer.url;playerElement.setAttribute('allowfullscreen', 'true');}playerElement.style.width = '100%';playerElement.style.height = '100%';externalPlayerContainer.appendChild(playerElement);nativePlayerContainer.parentNode.insertBefore(externalPlayerContainer, nativePlayerContainer.nextSibling);togglePlayerVisibility();}
    function togglePlayerVisibility() {if (!nativePlayerContainer || !externalPlayerContainer) return;const btn = document.getElementById('ssp-external-player-btn');isExternalPlayerActive = !isExternalPlayerActive;if (isExternalPlayerActive) {nativePlayerContainer.style.display = 'none';externalPlayerContainer.style.display = 'block';btn.textContent = `Ver Player Nativo`;} else {externalPlayerContainer.style.display = 'none';nativePlayerContainer.style.display = 'block';btn.textContent = `Ver Player Externo (${cachedExternalPlayer.qualityLabel})`;}}

})();