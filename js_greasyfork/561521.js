// ==UserScript==
// @name            Abdullah Abbas WME Suite
// @namespace       https://greasyfork.org/users/AbdullahAbbas
// @version         2026.01.06.15
// @description     مجموعة أدوات عبد الله عباس (إصلاح مشكلة التعليق + حفظ الإعدادات).
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

/* eslint-disable max-classes-per-file */

(function main() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_NAME = 'Abdullah Abbas WME Suite';
    const SCRIPT_VERSION = GM_info.script.version;
    const DOWNLOAD_URL = 'https://greasyfork.org/scripts/YOUR_SCRIPT_ID/code/Abdullah%20Abbas%20WME%20Suite.user.js';
    // استخدام اسم ثابت لضمان حفظ الاعدادات
    const SETTINGS_STORE_NAME = 'AbdullahAbbas_WME_Suite_Fixed_Settings';
    let sdk;

    // --- Localization ---
    const UI_STRINGS = {
        'ar': {
            langName: 'العربية (العراق)',
            roadTypeButtons: 'تفعيل أزرار الطرق',
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
            discussionForumLinkText: 'منتدى النقاش',
            roadTypes: {
                Fw: 'طريق حرة', MH: 'سريع رئيسي', mH: 'سريع ثانوي', PS: 'شارع رئيسي', St: 'شارع',
                Rmp: 'منحدر', PR: 'طريق خاص', Pw: 'شارع ضيق', PLR: 'موقف', OR: 'غير معبد',
                RR: 'سكة حديد', RT: 'مدرج مطار'
            }
        },
        'ckb': {
            langName: 'کوردی (سۆرانی)',
            roadTypeButtons: 'چالاککردنی دوگمەکان',
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
            roadTypes: {
                Fw: 'ڕێگای خێرا', MH: 'خێرای سەرەکی', mH: 'خێرای لاوەکی', PS: 'شەقامی سەرەکی', St: 'شەقام',
                Rmp: 'رامپ', PR: 'تایبەت', Pw: 'کۆڵان', PLR: 'پارکینگ', OR: 'ڕێگای خۆڵ',
                RR: 'هێڵی ئاسن', RT: 'فڕگە'
            }
        },
        'en': {
            langName: 'English (US)',
            roadTypeButtons: 'Road Buttons',
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
            roadTypes: {
                Fw: 'Fw', MH: 'MH', mH: 'mH', PS: 'PS', St: 'St',
                Rmp: 'Rmp', PR: 'PR', Pw: 'Pw', PLR: 'PLR', OR: 'OR',
                RR: 'RR', RT: 'RT'
            }
        }
    };

    // --- Main Logic ---
    async function runSuiteModules(argsObject) {

        const roadTypeDropdownSelector = 'div[class="road-type-select"]';
        const roadTypeChipSelector = 'wz-chip-select[class="road-type-chip-select"]';

        const wmeRoadType = {
            ALLEY: 22, FERRY: 15, FREEWAY: 3, MAJOR_HIGHWAY: 6, MINOR_HIGHWAY: 7, OFF_ROAD: 8,
            PARKING_LOT_ROAD: 20, PEDESTRIAN_BOARDWALK: 10, PRIMARY_STREET: 2, PRIVATE_ROAD: 17,
            RAILROAD: 18, RAMP: 4, RUNWAY_TAXIWAY: 19, STAIRWAY: 16, STREET: 1, WALKING_TRAIL: 5, WALKWAY: 9
        };

        const RENDER_ORDER = ['Fw', 'MH', 'mH', 'PS', 'St', 'Rmp', 'PR', 'Pw', 'PLR', 'OR', 'RR', 'RT'];

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

        // State & Settings
        let _settings = {};
        let trans = UI_STRINGS['ar'];

        // Smart Copy Cache
        const processedSegments = new Set();

        function logDebug(message) { console.debug(SCRIPT_NAME + ':', message); }
        function isChecked(checkboxId) { return $(`#${checkboxId}`).is(':checked'); }

        // --- FIXED: Load Settings ONLY (No DOM manipulation here) ---
        function loadSettingsFromStorage() {
            let loadedSettings = $.parseJSON(localStorage.getItem(SETTINGS_STORE_NAME));

            const defaultSettings = {
                lastVersion: argsObject.scriptVersion,
                preferredLocale: 'ar',

                roadButtons: true,
                roadTypeButtons: ['MH', 'mH', 'PS', 'St', 'Rmp'],
                addCompactColors: true,

                enableSmartCopy: true,
                inheritCountry: true,
                inheritCity: true,
                inheritStreet: false,
                inheritRoadType: false,
                inheritSpeed: false,
                inheritLock: false,
                inheritAltNames: false,
                inheritOther: false,

                shortcuts: {}
            };

            _settings = { ...defaultSettings, ...loadedSettings };

            const langCode = _settings.preferredLocale || 'ar';
            trans = { ...UI_STRINGS['en'], ...UI_STRINGS[langCode] };
        }

        function saveSettingsToStorage() {
            const settings = {
                lastVersion: argsObject.scriptVersion,
                preferredLocale: _settings.preferredLocale,

                roadButtons: _settings.roadButtons,
                roadTypeButtons: _settings.roadTypeButtons,
                addCompactColors: true,

                enableSmartCopy: _settings.enableSmartCopy,
                inheritCountry: _settings.inheritCountry,
                inheritCity: _settings.inheritCity,
                inheritStreet: _settings.inheritStreet,
                inheritRoadType: _settings.inheritRoadType,
                inheritSpeed: _settings.inheritSpeed,
                inheritLock: _settings.inheritLock,
                inheritAltNames: _settings.inheritAltNames,
                inheritOther: _settings.inheritOther,

                shortcuts: {}
            };
            if(sdk && sdk.Shortcuts) {
                sdk.Shortcuts.getAllShortcuts().forEach(shortcut => {
                    settings.shortcuts[shortcut.shortcutId] = shortcut.shortcutKeys;
                });
            }
            localStorage.setItem(SETTINGS_STORE_NAME, JSON.stringify(settings));
        }

        // =================================================================
        // === SMART COPY LOGIC (SAFE VERSION) ===
        // =================================================================

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
            const seen = new Set([id]);
            const q = [id];

            // --- SAFETY LIMIT ---
            let safetyCounter = 0;
            const MAX_SEARCH = 50;

            const hasData = (sid) => {
                try {
                    const a = sdk.DataModel.Segments.getAddress({ segmentId: sid });
                    if (a && !a.isEmpty) return true;
                    const s = sdk.DataModel.Segments.getById({ segmentId: sid });
                    if (s && s.roadType) return true;
                    return false;
                } catch { return false; }
            };

            while (q.length) {
                // Safety Break to prevent Hanging
                if (safetyCounter++ > MAX_SEARCH) break;

                const cur = q.shift();
                const ns = getNeighbors(cur);
                const donorId = ns.find(hasData);
                if (donorId) return donorId;
                ns.forEach(n => { if (!seen.has(n)) { seen.add(n); q.push(n); } });
            }
            return null;
        }

        function getOrCreateStreet(streetName, cityId) {
            return sdk.DataModel.Streets.getStreet({ streetName, cityId }) ||
                   sdk.DataModel.Streets.addStreet({ streetName, cityId });
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
                    if (cityId == null) {
                        cityId = sdk.DataModel.Cities.addCity(cityProps).id;
                    }

                    const streetName = (wantStreet && donorAddr?.street?.name) ? donorAddr.street.name : (targetAddr.street?.name ?? '');
                    const primaryStreetId = getOrCreateStreet(streetName, cityId).id;

                    try {
                        sdk.DataModel.Segments.updateAddress({ segmentId: id, primaryStreetId });
                        somethingChanged = true;
                    } catch (e) { console.error('Addr copy fail', e); }
                }
            }

            if (_settings.inheritRoadType) {
                if (targetSeg.roadType !== donorSeg.roadType) {
                    sdk.DataModel.Segments.updateSegment({ segmentId: id, roadType: donorSeg.roadType });
                    somethingChanged = true;
                }
            }

            if (_settings.inheritSpeed) {
                const upd = { segmentId: id };
                let sc = false;
                if (donorSeg.fwdSpeedLimit && !targetSeg.fwdSpeedLimit) { upd.fwdSpeedLimit = donorSeg.fwdSpeedLimit; sc = true; }
                if (donorSeg.revSpeedLimit && !targetSeg.revSpeedLimit) { upd.revSpeedLimit = donorSeg.revSpeedLimit; sc = true; }
                if (sc) {
                    sdk.DataModel.Segments.updateSegment(upd);
                    somethingChanged = true;
                }
            }

            if (_settings.inheritLock) {
                const dLock = (donorSeg.lockRank || 0);
                const tLock = (targetSeg.lockRank || 0);
                if (tLock < dLock) {
                    sdk.DataModel.Segments.updateSegment({ segmentId: id, lockRank: dLock });
                    somethingChanged = true;
                }
            }

            if (_settings.inheritAltNames) {
                try {
                    const donorAlts = donorSeg.alternateStreetIds || [];
                    if (donorAlts.length > 0) {
                        sdk.DataModel.Segments.updateSegment({ segmentId: id, alternateStreetIds: donorAlts });
                        somethingChanged = true;
                    }
                } catch (e) {}
            }

            if (_settings.inheritOther) {
                const upd = { segmentId: id };
                let sc = false;
                if (donorSeg.level !== targetSeg.level) { upd.level = donorSeg.level; sc = true; }
                if (donorSeg.isToll !== targetSeg.isToll) { upd.isToll = donorSeg.isToll; sc = true; }
                if (sc) {
                    sdk.DataModel.Segments.updateSegment(upd);
                    somethingChanged = true;
                }
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
                if (isLikelyNew(id, seg)) {
                    if (executeSmartCopy(id)) processedSegments.add(id);
                }
            });
        }

        // =================================================================
        // === ROAD BUTTONS LOGIC ===
        // =================================================================
        function onRoadTypeButtonClick(roadType) {
            const selection = sdk.Editing.getSelection();
            selection?.ids.forEach(segmentId => {
                if (sdk.DataModel.Segments.getById({ segmentId }).roadType !== roadType) {
                    sdk.DataModel.Segments.updateSegment({ segmentId, roadType });
                }
            });
        }

        function addRoadTypeButtons() {
            if (!_settings.roadButtons) {
                $('#csRoadTypeButtonsContainer').remove();
                return;
            }

            const selection = sdk.Editing.getSelection();
            if (selection?.objectType !== 'segment') return;
            const segmentId = selection.ids[0];
            if (!segmentId) return;

            const $dropDown = $(roadTypeDropdownSelector);
            $('#csRoadTypeButtonsContainer').remove();

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
                        .click(function rtbClick() { onRoadTypeButtonClick($(this).data('rtId')); })
                    );
                }
            });

            $container.append($group);
            $dropDown.before($container);
        }

        function addCompactRoadTypeChangeEvents() {
            const chipSelect = document.getElementsByClassName('road-type-chip-select')[0];
            if (chipSelect) {
                chipSelect.addEventListener('chipSelected', evt => {
                    onRoadTypeButtonClick(evt.detail.value);
                });
            }
        }

        async function addCompactRoadTypeColors() {
            try {
                if (sdk.Settings.getUserSettings().isCompactMode && sdk.Editing.getSelection()) {
                    await waitForElem('.road-type-chip-select wz-checkable-chip');
                    $('.road-type-chip-select wz-checkable-chip').addClass('cs-compact-button');
                    Object.values(roadTypeSettings).forEach(roadType => {
                        const bgColor = roadType.wmeColor;
                        const rtChip = $(`.road-type-chip-select wz-checkable-chip[value=${roadType.id}]`);
                        if (rtChip.length !== 1) return;
                         rtChip.each(function() {
                            $(this).css('--wz-checkable-chip-background-color', bgColor);
                            $(this).css('--wz-checkable-chip-text-color', 'black');
                        });
                    });
                }
            } catch (ex) { /* Ignore */ }
        }

        function waitForElem(selector) {
            return new Promise((resolve, reject) => {
                function checkIt(tries = 0) {
                    if (tries < 150) {
                        const elem = document.querySelector(selector);
                        setTimeout(() => { if (!elem) { checkIt(++tries); } else { resolve(elem); } }, 20);
                    } else { reject(); }
                }
                checkIt();
            });
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

        function buildRoadTypeButtonCss() {
            const lines = [];
            Object.keys(roadTypeSettings).forEach(roadTypeAbbr => {
                const roadType = roadTypeSettings[roadTypeAbbr];
                const bgColor = roadType.wmeColor;
                let output = `.cs-rt-buttons-container .cs-rt-button-${roadTypeAbbr} {background-color:${bgColor} !important; color: black !important; box-shadow:0 2px ${shadeColor2(bgColor, -0.5)};border-color:${shadeColor2(bgColor, -0.15)};}`;
                output += ` .cs-rt-buttons-container .cs-rt-button-${roadTypeAbbr}:hover {background-color:${shadeColor2(bgColor, 0.2)} !important;}`;
                lines.push(output);
            });
            return lines.join(' ');
        }

        function injectCss() {
            const css = [
                '.csRoadTypeButtonsCheckBoxContainer {margin-left:15px;}',
                '.cs-rt-buttons-container {margin-bottom:10px;}',
                '.cs-rt-buttons-group { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; width: 100%; }',
                '.cs-rt-buttons-container .cs-rt-button {font-size:12px; font-weight: bold; line-height:26px; color:black; padding:0px 2px; height:28px; text-align: center; margin: 0; border-style:solid; border-width:1px; border-radius: 4px;}',
                buildRoadTypeButtonCss(),
                '.btn.cs-rt-button:active {box-shadow:none;transform:translateY(2px)}',
                '#sidepanel-clicksaver .controls-container {padding:0px;}',
                '#sidepanel-clicksaver .controls-container label {white-space: normal;}',
                '#sidepanel-clicksaver {font-size:13px;}',
                '.cs-compact-button[checked="false"] {opacity: 0.65;}',
                '.cs-group-label {font-size: 11px; width: 100%; font-family: Poppins, sans-serif; text-transform: uppercase; font-weight: 700; color: #354148; margin-bottom: 6px; margin-top: 15px;}',
                '.scf-details {margin-left: 15px; margin-top: 5px;}'
            ].join(' ');
            $(`<style type="text/css">${css}</style>`).appendTo('head');
        }

        // --- FIXED: Create Checkbox with Correct Initial State ---
        function createSettingsCheckbox(id, settingName, labelText, titleText, divCss, labelCss, optionalAttributes) {
            const $container = $('<div>', { class: 'controls-container' });

            // Check current setting
            let isChecked = false;
            if (settingName === 'roadType') {
                const rt = optionalAttributes && optionalAttributes['data-road-type'];
                if (rt && _settings.roadTypeButtons.includes(rt)) isChecked = true;
            } else {
                if (_settings[settingName] === true) isChecked = true;
            }

            const $input = $('<input>', {
                type: 'checkbox',
                class: 'csSettingsControl',
                name: id,
                id,
                'data-setting-name': settingName,
                checked: isChecked // Apply checked state immediately
            }).appendTo($container);

            if (titleText) { labelText += '*'; }
            const $label = $('<label>', { for: id }).text(labelText).appendTo($container);
            if (divCss) $container.css(divCss);
            if (labelCss) $label.css(labelCss);
            if (titleText) $container.attr({ title: titleText });
            if (optionalAttributes) $input.attr(optionalAttributes);
            return $container;
        }

        async function initUserPanel() {
            const $panel = $('<div>', { id: 'sidepanel-clicksaver' });

            // --- Language Section ---
            const $langDiv = $('<div>', { class: 'side-panel-section', style: 'margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;' });
            const $langSelect = $('<select>', { id: 'aaSuiteLanguageSelector', style: 'width: 100%; padding: 5px; border-radius: 5px; border: 1px solid #ccc;' });
            $langSelect.append(
                $('<option>', { value: 'ar', text: 'العربية - العراق' }),
                $('<option>', { value: 'ckb', text: 'کوردی - سۆرانی' }),
                $('<option>', { value: 'en', text: 'English - USA' })
            );
            $langSelect.val(_settings.preferredLocale || 'ar');
            $langSelect.change(function() {
                _settings.preferredLocale = $(this).val();
                saveSettingsToStorage();
                if(confirm('تغيير اللغة يتطلب تحديث الصفحة. هل تريد التحديث الآن؟')) location.reload();
            });
            $langDiv.append($langSelect);
            $panel.append($langDiv);

            // --- Road Buttons Section ---
            const $roadTypesDiv = $('<div>', { class: 'csRoadTypeButtonsCheckBoxContainer' });
            // Apply Initial Visibility based on settings
            if(!_settings.roadButtons) $roadTypesDiv.hide();

            RENDER_ORDER.forEach(roadTypeAbbr => {
                const id = `cs${roadTypeAbbr}CheckBox`;
                const labelText = trans.roadTypes[roadTypeAbbr] || roadTypeAbbr;
                const $roadTypeContainer = createSettingsCheckbox(id, 'roadType', labelText, null, null, null, { 'data-road-type': roadTypeAbbr });
                $roadTypesDiv.append($roadTypeContainer);
            });

            $panel.append(
                $('<div>', { class: 'side-panel-section>' }).append(
                    $('<div>', { style: 'margin-bottom:8px;' }).append(
                        $('<div>', { class: 'form-group' }).append(
                            $('<label>', { class: 'cs-group-label' }).text(trans.roadTypeButtons),
                            $('<div>').append(createSettingsCheckbox('csRoadTypeButtonsCheckBox', 'roadButtons', trans.roadTypeButtons)).append($roadTypesDiv)
                        )
                    )
                )
            );

            // --- Smart Copy Section ---
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

            // --- Footer ---
            $panel.append(
                $('<div>', { style: 'margin-top:20px;font-size:10px;color:#999999;' }).append(
                    $('<div>').text(`v. ${argsObject.scriptVersion}`)
                )
            );

            const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
            $(tabLabel).text('Abdullah Abbas WME Suite');
            $(tabPane).append($panel);
            $(tabPane).parent().css({ 'padding-top': '0px', 'padding-left': '8px' });

            // Setup Checkbox Logic - Events
            function setupCheckboxChangeHandler(checkboxSelector, containerSelector) {
                $(checkboxSelector).change(function() {
                    $(containerSelector).toggle(this.checked);
                    if(checkboxSelector === '#csRoadTypeButtonsCheckBox') {
                        _settings.roadButtons = this.checked;
                        addRoadTypeButtons();
                    }
                    if(checkboxSelector === '#scfEnableCheckBox') {
                        _settings.enableSmartCopy = this.checked;
                    }
                    saveSettingsToStorage();
                });
            }
            setupCheckboxChangeHandler('#csRoadTypeButtonsCheckBox', '.csRoadTypeButtonsCheckBoxContainer');
            setupCheckboxChangeHandler('#scfEnableCheckBox', '.scf-details');

            $('.csSettingsControl').change(function() {
                const { checked } = this;
                const $this = $(this);
                const settingName = $this.data('setting-name');

                if (settingName === 'roadType') {
                    const roadType = $this.data('road-type');
                    const array = _settings.roadTypeButtons;
                    const index = array.indexOf(roadType);
                    if (checked && index === -1) { array.push(roadType); }
                    else if (!checked && index !== -1) { array.splice(index, 1); }
                } else if (settingName && settingName !== 'roadButtons' && settingName !== 'enableSmartCopy') {
                    // Main toggles are handled in specific handlers above, others here
                    _settings[settingName] = checked;
                }

                saveSettingsToStorage();
                addRoadTypeButtons();
            });
        }

        async function init() {
            logDebug('Initializing AA Suite Full...');
            loadSettingsFromStorage();
            injectCss();

            sdk.Events.trackDataModelEvents({ dataModelName: 'segments' });

            sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: addRoadTypeButtons });
            sdk.Events.on({ eventName: 'wme-selection-changed', eventHandler: runSmartCopyLogic });

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const addedNode = mutation.addedNodes[i];
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            if (addedNode.querySelector(roadTypeDropdownSelector)) {
                                if (_settings.roadButtons) addRoadTypeButtons();
                            }
                            if (addedNode.querySelector(roadTypeChipSelector)) {
                                addCompactRoadTypeChangeEvents();
                                addCompactRoadTypeColors();
                            }
                        }
                    }
                });
            });
            observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });

            await initUserPanel();
            window.addEventListener('beforeunload', saveSettingsToStorage, false);

            if (_settings.roadButtons) addRoadTypeButtons();
            logDebug('AA Suite Full Initialized');
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