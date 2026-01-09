// ==UserScript==
// @name            Abdullah Abbas WME Suite
// @namespace       https://greasyfork.org/users/AbdullahAbbas
// @version         2026.01.09.29
// @description     مجموعة أدوات عبد الله عباس (أزرار الطرق + النسخ الذكي + أزرار القفل + تحديد متقدم).
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
    const SETTINGS_STORE_NAME = 'AbdullahAbbas_WME_Suite_Settings_V3';
    let sdk;

    // --- Localization ---
    const UI_STRINGS = {
        'ar': {
            dir: 'rtl',
            langName: 'العربية (العراق)',
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
            // Advanced Selection - Arabic Only
            advSelectTitle: 'تحديد متقدم',
            btnSelect: 'تحديد',
            btnClear: 'إلغاء التحديد',
            lblCriteria: 'معيار التحديد:',
            optNoCity: 'بدون مدينة',
            optNoSpeed: 'بدون سرعة',
            optLock: 'مستوى القفل',
            optType: 'نوع الطريق',
            lblValue: 'القيمة:',
            msgSelected: 'تم تحديد',
            msgNoMatch: 'لم يتم العثور على عناصر مطابقة',
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
            // Advanced Selection - Kurdish Only
            advSelectTitle: 'دیاریکردنی پێشکەوتوو',
            btnSelect: 'دیاریکردن',
            btnClear: 'لادانی دیاریکردن',
            lblCriteria: 'پێوەر:',
            optNoCity: 'بێ شار',
            optNoSpeed: 'بێ خێرایی',
            optLock: 'ئاستی قوفڵ',
            optType: 'جۆری ڕێگا',
            lblValue: 'نرخ:',
            msgSelected: 'دیاریکرا',
            msgNoMatch: 'هیچ نەدۆزرایەوە',
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
            // Advanced Selection
            advSelectTitle: 'Advanced Selection',
            btnSelect: 'Select',
            btnClear: 'Deselect',
            lblCriteria: 'Criteria:',
            optNoCity: 'No City (Ghost)',
            optNoSpeed: 'No Speed Limit',
            optLock: 'Lock Level',
            optType: 'Road Type',
            lblValue: 'Value:',
            msgSelected: 'Selected',
            msgNoMatch: 'No matches found',
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

        // Road Types Configuration
        const wmeRoadType = {
            ALLEY: 22, FERRY: 15, FREEWAY: 3, MAJOR_HIGHWAY: 6, MINOR_HIGHWAY: 7, OFF_ROAD: 8,
            PARKING_LOT_ROAD: 20, PEDESTRIAN_BOARDWALK: 10, PRIMARY_STREET: 2, PRIVATE_ROAD: 17,
            RAILROAD: 18, RAMP: 4, RUNWAY_TAXIWAY: 19, STAIRWAY: 16, STREET: 1, WALKING_TRAIL: 5, WALKWAY: 9
        };

        const RENDER_ORDER = ['St', 'PS', 'mH', 'MH', 'Fw', 'Rmp', 'PLR', 'Pw', 'PR', 'OR', 'RT', 'RR'];

        const roadTypeSettings = {
            Fw:  { id: wmeRoadType.FREEWAY,          wmeColor: '#bd5ab6', category: 'highways' },
            MH:  { id: wmeRoadType.MAJOR_HIGHWAY,    wmeColor: '#45b8d1', category: 'highways' },
            mH:  { id: wmeRoadType.MINOR_HIGHWAY,    wmeColor: '#69bf88', category: 'highways' },
            PS:  { id: wmeRoadType.PRIMARY_STREET,   wmeColor: '#f0ea58', category: 'streets' },
            St:  { id: wmeRoadType.STREET,           wmeColor: '#ffffff', category: 'streets' },
            Rmp: { id: wmeRoadType.RAMP,             wmeColor: '#b0b0b0', category: 'highways' },
            PR:  { id: wmeRoadType.PRIVATE_ROAD,     wmeColor: '#beba6c', category: 'otherDrivable' },
            Pw:  { id: wmeRoadType.ALLEY,            wmeColor: '#64799a', category: 'streets' },
            PLR: { id: wmeRoadType.PARKING_LOT_ROAD, wmeColor: '#ababab', category: 'otherDrivable' },
            OR:  { id: wmeRoadType.OFF_ROAD,         wmeColor: '#867342', category: 'otherDrivable' },
            RR:  { id: wmeRoadType.RAILROAD,         wmeColor: '#c62925', category: 'nonDrivable' },
            RT:  { id: wmeRoadType.RUNWAY_TAXIWAY,   wmeColor: '#00ff00', category: 'nonDrivable' }
        };

        // --- Lock Buttons Configuration ---
        const lockSettings = [
            { rank: 0, label: 'L1', color: '#ffffff', textColor: '#000', borderColor: '#ccc' },
            { rank: 1, label: 'L2', color: '#f0ea58', textColor: '#000', borderColor: '#d4ce46' },
            { rank: 2, label: 'L3', color: '#69bf88', textColor: '#000', borderColor: '#57a372' },
            { rank: 3, label: 'L4', color: '#45b8d1', textColor: '#000', borderColor: '#3aa0b8' },
            { rank: 4, label: 'L5', color: '#bd5ab6', textColor: '#fff', borderColor: '#a34d9d' },
            { rank: 5, label: 'L6', color: '#d50000', textColor: '#fff', borderColor: '#b71c1c' }
        ];

        let _settings = {};
        let trans = UI_STRINGS['ar'];
        const processedSegments = new Set();

        function logDebug(message) { console.debug(SCRIPT_NAME + ':', message); }

        function loadSettingsFromStorage() {
            let loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));
            const defaultSettings = {
                lastVersion: argsObject.scriptVersion,
                preferredLocale: 'ar',
                roadButtons: true,
                roadTypeButtons: ['MH', 'mH', 'PS', 'St', 'Rmp'],
                lockButtons: true,
                enableSmartCopy: true,
                inheritCountry: true, inheritCity: true, inheritStreet: false,
                inheritRoadType: false, inheritSpeed: false, inheritLock: false,
                inheritAltNames: false, inheritOther: false,
                shortcuts: {}
            };
            _settings = { ...defaultSettings, ...loadedSettings };
            const langCode = _settings.preferredLocale || 'ar';
            trans = { ...UI_STRINGS['en'], ...UI_STRINGS[langCode] };
            if (!trans.dir) trans.dir = (langCode === 'en' ? 'ltr' : 'rtl');
        }

        function saveSettingsToStorage() {
            const settings = {
                lastVersion: argsObject.scriptVersion,
                preferredLocale: _settings.preferredLocale,
                roadButtons: _settings.roadButtons,
                roadTypeButtons: _settings.roadTypeButtons,
                lockButtons: _settings.lockButtons,
                enableSmartCopy: _settings.enableSmartCopy,
                inheritCountry: _settings.inheritCountry, inheritCity: _settings.inheritCity,
                inheritStreet: _settings.inheritStreet, inheritRoadType: _settings.inheritRoadType,
                inheritSpeed: _settings.inheritSpeed, inheritLock: _settings.inheritLock,
                inheritAltNames: _settings.inheritAltNames, inheritOther: _settings.inheritOther,
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

        // --- Advanced Selection Logic (NATIVE WME IMPLEMENTATION) ---
        function performAdvancedSelection() {
            if (typeof W === 'undefined' || !W.map || !W.model) return;

            const criteria = $('#aaAdvCriteria').val();
            const lockValue = $('#aaAdvLockVal').val();
            const typeValue = $('#aaAdvTypeVal').val();

            // Native Extent
            const extent = W.map.getExtent();
            let objectsToSelect = [];

            // Iterate using Native WME Model
            const segments = W.model.segments.getObjectArray();

            segments.forEach(seg => {
                // Check if segment is fully loaded and has geometry
                if (!seg.geometry) return;

                // Visible in current map view?
                if (!extent.intersectsBounds(seg.geometry.getBounds())) return;

                const attr = seg.attributes;
                let match = false;

                if (criteria === 'no_city') {
                    // Check primary street
                    const streetId = attr.primaryStreetID;
                    if (streetId) {
                        const street = W.model.streets.objects[streetId];
                        if (street) {
                            if (!street.attributes.cityID) {
                                match = true; // Street has no city ID
                            } else {
                                const city = W.model.cities.objects[street.attributes.cityID];
                                if (!city || !city.attributes.name || city.attributes.name.trim() === '') {
                                    match = true; // City object exists but name is empty
                                }
                            }
                        }
                    } else {
                         match = true; // No street assigned
                    }
                }
                else if (criteria === 'no_speed') {
                    // Driveable roads only (exclude walking trails etc)
                    const driveable = [1, 2, 3, 4, 6, 7, 8, 17, 20, 22];
                    if (driveable.includes(attr.roadType)) {
                        const fwd = attr.fwdMaxSpeed;
                        const rev = attr.revMaxSpeed;
                        // In WME, null or 0 means no speed verified
                        if ((fwd === null || fwd === 0) && (rev === null || rev === 0)) {
                            match = true;
                        }
                    }
                }
                else if (criteria === 'lock') {
                    // lockRank is 0-based in Model, but 1-based in UI
                    const reqRank = parseInt(lockValue) - 1;
                    if ((attr.lockRank || 0) === reqRank) match = true;
                }
                else if (criteria === 'type') {
                    if (attr.roadType === parseInt(typeValue)) match = true;
                }

                if (match) objectsToSelect.push(seg);
            });

            // Native Select
            if (objectsToSelect.length > 0) {
                W.selectionManager.setSelectedModels(objectsToSelect);
                console.log(SCRIPT_NAME + ': ' + trans.msgSelected + ': ' + objectsToSelect.length);
            } else {
                alert(trans.msgNoMatch);
            }
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

            // 1. Road Types
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

            // 2. Lock Buttons
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

                if ($('#csRoadTypeButtonsContainer').length) {
                    $('#csRoadTypeButtonsContainer').after($lockContainer);
                } else {
                    $parentContainer.prepend($lockContainer);
                }
            }
        }

        // --- Styles & Helpers ---
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
                '.cs-group-label {font-size: 11px; width: 100%; font-family: Poppins, sans-serif; text-transform: uppercase; font-weight: 700; color: #354148; margin-bottom: 6px; margin-top: 15px;}',
                '.scf-details {margin-left: 15px; margin-top: 5px;}',
                // Added for Advanced Selection Inputs
                '.aa-input { width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 12px; }'
            ];

            // Build RT Colors
            Object.keys(roadTypeSettings).forEach(roadTypeAbbr => {
                const roadType = roadTypeSettings[roadTypeAbbr];
                const bgColor = roadType.wmeColor;
                css.push(`.cs-rt-buttons-container .cs-rt-button-${roadTypeAbbr} {background-color:${bgColor} !important; color: black !important; border-color:${shadeColor2(bgColor, -0.15)};}`);
                css.push(`.cs-rt-buttons-container .cs-rt-button-${roadTypeAbbr}:hover {background-color:${shadeColor2(bgColor, 0.2)} !important;}`);
            });

            $(`<style type="text/css">${css.join(' ')}</style>`).appendTo('head');
        }

        // --- Settings UI ---
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

        async function initUserPanel() {
            const $panel = $('<div>', { id: 'sidepanel-clicksaver' });
            // Lang
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

            // Buttons
            const $roadTypesDiv = $('<div>', { class: 'csRoadTypeButtonsCheckBoxContainer' });
            if(!_settings.roadButtons) $roadTypesDiv.hide();
            RENDER_ORDER.forEach(rt => {
                $roadTypesDiv.append(createSettingsCheckbox(`cs${rt}CheckBox`, 'roadType', trans.roadTypes[rt] || rt, null, null, null, { 'data-road-type': rt }));
            });

            $panel.append($('<div>', { class: 'side-panel-section>' }).append($('<div>', { style: 'margin-bottom:8px;' }).append($('<div>', { class: 'form-group' }).append(
                $('<label>', { class: 'cs-group-label' }).text(trans.roadTypeButtons),
                $('<div>').append(createSettingsCheckbox('csRoadTypeButtonsCheckBox', 'roadButtons', trans.roadTypeButtons)).append($roadTypesDiv),
                createSettingsCheckbox('csLockButtonsCheckBox', 'lockButtons', trans.lockLevelButtons, null, {marginTop:'10px'})
            ))));

            // Smart Copy
            const $smartCopyDiv = $('<div>', { class: 'side-panel-section' });
            $smartCopyDiv.append($('<label>', { class: 'cs-group-label' }).text(trans.smartCopyTitle));
            $smartCopyDiv.append(createSettingsCheckbox('scfEnableCheckBox', 'enableSmartCopy', trans.enableSmartCopy));
            const $scfDetails = $('<div>', { class: 'scf-details' });
            if(!_settings.enableSmartCopy) $scfDetails.hide();
            $scfDetails.append(createSettingsCheckbox('scfInheritCountryCheckBox', 'inheritCountry', trans.copyCountry));
            $scfDetails.append(createSettingsCheckbox('scfInheritCityCheckBox', 'inheritCity', trans.copyCity));
            $scfDetails.append(createSettingsCheckbox('scfInheritStreetCheckBox', 'inheritStreet', trans.copyStreet));
            $scfDetails.append(createSettingsCheckbox('scfInheritRoadTypeCheckBox', 'inheritRoadType', trans.copyRoadType));
            $scfDetails.append(createSettingsCheckbox('scfInheritSpeedCheckBox', 'inheritSpeed', trans.copySpeed));
            $scfDetails.append(createSettingsCheckbox('scfInheritLockCheckBox', 'inheritLock', trans.copyLock));
            $scfDetails.append(createSettingsCheckbox('scfInheritAltNamesCheckBox', 'inheritAltNames', trans.copyAltNames));
            $scfDetails.append(createSettingsCheckbox('scfInheritOtherCheckBox', 'inheritOther', trans.copyOther));
            $smartCopyDiv.append($scfDetails);
            $panel.append($smartCopyDiv);

            // === New: Advanced Selection Section ===
            const $advSelDiv = $('<div>', { class: 'side-panel-section', style: 'border-top:1px solid #eee; margin-top:10px; padding-top:10px;' });
            $advSelDiv.append($('<label>', { class: 'cs-group-label' }).text(trans.advSelectTitle));

            // Criteria Dropdown
            const $critSel = $('<select>', { id: 'aaAdvCriteria', class: 'aa-input', style: 'margin-bottom:5px;' });
            $critSel.append(
                $('<option>', { value: 'no_city', text: trans.optNoCity }),
                $('<option>', { value: 'no_speed', text: trans.optNoSpeed }),
                $('<option>', { value: 'lock', text: trans.optLock }),
                $('<option>', { value: 'type', text: trans.optType })
            );

            // Value Inputs (Separate IDs to avoid confusion)
            const $valInputDiv = $('<div>', { id: 'aaAdvValueDiv', style: 'display:none; margin-bottom:5px;' });
            $valInputDiv.append($('<label>',{style:'font-size:10px; display:block;'}).text(trans.lblValue));

            // Lock Select
            const $lockSel = $('<select>', { id: 'aaAdvLockVal', class: 'aa-input' });
            [1,2,3,4,5,6].forEach(l => $lockSel.append($('<option>', { value: l, text: `Level ${l}` })));

            // Type Select
            const $typeSel = $('<select>', { id: 'aaAdvTypeVal', class: 'aa-input', style: 'display:none;' });
             RENDER_ORDER.forEach(rt => {
               $typeSel.append($('<option>', { value: roadTypeSettings[rt].id, text: trans.roadTypes[rt] }));
            });

            $valInputDiv.append($lockSel).append($typeSel);

            // Execute Buttons (2 Buttons Row) - Flex direction determined by current language dir
            const $btnContainer = $('<div>', { style: `display:flex; gap:5px; margin-top:5px; direction: ${trans.dir};` });
            const $btnScan = $('<button>', { class: 'btn btn-primary', style: 'flex:1;' }).text(trans.btnSelect).click(performAdvancedSelection);
            const $btnClear = $('<button>', { class: 'btn btn-default', style: 'flex:1;' }).text(trans.btnClear).click(() => W.selectionManager.unselectAll());

            // Appending in DOM order. Flexbox 'start' (Right in RTL, Left in LTR) handles visual position.
            // If RTL: First Element (Select) goes to Right. Second (Deselect) goes to Left.
            // If LTR: First Element (Select) goes to Left. Second (Deselect) goes to Right.
            $btnContainer.append($btnScan).append($btnClear);

            $advSelDiv.append($critSel).append($valInputDiv).append($btnContainer);
            $panel.append($advSelDiv);

            // Event Listener for Dropdown Change
            $critSel.change(function() {
                const val = $(this).val();
                if (val === 'lock') {
                    $valInputDiv.show();
                    $lockSel.show();
                    $typeSel.hide();
                } else if (val === 'type') {
                    $valInputDiv.show();
                    $lockSel.hide();
                    $typeSel.show();
                } else {
                    $valInputDiv.hide();
                }
            });

            $panel.append($('<div>', { style: 'margin-top:20px;font-size:10px;color:#999999;' }).append($('<div>').text(`v. ${argsObject.scriptVersion}`)));
            const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
            $(tabLabel).text('Abdullah Abbas WME Suite');
            $(tabPane).append($panel);
            $(tabPane).parent().css({ 'padding-top': '0px', 'padding-left': '8px' });

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
            observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
            await initUserPanel();
            window.addEventListener('beforeunload', saveSettingsToStorage, false);
            if (_settings.roadButtons) addButtonsToPanel();
        }
        init();
    }

    function skipLoginDialog(tries = 0) {
        if (sdk || tries === 1000) return;
        if ($('wz-button.do-login').length) { $('wz-button.do-login').click(); return; }
        setTimeout(skipLoginDialog, 100, ++tries);
    }

    async function mainStart() {
        skipLoginDialog();
        sdk = await bootstrap({ scriptUpdateMonitor: { downloadUrl: DOWNLOAD_URL } });
        const args = { scriptName: SCRIPT_NAME, scriptVersion: SCRIPT_VERSION, forumUrl: '' };
        $(document).ready(() => { runSuiteModules(args); });
    }

    mainStart();

})();