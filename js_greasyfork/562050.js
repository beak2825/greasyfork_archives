// ==UserScript==
// @name         Cookie Clicker Omniscient Bot
// @namespace    https://github.com/SmartCookie/Optimizer
// @version      5.0
// @description  The ultimate Cookie Clicker Bot. Perfect Simulation-Based Optimization, Auto-Stock Trading, Garden Auto-Planting, Pantheon Management, and Advanced Combo Stacking.
// @author       OptimizerBot
// @match        https://orteil.dashnet.org/cookieclicker/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562050/Cookie%20Clicker%20Omniscient%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/562050/Cookie%20Clicker%20Omniscient%20Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. GameBridge ---
    const GameBridge = {
        isReady: () => typeof Game !== 'undefined' && Game.ready,
        getCps: () => Game.cookiesPs,
        getCookies: () => Game.cookies,
        getObjects: () => Game.ObjectsById,
        getUpgrades: () => Game.UpgradesInStore,
        buyBuilding: (id) => { const obj = Game.ObjectsById[id]; if (obj) obj.buy(1); },
        buyUpgrade: (id) => { const upg = Game.UpgradesById[id]; if (upg) upg.buy(); },
        clickBigCookie: () => { if (Game.ClickCookie) Game.ClickCookie(); },
        getShimmers: () => Game.shimmers,
        clickShimmer: (shimmer) => { if (shimmer && shimmer.pop) shimmer.pop(); },
        getAscensionMode: () => Game.AscendTimer > 0 || Game.OnAscend,
        getPrestige: () => Game.prestige,
        getHeavenlyChips: () => Game.heavenlyChips,
        ascend: () => { if (!Game.OnAscend && Game.AscendTimer === 0) Game.Ascend(1); },
        reincarnate: () => { if (Game.OnAscend) Game.Reincarnate(1); },
        getGrimoire: () => {
            const wizard = Game.Objects['Wizard tower'];
            if (wizard && wizard.minigameLoaded) return wizard.minigame;
            return null;
        },
        castSpell: (spellName) => {
            const grimoire = GameBridge.getGrimoire();
            if (!grimoire) return;
            const spell = grimoire.spells[spellName.toLowerCase()];
            if (spell && grimoire.magic >= spell.costMin) grimoire.castSpell(spell, {});
        },
        getBuffs: () => Game.buffs,
        sellBuilding: (id, amount) => { const obj = Game.ObjectsById[id]; if (obj) obj.sell(amount); },
        getDragonLevel: () => Game.dragonLevel,
        setDragonAura: (slot, auraId) => {
            if (slot === 0) Game.dragonAura = auraId;
            if (slot === 1) Game.dragonAura2 = auraId;
            Game.recalculateGains = 1;
        },
        getCpsRaw: () => Game.cookiesPsRaw,
        getSeason: () => Game.season,
        setSeason: (season) => { if (Game.Upgrades[season] && Game.Upgrades[season].buy) Game.Upgrades[season].buy(); },
        getSantaLevel: () => Game.santaLevel,
        upgradeSanta: () => Game.UpgradeSanta(),
        getWrinklers: () => Game.wrinklers,
        popWrinkler: (id) => { if (Game.wrinklers[id] && Game.wrinklers[id].close >= 1) Game.wrinklers[id].click(); },
        getGarden: () => {
            if (Game.Objects['Farm'].minigameLoaded) return Game.Objects['Farm'].minigame;
            return null;
        },
        harvestPlant: (y, x) => { const garden = GameBridge.getGarden(); if (garden) garden.harvest(x, y); },
        plantSeed: (seedId, y, x) => { const garden = GameBridge.getGarden(); if (garden) garden.useTool(seedId, x, y); },
        getLumps: () => Game.lumps,
        levelUp: (id) => { const obj = Game.ObjectsById[id]; if (obj && obj.levelUp) obj.levelUp(); },
        getStocks: () => {
            const bank = Game.Objects['Bank'];
            if (bank && bank.minigameLoaded) return bank.minigame;
            return null;
        },
        getPantheon: () => {
            const temple = Game.Objects['Temple'];
            if (temple && temple.minigameLoaded) return temple.minigame;
            return null;
        },
        clickTicker: () => { if (Game.TickerEffect && Game.TickerEffect.type === 'fortune') Game.tickerL.click(); },
        setGoldenSwitch: (state) => {
            const upg = Game.Upgrades['Golden switch'];
            if (upg && upg.bought && !!Game.Has('Golden switch') !== state) upg.click();
        },
        setShimmeringVeil: (state) => {
            const upg = Game.Upgrades['Shimmering veil [off]'] || Game.Upgrades['Shimmering veil [on]'];
            if (upg && upg.bought && !!Game.Has('Shimmering veil') !== state) upg.click();
        },
        refillMagic: () => {
            const grimoire = GameBridge.getGrimoire();
            if (grimoire && GameBridge.getLumps() > 0 && grimoire.lumpT < Date.now()) {
                grimoire.lumpRefill.click();
                return true;
            }
            return false;
        }
    };

    // --- 2. Brain Modules ---

    const Learning = {
        weights: {},
        learningRate: 0.15,
        init: () => {
            const data = localStorage.getItem('CookieBot_ACE_Weights');
            if (data) { try { Learning.weights = JSON.parse(data); } catch (e) { } }
        },
        save: () => localStorage.setItem('CookieBot_ACE_Weights', JSON.stringify(Learning.weights)),
        getCorrection: (id) => Learning.weights[id] || 1.0,
        reportOutcome: (id, expected, actual) => {
            if (expected <= 0) return;
            let factor = actual / expected;
            if (factor <= 0 || factor > 50) return;
            const currentWeight = Learning.weights[id] || 1.0;
            const newWeight = currentWeight + Learning.learningRate * (factor - currentWeight);
            Learning.weights[id] = newWeight;
            Learning.save();
            Overlay.log(`ACE: ${id} weight ${currentWeight.toFixed(2)}->${newWeight.toFixed(2)}`);
        }
    };

    const Intelligence = {
        tick: () => {
            const grimoire = GameBridge.getGrimoire();
            if (!grimoire) return;
            const maxMagic = grimoire.maxMagic;
            const currentMagic = grimoire.magic;
            const buffs = GameBridge.getBuffs();
            let hasFrenzy = false, hasBuildingSpecial = false, hasClickFrenzy = false;
            for (let i in buffs) {
                if (buffs[i].name === 'Frenzy') hasFrenzy = true;
                if (buffs[i].name === 'Click frenzy') hasClickFrenzy = true;
                if (buffs[i].type && buffs[i].type.name === 'building buff') hasBuildingSpecial = true;
            }
            const cost = 10 + (maxMagic * 0.6);
            if (hasFrenzy && hasBuildingSpecial && !hasClickFrenzy) {
                if (currentMagic >= cost) {
                    Overlay.log("Grimoire: Potential Mega-Combo! Casting FtHoF.");
                    GameBridge.castSpell('hand of fate');
                    if (GameBridge.getLumps() > 0) {
                        if (GameBridge.refillMagic()) {
                            Overlay.log("Grimoire: Dual Casting FtHoF!");
                            GameBridge.castSpell('hand of fate');
                        }
                    }
                }
            } else if (hasFrenzy && !hasClickFrenzy && currentMagic >= cost) {
                Overlay.log("Grimoire: Casting FtHoF for Combo.");
                GameBridge.castSpell('hand of fate');
            }
            if (currentMagic >= maxMagic - 1) {
                if (currentMagic >= (10 + maxMagic * 0.1)) {
                    GameBridge.castSpell('haggler\'s charm');
                }
            }
        }
    };

    const GodzamokManager = {
        isActive: false,
        sacrificeTargetNames: ['Farm', 'Mine', 'Factory', 'Bank', 'Temple', 'Shipment', 'Alchemy lab'],
        tick: () => {
            const buffs = GameBridge.getBuffs();
            let hasClickFrenzy = false, hasDragonflight = false;
            for (let i in buffs) {
                if (buffs[i].name === 'Click frenzy') hasClickFrenzy = true;
                if (buffs[i].name === 'Dragonflight') hasDragonflight = true;
            }
            const shouldSell = hasClickFrenzy || hasDragonflight;
            if (shouldSell && !GodzamokManager.isActive) {
                GodzamokManager.executeSell();
            } else if (!shouldSell && GodzamokManager.isActive) {
                GodzamokManager.isActive = false;
            }
        },
        executeSell: () => {
            Overlay.log("Godzamok: Selling for Click Power!");
            const objects = GameBridge.getObjects();
            const cps = GameBridge.getCps();
            for (let id in objects) {
                const obj = objects[id];
                const contribution = (obj.storedTotalCps * Game.globalCpsMult) / (cps || 1);
                if (GodzamokManager.sacrificeTargetNames.includes(obj.name) || contribution < 0.01) {
                    const toSell = obj.amount - 10;
                    if (toSell > 0 && obj.name !== 'Wizard tower') GameBridge.sellBuilding(obj.id, toSell);
                }
            }
            GodzamokManager.isActive = true;
        }
    };

    const DragonManager = {
        AURAS: { BreathOfMilk: 0, EarthShatterer: 5, RadiantAppetite: 15, Dragonflight: 9 },
        _currentAura: null,
        tick: () => {
            const level = GameBridge.getDragonLevel();
            if (level < 5) return;
            const buffs = GameBridge.getBuffs();
            let hasClickFrenzy = false;
            for (let i in buffs) if (buffs[i].name === 'Click frenzy') hasClickFrenzy = true;
            if (hasClickFrenzy) {
                if (level >= 15 && DragonManager._currentAura !== DragonManager.AURAS.EarthShatterer) {
                    GameBridge.setDragonAura(0, DragonManager.AURAS.EarthShatterer);
                    DragonManager._currentAura = DragonManager.AURAS.EarthShatterer;
                    Overlay.log("Dragon: Combo Mode (Earth Shatterer)");
                }
            } else {
                if (level >= 15 && DragonManager._currentAura !== DragonManager.AURAS.RadiantAppetite) {
                    GameBridge.setDragonAura(0, DragonManager.AURAS.RadiantAppetite);
                    DragonManager._currentAura = DragonManager.AURAS.RadiantAppetite;
                    Overlay.log("Dragon: Growth Mode (Radiant Appetite)");
                } else if (level >= 10 && level < 15 && DragonManager._currentAura !== DragonManager.AURAS.BreathOfMilk) {
                    GameBridge.setDragonAura(0, DragonManager.AURAS.BreathOfMilk);
                    DragonManager._currentAura = DragonManager.AURAS.BreathOfMilk;
                }
            }
        }
    };

    const GardenManager = {
        tick: () => {
            const garden = GameBridge.getGarden();
            if (!garden) return;
            const buffs = GameBridge.getBuffs();
            let hasCombo = false;
            for (let i in buffs) if (buffs[i].name === 'Frenzy' || buffs[i].name === 'Click frenzy') hasCombo = true;
            if (hasCombo && garden.soil !== 2) {
                const clay = garden.soils['clay'];
                if (clay && garden.nextSoil <= Date.now()) { garden.soil = clay.id; Overlay.log("Garden: Soil -> Clay"); }
            } else if (!hasCombo && garden.soil !== 1) {
                const fert = garden.soils['fertilizer'];
                if (fert && garden.nextSoil <= Date.now()) { garden.soil = fert.id; Overlay.log("Garden: Soil -> Fertilizer"); }
            }
            for (let y = 0; y < garden.plot.length; y++) {
                for (let x = 0; x < garden.plot[y].length; x++) {
                    const tile = garden.plot[y][x];
                    if (tile[0] > 0) {
                        const plantData = garden.plantsById[tile[0] - 1];
                        if (tile[1] >= plantData.mature) { GameBridge.harvestPlant(y, x); Overlay.log(`Garden: Harvested ${plantData.name}`); }
                    } else {
                        const whisker = garden.plants['whiskerbloom'];
                        const clover = garden.plants['goldenClover'];
                        if (whisker && whisker.unlocked) GameBridge.plantSeed(whisker.id, y, x);
                        else if (clover && clover.unlocked) GameBridge.plantSeed(clover.id, y, x);
                    }
                }
            }
        }
    };

    const StockManager = {
        history: {},
        tick: () => {
            const market = GameBridge.getStocks();
            if (!market) return;
            if (market.brokers < market.maxBrokers && GameBridge.getCookies() > GameBridge.getCps() * 86400) {
                if (GameBridge.getCookies() > market.getBrokerPrice()) market.buyBroker();
            }
            market.goodsById.forEach(good => {
                const price = good.val;
                if (!StockManager.history[good.id]) StockManager.history[good.id] = [];
                StockManager.history[good.id].push(price);
                if (StockManager.history[good.id].length > 10) StockManager.history[good.id].shift();
                const prices = StockManager.history[good.id];
                const isRising = prices.length > 2 && prices[prices.length - 1] > prices[prices.length - 2];
                const isDropping = prices.length > 2 && prices[prices.length - 1] < prices[prices.length - 2];
                if (good.stock < market.getGoodMaxStock(good)) {
                    if (price < 5 || (price < (10 + market.officeLevel * 5) && isRising)) {
                        market.buyGood(good.id, market.getGoodMaxStock(good) - good.stock);
                        Overlay.log(`Stocks: Bought ${good.name}`);
                    }
                }
                if (good.stock > 0 && (price > 100 || (price > (60 + market.officeLevel * 10) && isDropping))) {
                    market.sellGood(good.id, good.stock);
                    Overlay.log(`Stocks: Sold ${good.name}`);
                }
            });
        }
    };

    const PantheonManager = {
        tick: () => {
            const pantheon = GameBridge.getPantheon();
            if (!pantheon || !pantheon.spirits || pantheon.swaps <= 0) return;
            const spirits = { godzamok: 0, mokalsium: 2, muridal: 4 };
            if (pantheon.slot[0] !== spirits.godzamok) pantheon.dragSpirit(pantheon.spirits['godzamok'], 0);
            else if (pantheon.slot[1] !== spirits.mokalsium) pantheon.dragSpirit(pantheon.spirits['mokalsium'], 1);
        }
    };

    const LumpManager = {
        tick: () => {
            const lumps = GameBridge.getLumps();
            if (lumps <= 0) return;
            const buildings = ['Wizard tower', 'Temple', 'Farm', 'Bank'];
            for (let name of buildings) {
                if (Game.Objects[name] && Game.Objects[name].level === 0) { GameBridge.levelUp(Game.Objects[name].id); return; }
            }
            if (lumps < 100) return;
            const farm = Game.Objects['Farm'];
            if (farm && farm.level < 10) GameBridge.levelUp(farm.id);
        }
    };

    const AscensionManager = {
        tick: () => {
            if (GameBridge.getAscensionMode()) { setTimeout(() => GameBridge.reincarnate(), 5000); return; }
            const chips = GameBridge.getHeavenlyChips();
            const prestigeNow = Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset);
            if (chips === 0) { if (prestigeNow >= 365) GameBridge.ascend(); }
            else if (chips < 1000000) { if (prestigeNow > chips * 0.1) GameBridge.ascend(); }
            else if (prestigeNow > chips * 0.5) GameBridge.ascend();
        }
    };

    const Optimizer = {
        simulateGain: (type, id) => {
            const originalCps = Game.cookiesPsRaw;
            let gain = 0;
            if (type === 'building') {
                const obj = Game.ObjectsById[id]; obj.amount++; Game.CalculateGains();
                gain = Game.cookiesPsRaw - originalCps; obj.amount--;
            } else {
                const upg = Game.UpgradesById[id]; const old = upg.bought; upg.bought = 1; Game.CalculateGains();
                gain = Game.cookiesPsRaw - originalCps; upg.bought = old;
            }
            Game.CalculateGains();
            return Math.max(0.1, gain);
        },
        recommendNextPurchase: () => {
            const candidates = [];
            const cps = GameBridge.getCps();
            const bank = GameBridge.getCookies();
            GameBridge.getObjects().forEach(obj => {
                if (obj.locked) return;
                const delta = Optimizer.simulateGain('building', obj.id) * Learning.getCorrection(obj.id);
                const price = obj.price;
                const tta = Math.max(0, (price - bank) / (cps || 1));
                let payback = price / delta;
                const distance = Math.ceil((obj.amount + 1) / 50) * 50 - obj.amount;
                if (distance <= 5) payback *= (0.4 + (distance * 0.1));
                candidates.push({ type: 'building', id: obj.id, name: obj.name, price, score: payback + tta, tta });
            });
            GameBridge.getUpgrades().forEach(upg => {
                if (upg.locked) return;

                // Enhanced seasonal upgrade detection - check if upgrade is actually available
                const isSeasonalUpgrade = upg.name.includes('Santa') || upg.name.includes('Easter') ||
                    upg.name.includes('Halloween') || upg.name.includes('Valentine') ||
                    upg.name.includes('Christmas') || upg.name.includes('Naughty') ||
                    upg.name.includes('Nice') || upg.name.includes('Reindeer') ||
                    upg.name.includes('Elf') || upg.name.includes('Snow') ||
                    upg.name.includes('Festive') || upg.name.includes('Egg') ||
                    upg.name.includes('Bunny') || upg.name.includes('Pumpkin');

                // V5 FIX: Only skip seasonal upgrades that aren't unlocked or available in pool
                // Allow already-bought upgrades to be processed so we can see their actual CPS values
                if (isSeasonalUpgrade && (!upg.unlocked || !upg.pool)) {
                    console.log(`[FILTER] Skipping seasonal upgrade: ${upg.name} (unlocked: ${upg.unlocked}, pool: ${upg.pool})`);
                    return; // Skip this upgrade
                }

                // V5 FIX: Don't skip upgrades just because they're already bought
                // We need to see the actual CPS values from all upgrades in the game state
                // Only skip if the upgrade is locked
                if (upg.locked) {
                    console.log(`[FILTER] Skipping locked upgrade: ${upg.name}`);
                    return;
                }

                const delta = Optimizer.simulateGain('upgrade', upg.id) * Learning.getCorrection(upg.id);

                // V5 FIX: Get actual price from game, not basePrice
                let price;
                if (typeof upg.getPrice === 'function') {
                    price = upg.getPrice(); // Use getPrice() method if available (most accurate)
                } else if (upg.price !== undefined) {
                    price = upg.price; // Fallback to price property
                } else {
                    price = upg.basePrice; // Last resort fallback
                }

                // V5 FIX: Special handling for "Increased merriness" and other seasonal upgrades
                // These upgrades often have dynamic pricing that can be misreported
                if (upg.name && upg.name.includes('merriness')) {
                    console.log(`[PRICING FIX] Checking special pricing for ${upg.name}`);
                    // Get the actual price from the game's upgrade pool if available
                    const actualUpgrade = Game.UpgradesInStore.find(u => u.name === upg.name);
                    if (actualUpgrade && typeof actualUpgrade.getPrice === 'function') {
                        const actualPrice = actualUpgrade.getPrice();
                        console.log(`[PRICING FIX] Corrected price for ${upg.name}: ${price} -> ${actualPrice}`);
                        price = actualPrice;
                    }
                }

                // V5 FIX: Add robust price validation to prevent mispriced upgrades
                // If price seems unreasonable compared to bank and CPS, flag it
                const priceValidationRatio = bank > 0 ? price / bank : price;
                const isPriceSuspicious = priceValidationRatio > 100 && price > bank * 10;

                if (isPriceSuspicious) {
                    console.log(`[PRICE VALIDATION] Suspicious price detected for ${upg.name}: ${price} (bank: ${bank}, ratio: ${priceValidationRatio.toFixed(2)})`);
                    // Try to get the actual price from the game store
                    const storeUpgrade = Game.UpgradesInStore.find(u => u.id === upg.id);
                    if (storeUpgrade && typeof storeUpgrade.getPrice === 'function') {
                        const correctedPrice = storeUpgrade.getPrice();
                        console.log(`[PRICE VALIDATION] Corrected price for ${upg.name}: ${price} -> ${correctedPrice}`);
                        price = correctedPrice;
                    } else {
                        console.log(`[PRICE VALIDATION] Cannot verify price for ${upg.name}, skipping for safety`);
                        return; // Skip this upgrade if we can't verify the price
                    }
                }

                const tta = Math.max(0, (price - bank) / (cps || 1));
                let payback = price / delta;
                if (upg.name.includes('Kitten')) payback *= 0.01;
                else if (upg.name.includes('Synergy')) payback *= 0.5;
                candidates.push({ type: 'upgrade', id: upg.id, name: upg.name, price, score: payback + tta, tta });
            });
            candidates.sort((a, b) => a.score - b.score);
            return candidates.length > 0 ? candidates[0] : null;
        }
    };

    const Overlay = {
        init: () => {
            if (document.getElementById('cookie-bot-overlay')) return;
            const css = `#cookie-bot-overlay{position:fixed;bottom:10px;right:10px;width:300px;background:rgba(0,0,0,0.9);color:#0f0;border:1px solid #0f0;border-radius:8px;font-family:monospace;font-size:12px;z-index:1000000;display:flex;flex-direction:column}#bot-header{display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #005500}#bot-content{padding:10px;display:flex;flex-direction:column;gap:5px}#bot-logs{height:120px;overflow-y:auto;border-top:1px solid #005500;font-size:10px;color:#aaa}.bot-btn{background:#000;color:#0f0;border:1px solid #0f0;cursor:pointer;font-size:10px;padding:2px 5px}`;
            const style = document.createElement('style'); style.innerText = css; document.head.appendChild(style);
            const div = document.createElement('div'); div.id = 'cookie-bot-overlay';
            div.innerHTML = `<div id="bot-header"><strong>Omniscient V5</strong><div><button id="bot-stop-btn" class="bot-btn">STOP</button></div></div><div id="bot-content"><div>Target: <span id="stat-target">...</span></div><div>State: <span id="stat-state">Active</span></div><div id="bot-logs"></div></div>`;
            document.body.appendChild(div);
            Overlay.logContainer = document.getElementById('bot-logs');
            document.getElementById('bot-stop-btn').onclick = () => bot.stop();
        },
        log: (msg) => {
            const entry = document.createElement('div'); entry.innerText = `[${new Date().toLocaleTimeString().split(' ')[0]}] ${msg}`;
            Overlay.logContainer.prepend(entry);
            if (Overlay.logContainer.children.length > 50) Overlay.logContainer.lastChild.remove();
        },
        update: (target) => {
            document.getElementById('stat-target').innerText = target ? `${target.name} (${Math.ceil(target.tta)}s)` : "None";
        }
    };

    const bot = {
        lastTargetId: null,
        targetAttemptCount: 0,
        blacklist: new Set(),
        start: () => {
            Overlay.init(); Learning.init();
            bot.clickId = setInterval(() => {
                try {
                    GameBridge.clickBigCookie();
                    GameBridge.getShimmers().forEach(s => GameBridge.clickShimmer(s));
                    GameBridge.clickTicker();
                } catch (e) { console.error("Click error", e); }
            }, 50);
            bot.logicId = setInterval(() => {
                try {
                    if (!GameBridge.isReady() || GameBridge.getAscensionMode()) { AscensionManager.tick(); return; }
                    Intelligence.tick(); GodzamokManager.tick(); DragonManager.tick();
                    GardenManager.tick(); StockManager.tick(); PantheonManager.tick();
                    LumpManager.tick(); AscensionManager.tick();
                } catch (e) { console.error("Logic error", e); }

                let target = Optimizer.recommendNextPurchase();

                // Debug: Log what the optimizer is recommending
                if (target) {
                    console.log(`[DEBUG] Optimizer recommends: ${target.name} (${target.type}) - Price: ${target.price}, Score: ${target.score}`);
                } else {
                    console.log('[DEBUG] Optimizer returned no recommendation');
                }

                // Stuck Detection & Blacklisting
                if (target && bot.blacklist.has(target.id)) {
                    console.log(`[DEBUG] ${target.name} is blacklisted, finding alternative...`);
                    // Find next best alternative by temporarily removing blacklisted item
                    bot.blacklist.delete(target.id);
                    const alternativeTarget = Optimizer.recommendNextPurchase();
                    if (alternativeTarget && alternativeTarget.id !== target.id) {
                        target = alternativeTarget;
                        console.log(`[DEBUG] Found alternative: ${target.name}`);
                    } else {
                        target = null;
                        console.log('[DEBUG] No alternative found');
                    }
                    bot.blacklist.add(target.id); // Restore blacklist
                }

                if (target && GameBridge.getCookies() >= target.price) {
                    const pre = GameBridge.getCpsRaw();
                    let purchaseSuccessful = false;

                    if (target.type === 'building') {
                        GameBridge.buyBuilding(target.id);
                        Learning.reportOutcome(target.id, (GameBridge.getObjects()[target.id].storedCps * Game.globalCpsMult), GameBridge.getCpsRaw() - pre);
                        purchaseSuccessful = true;
                    } else {
                        // More robust purchase for upgrades with error handling
                        const upg = Game.UpgradesById[target.id];
                        if (upg && !upg.bought) {
                            try {
                                upg.buy(1);
                                purchaseSuccessful = true;
                            } catch (e) {
                                console.log(`Failed to buy upgrade ${target.name}:`, e);
                                purchaseSuccessful = false;
                            }
                        }
                    }

                    if (purchaseSuccessful) {
                        if (target.id === bot.lastTargetId) {
                            bot.targetAttemptCount++;
                            if (bot.targetAttemptCount > 5) {
                                Overlay.log(`Blacklisting stuck item: ${target.name}`);
                                bot.blacklist.add(target.id);
                            }
                        } else {
                            bot.lastTargetId = target.id;
                            bot.targetAttemptCount = 0;
                            Overlay.log(`Bought ${target.name}`);
                        }
                    } else {
                        // Immediately blacklist items that can't be purchased
                        Overlay.log(`Cannot purchase ${target.name}, blacklisting`);
                        bot.blacklist.add(target.id);
                    }
                }
                Overlay.update(target);
            }, 1000);
        },
        stop: () => { clearInterval(bot.clickId); clearInterval(bot.logicId); document.getElementById('stat-state').innerText = "STOPPED"; }
    };

    const checkReady = setInterval(() => { if (typeof Game !== 'undefined' && Game.ready) { clearInterval(checkReady); bot.start(); } }, 1000);
})();
