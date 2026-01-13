// ==UserScript==
// @name            Abdullah Abbas WME Suite
// @namespace       https://greasyfork.org/users/AbdullahAbbas
// @version         2026.01.12.06
// @description     مجموعة أدوات عبد الله عباس (أزرار الطرق + النسخ الذكي + تلوين شامل للتعديلات) - قوائم منسدلة.
// @author          Abdullah Abbas
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license         GNU GPLv3
// @connect         sheets.googleapis.com
// @connect         greasyfork.org
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @grant           GM_xmlhttpRequest
// @grant           GM_addElement
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require         https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @downloadURL https://update.greasyfork.org/scripts/561521/Abdullah%20Abbas%20WME%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/561521/Abdullah%20Abbas%20WME%20Suite.meta.js
// ==/UserScript==

/* global I18n */
/* global WazeWrap */
/* global bootstrap */
/* global W */
/* global OpenLayers */
/* eslint-disable max-classes-per-file */

(function main() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_NAME = 'Abdullah Abbas WME Suite';
    const SCRIPT_VERSION = GM_info.script.version;
    const DOWNLOAD_URL = '#';
    const SETTINGS_STORE_NAME = 'AbdullahAbbas_WME_Suite_Settings_V6'; // Updated Store Name for structure changes
    let sdk;
    let highlightLayer = null;

    // --- Localization ---
    const UI_STRINGS = {
        'ar': {
            dir: 'rtl',
            langName: 'العربية (العراق)',
            headerRoads: 'إعدادات أزرار الطرق والقفل',
            headerSmartCopy: 'إعدادات النسخ الذكي',
            headerColoring: 'إعدادات تلوين التعديلات',
            roadTypeButtons: 'تفعيل أزرار الطرق',
            lockLevelButtons: 'تفعيل أزرار القفل (L1-L6)',
            smartCopyTitle: 'النسخ التلقائي للمعلومات',
            enableSmartCopy: 'تفعيل النسخ التلقائي (للجديد)',
            copyCountry: 'البلد / المحافظة',
            copyCity: 'المدينة',
            copyStreet: 'اسم الشارع',
            copyRoadType: 'نوع الطريق',
            copySpeed: 'السرعة',
            copyLock: 'القفل (Lock)',
            copyAltNames: 'الأسماء البديلة',
            copyOther: 'أخرى (المستوى، رسوم...)',
            coloringTitle: 'تلوين تاريخ التعديل (شامل)',
            coloringApply: 'تطبيق التلوين',
            coloringClear: 'مسح الألوان',
            daysLabel: 'يوم',
            older: 'أقدم',
            roadTypes: {
                Fw: 'طريق حرة', MH: 'سريع رئيسي', mH: 'سريع ثانوي', PS: 'شارع رئيسي', St: 'شارع',
                Rmp: 'منحدر', PR: 'طريق خاص', Pw: 'شارع ضيق', PLR: 'موقف', OR: 'غير معبد',
                RR: 'سكة حديد', RT: 'مدرج مطار'
            },
            locks: {
                L1: 'L 1', L2: 'L 2', L3: 'L 3', L4: 'L 4', L5: 'L 5', L6: 'L 6'
            }
        },
        'ckb': {
            dir: 'rtl',
            langName: 'کوردی (سۆرانی)',
            headerRoads: 'ڕێکخستنی دوگمەکانی ڕێگا',
            headerSmartCopy: 'ڕێکخستنی کۆپی زیرەک',
            headerColoring: 'ڕێکخستنی ڕەنگکردن',
            roadTypeButtons: 'چالاککردنی دوگمەکانی ڕێگا',
            lockLevelButtons: 'چالاککردنی دوگمەکانی قوفڵ (L1-L6)',
            smartCopyTitle: 'کۆپیکردنی زانیاری زیرەک',
            enableSmartCopy: 'چالاککردنی کۆپی (بۆ نوێ)',
            copyCountry: 'وڵات / پارێزگا',
            copyCity: 'شار',
            copyStreet: 'ناوی شەقام',
            copyRoadType: 'جۆری ڕێگا',
            copySpeed: 'خێرایی',
            copyLock: 'قوفڵ (Lock)',
            copyAltNames: 'ناوی جێگرەوە',
            copyOther: 'زانیارییەکانی تر',
            coloringTitle: 'ڕەنگکردنی مێژووی دەستکاری',
            coloringApply: 'جێبەجێکردن',
            coloringClear: 'پاککردنەوە',
            daysLabel: 'ڕۆژ',
            older: 'کۆنتر',
            roadTypes: {
                Fw: 'ڕێگای خێرا', MH: 'خێرای سەرەکی', mH: 'خێرای لاوەکی', PS: 'شەقامی سەرەکی', St: 'شەقام',
                Rmp: 'رامپ', PR: 'تایبەت', Pw: 'کۆڵان', PLR: 'پارکینگ', OR: 'ڕێگای خۆڵ',
                RR: 'هێڵی ئاسن', RT: 'فڕگە'
            },
            locks: {
                L1: 'L ١', L2: 'L ٢', L3: 'L ٣', L4: 'L ٤', L5: 'L ٥', L6: 'L ٦'
            }
        },
        'en': {
            dir: 'ltr',
            langName: 'English (US)',
            headerRoads: 'Road & Lock Buttons Settings',
            headerSmartCopy: 'Smart Copy Settings',
            headerColoring: 'Map Date Coloring Settings',
            roadTypeButtons: 'Road Type Buttons',
            lockLevelButtons: 'Quick Lock Buttons (L1-L6)',
            smartCopyTitle: 'Smart Info Copy',
            enableSmartCopy: 'Enable Auto-Copy (New Segs)',
            copyCountry: 'Country/State',
            copyCity: 'City',
            copyStreet: 'Street Name',
            copyRoadType: 'Road Type',
            copySpeed: 'Speed Limit',
            copyLock: 'Lock Level',
            copyAltNames: 'Alternate Names',
            copyOther: 'Others (Level, Toll...)',
            coloringTitle: 'Map Date Coloring (All)',
            coloringApply: 'Apply Colors',
            coloringClear: 'Clear',
            daysLabel: 'Days',
            older: 'Older',
            roadTypes: {
                Fw: 'Fw', MH: 'MH', mH: 'mH', PS: 'PS', St: 'St',
                Rmp: 'Rmp', PR: 'PR', Pw: 'Pw', PLR: 'PLR', OR: 'OR',
                RR: 'RR', RT: 'RT'
            },
            locks: {
                L1: 'L1', L2: 'L2', L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6'
            }
        }
    };

    // --- Main Logic ---
    async function runSuiteModules(argsObject) {

        const roadTypeDropdownSelector = 'div[class="road-type-select"]';
        const RENDER_ORDER = ['St', 'PS', 'mH', 'MH', 'Fw', 'Rmp', 'PLR', 'Pw', 'PR', 'OR', 'RT', 'RR'];

        const wmeRoadType = {
            ALLEY: 22, FERRY: 15, FREEWAY: 3, MAJOR_HIGHWAY: 6, MINOR_HIGHWAY: 7, OFF_ROAD: 8,
            PARKING_LOT_ROAD: 20, PEDESTRIAN_BOARDWALK: 10, PRIMARY_STREET: 2, PRIVATE_ROAD: 17,
            RAILROAD: 18, RAMP: 4, RUNWAY_TAXIWAY: 19, STAIRWAY: 16, STREET: 1, WALKING_TRAIL: 5, WALKWAY: 9
        };

        const roadTypeSettings = {
            Fw:  { id: wmeRoadType.FREEWAY,          wmeColor: '#bd5ab6' }, MH:  { id: wmeRoadType.MAJOR_HIGHWAY,    wmeColor: '#45b8d1' }, mH:  { id: wmeRoadType.MINOR_HIGHWAY,    wmeColor: '#69bf88' },
            PS:  { id: wmeRoadType.PRIMARY_STREET,   wmeColor: '#f0ea58' }, St:  { id: wmeRoadType.STREET,           wmeColor: '#ffffff' }, Rmp: { id: wmeRoadType.RAMP,             wmeColor: '#b0b0b0' },
            PR:  { id: wmeRoadType.PRIVATE_ROAD,     wmeColor: '#beba6c' }, Pw:  { id: wmeRoadType.ALLEY,            wmeColor: '#64799a' }, PLR: { id: wmeRoadType.PARKING_LOT_ROAD, wmeColor: '#ababab' },
            OR:  { id: wmeRoadType.OFF_ROAD,         wmeColor: '#867342' }, RR:  { id: wmeRoadType.RAILROAD,         wmeColor: '#c62925' }, RT:  { id: wmeRoadType.RUNWAY_TAXIWAY,   wmeColor: '#00ff00' }
        };

        const lockSettings = [
            { rank: 0, label: 'L1', color: '#ffffff', textColor: '#000', borderColor: '#ccc' },
            { rank: 1, label: 'L2', color: '#f0ea58', textColor: '#000', borderColor: '#d4ce46' },
            { rank: 2, label: 'L3', color: '#69bf88', textColor: '#000', borderColor: '#57a372' },
            { rank: 3, label: 'L4', color: '#45b8d1', textColor: '#000', borderColor: '#3aa0b8' },
            { rank: 4, label: 'L5', color: '#bd5ab6', textColor: '#fff', borderColor: '#a34d9d' },
            { rank: 5, label: 'L6', color: '#d50000', textColor: '#fff', borderColor: '#b71c1c' }
        ];

        // --- Coloring Configuration (Gradient Defaults) ---
        const colorRangesDef = [
            { id: '1d',  defaultDays: 1,     defaultColor: '#00ff00' },
            { id: '7d',  defaultDays: 7,     defaultColor: '#7fff00' },
            { id: '15d', defaultDays: 15,    defaultColor: '#ccff00' },
            { id: '30d', defaultDays: 30,    defaultColor: '#ffff00' },
            { id: '3m',  defaultDays: 90,    defaultColor: '#ffcc00' },
            { id: '6m',  defaultDays: 180,   defaultColor: '#ffa500' },
            { id: '1y',  defaultDays: 365,   defaultColor: '#ff4500' },
            { id: 'old', defaultDays: 99999, defaultColor: '#ff0000' }
        ];

        let _settings = {};
        let trans = UI_STRINGS['ar'];
        const processedSegments = new Set();

        function logDebug(message) { console.debug(SCRIPT_NAME + ':', message); }

        function loadSettingsFromStorage() {
            let loadedSettings = {};
            try {
                loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME)) || {};
            } catch(e) { console.error('Error loading settings', e); }

            const defaultSettings = {
                lastVersion: argsObject.scriptVersion,
                preferredLocale: 'ar',

                // --- Default UI State (Collapsed = true) ---
                ui_road_collapsed: true,
                ui_smartcopy_collapsed: true,
                ui_coloring_collapsed: true,

                // --- Default Feature Values ---
                roadButtons: true, // Enabled by default
                roadTypeButtons: [...RENDER_ORDER], // ALL types enabled by default
                lockButtons: true, // Enabled by default

                enableSmartCopy: true, // Enabled by default
                inheritCountry: true, inheritCity: true, inheritStreet: true,
                inheritRoadType: true, inheritSpeed: true, inheritLock: true,
                inheritAltNames: true, inheritOther: true, // ALL smart copy features enabled

                // Coloring Settings (Disabled by default)
                coloringEnabled: {},
                coloringColors: {},
                coloringDays: {},
                shortcuts: {}
            };

            // Init coloring defaults (Disabled by default per user request)
            colorRangesDef.forEach(r => {
                // IMPORTANT: Default is false for enabled
                if(defaultSettings.coloringEnabled[r.id] === undefined) defaultSettings.coloringEnabled[r.id] = false;
                if(defaultSettings.coloringColors[r.id] === undefined) defaultSettings.coloringColors[r.id] = r.defaultColor;
                if(defaultSettings.coloringDays[r.id] === undefined) defaultSettings.coloringDays[r.id] = r.defaultDays;
            });

            _settings = { ...defaultSettings, ...loadedSettings };

            // Deep merge logic
            _settings.coloringEnabled = { ...defaultSettings.coloringEnabled, ...(_settings.coloringEnabled || {}) };
            _settings.coloringColors = { ...defaultSettings.coloringColors, ...(_settings.coloringColors || {}) };
            _settings.coloringDays = { ...defaultSettings.coloringDays, ...(_settings.coloringDays || {}) };

            const langCode = _settings.preferredLocale || 'ar';
            trans = { ...UI_STRINGS['en'], ...UI_STRINGS[langCode] };
            if (!trans.dir) trans.dir = (langCode === 'en' ? 'ltr' : 'rtl');
        }

        function saveSettingsToStorage() {
            const settings = {
                lastVersion: argsObject.scriptVersion,
                preferredLocale: _settings.preferredLocale,

                // UI States
                ui_road_collapsed: _settings.ui_road_collapsed,
                ui_smartcopy_collapsed: _settings.ui_smartcopy_collapsed,
                ui_coloring_collapsed: _settings.ui_coloring_collapsed,

                roadButtons: _settings.roadButtons,
                roadTypeButtons: _settings.roadTypeButtons,
                lockButtons: _settings.lockButtons,
                enableSmartCopy: _settings.enableSmartCopy,
                inheritCountry: _settings.inheritCountry, inheritCity: _settings.inheritCity,
                inheritStreet: _settings.inheritStreet, inheritRoadType: _settings.inheritRoadType,
                inheritSpeed: _settings.inheritSpeed, inheritLock: _settings.inheritLock,
                inheritAltNames: _settings.inheritAltNames, inheritOther: _settings.inheritOther,
                coloringEnabled: _settings.coloringEnabled,
                coloringColors: _settings.coloringColors,
                coloringDays: _settings.coloringDays,
                shortcuts: {}
            };
            if(sdk && sdk.Shortcuts) {
                sdk.Shortcuts.getAllShortcuts().forEach(shortcut => { settings.shortcuts[shortcut.shortcutId] = shortcut.shortcutKeys; });
            }
            localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(settings));
        }

        // --- Smart Copy Logic ---
        function getNeighbors(id) {
            const a = sdk.DataModel.Segments.getConnectedSegments({ segmentId: id, reverseDirection: false }) || [];
            const b = sdk.DataModel.Segments.getConnectedSegments({ segmentId: id, reverseDirection: true }) || [];
            return [...a, ...b].map(s => s.id);
        }
        function isLikelyNew(id, seg) {
            if (typeof id === 'number' && id < 0) return true;
            if (typeof id === 'string' && /^tmp|^neg/i.test(id)) return true;
            if (seg?.isNew || seg?.isCreated) return true;
            const addr = sdk.DataModel.Segments.getAddress({ segmentId: id });
            return (!addr || addr.isEmpty === true);
        }
        function firstNeighborWithData(id) {
            const seen = new Set([id]); const q = [id]; let safetyCounter = 0; const MAX_SEARCH = 50;
            const hasData = (sid) => {
                try {
                    const a = sdk.DataModel.Segments.getAddress({ segmentId: sid });
                    if (a && !a.isEmpty) return true;
                    const s = sdk.DataModel.Segments.getById({ segmentId: sid });
                    return (s && s.roadType);
                } catch { return false; }
            };
            while (q.length) {
                if (safetyCounter++ > MAX_SEARCH) break;
                const cur = q.shift(); const ns = getNeighbors(cur);
                const donorId = ns.find(hasData);
                if (donorId) return donorId;
                ns.forEach(n => { if (!seen.has(n)) { seen.add(n); q.push(n); } });
            }
            return null;
        }
        function getOrCreateStreet(streetName, cityId) {
            return sdk.DataModel.Streets.getStreet({ streetName, cityId }) || sdk.DataModel.Streets.addStreet({ streetName, cityId });
        }
        function executeSmartCopy(id) {
            const donorId = firstNeighborWithData(id);
            if (!donorId) return false;
            const targetSeg = sdk.DataModel.Segments.getById({ segmentId: id });
            const donorSeg = sdk.DataModel.Segments.getById({ segmentId: donorId });
            const targetAddr = sdk.DataModel.Segments.getAddress({ segmentId: id });
            const donorAddr = sdk.DataModel.Segments.getAddress({ segmentId: donorId });
            let somethingChanged = false;

            if (_settings.inheritCountry || _settings.inheritCity || _settings.inheritStreet) {
                const wantCountry = _settings.inheritCountry;
                const wantCity = _settings.inheritCity;
                const wantStreet = _settings.inheritStreet;
                const curCityId = targetAddr?.city?.id ?? null;
                const curStreetName = targetAddr?.street?.name;

                if (curCityId == null || (wantStreet && !curStreetName)) {
                    const cityProps = {
                        cityName: (wantCity && donorAddr.city && !donorAddr.city.isEmpty) ? donorAddr.city.name : (targetAddr.city?.name ?? ''),
                        stateId:  (wantCountry && donorAddr.state)   ? donorAddr.state.id   : (targetAddr.state?.id   ?? undefined),
                        countryId:(wantCountry && donorAddr.country) ? donorAddr.country.id : (targetAddr.country?.id ?? undefined)
                    };
                    if (!wantCity && wantCountry) cityProps.cityName = '';
                    let cityId = sdk.DataModel.Cities.getCity(cityProps)?.id;
                    if (cityId == null) cityId = sdk.DataModel.Cities.addCity(cityProps).id;
                    const streetName = (wantStreet && donorAddr?.street?.name) ? donorAddr.street.name : (targetAddr.street?.name ?? '');
                    const primaryStreetId = getOrCreateStreet(streetName, cityId).id;
                    try { sdk.DataModel.Segments.updateAddress({ segmentId: id, primaryStreetId }); somethingChanged = true; } catch (e) { console.error('Addr copy fail', e); }
                }
            }
            if (_settings.inheritRoadType && targetSeg.roadType !== donorSeg.roadType) { sdk.DataModel.Segments.updateSegment({ segmentId: id, roadType: donorSeg.roadType }); somethingChanged = true; }
            if (_settings.inheritSpeed) {
                const upd = { segmentId: id }; let sc = false;
                if (donorSeg.fwdSpeedLimit && !targetSeg.fwdSpeedLimit) { upd.fwdSpeedLimit = donorSeg.fwdSpeedLimit; sc = true; }
                if (donorSeg.revSpeedLimit && !targetSeg.revSpeedLimit) { upd.revSpeedLimit = donorSeg.revSpeedLimit; sc = true; }
                if (sc) { sdk.DataModel.Segments.updateSegment(upd); somethingChanged = true; }
            }
            if (_settings.inheritLock) {
                const dLock = (donorSeg.lockRank || 0); const tLock = (targetSeg.lockRank || 0);
                if (tLock < dLock) { sdk.DataModel.Segments.updateSegment({ segmentId: id, lockRank: dLock }); somethingChanged = true; }
            }
            if (_settings.inheritAltNames) {
                try {
                    const donorAlts = donorSeg.alternateStreetIds || [];
                    if (donorAlts.length > 0) { sdk.DataModel.Segments.updateSegment({ segmentId: id, alternateStreetIds: donorAlts }); somethingChanged = true; }
                } catch (e) {}
            }
            if (_settings.inheritOther) {
                const upd = { segmentId: id }; let sc = false;
                if (donorSeg.level !== targetSeg.level) { upd.level = donorSeg.level; sc = true; }
                if (donorSeg.isToll !== targetSeg.isToll) { upd.isToll = donorSeg.isToll; sc = true; }
                if (sc) { sdk.DataModel.Segments.updateSegment(upd); somethingChanged = true; }
            }
            return somethingChanged;
        }

        function runSmartCopyLogic() {
            if (!_settings.enableSmartCopy) return;
            const sel = sdk.Editing.getSelection();
            if (!sel || sel.objectType !== 'segment' || !sel.ids.length) return;
            sel.ids.forEach(id => {
                if (processedSegments.has(id)) return;
                const seg = sdk.DataModel.Segments.getById({ segmentId: id });
                if (!seg) return;
                if (isLikelyNew(id, seg)) { if (executeSmartCopy(id)) processedSegments.add(id); }
            });
        }

        // --- Coloring Logic ---
        function applyMapColoring() {
            if (!highlightLayer) {
                highlightLayer = new OpenLayers.Layer.Vector("Abdullah_Gradient_Layer", {
                    displayInLayerSwitcher: true,
                    uniqueName: "Abdullah_Gradient_Layer"
                });
                W.map.addLayer(highlightLayer);
            }
            highlightLayer.removeAllFeatures();

            let activeRanges = [];
            colorRangesDef.forEach(r => {
                if (_settings.coloringEnabled[r.id]) {
                    activeRanges.push({
                        days: parseInt(_settings.coloringDays[r.id] || r.defaultDays),
                        color: _settings.coloringColors[r.id] || r.defaultColor
                    });
                }
            });
            activeRanges.sort((a, b) => a.days - b.days);

            if (activeRanges.length === 0) {
                alert(trans.coloringTitle + ': يرجى تفعيل فترة زمنية واحدة على الأقل.');
                return;
            }

            let allObjects = [];
            if(W.model.segments) allObjects.push(...W.model.segments.getObjectArray());
            if(W.model.venues) allObjects.push(...W.model.venues.getObjectArray());

            const featuresToAdd = [];
            const now = Date.now();

            allObjects.forEach(obj => {
                if (!obj.geometry || !obj.attributes || typeof obj.attributes.updatedOn === 'undefined') return;

                const updatedOn = obj.attributes.updatedOn;
                const diffDays = (now - updatedOn) / (1000 * 60 * 60 * 24);

                let selectedColor = null;
                for (let i = 0; i < activeRanges.length; i++) {
                    const range = activeRanges[i];
                    if (diffDays <= range.days) {
                        selectedColor = range.color;
                        break;
                    }
                }

                if (selectedColor) {
                    let style = {};
                    if(obj.geometry.CLASS_NAME.indexOf('LineString') !== -1) {
                         style = { strokeColor: selectedColor, strokeOpacity: 0.7, strokeWidth: 6, strokeLinecap: "round" };
                    } else {
                         style = { fillColor: selectedColor, fillOpacity: 0.4, strokeColor: selectedColor, strokeWidth: 2, pointRadius: 10 };
                    }
                    const feature = new OpenLayers.Feature.Vector(obj.geometry.clone(), {}, style);
                    featuresToAdd.push(feature);
                }
            });

            if (featuresToAdd.length > 0) {
                highlightLayer.addFeatures(featuresToAdd);
                console.log(`AA Suite: Colored ${featuresToAdd.length} objects.`);
            }
        }

        function clearMapColoring() {
            if (highlightLayer) highlightLayer.removeAllFeatures();
        }

        // --- Buttons Logic ---
        function onRoadTypeButtonClick(roadType) {
            const selection = sdk.Editing.getSelection();
            selection?.ids.forEach(segmentId => {
                if (sdk.DataModel.Segments.getById({ segmentId }).roadType !== roadType) {
                    sdk.DataModel.Segments.updateSegment({ segmentId, roadType });
                }
            });
        }

        function onLockButtonClick(rank) {
            const selection = sdk.Editing.getSelection();
            selection?.ids.forEach(segmentId => {
                const seg = sdk.DataModel.Segments.getById({ segmentId });
                if (seg.lockRank !== rank) {
                    sdk.DataModel.Segments.updateSegment({ segmentId, lockRank: rank });
                }
            });
        }

        function addButtonsToPanel() {
            $('#csRoadTypeButtonsContainer').remove();
            $('#csLockButtonsContainer').remove();

            const selection = sdk.Editing.getSelection();
            if (selection?.objectType !== 'segment') return;
            const $dropDown = $(roadTypeDropdownSelector);
            if (!$dropDown.length) return;

            const $parentContainer = $dropDown.parent();

            if (_settings.roadButtons) {
                const $container = $('<div>', { id: 'csRoadTypeButtonsContainer', class: 'cs-rt-buttons-container' });
                const $group = $('<div>', { class: 'cs-rt-buttons-group' });
                RENDER_ORDER.forEach(roadTypeKey => {
                    if (_settings.roadTypeButtons.includes(roadTypeKey)) {
                        const roadTypeSetting = roadTypeSettings[roadTypeKey];
                        $group.append(
                            $('<div>', {
                                class: `btn cs-rt-button cs-rt-button-${roadTypeKey} btn-positive`,
                                title: I18n.t('segment.road_types')[roadTypeSetting.id]
                            })
                            .text(trans.roadTypes[roadTypeKey] || roadTypeKey)
                            .data('rtId', roadTypeSetting.id)
                            .click(function() { onRoadTypeButtonClick($(this).data('rtId')); })
                        );
                    }
                });
                $container.append($group);
                $parentContainer.prepend($container);
            }

            if (_settings.lockButtons) {
                const $lockContainer = $('<div>', { id: 'csLockButtonsContainer', class: 'cs-lock-buttons-container' });
                const $lockGroup = $('<div>', { class: 'cs-lock-buttons-group' });
                lockSettings.forEach(lock => {
                    $lockGroup.append(
                        $('<div>', {
                            class: 'btn cs-lock-button btn-positive',
                            style: `background-color:${lock.color} !important; color:${lock.textColor} !important; border-color:${lock.borderColor} !important;`,
                            title: `Lock Level ${lock.rank + 1}`
                        })
                        .text(trans.locks[`L${lock.rank + 1}`] || (lock.rank + 1))
                        .data('rank', lock.rank)
                        .click(function() { onLockButtonClick($(this).data('rank')); })
                    );
                });
                $lockContainer.append($lockGroup);
                if ($('#csRoadTypeButtonsContainer').length) { $('#csRoadTypeButtonsContainer').after($lockContainer); } else { $parentContainer.prepend($lockContainer); }
            }
        }

        // --- Styles ---
        function shadeColor2(color, percent) {
            const f = parseInt(color.slice(1), 16);
            const t = percent < 0 ? 0 : 255;
            const p = percent < 0 ? percent * -1 : percent;
            const R = f >> 16;
            const G = f >> 8 & 0x00FF;
            const B = f & 0x0000FF;
            return `#${(0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)}`;
        }

        function injectCss() {
            let css = [
                '.csRoadTypeButtonsCheckBoxContainer {margin-left:15px;}',
                '.cs-rt-buttons-container {margin-bottom:5px;}',
                '.cs-rt-buttons-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; }',
                '.cs-lock-buttons-container {margin-bottom:5px;}',
                '.cs-lock-buttons-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; }',
                '.cs-rt-buttons-container .cs-rt-button {font-size:10px; font-weight: bold; line-height:22px; color:black; padding:0 2px; height:24px; text-align: center; margin: 0; border:1px solid; border-radius: 4px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}',
                '.cs-lock-button { font-size:10px; font-weight: bold; line-height:16px; padding:0; height:18px; text-align: center; margin: 0; border:1px solid transparent; border-radius: 4px;}',
                '.cs-lock-button:hover { filter: brightness(0.9); }',
                '.btn.cs-rt-button:active, .btn.cs-lock-button:active {box-shadow:none;transform:translateY(2px)}',
                '#sidepanel-clicksaver .controls-container {padding:0px;}',
                '#sidepanel-clicksaver .controls-container label {white-space: normal;}',
                '#sidepanel-clicksaver {font-size:13px;}',
                '.scf-details {margin-left: 15px; margin-top: 5px;}',
                '.coloring-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; width: 100%; background: #f8f9fa; padding: 4px; border-radius: 5px; border: 1px solid #eee; }',
                '.coloring-row input[type="color"] { width: 35px; height: 25px; padding: 0; border: none; cursor: pointer; border-radius: 3px; }',
                '.coloring-row input[type="number"] { width: 50px; font-size: 11px; padding: 3px; border: 1px solid #ccc; border-radius: 3px; text-align: center; margin: 0 5px; }',
                '.coloring-row label { flex-grow: 1; margin: 0 5px; font-size: 11px; color: #333; }',
                '.coloring-actions { display: flex; gap: 5px; margin-top: 10px; }',
                '.coloring-btn { flex: 1; padding: 8px; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: bold; font-size: 12px; box-shadow: 0 2px 2px rgba(0,0,0,0.1); }',
                '.coloring-btn:hover { opacity: 0.9; }',

                /* Accordion CSS */
                '.cs-accordion { margin-bottom: 10px; border: 1px solid #e0e0e0; border-radius: 5px; overflow: hidden; }',
                '.cs-accordion-header { background: #f0f0f0; padding: 10px; cursor: pointer; font-weight: bold; font-size: 12px; display: flex; justify-content: space-between; align-items: center; user-select: none; }',
                '.cs-accordion-header:hover { background: #e0e0e0; }',
                '.cs-accordion-content { padding: 10px; display: block; border-top: 1px solid #e0e0e0; background: #fff; }',
                '.cs-accordion-content.collapsed { display: none; }',
                '.cs-accordion-arrow { transition: transform 0.2s; }',
                '.cs-accordion-arrow.collapsed { transform: rotate(-90deg); }'
            ];

            Object.keys(roadTypeSettings).forEach(roadTypeAbbr => {
                const roadType = roadTypeSettings[roadTypeAbbr];
                const bgColor = roadType.wmeColor;
                css.push(`.cs-rt-buttons-container .cs-rt-button-${roadTypeAbbr} {background-color:${bgColor} !important; color: black !important; border-color:${shadeColor2(bgColor, -0.15)};}`);
                css.push(`.cs-rt-buttons-container .cs-rt-button-${roadTypeAbbr}:hover {background-color:${shadeColor2(bgColor, 0.2)} !important;}`);
            });

            $(`<style type="text/css">${css.join(' ')}</style>`).appendTo('head');
        }

        // --- Settings UI Helper ---
        function createSettingsCheckbox(id, settingName, labelText, titleText, divCss, labelCss, optionalAttributes) {
            const $container = $('<div>', { class: 'controls-container' });
            let isChecked = false;
            if (settingName === 'roadType') {
                const rt = optionalAttributes && optionalAttributes['data-road-type'];
                if (rt && _settings.roadTypeButtons.includes(rt)) isChecked = true;
            } else {
                if (_settings[settingName] === true) isChecked = true;
            }
            const $input = $('<input>', { type: 'checkbox', class: 'csSettingsControl', name: id, id, 'data-setting-name': settingName, checked: isChecked }).appendTo($container);
            const $label = $('<label>', { for: id }).text(labelText).appendTo($container);
            if (divCss) $container.css(divCss);
            if (optionalAttributes) $input.attr(optionalAttributes);
            return $container;
        }

        function createAccordion(title, contentElem, isCollapsed, toggleCallback) {
            const $acc = $('<div>', { class: 'cs-accordion' });
            const $header = $('<div>', { class: 'cs-accordion-header' });
            const $arrow = $('<span>', { class: 'cs-accordion-arrow ' + (isCollapsed ? 'collapsed' : '') }).text('▼');

            $header.text(title).append($arrow);

            const $content = $('<div>', { class: 'cs-accordion-content ' + (isCollapsed ? 'collapsed' : '') }).append(contentElem);

            $header.click(function() {
                const wasCollapsed = $content.hasClass('collapsed');
                if (wasCollapsed) {
                    $content.removeClass('collapsed');
                    $arrow.removeClass('collapsed');
                } else {
                    $content.addClass('collapsed');
                    $arrow.addClass('collapsed');
                }
                if (toggleCallback) toggleCallback(!wasCollapsed); // Pass new collapsed state
            });

            $acc.append($header, $content);
            return $acc;
        }

        async function initUserPanel() {
            const $panel = $('<div>', { id: 'sidepanel-clicksaver' });

            // 1. Language Selector
            const $langDiv = $('<div>', { class: 'side-panel-section', style: 'margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;' });
            const $langSelect = $('<select>', { id: 'aaSuiteLanguageSelector', style: 'width: 100%; padding: 5px; border-radius: 5px; border: 1px solid #ccc;' });
            $langSelect.append($('<option>', { value: 'ar', text: 'العربية - العراق' }), $('<option>', { value: 'ckb', text: 'کوردی - سۆرانی' }), $('<option>', { value: 'en', text: 'English - USA' }));
            $langSelect.val(_settings.preferredLocale || 'ar');
            $langSelect.change(function() {
                _settings.preferredLocale = $(this).val();
                saveSettingsToStorage();
                if(confirm('تغيير اللغة يتطلب تحديث الصفحة. هل تريد التحديث الآن؟')) location.reload();
            });
            $langDiv.append($langSelect);
            $panel.append($langDiv);

            // --- SECTION 1: Road & Lock Buttons ---
            const $roadContent = $('<div>');
            const $roadTypesDiv = $('<div>', { class: 'csRoadTypeButtonsCheckBoxContainer' });
            if(!_settings.roadButtons) $roadTypesDiv.hide();
            RENDER_ORDER.forEach(rt => {
                $roadTypesDiv.append(createSettingsCheckbox(`cs${rt}CheckBox`, 'roadType', trans.roadTypes[rt] || rt, null, null, null, { 'data-road-type': rt }));
            });

            $roadContent.append(
                $('<div>').append(createSettingsCheckbox('csRoadTypeButtonsCheckBox', 'roadButtons', trans.roadTypeButtons)).append($roadTypesDiv),
                createSettingsCheckbox('csLockButtonsCheckBox', 'lockButtons', trans.lockLevelButtons, null, {marginTop:'10px'})
            );

            const $roadAccordion = createAccordion(trans.headerRoads, $roadContent, _settings.ui_road_collapsed, (newState) => {
                _settings.ui_road_collapsed = newState;
                saveSettingsToStorage();
            });
            $panel.append($roadAccordion);


            // --- SECTION 2: Smart Copy ---
            const $smartContent = $('<div>');
            $smartContent.append(createSettingsCheckbox('scfEnableCheckBox', 'enableSmartCopy', trans.enableSmartCopy));
            const $scfDetails = $('<div>', { class: 'scf-details' });
            if(!_settings.enableSmartCopy) $scfDetails.hide();
            $scfDetails.append(
                createSettingsCheckbox('scfInheritCountryCheckBox', 'inheritCountry', trans.copyCountry),
                createSettingsCheckbox('scfInheritCityCheckBox', 'inheritCity', trans.copyCity),
                createSettingsCheckbox('scfInheritStreetCheckBox', 'inheritStreet', trans.copyStreet),
                createSettingsCheckbox('scfInheritRoadTypeCheckBox', 'inheritRoadType', trans.copyRoadType),
                createSettingsCheckbox('scfInheritSpeedCheckBox', 'inheritSpeed', trans.copySpeed),
                createSettingsCheckbox('scfInheritLockCheckBox', 'inheritLock', trans.copyLock),
                createSettingsCheckbox('scfInheritAltNamesCheckBox', 'inheritAltNames', trans.copyAltNames),
                createSettingsCheckbox('scfInheritOtherCheckBox', 'inheritOther', trans.copyOther)
            );
            $smartContent.append($scfDetails);

            const $smartAccordion = createAccordion(trans.headerSmartCopy, $smartContent, _settings.ui_smartcopy_collapsed, (newState) => {
                _settings.ui_smartcopy_collapsed = newState;
                saveSettingsToStorage();
            });
            $panel.append($smartAccordion);


            // --- SECTION 3: Coloring ---
            const $coloringContent = $('<div>');
            colorRangesDef.forEach(range => {
                const rowId = `cr-${range.id}`;
                const $row = $('<div>', { class: 'coloring-row' });
                const $chk = $('<input>', { type: 'checkbox', id: `${rowId}-chk`, checked: _settings.coloringEnabled[range.id] }).change(function() {
                    _settings.coloringEnabled[range.id] = this.checked;
                    saveSettingsToStorage();
                });
                const $daysInput = $('<input>', { type: 'number', min: '1', max: '99999', value: _settings.coloringDays[range.id] }).change(function() {
                    _settings.coloringDays[range.id] = parseInt(this.value);
                    saveSettingsToStorage();
                });
                const $lbl = $('<span >', { style: 'font-size:10px; margin:0 5px; flex-grow:1;' }).text(trans.daysLabel);
                const $clr = $('<input>', { type: 'color', value: _settings.coloringColors[range.id] }).change(function() {
                    _settings.coloringColors[range.id] = this.value;
                    saveSettingsToStorage();
                });
                $row.append($chk, $daysInput, $lbl, $clr);
                $coloringContent.append($row);
            });
            const $actions = $('<div>', { class: 'coloring-actions' });
            $actions.append(
                $('<button>', { class: 'coloring-btn', style: 'background-color:#2ecc71;' }).text(trans.coloringApply).click(applyMapColoring),
                $('<button>', { class: 'coloring-btn', style: 'background-color:#e74c3c;' }).text(trans.coloringClear).click(clearMapColoring)
            );
            $coloringContent.append($actions);

            const $coloringAccordion = createAccordion(trans.headerColoring, $coloringContent, _settings.ui_coloring_collapsed, (newState) => {
                _settings.ui_coloring_collapsed = newState;
                saveSettingsToStorage();
            });
            $panel.append($coloringAccordion);


            // Footer
            $panel.append($('<div>', { style: 'margin-top:20px;font-size:10px;color:#999999;' }).append($('<div>').text(`v. ${argsObject.scriptVersion}`)));
            const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
            $(tabLabel).text('Abdullah Abbas WME Suite');
            $(tabPane).append($panel);
            $(tabPane).parent().css({ 'padding-top': '0px', 'padding-left': '8px' });

            // UI Logic bindings
            $('#csRoadTypeButtonsCheckBox').change(function() { $('.csRoadTypeButtonsCheckBoxContainer').toggle(this.checked); _settings.roadButtons = this.checked; addButtonsToPanel(); saveSettingsToStorage(); });
            $('#csLockButtonsCheckBox').change(function() { _settings.lockButtons = this.checked; addButtonsToPanel(); saveSettingsToStorage(); });
            $('#scfEnableCheckBox').change(function() { $('.scf-details').toggle(this.checked); _settings.enableSmartCopy = this.checked; saveSettingsToStorage(); });

            $('.csSettingsControl').change(function() {
                const { checked } = this; const $this = $(this); const settingName = $this.data('setting-name');
                if (settingName === 'roadType') {
                    const roadType = $this.data('road-type'); const array = _settings.roadTypeButtons; const index = array.indexOf(roadType);
                    if (checked && index === -1) array.push(roadType); else if (!checked && index !== -1) array.splice(index, 1);
                } else if (settingName && !['roadButtons', 'enableSmartCopy', 'lockButtons'].includes(settingName)) { _settings[settingName] = checked; }
                saveSettingsToStorage(); if(settingName === 'roadType') addButtonsToPanel();
            });
        }

        async function init() {
            logDebug('Initializing AA Suite...');
            loadSettingsFromStorage();
            injectCss();
            sdk.Events.trackDataModelEvents({ dataModelName: 'segments' });
            sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: addButtonsToPanel });
            sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: runSmartCopyLogic });
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const addedNode = mutation.addedNodes[i];
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.querySelector(roadTypeDropdownSelector)) { addButtonsToPanel(); }
                    }
                });
            });
            const editPanel = document.getElementById('edit-panel');
            if (editPanel) observer.observe(editPanel, { childList: true, subtree: true });

            await initUserPanel();
            window.addEventListener('beforeunload', saveSettingsToStorage, false);
            if (_settings.roadButtons) addButtonsToPanel();
        }

        try { init(); } catch(e) { console.error(SCRIPT_NAME + ' init failed:', e); }
    }

    function skipLoginDialog(tries = 0) {
        if (sdk || tries === 1000) return;
        if ($('wz-button.do-login').length) { $('wz-button.do-login').click(); return; }
        setTimeout(skipLoginDialog, 100, ++tries);
    }

    async function mainStart() {
        skipLoginDialog();
        try {
            sdk = await bootstrap({ scriptUpdateMonitor: { downloadUrl: DOWNLOAD_URL } });
            const args = { scriptName: SCRIPT_NAME, scriptVersion: SCRIPT_VERSION, forumUrl: '' };
            if (document.readyState === 'complete' || document.readyState === 'interactive') { runSuiteModules(args); } else { $(document).ready(() => { runSuiteModules(args); }); }
        } catch(err) { console.error('Abdullah Abbas WME Suite: Bootstrap failed', err); }
    }

    mainStart();
})();