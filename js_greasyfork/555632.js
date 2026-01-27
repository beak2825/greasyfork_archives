// ==UserScript==
// @name         GT Material Price Inserter
// @namespace    https://greasyfork.org/users/1304483
// @icon         https://galactictycoons.com/favicon.ico
// @version      1.2
// @description  监控页面变化，在指定位置插入 material_price 信息
// @match        https://g2.galactictycoons.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555632/GT%20Material%20Price%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/555632/GT%20Material%20Price%20Inserter.meta.js
// ==/UserScript==

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


function getCurrentPriceByMatName(name) {
    let material_price;
    const s = localStorage.getItem('material_price');
    if (!s) return null;
    try {
        material_price=JSON.parse(s);
    } catch {
        throw new Error("material_price不存在或格式错误！");
    }
    name=name_fix(name);

    const normalized = name.replace(/\s+/g, '').toLowerCase();

    const found = material_price.prices.find(item =>
                                             item.matName.replace(/\s+/g, '').toLowerCase() === normalized
                                            );

    if (!found) return null;
    if (found.currentPrice === -1) return 'None'; // 没货

    return found.currentPrice;
}

function getMatIDByMatName(name) {
    let material_price;
    const s = localStorage.getItem('material_price');
    if (!s) return null;
    try {
        material_price=JSON.parse(s);
    } catch {
        throw new Error("material_price不存在或格式错误！");
    }
    name=name_fix(name);

    const normalized = name.replace(/\s+/g, '').toLowerCase();

    const found = material_price.prices.find(item =>
                                             item.matName.replace(/\s+/g, '').toLowerCase() === normalized
                                            );

    if (!found) return null;

    return found.matId;
}

function getCurrentPriceByMatId(id) {
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
    if (found.currentPrice === -1) return null; // 没货

    return found.currentPrice;
}

function name_fix(name){
    switch (name){
        case 'IronBar': return 'Iron';
        case 'CopperBar': return 'Copper';
        case 'CopperWiring': return 'CopperWire';
        case 'BasicAmenities': return 'Amenities';
        case 'BasicConstructionKit': return 'ConstructionKit';
        case 'BasicPrefabKit': return 'PrefabKit';
        case 'ReinforcedTruss': return 'Truss';
        case 'BasicHullPlate': return 'HullPlate';
        case 'HydrogenFuelCell': return 'HydrogenFuel';
        case 'Gasoline': return 'Ethanol';
        case 'NutrientBlend': return 'Bio-NutrientBlend';
        case 'Electronics': return 'ConsumerElectronics';
        case 'APU': return 'AdvancedProcessingUnit';
        case 'Superconductors': return 'GrapheniumWire';
        case 'HyperCoil': return 'SuperconductingCoil';
        case 'BasicPump': return 'Pump';
        case 'Motor':return 'ElectricMotor';
        case 'WeldingKit2':return 'MolecularFusionKit';
        case 'AdvancedDrill':return 'TitaniumCarbideDrill';
        case 'FieldCooling':return 'FieldCoolingSystem';
        case 'BasicFTLEmitter':return 'LinearFTLEmitter';
        case 'AdvancedFTLEmitter':return 'QuantumFTLEmitter';
        case 'SuperiorFTLEmitter':return 'Extra-dimensionalFTLEmitter';
        case 'BasicShipBridge':return 'ShuttleBridge';
        case 'AdvancedShipBridge':return 'HaulerBridge';
        case 'T4ShipBridge':return 'FreighterBridge';
        case 'T4ShipElements':return 'StarlifterStructuralElements';
        case 'AI':return 'ArtificialIntelligence';
        case 'Cow':return 'Cows';
        case 'Chicken':return 'Chickens';
        case 'BasicRations':return 'Rations';
        case 'BasicTools':return 'Tools';
        case 'BasicExosuit':return 'Exosuit';
        case 'Nanobots':return 'Nanites';
        case 'QuadraniumHullPlate':return 'StarglassHullPlate';
        default: return name;
    }
}

function buildingNameFix(name){
    switch (name){
        case 'ChemistryPlant':return 'ChemicalPlant';
        case 'BasicAssemblyPlant':return 'AssemblyPlant';
        case 'MicroelectronicsFactory':return 'Micronics Factory';
        case 'QuantumComputingCenter':return 'QuantumNexus';
        default: return name;
    }
}

function getWeight(matName){
    let gamedata;
    const s = localStorage.getItem('game_data');
    if (!s) return null;
    try {
        gamedata=JSON.parse(s);
    } catch {
        throw new Error("game_data不存在或格式错误！");
    }
    if (matName===null) return null;
    const matId=getMatIDByMatName(matName);
    return gamedata.materials[matId-1].weight;
}

function consumablesWaste(workers){
    let gamedata;
    const s = localStorage.getItem('game_data');
    if (!s) return null;
    try {
        gamedata=JSON.parse(s);
    } catch {
        throw new Error("game_data不存在或格式错误！");
    }
    if (workers===null) return null;
    const consumables = workers.reduce((acc, workersAmount, index) => {
        if (workersAmount == 0){
            return acc;
        }
        gamedata.workers[index].consumables.forEach(consumable => {
            let existing = acc.get(consumable.matId)
            if (existing) {
                existing += consumable.amount * workersAmount
            } else {
                acc.set(consumable.matId, consumable.amount * workersAmount)
            }
        })
        return acc
    }, new Map())

    let total = 0;
    let hasNone = false;

    consumables.forEach((amount, matId) => {
        const price = getCurrentPriceByMatId(matId);

        if (price === null) {
            hasNone = true;
            return;
        }

        total += price * amount;
    });

    if (hasNone) return "None";

    return total/1000/24;
}

function insertMaterialInfo() {
    const buttons = document.querySelectorAll(`
  .btn.btn-material.mt-GasesAndLiquids,
  .btn.btn-material.mt-Minerals,
  .btn.btn-material.mt-Metals,
  .btn.btn-material.mt-Chemicals,
  .btn.btn-material.mt-Plastics,
  .btn.btn-material.mt-Materials,
  .btn.btn-material.mt-Electronics,
  .btn.btn-material.mt-Machinery,
  .btn.btn-material.mt-ShipParts,
  .btn.btn-material.mt-Science,
  .btn.btn-material.mt-ConstructionMaterials,
  .btn.btn-material.mt-AgriculturalProducts,
  .btn.btn-material.mt-Consumables
`);

    buttons.forEach(btn => {
        if (btn.dataset.infoInjected) {
            const caption = btn.querySelector('.btn-caption');
            if (caption) {
                caption.querySelectorAll('.material-info-line, .material-info-br').forEach(node => node.remove());
            }
            delete btn.dataset.infoInjected;
        }

        // 找徽章（数量）
        let count=1;
        const badge = btn.querySelector('.badge.btn-badge');
        if (badge) {
            count = parseInt(badge.textContent.trim(), 10);
        }

        // 找材料Name
        const useTag = btn.querySelector('use');
        if (!useTag) return;

        const href = useTag.getAttribute('xlink:href') || '';
        const match = href.match(/#(.+)$/);
        const matName = match ? match[1] : null;
        if (!matName) return;


        // 找到按钮里的“文字标题”div
        const caption = btn.querySelector('.btn-caption');
        if (!caption) return;

        const mat_price=getCurrentPriceByMatName(matName);
        let total;
        let rawValue=null;
        let weight=getWeight(matName);
        if (mat_price === null) {
            total='Null';
            rawValue=null;
        }else if(mat_price === 'None'){
            total='None';
            rawValue=-1;
        }else{
            total='$'+formatThousands(mat_price * count / 100);
            rawValue= mat_price * count
        }
        // 在 caption 内部插入 <br> + <span>
        const br = document.createElement('br');
        br.className = 'material-info-br';
        const infoSpan = document.createElement('span');
        infoSpan.className = 'material-info-line';
        infoSpan.style.cssText = 'display:block;font-size:11px;color:#ffc107;margin-top:2px;';
        infoSpan.textContent = total;

        caption.appendChild(br);
        caption.appendChild(infoSpan);

        // 标记避免重复插入
        btn.dataset.infoInjected = '1';
        btn.dataset.number=rawValue;
        btn.dataset.weight=weight;
    });

    const smallbuttons = document.querySelectorAll(`
  .btn.btn-materialsm.mt-GasesAndLiquids,
  .btn.btn-materialsm.mt-Minerals,
  .btn.btn-materialsm.mt-Metals,
  .btn.btn-materialsm.mt-Chemicals,
  .btn.btn-materialsm.mt-Plastics,
  .btn.btn-materialsm.mt-Materials,
  .btn.btn-materialsm.mt-Electronics,
  .btn.btn-materialsm.mt-Machinery,
  .btn.btn-materialsm.mt-ShipParts,
  .btn.btn-materialsm.mt-Science,
  .btn.btn-materialsm.mt-ConstructionMaterials,
  .btn.btn-materialsm.mt-AgriculturalProducts,
  .btn.btn-materialsm.mt-Consumables
`);

    smallbuttons.forEach(btn => {
        if (btn.dataset.infoInjected) {
            const caption = btn.querySelector('.btn-caption');
            if (caption) {
                caption.querySelectorAll('.material-info-line, .material-info-br').forEach(node => node.remove());
            }
            delete btn.dataset.infoInjected;
        }

        // 找徽章（数量）
        let count=1;
        const badge = btn.querySelector('.badge.btn-badge');
        if (badge) {
            count = parseInt(badge.textContent.trim(), 10);
        }

        // 找材料Name
        const useTag = btn.querySelector('use');
        if (!useTag) return;

        const href = useTag.getAttribute('xlink:href') || '';
        const match = href.match(/#(.+)$/);
        const matName = match ? match[1] : null;
        if (!matName) return;


        // 找到按钮里的“文字标题”div
        const caption = document.createElement('div');
        caption.className='btn-caption';

        const mat_price=getCurrentPriceByMatName(matName);
        let total;
        let rawValue=null;
        let weight=getWeight(matName);
        if (mat_price === null) {
            total='Null';
            rawValue=null;
        }else if(mat_price === 'None'){
            total='None';
            rawValue=-1;
        }else{
            total='$'+formatThousands(mat_price * count / 100);
            rawValue= mat_price * count
        }
        // 在 caption 内部插入 <br> + <span>
        const br = document.createElement('br');
        br.className = 'material-info-br';
        const infoSpan = document.createElement('span');
        infoSpan.className = 'material-info-line';
        infoSpan.style.cssText = 'display:block;font-size:11px;color:#ffc107;margin-top:2px;';
        infoSpan.textContent = total;

        caption.appendChild(br);
        caption.appendChild(infoSpan);
        caption.appendChild(infoSpan);
        btn.appendChild(caption);

        // 标记避免重复插入
        btn.dataset.infoInjected = '1';
        btn.dataset.number=rawValue;
        btn.dataset.weight=weight;
    });
}


function getBuildingWorks(buildingName){
    let gamedata;
    const s = localStorage.getItem('game_data');
    if (!s) return null;
    try {
        gamedata=JSON.parse(s);
    } catch {
        throw new Error("game_data不存在或格式错误！");
    }
    const buildings=gamedata.buildings;

    buildingName=buildingNameFix(buildingName);

    const normalized = buildingName.replace(/\s+/g, '').toLowerCase();

    const found = buildings.find(item =>
                                 item.name.replace(/\s+/g, '').toLowerCase() === normalized
                                );
    if (!found) return null;
    return found.workersNeeded;
}


function insertProfit(){
    const recipeTable = document.querySelector('table.table-hover.mb-0:not(.align-middle):not(.text-end):not(.table-transparent) tbody');
    const recipeHead = document.querySelector('table.table-hover.mb-0:not(.align-middle):not(.text-end):not(.table-transparent) thead');
    if (!recipeTable) return;
    if (recipeHead) {
        const tr = recipeHead.querySelector('tr');
        if (tr&&!tr.querySelector('.gt-extra-th')) {
            const th = document.createElement('th');
            th.textContent = "Hour";
            th.style.whiteSpace = "nowrap";
            th.classList.add('gt-extra-th');
            tr.appendChild(th);
        }
    }
    recipeTable.querySelectorAll('tr').forEach(tr => {

        // 避免重复添加 td
        if (tr.dataset.processed) return;

        const tds = tr.querySelectorAll('td');
        let time;
        let profit;
        let inputsTotalCost;
        let consumablesCost;
        let outputWeight;
        let outputCost;
        if (tds.length === 5) {
            // ========= 1. 获取产品图标名称（use 中的 #PrefabPlant） =========
            const firstTdUse = tds[0].querySelector('use');
            let buildingName = 'Null';
            if (firstTdUse) {
                const href = firstTdUse.getAttribute('xlink:href') || '';
                const match = href.match(/#(.+)$/);
                if (match) buildingName = match[1];
            }
            const workers=getBuildingWorks(buildingName);
            consumablesCost=consumablesWaste(workers);


            // ========= 2. 第二个 td：输入材料 data-number 求和 =========
            inputsTotalCost = 0;
            let hasNone = false;

            tds[1].querySelectorAll('button[data-number]').forEach(btn => {
                const raw = btn.dataset.number;

                // dataset.number 不存在或为空 → 当成 0
                if (raw === undefined || raw === null || raw.trim() === "") {
                    inputsTotalCost = null;
                }

                const n = Number(raw);

                if (Number.isNaN(n)) {
                    inputsTotalCost = null;
                }

                if (n === -1) {
                    hasNone = true;
                } else {
                    inputsTotalCost += n;
                }
            });

            if (hasNone) {
                inputsTotalCost = null;
            }

            // ========= 3. 第四个 td：时间文本（例如“1小时 45分钟”） =========
            const timeText = tds[3].innerText.trim();
            time=ConvertTimeToHours(timeText);

            // ========= 4. 第五个 td：产品 data-number（产出） =========
            outputCost = null;
            hasNone = false;
            const outputBtn = tds[4].querySelector('button[data-number]');
            if (outputBtn) {
                outputCost = Number(outputBtn.dataset.number || 0);
                outputWeight=outputBtn.dataset.weight;
                const rawOut = outputBtn.dataset.number;

                // dataset.number 不存在或为空 → 当成 0
                if (rawOut === undefined || rawOut === null || rawOut.trim() === "") {
                    outputCost = null;
                }

                const nOut = Number(rawOut);

                if (Number.isNaN(nOut)) {
                    outputCost = null;
                }

                if (nOut === -1) {
                    hasNone = true;
                } else {
                    outputCost = nOut;
                }
                if (hasNone) {
                    outputCost = null;
                }
            }
            if (outputCost===null||inputsTotalCost===null){
                profit=null;
            }else{
                profit=outputCost-inputsTotalCost;
            }
        }else if (tds.length === 4) {
            // ========= 1. 获取产品图标名称（use 中的 #PrefabPlant） =========
            let buildingName = 'Null';
            const use = document.querySelector('.modal-header use');
            if (use) {
                const href = use.getAttribute('xlink:href') || use.getAttribute('href');
                const match = href && href.match(/#(.+)$/);
                buildingName = match ? match[1] : null;
            }
            const workers=getBuildingWorks(buildingName);
            consumablesCost=consumablesWaste(workers);
            // ========= 2. 第二个 td：输入材料 data-number 求和 =========
            inputsTotalCost = 0;
            let hasNone = false;

            tds[0].querySelectorAll('button[data-number]').forEach(btn => {
                const raw = btn.dataset.number;

                // dataset.number 不存在或为空 → 当成 0
                if (raw === undefined || raw === null || raw.trim() === "") {
                    inputsTotalCost = null;
                }

                const n = Number(raw);

                if (Number.isNaN(n)) {
                    inputsTotalCost = null;
                }

                if (n === -1) {
                    hasNone = true;
                } else {
                    inputsTotalCost += n;
                }
            });

            if (hasNone) {
                inputsTotalCost = null;
            }

            // ========= 3. 第三个 td：时间文本（例如“1小时 45分钟”） =========
            const timeText = tds[2].innerText.trim();
            time=ConvertTimeToHours(timeText);

            // ========= 4. 第四个 td：产品 data-number（产出） =========
            outputCost = null;
            hasNone = false;
            const outputBtn = tds[3].querySelector('button[data-number]');
            if (outputBtn) {
                outputCost = Number(outputBtn.dataset.number || 0);
                outputWeight=outputBtn.dataset.weight;
                const rawOut = outputBtn.dataset.number;

                // dataset.number 不存在或为空 → 当成 0
                if (rawOut === undefined || rawOut === null || rawOut.trim() === "") {
                    outputCost = null;
                }

                const nOut = Number(rawOut);

                if (Number.isNaN(nOut)) {
                    outputCost = null;
                }

                if (nOut === -1) {
                    hasNone = true;
                } else {
                    outputCost = nOut;
                }
                if (hasNone) {
                    outputCost = null;
                }
            }
            if (outputCost===null||inputsTotalCost===null){
                profit=null;
            }else{
                profit=outputCost-inputsTotalCost;
            }
        }else if(tds.length === 3){//手机端
            // ========= 1. 获取产品图标名称（use 中的 #PrefabPlant） =========
            const firstTdUse = tds[0].querySelector('use');
            let buildingName = 'Null';
            if (firstTdUse) {
                const href = firstTdUse.getAttribute('xlink:href') || '';
                const match = href.match(/#(.+)$/);
                if (match) buildingName = match[1];
            }
            const workers=getBuildingWorks(buildingName);
            consumablesCost=consumablesWaste(workers);
            // ========= 2. 第二个 td：输入材料 data-number 求和 =========
            inputsTotalCost = 0;
            let hasNone = false;

            tds[1].querySelectorAll('button[data-number]').forEach(btn => {
                const raw = btn.dataset.number;

                // dataset.number 不存在或为空 → 当成 0
                if (raw === undefined || raw === null || raw.trim() === "") {
                    inputsTotalCost = null;
                }

                const n = Number(raw);

                if (Number.isNaN(n)) {
                    inputsTotalCost = null;
                }

                if (n === -1) {
                    hasNone = true;
                } else {
                    inputsTotalCost += n;
                }
            });

            if (hasNone) {
                inputsTotalCost = null;
            }
            // ========= 4. 第3个 td：产品 data-number（产出） =========
            const timeElement = tds[2].querySelector('.btn-h2.bg-dark.mt-1 div');
            const timeText = timeElement.textContent.trim();
            time=ConvertTimeToHours(timeText);

            outputCost = null;
            hasNone = false;
            const outputBtn = tds[2].querySelector('button[data-number]');
            if (outputBtn) {
                outputCost = Number(outputBtn.dataset.number || 0);
                outputWeight=outputBtn.dataset.weight;
                const rawOut = outputBtn.dataset.number;

                // dataset.number 不存在或为空 → 当成 0
                if (rawOut === undefined || rawOut === null || rawOut.trim() === "") {
                    outputCost = null;
                }

                const nOut = Number(rawOut);

                if (Number.isNaN(nOut)) {
                    outputCost = null;
                }

                if (nOut === -1) {
                    hasNone = true;
                } else {
                    outputCost = nOut;
                }
                if (hasNone) {
                    outputCost = null;
                }
            }
            if (outputCost===null||inputsTotalCost===null){
                profit=null;
            }else{
                profit=outputCost-inputsTotalCost;
            }

        }else if(tds.length === 2){//手机端
            // ========= 1. 获取产品图标名称（use 中的 #PrefabPlant） =========
            let buildingName = 'Null';
            const use = document.querySelector('.modal-header use');
            if (use) {
                const href = use.getAttribute('xlink:href') || use.getAttribute('href');
                const match = href && href.match(/#(.+)$/);
                buildingName = match ? match[1] : null;
            }
            const workers=getBuildingWorks(buildingName);
            consumablesCost=consumablesWaste(workers);
            // ========= 2. 第二个 td：输入材料 data-number 求和 =========
            inputsTotalCost = 0;
            let hasNone = false;

            tds[0].querySelectorAll('button[data-number]').forEach(btn => {
                const raw = btn.dataset.number;

                // dataset.number 不存在或为空 → 当成 0
                if (raw === undefined || raw === null || raw.trim() === "") {
                    inputsTotalCost = null;
                }

                const n = Number(raw);

                if (Number.isNaN(n)) {
                    inputsTotalCost = null;
                }

                if (n === -1) {
                    hasNone = true;
                } else {
                    inputsTotalCost += n;
                }
            });

            if (hasNone) {
                inputsTotalCost = null;
            }
            // ========= 4. 第3个 td：产品 data-number（产出） =========
            const timeElement = tds[1].querySelector('.btn-h2.bg-dark.mt-1 div');
            const timeText = timeElement.textContent.trim();
            time=ConvertTimeToHours(timeText);

            outputCost = null;
            hasNone = false;
            const outputBtn = tds[1].querySelector('button[data-number]');
            if (outputBtn) {
                outputCost = Number(outputBtn.dataset.number || 0);
                outputWeight=outputBtn.dataset.weight;
                const rawOut = outputBtn.dataset.number;

                // dataset.number 不存在或为空 → 当成 0
                if (rawOut === undefined || rawOut === null || rawOut.trim() === "") {
                    outputCost = null;
                }

                const nOut = Number(rawOut);

                if (Number.isNaN(nOut)) {
                    outputCost = null;
                }

                if (nOut === -1) {
                    hasNone = true;
                } else {
                    outputCost = nOut;
                }
                if (hasNone) {
                    outputCost = null;
                }
            }
            if (outputCost===null||inputsTotalCost===null){
                profit=null;
            }else{
                profit=outputCost-inputsTotalCost;
            }

        }else{
            return;
        }

        // ========= 5. 创建新的 TD 显示信息 =========
        const newTd = document.createElement('td');
        newTd.style.whiteSpace = 'nowrap';// 不换行，可按需调整
        let hourProfit;
        let hourTonProfit;
        if (profit===null||time===null||time===0){
            hourProfit='None';
            hourTonProfit='None';
        }else{
            hourProfit='$'+formatThousands((profit/time-consumablesCost)/100);
            hourTonProfit='$'+formatThousands((profit/time-consumablesCost)/outputWeight/100);
        }
        var consumerCost;
        if (consumablesCost===null||time===null||time===0){
            consumerCost='None';
        }else{
            consumerCost='$'+formatThousands(consumablesCost/100);
        }
        var materialCost;
        if (inputsTotalCost===null||time===null||time===0){
            materialCost='None';
        }else{
            materialCost='$'+formatThousands(inputsTotalCost/time/100);
        }
        var outputValue;
        if (outputCost===null||time===null||time===0){
            outputValue='None';
        }else{
            outputValue='$'+formatThousands(outputCost/time/100);
        }
        var profitRate;
        if (outputCost===null||time===null||time===0||profit===null){
            profitRate='None';
        }else{
            profitRate=(profit/time/(inputsTotalCost/time+consumablesCost)*100).toFixed(2)+"%";
        }


        const profitColor = hourProfit === "None" ? "#6c757d" : profit >= 0 ? "#28a745": "#dc3545";

        const fullInfo = `
利润率: ${profitRate}
每时利润: ${hourProfit}
每时每吨利润: ${hourTonProfit}
每小时消耗品: ${consumerCost}
每小时原料: ${materialCost}
每小时生产: ${outputValue}
`;

        newTd.innerHTML = newTd.innerHTML = `
        <span
        style="color:${profitColor}; font-weight:bold; white-space:nowrap; cursor:help;"
        title="${fullInfo}"
        >
        ${hourProfit}
        </span>
        `;

        tr.appendChild(newTd);

        tr.dataset.processed = "1";
    });

}

function ConvertTimeToHours(_time) {
    if (!_time || typeof _time !== "string") return null;

    let days = 0, hours = 0, minutes = 0, seconds = 0;

    // ========== 1. 英文格式统一处理 ==========
    // 支持：3d 4h 5m 6s（顺序不限）
    const englishRegex = /(\d+)\s*d|(\d+)\s*h|(\d+)\s*m|(\d+)\s*s/gi;
    let match;

    while ((match = englishRegex.exec(_time)) !== null) {
        if (match[1]) days += Number(match[1]);
        if (match[2]) hours += Number(match[2]);
        if (match[3]) minutes += Number(match[3]);
        if (match[4]) seconds += Number(match[4]);
    }

    // ========== 2. 中文格式处理 ==========
    const chineseDay = /(\d+)\s*天/g;
    const chineseHour = /(\d+)\s*小时/g;
    const chineseMinute = /(\d+)\s*分/g;
    const chineseSecond = /(\d+)\s*秒/g;

    let m2;
    while ((m2 = chineseDay.exec(_time)) !== null) days += Number(m2[1]);
    while ((m2 = chineseHour.exec(_time)) !== null) hours += Number(m2[1]);
    while ((m2 = chineseMinute.exec(_time)) !== null) minutes += Number(m2[1]);
    while ((m2 = chineseSecond.exec(_time)) !== null) seconds += Number(m2[1]);

    // ========== 3. 统一换算为总小时 ==========
    return days * 24 + hours + minutes / 60 + seconds / 3600;
}

(function() {
    'use strict';
    // 初始执行
    insertMaterialInfo();
    insertProfit();

    // 监听页面变化（动态加载）
    const observer = new MutationObserver(() => {
        observer.disconnect();
        insertMaterialInfo();
        insertProfit();
        observer.observe(document.body, { childList: true, subtree: true }); // 恢复监听
    });
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('[GT Material Price Inserter] 已启动');
})();