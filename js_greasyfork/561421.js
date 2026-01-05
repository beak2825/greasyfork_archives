// ==UserScript==
// @name                Abdullah Abbas WME Tools
// @namespace           https://greasyfork.org/users/abdullah-abbas
// @description         Stable WME Suite: RA Editor + QA Scanner + Speed Visualizer (No Selection) (V1.12)
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/editor*
// @version             2026.01.04.12
// @grant               none
// @author              Abdullah Abbas
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/561421/Abdullah%20Abbas%20WME%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/561421/Abdullah%20Abbas%20WME%20Tools.meta.js
// ==/UserScript==

/*
 * Abdullah Abbas WME Tools
 * Version: 2026.01.04.12 (V1.12)
 * Base: Stable V1.7 (2026.01.04.8).
 * Feature: "Speed Indicator" now ONLY draws icons. It does NOT select segments.
 */

(function() {
    'use strict';

    // ===========================================================================
    //  GLOBAL CONFIGURATION
    // ===========================================================================
    const SCRIPT_NAME = "Abdullah Abbas WME Tools";
    const SCRIPT_VERSION = "2026.01.04.12";
    const DEFAULT_W = "340px";
    const DEFAULT_H = "480px";

    const STRINGS = {
        'ar-IQ': {
            main_title: 'أدوات عبدالله عباس',
            btn_city: 'مستكشف المدن', btn_places: 'مستكشف الأماكن',
            btn_editors: 'مستكشف المحررين', btn_ra: 'تعديل الدوار', btn_lock: 'مؤشر القفل', btn_qa: 'فحص الأخطاء', btn_speed: 'مؤشر السرعة',
            win_city: 'مستكشف المدن', win_places: 'مستكشف الأماكن',
            win_editors: 'مستكشف المحررين', win_ra: 'تعديل الدوار', win_lock: 'مؤشر القفل', win_qa: 'فحص الأخطاء الهندسية', win_speed: 'مؤشر السرعة (رسم فقط)',
            common_scan: 'بحث', common_clear: 'مسح', common_close: 'إغلاق', common_ready: 'جاهز للتعديل',
            ph_city: 'اسم المدينة...', ph_place: 'اسم المكان...', ph_user: 'اسم المحرر...',
            lbl_days: 'عدد الأيام (0 = الكل)', lbl_enable: 'تفعيل',
            ra_in: 'تصغير (-)', ra_out: 'تكبير (+)', ra_err: 'حدد دوار لتفعيله', unit_m: 'م',
            city_no_name: 'بدون مدينة', no_results: 'لا توجد نتائج',
            // QA Strings
            qa_lbl_short: 'مقاطع قصيرة (أقل من):',
            qa_lbl_disc: 'مقاطع غير متصلة:',
            qa_lbl_cross: 'تقاطعات نفس المستوى (بدون عقدة)',
            qa_lbl_distort: 'طرق مشوهة (التواءات وتموجات)',
            qa_opt_dead: 'جهة واحدة (نهاية مسدودة)',
            qa_opt_float: 'جهتين (طريق عائم)',
            qa_res_found: 'تم تحديد:',
            qa_res_scanning: 'جاري الفحص...',
            qa_msg_zoom: '⚠️ المنطقة واسعة جداً! الرجاء التقريب (Zoom In) لفحص التقاطعات.'
        },
        'en-US': {
            main_title: 'Abdullah Abbas WME Tools',
            btn_city: 'City Explorer', btn_places: 'Places Explorer',
            btn_editors: 'Editor Explorer', btn_ra: 'Roundabout Editor', btn_lock: 'Lock Indicator', btn_qa: 'QA Scanner', btn_speed: 'Speed Indicator',
            win_city: 'City Explorer', win_places: 'Places Explorer',
            win_editors: 'Editor Explorer', win_ra: 'Roundabout Editor', win_lock: 'Lock Indicator', win_qa: 'QA Scanner', win_speed: 'Speed Indicator (Draw Only)',
            common_scan: 'Scan', common_clear: 'Clear', common_close: 'Close', common_ready: 'Ready',
            ph_city: 'City Name...', ph_place: 'Place Name...', ph_user: 'Username...',
            lbl_days: 'Days (0 = All)', lbl_enable: 'Enable',
            ra_in: 'Shrink', ra_out: 'Expand', ra_err: 'Select RA', unit_m: 'm',
            city_no_name: 'No City', no_results: 'No results',
            // QA Strings
            qa_lbl_short: 'Short Segments (<):',
            qa_lbl_disc: 'Disconnected Segs:',
            qa_lbl_cross: 'Crossed Segs (Same Level)',
            qa_lbl_distort: 'Distorted Roads (Hooks/Wavy)',
            qa_opt_dead: 'One Side (Dead End)',
            qa_opt_float: 'Both Sides (Floating)',
            qa_res_found: 'Selected:',
            qa_res_scanning: 'Scanning...',
            qa_msg_zoom: '⚠️ Area too large! Please Zoom In to scan intersections.'
        }
    };

    let currentLang = 'ar-IQ';
    const _t = (key) => (STRINGS[currentLang] || STRINGS['en-US'])[key] || key;
    const _dir = () => (currentLang === 'en-US' ? 'ltr' : 'rtl');

    // ===========================================================================
    //  CORE UTILITIES
    // ===========================================================================
    function getAllObjects(modelName) {
        if(!W || !W.model || !W.model[modelName]) return [];
        var repo = W.model[modelName];
        if (typeof repo.getObjectArray === 'function') return repo.getObjectArray();
        if (repo.objects) return Object.values(repo.objects);
        return [];
    }

    function fastClone(obj) { return JSON.parse(JSON.stringify(obj)); }

    function calculateAngle(p1, p2, p3) {
        const a = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const b = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
        const c = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));
        if (a === 0 || b === 0) return 180;
        const cosAngle = (a * a + b * b - c * c) / (2 * a * b);
        const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
        return angleRad * (180 / Math.PI);
    }

    class UIBuilder {
        static getSavedState(id) {
            try { return JSON.parse(localStorage.getItem(`AA_Win_${id}`)) || null; } catch (e) { return null; }
        }

        static saveState(id, element) {
            const state = {
                top: element.style.top,
                left: element.style.left,
                width: element.style.width,
                height: element.style.height,
                display: element.style.display
            };
            localStorage.setItem(`AA_Win_${id}`, JSON.stringify(state));
        }

        static createFloatingWindow(id, titleKey, colorClass, contentHtml) {
            let win = document.getElementById(id);
            if (win) {
                win.style.display = (win.style.display === 'none' ? 'block' : 'none');
                if(win.style.display === 'block') UIBuilder.saveState(id, win);
                return win;
            }

            const state = UIBuilder.getSavedState(id) || {
                top: '100px',
                left: '100px',
                width: DEFAULT_W,
                height: DEFAULT_H
            };

            win = document.createElement('div');
            win.id = id;
            win.className = `aa-window ${_dir()}`;
            win.style.top = state.top;
            win.style.left = state.left;
            win.style.width = state.width;
            win.style.height = state.height;
            win.style.display = 'block';

            const header = document.createElement('div');
            header.className = `aa-header ${colorClass}`;
            header.innerHTML = `<span>${_t(titleKey)}</span><span class="aa-close">✖</span>`;

            const content = document.createElement('div');
            content.className = 'aa-content';
            content.innerHTML = contentHtml;

            win.appendChild(header);
            win.appendChild(content);
            document.body.appendChild(win);

            win.querySelector('.aa-close').onclick = () => { win.style.display = 'none'; UIBuilder.saveState(id, win); };

            let isDragging = false, startX, startY, initialLeft, initialTop;
            header.onmousedown = (e) => {
                if(e.target.className === 'aa-close') return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                initialLeft = win.offsetLeft;
                initialTop = win.offsetTop;
                document.onmousemove = (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    win.style.left = (initialLeft + e.clientX - startX) + 'px';
                    win.style.top = (initialTop + e.clientY - startY) + 'px';
                };
                document.onmouseup = () => { isDragging = false; document.onmousemove = null; document.onmouseup = null; UIBuilder.saveState(id, win); };
            };

            new ResizeObserver(() => { UIBuilder.saveState(id, win); }).observe(win);
            return win;
        }
    }

    // ===========================================================================
    //  SPEED INDICATOR (DRAW ONLY - NO SELECTION)
    // ===========================================================================
    const SpeedIndicator = {
        layer: null,
        init: () => {
            const html = `
                <div style="padding:5px;">
                    <label style="font-weight:bold; display:block; margin-bottom:10px; cursor:pointer;"><input type="checkbox" id="speed_master_enable" checked> ${_t('lbl_enable')}</label>
                    <div style="display:grid; grid-template-columns:1fr; gap:5px;">
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="0" checked> 0-40 <span style="margin-left:auto; display:inline-block;width:30px;height:10px;background:#00FF00;border-radius:2px;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="1" checked> 41-60 <span style="margin-left:auto; display:inline-block;width:30px;height:10px;background:#00FFFF;border-radius:2px;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="2" checked> 61-80 <span style="margin-left:auto; display:inline-block;width:30px;height:10px;background:#0000FF;border-radius:2px;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="3" checked> 81-100 <span style="margin-left:auto; display:inline-block;width:30px;height:10px;background:#4B0082;border-radius:2px;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="4" checked> 101-120 <span style="margin-left:auto; display:inline-block;width:30px;height:10px;background:#800080;border-radius:2px;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="5" checked> 121-140 <span style="margin-left:auto; display:inline-block;width:30px;height:10px;background:#FF8000;border-radius:2px;"></span></label>
                        <label class="aa-lock-opt"><input type="checkbox" class="aa-speed-cb" value="6" checked> 141+ <span style="margin-left:auto; display:inline-block;width:30px;height:10px;background:#FF0000;border-radius:2px;"></span></label>
                    </div>
                    <div style="margin-top:15px; display:flex; gap:10px;">
                        <button id="speed_scan" class="aa-btn aa-red" style="flex:2;">${_t('common_scan')}</button>
                        <button id="speed_clear" class="aa-btn aa-gray" style="flex:1;">${_t('common_clear')}</button>
                    </div>
                </div>`;
            UIBuilder.createFloatingWindow('AA_SpeedWin', 'win_speed', 'aa-bg-red', html);
            document.getElementById('speed_scan').onclick = SpeedIndicator.scan;
            document.getElementById('speed_clear').onclick = () => {
                if (SpeedIndicator.layer) SpeedIndicator.layer.removeAllFeatures();
                // Do NOT unselect models here, just clear the layer
            };
        },
        scan: () => {
            if (!SpeedIndicator.layer) {
                SpeedIndicator.layer = new OpenLayers.Layer.Vector("AA_Speed_Labels", { displayInLayerSwitcher: true });
                W.map.addLayer(SpeedIndicator.layer);
                SpeedIndicator.layer.setZIndex(9999);
            }
            SpeedIndicator.layer.removeAllFeatures();
            SpeedIndicator.layer.setVisibility(true);
            W.map.setLayerIndex(SpeedIndicator.layer, 9999);

            if (!document.getElementById('speed_master_enable').checked) return;

            let enabledRanges = [];
            document.querySelectorAll('.aa-speed-cb').forEach(cb => { if (cb.checked) enabledRanges.push(parseInt(cb.value)) });

            const extent = W.map.getExtent();
            let features = [];

            getAllObjects('segments').forEach(seg => {
                if (!seg.geometry || !extent.intersectsBounds(seg.geometry.getBounds())) return;

                let speed = Math.max(seg.attributes.fwdMaxSpeed || 0, seg.attributes.revMaxSpeed || 0);
                if (speed === 0) return;

                let rangeIdx = -1, color = "";
                if (speed <= 40) { rangeIdx = 0; color = "#00FF00"; }
                else if (speed <= 60) { rangeIdx = 1; color = "#00FFFF"; }
                else if (speed <= 80) { rangeIdx = 2; color = "#0000FF"; }
                else if (speed <= 100) { rangeIdx = 3; color = "#4B0082"; }
                else if (speed <= 120) { rangeIdx = 4; color = "#800080"; }
                else if (speed <= 140) { rangeIdx = 5; color = "#FF8000"; }
                else { rangeIdx = 6; color = "#FF0000"; }

                if (enabledRanges.includes(rangeIdx)) {
                    // Logic: Draw ONLY, do NOT select.
                    let centerPt = seg.geometry.getCentroid();

                    let style = {
                        pointRadius: 12,
                        fillColor: color,
                        fillOpacity: 0.9,
                        strokeColor: "#ffffff",
                        strokeWidth: 2,
                        label: speed.toString(),
                        fontColor: (color === '#00FF00' || color === '#00FFFF') ? "black" : "white",
                        fontSize: "11px",
                        fontWeight: "bold",
                        graphicName: "circle"
                    };
                    features.push(new OpenLayers.Feature.Vector(centerPt, {}, style));
                }
            });

            SpeedIndicator.layer.addFeatures(features);
            // Selection logic removed per user request
        }
    };

    // ===========================================================================
    //  QA SCANNER (Safe Mode - V1.7)
    // ===========================================================================
    const QAScanner = {
        layer: null,
        isScanning: false,
        init: () => {
            const html = `
                <div style="padding:10px; font-family:'Cairo', sans-serif;">
                    <div class="aa-qa-row">
                        <label class="aa-checkbox-container"><input type="checkbox" id="qa_cb_short"><span class="aa-checkmark"></span></label>
                        <div style="flex-grow:1;"><div style="font-weight:bold;font-size:13px;margin-bottom:5px;">${_t('qa_lbl_short')}</div><div style="display:flex;align-items:center;gap:5px;"><input type="number" id="qa_short_val" class="aa-input" value="6" style="width:60px;margin:0;text-align:center;"><span style="font-weight:bold;">${_t('unit_m')}</span></div></div>
                    </div>
                    <div class="aa-qa-row">
                        <label class="aa-checkbox-container"><input type="checkbox" id="qa_cb_disc"><span class="aa-checkmark"></span></label>
                        <div style="flex-grow:1;"><div style="font-weight:bold;font-size:13px;margin-bottom:5px;">${_t('qa_lbl_disc')}</div><select id="qa_disc_type" class="aa-input" style="margin:0;"><option value="1">${_t('qa_opt_dead')}</option><option value="2">${_t('qa_opt_float')}</option></select></div>
                    </div>
                    <div class="aa-qa-row">
                        <label class="aa-checkbox-container"><input type="checkbox" id="qa_cb_cross"><span class="aa-checkmark"></span></label>
                        <div style="flex-grow:1;"><div style="font-weight:bold;font-size:13px;">${_t('qa_lbl_cross')}</div></div>
                    </div>
                    <div class="aa-qa-row" style="border-bottom:none;background:#ffebee;padding:8px;border-radius:4px;">
                        <label class="aa-checkbox-container"><input type="checkbox" id="qa_cb_distort" checked><span class="aa-checkmark"></span></label>
                        <div style="flex-grow:1;"><div style="font-weight:bold;font-size:13px;color:#c62828;">${_t('qa_lbl_distort')}</div></div>
                    </div>
                    <div style="margin-top:15px;display:flex;gap:10px;">
                        <button id="qa_btn_scan" class="aa-btn aa-bg-orange" style="flex:2;">${_t('common_scan')}</button>
                        <button id="qa_btn_clear" class="aa-btn aa-gray" style="flex:1;">${_t('common_clear')}</button>
                    </div>
                    <div id="qa_status" style="margin-top:10px;text-align:center;font-weight:bold;font-size:13px;color:#333;min-height:20px;"></div>
                </div>`;
            UIBuilder.createFloatingWindow('AA_QAWin', 'win_qa', 'aa-bg-orange', html);
            document.getElementById('qa_btn_scan').onclick = QAScanner.runScan;
            document.getElementById('qa_btn_clear').onclick = () => {
                W.selectionManager.unselectAll();
                if(QAScanner.layer) QAScanner.layer.removeAllFeatures();
                document.getElementById('qa_status').innerHTML = '';
                QAScanner.isScanning = false;
            };
        },
        runScan: () => {
            if(QAScanner.isScanning) return;
            const checkCross = document.getElementById('qa_cb_cross').checked;
            if (checkCross && W.map.getZoom() < 16) { alert(_t('qa_msg_zoom')); return; }
            QAScanner.isScanning = true;
            const statusDiv = document.getElementById('qa_status');
            statusDiv.innerHTML = _t('qa_res_scanning');
            if(!QAScanner.layer) { QAScanner.layer = new OpenLayers.Layer.Vector("AA_QA_Highlight", {displayInLayerSwitcher: false}); W.map.addLayer(QAScanner.layer); QAScanner.layer.setZIndex(9999); }
            QAScanner.layer.removeAllFeatures();
            const extent = W.map.getExtent();
            const allSegments = getAllObjects('segments').filter(s => s.geometry && extent.intersectsBounds(s.geometry.getBounds()));
            const results = new Set();
            const highlightFeatures = [];
            const checkShort = document.getElementById('qa_cb_short').checked;
            const checkDisc = document.getElementById('qa_cb_disc').checked;
            const checkDistort = document.getElementById('qa_cb_distort').checked;
            const shortThresh = parseFloat(document.getElementById('qa_short_val').value) || 6;
            const discType = document.getElementById('qa_disc_type').value;
            const proj = W.map.getProjectionObject();
            let idx = 0; const chunkSize = 50;
            const processChunk = () => {
                if (!QAScanner.isScanning) return;
                const limit = Math.min(idx + chunkSize, allSegments.length);
                for (let i = idx; i < limit; i++) {
                    let s = allSegments[i];
                    if (checkShort) { if (s.geometry.getGeodesicLength(proj) < shortThresh) results.add(s); }
                    if (checkDisc) {
                        let n1 = W.model.nodes.objects[s.attributes.fromNodeID];
                        let n2 = W.model.nodes.objects[s.attributes.toNodeID];
                        if (n1 && n2) { let d1 = (n1.attributes.segIDs.length === 1); let d2 = (n2.attributes.segIDs.length === 1); if (discType === "2") { if (d1 && d2) results.add(s); } else { if (d1 || d2) results.add(s); } }
                    }
                    if (checkCross) {
                        for (let j = i + 1; j < allSegments.length; j++) {
                            let s2 = allSegments[j];
                            if (s.attributes.level !== s2.attributes.level) continue;
                            if (!s.geometry.getBounds().intersectsBounds(s2.geometry.getBounds())) continue;
                            const s1f = s.attributes.fromNodeID, s1t = s.attributes.toNodeID; const s2f = s2.attributes.fromNodeID, s2t = s2.attributes.toNodeID;
                            if (s1f === s2f || s1f === s2t || s1t === s2f || s1t === s2t) continue;
                            if (s.geometry.intersects(s2.geometry)) { results.add(s); results.add(s2); }
                        }
                    }
                    if (checkDistort) {
                        const verts = s.geometry.getVertices();
                        if (verts.length >= 3) {
                            let isDistorted = false;
                            if (calculateAngle(verts[0], verts[1], verts[2]) < 45) isDistorted = true;
                            if (!isDistorted) { if (calculateAngle(verts[verts.length-1], verts[verts.length-2], verts[verts.length-3]) < 45) isDistorted = true; }
                            if (!isDistorted) { for (let k = 1; k < verts.length - 1; k++) { if (calculateAngle(verts[k-1], verts[k], verts[k+1]) < 20) { isDistorted = true; break; } } }
                            if (isDistorted) { results.add(s); highlightFeatures.push(new OpenLayers.Feature.Vector(s.geometry.clone(), {}, { strokeColor: "#D50000", strokeWidth: 6, strokeOpacity: 0.6 })); }
                        }
                    }
                }
                idx += chunkSize;
                statusDiv.innerHTML = `${_t('qa_res_scanning')} ${Math.floor((idx / allSegments.length) * 100)}%`;
                if (idx < allSegments.length) { setTimeout(processChunk, 10); } else { finishScan(); }
            };
            const finishScan = () => {
                QAScanner.isScanning = false;
                const finalArr = Array.from(results);
                W.selectionManager.setSelectedModels(finalArr);
                if (highlightFeatures.length > 0) QAScanner.layer.addFeatures(highlightFeatures);
                statusDiv.innerHTML = `${_t('qa_res_found')} ${finalArr.length}`;
            };
            setTimeout(processChunk, 10);
        }
    };

    // ===========================================================================
    //  MODULES (Roundabout, City, etc. - STABLE V23)
    // ===========================================================================
    const RoundaboutEditor={init:()=>{const html=`<div style="text-align:center;padding:10px;"><div style="margin-bottom:15px;background:#fff;border:2px solid #333;padding:10px;border-radius:8px;"><span style="font-size:16px;font-weight:bold;color:#000;">${_t('unit_m')}: </span><input type="number" id="ra-val" class="aa-input" value="1" style="width:80px;display:inline-block;font-size:18px;font-weight:bold;text-align:center;border:1px solid #000;"></div><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">تحريك (Move)</div><div class="aa-ra-controls"><div></div><button id="ra_up" class="aa-btn aa-green aa-big-icon">▲</button><div></div><button id="ra_left" class="aa-btn aa-green aa-big-icon">◄</button><button id="ra_down" class="aa-btn aa-green aa-big-icon">▼</button><button id="ra_right" class="aa-btn aa-green aa-big-icon">►</button></div><div style="margin-top:20px;"><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">تدوير (Rotate)</div><div class="aa-btn-group"><button id="ra_rot_l" class="aa-btn aa-bg-red aa-huge-icon">↺</button><button id="ra_rot_r" class="aa-btn aa-bg-blue aa-huge-icon">↻</button></div></div><div style="margin-top:15px;"><div style="font-size:14px;font-weight:bold;margin-bottom:5px;color:#000;">حجم (Size)</div><div class="aa-btn-group"><button id="ra_shrink" class="aa-btn aa-teal" style="font-size:16px;">${_t('ra_in')}</button><button id="ra_expand" class="aa-btn aa-teal" style="font-size:16px;">${_t('ra_out')}</button></div></div></div><div id="ra_status" style="margin-top:15px;text-align:center;font-weight:bold;font-size:16px;color:red;border-top:2px solid #000;padding-top:10px;">${_t('ra_err')}</div>`;UIBuilder.createFloatingWindow('AA_RAWin','win_ra','aa-bg-green',html);W.selectionManager.events.register("selectionchanged",null,RoundaboutEditor.checkSelection);RoundaboutEditor.checkSelection();document.getElementById('ra_up').onclick=()=>RoundaboutEditor.run('ShiftLat',1);document.getElementById('ra_down').onclick=()=>RoundaboutEditor.run('ShiftLat',-1);document.getElementById('ra_left').onclick=()=>RoundaboutEditor.run('ShiftLong',-1);document.getElementById('ra_right').onclick=()=>RoundaboutEditor.run('ShiftLong',1);document.getElementById('ra_rot_l').onclick=()=>RoundaboutEditor.run('Rotate',-1);document.getElementById('ra_rot_r').onclick=()=>RoundaboutEditor.run('Rotate',1);document.getElementById('ra_shrink').onclick=()=>RoundaboutEditor.run('Diameter',-1);document.getElementById('ra_expand').onclick=()=>RoundaboutEditor.run('Diameter',1)},checkSelection:()=>{try{const el=document.getElementById('ra_status');if(!el)return;const sel=W.selectionManager.getSelectedFeatures();let isRA=false;if(sel.length>0&&sel[0].model.type==='segment')if(WazeWrap.Model.isRoundaboutSegmentID(sel[0].model.attributes.id))isRA=true;el.innerText=isRA?_t('common_ready'):_t('ra_err');el.style.color=isRA?'#00c853':'#d50000'}catch(e){}},run:(action,multiplier)=>{var WazeActionUpdateSegmentGeometry,WazeActionMoveNode,WazeActionMultiAction;try{WazeActionUpdateSegmentGeometry=require('Waze/Action/UpdateSegmentGeometry');WazeActionMoveNode=require('Waze/Action/MoveNode');WazeActionMultiAction=require('Waze/Action/MultiAction')}catch(e){console.error("WME Modules not found",e);return}var val=parseFloat(document.getElementById('ra-val').value)*multiplier;var segs=WazeWrap.getSelectedFeatures();if(!segs||segs.length===0)return;var segObj=segs[0];const getRASegs=(s)=>WazeWrap.Model.getAllRoundaboutSegmentsFromObj(s);try{if(action==='ShiftLong'||action==='ShiftLat'){var RASegs=getRASegs(segObj);var multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);let isLat=(action==='ShiftLat');let c_idx=isLat?1:0;let offset=0;let c=WazeWrap.Geometry.ConvertTo4326(s.attributes.geoJSONGeometry.coordinates[0][0],s.attributes.geoJSONGeometry.coordinates[0][1]);if(isLat)offset=WazeWrap.Geometry.CalculateLatOffsetGPS(val,c.lon,c.lat);else offset=WazeWrap.Geometry.CalculateLongOffsetGPS(val,c.lon,c.lat);for(let j=1;j<newGeo.coordinates.length-1;j++)newGeo.coordinates[j][c_idx]+=offset;multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);newNodeGeo.coordinates[c_idx]+=offset;let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}else if(action==='Rotate'){let RASegs=getRASegs(segObj);let raCenter=W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates;let{lon:centerX,lat:centerY}=WazeWrap.Geometry.ConvertTo900913(raCenter[0],raCenter[1]);let angleDeg=5*multiplier;let angleRad=angleDeg*(Math.PI/180);let cosTheta=Math.cos(angleRad);let sinTheta=Math.sin(angleRad);let multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);for(let j=1;j<newGeo.coordinates.length-1;j++){let pt=s.attributes.geoJSONGeometry.coordinates[j];let{lon:pX,lat:pY}=WazeWrap.Geometry.ConvertTo900913(pt[0],pt[1]);let nX900913=cosTheta*(pX-centerX)-sinTheta*(pY-centerY)+centerX;let nY900913=sinTheta*(pX-centerX)+cosTheta*(pY-centerY)+centerY;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(nX900913,nY900913);newGeo.coordinates[j]=[nX,nY]}multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);let{lon:npX,lat:npY}=WazeWrap.Geometry.ConvertTo900913(newNodeGeo.coordinates[0],newNodeGeo.coordinates[1]);let nodeX900913=cosTheta*(npX-centerX)-sinTheta*(npY-centerY)+centerX;let nodeY900913=sinTheta*(npX-centerX)+cosTheta*(npY-centerY)+centerY;let{lon:nnX,lat:nnY}=WazeWrap.Geometry.ConvertTo4326(nodeX900913,nodeY900913);newNodeGeo.coordinates=[nnX,nnY];let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}else if(action==='Diameter'){let RASegs=getRASegs(segObj);let raCenter=W.model.junctions.objects[segObj.WW.getAttributes().junctionID].attributes.geoJSONGeometry.coordinates;let{lon:centerX,lat:centerY}=WazeWrap.Geometry.ConvertTo900913(raCenter[0],raCenter[1]);let multiaction=new WazeActionMultiAction();for(let i=0;i<RASegs.length;i++){let s=W.model.segments.getObjectById(RASegs[i]);let newGeo=fastClone(s.attributes.geoJSONGeometry);for(let j=1;j<newGeo.coordinates.length-1;j++){let pt=s.attributes.geoJSONGeometry.coordinates[j];let{lon:pX,lat:pY}=WazeWrap.Geometry.ConvertTo900913(pt[0],pt[1]);let h=Math.sqrt(Math.abs(Math.pow(pX-centerX,2)+Math.pow(pY-centerY,2)));let ratio=(h+val)/h;let x=centerX+(pX-centerX)*ratio;let y=centerY+(pY-centerY)*ratio;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(x,y);newGeo.coordinates[j]=[nX,nY]}multiaction.doSubAction(W.model,new WazeActionUpdateSegmentGeometry(s,s.attributes.geoJSONGeometry,newGeo));let node=W.model.nodes.objects[s.attributes.toNodeID];if(s.attributes.revDirection)node=W.model.nodes.objects[s.attributes.fromNodeID];let newNodeGeo=fastClone(node.attributes.geoJSONGeometry);let{lon:npX,lat:npY}=WazeWrap.Geometry.ConvertTo900913(newNodeGeo.coordinates[0],newNodeGeo.coordinates[1]);let h=Math.sqrt(Math.abs(Math.pow(npX-centerX,2)+Math.pow(npY-centerY,2)));let ratio=(h+val)/h;let x=centerX+(npX-centerX)*ratio;let y=centerY+(npY-centerY)*ratio;let{lon:nX,lat:nY}=WazeWrap.Geometry.ConvertTo4326(x,y);newNodeGeo.coordinates=[nX,nY];let connected={};for(let k=0;k<node.attributes.segIDs.length;k++)connected[node.attributes.segIDs[k]]=fastClone(W.model.segments.getObjectById(node.attributes.segIDs[k]).attributes.geoJSONGeometry);multiaction.doSubAction(W.model,new WazeActionMoveNode(node,node.attributes.geoJSONGeometry,newNodeGeo,connected,{}))}W.model.actionManager.add(multiaction)}}catch(e){console.error("RA Operation Failed",e)}}};
    const CityExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_city_input" class="aa-input" placeholder="${_t('ph_city')}"><div class="aa-btn-group"><button id="aa_city_scan" class="aa-btn aa-gold">${_t('common_scan')}</button><button id="aa_city_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_city_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_CityWin','win_city','aa-bg-gold',html);document.getElementById('aa_city_scan').onclick=CityExplorer.scan;document.getElementById('aa_city_clear').onclick=()=>{document.getElementById('aa_city_res').innerHTML='';document.getElementById('aa_city_input').value='';W.selectionManager.unselectAll()}},scan:()=>{const query=document.getElementById('aa_city_input').value.toLowerCase().trim();const resDiv=document.getElementById('aa_city_res');resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{let cityGroups={};const extent=W.map.getExtent();const segments=getAllObjects('segments');let foundAny=false;segments.forEach(seg=>{if(!seg.geometry||!extent.intersectsBounds(seg.geometry.getBounds()))return;let cityName=_t('city_no_name');if(seg.attributes.primaryStreetID){let street=W.model.streets.objects[seg.attributes.primaryStreetID];if(street&&street.attributes.cityID){let city=W.model.cities.objects[street.attributes.cityID];if(city&&city.attributes.name&&city.attributes.name.trim().length>0)cityName=city.attributes.name}}if(query!==""&&!cityName.toLowerCase().includes(query))return;if(!cityGroups[cityName])cityGroups[cityName]=[];cityGroups[cityName].push(seg);foundAny=true});resDiv.innerHTML='';const sortedCities=Object.keys(cityGroups).sort();if(!foundAny){resDiv.innerHTML=`<div style="text-align:center; padding:10px; color:#999;">${_t('no_results')}</div>`;return}sortedCities.forEach(city=>{let count=cityGroups[city].length;let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${city}</span><span class="aa-badge aa-bg-gold">${count}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#fff3cd';W.selectionManager.setSelectedModels(cityGroups[city]);let totalBounds=null;cityGroups[city].forEach(seg=>{if(seg.geometry){if(!totalBounds)totalBounds=seg.geometry.getBounds().clone();else totalBounds.extend(seg.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(row)})},100)}};
    const PlacesExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_place_input" class="aa-input" placeholder="${_t('ph_place')}"><div class="aa-btn-group"><button id="aa_place_scan" class="aa-btn aa-blue">${_t('common_scan')}</button><button id="aa_place_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_place_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_PlaceWin','win_places','aa-bg-blue',html);document.getElementById('aa_place_scan').onclick=PlacesExplorer.scan;document.getElementById('aa_place_clear').onclick=()=>{document.getElementById('aa_place_res').innerHTML='';document.getElementById('aa_place_input').value='';W.selectionManager.unselectAll()}},scan:()=>{const query=document.getElementById('aa_place_input').value.toLowerCase().trim();const resDiv=document.getElementById('aa_place_res');resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{const extent=W.map.getExtent();const venues=getAllObjects('venues');let foundAny=false;resDiv.innerHTML='';if(query===""){let cityGroups={};venues.forEach(v=>{if(!v.geometry||!extent.intersectsBounds(v.geometry.getBounds()))return;let cityName=_t('city_no_name');if(v.attributes.streetID){let street=W.model.streets.objects[v.attributes.streetID];if(street&&street.attributes.cityID){let city=W.model.cities.objects[street.attributes.cityID];if(city&&city.attributes.name)cityName=city.attributes.name}}if(!cityGroups[cityName])cityGroups[cityName]=[];cityGroups[cityName].push(v);foundAny=true});if(!foundAny){resDiv.innerHTML=`<div style="text-align:center;color:#999;">${_t('no_results')}</div>`;return}Object.keys(cityGroups).sort().forEach(city=>{let count=cityGroups[city].length;let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${city}</span><span class="aa-badge aa-bg-blue">${count}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#d6eaf8';W.selectionManager.setSelectedModels(cityGroups[city]);let totalBounds=null;cityGroups[city].forEach(v=>{if(v.geometry){if(!totalBounds)totalBounds=v.geometry.getBounds().clone();else totalBounds.extend(v.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(row)})}else{let results=[];venues.forEach(v=>{if(!v.geometry||!extent.intersectsBounds(v.geometry.getBounds()))return;let name=v.attributes.name||"Unnamed";if(name.toLowerCase().includes(query))results.push(v)});if(results.length===0){resDiv.innerHTML=`<div style="text-align:center;color:#999;">${_t('no_results')}</div>`;return}results.sort((a,b)=>(a.attributes.name||"").localeCompare(b.attributes.name||"")).forEach(v=>{let row=document.createElement('div');row.className='aa-item-row';row.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:14px;">${v.attributes.name||"Unnamed"}</span>`;row.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(r=>r.style.background='transparent');row.style.background='#d6eaf8';W.selectionManager.setSelectedModels([v]);W.map.setCenter(v.geometry.getBounds().getCenterLonLat())};resDiv.appendChild(row)})}},100)}};
    const EditorExplorer={init:()=>{const html=`<div class="aa-section-box"><input type="text" id="aa_user_input" class="aa-input" placeholder="${_t('ph_user')}"><label style="font-size:11px; font-weight:bold; display:block; margin-bottom:3px;">${_t('lbl_days')}</label><input type="number" id="aa_days_input" class="aa-input" value="0" min="0"><div class="aa-btn-group"><button id="aa_user_scan" class="aa-btn aa-purple">${_t('common_scan')}</button><button id="aa_user_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div></div><div id="aa_user_res" class="aa-results"></div>`;UIBuilder.createFloatingWindow('AA_UserWin','win_editors','aa-bg-purple',html);document.getElementById('aa_user_scan').onclick=EditorExplorer.scan;document.getElementById('aa_user_clear').onclick=()=>{document.getElementById('aa_user_res').innerHTML='';W.selectionManager.unselectAll()}},scan:()=>{const resDiv=document.getElementById('aa_user_res');const query=document.getElementById('aa_user_input').value.toLowerCase().trim();const daysVal=parseInt(document.getElementById('aa_days_input').value);const days=isNaN(daysVal)?0:daysVal;const cutoff=days>0?new Date(Date.now()-(days*86400000)):null;resDiv.innerHTML='<div style="text-align:center; padding:10px;">...</div>';setTimeout(()=>{let users={};const extent=W.map.getExtent();const processObj=(obj,type)=>{if(!obj.geometry)return;if(!extent.intersectsBounds(obj.geometry.getBounds()))return;let uID=obj.attributes.updatedBy||obj.attributes.createdBy;let uTime=obj.attributes.updatedOn||obj.attributes.createdOn;if(cutoff&&new Date(uTime)<cutoff)return;if(uID){let uName="Unknown";if(W.model.users.objects[uID])uName=W.model.users.objects[uID].attributes.userName;else uName="ID:"+uID;if(query!==""&&!uName.toLowerCase().includes(query))return;if(!users[uName])users[uName]={segCount:0,venCount:0,objs:[]};if(type==='segment')users[uName].segCount++;if(type==='venue')users[uName].venCount++;users[uName].objs.push(obj)}};getAllObjects('segments').forEach(o=>processObj(o,'segment'));getAllObjects('venues').forEach(o=>processObj(o,'venue'));resDiv.innerHTML='';const sortedUsers=Object.keys(users).sort((a,b)=>(users[b].segCount+users[b].venCount)-(users[a].segCount+users[a].venCount));if(sortedUsers.length===0){resDiv.innerHTML=`<div style="text-align:center; padding:10px; color:#999;">${_t('no_results')}</div>`;return}sortedUsers.forEach(u=>{let data=users[u];let r=document.createElement('div');r.className='aa-item-row';r.innerHTML=`<span style="font-weight:700; color:#2c3e50; font-size:13px; max-width:140px; overflow:hidden; text-overflow:ellipsis;">${u}</span><div style="display:flex; gap:5px;"><span class="aa-badge aa-bg-gold" title="Segments"><i class="fa fa-road"></i> ${data.segCount}</span><span class="aa-badge aa-bg-blue" title="Venues"><i class="fa fa-map-marker"></i> ${data.venCount}</span></div>`;r.onclick=()=>{resDiv.querySelectorAll('.aa-item-row').forEach(x=>x.style.background='transparent');r.style.background='#e8daef';W.selectionManager.setSelectedModels(data.objs);let totalBounds=null;data.objs.forEach(o=>{if(o.geometry){if(!totalBounds)totalBounds=o.geometry.getBounds().clone();else totalBounds.extend(o.geometry.getBounds())}});if(totalBounds)W.map.setCenter(totalBounds.getCenterLonLat())};resDiv.appendChild(r)})},100)}};
    const LockIndicator={layer:null,init:()=>{const html=`<div style="padding:5px;"><label style="font-weight:bold; display:block; margin-bottom:10px; cursor:pointer;"><input type="checkbox" id="lock_master_enable"> ${_t('lbl_enable')}</label><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="0" checked> L1 <span style="display:inline-block;width:10px;height:10px;background:#B0B0B0;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="1" checked> L2 <span style="display:inline-block;width:10px;height:10px;background:#FFC800;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="2" checked> L3 <span style="display:inline-block;width:10px;height:10px;background:#00FF00;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="3" checked> L4 <span style="display:inline-block;width:10px;height:10px;background:#00BFFF;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="4" checked> L5 <span style="display:inline-block;width:10px;height:10px;background:#BF00FF;border-radius:50%;"></span></label><label class="aa-lock-opt"><input type="checkbox" class="aa-lock-cb" value="5" checked> L6 <span style="display:inline-block;width:10px;height:10px;background:#FF0000;border-radius:50%;"></span></label></div><button id="lock_scan" class="aa-btn aa-cyan" style="margin-top:15px;">${_t('common_scan')}</button><button id="lock_clear" class="aa-btn aa-gray">${_t('common_clear')}</button></div>`;UIBuilder.createFloatingWindow('AA_LockWin','win_lock','aa-bg-cyan',html);document.getElementById('lock_scan').onclick=LockIndicator.scan;document.getElementById('lock_clear').onclick=()=>{if(LockIndicator.layer)LockIndicator.layer.removeAllFeatures()}},scan:()=>{if(!LockIndicator.layer){LockIndicator.layer=new OpenLayers.Layer.Vector("AA_Locks",{displayInLayerSwitcher:true});W.map.addLayer(LockIndicator.layer);LockIndicator.layer.setZIndex(9999)}LockIndicator.layer.removeAllFeatures();LockIndicator.layer.setVisibility(true);W.map.setLayerIndex(LockIndicator.layer,9999);if(!document.getElementById('lock_master_enable').checked)return;let enabledLevels=[];document.querySelectorAll('.aa-lock-cb').forEach(cb=>{if(cb.checked)enabledLevels.push(parseInt(cb.value))});const LOCK_COLORS={0:'#B0B0B0',1:'#FFC800',2:'#00FF00',3:'#00BFFF',4:'#BF00FF',5:'#FF0000'};const extent=W.map.getExtent();let features=[];const process=(obj,isVenue)=>{if(!obj.geometry||!extent.intersectsBounds(obj.geometry.getBounds()))return;let rank=(obj.attributes.lockRank!==undefined&&obj.attributes.lockRank!==null)?obj.attributes.lockRank:0;if(enabledLevels.includes(rank)){let centerPt=obj.geometry.getCentroid();let style={pointRadius:10,fontSize:"10px",fontWeight:"bold",label:"L"+(rank+1),fontColor:"black",fillColor:LOCK_COLORS[rank],fillOpacity:0.85,strokeColor:"#333",strokeWidth:1,graphicName:isVenue?"square":"circle"};features.push(new OpenLayers.Feature.Vector(centerPt,{},style))}};getAllObjects('segments').forEach(o=>process(o,false));getAllObjects('venues').forEach(o=>process(o,true));LockIndicator.layer.addFeatures(features)}};

    // ===========================================================================
    //  MAIN INIT & STYLES
    // ===========================================================================
    function injectCSS() {
        const css = `
            .aa-window {
                position:fixed; background:#fff; border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.3); z-index:9999;
                font-family:'Cairo', sans-serif;
                overflow: hidden;
                resize: both;
                min-width: 200px; min-height: 200px;
            }
            .aa-header { padding:10px; color:#fff; cursor:move; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:14px; height: 35px; }
            .aa-content { padding:10px; background:#f9f9f9; height: calc(100% - 35px); overflow-y:auto; box-sizing:border-box; }
            .aa-close { cursor:pointer; font-weight:bold; font-size:18px; margin-left:10px; }
            .aa-btn { width:100%; padding:8px; margin-top:5px; border:none; border-radius:4px; color:#fff; cursor:pointer; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center; gap:5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); text-shadow: 1px 1px 2px rgba(0,0,0,0.5); }
            .aa-btn:hover { filter: brightness(1.1); }
            .aa-btn:active { transform: translateY(1px); box-shadow: none; }
            .aa-btn-group { display:flex; gap:5px; margin-bottom:5px; }
            .aa-input { width:100%; padding:6px; margin-bottom:5px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; font-family:'Cairo'; font-weight:bold; }
            .aa-results { min-height:100px; border-top:1px solid #ddd; margin-top:5px; padding-top:5px; font-size:12px; }
            .aa-item-row { padding:12px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: background 0.2s; }
            .aa-item-row:hover { background:#eee; }
            .aa-ra-controls { display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; width:140px; margin:0 auto; }

            /* --- QA Checkbox Styles --- */
            .aa-qa-row { display:flex; align-items:center; gap:10px; margin-bottom:12px; border-bottom:1px dashed #ccc; padding-bottom:8px; }
            .aa-checkbox-container { display: block; position: relative; padding-left: 25px; cursor: pointer; user-select: none; }
            .aa-checkbox-container input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
            .aa-checkmark { position: absolute; top: 0; left: 0; height: 20px; width: 20px; background-color: #eee; border-radius:4px; border:1px solid #999; }
            .aa-checkbox-container:hover input ~ .aa-checkmark { background-color: #ccc; }
            .aa-checkbox-container input:checked ~ .aa-checkmark { background-color: #FF9800; border-color:#E65100; }
            .aa-checkmark:after { content: ""; position: absolute; display: none; }
            .aa-checkbox-container input:checked ~ .aa-checkmark:after { display: block; }
            .aa-checkbox-container .aa-checkmark:after { left: 6px; top: 2px; width: 6px; height: 12px; border: solid white; border-width: 0 3px 3px 0; transform: rotate(45deg); }

            /* --- COLORS --- */
            .aa-bg-gold { background: #FFD700; color: #000; } .aa-gold { background: #FFC107; color:#000; }
            .aa-bg-blue { background: #00B0FF; } .aa-blue { background: #0091EA; }
            .aa-bg-teal { background: #00E5FF; color:#000; } .aa-teal { background: #00B8D4; }
            .aa-bg-purple { background: #D500F9; } .aa-purple { background: #AA00FF; }
            .aa-bg-green { background: #00E676; color:#000; } .aa-green { background: #00C853; }
            .aa-bg-cyan { background: #18FFFF; color:#000; } .aa-cyan { background: #00B8D4; }
            .aa-bg-red { background: #FF1744; } .aa-red { background: #D50000; }
            .aa-bg-orange { background: #FF9800; color:#000; }
            .aa-gray { background: #78909C; }
            .rtl { direction: rtl; } .ltr { direction: ltr; }
            .aa-big-icon { font-size: 24px; padding: 5px 0; font-weight: 900; }
            .aa-huge-icon { font-size: 32px; padding: 5px 0; font-weight: 900; }
        `;
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function buildSidebar() {
        const userTabs = document.getElementById('user-info');
        if (!userTabs) return;
        const existingTab = document.getElementById('aa-suite-tab-content');
        if(existingTab) existingTab.remove();
        const existingLink = document.querySelector('ul.nav-tabs li a[href="#aa-suite-tab-content"]');
        if(existingLink) existingLink.parentElement.remove();

        const navTabs = userTabs.querySelector('.nav-tabs');
        const tabContent = userTabs.querySelector('.tab-content');
        if(!navTabs || !tabContent) return;

        const addon = document.createElement('div');
        addon.id = "aa-suite-tab-content";
        addon.className = "tab-pane";
        addon.style.padding = "10px";

        const langOptions = [
            {code: 'ar-IQ', name: 'العربية (العراق)'},
            {code: 'ckb-IQ', name: 'Kurdî (Soranî)'},
            {code: 'en-US', name: 'English (US)'}
        ].map(l => `<option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.name}</option>`).join('');

        addon.innerHTML = `
            <div style="text-align:center; font-family:'Cairo', sans-serif;">
                <div style="font-weight:bold; color:#000; margin-bottom:10px; padding-bottom:5px; border-bottom:3px solid #FFD700; font-size:16px;">${_t('main_title')}</div>
                <select id="aa_lang_sel" class="aa-input" style="margin-bottom:15px; text-align:center;">${langOptions}</select>
                <button id="btn_open_city" class="aa-btn aa-bg-gold"><i class="fa fa-building"></i> ${_t('btn_city')}</button>
                <button id="btn_open_places" class="aa-btn aa-bg-blue"><i class="fa fa-map-marker"></i> ${_t('btn_places')}</button>
                <button id="btn_open_editors" class="aa-btn aa-bg-purple"><i class="fa fa-users"></i> ${_t('btn_editors')}</button>
                <button id="btn_open_lock" class="aa-btn aa-bg-cyan"><i class="fa fa-lock"></i> ${_t('btn_lock')}</button>
                <div style="height:2px; background:#ccc; margin:10px 0;"></div>
                <button id="btn_open_speed" class="aa-btn aa-bg-red"><i class="fa fa-tachometer"></i> ${_t('btn_speed')}</button>
                <button id="btn_open_qa" class="aa-btn aa-bg-orange"><i class="fa fa-bug"></i> ${_t('btn_qa')}</button>
                <button id="btn_open_ra" class="aa-btn aa-bg-green"><i class="fa fa-refresh"></i> ${_t('btn_ra')}</button>
                <div style="margin-top:15px; font-size:10px; color:#555; font-weight:bold;">v${SCRIPT_VERSION}</div>
            </div>
        `;

        const newtab = document.createElement('li');
        newtab.innerHTML = '<a href="#aa-suite-tab-content" data-toggle="tab" title="Abdullah Abbas WME Tools">Abdullah Abbas WME Tools</a>';
        navTabs.appendChild(newtab);
        tabContent.appendChild(addon);

        document.getElementById('aa_lang_sel').onchange = (e) => {
            currentLang = e.target.value;
            localStorage.setItem('AA_Lang', currentLang);
            buildSidebar();
            document.querySelectorAll('.aa-window').forEach(w => w.remove());
        };
        document.getElementById('btn_open_city').onclick = CityExplorer.init;
        document.getElementById('btn_open_places').onclick = PlacesExplorer.init;
        document.getElementById('btn_open_editors').onclick = EditorExplorer.init;
        document.getElementById('btn_open_ra').onclick = RoundaboutEditor.init;
        document.getElementById('btn_open_lock').onclick = LockIndicator.init;
        document.getElementById('btn_open_qa').onclick = QAScanner.init;
        document.getElementById('btn_open_speed').onclick = SpeedIndicator.init;
    }

    function bootstrap(tries=1) {
        if (typeof W !== 'undefined' && W.map && W.model && document.getElementById('user-info')) {
            const savedLang = localStorage.getItem('AA_Lang');
            if(savedLang && STRINGS[savedLang]) currentLang = savedLang;
            injectCSS();
            buildSidebar();
            console.log(`${SCRIPT_NAME} v${SCRIPT_VERSION} Loaded.`);
        } else if (tries < 50) {
            setTimeout(() => bootstrap(tries+1), 200);
        }
    }
    bootstrap();
})();