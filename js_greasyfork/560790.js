// ==UserScript==
// @name         Abdullah Abbas Advanced City Explorer (Multi-Lang)
// @namespace    https://greasyfork.org/users/abdullah-abbas
// @version      2025.12.31.02.15
// @description  مستكشف المدن: شريط بحث عريض، 6 لغات، إنجليزية افتراضية، وتمركز دقيق (تصميم ذهبي)
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @author       Abdullah Abbas
// @downloadURL https://update.greasyfork.org/scripts/560790/Abdullah%20Abbas%20Advanced%20City%20Explorer%20%28Multi-Lang%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560790/Abdullah%20Abbas%20Advanced%20City%20Explorer%20%28Multi-Lang%29.meta.js
// ==/UserScript==

/* global W, OpenLayers, $ */

(function() {
    'use strict';

    var SearchWindow = null;
    var groupedData = {};
    var isDragging = false;

    // --- إعدادات اللغة ---
    var langs = ['en', 'ar', 'ku', 'fr', 'es', 'de'];
    var currentLang = localStorage.getItem('aa_explorer_lang') || 'en';

    var translations = {
        en: {
            dir: 'ltr',
            name: 'Abdullah Abbas',
            title: 'City Explorer',
            placeholder: 'Search (City, Street, Place)...',
            scan: 'Scan Area (All)',
            selectAll: 'Select All',
            deselect: 'Deselect',
            clear: 'Clear Cache',
            back: 'Back',
            empty: 'Press "Scan Area" to start',
            loading: 'Searching...',
            noResults: 'No results found.',
            places: 'Places',
            segments: 'Segments',
            tooltipMin: 'Minimize',
            tooltipMax: 'Maximize'
        },
        ar: {
            dir: 'rtl',
            name: 'عبدالله عباس',
            title: 'مستكشف المدن',
            placeholder: 'اكتب للبحث (مدينة، شارع، مكان)...',
            scan: 'بحث شامل (في الشاشة)',
            selectAll: 'تحديد الكل',
            deselect: 'إلغاء التحديد',
            clear: 'مسح الكاش',
            back: 'رجوع',
            empty: 'اضغط "بحث شامل" للبدء',
            loading: 'جاري البحث...',
            noResults: 'لا توجد نتائج.',
            places: 'أماكن',
            segments: 'طرق',
            tooltipMin: 'تصغير',
            tooltipMax: 'تكبير'
        },
        ku: {
            dir: 'rtl',
            name: 'عەبدوڵڵا عەباس',
            title: 'گەڕۆکی شارەکان',
            placeholder: 'گەڕان (شار، شەقام، شوێن)...',
            scan: 'پشکنینی ناوچە',
            selectAll: 'دیاریکردنی هەموو',
            deselect: 'لابردنی دیاریکردن',
            clear: 'پاککردنەوە',
            back: 'گەڕانەوە',
            empty: 'بۆ دەستپێکردن "پشکنین" داگرە',
            loading: 'جارێ گەڕان...',
            noResults: 'هیچ ئەنجامێک نەدۆزرایەوە.',
            places: 'شوێنەکان',
            segments: 'ڕێگاکان',
            tooltipMin: ' بچووککردنەوە',
            tooltipMax: 'گەورەکردنەوە'
        },
        fr: {
            dir: 'ltr',
            name: 'Abdullah Abbas',
            title: 'Explorateur de Ville',
            placeholder: 'Rechercher...',
            scan: 'Scanner la zone',
            selectAll: 'Tout sélect.',
            deselect: 'Désélect.',
            clear: 'Effacer',
            back: 'Retour',
            empty: 'Appuyez sur Scanner',
            loading: 'Recherche...',
            noResults: 'Aucun résultat.',
            places: 'Lieux',
            segments: 'Routes',
            tooltipMin: 'Réduire',
            tooltipMax: 'Agrandir'
        },
        es: {
            dir: 'ltr',
            name: 'Abdullah Abbas',
            title: 'Explorador de Ciudad',
            placeholder: 'Buscar...',
            scan: 'Escanear área',
            selectAll: 'Sel. Todo',
            deselect: 'Deseleccionar',
            clear: 'Limpiar',
            back: 'Volver',
            empty: 'Presione Escanear',
            loading: 'Buscando...',
            noResults: 'Sin resultados.',
            places: 'Lugares',
            segments: 'Vías',
            tooltipMin: 'Minimizar',
            tooltipMax: 'Maximizar'
        },
        de: {
            dir: 'ltr',
            name: 'Abdullah Abbas',
            title: 'Stadt-Explorer',
            placeholder: 'Suchen...',
            scan: 'Bereich scannen',
            selectAll: 'Alles auswählen',
            deselect: 'Abwählen',
            clear: 'Löschen',
            back: 'Zurück',
            empty: 'Drücken Sie Scannen',
            loading: 'Suchen...',
            noResults: 'Keine Ergebnisse.',
            places: 'Orte',
            segments: 'Segmente',
            tooltipMin: 'Minimieren',
            tooltipMax: 'Maximieren'
        }
    };

    function t(key) {
        return translations[currentLang][key] || translations['en'][key];
    }

    function bootstrap(tries = 1) {
        if (typeof W !== 'undefined' && W.map && W.model && W.selectionManager) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(++tries);}, 200);
        }
    }

    bootstrap();

    function init(){
        injectCss();
        createUI();
        loadSettings();
        console.log('Abdullah.Abbas Explorer: Ready');
    }

    function normalizeText(text) {
        if (!text) return "";
        text = text.toString().toLowerCase();
        text = text.replace(/[أإآ]/g, 'ا');
        text = text.replace(/[ى]/g, 'ي');
        text = text.replace(/[ة]/g, 'ه');
        var arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
        for (var i = 0; i < 10; i++) {
            text = text.replace(new RegExp(arabicDigits[i], 'g'), i);
        }
        text = text.replace(/[\u064B-\u065F\u0640]/g, '');
        return text.trim();
    }

    function createUI() {
        var oldWindow = document.getElementById("AAExplorerWindow");
        if (oldWindow) oldWindow.remove();

        SearchWindow = document.createElement('div');
        SearchWindow.id = "AAExplorerWindow";
        SearchWindow.className = "aa-panel " + t('dir');

        var html = `
            <div id="aa-header" class="aa-header">
                <div style="display:flex; align-items:center; gap:5px; overflow:hidden;">
                    <span id="aa-lang-btn" class="aa-lang-icon" title="Change Language">🌐 ${currentLang.toUpperCase()}</span>
                    <span id="aa-title-text" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        <i class="fa fa-map"></i> <b>${t('name')}</b> - ${t('title')}
                    </span>
                </div>
                <span id="aa-collapse" class="fa fa-minus-circle aa-btn-icon" title="${t('tooltipMin')}"></span>
            </div>

            <div id="aa-content" class="aa-content">
                <div class="aa-input-wrapper">
                    <input type="text" id="aa-input" class="aa-input" placeholder="${t('placeholder')}">
                    <span id="aa-search-icon-btn" class="aa-search-icon-btn"><i class="fa fa-search"></i></span>
                </div>

                <div class="aa-btn-row">
                    <button id="aa-btn-scan" class="aa-btn aa-btn-gold" style="width:100%">${t('scan')}</button>
                </div>

                <div class="aa-btn-row aa-flex-space">
                    <button id="aa-btn-select-all" class="aa-btn aa-btn-orange">${t('selectAll')}</button>
                    <button id="aa-btn-deselect" class="aa-btn aa-btn-gray">${t('deselect')}</button>
                    <button id="aa-btn-cache" class="aa-btn aa-btn-blue">${t('clear')}</button>
                </div>

                <div id="aa-breadcrumbs" class="aa-breadcrumbs" style="display:none;">
                    <span id="aa-back-btn" class="aa-back-btn"><i class="fa fa-arrow-${t('dir') === 'rtl' ? 'right' : 'left'}"></i> ${t('back')}</span>
                    <span id="aa-current-city" class="aa-current-city"></span>
                </div>

                <div id="aa-results" class="aa-results-box">
                    <div class="aa-empty-msg">${t('empty')}</div>
                </div>
            </div>
        `;

        SearchWindow.innerHTML = html;
        document.body.appendChild(SearchWindow);

        makeDraggable(SearchWindow, document.getElementById('aa-header'));

        document.getElementById('aa-btn-scan').onclick = scanAndGroup;
        document.getElementById('aa-search-icon-btn').onclick = scanAndGroup;
        document.getElementById('aa-btn-select-all').onclick = selectAllVisible;
        document.getElementById('aa-btn-deselect').onclick = deselectAll;
        document.getElementById('aa-btn-cache').onclick = clearCache;
        document.getElementById('aa-collapse').onclick = toggleCollapse;
        document.getElementById('aa-back-btn').onclick = renderCityList;
        document.getElementById('aa-lang-btn').onclick = cycleLanguage;

        document.getElementById('aa-input').addEventListener("keyup", function(event) {
            if (event.key === "Enter") scanAndGroup();
        });
    }

    function cycleLanguage() {
        var currentIndex = langs.indexOf(currentLang);
        var nextIndex = (currentIndex + 1) % langs.length;
        currentLang = langs[nextIndex];
        localStorage.setItem('aa_explorer_lang', currentLang);
        saveSettings();
        createUI();
        loadSettings();
        if(Object.keys(groupedData).length > 0) renderCityList();
    }

    function saveSettings() {
        var settings = {
            top: SearchWindow.style.top,
            left: SearchWindow.style.left,
            minimized: SearchWindow.classList.contains('aa-minimized')
        };
        localStorage.setItem('aa_explorer_settings', JSON.stringify(settings));
    }

    function loadSettings() {
        var saved = localStorage.getItem('aa_explorer_settings');
        if (saved) {
            var settings = JSON.parse(saved);
            if (settings.top && settings.left) {
                SearchWindow.style.top = settings.top;
                SearchWindow.style.left = settings.left;
            }
            if (settings.minimized) {
                SearchWindow.classList.add('aa-minimized');
                var btn = document.getElementById('aa-collapse');
                if(btn) {
                    btn.className = "fa fa-map-o";
                    btn.title = t('tooltipMax');
                }
            }
        }
    }

    function scanAndGroup() {
        var rawInput = document.getElementById('aa-input').value.trim();
        var query = normalizeText(rawInput);
        var resultsBox = document.getElementById('aa-results');
        var currentExtent = W.map.getExtent();

        resultsBox.innerHTML = `<div class="aa-loading"><i class="fa fa-spinner fa-spin"></i> ${t('loading')}</div>`;

        setTimeout(function() {
            groupedData = {};
            var hasResults = false;

            for (var id in W.model.segments.objects) {
                if (!W.model.segments.objects.hasOwnProperty(id)) continue;
                var seg = W.model.segments.objects[id];
                var geo = seg.getOLGeometry();
                if (!geo || !currentExtent.intersectsBounds(geo.getBounds())) continue;

                var streetID = seg.attributes.primaryStreetID;
                var cityName = t('dir') === 'rtl' ? "بدون مدينة" : "No City";
                var streetName = t('dir') === 'rtl' ? "شارع بلا اسم" : "Unnamed Street";

                if (streetID) {
                    var street = W.model.streets.getObjectById(streetID);
                    if (street) {
                        if(street.name) streetName = street.name;
                        if (street.attributes.cityID) {
                            var city = W.model.cities.getObjectById(street.attributes.cityID);
                            if (city && city.attributes.name && !city.attributes.name.trim().match(/^no city/i)) {
                                cityName = city.attributes.name;
                            }
                        }
                    }
                }

                var match = false;
                if (query.length === 0) match = true;
                else if (normalizeText(cityName).includes(query) || normalizeText(streetName).includes(query)) match = true;

                if (match) {
                    hasResults = true;
                    if (!groupedData[cityName]) groupedData[cityName] = { segments: [], venues: [] };
                    groupedData[cityName].segments.push({ obj: seg, name: streetName, id: id });
                }
            }

            for (var vid in W.model.venues.objects) {
                if (!W.model.venues.objects.hasOwnProperty(vid)) continue;
                var venue = W.model.venues.objects[vid];
                var vGeo = venue.getOLGeometry();
                var isInView = false;
                if (vGeo) {
                    if (currentExtent.intersectsBounds(vGeo.getBounds())) isInView = true;
                } else {
                    var center = venue.getCenter();
                    if(center && currentExtent.containsLonLat(center)) isInView = true;
                }
                if (!isInView) continue;

                var vCityName = t('dir') === 'rtl' ? "بدون مدينة" : "No City";
                var vStreetID = venue.attributes.streetID;
                if (vStreetID) {
                    var vStreet = W.model.streets.getObjectById(vStreetID);
                    if (vStreet && vStreet.attributes.cityID) {
                        var vCity = W.model.cities.getObjectById(vStreet.attributes.cityID);
                        if (vCity && vCity.attributes.name) vCityName = vCity.attributes.name;
                    }
                }
                if(vCityName === (t('dir') === 'rtl' ? "بدون مدينة" : "No City")) {
                     let addr = venue.getAddress();
                     if(addr && addr.attributes.city && addr.attributes.city.attributes.name) {
                         vCityName = addr.attributes.city.attributes.name;
                     }
                }

                var vName = venue.attributes.name || (t('dir') === 'rtl' ? "مكان بلا اسم" : "Unnamed Place");

                var vMatch = false;
                if (query.length === 0) vMatch = true;
                else if (normalizeText(vCityName).includes(query) || normalizeText(vName).includes(query)) vMatch = true;

                if (vMatch) {
                    hasResults = true;
                    if (!groupedData[vCityName]) groupedData[vCityName] = { segments: [], venues: [] };
                    groupedData[vCityName].venues.push({ obj: venue, name: vName, id: vid });
                }
            }

            if (!hasResults) {
                resultsBox.innerHTML = `<div class="aa-empty-msg">${t('noResults')}</div>`;
            } else {
                renderCityList();
            }
        }, 50);
    }

    function deselectAll() { try { W.selectionManager.unselectAll(); } catch(e) {} }

    function clearCache() {
        groupedData = {};
        document.getElementById('aa-input').value = '';
        document.getElementById('aa-results').innerHTML = `<div class="aa-empty-msg">${t('empty')}</div>`;
        document.getElementById('aa-breadcrumbs').style.display = 'none';
        deselectAll();
    }

    function selectAllVisible() {
        var allModels = [];
        for (var city in groupedData) {
            groupedData[city].segments.forEach(item => allModels.push(item.obj));
            groupedData[city].venues.forEach(item => allModels.push(item.obj));
        }
        if (allModels.length > 0) {
            try {
                W.selectionManager.setSelectedModels(allModels);
                jumpToFeature(allModels[0], false);
            } catch(e) {}
        } else {
            alert(t('noResults'));
        }
    }

    function selectSpecific(cityName, type) {
        var data = groupedData[cityName];
        if(!data) return;
        var list = (type === 'segments') ? data.segments : data.venues;
        var models = list.map(item => item.obj);

        if (models.length > 0) {
            try {
                W.selectionManager.setSelectedModels(models);
                jumpToFeature(models[0], false);
            } catch(e) {}
        }
    }

    function jumpToFeature(modelObject, selectIt) {
        if (!modelObject) return;
        var centerLonLat = null;
        if (modelObject.getOLGeometry) {
            var geo = modelObject.getOLGeometry();
            if (geo) {
                var bounds = geo.getBounds();
                if(bounds) centerLonLat = bounds.getCenterLonLat();
            }
        }
        if (!centerLonLat && modelObject.getCenter) {
            var pt = modelObject.getCenter();
            if (pt) {
                if (typeof pt.lon !== 'undefined') centerLonLat = pt;
                else if (typeof pt.x !== 'undefined') centerLonLat = new OpenLayers.LonLat(pt.x, pt.y);
            }
        }
        if (centerLonLat) {
            W.map.setCenter(centerLonLat);
            if(W.map.getZoom() < 17) W.map.zoomTo(17);
        }
        if (selectIt !== false) {
            try { W.selectionManager.setSelectedModels([modelObject]); } catch(e) {}
        }
    }

    function jumpToCityCenter(cityData) {
        var bounds = new OpenLayers.Bounds();
        var hasItems = false;

        cityData.segments.forEach(item => { if(item.obj.getOLGeometry()) { bounds.extend(item.obj.getOLGeometry().getBounds()); hasItems = true; } });
        cityData.venues.forEach(item => { if(item.obj.getOLGeometry()) { bounds.extend(item.obj.getOLGeometry().getBounds()); hasItems = true; } });

        if(hasItems) {
            var center = bounds.getCenterLonLat();
            W.map.setCenter(center);
            if(W.map.getZoom() > 15) W.map.zoomTo(15);
        }
    }

    function renderCityList() {
        var resultsBox = document.getElementById('aa-results');
        var breadcrumbs = document.getElementById('aa-breadcrumbs');

        breadcrumbs.style.display = 'none';
        resultsBox.innerHTML = '';

        var cities = Object.keys(groupedData);
        if (cities.length === 0) {
            resultsBox.innerHTML = `<div class="aa-empty-msg">${t('empty')}</div>`;
            return;
        }

        cities.sort();

        cities.forEach(city => {
            var data = groupedData[city];
            var row = document.createElement('div');
            row.className = 'aa-city-row';

            row.innerHTML = `
                <div class="aa-city-name-box" title="${t('selectAll')}">
                    <i class="fa fa-building"></i> ${city}
                </div>
                <div class="aa-city-controls">
                    <button class="aa-count-btn aa-places-btn" title="${t('places')}">
                        <i class="fa fa-map-marker"></i> ${data.venues.length}
                    </button>
                    <button class="aa-count-btn aa-segments-btn" title="${t('segments')}">
                        <i class="fa fa-road"></i> ${data.segments.length}
                    </button>
                </div>
            `;

            row.querySelector('.aa-places-btn').onclick = function(e) { e.stopPropagation(); selectSpecific(city, 'venues'); };
            row.querySelector('.aa-segments-btn').onclick = function(e) { e.stopPropagation(); selectSpecific(city, 'segments'); };

            row.querySelector('.aa-city-name-box').onclick = function() {
                jumpToCityCenter(data);
                renderCityDetails(city);
            };

            resultsBox.appendChild(row);
        });
    }

    function renderCityDetails(cityName) {
        var resultsBox = document.getElementById('aa-results');
        var breadcrumbs = document.getElementById('aa-breadcrumbs');
        var currentCityLabel = document.getElementById('aa-current-city');

        breadcrumbs.style.display = 'flex';
        currentCityLabel.innerText = cityName;
        resultsBox.innerHTML = '';
        resultsBox.scrollTop = 0;

        var data = groupedData[cityName];

        if (data.venues.length > 0) {
            var vHeader = document.createElement('div');
            vHeader.className = 'aa-section-header';
            vHeader.innerHTML = `<i class="fa fa-map-marker"></i> ${t('places')} (${data.venues.length})`;
            resultsBox.appendChild(vHeader);
            data.venues.forEach(item => { createItemRow(item, 'fa-map-marker', resultsBox); });
        }

        if (data.segments.length > 0) {
            var sHeader = document.createElement('div');
            sHeader.className = 'aa-section-header';
            sHeader.innerHTML = `<i class="fa fa-road"></i> ${t('segments')} (${data.segments.length})`;
            resultsBox.appendChild(sHeader);
            var limit = 300;
            for(let i=0; i<Math.min(data.segments.length, limit); i++) {
                createItemRow(data.segments[i], 'fa-road', resultsBox);
            }
            if(data.segments.length > limit) {
                var more = document.createElement('div');
                more.className = 'aa-more';
                more.innerText = `... ${data.segments.length - limit} more`;
                resultsBox.appendChild(more);
            }
        }
    }

    function createItemRow(item, iconClass, container) {
        var row = document.createElement('div');
        row.className = 'aa-item-row';
        row.innerHTML = `<i class="fa ${iconClass}"></i> ${item.name}`;

        row.onclick = function() {
            var siblings = container.querySelectorAll('.aa-item-row');
            siblings.forEach(sib => sib.classList.remove('aa-selected-row'));
            row.classList.add('aa-selected-row');
            jumpToFeature(item.obj, true);
        };
        container.appendChild(row);
    }

    function toggleCollapse() {
        var panel = document.getElementById('AAExplorerWindow');
        var btn = document.getElementById('aa-collapse');
        if(isDragging) return;
        panel.classList.toggle('aa-minimized');
        if (panel.classList.contains('aa-minimized')) {
            btn.className = "fa fa-map-o";
            btn.title = t('tooltipMax');
        } else {
            btn.className = "fa fa-minus-circle aa-btn-icon";
            btn.title = t('tooltipMin');
        }
        saveSettings();
    }

    function injectCss() {
        var css = `
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');

            #AAExplorerWindow {
                position: fixed; top: 100px; right: 50px; width: 350px;
                background-color: #FFFACD !important;
                border: 2px solid #DAA520 !important; border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                font-family: 'Cairo', sans-serif !important; z-index: 99999;
                transition: width 0.3s, height 0.3s, border-radius 0.3s;
            }
            #AAExplorerWindow.rtl { direction: rtl; text-align: right; }
            #AAExplorerWindow.ltr { direction: ltr; text-align: left; }

            #AAExplorerWindow.aa-minimized {
                width: 60px !important; height: 60px !important;
                border-radius: 50% !important; overflow: hidden;
                border: 3px solid #fff !important; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                cursor: move;
            }
            #AAExplorerWindow.aa-minimized .aa-content { display: none !important; }
            #AAExplorerWindow.aa-minimized #aa-title-text { display: none; }
            #AAExplorerWindow.aa-minimized .aa-header {
                height: 100%; padding: 0; justify-content: center;
                background: linear-gradient(135deg, #DAA520, #B8860B) !important;
                cursor: move;
            }
            #AAExplorerWindow.aa-minimized #aa-collapse { font-size: 28px; color: white; cursor: pointer; }
            #AAExplorerWindow.aa-minimized .aa-lang-icon { display: none; }

            #AAExplorerWindow .aa-header {
                background: linear-gradient(135deg, #B8860B, #FFD700) !important;
                color: #4b3621 !important; padding: 10px 15px; font-weight: bold; border-radius: 6px 6px 0 0;
                cursor: move; display: flex; justify-content: space-between; align-items: center;
                border-bottom: 1px solid #DAA520;
            }
            .aa-lang-icon { cursor: pointer; font-size: 14px; margin-right:5px; padding:2px 5px; background:rgba(255,255,255,0.3); border-radius:4px; }
            .aa-btn-icon { cursor: pointer; font-size: 16px; }
            .aa-content { padding: 10px; }

            .aa-input-wrapper { position: relative; margin-bottom: 8px; width: 100%; }
            .aa-input {
                width: 100% !important; box-sizing: border-box !important; padding: 8px;
                border: 1px solid #DAA520 !important; border-radius: 5px; background-color: #FFFFF0 !important;
                font-family: 'Cairo', sans-serif !important; height: 35px;
            }
            .aa-input:focus { outline: none; border-color: #8B4500 !important; }

            #AAExplorerWindow.rtl .aa-input { padding-left: 35px; text-align: right; }
            #AAExplorerWindow.rtl .aa-search-icon-btn { left: 5px; right: auto; }
            #AAExplorerWindow.ltr .aa-input { padding-right: 35px; text-align: left; }
            #AAExplorerWindow.ltr .aa-search-icon-btn { right: 5px; left: auto; }

            .aa-search-icon-btn {
                position: absolute; top: 50%; transform: translateY(-50%);
                cursor: pointer; color: #DAA520; font-size: 16px; padding: 5px;
            }

            .aa-btn-row { display: flex; gap: 5px; margin-bottom: 8px; }
            .aa-flex-space { justify-content: space-between; }

            #AAExplorerWindow .aa-btn {
                padding: 6px 12px; border: none; border-radius: 5px;
                cursor: pointer; font-family: 'Cairo', sans-serif !important; font-weight: bold; font-size: 11px;
                flex: 1;
            }
            .aa-btn-gold { background: linear-gradient(#FFD700, #DAA520) !important; color: #4b3621 !important; }
            .aa-btn-blue { background: linear-gradient(#3498db, #2980b9) !important; color: white !important; }
            .aa-btn-red { background: linear-gradient(#ff7675, #d63031) !important; color: white !important; }
            .aa-btn-gray { background: linear-gradient(#bdc3c7, #95a5a6) !important; color: white !important; }
            .aa-btn-orange { background: linear-gradient(#f39c12, #d35400) !important; color: white !important; }

            .aa-breadcrumbs {
                display: flex; align-items: center; gap: 10px;
                background: #FFF8DC; padding: 5px; margin-bottom: 5px; border-bottom: 2px solid #DAA520;
            }
            .aa-back-btn {
                cursor: pointer; color: #d35400; font-weight: bold; font-size: 12px;
                background: #fff; padding: 2px 8px; border-radius: 4px; border: 1px solid #d35400;
            }
            .aa-current-city { font-weight: bold; color: #2c3e50; font-size: 13px; }

            .aa-results-box {
                max-height: 350px; overflow-y: auto;
                background: #fff; border: 1px solid #DAA520; border-radius: 5px;
            }

            .aa-city-row {
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 10px; border-bottom: 1px solid #eee; transition: background 0.2s;
            }
            .aa-city-row:hover { background-color: #FFF8DC; }

            .aa-city-name-box {
                flex: 1; font-weight: bold; font-size: 13px; color: #333; cursor: pointer;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .aa-city-name-box i { color: #DAA520; margin: 0 5px; }

            .aa-city-controls { display: flex; gap: 5px; }

            .aa-count-btn {
                border: none; border-radius: 4px; padding: 3px 8px;
                font-size: 11px; cursor: pointer; font-family: 'Cairo'; font-weight: bold;
                display: flex; align-items: center; gap: 4px;
                transition: transform 0.1s;
            }
            .aa-count-btn:active { transform: scale(0.95); }
            .aa-places-btn { background-color: #e8eaf6 !important; color: #3f51b5 !important; border: 1px solid #c5cae9 !important; }
            .aa-segments-btn { background-color: #e8f5e9 !important; color: #2e7d32 !important; border: 1px solid #c8e6c9 !important; }

            .aa-section-header {
                background: #f0f0f0; padding: 5px 10px; font-weight: bold;
                font-size: 12px; color: #555; border-bottom: 1px solid #ddd; border-top: 1px solid #ddd;
            }
            .aa-item-row {
                padding: 6px 10px; border-bottom: 1px solid #f9f9f9;
                cursor: pointer; font-size: 13px; color: #444;
            }
            .aa-item-row:hover { background-color: #e8f6ff; color: #2980b9; }
            .aa-item-row i { width: 20px; text-align: center; color: #DAA520; }

            .aa-selected-row { background-color: #d1ecf1 !important; color: #0c5460 !important; }
            #AAExplorerWindow.rtl .aa-selected-row { border-left: 3px solid #17a2b8; }
            #AAExplorerWindow.ltr .aa-selected-row { border-right: 3px solid #17a2b8; }

            .aa-empty-msg, .aa-loading { padding: 20px; text-align: center; color: #aaa; font-size: 13px; }
            .aa-more { text-align: center; padding: 5px; font-size: 11px; color: #999; }

            .aa-results-box::-webkit-scrollbar { width: 5px; }
            .aa-results-box::-webkit-scrollbar-thumb { background: #DAA520; }
        `;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function makeDraggable(elmnt, handle) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;
        elmnt.onmousedown = function(e) { if(elmnt.classList.contains('aa-minimized')) dragMouseDown(e); };

        function dragMouseDown(e) {
            if(e.target.id === 'aa-collapse' || e.target.id === 'aa-lang-btn' || e.target.classList.contains('aa-btn-icon')) return;
            e = e || window.event; e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            isDragging = false;
        }
        function elementDrag(e) {
            e = e || window.event; e.preventDefault();
            isDragging = true;
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null;
            if(isDragging) saveSettings();
            setTimeout(() => { isDragging = false; }, 100);
        }
    }

})();