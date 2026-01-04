// ==UserScript==
// @name         CineBusca Pro
// @namespace    https://github.com/estudiobrisacriativa/CineBusca-Pro
// @version      1.0.0
// @license      MIT
// @description  O seu assistente de mídia definitivo. Busque informações detalhadas, trailers e torrents para qualquer filme ou série com um simples atalho (Ctrl+1). Explore lançamentos, veja os títulos mais populares e organize sua lista de favoritos com facilidade.
// @author       Estudio Brisa Criativa
// @match        *://*/*
// @match       https://www.netflix.com/*
// @match       https://www.primevideo.com/*
// @match       https://www.disneyplus.com/*
// @icon        https://raw.githubusercontent.com/estudiobrisacriativa/CineBusca-Pro/refs/heads/main/assets/icon.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.themoviedb.org
// @connect      image.tmdb.org
// @connect      yts.mx
// @connect      apibay.org
// @downloadURL https://update.greasyfork.org/scripts/549391/CineBusca%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/549391/CineBusca%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SUA API KEY ---
    const tmdbApiKey = '4514ec3b323c023dd7772b82a3772435';

    // --- CRIAÇÃO DO SHADOW DOM PARA ISOLAMENTO TOTAL ---
    const host = document.createElement('div');
    host.id = 'smart-search-host';
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: 'open' });


    // --- ESTILOS (INJETADOS DIRETAMENTE NO SHADOW DOM) ---
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

        :host {
            --c-text: #e0e0e0; --c-background: #212121; --c-surface: #333333;
            --c-primary: #a89166; --c-secondary: #8a8a8a; --c-tertiary: #5f5f5f;
            --c-border: #424242; --c-text-dark: #212121; --c-light-bg: #f5f5f5;
            --c-favorite: #DC143C; /* Crimson */
            --c-success: #5a9e5e;
        }

        /* --- CSS Reset robusto para isolamento --- */
        *, *::before, *::after {
            box-sizing: border-box; margin: 0; padding: 0; border: 0;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            line-height: 1.4;
            color: var(--c-text);
            font-weight: 400;
        }
         a { text-decoration: none; color: inherit; }
         button { cursor: pointer; background: transparent; font-family: inherit; }
         img { display: block; max-width: 100%; }
         h3 { font-weight: 700; font-size: 1.05em;}
        /* --- Fim do Reset --- */


        #smart-search-container {
            position: fixed; top: 20px; right: 20px; width: 450px; height: 600px;
            background-color: var(--c-background);
            border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);
            z-index: 2147483647;
            display: none; flex-direction: column;
            border: 1px solid var(--c-border); overflow: hidden;
        }
        #smart-search-header {
            padding: 10px; background-color: var(--c-background); display: flex;
            align-items: center; gap: 8px; border-bottom: 1px solid var(--c-border); position: relative; flex-shrink: 0;
        }
        #search-input-wrapper {
            flex-grow: 1; display: flex; align-items: center; gap: 8px; background-color: var(--c-surface);
            border-radius: 20px; padding: 0 15px; border: 1px solid var(--c-border);
        }
        #smart-search-input {
            width: 100%; padding: 10px 0; background: none;
            font-size: 14px; outline: none;
            color: var(--c-text);
            flex-grow: 1;
        }
        #smart-search-input::placeholder, #year-filter-input::placeholder { color: var(--c-secondary); }
        #year-filter-input {
            width: 60px;
            background: none;
            border: none;
            outline: none;
            color: var(--c-text);
            font-size: 14px;
            text-align: center;
            flex-shrink: 0;
        }
        #year-filter-input::-webkit-outer-spin-button,
        #year-filter-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        #year-filter-input[type=number] {
            -moz-appearance: textfield;
        }

        .header-btn { cursor: pointer; padding: 5px; display: flex; align-items: center; flex-shrink: 0; }
        .header-btn svg { fill: #AAAAAA; width: 22px; height: 22px; transition: fill 0.2s; }
        .header-btn:hover svg { fill: var(--c-text); }
        #back-btn { display: none; }

        #panel-container {
            flex-grow: 1;
            position: relative;
        }

        .panel {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease-in-out, visibility 0s 0.2s;
            overflow-y: auto;
            padding: 15px;
        }
        .panel.active {
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
        }

        .panel::-webkit-scrollbar { width: 5px; }
        .panel::-webkit-scrollbar-track { background: var(--c-surface); }
        .panel::-webkit-scrollbar-thumb { background-color: var(--c-tertiary); border-radius: 10px; }

        .section-title { font-size: 1.1em; font-weight: 700; color: var(--c-primary); margin: 15px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: center; }
        .section-title:first-child { margin-top: 0; }

        #home-nav { display: flex; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid var(--c-border); padding-bottom: 10px; margin-bottom: 10px;}
        .home-nav-btn { font-size: 0.9em; color: var(--c-secondary); padding: 5px 10px; border-radius: 6px; transition: all 0.2s; }
        .home-nav-btn.active, .home-nav-btn:hover { color: var(--c-text); background-color: var(--c-surface); }

        #recent-searches-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .recent-search-tag { font-size: 0.75em; font-weight: 500; color: var(--c-text); background-color: var(--c-border); border: 1px solid var(--c-surface); padding: 4px 10px; border-radius: 15px; cursor: pointer; transition: all 0.2s ease; }
        .recent-search-tag:hover { background-color: var(--c-primary); border-color: var(--c-primary); color: var(--c-text-dark); }
        #clear-recents-btn { font-size: 0.75em; color: var(--c-secondary); background-color: transparent; border: 1px solid var(--c-border); padding: 4px 10px; border-radius: 15px; cursor: pointer; transition: all 0.2s; }
        #clear-recents-btn:hover { background-color: var(--c-primary); color: var(--c-text-dark); }


        .search-result-item { position: relative; display: flex; margin-bottom: 12px; padding: 10px; background-color: var(--c-surface); border-radius: 8px; transition: background-color 0.2s ease, border-left-color 0.3s ease; align-items: flex-start; border-left: 4px solid transparent; }
        .search-result-item:hover { background-color: var(--c-border); }
        .search-result-item.movie-item { cursor: pointer; }
        .search-result-item.favorited-item { border-left-color: var(--c-favorite); }

        .fav-btn-item {
            position: absolute; top: 15px; right: 15px; width: 32px; height: 32px;
            display: flex; justify-content: center; align-items: center; cursor: pointer;
            background-color: rgba(33, 33, 33, 0.7); border-radius: 50%;
            transition: all 0.2s ease-in-out; z-index: 2;
        }
        .fav-btn-item:hover { background-color: rgba(0, 0, 0, 0.9); transform: scale(1.1); }
        .fav-btn-item svg { width: 18px; height: 18px; fill: var(--c-secondary); transition: all 0.2s; }
        .fav-btn-item:hover svg { fill: var(--c-text); }
        @keyframes pulseFavorite { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .fav-btn-item.favorited svg { animation: pulseFavorite 0.3s ease-in-out; fill: var(--c-favorite); }

        .result-poster { width: 80px; height: 120px; border-radius: 8px; margin-right: 15px; object-fit: cover; background-color: var(--c-background); flex-shrink: 0; }
        .result-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .result-title { font-size: 1.1em; font-weight: 700; color: var(--c-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 50px; }
        .result-meta { font-size: 0.85em; color: var(--c-secondary); margin-top: 4px; display: flex; align-items: center; }
        .result-meta .star-icon { color: #ffc107; margin-right: 4px; }
        .result-overview { font-size: 0.9em; line-height: 1.5; margin-top: 8px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; padding-right: 50px; }

        .search-message, .search-spinner { text-align: center; padding: 20px; color: var(--c-secondary); }
        .search-spinner { border: 4px solid var(--c-surface); border-top: 4px solid var(--c-primary); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        #trailer-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); z-index: 2147483647; justify-content: center; align-items: center; }
        #trailer-modal-content { position: relative; width: 90%; max-width: 800px; aspect-ratio: 16 / 9; background-color: black; }
        #trailer-modal-close { position: absolute; top: -30px; right: 0; background: none; border: none; font-size: 2em; color: white; cursor: pointer; }
        #trailer-iframe { width: 100%; height: 100%; border: none; }
        #details-panel { padding: 0; }
        .details-header { position: relative; padding: 20px; color: white; min-height: 200px; display: flex; align-items: flex-end; background-size: cover; background-position: center; }
        .details-header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, rgba(33, 33, 33, 1) 10%, rgba(33, 33, 33, 0.7) 50%, rgba(33, 33, 33, 0.3) 100%); }
        .details-header-content { position: relative; z-index: 2; display: flex; gap: 20px; width: 100%; align-items: flex-end;}
        .details-poster { width: 100px; height: 150px; border-radius: 8px; object-fit: cover; flex-shrink: 0; border: 2px solid white; }
        .details-title-section { flex-grow: 1; }
        .details-title { font-size: 1.6em; margin: 0 0 5px 0; font-weight: 700; line-height: 1.2; color: white;}
        .details-original-title { font-size: 0.9em; font-style: italic; opacity: 0.8; color: white;}
        .details-rating { display: flex; align-items: center; gap: 5px; margin-top: 10px; font-size: 1.1em; font-weight: 500; color: white;}
        .details-rating .star-icon { color: #ffc107; }
        .details-body { padding: 20px; background-color: var(--c-light-bg);}
        .details-section-title { font-size: 1.2em; font-weight: 700; color: var(--c-text-dark); margin: 20px 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid #dcdcdc; }
        .details-section-title:first-child { margin-top: 0; }
        .details-overview, .details-body p { line-height: 1.6; font-size: 0.9em; color: var(--c-text-dark);}
        .cast-list { display: flex; overflow-x: auto; gap: 15px; padding-bottom: 10px; }
        .cast-list::-webkit-scrollbar { height: 5px; }
        .cast-list::-webkit-scrollbar-track { background: #e0e0e0; }
        .cast-list::-webkit-scrollbar-thumb { background-color: var(--c-tertiary); border-radius: 10px; }
        .cast-member { text-align: center; width: 80px; flex-shrink: 0; }
        .cast-photo { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; background-color: #eee; margin: 0 auto 5px; border: 2px solid #ddd; }
        .cast-name { font-size: 0.8em; font-weight: 500; color: var(--c-text-dark);}
        .cast-character { font-size: 0.75em; color: #666; }
        .social-links { display: flex; gap: 15px; align-items: center; }
        .social-link svg { width: 24px; height: 24px; fill: var(--c-text-dark); transition: fill 0.2s, transform 0.2s; }
        .social-link:hover svg { fill: var(--c-primary); transform: scale(1.1); }
        .result-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;}
        .result-actions button, .result-actions a { font-size: 0.75em; font-weight: 500; color: var(--c-text); background-color: var(--c-border); border: 1px solid var(--c-surface); padding: 4px 10px; border-radius: 15px; cursor: pointer; transition: all 0.2s ease; display: inline-block; text-align: center; }
        .result-actions button:hover, .result-actions a:hover { background-color: var(--c-primary); border-color: var(--c-primary); color: var(--c-text-dark); }

        #torrents-container { margin-top: 20px; }
        .torrent-list { display: flex; flex-direction: column; gap: 10px; }
        .torrent-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #f0f0f0; border-radius: 6px; border-left: 4px solid var(--c-primary); }
        .torrent-item.hidden { display: none; }
        .torrent-quality { font-weight: 700; font-size: 0.9em; color: var(--c-text-dark); max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; }
        .torrent-info { font-size: 0.8em; color: #555; }
        .torrent-action-btn { font-size: 0.8em; font-weight: 700; color: white; background-color: var(--c-primary); padding: 6px 12px; border-radius: 15px; text-decoration: none; transition: background-color 0.2s; white-space: nowrap; }
        .torrent-action-btn:hover { background-color: #8c754e; }
        .torrent-action-btn:disabled { background-color: var(--c-success); cursor: default; }
        .ver-mais-btn {
            font-size: 0.85em; font-weight: 700; color: var(--c-text-dark);
            background-color: #e0e0e0; padding: 8px 15px; border-radius: 20px;
            text-decoration: none; transition: background-color 0.2s;
            margin-top: 10px; text-align: center; width: 100%;
        }
        .ver-mais-btn:hover { background-color: #cccccc; }
        .brazil-flag { margin-left: 8px; font-size: 1.2em; }

        #pagination-controls { display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 15px; }
        .page-btn { font-size: 0.85em; background-color: var(--c-surface); padding: 8px 15px; border-radius: 20px; }
        .page-info { font-size: 0.9em; font-weight: 500; }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    shadowRoot.appendChild(styleSheet);


    // --- ESTRUTURA HTML ---
    const appContainer = document.createElement('div');
    appContainer.innerHTML = `
        <div id="smart-search-container">
            <div id="smart-search-header">
                 <button id="back-btn" class="header-btn" title="Voltar">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path></svg>
                 </button>
                 <button id="home-btn" class="header-btn" title="Início">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></path></svg>
                 </button>
                <div id="search-input-wrapper">
                    <input id="smart-search-input" type="text" placeholder="Buscar Filmes e Séries...">
                    <input id="year-filter-input" type="number" placeholder="Ano" min="1900" max="2099">
                </div>
                <button id="favorites-btn" class="header-btn" title="Favoritos">
                     <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path></svg>
                </button>
            </div>
            <div id="panel-container">
                <div id="smart-search-results" class="panel active"></div>
                <div id="favorites-panel" class="panel"></div>
                <div id="details-panel" class="panel"></div>
            </div>
        </div>
        <div id="trailer-modal-overlay">
            <div id="trailer-modal-content">
                <button id="trailer-modal-close">&times;</button>
                <iframe id="trailer-iframe" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
        </div>
    `;
    shadowRoot.appendChild(appContainer);

    // --- VARIÁVEIS GLOBAIS E ELEMENTOS DO DOM (referenciando o Shadow DOM) ---
    const searchBar = shadowRoot.getElementById('smart-search-container');
    const searchInput = shadowRoot.getElementById('smart-search-input');
    const yearFilterInput = shadowRoot.getElementById('year-filter-input');
    const resultsDiv = shadowRoot.getElementById('smart-search-results');
    const favoritesPanel = shadowRoot.getElementById('favorites-panel');
    const detailsPanel = shadowRoot.getElementById('details-panel');
    const favoritesBtn = shadowRoot.getElementById('favorites-btn');
    const homeBtn = shadowRoot.getElementById('home-btn');
    const backBtn = shadowRoot.getElementById('back-btn');
    const trailerModal = shadowRoot.getElementById('trailer-modal-overlay');
    const closeModalBtn = shadowRoot.getElementById('trailer-modal-close');

    let isBarVisible = false;
    let favorites = [];
    let viewHistory = ['home'];
    let homeViewCache = { releases: [], top: [], topSeries: [] };
    let currentHomePage = { view: 'releases', page: 1 };
    const ITEMS_PER_PAGE = 4;
    const socialSVGs = { facebook: `<svg viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12s4.5 9.96 10 9.96c5.5 0 10-4.46 10-9.96S17.5 2.04 12 2.04zm3.5 6.74h-2.1c-.5 0-.6.4-.6 1v1.36h2.7l-.4 2.1H12.8V19h-2.8v-5.76H8v-2.1h2V9.8c0-1.7 1.1-2.8 2.7-2.8h2v2.1z"/></svg>`, twitter: `<svg viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.34 0 11.35-6.08 11.35-11.35 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.99-2.08z"/></svg>`, instagram: `<svg viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8A3.6 3.6 0 0 0 20 16.4V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>` };
    let originalBodyOverflow;

    // --- ATIVAÇÃO E CONTROLES GERAIS ---
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === '1') {
            e.preventDefault();
            isBarVisible = !isBarVisible;
            searchBar.style.display = isBarVisible ? 'flex' : 'none';
            if (isBarVisible) {
                searchInput.focus();
                if(!resultsDiv.innerHTML.trim()) {
                     renderHomePage();
                }
            }
        }
    });

    searchBar.addEventListener('mouseover', () => {
        originalBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    });
    searchBar.addEventListener('mouseout', () => {
        document.body.style.overflow = originalBodyOverflow;
    });

    closeModalBtn.addEventListener('click', hideTrailer);
    trailerModal.addEventListener('click', e => { if (e.target === trailerModal) hideTrailer(); });

    homeBtn.addEventListener('click', () => {
        renderHomePage();
        showPanel('smart-search-results');
    });

    backBtn.addEventListener('click', () => {
        if(viewHistory.length <= 1) return;
        viewHistory.pop();
        const previousView = viewHistory[viewHistory.length - 1] || 'home';
        const panelId = previousView.includes('details') ? 'details-panel'
                      : (previousView === 'favorites' ? 'favorites-panel'
                      : 'smart-search-results');
        showPanel(panelId, false);
    });

    [resultsDiv, favoritesPanel].forEach(panel => {
        panel.addEventListener('click', e => {
            const favButton = e.target.closest('.fav-btn-item');
            if (favButton) {
                e.stopPropagation();
                const itemData = JSON.parse(decodeURIComponent(favButton.dataset.item));
                toggleFavorite(itemData);
                return;
            }

            const movieItem = e.target.closest('.search-result-item.movie-item');
            if (movieItem) {
                const { id, type } = movieItem.dataset;
                renderDetailsView(id, type);
            }
        });
    });

    detailsPanel.addEventListener('click', e => {
        const trailerBtn = e.target.closest('.trailer-btn');
        if (trailerBtn) {
            e.stopPropagation();
            showTrailer(trailerBtn.dataset.key);
            return;
        }

        const copyBtn = e.target.closest('.torrent-copy-btn');
        if (copyBtn && !copyBtn.disabled) {
            const magnetLink = copyBtn.dataset.magnetLink;
            const textArea = document.createElement('textarea');
            textArea.value = magnetLink;

            textArea.style.position = 'fixed';
            textArea.style.top = '-9999px';
            textArea.style.left = '-9999px';

            shadowRoot.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                copyBtn.textContent = 'Copiado!';
                copyBtn.disabled = true;
                setTimeout(() => {
                    copyBtn.textContent = 'Copiar';
                    copyBtn.disabled = false;
                }, 2000);
            } catch (err) {
                console.error('Falha ao copiar o link magnético: ', err);
                copyBtn.textContent = 'Erro!';
                 setTimeout(() => {
                    copyBtn.textContent = 'Copiar';
                    copyBtn.disabled = false;
                }, 2000);
            }
            shadowRoot.removeChild(textArea);
        }
    });


    favoritesBtn.addEventListener('click', () => {
        showPanel('favorites-panel');
        renderFavoritesPanel();
    });

    function handleSearch() {
        const query = searchInput.value.trim();
        const year = yearFilterInput.value.trim();
        if (query) {
            performSearch(query, year);
        } else {
            renderHomePage();
        }
    }

    searchInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') handleSearch();
    });
    yearFilterInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') handleSearch();
    });

    function showPanel(panelId, pushToHistory = true) {
        shadowRoot.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        shadowRoot.getElementById(panelId).classList.add('active');

        let currentView = 'home';
        if (panelId === 'details-panel') currentView = `details-${detailsPanel.dataset.id}`;
        else if (panelId === 'favorites-panel') currentView = 'favorites';
        else if (searchInput.value.trim()) currentView = `search-${searchInput.value.trim()}`;

        if (pushToHistory && viewHistory[viewHistory.length - 1] !== currentView) {
            viewHistory.push(currentView);
        }
        backBtn.style.display = viewHistory.length > 1 ? 'flex' : 'none';
    }


     // --- LÓGICA DE RENDERIZAÇÃO DE CONTEÚDO ---
    async function renderHomePage() {
        resultsDiv.innerHTML = `<div class="search-spinner"></div>`;
        const recentSearches = await GM_getValue('recentSearches', []);

        let recentSearchesHTML = '';
        if (recentSearches.length > 0) {
            recentSearchesHTML = `
                <div class="section-title">
                    <span>Buscas Recentes</span>
                    <button id="clear-recents-btn" title="Limpar buscas recentes">Apagar</button>
                </div>
                <div id="recent-searches-list">
                    ${recentSearches.map(term => `<button class="recent-search-tag" data-term="${term}">${term}</button>`).join('')}
                </div>`;
        }

        resultsDiv.innerHTML = `
            ${recentSearchesHTML}
            <div id="home-nav">
                <button class="home-nav-btn ${currentHomePage.view === 'releases' ? 'active' : ''}" data-view="releases">Lançamentos</button>
                <button class="home-nav-btn ${currentHomePage.view === 'top' ? 'active' : ''}" data-view="top">Top 10 Filmes</button>
                <button class="home-nav-btn ${currentHomePage.view === 'topSeries' ? 'active' : ''}" data-view="topSeries">Top 10 Séries</button>
            </div>
            <div id="movie-list-container"></div>
            <div id="pagination-controls"></div>
        `;

        await renderHomeSubPage();

        resultsDiv.querySelectorAll('.home-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentHomePage.view = btn.dataset.view;
                currentHomePage.page = 1;
                renderHomeSubPage();
            });
        });

        resultsDiv.querySelectorAll('.recent-search-tag').forEach(tag => {
            tag.onclick = () => {
                searchInput.value = tag.dataset.term;
                yearFilterInput.value = '';
                performSearch(tag.dataset.term);
            };
        });

        const clearBtn = resultsDiv.querySelector('#clear-recents-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', async () => {
                await GM_setValue('recentSearches', []);
                renderHomePage();
            });
        }
    }

    async function renderHomeSubPage() {
        const listContainer = shadowRoot.getElementById('movie-list-container');
        const paginationContainer = shadowRoot.getElementById('pagination-controls');
        listContainer.innerHTML = `<div class="search-spinner"></div>`;
        paginationContainer.innerHTML = '';

        shadowRoot.querySelectorAll('#home-nav .home-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === currentHomePage.view);
        });

        if (currentHomePage.view === 'releases') {
            if (homeViewCache.releases.length === 0) {
                const data = await tmdbRequest('/movie/upcoming', '', 'pt-BR');
                homeViewCache.releases = data.results || [];
            }
            const itemsToDisplay = paginate(homeViewCache.releases, ITEMS_PER_PAGE);
            listContainer.innerHTML = '';
            itemsToDisplay.forEach(item => renderItem(item, listContainer));
            renderPaginationControls(homeViewCache.releases.length, resultsDiv, renderHomeSubPage, ITEMS_PER_PAGE);
        } else if (currentHomePage.view === 'top') {
            if (homeViewCache.top.length === 0) {
                const data = await tmdbRequest('/movie/top_rated', '', 'pt-BR');
                homeViewCache.top = data.results || [];
            }
            const itemsToDisplay = paginate(homeViewCache.top, 10);
            listContainer.innerHTML = '';
            itemsToDisplay.forEach(item => renderItem(item, listContainer));
            renderPaginationControls(homeViewCache.top.length, resultsDiv, renderHomeSubPage, 10);
        } else if (currentHomePage.view === 'topSeries') {
            if (homeViewCache.topSeries.length === 0) {
                const data = await tmdbRequest('/tv/top_rated', '', 'pt-BR');
                homeViewCache.topSeries = data.results || [];
            }
            const itemsToDisplay = paginate(homeViewCache.topSeries, 10);
            listContainer.innerHTML = '';
            itemsToDisplay.forEach(item => renderItem(item, listContainer));
            renderPaginationControls(homeViewCache.topSeries.length, resultsDiv, renderHomeSubPage, 10);
        }
    }

    function paginate(list, itemsPerPage) {
        const startIndex = (currentHomePage.page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return list.slice(startIndex, endIndex);
    }

    function renderPaginationControls(totalItems, container, pageChangeCallback, itemsPerPage) {
        const paginationContainer = container.querySelector('#pagination-controls');
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Anterior';
        prevBtn.className = 'page-btn';
        prevBtn.disabled = currentHomePage.page === 1;
        prevBtn.addEventListener('click', () => {
            if (currentHomePage.page > 1) {
                currentHomePage.page--;
                pageChangeCallback();
            }
        });

        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Página ${currentHomePage.page} de ${totalPages}`;

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Próximo';
        nextBtn.className = 'page-btn';
        nextBtn.disabled = currentHomePage.page === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentHomePage.page < totalPages) {
                currentHomePage.page++;
                pageChangeCallback();
            }
        });

        paginationContainer.appendChild(prevBtn);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(nextBtn);
    }


    // --- LÓGICA DE BUSCA ---
    async function performSearch(query, year = null, save = true) {
        if (save) await saveSearchTerm(query);
        resultsDiv.innerHTML = `<div class="search-spinner"></div>`;
        const movieResults = await performMovieSearch(query, year);
        showPanel('smart-search-results');
        renderUnifiedResults({ movieResults });
    }

    async function performMovieSearch(query, year) {
        const yearParam = year ? `&year=${year}` : '';
        const initialResults = await tmdbRequest(`/search/multi`, `&query=${encodeURIComponent(query)}${yearParam}`);
        if (!initialResults || !initialResults.results) return [];
        const validResults = initialResults.results.filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path).slice(0, 10);
        if (validResults.length === 0) return [];

        const detailPromises = validResults.map(async (item) => {
            try {
                const details = await tmdbRequest(`/${item.media_type}/${item.id}`, `&append_to_response=videos`, 'pt-BR');
                if (details) {
                    details.media_type = item.media_type;
                    return details;
                }
            } catch (error) { console.error(`Erro ao buscar detalhes para ${item.id}:`, error); }
            return null;
        });
        return (await Promise.all(detailPromises)).filter(Boolean);
    }

    function renderUnifiedResults(results) {
        resultsDiv.innerHTML = '';
        let foundResults = false;

        if (results.movieResults && results.movieResults.length > 0) {
            foundResults = true;
            resultsDiv.innerHTML += `<h3 class="section-title"><span>Resultados</span></h3>`;
            results.movieResults.forEach(item => renderItem(item, resultsDiv));
        }

        if (!foundResults) {
            resultsDiv.innerHTML = `<div class="search-message">Nenhum resultado encontrado.</div>`;
        }
    }

    function renderItem(item, container) {
       if (!item.media_type && (item.title || item.name)) {
           item.media_type = item.title ? 'movie' : 'tv';
       }

       if (item.media_type === 'movie' || item.media_type === 'tv') {
            renderMovieItem(item, container);
       }
    }

    function renderMovieItem(item, container) {
        const title = item.title || item.name;
        const releaseDate = item.release_date || item.first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/D';
        const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://placehold.co/80x120/5a6e4e/f0f0f0?text=Capa';
        const overview = item.overview || "Sinopse não disponível.";
        const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/D";
        const isFav = isFavorited(item);
        const itemData = encodeURIComponent(JSON.stringify({id: item.id, title, name: item.name, poster_path: item.poster_path, media_type: item.media_type, overview, vote_average: item.vote_average, release_date: item.release_date, first_air_date: item.first_air_date, type: item.media_type}));

        const itemDiv = document.createElement('div');
        itemDiv.className = `search-result-item movie-item ${isFav ? 'favorited-item' : ''}`;
        itemDiv.dataset.id = item.id;
        itemDiv.dataset.type = item.media_type;
        itemDiv.innerHTML = `
            <img src="${posterPath}" alt="Capa de ${title}" class="result-poster">
            <div class="result-info">
                <div>
                    <h3 class="result-title">${title}</h3>
                    <div class="result-meta"><span>${year}</span><span class="star-icon" style="margin-left: 10px;">⭐</span><span>${rating}</span></div>
                    <p class="result-overview">${overview}</p>
                </div>
            </div>
            <button class="fav-btn-item ${isFav ? 'favorited' : ''}" title="Adicionar/Remover dos Favoritos" data-item="${itemData}">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path></svg>
            </button>
        `;
        container.appendChild(itemDiv);
    }


    // --- LÓGICA DE DETALHES, FAVORITOS E UTILITÁRIOS ---
    async function renderDetailsView(itemId, mediaType) {
        detailsPanel.dataset.id = `${mediaType}-${itemId}`;
        showPanel('details-panel');
        detailsPanel.innerHTML = `<div class="search-spinner"></div>`;

        try {
            const data = await tmdbRequest(`/${mediaType}/${itemId}`, `&append_to_response=credits,external_ids,videos`, 'pt-BR');
            if (!data) throw new Error("Não foi possível obter os dados da API");

            const backdropUrl = data.backdrop_path ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}` : '';
            const posterUrl = data.poster_path ? `https://image.tmdb.org/t/p/w200${data.poster_path}` : 'https://placehold.co/100x150/5a6e4e/f0f0f0?text=Capa';
            const title = data.title || data.name;
            const originalTitle = data.original_title || data.original_name;
            const rating = data.vote_average ? data.vote_average.toFixed(1) : "N/D";
            const imdbId = data.external_ids?.imdb_id;

            let creatorsHTML = 'Não informado';
            if (mediaType === 'tv' && data.created_by?.length > 0) {
                creatorsHTML = data.created_by.map(c => c.name).join(', ');
            } else if (mediaType === 'movie' && data.credits?.crew) {
                const director = data.credits.crew.find(c => c.job === 'Director');
                if (director) creatorsHTML = director.name;
            }

            const cast = data.credits?.cast?.slice(0, 10) || [];
            const castHTML = cast.map(member => `
                <div class="cast-member">
                    <img src="${member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : 'https://placehold.co/70x70/ccc/fff?text=?'}" class="cast-photo" alt="${member.name}">
                    <div class="cast-name">${member.name}</div>
                    <div class="cast-character">${member.character}</div>
                </div>
            `).join('');

            const social = data.external_ids || {};
            let socialHTML = ['instagram', 'twitter', 'facebook']
              .map(platform => ({ platform, id: social[`${platform}_id`] }))
              .filter(p => p.id)
              .map(p => `<a href="https://www.${p.platform}.com/${p.id}" target="_blank" class="social-link" title="${p.platform}" rel="noopener noreferrer">${socialSVGs[p.platform]}</a>`)
              .join('');

            if (!socialHTML) socialHTML = 'Nenhuma rede social oficial encontrada.';

            const trailer = findBestTrailer(data.videos);
            const trailerHTML = trailer ? `<button class="trailer-btn" data-key="${trailer.key}">Assistir Trailer</button>` : '';

            detailsPanel.innerHTML = `
                <div class="details-header" style="background-image: url('${backdropUrl}')">
                    <div class="details-header-content">
                        <img src="${posterUrl}" class="details-poster" alt="Pôster de ${title}">
                        <div class="details-title-section">
                            <h2 class="details-title">${title}</h2>
                            <p class="details-original-title">Título Original: ${originalTitle}</p>
                            <div class="details-rating"><span class="star-icon">⭐</span> ${rating} / 10</div>
                            <div class="result-actions" style="margin-top: 10px;">${trailerHTML}</div>
                        </div>
                    </div>
                </div>
                <div class="details-body">
                    <h3 class="details-section-title">Sinopse Completa</h3>
                    <p class="details-overview">${data.overview || "Sinopse não disponível."}</p>
                    <div id="torrents-container"></div>
                    <h3 class="details-section-title">Criação</h3>
                    <p>${creatorsHTML}</p>
                    <h3 class="details-section-title">Elenco Principal</h3>
                    <div class="cast-list">${castHTML || 'Elenco não informado.'}</div>
                    <h3 class="details-section-title">Redes Sociais Oficiais</h3>
                    <div class="social-links">${socialHTML}</div>
                </div>
            `;

            const torrentsContainer = shadowRoot.querySelector('#torrents-container');
            torrentsContainer.innerHTML = `<h3 class="details-section-title">Downloads (Torrents)</h3><div id="aggregated-torrents"></div><div id="yts-torrents" style="margin-top:15px;"></div>`;

            // Prioriza buscas brasileiras
            if (mediaType === 'movie') {
                fetchAndRenderAggregatedTorrents(originalTitle, 'movie');
                fetchAndRenderYTSTorrents(imdbId, title);
            } else if (mediaType === 'tv') {
                 fetchAndRenderAggregatedTorrents(originalTitle, 'tv');
            }

        } catch (error) {
            console.error("Erro ao carregar detalhes:", error);
            detailsPanel.innerHTML = `<p class="search-message">Não foi possível carregar os detalhes.</p>`;
        }
    }

    async function fetchAndRenderYTSTorrents(imdbId, title) {
        const ytsContainer = shadowRoot.querySelector('#yts-torrents');
        if (!imdbId) {
            ytsContainer.innerHTML = '';
            return;
        }

        ytsContainer.innerHTML = `<p style="color: var(--c-text-dark); font-size: 0.9em; font-weight: 500;">Buscando em YTS (Áudio Original)...</p><div class="search-spinner" style="margin: 10px 0;"></div>`;

        try {
            const ytsData = await apiRequest(`https://yts.mx/api/v2/list_movies.json?query_term=${imdbId}`);
            if (ytsData && ytsData.data.movie_count > 0 && ytsData.data.movies[0].torrents) {
                const torrents = ytsData.data.movies[0].torrents;
                const encodedTitle = encodeURIComponent(title);
                const trackers = '&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969';

                const torrentList = document.createElement('div');
                torrentList.className = 'torrent-list';

                torrents.forEach(t => {
                    const magnetLink = `magnet:?xt=urn:btih:${t.hash}&dn=${encodedTitle}${trackers}`;
                    const torrentItem = document.createElement('div');
                    torrentItem.className = 'torrent-item';
                    torrentItem.innerHTML = `
                        <div title="YTS - ${t.quality} (${t.type})">
                            <div class="torrent-quality">YTS - ${t.quality} (${t.type})</div>
                            <div class="torrent-info">Tamanho: ${t.size} / Seeds: ${t.seeds} / Peers: ${t.peers}</div>
                        </div>
                        <button class="torrent-action-btn torrent-copy-btn" data-magnet-link="${magnetLink}">Copiar</button>
                    `;
                    torrentList.appendChild(torrentItem);
                });

                ytsContainer.innerHTML = '';
                ytsContainer.appendChild(torrentList);

            } else {
                 ytsContainer.innerHTML = `<p style="color: var(--c-text-dark); font-size: 0.9em;">Nenhum torrent encontrado em YTS para este filme.</p>`;
            }
        } catch (error) {
            console.error("Erro ao buscar torrents YTS:", error);
            ytsContainer.innerHTML = `<p style="color: var(--c-text-dark); font-size: 0.9em;">Não foi possível buscar torrents em YTS.</p>`;
        }
    }

    function isBrazilianTorrent(name) {
        const lowerName = name.toLowerCase();
        const keywords = ['dublado', 'dual audio', 'nacional', 'pt-br', 'portugues', 'legendado'];
        return keywords.some(keyword => lowerName.includes(keyword));
    }

    async function fetchAndRenderAggregatedTorrents(originalTitle, type) {
        const container = shadowRoot.querySelector('#aggregated-torrents');
        const queries = [ type === 'movie' ? `${originalTitle} dual audio` : `${originalTitle} dublado`, originalTitle ];

        container.innerHTML = `<p style="color: var(--c-text-dark); font-size: 0.9em; font-weight: 500;">Buscando em fontes BR e Internacionais...</p><div class="search-spinner" style="margin: 10px 0;"></div>`;

        try {
            const searchPromises = queries.map(query => apiRequest(`https://apibay.org/q.php?q=${encodeURIComponent(query)}&cat=200`));
            const resultsArrays = await Promise.all(searchPromises);
            const combinedResults = [].concat(...resultsArrays);
            const uniqueResults = [];
            const seenHashes = new Set();

            for (const result of combinedResults) {
                if (result.name && result.name !== 'No results returned' && !seenHashes.has(result.info_hash)) {
                    uniqueResults.push(result);
                    seenHashes.add(result.info_hash);
                }
            }
            uniqueResults.sort((a, b) => parseInt(b.seeders, 10) - parseInt(a.seeders, 10));

            if (uniqueResults.length > 0) {
                const trackers = '&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969';

                const torrentList = document.createElement('div');
                torrentList.className = 'torrent-list';

                uniqueResults.forEach((t, index) => {
                    const isBR = isBrazilianTorrent(t.name);
                    const flag = isBR ? `<span class="brazil-flag">🇧🇷</span>` : '';
                    const magnetLink = `magnet:?xt=urn:btih:${t.info_hash}&dn=${encodeURIComponent(t.name)}${trackers}`;
                    const torrentItem = document.createElement('div');
                    torrentItem.className = 'torrent-item';
                     if (index >= 5) {
                        torrentItem.classList.add('hidden');
                    }
                    torrentItem.innerHTML = `
                        <div title="${t.name}">
                            <div class="torrent-quality">${t.name}${flag}</div>
                            <div class="torrent-info">Tamanho: ${(t.size / 1073741824).toFixed(2)} GB / Seeds: ${t.seeders} / Peers: ${t.leechers}</div>
                        </div>
                        <button class="torrent-action-btn torrent-copy-btn" data-magnet-link="${magnetLink}">Copiar</button>
                    `;
                    torrentList.appendChild(torrentItem);
                });

                container.innerHTML = '';
                container.appendChild(torrentList);

                if (uniqueResults.length > 5) {
                    const verMaisBtn = document.createElement('button');
                    verMaisBtn.className = 'ver-mais-btn';
                    verMaisBtn.textContent = `Ver mais ${uniqueResults.length - 5} resultados`;
                    verMaisBtn.onclick = function() {
                        torrentList.querySelectorAll('.torrent-item.hidden').forEach(item => item.classList.remove('hidden'));
                        verMaisBtn.remove();
                    };
                    container.appendChild(verMaisBtn);
                }
            } else {
                container.innerHTML = `<p style="color: var(--c-text-dark); font-size: 0.9em;">Nenhum torrent encontrado em fontes adicionais.</p>`;
            }
        } catch (error) {
            console.error("Erro ao buscar torrents agregados:", error);
            container.innerHTML = `<p style="color: var(--c-text-dark); font-size: 0.9em;">Não foi possível buscar em fontes adicionais.</p>`;
        }
    }

    async function saveSearchTerm(term) {
        let searches = await GM_getValue(`recentSearches`, []);
        searches = searches.filter(s => s.toLowerCase() !== term.toLowerCase());
        searches.unshift(term);
        if (searches.length > 8) searches.length = 8;
        await GM_setValue(`recentSearches`, searches);
    }

    function findBestTrailer(videos) {
        if (!videos?.results?.length) return null;
        const allTrailers = videos.results.filter(v => v.type === "Trailer" && v.site === "YouTube");
        return allTrailers.find(v => v.iso_639_1 === 'pt') || allTrailers.find(v => v.iso_639_1 === 'en') || allTrailers[0];
    }

    async function loadFavorites() { favorites = await GM_getValue('favoritesList', []); }
    async function saveFavorites() { await GM_setValue('favoritesList', favorites); }

    async function toggleFavorite(itemData) {
        const uniqueId = `${itemData.type}-${itemData.id}`;
        const favIndex = favorites.findIndex(fav => `${fav.type}-${fav.id}` === uniqueId);

        if (favIndex > -1) {
            favorites.splice(favIndex, 1);
        } else {
            favorites.unshift(itemData);
        }
        await saveFavorites();

        const currentPanel = shadowRoot.querySelector('.panel.active');
        const currentQuery = searchInput.value.trim();

        if (currentPanel.id === 'smart-search-results') {
            if (currentQuery) {
                performSearch(currentQuery, false);
            } else {
                renderHomeSubPage();
            }
        } else if (currentPanel.id === 'favorites-panel') {
            renderFavoritesPanel();
        }
    }

    function isFavorited(item) {
        const uniqueId = `${item.media_type}-${item.id}`;
        return favorites.some(fav => `${fav.type}-${fav.id}` === uniqueId);
    }

    function renderFavoritesPanel() {
        favoritesPanel.innerHTML = '';
        if (favorites.length === 0) {
            favoritesPanel.innerHTML = `<div class="search-message">Sua lista de favoritos está vazia.</div>`;
            return;
        }
        favoritesPanel.innerHTML = `<h3 class="section-title"><span>Meus Favoritos</span></h3>`;
        favorites.forEach(item => renderItem(item, favoritesPanel));
    }

    function showTrailer(youtubeKey) {
        const trailerIframe = shadowRoot.getElementById('trailer-iframe');
        trailerIframe.src = `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&rel=0`;
        trailerModal.style.display = 'flex';
    }

    function hideTrailer() {
        const trailerIframe = shadowRoot.getElementById('trailer-iframe');
        trailerModal.style.display = 'none';
        trailerIframe.src = '';
    }

    function apiRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: resp => {
                    try { resolve(JSON.parse(resp.responseText)); }
                    catch(e) { console.error("Falha na requisição à API para", url, e); reject(e); }
                },
                onerror: reject
            });
        });
    }

    function tmdbRequest(endpoint, params = '', lang = null) {
        const langParam = lang ? `&language=${lang}` : '';
        return apiRequest(`https://api.themoviedb.org/3${endpoint}?api_key=${tmdbApiKey}${langParam}${params}`);
    }

    // --- INICIALIZAÇÃO ---
    loadFavorites();
})();



