// ==UserScript==
// @name         GT Flight Calculator
// @namespace    https://greasyfork.org/users/1304483
// @version      1.7
// @description  Calculate best power
// @match        https://g2.galactictycoons.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=galactictycoons.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557494/GT%20Flight%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/557494/GT%20Flight%20Calculator.meta.js
// ==/UserScript==

document.addEventListener('focusin', e => {
    e.stopImmediatePropagation();
}, true);

(function () {
    'use strict';

    /********************************
     *  Add minimal CSS (only for stepper)
     ********************************/
    GM_addStyle(`
        #ftl-panel {
            position: fixed;
            right: 0;
            top: 0;
            width: 380px;
            height: 100%;
            background: #1e1e1e;
            padding: 18px;
            box-shadow: -5px 0 15px rgba(0,0,0,.45);
            z-index: 999999;
            transform: translateX(100%);
            transition: transform .25s ease;
            overflow-y: auto;
            pointer-events: none;
        }
        #ftl-panel.open {
        transform: translateX(0);
        pointer-events: auto;
        }

        #ftl-close {
            position: absolute;
            right: 12px;
            top: 12px;
            font-size: 22px;
            cursor: pointer;
            color: #aaa;
        }
        #ftl-close:hover { color: #fff; }

        .stepper-group {
            display: flex;
            gap: 6px;
            align-items: center;
        }
        .stepper-buttons {
            display: flex;
            flex-direction: column;
            width: 28px;
        }
        .stepper-buttons button {
            flex: 1;
            padding: 0;
            font-size: 11px;
            line-height: 12px;
            background: #333;
            border: 1px solid #555;
            color: white;
        }
        .stepper-buttons button:hover {
            background: #444;
        }
    `);


    /********************************
     *  Floating button (right-top)
     ********************************/
    const btn = document.createElement("div");
    btn.id = "ftl-open-btn";
    btn.innerHTML = '<svg class="iu me-1"><use xlink:href="/assets/atlas-COH0u1U7.svg#rocket-launch"></use></svg>';
    Object.assign(btn.style, {
        position: "fixed",
        bottom: "60px",
        right: "20px",
        background: "#2b6cb0",
        color: "white",
        padding: "10px 10px",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        zIndex: "999999",
        boxShadow: "0 0 8px rgba(0,0,0,.45)"
    });
    document.body.appendChild(btn);


    /********************************
     *  Side Panel (native in-game UI)
     ********************************/
    const panel = document.createElement("div");
    panel.id = "ftl-panel";

    panel.innerHTML = `
        <div id="ftl-close">✕</div>

        <h5 class="text-light mb-3">Flight Calculator</h5>

        <div class="box-section">

            <!-- Ship Presets -->
            <div class="mb-3">
                <div class="text-light mb-2">Ship Presets</div>
                <div id="presetContainer" class="d-flex flex-wrap gap-2"></div>
                <div class="d-flex gap-2 mt-2">
                    <input type="text" id="presetNameInput" class="form-control form-control-sm"
                           placeholder="Preset name">
                    <button class="btn btn-sm btn-success" id="addPresetBtn">Save Preset</button>
                </div>
            </div>

            <!-- Reactor -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Reactor</div>
                <div class="col">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center mb-1"
                                id="reactorDropdown"
                                data-bs-toggle="dropdown">
                            <span>
                                <svg class="ai-d"><use xlink:href="/assets/sprite-BB7gYHjf.svg#HydrogenGenerator"></use></svg>
                                <span class="ms-2 fw-light">Hydrogen Generator</span>
                            </span>
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end shadow w-100" id="reactorList">

                            <li class="dropdown-item text-wrap d-flex active" value="1" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-BB7gYHjf.svg#HydrogenGenerator"></use>
                                </svg>
                                <div>
                                    <span class="fw-semibold">Hydrogen Generator</span>
                                </div>
                            </li>

                            <li class="dropdown-item text-wrap d-flex" value="2" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-BB7gYHjf.svg#FissionReactor"></use>
                                </svg>
                                <div>
                                    <span class="fw-semibold">Fission Reactor</span>
                                </div>
                            </li>

                            <li class="dropdown-item text-wrap d-flex" value="3" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-BB7gYHjf.svg#AntimatterReactor"></use>
                                </svg>
                                <div>
                                    <span class="fw-semibold">Antimatter Reactor</span>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>

            <!-- FTL Type -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">FTL type</div>
                <div class="col">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center mb-1"
                                id="ftlTypeDropdown"
                                data-bs-toggle="dropdown">
                            <span>
                                <svg class="ai-d">
                                    <use xlink:href="/assets/sprite-DLZpwR1V.svg#BasicFTLEmitter"></use>
                                </svg>
                                <span class="ms-2 fw-light">Basic</span>
                            </span>
                        </button>

                        <ul class="dropdown-menu dropdown-menu-end shadow w-100" id="ftlTypeList">

                            <li class="dropdown-item text-wrap d-flex active" value="1" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-DLZpwR1V.svg#BasicFTLEmitter"></use>
                                </svg>
                                <span class="fw-semibold">Basic</span>
                            </li>

                            <li class="dropdown-item text-wrap d-flex" value="2" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-DLZpwR1V.svg#AdvancedFTLEmitter"></use>
                                </svg>
                                <span class="fw-semibold">Advanced Short Range</span>
                            </li>

                        <li class="dropdown-item text-wrap d-flex" value="3" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-DLZpwR1V.svg#AdvancedFTLEmitter"></use>
                                </svg>
                                <span class="fw-semibold">Advanced Efficient</span>
                            </li>

                            <li class="dropdown-item text-wrap d-flex" value="4" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-DLZpwR1V.svg#AdvancedFTLEmitter"></use>
                                </svg>
                                <span class="fw-semibold">Advanced Long Range</span>
                            </li>

                            <li class="dropdown-item text-wrap d-flex" value="5" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-DLZpwR1V.svg#SuperiorFTLEmitter"></use>
                                </svg>
                                <span class="fw-semibold">Superior Short Range</span>
                            </li>

                            <li class="dropdown-item text-wrap d-flex" value="6" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-DLZpwR1V.svg#SuperiorFTLEmitter"></use>
                                </svg>
                                <span class="fw-semibold">Superior Efficient</span>
                            </li>

                            <li class="dropdown-item text-wrap d-flex" value="7" role="button">
                                <svg class="ai-st me-2 mt-1 flex-shrink-0">
                                    <use xlink:href="/assets/sprite-DLZpwR1V.svg#SuperiorFTLEmitter"></use>
                                </svg>
                                <span class="fw-semibold">Superior Long Range</span>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>

            <!-- FTL Emitters -->
            <div class="row mt-1">
                <div class="col-4 col-sm-3 caption-lr-center">FTL Emitters</div>
                <div class="col">
                    <div class="stepper-group mb-1">
                        <input type="number" class="form-control" id="engineCount" value="2">
                    </div>
                </div>
            </div>

            <!-- Cargo -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Cargo bay size</div>
                <div class="col">
                    <div class="stepper-group mb-1">
                        <div class="input-group">
                            <input type="number" class="form-control" id="cargoSize" value="400">
                            <span class="input-group-text">t</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fuel Tank -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Fuel tank size</div>
                <div class="col">
                    <select class="form-select mb-1" id="tankSize">
                        <option value="1">Small</option>
                        <option selected value="2">Medium</option>
                        <option value="3">Large</option>
                    </select>
                </div>
            </div>

            <!-- Heat Shield -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Heat shielding</div>
                <div class="col">
                    <select class="form-select mb-1" id="heatShield">
                        <option selected value="1">None</option>
                        <option value="2">Light</option>
                        <option value="3">Heavy</option>
                    </select>
                </div>
            </div>

            <!-- Radiation Shield -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Radiation shielding</div>
                <div class="col">
                    <select class="form-select mb-1" id="radiationShield">
                        <option selected value="1">None</option>
                        <option value="2">Light</option>
                        <option value="3">Heavy</option>
                    </select>
                </div>
            </div>

            <!-- Company Starting Bonus -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Company Flight Bonus</div>
                <div class="col">
                    <div class="input-group mb-1">
                        <input type="number"
                               class="form-control"
                               id="companyBonus"
                               placeholder="Company starting bonus"
                               min="1"
                               max="5"
                               step="0.1"
                               value="1">
                        <span class="input-group-text">x</span>
                    </div>
                </div>
            </div>

            <!-- Guild Flight Center Bonus -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Guild Flight Bonus</div>
                <div class="col">
                    <div class="input-group mb-1">
                        <input type="number"
                               class="form-control"
                               id="guildBonus"
                               placeholder="Guild flight center bonus"
                               min="0"
                               max="100"
                               step="1"
                               value="0">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            </div>

            <!-- Cargo Weight -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Cargo Weight</div>
                <div class="col">
                    <div class="input-group mb-1">
                        <input type="number"
                               class="form-control"
                               id="cargoWeight"
                               placeholder="Cargo weight"
                               min="0"
                               max="9999999"
                               step="1">
                        <span class="input-group-text">t</span>
                    </div>
                </div>
            </div>

            <!-- Flight Distance -->
            <div class="row">
                <div class="col-4 col-sm-3 caption-lr-center">Flight Distance</div>
                 <div class="col">
                    <div class="input-group mb-1">
                        <input type="number"
                               class="form-control"
                               id="flightDistance"
                               placeholder="Distance"
                               min="0"
                               max="9999999"
                               step="0.1">
                        <span class="input-group-text">ly</span>
                    </div>
                </div>
            </div>

            <!-- GetInfo Button -->
            <button class="btn btn-primary w-100 mt-3" id="getInfo">Get Distance and Cargo</button>

            <!-- Calculate Button -->
            <button class="btn btn-primary w-100 mt-3" id="calcBtn">Calculate</button>

            <!-- Output -->
            <div id="calcResult" class="text-light mt-3"></div>

        </div>
    `;

    document.body.appendChild(panel);


    /********************************
     * Open/Close Panel
     ********************************/
    btn.onclick = () => panel.classList.add("open");
    panel.querySelector("#ftl-close").onclick = () => panel.classList.remove("open");


    function bindDropdownWithIcon(buttonId, listId) {
        const btn = document.getElementById(buttonId);
        const list = document.getElementById(listId);

        const btnIcon = btn.querySelector("svg use");
        const btnText = btn.querySelector("span span");   // 按钮右侧文字

        list.querySelectorAll("li").forEach(li => {
            li.onclick = () => {

                // 清除 active
                list.querySelectorAll("li").forEach(i => i.classList.remove("active"));
                li.classList.add("active");

                // 获取 li 的图标
                const liIconUse = li.querySelector("svg use").getAttribute("xlink:href");

                // 获取 li 的标题（fw-semibold 内部）
                const liText = li.querySelector(".fw-semibold").innerText;

                // 更新按钮图标
                btnIcon.setAttribute("xlink:href", liIconUse);

                // 更新按钮文字
                btnText.innerText = liText;
            };
        });
    }

    bindDropdownWithIcon("reactorDropdown", "reactorList");
    bindDropdownWithIcon("ftlTypeDropdown", "ftlTypeList");

    loadFTLSettings();

    renderPresetButtons();
    savePresetOrder();

    document.getElementById("addPresetBtn").onclick = () => {
        const input = document.getElementById("presetNameInput");
        const name = input.value.trim();
        if (!name) return;

        let presets = loadAllPresets();

        // 若名称重复 → 自动加数字
        let finalName = name;
        let counter = 2;
        while (presets[finalName]) {
            finalName = `${name} (${counter++})`;
        }

        presets[finalName] = getPresetState();
        saveAllPresets(presets);

        input.value = ""; // 保存后清空输入框
        renderPresetButtons();
    };


    btn.addEventListener("dragend", savePresetOrder);

    /********************************
     * Get Distance and Cargo
     ********************************/
    document.getElementById("getInfo").onclick = () => {
        const distance = getDistance();
        if (distance === null) return;
        document.getElementById("flightDistance").value = distance;
        const cargo = getCargo();
        if (cargo === null) return;
        document.getElementById("cargoWeight").value = cargo.current;
    }

    /********************************
     * Calculate
     ********************************/
    document.getElementById("calcBtn").onclick = () => {
        saveFTLSettings();
        // 1. Reactor（下拉菜单）
        const reactorBtn = document.getElementById("reactorDropdown");
        const reactorType = getDropdownValue("reactorList");

        // 2. FTL Type（下拉菜单）
        const ftlBtn = document.getElementById("ftlTypeDropdown");
        const ftlType = getDropdownValue("ftlTypeList");

        // 3. 数字输入框
        const emitters = Number(document.getElementById("engineCount").value);
        const cargoSize = Number(document.getElementById("cargoSize").value);
        const cargoWeight = Number(document.getElementById("cargoWeight").value)||0;
        const flightDistance = Number(document.getElementById("flightDistance").value)||0;
        const companyBonus = Number(document.getElementById("companyBonus").value) || 1;
        const guildBonus = Number(document.getElementById("guildBonus").value) || 0;

        // 4. 下拉菜单 (Fuel Tank / Heat / Radiation)
        const tankSize = Number(document.getElementById("tankSize").value);
        const heatShield = Number(document.getElementById("heatShield").value);
        const radiationShield = Number(document.getElementById("radiationShield").value);

        if (cargoWeight>cargoSize){
            console.error("cargoSize:",cargoSize);
            console.error("cargoWeight:",cargoWeight);
            document.getElementById("calcResult").innerHTML = `<b>Too Many Cargo!!!</b>`;
            return;
        }

        const gameData=getGameData();
        const reactorData=gameData.shipReactors;
        const ftlData=gameData.shipEmitters;

        const emptyWeight=calcEmptyWeight(reactorType, ftlType, emitters, cargoSize, tankSize, heatShield, radiationShield, reactorData, ftlData);

        const reactorPowers=calcEveryReactorPower(reactorType, ftlType, emitters, emptyWeight, cargoWeight, flightDistance, heatShield, radiationShield, reactorData, ftlData, companyBonus, guildBonus);

        const fuelID = reactorData[reactorType-1].fuelId;
        const kitID = 113;
        const fuelAvgPrice=getAvgPriceByMatId(fuelID);
        const kitAvgPrice=getAvgPriceByMatId(kitID);
        reactorPowers.forEach(power=>{
            power.Cost=calcCost(power,fuelAvgPrice,kitAvgPrice)/100;
            power.TonCost=power.Cost/cargoWeight;
        });

        const bestCost=findBestCost(reactorPowers);

        document.getElementById("calcResult").innerHTML = `
        <div class="mb-2">

        <!-- Efficiency / Power -->
        <div class="d-flex justify-content-between" style="margin-bottom: -5px;">
            <span>
                <span class="text-body-tertiary">Efficiency </span>
                <span id="effValue"></span><small class="text-body-tertiary">%</small>
            </span>

            <span class="ms-2 text-end">
                <span class="text-body-tertiary">Power </span>
                <span id="powerValue"></span><small class="text-body-tertiary">%</small>
            </span>
        </div>

        <!-- Slider -->
        <input type="range"
               id="powerSlider"
               class="form-range"
               min="20"
               max="100"
               step="1">

        <!-- Cost / Travel Time -->
        <div class="d-flex justify-content-between small mt-1">
            <span><b>Cost:</b> $<span id="costValue"></span></span>
            <span><b>TravelTime:</b> <span id="timeValue"></span></span>
        </div>

        <!-- FuelUsed / KitUsed -->
        <div class="d-flex justify-content-between small mt-1">
            <span><b>FuelUsed:</b> <span id="fuelValue"></span></span>
            <span><b>KitUsed:</b> <span id="kitValue"></span></span>
        </div>

        <div class="d-flex justify-content-between small mt-1">
            <span><b>CostPerTon:</b> $<span id="tonCost"></span></span>
            <span><b>ConditionLoss:</b> <span id="conditionLoss"></span> %</span>
        </div>

    </div>
`;
        const slider = document.getElementById("powerSlider");
        slider.value = bestCost.ReactorPower * 100;

        updateUIByPower(Math.round(bestCost.ReactorPower * 100), reactorPowers);

        slider.addEventListener("input", () => {
            updateUIByPower(Number(slider.value), reactorPowers);
        });

    };

})();

function getDistance() {
  const rows = document.querySelectorAll('.row');

  for (const row of rows) {
    const label = row.querySelector('.caption-lr-start');
    if (label?.textContent.trim() !== 'Distance') continue;

    const col = label.nextElementSibling;
    if (!col) return null;

    const match = col.textContent.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  }

  return null;
}

function getCargo() {
  const rows = document.querySelectorAll('.row');

  for (const row of rows) {
    const label = row.querySelector('.fw-bold.text-body-tertiary');
    if (label?.textContent.trim() !== 'Cargo') continue;

    const valueCol = row.querySelector('.col-auto.text-orange');
    if (!valueCol) return null;

    const current = valueCol.querySelector('span')?.textContent;
    const total = valueCol.querySelector('small')?.textContent;

    if (!current || !total) return null;

    return {
      current: Number(current.replace(/[^\d]/g, '')),
      total: Number(total.replace(/[^\d]/g, '')),
    };
  }

  return null;
}

function getDropdownValue(listId) {
    const active = document.querySelector(`#${listId} .active`);
    return Number(active?.getAttribute("value") || 0);
}

function updateUIByPower(powerPercent, reactorPowers) {
    const obj = reactorPowers.find(x => Math.round(x.ReactorPower * 100) === powerPercent);
    if (!obj) return;

    // Efficiency
    const eff = 120 - powerPercent;

    // 更新 DOM
    document.getElementById("effValue").innerText = eff.toFixed(0);
    document.getElementById("powerValue").innerText = powerPercent;
    document.getElementById("costValue").innerText = formatThousands(obj.Cost);
    document.getElementById("fuelValue").innerText = obj.FuelUsed.toFixed(2);
    document.getElementById("kitValue").innerText = obj.KitUsed.toFixed(2);
    document.getElementById("timeValue").innerText = formatTime(obj.FinalTravelTime);
    document.getElementById("tonCost").innerText = formatThousands(obj.TonCost);
    document.getElementById("conditionLoss").innerText = (obj.ConditionLoss*100).toFixed(2);
}

function formatThousands(value, decimals = 2) {
    if (value === null || value === undefined || value === '' || isNaN(value)) {
        return '0';
    }
    const num = parseFloat(value);
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}


function formatTime(hours) {
    const totalSeconds = Math.round(hours * 3600);

    const days = Math.floor(totalSeconds / 86400);
    const hrs  = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hrs > 0)  parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(" ");
}

/********************************
 * LocalStorage Save / Load
 ********************************/
function saveFTLSettings() {
    const data = {
        reactor: getDropdownValue("reactorList"),
        ftl: getDropdownValue("ftlTypeList"),

        engineCount: document.getElementById("engineCount").value,
        cargoSize: document.getElementById("cargoSize").value,
        cargoWeight: document.getElementById("cargoWeight").value,
        flightDistance: document.getElementById("flightDistance").value,

        tankSize: document.getElementById("tankSize").value,
        heatShield: document.getElementById("heatShield").value,
        radiationShield: document.getElementById("radiationShield").value,

        companyBonus: document.getElementById("companyBonus").value,
        guildBonus: document.getElementById("guildBonus").value,
    };

    localStorage.setItem("FTL_CONFIG", JSON.stringify(data));
}

function loadFTLSettings() {
    const raw = localStorage.getItem("FTL_CONFIG");
    if (!raw) return;

    const data = JSON.parse(raw);

    // --- 数字输入框 / 下拉框（普通） ---
    document.getElementById("engineCount").value = data.engineCount ?? 2;
    document.getElementById("cargoSize").value = data.cargoSize ?? 400;
    document.getElementById("cargoWeight").value = data.cargoWeight ?? 0;
    document.getElementById("flightDistance").value = data.flightDistance ?? 0;

    document.getElementById("tankSize").value = data.tankSize ?? 2;
    document.getElementById("heatShield").value = data.heatShield ?? 1;
    document.getElementById("radiationShield").value = data.radiationShield ?? 1;

    document.getElementById("companyBonus").value = data.companyBonus ?? 1;
    document.getElementById("guildBonus").value = data.guildBonus ?? 0;

    // --- 下拉菜单（Reactor / FTL） ---
    restoreDropdown("reactorDropdown", "reactorList", data.reactor);
    restoreDropdown("ftlTypeDropdown", "ftlTypeList", data.ftl);
}

function restoreDropdown(buttonId, listId, value) {
    const btn = document.getElementById(buttonId);
    const list = document.getElementById(listId);

    if (!value) return;

    // 找到对应 li
    const li = list.querySelector(`li[value="${value}"]`);
    if (!li) return;

    // 清除 active
    list.querySelectorAll("li").forEach(i => i.classList.remove("active"));
    li.classList.add("active");

    // 更新图标
    const icon = li.querySelector("svg use")?.getAttribute("xlink:href");
    if (icon) btn.querySelector("svg use").setAttribute("xlink:href", icon);

    // 更新按钮文字
    const text = li.querySelector(".fw-semibold")?.innerText || "";
    if (text) btn.querySelector("span span").innerText = text;
}

/********************************
 * calculate
 ********************************/

function getGameData(){
    let gamedata;
    const s = localStorage.getItem('game_data');
    if (!s) return null;
    try {
        gamedata=JSON.parse(s);
    } catch {
        throw new Error("game_data不存在或格式错误！");
    }
    return gamedata;
}

function countReactors(reactorType, ftlType, emittersNumber, reactorData, ftlData){
    const emitterEnergyDraw = ftlData[ftlType-1].energyDraw;
    const reactorEnergy = reactorData[reactorType-1].energy;

    // -----------------------------
    // 2. 能量需求（来自 FTL Emitters）
    // -----------------------------
    const energyDraw = emittersNumber * emitterEnergyDraw;
    // -----------------------------
    // 3. 反应堆数量计算（效率递减）
    // -----------------------------
    let remainingEnergy = energyDraw;
    let efficiencyDecayStep = 0;
    let reactorsCount = 0;

    while (remainingEnergy > 0) {
        let efficiency;
        // 前 4 个反应堆：效率 100%
        if (reactorsCount < 4) {
            efficiency = 1;
        } else {
            // 从第 5 个开始：效率按 0.965^step 递减
            efficiencyDecayStep++;
            efficiency = Math.pow(0.965, efficiencyDecayStep);

            // 最低效率封顶为 0.35
            if (efficiency < 0.35) efficiency = 0.35;
        }

        // 扣除反应堆提供的有效能量
        remainingEnergy -= reactorEnergy * efficiency;
        reactorsCount++;
    }
    return reactorsCount;
}

function reduction(reductionType){
    switch (reductionType){
        case 2:return 0.1;
        case 3:return 0.2;
        default:return 0;
    }
}

function calcEmptyWeight(reactorType, ftlType, emittersNumber, cargoSize, tankSize, heatShield, radiationShield, reactorData, ftlData){
    const emitterWeight = ftlData[ftlType-1].weight;
    const reactorWeight = reactorData[reactorType-1].weight;

    const reactorsCount = countReactors(reactorType, ftlType, emittersNumber, reactorData, ftlData);

    const cargoKitsNeeded = Math.ceil(cargoSize / 100);

    let emptyWeight =
        20 +
        cargoKitsNeeded * 25 +
        emittersNumber * emitterWeight +
        reactorsCount * reactorWeight +
        reactorsCount * reactorWeight * 0.175 * tankSize;

    function applyShieldWeight(baseWeight, type) {
        switch (type) {
            case 2:
                return baseWeight * 1.015;
            case 3:
                return baseWeight * 1.07;
            default:
                return baseWeight;
        }
    }

    emptyWeight = applyShieldWeight(emptyWeight, heatShield);
    emptyWeight = applyShieldWeight(emptyWeight, radiationShield);

    return Math.round(emptyWeight);
}

// -----------------------------
// 7. 燃料容量（反应堆油箱 * tankType）
// -----------------------------
/*ship.fuelCapacity = Math.round(
        ship.reactor.fuelCapacity * ship.reactorsCount * e.tankType * 0.5
    );*/


function calcEveryReactorPower(reactorType, ftlType, emittersNumber, emptyWeight, cargoWeight, flightDistance, heatShield, radiationShield, reactorData, ftlData, companyBonus, guildBonus){
    const serverSpeedMultiplier = wikiFunction.ServerSpeedMultiplier();
    const companyFlightSpeedMultiplier = wikiFunction.CompanyFlightSpeedMultiplier(companyBonus,guildBonus/100);

    const emitterAcceleration = ftlData[ftlType-1].acceleration;
    const emitterMaxSpeed = ftlData[ftlType-1].maxSpeed;
    const reactorFuelRate = reactorData[reactorType-1].fuelConsumption;
    const fullRepairKit = wikiFunction.FullRepairKit(emptyWeight);

    const totalWeight = wikiFunction.TotalWeight(emptyWeight, cargoWeight);
    const reactorsCount = countReactors(reactorType, ftlType, emittersNumber, reactorData, ftlData);
    const baseDamageRate = wikiFunction.BaseDamageRate();
    const shipDamageMultiplier = wikiFunction.ShipDamageMultiplier(reduction(heatShield), reduction(radiationShield));
    const flightTypeMultiplier = wikiFunction.FlightTypeMultiplier('NormalFlight');

    const ftlCapacity50=wikiFunction.FTLCapacity(emittersNumber, 0.5);
    const weightRatio50=wikiFunction.WeightRatio(ftlCapacity50, totalWeight);
    const accelerate50=wikiFunction.Acceleration(emitterAcceleration, weightRatio50);
    const maxSpeed50=wikiFunction.MaxSpeed(emitterMaxSpeed, weightRatio50);
    const baseTravelTime50=wikiFunction.BaseTravelTime(flightDistance, accelerate50, maxSpeed50);

    const usedPerReactorPower=[];

    for (let i = 20; i <= 100; i++) {
        const reactorPower=i/100;
        const ftlCapacity=wikiFunction.FTLCapacity(emittersNumber, reactorPower);
        const weightRatio=wikiFunction.WeightRatio(ftlCapacity, totalWeight);
        const accelerate=wikiFunction.Acceleration(emitterAcceleration, weightRatio);
        const maxSpeed=wikiFunction.MaxSpeed(emitterMaxSpeed, weightRatio);
        const baseTravelTime=wikiFunction.BaseTravelTime(flightDistance, accelerate, maxSpeed);
        const finalTravelTime=wikiFunction.FinalTravelTime(baseTravelTime, 1, serverSpeedMultiplier, companyFlightSpeedMultiplier);

        const fuelEfficiency=wikiFunction.FuelEfficiency(reactorPower);
        const fuelUsed=wikiFunction.FuelUsed(reactorsCount, reactorFuelRate, fuelEfficiency, baseTravelTime50);

        const conditionLoss=wikiFunction.ConditionLoss(finalTravelTime, baseDamageRate, shipDamageMultiplier, flightTypeMultiplier);
        const kitUsed=wikiFunction.KitRepairConditions(fullRepairKit, conditionLoss)

        usedPerReactorPower.push({
            ReactorPower:reactorPower,
            FinalTravelTime:finalTravelTime,
            FuelUsed:fuelUsed,
            KitUsed:kitUsed,
            ConditionLoss:conditionLoss
        });
    }

    return usedPerReactorPower
}

function calcCost(used,fuelPrice,kitPrice){
    return used.FuelUsed*fuelPrice+used.KitUsed*kitPrice
}

function getAvgPriceByMatId(id) {
    let material_price;
    const s = localStorage.getItem('material_price');
    if (!s) return null;
    try {
        material_price=JSON.parse(s);
    } catch {
        throw new Error("material_price不存在或格式错误！");
    }
    const found = material_price.prices.find(item =>
                                             item.matId === id
                                            );
    if (!found) return null;
    if (found.avgPrice === -1) return null; // 没货

    return found.avgPrice;
}

function findBestCost(powers) {
    return powers.reduce((best, cur) => {
        // 如果还没有 best，cur 就是最佳
        if (!best) return cur;

        // 优先比较 Cost
        if (cur.Cost < best.Cost) return cur;

        // 当 Cost 相同：比较 FinalTravelTime
        if (cur.Cost === best.Cost && cur.FinalTravelTime < best.FinalTravelTime){
            return cur;
        }

        return best;
    }, null);
}


const wikiFunction = {
    FTLCapacity(NumberOfEmitters, ReactorPower){
        return 1000 * NumberOfEmitters * ReactorPower;
    },

    TotalWeight(EmptyWeight, CargoWeight){
        return EmptyWeight + CargoWeight;
    },

    WeightRatio(FTLCapacity, TotalWeight) {
        return FTLCapacity / TotalWeight;
    },

    Acceleration(BaseEmitterAcceleration, WeightRatio){
        return (WeightRatio >= 1.0)
            ? BaseEmitterAcceleration * WeightRatio
        : BaseEmitterAcceleration * (WeightRatio ** 1.7);
    },

    MaxSpeed(BaseEmitterMaxSpeed, WeightRatio){
        return (WeightRatio >= 1.0)
            ? BaseEmitterMaxSpeed * (1 + (WeightRatio - 1) * 0.15)
        : BaseEmitterMaxSpeed * (1 - (1 - WeightRatio) ** 1.3);
    },

    BaseTravelTime(Distance, Acceleration, MaxSpeed) {
        const AccelerationTime = MaxSpeed / Acceleration;
        const AccelerationDistance = 0.5 * Acceleration * (AccelerationTime ** 2);

        if (Distance >= AccelerationDistance){
            const RemainDistance = Distance - AccelerationDistance;
            const CruiseTime = RemainDistance / MaxSpeed;
            return CruiseTime + AccelerationTime;
        } else {
            return Math.sqrt((2 * Distance) / Acceleration);
        }
    },

    FinalTravelTime(BaseTravelTime, ConditionSpeedMultiplier, ServerSpeedMultiplier, CompanyFlightSpeedMultiplier) {
        return BaseTravelTime / ConditionSpeedMultiplier / ServerSpeedMultiplier / CompanyFlightSpeedMultiplier;
    },

    CompanyFlightSpeedMultiplier(CompanyStartingBonus, GuildFlightCenterBonus){
        return CompanyStartingBonus + GuildFlightCenterBonus;
    },

    ConditionSpeedMultiplier(Condition){
        return Math.min(Condition + 0.2, 1.0);
    },

    ServerSpeedMultiplier() {
        return 4.0;
    },

    FuelUsed(ReactorsCount, ReactorFuelRate, FuelEfficiency, BaseTravelTime50){
        return (ReactorsCount * ReactorFuelRate / FuelEfficiency) * BaseTravelTime50;
    },

    FuelEfficiency(ReactorPower){
        return 1 - (ReactorPower - 0.20);
    },

    ConditionLoss(FinalTravelTime, BaseDamageRate, ShipDamageMultiplier, FlightTypeMultiplier) {
        return FinalTravelTime * BaseDamageRate * ShipDamageMultiplier * FlightTypeMultiplier;
    },

    ShipDamageMultiplier(HeatReduction, RadiationReduction){
        return 1.0 - (HeatReduction + RadiationReduction);
    },

    BaseDamageRate(){
        return 0.004;
    },

    FlightTypeMultiplier(FlightType){
        switch (FlightType){
            case 'NormalFlight': return 1.0;
            case 'EmergencyFlight': return 5.0;
            default: return 1.0;
        }
    },

    FullRepairKit(EmptyWeight){
        return EmptyWeight/10;
    },

    KitRepairConditions(FullRepairKit, Conditions){
        return FullRepairKit * Conditions;
    }
};

/********************************
 * Ship Presets (buttons)
 ********************************/
function getPresetState() {
    return {
        reactor: getDropdownValue("reactorList"),
        ftl: getDropdownValue("ftlTypeList"),
        cargoSize: document.getElementById("cargoSize").value,
        engineCount: document.getElementById("engineCount").value,
        tankSize: document.getElementById("tankSize").value,
        heatShield: document.getElementById("heatShield").value,
        radiationShield: document.getElementById("radiationShield").value
    };
}

function applyPresetState(data) {
    restoreDropdown("reactorDropdown", "reactorList", data.reactor);
    restoreDropdown("ftlTypeDropdown", "ftlTypeList", data.ftl);

    document.getElementById("cargoSize").value = data.cargoSize;
    document.getElementById("engineCount").value = data.engineCount;
    document.getElementById("tankSize").value = data.tankSize;
    document.getElementById("heatShield").value = data.heatShield;
    document.getElementById("radiationShield").value = data.radiationShield;
}

function loadAllPresets() {
    return JSON.parse(localStorage.getItem("FTL_PRESETS") || "{}");
}

function saveAllPresets(presets) {
    localStorage.setItem("FTL_PRESETS", JSON.stringify(presets));
}

function renderPresetButtons() {
    const presets = loadAllPresets();
    const container = document.getElementById("presetContainer");

    container.innerHTML = "";

    Object.keys(presets).forEach(name => {

        const btn = document.createElement("div");
        btn.className = "preset-btn btn btn-sm btn-secondary d-flex align-items-center";
        btn.dataset.name = name;
        btn.style.gap = "6px";
        btn.setAttribute("draggable", "true");

        // --- 编辑图标 ---
        const editIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        editIcon.setAttribute("width", "14");
        editIcon.setAttribute("height", "14");
        editIcon.innerHTML = `<use xlink:href="/assets/atlas-COH0u1U7.svg#pencil"></use>`;
        editIcon.style.cursor = "pointer";

        // --- 名称 (可编辑) ---
        const nameSpan = document.createElement("span");
        nameSpan.className = "preset-name flex-grow-1";
        nameSpan.textContent = name;
        nameSpan.style.cursor = "pointer";

        // --- 删除按钮 X ---
        const del = document.createElement("span");
        del.textContent = "×";
        del.style.cursor = "pointer";
        del.style.marginLeft = "6px";
        del.style.fontWeight = "bold";

        // 组装按钮
        btn.appendChild(editIcon);
        btn.appendChild(nameSpan);
        btn.appendChild(del);
        container.appendChild(btn);

        // -------------------------
        // 点击名称 → 加载 preset
        // -------------------------
        nameSpan.onclick = () => applyPresetState(presets[name]);

        // -------------------------
        // 删除按钮 → 直接删除（无确认）
        // -------------------------
        del.onclick = (e) => {
            e.stopPropagation();
            let all = loadAllPresets();
            delete all[name];
            saveAllPresets(all);
            renderPresetButtons();
        };

        // -------------------------
        // 编辑名字（可直接修改）
        // -------------------------
        editIcon.onclick = (e) => {
            e.stopPropagation();

            // 创建一个输入框替代原文字
            const input = document.createElement("input");
            input.type = "text";
            input.value = name;
            input.className = "form-control form-control-sm";
            input.style.padding = "0 4px";
            input.style.height = "22px";

            // 替换掉 nameSpan
            btn.replaceChild(input, nameSpan);
            input.focus();
            input.select();

            // 保存函数
            const applyRename = () => {
                const newName = input.value.trim();
                if (!newName || newName === name) {
                    btn.replaceChild(nameSpan, input);
                    return;
                }

                let all = loadAllPresets();
                all[newName] = all[name];
                delete all[name];
                saveAllPresets(all);

                renderPresetButtons();
            };

            // 按 Enter 保存
            input.addEventListener("keydown", (ev) => {
                if (ev.key === "Enter") applyRename();
            });

            // 失焦自动保存
            input.addEventListener("blur", applyRename);
        };

        // -------------------------
        // 拖拽排序
        // -------------------------
        btn.addEventListener("dragstart", (e) => {
            btn.classList.add("dragging");
            e.dataTransfer.setData("text/plain", name);
        });

        btn.addEventListener("dragend", () => {
            btn.classList.remove("dragging");
            savePresetOrder();
        });
    });

    initPresetDrag();
}



function showPresetMenu(name) {
    const action = prompt(
        `Edit preset "${name}":\n\n1 = Rename\n2 = Delete\n\nEnter choice:`
    );

    let presets = loadAllPresets();

    if (action === "1") {
        const newName = prompt("New name:", name);
        if (!newName) return;

        presets[newName] = presets[name];
        delete presets[name];
        saveAllPresets(presets);
        renderPresetButtons();
    }

    if (action === "2") {
        if (confirm(`Delete preset "${name}"?`)) {
            delete presets[name];
            saveAllPresets(presets);
            renderPresetButtons();
        }
    }
}

function savePresetOrder() {
    const container = document.getElementById("presetContainer");
    const presets = loadAllPresets();
    const newOrderPresets = {};

    // 遍历按钮顺序重新组装
    [...container.children].forEach(btn => {
        const name = btn.dataset.name;
        newOrderPresets[name] = presets[name];
    });

    saveAllPresets(newOrderPresets);
}

function initPresetDrag() {
    const container = document.getElementById("presetContainer");
    const buttons = container.querySelectorAll(".preset-btn");

    buttons.forEach(btn => {
        btn.setAttribute("draggable", "true");

        btn.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", btn.dataset.name);
            btn.classList.add("dragging");
        });

        btn.addEventListener("dragend", () => {
            btn.classList.remove("dragging");
            savePresetOrder();   // 拖拽结束后保存顺序
        });
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();

        const dragging = container.querySelector(".dragging");
        const after = getDragAfterElement(container, e.clientX, e.clientY);

        if (after == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, after);
        }
    });

    function getDragAfterElement(container, x, y) {
        const elements = [...container.querySelectorAll(".preset-btn:not(.dragging)")];

        return elements.find(el => {
            const rect = el.getBoundingClientRect();
            return y < rect.top + rect.height / 2;
        });
    }
}