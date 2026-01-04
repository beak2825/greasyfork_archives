// ==UserScript==
// @name         WME Thailand Tambon
// @namespace    https://github.com/wazeth/
// @version      1.0
// @description  แสดงขอบเขตตำบล
// @author       Waze Thailand
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561139/WME%20Thailand%20Tambon.user.js
// @updateURL https://update.greasyfork.org/scripts/561139/WME%20Thailand%20Tambon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const DATA_BASE_URL = "https://wazeth.github.io/mapsproject/geojson/";
    const SCRIPT_ID = "wme-th-tambon-tab-v2";
    const SCRIPT_TITLE = "ขอบเขตการปกครอง";

    // รายชื่อจังหวัด
    const PROVINCES = {
        "0": { name: "กรุงเทพมหานคร", file: "10-bangkok.geojson" },
        "1": { name: "สมุทรปราการ", file: "11-SPK.geojson" },
        "2": { name: "นนทบุรี", file: "12-NTB.geojson" },
        "3": { name: "ปทุมธานี", file: "13-PTM.geojson" },
        "4": { name: "พระนครศรีอยุธยา", file: "14-PSA.geojson" },
        "5": { name: "อ่างทอง", file: "15-ANG.geojson" },
        "6": { name: "ลพบุรี", file: "16-LBR.geojson" },
        "7": { name: "สิงห์บุรี", file: "17-SBR.geojson" },
        "8": { name: "ชัยนาท", file: "18-CNT.geojson" },
        "9": { name: "สระบุรี", file: "19-SRB.geojson" },
        "10": { name: "ชลบุรี", file: "20-CBR.geojson" },
        "11": { name: "ระยอง", file: "21-RYN.json" },
        "12": { name: "จันทบุรี", file: "22-CBR.json" },
        "13": { name: "ตราด", file: "23-TRT.geojson" },
        "14": { name: "ฉะเชิงเทรา", file: "24-CCS.geojson" },
        "15": { name: "ปราจีนบุรี", file: "25-PCB.geojson" },
        "16": { name: "นครนายก", file: "26-NNY.geojson" },
        "17": { name: "สระแก้ว", file: "27-SKO.json" },
        "18": { name: "นครราชสีมา", file: "30-NSM.geojson" },
        "19": { name: "บุรีรัมย์", file: "31-BRR.geojson" },
        "20": { name: "สุรินทร์", file: "32-SRN.geojson" },
        "21": { name: "ศรีสะเกษ", file: "33-SSK.geojson" },
        "22": { name: "อุบลราชธานี", file: "34-URT.json" },
        "24": { name: "ยโสธร", file: "35-YST.geojson" },
        "25": { name: "ชัยภูมิ", file: "36-CYP.geojson" },
        "26": { name: "อำนาจเจริญ", file: "37-ANC.geojson" },
        "27": { name: "บึงกาฬ", file: "38-BUK.geojson" },
        "28": { name: "หนองบัวลำภู", file: "39-NBL.geojson" },
        "29": { name: "ขอนแก่น", file: "40-KKN.geojson" },
        "30": { name: "อุดรธานี", file: "41-UDT.json" },
        "33": { name: "เลย", file: "42-LOE.geojson" },
        "34": { name: "หนองคาย", file: "43-NKH.geojson" },
        "35": { name: "มหาสารคาม", file: "44-MSK.geojson" },
        "36": { name: "ร้อยเอ็ด", file: "45-RET.geojson" },
        "37": { name: "กาฬสินธุ์", file: "46-KLS.json" },
        "39": { name: "สกลนคร", file: "47-SKN.geojson" },
        "40": { name: "นครพนม", file: "48-NPN.geojson" },
        "41": { name: "มุกดาหาร", file: "49-MDH.geojson" },
        "42": { name: "เชียงใหม่", file: "50-CMI.geojson" },
        "43": { name: "ลำพูน", file: "51-LPN.geojson" },
        "44": { name: "ลำปาง", file: "52-LPG.geojson" },
        "45": { name: "อุตรดิตถ์", file: "53-URD.geojson" },
        "46": { name: "แพร่", file: "54-PHE.geojson" },
        "47": { name: "น่าน", file: "55-NAN.geojson" },
        "48": { name: "พะเยา", file: "56-PYO.geojson" },
        "49": { name: "เชียงราย", file: "57-CHR.geojson" },
        "50": { name: "แม่ฮ่องสอน", file: "58-MHS.geojson" },
        "51": { name: "นครสวรรค์", file: "60-NSW.geojson" },
        "52": { name: "อุทัยธานี", file: "61-UTN.geojson" },
        "53": { name: "กำแพงเพชร", file: "62-KPP.geojson" },
        "54": { name: "ตาก", file: "63-TAK.geojson" },
        "55": { name: "สุโขทัย", file: "64-SKT.geojson" },
        "56": { name: "พิษณุโลก", file: "65-PNL.geojson" },
        "57": { name: "พิจิตร", file: "66-PHC.geojson" },
        "58": { name: "เพชรบูรณ์", file: "67-PCB.geojson" },
        "59": { name: "ราชบุรี", file: "70-RBR.geojson" },
        "60": { name: "กาญจนบุรี", file: "71-KBR.geojson" },
        "61": { name: "สุพรรณบุรี", file: "72-SBR.geojson" },
        "62": { name: "นครปฐม", file: "73-NPT.geojson" },
        "63": { name: "สมุทรสาคร", file: "74-SKN.geojson" },
        "64": { name: "สมุทรสงคราม", file: "75-SSK.geojson" },
        "65": { name: "เพชรบุรี", file: "76-PBR.geojson" },
        "66": { name: "ประจวบคีรีขันธ์", file: "77-PKK.geojson" },
        "67": { name: "นครศรีธรรมราช", file: "80-NST.geojson" },
        "68": { name: "กระบี่", file: "81-KRB.geojson" },
        "69": { name: "พังงา", file: "82-PNG.geojson" },
        "70": { name: "ภูเก็ต", file: "83-PKT.geojson" },
        "71": { name: "สุราษฎร์ธานี", file: "84-STN.geojson" },
        "72": { name: "ระนอง", file: "85-RNG.geojson" },
        "73": { name: "ชุมพร", file: "86-CMP.geojson" },
        "74": { name: "สงขลา", file: "90-SKL.geojson" },
        "75": { name: "สตูล", file: "91-STU.geojson" },
        "76": { name: "ตรัง", file: "92-TRN.geojson" },
        "77": { name: "พัทลุง", file: "93-PTL.geojson" },
        "78": { name: "ปัตตานี", file: "94-PTN.geojson" },
        "79": { name: "ยะลา", file: "95-YLA.geojson" },
        "80": { name: "นราธิวาส", file: "96-NTW.geojson" }
    };

    let tambonLayer = null;

    if (W?.userscripts?.state?.isInitialized) {
        init();
    } else {
        document.addEventListener("wme-initialized", init, { once: true });
    }

    async function init() {
        console.log("WME Tambon: Starting...");
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab(SCRIPT_ID);

        tabLabel.innerHTML = '<span>🇹🇭</span>';
        tabLabel.title = SCRIPT_TITLE;

        tabPane.innerHTML = `
            <div>
                <h3 style="margin-bottom: 10px;">${SCRIPT_TITLE}</h3>
                <p class="text-muted" style="font-size: 12px;">
                    กรุงเทพฯ: แสดงเขต<br/>
                    พื้นที่อื่น: แสดงตำบล, อำเภอ
                    <ul>
                       <li>ลำดับที่ปรากฏในตัวเลือกเรียงตามรหัสจังหวัด</li>
                       <li>ความเร็วในการเรียกข้อมูลจะขึ้นอยู่กับความเร็วอินเตอร์เน็ต และขนาดพื้นที่</li>
                    </ul>
                </p>

                <div class="form-group">
                    <label for="tb-province-input">จังหวัด:</label>

                    <input list="tb-provinces-list" id="tb-province-input" class="form-control" placeholder="-- พิมพ์หรือคลิกเพื่อเลือก --" style="width: 100%; margin-bottom: 10px;">
                    <datalist id="tb-provinces-list">
                        </datalist>

                </div>

                <div style="margin-top: 15px;">
                    <button id="tb-load-btn" class="btn btn-primary" style="width: 100%; margin-bottom: 8px;">
                        โหลดข้อมูล
                    </button>
                    <button id="tb-clear-btn" class="btn btn-default" style="width: 100%;">
                        ลบเส้นออก
                    </button>
                </div>

                <div id="tb-progress-container" style="display:none; margin-top: 15px;">
                    <div style="background: #e0e0e0; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div id="tb-progress-bar" style="background: #4caf50; width: 0%; height: 100%; transition: width 0.2s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;">
                        <span id="tb-progress-text">0%</span>
                        <span id="tb-eta-text">--:--</span>
                    </div>
                </div>

                <hr style="margin: 15px 0;"/>
                <div id="tb-status" style="font-size:11px; color:#666;">สถานะ: พร้อมใช้งาน</div>
            </div>
        `;

        await W.userscripts.waitForElementConnected(tabPane);
        setupInteractions();
    }

    function setupInteractions() {
        const input = document.getElementById('tb-province-input'); // ใช้ input แทน select
        const datalist = document.getElementById('tb-provinces-list'); // ตัวเก็บรายชื่อ
        const btnLoad = document.getElementById('tb-load-btn');
        const btnClear = document.getElementById('tb-clear-btn');
        const statusDiv = document.getElementById('tb-status');

        const progressContainer = document.getElementById('tb-progress-container');
        const progressBar = document.getElementById('tb-progress-bar');
        const progressText = document.getElementById('tb-progress-text');
        const etaText = document.getElementById('tb-eta-text');

        // เติมรายชื่อลง Datalist
        Object.keys(PROVINCES).sort((a,b) => parseInt(a) - parseInt(b)).forEach(key => {
            let opt = document.createElement('option');
            opt.value = PROVINCES[key].name; // แสดงชื่อจังหวัดใน list
            datalist.appendChild(opt);
        });

        btnLoad.addEventListener('click', () => {
            const selectedName = input.value;
            // หา key จากชื่อที่ user เลือก (Reverse Lookup)
            const selectedKey = Object.keys(PROVINCES).find(key => PROVINCES[key].name === selectedName);

            if(selectedKey && PROVINCES[selectedKey]) {
                // Reset UI
                statusDiv.innerText = "⏳ กำลังดาวน์โหลด...";
                progressContainer.style.display = "block";
                progressBar.style.width = "0%";
                progressText.innerText = "0%";
                etaText.innerText = "กำลังโหลด...";

                loadBoundary(selectedKey, PROVINCES[selectedKey].file, statusDiv, {
                    bar: progressBar,
                    text: progressText,
                    eta: etaText
                });
            } else {
                alert("กรุณาเลือกจังหวัดให้ถูกต้อง (ต้องตรงกับในรายการ)");
            }
        });

        btnClear.addEventListener('click', () => {
            if (tambonLayer) {
                W.map.removeLayer(tambonLayer);
                tambonLayer.destroy();
                tambonLayer = null;
                statusDiv.innerText = "สถานะ: ลบเส้นแล้ว";
                progressContainer.style.display = "none";
            }
        });
    }

    function fetchGM(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const json = JSON.parse(response.responseText);
                            resolve(json);
                        } catch (e) {
                            reject(new Error("Invalid JSON"));
                        }
                    } else {
                        reject(new Error("HTTP Error: " + response.status));
                    }
                },
                onerror: function(err) {
                    reject(new Error("Network Error"));
                }
            });
        });
    }

    function loadBoundary(provinceKey, filename, statusDiv, ui) {
        const url = DATA_BASE_URL + filename;

        if (tambonLayer) {
            W.map.removeLayer(tambonLayer);
            tambonLayer.destroy();
            tambonLayer = null;
        }

        fetchGM(url)
            .then(data => {
                statusDiv.innerText = "กำลังประมวลผล...";
                drawLayerWithProgress(data, provinceKey, statusDiv, ui);
            })
            .catch(err => {
                console.error("Load Error:", err);
                statusDiv.innerText = "❌ ผิดพลาด: " + err.message;
            });
    }

    // Progress & ETA
    function drawLayerWithProgress(geoJsonData, provinceKey, statusDiv, ui) {
        const allFeatures = geoJsonData.features;
        const total = allFeatures.length;
        const processedFeatures = [];
        const labelField = (provinceKey === "0") ? "${ADM2_TH}" : "${ADM3_TH}, ${ADM2_TH}";

        const BATCH_SIZE = 50;
        let index = 0;
        const startTime = performance.now();

        function processBatch() {
            const batchStart = performance.now();
            const end = Math.min(index + BATCH_SIZE, total);

            for (let i = index; i < end; i++) {
                const f = allFeatures[i];
                const olGeometry = W.userscripts.toOLGeometry(f.geometry);
                if (olGeometry) {
                    const feature = new OpenLayers.Feature.Vector(olGeometry, f.properties);
                    processedFeatures.push(feature);
                }
            }

            index = end;

            const now = performance.now();
            const elapsed = (now - startTime) / 1000;
            const pct = Math.floor((index / total) * 100);

            ui.bar.style.width = pct + "%";
            ui.text.innerText = pct + "% (" + index + "/" + total + ")";

            if (index > 0 && index < total) {
                const rate = index / elapsed;
                const remainingItems = total - index;
                const etaSeconds = remainingItems / rate;

                ui.eta.innerText = "เหลืออีก: " + formatTime(etaSeconds);
            } else if (index >= total) {
                ui.eta.innerText = "เสร็จสิ้น";
            }

            if (index < total) {
                setTimeout(processBatch, 0);
            } else {
                finalizeLayer(processedFeatures, labelField, statusDiv);
            }
        }

        processBatch();
    }

    function formatTime(seconds) {
        if (seconds < 1) return "< 1 วิ";
        if (seconds < 60) return Math.round(seconds) + " วิ";
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return mins + " นาที " + secs + " วิ";
    }

    function finalizeLayer(features, labelField, statusDiv) {
        const style = new OpenLayers.Style({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWidth: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.0,
            label: labelField,
            fontColor: "#8B0000",
            fontSize: "14px",
            fontFamily: "Sarabun, sans-serif",
            labelOutlineColor: "#ffffff",
            labelOutlineWidth: 3,
            fontWeight: "bold",
            labelAlign: "cm"
        });

        tambonLayer = new OpenLayers.Layer.Vector("Thailand Boundary Overlay", {
            styleMap: new OpenLayers.StyleMap(style),
            displayInLayerSwitcher: true
        });

        tambonLayer.addFeatures(features);
        W.map.addLayer(tambonLayer);

        const maxZ = Math.max(...W.map.layers.map(l => l.getZIndex()));
        tambonLayer.setZIndex(maxZ + 1);

        if (tambonLayer.div) {
            tambonLayer.div.style.pointerEvents = "none";
            tambonLayer.div.style.background = "transparent";
        }

        statusDiv.innerText = `✅ แสดงผลเรียบร้อย (${features.length} พื้นที่)`;
    }

})();