// ==UserScript==
// @name         WME Workflow Engine Alpha
// @namespace    https://greasyfork.org/
// @version      2.1.22
// @description  Xây dựng và chạy các chuỗi tác vụ tự động hóa (workflows) tùy chỉnh trong WME. Tự động điều hướng từ file Excel/CSV/GG Sheets và thực thi các hành động được điều chỉnh sẵn bằng WME SDK.
// @author       Minh Tan
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/*user/editor*
// @connect      vinfastauto.com
// @connect      script.google.com
// @connect      googleusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @require      https://update.greasyfork.org/scripts/389765/1090053/CommonUtils.js
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @downloadURL https://update.greasyfork.org/scripts/559302/WME%20Workflow%20Engine%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/559302/WME%20Workflow%20Engine%20Alpha.meta.js
// ==/UserScript==
/* global require */
/* global $, jQuery */
/* global I18n */
/* global Node$1, Segment, Venue, VenueAddress, WmeSDK */
/* global W, WazeWrap, XLSX */
(function () {
    'use strict';
    let permalinks = [];
    let currentIndex = -1;
    let allWorkflows = {};
    let isLooping = false; // Biến này chỉ ra rằng vòng lặp đang hoạt động hoặc được yêu cầu dừng
    let workbookData = null; // Lưu workbook để ghi đè
    let currentFileName = ''; // Tên file hiện tại
    let statusColumnIndex = -1; // Vị trí cột Status
    let hasUnsavedChanges = false;
    let previousIndex = -1;
    let currentApiData = null; // Lưu dữ liệu JSON trả về từ API
    let currentRowData = [];   // Lưu dữ liệu thô của hàng hiện tại trong Excel
    let eventCleanupRegistry = [];
    let wmeSDK = null;
    const STORAGE_KEY_SETTINGS = 'wme_wfe_gas_settings';
    const STATUS_COL_NAME = 'Status';
    let isGasMode = false;
    let gasHeaders = null;
    let selectedSubCategory = 'CAR_WASH';
    // Provider registry for external charge station providers (extensible)
    const PROVIDERS_FETCH_API = {
        vinfast: {
            brand: "VinFast",
            async fetchData(id) {
                return new Promise((resolve, reject) => {
                    if (!id) {
                        PROVIDERS_FETCH_API.vinfast.updatePanel(null);
                        return resolve(null);
                    }
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://vinfastauto.com/vn_vi/get-locator/${id}`,
                        onload: function (response) {
                            if (response.status === 200) {
                                try {
                                    const json = JSON.parse(response.responseText);
                                    if (json && json.data) {
                                        currentApiData = json.data;
                                        PROVIDERS_FETCH_API.vinfast.updatePanel(currentApiData);
                                        resolve(json.data);
                                    } else {
                                        log('API trả về nhưng không có dữ liệu data.', 'warn');
                                        PROVIDERS_FETCH_API.vinfast.updatePanel(null);
                                        resolve(null);
                                    }
                                } catch (e) {
                                    log('Lỗi parse JSON API.', 'error');
                                    PROVIDERS_FETCH_API.vinfast.updatePanel(null);
                                    reject(e);
                                }
                            } else {
                                log(`Lỗi gọi API: Status ${response.status}`, 'error');
                                PROVIDERS_FETCH_API.vinfast.updatePanel(null);
                                reject(new Error(response.statusText));
                            }
                        },
                        onerror: function (err) {
                            log('Lỗi kết nối mạng API.', 'error');
                            PROVIDERS_FETCH_API.vinfast.updatePanel(null);
                            reject(err);
                        }
                    });
                });
            },
            showImagesPopup() {
                if (!currentApiData || !currentApiData.data.images || currentApiData.data.images.length === 0) {
                    alert("Không có dữ liệu ảnh.");
                    return;
                }
                const images = currentApiData.data.images;
                let html = `<div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; padding: 10px;">`;
                images.forEach(img => {
                    html += `<a href="${img.url}" target="_blank"><img src="${img.url}" style="max-width: 300px; height: auto; object-fit: cover; border-radius: 4px; border: 1px solid #ccc; cursor: zoom-in;"></a>`;
                });
                html += `</div>`;
                let imgModal = document.getElementById('img-modal-overlay');
                if (!imgModal) {
                    imgModal = document.createElement('div');
                    imgModal.id = 'img-modal-overlay';
                    imgModal.style.cssText = `
                position: fixed; top:0; left:0; width:100%; height:100%;
                background:rgba(0,0,0,0.7); z-index:2000;
                display:flex; justify-content:center; align-items:center;
            `;
                    imgModal.addEventListener('click', (e) => {
                        if (e.target === imgModal) imgModal.remove();
                    });
                    document.body.appendChild(imgModal);
                }
                imgModal.innerHTML = `
            <div style="background:white; padding:20px; border-radius:8px; max-width:80%; max-height:90%; overflow:auto; position:relative;">
                <button id="close-img-modal" style="position:absolute; right:10px; top:10px; border:none; background:none; font-size:20px; cursor:pointer;">✖</button>
                <h3>Ảnh Trạm Sạc: ${currentApiData.name}</h3>
                ${html}
            </div>
        `;
                document.getElementById('close-img-modal').addEventListener('click', () => {
                    imgModal.remove();
                });
            },
            renderConnectors(evses) {
                const connectorInfo = document.getElementById('vf-connectors-info');
                if (!connectorInfo) return;
                if (!evses || evses.length === 0) {
                    connectorInfo.innerHTML = '<i style="color: #777;">Không có cổng sạc nào được liệt kê.</i>';
                    return;
                }
                const acData = {};
                const dcData = {};
                evses.forEach(evse => {
                    if (evse.connectors) {
                        evse.connectors.forEach(conn => {
                            const powerKw = Math.round(conn.max_electric_power / 1000);
                            const standard = conn.standard || "";
                            const type = conn.power_type || "";
                            let typeKey = standard;
                            if (type === 'AC' && !typeKey) typeKey = 'IEC_62196_T2';
                            if (type === 'DC' && !typeKey) typeKey = 'CCS1';
                            if (type === 'AC' || (standard.includes('IEC_62196_T2') && !standard.includes('COMBO'))) {
                                if (!acData[powerKw]) acData[powerKw] = { count: 0, typeKey };
                                acData[powerKw].count++;
                            } else {
                                if (!dcData[powerKw]) dcData[powerKw] = { count: 0, typeKey };
                                dcData[powerKw].count++;
                            }
                        });
                    }
                });
                const createBtns = (dataObj, bgColor, borderColor) => {
                    const keys = Object.keys(dataObj).sort((a, b) => a - b);
                    if (keys.length === 0) return '';
                    return keys.map(kw => {
                        const item = dataObj[kw];
                        return `<button class="vf-connector-btn"
                                    data-type="${item.typeKey}"
                                    data-power="${kw}"
                                    data-count="${item.count}"
                                    style="cursor:pointer; border:1px solid ${borderColor}; background:${bgColor}; padding:4px 8px; margin:2px; border-radius:4px; font-weight:bold; font-size: 11px; color: #333;">
                                    ➕ ${kw} kW (x${item.count})
                                    </button>`;
                    }).join(" ");
                };
                let html = '';
                const acHtml = createBtns(acData, '#e8f5e9', '#c8e6c9');
                if (acHtml) {
                    html += `<div style="margin-bottom: 8px;"><strong style="color: #2e7d32; font-size: 12px;">⚡ AC (Type 2)</strong><br>${acHtml}</div>`;
                }
                const dcHtml = createBtns(dcData, '#ffebee', '#ffcdd2');
                if (dcHtml) {
                    html += `<div><strong style="color: #c62828; font-size: 12px;">🚀 DC (CCS2)</strong><br>${dcHtml}</div>`;
                }
                if (html === '') {
                    connectorInfo.innerHTML = '<i style="color: #777;">Không tìm thấy cổng chuẩn.</i>';
                } else {
                    connectorInfo.innerHTML = html;
                    connectorInfo.querySelectorAll('.vf-connector-btn').forEach(btn => {
                        btn.onclick = (e) => {
                            e.stopPropagation();
                            const type = btn.getAttribute('data-type');
                            const power = parseInt(btn.getAttribute('data-power'));
                            const count = parseInt(btn.getAttribute('data-count'));
                            const originalText = btn.innerHTML;
                            btn.innerHTML = "⏳...";
                            btn.disabled = true;
                            setTimeout(() => {
                                PROVIDERS_FETCH_API.vinfast.addChargeToWmeDirectly(type, power, count);
                                btn.innerHTML = originalText;
                                btn.disabled = false;
                            }, 50);
                        };
                    });
                }
            },
            addChargeToWmeDirectly(typeKey, power, count, venueModel) {
                try {
                    const venue = venueModel && venueModel.attributes ? venueModel : (WazeWrap.getSelectedFeatures()[0] && WazeWrap.getSelectedFeatures()[0].WW ? WazeWrap.getSelectedFeatures()[0].WW.getObjectModel() : null);
                    if (!venue) throw new Error('No venue model available for addChargeToWmeDirectly');
                    const venueId = venue.attributes.id;
                    let currentCategoryAttrs = venue.attributes.categoryAttributes;
                    let newAttrs = currentCategoryAttrs ? JSON.parse(JSON.stringify(currentCategoryAttrs)) : {};
                    const wmeTypeID = CHARGER_TYPE_MAP[typeKey] || 'UNKNOWN';
                    const portId = `${wmeTypeID}.${power}`;
                    if (!Array.isArray(newAttrs.CHARGING_STATION?.chargingPorts)) {
                        if (!newAttrs.CHARGING_STATION) newAttrs.CHARGING_STATION = {};
                        newAttrs.CHARGING_STATION.chargingPorts = [];
                    }
                    let ports = newAttrs.CHARGING_STATION.chargingPorts;
                    const existingIndex = ports.findIndex(p =>
                                                          p.maxChargeSpeedKw === power &&
                                                          p.connectorTypes.includes(wmeTypeID)
                                                         );
                    if (existingIndex !== -1) {
                        ports[existingIndex].count = count;
                    } else {
                        ports.push({
                            portId,
                            connectorTypes: [wmeTypeID],
                            maxChargeSpeedKw: power,
                            count
                        });
                    }
                    newAttrs.CHARGING_STATION.accessType = "PUBLIC";
                    newAttrs.CHARGING_STATION.paymentMethods = ["CREDIT", "APP", "DEBIT", "ONLINE_PAYMENT"];
                    newAttrs.CHARGING_STATION.costType = "FEE";
                    newAttrs.CHARGING_STATION.network = "Vinfast (V-Green)";
                    newAttrs.CHARGING_STATION.locationInVenue = `${currentApiData.address}`;
                    try {
                        let UpdateObject = require("Waze/Action/UpdateObject");
                        W.model.actionManager.add(new UpdateObject(venue, { 'categoryAttributes': newAttrs }));
                        return true;
                    } catch (actionError) {
                        log("⚠️ Fallback: setAttribute", 'warn');
                        venue.setAttribute('categoryAttributes', newAttrs);
                        return true;
                    }
                } catch (e) {
                    log(`❌ Lỗi: ${e.message}`, 'error');
                    console.error(e);
                    return false;
                }
            },
            updatePanel(data) {
                // If panel wasn't created (user requested it disabled), skip UI updates
                const panelRoot = document.getElementById('vf-panel');
                if (!panelRoot) return;
                const displayDiv = document.getElementById('vf-data-display');
                const nameText = document.getElementById('vf-name-text');
                const imagesBtn = document.getElementById('vf-images-btn');
                const fetchBtn = document.getElementById('vf-fetch-btn');
                if (data) {
                    displayDiv.style.display = 'block';
                    nameText.textContent = data.name || 'N/A';
                    const imagesCount = data.data.images ? data.data.images.length : 0;
                    imagesBtn.disabled = imagesCount === 0;
                    imagesBtn.textContent = `📷 Xem ${imagesCount} Ảnh`;
                    PROVIDERS_FETCH_API.vinfast.renderConnectors(data.data.evses || []);
                    fetchBtn.textContent = 'Fetch';
                    fetchBtn.disabled = false;
                } else {
                    displayDiv.style.display = 'none';
                    imagesBtn.disabled = true;
                    imagesBtn.textContent = '📷 Xem Ảnh';
                    const connectorInfo = document.getElementById('vf-connectors-info');
                    if (connectorInfo) connectorInfo.innerHTML = '<i style="color: #777;">Chưa có dữ liệu cổng sạc.</i>';
                    currentApiData = null;
                    fetchBtn.textContent = 'Fetch';
                    fetchBtn.disabled = false;
                }
            },
            async transferNameToWME(venueModel) {
                if (!currentApiData || !currentApiData.name) {
                    log("Không có tên trạm VinFast để chuyển.", 'warn');
                    return;
                }
                const newName = `Trạm sạc VinFast - ${currentApiData.name}`.replace(/Cửa hàng xăng dầu/gi, 'CHXD');
                const nameUpdated = await updateField(
                    '#venue-edit-general > div:nth-child(2) > wz-text-input',
                    'input',
                    newName,
                );
                if (!nameUpdated) return;
                const targetVenueId = venueModel && venueModel.attributes ? venueModel.attributes.id : (WazeWrap.getSelectedFeatures()[0] && WazeWrap.getSelectedFeatures()[0].WW ? WazeWrap.getSelectedFeatures()[0].WW.getObjectModel().attributes.id : null);
                if (targetVenueId) {
                    wmeSDK.DataModel.Venues.updateVenue({
                        venueId: targetVenueId,
                        phone: '1900 2323 89',
                        url: 'vinfastauto.com',
                        openingHours: [{ days: [0, 1, 2, 3, 4, 5, 6], fromHour: "00:00", toHour: "00:00" }]
                    });
                }
                if (!currentApiData.data || !currentApiData.data.evses) {
                    log("Không có dữ liệu cổng sạc để tự động thêm.", 'warn');
                    return;
                }
                await delay(50);
                try {
                    const evses = currentApiData.data.evses;
                    const portGroups = {};
                    evses.forEach(evse => {
                        if (evse.connectors) {
                            evse.connectors.forEach(conn => {
                                const powerKw = Math.round(conn.max_electric_power / 1000);
                                let standard = conn.standard || "";
                                let type = conn.power_type || "";
                                let typeKey = standard;
                                if (type === 'AC' && !typeKey) typeKey = 'IEC_62196_T2';
                                if (type === 'DC' && !typeKey) typeKey = 'CCS1';
                                const key = `${typeKey}::${powerKw}`;
                                if (!portGroups[key]) portGroups[key] = { typeKey, power: powerKw, count: 0 };
                                portGroups[key].count++;
                            });
                        }
                    });
                    const keys = Object.keys(portGroups);
                    if (keys.length === 0) {
                        log("Không tìm thấy cổng sạc chuẩn nào để thêm.", 'warn');
                        return;
                    }
                    for (const key of keys) {
                        const item = portGroups[key];
                        PROVIDERS_FETCH_API.vinfast.addChargeToWmeDirectly(item.typeKey, item.power, item.count);
                        await delay(50);
                    }
                } catch (err) {
                    log(`Lỗi khi tự động thêm sạc: ${err.message}`, 'error');
                }
            }
        },
    }
    const PROVIDERS_NON_API = {
        //['', 'MIPECORP', 'PV Oil', 'Petrolimex', 'SaigonPetro', 'Satra', 'Thalexim']
        petrolimex: {
            brand: 'Petrolimex',
            url: 'petrolimex.com.vn',
            phone: '1900 2828'
        },
        saigonpetro: {
            brand: 'SaigonPetro',
            url: 'saigonpetro.com.vn',
        },
        pvoil: {
            brand: 'PV Oil',
            url: 'pvoil.com.vn'
        },
        mipecorp: {
            brand: 'MIPECORP',
            url: 'mipecorp.com.vn'
        },
        evone: {
            brand: 'ev-one.vn'
        }

    }
    const CHARGER_TYPE_MAP = {
        'IEC_62196_T2': 'TYPE2',           // Type 2
        'IEC_62196_T2_COMBO': 'CCS_TYPE2', // CCS2
        'CCS1': 'CCS_TYPE1',
        'CHADEMO': 'CHADEMO',
        'TESLA': 'TESLA',
        'J1772': 'TYPE1',
        'WALL': 'WALL_OUTLET',
        'GB_T': 'GB_T'
    };
    const SDK_REGISTRY = {
        "update_charge_station_api": {
            name: "Cập nhật Thông tin trạm sạc có fetch API",
            description: "Dựa vào {{tên cột}} là lấy cột ID trong bảng tính, {{value}} là tên nhà cung cấp dịch vụ",
            params: [
                { key: "id", label: "Tên cột chứa ID để fetch iteration data vd: https://<domain>.com/{id}", type: "text", placeholder: "{{A}}" },
                { key: "provider", label: "Tên nhà cung cấp (vinfast,...)", type: "text", placeholder: "{{value}}" }
            ]
        },
        "update_gas_station": {
            name: "Cập nhật Thông tin trạm xăng",
            description: "Dựa vào {{tên cột}} để lấy tên cửa hàng trong bảng tính",
            params: [
                {
                    key: 'name',
                    label: 'Tên cột chứa tên cửa hàng',
                    type: 'text',
                    placeholder: "{{A}}"
                },
                {
                    key: "provider",
                    label: "Tên nhà cung cấp viết liền, không viết hoa (petrolimex,saigonpetro,...)"
                },
                {
                    key: "openHours",
                    label: "Cột giờ mở cửa (vd: 07:00 SA - 05:00 CH)",
                    type: "text",
                    placeholder: "{{F}} (Optional)"
                },
                {
                    key: "phone",
                    label: "Cột số điện thoại (vd: 09000..00)",
                    type: "text",
                    placeholder: "{{C}} (Optional)"
                }
            ]
        },
        "update_lock_rank": {
            name: "Khóa đối tượng (Lock Level)",
            description: "Đặt cấp độ khóa cho đối tượng.",
            params: [
                { key: "rank", label: "Cấp độ (1-5)", type: "number", min: 1, max: 5, placeholder: "3" }
            ]
        },
        "update_segment_city": {
            name: "Cập nhật tên tỉnh,tp/xã phường mới cho đường",
            description: "Đổi tên tỉnh,tp/xã phường mới cho các Segment đang chọn. Dùng {{value}} để lấy từ ô nhập liệu.",
            params: [
                { key: "cityName", label: "Tên TP mới", type: "text", placeholder: "{{value}}" }
            ]
        },
    };
    const defaultWorkflows = {
        "update_vinfast_charge_station": {
            name: "Cập nhật dữ liệu trạm sạc VF",
            tasks: [
                {
                    taskId: "update_charge_station_api",
                    enabled: true,
                    params: {
                        id: "{{entity_id}}",
                        provider: "Vinfast"
                    }
                },
                {
                    taskId: "update_lock_rank",
                    enabled: true,
                    params: { rank: "3" }
                }
            ]
        },
        "wf_update_gas_saition": {
            name: "Cập nhật dữ liệu trạm xăng",
            tasks: [
                {
                    taskId: "update_gas_station",
                    enabled: true,
                    params: {
                        name: "{{A}}",
                        provider: "Petrolimex",
                        openHours: "{{F}}",
                        phone: "{{C}}"
                    }
                }
            ]
        },
        "wf_update_segment_city": {
            name: "Đổi tên tỉnh,tp/xã phường mới cho Segments",
            tasks: [
                {
                    taskId: "update_segment_city",
                    enabled: true,
                    params: { cityName: "{{value}}" }
                }
            ]
        }
    };
    let CATEGORIES = [
        { key: 'CAR_SERVICES', subs: ['CAR_WASH', 'CHARGING_STATION', 'GARAGE_AUTOMOTIVE_SHOP', 'GAS_STATION'] },
        { key: 'CRISIS_LOCATIONS', subs: ['DONATION_CENTERS', 'SHELTER_LOCATIONS'] },
        {
            key: 'CULTURE_AND_ENTERTAINEMENT',
            subs: ['ART_GALLERY', 'CASINO', 'CLUB', 'TOURIST_ATTRACTION_HISTORIC_SITE', 'MOVIE_THEATER', 'MUSEUM', 'MUSIC_VENUE', 'PERFORMING_ARTS_VENUE', 'GAME_CLUB', 'STADIUM_ARENA', 'THEME_PARK', 'ZOO_AQUARIUM', 'RACING_TRACK', 'THEATER'],
        },
        { key: 'FOOD_AND_DRINK', subs: ['RESTAURANT', 'BAKERY', 'DESSERT', 'CAFE', 'FAST_FOOD', 'FOOD_COURT', 'BAR', 'ICE_CREAM'] },
        { key: 'LODGING', subs: ['HOTEL', 'HOSTEL', 'CAMPING_TRAILER_PARK', 'COTTAGE_CABIN', 'BED_AND_BREAKFAST'] },
        { key: 'NATURAL_FEATURES', subs: ['ISLAND', 'SEA_LAKE_POOL', 'RIVER_STREAM', 'FOREST_GROVE', 'FARM', 'CANAL', 'SWAMP_MARSH', 'DAM'] },
        { key: 'OTHER', subs: ['CONSTRUCTION_SITE'] },
        { key: 'OUTDOORS', subs: ['PARK', 'PLAYGROUND', 'BEACH', 'SPORTS_COURT', 'GOLF_COURSE', 'PLAZA', 'PROMENADE', 'POOL', 'SCENIC_LOOKOUT_VIEWPOINT', 'SKI_AREA'] },
        { key: 'PARKING_LOT', subs: ['PARKING_LOT'] },
        {
            key: 'PROFESSIONAL_AND_PUBLIC',
            subs: [
                'COLLEGE_UNIVERSITY',
                'SCHOOL',
                'CONVENTIONS_EVENT_CENTER',
                'GOVERNMENT',
                'LIBRARY',
                'CITY_HALL',
                'ORGANIZATION_OR_ASSOCIATION',
                'PRISON_CORRECTIONAL_FACILITY',
                'COURTHOUSE',
                'CEMETERY',
                'FIRE_DEPARTMENT',
                'POLICE_STATION',
                'MILITARY',
                'HOSPITAL_URGENT_CARE',
                'DOCTOR_CLINIC',
                'OFFICES',
                'POST_OFFICE',
                'RELIGIOUS_CENTER',
                'KINDERGARDEN',
                'FACTORY_INDUSTRIAL',
                'EMBASSY_CONSULATE',
                'INFORMATION_POINT',
                'EMERGENCY_SHELTER',
                'TRASH_AND_RECYCLING_FACILITIES',
            ],
        },
        {
            key: 'SHOPPING_AND_SERVICES',
            subs: [
                'ARTS_AND_CRAFTS',
                'BANK_FINANCIAL',
                'SPORTING_GOODS',
                'BOOKSTORE',
                'PHOTOGRAPHY',
                'CAR_DEALERSHIP',
                'FASHION_AND_CLOTHING',
                'CONVENIENCE_STORE',
                'PERSONAL_CARE',
                'DEPARTMENT_STORE',
                'PHARMACY',
                'ELECTRONICS',
                'FLOWERS',
                'FURNITURE_HOME_STORE',
                'GIFTS',
                'GYM_FITNESS',
                'SWIMMING_POOL',
                'HARDWARE_STORE',
                'MARKET',
                'SUPERMARKET_GROCERY',
                'JEWELRY',
                'LAUNDRY_DRY_CLEAN',
                'SHOPPING_CENTER',
                'MUSIC_STORE',
                'PET_STORE_VETERINARIAN_SERVICES',
                'TOY_STORE',
                'TRAVEL_AGENCY',
                'ATM',
                'CURRENCY_EXCHANGE',
                'CAR_RENTAL',
                'TELECOM',
            ],
        },
        {
            key: 'TRANSPORTATION',
            subs: ['AIRPORT', 'BUS_STATION', 'FERRY_PIER', 'SEAPORT_MARINA_HARBOR', 'SUBWAY_STATION', 'TRAIN_STATION', 'BRIDGE', 'TUNNEL', 'TAXI_STATION', 'JUNCTION_INTERCHANGE', 'REST_AREAS', 'CARPOOL_SPOT'],
        },
    ];
    const STORAGE_KEY = 'wme_custom_workflows';
    function bootstrap() {
        if (typeof WazeWrap !== 'undefined' && WazeWrap.Init) {
            WazeWrap.Init(() => {
                const sdk = typeof unsafeWindow !== 'undefined' && unsafeWindow.getWmeSdk ? unsafeWindow.getWmeSdk({ scriptId: 'wme-wfe', scriptName: 'WME Workflow Engine' }) : getWmeSdk({ scriptId: 'wme-wfe', scriptName: 'WME Workflow Engine' });
                init(sdk);
            });
        } else {
            // Fallback initialization if WazeWrap isn't fully ready (shouldn't happen with @require)
            if (typeof unsafeWindow !== 'undefined' && unsafeWindow.SDK_INITIALIZED) {
                unsafeWindow.SDK_INITIALIZED.then(() => {
                    const sdk = unsafeWindow.getWmeSdk({ scriptId: 'wme-wfe', scriptName: 'WME Workflow Engine' });
                    init(sdk);
                });
            } else if (typeof window.SDK_INITIALIZED !== 'undefined') {
                window.SDK_INITIALIZED.then(() => {
                    const sdk = window.getWmeSdk({ scriptId: 'wme-wfe', scriptName: 'WME Workflow Engine' });
                    init(sdk);
                });
            } else {
                log('WME SDK is not available. Script will not run.', 'error');
            }
        }
    }
    function init(sdk) {
        console.log("WME Workflow Engine: Initialized");
        wmeSDK = sdk
        loadWorkflows();
        createUI();
        createWorkflowEditorModal();
        populateWorkflowSelector();
        updateUIState();
        registerHotkeys();
        window.addEventListener('beforeunload', (e) => {
            cleanupAllEvents();
            placeholderCache.clear();
            if (hasUnsavedChanges) {
                const message = '⚠️ Bạn có thay đổi status chưa được lưu! Nhấn "Cập nhật Status" trước khi thoát.';
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        });
    }
    function registerEventCleanup(element, event, handler) {
        element.addEventListener(event, handler);
        eventCleanupRegistry.push({ element, event, handler });
    }

    function cleanupAllEvents() {
        eventCleanupRegistry.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        eventCleanupRegistry = [];
    }
    function resetData() {
        // Clear intervals nếu có
        if (window._wmeWorkflowInterval) {
            clearInterval(window._wmeWorkflowInterval);
            window._wmeWorkflowInterval = null;
        }
        if (window._wmeWorkflowTimeout) {
            clearTimeout(window._wmeWorkflowTimeout);
            window._wmeWorkflowTimeout = null;
        }
        cleanupAllEvents();
        if (workbookData) {
            workbookData = null;
        }
        permalinks.length = 0;
        currentRowData = null;
        currentApiData = null;
        const logBox = document.getElementById('log_info');
        if (logBox) {
            logBox.innerHTML = ''; // Clear log entries
        }
    }
    /**
    * Tạo POI mới trên bản đồ Waze
    * @param {number} lat - Vĩ độ
    * @param {number} lon - Kinh độ
    * @param {string} type - 'point' hoặc 'area'
    */
    async function createWazePOI(lat, lon, type, method = 'auto') {
        try {
            let geometry;

            if (method === 'auto') {
                if (!lat || !lon) return;
                if (type === 'point') {
                    geometry = { type: "Point", coordinates: [lon, lat] };
                } else {
                    const offset = 0.00015; // Kích thước vùng (~15m)
                    geometry = {
                        type: "Polygon",
                        coordinates: [[[lon-offset, lat-offset], [lon+offset, lat-offset], [lon+offset, lat+offset], [lon-offset, lat+offset], [lon-offset, lat-offset]]]
                    };
                }
            } else {
                geometry = await (type === 'point' ? wmeSDK.Map.drawPoint() : wmeSDK.Map.drawPolygon());
            }

            const newId = wmeSDK.DataModel.Venues.addVenue({
                category: selectedSubCategory,
                geometry: geometry
            });

            if (newId) {
                wmeSDK.Editing.setSelection({ selection: { ids: [newId.toString()], objectType: 'venue' } });
            }
        } catch (err) {
            log(`Lỗi tạo POI: ${err.message}`, 'error');
        }
    }
    let placeholderCache = new Map();

    function replacePlaceholders(text) {
        if (!text || typeof text !== 'string') return text;

        // Check cache
        const cacheKey = `${text}_${currentIndex}`;
        if (placeholderCache.has(cacheKey)) {
            return placeholderCache.get(cacheKey);
        }

        if (!currentRowData || typeof currentRowData !== 'object') {
            return text.replace(/{{[A-Z]+}}/g, match => match)
                .replace(/{{[^}]+}}/g, match => match);
        }

        let result = text.replace(/{{([^}]+)}}/g, (match, key) => {
            const trimmedKey = key.trim();
            if (currentRowData[trimmedKey] !== undefined) {
                return currentRowData[trimmedKey];
            }
            return match;
        });

        // Replace {{value}}
        const manualValue = document.getElementById('workflow_variable_input').value;
        result = result.replace('{{value}}', manualValue);

        // Cache result
        placeholderCache.set(cacheKey, result);

        // Limit cache size
        if (placeholderCache.size > 100) {
            const firstKey = placeholderCache.keys().next().value;
            placeholderCache.delete(firstKey);
        }

        return result;
    }

    function getColumnLetter(colIndex) {
        let temp, letter = '';
        while (colIndex >= 0) {
            temp = colIndex % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            colIndex = Math.floor(colIndex / 26) - 1;
        }
        return letter;
    }
    function getColumnIndexFromLetter(colLetter) {
        let colIndex = 0;
        for (let i = 0; i < colLetter.length; i++) {
            colIndex = colIndex * 26 + (colLetter.charCodeAt(i) - 64);
        }
        return colIndex - 1; // 0-based index
    }
    /**
    * Tìm một phần tử, hỗ trợ tìm kiếm bên trong Shadow DOM.
    * @param {string} selector - CSS selector cho phần tử chính.
    * @param {string} [shadowSelector] - CSS selector cho phần tử bên trong shadow DOM.
    * @returns {Promise<Element|null>}
    */
    async function findElement(selector, shadowSelector = '') {
        try {
            const baseElement = await waitForElement(selector);
            if (!shadowSelector) {
                return baseElement;
            }
            if (baseElement && baseElement.shadowRoot) {
                await delay(50); // Small delay for shadow DOM content to fully render
                const shadowElement = baseElement.shadowRoot.querySelector(shadowSelector);
                if (!shadowElement) {
                    log(`Lỗi: Không tìm thấy phần tử con với selector "${shadowSelector}" trong shadow DOM của "${selector}".`, 'error');
                }
                return shadowElement;
            }
            log(`Lỗi: Không tìm thấy shadow root trên phần tử "${selector}".`, 'error');
            return null;
        } catch (error) {
            log(`Lỗi khi tìm phần tử "${selector}": ${error.message}`, 'error');
            throw error; // Re-throw to propagate the error
        }
    }
    async function updateField(baseSelector, shadowSelector, newValue) {
        try {
            const hostElement = document.querySelector(baseSelector);
            if (!hostElement) {
                return false;
            }
            // Xử lý shadowRoot động
            let inputElement;
            if (shadowSelector.startsWith('#wz-textarea')) {
                // Tìm textarea đầu tiên trong shadowRoot (bỏ qua ID động)
                inputElement = hostElement.shadowRoot.querySelector('textarea');
            } else {
                inputElement = hostElement.shadowRoot.querySelector(shadowSelector);
            }
            if (!inputElement) {
                return false;
            }
            inputElement.focus();
            inputElement.value = newValue;
            inputElement.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
            inputElement.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
            inputElement.blur();
            return true;
        } catch (e) {
            log(`❌ Lỗi: ${e.message}`, 'error');
            return false;
        }
    }
    function findCityIdByName(cityName) {
        if (!cityName) return null;
        const targetName = cityName.toString().trim();
        const cities = W.model.cities.objects;
        for (const id in cities) {
            if (cities.hasOwnProperty(id)) {
                const city = cities[id];
                // Kiểm tra attributes tồn tại và so sánh tên chính xác
                if (city.attributes && city.attributes.name === targetName) {
                    return city.attributes.id;
                }
            }
        }
        return null;
    }
    function getOrCreateStreet(streetName, cityId) {
        return wmeSDK.DataModel.Streets.getStreet({ streetName, cityId })
            ?? wmeSDK.DataModel.Streets.addStreet({ streetName, cityId });
    }
    function convertTo24Hour(timeStr) {
        // timeStr ví dụ: "05:00 SA" hoặc "05:00 CH"
        const parts = timeStr.trim().split(' ');
        if (parts.length !== 2) return null;
        let [hourMin, meridiem] = parts;
        let [hourStr, minuteStr] = hourMin.split(':');
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        if (isNaN(hour) || isNaN(minute)) return null;
        meridiem = meridiem.toUpperCase();
        let hour24 = hour;
        if (meridiem === 'SA') {
            if (hour === 12) hour24 = 0; // 12:xx SA -> 00:xx
        } else if (meridiem === 'CH') {
            if (hour !== 12) hour24 += 12; // 01:xx CH -> 13:xx
        } else {
            return null; // Invalid meridiem
        }
        // Format back to HH:MM (zero padding)
        return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    /**
     * Parse giờ mở cửa từ định dạng Việt Nam sang cấu trúc WME SDK.
     * @param {string} openHoursString Ví dụ: "07:00 SA - 05:00 CH" hoặc "24/24"
     * @returns {Array<Object>|null} WME openingHours array hoặc null nếu lỗi.
     */
    function parseVietnameseOpenHours(openHoursString) {
        if (!openHoursString) return null;
        openHoursString = openHoursString.toString().trim().toUpperCase();
        if (openHoursString === '24/24') {
            return [{ days: [0, 1, 2, 3, 4, 5, 6], fromHour: "00:00", toHour: "00:00" }];
        }
        // Regex để bắt: HH:MM SA/CH - HH:MM SA/CH
        const match = openHoursString.match(/(\d{1,2}:\d{2}\s+(?:SA|CH))\s*-\s*(\d{1,2}:\d{2}\s+(?:SA|CH))/);
        if (!match) {
            log(`Không thể parse giờ mở cửa: "${openHoursString}".`, 'warn');
            return null;
        }
        const from24h = convertTo24Hour(match[1]);
        const to24h = convertTo24Hour(match[2]);
        if (from24h && to24h) {
            // Áp dụng cho cả 7 ngày trong tuần
            return [{ days: [0, 1, 2, 3, 4, 5, 6], fromHour: from24h, toHour: to24h }];
        } else {
            log(`Lỗi chuyển đổi giờ từ "${openHoursString}" sang 24h.`, 'error');
            return null;
        }
    }
    function capitalizeWords(string) {
        const words = string.split(' ');
        const capitalizedWords = words.map(word => {
            if (word.length === 0) return '';
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(' ');
    }
    /**
     * Thực thi một Task SDK cụ thể
     */
    async function executeSdkTask(task, selectedFeature) {
        // Parse params with {{variables}}
        const parsedParams = {};
        for (const [key, val] of Object.entries(task.params)) {
            parsedParams[key] = replacePlaceholders(val);
        }
        const WazeActionUpdateObject = require("Waze/Action/UpdateObject");
        const WazeActionUpdateFeatureAddress = require("Waze/Action/UpdateFeatureAddress");
        const featureModel = selectedFeature.WW.getObjectModel(); // Lấy Waze Model Object
        switch (task.taskId) {
            case "update_lock_rank": {
                const rank = parseInt(parsedParams.rank) || 1;
                const modelRank = Math.max(0, Math.min(5, rank - 1));
                if (featureModel.attributes.lockRank !== modelRank) {
                    W.model.actionManager.add(new WazeActionUpdateObject(featureModel, { lockRank: modelRank }));
                }
                break;
            }
            case "update_charge_station_api": {
                // Provider-based handler for external charge-station APIs (extensible)
                const providerKey = (parsedParams.provider || 'vinfast').toLowerCase();
                const handler = PROVIDERS_FETCH_API[providerKey];
                if (!handler) {
                    log(`SDK: Provider "${parsedParams.provider}" chưa được hỗ trợ.`, 'warn');
                    break;
                }
                // Luôn tạo panel của provider nếu nó được gọi, để hiển thị dữ liệu API
                createProviderPanel(handler); // Gọi hàm tạo panel chung
                if (!parsedParams.id) {
                    log('SDK: Không có ID API cung cấp cho cập nhật trạm sạc.', 'error');
                    // Vẫn gọi update panel để xóa dữ liệu cũ
                    handler.updatePanel(null);
                    break;
                }
                try {
                    // Lấy dữ liệu
                    const apiData = await handler.fetchData(parsedParams.id);
                    if (!apiData) {
                        log(`SDK: Không lấy được dữ liệu từ API ${handler.brand}.`, 'warn');
                        break;
                    }
                    currentApiData = apiData;
                    const featureModel = selectedFeature?.WW?.getObjectModel ? selectedFeature.WW.getObjectModel() : null;
                    if (!featureModel) {
                        log('SDK: Không có feature model hợp lệ để cập nhật trạm sạc.', 'error');
                        break;
                    }
                    // Let provider apply name/venue-level changes
                    if (typeof handler.transferNameToWME === 'function') {
                        await handler.transferNameToWME(featureModel);
                    }
                } catch (err) {
                    log(`SDK: Lỗi khi xử lý API trạm sạc: ${err.message}`, 'error');
                    console.error(err);
                }
                break;
            }
            case "update_segment_city": {
                let cityID = findCityIdByName(parsedParams.cityName);
                let city = W.model.cities.objects[cityID].attributes;
                let segmentsSelected = wmeSDK.Editing.getSelection()
                segmentsSelected?.ids.forEach(segmentId => {
                    // Process the city
                    const newCityProperties = {
                        cityName: city.name,
                        countryId: cityID,
                    };
                    let newCityId = wmeSDK.DataModel.Cities.getById({ cityId: cityID })?.id;
                    if (newCityId == null) {
                        newCityId = wmeSDK.DataModel.Cities.addCity(newCityProperties).id;
                    }
                    // Process the street
                    const newPrimaryStreetId = getOrCreateStreet(wmeSDK.DataModel.Segments.getAddress({ segmentId: segmentId }).street.name, newCityId).id;
                    // Update the segment with the new street
                    wmeSDK.DataModel.Segments.updateAddress({ segmentId, primaryStreetId: newPrimaryStreetId });
                });
                break;
            }
            case "update_gas_station": {
                // https://www.waze.com/editor/sdk/classes/index.SDK.Venues.html#updatevenue
                let venueSelected = wmeSDK.Editing.getSelection()
                const venueId = venueSelected.ids[0]
                let provider = parsedParams.provider;
                let name = parsedParams.name;
                const providerKey = (provider || '').trim().toLowerCase();
                const providerConfig = PROVIDERS_NON_API[providerKey];
                if (!providerConfig) {
                    log(`Provider "${parsedParams.provider}" chưa được hỗ trợ trong danh sách cấu hình.`, 'warn');
                    // Sử dụng tên provider thô nếu không tìm thấy config
                }
                let providerName = providerConfig?.brand || parsedParams.provider.toString();
                let providerPhone = providerConfig?.phone || '';
                let providerUrl = providerConfig?.url || '';
                name = name.replace(/Cửa hàng xăng dầu/gi, "CHXD");
                if (name.includes(provider)) {
                    name = name.replace(new RegExp(provider, "gi"), "").trim();
                }
                let finalName = `${PROVIDERS_NON_API[providerKey].brand} - ${name}`;
                const updatePayload = {
                    brand: providerName,
                    lockRank: 2,
                    name: finalName,
                    phone: providerPhone,
                    categories: [selectedSubCategory],
                    url: providerUrl,
                    venueId: venueId,
                };
                if (parsedParams.phone) {
                    const phoneValue = parsedParams.phone.toString().trim();
                    if (phoneValue) {
                        updatePayload.phone = phoneValue;
                    }
                }
                if (parsedParams.openHours) {
                    const hours = parseVietnameseOpenHours(parsedParams.openHours);
                    if (hours) {
                        updatePayload.openingHours = hours;
                    } else {
                        log(`SDK: Bỏ qua giờ mở cửa do parse lỗi hoặc định dạng không khớp.`, 'warn');
                    }
                }
                wmeSDK.DataModel.Venues.updateVenue(updatePayload)
            }
        }
        await delay(100); // Nhỏ delay để UI không bị đơ nếu chạy loop
    }
    async function runSelectedWorkflow(isCalledByLoop = false) {
        const workflowId = document.getElementById('workflow_select').value;
        if (!workflowId || !allWorkflows[workflowId]) {
            if (isCalledByLoop) throw new Error("Không workflow hợp lệ.");
            return alert("Chọn workflow hợp lệ!");
        }
        const workflow = allWorkflows[workflowId];
        const selection = WazeWrap.getSelectedFeatures();
        if (selection.length === 0) {
            log("❌ Chưa chọn đối tượng nào trên bản đồ!", "error");
            if (isCalledByLoop) throw new Error("Không có selection.");
            return;
        }
        // Với SDK, ta có thể xử lý nhiều object cùng lúc, nhưng ở đây ta loop qua object đầu tiên (hoặc tất cả nếu muốn)
        // Hiện tại script hỗ trợ workflow chạy trên 1 đối tượng focus từ Excel
        const target = selection[0];
        try {
            const tasksToRun = (workflow.tasks || []).filter(t => t.enabled);
            if (tasksToRun.length === 0) {
                log("Workflow không có hành động nào được bật.", "warn");
                return;
            }
            const workflowHasChargeApi = tasksToRun.some(t => t.taskId === 'update_charge_station_api');
            if (!workflowHasChargeApi) {
                resetApiPanelState();
            }
            for (const task of tasksToRun) {
                if (isCalledByLoop && !isLooping) throw new Error("Stopped by user");
                await executeSdkTask(task, target);
            }
        } catch (error) {
            log(`❌ Lỗi Workflow: ${error.message}`, 'error');
            console.error(error);
            throw error;
        }
    }
    async function toggleWorkflowLoop() {
        if (isLooping) {
            // Đang chạy, yêu cầu dừng
            isLooping = false;
            log("Đã yêu cầu dừng vòng lặp. Sẽ dừng sau khi hoàn thành hoặc giữa bước hiện tại.", 'warn');
            // updateUIState() sẽ được gọi bởi executeLoop khi nó thực sự dừng
        } else {
            // Không chạy, bắt đầu vòng lặp
            if (permalinks.length === 0) {
                log("Vui lòng tải một file Excel/CSV trước khi bắt đầu vòng lặp.", 'warn');
                return;
            }
            isLooping = true; // Thiết lập trạng thái đang lặp
            updateUIState(); // Cập nhật UI để hiển thị nút "Dừng Lặp"
            log("--- Bắt đầu vòng lặp tự động ---", 'special');
            await executeLoop();
        }
    }
    async function executeLoop() {
        if (currentIndex < 0 && permalinks.length > 0) {
            currentIndex = 0;
        }
        while (isLooping && currentIndex < permalinks.length) {
            updateUIState();
            updateStatus('Đang tạo'); // Đánh dấu đang làm việc
            try {
                await processCurrentLink();
                if (!isLooping) { break; }
                await delay(100);
                if (!isLooping) { break; }
                await runSelectedWorkflow(true);
                const shouldSavePermalink = document.getElementById('save_permalink_after_create')?.checked;

                // Kiểm tra có đối tượng đang được chọn (để đảm bảo có link hợp lệ)
                if (shouldSavePermalink) {
                    const newPermalink = wmeSDK.Map.getPermalink();
                    if (newPermalink) {
                        updatePermalinkInWorkbook(currentIndex, newPermalink);
                    } else {
                        log(`⚠️ (Loop) Không lấy được Permalink (Đối tượng chưa được lưu hoặc chưa có ID).`, 'warn');
                    }
                }
                // Đánh dấu Đã tạo khi hoàn thành workflow
                updateStatus('Đã tạo');
            } catch (error) {
                if (isLooping) {
                    log(`Lỗi ở mục ${currentIndex + 1}, bỏ qua và tiếp tục. Lỗi: ${error.message}`, 'error');
                } else {
                    log(`Vòng lặp đã dừng tại mục ${currentIndex + 1} do yêu cầu dừng.`, 'warn');
                }
                break;
            }
            if (!isLooping) break;
            if (currentIndex < permalinks.length - 1) {
                previousIndex = currentIndex; // Lưu index hiện tại
                currentIndex++;
                if (!isLooping) { break; }
                await delay(100);
            } else {
                log("Đã đến mục cuối cùng của danh sách.", 'info');
                isLooping = false;
            }
        }
        isLooping = false;
        if (currentIndex >= permalinks.length && permalinks.length > 0) {
            log("--- ✅ Hoàn thành vòng lặp tự động! ---", 'special');
        } else if (permalinks.length === 0) {
            log("Không có permalink nào để lặp.", 'warn');
        } else {
            log("--- Vòng lặp tự động đã dừng. ---", 'warn');
        }
        updateUIState();
    }

    function handleFile(e) {
        isGasMode = false;
        gasHeaders = null;

        resetData()
        permalinks = [];
        currentIndex = -1;
        previousIndex = -1;
        hasUnsavedChanges = false;
        const file = e.target.files[0];
        if (!file) {
            updateUIState();
            return;
        }
        currentFileName = file.name;
        const urlColumnInput = document.getElementById('url_column').value.toUpperCase();
        const urlColumnIndex = getColumnIndexFromLetter(urlColumnInput); // Hàm helper đã có
        if (urlColumnIndex < 0 || urlColumnIndex > 255) {
            log(`Lỗi: Cột "${urlColumnInput}" không hợp lệ. Vui lòng nhập A-IV.`, 'error');
            updateUIState();
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array',cellDates: false, cellStyles: false});
                workbookData = workbook;
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Lấy JSON header: 1 (array of arrays) để dễ dàng kiểm soát index
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });

                if (json.length === 0) {
                    log('File không có dữ liệu.', 'error');
                    updateUIState();
                    return;
                }

                const headerRow = json[0];
                statusColumnIndex = headerRow.findIndex(h => h && h.toString().trim().toLowerCase() === STATUS_COL_NAME.toLowerCase());
                let hasExistingStatus = statusColumnIndex !== -1;
                if (!hasExistingStatus) {
                    statusColumnIndex = headerRow.length;
                    headerRow.push(STATUS_COL_NAME);
                }
                const headersMap = headerRow.map(h => h.toString().trim() || null);
                const permalinkData = [];
                let foundWorkingIndex = -1;

                for (let i = 1; i < json.length; i++) {
                    const rawRow = json[i];

                    // Ensure row has enough columns
                    while (rawRow.length < statusColumnIndex + 1) {
                        rawRow.push('');
                    }

                    const cellValue = rawRow[urlColumnIndex];

                    if (cellValue && typeof cellValue === 'string') {
                        const trimmedValue = cellValue.trim();
                        const isURL = trimmedValue.includes('waze.com/editor') ||
                              trimmedValue.includes('waze.com/ul');
                        const isCoordinate = /^\s*\(?\s*-?\d+\.?\d*\s*,\s*-?\d+\.?\d*\s*\)?\s*$/.test(trimmedValue);

                        if (isURL || isCoordinate) {
                            // Build row object efficiently
                            const rowObject = {};

                            for (let idx = 0; idx < rawRow.length; idx++) {
                                const headerName = headersMap[idx];
                                const val = rawRow[idx];

                                if (headerName) {
                                    rowObject[headerName] = val;
                                }
                                // Column letter mapping
                                rowObject[getColumnLetter(idx)] = val;
                            }

                            const status = rawRow[statusColumnIndex].toString().trim();

                            permalinkData.push({
                                url: trimmedValue,
                                rowIndex: i,
                                status: status,
                                rowData: rowObject,
                                localFileIndexes: {
                                    urlCol: urlColumnIndex,
                                    statusCol: statusColumnIndex,
                                    sheetName: firstSheetName
                                }
                            });

                            const statusLower = status.toLowerCase();
                            if (foundWorkingIndex === -1 && statusLower === 'đang tạo') {
                                foundWorkingIndex = permalinkData.length - 1;
                            }
                            if (foundWorkingIndex === -1 && statusLower !== 'đã tạo') {
                                foundWorkingIndex = permalinkData.length - 1;
                            }
                        }
                    }
                }

                permalinks = permalinkData;

                // Ghi lại worksheet với cột Status (nếu mới tạo)
                const newWorksheet = XLSX.utils.aoa_to_sheet(json);
                workbookData.Sheets[firstSheetName] = newWorksheet;

                if (permalinks.length > 0) {
                    currentIndex = foundWorkingIndex !== -1 ? foundWorkingIndex : 0;
                    updateStatus('Đang tạo');
                    permalinks[currentIndex].status = 'Đang tạo';
                    processCurrentLink();
                } else {
                    log(`Không tìm thấy URL hoặc tọa độ hợp lệ trong cột ${urlColumnInput}.`, 'warn');
                }
                updateUIState();
            } catch (err) {
                log(`Lỗi khi đọc file: ${err.message}`, 'error');
                console.error(err);
                updateUIState();
            }
        };
        reader.readAsArrayBuffer(file);
    }
    function saveWorkflows() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allWorkflows));
            log("Đã lưu các workflows.", 'success');
        } catch (e) {
            log("Lỗi khi lưu workflows vào localStorage.", 'error');
        }
    }
    function loadWorkflows() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                allWorkflows = JSON.parse(saved);
            } else {
                allWorkflows = { ...defaultWorkflows };
                log("Đã tải các workflows mặc định. Các thay đổi sẽ được lưu lại.");
            }
        } catch (e) {
            log("Lỗi khi tải workflows từ localStorage, sử dụng các preset mặc định.", 'error');
            allWorkflows = { ...defaultWorkflows };
        }
    }
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function resetApiPanelState() {
        try {
            currentApiData = null; // Reset API data
            if (PROVIDERS_FETCH_API.vinfast) {
                // Dùng VinFast làm đại diện để reset UI panel
                PROVIDERS_FETCH_API.vinfast.updatePanel(null);
            }
            if (apiProviderPanel) {
                apiProviderPanel.style.display = 'none';
            }
        } catch (e) {
            console.error("Error resetting API panel state:", e);
        }
    }

    /**
* Cập nhật status cho URL hiện tại
*/
    function updateStatus(status) {
        const shouldSave = isStatusSavingEnabled();
        if (isGasMode) {
            if (permalinks[currentIndex]) {
                const item = permalinks[currentIndex];
                if (shouldSave) {
                    updateGasStatusByRowIndex(item.rowIndex, status);
                }
                item.status = status;
                updateSaveButtonState();
            }
        } else {
            if (currentIndex >= 0 && permalinks[currentIndex]) {
                const item = permalinks[currentIndex];
                if (shouldSave) { // Kiểm tra trước khi gọi hàm cập nhật file local
                    _updateLocalStatusCell(item.rowIndex, item.localFileIndexes.statusCol, status, item.localFileIndexes.sheetName);
                }
                item.status = status;
                hasUnsavedChanges = true;
                updateSaveButtonState();
            }

        }
    }
    /**
     * Tách hàm cập nhật trạng thái ô cụ thể trong workbookData (Local File only)
     * @param {number} rowIndex - Row index (0-based)
     * @param {number} colIndex - Column index (0-based)
     * @param {string} value - New status value
     * @param {string} sheetName - Target sheet name
     */
    function _updateLocalStatusCell(rowIndex, colIndex, value, sheetName) {
        if (!workbookData) return;
        try {
            const worksheet = workbookData.Sheets[sheetName];
            const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
            // Cập nhật giá trị ô
            worksheet[cellAddress] = { t: 's', v: value };

            // Cập nhật lại trạng thái bộ nhớ để kích hoạt nút Save
            // hasUnsavedChanges = true;
            updateSaveButtonState();
        } catch (err) {
            log(`Lỗi khi cập nhật cell [${rowIndex}, ${colIndex}] trong file local.`, 'error');
            console.error(err);
        }
    }

    /**
* Lưu workbook ra file và trigger download
*/
    function saveWorkbookToFile() {
        if (isGasMode) {
            log("Chế độ Google Sheets: Status được lưu tự động lên sheet.", 'info');
            hasUnsavedChanges = false;
            updateSaveButtonState();
            return;
        }
        if (!workbookData) {
            log('Không có dữ liệu để lưu.', 'warn');
            return;
        }
        try {
            const wbout = XLSX.write(workbookData, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentFileName;
            a.click();
            URL.revokeObjectURL(url);
            hasUnsavedChanges = false; // Reset cờ sau khi lưu
            updateSaveButtonState();
        } catch (err) {
            log(`Lỗi khi lưu file: ${err.message}`, 'error');
        }
    }
    /**
* Cập nhật trạng thái nút Save Status
*/
    function updateSaveButtonState() {
        const saveBtn = document.getElementById('save_status_btn');
        if (saveBtn) {
            saveBtn.disabled = !hasUnsavedChanges;
            if (hasUnsavedChanges) {
                saveBtn.classList.add('primary');
                saveBtn.style.animation = 'pulse 1.5s infinite';
            } else {
                saveBtn.classList.remove('primary');
                saveBtn.style.animation = '';
            }
        }
    }
    function waitForElement(selector, timeout = 7000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                // Check if element exists and is visible (offsetParent is not null)
                if (element && element.offsetParent !== null) {
                    clearInterval(interval);
                    resolve(element);
                }
                elapsedTime += intervalTime;
                if (elapsedTime >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`Element "${selector}" not found or not visible after ${timeout}ms`));
                }
            }, intervalTime);
        });
    }

    let logQueue = [];
    let logTimer = null;

    function log(message, type = 'normal') {
        const colorMap = {
            error: '#c0392b', success: '#27ae60', warn: '#e67e22',
            info: '#2980b9', special: '#8e44ad', normal: 'inherit'
        };

        logQueue.push({
            message,
            color: colorMap[type],
            time: new Date().toLocaleTimeString()
        });

        if (logTimer) clearTimeout(logTimer);

        logTimer = setTimeout(() => {
            const logBox = document.getElementById('log_info');
            if (!logBox) return;

            // Batch insert với DocumentFragment (nhanh hơn nhiều)
            const fragment = document.createDocumentFragment();
            const div = document.createElement('div');

            logQueue.forEach(({ message, color, time }) => {
                div.innerHTML = `<div style="color:${color}; border-bottom: 1px solid #f0f0f0;">[${time}] ${message}</div>`;
                fragment.insertBefore(div.firstChild, fragment.firstChild);
            });

            logBox.insertBefore(fragment, logBox.firstChild);

            // Giới hạn 20 dòng
            while (logBox.children.length > 20) {
                logBox.removeChild(logBox.lastChild);
            }

            logQueue.length = 0;
        }, 50); // Debounce 50ms
    }
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'workflow-engine-panel';
        panel.style.cssText = `
        position: fixed; top: 80px; left: 15px; background: rgba(255, 255, 255, 0.95); border: 1px solid #ccc;
        padding: 0; z-index: 1001; border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 11px; width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        panel.innerHTML = `
        <h5 id="navigator-header" style="display: flex; justify-content: space-between; align-items: center; margin:0; padding: 3px 3px; cursor: grab; border-bottom: 1px solid #eee; background: #f7f7f7; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <span>WME Workflow Engine</span>
        <button id="toggle_panel_btn" title="Thu gọn Panel">▲</button>
        </h5>
        <div id="wwe-panel-content" style="padding: 5px;">
            <!-- Section 1: Điều khiển chính -->
            <h6 style="margin-top: 0; margin-bottom: 5px; color: #333;">Điều khiển chính</h6>
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 5px;">
            <button id="prev_btn" class="nav-btn" title="Đối tượng trước (Mũi tên trái)" disabled>◀</button>
        <div style="display: flex; align-items: center; flex-grow: 1;">
            <input type="number" id="nav_index_input" min="1" style="width: 100%; text-align: center;" disabled>
                <span id="nav_total_count" style="margin-left: 5px; font-weight: bold;">/ N/A</span>
        </div>
        <button id="next_btn" class="nav-btn" title="Đối tượng tiếp theo (Mũi tên phải)" disabled>▶</button>
        </div>
        <div class="wwe-form-group" style="margin-top: 3px;">
            <label for="workflow_select">Chọn tác vụ:</label>
        <select id="workflow_select"></select>
        </div>
        <div class="wwe-form-group">
            <label for="workflow_variable_input">Giá trị nhập (cho <code>{{value}}</code>):</label>
                                                               <input type="text" id="workflow_variable_input" placeholder="Tên tỉnh/xã phường hoặc giá trị khác..." />
                                                               </div>
                                                               <button id="run_workflow_btn" class="action-btn primary" style="width: 100%;" title="Chạy workflow (Mũi tên xuống)" disabled>▶️ Chạy Workflow</button>
                                                               <button id="loop_workflow_btn" class="action-btn secondary" style="width: 100%; margin-top: 8px;" title="Lặp tự động chạy các tác vụ" disabled>🔁 Bắt đầu Lặp</button>
                                                               <hr style="border: 0; border-top: 1px solid #eee; margin: 5px 0;">
                                                               <!-- Nút Save Status -->
                                                               <button id="save_status_btn" class="action-btn" style="width: 100%; background-color: #28a745; color: white; border-color: #28a745;" title="Lưu trạng thái vào file" disabled>💾 Cập nhật Status</button>
                                                               <!-- Section 2: Accordion Items -->
                                                               <div class="accordion-container" style="margin-top: 5px;">
                                                               <!-- Accordion: Tải dữ liệu -->
                                                               <div class="accordion-item">
                                                               <button class="accordion-header">Tải & Cấu hình Dữ liệu</button>
                                                               <div class="accordion-content">

                                                               <div class="wwe-form-group">
                                                                <label>Nguồn dữ liệu:</label>
                                                                <div style="display: flex; gap: 10px;">
                                                                    <label style="font-weight: normal; cursor: pointer;"><input type="radio" name="data_source_mode" value="local" checked> File Local</label>
                                                                    <label style="font-weight: normal; cursor: pointer;"><input type="radio" name="data_source_mode" value="gas"> Google Sheets (GAS)</label>
                                                                </div>
                                                               </div>

                                                               <div id="local_file_config">
                                                                <div class="wwe-form-group">
                                                                    <label for="excel_file">Chọn File Excel/CSV:</label>
                                                                    <input type="file" id="excel_file" accept=".xlsx, .xls, .csv"/>
                                                                </div>
                                                                <div class="wwe-form-group row-group">
                                                                    <label for="url_column">Cột URL/Tọa độ (A-Z):</label>
                                                                    <input type="text" id="url_column" value="F" style="text-transform: uppercase; text-align: center; width: 50px;">
                                                                </div>
                                                               </div>

                                                               <div id="gas_config" style="display: none;">
                                                                <div class="wwe-form-group">
                                                                    <label for="gas_url">Google Web App URL (GAS):</label>
                                                                    <input type="text" id="gas_url" placeholder="https://script.google.com/macros/s/..." />
                                                                </div>
                                                                <div class="wwe-form-group">
        <label for="sheet_name_input">Tên Sheet (Tab) cần xử lý:</label>
        <input type="text" id="sheet_name_input" value="Sheet1" placeholder="Ví dụ: Data_To_Process">
        </div>
                                                                <div class="wwe-form-group">
                                                                    <label for="url_col_name">Tên Cột URL/Tọa độ (Header Name):</label>
                                                                    <input type="text" id="url_col_name" value="Link WME" placeholder="Ví dụ: Link WME">
                                                                </div>
                                                                <div class="wwe-form-group" style="margin-top: -5px; margin-bottom: 12px;">
                                                                    <label for="skip_done_check" style="font-weight: normal; font-size: 13px;">
                                                                        <input type="checkbox" id="skip_done_check" checked style="width: auto; margin-right: 5px;">
                                                                        Bỏ qua các dòng có Status là "Đã tạo" khi tải.
                                                                    </label>
                                                                </div>
                                                                <button id="load_sheet_btn" class="action-btn primary" style="width: 100%;">Tải Dữ liệu từ Sheet</button>
                                                               </div>
                                                               <button id="reselect_btn" class="action-btn secondary" style="width: 100%; margin-top: 3px;" title="Tải lại đối tượng hiện tại (Mũi tên lên)" disabled>🔄 Tải lại & Chọn</button>
                                                               </div>
                                                               </div>
                                                               <div class="accordion-item">
                                                               <button class="accordion-header">Zoom & Lưu Permalink</button>
                                                               <div class="accordion-content">
                                                               <div class="wwe-form-group">

                                                               <label for="coordinate_zoom">Zoom level cho tọa độ:</label>
                                                               <input type="number" id="coordinate_zoom" value="20" min="1" max="25" style="width: 50px;">
                                                               </div>
                                                               <div class="wwe-form-group" style="margin-top: 3px;">
                                                               <label style="font-weight: normal; display: flex; align-items: center; margin-bottom: 5px;">
        <input type="checkbox" id="save_status_enabled" checked style="width: auto; margin-right: 3px;">
        Tự động lưu Status
    </label>
                <label style="font-weight: normal; display: flex; align-items: center;">
                    <input type="checkbox" id="save_permalink_after_create" checked style="width: auto; margin-right: 3px;">
                    Tự động lưu Permalink
                </label>
            </div>
                                                               </div>
                                                               </div>
                                                               <!-- Accordion: Chức năng POI -->
                                                               <div class="accordion-item">
    <button class="accordion-header">Công cụ tạo POI</button>
    <div class="accordion-content">
        <label style="font-weight: bold; margin-bottom: 5px; display: block;">1. Loại POI:</label>
        <div style="display: flex; gap: 10px; margin-bottom: 8px;">
            <label><input type="radio" name="poi_creation_mode" value="none" checked> Không</label>
            <label><input type="radio" name="poi_creation_mode" value="point"> Điểm</label>
            <label><input type="radio" name="poi_creation_mode" value="area"> Vùng</label>
        </div>

        <label style="font-weight: bold; margin-bottom: 5px; display: block;">2. Phương thức:</label>
        <div style="display: flex; gap: 10px; margin-bottom: 8px;">
            <label><input type="radio" name="poi_method" value="auto" checked> Tự động</label>
            <label><input type="radio" name="poi_method" value="manual"> Click tay</label>
        </div>

        <div class="wwe-form-group">
            <label>Category:</label>
            <select id="poi_category_select"></select>
        </div>
    </div>
</div>
                                                               <!-- Accordion: Quản lý Workflows -->
                                                               <div class="accordion-item">
                                                               <button class="accordion-header">Quản lý Workflows</button>
                                                               <div class="accordion-content">
                                                               <div style="display: flex;margin: 5px 0 5px 0;">
                                                               <button id="edit_workflow_btn" class="action-btn" style="flex-grow: 1;">✏️ Sửa</button>
                                                               <button id="new_workflow_btn" class="action-btn" style="flex-grow: 1;">➕ Tạo mới</button>
                                                               <button id="delete_workflow_btn" class="action-btn danger" style="flex-grow: 1;">🗑️ Xóa</button>
                                                               </div>
                                                               </div>
                                                               </div>
                                                               <!-- Accordion: Nhật ký -->
                                                               <div class="accordion-item">
                                                               <button class="accordion-header">Nhật ký Hoạt động</button>
                                                               <div class="accordion-content">
                                                               <div id="log_info" style="font-size: 11px; height: 120px; overflow-y: auto; border: 1px solid #eee; padding: 5px; background: #f8f9fa; border-radius: 4px; margin-top: 5px;"></div>
                                                               </div>
                                                               </div>
                                                               </div>
                                                               </div>
                                                               `;
        document.body.appendChild(panel);
        if (!document.getElementById('wme-wfe-styles')) {
            const style = document.createElement('style');
            style.id = 'wme-wfe-styles';
            style.innerHTML = `
        /* CSS Styles (Copied and optimized from original thought process) */
        #workflow-engine-panel button, #workflow-editor-modal button {
                                                                   border: 1px solid #ccc;
                                                                   background-color: #f0f0f0;
                                                                   border-radius: 4px;
                                                                   padding: 5px 10px;
                                                                   cursor: pointer;
                                                                   transition: background-color 0.2s, border-color 0.2s;
                                                                   font-family: inherit;
                                                                   }
    #workflow-engine-panel button:hover:not(:disabled), #workflow-editor-modal button:hover:not(:disabled) {
        background-color: #e0e0e0;
    }
    #workflow-engine-panel button:disabled, #workflow-editor-modal button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
    #workflow-engine-panel input[type=text], #workflow-engine-panel input[type=number], #workflow-engine-panel input[type=file], #workflow-engine-panel select,
        #workflow-editor-modal input[type=text], #workflow-editor-modal select {
            border-radius: 4px;
            border: 1px solid #ccc;
            width: 100%;
            box-sizing: border-box;
            padding: 5px;
            font-family: inherit;
        }
    #toggle_panel_btn, #toggle_editor_panel_btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 15px;
        line-height: 1;
        padding: 0 5px;
        color: #888;
        font-weight: bold;
    }
    #workflow-engine-panel.is-collapsed #wwe-panel-content { display: none; }
    #workflow-engine-panel.is-collapsed #navigator-header { border-bottom: none; }
    #workflow-engine-panel .nav-btn { font-size: 12x; padding: 5px 12px; font-weight: bold; }
    #workflow-engine-panel .action-btn { font-weight: 500; }
    #workflow-engine-panel .action-btn.primary { background-color: #007bff; color: white; border-color: #007bff; }
    #workflow-engine-panel .action-btn.primary:hover:not(:disabled) { background-color: #0056b3; }
    #workflow-engine-panel .action-btn.secondary { background-color: #6c757d; color: white; border-color: #6c757d; }
    #workflow-engine-panel .action-btn.secondary:hover:not(:disabled) { background-color: #5a6268; }
    #workflow-engine-panel .action-btn.danger { background-color: #dc3545; color: white; border-color: #dc3545; }
    #workflow-engine-panel .action-btn.danger:hover:not(:disabled) { background-color: #c82333; }
    #loop_workflow_btn.looping { background-color: #ffc107; border-color: #ffc107; color: black; font-weight: bold; }
    #loop_workflow_btn.looping:hover:not(:disabled) { background-color: #e0a800; border-color: #d39e00;}
    .workflow-btns { display: flex; justify-content: flex-end; margin-top: 5px; }
    .workflow-btns button:first-child { margin-right: auto; }
    .wwe-form-group { display: flex; flex-direction: column; margin-bottom: 3px; }
    .wwe-form-group label { font-weight: bold; font-size: 12px; margin-bottom: 3px; }
    .wwe-form-group.row-group label { width: 100%; }
    /* Accordion Styles */
    .accordion-item { border-top: 1px solid #eee; }
    .accordion-header {
        background-color: #f7f7f7; color: #444; cursor: pointer; padding: 10px;
        width: 100%; border: none; text-align: left; outline: none;
        font-size: 12px; transition: background-color 0.2s; font-weight: bold;
    }
    .accordion-header:hover { background-color: #e9e9e9; }
    .accordion-header::after { content: ' ▼'; font-size: 10px; float: right; margin-top: 3px; }
    .accordion-header.active::after { content: ' ▲'; }
    .accordion-content {
        padding: 0 15px; background-color: white;
        max-height: 0; overflow: hidden;
        transition: max-height 0.3s ease-out;
    }
    /* Workflow Editor Modal Styles */
    #workflow-editor-modal {
        display: none; position: fixed; z-index: 1002; left: 0; top: 0;
        width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6);
    }
    #workflow-editor-content {
        background-color: #fefefe; padding: 0; border: 1px solid #888;
        width: 80%; max-width: 700px; border-radius: 8px; position: absolute;
        top: 50%; left: 50%; transform: translate(-50%, -50%);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    #editor-header {
        display: flex; justify-content: space-between; align-items: center;
        padding: 5px 10px !important; cursor: grab; border-bottom: 1px solid #eee;
        background: #f7f7f7; border-top-left-radius: 8px; border-top-right-radius: 8px;
    }
    #workflow-editor-content.is-collapsed #editor-panel-content { display: none; }
    #workflow-steps_list { list-style: none; padding: 0; min-height: 100px; border: 1px dashed #ccc; padding: 5px; border-radius: 4px; background: #fff; }
    #workflow_steps_list li {
        display: flex; align-items: center; justify-content: space-between;
        padding: 6px 10px; border: 1px solid #ddd; margin-bottom: 3px;
        border-radius: 4px; background: #fafafa; cursor: grab;
    }
    #workflow_steps_list li .step-number { margin-right: 3px; font-weight: bold; color: #888; }
    #workflow_steps_list li.editing { background-color: #e0eafc !important; border-color: #007bff !important; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    #save_status_btn:not(:disabled):hover { background-color: #218838 !important; }
    `;
            document.head.appendChild(style);
        }
        // const style = document.createElement('style');
        // style.innerHTML = ;
        // document.head.appendChild(style);
        // Accordion functionality for main panel
        panel.addEventListener('click', (e) => {
            const header = e.target.closest('.accordion-header');
            if (!header) return;

            // Đóng các accordion khác
            panel.querySelectorAll('.accordion-header.active').forEach(activeButton => {
                if (activeButton !== header) {
                    activeButton.classList.remove('active');
                    activeButton.nextElementSibling.style.maxHeight = null;
                }
            });

            header.classList.toggle('active');
            const content = header.nextElementSibling;
            content.style.maxHeight = content.style.maxHeight ? null : (content.scrollHeight + 10 + "px");
        });
        // Toggle panel button for main panel
        const toggleBtn = document.getElementById('toggle_panel_btn');
        registerEventCleanup(toggleBtn, 'click', (e) => {
            e.stopPropagation();
            const isCollapsed = panel.classList.toggle('is-collapsed');
            e.currentTarget.innerHTML = isCollapsed ? '▼' : '▲';
            e.currentTarget.title = isCollapsed ? 'Mở rộng Panel' : 'Thu gọn Panel';
        });

        // Radio buttons với delegation
        const localConfig = document.getElementById('local_file_config');
        const gasConfig = document.getElementById('gas_config');
        const saveStatusBtn = document.getElementById('save_status_btn');

        panel.addEventListener('change', (e) => {
            if (e.target.name === 'data_source_mode') {
                const mode = e.target.value;
                localConfig.style.display = mode === 'local' ? 'block' : 'none';
                gasConfig.style.display = mode === 'gas' ? 'block' : 'none';
                saveStatusBtn.textContent = mode === 'local' ?
                    '💾 Cập nhật Status vào File' :
                '☁️ Cập nhật Status (Tự động)';
            }
        });

        // File input - phải dùng direct listener
        document.getElementById('excel_file').addEventListener('change', handleFile, false);

        // Các button event - dùng registry
        const btnEvents = [
            ['load_sheet_btn', loadFromGoogleSheet],
            ['prev_btn', () => navigate(-1)],
            ['next_btn', () => navigate(1)],
            ['reselect_btn', processCurrentLink],
            ['run_workflow_btn', () => runSelectedWorkflow(false)],
            ['loop_workflow_btn', toggleWorkflowLoop],
            ['save_status_btn', saveWorkbookToFile],
            ['new_workflow_btn', () => openWorkflowEditor()],
            ['edit_workflow_btn', () => {
                const id = document.getElementById('workflow_select').value;
                if (id) openWorkflowEditor(id);
            }],
            ['delete_workflow_btn', deleteSelectedWorkflow]
        ];

        btnEvents.forEach(([id, handler]) => {
            const el = document.getElementById(id);
            if (el) registerEventCleanup(el, 'click', handler);
        });

        // Select events
        registerEventCleanup(
            document.getElementById('poi_category_select'),
            'change',
            (e) => { selectedSubCategory = e.target.value; }
        );

        registerEventCleanup(
            document.getElementById('nav_index_input'),
            'change',
            (e) => {
                const targetIndex = parseInt(e.target.value, 10);
                if (!isNaN(targetIndex)) navigate(0, targetIndex - 1);
            }
        );

        registerEventCleanup(
            document.getElementById('workflow_select'),
            'change',
            () => {
                resetApiPanelState();
                updateUIState();
                if (currentIndex >= 0 && permalinks.length > 0) {
                    processCurrentLink();
                }
            }
        );

        populateCategorySelector();
        loadGasSettings();
        makeDraggable(panel, document.getElementById('navigator-header'));

    };
    let apiProviderPanel = null;
    function populateCategorySelector() {
        const select = document.getElementById('poi_category_select');
        select.innerHTML = ''; // Clear existing options
        for (const cat of CATEGORIES) {
            // Tạo optgroup cho mỗi group key
            const optgroup = document.createElement('optgroup');
            optgroup.label = cat.key.replace(/_/g, ' ');
            // Thêm các sub categories
            for (const sub of cat.subs) {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub.replace(/_/g, ' ');
                if (sub === selectedSubCategory) {
                    option.selected = true;
                }
                optgroup.appendChild(option);
            }
            select.appendChild(optgroup);
        }
    }
    let vinfastPanel = null;
    function createProviderPanel(providerHandler) {
        if (apiProviderPanel) { // Đã đổi tên
            // Nếu đã có panel, chỉ cần reset nó
            providerHandler.updatePanel(null);
            document.getElementById('vf-panel-title').textContent = `${providerHandler.brand} Charging`;
            document.getElementById('vf-id-input').placeholder = `Nhập ID ${providerHandler.brand}`;
            document.getElementById('vf-transfer-name-btn').title = `Chuyển tên ${providerHandler.brand} vào trường Place Name`;
            return;
        }
        const panel = document.createElement('div');
        panel.id = 'vf-panel';
        panel.style.cssText = `
                position: fixed; top: 80px; left: 450px; background: rgba(255, 255, 255, 0.95); border: 1px solid #ccc;
                padding: 10px; z-index: 1000; border-radius: 8px; width: 300px; max-height: 500px;
                font-family: inherit; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: opacity 0.3s;
            `;
        panel.innerHTML = `
                <h4 id="vf-panel-title" style="margin: 0 0 10px 0; color: #007bff; border-bottom: 1px solid #eee; padding-bottom: 5px;">${providerHandler.brand} Charging</h4>
                <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                    <input type="text" id="vf-id-input" placeholder="Nhập ID ${providerHandler.brand}" style="flex-grow: 1; padding: 4px;">
                    <button id="vf-fetch-btn" class="action-btn primary" style="padding: 4px 8px; font-size: 12px; height: auto;">Fetch</button>
                </div>
                <div id="vf-data-display" style="display: none;">
                    <div id="vf-name-line" style="margin-bottom: 8px; font-weight: bold; display: flex; align-items: center; border-bottom: 1px dashed #ddd; padding-bottom: 5px;">
                        <span style="flex-shrink: 0; margin-right: 5px;">Tên:</span>
                        <span id="vf-name-text" style="flex-grow: 1; margin-right: 5px;"></span>
                        <!-- Nút chuyển tên -->
                        <button id="vf-transfer-name-btn" title="Chuyển tên ${providerHandler.brand} vào trường Place Name" style="padding: 2px 5px; font-size: 12px; background-color: #f39c12; color: white; border-color: #f39c12; line-height: 1;"><-> Swap</button>
                    </div>
                    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                        <button id="vf-images-btn" class="action-btn" style="flex: 1; background-color: #17a2b8; color: white; border-color: #17a2b8; font-size: 12px;">📷 Xem Ảnh</button>
                    </div>
                    <h5 style="margin: 5px 0;">Cổng sạc & Công suất:</h5>
                    <div id="vf-connectors-info" style="border: 1px solid #ddd; padding: 8px; border-radius: 4px; background: #f9f9f9; max-height: 200px; overflow-y: auto;">
                        <i style="color: #777;">Chưa có dữ liệu cổng sạc.</i>
                    </div>
                </div>
            `;
        document.body.appendChild(panel);
        apiProviderPanel = panel; // Đã đổi tên
        // Bật draggable cho panel
        makeDraggable(panel, panel.querySelector('#vf-panel-title'));
        // Hàm xử lý fetch chung cho panel
        async function handleProviderFetchClick() {
            const id = document.getElementById('vf-id-input').value.trim();
            if (id) {
                const fetchBtn = document.getElementById('vf-fetch-btn');
                if (fetchBtn) {
                    fetchBtn.textContent = 'Fetching...';
                    fetchBtn.disabled = true;
                }
                try {
                    // Gọi fetchData từ providerHandler
                    await providerHandler.fetchData(id);
                } catch (e) {
                    log(`Lỗi khi fetch data cho ${providerHandler.brand}: ${e.message}`, 'error');
                } finally {
                    // updatePanel sẽ được gọi trong fetchData, fetchBtn sẽ được reset ở đó
                }
            } else {
                log(`Vui lòng nhập ID ${providerHandler.brand}.`, 'warn');
            }
        }
        // Attach listeners
        document.getElementById('vf-fetch-btn').addEventListener('click', handleProviderFetchClick);
        // Chuyển nút Transfer Name sang gọi trực tiếp từ provider
        document.getElementById('vf-transfer-name-btn').addEventListener('click', () => {
            if (providerHandler.transferNameToWME) {
                providerHandler.transferNameToWME();
            }
        });
        // Chuyển nút Images sang gọi trực tiếp từ provider
        document.getElementById('vf-images-btn').addEventListener('click', () => {
            if (providerHandler.showImagesPopup) {
                providerHandler.showImagesPopup();
            }
        });
        providerHandler.updatePanel(null); // Reset UI sau khi tạo
    }
    /**
    * Makes an element draggable using its handle.
    * @param {HTMLElement} elementToMove The element that will be moved.
    * @param {HTMLElement} dragHandle The element that acts as the drag handle.
    */
    function makeDraggable(elementToMove, dragHandle) {
        let offsetX, offsetY;
        let isDragging = false;
        dragHandle.onmousedown = (e) => {
            e.preventDefault();
            isDragging = true;
            dragHandle.style.cursor = 'grabbing'; // Change cursor while dragging
            // Get the element's current computed style to check its position
            const computedStyle = getComputedStyle(elementToMove);
            if (computedStyle.position === 'static') {
                elementToMove.style.position = 'absolute'; // Change to absolute if not already positioned
            }
            // If the element has a transform property (like translate for centering),
            // apply that transform to its top/left before dragging starts.
            if (computedStyle.transform && computedStyle.transform !== 'none') {
                const matrix = new DOMMatrixReadOnly(computedStyle.transform);
                // Adjust element's current top/left by its transform translate values
                elementToMove.style.left = (elementToMove.offsetLeft + matrix.m41) + 'px';
                elementToMove.style.top = (elementToMove.offsetTop + matrix.m42) + 'px';
                elementToMove.style.transform = 'none'; // Clear the transform
            }
            // Calculate the initial offset from the element's current position to the mouse click
            const rect = elementToMove.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.onmousemove = (ev) => {
                if (!isDragging) return;
                // Calculate new position based on mouse position and initial offset
                elementToMove.style.left = (ev.clientX - offsetX) + 'px';
                elementToMove.style.top = (ev.clientY - offsetY) + 'px';
            };
            document.onmouseup = () => {
                isDragging = false;
                document.onmouseup = null;
                document.onmousemove = null;
                dragHandle.style.cursor = 'grab'; // Reset cursor
            };
        };
    }
    function isStatusSavingEnabled() {
        return document.getElementById('save_status_enabled')?.checked === true;
    }
    function createWorkflowEditorModal() {
        const modal = document.createElement('div');
        modal.id = 'workflow-editor-modal';
        // CSS giữ nguyên hoặc tùy chỉnh nhẹ
        modal.innerHTML = `
            <div id="workflow-editor-content" style="width: 600px;">
                <h3 id="editor-header">
                    <span id="editor-title">Chỉnh sửa Workflow (SDK Mode)</span>
                    <span id="close-modal" style="float:right; cursor:pointer; font-size:20px;">×</span>
                </h3>
                <div id="editor-panel-content" style="padding: 15px; max-height: 70vh; overflow-y: auto;">
                    <input type="hidden" id="editing_workflow_id">
                    <div class="wwe-form-group">
                        <label>Tên tác vụ:</label>
                        <input type="text" id="workflow_name_input" placeholder="Nhập tên tác vụ...">
                    </div>
                    <hr>
                    <h4>Chọn các hành động thực thi:</h4>
                    <div id="sdk-tasks-container">
                        <!-- Tasks will be injected here via JS -->
                    </div>
                    <div class="workflow-btns" style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                        <button id="save_workflow_btn" class="primary">Lưu các tác vụ</button>
                        <button id="cancel_workflow_btn" class="secondary">Hủy</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);
        // Event listeners
        document.getElementById('close-modal').onclick = closeWorkflowEditor;
        document.getElementById('cancel_workflow_btn').onclick = closeWorkflowEditor;
        document.getElementById('save_workflow_btn').onclick = saveWorkflowFromEditor;
        makeDraggable(document.getElementById('workflow-editor-content'), document.getElementById('editor-header'));
    }
    function renderSdkTasksInEditor(existingTasks = []) {
        const container = document.getElementById('sdk-tasks-container');
        container.innerHTML = '';
        Object.keys(SDK_REGISTRY).forEach(taskId => {
            const def = SDK_REGISTRY[taskId];
            // Kiểm tra xem task này đã có trong workflow cũ chưa
            const existing = existingTasks.find(t => t.taskId === taskId) || { enabled: false, params: {} };
            const wrapper = document.createElement('div');
            wrapper.style.cssText = "border: 1px solid #ddd; margin-bottom: 8px; padding: 10px; border-radius: 4px; background: #fafafa;";
            // Header: Checkbox + Name
            const header = document.createElement('div');
            header.innerHTML = `
                <label style="font-weight: bold; color: #333; display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" class="task-enable-cb" data-task-id="${taskId}" ${existing.enabled ? 'checked' : ''} style="width: auto; margin-right: 8px;">
                    ${def.name}
                </label>
                <div style="font-size: 0.85em; color: #666; margin-left: 24px; margin-bottom: 5px;">${def.description}</div>
            `;
            wrapper.appendChild(header);
            // Params Inputs
            if (def.params.length > 0) {
                const paramsDiv = document.createElement('div');
                paramsDiv.className = 'task-params';
                paramsDiv.style.cssText = `margin-left: 24px; display: ${existing.enabled ? 'block' : 'none'};`;
                def.params.forEach(p => {
                    const row = document.createElement('div');
                    row.style.marginBottom = '5px';
                    const val = existing.params[p.key] || '';
                    row.innerHTML = `
                        <label style="display:block; font-size: 11px; margin-bottom: 2px;">${p.label}:</label>
                        <input type="text" class="task-param-input" data-task-id="${taskId}" data-param-key="${p.key}" value="${val}" placeholder="${p.placeholder}" style="width: 100%;">
                    `;
                    paramsDiv.appendChild(row);
                });
                wrapper.appendChild(paramsDiv);
            }
            container.appendChild(wrapper);
        });
        // Toggle hiển thị params khi check/uncheck
        container.querySelectorAll('.task-enable-cb').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const paramsDiv = e.target.closest('div').parentElement.querySelector('.task-params');
                if (paramsDiv) paramsDiv.style.display = e.target.checked ? 'block' : 'none';
            });
        });
    }
    function registerHotkeys() {
        document.addEventListener('keydown', (e) => {
            // Do not trigger hotkeys if focus is in an input field or a text area,
            // or if the event originated from within our panels/modals
            if (e.target.closest('#workflow-engine-panel, #workflow-editor-modal') || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            if (e.key === 'ArrowRight' && !document.getElementById('next_btn').disabled) {
                e.preventDefault();
                document.getElementById('next_btn').click();
            }
            if (e.key === 'ArrowLeft' && !document.getElementById('prev_btn').disabled) {
                e.preventDefault();
                document.getElementById('prev_btn').click();
            }
            if (e.key === 'ArrowUp' && !document.getElementById('reselect_btn').disabled) {
                e.preventDefault();
                document.getElementById('reselect_btn').click();
            }
            if (e.key === 'ArrowDown' && !document.getElementById('run_workflow_btn').disabled) {
                e.preventDefault();
                document.getElementById('run_workflow_btn').click();
            }
            if (e.key.toLowerCase() === 'u') {
                e.preventDefault();
                updateStatus('Không tồn tại');
                permalinks[currentIndex].status = 'Không tồn tại';
                window.alert('Workflow Engine: Đã đánh dấu "Không tồn tại" cho vị trí này.');
            }
        });
    }
    function navigate(direction, targetIndex = null) {
        placeholderCache.clear();
        if (isLooping) return;
        if (permalinks.length === 0) return;

        let newIndex = (targetIndex !== null) ? targetIndex : (currentIndex + direction);

        if (newIndex >= 0 && newIndex < permalinks.length) {

            const previousIndex = currentIndex;
            const navigationDirection = newIndex - currentIndex;

            if (previousIndex >= 0 && previousIndex !== newIndex) {
                const currentItemStatus = permalinks[previousIndex].status?.toLowerCase();
                const shouldSavePermalink = document.getElementById('save_permalink_after_create')?.checked;
                if (shouldSavePermalink && navigationDirection > 0) {
                    const newPermalink = wmeSDK.Map.getPermalink();
                    if (newPermalink) {
                        updatePermalinkInWorkbook(previousIndex, newPermalink);
                    } else {
                        log(`⚠️ Không lấy được Permalink cho mục ${previousIndex + 1}.`, 'warn');
                    }
                }
                if (currentItemStatus === 'đang tạo' || currentItemStatus === '') {
                    updateStatusByIndex(previousIndex, 'Đã tạo');
                }
            }

            currentIndex = newIndex;
            // Nếu mục mới chưa có status hoặc là "Đã tạo", đặt lại là Đang tạo
            if (!permalinks[currentIndex].status || permalinks[currentIndex].status.toLowerCase() !== 'đang tạo') {
                updateStatus('Đang tạo');
                // Cập nhật trạng thái local ngay lập tức
                permalinks[currentIndex].status = 'Đang tạo';
            }

            updateUIState();
            processCurrentLink();
        }
    }
    /**
    * Cập nhật status cho một URL cụ thể theo index
    */
    function updateStatusByIndex(index, status) {
        const shouldSave = isStatusSavingEnabled();
        if (isGasMode) {
            if (index >= 0 && permalinks[index]) {
                const item = permalinks[index];
                if (shouldSave) {
                    updateGasStatusByRowIndex(item.rowIndex, status);
                }
                item.status = status; // Cập nhật local state
            }
        } else {
            if (index >= 0 && permalinks[index] && permalinks[index].localFileIndexes) {
                const item = permalinks[index];
                if (shouldSave) {
                    _updateLocalStatusCell(item.rowIndex, item.localFileIndexes.statusCol, status, item.localFileIndexes.sheetName);
                }

                item.status = status;
            }
        }

    }
    function extractCoords(item) {
        // 1. Thử lấy từ API data nếu có
        if (currentApiData?.lat || currentApiData?.coordinates?.latitude) {
            return {
                lat: parseFloat(currentApiData.lat || currentApiData.coordinates.latitude),
                lon: parseFloat(currentApiData.lng || currentApiData.coordinates.longitude)
            };
        }
        // 2. Thử lấy từ định dạng tọa độ thô "10.123, 106.123"
        const coordMatch = item.url.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
        if (coordMatch) return { lat: parseFloat(coordMatch[1]), lon: parseFloat(coordMatch[2]) };

        // 3. Thử lấy bằng Regex từ URL Waze (phòng trường hợp URL lỗi nhưng vẫn có số)
        const urlMatch = item.url.match(/lat=(-?\d+\.\d+)&lon=(-?\d+\.\d+)/);
        if (urlMatch) return { lat: parseFloat(urlMatch[1]), lon: parseFloat(urlMatch[2]) };

        return null;
    }
    async function processCurrentLink() {
        if (currentIndex < 0 || currentIndex >= permalinks.length) return;
        const item = permalinks[currentIndex]; // permalinks giờ sẽ chứa object {url, rowIndex, rowData...}
        currentRowData = item.rowData; // Cập nhật dữ liệu hàng hiện tại để hàm replacePlaceholders dùng
        currentApiData = null; // Reset API data cũ
        // 1. Xác định Workflow, Provider và API ID cần fetch
        const selectedWorkflowId = document.getElementById('workflow_select')?.value;
        const selectedWorkflow = selectedWorkflowId ? allWorkflows[selectedWorkflowId] : null;
        let targetApiId = '';
        let providerHandler = null;
        if (selectedWorkflow && Array.isArray(selectedWorkflow.tasks)) {
            const chargeApiTask = selectedWorkflow.tasks.find(t => t.enabled && t.taskId === 'update_charge_station_api');
            if (chargeApiTask) {
                const providerKey = (chargeApiTask.params.provider || 'vinfast').toLowerCase();
                providerHandler = PROVIDERS_FETCH_API[providerKey];
                // --- LẤY ID TỪ PLACEHOLDER TRONG CẤU HÌNH WORKFLOW ---
                const idPlaceholder = chargeApiTask.params.id || ''; // Ví dụ: "{{A}}"
                // Sử dụng replacePlaceholders để resolve cột A, B, C... thành giá trị thực
                let resolvedId = replacePlaceholders(idPlaceholder);
                targetApiId = resolvedId ? resolvedId.toString().trim() : '';
            }
        }
        // 2. Cập nhật UI và Fetch tọa độ nếu cần
        const vfIdInput = document.getElementById('vf-id-input');
        if (vfIdInput) {
            vfIdInput.value = targetApiId; // Cập nhật input ID trên panel
        }
        currentApiData = null;
        let targetLat = null;
        let targetLng = null;
        let isCoordinateFromAPI = false;
        // Nếu workflow có API sạc và có provider, tạo/reset panel và fetch data nếu có ID
        if (providerHandler) {
            createProviderPanel(providerHandler);
            if (targetApiId) {
                try {
                    // Gọi fetchData từ providerHandler
                    const apiResult = await providerHandler.fetchData(targetApiId);
                    if (apiResult && (apiResult.lat || (apiResult.coordinates && apiResult.coordinates.latitude))) {
                        targetLat = parseFloat(apiResult.lat || apiResult.coordinates.latitude);
                        targetLng = parseFloat(apiResult.lng || apiResult.coordinates.longitude);
                        isCoordinateFromAPI = true;
                    }
                } catch (e) { log(`Lỗi API ${providerHandler.brand}: ${e.message}`, 'warn'); }
            }
        } else if (apiProviderPanel) {
            // Nếu workflow không yêu cầu API sạc, ẩn panel nếu nó tồn tại
            apiProviderPanel.style.display = 'none';
        }
        const coords = extractCoords(item);
        const createMode = document.querySelector('input[name="poi_creation_mode"]:checked')?.value || 'none';
        const method = document.querySelector('input[name="poi_method"]:checked').value;
        if (coords) {
            const zoom = parseInt(document.getElementById('coordinate_zoom')?.value || 20);
            W.map.setCenter(WazeWrap.Geometry.ConvertTo900913(coords.lon, coords.lat), zoom);
            if (createMode !== 'none' && !item.url.includes('venues=')) {
                await delay(50);
                createWazePOI(coords.lat, coords.lon, createMode, method);
            }
        }

        // Cuối cùng mới thực hiện điều hướng (nếu URL cũ có ID sẵn)
        parseWazeUrlAndNavigate(item.url);
    }
    function updatePermalinkInWorkbook(index, newPermalink) {
        if (!document.getElementById('save_permalink_after_create')?.checked) return;

        const item = permalinks[index];
        if (!item) return;

        if (isGasMode) {
            updateGasStatusByRowIndex(item.rowIndex, item.status, newPermalink);
            item.url = newPermalink;
            const urlColName = document.getElementById('url_col_name')?.value?.trim() || 'Link WME';
            item.rowData[urlColName] = newPermalink;
        } else {
            if (!workbookData || !item.localFileIndexes) return;
            try {
                const sheet = workbookData.Sheets[item.localFileIndexes.sheetName];
                const statusColIndex = item.localFileIndexes.statusCol;
                const newColIndex = statusColIndex + 1;
                const NEW_COL_NAME = "New Permalink";
                const rowIndex = item.rowIndex; // Excel row index (0-based)
                const headerAddress = XLSX.utils.encode_cell({ r: 0, c: newColIndex });
                if (!sheet[headerAddress] || sheet[headerAddress].v !== NEW_COL_NAME) {
                    sheet[headerAddress] = { t: 's', v: NEW_COL_NAME };
                }
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: newColIndex });
                sheet[cellAddress] = { t: 's', v: newPermalink };
                const range = XLSX.utils.decode_range(sheet['!ref']);
                if (newColIndex > range.e.c) {
                    range.e.c = newColIndex;
                    sheet['!ref'] = XLSX.utils.encode_range(range);
                }
                item.url = newPermalink;
                const urlColLetter = getColumnLetter(item.localFileIndexes.urlCol);
                item.rowData[urlColLetter] = newPermalink; // Cập nhật bằng chữ cái
                hasUnsavedChanges = true;
                updateSaveButtonState();

            } catch (err) {
                log(`❌ Lỗi khi cập nhật file local: ${err.message}`, "error");
                console.error(err);
            }
        }
    }
    async function parseWazeUrlAndNavigate(value) {
        try {
            const trimmedValue = value.trim();
            const coordMatch = trimmedValue.match(/^\s*\(?\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*\)?\s*$/);
            if (coordMatch) {
                // Xử lý tọa độ
                const lat = parseFloat(coordMatch[1]);
                const lon = parseFloat(coordMatch[2]);
                if (isNaN(lat) || isNaN(lon)) {
                    throw new Error('Tọa độ không hợp lệ.');
                }
                // Lấy zoom level từ input hoặc dùng mặc định
                const zoomInput = document.getElementById('coordinate_zoom');
                const defaultZoom = zoomInput ? parseInt(zoomInput.value, 10) : 20;
                W.map.setCenter(WazeWrap.Geometry.ConvertTo900913(lon, lat), defaultZoom);
                W.selectionManager.setSelectedModels([]);
                const createMode = document.querySelector('input[name="poi_creation_mode"]:checked').value;
                if (createMode !== 'none') {
                    // Đợi map load xong
                    await delay(50);
                    createWazePOI(lat, lon, createMode);
                    // Đợi POI được tạo và WME chọn nó
                    await delay(100);
                }
                return;
            }
            // Nếu không phải tọa độ, xử lý như URL bình thường
            const parsedUrl = new URL(trimmedValue);
            const params = parsedUrl.searchParams;
            const lon = parseFloat(params.get('lon'));
            const lat = parseFloat(params.get('lat'));
            const zoom = parseInt(params.get('zoomLevel') || params.get('zoom'), 10) + 2;
            const segmentIDs = (params.get('segments') || '').split(',').filter(id => id);
            const venueIDs = (params.get('venues') || '').split(',').filter(id => id);
            // Set map center and zoom
            W.map.setCenter(WazeWrap.Geometry.ConvertTo900913(lon, lat), zoom);
            // Wait for model to be ready, then select objects
            WazeWrap.Model.onModelReady(() => {
                (async () => {
                    await delay(1000);
                    let objectsToSelect = [];
                    if (segmentIDs.length > 0) {
                        const segments = segmentIDs.map(id => W.model.segments.getObjectById(id)).filter(Boolean);
                        if (segments.length === 0) {
                            log(`Cảnh báo: Không tìm thấy segment nào từ ID ${segmentIDs.join(',')} sau khi tải.`, 'warn');
                        } else {
                            objectsToSelect.push(...segments);
                        }
                    }
                    if (venueIDs.length > 0) {
                        const venues = venueIDs.map(id => W.model.venues.getObjectById(id)).filter(Boolean);
                        if (venues.length === 0) {
                            log(`Cảnh báo: Không tìm thấy venue nào từ ID ${venueIDs.join(',')} sau khi tải.`, 'warn');
                        } else {
                            objectsToSelect.push(...venues);
                        }
                    }
                    if (objectsToSelect.length > 0) {
                        W.selectionManager.setSelectedModels(objectsToSelect);
                    }
                })();
            }, true);
        } catch (error) {
            log(`Lỗi khi xử lý "${value}": ${error.message}`, 'error');
            console.error(error);
        }
    }
    function updateUIState() {
        const hasLinks = permalinks.length > 0;
        const navIndexInput = document.getElementById('nav_index_input');
        const navTotalCount = document.getElementById('nav_total_count');
        const workflowSelect = document.getElementById('workflow_select');
        const loopBtn = document.getElementById('loop_workflow_btn');
        const runWorkflowBtn = document.getElementById('run_workflow_btn');
        // Navigation buttons
        document.getElementById('prev_btn').disabled = !hasLinks || currentIndex <= 0 || isLooping;
        document.getElementById('next_btn').disabled = !hasLinks || currentIndex >= permalinks.length - 1 || isLooping;
        document.getElementById('reselect_btn').disabled = !hasLinks || isLooping;
        // Index input
        navIndexInput.disabled = !hasLinks || isLooping;
        if (hasLinks) {
            navIndexInput.value = currentIndex + 1;
            navIndexInput.max = permalinks.length;
            navTotalCount.textContent = ` / ${permalinks.length}`;
        } else {
            navIndexInput.value = '';
            navTotalCount.textContent = '/ N/A';
        }
        // Workflow action buttons
        runWorkflowBtn.disabled = !workflowSelect.value || isLooping;
        loopBtn.disabled = !hasLinks;
        // Workflow editor related buttons
        document.getElementById('excel_file').disabled = isLooping;
        document.getElementById('workflow_select').disabled = isLooping;
        document.getElementById('workflow_variable_input').disabled = isLooping;
        document.getElementById('edit_workflow_btn').disabled = !workflowSelect.value || isLooping;
        document.getElementById('delete_workflow_btn').disabled = !workflowSelect.value || isLooping;
        document.getElementById('new_workflow_btn').disabled = isLooping;
        // Update Save Status button
        updateSaveButtonState();
        // Loop button visual state
        if (isLooping) {
            loopBtn.textContent = '⏹️ Dừng Lặp';
            loopBtn.classList.add('looping');
            loopBtn.classList.remove('secondary');
        } else {
            loopBtn.textContent = '🔁 Bắt đầu Lặp';
            loopBtn.classList.remove('looping');
            if (hasLinks) loopBtn.classList.add('secondary');
        }
    }
    function populateWorkflowSelector() {
        const select = document.getElementById('workflow_select');
        const currentId = select.value; // Store current selection
        select.innerHTML = ''; // Clear existing options
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = Object.keys(allWorkflows).length === 0 ? '--- Không có workflow ---' : '--- Chọn workflow ---';
        select.appendChild(emptyOption);
        for (const id in allWorkflows) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = allWorkflows[id].name;
            select.appendChild(option);
        }
        // Restore previous selection or select the first valid one
        if (currentId && allWorkflows[currentId]) {
            select.value = currentId;
        } else if (Object.keys(allWorkflows).length > 0) {
            // Select the first workflow if none were selected, but prefer the empty option if it exists
            const firstWorkflowId = Object.keys(allWorkflows)[0];
            if (firstWorkflowId) {
                select.value = firstWorkflowId;
            }
        } else {
            select.value = ''; // No workflows, ensure no value is set
        }
        updateUIState(); // Update other UI elements based on selection
    }
    function deleteSelectedWorkflow() {
        const select = document.getElementById('workflow_select');
        const idToDelete = select.value;
        const workflowName = allWorkflows[idToDelete]?.name;
        if (!idToDelete) {
            alert("Vui lòng chọn một workflow để xóa.");
            return;
        }
        if (confirm(`Bạn có chắc chắn muốn xóa workflow "${workflowName}" không?`)) {
            delete allWorkflows[idToDelete];
            saveWorkflows();
            populateWorkflowSelector();
            log(`Đã xóa workflow: "${workflowName}"`, 'info');
        }
    }
    function openWorkflowEditor(workflowId = null) {
        const modal = document.getElementById('workflow-editor-modal');
        const nameInput = document.getElementById('workflow_name_input');
        const idInput = document.getElementById('editing_workflow_id');
        const title = document.getElementById('editor-title');
        if (workflowId && allWorkflows[workflowId]) {
            const wf = allWorkflows[workflowId];
            title.textContent = "Chỉnh sửa Workflow (SDK)";
            nameInput.value = wf.name;
            idInput.value = workflowId;
            renderSdkTasksInEditor(wf.tasks || []);
        } else {
            title.textContent = "Tạo Workflow Mới (SDK)";
            nameInput.value = '';
            idInput.value = '';
            renderSdkTasksInEditor([]);
        }
        modal.style.display = 'block';
    }
    function closeWorkflowEditor() {
        document.getElementById('workflow-editor-modal').style.display = 'none';
    }
    function saveWorkflowFromEditor() {
        const name = document.getElementById('workflow_name_input').value.trim();
        if (!name) return alert("Vui lòng nhập tên tác vụ.");
        const tasks = [];
        document.querySelectorAll('.task-enable-cb').forEach(cb => {
            if (cb.checked) {
                const taskId = cb.dataset.taskId;
                const params = {};
                // Thu thập params
                document.querySelectorAll(`.task-param-input[data-task-id="${taskId}"]`).forEach(inp => {
                    params[inp.dataset.paramKey] = inp.value;
                });
                tasks.push({ taskId, enabled: true, params });
            }
        });
        if (tasks.length === 0) return alert("Vui lòng chọn ít nhất một hành động.");
        let id = document.getElementById('editing_workflow_id').value;
        if (!id) id = `sdk_wf_${Date.now()}`;
        allWorkflows[id] = { name, tasks };
        saveWorkflows();
        populateWorkflowSelector();
        document.getElementById('workflow_select').value = id;
        closeWorkflowEditor();
        log(`Đã lưu workflow SDK "${name}"`, 'success');
    }
    function loadGasSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
            if (saved) {
                const settings = JSON.parse(saved);
                document.getElementById('gas_url').value = settings.gasUrl || '';
                // Sửa: Chỉ truy cập các ID có sẵn
                const sheetNameInput = document.getElementById('sheet_name_input');
                if (sheetNameInput) sheetNameInput.value = settings.sheetName || 'Sheet1';

                const urlColNameInput = document.getElementById('url_col_name');
                if (urlColNameInput) urlColNameInput.value = settings.urlCol || 'Link WME';

                const skipDoneCheck = document.getElementById('skip_done_check');
                if (skipDoneCheck) skipDoneCheck.checked = settings.skipDone || false;
            }
        } catch (e) {
            log('Lỗi khi tải cài đặt GAS.', 'error');
        }
    }
    resetData()
    /**
     * Tải dữ liệu từ Google Sheets thông qua GAS Web App.
     */
    function loadFromGoogleSheet() {
        const scriptUrl = document.getElementById('gas_url')?.value?.trim() || '';
        const sheetName = document.getElementById('sheet_name_input')?.value?.trim() || '';
        const urlColName = document.getElementById('url_col_name')?.value?.trim() || '';
        const skipDone = document.getElementById('skip_done_check')?.checked || false;

        if (!scriptUrl) { alert("Vui lòng nhập Web App URL!"); return; }

        // Lưu cài đặt GAS
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({
            gasUrl: scriptUrl,
            sheetName: sheetName,
            urlCol: urlColName,
            skipDone: skipDone
        }));

        // Reset trạng thái
        permalinks = [];
        currentIndex = -1;
        previousIndex = -1;
        isGasMode = true;
        gasHeaders = null;
        hasUnsavedChanges = false;

        log("⏳ Đang tải dữ liệu từ Google Sheets...");
        const loadBtn = document.getElementById('load_sheet_btn');
        if (loadBtn) loadBtn.disabled = true;
        const readUrl = `${scriptUrl}?action=get&sheetName=${encodeURIComponent(sheetName)}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: readUrl,
            onload: function (response) {
                if (loadBtn) loadBtn.disabled = false;
                if (response.status !== 200) {
                    log(`❌ Lỗi kết nối GAS: Status ${response.status}. Kiểm tra URL và quyền truy cập.`, 'error');
                    isGasMode = false;
                    updateUIState();
                    return;
                }
                try {
                    const json = JSON.parse(response.responseText);
                    if (json.result === "success" && json.data) {
                        // Thiết lập gasHeaders và xử lý dữ liệu
                        if (json.headers && Array.isArray(json.headers)) {
                            gasHeaders = json.headers;
                            log("Đã load dữ liệu từ GG Sheets thành công", 'success')
                        } else {
                            log("Cảnh báo: Không nhận được headers từ GAS, mapping {{tên cột}} có thể không chính xác.", 'warn');
                        }

                        let foundIndex = -1;
                        let tempPermalinks = [];

                        json.data.forEach(row => {
                            const url = row[urlColName] || "";
                            const stt = row[STATUS_COL_NAME] || "";
                            const rowIndex = row["_rowIndex"] || null; // _rowIndex là cột đặc biệt dùng để ghi lại

                            if (url && rowIndex !== null) {
                                const statusTrimmed = stt.toString().trim().toLowerCase();
                                if (skipDone && statusTrimmed === 'đã tạo') {
                                    return; // Bỏ qua nếu skipDone được bật
                                }

                                tempPermalinks.push({
                                    url: url.toString().trim(),
                                    rowIndex: rowIndex,
                                    status: statusTrimmed,
                                    rowData: row // Lưu Object data
                                });

                                // Tìm index để bắt đầu
                                if (foundIndex === -1 && statusTrimmed === 'đang tạo') {
                                    foundIndex = tempPermalinks.length - 1;
                                }
                            }
                        });

                        permalinks = tempPermalinks;

                        if (foundIndex === -1) {
                            foundIndex = permalinks.findIndex(p => p.status !== 'đã tạo');
                            if (foundIndex === -1 && permalinks.length > 0) foundIndex = 0;
                        }

                        currentIndex = foundIndex === -1 ? 0 : foundIndex;
                        if (permalinks.length > 0) {
                            updateStatus('Đang tạo'); // Dùng hàm local để cập nhật GAS status
                        }
                        updateUIState();
                        processCurrentLink(); // Bắt đầu xử lý link đầu tiên
                    } else {
                        log("❌ Lỗi Sheet: " + (json.message || "Lỗi dữ liệu trả về."));
                        isGasMode = false;
                    }
                } catch (e) {
                    log("❌ Lỗi parse JSON hoặc lỗi xử lý dữ liệu: " + e.message, 'error');
                    console.error(e);
                    isGasMode = false;
                }
            },
            onerror: function (err) {
                if (loadBtn) loadBtn.disabled = false;
                log("❌ Lỗi kết nối mạng GAS.", 'error');
                console.error(err);
                isGasMode = false;
            }
        });
    }

    function updateGasStatusByRowIndex(rowIndex, newStatus, newPermalink = null) {
        if (!isGasMode || !rowIndex) return;
        // Lấy các giá trị DOM cần thiết
        const scriptUrl = document.getElementById('gas_url')?.value?.trim();
        const sheetName = document.getElementById('sheet_name_input')?.value?.trim();

        if (!scriptUrl || !sheetName) {
            log('Lỗi: Thiếu Web App URL hoặc Tên Sheet để cập nhật GAS.', 'error');
            return;
        }
        let url = `${scriptUrl}?action=post&rowIndex=${rowIndex}&status=${encodeURIComponent(newStatus)}&sheetName=${encodeURIComponent(sheetName)}`;
        if (newPermalink) {
            const urlColName = document.getElementById('url_col_name')?.value?.trim();
            if (urlColName) {
                url += `&urlCol=${encodeURIComponent(urlColName)}`;
                url += `&permalink=${encodeURIComponent(newPermalink)}`;
            }
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.result !== "success") {
                        log(`⚠️ Lỗi GAS ghi status (Row ${rowIndex}): ${res.message}`, 'warn');
                    }
                } catch (e) {
                    log(`⚠️ Lỗi phản hồi JSON từ GAS khi ghi status.`, 'warn');
                }
            },
            onerror: (err) => {
                log(`❌ Lỗi kết nối khi cập nhật GAS status (Row ${rowIndex}).`, 'error');
            }
        });
    }
    // Initialize the script
    bootstrap();
})();