// ==UserScript==
// @name         GeoGuessr GeoJSON Overlay
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  Overlay GeoJSON/TopoJSON regions on GeoGuessr classic games map with filters (EN/PT)
// @author       You
// @license      MIT
// @match        *://www.geoguessr.com/*
// @icon         https://www.geoguessr.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560346/GeoGuessr%20GeoJSON%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/560346/GeoGuessr%20GeoJSON%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const i18n = {
        en: {
            title: 'GeoJSON Overlay',
            overlayActive: 'Overlay Active',
            overlayDisabled: 'Overlay Disabled',
            regions: 'regions',
            region: 'region',
            loadGeoJSON: 'Load GeoJSON / TopoJSON',
            uploadFile: 'Upload file',
            pastePlaceholder: 'Or paste GeoJSON/TopoJSON here...',
            clear: 'Clear',
            apply: 'Apply',
            filters: 'Filters',
            filterHint: 'Load a GeoJSON to see available filters',
            filterUsage: 'Use * for wildcards (7* = starts with 7), comma for multiple values.',
            style: 'Style',
            fillColor: 'Fill Color',
            strokeColor: 'Stroke Color',
            opacity: 'Opacity',
            stroke: 'Stroke',
            loadedRegions: 'Loaded Regions',
            noGeoJSON: 'No GeoJSON loaded',
            more: 'more',
            shortcutInfo: 'Toggle panel',
            shortcutToggle: 'Toggle overlay',
            classicOnly: 'Only works in Classic games',
            loading: 'Loading...',
            rendering: 'Rendering',
            fileLoaded: 'File loaded!',
            regionsLoaded: 'regions loaded!',
            cleared: 'Cleared',
            error: 'Error',
            enterGeoJSON: 'Please enter GeoJSON',
            failedTopoJSON: 'Failed to convert TopoJSON',
            invalidGeoJSON: 'Invalid FeatureCollection',
            language: 'Language',
            filterPlaceholder: 'e.g., 7* or val1, val2',
            langChanged: 'Language changed to English'
        },
        pt: {
            title: 'Overlay GeoJSON',
            overlayActive: 'Overlay Ativo',
            overlayDisabled: 'Overlay Desativado',
            regions: 'regiões',
            region: 'região',
            loadGeoJSON: 'Carregar GeoJSON / TopoJSON',
            uploadFile: 'Enviar arquivo',
            pastePlaceholder: 'Ou cole o GeoJSON/TopoJSON aqui...',
            clear: 'Limpar',
            apply: 'Aplicar',
            filters: 'Filtros',
            filterHint: 'Carregue um GeoJSON para ver os filtros disponíveis',
            filterUsage: 'Use * para curingas (7* = começa com 7), vírgula para múltiplos valores.',
            style: 'Estilo',
            fillColor: 'Cor de Preenchimento',
            strokeColor: 'Cor da Borda',
            opacity: 'Opacidade',
            stroke: 'Borda',
            loadedRegions: 'Regiões Carregadas',
            noGeoJSON: 'Nenhum GeoJSON carregado',
            more: 'mais',
            shortcutInfo: 'Abrir/fechar painel',
            shortcutToggle: 'Ativar/desativar overlay',
            classicOnly: 'Funciona apenas em partidas Clássicas',
            loading: 'Carregando...',
            rendering: 'Renderizando',
            fileLoaded: 'Arquivo carregado!',
            regionsLoaded: 'regiões carregadas!',
            cleared: 'Limpo',
            error: 'Erro',
            enterGeoJSON: 'Por favor, insira um GeoJSON',
            failedTopoJSON: 'Falha ao converter TopoJSON',
            invalidGeoJSON: 'FeatureCollection inválido',
            language: 'Idioma',
            filterPlaceholder: 'ex: 7* ou val1, val2',
            langChanged: 'Idioma alterado para Português'
        }
    };

    let state = {
        enabled: false,
        geoJSON: null,
        filteredGeoJSON: null,
        polygons: [],
        labels: [],
        map: null,
        google: null,
        panelOpen: false,
        labelClassCreated: false,
        activeFilters: {},
        filterableProperties: [],
        renderTimeout: null,
        lang: localStorage.getItem('gj-lang') || 'en',
        style: {
            fillColor: '#3d5a4c',
            fillOpacity: 0.72,
            strokeColor: '#1a1a2e',
            strokeWeight: 1.2
        }
    };

    function t(key) { return i18n[state.lang][key] || i18n.en[key] || key; }

    const PERF = { BATCH_SIZE: 50, BATCH_DELAY: 16, SIMPLIFY_THRESHOLD: 300, COORD_SIMPLIFY: 0.0001 };

    function isClassicGame() {
        const url = window.location.href;
        const isGame = url.includes('/game/') || url.includes('/challenge/');
        const isExcluded = url.includes('/duels') || url.includes('/battle-royale') || url.includes('/team-duels') || url.includes('/bullseye') || url.includes('/live-challenge') || url.includes('/party') || url.includes('/explorer') || url.includes('/streaks') || url.includes('/results') || url.includes('/quiz') || url.includes('/infinity');
        return isGame && !isExcluded;
    }

    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');
        .gj-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:100000;display:none;align-items:center;justify-content:center;font-family:'Nunito',sans-serif;opacity:0;transition:opacity 0.25s ease}
        .gj-overlay.open{display:flex}.gj-overlay.visible{opacity:1}
        .gj-panel{width:520px;max-width:95vw;max-height:85vh;background:#1a1c2e;border-radius:20px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 48px -12px rgba(0,0,0,0.5);transform:scale(0.95) translateY(10px);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        .gj-overlay.visible .gj-panel{transform:scale(1) translateY(0)}
        .gj-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .gj-title{display:flex;align-items:center;gap:12px;font-size:17px;font-weight:700;color:#fff}
        .gj-title-icon{width:34px;height:34px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);border-radius:10px;display:flex;align-items:center;justify-content:center}
        .gj-title-icon svg{width:18px;height:18px;color:white}
        .gj-header-actions{display:flex;align-items:center;gap:8px}
        .gj-lang-btn{padding:6px 10px;background:rgba(255,255,255,0.05);border:none;border-radius:8px;color:#9ca3af;font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.2s;text-transform:uppercase}
        .gj-lang-btn:hover{background:rgba(99,102,241,0.2);color:#a5b4fc}
        .gj-close{width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.05);border:none;border-radius:10px;color:#6b7280;cursor:pointer;transition:all 0.2s}
        .gj-close:hover{background:rgba(239,68,68,0.15);color:#f87171}
        .gj-close svg{width:16px;height:16px}
        .gj-status-bar{display:flex;align-items:center;gap:14px;padding:14px 22px;background:rgba(0,0,0,0.15);border-bottom:1px solid rgba(255,255,255,0.04)}
        .gj-status-item{display:flex;align-items:center;gap:8px}
        .gj-status-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;transition:all 0.3s}
        .gj-status-dot.active{background:#22c55e;box-shadow:0 0 12px rgba(34,197,94,0.5)}
        .gj-status-text{font-size:13px;font-weight:600;color:#9ca3af}
        .gj-status-count{margin-left:auto;padding:5px 12px;background:rgba(99,102,241,0.15);border-radius:16px;font-size:12px;font-weight:700;color:#a5b4fc}
        .gj-content{flex:1;overflow-y:auto;padding:18px 22px}
        .gj-content::-webkit-scrollbar{width:5px}
        .gj-content::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:3px}
        .gj-section{margin-bottom:22px}
        .gj-section:last-child{margin-bottom:0}
        .gj-section-title{font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;display:flex;align-items:center;gap:6px}
        .gj-section-title svg{width:12px;height:12px}
        .gj-upload{margin-bottom:10px}
        .gj-upload input{display:none}
        .gj-upload-label{display:flex;align-items:center;justify-content:center;gap:10px;padding:16px;background:rgba(99,102,241,0.05);border:2px dashed rgba(99,102,241,0.25);border-radius:14px;color:#9ca3af;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s}
        .gj-upload-label:hover{border-color:#6366f1;background:rgba(99,102,241,0.1);color:#c7d2fe}
        .gj-upload-label svg{width:18px;height:18px}
        .gj-textarea{width:100%;height:100px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 14px;color:#e5e7eb;font-family:'Monaco','Consolas',monospace;font-size:11px;line-height:1.5;resize:none;box-sizing:border-box;transition:all 0.2s}
        .gj-textarea:focus{outline:none;border-color:rgba(99,102,241,0.4)}
        .gj-textarea::placeholder{color:#4b5563}
        .gj-buttons{display:flex;gap:10px;margin-top:10px}
        .gj-btn{flex:1;padding:11px 16px;border-radius:10px;border:none;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:7px}
        .gj-btn svg{width:15px;height:15px}
        .gj-btn.primary{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:white}
        .gj-btn.primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px -4px rgba(99,102,241,0.5)}
        .gj-btn.secondary{background:rgba(255,255,255,0.06);color:#9ca3af}
        .gj-btn.secondary:hover{background:rgba(255,255,255,0.1);color:#e5e7eb}
        .gj-style-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .gj-style-item{background:rgba(0,0,0,0.2);border-radius:10px;padding:12px}
        .gj-style-item label{display:block;font-size:11px;font-weight:600;color:#9ca3af;margin-bottom:10px}
        .gj-color-preview{width:100%;height:32px;border-radius:6px;cursor:pointer;position:relative;overflow:hidden}
        .gj-color-preview input[type="color"]{position:absolute;width:200%;height:200%;top:-50%;left:-50%;cursor:pointer;opacity:0}
        .gj-slider-wrapper{position:relative;width:100%;height:24px;display:flex;align-items:center}
        .gj-slider-track{position:absolute;left:0;right:0;height:6px;background:#12141f;border-radius:3px;top:50%;transform:translateY(-50%)}
        .gj-slider-fill{position:absolute;left:0;height:6px;background:linear-gradient(90deg,#4f52c9 0%,#6d70e8 100%);border-radius:3px;top:50%;transform:translateY(-50%);pointer-events:none}
        .gj-slider-thumb{position:absolute;width:20px;height:20px;background:radial-gradient(circle at 35% 35%,#3a3d52 0%,#1e2030 100%);border-radius:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,0.4);z-index:2}
        .gj-slider-thumb::after{content:'';position:absolute;width:6px;height:6px;background:#7aa2f7;border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 0 4px rgba(122,162,247,0.5)}
        .gj-slider-input{position:absolute;width:100%;height:100%;opacity:0;cursor:pointer;z-index:3;margin:0;padding:0}
        .gj-filters{background:rgba(0,0,0,0.15);border-radius:12px;padding:12px}
        .gj-filter-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
        .gj-filter-row:last-child{margin-bottom:0}
        .gj-filter-label{font-size:11px;font-weight:600;color:#9ca3af;min-width:80px}
        .gj-filter-input{flex:1;padding:8px 12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:#e5e7eb;font-family:'Nunito',sans-serif;font-size:12px}
        .gj-filter-input:focus{outline:none;border-color:rgba(99,102,241,0.4)}
        .gj-filter-input::placeholder{color:#4b5563}
        .gj-filter-hint{font-size:10px;color:#6b7280;margin-top:6px;line-height:1.4}
        .gj-filter-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
        .gj-filter-tag{display:flex;align-items:center;gap:5px;padding:4px 10px;background:rgba(99,102,241,0.2);border-radius:12px;font-size:11px;font-weight:600;color:#a5b4fc}
        .gj-filter-tag-remove{width:14px;height:14px;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,0.3);border:none;border-radius:50%;color:#fca5a5;cursor:pointer;font-size:10px;line-height:1}
        .gj-filter-tag-remove:hover{background:rgba(239,68,68,0.5)}
        .gj-regions{background:rgba(0,0,0,0.15);border-radius:12px;overflow:hidden;max-height:150px;overflow-y:auto}
        .gj-regions::-webkit-scrollbar{width:4px}
        .gj-regions::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.3);border-radius:2px}
        .gj-region{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.04)}
        .gj-region:last-child{border-bottom:none}
        .gj-region:hover{background:rgba(99,102,241,0.06)}
        .gj-region-num{width:24px;height:24px;background:rgba(99,102,241,0.15);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#a5b4fc;flex-shrink:0}
        .gj-region-name{flex:1;font-size:12px;font-weight:600;color:#e5e7eb;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .gj-region-type{font-size:10px;font-weight:600;color:#6b7280;padding:3px 8px;background:rgba(255,255,255,0.05);border-radius:5px;flex-shrink:0}
        .gj-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;color:#6b7280}
        .gj-empty svg{width:36px;height:36px;margin-bottom:10px;opacity:0.4}
        .gj-empty p{margin:0;font-size:12px;font-weight:600}
        .gj-map-label{background:rgba(15,18,28,0.92);border:1px solid rgba(80,85,105,0.5);border-radius:4px;padding:3px 8px;color:#fff;font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;white-space:nowrap;pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,0.35);user-select:none}
        .gj-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);padding:12px 20px;background:#1a1c2e;border:1px solid rgba(99,102,241,0.3);border-radius:12px;color:#e5e7eb;font-family:'Nunito',sans-serif;font-size:13px;font-weight:600;z-index:100001;box-shadow:0 8px 24px rgba(0,0,0,0.3);display:flex;align-items:center;gap:10px;opacity:0;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        .gj-toast.show{transform:translateX(-50%) translateY(0);opacity:1}
        .gj-toast.success{border-color:rgba(34,197,94,0.4)}
        .gj-toast.success svg{color:#22c55e}
        .gj-toast.error{border-color:rgba(239,68,68,0.4)}
        .gj-toast.error svg{color:#ef4444}
        .gj-toast svg{width:18px;height:18px;flex-shrink:0}
        .gj-map-toggle{position:absolute;right:10px;bottom:10px;z-index:1000;display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:rgba(30,35,50,0.92);border:none;border-radius:50%;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 6px rgba(0,0,0,0.3)}
        .gj-map-toggle:hover{background:rgba(45,52,72,0.95);transform:scale(1.08)}
        .gj-map-toggle.active{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);box-shadow:0 3px 12px rgba(99,102,241,0.4)}
        .gj-map-toggle svg{width:18px;height:18px;color:rgba(255,255,255,0.85)}
        .gj-map-toggle:hover svg,.gj-map-toggle.active svg{color:#fff}
        .gj-shortcut-info{font-size:10px;color:#6b7280;text-align:center;padding:8px;border-top:1px solid rgba(255,255,255,0.04);background:rgba(0,0,0,0.1)}
        .gj-shortcut-info kbd{background:rgba(99,102,241,0.2);padding:2px 6px;border-radius:4px;font-family:monospace;color:#a5b4fc}
        .gj-loading{position:absolute;bottom:50px;right:10px;background:rgba(30,35,50,0.95);padding:8px 14px;border-radius:8px;font-size:11px;color:#a5b4fc;font-family:'Nunito',sans-serif;z-index:1001;display:none}
        .gj-loading.show{display:block}
    `;

    const icons = {
        layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
        folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
        x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    };

    function simplifyCoords(coords, tolerance) {
        if (coords.length <= 2) return coords;
        let maxDist = 0, maxIdx = 0;
        const first = coords[0], last = coords[coords.length - 1];
        for (let i = 1; i < coords.length - 1; i++) {
            const dist = perpendicularDist(coords[i], first, last);
            if (dist > maxDist) { maxDist = dist; maxIdx = i; }
        }
        if (maxDist > tolerance) {
            const left = simplifyCoords(coords.slice(0, maxIdx + 1), tolerance);
            const right = simplifyCoords(coords.slice(maxIdx), tolerance);
            return left.slice(0, -1).concat(right);
        }
        return [first, last];
    }

    function perpendicularDist(point, lineStart, lineEnd) {
        const dx = lineEnd[0] - lineStart[0], dy = lineEnd[1] - lineStart[1];
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return Math.sqrt(Math.pow(point[0] - lineStart[0], 2) + Math.pow(point[1] - lineStart[1], 2));
        return Math.abs(dy * point[0] - dx * point[1] + lineEnd[0] * lineStart[1] - lineEnd[1] * lineStart[0]) / len;
    }

    function simplifyRing(ring, tolerance) {
        if (ring.length < 4) return ring;
        const simplified = simplifyCoords(ring, tolerance);
        if (simplified.length > 0 && (simplified[0][0] !== simplified[simplified.length-1][0] || simplified[0][1] !== simplified[simplified.length-1][1])) simplified.push(simplified[0]);
        return simplified.length >= 4 ? simplified : ring;
    }

    function getFeatureName(feature, index) {
        const p = feature.properties || {};
        const nameProps = ['name','NAME','Name','nome','NOME','title','TITLE','label','LABEL','text','TEXT','NAME_0','NAME_1','NAME_2','NAME_3','NAME_4','NAME_5','name_1','name_2','name_3','VARNAME_1','VARNAME_2','NL_NAME_1','NL_NAME_2','ENGTYPE_1','ENGTYPE_2','admin','ADMIN','sovereignt','name_long','name_en','formal_en','name_sort','region','REGION','state','STATE','province','PROVINCE','county','COUNTY','city','CITY','district','DISTRICT','municipality','MUNICIPALITY','country','COUNTRY','subdivision','department','DEPARTMENT','prefecture','canton','commune','parish','AreaCode','AREACODE','areacode','area_code','PhoneCode','phonecode','phone_code','phone','PHONE','code','CODE','dial_code','prefix','PREFIX','year','YEAR','date','DATE','coverage','coverage_date','kabkot','KABKOT','kabupaten','provinsi','PROVINSI','kecamatan','kelurahan','desa','regency','nm_mun','NM_MUN','nm_uf','NM_UF','nm_micro','nm_meso','nm_regiao','nomemun','nome_munic','GEN','gen','BEZ','bez','NUTS_NAME','nom','NOM','nom_com','nom_dept','nom_region','libelle','nombre','NOMBRE','nameunit','rotulo','nam','NAM','name_ja','name_local','name_ru','description','featurename','placename','localname','officialname','shortname','fullname','display_name','alt_name','id','ID','fid','FID','gid','GID','objectid','GID_0','GID_1','GID_2','GID_3','ISO_1','ISO_2','ISO_3','HASC_1','HASC_2','iso','iso_a2','iso_a3','CC_1','CC_2'];
        for (const prop of nameProps) { const val = p[prop]; if (val !== undefined && val !== null && val !== 'NA' && val !== 'N/A' && val !== '' && val !== 'null') return String(val); }
        if (feature.id !== undefined && feature.id !== null) return String(feature.id);
        return (state.lang === 'pt' ? 'Região ' : 'Region ') + (index + 1);
    }

    function detectFilterableProperties(geoJSON) {
        if (!geoJSON || !geoJSON.features || geoJSON.features.length === 0) return [];
        const propCounts = {}, propValues = {};
        const sampleSize = Math.min(geoJSON.features.length, 100);
        for (let i = 0; i < sampleSize; i++) {
            const feature = geoJSON.features[i];
            const props = feature.properties || {};
            for (const [key, value] of Object.entries(props)) {
                if (value === null || value === undefined || value === '' || value === 'NA') continue;
                propCounts[key] = (propCounts[key] || 0) + 1;
                if (!propValues[key]) propValues[key] = new Set();
                if (propValues[key].size < 50) propValues[key].add(String(value));
            }
        }
        const filterableProps = [];
        const filterKeywords = ['code','area','phone','year','date','coverage','type','region','state','province','country','district','level','zone','class','category','status','prefix','iso','hasc','gid','cc'];
        for (const [key, count] of Object.entries(propCounts)) {
            if (count < sampleSize * 0.5) continue;
            const uniqueValues = propValues[key].size;
            const keyLower = key.toLowerCase();
            const isFilterKeyword = filterKeywords.some(kw => keyLower.includes(kw));
            const hasReasonableValues = uniqueValues >= 2 && uniqueValues <= 100;
            if (isFilterKeyword || hasReasonableValues) filterableProps.push({ key: key, uniqueCount: uniqueValues, sampleValues: Array.from(propValues[key]).slice(0, 10) });
        }
        filterableProps.sort((a, b) => { const aK = filterKeywords.some(kw => a.key.toLowerCase().includes(kw)); const bK = filterKeywords.some(kw => b.key.toLowerCase().includes(kw)); if (aK && !bK) return -1; if (!aK && bK) return 1; return a.uniqueCount - b.uniqueCount; });
        return filterableProps.slice(0, 5);
    }

    function applyFilters() {
        if (!state.geoJSON) { state.filteredGeoJSON = null; return; }
        const hasFilters = Object.keys(state.activeFilters).length > 0 && Object.values(state.activeFilters).some(v => v && v.trim() !== '');
        if (!hasFilters) { state.filteredGeoJSON = state.geoJSON; return; }
        const filteredFeatures = state.geoJSON.features.filter(feature => {
            const props = feature.properties || {};
            for (const [key, filterValue] of Object.entries(state.activeFilters)) {
                if (!filterValue || filterValue.trim() === '') continue;
                const propValue = String(props[key] || '').toLowerCase();
                const filterParts = filterValue.toLowerCase().trim().split(',').map(s => s.trim()).filter(s => s);
                const matches = filterParts.some(part => {
                    if (part.endsWith('*') && !part.startsWith('*')) return propValue.startsWith(part.slice(0, -1));
                    if (part.startsWith('*') && !part.endsWith('*')) return propValue.endsWith(part.slice(1));
                    if (part.startsWith('*') && part.endsWith('*')) return propValue.includes(part.slice(1, -1));
                    return propValue.includes(part) || propValue === part;
                });
                if (!matches) return false;
            }
            return true;
        });
        state.filteredGeoJSON = { type: 'FeatureCollection', features: filteredFeatures };
    }

    function topoToGeoJSON(topology) {
        try {
            const transform = topology.transform, arcs = topology.arcs;
            function decodeArc(arc) { let x = 0, y = 0; return arc.map(p => { x += p[0]; y += p[1]; return transform ? [x * transform.scale[0] + transform.translate[0], y * transform.scale[1] + transform.translate[1]] : [x, y]; }); }
            const decodedArcs = arcs.map(decodeArc);
            function arcToCoords(i) { return i >= 0 ? decodedArcs[i].slice() : decodedArcs[~i].slice().reverse(); }
            function arcsToRing(idxs) { const c = []; for (const i of idxs) { const ac = arcToCoords(i); if (c.length > 0) ac.shift(); c.push(...ac); } return c; }
            function convertGeom(g) { if (!g) return null; switch (g.type) { case 'Point': return { type: 'Point', coordinates: g.coordinates }; case 'MultiPoint': return { type: 'MultiPoint', coordinates: g.coordinates }; case 'LineString': return { type: 'LineString', coordinates: arcsToRing(g.arcs) }; case 'MultiLineString': return { type: 'MultiLineString', coordinates: g.arcs.map(arcsToRing) }; case 'Polygon': return { type: 'Polygon', coordinates: g.arcs.map(arcsToRing) }; case 'MultiPolygon': return { type: 'MultiPolygon', coordinates: g.arcs.map(p => p.map(arcsToRing)) }; case 'GeometryCollection': return { type: 'GeometryCollection', geometries: g.geometries.map(convertGeom) }; default: return null; } }
            const features = [];
            for (const key of Object.keys(topology.objects)) { const obj = topology.objects[key]; if (obj.type === 'GeometryCollection') { for (const g of obj.geometries) { const geo = convertGeom(g); if (geo) features.push({ type: 'Feature', properties: g.properties || {}, id: g.id, geometry: geo }); } } else { const geo = convertGeom(obj); if (geo) features.push({ type: 'Feature', properties: obj.properties || {}, id: obj.id, geometry: geo }); } }
            return { type: 'FeatureCollection', features };
        } catch (e) { return null; }
    }

    function toast(message, type = 'success') { let t = document.querySelector('.gj-toast'); if (!t) { t = document.createElement('div'); t.className = 'gj-toast'; document.body.appendChild(t); } t.innerHTML = (type === 'success' ? icons.check : icons.x) + '<span>' + message + '</span>'; t.className = 'gj-toast ' + type; setTimeout(() => t.classList.add('show'), 10); setTimeout(() => t.classList.remove('show'), 3000); }
    function getCentroid(coords) { let sLat = 0, sLng = 0, c = 0; const flat = coords.flat(Infinity); for (let i = 0; i < flat.length - 1; i += 2) { if (typeof flat[i] === 'number') { sLng += flat[i]; sLat += flat[i + 1]; c++; } } return c > 0 ? { lat: sLat / c, lng: sLng / c } : null; }
    function getMap() { const el = document.getElementsByClassName("guess-map_canvas__cvpqv")[0]; if (!el) return null; try { const k = Object.keys(el).find(k => k.startsWith("__reactFiber$")); if (!k) return null; const p = el[k]; let m = null; try { if (p.return?.return?.memoizedProps?.map) m = p.return.return.memoizedProps.map; } catch(e) {} try { if (!m && p.return?.memoizedState?.memoizedState?.current?.instance) m = p.return.memoizedState.memoizedState.current.instance; } catch(e) {} try { if (!m && p.return?.memoizedProps?.map) m = p.return.memoizedProps.map; } catch(e) {} if (m) { state.map = m; state.google = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window).google; return m; } } catch (e) {} return null; }
    function clearOverlay() { if (state.renderTimeout) { clearTimeout(state.renderTimeout); state.renderTimeout = null; } state.polygons.forEach(p => { try { if (p?.setMap) p.setMap(null); } catch(e) {} }); state.polygons = []; state.labels.forEach(l => { try { if (l?.setMap) l.setMap(null); } catch(e) {} }); state.labels = []; showLoading(false); }
    function showLoading(show, text) { let el = document.querySelector('.gj-loading'); if (!el) { el = document.createElement('div'); el.className = 'gj-loading'; const w = document.querySelector('.guess-map') || document.querySelector('.guess-map_canvas__cvpqv')?.parentElement; if (w) w.appendChild(el); } if (el) { el.textContent = text || t('loading'); el.classList.toggle('show', show); } }
    function createLabelClass() { if (state.labelClassCreated) return true; if (!state.google?.maps) return false; try { class GJLabel extends state.google.maps.OverlayView { constructor(pos, txt) { super(); this.position = pos; this.text = txt; this.div = null; } onAdd() { this.div = document.createElement('div'); this.div.className = 'gj-map-label'; this.div.textContent = this.text; this.getPanes()?.overlayLayer?.appendChild(this.div); } draw() { if (!this.div) return; const proj = this.getProjection(); if (!proj) return; try { const pos = proj.fromLatLngToDivPixel(this.position); if (pos) this.div.style.cssText = 'position:absolute;left:' + pos.x + 'px;top:' + pos.y + 'px;transform:translate(-50%,-50%)'; } catch(e) {} } onRemove() { this.div?.parentNode?.removeChild(this.div); this.div = null; } } window.GJLabelOverlay = GJLabel; state.labelClassCreated = true; return true; } catch(e) { return false; } }

    function renderGeoJSON() {
        const data = state.filteredGeoJSON || state.geoJSON;
        if (!data || !state.enabled) { clearOverlay(); updateUI(); return; }
        const map = getMap(); if (!map) { setTimeout(renderGeoJSON, 500); return; }
        if (!state.google?.maps) return;
        clearOverlay(); if (!createLabelClass()) return;
        const features = data.features, total = features.length;
        const shouldSimplify = total > PERF.SIMPLIFY_THRESHOLD, tolerance = shouldSimplify ? PERF.COORD_SIMPLIFY : 0;
        showLoading(true, t('rendering') + ' ' + total + ' ' + t('regions') + '...');
        let idx = 0; const google = state.google;
        
        function batch() {
            const end = Math.min(idx + PERF.BATCH_SIZE, total);
            for (; idx < end; idx++) {
                const f = features[idx], g = f.geometry; if (!g) continue;
                const name = getFeatureName(f, idx);
                try {
                    if (g.type === 'Polygon') {
                        const paths = g.coordinates.map(r => (tolerance > 0 ? simplifyRing(r, tolerance) : r).map(c => ({ lat: c[1], lng: c[0] })));
                        const poly = new google.maps.Polygon({ paths, fillColor: state.style.fillColor, fillOpacity: state.style.fillOpacity, strokeColor: state.style.strokeColor, strokeWeight: state.style.strokeWeight, clickable: false, zIndex: 1 });
                        poly.setMap(map); state.polygons.push(poly);
                        const cen = getCentroid(g.coordinates);
                        if (cen) { const lbl = new window.GJLabelOverlay(new google.maps.LatLng(cen.lat, cen.lng), name); lbl.setMap(map); state.labels.push(lbl); }
                    } else if (g.type === 'MultiPolygon') {
                        let maxS = 0, mainC = null;
                        g.coordinates.forEach(pc => { 
                            const paths = pc.map(r => (tolerance > 0 ? simplifyRing(r, tolerance) : r).map(c => ({ lat: c[1], lng: c[0] }))); 
                            const poly = new google.maps.Polygon({ paths, fillColor: state.style.fillColor, fillOpacity: state.style.fillOpacity, strokeColor: state.style.strokeColor, strokeWeight: state.style.strokeWeight, clickable: false, zIndex: 1 }); 
                            poly.setMap(map); state.polygons.push(poly); 
                            const s = pc[0]?.length || 0; 
                            if (s > maxS) { maxS = s; mainC = getCentroid([pc]); } 
                        });
                        if (mainC) { const lbl = new window.GJLabelOverlay(new google.maps.LatLng(mainC.lat, mainC.lng), name); lbl.setMap(map); state.labels.push(lbl); }
                    }
                } catch (e) {}
            }
            if (idx < total) { showLoading(true, t('rendering') + '... ' + Math.round((idx / total) * 100) + '%'); state.renderTimeout = setTimeout(batch, PERF.BATCH_DELAY); }
            else { showLoading(false); updateUI(); }
        }
        batch();
    }

    function updateUI() { const dot = document.getElementById('gj-status-dot'), txt = document.getElementById('gj-status-text'), cnt = document.getElementById('gj-count'), btn = document.querySelector('.gj-map-toggle'); if (dot) dot.className = 'gj-status-dot' + (state.enabled ? ' active' : ''); if (txt) txt.textContent = state.enabled ? t('overlayActive') : t('overlayDisabled'); if (cnt) { const tot = state.geoJSON?.features?.length || 0, flt = state.filteredGeoJSON?.features?.length || tot; cnt.textContent = (tot !== flt ? flt + '/' + tot + ' ' : tot + ' ') + (tot !== 1 ? t('regions') : t('region')); } if (btn) btn.classList.toggle('active', state.enabled); }
    function updateSlider(id, val, max) { const w = document.getElementById(id); if (!w) return; const f = w.querySelector('.gj-slider-fill'), th = w.querySelector('.gj-slider-thumb'), pct = (val / max) * 100; if (f) f.style.width = pct + '%'; if (th) th.style.left = pct + '%'; }
    function updateFiltersUI() { const c = document.getElementById('gj-filters-container'); if (!c) return; if (state.filterableProperties.length === 0) { c.innerHTML = '<div class="gj-filter-hint">' + t('filterHint') + '</div>'; return; } let h = ''; state.filterableProperties.forEach(p => { h += '<div class="gj-filter-row"><span class="gj-filter-label">' + p.key + '</span><input type="text" class="gj-filter-input" data-filter-key="' + p.key + '" value="' + (state.activeFilters[p.key] || '') + '" placeholder="' + t('filterPlaceholder') + '"></div>'; }); h += '<div class="gj-filter-hint">' + t('filterUsage') + '</div>'; const tags = Object.entries(state.activeFilters).filter(([k, v]) => v?.trim()).map(([k, v]) => '<div class="gj-filter-tag"><span>' + k + ': ' + v + '</span><button class="gj-filter-tag-remove" data-remove-key="' + k + '">×</button></div>').join(''); if (tags) h += '<div class="gj-filter-tags">' + tags + '</div>'; c.innerHTML = h; c.querySelectorAll('.gj-filter-input').forEach(i => { i.addEventListener('input', e => { state.activeFilters[e.target.dataset.filterKey] = e.target.value; }); i.addEventListener('change', () => { applyFilters(); updateRegionsList(); updateUI(); if (state.enabled) renderGeoJSON(); updateFiltersUI(); }); }); c.querySelectorAll('.gj-filter-tag-remove').forEach(b => { b.addEventListener('click', e => { delete state.activeFilters[e.target.dataset.removeKey]; applyFilters(); updateRegionsList(); updateUI(); if (state.enabled) renderGeoJSON(); updateFiltersUI(); }); }); }
    function updateRegionsList() { const c = document.getElementById('gj-regions-list'); if (!c) return; const d = state.filteredGeoJSON || state.geoJSON; if (!d?.features?.length) { c.innerHTML = '<div class="gj-empty">' + icons.folder + '<p>' + t('noGeoJSON') + '</p></div>'; return; } let h = ''; d.features.slice(0, 50).forEach((f, i) => { h += '<div class="gj-region"><div class="gj-region-num">' + (i + 1) + '</div><div class="gj-region-name">' + getFeatureName(f, i) + '</div><div class="gj-region-type">' + (f.geometry?.type || '?') + '</div></div>'; }); if (d.features.length > 50) h += '<div class="gj-region" style="justify-content:center;opacity:0.6;">+' + (d.features.length - 50) + ' ' + t('more') + '</div>'; c.innerHTML = h; }
    
    function openPanel() { 
        if (!isClassicGame()) return; 
        const o = document.querySelector('.gj-overlay'); 
        if (o) { 
            o.classList.add('open'); 
            setTimeout(() => o.classList.add('visible'), 10); 
        } 
        state.panelOpen = true; 
    }
    
    function closePanel() { 
        const o = document.querySelector('.gj-overlay'); 
        if (o) { 
            o.classList.remove('visible'); 
            setTimeout(() => o.classList.remove('open'), 250); 
        } 
        state.panelOpen = false; 
    }
    
    function toggleOverlay() { if (!isClassicGame()) return; state.enabled = !state.enabled; document.querySelector('.gj-map-toggle')?.classList.toggle('active', state.enabled); updateUI(); if (state.enabled && state.geoJSON) renderGeoJSON(); else clearOverlay(); }
    function createSliderHTML(id, label, val, max, unit) { const pct = (val / max) * 100; return '<div class="gj-style-item"><label>' + label + ': <span id="' + id + '-val">' + (unit === '%' ? Math.round(val * 100) + '%' : val + 'px') + '</span></label><div class="gj-slider-wrapper" id="' + id + '-wrapper"><div class="gj-slider-track"></div><div class="gj-slider-fill" style="width:' + pct + '%"></div><div class="gj-slider-thumb" style="left:' + pct + '%"></div><input type="range" class="gj-slider-input" id="' + id + '" min="0" max="' + max + '" step="' + (max === 1 ? '0.01' : '0.1') + '" value="' + val + '"></div></div>'; }

    function updatePanelContent() {
        const titleEl = document.querySelector('.gj-title span');
        if (titleEl) titleEl.textContent = t('title');
        const langBtn = document.getElementById('gj-lang');
        if (langBtn) langBtn.textContent = state.lang === 'en' ? 'PT' : 'EN';
        const sections = document.querySelectorAll('.gj-section-title');
        const sectionKeys = ['loadGeoJSON', 'filters', 'style', 'loadedRegions'];
        sections.forEach((s, i) => { if (sectionKeys[i]) { const icon = s.querySelector('svg')?.outerHTML || ''; s.innerHTML = icon + ' ' + t(sectionKeys[i]); } });
        const clearBtn = document.getElementById('gj-clear');
        const applyBtn = document.getElementById('gj-apply');
        if (clearBtn) clearBtn.innerHTML = icons.trash + ' ' + t('clear');
        if (applyBtn) applyBtn.innerHTML = icons.check + ' ' + t('apply');
        const uploadLabel = document.querySelector('.gj-upload-label span');
        if (uploadLabel) uploadLabel.textContent = t('uploadFile');
        const textarea = document.getElementById('gj-textarea');
        if (textarea) textarea.placeholder = t('pastePlaceholder');
        const styleLabels = document.querySelectorAll('.gj-style-item > label');
        const labelKeys = ['fillColor', 'strokeColor', 'opacity', 'stroke'];
        styleLabels.forEach((l, i) => { if (labelKeys[i]) { const valSpan = l.querySelector('span'); const valText = valSpan ? valSpan.outerHTML : ''; if (i < 2) { l.textContent = t(labelKeys[i]); } else { l.innerHTML = t(labelKeys[i]) + ': ' + valText; } } });
        const shortcutInfo = document.querySelector('.gj-shortcut-info');
        if (shortcutInfo) { shortcutInfo.innerHTML = '<kbd>J</kbd> ' + t('shortcutInfo') + ' · <kbd>G</kbd> ' + t('shortcutToggle') + '<br><small style="color:#ef4444;">⚠ ' + t('classicOnly') + '</small>'; }
        updateUI(); updateFiltersUI(); updateRegionsList();
    }

    function createUI() {
        if (!document.getElementById('gj-styles')) { const style = document.createElement('style'); style.id = 'gj-styles'; style.textContent = css; document.head.appendChild(style); }
        document.querySelector('.gj-overlay')?.remove();
        const o = document.createElement('div'); 
        o.className = 'gj-overlay';
        o.innerHTML = '<div class="gj-panel"><div class="gj-header"><div class="gj-title"><div class="gj-title-icon">' + icons.layers + '</div><span>' + t('title') + '</span></div><div class="gj-header-actions"><button class="gj-lang-btn" id="gj-lang">' + (state.lang === 'en' ? 'PT' : 'EN') + '</button><button class="gj-close" id="gj-close">' + icons.close + '</button></div></div><div class="gj-status-bar"><div class="gj-status-item"><div class="gj-status-dot" id="gj-status-dot"></div><span class="gj-status-text" id="gj-status-text">' + t('overlayDisabled') + '</span></div><div class="gj-status-count" id="gj-count">0 ' + t('regions') + '</div></div><div class="gj-content"><div class="gj-section"><div class="gj-section-title">' + t('loadGeoJSON') + '</div><div class="gj-upload"><input type="file" id="gj-file" accept=".json,.geojson,.topojson"><label for="gj-file" class="gj-upload-label">' + icons.upload + '<span>' + t('uploadFile') + '</span></label></div><textarea class="gj-textarea" id="gj-textarea" placeholder="' + t('pastePlaceholder') + '"></textarea><div class="gj-buttons"><button class="gj-btn secondary" id="gj-clear">' + icons.trash + ' ' + t('clear') + '</button><button class="gj-btn primary" id="gj-apply">' + icons.check + ' ' + t('apply') + '</button></div></div><div class="gj-section"><div class="gj-section-title">' + icons.filter + ' ' + t('filters') + '</div><div class="gj-filters" id="gj-filters-container"><div class="gj-filter-hint">' + t('filterHint') + '</div></div></div><div class="gj-section"><div class="gj-section-title">' + t('style') + '</div><div class="gj-style-grid"><div class="gj-style-item"><label>' + t('fillColor') + '</label><div class="gj-color-preview" id="gj-fill-preview" style="background:' + state.style.fillColor + '"><input type="color" id="gj-fill-color" value="' + state.style.fillColor + '"></div></div><div class="gj-style-item"><label>' + t('strokeColor') + '</label><div class="gj-color-preview" id="gj-stroke-preview" style="background:' + state.style.strokeColor + '"><input type="color" id="gj-stroke-color" value="' + state.style.strokeColor + '"></div></div>' + createSliderHTML('gj-fill-opacity', t('opacity'), state.style.fillOpacity, 1, '%') + createSliderHTML('gj-stroke-width', t('stroke'), state.style.strokeWeight, 4, 'px') + '</div></div><div class="gj-section"><div class="gj-section-title">' + t('loadedRegions') + '</div><div class="gj-regions" id="gj-regions-list"><div class="gj-empty">' + icons.folder + '<p>' + t('noGeoJSON') + '</p></div></div></div></div><div class="gj-shortcut-info"><kbd>J</kbd> ' + t('shortcutInfo') + ' · <kbd>G</kbd> ' + t('shortcutToggle') + '<br><small style="color:#ef4444;">⚠ ' + t('classicOnly') + '</small></div></div>';
        document.body.appendChild(o);
        setupEvents(o);
        if (state.panelOpen) { o.classList.add('open'); setTimeout(() => o.classList.add('visible'), 10); }
    }

    function setupEvents(o) {
        document.getElementById('gj-close').addEventListener('click', closePanel);
        document.getElementById('gj-lang').addEventListener('click', () => { state.lang = state.lang === 'en' ? 'pt' : 'en'; localStorage.setItem('gj-lang', state.lang); updatePanelContent(); toast(t('langChanged')); });
        o.addEventListener('click', e => { if (e.target === o) closePanel(); });
        document.getElementById('gj-file').addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { document.getElementById('gj-textarea').value = ev.target.result; toast(t('fileLoaded')); }; r.readAsText(f); });
        document.getElementById('gj-apply').addEventListener('click', () => { try { const txt = document.getElementById('gj-textarea').value.trim(); if (!txt) { toast(t('enterGeoJSON'), 'error'); return; } let json = JSON.parse(txt); if (json.type === 'Topology' && json.objects) { json = topoToGeoJSON(json); if (!json) throw new Error(t('failedTopoJSON')); } if (json.type !== 'FeatureCollection' || !Array.isArray(json.features)) throw new Error(t('invalidGeoJSON')); state.geoJSON = json; state.activeFilters = {}; state.filterableProperties = detectFilterableProperties(json); applyFilters(); updateUI(); updateRegionsList(); updateFiltersUI(); if (state.enabled) renderGeoJSON(); toast(json.features.length + ' ' + t('regionsLoaded')); } catch (e) { toast(t('error') + ': ' + e.message, 'error'); } });
        document.getElementById('gj-clear').addEventListener('click', () => { document.getElementById('gj-textarea').value = ''; state.geoJSON = null; state.filteredGeoJSON = null; state.activeFilters = {}; state.filterableProperties = []; clearOverlay(); updateUI(); updateRegionsList(); updateFiltersUI(); toast(t('cleared')); });
        document.getElementById('gj-fill-color').addEventListener('input', e => { state.style.fillColor = e.target.value; document.getElementById('gj-fill-preview').style.background = e.target.value; if (state.enabled && state.geoJSON) renderGeoJSON(); });
        document.getElementById('gj-stroke-color').addEventListener('input', e => { state.style.strokeColor = e.target.value; document.getElementById('gj-stroke-preview').style.background = e.target.value; if (state.enabled && state.geoJSON) renderGeoJSON(); });
        document.getElementById('gj-fill-opacity').addEventListener('input', e => { state.style.fillOpacity = parseFloat(e.target.value); document.getElementById('gj-fill-opacity-val').textContent = Math.round(state.style.fillOpacity * 100) + '%'; updateSlider('gj-fill-opacity-wrapper', state.style.fillOpacity, 1); if (state.enabled && state.geoJSON) renderGeoJSON(); });
        document.getElementById('gj-stroke-width').addEventListener('input', e => { state.style.strokeWeight = parseFloat(e.target.value); document.getElementById('gj-stroke-width-val').textContent = state.style.strokeWeight.toFixed(1) + 'px'; updateSlider('gj-stroke-width-wrapper', state.style.strokeWeight, 4); if (state.enabled && state.geoJSON) renderGeoJSON(); });
    }

    let keyboardSetup = false;
    function setupKeyboard() {
        if (keyboardSetup) return;
        keyboardSetup = true;
        document.addEventListener('keydown', e => { if (!isClassicGame()) return; if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return; if (e.key === 'j' || e.key === 'J') { e.preventDefault(); e.stopPropagation(); if (state.panelOpen) closePanel(); else openPanel(); } if (e.key === 'g' || e.key === 'G') { e.preventDefault(); e.stopPropagation(); toggleOverlay(); } }, true);
    }

    function injectMapButton() { const ex = document.querySelector('.gj-map-toggle'); if (ex) ex.remove(); const mc = document.querySelector('.guess-map_canvas__cvpqv'); if (!mc) return; const w = mc.closest('.guess-map') || mc.parentElement; if (!w) return; if (getComputedStyle(w).position === 'static') w.style.position = 'relative'; const b = document.createElement('button'); b.className = 'gj-map-toggle'; b.title = 'GeoJSON Overlay (J/G)'; b.innerHTML = icons.layers; if (state.enabled) b.classList.add('active'); b.addEventListener('click', e => { e.stopPropagation(); toggleOverlay(); }); b.addEventListener('dblclick', e => { e.stopPropagation(); openPanel(); }); b.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation(); openPanel(); }); w.appendChild(b); }

    let lastUrl = '';
    function checkGame() { const url = window.location.href; if (url !== lastUrl) { lastUrl = url; clearOverlay(); state.labelClassCreated = false; if (!isClassicGame()) { document.querySelector('.gj-map-toggle')?.remove(); if (state.panelOpen) closePanel(); state.enabled = false; } } if (isClassicGame()) { const mc = document.querySelector('.guess-map_canvas__cvpqv'); if (mc && !document.querySelector('.gj-map-toggle')) injectMapButton(); if (state.enabled && state.geoJSON && mc && !document.querySelector('.gj-map-label') && state.labels.length === 0) renderGeoJSON(); } }

    function init() { createUI(); setupKeyboard(); setInterval(checkGame, 1000); new MutationObserver(() => { if (isClassicGame() && document.querySelector('.guess-map_canvas__cvpqv') && !document.querySelector('.gj-map-toggle')) injectMapButton(); }).observe(document.body, { childList: true, subtree: true }); console.log('[GeoJSON Overlay v7.2] Ready! All labels shown.'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();