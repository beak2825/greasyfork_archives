// ==UserScript==
// @name         Cookie Clicker Bot
// @namespace    https://github.com/SmartCookie/Optimizer
// @version      2.0
// @description  Omniscient Bot V2: Perfect Simulation-Based Optimization, Auto-Stock Trading, Garden Auto-Planting, Pantheon Management, and Advanced Combo Stacking.
// @author       OptimizerBot
// @match        https://orteil.dashnet.org/cookieclicker/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562050/Cookie%20Clicker%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/562050/Cookie%20Clicker%20Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Waiting for Game Load
    const checkReady = setInterval(() => {
        if (typeof Game !== 'undefined' && Game.ready) {
            clearInterval(checkReady);
            startBot();
        }
    }, 1000);

    function startBot() {
        console.log("Cookie Bot V2.0 (Omniscient) Started");

        // --- 1. GameBridge ---
        const GameBridge = {
            isReady: () => typeof Game !== 'undefined' && Game.ready,
            getCps: () => Game.cookiesPs,
            getCpsRaw: () => Game.cookiesPsRaw,
            getCookies: () => Game.cookies,
            getObjects: () => Game.ObjectsById,
            getUpgrades: () => Game.UpgradesInStore,
            buyBuilding: (id) => {
                const obj = Game.ObjectsById[id];
                if (obj) obj.buy(1);
            },
            buyUpgrade: (id) => {
                const upg = Game.UpgradesById[id];
                if (upg) upg.buy();
            },
            clickBigCookie: () => {
                if (Game.ClickCookie) Game.ClickCookie();
            },
            getShimmers: () => Game.shimmers,
            clickShimmer: (shimmer) => {
                if (shimmer && shimmer.pop) shimmer.pop();
            },
            getAscensionMode: () => Game.AscendTimer > 0 || Game.OnAscend,
            getPrestige: () => Game.prestige,
            getHeavenlyChips: () => Game.heavenlyChips,
            ascend: () => {
                if (!Game.OnAscend && Game.AscendTimer === 0) Game.Ascend(1);
            },
            reincarnate: () => {
                if (Game.OnAscend) Game.Reincarnate(1);
            },
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
            sellBuilding: (id, amount) => {
                const obj = Game.ObjectsById[id];
                if (obj) obj.sell(amount);
            },
            getDragonLevel: () => Game.dragonLevel,
            setDragonAura: (slot, auraId) => {
                if (slot === 0) Game.dragonAura = auraId;
                if (slot === 1) Game.dragonAura2 = auraId;
                Game.recalculateGains = 1;
            },
            getSeason: () => Game.season,
            setSeason: (season) => {
                if (Game.Upgrades[season] && Game.Upgrades[season].buy) Game.Upgrades[season].buy();
            },
            getSantaLevel: () => Game.santaLevel,
            upgradeSanta: () => Game.UpgradeSanta(),
            getWrinklers: () => Game.wrinklers,
            popWrinkler: (id) => {
                if (Game.wrinklers[id] && Game.wrinklers[id].close >= 1) Game.wrinklers[id].click();
            },
            getGarden: () => {
                if (Game.Objects['Farm'].minigameLoaded) return Game.Objects['Farm'].minigame;
                return null;
            },
            harvestPlant: (y, x) => {
                const garden = GameBridge.getGarden();
                if (garden) garden.harvest(x, y);
            },
            plantSeed: (seedId, y, x) => {
                const garden = GameBridge.getGarden();
                if (garden) garden.useTool(seedId, x, y);
            },
            getLumps: () => Game.lumps,
            levelUp: (id) => {
                const obj = Game.ObjectsById[id];
                if (obj && obj.levelUp) obj.levelUp();
            },
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
            clickTicker: () => {
                if (Game.TickerEffect && Game.TickerEffect.type === 'fortune') {
                    Game.tickerL.click();
                }
            },
            setGoldenSwitch: (state) => {
                const upg = Game.Upgrades['Golden switch'];
                if (upg && upg.bought && !!Game.Has('Golden switch') !== state) upg.click();
            },
            setShimmeringVeil: (state) => {
                const upg = Game.Upgrades['Shimmering veil [off]'] || Game.Upgrades['Shimmering veil [on]'];
                if (upg && upg.bought && !!Game.Has('Shimmering veil') !== state) upg.click();
            }
        };

        // --- 2. Brain Modules ---

        // Learning (ACE 2.0)
        const Learning = {
            weights: {},
            learningRate: 0.15,
            init: () => {
                const data = localStorage.getItem('CookieBot_ACE_Weights');
                if (data) {
                    try { Learning.weights = JSON.parse(data); } catch (e) { }
                }
            },
            save: () => localStorage.setItem('CookieBot_ACE_Weights', JSON.stringify(Learning.weights)),
            getCorrection: (id) => Learning.weights[id] || 1.0,
            reportOutcome: (id, expected, actual) => {
                if (expected <= 0) return;
                let factor = actual / expected;
                if (factor <= 0 || factor > 50) return;
                const oldW = Learning.weights[id] || 1.0;
                const newW = oldW + Learning.learningRate * (factor - oldW);
                Learning.weights[id] = newW;
                Learning.save();
                Overlay.log(`ACE: ${id} weight ${oldW.toFixed(2)}->${newW.toFixed(2)}`);
            }
        };
        Learning.init();

        // Intelligence (Spells & Combos)
        const Intelligence = {
            tick: () => {
                if (!GameBridge.isReady()) return;
                const grimoire = GameBridge.getGrimoire();
                if (!grimoire) return;

                const maxMagic = grimoire.maxMagic;
                const currentMagic = grimoire.magic;
                const buffs = GameBridge.getBuffs();
                let hasFrenzy = false;
                let hasClickFrenzy = false;

                for (let i in buffs) {
                    if (buffs[i].name === 'Frenzy') hasFrenzy = true;
                    if (buffs[i].name === 'Click frenzy') hasClickFrenzy = true;
                }

                if (hasFrenzy && !hasClickFrenzy) {
                    const cost = 10 + (maxMagic * 0.6);
                    if (currentMagic >= cost) {
                        Overlay.log("Grimoire: Casting FtHoF");
                        GameBridge.castSpell('hand of fate');
                    }
                }
            }
        };

        // Godzamok
        const GodzamokManager = {
            isActive: false,
            sacrificeTargetNames: ['Farm', 'Mine', 'Factory', 'Bank', 'Temple', 'Shipment', 'Alchemy lab'],
            tick: () => {
                if (!GameBridge.isReady()) return;
                const buffs = GameBridge.getBuffs();
                let hasClickFrenzy = false;
                let hasDragonflight = false;
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
                for (let id in objects) {
                    const obj = objects[id];
                    if (GodzamokManager.sacrificeTargetNames.includes(obj.name)) {
                        const keep = 100;
                        const toSell = obj.amount - keep;
                        if (toSell > 0) GameBridge.sellBuilding(obj.id, toSell);
                    }
                }
                GodzamokManager.isActive = true;
            }
        };

        // Dragon
        const DragonManager = {
            _currentAura: null,
            tick: () => {
                if (!GameBridge.isReady()) return;
                const level = GameBridge.getDragonLevel();
                if (level < 15) return;
                const buffs = GameBridge.getBuffs();
                let hasClickFrenzy = false;
                for (let i in buffs) if (buffs[i].name === 'Click frenzy') hasClickFrenzy = true;

                if (hasClickFrenzy) {
                    if (DragonManager._currentAura !== 5) {
                        GameBridge.setDragonAura(0, 5); // Earth Shatterer
                        DragonManager._currentAura = 5;
                        Overlay.log("Dragon: Swapped to Earth Shatterer");
                    }
                } else {
                    if (DragonManager._currentAura !== 15) {
                        GameBridge.setDragonAura(0, 15); // Radiant Appetite
                        DragonManager._currentAura = 15;
                        Overlay.log("Dragon: Swapped to Radiant Appetite");
                    }
                }
            }
        };

        // Season & Santa
        const SeasonManager = {
            tick: () => {
                if (GameBridge.getSantaLevel() < 14) GameBridge.upgradeSanta();
                if (GameBridge.getSeason() !== 'christmas') GameBridge.setSeason('festive biscuit');
            }
        };

        // Garden
        const GardenManager = {
            tick: () => {
                const garden = GameBridge.getGarden();
                if (!garden) return;
                for (let y = 0; y < 6; y++) {
                    for (let x = 0; x < 6; x++) {
                        const tile = garden.plot[y][x];
                        if (tile[0] > 0) {
                            const plantData = garden.plantsById[tile[0] - 1];
                            if (tile[1] >= plantData.mature) {
                                GameBridge.harvestPlant(y, x);
                                Overlay.log(`Garden: Harvested ${plantData.name}`);
                            }
                        } else {
                            const whiskerbloom = garden.plants['whiskerbloom'];
                            if (whiskerbloom && whiskerbloom.unlocked) GameBridge.plantSeed(whiskerbloom.id, y, x);
                        }
                    }
                }
            }
        };

        // Stock Market
        const StockManager = {
            tick: () => {
                const market = GameBridge.getStocks();
                if (!market) return;
                market.goodsById.forEach(good => {
                    const price = good.val;
                    const maxStock = market.getGoodMaxStock(good);
                    if (price < 7 && good.stock < maxStock) {
                        market.buyGood(good.id, maxStock - good.stock);
                        Overlay.log(`Stocks: Buying ${good.name} at $${price.toFixed(2)}`);
                    }
                    if (price > 90 && good.stock > 0) {
                        market.sellGood(good.id, good.stock);
                        Overlay.log(`Stocks: Selling ${good.name} at $${price.toFixed(2)}`);
                    }
                });
            }
        };

        // Pantheon
        const PantheonManager = {
            tick: () => {
                const pantheon = GameBridge.getPantheon();
                if (!pantheon || pantheon.swaps <= 0) return;
                const spirits = { godzamok: 0, mokalsium: 2, muridal: 4 };
                if (pantheon.slot[0] !== spirits.godzamok) {
                    pantheon.dragSpirit(pantheon.spirits['godzamok'], 0);
                    Overlay.log("Pantheon: Slotting Godzamok");
                } else if (pantheon.slot[1] !== spirits.mokalsium) {
                    pantheon.dragSpirit(pantheon.spirits['mokalsium'], 1);
                    Overlay.log("Pantheon: Slotting Mokalsium");
                }
            }
        };

        // Combo Manager
        const ComboManager = {
            _active: false,
            tick: () => {
                const buffs = GameBridge.getBuffs();
                let hasClickFrenzy = false;
                let hasFrenzy = false;
                for (let i in buffs) {
                    if (buffs[i].name === 'Click frenzy') hasClickFrenzy = true;
                    if (buffs[i].name === 'Frenzy') hasFrenzy = true;
                }
                if (hasClickFrenzy && hasFrenzy) {
                    GameBridge.setGoldenSwitch(true);
                    GameBridge.setShimmeringVeil(true);
                    if (!ComboManager._active) {
                        Overlay.log("Combos: MEGA COMBO! Toggling Switches.");
                        ComboManager._active = true;
                    }
                } else if (ComboManager._active && !hasClickFrenzy) {
                    GameBridge.setGoldenSwitch(false);
                    Overlay.log("Combos: Combo ended.");
                    ComboManager._active = false;
                }
            }
        };

        // Lump Manager
        const LumpManager = {
            tick: () => {
                const lumps = GameBridge.getLumps();
                if (lumps <= 0) return;
                const buildings = ['Wizard tower', 'Temple', 'Farm', 'Bank'];
                for (let name of buildings) {
                    const obj = Game.Objects[name];
                    if (obj && obj.level === 0) {
                        Overlay.log(`Lumps: Unlocking ${name}`);
                        GameBridge.levelUp(obj.id);
                        return;
                    }
                }
                if (lumps >= 100) {
                    const farm = Game.Objects['Farm'];
                    if (farm && farm.level < 10) {
                        Overlay.log("Lumps: Expanding Garden");
                        GameBridge.levelUp(farm.id);
                    }
                }
            }
        };

        // Wrinklers
        const WrinklerManager = {
            tick: () => {
                if (GameBridge.getAscensionMode()) {
                    const wrinklers = GameBridge.getWrinklers();
                    wrinklers.forEach((w, id) => { if (w.close >= 1) GameBridge.popWrinkler(id); });
                }
            }
        };

        // Ascension
        const AscensionManager = {
            targets: { firstRun: 365 },
            tick: () => {
                if (!GameBridge.isReady()) return;
                if (GameBridge.getAscensionMode()) {
                    setTimeout(() => { GameBridge.reincarnate(); }, 5000);
                    return;
                }
                const chipsOwned = GameBridge.getHeavenlyChips();
                const prestigeNow = Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset);
                if (chipsOwned === 0) {
                    if (prestigeNow >= AscensionManager.targets.firstRun) GameBridge.ascend();
                } else {
                    if (prestigeNow > (chipsOwned * 0.5)) GameBridge.ascend();
                }
            }
        };

        // Optimizer
        const Optimizer = {
            simulateGain: (type, id) => {
                if (!GameBridge.isReady()) return 0;
                const originalCps = Game.cookiesPsRaw;
                let gain = 0;
                if (type === 'building') {
                    const obj = Game.ObjectsById[id];
                    obj.amount++; Game.CalculateGains();
                    gain = Game.cookiesPsRaw - originalCps;
                    obj.amount--;
                } else if (type === 'upgrade') {
                    const upg = Game.UpgradesById[id];
                    const old = upg.bought; upg.bought = 1;
                    Game.CalculateGains();
                    gain = Game.cookiesPsRaw - originalCps;
                    upg.bought = old;
                }
                Game.CalculateGains();
                return Math.max(0.1, gain);
            },
            recommendNextPurchase: () => {
                if (!GameBridge.isReady()) return null;
                const candidates = [];
                const cps = GameBridge.getCps();
                const bank = GameBridge.getCookies();
                GameBridge.getObjects().forEach(obj => {
                    if (obj.locked) return;
                    const deltaCps = Optimizer.simulateGain('building', obj.id);
                    const price = obj.price;
                    const tta = Math.max(0, (price - bank) / (cps || 1));
                    let payback = price / deltaCps;
                    const qty = obj.amount;
                    if (qty < 100 && (qty % 50) >= 45) payback *= 0.5;
                    else if (qty >= 100 && (qty % 50) >= 48) payback *= 0.7;
                    candidates.push({ type: 'building', id: obj.id, name: obj.name, price: price, tta: tta, score: payback + tta });
                });
                GameBridge.getUpgrades().forEach(upg => {
                    if (upg.locked) return;
                    const deltaCps = Optimizer.simulateGain('upgrade', upg.id);
                    const price = upg.basePrice;
                    const tta = Math.max(0, (price - bank) / (cps || 1));
                    const payback = price / deltaCps;
                    candidates.push({ type: 'upgrade', id: upg.id, name: upg.name, price: price, tta: tta, score: payback + tta });
                });
                candidates.sort((a, b) => a.score - b.score);
                return candidates[0];
            }
        };

        // Overlay & Controller
        const Overlay = {
            element: null,
            content: null,
            logContainer: null,
            minimized: false,
            init: () => {
                if (document.getElementById('cookie-bot-overlay')) return;
                const css = `
                    #cookie-bot-overlay {
                        position: fixed; bottom: 10px; right: 10px;
                        width: 300px;
                        background: rgba(0, 0, 0, 0.9);
                        color: #0f0;
                        border: 1px solid #0f0;
                        border-radius: 8px;
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        z-index: 1000000;
                        box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
                        display: flex; flex-direction: column;
                    }
                    #bot-header {
                        display: flex; justify-content: space-between; align-items: center;
                        padding: 8px 12px;
                        border-bottom: 1px solid #005500;
                        background: rgba(0, 20, 0, 0.5);
                        border-radius: 8px 8px 0 0;
                    }
                    #bot-content { padding: 10px; display: flex; flex-direction: column; gap: 8px; }
                    #bot-logs {
                        height: 120px; overflow-y: auto;
                        border-top: 1px solid #005500; padding-top: 5px; margin-top: 5px;
                        font-size: 10px; color: #aaa;
                    }
                    .log-entry { margin-bottom: 2px; }
                    .log-time { color: #666; margin-right: 4px; }
                    button.bot-btn {
                        background: #000; color: #0f0; border: 1px solid #0f0;
                        cursor: pointer; font-family: inherit; font-size: 10px;
                        padding: 2px 6px; margin-left: 5px;
                    }
                    button.bot-btn:hover { background: #002200; }
                    button.bot-btn.stop { border-color: #f00; color: #f00; }
                    #bot-logs::-webkit-scrollbar { width: 5px; }
                    #bot-logs::-webkit-scrollbar-thumb { background: #005500; }
                `;
                const style = document.createElement('style');
                style.innerText = css;
                document.head.appendChild(style);
                const div = document.createElement('div');
                div.id = 'cookie-bot-overlay';
                div.innerHTML = `
                    <div id="bot-header">
                        <strong>Omniscient V2.0</strong>
                        <div>
                            <button id="bot-min-btn" class="bot-btn">_</button>
                            <button id="bot-stop-btn" class="bot-btn stop">STOP</button>
                        </div>
                    </div>
                    <div id="bot-content">
                        <div id="bot-stats">
                            <div>Target: <span id="stat-target">...</span></div>
                            <div>State: <span id="stat-state">Initializing</span></div>
                            <div id="stat-extra" style="font-size:10px; color:#aaa; margin-top:4px;"></div>
                        </div>
                        <div id="bot-logs"></div>
                    </div>
                `;
                document.body.appendChild(div);
                Overlay.element = div;
                Overlay.content = document.getElementById('bot-content');
                Overlay.logContainer = document.getElementById('bot-logs');
                document.getElementById('bot-min-btn').onclick = Overlay.toggleMinimize;
                document.getElementById('bot-stop-btn').addEventListener('click', () => bot.stop());
            },
            toggleMinimize: () => {
                Overlay.minimized = !Overlay.minimized;
                Overlay.content.style.display = Overlay.minimized ? 'none' : 'flex';
                document.getElementById('bot-min-btn').innerText = Overlay.minimized ? '+' : '_';
            },
            log: (msg) => {
                if (!Overlay.logContainer) return;
                const entry = document.createElement('div');
                entry.className = 'log-entry';
                const time = new Date().toLocaleTimeString().split(' ')[0];
                entry.innerHTML = `<span class="log-time">[${time}]</span> ${msg}`;
                Overlay.logContainer.prepend(entry);
                if (Overlay.logContainer.children.length > 50) Overlay.logContainer.lastChild.remove();
            },
            update: (status) => {
                if (!Overlay.element) Overlay.init();
                if (Overlay.minimized) return;
                const targetEl = document.getElementById('stat-target');
                const stateEl = document.getElementById('stat-state');
                const extraEl = document.getElementById('stat-extra');
                if (status.target) targetEl.innerText = `${status.target.name} (${Math.ceil(status.target.tta)}s)`;
                else targetEl.innerText = "None / Saving";
                stateEl.innerHTML = status.isRunning ? "Active" : "STOPPED";
                stateEl.style.color = status.isRunning ? "#0f0" : "#f00";
                const grimoire = GameBridge.getGrimoire();
                const mana = grimoire ? `${Math.floor(grimoire.magic)}/${Math.floor(grimoire.maxMagic)}` : "N/A";
                const prestige = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));
                extraEl.innerHTML = `Magic: ${mana} | Ascend: ${prestige}`;
            }
        };

        const bot = {
            isRunning: false,
            start: () => {
                bot.isRunning = true;
                Overlay.init();
                bot.clickId = setInterval(() => {
                    GameBridge.clickBigCookie();
                    GameBridge.getShimmers().forEach(s => GameBridge.clickShimmer(s));
                    GameBridge.clickTicker();
                }, 50);
                bot.logicId = setInterval(() => {
                    Intelligence.tick(); GodzamokManager.tick(); DragonManager.tick();
                    SeasonManager.tick(); GardenManager.tick(); LumpManager.tick();
                    StockManager.tick(); PantheonManager.tick(); ComboManager.tick();
                    WrinklerManager.tick(); AscensionManager.tick();
                    if (!GameBridge.getAscensionMode()) {
                        const target = Optimizer.recommendNextPurchase();
                        if (target && GameBridge.getCookies() >= target.price) {
                            const preCps = GameBridge.getCpsRaw();
                            const bCount = Object.keys(GameBridge.getBuffs()).length;
                            if (target.type === 'building') {
                                Overlay.log(`Buying ${target.name}`);
                                GameBridge.buyBuilding(target.id);
                                const postCps = GameBridge.getCpsRaw();
                                if (bCount === Object.keys(GameBridge.getBuffs()).length) {
                                    const obj = GameBridge.getObjects()[target.id];
                                    let exp = (typeof obj.cps === 'function') ? obj.cps(obj) : (obj.storedCps * Game.globalCpsMult);
                                    Learning.reportOutcome(target.id, exp, postCps - preCps);
                                }
                            } else GameBridge.buyUpgrade(target.id);
                        }
                        Overlay.update({ target: target, isRunning: true });
                    }
                }, 1000);
            },
            stop: () => {
                bot.isRunning = false;
                clearInterval(bot.clickId); clearInterval(bot.logicId);
                document.getElementById('stat-state').innerText = "STOPPED";
                document.getElementById('stat-state').style.color = "#f00";
            }
        };
        window.CookieBot = bot; bot.start();
    }
})();
