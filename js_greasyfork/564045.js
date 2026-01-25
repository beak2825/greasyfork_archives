// ==UserScript==
// @name         Shipping Manager – Unified Profit Optimizer
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  For container ships AND tankers to determine profitable routes
// @match        https://shippingmanager.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564045/Shipping%20Manager%20%E2%80%93%20Unified%20Profit%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/564045/Shipping%20Manager%20%E2%80%93%20Unified%20Profit%20Optimizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    // CONSTANTS
    // =========================
    const FUEL_PRICE = 500;
    const CO2_PRICE = 10;
    const MIN_SPEED = 5;

    // Route tracking
    let routeComparisons = [];
    let isOptimizing = false;
    let savedMaxSpeed = 0;

    // =========================
    // HELPERS
    // =========================
    function num(text) {
        return parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // =========================
    // DETECT SHIP TYPE
    // =========================
    function detectShipType() {
        const popup = document.querySelector('.route_vessel') || document.querySelector('.routeInformation');
        if (!popup) return null;

        const text = popup.innerText;
        if (text.includes('bbl')) return 'tanker';
        if (text.includes('TEU')) return 'container';
        return null;
    }

    // =========================
    // READERS (SHARED)
    // =========================
    function getShipCapacity() {
        const entries = document.querySelectorAll('.route_vessel .dataEntry');
        for (const e of entries) {
            if (e.innerText.includes('Total capacity')) {
                return num(e.innerText);
            }
        }
        return 0;
    }

    function getMaxSpeed() {
        const entries = document.querySelectorAll('.route_vessel .dataEntry');
        for (const e of entries) {
            if (e.innerText.includes('Max speed') || e.innerText.includes('max')) {
                const speed = num(e.innerText);
                if (speed > 0) {
                    savedMaxSpeed = speed;
                    return speed;
                }
            }
        }
        if (savedMaxSpeed > 0) return savedMaxSpeed;

        const slider = getSpeedSlider();
        if (slider) {
            const maxAttr = parseInt(slider.getAttribute('max'));
            if (maxAttr > 0) {
                savedMaxSpeed = maxAttr;
                return maxAttr;
            }
        }
        return 0;
    }

    function getShipName() {
        const header = document.querySelector('.dataEntry.header > p');
        return header ? header.innerText.trim() : 'Unknown Ship';
    }

    function getCO2PerUnitNM() {
        const entries = document.querySelectorAll('.route_vessel .dataEntry');
        for (const e of entries) {
            const label = e.querySelector('p');
            const content = e.querySelector('.content');
            if (label && content && label.innerText.includes('CO2 emission')) {
                return num(content.innerText);
            }
        }
        return 0;
    }

    function getRouteDistance() {
        const routeInfo = document.querySelectorAll('.routeInformation .status p');
        for (const p of routeInfo) {
            if (p.innerText.includes('nm')) {
                return num(p.innerText);
            }
        }
        return 0;
    }

    function getRouteName() {
        const routeInfo = document.querySelector('.routeInformation');
        if (!routeInfo) return 'Unknown Route';

        const ports = routeInfo.querySelectorAll('.port');
        if (ports.length < 2) return 'Unknown Route';

        const fromCode = ports[0].querySelector('.headline p')?.innerText.trim() || '???';
        const toCode = ports[1].querySelector('.headline p')?.innerText.trim() || '???';
        return `${fromCode} → ${toCode}`;
    }

    function getCargoPrice() {
        const prices = document.querySelectorAll('.route_advanced .greenText');
        for (const p of prices) {
            const v = num(p.innerText);
            if (v > 0) return v;
        }
        return 0;
    }

    function getFuelConsumption() {
        const entries = document.querySelectorAll('.dataEntry');
        for (const e of entries) {
            if (e.innerText.includes('Fuel consumption')) {
                return num(e.innerText);
            }
        }
        return 0;
    }

    function getTravelTimeHours() {
        const blocks = document.querySelectorAll('.time p');
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].innerText.trim() === 'Travel time') {
                const t = blocks[i + 1]?.innerText;
                if (!t) return 0;
                const [h, m, s] = t.split(':').map(Number);
                return h + m / 60 + s / 3600;
            }
        }
        return 0;
    }

    function getCurrentSpeed() {
        const speedEntries = document.querySelectorAll('.detailsBlock .dataEntry');
        for (const e of speedEntries) {
            const text = e.innerText;
            if (text.includes('Speed') && text.includes('kn')) {
                return num(text);
            }
        }
        return 0;
    }

    function getSpeedSlider() {
        return document.querySelector('.detailsBlock input.slider[type="range"]');
    }

    // =========================
    // CALCULATIONS (TYPE-AWARE)
    // =========================
    function calculateProfit(capacity, price, fuel, co2PerUnitNM, distance, hours, shipType) {
        const CARGO_FILL_RATIO = 0.9;
        let revenue, harborFee, cargoForHarbor;

        if (shipType === 'tanker') {
            // Tanker: capacity in bbl
            revenue = capacity * CARGO_FILL_RATIO * price;
            cargoForHarbor = (capacity / 74) * CARGO_FILL_RATIO; // convert to TEU equivalent
            harborFee = (17000 / distance) * Math.pow(cargoForHarbor, 1.2);
        } else {
            // Container: capacity in TEU
            revenue = capacity * CARGO_FILL_RATIO * price;
            cargoForHarbor = capacity * CARGO_FILL_RATIO;
            harborFee = (17000 / distance) * Math.pow(cargoForHarbor, 1.2);
        }

        const fuelCost = fuel * FUEL_PRICE;
        const totalCO2kg = cargoForHarbor * distance * co2PerUnitNM;
        const co2Cost = (totalCO2kg / 1000) * CO2_PRICE;

        const gameProfit = revenue - harborFee;
        const gameProfithr = gameProfit / hours;
        const optimizedProfit = revenue - fuelCost - co2Cost - harborFee;
        const profitPerHour = optimizedProfit / hours;
        const harbourRatio = revenue > 0 ? harborFee / revenue : 0;
        const adjustedPPH = profitPerHour * (1 - harbourRatio);

        return {
            gameProfit,
            gameProfithr,
            optimizedProfit,
            profitPerHour,
            adjustedPPH,
            harbourRatio,
            revenue,
            fuelCost,
            co2Cost,
            harborFee
        };
    }

    function classifyRoute(revenue, capacity, harborFee, profitPerHour, adjustedPPH) {
        if (revenue === 0 || capacity === 0) {
            return { label: 'WAIT', color: '#aaa' };
        }

        const adjustedRatio = profitPerHour > 0 ? adjustedPPH / profitPerHour : 0;
        const harbourPct = harborFee / revenue;
        const adjPerUnit = adjustedPPH / capacity;

        if (harbourPct <= 0.08 && adjustedRatio >= 0.85 && adjPerUnit >= 80) {
            return { label: 'KEEP', color: '#2ecc71' };
        } else if (harbourPct <= 0.15 && adjustedRatio >= 0.7) {
            return { label: 'REVIEW', color: '#f1c40f' };
        } else {
            return { label: 'REJECT', color: '#e74c3c' };
        }
    }

    // =========================
    // SPEED OPTIMIZER
    // =========================
    async function optimizeSpeed(shipType) {
        const slider = getSpeedSlider();
        const maxSpeed = getMaxSpeed();
        const capacity = getShipCapacity();
        const price = getCargoPrice();
        const distance = getRouteDistance();
        const co2PerUnitNM = getCO2PerUnitNM();

        if (!slider || !maxSpeed || !capacity || !price || !distance || !co2PerUnitNM) {
            return null;
        }

        isOptimizing = true;
        let bestSpeed = MIN_SPEED;
        let bestProfitPerHour = -Infinity;
        let bestData = null;

        for (let speed = MIN_SPEED; speed <= maxSpeed; speed++) {
            slider.value = speed;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(200);

            const fuel = getFuelConsumption();
            const hours = getTravelTimeHours();

            if (fuel && hours) {
                const calc = calculateProfit(capacity, price, fuel, co2PerUnitNM, distance, hours, shipType);
                if (calc.adjustedPPH > bestProfitPerHour) {
                    bestProfitPerHour = calc.adjustedPPH;
                    bestSpeed = speed;
                    bestData = { speed, fuel, hours, ...calc };
                }
            }
        }

        if (bestData) {
            slider.value = bestSpeed;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            await wait(200);
        }

        isOptimizing = false;
        return bestData;
    }

    // =========================
    // ROUTE TRACKING
    // =========================
    function addRouteComparison(routeName, data, capacity, distance, co2PerUnitNM) {
        const classification = classifyRoute(data.revenue, capacity, data.harborFee, data.profitPerHour, data.adjustedPPH);
        routeComparisons = routeComparisons.filter(r => r.name !== routeName);
        routeComparisons.push({
            name: routeName,
            speed: data.speed,
            gameProfit: data.gameProfit,
            gameProfithr: data.gameProfithr,
            profitPerHour: data.profitPerHour,
            classification: classification.label,
            color: classification.color,
            timestamp: Date.now()
        });
        routeComparisons.sort((a, b) => b.profitPerHour - a.profitPerHour);
        if (routeComparisons.length > 10) {
            routeComparisons = routeComparisons.slice(0, 10);
        }
    }

    // =========================
    // UI OVERLAYS
    // =========================
    const mainOverlay = document.createElement('div');
    mainOverlay.style.cssText = `
        position: fixed;
        top: 1px;
        right: 300px;
        z-index: 99999;
        background: rgba(0,0,0,0.9);
        color: #fff;
        padding: 12px;
        font-size: 13px;
        font-family: Arial, sans-serif;
        border-radius: 6px;
        min-width: 240px;
    `;
   // Add reset function
function resetOptimizer() {
    updateOverlay('Optimiser ready');
}

function updateOverlay(content) {
    mainOverlay.innerHTML = content;
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'reset';
    closeBtn.onclick = resetOptimizer;
    closeBtn.style.cssText = `
    position: absolute;
    top: 4px;
    right: 4px;
    background: #e74c3c;
    color: white;
    border: none;
    width: 44px;
    height: 22px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;
    mainOverlay.appendChild(closeBtn);
}

// Initialize overlay
resetOptimizer(); // 👈 Sets initial state: "Optimiser ready"
document.body.appendChild(mainOverlay);

    const compareOverlay = document.createElement('div');
    compareOverlay.style.cssText = `
        position: fixed;
        top: 1px;
        right: 70px;
        z-index: 99999;
        background: rgba(0,0,0,0.9);
        color: #fff;
        padding: 12px;
        font-size: 12px;
        font-family: Arial, sans-serif;
        border-radius: 6px;
        max-width: 280px;
        max-height: 600px;
        overflow-y: auto;
    `;
    compareOverlay.innerHTML = '<b>📊 Top Routes</b><hr style="opacity:0.3"><p>No routes tested yet</p>';
    document.body.appendChild(compareOverlay);

    compareOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'clearRoutesBtn') {
            routeComparisons = [];
            updateComparisonUI();
        }
    });

    function updateComparisonUI() {
        if (routeComparisons.length === 0) {
            compareOverlay.innerHTML = '<b>📊 Top Routes</b><hr style="opacity:0.3"><p>No routes tested yet</p>';
            return;
        }
        let html = '<b>📊 Top Routes</b> <button id="clearRoutesBtn" style="float:right;background:#e74c3c;color:#fff;border:none;padding:2px 8px;border-radius:3px;cursor:pointer;font-size:10px;">Clear</button><hr style="opacity:0.3">';
        routeComparisons.forEach((route, i) => {
            html += `
                <div style="margin-bottom:8px; padding:6px; background:rgba(255,255,255,0.05); border-radius:4px;">
                    <b>${i + 1}. ${route.name}</b><br>
                    <span style="color:${route.color}">■</span> ${route.classification} | ${route.speed} kn<br>
                    Game Profit: $${(route.gameProfit || 0).toLocaleString()}<br>
                    Game Profit/hr: $${(route.gameProfithr || 0).toLocaleString()}<br>
                    Opt P/h: <span style="color:#2ecc71">$${route.profitPerHour.toLocaleString()}/hr</span>
                </div>
            `;
        });
        compareOverlay.innerHTML = html;
    }

    // =========================
    // AUTO-CLICK ADVANCED TAB
    // =========================
    let advancedClickedForRoute = '';
    function autoClickAdvanced(currentRoute) {
        if (advancedClickedForRoute === currentRoute) return false;
        const advancedBar = document.querySelector('.route_advanced .customBlackBar');
        if (advancedBar) {
            const advancedSection = document.querySelector('.route_advanced');
            const hasContent = advancedSection && advancedSection.children.length > 1;
            if (!hasContent) {
                advancedBar.click();
                advancedClickedForRoute = currentRoute;
                return true;
            }
        }
        return false;
    }

    // =========================
    // MAIN UPDATE LOOP
    // =========================
    let lastRouteName = '';
    let optimizedThisRoute = false;
    let routeDetectedTime = 0;
    let optimizationAttempts = 0;

    async function update() {
        const routeName = getRouteName();
        if (routeName === 'Unknown Route') return;

        const shipType = detectShipType();
        if (!shipType) {
            updateOverlay('⚠️ Unknown ship type (not TEU or bbl)');
            return;
        }

        autoClickAdvanced(routeName);

        const capacity = getShipCapacity();
        const price = getCargoPrice();
        const distance = getRouteDistance();
        const co2PerUnitNM = getCO2PerUnitNM();
        const slider = getSpeedSlider();

        if (routeName !== lastRouteName) {
            lastRouteName = routeName;
            optimizedThisRoute = false;
            routeDetectedTime = Date.now();
            optimizationAttempts = 0;
        }

        if (!capacity || !price || !distance || !co2PerUnitNM || !slider) {
            updateOverlay(`Waiting for route data...<br><small>Route: ${routeName}<br>Type: ${shipType}</small>`);
            return;
        }

        const timeSinceDetection = Date.now() - routeDetectedTime;
        if (timeSinceDetection < 1000) {
            updateOverlay('<b style="color:#f39c12">Route loaded, preparing...</b>');
            return;
        }

        if (!optimizedThisRoute && !isOptimizing && optimizationAttempts < 3) {
            optimizationAttempts++;
            updateOverlay('<b style="color:#f39c12">⚙ Optimizing speed...</b>');
            const optimalData = await optimizeSpeed(shipType);
            if (optimalData) {
                optimizedThisRoute = true;
                addRouteComparison(routeName, optimalData, capacity, distance, co2PerUnitNM);
                updateComparisonUI();
            }
        }

        const fuel = getFuelConsumption();
        const hours = getTravelTimeHours();
        const speed = getCurrentSpeed();

        if (!fuel || !hours) {
            updateOverlay('Calculating...');
            return;
        }

        const calc = calculateProfit(capacity, price, fuel, co2PerUnitNM, distance, hours, shipType);
        const classification = classifyRoute(calc.revenue, capacity, calc.harborFee, calc.profitPerHour, calc.adjustedPPH);
        const unit = shipType === 'tanker' ? 'bbl' : 'TEU';

        updateOverlay(`
            <b>Route:</b> <span style="color:${classification.color}">${classification.label}</span><br>
            <b>Current Speed:</b> ${speed} kn<br>
            <b>Capacity:</b> ${capacity.toLocaleString()} ${unit}<br><hr style="opacity:0.3">
            <b>Revenue:</b> $${calc.revenue.toLocaleString()}<br>
            <b>Fuel cost:</b> $${calc.fuelCost.toLocaleString()}<br>
            <b>CO₂ cost:</b> $${calc.co2Cost.toLocaleString()}<br>
            <b>Harbour fee:</b> $${calc.harborFee.toLocaleString()}<br><hr style="opacity:0.3">
            <b>Game Profit:</b> $${calc.gameProfit.toLocaleString()}<br>
            <b>Game Profit/hr:</b> $${calc.gameProfithr.toLocaleString()}<br>
            <b>Optimized Profit:</b> $${calc.optimizedProfit.toLocaleString()}<br>
            <b>OptProfit/hour:</b> $${calc.profitPerHour.toLocaleString()}<br>
            <b>Harbor %:</b> ${(calc.harbourRatio * 100).toFixed(1)}%
        `);

        window.shippingLatestRouteData = {
            routeName,
            shipName: getShipName(),
            distance,
            speed,
            capacity,
            revenue: calc.revenue,
            fuelCost: calc.fuelCost,
            co2Cost: calc.co2Cost,
            harborFee: calc.harborFee,
            profitPerHour: calc.adjustedPPH,
            travelTime: hours,
            timestamp: new Date().toISOString()
        };
    }

    setInterval(update, 500);
})();