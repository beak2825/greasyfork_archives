// ==UserScript==
// @name         Abdullah Abbas WME Toolkit
// @namespace    https://waze.com/user/abdullah-abbas
// @version      2026.01.23.07
// @description  WME Suite: Improved Settings UI with Accordion Visuals.
// @author       Abdullah Abbas
// @copyright    2026, Abdullah Abbas
// @license      All Rights Reserved.
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563742/Abdullah%20Abbas%20WME%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/563742/Abdullah%20Abbas%20WME%20Toolkit.meta.js
// ==/UserScript==

/* global W, bootstrap */

(function() {
    'use strict';

    let sdk = null;
    const SCRIPT_NAME = 'Abdullah Abbas WME Toolkit';
    const STORE_KEY = 'abdullah_abbas_settings_v6';

    const DEFAULT_SETTINGS = {
        lang: 'en',
        moduleEnabled: true,
        roads: { St: true, PS: true, mH: true, MH: true, Fw: true, Rmp: true, PR: true, PLR: true },
        locks: { L1: true, L2: true, L3: true, L4: true, L5: true, L6: true }
    };

    let settings = loadSettings();

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORE_KEY);
            if (!saved) return DEFAULT_SETTINGS;
            const parsed = JSON.parse(saved);
            return {
                ...DEFAULT_SETTINGS,
                ...parsed,
                roads: { ...DEFAULT_SETTINGS.roads, ...(parsed.roads || {}) },
                locks: { ...DEFAULT_SETTINGS.locks, ...(parsed.locks || {}) }
            };
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    }

    function saveSettings() {
        localStorage.setItem(STORE_KEY, JSON.stringify(settings));
    }

    const PALETTE = {
        L1: { bg: '#ffffff', txt: '#000000' }, L2: { bg: '#f0ea58', txt: '#000000' },
        L3: { bg: '#69bf88', txt: '#000000' }, L4: { bg: '#45b8d1', txt: '#000000' },
        L5: { bg: '#bd5ab6', txt: '#ffffff' }, L6: { bg: '#ff0000', txt: '#ffffff' },
        Rmp: { bg: '#999999', txt: '#000000' }, PR:  { bg: '#beba6c', txt: '#000000' },
        PLR: { bg: '#ababab', txt: '#000000' }
    };

    const TRANSLATIONS = {
        'en': {
            dir: 'ltr', name: 'English',
            moduleTitle: 'Segment Tools',
            lblSelectLang: 'Interface Language',
            lblEnableModule: 'Enable This Tool',
            lblRoadsConfig: 'Road Types',
            lblLocksConfig: 'Lock Levels',
            roads: {
                St: { btn: 'St', tip: 'Street' }, PS: { btn: 'PS', tip: 'Primary Street' },
                mH: { btn: 'mH', tip: 'Minor Highway' }, MH: { btn: 'MH', tip: 'Major Highway' },
                Fw: { btn: 'Fw', tip: 'Freeway' }, Rmp: { btn: 'Ramp', tip: 'Ramp' },
                PR: { btn: 'PR', tip: 'Private Road' }, PLR: { btn: 'PLR', tip: 'Parking Lot' }
            }
        },
        'ar': {
            dir: 'rtl', name: 'العربية',
            moduleTitle: 'أدوات القطاعات',
            lblSelectLang: 'لغة الواجهة',
            lblEnableModule: 'تفعيل هذه الأداة',
            lblRoadsConfig: 'أنواع الطرق',
            lblLocksConfig: 'مستويات القفل',
            roads: {
                St: { btn: 'شارع', tip: 'شارع (Street)' }, PS: { btn: 'رئيسي', tip: 'شارع رئيسي (Primary)' },
                mH: { btn: 'س.ثانوي', tip: 'سريع ثانوي (Minor Hwy)' }, MH: { btn: 'س.رئيسي', tip: 'سريع رئيسي (Major Hwy)' },
                Fw: { btn: 'طريق حر', tip: 'طريق حر (Freeway)' }, Rmp: { btn: 'منحدر', tip: 'منحدر (Ramp)' },
                PR: { btn: 'خاص', tip: 'طريق خاص (Private)' }, PLR: { btn: 'موقف', tip: 'موقف سيارات (Parking)' }
            }
        },
        'ckb': {
            dir: 'rtl', name: 'کوردی',
            moduleTitle: 'امرازەکانی کەرتی ڕێگا',
            lblSelectLang: 'زمانی ڕووکار',
            lblEnableModule: 'چالاککردنی ئەم ئامرازە',
            lblRoadsConfig: 'جۆرەکانی ڕێگا',
            lblLocksConfig: 'ئاستەکانی قوفڵ',
            roads: {
                St: { btn: 'کۆڵان', tip: 'کۆڵان (Street)' }, PS: { btn: 'سەرەکی', tip: 'شەقامی سەرەکی (Primary)' },
                mH: { btn: 'خ.لاوەکی', tip: 'خێرای لاوەکی (Minor Hwy)' }, MH: { btn: 'خ.سەرەکی', tip: 'خێرای سەرەکی (Major Hwy)' },
                Fw: { btn: 'خێرا', tip: 'ڕێگای خێرا (Freeway)' }, Rmp: { btn: 'رامپ', tip: 'رامپ (Ramp)' },
                PR: { btn: 'تایبەت', tip: 'ڕێگای تایبەت (Private)' }, PLR: { btn: 'پارک', tip: 'پارکینگ (Parking)' }
            }
        },
        'kmr': {
            dir: 'ltr', name: 'Kurmancî',
            moduleTitle: 'Amûrên Segmentê',
            lblSelectLang: 'Zimanê Navrûyê',
            lblEnableModule: 'Vê Amûrê Çalak Bike',
            lblRoadsConfig: 'Cûreyên Rê',
            lblLocksConfig: 'Astên Kilîtê',
            roads: {
                St: { btn: 'Kolan', tip: 'Kolan (Street)' }, PS: { btn: 'Sereke', tip: 'Kolana Sereke (Primary)' },
                mH: { btn: 'R.Navîn', tip: 'Rêya Navîn (Minor Hwy)' }, MH: { btn: 'R.Mezin', tip: 'Rêya Sereke (Major Hwy)' },
                Fw: { btn: 'Otoban', tip: 'Rêya Hêrs (Freeway)' }, Rmp: { btn: 'Ramp', tip: 'Ramp' },
                PR: { btn: 'Taybet', tip: 'Rêya Taybet (Private)' }, PLR: { btn: 'Park', tip: 'Park (Parking)' }
            }
        }
    };

    async function startScript() {
        if (typeof bootstrap !== 'undefined') {
            sdk = await bootstrap();
            initMutationObserver();
            initSettingsTab();
            console.log(`${SCRIPT_NAME} v${GM_info.script.version}: Active.`);
        }
    }

    // --- 1. نافذة الإعدادات (Sidebar) ---
    async function initSettingsTab() {
        const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
        tabLabel.innerText = 'Abdullah Abbas WME Toolkit';
        tabLabel.title = SCRIPT_NAME;
        renderSettingsContent(tabPane);
    }

    function renderSettingsContent(container) {
        container.innerHTML = '';
        const t = TRANSLATIONS[settings.lang];
        container.style.cssText = `padding: 12px; font-family: 'Segoe UI', Arial, sans-serif; direction: ${t.dir}; background: #fafafa; height: 100%; box-sizing: border-box;`;

        // -- القسم العام: اللغة --
        let langDiv = document.createElement('div');
        langDiv.style.cssText = 'margin-bottom: 20px; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);';

        let langLabel = document.createElement('div');
        langLabel.innerText = t.lblSelectLang;
        langLabel.style.cssText = 'font-size: 11px; font-weight: bold; color: #444; margin-bottom: 8px;';
        langDiv.appendChild(langLabel);

        let langSelect = document.createElement('select');
        langSelect.style.cssText = 'width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; background: #fff;';
        Object.keys(TRANSLATIONS).forEach(key => {
            let opt = document.createElement('option');
            opt.value = key; opt.innerText = TRANSLATIONS[key].name;
            if (key === settings.lang) opt.selected = true;
            langSelect.appendChild(opt);
        });
        langSelect.onchange = (e) => {
            settings.lang = e.target.value;
            saveSettings();
            renderSettingsContent(container);
            refreshInlinePanel();
        };
        langDiv.appendChild(langSelect);
        container.appendChild(langDiv);

        // -- بطاقة الأداة (Accordion Style) --
        let toolCard = document.createElement('div');
        toolCard.style.cssText = 'border: 1px solid #ddd; border-radius: 6px; background: #fff; margin-bottom: 15px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.2s;';

        // الرأس القابل للنقر (مع السهم)
        let toolHeader = document.createElement('div');
        let arrowIcon = '▶';
        if (t.dir === 'rtl') arrowIcon = '◀';

        toolHeader.innerHTML = `<span style="display:inline-block; width:15px; transition: transform 0.2s;" class="arrow-icon">${arrowIcon}</span> 🛠 ${t.moduleTitle}`;
        toolHeader.style.cssText = 'background: linear-gradient(to bottom, #fff, #f4f4f4); padding: 10px; font-weight: bold; font-size: 13px; border-bottom: 1px solid #eee; cursor: pointer; color: #333; display: flex; align-items: center;';

        toolHeader.onmouseover = () => toolHeader.style.background = '#f0f0f0';
        toolHeader.onmouseout = () => toolHeader.style.background = 'linear-gradient(to bottom, #fff, #f4f4f4)';

        let toolBody = document.createElement('div');
        toolBody.className = 'tool-body';
        toolBody.style.cssText = 'padding: 15px; display: none; background: #fff;';

        let isOpen = false;
        toolHeader.onclick = () => {
             isOpen = !isOpen;
             toolBody.style.display = isOpen ? 'block' : 'none';
             let arrow = toolHeader.querySelector('.arrow-icon');
             arrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
             toolHeader.style.borderBottomColor = isOpen ? '#ddd' : 'transparent';
        };
        toolCard.appendChild(toolHeader);

        // --- محتوى الإعدادات الداخلية ---

        // 1. زر التفعيل الرئيسي
        let mainToggle = createCheckbox(t.lblEnableModule, settings.moduleEnabled, (chk) => {
            settings.moduleEnabled = chk;
            saveSettings(); refreshInlinePanel();
        }, true);
        mainToggle.style.paddingBottom = '10px';
        mainToggle.style.borderBottom = '1px solid #eee';
        mainToggle.style.marginBottom = '10px';
        toolBody.appendChild(mainToggle);

        // 2. إعدادات الطرق
        let roadsGroup = document.createElement('div');
        roadsGroup.style.cssText = 'background: #fdfdfd; padding: 8px; border: 1px solid #f0f0f0; border-radius: 4px; margin-bottom: 10px;';

        let roadsTitle = document.createElement('div');
        roadsTitle.innerText = t.lblRoadsConfig;
        roadsTitle.style.cssText = 'font-size: 11px; font-weight: bold; margin-bottom: 8px; color: #2196f3;';
        roadsGroup.appendChild(roadsTitle);

        let roadsContainer = document.createElement('div');
        roadsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;';
        Object.keys(t.roads).forEach(key => {
            roadsContainer.appendChild(createCheckbox(t.roads[key].btn, settings.roads[key], (chk) => {
                settings.roads[key] = chk;
                saveSettings(); refreshInlinePanel();
            }));
        });
        roadsGroup.appendChild(roadsContainer);
        toolBody.appendChild(roadsGroup);

        // 3. إعدادات القفل
        let locksGroup = document.createElement('div');
        locksGroup.style.cssText = 'background: #fdfdfd; padding: 8px; border: 1px solid #f0f0f0; border-radius: 4px;';

        let locksTitle = document.createElement('div');
        locksTitle.innerText = t.lblLocksConfig;
        locksTitle.style.cssText = 'font-size: 11px; font-weight: bold; margin-bottom: 8px; color: #2196f3;';
        locksGroup.appendChild(locksTitle);

        let locksContainer = document.createElement('div');
        locksContainer.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;';
        ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].forEach(key => {
            locksContainer.appendChild(createCheckbox(key, settings.locks[key], (chk) => {
                settings.locks[key] = chk;
                saveSettings(); refreshInlinePanel();
            }));
        });
        locksGroup.appendChild(locksContainer);
        toolBody.appendChild(locksGroup);

        toolCard.appendChild(toolBody);
        container.appendChild(toolCard);

        let footer = document.createElement('div');
        footer.innerText = `Abdullah Abbas WME Toolkit\nv${GM_info.script.version}`;
        footer.style.cssText = 'font-size: 10px; color: #aaa; text-align: center; margin-top: 30px; white-space: pre-line;';
        container.appendChild(footer);
    }

    function createCheckbox(label, checked, onChange, isBold = false) {
        let wrap = document.createElement('label');
        wrap.style.cssText = 'display: flex; align-items: center; cursor: pointer; font-size: 11px; user-select: none; color: #333;';
        if (isBold) {
            wrap.style.fontWeight = 'bold';
            wrap.style.fontSize = '12px';
        }

        let input = document.createElement('input');
        input.type = 'checkbox'; input.checked = checked;
        input.style.cssText = 'margin: 0 8px; cursor: pointer; transform: scale(1.1);';
        input.onchange = (e) => onChange(e.target.checked);

        wrap.appendChild(input); wrap.appendChild(document.createTextNode(label));
        return wrap;
    }

    // --- 2. اللوحة المدمجة (Inline Panel) ---
    function initMutationObserver() {
        const editPanelNode = document.getElementById('edit-panel');
        if (!editPanelNode) { setTimeout(initMutationObserver, 500); return; }
        const observer = new MutationObserver((mutations) => {
            for(let m of mutations) {
                if (m.type === 'childList' && m.addedNodes.length > 0) checkForTargetAndInject();
            }
        });
        observer.observe(editPanelNode, { childList: true, subtree: true });
    }

    function refreshInlinePanel() {
        const p = document.getElementById('aan-toolkit-panel');
        if (p) p.remove();
        checkForTargetAndInject();
    }

    function checkForTargetAndInject() {
        if (!settings.moduleEnabled) return;
        if (document.getElementById('aan-toolkit-panel')) return;
        const anchor = document.querySelector('.road-type-select') || document.querySelector('wz-select[name="roadType"]');
        if (anchor) anchor.parentNode.insertBefore(buildButtonsPanel(), anchor);
    }

    function buildButtonsPanel() {
        const t = TRANSLATIONS[settings.lang];
        const panel = document.createElement('div');
        panel.id = 'aan-toolkit-panel';
        panel.style.cssText = `margin-bottom: 8px; padding: 6px; background: #fff; border: 1px solid #d0d0d0; border-radius: 5px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05); direction: ${t.dir}; font-family: 'Arial', sans-serif;`;

        let headerRow = document.createElement('div');
        headerRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; border-bottom: 1px solid #f0f0f0; padding-bottom: 3px;';

        let toolName = document.createElement('span');
        toolName.innerText = t.moduleTitle;
        toolName.style.cssText = 'font-size: 11px; color: #2196f3; font-weight: 800;';
        headerRow.appendChild(toolName);

        let verSpan = document.createElement('span');
        verSpan.innerText = `v${GM_info.script.version}`;
        verSpan.style.cssText = 'font-size: 8px; color: #ccc;';
        headerRow.appendChild(verSpan);

        panel.appendChild(headerRow);

        const roadsData = [
            { k: 'St', v: 1, c: PALETTE.L1 }, { k: 'PS', v: 2, c: PALETTE.L2 },
            { k: 'mH', v: 7, c: PALETTE.L3 }, { k: 'MH', v: 6, c: PALETTE.L4 },
            { k: 'Fw', v: 3, c: PALETTE.L5 }, { k: 'Rmp', v: 4, c: PALETTE.Rmp },
            { k: 'PR', v: 17, c: PALETTE.PR }, { k: 'PLR', v: 20, c: PALETTE.PLR }
        ].filter(r => settings.roads[r.k]);

        if (roadsData.length > 0) {
            let rGrid = document.createElement('div');
            let cols = roadsData.length < 4 ? roadsData.length : 4;
            rGrid.style.cssText = `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 2px; margin-bottom: 6px;`;
            roadsData.forEach(r => {
                const loc = t.roads[r.k];
                let btn = createBtn(loc.btn, r.c.bg, r.c.txt, loc.tip);
                btn.style.fontSize = loc.btn.length > 5 ? '9px' : '10px';
                btn.onclick = (e) => { e.preventDefault(); applyUpdate({ roadType: r.v }); };
                rGrid.appendChild(btn);
            });
            panel.appendChild(rGrid);
        }

        const locksData = [
            { k: 'L1', v: 0, c: PALETTE.L1 }, { k: 'L2', v: 1, c: PALETTE.L2 },
            { k: 'L3', v: 2, c: PALETTE.L3 }, { k: 'L4', v: 3, c: PALETTE.L4 },
            { k: 'L5', v: 4, c: PALETTE.L5 }, { k: 'L6', v: 5, c: PALETTE.L6 }
        ].filter(l => settings.locks[l.k]);

        if (locksData.length > 0) {
            let lGrid = document.createElement('div');
            lGrid.style.cssText = 'display: flex; justify-content: space-between; gap: 2px;';
            locksData.forEach(l => {
                let btn = createBtn(l.k, l.c.bg, l.c.txt, `Lock Level ${l.v + 1}`);
                btn.style.flex = '1';
                btn.onclick = (e) => { e.preventDefault(); applyUpdate({ lockRank: l.v }); };
                lGrid.appendChild(btn);
            });
            panel.appendChild(lGrid);
        }

        return panel;
    }

    function createBtn(text, bg, color, tooltip) {
        let b = document.createElement('button');
        b.innerText = text; b.title = tooltip;
        b.style.cssText = `background: ${bg}; color: ${color}; border: 1px solid rgba(0,0,0,0.1); border-radius: 2px; padding: 0; cursor: pointer; font-weight: 800; font-family: 'Arial', sans-serif; min-height: 24px; width: 100%; transition: all 0.1s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 24px;`;
        b.onmouseover = () => b.style.filter = 'brightness(0.92)';
        b.onmouseout = () => b.style.filter = 'brightness(1)';
        return b;
    }

    function applyUpdate(changes) {
        if (!sdk) return;
        const selection = sdk.Editing.getSelection();
        if (!selection || selection.objectType !== 'segment' || selection.ids.length === 0) return;
        selection.ids.forEach(id => { try { sdk.DataModel.Segments.updateSegment({ segmentId: id, ...changes }); } catch (e) {} });
    }

    startScript();
})();