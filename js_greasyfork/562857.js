// ==UserScript==
// @name         Abdullah Abbas WME Map Inspector
// @namespace    https://github.com/abdullah-abbas/wme-scripts
// @version      2026.01.17.14
// @description  مفتش الخريطة - كشف شامل لطلبات التحديث والأماكن الجديدة والصور
// @author       Abdullah Abbas
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562857/Abdullah%20Abbas%20WME%20Map%20Inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/562857/Abdullah%20Abbas%20WME%20Map%20Inspector.meta.js
// ==/UserScript==

/* global W, OpenLayers */

(function() {
    'use strict';

    const SCRIPT_VERSION = "2026.01.17.14";
    let currentLang = localStorage.getItem('aa-inspector-lang') || 'en-US';

    const translations = {
        'en-US': {
            inspector: "Map Inspector",
            settings: "Settings",
            results: "Results",
            scan_header: "Scan Options",
            start_scan: "Start Scanning",
            // --- Options Titles & Descriptions ---
            opt_places: "🏢 Venues",
            desc_places: "Stores & Public places.",
            opt_res: "🏠 Residential",
            desc_res: "Private home addresses.",
            opt_img: "🖼️ Images",
            desc_img: "New & updated photos.",
            opt_streets: "🛣️ Segments",
            desc_streets: "New unverified roads.",
            opt_mps: "🤖 Map Problems",
            desc_mps: "System reported errors.",
            opt_mcs: "💬 Map Comments",
            desc_mcs: "Editor notes on map.",
            opt_urs_group: "📩 Update Requests",
            desc_urs_group: "User reported issues.",
            opt_urs_all: "Enable URs",
            opt_urs_chat: "With Chat",
            opt_urs_no_chat: "No Chat",
            // --- Results & UI ---
            clean_msg: "✅ Clean Area",
            clean_desc: "No pending issues found.",
            count: "Count:",
            col_type: "Type",
            col_name: "Name",
            col_reason: "Issue",
            col_action: "Go",
            details_new: "New Place",
            details_new_img: "New + Img",
            details_edit: "Has Edits",
            details_img: "New Image",
            details_ur: "UR Open",
            details_ur_chat: "UR+Chat",
            details_ur_silent: "UR Silent",
            details_mp: "Map Problem",
            details_mc: "Map Comment",
            details_place_req: "Place Update",
            details_req_img: "Update+Img",
            details_unverified: "Unverified",
            lang_label: "Lang:",
            btn_text: "Inspector",
            req_zoom: "Zoom: 15+",
            curr_zoom: "Zoom Lvl:",
            rescan: "Re-scan 🔄",
            clear_btn: "Clear 🧹",
            zoom_err_msg: "Zoom too low (Min 15)",
            orientation_toggle: "Rotate",
            version: "Ver"
        },
        'ar-IQ': {
            inspector: "مفتش الخريطة",
            settings: "الإعدادات",
            results: "النتائج",
            scan_header: "خيارات الفحص",
            start_scan: "بدء الفحص",
            // --- العناوين والوصف ---
            opt_places: "🏢 الأماكن العامة",
            desc_places: "المتاجر والمعالم.",
            opt_res: "🏠 المنازل",
            desc_res: "العناوين السكنية.",
            opt_img: "🖼️ الصور",
            desc_img: "الصور الجديدة.",
            opt_streets: "🛣️ الشوارع",
            desc_streets: "طرق غير مؤكدة.",
            opt_mps: "🤖 مشاكل الخريطة",
            desc_mps: "أخطاء النظام.",
            opt_mcs: "💬 التعليقات",
            desc_mcs: "ملاحظات المحررين.",
            opt_urs_group: "📩 طلبات التحديث",
            desc_urs_group: "بلاغات المستخدمين.",
            opt_urs_all: "تفعيل البحث",
            opt_urs_chat: "مع محادثة",
            opt_urs_no_chat: "بدون محادثة",
            // --- النتائج والواجهة ---
            clean_msg: "✅ المنطقة نظيفة",
            clean_desc: "لا توجد مشاكل ظاهرة.",
            count: "العدد:",
            col_type: "النوع",
            col_name: "الاسم",
            col_reason: "السبب",
            col_action: "ذهاب",
            details_new: "مكان جديد",
            details_new_img: "جديد+صورة",
            details_edit: "تعديل معلق",
            details_img: "صورة جديدة",
            details_ur: "بلاغ مفتوح",
            details_ur_chat: "بلاغ ونقاش",
            details_ur_silent: "بلاغ صامت",
            details_mp: "مشكلة نظام",
            details_mc: "تعليق خريطة",
            details_place_req: "طلب تحديث",
            details_req_img: "تحديث+صورة",
            details_unverified: "غير مؤكد",
            lang_label: "اللغة:",
            btn_text: "المفتش",
            req_zoom: "التقريب: 15+",
            curr_zoom: "التقريب:",
            rescan: "إعادة الفحص 🔄",
            clear_btn: "مسح 🧹",
            zoom_err_msg: "التقريب منخفض (أقل شيء 15)",
            orientation_toggle: "تدوير",
            version: "إصدار"
        },
        'ku-IQ': {
            inspector: "پشکنەر",
            settings: "ڕێکخستن",
            results: "ئەنجام",
            scan_header: "هەڵبژاردنەکان",
            start_scan: "دەستپێکردن",
            // --- Titles & Desc ---
            opt_places: "🏢 شوێنە گشتییەکان",
            desc_places: "شوێنە بازرگانییەکان.",
            opt_res: "🏠 ماڵەکان",
            desc_res: "ناونیشانی ماڵان.",
            opt_img: "🖼️ وێنەکان",
            desc_img: "وێنە نوێکان.",
            opt_streets: "🛣️ شەقامەکان",
            desc_streets: "شەقامە نوێیەکان.",
            opt_mps: "🤖 کێشەی نەخشە",
            desc_mps: "هەڵەکانی سیستەم.",
            opt_mcs: "💬 لێدوانەکان",
            desc_mcs: "تێبینی دەستکاریکەر.",
            opt_urs_group: "📩 سکاڵاکان",
            desc_urs_group: "داواکاری نوێکردنەوە.",
            opt_urs_all: "چالاککردن",
            opt_urs_chat: "لەگەڵ چات",
            opt_urs_no_chat: "بێ چات",
            // --- UI ---
            clean_msg: "✅ ناوچەکە پاکە",
            clean_desc: "هیچ کێشەیەکی دیار نییە.",
            count: "ژمارە:",
            col_type: "جۆر",
            col_name: "ناو",
            col_reason: "هۆکار",
            col_action: "بڕۆ",
            details_new: "شوێنی نوێ",
            details_new_img: "نوێ+وێنە",
            details_edit: "دەستکاری",
            details_img: "وێنەی نوێ",
            details_ur: "سکاڵای کراوە",
            details_ur_chat: "سکاڵا+چات",
            details_ur_silent: "سکاڵای بێدەنگ",
            details_mp: "کێشەی سیستەم",
            details_mc: "لێدوانی نەخشە",
            details_place_req: "داواکاری نوێ",
            details_req_img: "نوێ+وێنە",
            details_unverified: "پەسەند نەکراو",
            lang_label: "زمان:",
            btn_text: "پشکنەر",
            req_zoom: "زووم: 15+",
            curr_zoom: "زووم:",
            rescan: "دووبارە 🔄",
            clear_btn: "پاککردنەوە 🧹",
            zoom_err_msg: "زووم نزمە (لانی کەم 15)",
            orientation_toggle: "سوڕاندن",
            version: "وەشان"
        }
    };

    function t(key) {
        return translations[currentLang][key] || key;
    }

    const defaultOptions = {
        places: true, residential: true, images: true,
        streets: true, mps: true, mcs: true,
        urs: true, urs_chat: true, urs_no_chat: true
    };

    const savedOptions = JSON.parse(localStorage.getItem('aa-inspector-options'));
    let searchOptions = savedOptions || defaultOptions;

    if (!savedOptions || typeof searchOptions.urs_chat === 'undefined') {
        searchOptions = { ...defaultOptions, ...searchOptions };
        searchOptions.urs_chat = true;
        searchOptions.urs_no_chat = true;
    }

    let isLandscape = localStorage.getItem('aa-inspector-orientation') !== 'false';
    let currentResults = [];

    function bootstrap() {
        if (typeof W === 'undefined' || typeof W.map === 'undefined') {
            setTimeout(bootstrap, 500);
            return;
        }
        init();
    }

    function init() {
        createCompactToolbar();
    }

    function createCompactToolbar() {
        const toolbarId = 'aa-main-toolbar';
        const existing = document.getElementById(toolbarId);
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = toolbarId;

        const savedPos = JSON.parse(localStorage.getItem('aa-toolbar-pos'));
        let posStyle = "";
        if (savedPos && savedPos.top && savedPos.left) {
            posStyle = `top: ${savedPos.top}; left: ${savedPos.left}; transform: none;`;
        } else {
            posStyle = `top: 10px; left: 50%; transform: translateX(-50%);`;
        }

        container.style.cssText = `
            position: fixed; ${posStyle}
            background: #2c3e50; border-radius: 50px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.4);
            display: flex; align-items: center; padding: 2px 8px 2px 4px;
            z-index: 10000; font-family: 'Rubik', sans-serif;
            border: 1px solid rgba(255,255,255,0.2);
            height: 26px;
        `;

        const dragHandle = document.createElement('div');
        dragHandle.innerHTML = '⋮';
        dragHandle.style.cssText = `
            cursor: move; color: #bdc3c7; font-size: 16px; margin-right: 4px;
            user-select: none; line-height: 26px; padding: 0 4px; font-weight: bold;
        `;

        const btn = document.createElement('button');
        btn.innerHTML = `<span style="margin-right:4px; font-size:12px;">🕵️</span>${t('btn_text')}`;
        btn.style.cssText = `
            background: none; border: none; color: white; font-weight: bold;
            font-family: inherit; font-size: 11px; cursor: pointer; padding: 0;
            line-height: 1; margin-top: 1px;
        `;

        btn.onclick = () => openUnifiedDashboard();

        container.appendChild(dragHandle);
        container.appendChild(btn);
        document.body.appendChild(container);

        makeDraggable(container, dragHandle);
    }

    function createOptionItem(id, title, desc, checked) {
        return `
            <div style="background:white; border-radius:5px; padding:6px; box-shadow:0 1px 2px rgba(0,0,0,0.05); border:1px solid #eee; display:flex; align-items:flex-start;">
                <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} style="margin-top:4px; margin-inline-end: 8px; cursor:pointer;">
                <div style="flex:1;">
                    <label for="${id}" style="font-weight:bold; font-size:12px; color:#2c3e50; cursor:pointer; display:block;">${title}</label>
                    <div style="font-size:10px; color:#95a5a6; margin-top:2px; line-height:1.2;">${desc}</div>
                </div>
            </div>
        `;
    }

    function openUnifiedDashboard() {
        if (document.getElementById('aa-dashboard-panel-v2')) return;
        const oldVer = document.getElementById('aa-dashboard-panel');
        if(oldVer) oldVer.remove();

        const dir = (currentLang === 'en-US') ? 'ltr' : 'rtl';
        const align = (currentLang === 'en-US') ? 'left' : 'right';

        const currentZoom = W.map.getZoom();
        const isZoomOk = currentZoom >= 15;
        const zoomColor = isZoomOk ? '#27ae60' : '#c0392b';
        const commonStyle = "font-size:11px; line-height:1.6;";

        const gridStyle = isLandscape
            ? "display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;"
            : "display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;";

        const htmlContent = `
            <div style="background:#f9f9f9; padding:8px 10px; border-bottom:1px solid #ddd; display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:11px; font-weight:bold; color:#7f8c8d;">${t('lang_label')}</span>
                <select id="aa-lang-select" style="padding:2px 5px; font-size:11px; border-radius:3px; border:1px solid #ccc; background:white; font-family:tahoma, sans-serif;">
                    <option value="ar-IQ" ${currentLang === 'ar-IQ' ? 'selected' : ''}>العربية</option>
                    <option value="en-US" ${currentLang === 'en-US' ? 'selected' : ''}>English</option>
                    <option value="ku-IQ" ${currentLang === 'ku-IQ' ? 'selected' : ''}>کوردی (سۆرانی)</option>
                </select>
            </div>

            <div style="display:flex; border-bottom: 2px solid #ecf0f1; margin-bottom: 0;">
                <button id="tab-btn-settings" class="aa-tab-btn active" style="flex:1; padding:8px; background:none; border:none; border-bottom:3px solid #3498db; font-weight:bold; cursor:pointer; color:#2c3e50; font-size:12px;">⚙️ ${t('settings')}</button>
                <button id="tab-btn-results" class="aa-tab-btn" style="flex:1; padding:8px; background:none; border:none; border-bottom:3px solid transparent; font-weight:bold; cursor:pointer; color:#7f8c8d; font-size:12px;">📊 ${t('results')}</button>
            </div>

            <div id="tab-content-settings" style="display:block; direction:${dir}; text-align:${align}; padding: 10px; flex:1; overflow-y:auto; background:#f4f6f7;">

                <button id="aa-start-scan" style="width:100%; padding:12px; background:#27ae60; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:13px; margin-bottom:15px; box-shadow:0 2px 4px rgba(0,0,0,0.1); transition: background 0.3s;">${t('start_scan')} 🚀</button>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; background:white; padding:8px; border-radius:4px; border:1px solid #eee;">
                    <span style="${commonStyle} font-weight:bold; color:#2c3e50;">${t('scan_header')}</span>
                    <span style="${commonStyle} color:${zoomColor}; font-weight:bold; background:#ecf0f1; padding:2px 6px; border-radius:4px;">${t('req_zoom')}</span>
                </div>

                <div style="${gridStyle} margin-bottom:15px; ${commonStyle}">
                    ${createOptionItem('opt-places', t('opt_places'), t('desc_places'), searchOptions.places)}
                    ${createOptionItem('opt-res', t('opt_res'), t('desc_res'), searchOptions.residential)}
                    ${createOptionItem('opt-img', t('opt_img'), t('desc_img'), searchOptions.images)}
                    ${createOptionItem('opt-streets', t('opt_streets'), t('desc_streets'), searchOptions.streets)}
                    ${createOptionItem('opt-mps', t('opt_mps'), t('desc_mps'), searchOptions.mps)}
                    ${createOptionItem('opt-mcs', t('opt_mcs'), t('desc_mcs'), searchOptions.mcs)}
                </div>

                <div style="background:white; border-radius:5px; padding:8px; border:1px solid #eee; margin-top:5px;">
                    <div style="display:flex; align-items:center; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:5px;">
                         <input type="checkbox" id="opt-urs" ${searchOptions.urs ? 'checked' : ''} style="margin-inline-end: 8px;">
                         <div>
                            <div style="font-weight:bold; color:#e67e22;">${t('opt_urs_group')}</div>
                            <div style="font-size:10px; color:#95a5a6;">${t('desc_urs_group')}</div>
                         </div>
                    </div>
                    <div style="display:flex; gap:15px; padding-inline-start: 22px;">
                        <label style="font-size:11px; cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-urs-chat" ${searchOptions.urs_chat ? 'checked' : ''} style="margin:0 4px;"> ${t('opt_urs_chat')}</label>
                        <label style="font-size:11px; cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-urs-no-chat" ${searchOptions.urs_no_chat ? 'checked' : ''} style="margin:0 4px;"> ${t('opt_urs_no_chat')}</label>
                    </div>
                </div>

                <div style="text-align:center; margin-top:20px; color:#bdc3c7; font-size:10px;">
                    ${t('version')}: ${SCRIPT_VERSION}
                </div>
            </div>

            <div id="tab-content-results" style="display:none; height:calc(100% - 85px); direction:${dir};">
                <div id="results-container" style="height: 100%; overflow-y: auto;">
                    <div style="text-align:center; padding:20px; color:#bdc3c7;">
                        <p style="${commonStyle}">${t('start_scan')}</p>
                    </div>
                </div>
            </div>
        `;

        const body = createFloatingWindow('aa-dashboard-panel-v2', t('inspector'), htmlContent);

        body.querySelector('#aa-lang-select').addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('aa-inspector-lang', currentLang);
            refreshDashboard();
        });

        const btnSettings = body.querySelector('#tab-btn-settings');
        const btnResults = body.querySelector('#tab-btn-results');
        const contentSettings = body.querySelector('#tab-content-settings');
        const contentResults = body.querySelector('#tab-content-results');
        const resultsContainer = body.querySelector('#results-container');

        window.aaSwitchTab = function(tabName) {
            if (tabName === 'settings') {
                contentSettings.style.display = 'block';
                contentResults.style.display = 'none';
                btnSettings.style.borderBottomColor = '#3498db';
                btnSettings.style.color = '#2c3e50';
                btnResults.style.borderBottomColor = 'transparent';
                btnResults.style.color = '#7f8c8d';
            } else {
                contentSettings.style.display = 'none';
                contentResults.style.display = 'block';
                btnSettings.style.borderBottomColor = 'transparent';
                btnSettings.style.color = '#7f8c8d';
                btnResults.style.borderBottomColor = '#3498db';
                btnResults.style.color = '#2c3e50';
            }
        };

        btnSettings.onclick = () => window.aaSwitchTab('settings');
        btnResults.onclick = () => window.aaSwitchTab('results');

        const checkboxes = body.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                searchOptions.places = document.getElementById('opt-places').checked;
                searchOptions.residential = document.getElementById('opt-res').checked;
                searchOptions.images = document.getElementById('opt-img').checked;
                searchOptions.streets = document.getElementById('opt-streets').checked;
                searchOptions.mps = document.getElementById('opt-mps').checked;
                searchOptions.mcs = document.getElementById('opt-mcs').checked;
                searchOptions.urs = document.getElementById('opt-urs').checked;
                searchOptions.urs_chat = document.getElementById('opt-urs-chat').checked;
                searchOptions.urs_no_chat = document.getElementById('opt-urs-no-chat').checked;
                localStorage.setItem('aa-inspector-options', JSON.stringify(searchOptions));
            });
        });

        body.querySelector('#aa-start-scan').onclick = function() {
            runScanLogic(resultsContainer);
        };

        if(currentResults.length > 0) renderResultsTable(resultsContainer);
    }

    function refreshDashboard() {
        const p = document.getElementById('aa-dashboard-panel-v2');
        if(p) p.remove();
        openUnifiedDashboard();
    }

    function hasImageInRequests(reqs) {
        if (!reqs || !Array.isArray(reqs) || reqs.length === 0) return false;
        return reqs.some(r => {
            if (r.imageURL || r.thumbnailURL) return true;
            if (r.attributes) {
                if (r.attributes.imageURL || r.attributes.thumbnailURL) return true;
                if (r.attributes.type === 'IMAGE' || r.attributes.subType === 'IMAGE') return true;
            }
            return false;
        });
    }

    function runScanLogic(containerElement) {
        window.aaSwitchTab('results');
        const commonStyle = "font-size:12px; line-height:1.5;";

        if (W.map.getZoom() < 15) {
            containerElement.innerHTML = `
                <div style="text-align:center; padding:30px 10px; color:#c0392b;">
                    <div style="font-size:24px; margin-bottom:10px;">⚠️</div>
                    <h4 style="margin:0; ${commonStyle}">${t('zoom_err_msg')}</h4>
                    <div style="margin-top:20px;">
                        <button id="aa-rescan-btn-err" style="background:#2980b9; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-weight:bold; ${commonStyle} box-shadow:0 2px 5px rgba(0,0,0,0.2);">${t('rescan')}</button>
                    </div>
                </div>
            `;
            const btn = containerElement.querySelector('#aa-rescan-btn-err');
            if(btn) btn.onclick = () => runScanLogic(containerElement);
            return;
        }

        const results = [];

        // 1. Places
        if (W.model.venues) {
            for (let id in W.model.venues.objects) {
                let v = W.model.venues.objects[id];
                let attr = v.attributes;
                let isRes = attr.residential;

                let isNew = !attr.approved;
                let hasUnapprovedEdits = (attr.unapprovedEdits === true) || (v.getFlagAttributes && v.getFlagAttributes().unapprovedEdits);
                let requests = attr.requests || [];
                let hasUpdateReq = (requests.length > 0) || (attr.hasOpenUpdateRequests === true);
                let rawImages = attr.images || [];
                let hasNewImgInList = rawImages.some(i => i.approved === false);
                let hasImgInReq = hasImageInRequests(requests);
                let isNewWithImg = isNew && (rawImages.length > 0);
                let hasAnyImage = hasNewImgInList || hasImgInReq || isNewWithImg;

                let reasons = [];
                let color = "#2980b9";
                let showThis = false;

                if (searchOptions.images && hasAnyImage) {
                    showThis = true;
                    color = "#d35400";
                    if (isNewWithImg) reasons.push(t('details_new_img'));
                    else if (hasImgInReq) reasons.push(t('details_req_img'));
                    else reasons.push(t('details_img'));
                }

                let wantThisType = (isRes && searchOptions.residential) || (!isRes && searchOptions.places);

                if (wantThisType) {
                    if (isNew) {
                         if (!reasons.includes(t('details_new_img'))) {
                             reasons.push(t('details_new'));
                             if(!showThis) color = "#2980b9";
                             showThis = true;
                         }
                    } else if (hasUnapprovedEdits) {
                        reasons.push(t('details_edit'));
                        if(!showThis) color = "#8e44ad";
                        showThis = true;
                    }
                    if (hasUpdateReq) {
                         if (!reasons.includes(t('details_req_img')) && !reasons.includes(t('details_new_img'))) {
                             reasons.push(t('details_place_req'));
                             if(!showThis) color = "#e67e22";
                             showThis = true;
                         }
                    }
                }

                if (showThis && reasons.length > 0) {
                    let uniqueReasons = [...new Set(reasons)];
                    results.push({
                        obj: v,
                        type: isRes ? "🏠" : "🏢",
                        name: attr.name || (isRes ? "Home" : "---"),
                        details: uniqueReasons.join(" + "),
                        color: color
                    });
                }
            }
        }

        // 2. Streets
        if (searchOptions.streets && W.model.segments) {
            for (let id in W.model.segments.objects) {
                let s = W.model.segments.objects[id];
                if (s.attributes.unverified) {
                    let stName = "---";
                    try { let st = W.model.streets.get(s.attributes.primaryStreetID); if(st) stName = st.name || "---"; } catch(e) {}
                    results.push({ obj: s, type: "🛣️", name: stName, details: t('details_unverified'), color: "#c0392b" });
                }
            }
        }

        // 3. URs
        if (searchOptions.urs && W.model.mapUpdateRequests) {
            for (let id in W.model.mapUpdateRequests.objects) {
                let ur = W.model.mapUpdateRequests.objects[id];
                if (ur.attributes.status === 0) {
                    let conv = ur.attributes.conversation;
                    let hasComments = conv && Array.isArray(conv) && conv.length > 0;

                    let shouldShow = false;
                    if (hasComments && searchOptions.urs_chat) shouldShow = true;
                    if (!hasComments && searchOptions.urs_no_chat) shouldShow = true;

                    if (shouldShow) {
                        let desc = hasComments ? t('details_ur_chat') : t('details_ur_silent');
                        let color = hasComments ? "#e67e22" : "#f39c12";
                        results.push({ obj: ur, type: "📩", name: "UR #" + id, details: desc, color: color });
                    }
                }
            }
        }

        // 4. MPs
        if (searchOptions.mps && W.model.mapProblems) {
            for (let id in W.model.mapProblems.objects) {
                let mp = W.model.mapProblems.objects[id];
                if (mp.attributes.status === 0) {
                     results.push({ obj: mp, type: "🤖", name: "MP #" + id, details: t('details_mp'), color: "#c0392b" });
                }
            }
        }

        // 5. Map Comments
        if (searchOptions.mcs && W.model.mapComments) {
            for (let id in W.model.mapComments.objects) {
                let mc = W.model.mapComments.objects[id];
                results.push({ obj: mc, type: "💬", name: mc.attributes.subject || "Comment", details: t('details_mc'), color: "#16a085" });
            }
        }

        currentResults = results;
        renderResultsTable(containerElement);
    }

    function renderResultsTable(container) {
        const align = (currentLang === 'en-US') ? 'left' : 'right';
        const currentZoom = W.map.getZoom();
        const minZoom = 15;
        const zoomColor = currentZoom >= minZoom ? '#27ae60' : '#c0392b';
        const commonStyle = "font-size:12px; line-height:1.4;";

        const actionsHTML = `
        <div style="padding:10px 5px; text-align:center; display:flex; gap:10px; justify-content:center; background:#fff; border-bottom:1px solid #eee; position:sticky; top:0; z-index:10;">
            <button id="aa-rescan-btn" style="background:#2980b9; color:white; border:none; padding:6px 15px; border-radius:4px; cursor:pointer; font-weight:bold; ${commonStyle} box-shadow:0 2px 3px rgba(0,0,0,0.1); flex:1;">${t('rescan')}</button>
            <button id="aa-clear-btn" style="background:#e74c3c; color:white; border:none; padding:6px 15px; border-radius:4px; cursor:pointer; font-weight:bold; ${commonStyle} box-shadow:0 2px 3px rgba(0,0,0,0.1); flex:1;">${t('clear_btn')}</button>
        </div>`;

        if (currentResults.length === 0) {
            container.innerHTML = actionsHTML + `<div style="text-align:center; padding:30px 10px; color:#27ae60;">
                <h3 style="margin:0 0 10px 0; font-size:16px;">${t('clean_msg')}</h3>
                <p style="${commonStyle} color:#7f8c8d;">${t('clean_desc')}</p>
            </div>`;

            const rsBtn = container.querySelector('#aa-rescan-btn');
            if(rsBtn) rsBtn.onclick = () => runScanLogic(container);
            const clrBtn = container.querySelector('#aa-clear-btn');
            if(clrBtn) clrBtn.onclick = () => handleClear(container);
            return;
        }

        const statsHeader = `
            <div style="background: #ecf0f1; padding: 8px; border-radius: 4px; margin: 5px 10px; display:flex; justify-content:space-between; align-items:center; border: 1px solid #bdc3c7;">
                <div style="font-weight:bold; color:#2c3e50; ${commonStyle}">
                    ${t('count')} <span style="background:#3498db; color:white; padding:1px 6px; border-radius:10px;">${currentResults.length}</span>
                </div>
                <div style="${commonStyle} color:#7f8c8d;">
                    ${t('curr_zoom')} <span style="font-weight:bold; color:${zoomColor};">${currentZoom}</span>
                </div>
            </div>
        `;

        let html = actionsHTML + statsHeader +
            `<table style="width:100%; border-collapse: collapse; background:white; ${commonStyle}">
                <thead style="background:#f1f2f6; position:sticky; top:45px; z-index:5;"><tr>
                    <th style="padding:8px; text-align:${align}; border-bottom:2px solid #ddd;">${t('col_type')}</th>
                    <th style="padding:8px; text-align:${align}; border-bottom:2px solid #ddd;">${t('col_name')}</th>
                    <th style="padding:8px; text-align:${align}; border-bottom:2px solid #ddd;">${t('col_reason')}</th>
                    <th style="padding:8px; text-align:center; border-bottom:2px solid #ddd;">${t('col_action')}</th>
                </tr></thead><tbody>`;
        currentResults.forEach((item, i) => {
            html += `<tr style="border-bottom:1px solid #eee;">
                <td style="padding:8px; text-align:${align};">${item.type}</td>
                <td style="padding:8px; font-weight:bold; color:#2c3e50; text-align:${align};">${item.name}</td>
                <td style="padding:8px; color:${item.color}; text-align:${align};">${item.details}</td>
                <td style="padding:8px; text-align:center;"><button class="aa-go-btn" data-idx="${i}" style="background:#27ae60; color:white; border:none; padding:4px 10px; border-radius:3px; cursor:pointer; font-size:11px;">🎯</button></td>
            </tr>`;
        });
        html += `</tbody></table>`;

        container.innerHTML = html;

        const btns = container.querySelectorAll('.aa-go-btn');
        btns.forEach(b => {
            b.addEventListener('click', (e) => {
                const item = currentResults[e.target.getAttribute('data-idx')];
                W.selectionManager.setSelectedModels(item.obj);
                let centerPt = item.obj.geometry.getCentroid();
                if (centerPt) W.map.setCenter(new OpenLayers.LonLat(centerPt.x, centerPt.y));
            });
        });

        const rsBtn = container.querySelector('#aa-rescan-btn');
        if(rsBtn) rsBtn.onclick = () => runScanLogic(container);

        const clrBtn = container.querySelector('#aa-clear-btn');
        if(clrBtn) clrBtn.onclick = () => handleClear(container);
    }

    function handleClear(container) {
        currentResults = [];
        try {
            if (W.selectionManager && typeof W.selectionManager.unselectAll === 'function') {
                W.selectionManager.unselectAll();
            }
        } catch (e) {
            console.error("AA Inspector: Clear error ignored", e);
        }
        renderResultsTable(container);
    }

    function createFloatingWindow(id, title, contentHTML) {
        const existing = document.getElementById(id);
        if (existing) existing.remove();
        const dir = (currentLang === 'en-US') ? 'ltr' : 'rtl';

        const landscapeDims = { w: "750px", h: "500px" };
        const portraitDims = { w: "400px", h: "580px" };
        const currentDims = isLandscape ? landscapeDims : portraitDims;

        const savedState = JSON.parse(localStorage.getItem('aa-dashboard-state')) || {};
        const width = savedState.width || currentDims.w;
        const height = savedState.height || currentDims.h;
        const top = savedState.top || "80px";
        const left = savedState.left || "100px";
        const isMin = savedState.minimized || false;

        const win = document.createElement('div');
        win.id = id;
        win.style.cssText = `
            position: fixed; top: ${top}; left: ${left};
            width: ${isMin ? '160px' : width}; height: ${isMin ? '28px' : height};
            background: #ffffff; border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: flex; flex-direction: column;
            z-index: 10000; font-family: 'Rubik', sans-serif; direction: ${dir};
            resize: ${isMin ? 'none' : 'both'}; overflow: hidden; min-width: 250px; min-height: 20px;
            border: 1px solid #bdc3c7;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: #2c3e50; color: #ecf0f1; padding: 6px 10px;
            cursor: move; display: flex; justify-content: space-between; align-items: center;
            user-select: none; flex-shrink: 0; font-size: 13px;
        `;

        const controls = `
            <div style="display:flex; gap:0;">
                <button class="aa-rotate-btn" title="${t('orientation_toggle')}" style="background:none; border:none; color:#ecf0f1; cursor:pointer; padding:0 8px; font-weight:bold; font-size:14px;">⟲</button>
                <button class="aa-min-btn" title="Minimize" style="background:none; border:none; color:#ecf0f1; cursor:pointer; padding:0 8px; font-weight:bold; font-size:14px;">${isMin ? '□' : '_'}</button>
                <button class="aa-close-btn" title="Close" style="background:none; border:none; color:#ecf0f1; cursor:pointer; padding:0 8px; font-size:14px; font-weight:bold;">✕</button>
            </div>`;

        header.innerHTML = `<span style="font-weight:bold;">${title}</span>` + controls;

        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            .aa-close-btn:hover { background-color: #c0392b !important; border-radius: 3px; }
            .aa-min-btn:hover { background-color: #34495e !important; border-radius: 3px; }
            .aa-rotate-btn:hover { background-color: #27ae60 !important; border-radius: 3px; }
            .aa-tab-btn:hover { background-color: #ecf0f1; }
        `;
        win.appendChild(styleTag);

        const body = document.createElement('div');
        body.className = 'aa-win-body';
        body.style.cssText = `padding: 0; overflow-y: hidden; flex: 1; display: ${isMin ? 'none' : 'flex'}; flex-direction:column;`;
        body.innerHTML = contentHTML;

        win.appendChild(header);
        win.appendChild(body);
        document.body.appendChild(win);

        makeDraggable(win, header);

        const saveState = () => {
             const state = {
                top: win.style.top,
                left: win.style.left,
                width: isMin ? savedState.width : win.style.width,
                height: isMin ? savedState.height : win.style.height,
                minimized: isMin
            };
            localStorage.setItem('aa-dashboard-state', JSON.stringify(state));
        };

        win.addEventListener('mouseup', () => {
            if(!isMin) saveState();
        });

        header.querySelector('.aa-close-btn').onclick = () => win.remove();

        header.querySelector('.aa-rotate-btn').onclick = () => {
            isLandscape = !isLandscape;
            localStorage.setItem('aa-inspector-orientation', isLandscape);
            const newDims = isLandscape ? landscapeDims : portraitDims;
            win.style.width = newDims.w;
            win.style.height = newDims.h;
            saveState();
            refreshDashboard();
        };

        const minBtn = header.querySelector('.aa-min-btn');
        let oldH = height, oldW = width;

        minBtn.onclick = () => {
            if (!isMin) {
                oldH = win.style.height; oldW = win.style.width;
                body.style.display='none';
                win.style.height='28px'; win.style.width='160px';
                win.style.resize='none';
                minBtn.innerHTML='□';
                isMin = true;
            } else {
                body.style.display='flex';
                win.style.height=oldH; win.style.width=oldW;
                win.style.resize='both';
                minBtn.innerHTML='_';
                isMin = false;
            }
            saveState();
        };

        return body;
    }

    function makeDraggable(elmnt, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            if(e.button === 2) return;
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            elmnt.style.transform = 'none';
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null;
            if (elmnt.id === 'aa-main-toolbar') {
                localStorage.setItem('aa-toolbar-pos', JSON.stringify({ top: elmnt.style.top, left: elmnt.style.left }));
            } else if (elmnt.id === 'aa-dashboard-panel-v2') {
                 const currentState = JSON.parse(localStorage.getItem('aa-dashboard-state')) || {};
                 currentState.top = elmnt.style.top;
                 currentState.left = elmnt.style.left;
                 localStorage.setItem('aa-dashboard-state', JSON.stringify(currentState));
            }
        }
    }

    bootstrap();
})();