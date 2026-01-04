// ==UserScript==
// @name         Eporner.com Ultimate Enhancer
// @namespace    http://tampermonkey.net/
// @version      2.9
// @license MIT
// @description  [v2.9] NOVIDADE: Adicionado botão "Gostei" (👍) na página do vídeo para aprender suas preferências de tags e pornstars diretamente, reforçando seu Perfil de Gosto.
// @description  [v2.8] CORREÇÃO: Previews de vídeo agora funcionam corretamente para todos os vídeos carregados via scroll virtual, passando a URL de forma mais robusta durante a extração de dados.
// @description  [v2.7] REESTRUTURAÇÃO: Cache de Sessão agora salva apenas a estrutura dos vídeos, sem as tags, que são sempre carregadas a partir do Cache Global. Isso resolve o problema de tags obsoletas na sessão.
// @description  [v2.6] MELHORIA: Adicionado botão "Limpar Cache da Página" para remover do cache global apenas as tags/pornstars dos vídeos atualmente carregados.
// @description  [v2.5] MELHORIA: Adicionado modal de limpeza de cache seletiva (tags, pornstars, perfil, etc.) em vez de apagar tudo de uma vez.
// @author       Gemini (com colaboração do usuário)
// @match        *://*.eporner.com/*
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/pako@1.0.11/dist/pako.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553775/Epornercom%20Ultimate%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/553775/Epornercom%20Ultimate%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================================
    // SECTION 0: CONFIGURAÇÃO GLOBAL E UTILITÁRIOS
    //================================================================================

    const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%229%22%20viewBox%3D%220%200%2016%209%22%3E%3Crect%20fill%3D%22%23333%22%20width%3D%2216%22%20height%3D%229%22/%3E%3C/svg%3E';
    const CONFIG_KEY = 'enhancer_config_v10';
    let config = {
        loadAllPages: true,
        columnCount: 3,
        previewMode: 'video',
        fetchDelay: 250,
        includeMode: 'OR',
        workerCount: 4,
        hideChannels: false,
        panelCollapsed: false,
        bestOfCollapsed: true,
        pageRecsCollapsed: true,
        showCompletionNotification: true,
        language: 'pt'
    };

    const languages = {
        pt: {
            loadAllPages: "Carregar todas as páginas",
            loadPages: "Carregar",
            pages: "páginas",
            loadMore: "Carregar Mais",
            columns: "Colunas",
            preview: "Preview",
            video: "Vídeo",
            slideshow: "Slideshow",
            delay: "Delay",
            workers: "Workers",
            notify: "Notificar",
            pornstarFilter: "Filtro de Pornstars",
            toggleChannels: "Esconder/Mostrar Canais",
            prepareVideos: "Preparar Vídeos para Filtragem",
            pauseSearch: "Pausar Busca",
            resumeSearch: "Continuar Busca",
            stopSearch: "Parar Busca",
            redoSearch: "Refazer Busca (Limpar Sessão)",
            clearGlobalCache: "Limpar Cache Global",
            searchFailureLog: "Log de Falhas de Busca",
            inclusionFilters: "Filtros de Inclusão",
            logic: "Lógica",
            logicOr: "Qualquer um (OU)",
            logicAnd: "Todos (E)",
            noFiltersAdded: "Nenhum filtro adicionado.",
            exclusionFilters: "Filtros de Exclusão",
            searchCategory: "Buscar categoria...",
            clearAllFilters: "Limpar Todos os Filtros",
            searchPornstar: "Buscar pornstar...",
            activePornstarFilters: "Filtros selecionados (OU)",
            bestOfTitle: "Suas Melhores Recomendações",
            bestOfFilterAll: "Mostrar Todas",
            bestOfFilterBy: "Filtrar por:",
            pageRecommendationsTitle: "Recomendado para Você (nesta página)",
            minimizeExpand: "Minimizar/Expandir",
            tasteProfileTitle: "Seu Perfil de Gosto",
            favoriteTags: "Tags Favoritas",
            favoritePornstars: "Pornstars Favoritas",
            resetProfile: "Resetar Perfil",
            noItemsScored: "Nenhum item pontuado ainda.",
            removeItemFromProfile: "Remover item do perfil",
            loading: "Carregando...",
            end: "Fim!",
            pageAnalysisStatus: "Analisando página {currentPage}... ({totalFound} itens encontrados)",
            showingStatus: "Mostrando {filtered} de {total} vídeos/canais carregados.",
            totalAnalysisStatus: "Análise Total: Vídeos: <b>{videos}</b> | Canais: <b>{channels}</b> | Duplicados: <b>{duplicates}</b>",
            tagSearchStatus: "Buscando tags...",
            tagSearchRetryStatus: "Tentando novamente as falhas...",
            tagSearchPausedStatus: "Busca pausada. Populando filtros com dados parciais...",
            tagSearchAllCached: "Todas as {total} tags de vídeo já estão no cache.",
            tagSearchStopped: "BUSCA PARADA PELO USUÁRIO.",
            tagSearchStoppedNotification: "Busca de Tags Interrompida",
            tagSearchStoppedNotificationBody: "A busca de tags foi parada pelo usuário.",
            tagSearchFinished: "Busca finalizada! {processed} vídeos processados com {failures} falhas.",
            tagSearchFinishedNotification: "Busca de Tags Concluída",
            tagSearchFinishedNotificationBody: "{processed} vídeos processados com sucesso.",
            pageSearchFinishedNotification: "Busca de Páginas Concluída",
            pageSearchFinishedNotificationBody: "Todas as páginas foram carregadas. {total} itens encontrados.",
            pageSearchStoppedNotification: "Busca de Páginas Interrompida",
            pageSearchStoppedNotificationBody: "A busca de páginas foi parada pelo usuário.",
            language: "Idioma / Language",
            clearCacheTitle: "Limpar Cache Seletivamente",
            clearCacheDescription: "Selecione os dados que deseja apagar permanentemente. Esta ação não pode ser desfeita.",
            cacheTags: "Tags de Vídeos",
            cachePornstars: "Pornstars",
            cacheTasteProfile: "Perfil de Gosto",
            cacheBestOf: "Melhores Recomendações",
            cacheDisliked: "Vídeos Ignorados",
            confirmDeletion: "Apagar Selecionados",
            cancel: "Cancelar",
            deletionSuccess: "Os dados selecionados foram apagados com sucesso!",
            deletionError: "Ocorreu um erro ao apagar os dados.",
            clearPageCache: "Limpar Cache da Página",
            clearPageCacheConfirm: "Tem certeza que deseja remover as {count} entradas de tags/pornstars do cache global que correspondem aos vídeos desta página?\n\nEsta ação é útil se as tags foram salvas incorretamente e você deseja forçar uma nova busca para estes vídeos.",
            clearPageCacheSuccess: "{count} entradas do cache foram removidas com sucesso! A página será recarregada.",
            clearPageCacheError: "Ocorreu um erro ao remover as entradas do cache.",
            clearPageCacheEmpty: "Nenhum vídeo carregado nesta sessão para ter seu cache limpo."
        },
        en: {
            loadAllPages: "Load all pages",
            loadPages: "Load",
            pages: "pages",
            loadMore: "Load More",
            columns: "Columns",
            preview: "Preview",
            video: "Video",
            slideshow: "Slideshow",
            delay: "Delay",
            workers: "Workers",
            notify: "Notify",
            pornstarFilter: "Pornstar Filter",
            toggleChannels: "Hide/Show Channels",
            prepareVideos: "Prepare Videos for Filtering",
            pauseSearch: "Pause Search",
            resumeSearch: "Resume Search",
            stopSearch: "Stop Search",
            redoSearch: "Redo Search (Clear Session)",
            clearGlobalCache: "Clear Global Cache",
            searchFailureLog: "Search Failure Log",
            inclusionFilters: "Inclusion Filters",
            logic: "Logic",
            logicOr: "Any (OR)",
            logicAnd: "All (AND)",
            noFiltersAdded: "No filters added.",
            exclusionFilters: "Exclusion Filters",
            searchCategory: "Search category...",
            clearAllFilters: "Clear All Filters",
            searchPornstar: "Search pornstar...",
            activePornstarFilters: "Selected filters (OR)",
            bestOfTitle: "Your Best Recommendations",
            bestOfFilterAll: "Show All",
            bestOfFilterBy: "Filter by:",
            pageRecommendationsTitle: "Recommended for You (on this page)",
            minimizeExpand: "Minimize/Expand",
            tasteProfileTitle: "Your Taste Profile",
            favoriteTags: "Favorite Tags",
            favoritePornstars: "Favorite Pornstars",
            resetProfile: "Reset Profile",
            noItemsScored: "No items scored yet.",
            removeItemFromProfile: "Remove item from profile",
            loading: "Loading...",
            end: "End!",
            pageAnalysisStatus: "Analyzing page {currentPage}... ({totalFound} items found)",
            showingStatus: "Showing {filtered} of {total} loaded videos/channels.",
            totalAnalysisStatus: "Total Analysis: Videos: <b>{videos}</b> | Channels: <b>{channels}</b> | Duplicates: <b>{duplicates}</b>",
            tagSearchStatus: "Fetching tags...",
            tagSearchRetryStatus: "Retrying failures...",
            tagSearchPausedStatus: "Search paused. Populating filters with partial data...",
            tagSearchAllCached: "All {total} video tags are already cached.",
            tagSearchStopped: "SEARCH STOPPED BY USER.",
            tagSearchStoppedNotification: "Tag Search Interrupted",
            tagSearchStoppedNotificationBody: "The tag search was stopped by the user.",
            tagSearchFinished: "Search finished! {processed} videos processed with {failures} failures.",
            tagSearchFinishedNotification: "Tag Search Complete",
            tagSearchFinishedNotificationBody: "{processed} videos processed successfully.",
            pageSearchFinishedNotification: "Page Search Complete",
            pageSearchFinishedNotificationBody: "All pages have been loaded. {total} items found.",
            pageSearchStoppedNotification: "Page Search Interrupted",
            pageSearchStoppedNotificationBody: "The page search was stopped by the user.",
            language: "Idioma / Language",
            clearCacheTitle: "Selective Cache Cleaning",
            clearCacheDescription: "Select the data you wish to permanently delete. This action cannot be undone.",
            cacheTags: "Video Tags",
            cachePornstars: "Pornstars",
            cacheTasteProfile: "Taste Profile",
            cacheBestOf: "Best Of Recommendations",
            cacheDisliked: "Disliked Videos",
            confirmDeletion: "Delete Selected",
            cancel: "Cancel",
            deletionSuccess: "The selected data has been successfully deleted!",
            deletionError: "An error occurred while deleting the data.",
            clearPageCache: "Clear Page Cache",
            clearPageCacheConfirm: "Are you sure you want to remove the {count} tag/pornstar entries from the global cache corresponding to the videos on this page?\n\nThis is useful if tags were saved incorrectly and you want to force a refetch for these specific videos.",
            clearPageCacheSuccess: "{count} cache entries have been successfully removed! The page will now reload.",
            clearPageCacheError: "An error occurred while removing cache entries.",
            clearPageCacheEmpty: "No videos loaded in this session to clear the cache for."
        }
    };

    function getText(key, replacements = {}) {
        let text = languages[config.language][key] || key;
        for (const placeholder in replacements) {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return text;
    }

    function loadConfig() {
        try {
            const savedConfig = JSON.parse(localStorage.getItem(CONFIG_KEY));
            if (savedConfig) {
                config = { ...config, ...savedConfig };
            }
        } catch (e) {
            console.error("Enhancer: Failed to load config.", e);
        }
        document.documentElement.style.setProperty('--enhancer-column-count', config.columnCount);
    }

    function saveConfig() {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) {
            console.error("Enhancer: Failed to save config.", e);
        }
    }

    function getPageNumberFromUrl(url) {
        if (!url) return 0;
        try {
            const urlObject = new URL(url, window.location.origin);
            const pageParam = urlObject.searchParams.get('page');
            if (pageParam) {
                return parseInt(pageParam, 10);
            }
            const pathMatch = urlObject.pathname.match(/\/(\d+)\/?$/);
            if (pathMatch) {
                return parseInt(pathMatch[1], 10);
            }
            return 1;
        } catch (e) {
             console.error("Enhancer: Error parsing page number from URL:", url, e);
            return 0;
        }
    }

    function injectGlobalLayoutCSS() {
        if (document.getElementById('eporner-global-layout-enhancer-css')) return;
        const style = document.createElement('style');
        style.id = 'eporner-global-layout-enhancer-css';
        style.textContent = `
        :root { --enhancer-column-count: 3; }
        .mb { width: calc(100% / var(--enhancer-column-count) - 12px) !important; max-width: none !important; min-width: 300px !important; margin: 0 6px 24px 6px !important; box-sizing: border-box !important; display: flex !important; flex-direction: column !important; height: auto !important; border: 1px solid #333; border-radius: 8px; background-color: #1a1a1a; transition: transform 0.2s ease, box-shadow 0.2s ease !important; gap: 0 !important; flex-grow: 0 !important; }
        .vidresults6 .mb, #vidresults .mb, #relateddiv .mb, .index .mb, .thumbs .mb, .filler .mb { float: left !important; }
        #enhancer-recommendations-grid .mb, #enhancer-best-of-grid .mb { float: none !important; }
        .mb[data-preview-active="true"] { z-index: 100 !important; }
        .mb[data-preview-active="true"]:hover { transform: none !important; }
        .mb:hover { transform: translateY(-5px) scale(1.02) !important; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7) !important; z-index: 10 !important; }
        .mb .mbunder { padding: 10px 10px 8px !important; order: 1; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; margin-top: 0 !important; text-align: left; }
        .mb .mbtit a { font-size: 1em; transition: font-size 0.2s ease; }
        .mb .mbimg { width: 100% !important; height: auto !important; aspect-ratio: 16 / 9; order: 2; position: relative !important; overflow: hidden !important; border-radius: 0 0 8px 8px; background-color: #000; }
        .mb .mbimg img { width: 100% !important; height: 100% !important; min-height: unset !important; max-height: unset !important; object-fit: cover !important; transition: opacity 0.1s linear; display: block; position: absolute; top: 0; left: 0; }
        .mb[data-preview-failed="true"] .mbimg { outline: 2px solid #800; outline-offset: -2px; }
        #vidresults, .index, .thumbs, #relateddiv, .fillerOuter.profilemain .filler, .vidresults6 { content: "" !important; display: table !important; clear: both !important; width: 100%; }
        #vidresults::after, .index::after, .thumbs::after, #relateddiv::after, .fillerOuter.profilemain .filler::after, .vidresults6::after, .enhancer-rec-grid::after { content: ''; display: block; clear: both; }
        #enhancer-recommendations-grid, #enhancer-best-of-grid { display: flex; flex-wrap: wrap; }
        #enhancer-main-controls > * { flex: 0 1 auto; }
        #enhancer-main-controls label, #enhancer-incremental-controls label { color: #ccc; }
        #enhancer-loading-controls { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; }
        .active-tag { display: inline-block; color: white; padding: 2px 8px; margin: 2px; border-radius: 10px; font-size: 0.9em; cursor: pointer; }
        .tag-action-btn { cursor: pointer; font-weight: bold; margin-right: 4px; user-select: none; font-family: monospace; font-size: 1.1em; }
        .tag-action-btn:hover { filter: brightness(1.5); }
        .enhancer-modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; }
        .enhancer-modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2c2c2c; border: 1px solid #555; border-radius: 8px; width: 80%; max-width: 900px; max-height: 80vh; display: flex; flex-direction: column; }
        .enhancer-modal-header { padding: 15px; border-bottom: 1px solid #555; color: white; font-size: 18px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .enhancer-modal-close { cursor: pointer; font-size: 24px; line-height: 1; }
        .enhancer-modal-body { padding: 15px; overflow-y: auto; }
        .enhancer-modal-body-columns { columns: 4; column-gap: 15px; }
        .enhancer-modal-item { cursor: pointer; padding: 4px; border-radius: 3px; margin-bottom: 5px; color: #fff; user-select: none; display: block; }
        .enhancer-modal-item.selected { background: #8e44ad; font-weight: bold; }
        .enhancer-modal-item.hidden { display: none; }
        .previdthumb { display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; }
        .previdthumb video { width: 100%; height: 100%; object-fit: cover; }
        .enhancer-preview-overlay { position:absolute; top:0; left:0; width:100%; height:100%; background:url(https://static-ca-cdn.eporner.com/images/ajax_loader.gif) center center no-repeat; opacity:1; z-index:1; }
        .enhancer-recommendation-info { font-size: 0.8em; color: #a9a9a9; margin-top: 8px; border-top: 1px solid #333; padding-top: 8px; }
        .enhancer-recommendation-info b { color: #d4af37; }
        .enhancer-feedback-btn { cursor: pointer; margin-left: 8px; font-weight: bold; user-select: none; }
        #enhancer-best-of-box h2, #enhancer-recommendations-box h2 { display: flex; justify-content: space-between; align-items: center; position: relative; }
        #enhancer-best-of-dropdown { background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 5px; }
        .enhancer-box-toggle-btn { position: absolute; top: -5px; right: -5px; font-size: 1.1em; padding: 2px 8px; line-height: 1; background: #555; color: white; border: none; cursor: pointer; border-radius: 4px; }
        #enhancer-taste-panel-btn { position: fixed; bottom: 20px; right: 20px; z-index: 99999; background: #8e44ad; color: white; font-size: 24px; width: 50px; height: 50px; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
        #enhancer-taste-modal .enhancer-modal-content { background: #333; }
        #enhancer-taste-modal .enhancer-modal-body { display: flex; gap: 20px; flex-direction: column; }
        #enhancer-taste-modal .taste-list-container { flex: 1; }
        #enhancer-taste-modal .taste-list-container h3 { margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid #555;}
        .taste-list { list-style: none; padding: 0; margin: 0; }
        .taste-list li { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #444; }
        .taste-list .score-input { width: 60px; background-color: #444; color: #ffc107; border: 1px solid #555; border-radius: 4px; text-align: right; font-weight: bold; padding: 2px; }
        .taste-list-item-name { flex-grow: 1; }
        .taste-list-delete-btn { cursor: pointer; color: #ff6666; font-size: 1.2em; margin-left: 15px; user-select: none; }
        .enhancer-vscroll-container { position: relative; width: 100%; margin: 0 auto; }
        .enhancer-vscroll-container .mb { position: absolute !important; }
        #enhancer-container.collapsed > *:not(#enhancer-status-wrapper) { display: none; }
        #enhancer-container.collapsed > #enhancer-status-wrapper { display: block; }
        #enhancer-status-wrapper { position: relative; }
        #enhancer-toggle-panel-btn { position: absolute; top: 5px; right: 5px; z-index: 10; font-size: 1.1em; padding: 2px 8px; line-height: 1; }
      `;
        document.head.appendChild(style);
    }

    function showNotification(titleKey, bodyKey, replacements = {}) {
        if (!config.showCompletionNotification) return;

        const title = getText(titleKey, replacements);
        const body = getText(bodyKey, replacements);

        if (Notification.permission === 'granted') {
            new Notification(title, { body: body, icon: 'https://static-ca-cdn.eporner.com/favicon.ico' });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: body, icon: 'https://static-ca-cdn.eporner.com/favicon.ico' });
                }
            });
        }
    }

    function toggleLanguageAndReload() {
        loadConfig();
        const newLang = config.language === 'pt' ? 'en' : 'pt';
        config.language = newLang;
        saveConfig();
        alert(`Language changed to ${newLang === 'en' ? 'English' : 'Português'}. The page will now reload.`);
        location.reload();
    }

    //================================================================================
    // SECTION 1: GERENCIAMENTO DE DADOS GLOBAIS (Refatorado)
    //================================================================================

    const DBManager = {
        globalDb: null,
        DB_VERSION: 5,

        initializeDB(dbName, storeSpecs) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, this.DB_VERSION);
                request.onupgradeneeded = e => {
                    const db = e.target.result;
                    storeSpecs.forEach(spec => {
                        if (!db.objectStoreNames.contains(spec.name)) {
                            db.createObjectStore(spec.name, { keyPath: spec.keyPath });
                        }
                    });
                };
                request.onsuccess = e => resolve(e.target.result);
                request.onerror = e => reject(e.target.error);
                request.onblocked = () => reject(new Error("IndexedDB blocked"));
            });
        },

        async initializeGlobalDB() {
             if (this.globalDb) return;
            try {
                this.globalDb = await this.initializeDB('EnhancerGlobalCacheDB', [
                    { name: 'tags', keyPath: 'href' },
                    { name: 'pornstars', keyPath: 'href' },
                    { name: 'tasteProfile', keyPath: 'id' },
                    { name: 'bestOfCache', keyPath: 'id' },
                    { name: 'dislikedVideos', keyPath: 'id' }
                ]);
            } catch (error) {
                console.error("Enhancer: CRITICAL FAILURE initializing global database.", error);
                throw error;
            }
        },

        deleteDB(dbName) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.deleteDatabase(dbName);
                request.onsuccess = () => { console.log(`Enhancer: DB '${dbName}' deleted successfully.`); resolve(); };
                request.onerror = e => reject(e.target.error);
                request.onblocked = e => { console.warn(`Enhancer: Deletion of DB '${dbName}' blocked.`); reject(new Error("Database deletion blocked")); };
            });
        },

        async deleteAllSessionParts(sessionDbKeyBase) {
            try {
                if (typeof indexedDB.databases !== 'function') {
                     console.warn("Enhancer: Browser does not support indexedDB.databases(). Session cleanup may be incomplete.");
                     await this.deleteDB(sessionDbKeyBase);
                     return;
                }
                const dbs = await indexedDB.databases();
                for (const db of dbs) {
                    if (db.name && db.name.startsWith(sessionDbKeyBase)) {
                        await this.deleteDB(db.name);
                    }
                }
            } catch (e) {
                 console.error("Enhancer: Error trying to clear old session parts.", e);
                 await this.deleteDB(sessionDbKeyBase).catch(()=>{});
            }
        },

        requestToPromise(request) {
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },

        async saveSession(videos, nextLink, sessionDbKey) {
            try {
                await this.deleteAllSessionParts(sessionDbKey);

                if (videos.length === 0) {
                    return;
                }

                const videosToSave = videos.map(video => ({
                    data: video.data,
                    id: video.id,
                    href: video.href,
                    isChannel: video.isChannel
                }));

                const jsonString = JSON.stringify(videosToSave);
                const data = new TextEncoder().encode(jsonString);

                const compressedData = pako.deflate(data);

                const db = await this.initializeDB(sessionDbKey, [{ name: 'session', keyPath: 'id' }]);
                const tx = db.transaction('session', 'readwrite');
                const store = tx.objectStore('session');

                const sessionObject = {
                    id: 'compressed_session',
                    format: 'pako_v1',
                    data: compressedData,
                    nextLink: nextLink || null,
                    videoCount: videos.length,
                    timestamp: new Date().toISOString()
                };

                await this.requestToPromise(store.put(sessionObject));

                await new Promise((resolve, reject) => {
                    tx.oncomplete = resolve;
                    tx.onerror = () => reject(tx.error);
                });
                db.close();
            } catch (e) {
                console.error("Enhancer: CRITICAL FAILURE saving session with Pako.", e);
                alert("Enhancer: ERROR SAVING SESSION! Check console for details.");
            }
        },

        async loadSession(sessionDbKey, sessionDbPartsKey) {
            try {
                const db = await this.initializeDB(sessionDbKey, [{ name: 'session', keyPath: 'id' }, { name: 'videos', keyPath: 'id' }]);
                const tx = db.transaction(['session'], 'readonly');
                const store = tx.objectStore('session');
                const sessionObject = await this.requestToPromise(store.get('compressed_session'));
                db.close();

                if (!sessionObject || sessionObject.format !== 'pako_v1') {
                    if (sessionObject) {
                        await this.deleteAllSessionParts(sessionDbKey);
                    } else {
                        const numParts = parseInt(localStorage.getItem(sessionDbPartsKey) || '0', 10);
                        if (numParts > 0) {
                            let allVideos = [];
                            for (let i = 0; i < numParts; i++) {
                                const dbName = `${sessionDbKey}_part_${i + 1}`;
                                const oldDb = await this.initializeDB(dbName, [{ name: 'videos', keyPath: 'id' }]);
                                const videos = await this.requestToPromise(oldDb.transaction('videos', 'readonly').objectStore('videos').getAll());
                                allVideos.push(...videos);
                                oldDb.close();
                            }
                            const nextLink = localStorage.getItem(sessionDbKey + "_nextLink");
                            if (allVideos.length > 0) {
                                return { videos: allVideos, nextLink: nextLink || null };
                            }
                        }
                    }
                    return null;
                }

                const decompressedData = pako.inflate(sessionObject.data);
                const jsonString = new TextDecoder().decode(decompressedData);
                const videos = JSON.parse(jsonString);

                return { videos: videos, nextLink: sessionObject.nextLink || null };

            } catch (e) {
                console.error("Enhancer: Failed to load or decompress session from IndexedDB. It might be corrupted.", e);
                await this.deleteAllSessionParts(sessionDbKey).catch(err => {});
                return null;
            }
        },


        async loadGlobalCache() {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const tx = this.globalDb.transaction(['tags', 'pornstars'], 'readonly');
                const tagsStore = tx.objectStore('tags');
                const pornstarsStore = tx.objectStore('pornstars');
                const tags = await this.requestToPromise(tagsStore.getAll());
                const pornstars = await this.requestToPromise(pornstarsStore.getAll());
                const tagCache = new Map(tags.map(item => [item.href, item.data]));
                const pornstarCache = new Map(pornstars.map(item => [item.href, item.data]));
                return { tagCache, pornstarCache };
            } catch (e) { console.error("Enhancer: Failed to load global cache.", e); return { tagCache: new Map(), pornstarCache: new Map() }; }
        },

        async saveGlobalCache(tagCache, pornstarCache) {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const tx = this.globalDb.transaction(['tags', 'pornstars'], 'readwrite');
                const tagsStore = tx.objectStore('tags');
                const pornstarsStore = tx.objectStore('pornstars');
                await Promise.all([
                    ...Array.from(tagCache.entries()).map(([href, data]) => this.requestToPromise(tagsStore.put({ href, data }))),
                    ...Array.from(pornstarCache.entries()).map(([href, data]) => this.requestToPromise(pornstarsStore.put({ href, data })))
                ]);
            } catch (e) { console.error("Enhancer: Failed to save global cache.", e); }
        },

        async loadTasteProfile() {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const tx = this.globalDb.transaction('tasteProfile', 'readonly');
                const store = tx.objectStore('tasteProfile');
                return await this.requestToPromise(store.get('userProfile'));
            } catch (e) {
                console.error("Enhancer: Failed to load taste profile.", e);
                return null;
            }
        },

        async saveTasteProfile(profile) {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const tx = this.globalDb.transaction('tasteProfile', 'readwrite');
                const store = tx.objectStore('tasteProfile');
                await this.requestToPromise(store.put(profile));
            } catch (e) {
                console.error("Enhancer: Failed to save taste profile.", e);
            }
        },

        async getBestOfCache() {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const tx = this.globalDb.transaction('bestOfCache', 'readonly');
                return await this.requestToPromise(tx.objectStore('bestOfCache').getAll());
            } catch (e) { console.error("Enhancer: Failed to load 'Best Of' cache.", e); return []; }
        },

        async updateBestOfCache(videoList) {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const tx = this.globalDb.transaction('bestOfCache', 'readwrite');
                const store = tx.objectStore('bestOfCache');
                await this.requestToPromise(store.clear());
                for (const video of videoList) {
                    await this.requestToPromise(store.put(video));
                }
            } catch (e) { console.error("Enhancer: Failed to save 'Best Of' cache.", e); }
        },

        async getDislikedVideos() {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const tx = this.globalDb.transaction('dislikedVideos', 'readonly');
                const videos = await this.requestToPromise(tx.objectStore('dislikedVideos').getAll());
                return videos.map(v => v.id);
            } catch (e) { console.error("Enhancer: Failed to load disliked videos.", e); return []; }
        },

        async addDislikedVideo(videoId) {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const tx = this.globalDb.transaction('dislikedVideos', 'readwrite');
                await this.requestToPromise(tx.objectStore('dislikedVideos').put({ id: videoId }));
            } catch (e) { console.error("Enhancer: Failed to add video to disliked list.", e); }
        },

        async getCacheStats() {
            if (!this.globalDb) await this.initializeGlobalDB();
            try {
                const stores = ['tags', 'pornstars', 'tasteProfile', 'bestOfCache', 'dislikedVideos'];
                const tx = this.globalDb.transaction(stores, 'readonly');
                const stats = {};
                await Promise.all(stores.map(async (storeName) => {
                    const store = tx.objectStore(storeName);
                    const count = await this.requestToPromise(store.count());
                    stats[storeName] = count;
                }));
                return stats;
            } catch (e) {
                console.error("Enhancer: Failed to get cache stats.", e);
                return {};
            }
        },

        async clearObjectStores(storeNames) {
            if (!this.globalDb) await this.initializeGlobalDB();
            if (!storeNames || storeNames.length === 0) return;
            try {
                const tx = this.globalDb.transaction(storeNames, 'readwrite');
                await Promise.all(storeNames.map(storeName => {
                    return this.requestToPromise(tx.objectStore(storeName).clear());
                }));
                console.log(`Enhancer: Cleared stores: ${storeNames.join(', ')}`);
            } catch (e) {
                console.error("Enhancer: Failed to clear object stores.", e);
                throw e;
            }
        },

        async deleteItemsFromStores(stores, keys) {
            if (!this.globalDb) await this.initializeGlobalDB();
            if (!stores || stores.length === 0 || !keys || keys.length === 0) return 0;

            try {
                const tx = this.globalDb.transaction(stores, 'readwrite');
                const deletePromises = [];

                for (const storeName of stores) {
                    const store = tx.objectStore(storeName);
                    for (const key of keys) {
                        deletePromises.push(this.requestToPromise(store.delete(key)));
                    }
                }

                await Promise.all(deletePromises);
                console.log(`Enhancer: Attempted to delete ${keys.length} keys from stores: ${stores.join(', ')}`);
                return keys.length;
            } catch (e) {
                console.error("Enhancer: Failed to delete items from stores.", e);
                throw e;
            }
        }
    };

    let tasteProfile = { id: 'userProfile', tags: {}, pornstars: {} };
    let saveProfileTimeout = null;

    function debouncedSaveProfile() {
        clearTimeout(saveProfileTimeout);
        saveProfileTimeout = setTimeout(() => {
            console.log("Enhancer: Saving taste profile...", tasteProfile);
            DBManager.saveTasteProfile(tasteProfile);
        }, 2500);
    };

    function updateTasteProfile(type, name, score) {
        if (!tasteProfile[type]) tasteProfile[type] = {};
        tasteProfile[type][name] = (tasteProfile[type][name] || 0) + score;
        debouncedSaveProfile();
    }

    async function initializeTasteProfile() {
        if (DBManager.globalDb) { // Evita reinicializar se já estiver carregado
            const loadedProfile = await DBManager.loadTasteProfile();
            if (loadedProfile) {
                tasteProfile = loadedProfile;
            }
        }
    }

    //================================================================================
    // SECTION 1.5: FUNÇÕES DE PLAYER E PREVIEW
    //================================================================================
    async function handleVideoPage() {
        // Inicializa o DB e carrega o perfil de gosto para esta página
        await DBManager.initializeGlobalDB();
        await initializeTasteProfile();

        const pageStyle = document.createElement('style');
        pageStyle.id = 'enhancer-video-page-style';
        pageStyle.textContent = `
            #content.hdpvideo #moviexxx {
                width: 100% !important; height: 100% !important;
                max-width: none !important; max-height: none !important;
            }
            .video-js .vjs-control-bar .vjs-pip-button { font-size: 1.5em; width: 2em; }
            .vjs-pip-button .vjs-icon-placeholder::before { content: ' '; display: block; width: 100%; height: 100%; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" fill="white"/></svg>'); background-repeat: no-repeat !important; background-position: center !important; }
            .video-js .vjs-control-bar .vjs-popout-button { font-size: 1.5em; width: 2em; transition: transform 0.1s ease-in-out; }
            .vjs-popout-button .vjs-icon-placeholder::before { content: ' '; display: block; width: 100%; height: 100%; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" fill="white"/></svg>'); background-repeat: no-repeat !important; background-position: center !important; }
        `;
        pageStyle.textContent += `
            .enhancer-like-video-btn {
                font-size: 1.2em;
                cursor: pointer;
                margin-left: 15px;
                padding: 2px 8px;
                border-radius: 5px;
                background: #444;
                display: inline-block;
                transition: background 0.2s ease;
                vertical-align: middle;
            }
            .enhancer-like-video-btn:hover {
                background: #555;
                filter: brightness(1.2);
            }
            .enhancer-like-video-btn.liked {
                background: #28a745;
                cursor: default;
                font-weight: bold;
            }
        `;
        document.head.appendChild(pageStyle);

        const titleElement = document.querySelector('#video-info h1');
        if (titleElement && !document.querySelector('.enhancer-like-video-btn')) {
            const likeButton = document.createElement('span');
            likeButton.className = 'enhancer-like-video-btn';
            likeButton.textContent = '👍';
            likeButton.title = 'Gostei, recomendar mais como este';

            likeButton.addEventListener('click', () => {
                if (likeButton.classList.contains('liked')) return;

                const tags = new Set();
                const pornstars = new Set();
                let itemsFound = 0;

                // Extrai todas as tags/categorias
                document.querySelectorAll('#video-info-tags .vit-category a').forEach(el => {
                    const tagName = el.textContent.trim();
                    if (tagName) {
                        tags.add(tagName);
                    }
                });

                // Tenta extrair pornstars de links específicos que contenham /pornstar/ no href
                document.querySelectorAll('#video-info-tags a[href*="/pornstar/"]').forEach(el => {
                    const pornstarName = el.textContent.trim();
                    if (pornstarName) {
                        pornstars.add(pornstarName);
                    }
                });

                const scoreChange = 15; // Pontuação maior por ser uma ação explícita
                tags.forEach(tag => {
                    console.log(`Enhancer: Liked tag -> ${tag} (+${scoreChange})`);
                    updateTasteProfile('tags', tag, scoreChange);
                    itemsFound++;
                });

                pornstars.forEach(ps => {
                    console.log(`Enhancer: Liked pornstar -> ${ps} (+${scoreChange})`);
                    updateTasteProfile('pornstars', ps, scoreChange);
                    itemsFound++;
                });

                likeButton.classList.add('liked');
                likeButton.textContent = `✅ Adicionado!`;
                likeButton.title = `${itemsFound} itens adicionados ao seu perfil de gosto.`;

            }, { once: true }); // O evento só pode ser disparado uma vez

            titleElement.appendChild(likeButton);
        }

        const videoPlayerElement = document.getElementById('EPvideo');
        if (!videoPlayerElement) return;

        const selectHighestQuality = (player, hasSetBestQualityRef) => {
            if (hasSetBestQualityRef.value || typeof player.qualityLevels !== 'function') return;
            const qualityLevels = player.qualityLevels();
            if (!qualityLevels || qualityLevels.length <= 1) return;
            if (qualityLevels.levels_ && qualityLevels.levels_.length > 0) {
                const bestLevel = Array.from(qualityLevels.levels_).reduce((max, current) => (current.height > max.height ? current : max));
                qualityLevels.levels_.forEach(level => level.enabled = (level === bestLevel));
                hasSetBestQualityRef.value = true;
            }
        };

        const addCustomPlayerButtons = (player) => {
            const videoEl = player.el().querySelector('video');
            const Button = videojs.getComponent('Button');
            const controlBar = player.getChild('controlBar');
            if (!controlBar) return;
            const fullscreenButton = controlBar.getChild('fullscreenToggle');
            const targetIndex = fullscreenButton ? controlBar.children().indexOf(fullscreenButton) : controlBar.children().length - 1;
            if (document.pictureInPictureEnabled && videoEl && !videoEl.disablePictureInPicture) {
                class PipButton extends Button {
                    constructor() { super(...arguments); this.controlText('Picture-in-Picture (Janela sem bordas)'); this.addClass('vjs-pip-button'); }
                    handleClick() { document.pictureInPictureElement ? document.exitPictureInPicture() : videoEl.requestPictureInPicture(); }
                }
                if (!videojs.getComponent('PipButton')) videojs.registerComponent('PipButton', PipButton);
                if (!controlBar.getChild('PipButton')) controlBar.addChild('PipButton', {}, targetIndex);
            }
            class PopOutButton extends Button {
                constructor() { super(...arguments); this.controlText('Pop-Out Player (Nova janela)'); this.addClass('vjs-popout-button'); }
                handleClick() {
                    this.el().style.transform = 'scale(1.25)';
                    setTimeout(() => { this.el().style.transform = 'scale(1)'; }, 150);
                    player.pause();
                    const videoSrc = player.src();
                    if (!videoSrc) { return alert('Fonte do vídeo não encontrada.'); }
                    const qualityLevels = player.qualityLevels();
                    const currentQuality = qualityLevels?.levels_[qualityLevels.selectedIndex]?.height + 'p' || 'HD';
                    const vjsCss = document.querySelector('link[href*="vjs"]').href;
                    const scripts = Array.from(document.querySelectorAll('script[src]'));
                    const vjsCoreJs = scripts.find(s => s.src.includes('vjs') && !s.src.includes('hls') && !s.src.includes('dash'))?.src;
                    const vjsContribJs = scripts.find(s => s.src.includes('vjs') && (s.src.includes('hls') || s.src.includes('dash')))?.src || 'https://static-ca-cdn.eporner.com/vjs/vjs7dash122.js';
                    const popoutHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Enhancer Player (${currentQuality})</title><link href="${vjsCss}" rel="stylesheet"><style>body,html{margin:0;padding:0;overflow:hidden;background-color:#000}#p-player{width:100vw;height:100vh}</style></head><body><video id="p-player" class="video-js vjs-default-skin" controls autoplay preload="auto"></video><script src="${vjsCoreJs}"><\/script><script src="${vjsContribJs}"><\/script><script>videojs('p-player',{html5:{hls:{overrideNative:true}}}).src({src:'${videoSrc}',type:'application/x-mpegURL'})<\/script></body></html>`;
                    const popoutUrl = URL.createObjectURL(new Blob([popoutHTML], { type: 'text/html' }));
                    window.open(popoutUrl, 'enhancer_player', 'width=1280,height=720,scrollbars=no,resizable=yes');
                }
            }
            if (!videojs.getComponent('PopOutButton')) videojs.registerComponent('PopOutButton', PopOutButton);
            if (!controlBar.getChild('PopOutButton')) controlBar.addChild('PopOutButton', {}, targetIndex);
        };

        const initializePlayer = (player) => {
            if (!player || player.enhancerInitialized) return;
            player.enhancerInitialized = true;
            addCustomPlayerButtons(player);
            let hasSetBestQualityRef = { value: false };
            player.ready(() => {
                player.play().catch(e => {});
                player.one('play', () => {
                    player.volume(0.2);
                    player.muted(false);
                });
                selectHighestQuality(player, hasSetBestQualityRef);
                player.qualityLevels()?.on('addqualitylevel', () => { setTimeout(() => selectHighestQuality(player, hasSetBestQualityRef), 250); });
                setTimeout(() => selectHighestQuality(player, hasSetBestQualityRef), 2000);
            });
        };

        let attempts = 0;
        const tryInitialize = () => {
            if (typeof videojs !== 'undefined' && videojs.getPlayer) {
                const player = videojs.getPlayer('EPvideo');
                if (player && player.el() && player.isReady_) { return initializePlayer(player); }
            }
            if (++attempts < 20) { setTimeout(tryInitialize, 500); }
        };
        tryInitialize();
    }

    let activePreview = {
        card: null,
        timeoutId: null,
        overlay: null,
        watchLaterBox: null
    };

    function clearActivePreview() {
        if (!activePreview.card) return;
        const card = activePreview.card;

        clearTimeout(activePreview.timeoutId);

        if (activePreview.overlay) {
            activePreview.overlay.remove();
        }
        if (activePreview.watchLaterBox) {
            activePreview.watchLaterBox.remove();
        }

        const previewDiv = card.querySelector('#previddiv');
        if (previewDiv) {
            previewDiv.remove();
        }

        if (card.dataset.intervalId) {
            const img = card.querySelector('.mbimg img');
            if (img && card.dataset.originalSrc) {
                clearInterval(card.dataset.intervalId);
                img.src = card.dataset.originalSrc;
                delete card.dataset.intervalId;
                delete card.dataset.originalSrc;
            }
        }
        activePreview = { card: null, timeoutId: null, overlay: null, watchLaterBox: null };
    }

    function handleVideoPreviewEvents(e) {
        const card = e.target.closest('.mb');

        if (!card) {
            if (activePreview.card) {
                clearActivePreview();
            }
            return;
        }

        if (e.type === 'mouseover') {
            if (activePreview.card === card) return;
            clearActivePreview();
            activePreview.card = card;

            if (card.dataset.previewFailed === 'true' && config.previewMode === 'video') {
                return;
            }

            const videoId_wl = card.dataset.id;
            const mbimg = card.querySelector('.mbimg');
            if (videoId_wl && mbimg) {
                const watchLaterBox = document.createElement('div');
                watchLaterBox.id = 'watchlaterbox';
                watchLaterBox.className = 'watchlater';
                watchLaterBox.innerHTML = '<span>Watch later</span><i></i>';
                mbimg.appendChild(watchLaterBox);
                activePreview.watchLaterBox = watchLaterBox;
            }

            if (config.previewMode === 'video') {
                const vp = card.dataset.vp;
                const previewUrl = card.dataset.previewUrl;
                if (!previewUrl) return;

                const mbcontent = card.querySelector('.mbcontent');
                const link = card.querySelector('.mbtit a');
                if (!mbcontent || !link || !mbimg) return;

                const previewContainerHTML = `<div id="previddiv" class="previdthumb"><a href="${link.href}"><video id="previd-${vp}" loop muted playsinline preload="auto"></video></a></div>`;
                mbimg.insertAdjacentHTML('beforeend', previewContainerHTML);

                const overlay = document.createElement('div');
                overlay.className = 'enhancer-preview-overlay';
                const overlayLink = document.createElement('a');
                overlayLink.href = link.href;
                overlayLink.appendChild(overlay);
                mbimg.appendChild(overlayLink);
                activePreview.overlay = overlayLink;

                activePreview.timeoutId = setTimeout(() => {
                    const previewDiv = card.querySelector('#previddiv');
                    if (previewDiv) previewDiv.style.display = 'block';

                    const videoEl = document.getElementById(`previd-${vp}`);
                    if (videoEl) {
                        videoEl.onerror = () => {
                            console.warn(`Enhancer: Failed to load video preview: ${videoEl.src}`);
                            const cardWithError = videoEl.closest('.mb');
                            if (cardWithError && activePreview.card === cardWithError) {
                                clearActivePreview();
                                cardWithError.dataset.previewFailed = 'true';
                            }
                        };
                        videoEl.src = previewUrl;
                        videoEl.play().catch(err => {});
                        videoEl.onloadeddata = () => {
                            if (activePreview.overlay) activePreview.overlay.style.visibility = 'hidden';
                        };
                    }
                }, 250);

            } else { // Slideshow
                const img = card.querySelector('.mbimg img');
                const dataSt = img ? img.getAttribute('data-st') : null;
                if (!img || !dataSt) return;

                card.dataset.originalSrc = img.dataset.src || img.src;
                const totalThumbs = parseInt(dataSt.split('|')[1], 10) || 15;
                const baseUrl = (img.dataset.src || img.src).replace(/\/\d+_\d+\.jpg(\?.*)?$/, '/');
                let currentThumb = 1;
                const intervalId = setInterval(() => {
                    currentThumb = (currentThumb % totalThumbs) + 1;
                    img.src = `${baseUrl}${currentThumb}_240.jpg`;
                }, 800);
                card.dataset.intervalId = intervalId;
            }
        } else if (e.type === 'mouseout') {
            if (activePreview.card && (!e.relatedTarget || !activePreview.card.contains(e.relatedTarget))) {
                clearActivePreview();
            }
        }
    }

    //================================================================================
    // SECTION 2: GERENCIAMENTO DE DADOS E UI
    //================================================================================

    const UIManager = {
        ui: {},
        create(container) {
            const enhancerContainer = document.createElement('div');
            enhancerContainer.id = 'enhancer-container';
            enhancerContainer.innerHTML = `
                <div id="enhancer-best-of-box" style="display:none; margin-bottom: 20px;">
                    <h2 style="color: #ffc107; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 20px;">
                        <span>${getText('bestOfTitle')}</span>
                        <select id="enhancer-best-of-dropdown"></select>
                        <button id="enhancer-toggle-best-of-btn" class="enhancer-box-toggle-btn" title="${getText('minimizeExpand')}"></button>
                    </h2>
                    <div id="enhancer-best-of-grid" class="enhancer-rec-grid"></div>
                </div>
                <div id="enhancer-recommendations-box" style="display:none; margin-bottom: 20px;">
                    <h2 style="color: #ffc107; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 20px;">
                        <span>${getText('pageRecommendationsTitle')}</span>
                        <button id="enhancer-toggle-page-recs-btn" class="enhancer-box-toggle-btn" title="${getText('minimizeExpand')}"></button>
                    </h2>
                    <div id="enhancer-recommendations-grid" class="enhancer-rec-grid"></div>
                </div>
                <div id="enhancer-status-wrapper">
                    <button id="enhancer-toggle-panel-btn" title="${getText('minimizeExpand')}"></button>
                    <div id="enhancer-status" style="padding:10px;background:#2a2a2a;border-radius:4px;color:#ffc107;font-weight:bold;margin-bottom:10px;text-align:center;line-height:1.5;"></div>
                </div>
                <div id="enhancer-loading-controls" style="display: none; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                      <button id="enhancer-pause-load-btn">${getText('pauseSearch')}</button>
                      <button id="enhancer-stop-load-btn">${getText('stopSearch')}</button>
                </div>
                <div id="enhancer-main-controls" style="padding:10px;border:1px solid #333;border-radius:4px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;">
                    <div style="display:flex;align-items:center;gap:8px;"><input type="checkbox" id="enhancer-load-all-toggle"><label for="enhancer-load-all-toggle" style="font-weight:bold;">${getText('loadAllPages')}</label></div>
                    <div id="enhancer-incremental-controls" style="align-items:center;gap:8px;display:none;"><label>${getText('loadPages')}</label><input type="number" id="enhancer-pages-to-load" value="10" min="1"><label>${getText('pages')}</label><button id="enhancer-load-more-btn">${getText('loadMore')}</button></div>
                    <label>${getText('columns')}:<select id="enhancer-column-selector"><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></label>
                    <label>${getText('preview')}:<select id="enhancer-preview-mode"><option value="video">${getText('video')}</option><option value="slideshow">${getText('slideshow')}</option></select></label>
                    <label style="display:flex;align-items:center;gap:8px;">${getText('delay')}:<input type="range" id="enhancer-delay-input" min="0" max="1500" step="50"><span id="enhancer-delay-value" style="color:#ffc107;min-width:60px;">250 ms</span></label>
                    <label style="display:flex;align-items:center;gap:8px;">${getText('workers')}:<input type="range" id="enhancer-worker-input" min="1" max="12" step="1"><span id="enhancer-worker-value" style="color:#ffc107;min-width:40px;">4</span></label>
                    <div><input type="checkbox" id="enhancer-notification-toggle" title="${getText('notify')}"><label for="enhancer-notification-toggle">${getText('notify')}</label></div>
                    <div><button id="enhancer-pornstar-modal-btn" title="${getText('pornstarFilter')}">👠</button><button id="enhancer-channel-toggle-btn" title="${getText('toggleChannels')}">📺</button></div>
                </div>
                <div id="enhancer-page-controls" class="enhancer-hidden" style="text-align:center;margin-bottom:10px;"><button id="enhancer-fetch-btn">${getText('prepareVideos')}</button><button id="enhancer-pause-resume-btn" style="display:none; margin-left: 10px;">${getText('pauseSearch')}</button><button id="enhancer-stop-fetch-btn" style="display:none; margin-left: 5px;">${getText('stopSearch')}</button><button id="enhancer-session-btn">${getText('redoSearch')}</button><button id="enhancer-clear-page-cache-btn">${getText('clearPageCache')}</button><button id="enhancer-clear-cache-btn">${getText('clearGlobalCache')}</button></div>
                <div id="enhancer-failure-log" class="enhancer-hidden" style="margin-bottom:10px;border:1px solid #dc3545;border-radius:4px;background:#2a2a2a;"><div style="padding:5px 10px;background:#444;color:#ffc107;font-weight:bold;">${getText('searchFailureLog')}</div><div id="enhancer-failure-log-content" style="padding:10px;max-height:150px;overflow-y:auto;font-size:0.9em;line-height:1.4;"></div></div>
                <div id="enhancer-filter-panel" class="enhancer-hidden"><div style="padding:10px;background:#333;border-radius:4px;margin-bottom:10px;"><div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;"><strong style="color:#66ff66;">${getText('inclusionFilters')}</strong><button id="enhancer-include-mode-toggle"></button></div><div id="enhancer-include-tags" style="min-height:24px;background:#2a2a2a;padding:5px;border-radius:3px;word-break:break-word;"></div><hr style="border-color:#555;margin:12px 0;"><strong style="color:#ff6666;">${getText('exclusionFilters')}</strong><div id="enhancer-exclude-tags" style="min-height:24px;margin-top:8px;background:#2a2a2a;padding:5px;border-radius:3px;word-break:break-word;"></div><hr style="border-color:#555;margin:12px 0;">
                <input type="text" id="enhancer-category-search" placeholder="${getText('searchCategory')}" style="width: 100%; padding: 8px; margin-bottom: 10px; background: #333; border: 1px solid #555; color: white; border-radius: 4px; box-sizing: border-box;">
                <ul id="enhancer-category-list" style="list-style:none;padding:0;margin:0;columns:4;column-gap:10px;"></ul><button id="enhancer-reset-filters" style="width:100%;margin-top:10px;">${getText('clearAllFilters')}</button></div></div>
                <div id="enhancer-pornstar-modal" class="enhancer-modal-backdrop" style="display: none;"><div class="enhancer-modal-content"><div class="enhancer-modal-header"><span>${getText('pornstarFilter')}</span><span class="enhancer-modal-close">&times;</span></div><div style="padding: 10px 15px 5px;"><input type="text" id="enhancer-pornstar-search" placeholder="${getText('searchPornstar')}" style="width: 100%; padding: 8px; background: #333; border: 1px solid #555; color: white; border-radius: 4px; box-sizing: border-box;"></div><div style="padding:5px 15px;color:#ccc;font-size:13px;">${getText('activePornstarFilters')}:<span id="enhancer-active-pornstars"></span></div><div id="enhancer-pornstar-list" class="enhancer-modal-body enhancer-modal-body-columns"></div></div></div>
                <div id="enhancer-cache-modal" class="enhancer-modal-backdrop" style="display: none;">
                    <div class="enhancer-modal-content">
                        <div class="enhancer-modal-header">
                            <span>${getText('clearCacheTitle')}</span>
                            <span class="enhancer-modal-close">&times;</span>
                        </div>
                        <div class="enhancer-modal-body">
                            <p style="margin-top:0; color:#ccc;">${getText('clearCacheDescription')}</p>
                            <ul id="enhancer-cache-modal-list" style="list-style:none; padding:0; margin:0;"></ul>
                        </div>
                        <div style="padding: 15px; border-top: 1px solid #555; text-align: right; display: flex; justify-content: flex-end; gap: 10px;">
                            <button id="enhancer-cache-modal-cancel-btn">${getText('cancel')}</button>
                            <button id="enhancer-cache-modal-confirm-btn" style="background-color: #dc3545;">${getText('confirmDeletion')}</button>
                        </div>
                    </div>
                </div>
            `;
            container.before(enhancerContainer);

            if (!document.getElementById('enhancer-taste-panel-btn')) {
                const tastePanelHTML = `
                    <button id="enhancer-taste-panel-btn" title="${getText('tasteProfileTitle')}">🧠</button>
                    <div id="enhancer-taste-modal" class="enhancer-modal-backdrop" style="display: none;">
                        <div class="enhancer-modal-content">
                            <div class="enhancer-modal-header">
                                <span>${getText('tasteProfileTitle')}</span>
                                <span id="enhancer-taste-modal-close" class="enhancer-modal-close">&times;</span>
                            </div>
                            <div class="enhancer-modal-body">
                               <div class="taste-list-container">
                                   <h3>${getText('favoriteTags')}</h3>
                                   <ul id="taste-modal-tags" class="taste-list"></ul>
                               </div>
                               <div class="taste-list-container">
                                   <h3>${getText('favoritePornstars')}</h3>
                                   <ul id="taste-modal-pornstars" class="taste-list"></ul>
                               </div>
                            </div>
                            <div style="padding: 15px; border-top: 1px solid #555; text-align: right;">
                                <button id="enhancer-reset-profile-btn">${getText('resetProfile')}</button>
                            </div>
                        </div>
                    </div>`;
                document.body.insertAdjacentHTML('beforeend', tastePanelHTML);
            }

            this.mapAndStyle();
            return this.ui;
        },

        mapAndStyle() {
            const mappings = { statusWrapper: '#enhancer-status-wrapper', togglePanelBtn: '#enhancer-toggle-panel-btn', status: '#enhancer-status', mainControls: '#enhancer-main-controls', pageControls: '#enhancer-page-controls', filterPanel: '#enhancer-filter-panel', categoryList: '#enhancer-category-list', categorySearch: '#enhancer-category-search', includeTags: '#enhancer-include-tags', excludeTags: '#enhancer-exclude-tags', includeModeToggle: '#enhancer-include-mode-toggle', resetFiltersBtn: '#enhancer-reset-filters', loadAllToggle: '#enhancer-load-all-toggle', incrementalControls: '#enhancer-incremental-controls', pagesToLoadInput: '#enhancer-pages-to-load', loadMoreBtn: '#enhancer-load-more-btn', columnSelector: '#enhancer-column-selector', languageSelector: '#enhancer-language-selector', previewModeSelector: '#enhancer-preview-mode', delayInput: '#enhancer-delay-input', delayValue: '#enhancer-delay-value', workerInput: '#enhancer-worker-input', workerValue: '#enhancer-worker-value', fetchBtn: '#enhancer-fetch-btn', pauseResumeBtn: '#enhancer-pause-resume-btn', stopFetchBtn: '#enhancer-stop-fetch-btn', sessionBtn: '#enhancer-session-btn', clearCacheBtn: '#enhancer-clear-cache-btn', clearPageCacheBtn: '#enhancer-clear-page-cache-btn', failureLog: '#enhancer-failure-log', failureLogContent: '#enhancer-failure-log-content', pornstarModalBtn: '#enhancer-pornstar-modal-btn', channelToggleBtn: '#enhancer-channel-toggle-btn', notificationToggle: '#enhancer-notification-toggle', pornstarModal: '#enhancer-pornstar-modal', pornstarSearch: '#enhancer-pornstar-search', pornstarList: '#enhancer-pornstar-list', activePornstars: '#enhancer-active-pornstars', loadingControls: '#enhancer-loading-controls', pauseLoadBtn: '#enhancer-pause-load-btn', stopLoadBtn: '#enhancer-stop-load-btn', recommendationsBox: '#enhancer-recommendations-box', recommendationsGrid: '#enhancer-recommendations-grid', togglePageRecsBtn: '#enhancer-toggle-page-recs-btn', bestOfBox: '#enhancer-best-of-box', bestOfGrid: '#enhancer-best-of-grid', bestOfDropdown: '#enhancer-best-of-dropdown', toggleBestOfBtn: '#enhancer-toggle-best-of-btn', tastePanelBtn: '#enhancer-taste-panel-btn', tasteModal: '#enhancer-taste-modal', tasteModalClose: '#enhancer-taste-modal-close', tasteModalTags: '#taste-modal-tags', tasteModalPornstars: '#taste-modal-pornstars', resetProfileBtn: '#enhancer-reset-profile-btn', cacheModal: '#enhancer-cache-modal', cacheModalList: '#enhancer-cache-modal-list', cacheModalConfirmBtn: '#enhancer-cache-modal-confirm-btn', cacheModalCancelBtn: '#enhancer-cache-modal-cancel-btn' };
            for (const key in mappings) {
                if (mappings.hasOwnProperty(key)) {
                    this.ui[key] = document.querySelector(mappings[key]);
                }
            }

            document.querySelectorAll('#enhancer-container button, #enhancer-reset-profile-btn').forEach(b => {
                if (!b.style.background) {
                    Object.assign(b.style, {
                        color: 'white', border: 'none', padding: '8px 12px',
                        borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                    });
                }
            });

            document.querySelectorAll('#enhancer-container select, #enhancer-container input[type="number"], #enhancer-container input[type="checkbox"], #enhancer-container input[type="range"]').forEach(el => {
                Object.assign(el.style, {
                    background: '#333', color: '#fff', border: '1px solid #555',
                    padding: '5px', borderRadius: '3px'
                });
            });

            Object.assign(this.ui.fetchBtn.style, { background: '#28a745' });
            Object.assign(this.ui.pauseResumeBtn.style, { background: '#ffc107', color: '#000' });
            Object.assign(this.ui.stopFetchBtn.style, { background: '#dc3545' });
            Object.assign(this.ui.sessionBtn.style, { background: '#ffc107', color: '#000', marginLeft: '10px' });
            Object.assign(this.ui.clearPageCacheBtn.style, { background: '#fd7e14', marginLeft: '5px' });
            Object.assign(this.ui.clearCacheBtn.style, { background: '#dc3545', marginLeft: '5px' });
            Object.assign(this.ui.resetFiltersBtn.style, { background: '#6c757d' });
            Object.assign(this.ui.pornstarModalBtn.style, { background: '#8e44ad', fontSize: '1.2em' });
            Object.assign(this.ui.channelToggleBtn.style, { background: '#6c757d', fontSize: '1.2em', marginLeft: '5px' });
            Object.assign(this.ui.togglePanelBtn.style, { background: '#555' });
            Object.assign(this.ui.pauseLoadBtn.style, { background: '#ffc107', color: '#000' });
            Object.assign(this.ui.stopLoadBtn.style, { background: '#dc3545' });
            Object.assign(this.ui.resetProfileBtn.style, { background: '#dc3545' });
            Object.assign(this.ui.cacheModalCancelBtn.style, { background: '#6c757d' });


            const dynamicStatusContainer = document.getElementById('enhancer-dynamic-status') || document.createElement('div');
            dynamicStatusContainer.id = 'enhancer-dynamic-status';
            dynamicStatusContainer.style.cssText = 'font-size: 12px; color: #ccc; text-align: center; margin-top: -5px; margin-bottom: 10px; display: none;';
            dynamicStatusContainer.innerHTML = `
                <span>Workers: <b id="status-workers" style="color:white;">0/0</b></span> |
                <span>Delay: <b id="status-delay" style="color:white;">0</b>ms</span> |
                <span>Velocidade: <b id="status-speed" style="color:white;">0</b> reqs/s</span> |
                <span>Falhas: <b id="status-failures" style="color:#ff9e9e;">0</b></span> |
                <span>Tempo: <b id="status-elapsed" style="color:white;">00:00</b></span> |
                <span>ETA: <b id="status-eta" style="color:white;">--:--</b></span>
            `;
            if(!document.getElementById('enhancer-dynamic-status')) {
                this.ui.status.after(dynamicStatusContainer);
            }
            this.ui.dynamicStatus = dynamicStatusContainer;
            this.ui.statusWorkers = dynamicStatusContainer.querySelector('#status-workers');
            this.ui.statusDelay = dynamicStatusContainer.querySelector('#status-delay');
            this.ui.statusSpeed = dynamicStatusContainer.querySelector('#status-speed');
            this.ui.statusFailures = dynamicStatusContainer.querySelector('#status-failures');
            this.ui.statusElapsed = dynamicStatusContainer.querySelector('#status-elapsed');
            this.ui.statusEta = dynamicStatusContainer.querySelector('#status-eta');
        }
    };

    const tagFetcherWorkerScript = `
        self.onmessage = async (event) => {
            const { videoData, delay } = event.data;

            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }

            if (!videoData || !videoData.href) {
                self.postMessage({ ...videoData, success: false, latency: 0, error: { name: 'DataError', message: 'Video data or href is missing.' } });
                return;
            }

            async function fetchPage(url) {
                const response = await fetch(url, { signal: AbortSignal.timeout(15000), credentials: 'same-origin' });
                if (!response.ok) {
                    throw new Error('HTTP status ' + response.status);
                }
                return await response.text();
            }

            const startTime = performance.now();
            let success = false;
            let error = null;

            try {
                const htmlText = await fetchPage(videoData.href);
                const categoryRegex = /<a href="\\/cat\\/[^"]+">([^<]+)<\\/a>/g;
                const pornstarRegex = /<a href="\\/pornstar\\/[^"]+">([^<]+)<\\/a>/g;
                const tags = [...htmlText.matchAll(categoryRegex)].map(match => match[1].trim());
                const pornstars = [...htmlText.matchAll(pornstarRegex)].map(match => match[1].trim());
                videoData.tags = tags.length > 0 ? tags : [];
                videoData.pornstars = pornstars.length > 0 ? pornstars : [];
                success = true;
            } catch (e) {
                error = { name: e.name, message: e.message };
            }

            const endTime = performance.now();
            const latency = endTime - startTime;
            self.postMessage({ ...videoData, success, latency, error });
        };
    `;

    const pageFetcherWorkerScript = `
        self.onmessage = async (event) => {
            const { command, url } = event.data;

            if (command === 'fetch') {
                try {
                    await new Promise(res => setTimeout(res, 250));
                    const response = await fetch(url, {
                        signal: AbortSignal.timeout(20000),
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'text/html,*/*'
                        }
                    });
                    if (!response.ok) {
                        throw new Error('HTTP status ' + response.status);
                    }
                    const htmlText = await response.text();
                    self.postMessage({ type: 'html', content: htmlText, url: url });
                } catch (error) {
                    self.postMessage({ type: 'error', error: { name: error.name, message: error.message }, url: url });
                }
            }
        };
    `;


    function initializeListPage(mainResultsContainer, options = {}) {
        const { showFilterUI = true } = options;

        if (mainResultsContainer.dataset.enhancerInitialized) return;
        mainResultsContainer.dataset.enhancerInitialized = 'true';

        let duplicateCount = 0;

        const initialPageHTML = mainResultsContainer.innerHTML;
        const isRelatedVideosSection = mainResultsContainer.id === 'relateddiv';

        let baseUrlForId = `${window.location.pathname}${window.location.search}`;
        const paginationEl_pre = mainResultsContainer.parentElement.querySelector('.numlist2');
        if (paginationEl_pre) {
            const anyLink = paginationEl_pre.querySelector('a[href]');
            if (anyLink) {
                try {
                   const url = new URL(anyLink.href);
                   baseUrlForId = `${url.pathname}${url.search}`;
                } catch (e) { console.error("Enhancer: Failed to parse pagination URL.", e); }
            }
        }
        const pageIdentifier = baseUrlForId.replace(/page=\d+/,'').replace(/[^a-zA-Z0-9_-]/g, '_');
        const SESSION_DB_KEY = `EnhancerPageDB_${pageIdentifier}`;

        const SESSION_DB_PARTS_KEY = `enhancer_session_parts_${pageIdentifier}`;
        const GLOBAL_DB_NAME = 'EnhancerGlobalCacheDB';

        injectGlobalLayoutCSS();
        if (showFilterUI) loadConfig();

        const includeFilters = new Set();
        const excludeFilters = new Set();
        const activePornstarFilters = new Set();

        let tagCache = new Map(),
            pornstarCache = new Map(),
            nextLinkToLoad = null,
            isLoadingPages = false;

        let instanceVideos = [];
        let filteredVideosData = [];
        let itemHeight = 0;
        let isRendering = false;
        let isHidingChannels = config.hideChannels;
        let globalPageAnalysis = { VIDEO: 0, CHANNEL: 0, PLACEHOLDER: 0, UNKNOWN: 0 };

        let dislikedVideoIds = new Set();

        let totalPages = 0;
        let videosPerPage = 0;

        const vscrollContainer = document.createElement('div');
        vscrollContainer.className = 'enhancer-vscroll-container';

        let thumbnailLoadQueue = [];
        let activeLoads = 0;
        const MAX_ACTIVE_LOADS = 4;
        const LOAD_DELAY = 150;
        const MAX_RETRIES = 2;
        const RETRY_DELAY = 500;

        function captureFrameFromVideo(videoUrl, callback) {
            const video = document.createElement('video');
            video.crossOrigin = "anonymous";

            const cleanup = () => {
                video.removeEventListener('seeked', onSeeked);
                video.removeEventListener('error', onError);
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                video.src = '';
                video.remove();
            };

            const onSeeked = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                    callback(canvas.toDataURL('image/jpeg'));
                } catch (e) {
                    console.error("Enhancer: Error capturing frame from canvas.", e);
                    callback(null);
                } finally {
                    cleanup();
                }
            };

            const onError = () => {
                console.error("Enhancer: Failed to load video for frame capture:", videoUrl);
                callback(null);
                cleanup();
            };

            const onLoadedMetadata = () => {
                video.currentTime = 1;
            };

            video.addEventListener('loadedmetadata', onLoadedMetadata);
            video.addEventListener('seeked', onSeeked);
            video.addEventListener('error', onError);
            video.muted = true;
            video.preload = 'metadata';
            video.src = videoUrl;
            video.load();
        }


        function loadImageWithRetries(img, retriesLeft) {
            const completionHandler = () => {
                activeLoads--;
                setTimeout(processThumbnailQueue, LOAD_DELAY);
            };

            img.onload = () => {
                img.onerror = null;
                completionHandler();
            };

            img.onerror = () => {
                if (retriesLeft > 0) {
                    setTimeout(() => {
                        img.src = "";
                        loadImageWithRetries(img, retriesLeft - 1);
                    }, RETRY_DELAY * (MAX_RETRIES - retriesLeft + 2));
                } else {
                    const card = img.closest('.mb');
                    const previewUrl = card ? card.dataset.previewUrl : null;

                    if (previewUrl) {
                        captureFrameFromVideo(previewUrl, (frameDataUrl) => {
                            if (frameDataUrl) {
                                img.src = frameDataUrl;
                            } else {
                                img.src = PLACEHOLDER_IMAGE;
                            }
                            img.onerror = null;
                            completionHandler();
                        });
                    } else {
                        img.src = PLACEHOLDER_IMAGE;
                        img.onerror = null;
                        completionHandler();
                    }
                }
            };

            img.src = img.dataset.src;
        }

        function processThumbnailQueue() {
            while (thumbnailLoadQueue.length > 0 && activeLoads < MAX_ACTIVE_LOADS) {
                const img = thumbnailLoadQueue.shift();
                if (img && !img.dataset.isLoading) {
                    activeLoads++;
                    img.dataset.isLoading = 'true';
                    loadImageWithRetries(img, MAX_RETRIES);
                }
            }
        }

        let currentlyRendered = new Map();

        const ui = showFilterUI ? UIManager.create(mainResultsContainer) : {};
        if (showFilterUI) {
            ui.channelToggleBtn.style.backgroundColor = isHidingChannels ? '#dc3545' : '#6c757d';
        }

        function togglePanelDisplay() {
            if (!showFilterUI) return;
            const container = document.getElementById('enhancer-container');
            if (config.panelCollapsed) {
                container.classList.add('collapsed');
                ui.togglePanelBtn.textContent = '＋';
            } else {
                container.classList.remove('collapsed');
                ui.togglePanelBtn.textContent = '—';
            }
        }

        function toggleBestOfDisplay() {
            if (!showFilterUI) return;
            const grid = ui.bestOfGrid;
            if (config.bestOfCollapsed) {
                grid.style.display = 'none';
                ui.toggleBestOfBtn.textContent = '＋';
            } else {
                grid.style.display = 'flex';
                ui.toggleBestOfBtn.textContent = '—';
            }
        }

        function togglePageRecsDisplay() {
            if (!showFilterUI) return;
            const grid = ui.recommendationsGrid;
            if (config.pageRecsCollapsed) {
                grid.style.display = 'none';
                ui.togglePageRecsBtn.textContent = '＋';
            } else {
                grid.style.display = 'flex';
                ui.togglePageRecsBtn.textContent = '—';
            }
        }

        function extractEssentialData(videoNode, precalculatedPreviewUrl = null) {
            const titleLink = videoNode.querySelector('.mbtit a');
            const img = videoNode.querySelector('.mbimg img');
            const qualityDiv = videoNode.querySelector('.mvhdico');
            const durationEl = videoNode.querySelector('.mbtim');
            const ratingEl = videoNode.querySelector('.mbrate');
            const viewsEl = videoNode.querySelector('.mbvie');
            const uploaderLink = videoNode.querySelector('.mb-uploader a');

            let imgSrc = img?.dataset.src || img?.src || '';
            let imgDataSt = img?.getAttribute('data-st') || '';
            let imgAlt = img?.alt || '';

            if (!imgSrc && videoNode.dataset.previewUrl) {
                const previewUrl = videoNode.dataset.previewUrl;
                const lastSlash = previewUrl.lastIndexOf('/');
                if (lastSlash > -1) {
                    const basePath = previewUrl.substring(0, lastSlash + 1);
                    imgSrc = `${basePath}1_240.jpg`;
                    imgDataSt = '240|15';
                }
            }
            if (!imgAlt && titleLink) {
                imgAlt = titleLink.textContent.trim();
            }

            return {
                id: videoNode.dataset.vp || videoNode.dataset.id,
                href: titleLink?.href || '',
                title: titleLink?.textContent.trim() || '',
                originalTitle: titleLink?.title || '',
                imgSrc: imgSrc,
                imgAlt: imgAlt,
                imgDataSt: imgDataSt,
                previewUrl: precalculatedPreviewUrl || videoNode.dataset.previewUrl || '',
                qualityHTML: qualityDiv?.innerHTML || '',
                duration: durationEl?.textContent.trim() || '',
                rating: ratingEl?.textContent.trim() || '',
                views: viewsEl?.textContent.trim() || '',
                uploaderName: uploaderLink?.textContent.trim() || '',
                uploaderHref: uploaderLink?.href || '',
                isChannel: !!videoNode.querySelector('.mb-uploader.ischannel'),
                classNames: videoNode.className || 'mb'
            };
        }

        function reconstructVideoHTML(data, recommendationInfo = null) {
            const uploaderHTML = data.uploaderName ? `<span class="mb-uploader ${data.isChannel ? 'ischannel' : ''}" title="Uploader"><a href="${data.uploaderHref}">${data.uploaderName}</a></span>` : '';
            const previewAttr = data.previewUrl ? `data-preview-url="${data.previewUrl}"` : '';

            let recommendationHTML = '';
            if (recommendationInfo) {
                recommendationHTML = `
                <div class="enhancer-recommendation-info">
                    <span>${recommendationInfo.reason}</span>
                    <span style="float: right;">
                        <span class="enhancer-feedback-btn" data-id="${data.id}" data-action="like" title="Gostei, quero ver mais vídeos como este">👍</span>
                        <span class="enhancer-feedback-btn" data-id="${data.id}" data-action="dislike" title="Não gostei, não recomendar mais vídeos como este">👎</span>
                    </span>
                </div>`;
            }

            return `
                <div class="mb" data-id="${data.id}" data-vp="${data.id}" ${previewAttr}>
                    <div class="mbimg">
                        <div class="mbcontent">
                            <a href="${data.href}">
                                <img src="" data-src="${data.imgSrc}" ${data.imgDataSt ? `data-st="${data.imgDataSt}"` : ''} alt="${data.imgAlt}">
                            </a>
                            ${data.qualityHTML ? `<div class="mvhdico" title="Quality">${data.qualityHTML}</div>` : ''}
                        </div>
                    </div>
                    <div class="mbunder">
                        <p class="mbtit"><a href="${data.href}" title="${data.originalTitle || data.title}">${data.title}</a></p>
                        <p class="mbstats">
                            ${data.duration ? `<span class="mbtim" title="Duration">${data.duration}</span>` : ''}
                            ${data.rating ? `<span class="mbrate" title="Rating">${data.rating}</span>` : ''}
                            ${data.views ? `<span class="mbvie" title="Views">${data.views}</span>` : ''}
                            ${uploaderHTML}
                        </p>
                        ${recommendationHTML}
                    </div>
                </div>`.trim();
        }

        function classifyElement(element) {
            const id = element.dataset.vp || element.dataset.id;
            const hasTitleLink = !!element.querySelector('.mbtit a');
            const hasImage = !!element.querySelector('.mbimg img');
            const isChannel = !!element.querySelector('.mb-uploader.ischannel');

            if (hasTitleLink && (hasImage || element.dataset.previewUrl)) {
                return isChannel ? 'CHANNEL' : 'VIDEO';
            }
            if (!id || id === '0|0|1') {
                 return 'PLACEHOLDER';
            }
            return 'UNKNOWN';
        }

        function getResponsiveColumnCount() {
            const windowWidth = window.innerWidth;
            if (windowWidth <= 900) return 1;
            if (windowWidth <= 1400) return 2;
            return parseInt(config.columnCount, 10);
        }

        function calculateAndSetItemHeight() {
            if (itemHeight > 0 || filteredVideosData.length === 0) return;
            const columnCount = getResponsiveColumnCount();
            const containerWidth = vscrollContainer.clientWidth;
            if (containerWidth === 0) return;
            const itemWidth = (containerWidth / columnCount) - 12;

            const tempItemHTML = reconstructVideoHTML(filteredVideosData[0].data);
            const tempItem = document.createElement('div');
            tempItem.innerHTML = tempItemHTML;

            const card = tempItem.firstElementChild;

            if (!card) return;
            card.style.position = 'absolute';
            card.style.visibility = 'hidden';
            card.style.width = `${itemWidth}px`;
            vscrollContainer.appendChild(card);
            itemHeight = card.offsetHeight + 24;
            vscrollContainer.removeChild(card);
            if (itemHeight <= 24) {
                itemHeight = (itemWidth / 1.77) + 100;
            }
        }

        function renderVisibleItems() {
            const columnCount = getResponsiveColumnCount();
            document.documentElement.style.setProperty('--enhancer-column-count', columnCount);

            if (itemHeight === 0 && filteredVideosData.length > 0) {
                calculateAndSetItemHeight();
                if (itemHeight <= 24) return;
                const rowCount = Math.ceil(filteredVideosData.length / columnCount);
                vscrollContainer.style.height = `${rowCount * itemHeight}px`;
            }
            if (itemHeight === 0) return;
            const containerWidth = vscrollContainer.clientWidth;
            if (containerWidth === 0) return;

            const scrollTop = window.scrollY - (vscrollContainer.offsetTop || 0);
            const viewportHeight = window.innerHeight;
            const buffer = itemHeight * 6;
            const startIndex = Math.max(0, Math.floor((scrollTop - buffer) / itemHeight) * columnCount);
            const endIndex = Math.min(filteredVideosData.length, Math.ceil((scrollTop + viewportHeight + buffer) / itemHeight) * columnCount);

            const newVisibleIndexes = new Set();
            for (let i = startIndex; i < endIndex; i++) {
                newVisibleIndexes.add(i);
            }

            for (const [index, element] of currentlyRendered.entries()) {
                if (!newVisibleIndexes.has(index)) {
                    element.remove();
                    currentlyRendered.delete(index);
                }
            }

            for (const index of newVisibleIndexes) {
                if (!currentlyRendered.has(index)) {
                    const videoData = filteredVideosData[index];
                    if (!videoData) continue;

                    const itemHTML = reconstructVideoHTML(videoData.data);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = itemHTML;
                    const itemEl = tempDiv.firstElementChild;
                    if (!itemEl) continue;

                    const rowIndex = Math.floor(index / columnCount);
                    const colIndex = index % columnCount;
                    const itemWidth = (containerWidth / columnCount) - 12;
                    const top = rowIndex * itemHeight;
                    const left = colIndex * (itemWidth + 12) + 6;
                    itemEl.style.position = 'absolute';
                    itemEl.style.top = `${top}px`;
                    itemEl.style.left = `${left}px`;
                    itemEl.style.width = `${itemWidth}px`;
                    itemEl.style.display = 'flex';

                    vscrollContainer.appendChild(itemEl);
                    currentlyRendered.set(index, itemEl);

                    const img = itemEl.querySelector('img[data-src]');
                    if (img && !img.dataset.queued) {
                        img.dataset.queued = 'true';
                        thumbnailLoadQueue.push(img);
                    }
                }
            }

            if (thumbnailLoadQueue.length > 0 && activeLoads < MAX_ACTIVE_LOADS) {
                processThumbnailQueue();
            }
        }


        const throttledRender = () => {
            if (isRendering) return;
            isRendering = true;
            requestAnimationFrame(() => {
                renderVisibleItems();
                isRendering = false;
            });
        };

        function deduplicateVideos(videoArray) {
            const seenHrefs = new Set();
            const originalLength = videoArray.length;
            const dedupedArray = videoArray.filter(video => {
                if (!video.href || seenHrefs.has(video.href)) {
                    return false;
                }
                seenHrefs.add(video.href);
                return true;
            });
            const numRemoved = originalLength - dedupedArray.length;
            if (numRemoved > 0) {
                 duplicateCount += numRemoved;
            }
            return dedupedArray;
        }

        let charMapCache = null;

        function getCharMap() {
            if (charMapCache) {
                return charMapCache;
            }
            const compressedMap = "aªÀÁÂÃÄÅàáâãäåĀāĂăąǍǎǟ|bßΒβБВвБВвḇᴮᵇ|cÇçĆćĈČčᶜℂℭ|dĎďḐḑḒḓᴰᵈ|eÈÉÊËèéêëĒēĔĕĖėęĚěᴱᵉₑℯℰ|fᶠ|gĜĝĞğĠġģᴳᵍℊ|hĤĥᴴʰₕℍℋℌ|iÌÍÏìíîïĨĩĪĬĭĮįİⁱᵢℐℑⅠ|jĴĵʲⱼ|kĶķᴷᵏₖΚκКкКк|lĹĺĻļĽľĿˡₗℒℓⅬⅼ|mᴹᵐₘℳ|nÑñŃńŇňⁿₙℕ|oºÒÓÔÕÖòóôõöŌōŎŏŐőơỢợỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợₒᴼᵒ|pÞþṔṕℙᵖₚ|rŔŕŖŗŘřᴿʳᵣℛℜℝ|sŚśŜŝŞşŠšſˢₛ|tţŤťᵀᵗₜ|uÚÛÜùúûüũŪūŬŭůűųƯưⓊᵁᵘᵤ|vᵛᵥ|wŴŵᵂʷ|yÝýÿŶŸỲỳỶỷỸỹ|zźŻżŽžᶻℤℨ";
            charMapCache = {};
            const parts = compressedMap.split('|');
            for (const part of parts) {
                const value = part[0];
                const keys = part.substring(1);
                for (const key of keys) {
                    charMapCache[key] = value;
                }
            }
            return charMapCache;
        }

        function normalizeTitle(title) {
            if (!title) return '';

            const charMap = getCharMap();
            let normalized = title;

            for (const [special, normal] of Object.entries(charMap)) {
                normalized = normalized.replace(new RegExp(special, 'g'), normal);
            }

            normalized = normalized
                .replace(/[♥️🔥★]/g, '')
                .replace(/!!+/g, '!')
                .replace(/--+/g, '-')
                .toLowerCase()
                .replace(/4/g, 'a')
                .replace(/3/g, 'e')
                .replace(/1/g, 'l')
                .replace(/0/g, 'o')
                .replace(/5/g, 's')
                .replace(/7/g, 't');

            return normalized.trim().replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/([a-zA-Z])\s(?=[A-Z]{2,})/g, '$1');
        }

        function normalizeNodeTitle(videoNode) {
            const titleElement = videoNode.querySelector('.mbtit a');
            if (titleElement) {
                const originalTitle = titleElement.textContent;
                const normalizedTitle = normalizeTitle(originalTitle);
                if (originalTitle !== normalizedTitle) {
                    titleElement.textContent = normalizedTitle;
                    titleElement.title = `Original: ${originalTitle}`;
                    return 1;
                }
            }
            return 0;
        }

        async function updateAndSaveBestOfCache(scoredVideos) {
            const HIGH_SCORE_THRESHOLD = 50;
            const CACHE_LIMIT = 102;

            const newCandidates = scoredVideos
                .filter(v => v.recommendationScore > HIGH_SCORE_THRESHOLD && !dislikedVideoIds.has(v.id) && !v.isChannel)
                .map(v => ({ id: v.id, data: v.data, score: v.recommendationScore, tags: v.tags, pornstars: v.pornstars, reason: v.reason }));

            if (newCandidates.length === 0) return;

            const existingBestOf = await DBManager.getBestOfCache();
            const combined = [...existingBestOf, ...newCandidates];

            const uniqueBestOf = Array.from(new Map(combined.map(v => [v.id, v])).values());

            const sortedBestOf = uniqueBestOf.sort((a, b) => b.score - a.score);
            const trimmedBestOf = sortedBestOf.slice(0, CACHE_LIMIT);

            await DBManager.updateBestOfCache(trimmedBestOf);
            await displayBestOfRecommendations();
        }

        async function displayBestOfRecommendations(filterTag = 'all') {
             if (!showFilterUI) return;

            const bestOfVideos = await DBManager.getBestOfCache();
            if (bestOfVideos.length === 0) {
                ui.bestOfBox.style.display = 'none';
                return;
            }

            const filteredBestOf = filterTag === 'all'
                ? bestOfVideos
                : bestOfVideos.filter(v => v.tags && v.tags.includes(filterTag));

            if (filteredBestOf.length === 0 && filterTag !== 'all') {
                 ui.bestOfGrid.innerHTML = `<p style="color:#ccc; text-align:center;">Nenhum vídeo encontrado em "Melhores" com a tag "${filterTag}".</p>`;
                 return;
            } else if (filteredBestOf.length === 0) {
                 ui.bestOfBox.style.display = 'none';
                 return;
            }

            ui.bestOfGrid.innerHTML = filteredBestOf.map(v => reconstructVideoHTML(v.data, { reason: v.reason, score: v.score })).join('');
            ui.bestOfGrid.querySelectorAll('img[data-src]').forEach(img => {
                if (!img.dataset.queued) {
                    img.dataset.queued = 'true';
                    thumbnailLoadQueue.push(img);
                }
            });
            if (thumbnailLoadQueue.length > 0) processThumbnailQueue();

            const topTags = Object.entries(tasteProfile.tags)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([name]) => name);

            ui.bestOfDropdown.innerHTML = `<option value="all">${getText('bestOfFilterAll')}</option>` + topTags.map(tag => `<option value="${tag}" ${tag === filterTag ? 'selected' : ''}>${getText('bestOfFilterBy')} ${tag}</option>`).join('');

            ui.bestOfBox.style.display = 'block';
        }


        async function updateRecommendations() {
            if (!showFilterUI) return;

            const profile = tasteProfile;
            if (!profile || (!profile.tags && !profile.pornstars) || (Object.keys(profile.tags).length === 0 && Object.keys(profile.pornstars).length === 0)) {
                ui.recommendationsBox.style.display = 'none';
                return;
            }

            const scoredVideos = instanceVideos
                .filter(video => !dislikedVideoIds.has(video.id) && !video.isChannel)
                .map(video => {
                let score = 0;
                let contributingFactors = [];

                if (video.tags) {
                    video.tags.forEach(tag => {
                        const tagScore = profile.tags[tag] || 0;
                        if (tagScore > 0) contributingFactors.push({ name: tag, score: tagScore });
                        score += tagScore;
                    });
                }
                if (video.pornstars) {
                    video.pornstars.forEach(ps => {
                        const psScore = profile.pornstars[ps] || 0;
                         if (psScore > 0) contributingFactors.push({ name: ps, score: psScore });
                        score += psScore;
                    });
                }

                const baseScore = score;
                const matchCount = contributingFactors.length;
                if (matchCount > 1) {
                    const comboFactor = 0.15;
                    const bonusMultiplier = 1 + ((matchCount - 1) * comboFactor);
                    score = baseScore * bonusMultiplier;
                }

                contributingFactors.sort((a,b) => b.score - a.score);
                const reasons = contributingFactors.slice(0, 3).map(f => `<b>${f.name}</b>`);

                let reasonStr = "";
                if (reasons.length > 0) {
                     reasonStr = `Porque você gosta de ${reasons.join(', ')}`;
                }

                return { ...video, recommendationScore: score, reason: reasonStr };
            });

            await updateAndSaveBestOfCache(scoredVideos);

            const recommended = scoredVideos
                .filter(v => !v.isChannel)
                .sort((a, b) => b.recommendationScore - a.recommendationScore)
                .slice(0, 30);

            if (recommended.length > 0 && recommended[0].recommendationScore > 0) {
                ui.recommendationsGrid.innerHTML = recommended.map(v => reconstructVideoHTML(v.data, { reason: v.reason, score: v.recommendationScore })).join('');
                ui.recommendationsGrid.querySelectorAll('img[data-src]').forEach(img => {
                    if (!img.dataset.queued) {
                         img.dataset.queued = 'true';
                         thumbnailLoadQueue.push(img);
                    }
                });
                if (thumbnailLoadQueue.length > 0) processThumbnailQueue();

                ui.recommendationsBox.style.display = 'block';
            } else {
                ui.recommendationsBox.style.display = 'none';
            }
        }

        const updateUI = () => {
            if (!showFilterUI) return;

            const baseVideoSet = instanceVideos.filter(videoData => {
                if (isHidingChannels && videoData.isChannel) return false;
                if ([...excludeFilters].some(f => new Set(videoData.tags || []).has(f))) return false;
                return true;
            });

            const videosForPornstarList = baseVideoSet.filter(videoData => {
                const tags = new Set(videoData.tags || []);
                if (includeFilters.size > 0) {
                    return config.includeMode === 'OR'
                        ? [...includeFilters].some(f => tags.has(f))
                        : [...includeFilters].every(f => tags.has(f));
                }
                return true;
            });

            const videosForTagList = baseVideoSet.filter(videoData => {
                const pornstars = new Set(videoData.pornstars || []);
                if (activePornstarFilters.size > 0) {
                    return [...activePornstarFilters].some(f => pornstars.has(f));
                }
                return true;
            });

            if (!document.getElementById('session-quota-warning') && ui.status && !isLoadingPages) {
                ui.status.innerHTML = getText('showingStatus', {
                    filtered: filteredVideosData.length.toLocaleString('pt-BR'),
                    total: instanceVideos.length.toLocaleString('pt-BR')
                }) + `<br><small style="color: #ccc; font-weight: normal;">` + getText('totalAnalysisStatus', {
                    videos: globalPageAnalysis.VIDEO.toLocaleString('pt-BR'),
                    channels: globalPageAnalysis.CHANNEL.toLocaleString('pt-BR'),
                    duplicates: duplicateCount.toLocaleString('pt-BR')
                }) + `</small>`;
            }

            if (ui.includeModeToggle) {
                ui.includeModeToggle.textContent = `${getText('logic')}: ${config.includeMode === 'OR' ? getText('logicOr') : getText('logicAnd')}`;
                ui.includeModeToggle.style.background = config.includeMode === 'OR' ? '#007bff' : '#28a745';
            }
            const renderTags = (container, filterSet, color) => {
                if (!container) return;
                container.innerHTML = filterSet.size > 0 ? [...filterSet].sort((a, b) => a.localeCompare(b)).map(f => `<span class="active-tag" style="background-color:${color};" data-tag="${f}">${f} &times;</span>`).join(' ') : `<i style="color:#888;">${getText('noFiltersAdded')}</i>`;
            };
            renderTags(ui.includeTags, includeFilters, '#007bff');
            renderTags(ui.excludeTags, excludeFilters, '#dc3545');
            renderTags(ui.activePornstars, activePornstarFilters, '#8e44ad');

            const tagCounts = new Map();
            videosForTagList.forEach(video => {
                if (video.tags && video.tags.length > 0 && video.tags[0] !== 'FETCH_FAILED') {
                    video.tags.forEach(tag => {
                        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
                    });
                }
            });

            const searchTerm = ui.categorySearch ? ui.categorySearch.value.toLowerCase() : '';
            const allTags = [...tagCounts.keys()]
                .filter(t => t && t.toLowerCase().includes(searchTerm))
                .sort((a, b) => a.localeCompare(b));

            if (ui.categoryList) {
                ui.categoryList.innerHTML = allTags.map(tag => {
                    let color = '#fff', text = tag;
                    if (includeFilters.has(tag)) { color = '#66aaff'; text = `<b>${tag}</b>`; }
                    if (excludeFilters.has(tag)) { color = '#ff8888'; text = `<s>${tag}</s>`; }
                    return `<li style="margin-bottom: 5px; color:${color};"><span class="tag-action-btn" style="color:#66ff66;" data-action="include" data-tag="${tag}">[+]</span><span class="tag-action-btn" style="color:#ff6666;" data-action="exclude" data-tag="${tag}">[-]</span> ${text} (${tagCounts.get(tag) || 0})</li>`;
                }).join('');
            }

            const pornstarCounts = new Map();
            videosForPornstarList.forEach(video => {
                if (video.pornstars && video.pornstars.length > 0) {
                    video.pornstars.forEach(pornstar => {
                        pornstarCounts.set(pornstar, (pornstarCounts.get(pornstar) || 0) + 1);
                    });
                }
            });
            const allPornstars = [...pornstarCounts.keys()].sort((a, b) => a.localeCompare(b));
            if (ui.pornstarList) {
                const currentSearch = ui.pornstarSearch.value.toLowerCase();
                ui.pornstarList.innerHTML = allPornstars.map(p => {
                    const isSelected = activePornstarFilters.has(p);
                    const isHidden = !p.toLowerCase().includes(currentSearch);
                    return `<div class="enhancer-modal-item ${isSelected ? 'selected' : ''} ${isHidden ? 'hidden' : ''}" data-pornstar="${p}">${p} (${pornstarCounts.get(p)})</div>`;
                }).join('');
            }
        };

        const applyFilters = () => {
            filteredVideosData = instanceVideos.filter(videoData => {
                const tags = new Set(videoData.tags || []);
                const pornstars = new Set(videoData.pornstars || []);

                if (isHidingChannels && videoData.isChannel) {
                    return false;
                }
                if ([...excludeFilters].some(f => tags.has(f))) {
                    return false;
                }
                if (includeFilters.size > 0) {
                    const pass = config.includeMode === 'OR'
                        ? [...includeFilters].some(f => tags.has(f))
                        : [...includeFilters].every(f => tags.has(f));
                    if (!pass) return false;
                }
                if (activePornstarFilters.size > 0) {
                    if (![...activePornstarFilters].some(f => pornstars.has(f))) {
                        return false;
                    }
                }
                return true;
            });

            vscrollContainer.innerHTML = '';
            currentlyRendered.clear();
            thumbnailLoadQueue = [];
            activeLoads = 0;
            itemHeight = 0;

            throttledRender();
            updateUI();
            updateRecommendations();
        };

        const applyGlobalCache = () => {
            if(tagCache.size === 0) return;
            let loadedFromCache = 0;
            instanceVideos.forEach(video => {
                if ((!video.tags || video.tags.length === 0) && tagCache.has(video.href)) {
                    video.tags = tagCache.get(video.href);
                    video.pornstars = pornstarCache.get(video.href) || [];
                    loadedFromCache++;
                }
            });
            if (loadedFromCache > 0) {
                console.log(`Enhancer: Applied global cache to ${loadedFromCache} videos.`);
            }
        };

        const fetchVideoTags = async () => {
            applyGlobalCache();
            updateUI();
            updateRecommendations();

            ui.fetchBtn.disabled = true;
            ui.pauseResumeBtn.style.display = 'inline-block';
            ui.stopFetchBtn.style.display = 'inline-block';
            ui.pauseResumeBtn.textContent = getText('pauseSearch');
            ui.dynamicStatus.style.display = 'block';

            let isStoppingFetch = false;
            let finalFailureCount = 0;
            const saveInterval = setInterval(() => DBManager.saveGlobalCache(tagCache, pornstarCache), 30000);

            const stopHandler = () => { isStoppingFetch = true; };
            ui.stopFetchBtn.addEventListener('click', stopHandler);

            async function runFetchCycle(videosToFetch, isRetryCycle = false) {
                return new Promise(async (resolve) => {
                    if (videosToFetch.length === 0) {
                        resolve({ successful: [], failed: [] });
                        return;
                    }

                    let isFetchingPaused = false;
                    const workers = new Map();
                    const workerBlob = new Blob([tagFetcherWorkerScript], { type: 'application/javascript' });
                    const workerUrl = URL.createObjectURL(workerBlob);
                    let activeWorkers = 0;
                    let isCircuitBreakerTripped = false;
                    let timerInterval = null;

                    const MAX_WORKERS = Math.max(4, config.workerCount);
                    let currentDelay = isRetryCycle ? 500 : Math.max(50, config.fetchDelay);
                    let successStreak = 0;
                    let failureStreak = 0;
                    let processedCount = 0;
                    let failureCount = 0;
                    const totalToFetch = videosToFetch.length;
                    const CIRCUIT_BREAKER_THRESHOLD = 20;
                    const successfulThisCycle = [];
                    const failedThisCycle = [];
                    const timeHistory = [];
                    const startTime = performance.now();

                    const formatTime = (seconds) => {
                        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
                        return `${mins}:${secs}`;
                    };

                    const updateTimers = () => {
                        const elapsedSeconds = (performance.now() - startTime) / 1000;
                        ui.statusElapsed.textContent = formatTime(elapsedSeconds);
                        if (timeHistory.length > 0) {
                            const avgTimePerTask = timeHistory.reduce((a, b) => a + b, 0) / timeHistory.length;
                            const remainingTasks = totalToFetch - processedCount;
                            const etaSeconds = (remainingTasks * avgTimePerTask) / MAX_WORKERS / 1000;
                            if (etaSeconds > 0 && isFinite(etaSeconds)) {
                                ui.statusEta.textContent = formatTime(etaSeconds);
                            } else {
                                ui.statusEta.textContent = '--:--';
                            }
                        }
                    };
                    if (timerInterval) clearInterval(timerInterval);
                    timerInterval = setInterval(updateTimers, 1000);

                    const updateDynamicStatus = () => {
                        ui.statusWorkers.textContent = `${activeWorkers}/${MAX_WORKERS}`;
                        ui.statusDelay.textContent = currentDelay.toFixed(0);
                        ui.statusFailures.textContent = finalFailureCount + failureCount;
                        const speed = activeWorkers > 0 ? 1000 / (currentDelay / activeWorkers) : 0;
                        ui.statusSpeed.textContent = speed.toFixed(1);
                    };
                    updateDynamicStatus();

                    const adjustSpeed = (success) => {
                        if (success) {
                            successStreak++;
                            failureStreak = 0;
                            if (successStreak >= 15) {
                                successStreak = 0;
                                currentDelay = Math.max(50, currentDelay * 0.9);
                            }
                        } else {
                            successStreak = 0;
                            failureStreak++;
                            failureCount++;
                            currentDelay = Math.min(2000, currentDelay * 1.5);
                            if (failureStreak >= CIRCUIT_BREAKER_THRESHOLD) {
                                isCircuitBreakerTripped = true;
                                console.error(`CIRCUIT BREAKER TRIPPED: ${CIRCUIT_BREAKER_THRESHOLD} consecutive failures.`);
                            }
                        }
                    };

                    const finishCycle = () => {
                        URL.revokeObjectURL(workerUrl);
                        clearInterval(timerInterval);
                        resolve({ successful: successfulThisCycle, failed: failedThisCycle });
                    };

                    const processNextTask = () => {
                        if (isStoppingFetch || isFetchingPaused || isCircuitBreakerTripped || videosToFetch.length === 0 || activeWorkers >= MAX_WORKERS) {
                            if ((isCircuitBreakerTripped || isStoppingFetch) && activeWorkers === 0) finishCycle();
                            return;
                        }

                        const videoData = videosToFetch.shift();
                        const worker = new Worker(workerUrl);
                        workers.set(worker, true);
                        activeWorkers++;
                        updateDynamicStatus();

                        worker.onmessage = (event) => {
                            activeWorkers--;
                            workers.delete(worker);
                            const result = event.data;
                            if (!result.success && result.error) {
                                console.error(`[Enhancer Worker] Failed to fetch ${result.href}:`, result.error);
                            }

                            const originalVideo = instanceVideos.find(v => v.id === result.id);
                            if (originalVideo) {
                                if (result.success) {
                                    successfulThisCycle.push(result);
                                    originalVideo.tags = result.tags;
                                    originalVideo.pornstars = result.pornstars;
                                    tagCache.set(result.href, result.tags);
                                    pornstarCache.set(result.href, result.pornstars);
                                } else {
                                    failedThisCycle.push(originalVideo);
                                }
                            }

                            processedCount++;
                            adjustSpeed(result.success);
                            timeHistory.push(result.latency + currentDelay);
                            if (timeHistory.length > 50) timeHistory.shift();

                            const statusTextKey = isRetryCycle ? 'tagSearchRetryStatus' : 'tagSearchStatus';
                            ui.status.innerHTML = `${getText(statusTextKey)} (${processedCount}/${totalToFetch}) <progress value="${processedCount}" max="${totalToFetch}" style="width:100%"></progress>`;
                            updateDynamicStatus();

                            if (processedCount === totalToFetch) {
                                if (activeWorkers === 0) finishCycle();
                            } else {
                                processNextTask();
                            }
                            worker.terminate();
                        };
                        worker.postMessage({ videoData, delay: currentDelay });
                    };

                    ui.pauseResumeBtn.onclick = () => {
                        isFetchingPaused = !isFetchingPaused;
                        ui.pauseResumeBtn.textContent = isFetchingPaused ? getText('resumeSearch') : getText('pauseSearch');
                        if (!isFetchingPaused) {
                            const statusTextKey = isRetryCycle ? `Continuando retentativa...` : `Continuando busca...`;
                            ui.status.textContent = getText(statusTextKey);
                            timerInterval = setInterval(updateTimers, 1000);
                            for (let i = 0; i < MAX_WORKERS; i++) processNextTask();
                        } else {
                            ui.status.textContent = getText('tagSearchPausedStatus');
                            clearInterval(timerInterval);
                            workers.forEach((value, worker) => worker.terminate());
                            workers.clear();
                            activeWorkers = 0;
                            updateDynamicStatus();
                            updateUI();
                        }
                    };

                    for (let i = 0; i < MAX_WORKERS; i++) {
                        processNextTask();
                    }
                });
            }

            let videosToProcess = instanceVideos.filter(v => (!v.tags || v.tags.length === 0 || v.tags[0] === 'FETCH_FAILED') && !v.isChannel);
            if (videosToProcess.length === 0) {
                ui.status.textContent = getText('tagSearchAllCached', { total: instanceVideos.length });
                ui.fetchBtn.disabled = false;
                ui.pauseResumeBtn.style.display = 'none';
                ui.stopFetchBtn.style.display = 'none';
                ui.dynamicStatus.style.display = 'none';
                clearInterval(saveInterval);
                updateUI();
                return;
            }

            const mainCycleResult = await runFetchCycle(videosToProcess, false);
            finalFailureCount += mainCycleResult.failed.length;

            if (mainCycleResult.failed.length > 0 && !isStoppingFetch) {
                const retryCycleResult = await runFetchCycle(mainCycleResult.failed, true);
                finalFailureCount = retryCycleResult.failed.length;
            }

            ui.fetchBtn.disabled = false;
            ui.pauseResumeBtn.style.display = 'none';
            ui.stopFetchBtn.style.display = 'none';
            ui.dynamicStatus.style.display = 'none';
            ui.stopFetchBtn.removeEventListener('click', stopHandler);
            clearInterval(saveInterval);

            if (isStoppingFetch) {
                ui.status.innerHTML = `<span style="color: #ffc107;">${getText('tagSearchStopped')}</span>`;
                 showNotification('tagSearchStoppedNotification', 'tagSearchStoppedNotificationBody');
            } else {
                ui.status.textContent = getText('tagSearchFinished', { processed: instanceVideos.length - finalFailureCount, failures: finalFailureCount });
                 showNotification('tagSearchFinishedNotification', 'tagSearchFinishedNotificationBody', { processed: instanceVideos.length - finalFailureCount });
            }

            await DBManager.saveGlobalCache(tagCache, pornstarCache);
            await DBManager.saveSession(instanceVideos, nextLinkToLoad, SESSION_DB_KEY);

            updateUI();
            applyFilters();
        };

        const loadPages = async (pagesToLoad = Infinity) => {
            if (isLoadingPages || !nextLinkToLoad) return;
            isLoadingPages = true;

            let pageWorker = null;

            if (showFilterUI) {
                ui.loadMoreBtn.disabled = true;
                ui.loadMoreBtn.textContent = getText('loading');
                ui.loadingControls.style.display = 'flex';
                ui.pauseLoadBtn.style.display = 'none';
                ui.stopLoadBtn.style.display = 'inline-block';
            }

            let loadedCount = 0;
            const pageWorkerBlob = new Blob([pageFetcherWorkerScript], { type: 'application/javascript' });
            const pageWorkerUrl = URL.createObjectURL(pageWorkerBlob);
            pageWorker = new Worker(pageWorkerUrl);

            const stopLoading = async (reason) => {
                if (!isLoadingPages) return;
                isLoadingPages = false;
                console.log(`[PAGINATION] ${reason}`);

                if (pageWorker) {
                    pageWorker.terminate();
                    pageWorker = null;
                    URL.revokeObjectURL(pageWorkerUrl);
                }

                if(showFilterUI) {
                    ui.loadMoreBtn.disabled = false;
                    ui.loadMoreBtn.textContent = nextLinkToLoad ? getText('loadMore') : getText('end');
                    if (!nextLinkToLoad) {
                        ui.incrementalControls.style.display = 'none';
                        ui.loadAllToggle.disabled = true;
                        showNotification('pageSearchFinishedNotification', 'pageSearchFinishedNotificationBody', { total: instanceVideos.length });
                    } else if (reason.includes('user')) {
                        showNotification('pageSearchStoppedNotification', 'pageSearchStoppedNotificationBody');
                    }
                    ui.pageControls.classList.remove('enhancer-hidden');
                    ui.loadingControls.style.display = 'none';
                }

                instanceVideos = deduplicateVideos(instanceVideos);
                applyGlobalCache();
                applyFilters();
                await DBManager.saveSession(instanceVideos, nextLinkToLoad, SESSION_DB_KEY);
            };


            pageWorker.onmessage = (event) => {
                const { type, ...data } = event.data;

                if (type === 'html') {
                    const { content: htmlText, url } = data;
                    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                    const currentPageNum = getPageNumberFromUrl(url);

                    const videoElements = doc.querySelectorAll('#vidresults .mb, .thumbs .mb, .index .mb, .fillerOuter.profilemain .filler .mb');
                    videoElements.forEach(videoNode => {
                        const videoType = classifyElement(videoNode);
                        if (videoType === 'PLACEHOLDER' || videoType === 'UNKNOWN') return;
                        globalPageAnalysis[videoType]++;
                        const href = videoNode.querySelector('.mbtit a')?.href;
                        if (href) {
                            normalizeNodeTitle(videoNode);
                            let previewUrl = '';
                            const onMouseOverAttr = videoNode.getAttribute('onmouseover');
                            if (onMouseOverAttr) {
                                const match = onMouseOverAttr.match(/start_preview\(this, '([^']+\.mp4)'\)/);
                                if (match && match[1]) previewUrl = match[1];
                            }

                            if (!previewUrl) {
                                const imgElement = videoNode.querySelector('.mbimg img');
                                if (imgElement) {
                                    const imgSrc = imgElement.dataset.src || imgElement.src;
                                    if (imgSrc && !imgSrc.includes('base64')) {
                                        const videoId = videoNode.dataset.vp || videoNode.dataset.id;
                                        const vidIdOnly = videoId.split('|')[0];
                                        previewUrl = imgSrc.substr(0, imgSrc.lastIndexOf("/")) + '/' + vidIdOnly + '-preview.mp4';
                                        previewUrl = previewUrl.replace("static-key-cdn", "static-ca-cdn");
                                    }
                                }
                            }

                            const essentialData = extractEssentialData(videoNode, previewUrl);
                            instanceVideos.push({
                                data: essentialData,
                                id: essentialData.id,
                                href: essentialData.href,
                                isChannel: essentialData.isChannel
                            });
                        }
                    });

                    const nextLinkElement = doc.querySelector('.numlist2 a.nmnext');
                    let newNextLink = nextLinkElement ? nextLinkElement.href : null;
                    if (newNextLink) {
                        const nextUrlPageNum = getPageNumberFromUrl(newNextLink);
                        if (nextUrlPageNum > 0 && nextUrlPageNum < currentPageNum) {
                            newNextLink = null;
                        }
                    }

                    nextLinkToLoad = newNextLink;
                    loadedCount++;
                    applyFilters();

                    const totalFound = (globalPageAnalysis.VIDEO + globalPageAnalysis.CHANNEL).toLocaleString('pt-BR');
                    if(ui.status) ui.status.textContent = getText('pageAnalysisStatus', { currentPage: currentPageNum, totalFound: totalFound });

                    if (nextLinkToLoad && loadedCount < pagesToLoad) {
                        pageWorker.postMessage({ command: 'fetch', url: nextLinkToLoad });
                    } else {
                        stopLoading('End of search reached.');
                    }

                } else if (type === 'error') {
                    console.error(`Enhancer Worker: Failed to load ${data.url}.`, data.error);
                    stopLoading('Network error.');
                }
            };

            pageWorker.postMessage({ command: 'fetch', url: nextLinkToLoad });
            ui.stopLoadBtn.onclick = () => stopLoading('Search stopped by user.');
        };

        const showTastePanel = async () => {
            const profile = await DBManager.loadTasteProfile() || { tags: {}, pornstars: {} };

            const createListHTML = (items, type) => {
                const sortedItems = Object.entries(items).sort(([,a],[,b]) => b - a);
                if (sortedItems.length === 0) return `<li>${getText('noItemsScored')}</li>`;
                return sortedItems.map(([name, score]) => `
                    <li data-name="${name}" data-type="${type}">
                        <span class="taste-list-item-name">${name}</span>
                        <input type="number" class="score-input" value="${score.toFixed(0)}" data-type="${type}" data-name="${name}">
                        <span class="taste-list-delete-btn" data-type="${type}" data-name="${name}" title="${getText('removeItemFromProfile')}">❌</span>
                    </li>
                `).join('');
            };

            ui.tasteModalTags.innerHTML = createListHTML(profile.tags, 'tags');
            ui.tasteModalPornstars.innerHTML = createListHTML(profile.pornstars, 'pornstars');
            ui.tasteModal.style.display = 'block';
        };

        if (showFilterUI) {
            ui.togglePanelBtn.addEventListener('click', () => { config.panelCollapsed = !config.panelCollapsed; saveConfig(); togglePanelDisplay(); });
            ui.toggleBestOfBtn.addEventListener('click', () => { config.bestOfCollapsed = !config.bestOfCollapsed; saveConfig(); toggleBestOfDisplay(); });
            ui.togglePageRecsBtn.addEventListener('click', () => { config.pageRecsCollapsed = !config.pageRecsCollapsed; saveConfig(); togglePageRecsDisplay(); });
            ui.categorySearch.addEventListener('input', updateUI);
            ui.notificationToggle.addEventListener('change', () => { config.showCompletionNotification = ui.notificationToggle.checked; saveConfig(); if (config.showCompletionNotification) { Notification.requestPermission(); } });
            ui.loadAllToggle.addEventListener('change', () => { config.loadAllPages = ui.loadAllToggle.checked; ui.incrementalControls.style.display = config.loadAllPages ? 'none' : 'flex'; saveConfig(); if (config.loadAllPages && nextLinkToLoad) loadPages(Infinity); });
            ui.includeModeToggle.addEventListener('click', () => { config.includeMode = config.includeMode === 'OR' ? 'AND' : 'OR'; applyFilters(); saveConfig(); });
            ui.categoryList.addEventListener('click', e => {
                const action = e.target.dataset.action;
                const tag = e.target.dataset.tag;
                if (!action || !tag) return;
                e.preventDefault();
                if (action === 'include') {
                    excludeFilters.delete(tag);
                    if (includeFilters.has(tag)) {
                        includeFilters.delete(tag);
                        updateTasteProfile('tags', tag, -5);
                    } else {
                        includeFilters.add(tag);
                        updateTasteProfile('tags', tag, 5);
                    }
                } else if (action === 'exclude') {
                    includeFilters.delete(tag);
                    if (excludeFilters.has(tag)) {
                        excludeFilters.delete(tag);
                         updateTasteProfile('tags', tag, 5);
                    } else {
                        excludeFilters.add(tag);
                         updateTasteProfile('tags', tag, -5);
                    }
                }
                applyFilters();
            });
            ui.includeTags.addEventListener('click', e => { if (e.target.dataset.tag) { includeFilters.delete(e.target.dataset.tag); updateTasteProfile('tags', e.target.dataset.tag, -5); applyFilters(); } });
            ui.excludeTags.addEventListener('click', e => { if (e.target.dataset.tag) { excludeFilters.delete(e.target.dataset.tag); updateTasteProfile('tags', e.target.dataset.tag, 5); applyFilters(); } });
            ui.resetFiltersBtn.addEventListener('click', () => { includeFilters.clear(); excludeFilters.clear(); activePornstarFilters.clear(); applyFilters(); });
            ui.columnSelector.addEventListener('change', () => { config.columnCount = ui.columnSelector.value; itemHeight = 0; applyFilters(); saveConfig(); });
            ui.previewModeSelector.addEventListener('change', () => { config.previewMode = ui.previewModeSelector.value; itemHeight = 0; applyFilters(); saveConfig(); });
            ui.clearCacheBtn.addEventListener('click', async () => {
                try {
                    const stats = await DBManager.getCacheStats();
                    const storeLabels = {
                        tags: getText('cacheTags'),
                        pornstars: getText('cachePornstars'),
                        tasteProfile: getText('cacheTasteProfile'),
                        bestOfCache: getText('cacheBestOf'),
                        dislikedVideos: getText('cacheDisliked')
                    };

                    ui.cacheModalList.innerHTML = Object.entries(storeLabels).map(([storeName, label]) => `
                        <li style="padding: 8px 0; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center;">
                            <label for="cache-checkbox-${storeName}" style="cursor:pointer; flex-grow: 1;">
                                <input type="checkbox" id="cache-checkbox-${storeName}" data-store-name="${storeName}">
                                ${label}
                            </label>
                            <span style="color: #ffc107;">(${(stats[storeName] || 0).toLocaleString('pt-BR')} itens)</span>
                        </li>
                    `).join('');

                    ui.cacheModal.style.display = 'block';
                } catch (e) {
                    alert(getText('deletionError'));
                    console.error("Enhancer: Failed to prepare cache clearing modal.", e);
                }
            });
            ui.cacheModal.querySelector('.enhancer-modal-close').addEventListener('click', () => ui.cacheModal.style.display = 'none');
            ui.cacheModalCancelBtn.addEventListener('click', () => ui.cacheModal.style.display = 'none');
            ui.cacheModalConfirmBtn.addEventListener('click', async () => {
                const checkboxes = ui.cacheModalList.querySelectorAll('input[type="checkbox"]:checked');
                const storesToClear = Array.from(checkboxes).map(cb => cb.dataset.storeName);

                if (storesToClear.length === 0) {
                    ui.cacheModal.style.display = 'none';
                    return;
                }

                if (confirm(`Tem certeza que deseja apagar os dados de: ${storesToClear.join(', ')}?`)) {
                    try {
                        await DBManager.clearObjectStores(storesToClear);
                        alert(getText('deletionSuccess') + ' A página será recarregada.');
                        location.reload();
                    } catch (e) {
                        alert(getText('deletionError'));
                        console.error('Enhancer: Falha ao limpar o cache seletivo.', e);
                    } finally {
                        ui.cacheModal.style.display = 'none';
                    }
                }
            });
            ui.clearPageCacheBtn.addEventListener('click', async () => {
                const keysToDelete = instanceVideos.map(v => v.href).filter(Boolean);

                if (keysToDelete.length === 0) {
                    alert(getText('clearPageCacheEmpty'));
                    return;
                }

                const confirmationMessage = getText('clearPageCacheConfirm', { count: keysToDelete.length });
                if (confirm(confirmationMessage)) {
                    try {
                        await DBManager.deleteItemsFromStores(['tags', 'pornstars'], keysToDelete);
                        alert(getText('clearPageCacheSuccess', { count: keysToDelete.length }));
                        location.reload();
                    } catch (e) {
                        alert(getText('clearPageCacheError'));
                        console.error('Enhancer: Falha ao limpar o cache da página.', e);
                    }
                }
            });
            ui.sessionBtn.addEventListener('click', async () => {
                if (confirm('Isso limpará os vídeos carregados APENAS nesta página e a recarregará. Deseja continuar?')) {
                    try {
                        await DBManager.deleteAllSessionParts(SESSION_DB_KEY);
                        localStorage.removeItem(`${SESSION_DB_KEY}_nextLink`);
                        localStorage.removeItem(SESSION_DB_PARTS_KEY);
                        location.reload();
                    } catch (e) {
                        console.error('Enhancer: Falha ao limpar o banco de dados da sessão.', e);
                    }
                }
            });
            ui.fetchBtn.addEventListener('click', fetchVideoTags);
            ui.loadMoreBtn.addEventListener('click', () => { const pages = parseInt(ui.pagesToLoadInput.value, 10); if (pages > 0) loadPages(pages); });
            ui.pornstarModalBtn.addEventListener('click', () => { ui.pornstarModal.style.display = 'block'; });
            ui.pornstarModal.querySelector('.enhancer-modal-close').addEventListener('click', () => ui.pornstarModal.style.display = 'none');
            ui.pornstarModal.addEventListener('click', (e) => { if (e.target === ui.pornstarModal) ui.pornstarModal.style.display = 'none'; });
            ui.pornstarList.addEventListener('click', e => {
                const pornstar = e.target.closest('.enhancer-modal-item')?.dataset.pornstar;
                if (pornstar) {
                    if (activePornstarFilters.has(pornstar)) {
                        activePornstarFilters.delete(pornstar);
                        updateTasteProfile('pornstars', pornstar, -5);
                    } else {
                        activePornstarFilters.add(pornstar);
                        updateTasteProfile('pornstars', pornstar, 5);
                    }
                }
                applyFilters();
            });
            ui.activePornstars.addEventListener('click', e => { if (e.target.dataset.tag) { activePornstarFilters.delete(e.target.dataset.tag); updateTasteProfile('pornstars', e.target.dataset.tag, -5); applyFilters(); } });
            ui.pornstarSearch.addEventListener('input', () => updateUI());
            ui.channelToggleBtn.addEventListener('click', () => {
                isHidingChannels = !isHidingChannels;
                config.hideChannels = isHidingChannels;
                saveConfig();
                ui.channelToggleBtn.style.backgroundColor = isHidingChannels ? '#dc3545' : '#6c757d';
                applyFilters();
            });
            ui.delayInput.addEventListener('input', () => { ui.delayValue.textContent = `${ui.delayInput.value} ms`; });
            ui.delayInput.addEventListener('change', () => { config.fetchDelay = parseInt(ui.delayInput.value, 10); saveConfig(); });
            ui.workerInput.addEventListener('input', () => { ui.workerValue.textContent = ui.workerInput.value; });
            ui.workerInput.addEventListener('change', () => { config.workerCount = parseInt(ui.workerInput.value, 10); saveConfig(); });

            ui.tastePanelBtn.addEventListener('click', showTastePanel);
            ui.tasteModalClose.addEventListener('click', () => ui.tasteModal.style.display = 'none');
            ui.tasteModal.addEventListener('click', (e) => { if (e.target === ui.tasteModal) ui.tasteModal.style.display = 'none'; });
            ui.resetProfileBtn.addEventListener('click', async () => {
                if (confirm('Tem certeza que deseja resetar seu perfil de gosto? Esta ação é irreversível.')) {
                    tasteProfile = { id: 'userProfile', tags: {}, pornstars: {} };
                    await DBManager.saveTasteProfile(tasteProfile);
                    await showTastePanel();
                    await updateRecommendations();
                }
            });
            ui.tasteModal.addEventListener('click', e => {
                const target = e.target.closest('.taste-list-delete-btn');
                if (!target) return;
                const type = target.dataset.type;
                const name = target.dataset.name;
                if (tasteProfile[type] && tasteProfile[type][name] !== undefined) {
                    delete tasteProfile[type][name];
                    debouncedSaveProfile();
                    target.closest('li').remove();
                    updateRecommendations();
                }
            });
            ui.tasteModal.addEventListener('change', e => {
                const target = e.target;
                if (!target.classList.contains('score-input')) return;

                const type = target.dataset.type;
                const name = target.dataset.name;
                const newScore = parseInt(target.value, 10);

                if (!isNaN(newScore) && tasteProfile[type] && tasteProfile[type][name] !== undefined) {
                    tasteProfile[type][name] = newScore;
                    debouncedSaveProfile();

                    const listElement = type === 'tags' ? ui.tasteModalTags : ui.tasteModalPornstars;
                    const items = Array.from(listElement.children);
                    items.sort((a, b) => {
                        const scoreA = parseInt(a.querySelector('.score-input').value, 10) || 0;
                        const scoreB = parseInt(b.querySelector('.score-input').value, 10) || 0;
                        return scoreB - scoreA;
                    });
                    items.forEach(item => listElement.appendChild(item));

                    updateRecommendations();
                }
            });

            ui.recommendationsGrid.addEventListener('click', async (e) => {
                const target = e.target.closest('.enhancer-feedback-btn');
                if (!target) return;

                const action = target.dataset.action;
                const videoId = target.dataset.id;
                const videoData = instanceVideos.find(v => v.id === videoId);

                if (action === 'like' && videoData) {
                    const scoreChange = 10;
                    if (videoData.tags) videoData.tags.forEach(tag => updateTasteProfile('tags', tag, scoreChange));
                    if (videoData.pornstars) videoData.pornstars.forEach(ps => updateTasteProfile('pornstars', ps, scoreChange));
                } else if (action === 'dislike') {
                    await DBManager.addDislikedVideo(videoId);
                    dislikedVideoIds.add(videoId);
                }

                const card = target.closest('.mb');
                if (card) {
                    card.style.transition = 'opacity 0.3s ease';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        updateRecommendations();
                    }, 300);
                }
            });
            ui.bestOfDropdown.addEventListener('change', (e) => {
                displayBestOfRecommendations(e.target.value);
            });
        }

        vscrollContainer.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            const card = e.target.closest('.mb');
            if (!link || !card) return;
            if (e.target.closest('.enhancer-feedback-btn')) return;

            const videoId = card.dataset.id;
            const videoData = instanceVideos.find(v => v.id === videoId);

            if (videoData) {
                if (videoData.tags && videoData.tags.length > 0) {
                    videoData.tags.forEach(tag => updateTasteProfile('tags', tag, 1));
                }
                if (videoData.pornstars && videoData.pornstars.length > 0) {
                    videoData.pornstars.forEach(ps => updateTasteProfile('pornstars', ps, 1));
                }
            }
        });

        vscrollContainer.addEventListener('mouseover', handleVideoPreviewEvents);
        vscrollContainer.addEventListener('mouseout', handleVideoPreviewEvents);
      if (showFilterUI) {
        ui.recommendationsGrid.addEventListener('mouseover', handleVideoPreviewEvents);
        ui.recommendationsGrid.addEventListener('mouseout', handleVideoPreviewEvents);
        ui.bestOfGrid.addEventListener('mouseover', handleVideoPreviewEvents);
        ui.bestOfGrid.addEventListener('mouseout', handleVideoPreviewEvents);
        }
        window.addEventListener('scroll', throttledRender);
        window.addEventListener('resize', () => {
    EP.functions.waitForFinalEvent(() => {
        applyFilters();
    }, 250, "enhancer-resize-debounce");
});

        const mainAsync = async () => {
            if (showFilterUI) {
                try {
                    await DBManager.initializeGlobalDB();
                    await initializeTasteProfile();
                    dislikedVideoIds = new Set(await DBManager.getDislikedVideos());
                    await displayBestOfRecommendations();
                } catch (error) {
                    ui.status.innerHTML = `<span style="color: #dc3545;">CRITICAL FAILURE: Could not initialize database.</span>`;
                    return;
                }
                const cache = await DBManager.loadGlobalCache();
                tagCache = cache.tagCache;
                pornstarCache = cache.pornstarCache;

                ui.loadAllToggle.checked = config.loadAllPages;
                ui.columnSelector.value = config.columnCount;
                ui.previewModeSelector.value = config.previewMode;
                ui.delayInput.value = config.fetchDelay;
                ui.delayValue.textContent = `${config.fetchDelay} ms`;
                ui.workerInput.value = config.workerCount;
                ui.workerValue.textContent = config.workerCount;
                ui.notificationToggle.checked = config.showCompletionNotification;
                ui.incrementalControls.style.display = config.loadAllPages ? 'none' : 'flex';
                togglePanelDisplay();
                toggleBestOfDisplay();
                togglePageRecsDisplay();
            }

            const paginationEl = mainResultsContainer.parentElement.querySelector('.numlist2');
            mainResultsContainer.innerHTML = '';
            mainResultsContainer.appendChild(vscrollContainer);

            const initialContainer = document.createElement('div');
            initialContainer.innerHTML = initialPageHTML;

            initialContainer.querySelectorAll('.mb').forEach(videoNode => {
                const videoType = classifyElement(videoNode);
                globalPageAnalysis[videoType]++;
                if (videoType === 'PLACEHOLDER' || videoType === 'UNKNOWN') return;
                const href = videoNode.querySelector('.mbtit a')?.href;
                if (href) {
                    normalizeNodeTitle(videoNode);
                    let previewUrl = '';
                    const onMouseOverAttr = videoNode.getAttribute('onmouseover');
                    if (onMouseOverAttr) {
                        const match = onMouseOverAttr.match(/start_preview\(this, '([^']+\.mp4)'\)/);
                        if (match && match[1]) previewUrl = match[1];
                    }
                    if (!previewUrl) {
                        const imgElement = videoNode.querySelector('.mbimg img');
                        if (imgElement) {
                            const imgSrc = imgElement.dataset.src || imgElement.src;
                            if (imgSrc && !imgSrc.includes('base64')) {
                                const videoId = videoNode.dataset.vp || videoNode.dataset.id;
                                const vidIdOnly = videoId.split('|')[0];
                                previewUrl = imgSrc.substr(0, imgSrc.lastIndexOf("/")) + '/' + vidIdOnly + '-preview.mp4';
                                previewUrl = previewUrl.replace("static-key-cdn", "static-ca-cdn");
                            }
                        }
                    }
                    if(previewUrl) videoNode.dataset.previewUrl = previewUrl;

                    const essentialData = extractEssentialData(videoNode, previewUrl);
                    instanceVideos.push({
                        data: essentialData,
                        id: essentialData.id,
                        href: essentialData.href,
                        isChannel: essentialData.isChannel
                    });
                }
            });

            const sessionData = showFilterUI ? await DBManager.loadSession(SESSION_DB_KEY) : null;

            if (isRelatedVideosSection) {
                if (ui.mainControls) ui.mainControls.style.display = 'none';
                if (ui.pageControls) ui.pageControls.classList.remove('enhancer-hidden');
            } else if (sessionData && showFilterUI) {
                console.log("Enhancer: Loading saved session from database.");
                const loadedVideos = sessionData.videos;
                nextLinkToLoad = sessionData.nextLink;

                const seenIds = new Set(loadedVideos.map(v => v.id));
                const newInitialVideos = instanceVideos.filter(video => !seenIds.has(video.id));
                instanceVideos = [...newInitialVideos, ...loadedVideos];

                globalPageAnalysis = { VIDEO: 0, CHANNEL: 0, PLACEHOLDER: 0, UNKNOWN: 0 };
                instanceVideos.forEach(v => {
                    if (v.isChannel) globalPageAnalysis.CHANNEL++; else globalPageAnalysis.VIDEO++;
                });

            }

            instanceVideos = deduplicateVideos(instanceVideos);

            if (showFilterUI && !isRelatedVideosSection) {
                ui.pageControls.classList.remove('enhancer-hidden');
                if (tagCache.size > 0 || pornstarCache.size > 0) ui.filterPanel.classList.remove('enhancer-hidden');

                if (paginationEl) {
                    paginationEl.classList.add('enhancer-hidden');
                    if (!nextLinkToLoad && !sessionData) {
                        nextLinkToLoad = paginationEl.querySelector('a.nmnext')?.href || null;
                    }
                }
                if (!nextLinkToLoad) {
                    ui.loadAllToggle.disabled = true;
                    ui.incrementalControls.style.display = 'none';
                    ui.loadMoreBtn.textContent = getText('end');
                }
            }

            applyGlobalCache();
            applyFilters();
            if (showFilterUI && config.loadAllPages && nextLinkToLoad && !sessionData) {
                await loadPages(Infinity);
            }
        };

        mainAsync();
    }

    //================================================================================
    // SECTION 3: INICIALIZAÇÃO PRINCIPAL DO SCRIPT
    //================================================================================

    const GLOBAL_SELECTORS = {
        videoContainers: '#vidresults, .thumbs, .index, #relateddiv, .fillerOuter.profilemain .filler, #rec-best-vid, #rec-for-country, #rec-for-you, #rec-home',
        fullUiContainers: '#vidresults, #rec-home, .thumbs, .index, .fillerOuter.profilemain .filler',
        videoCard: '.mb',
        observerRoot: '#content'
    };

    function main() {
        if (document.getElementById('EPvideo')) {
            handleVideoPage();
        }

        GM_registerMenuCommand('Change Language', toggleLanguageAndReload);

        const initializedContainers = new WeakSet();

        const processContainer = (container) => {
            if (initializedContainers.has(container)) {
                return;
            }

            const hasVideos = container.querySelector(GLOBAL_SELECTORS.videoCard);
            const shouldShowUI = container.matches(GLOBAL_SELECTORS.fullUiContainers);

            if (hasVideos) {
                initializedContainers.add(container);
                initializeListPage(container, { showFilterUI: shouldShowUI });
            } else {
                initializedContainers.add(container);
                const secondaryObserver = new MutationObserver((mutations, obs) => {
                    if (container.querySelector(GLOBAL_SELECTORS.videoCard)) {
                        obs.disconnect();
                        initializeListPage(container, { showFilterUI: shouldShowUI });
                    }
                });
                secondaryObserver.observe(container, { childList: true, subtree: true });
            }
        };

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    document.querySelectorAll(GLOBAL_SELECTORS.videoContainers).forEach(processContainer);
                }
            }
        });

        const targetNode = document.querySelector(GLOBAL_SELECTORS.observerRoot) || document.body;
        observer.observe(targetNode, { childList: true, subtree: true });

        document.querySelectorAll(GLOBAL_SELECTORS.videoContainers).forEach(processContainer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();

/* ============================
   FIX GRID LAYOUT (restore v61 style)
   ============================ */
(function restoreOldGridCSS() {
    if (document.getElementById('enhancer-grid-restore-css')) return;
    const style = document.createElement('style');
    style.id = 'enhancer-grid-restore-css';
    style.textContent = `
        :root { --enhancer-column-count: 3; }
        .vidresults6 .mb,
        #vidresults .mb,
        #relateddiv .mb,
        .index .mb,
        .thumbs .mb,
        .filler .mb {
            width: calc(100% / var(--enhancer-column-count) - 12px) !important;
            max-width: none !important;
            min-width: 300px !important;
            margin: 0 6px 24px 6px !important;
            float: left !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            height: auto !important;
        }
        .mb[data-preview-active="true"] { z-index: 100 !important; }
        #vidresults, .index, .thumbs, #relateddiv, .fillerOuter.profilemain .filler, .vidresults6 {
            display: table !important;
            clear: both !important;
            width: 100%;
        }
        #vidresults::after, .index::after, .thumbs::after, #relateddiv::after, .fillerOuter.profilemain .filler::after, .vidresults6::after {
            content: '';
            display: block;
            clear: both;
        }
    `;
    document.head.appendChild(style);
})();