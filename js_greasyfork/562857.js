// ==UserScript==
// @name         abdullah abbas advanced inspector
// @namespace    https://github.com/abdullah-abbas/wme-scripts
// @version      2026.01.16.28
// @description  المفتش المتقدم - إصلاح شامل للاكتشاف ومسح الكاش
// @author       Abdullah Abbas
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562857/abdullah%20abbas%20advanced%20inspector.user.js
// @updateURL https://update.greasyfork.org/scripts/562857/abdullah%20abbas%20advanced%20inspector.meta.js
// ==/UserScript==

/* global W, OpenLayers */

(function() {
    'use strict';

    // --- إعدادات اللغة ---
    let currentLang = localStorage.getItem('aa-inspector-lang') || 'en-US';

    const translations = {
        'en-US': {
            inspector: "Inspector",
            settings: "Settings",
            results: "Results",
            scan_header: "Scan Options",
            opt_places: "🏢 Venues",
            opt_res: "🏠 Residential",
            opt_img: "🖼️ Images",
            opt_streets: "🛣️ Segments",
            opt_urs: "📩 URs (User)",
            opt_mps: "🤖 MPs (System)",
            opt_mcs: "💬 Comments",
            start_scan: "Scan Area",
            clean_msg: "✅ Clean Area",
            clean_desc: "No pending issues found.",
            count: "Count:",
            col_type: "Type",
            col_name: "Name",
            col_reason: "Issue",
            col_action: "Go",
            details_new: "New Place",
            details_edit: "Has Edits",
            details_img: "New Image",
            details_ur: "Update Req",
            details_mp: "Map Problem",
            details_mc: "Map Comment",
            details_unverified: "Unverified",
            details_open: "Open",
            lang_label: "Lang:",
            btn_text: "Inspector",
            req_zoom: "Req Zoom: 15",
            curr_zoom: "Cur Zoom:",
            rescan: "Re-scan 🔄",
            clear_btn: "Clear 🧹",
            zoom_err_msg: "Zoom too low (Min 15)",
            status_ready: "Ready",
            status_low: "Zoom In"
        },
        'ar-IQ': {
            inspector: "المفتش",
            settings: "الإعدادات",
            results: "النتائج",
            scan_header: "خيارات الفحص",
            opt_places: "🏢 الأماكن",
            opt_res: "🏠 المنازل",
            opt_img: "🖼️ الصور",
            opt_streets: "🛣️ الشوارع",
            opt_urs: "📩 البلاغات",
            opt_mps: "🤖 مشاكل النظام",
            opt_mcs: "💬 التعليقات",
            start_scan: "بدء الفحص",
            clean_msg: "✅ المنطقة نظيفة",
            clean_desc: "لا توجد مشاكل ظاهرة.",
            count: "العدد:",
            col_type: "النوع",
            col_name: "الاسم",
            col_reason: "السبب",
            col_action: "ذهاب",
            details_new: "مكان جديد",
            details_edit: "تعديل معلق",
            details_img: "صورة جديدة",
            details_ur: "تحديث مستخدم",
            details_mp: "مشكلة نظام",
            details_mc: "تعليق خريطة",
            details_unverified: "غير مؤكد",
            details_open: "مفتوح",
            lang_label: "اللغة:",
            btn_text: "المفتش",
            req_zoom: "التكبير المطلوب: 15",
            curr_zoom: "التكبير الحالي:",
            rescan: "إعادة الفحص 🔄",
            clear_btn: "مسح 🧹",
            zoom_err_msg: "الزوم منخفض (أقل شيء 15)",
            status_ready: "جاهز",
            status_low: "قرب أكثر"
        },
        'ku-IQ': {
            inspector: "پشکنەر",
            settings: "ڕێکخستن",
            results: "ئەنجام",
            scan_header: "Hەڵبژاردن",
            opt_places: "🏢 شوێن",
            opt_res: "🏠 ماڵ",
            opt_img: "🖼️ وێنە",
            opt_streets: "🛣️ شەقام",
            opt_urs: "📩 URs",
            opt_mps: "🤖 MPs",
            opt_mcs: "💬 Comments",
            start_scan: "پشکنین",
            clean_msg: "✅ پاکە",
            clean_desc: "کێشە نییە.",
            count: "ژمارە:",
            col_type: "جۆر",
            col_name: "ناو",
            col_reason: "هۆکار",
            col_action: "برۆ",
            details_new: "شوێنی نوێ",
            details_edit: "دەستکاری",
            details_img: "وێنەی نوێ",
            details_ur: "نوێکردنەوە",
            details_mp: "کێشەی سیستەم",
            details_mc: "Lêdwan",
            details_unverified: "پەسەند نەکراو",
            details_open: "کراوە",
            lang_label: "زمان:",
            btn_text: "پشکنەر",
            req_zoom: "Zoomî Dawakiraw: 15",
            curr_zoom: "Zoomî Êsta:",
            rescan: "Dubare 🔄",
            clear_btn: "Paqij 🧹",
            zoom_err_msg: "Asta zoom nizm e (Min 15)",
            status_ready: "Amade ye",
            status_low: "Nêzîk bike"
        }
    };

    function t(key) {
        return translations[currentLang][key] || key;
    }

    const savedOptions = JSON.parse(localStorage.getItem('aa-inspector-options'));
    let searchOptions = savedOptions || {
        places: true, residential: true, streets: true, urs: true, mps: true, mcs: true, images: true
    };

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

    // --- 1. الزر العائم المصغر ---
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
        dragHandle.title = "Drag";

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

    // --- 2. النافذة الموحدة ---
    function openUnifiedDashboard() {
        if (document.getElementById('aa-dashboard-panel')) return;

        const dir = (currentLang === 'en-US') ? 'ltr' : 'rtl';
        const align = (currentLang === 'en-US') ? 'left' : 'right';

        const currentZoom = W.map.getZoom();
        const isZoomOk = currentZoom >= 15;
        const zoomColor = isZoomOk ? '#27ae60' : '#c0392b';
        const commonStyle = "font-size:12px; line-height:1.6;";

        const htmlContent = `
            <div style="background:#f9f9f9; padding:6px 10px; border-bottom:1px solid #ddd; display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:11px; font-weight:bold; color:#7f8c8d;">${t('lang_label')}</span>
                <select id="aa-lang-select" style="padding:2px; font-size:11px; border-radius:3px; border:1px solid #ccc;">
                    <option value="ar-IQ" ${currentLang === 'ar-IQ' ? 'selected' : ''}>العربية</option>
                    <option value="ku-IQ" ${currentLang === 'ku-IQ' ? 'selected' : ''}>Kurdî</option>
                    <option value="en-US" ${currentLang === 'en-US' ? 'selected' : ''}>English</option>
                </select>
            </div>

            <div style="display:flex; border-bottom: 2px solid #ecf0f1; margin-bottom: 0;">
                <button id="tab-btn-settings" class="aa-tab-btn active" style="flex:1; padding:8px; background:none; border:none; border-bottom:3px solid #3498db; font-weight:bold; cursor:pointer; color:#2c3e50; font-size:12px;">⚙️ ${t('settings')}</button>
                <button id="tab-btn-results" class="aa-tab-btn" style="flex:1; padding:8px; background:none; border:none; border-bottom:3px solid transparent; font-weight:bold; cursor:pointer; color:#7f8c8d; font-size:12px;">📊 ${t('results')}</button>
            </div>

            <div id="tab-content-settings" style="display:block; direction:${dir}; text-align:${align}; padding: 10px;">

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <span style="${commonStyle} font-weight:bold; color:#2c3e50;">${t('scan_header')}</span>
                    <span style="${commonStyle} color:${zoomColor}; font-weight:bold;">${t('req_zoom')}</span>
                </div>

                <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px; ${commonStyle}">
                    <label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-places" ${searchOptions.places ? 'checked' : ''} style="margin:0 5px;"> ${t('opt_places')}</label>
                    <label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-res" ${searchOptions.residential ? 'checked' : ''} style="margin:0 5px;"> ${t('opt_res')}</label>
                    <label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-img" ${searchOptions.images ? 'checked' : ''} style="margin:0 5px;"> ${t('opt_img')}</label>
                    <label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-streets" ${searchOptions.streets ? 'checked' : ''} style="margin:0 5px;"> ${t('opt_streets')}</label>
                    <label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-urs" ${searchOptions.urs ? 'checked' : ''} style="margin:0 5px;"> ${t('opt_urs')}</label>
                    <label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-mps" ${searchOptions.mps ? 'checked' : ''} style="margin:0 5px;"> ${t('opt_mps')}</label>
                    <label style="cursor:pointer; display:flex; align-items:center;"><input type="checkbox" id="opt-mcs" ${searchOptions.mcs ? 'checked' : ''} style="margin:0 5px;"> ${t('opt_mcs')}</label>
                </div>

                <button id="aa-start-scan" style="width:100%; padding:8px; background:#27ae60; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; ${commonStyle}">${t('start_scan')} 🎯</button>
            </div>

            <div id="tab-content-results" style="display:none; height:calc(100% - 85px); direction:${dir};">
                <div id="results-container" style="height: 100%; overflow-y: auto;">
                    <div style="text-align:center; padding:20px; color:#bdc3c7;">
                        <p style="${commonStyle}">${t('start_scan')}</p>
                    </div>
                </div>
            </div>
        `;

        const body = createFloatingWindow('aa-dashboard-panel', t('inspector'), htmlContent);

        const langSelect = body.querySelector('#aa-lang-select');
        langSelect.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('aa-inspector-lang', currentLang);
            document.getElementById('aa-dashboard-panel').remove();
            createCompactToolbar();
            openUnifiedDashboard();
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
                searchOptions.urs = document.getElementById('opt-urs').checked;
                searchOptions.mps = document.getElementById('opt-mps').checked;
                searchOptions.mcs = document.getElementById('opt-mcs').checked;
                localStorage.setItem('aa-inspector-options', JSON.stringify(searchOptions));
            });
        });

        body.querySelector('#aa-start-scan').onclick = function() {
            runScanLogic(resultsContainer);
        };

        if(currentResults.length > 0) renderResultsTable(resultsContainer);
    }

    // --- 3. منطق الفحص (تحديث شامل ودقيق) ---
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

        // 1. الأماكن (Places/Venues)
        if (W.model.venues) {
            for (let id in W.model.venues.objects) {
                let v = W.model.venues.objects[id];
                let attr = v.attributes;
                let isRes = attr.residential;

                if (isRes && !searchOptions.residential) continue;
                if (!isRes && !searchOptions.places && !searchOptions.images) continue;

                let reasons = [];
                let color = "#2980b9";

                let isNew = !attr.approved;
                // فحص دقيق للتعديلات المعلقة
                let hasUnapprovedEdits = attr.unapprovedEdits || (v.getFlagAttributes && v.getFlagAttributes().unapprovedEdits);
                let hasUnapprovedImg = (attr.images || []).some(i => i.approved === false);
                // فحص طلبات التحديث (Requests)
                let hasReqs = (attr.requests && attr.requests.length > 0) || attr.hasOpenUpdateRequests;

                let checkAsPlace = (!isRes && searchOptions.places) || (isRes && searchOptions.residential);

                if (checkAsPlace) {
                    if (isNew) {
                        reasons.push(t('details_new'));
                    } else if (hasUnapprovedEdits) {
                        reasons.push(t('details_edit'));
                        color = "#8e44ad";
                    }
                }

                if (hasUnapprovedImg && searchOptions.images) {
                    reasons.push(t('details_img'));
                    color = "#d35400";
                }

                if (hasReqs && searchOptions.places) {
                    reasons.push(t('details_ur'));
                    color = "#e67e22";
                }

                if (reasons.length > 0) {
                    results.push({ obj: v, type: isRes ? "🏠" : "🏢", name: attr.name || (isRes ? "Home" : "---"), details: reasons.join("+"), color: color });
                }
            }
        }

        // 2. الشوارع (Segments)
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

        // 3. البلاغات (URs)
        if (searchOptions.urs && W.model.mapUpdateRequests) {
            for (let id in W.model.mapUpdateRequests.objects) {
                let ur = W.model.mapUpdateRequests.objects[id];
                if (ur.attributes.status === 0) {
                    results.push({ obj: ur, type: "📩", name: "UR #" + id, details: t('details_open'), color: "#e67e22" });
                }
            }
        }

        // 4. مشاكل النظام (MPs)
        if (searchOptions.mps && W.model.mapProblems) {
            for (let id in W.model.mapProblems.objects) {
                let mp = W.model.mapProblems.objects[id];
                if (mp.attributes.status === 0) {
                     results.push({ obj: mp, type: "🤖", name: "MP #" + id, details: t('details_mp'), color: "#c0392b" });
                }
            }
        }

        // 5. تعليقات الخارطة (Map Comments) - جديد
        if (searchOptions.mcs && W.model.mapComments) {
            for (let id in W.model.mapComments.objects) {
                let mc = W.model.mapComments.objects[id];
                // التعليقات عادة لا تملك status مثل URs، نظهرها جميعاً أو نتحقق من lock
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

        // Buttons
        const actionsHTML = `
        <div style="padding:15px 0; text-align:center; display:flex; gap:10px; justify-content:center;">
            <button id="aa-rescan-btn" style="background:#2980b9; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-weight:bold; ${commonStyle} box-shadow:0 2px 5px rgba(0,0,0,0.2); flex:1; max-width:120px;">${t('rescan')}</button>
            <button id="aa-clear-btn" style="background:#e74c3c; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-weight:bold; ${commonStyle} box-shadow:0 2px 5px rgba(0,0,0,0.2); flex:1; max-width:120px;">${t('clear_btn')}</button>
        </div>`;

        if (currentResults.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:30px 10px; color:#27ae60;">
                <h3 style="margin:0 0 10px 0; font-size:16px;">${t('clean_msg')}</h3>
                <p style="${commonStyle} color:#7f8c8d;">${t('clean_desc')}</p>
            </div>${actionsHTML}`;

            const rsBtn = container.querySelector('#aa-rescan-btn');
            if(rsBtn) rsBtn.onclick = () => runScanLogic(container);
            const clrBtn = container.querySelector('#aa-clear-btn');
            if(clrBtn) clrBtn.onclick = () => handleClear(container);
            return;
        }

        const statsHeader = `
            <div style="background: #ecf0f1; padding: 10px; border-radius: 4px; margin: 10px 0; display:flex; justify-content:space-between; align-items:center; border: 1px solid #bdc3c7;">
                <div style="font-weight:bold; color:#2c3e50; ${commonStyle}">
                    ${t('count')} <span style="background:#3498db; color:white; padding:2px 8px; border-radius:10px;">${currentResults.length}</span>
                </div>
                <div style="${commonStyle} color:#7f8c8d;">
                    ${t('curr_zoom')} <span style="font-weight:bold; color:${zoomColor};">${currentZoom}</span>
                </div>
            </div>
        `;

        let html = `<div style="padding:0 10px;">` + statsHeader + `</div>
            <table style="width:100%; border-collapse: collapse; background:white; ${commonStyle}">
                <thead style="background:#f1f2f6; position:sticky; top:0; z-index:1;"><tr>
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
        html += `</tbody></table>` + actionsHTML;

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
        if(W.selectionManager) W.selectionManager.unselectAll();
        renderResultsTable(container);
    }

    // --- الوظائف المساعدة ---
    function createFloatingWindow(id, title, contentHTML) {
        const existing = document.getElementById(id);
        if (existing) existing.remove();
        const dir = (currentLang === 'en-US') ? 'ltr' : 'rtl';

        const savedState = JSON.parse(localStorage.getItem('aa-dashboard-state')) || {};
        const width = savedState.width || "320px";
        const height = savedState.height || "400px";
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
            resize: ${isMin ? 'none' : 'both'}; overflow: hidden; min-width: 50px; min-height: 20px;
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
                <button class="aa-min-btn" title="Minimize" style="background:none; border:none; color:#ecf0f1; cursor:pointer; padding:0 8px; font-weight:bold; font-size:14px;">${isMin ? '□' : '_'}</button>
                <button class="aa-close-btn" title="Close" style="background:none; border:none; color:#ecf0f1; cursor:pointer; padding:0 8px; font-size:14px; font-weight:bold;">✕</button>
            </div>`;

        header.innerHTML = `<span style="font-weight:bold;">${title}</span>` + controls;

        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            .aa-close-btn:hover { background-color: #c0392b !important; border-radius: 3px; }
            .aa-min-btn:hover { background-color: #34495e !important; border-radius: 3px; }
            .aa-tab-btn:hover { background-color: #ecf0f1; }
        `;
        win.appendChild(styleTag);

        const body = document.createElement('div');
        body.className = 'aa-win-body';
        body.style.cssText = `padding: 0; overflow-y: auto; flex: 1; display: ${isMin ? 'none' : 'block'};`;
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
                body.style.display='block';
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
            } else if (elmnt.id === 'aa-dashboard-panel') {
                 const currentState = JSON.parse(localStorage.getItem('aa-dashboard-state')) || {};
                 currentState.top = elmnt.style.top;
                 currentState.left = elmnt.style.left;
                 localStorage.setItem('aa-dashboard-state', JSON.stringify(currentState));
            }
        }
    }

    bootstrap();
})();