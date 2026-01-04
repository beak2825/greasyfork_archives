// ==UserScript==
// @name         OGLight-Bot-Old
// @version      5.2.6
// @description  OGLight script for OGame
// @author       Oz
// @license      MIT
// @copyright    2019, Oz

// @match        http://212.195.47.38:8080/bots/*/browser/*
// @match        http://192.168.1.88:8080/bots/*/browser/*
// @match        http://5.49.35.107:16387/bots/*/browser/*
// @match        http://79.87.64.111:8080/bots/*/browser/*
// @match        http://87.64.122.4:3005/bots/*/browser/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getTab
// @grant        GM_saveTab
// @run-at       document-start
// @namespace https://greasyfork.org/users/1501974
// @downloadURL https://update.greasyfork.org/scripts/555940/OGLight-Bot-Old.user.js
// @updateURL https://update.greasyfork.org/scripts/555940/OGLight-Bot-Old.meta.js
// ==/UserScript==

const universeUrl = document.querySelector('head meta[name="ogame-universe"]')?.getAttribute("content");
const universeId = universeUrl.split('-')[0].replace('s', "");

crypto.randomUUID = function randomUUID() {
    return (
        [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
            c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
};

if (!window.location.pathname.includes('html')) return;

document.cookie["prsess_" + window.location.host.replace(/\D/g, "") + "=" + crypto.randomUUID() + "; path=/; domain=" + window.location.host.split(".").slice(-2).join(".")];

let oglRedirection = localStorage.getItem("ogl-redirect");

function goodbyeTipped() {
    if ("undefined" != typeof Tipped) for (var [key] of Object.entries(Tipped)) Tipped[key] = function () {
        return !1;
    }; else requestAnimationFrame(() => goodbyeTipped());
}

-1 < oglRedirection?.indexOf("http") && (void 0 !== window?.GM_addStyle && GM_addStyle(`
            body { background:#000 !important; }
            body * { display:none !important; }
        `), setTimeout(() => window.location.replace(oglRedirection)), localStorage.setItem("ogl-redirect", !1)),
    goodbyeTipped(), unsafeWindow?.ogl && (unsafeWindow.ogl = null);

let updateOGLBody = () => {
    document.body.setAttribute("data-minipics", localStorage.getItem("ogl_minipics") || !1),
        document.body.setAttribute("data-menulayout", localStorage.getItem("ogl_menulayout") || 0),
        document.body.setAttribute("data-colorblind", localStorage.getItem("ogl_colorblind") || !1);
}, betaVersion = (document.body ? updateOGLBody() : new MutationObserver(function () {
    document.body && (updateOGLBody(), this.disconnect());
}).observe(document, {
    childList: !0
}), "-b36"), oglVersion = "5.2.2";

void 0 === window?.GM_getTab && (window.GM_getTab = tab => {
    tab(JSON.parse(GM_getValue("ogl_tab") || "{}"));
}), void 0 === window?.GM_saveTab && (window.GM_saveTab = data => {
    GM_setValue("ogl_tab", JSON.stringify(data || {}));
}), void 0 === window?.GM_addStyle && (window.GM_addStyle = css => {
    var style = document.createElement("style");
    style.setAttribute("type", "text/css"), style.textContent = css, document.head.appendChild(style);
}), void 0 === window?.GM_info && (window.GM_info = {}, window.GM_info.script = {},
    window.GM_info.script.name = "OGLight IOS", window.GM_info.script.version = oglVersion,
    window.GM_info.script.downloadURL = "http://openuserjs.org/install/nullNaN/OGLight.user.js"),
    void 0 === window?.GM_xmlhttpRequest && (window.GM_xmlhttpRequest = () => { });

class OGLight {
    constructor(params) {

        this.DBName = window.location.pathname.replaceAll('/', ''),
            this.db = this.load(), !GM_getValue(this.DBName) && GM_getValue(window.location.host) && (GM_setValue(this.DBName, GM_getValue(window.location.host)),
                GM_deleteValue(window.location.host), window.location.reload()), this.db.lastServerUpdate = this.db.lastServerUpdate || 0,
            this.db.lastEmpireUpdate = this.db.lastEmpireUpdate || 0, this.db.lastLFBonusUpdate = this.db.lastLFBonusUpdate || 0,
            this.db.lastProductionQueueUpdate = this.db.lastProductionQueueUpdate || 0,
            this.db.udb = this.db.udb || {}, this.db.pdb = this.db.pdb || {}, this.db.tdb = this.db.tdb || {},
            this.db.myPlanets = this.db.myPlanets || {}, this.db.dataFormat = this.db.dataFormat || 0,
            this.db.tags = 13 == Object.keys(this.db.tags || {}).length ? this.db.tags : {
                red: !0,
                orange: !0,
                yellow: !0,
                lime: !0,
                green: !0,
                blue: !0,
                dblue: !0,
                violet: !0,
                magenta: !0,
                pink: !0,
                brown: !0,
                gray: !0,
                none: !1
            }, this.db.lastPinTab = this.db.lastPinTab || "miner", this.db.shipsCapacity = this.db.shipsCapacity || {},
            this.db.spytableSort = this.db.spytableSort || "total", this.db.lastTaggedInput = this.db.lastTaggedInput || [],
            this.db.lastPinnedList = this.db.lastPinnedList || [], this.db.initialTime = this.db.initialTime || Date.now(),
            this.db.fleetLimiter = this.db.fleetLimiter || {
                data: {},
                jumpgateData: {},
                shipActive: !1,
                resourceActive: !1,
                jumpgateActive: !1
            }, this.db.keepEnoughCapacityShip = this.db.keepEnoughCapacityShip || 200,
            this.db.keepEnoughCapacityShipJumpgate = this.db.keepEnoughCapacityShipJumpgate || 200,
            this.db.spyProbesCount = this.db.spyProbesCount || 6, this.db.configState = this.db.configState || {
                fleet: !0,
                general: !0,
                expeditions: !0,
                stats: !0,
                messages: !0,
                data: !0,
                PTRE: !0,
                interface: !0
            }, this.db.options = this.db.options || {}, this.db.options.defaultShip = this.db.options.defaultShip || 202,
            this.db.options.defaultMission = this.db.options.defaultMission || 3, this.db.options.resourceTreshold = this.db.options.resourceTreshold || 3e5,
            this.db.options.ignoreConsumption = this.db.options.ignoreConsumption || !1,
            this.db.options.ignoreExpeShipsLoss = this.db.options.ignoreExpeShipsLoss || !1,
            this.db.options.useClientTime = this.db.options.useClientTime || !1, this.db.options.displayMiniStats = void 0 !== this.db.options.displayMiniStats ? this.db.options.displayMiniStats : "day",
            this.db.options.collectLinked = this.db.options.collectLinked || !1, this.db.options.expeditionValue = this.db.options.expeditionValue || 0,
            this.db.options.expeditionBigShips = this.db.options.expeditionBigShips || [204, 205, 206, 207, 215],
            this.db.options.expeditionRandomSystem = this.db.options.expeditionRandomSystem || 0,
            this.db.options.expeditionRedirect = this.db.options.expeditionRedirect || !1,
            this.db.options.expeditionShipRatio = Math.min(this.db.options.expeditionShipRatio, 100),
            this.db.options.displayPlanetTimers = !1 !== this.db.options.displayPlanetTimers,
            this.db.options.reduceLargeImages = this.db.options.reduceLargeImages || !1,
            this.db.options.colorblindMode = this.db.options.colorblindMode || !1, this.db.options.showMenuResources = this.db.options.showMenuResources || 0,
            this.db.options.autoCleanReports = this.db.options.autoCleanReports || !1,
            this.db.options.tooltipDelay = !1 !== this.db.options.tooltipDelay ? Math.max(this.db.options.tooltipDelay, 100) : 400,
            this.db.options.spyIndicatorDelay = this.db.options.spyIndicatorDelay || 36e5,
            this.db.options.debugMode = this.db.options.debugMode || !1, this.db.options.sim = this.db.options.sim || !1,
            this.db.options.boardTab = !1 !== this.db.options.boardTab, this.db.options.msu = this.db.options.msu || "3:2:1",
            this.db.options.disablePlanetTooltips = this.db.options.disablePlanetTooltips || !1,
            this.db.options.displaySpyTable = !1 !== this.db.options.displaySpyTable,
            this.db.options.shortcutsOnRight = this.db.options.shortcutsOnRight || !1,
            this.db.options.sidePanelOnLeft = this.db.options.sidePanelOnLeft || !1,
            this.db.options.keyboardActions = this.db.options.keyboardActions || {},
            this.db.options.keyboardActions.menu = this.db.options.keyboardActions.menu || "²",
            this.db.options.keyboardActions.previousPlanet = this.db.options.keyboardActions.previousPlanet || "i",
            this.db.options.keyboardActions.nextPlanet = this.db.options.keyboardActions.nextPlanet || "o",
            this.db.options.keyboardActions.nextPinnedPosition = this.db.options.keyboardActions.nextPinnedPosition || "m",
            this.db.options.keyboardActions.fleetRepeat = this.db.options.keyboardActions.fleetRepeat || "p",
            this.db.options.keyboardActions.fleetSelectAll = this.db.options.keyboardActions.fleetSelectAll || "a",
            this.db.options.keyboardActions.fleetReverseAll = this.db.options.keyboardActions.fleetReverseAll || "r",
            this.db.options.keyboardActions.fleetQuickCollect = this.db.options.keyboardActions.fleetQuickCollect || "q",
            this.db.options.keyboardActions.expeditionSC = this.db.options.keyboardActions.expeditionSC || "s",
            this.db.options.keyboardActions.expeditionLC = this.db.options.keyboardActions.expeditionLC || "l",
            this.db.options.keyboardActions.expeditionPF = this.db.options.keyboardActions.expeditionPF || "f",
            this.db.options.keyboardActions.quickRaid = this.db.options.keyboardActions.quickRaid || "t",
            this.db.options.keyboardActions.fleetResourcesSplit = this.db.options.keyboardActions.fleetResourcesSplit || "2-9",
            this.db.options.keyboardActions.galaxyUp = this.db.options.keyboardActions.galaxyUp || ("fr" == window.location.host.split(/[-.]/)[1] ? "z" : "w"),
            this.db.options.keyboardActions.galaxyLeft = this.db.options.keyboardActions.galaxyLeft || ("fr" == window.location.host.split(/[-.]/)[1] ? "q" : "a"),
            this.db.options.keyboardActions.galaxyDown = this.db.options.keyboardActions.galaxyDown || "s",
            this.db.options.keyboardActions.galaxyRight = this.db.options.keyboardActions.galaxyRight || "d",
            this.db.options.keyboardActions.galaxyReload = this.db.options.keyboardActions.galaxyReload || "f",
            this.db.options.keyboardActions.galaxySpySystem = this.db.options.keyboardActions.galaxySpySystem || "r",
            this.db.options.keyboardActions.backFirstFleet = this.db.options.keyboardActions.backFirstFleet || "f",
            this.db.options.keyboardActions.backLastFleet = this.db.options.keyboardActions.backLastFleet || "l",
            this.db.options.keyboardActions.discovery = this.db.options.keyboardActions.discovery || "u",
            this.db.options.keyboardActions.showMenuResources = this.db.options.keyboardActions.showMenuResources || "v",
            "loading" !== document.readyState ? this.init(params.cache) : document.onreadystatechange = () => {
                "loading" === document.readyState || this.isReady || (this.isReady = !0,
                    this.init(params.cache));
            };
    }
    init(cache) {
        document.body.classList.add("oglight"), this.db.options.showMenuResources && CSSManager.miniMenu(this.db.options.showMenuResources),
            this.db.options.reduceLargeImages && CSSManager.miniImage(this.db.options.reduceLargeImages),
            CSSManager.sidePanelLeft(this.db.options.sidePanelOnLeft), this.id = GM_getValue("ogl_id") || !1,
            this.version = -1 < GM_info.script.version.indexOf("b") ? oglVersion + betaVersion : oglVersion,
            this.tooltipEvent = new Event("tooltip"), this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            this.mode = parseInt(new URLSearchParams(window.location.search).get("oglmode")) || 0,
            this.page = new URL(window.location.href).searchParams.get("component") || new URL(window.location.href).searchParams.get("page"),
            this.resourcesKeys = {
                metal: "metal",
                crystal: "crystal",
                deut: "deuterium",
                food: "food",
                population: "population",
                energy: "energy",
                darkmatter: "darkmatter"
            }, this.shipsList = [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 213, 214, 215, 218, 219],
            this.fretShips = [202, 203, 209, 210, 219], this.ptreKey = localStorage.getItem("ogl-ptreTK") || !1,
            this.planetType = document.querySelector('head meta[name="ogame-planet-type"]').getAttribute("content"),
            this.flagsList = ["friend", "rush", "danger", "skull", "fridge", "star", "trade", "money", "ptre", "none"],
            this.server = {}, this.server.id = window.location.host.replace(/\D/g, ""),
            this.server.name = document.querySelector('head meta[name="ogame-universe-name"]').getAttribute("content"),
            this.server.lang = document.querySelector('head meta[name="ogame-language"]').getAttribute("content"),
            this.server.economySpeed = parseInt(document.querySelector('head meta[name="ogame-universe-speed"]').getAttribute("content")),
            this.server.peacefulFleetSpeed = parseInt(document.querySelector('head meta[name="ogame-universe-speed-fleet-peaceful"]').getAttribute("content")),
            this.server.holdingFleetSpeed = parseInt(document.querySelector('head meta[name="ogame-universe-speed-fleet-holding"]').getAttribute("content")),
            this.server.warFleetSpeed = parseInt(document.querySelector('head meta[name="ogame-universe-speed-fleet-war"]').getAttribute("content")),
            300 == this.server.id && "en" == this.server.lang || (this.account = {},
                this.account.id = document.querySelector('head meta[name="ogame-player-id"]').getAttribute("content"),
                this.account.class = document.querySelector("#characterclass .sprite")?.classList.contains("miner") ? 1 : document.querySelector("#characterclass .sprite")?.classList.contains("warrior") ? 2 : 3,
                this.account.name = document.querySelector('head meta[name="ogame-player-name"]').getAttribute("content"),
                this.account.rank = document.querySelector('#bar a[href*="searchRelId"]')?.parentNode.innerText.replace(/\D/g, ""),
                this.account.lang = 'fr', this.db.serverData = this.db.serverData || {},
                this.db.serverData.serverFullID = this.db.serverData.serverFullID || this.server.id + this.server.lang,
                this.db.serverData.localTimeZoneOffsetInMinutes = 0 !== unsafeWindow.localTimeZoneOffsetInMinutes && (unsafeWindow.localTimeZoneOffsetInMinutes || this.db.serverData.localTimeZoneOffsetInMinutes) || 0,
                this.db.serverData.serverTimeZoneOffsetInMinutes = 0 !== unsafeWindow.serverTimeZoneOffsetInMinutes && (unsafeWindow.serverTimeZoneOffsetInMinutes || this.db.serverData.serverTimeZoneOffsetInMinutes) || 0,
                this.db.serverData.metal = unsafeWindow.loca?.LOCA_ALL_METAL || this.db.serverData.metal || "Metal",
                this.db.serverData.crystal = unsafeWindow.loca?.LOCA_ALL_CRYSTAL || this.db.serverData.crystal || "Crystal",
                this.db.serverData.deut = unsafeWindow.loca?.LOCA_ALL_DEUTERIUM || this.db.serverData.deut || "Deut",
                this.db.serverData.food = unsafeWindow.loca?.LOCA_ALL_FOOD || this.db.serverData.food || "Food",
                this.db.serverData.dm = unsafeWindow.LocalizationStrings?.darkMatter || this.db.serverData.dm || "Darkmatter",
                this.db.serverData.energy = unsafeWindow.resourcesBar?.resources?.energy.tooltip.split("|")[0] || this.db.serverData.energy || "Energy",
                this.db.serverData.conso = unsafeWindow.loca?.LOCA_FLEET_FUEL_CONSUMPTION || this.db.serverData.conso || "Conso",
                this.db.serverData.noob = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_N || this.db.serverData.noob || "n",
                this.db.serverData.vacation = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_U || this.db.serverData.vacation || "v",
                this.db.serverData.inactive = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_I || this.db.serverData.inactive || "i",
                this.db.serverData.inactiveLong = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_I_LONG || this.db.serverData.inactiveLong || "I",
                this.db.serverData.banned = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_G || this.db.serverData.banned || "b",
                this.db.serverData.population = "Population", this.db.serverData.item = "Item",
                this.db.serverData.topScore = this.db.serverData.topScore || 0, this.db.serverData.probeCargo = this.db.serverData.probeCargo || 0,
                this.db.serverData.debrisFactor = this.db.serverData.debrisFactor || 30,
                this.db.serverData.probeCargo || (this.fretShips = [202, 203, 209, 219]),
                this.account.lang != this.db.userLang && "fleetdispatch" != this.page && "intro" != this.page ? window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch` : ("intro" != this.page && (this.db.userLang = this.account.lang),
                    this.cache = cache || {}, -1 < window.location.href.indexOf("&relogin=1") && (this.cache = {}),
                    this.updateJQuerySettings(), "empire" != this.page ? (this.id && this.id[0] || (cache = [crypto.randomUUID(), 0],
                        GM_setValue("ogl_id", cache), this.id), this.loadPlanetList(), new PopupManager(this),
                        this.checkDataFormat(), new LangManager(this), new TimeManager(this), new FetchManager(this),
                        this.getPlanetData(), this.getServerData(), new UIManager(this), new ShortcutManager(this),
                        new TopbarManager(this), new FleetManager(this), new TooltipManager(this),
                        new NotificationManager(this), new StatsManager(this), new GalaxyManager(this),
                        new MessageManager(this), this.PTRE = new PTRE(this), new HighscoreManager(this),
                        new MovementManager(this), new TechManager(this), new JumpgateManager(this),
                        new EmpireManager(this), this.excludeFromObserver = ["OGameClock", "resources_metal", "resources_crystal", "resources_deuterium", "smallplanet", "resources_food", "resources_population", "resources_energy", "resources_darkmatter", "mmoNewsticker", "mmoTickShow", "tempcounter", "counter-eventlist", "js_duration", "ogl_tooltip", "ogl_tooltipTriangle", "ogl_ready", "ogl_addedElement"],
                        Util.observe(document.body, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0
                        }, mutation => {
                            Array.from(mutation.target.classList).some(r => this.excludeFromObserver.includes(r)) || this.excludeFromObserver.includes(mutation.target.id) || this.excludeFromObserver.some(r => mutation.target.id.startsWith(r)) || (mutation.target.classList.contains("ui-dialog") && mutation.target.querySelector(".detail_msg") ? Util.runAsync(this._message.checkDialog, this._message) : "stat_list_content" == mutation.target.getAttribute("id") && document.querySelector("#stat_list_content #ranks") ? (Util.runAsync(this._ui.updateHighscore, this._ui),
                                Util.runAsync(this._ui.updateStatus, this._ui)) : "right" != mutation.target.id || document.querySelector(".ogl_topbar") || (this.getPlanetData(!0),
                                    this._topbar.load(), this._ui.load(!0), this._movement.load(!0), this._topbar.checkUpgrade()));
                        }, this), cache = `<ul class="ogl_universeInfoTooltip">
                <li>Economy:<div>x${this.server.economySpeed}</div></li>
                <li>Debris:<div>${this.db.serverData.debrisFactor}%</div></li>
                <hr>
                <li>Peaceful fleets:<div>x${this.server.peacefulFleetSpeed}</div></li>
                <li>Holding fleets:<div>x${this.server.holdingFleetSpeed}</div></li>
                <li>War fleets:<div>x${this.server.warFleetSpeed}</div></li>
            </ul>`, (document.querySelector("#pageReloader") || document.querySelector("#logoLink")).classList.add("tooltipBottom"),
                        (document.querySelector("#pageReloader") || document.querySelector("#logoLink")).setAttribute("title", cache),
                        document.querySelector("#pageContent").appendChild(Util.addDom("div", {
                            class: "ogl_universeName",
                            child: this.server.name + "." + this.server.lang
                        })), this.checkPTRECompatibility(), this.db.serverData.serverFullID != this.server.id + this.server.lang && (this.db.serverData.serverFullID = !1,
                            this.ogl.db.lastPTREAPIUpdate = 0, this.ogl.db.tdb = {}, this.ogl.db.pdb = {},
                            this.ogl.db.udb = {}, this.ogl.db.lastPinnedList = [], this.ogl.db.quickRaidList = [],
                            window.location.reload())) : (this._fleet = new FleetManager(this), this._empire = new EmpireManager(this)),
                    window.addEventListener("beforeunload", () => {
                        this.save();
                    })));
    }
    load(data) {
        return "string" == typeof (data = data || GM_getValue(this.DBName) || {}) ? JSON.parse(data) : data;
    }
    save(data, unload) {
        if ("empire" != this.page) try {
            data && "object" == typeof data && (this.db = data), GM_saveTab({
                cache: this.cache
            }), GM_setValue(this.DBName, JSON.stringify(this.db));
        } catch (error) {
            this.readyToUnload = !0;
        }
    }
    getServerData() {
        (!this.db.serverData.topScore || Date.now() > this.db.lastServerUpdate + 36e5) && this._fetch.pending.push({
            url: `https://bridge.hibot.fr/bridge?url=https://${universeUrl}/api/serverData.xml`,
            callback: data => {
                data = new DOMParser().parseFromString(data, "text/html");
                this.db.serverData.topScore = parseInt(Number(data.querySelector("topscore").innerText)),
                    this.db.serverData.probeCargo = parseInt(data.querySelector("probeCargo").innerText),
                    this.db.serverData.debrisFactor = 100 * parseFloat(data.querySelector("debrisFactor").innerText),
                    this.db.serverData.researchSpeed = parseInt(data.querySelector("researchDurationDivisor").innerText),
                    this.db.lastServerUpdate = Date.now();
            }
        });
    }
    getPlanetData() {
        var currentID = document.querySelector('head meta[name="ogame-planet-id"]').getAttribute("content"), planetExist = (this.currentPlanet = {},
            this.currentPlanet.dom = {}, this.currentPlanet.dom.element = document.querySelector(".smallplanet .active"),
            this.currentPlanet.dom.list = Array.from(document.querySelectorAll(".smallplanet")),
            !!this.db.myPlanets?.[currentID]);
        this.db.noFetch ? this.db.noFetch = !1 : ((!this.db.lastLFBonusUpdate || Date.now() > this.db.lastLFBonusUpdate + 24e4 && "fleetdispatch" != this.page) && setTimeout(() => this._fetch.fetchLFBonuses(), planetExist ? 2e4 : 0),
            (!this.db.lastEmpireUpdate || Date.now() > this.db.lastEmpireUpdate + 18e4 && "fleetdispatch" != this.page) && setTimeout(() => this._fetch.fetchEmpire(), planetExist ? 1e4 : 0),
            (!this.db.lastProductionQueueUpdate || Date.now() > this.db.lastProductionQueueUpdate + 1e4 && "fleetdispatch" != this.page) && setTimeout(() => this._fetch.fetchProductionQueue(), planetExist ? 3e3 : 0)),
            this.db.myPlanets[currentID] = this.db.myPlanets[currentID] || {}, this.currentPlanet.obj = this.db.myPlanets[currentID],
            this.currentPlanet.obj.type = document.querySelector('head meta[name="ogame-planet-type"]').getAttribute("content"),
            this.currentPlanet.obj.metal = Math.floor(resourcesBar.resources.metal?.amount || 0),
            this.currentPlanet.obj.crystal = Math.floor(resourcesBar.resources.crystal?.amount || 0),
            this.currentPlanet.obj.deut = Math.floor(resourcesBar.resources.deuterium?.amount || 0),
            this.currentPlanet.obj.energy = Math.floor(resourcesBar.resources.energy?.amount || 0),
            this.currentPlanet.obj.food = Math.floor(resourcesBar.resources.food?.amount || 0),
            this.currentPlanet.obj.population = Math.floor(resourcesBar.resources.population?.amount || 0),
            this.currentPlanet.obj.lifeform = document.querySelector("#lifeform .lifeform-item-icon")?.className.replace(/\D/g, ""),
            this.currentPlanet.obj.lastRefresh = this._time.serverTime, ["metal", "crystal", "deut"].forEach(resource => {
                var storage, prod = resourcesBar.resources[resource.replace("deut", "deuterium")].production, box = (0 < prod && (this.currentPlanet.obj["prod" + resource] = prod),
                    document.querySelector(`#${resource.replace("deut", "deuterium")}_box`));
                "moon" == this.currentPlanet.obj.type || box.querySelector(".ogl_resourceBoxStorage") || (storage = this.currentPlanet.obj[resource + "Storage"],
                    storage = 0 < (prod *= 3600) ? Math.floor((storage - this.currentPlanet.obj[resource]) / prod) || 0 : 1 / 0,
                    resource = Math.max(0, Math.floor(storage / 24)), prod = Math.max(0, Math.floor(storage % 24)),
                    storage = 365 < resource ? "> 365" + LocalizationStrings.timeunits.short.day : "" + resource + LocalizationStrings.timeunits.short.day + " " + prod + LocalizationStrings.timeunits.short.hour,
                    Util.addDom("div", {
                        class: "ogl_resourceBoxStorage",
                        child: storage,
                        parent: box
                    }));
            }), document.querySelectorAll(".planetlink, .moonlink").forEach(planet => {
                let id = new URLSearchParams(planet.getAttribute("href")).get("cp").split("#")[0];
                this.db.myPlanets[id] = this.db.myPlanets[id] || {}, ["metal", "crystal", "deut"].forEach(resourceName => {
                    var resource = this.db.myPlanets[id]?.[resourceName] || 0, storage = this.db.myPlanets[id]?.[resourceName + "Storage"] || 0, div = planet.querySelector(".ogl_available") || Util.addDom("span", {
                        class: "ogl_available",
                        parent: planet
                    }), div = (Util.addDom("span", {
                        class: "ogl_" + resourceName,
                        parent: div,
                        child: Util.formatToUnits(resource, 0)
                    }), planet.querySelector(".ogl_available .ogl_" + resourceName));
                    div.innerHTML = Util.formatToUnits(resource, 1), storage <= resource && planet.classList.contains("planetlink") ? div.classList.add("ogl_danger") : .9 * storage <= resource && planet.classList.contains("planetlink") ? div.classList.add("ogl_warning") : (div.classList.remove("ogl_warning"),
                        div.classList.remove("ogl_danger"));
                }), this.addRefreshTimer(id, planet), this.db.options.displayPlanetTimers || document.querySelector("#planetList").classList.add("ogl_alt"),
                    this.cache.toSend && 3 !== this.mode && delete this.cache.toSend, planet.classList.contains("planetlink") ? (planet.classList.add("tooltipLeft"),
                        planet.classList.remove("tooltipRight"), planet.querySelector(".planet-koords").innerHTML = `<span class="ogl_hidden">[</span>${planet.querySelector(".planet-koords").textContent.slice(1, -1)}<span class="ogl_hidden">]</span>`) : (planet.classList.add("tooltipRight"),
                            planet.classList.remove("tooltipLeft"));
            });
    }
    addRefreshTimer(id, source) {
        let timerDom = Util.addDom("div", {
            class: "ogl_refreshTimer",
            parent: source
        }), update = () => {
            var timer = serverTime.getTime() - (this.db.myPlanets[id]?.lastRefresh || 1), timer = Math.min(Math.floor(timer / 6e4), 60);
            timerDom.innerText = timer.toString(), timerDom.style.color = 30 < timer ? "#ef7676" : 15 < timer ? "#d99c5d" : "#67ad7d";
        };
        update(), setInterval(() => update(), 6e4);
    }
    updateJQuerySettings() {
        let self = this;
        $(document).on("ajaxSend", function (event, xhr, settings) {
            0 <= settings.url.indexOf("page=messages&tab=") && 20 != new URLSearchParams(settings.url).get("tab") && self._message.spytable && self._message.spytable.classList.add("ogl_hidden");
        }), $(document).on("ajaxSuccess", function (event, xhr, settings) {
            if (0 <= settings.url.indexOf("action=getMessagesList")) {
                var tabID = parseInt(new URLSearchParams(settings.data).get("activeSubTab")) || -1;
                self._message.tabID = tabID, Util.runAsync(() => self._message.check());
            } else if (0 <= settings.url.indexOf("action=flagDeleted")) {
                let messageID = parseInt(new URLSearchParams(settings.data).get("messageId")) || -1;
                self._message.reportList && Util.removeFromArray(self._message.reportList, self._message.reportList.findIndex(e => e.id == messageID));
            } else if (0 <= settings.url.indexOf("action=fetchGalaxyContent")) self._galaxy.check(JSON.parse(xhr.responseText)); else if (0 <= settings.url.indexOf("action=checkTarget")) document.querySelector("#planetList").classList.remove("ogl_notReady"); else if (0 <= settings.url.indexOf("component=eventList") && settings.url.indexOf("asJson=1") < 0) {
                tabID = new DOMParser().parseFromString(xhr.responseText, "text/html");
                self._movement.check(tabID), self._movement.eventLoaded = !0;
            } else if (0 <= settings.url.indexOf("action=miniFleet")) {
                var tabID = xhr.responseJSON, xhr = new URLSearchParams(settings.data), mission = xhr.get("mission"), galaxy = xhr.get("galaxy"), system = xhr.get("system"), position = xhr.get("position"), type = xhr.get("type");
                let uid = xhr.get("uid");
                xhr = xhr.get("popup");
                let status = tabID.response.success ? "done" : "fail";
                token = tabID.newAjaxToken, updateOverlayToken("phalanxSystemDialog", tabID.newAjaxToken),
                    updateOverlayToken("phalanxDialog", tabID.newAjaxToken), getAjaxEventbox(),
                    refreshFleetEvents(!0);
                var itemIndex = self._fleet.miniFleetQueue.findIndex(e => e.uid == uid), item = self._fleet.miniFleetQueue.find(e => e.uid == uid);
                -1 < itemIndex && self._fleet.miniFleetQueue.splice(itemIndex, 1),
                    "fail" == status ? item.retry < 2 ? (item.uid = crypto.randomUUID(),
                        item.retry++, self._fleet.miniFleetQueue.push(item)) : (self._notification.addToQueue(`[${galaxy}:${system}:${position}] ` + tabID.response.message, !1),
                            document.querySelectorAll(`[data-spy-coords="${galaxy}:${system}:${position}:${type}"]`).forEach(e => e.setAttribute("data-spy", status))) : (6 == mission && self.db.pdb[galaxy + `:${system}:` + position] && (self.db.pdb[galaxy + `:${system}:` + position].spy = self.db.pdb[galaxy + `:${system}:` + position].spy || [],
                                1 == type ? self.db.pdb[galaxy + `:${system}:` + position].spy[0] = serverTime.getTime() : 3 == type && (self.db.pdb[galaxy + `:${system}:` + position].spy[1] = serverTime.getTime())),
                                document.querySelectorAll(`[data-spy-coords="${galaxy}:${system}:${position}:${type}"]`).forEach(e => e.setAttribute("data-spy", status)),
                                $("#slotUsed").html(tsdpkt(tabID.response.slots)), setShips("probeValue", tsdpkt(tabID.response.probes)),
                                setShips("recyclerValue", tsdpkt(tabID.response.recyclers)), setShips("missileValue", tsdpkt(tabID.response.missiles))),
                    xhr && 6 != mission && (tabID.response.success ? fadeBox(tabID.response.message + " " + tabID.response.coordinates.galaxy + ":" + tabID.response.coordinates.system + ":" + tabID.response.coordinates.position, !tabID.response.success) : fadeBox(tabID.response.message, !0)),
                    0 < self._fleet.miniFleetQueue.length && setTimeout(() => self._fleet.sendNextMiniFleet(), 500);
            } else 0 <= settings.url.indexOf("page=highscoreContent") && self._highscore.check();
        }), $.ajaxSetup({
            beforeSend: function (xhr) {
                0 <= this.url.indexOf("action=checkTarget") && !self?._fleet?.firstLoadCancelled ? window.fleetDispatcher && (fleetDispatcher.fetchTargetPlayerDataTimeout = null,
                    self._fleet.firstLoadCancelled = !0, xhr.abort()) : 0 <= this.url.indexOf("action=fetchGalaxyContent") ? (self._galaxy.xhr && self._galaxy.xhr.abort(),
                        self._galaxy.xhr = xhr) : 0 <= this.url.indexOf("action=getMessagesList") && (self._message.xhr && self._message.xhr.abort(),
                            self._message.xhr = xhr);
            }
        });
    }
    checkPTRECompatibility() {
        var json;
        serverTime.getTime() > this.id[1] + 864e5 && (json = {
            ogl_id: this.id[0] || "-",
            version: this.version || "-",
            script_name: GM_info.script.name || "-",
            script_namespace: GM_info.script.downloadURL || "-"
        }, this.PTRE.postPTRECompatibility(json));
    }
    createPlayer(id) {
        return this.db.udb[id] = {
            uid: parseInt(id)
        }, this.db.udb[id];
    }
    removeOldPlanetOwner(coords, newUid) {
        Object.values(this.db.udb).filter(e => -1 < e.planets?.indexOf(coords)).forEach(old => {
            var index;
            old.uid != newUid && (index = this.db.udb[old.uid].planets.indexOf(coords),
                this.db.udb[old.uid].planets.splice(index, 1), this.db.udb[old.uid].planets.length < 1 && delete this.db.udb[old.uid],
                this.db.udb[old.uid]) && document.querySelector(".ogl_side.ogl_active") && this.db.currentSide == old.uid && document.querySelector(".ogl_side.ogl_active") && this.db.currentSide == old.uid && this._topbar.openPinnedDetail(old.uid);
        });
    }
    checkDataFormat() {
        var legacyDBName;
        this.db.dataFormat < 10 && (legacyDBName = `ogl_test_${this.server.id}-${this.server.lang}_` + this.account.id,
            (0 < (legacyDBName = JSON.parse(GM_getValue(legacyDBName) || "{}")).pinnedList?.length || 0 < legacyDBName.positions?.length) && confirm("Do you want to import v4 pinned targets ?") ? (this._popup.open(Util.addDom("div", {
                child: '<div>importing v4 targets, please wait...</div><hr><div class="ogl_loading"></div>'
            })), legacyDBName.pinnedList.forEach(id => {
                this.db.lastPinnedList = Array.from(new Set([id, ...this.db.lastPinnedList]));
            }), 30 < this.db.lastPinnedList.length && (this.db.lastPinnedList.length = 30),
                legacyDBName.positions.filter(position => position.color).forEach(position => {
                    this.db.tdb[position.rawCoords] = {
                        tag: position.color.replace("half", "")
                    };
                }), this.db.dataFormat = 10, this._popup.close(), window.location.reload()) : this.db.dataFormat = 10),
            this.db.dataFormat < 12 && (document.querySelectorAll(".planetlink, .moonlink").forEach(planet => {
                planet = new URLSearchParams(planet.getAttribute("href")).get("cp").split("#")[0];
                this.db.myPlanets[planet] && delete this.db.myPlanets[planet].todolist;
            }), this.cache && delete this.cache.toSend, this.db.dataFormat = 12), this.db.dataFormat < 14 && (this.db.initialTime = Date.now(),
                this.db.stats = {}, this.cache.raid = {}, this.db.dataFormat = 14), this.db.dataFormat < 15 && (Object.entries(this.db.stats || {}).forEach(entry => {
                    var midnight, date;
                    -1 < entry[0].indexOf("-") || (midnight = parseInt(entry[0]), entry = entry[1],
                        date = `${(date = new Date(midnight)).getFullYear()}-${date.getMonth()}-` + date.getDate(),
                        this.db.stats[date]) || (this.db.stats[date] = entry, delete this.db.stats[midnight]);
                }), this.db.dataFormat = 15), this.db.dataFormat < 16 && (Object.entries(this.db.stats || {}).forEach(entry => {
                    var oldKey = entry[0].split("-");
                    let newMonth = parseInt(oldKey[1]) + 1, newYear = parseInt(oldKey[0]);
                    12 < newMonth && (newMonth = 1, newYear++);
                    var entry = entry[1], key = `${newYear}-${newMonth}-` + oldKey[2];
                    delete this.db.stats[oldKey.join("-")], this.db.stats[key] = entry;
                }), this.db.dataFormat = 16), this.db.dataFormat < 17 && (this.db.options.msu = "3:2:1",
                    this.db.dataFormat = 17);
    }
    calcExpeditionMax() {
        var treshold = [{
            topScore: 1e4,
            base: 10,
            max: 4e4
        }, {
            topScore: 1e5,
            base: 125,
            max: 5e5
        }, {
            topScore: 1e6,
            base: 300,
            max: 12e5
        }, {
            topScore: 5e6,
            base: 450,
            max: 18e5
        }, {
            topScore: 25e6,
            base: 600,
            max: 24e5
        }, {
            topScore: 5e7,
            base: 750,
            max: 3e6
        }, {
            topScore: 75e6,
            base: 900,
            max: 36e5
        }, {
            topScore: 1e8,
            base: 1050,
            max: 42e5
        }, {
            topScore: 1 / 0,
            base: 1250,
            max: 5e6
        }].find(e => e.topScore >= this.db.serverData.topScore);
        let maxResources = (3 == this.account.class ? 3 * treshold.max * this.server.economySpeed : 2 * treshold.max) * (1 + (this.db.lfBonuses?.Characterclasses3?.bonus || 0) / 100) * (1 + (this.db.lfBonuses?.ResourcesExpedition?.bonus || 0) / 100);
        return this.db.options.expeditionValue && (maxResources = 1 <= this.db.options.expeditionValue.toString().indexOf("%") ? Math.ceil(maxResources * this.db.options.expeditionValue.replace(/\D/g, "") / 100) : this.db.options.expeditionValue),
        {
            max: Math.round(maxResources),
            treshold: treshold
        };
    }
    loadPlanetList() {
        this.account.planets = [], document.querySelectorAll(".smallplanet").forEach(line => {
            var planet = {};
            planet.id = new URLSearchParams(line.querySelector(".planetlink")?.getAttribute("href"))?.get("cp")?.split("#")?.[0] || -1,
                planet.moonID = new URLSearchParams(line.querySelector(".moonlink")?.getAttribute("href"))?.get("cp")?.split("#")?.[0] || -1,
                planet.coords = line.querySelector(".planet-koords").textContent.slice(1, -1),
                planet.isCurrent = line.classList.contains("hightlightPlanet") || line.classList.contains("hightlightMoon"),
                planet.currentType = planet.isCurrent && line.classList.contains("hightlightPlanet") ? "planet" : !(!planet.isCurrent || !line.classList.contains("hightlightMoon")) && "moon",
                this.account.planets.push(planet);
        }), this.account.planets.getNext = offset => Util.reorderArray(this.account.planets, this.account.planets.findIndex(e => e.isCurrent))?.[(offset || 0) + 1] || this.account.planets[0],
            this.account.planets.getNextWithMoon = offset => Util.reorderArray(this.account.planets.filter(e => -1 < e.moonID), this.account.planets.filter(e => -1 < e.moonID).findIndex(e => e.isCurrent))?.[(offset || 0) + 1] || this.account.planets[0],
            this.account.planets.getPrev = offset => Util.reorderArray(this.account.planets, this.account.planets.findIndex(e => e.isCurrent), !0)?.[offset || 0] || this.account.planets[0],
            this.account.planets.getPrevWithMoon = offset => Util.reorderArray(this.account.planets.filter(e => -1 < e.moonID), this.account.planets.filter(e => -1 < e.moonID).findIndex(e => e.isCurrent), !0)?.[offset || 0] || this.account.planets[0],
            this.account.planets.getCurrent = () => this.account.planets.find(e => e.isCurrent) || this.account.planets[0],
            this.account.planets.getByCoords = coords => this.account.planets.find(e => coords == e.coords);
    }
}

GM_getTab(params => unsafeWindow.ogl = new OGLight(params));

class Manager {
    constructor(ogl) {
        this.ogl = ogl, (this.ogl["_" + this.constructor.name.toLowerCase().replace("manager", "")] = this).load && this.load();
    }
}

class LangManager extends Manager {
    load() {
        this.raw = {
            metal: "Metal",
            crystal: "Crystal",
            deut: "Deuterium",
            artefact: "Artefact",
            dm: "Dark Matter",
            202: "Small Cargo",
            203: "Large Cargo",
            204: "Light Fighter",
            205: "Heavy Fighter",
            206: "Cruiser",
            207: "Battleship",
            208: "Colony Ship",
            209: "Recycler",
            210: "Espionage Probe",
            211: "Bomber",
            212: "Solar Satellite",
            213: "Destroyer",
            214: "Deathstar",
            215: "Battlecruiser",
            216: "Trade Ship",
            217: "Crawler",
            218: "Reaper",
            219: "Pathfinder",
            220: "Trade Ship"
        }, this.en = {
            ship: "Ships",
            item: "Item",
            other: "Other",
            resource: "Resources",
            battle: "Battle",
            blackhole: "Black hole",
            early: "Early",
            late: "Late",
            trader: "Trader",
            nothing: "Nothing",
            pirate: "Pirates",
            alien: "Aliens",
            duration: "Duration",
            defaultShip: "Default ship type",
            defaultMission: "Default mission type",
            useClientTime: "Use client time",
            displayMiniStats: "Stats range",
            displaySpyTable: "Display spy table",
            displayPlanetTimers: "Display planets timer",
            disablePlanetTooltips: "Disable planets menu tooltips",
            showMenuResources: "Planets menu layout",
            reduceLargeImages: "Fold large images",
            ignoreExpeShips: "Ignore ships found in expeditions",
            ignoreExpeShipsLoss: "Ignore ships lost in expeditions",
            ignoreConsumption: "Ignore fleet consumption",
            resourceTreshold: "Resource treshold",
            tooltipDelay: "Tooltip delay (ms)",
            galaxyUp: "Next galaxy",
            galaxyDown: "Previous galaxy",
            galaxyLeft: "Previous system",
            galaxyRight: "Next system",
            previousPlanet: "Previous planet",
            nextPlanet: "Next planet",
            nextPinnedPosition: "Next pinned position",
            fleetRepeat: "Repeat last fleet",
            fleetSelectAll: "<div>Select all ships (fleet1)<hr>Select all resources (fleet2)</div>",
            expeditionSC: "Small cargo expedition",
            expeditionLC: "Large cargo expedition",
            expeditionPF: "Pathfinder expedition",
            galaxySpySystem: "System spy",
            collectLinked: "Collect to linked planet/moon",
            keyboardActions: "Keyboard settings",
            expeditionValue: "Expedition value",
            expeditionValueTT: "<ul><li>The custom value aimed by your expeditions</li><li>Set it to <b>0</b> to use the default calculated value</li><li>You can use <b>%</b> to aim a percent of the calculated value</li></ul>",
            expeditionBigShips: "Allowed biggest ships",
            expeditionRandomSystem: "Random system",
            expeditionShipRatio: "Ships found value (%)",
            fleetLimiter: "Fleet limiter",
            fleetLimiter: "Substract the amount of ships defined in your profile limiter",
            fleetLimiterTT: "Chose the amount of ships / resources to keep on your planets",
            menu: "Toggle OGLight menu",
            quickRaid: "Quick raid",
            attackNext: "Attack next planet",
            autoCleanReports: "Auto clean reports",
            noCurrentPin: "Error, no target pinned",
            backFirstFleet: "Back first fleet",
            backLastFleet: "Back last fleet sent",
            fleetReverseAll: "Reverse selection",
            fleetResourcesSplit: "Split ships/resources",
            manageData: "Manage OGLight data",
            profileButton: "Profile limiters",
            limiters: "Limiters",
            expeditionRedirect: "Redirect to the next planet/moon",
            playerProfile: "Player profile",
            topReportDetails: "Top report details",
            reportFound: "Top report",
            discovery: "Send a discovery",
            collectResources: "Collect resources",
            accountSummary: "Account summary",
            stats: "Stats",
            taggedPlanets: "Tagged planets",
            pinnedPlayers: "Pinned players",
            oglSettings: "OGLight settings",
            coffee: "Buy me a coffee",
            syncEmpire: "Sync empire data",
            repeatQueue: "Repeat the amount above in a new queue X time.<br>This operation can take a while",
            spyPlanet: "Spy this planet",
            spyMoon: "Spy this moon",
            resourceLimiter: "Substract the amount of resources defined in your profile limiter",
            forceKeepCapacity: "Keep enough capacity on you planet to move your resources (has priority over limiters)",
            forceIgnoreFood: "Ignore food (has priority over limiters)",
            resetStats: "Reset stats",
            resetTaggedPlanets: "Reset tagged planets",
            resetPinnedPlayers: "Reset pinned players",
            resetAll: "Reset all data",
            resetStatsLong: "Do you really want to reset OGLight stats data ?",
            resetTaggedPlanetsLong: "Do you really want to reset OGLight tagged planets data ?",
            resetPinnedPlayersLong: "Do you really want to reset OGLight pinned players data ?",
            resetAllLong: "Do you really want to reset all OGLight data ?",
            reportBlackhole: "Report a black hole",
            reportBlackholeLong: "Do you really want to add this black hole ?",
            emptyPlayerList: "There is no player in this list",
            debugMode: "Debug mode",
            sim: "Battle sim",
            converter: "Battle converter",
            siblingPlanetMoon: "Sibling planet / moon",
            oglMessageDone: "This message has been red by OGLight",
            ptreMessageDone: "activity sent to PTRE",
            boardTab: "Display board news",
            msu: "Metal standard unit",
            notifyNoProbe: "Feature disabled :(",
            shortcutsOnRight: "Display shortcuts under the planet menu",
            ptreTeamKey: "Team key",
            ptreLogs: "Display PTRE errors",
            ptreActivityImported: "activity imported to PTRE",
            ptreActivityAlreadyImported: "activity already imported to PTRE",
            ptreSyncTarget: "Sync with PTRE",
            ptreManageTarget: "Manage on PTRE",
            colorblindMode: "Colorblind mode",
            fleetQuickCollect: "Quick collect this planet resources",
            sidePanelOnLeft: "Side panel on left",
            galaxyReload: "Reload galaxy"
        }, this.fr = {
            ship: "Vaisseaux",
            item: "Item",
            other: "Autre",
            resource: "Ressources",
            battle: "Combat",
            blackhole: "Trou noir",
            early: "Avance",
            late: "Retard",
            trader: "Marchand",
            nothing: "Rien",
            pirate: "Pirates",
            alien: "Aliens",
            duration: "Durée",
            defaultShip: "Type de vaisseau par défaut",
            defaultMission: "Type de mission par défaut",
            useClientTime: "Utiliser l'heure du client",
            displayMiniStats: "Fourchette",
            displaySpyTable: "Afficher le tableau d'espio",
            displayPlanetTimers: "Afficher les timers des planètes",
            disablePlanetTooltips: "Cacher les tooltips du menu des planètes",
            showMenuResources: "Affichage du menu des planètes",
            reduceLargeImages: "Réduire les grandes images",
            ignoreExpeShips: "Ignorer les vaisseaux trouvés en expédition",
            ignoreExpeShipsLoss: "Ignorer les vaisseaux perdus en expédition",
            ignoreConsumption: "Ignorer la consommation des flottes",
            resourceTreshold: "Seuil de ressources",
            tooltipDelay: "Délai des tooltips (ms)",
            galaxyUp: "Galaxie suivante",
            galaxyDown: "Galaxie précédente",
            galaxyLeft: "Système précédent",
            galaxyRight: "Système suivant",
            previousPlanet: "Planète précédente",
            nextPlanet: "Planète suivante",
            nextPinnedPosition: "Position épinglée suivante",
            fleetRepeat: "Répéter la dernière flotte",
            fleetSelectAll: "<div>Selectionner tous les vaisseaux (fleet1)<hr>Selectionner toutes les ressources (fleet2)</div>",
            expeditionSC: "Expédition au petit transporteur",
            expeditionLC: "Expédition au grand transporteur",
            expeditionPF: "Expédition à l'éclaireur",
            galaxySpySystem: "Espionnage du système",
            collectLinked: "Rapatrier vers les planètes/lunes liée",
            keyboardActions: "Raccourcis clavier",
            expeditionValue: "Valeur max. expédition",
            expeditionValueTT: "<ul><li>La valeur visée par les expédition</li><li>Laisser à <b>0</b> pour utiliser la valeur calculée par OGLight</li><li>Vous pouvez mettre une valeur fixe pour viser un montant précis</li><li>Vous pouvez utiliser <b>%</b> pour viser un pourcentage de la valeur calculée</li><ul>",
            expeditionBigShips: "Gros vaisseaux autorisés",
            expeditionRandomSystem: "Système aléatoire",
            expeditionShipRatio: "Valeur vaisseaux trouvés (%)",
            fleetLimiter: "Limiteur de flotte",
            fleetLimiter: "Soustraire le nombre de vaisseaux indiqué dans le limiteur",
            fleetLimiterTT: "Choisir le nombre de vaisseau et la quantité de ressources à garder sur les planètes/lunes",
            menu: "Afficher/masquer le menu OGLight",
            quickRaid: "Raid rapide",
            attackNext: "Attaquer la planète suivante",
            autoCleanReports: "Nettoyage automatique des rapports",
            noCurrentPin: "Pas de cible épinglée actuellement",
            backFirstFleet: "Rappeler la prochaine flotte",
            backLastFleet: "Rappeler la dernière flotte envoyée",
            fleetReverseAll: "Inverser la sélection",
            fleetResourcesSplit: "Diviser les vaisseaux/ressources",
            manageData: "Gestion des données OGLight",
            profileButton: "Configuration des limiteurs",
            limiters: "Limiteurs",
            expeditionRedirect: "Rediriger vers la planète/lune suivante",
            playerProfile: "Profil du joueur",
            topReportDetails: "Détails du meilleur rapport",
            reportFound: "Meilleur rapport",
            discovery: "Envoyer une exploration",
            collectResources: "Rapatrier les ressources",
            accountSummary: "Résumé du compte",
            stats: "Statistiques",
            taggedPlanets: "Planètes marquées",
            pinnedPlayers: "Joueurs épinglés",
            oglSettings: "Configuration d'OGLight",
            coffee: "Buy me a coffee",
            syncEmpire: "Synchroniser les données de l'empire",
            repeatQueue: "Répéter le nombre ci-dessus dans une nouvelle file X fois.<br>Cette opération peut prendre un moment",
            spyPlanet: "Espionner cette planète",
            spyMoon: "Espionner cette lune",
            resourceLimiter: "Soustraire le montant de ressources indiqué dans le limiteur",
            forceKeepCapacity: "Garder assez de capacité sur la planète pour bouger les ressources (a la priorité sur le limiteur)",
            forceIgnoreFood: "Ignorer la nourriture (a la priorité sur le limiteur)",
            resetStats: "Réinitialiser stats",
            resetTaggedPlanets: "Réinitialiser les planètes marquées",
            resetPinnedPlayers: "Réinitialiser les joueurs épinglés",
            resetAll: "Réinitialiser toutes les données OGLight",
            resetStatsLong: "Voulez-vous vraiment réinitialiser les stats ?",
            resetTaggedPlanetsLong: "Voulez-vous vraiment réinitialiser les planètes marquées ?",
            resetPinnedPlayersLong: "Voulez-vous vraiment réinitialiser les joueurs épinglés ?",
            resetAllLong: "Voulez-vous vraiment réinitialiser toutes les données OGLight ?",
            reportBlackhole: "Signaler un trou noir",
            reportBlackholeLong: "Voulez vous vraiment ajouter ce trou noir ?",
            emptyPlayerList: "Cette liste de joueurs est vide",
            debugMode: "Mode debug",
            sim: "Simulateur de combat",
            converter: "Convertisseur de combat",
            siblingPlanetMoon: "Planète / lune liée",
            oglMessageDone: "Ce message a été traité par OGLight",
            ptreMessageDone: "Activité envoyée à PTRE",
            boardTab: "Afficher les annonces du board",
            msu: "Metal standard unit",
            notifyNoProbe: "Fonctionnalité desactivée :(",
            shortcutsOnRight: "Raccourcis sous le menu des planètes",
            ptreTeamKey: "Team key",
            ptreLogs: "Afficher les erreurs PTRE",
            ptreActivityImported: "Activité importée dans PTRE",
            ptreActivityAlreadyImported: "Activité déjà importée dans PTRE",
            ptreSyncTarget: "Synchroniser avec PTRE",
            ptreManageTarget: "Gérer sur PTRE",
            colorblindMode: "Mode daltonien",
            fleetQuickCollect: "Collecte rapide des ressources de cette planète",
            sidePanelOnLeft: "Panneau latéral à gauche",
            galaxyReload: "Recharger la galaxie"
        }, this.de = {
            ship: "Schiffe",
            item: "Item",
            other: "Sonstiges",
            resource: "Ressourcen",
            battle: "Kampf",
            blackhole: "Schwarzes Loch",
            early: "Verfrühung",
            late: "Verspätung",
            trader: "Händler",
            nothing: "Nichts",
            pirate: "Piraten",
            alien: "Aliens",
            duration: "Dauer",
            defaultShip: "Standard Schiff",
            defaultMission: "Standard Mission",
            useClientTime: "Nutze Clientzeit",
            displayMiniStats: "Zeige Statistik Bereich",
            displaySpyTable: "Zeige Spionagetabelle",
            displayPlanetTimers: "Zeige Planetentimer",
            disablePlanetTooltips: "Deaktiviere Planetenmenü Tooltip",
            showMenuResources: "Planeten Menü-Anordnung",
            reduceLargeImages: "Klappe große Bilder zu",
            ignoreExpeShips: "Ignoriere Schiffsfunde in Expeditionen",
            ignoreExpeShipsLoss: "Ignoriere Flottenverluste in Expeditionen",
            ignoreConsumption: "Ignoriere Treibstoffverbrauch",
            resourceTreshold: "Ressourcen Grenzwert",
            tooltipDelay: "Tooltip Verzögerung (ms)",
            galaxyUp: "Nächste Galaxie",
            galaxyDown: "Vorherige Galaxie",
            galaxyLeft: "Vorheriges System",
            galaxyRight: "Nächstes System",
            previousPlanet: "Vorheriger Planet",
            nextPlanet: "Nächster Planet",
            nextPinnedPosition: "Nächste angepinnte Position",
            fleetRepeat: "Wiederhole letzte Flotte",
            fleetSelectAll: "<div>Wähle alle Schiffe (flotte1)<hr>Wähle alle Ressourcen (flotte2)</div>",
            expeditionSC: "Kleiner Transporter Expedition",
            expeditionLC: "Großer Transporter Expedition",
            expeditionPF: "Pathfinder Expedition",
            galaxySpySystem: "System Spionage",
            collectLinked: "Sammle zu verlinktem Planet/Mond",
            keyboardActions: "Tastatureinstellungen",
            expeditionValue: "Expedition Maximalwert",
            expeditionValueTT: "Benutzerdefinierter Maximalwert für Expeditionen.<br> Setze ihn auf <b>0</b> um berechnete Werte zu verwenden.",
            expeditionBigShips: "Erlaubtes größtes Schiff",
            expeditionRandomSystem: "Zufälliges System",
            expeditionShipRatio: "Schiffsfund Wert(%)",
            fleetLimiter: "Flottenbegrenzer",
            fleetLimiter: "Subtrahiere Anzahl der Schiffe die im Profilmaximalwert definiert sind.",
            fleetLimiterTT: "Wähle die Anzahl an Schiffen / Ressourcen die auf dem Planeten bleiben sollen",
            menu: "OGLight Einstellungen",
            quickRaid: "Schnell-Angriff",
            attackNext: "Attackiere nächsten Planeten",
            autoCleanReports: "Automatische Spionagebericht-Bereinigung",
            noCurrentPin: "Fehler: Kein angepinntes Ziel",
            backFirstFleet: "Ziehe erste Flotte zurück",
            backLastFleet: "Ziehe letzte Flotte zurück",
            fleetReverseAll: "Auswahl umkehren",
            fleetResourcesSplit: "Teile Schiffe/Ressourcen",
            manageData: "Verwalte OGLight Daten",
            profileButton: "Profil Maximalwerte",
            limiters: "Maximalwerte",
            expeditionRedirect: "Zum nächsten Planet/Mond weiterleiten",
            playerProfile: "Spielerprofil",
            topReportDetails: "Informationen oberster Bericht",
            reportFound: "oberster Bericht",
            discovery: "Sende Erkundung",
            collectResources: "Ressourcen zusammenziehen",
            accountSummary: "Accountzusammenfassung",
            stats: "Statistiken",
            taggedPlanets: "Getaggte Planeten",
            pinnedPlayers: "Angepinnte Spieler",
            oglSettings: "OGLight Einstellungen",
            coffee: "Unterstütze mich",
            syncEmpire: "Synchronisiere Imperiumsdaten",
            repeatQueue: "Wiederhole Anzahl in neuer Schleife X mal.<br>Diese Option kann etwas dauern.",
            spyPlanet: "Spioniere diesen Planeten",
            spyMoon: "Spioniere diesen Mond",
            resourceLimiter: "Subtrahiere Anzahl der Ressourcen die im Profilmaximalwert definiert sind.",
            forceKeepCapacity: "Genügend Ladekapazität zurückhalten, um Rohstoffe zu transportieren (hat Priorität über definierten Grenzwerten)",
            forceIgnoreFood: "Ignoriere Nahrung (hat Priorität über definierten Grenzwerten)",
            resetStats: "Setze Statistik zurück",
            resetTaggedPlanets: "Setze getaggte Planeten zurück",
            resetPinnedPlayers: "Setze angepinnte Spieler zurück",
            resetAll: "Setze alle Daten zurück",
            resetStatsLong: "Möchtest du wirklich die OGL Daten zurücksetzen?",
            resetTaggedPlanetsLong: "Möchtest du wirklich die getaggten Planeten zurücksetzen?",
            resetPinnedPlayersLong: "Möchtest du wirklich die Spielerdaten zurücksetzen?",
            resetAllLong: "Möchtest du wirklich alle OGL Daten zurücksetzen?",
            reportBlackhole: "Melde schwarzes Loch",
            reportBlackholeLong: "Möchtest du dieses Schwarze Loch wirklich hinzufügen?",
            emptyPlayerList: "Es ist kein Spieler in der Liste",
            debugMode: "Debug Modus",
            sim: "Kampfsimulator",
            siblingPlanetMoon: "Verknüpfter Planet / Mond",
            oglMessageDone: "Diese Nachricht wurde von OGLight gelesen",
            boardTab: "Zeige Forum Neuigkeiten an",
            msu: "Metall Standardeinheit (MSE)",
            notifyNoProbe: "Funktion deaktiviert :(",
            shortcutsOnRight: "Zeige Kurzmenü unter Planeten",
            ptreTeamKey: "PTRE Team Key",
            ptreLogs: "Zeige PTRE Fehler",
            ptreActivityImported: "Aktivität zu PTRE importiert",
            ptreActivityAlreadyImported: "Aktivität bereits im PTRE",
            ptreSyncTarget: "Synchronisiere mit PTRE",
            ptreManageTarget: "Verwalte auf PTRE"
        }, this.gr = {
            ship: "Πλοία",
            item: "Αντικείμενο",
            other: "Άλλο",
            resource: "Πόροι",
            battle: "Μάχη",
            blackhole: "Μαύρη τρύπα",
            early: "Νωρίς",
            late: "Αργά",
            trader: "Εμπόριο",
            nothing: "Τίποτα",
            pirate: "Πειρατές",
            alien: "Άλιεν ",
            duration: "Διάρκεια",
            defaultShip: "Προεπιλογή πλοίου",
            defaultMission: "Προεπιλεγμένη αποστολή",
            useClientTime: "Χρήση ρολογιού OGlight",
            displayMiniStats: "Εύρος στατιστικών",
            displaySpyTable: "Πίνακας κατασκοπείας",
            displayPlanetTimers: "Χρόνος δραστηριότητας",
            disablePlanetTooltips: "Απενεργοποίηση μενού πλανητών",
            showMenuResources: "Διάταξη μενού πλανητών",
            reduceLargeImages: "Μικρότερες εικόνες",
            ignoreExpeShips: "Αγνόησε πλοία που βρέθηκαν σε αποστολές",
            ignoreExpeShipsLoss: "Αγνόησε πλοία που χάθηκαν σε αποστολές",
            ignoreConsumption: "Αγνόησε την κατανάλωση πλοίων",
            resourceTreshold: "Ανώτατο όριο πόρων",
            tooltipDelay: "Καθυστέρηση επεξήγησης (ms)",
            galaxyUp: "Επόμενος γαλαξίας",
            galaxyDown: "Προηγούμενος γαλαξίας",
            galaxyLeft: "Προηγούμενο σύστημα",
            galaxyRight: "Επόμενο σύστημα",
            previousPlanet: "Προηγούμενος πλανήτης",
            nextPlanet: "Επόμενος πλανήτης",
            nextPinnedPosition: "Επόμενη καρφιτσωμένη θέση",
            fleetRepeat: "Επανάληψη τελευταίου στόλου",
            fleetSelectAll: "<div>Επιλογή όλων των πλοίων (fleet1)<hr>Επιλογή όλων των πόρων (fleet2)</div>",
            expeditionSC: "Αποστολή με μικρά μεταγωγικά",
            expeditionLC: "Αποστολή με μεγάλα μεταγωγικά",
            expeditionPF: "Αποστολή με pathfinder",
            galaxySpySystem: "Κατασκοπεία συστήματος",
            collectLinked: "Συλλογή στο συνδεδεμένο πλανήτη/φεγγάρι",
            keyboardActions: "Ρυθμίσεις πληκτρολογίου",
            expeditionValue: "Αξία αποστολής",
            expeditionValueTT: "Προσαρμοσμένη αξία των αποστολών.<br> Ρύθμιση σε <b>0</b> για να χρησιμοποιηθεί η προεπιλεγμένη τιμή",
            expeditionBigShips: "Επιτρέπονται μεγαλύτερα πλοία",
            expeditionRandomSystem: "Τυχαίο σύστημα",
            expeditionShipRatio: "Αξία πλοίων που βρέθηκαν (%)",
            fleetLimiter: "Περιοριστής στόλου",
            fleetLimiter: "Αφαιρέστε τον αριθμό των πλοίων που ορίζεται στον περιοριστή ",
            fleetLimiterTT: "Επιλέξτε την ποσότητα πλοίων / πόρων που θα παραμείνουν στον πλανήτη",
            menu: "Εναλλαγή μενού OGLight",
            quickRaid: "Γρήγορη επιδρομή",
            attackNext: "Επίθεση στον επόμενο πλανήτη",
            autoCleanReports: "Αυτόματο σβήσιμο αναφορών",
            noCurrentPin: "Σφάλμα, δεν καρφιτσώθηκε στόχος",
            backFirstFleet: "Επιστροφή πρώτος στόλος",
            backLastFleet: "Επιστροφή τελευταίος στόλος",
            fleetReverseAll: "Αντίστροφη επιλογή",
            fleetResourcesSplit: "Διαχωρισμός πλοίων/πόρων",
            manageData: "Διαχείριση δεδομένων OGLight",
            profileButton: "Προφίλ περιορισμού",
            limiters: "Περιορισμοί",
            expeditionRedirect: "Ανακατεύθυνση στον επόμενο πλανήτη/φεγγάρι",
            playerProfile: "Προφίλ παίχτη",
            topReportDetails: "Λεπτομέρειες κορυφαίας αναφοράς",
            reportFound: "Κορυφαία αναφορά",
            discovery: "Μαζική Αποστολή Ανιχνευτικών Σκαφών",
            collectResources: "Συλλογή πόρων",
            accountSummary: "Περίληψη λογαριασμού",
            stats: "Στατιστικά",
            taggedPlanets: "Πλανήτες με ετικέτα",
            pinnedPlayers: "Καρφιτσωμένοι παίκτες",
            oglSettings: "Ρυθμίσεις OGLight",
            coffee: "Buy me a coffee",
            syncEmpire: "Συγχρονισμός δεδομένων",
            repeatQueue: "Επανέλαβε το παραπάνω ποσό σε νέα ουρά  X χρόνο.<br>Αυτή η λειτουργία μπορεί να διαρκέσει λίγο",
            spyPlanet: "Κατασκοπεία αυτού του πλανήτη",
            spyMoon: "Κατασκοπεία αυτού του φεγγαριού",
            resourceLimiter: "Αφαιρέστε το ποσό των πόρων που ορίζονται στον περιοριστή ",
            forceKeepCapacity: "Διατηρήστε αρκετή ποσότητα στον πλανήτη σας για να μεταφέρετε τους πόρους σας(has priority over limiters)",
            forceIgnoreFood: "Αγνόησε την τροφή (has priority over limiters)",
            resetStats: "Επαναφορά στατιστικών",
            resetTaggedPlanets: "Επαναφορά πλανητών με ετικέτα",
            resetPinnedPlayers: "Επαναφορά καρφιτσωμένων παικτών ",
            resetAll: "Επαναφορά όλων των δεδομένων",
            resetStatsLong: "Θέλετε να επαναφέρετε τα δεδομένα των στατιστικών του OGLight;",
            resetTaggedPlanetsLong: "Θέλετε να επαναφέρετε τα δεδομένα πλανητών με ετικέτα του OGLight;",
            resetPinnedPlayersLong: "Θέλετε να επαναφέρετε τα δεδομένα των καρφιτσωμένων παικτών του OGLight;",
            resetAllLong: "Θέλετε να επαναφέρετε όλα τα δεδομένα του OGLight;",
            reportBlackhole: "Ανάφερε μια μαύρη τρύπα",
            reportBlackholeLong: "Θέλετε να προσθέσετε αυτή την μαύρη τρύπα;",
            emptyPlayerList: "Δεν υπάρχει παίχτης σε αυτή τη λίστα",
            debugMode: "Εντοπισμός σφαλμάτων",
            sim: "Προσομοιωτής μάχης",
            siblingPlanetMoon: "Αδελφός πλανήτης / φεγγάρι",
            oglMessageDone: "Αυτό το μήνυμα διαβάστηκε από το OGLight",
            boardTab: "Εμφάνιση πίνακα ειδήσεων",
            msu: "Αξια σε Μέταλλο",
            notifyNoProbe: "Απενεργοποιημένη δυνατότητα :(",
            shortcutsOnRight: "Εμφάνιση συντομεύσεων κάτω από τους πλανήτες",
            ptreTeamKey: "Team key",
            ptreLogs: "Εμφάνισε PTRE σφάλματα",
            ptreActivityImported: "δραστηριότητα εισήχθη στο PTRE",
            ptreActivityAlreadyImported: "δραστηριότητα που έχει ήδη εισαχθεί PTRE",
            ptreSyncTarget: "Συγχρονισμός με PTRE",
            ptreManageTarget: "Διαχείριση PTRE"
        };
    }
    find(key, isRaw) {
        return "darkmatter" == key && (key = "dm"), isRaw && this.raw[key] ? this.raw[key] : this[this.ogl.account.lang] && this[this.ogl.account.lang][key] ? this[this.ogl.account.lang][key] : this.ogl.db.serverData[key] || this.en[key] || "TEXT_NOT_FOUND";
    }
}

class TimeManager extends Manager {
    load() {
        if (this.units = LocalizationStrings.timeunits.short, this.serverTimeZoneOffset = 6e4 * this.ogl.db.serverData.serverTimeZoneOffsetInMinutes,
            this.clientTimeZoneOffset = 6e4 * serverTime.getTimezoneOffset(), this.UTC = serverTime.getTime() + this.serverTimeZoneOffset,
            this.serverTime = serverTime.getTime(), this.clientTime = this.UTC - this.clientTimeZoneOffset,
            this.observeList = [".OGameClock", ".ogl_backTimer", ".ogl_backWrapper"],
            this.updateList = [".OGameClock", ".arrivalTime", ".absTime", ".nextabsTime", ".ui-dialog .msg_date"],
            this.productionBoxes = {
                restTimebuilding: "productionboxbuildingcomponent",
                restTimeresearch: "productionboxresearchcomponent",
                restTimeship2: "productionboxshipyardcomponent",
                restTimelfbuilding: "productionboxlfbuildingcomponent",
                restTimelfresearch: "productionboxlfresearchcomponent",
                mecha: "productionboxextendedshipyardcomponent"
            }, "fleetdispatch" == this.ogl.page) {
            let lastLoop = 0, arrivalDom, backDom;
            document.querySelectorAll("#fleet2 #arrivalTime, #fleet2 #returnTime").forEach((e, index) => {
                0 == index ? arrivalDom = Util.addDom("div", {
                    class: "ogl_missionTime ogl_arrival",
                    parent: e.parentNode,
                    child: "loading..."
                }) : backDom = Util.addDom("div", {
                    class: "ogl_missionTime ogl_return",
                    parent: e.parentNode,
                    child: "loading..."
                }), e.remove();
            }), this.timeLoop = noLoop => {
                var arrival, duration, timeObj = this.getObj();
                unsafeWindow.fleetDispatcher && (timeObj.server != lastLoop || noLoop) && (duration = 1e3 * (fleetDispatcher.getDuration() || 0),
                    arrival = new Date(duration + (this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server)),
                    duration = new Date(15 == fleetDispatcher.mission ? 2 * duration + (this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server) + 36e5 * fleetDispatcher.expeditionTime : 5 == fleetDispatcher.mission ? 2 * duration + (this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server) + 36e5 * fleetDispatcher.holdingTime : 2 * duration + (this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server)),
                    arrivalDom.setAttribute("data-output-date", arrival.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })), arrivalDom.setAttribute("data-output-time", arrival.toLocaleTimeString("de-DE")),
                    backDom.setAttribute("data-output-date", duration.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })), backDom.setAttribute("data-output-time", duration.toLocaleTimeString("de-DE")),
                    lastLoop = timeObj.server), noLoop || requestAnimationFrame(() => this.timeLoop());
            }, this.timeLoop();
        }
        var ping = (performance.timing.responseEnd - performance.timing.requestStart) / 1e3, li = Util.addDom("li", {
            class: "ogl_ping",
            child: ping + " s",
            parent: document.querySelector("#bar ul")
        });
        2 <= ping ? li.classList.add("ogl_danger") : 1 <= ping && li.classList.add("ogl_warning"),
            Util.runAsync(this.update, this), Util.runAsync(this.observe, this);
    }
    update(self, domTarget) {
        (self = self || this).updateList.forEach(element => {
            (domTarget ? [domTarget] : document.querySelectorAll(element + ":not(.ogl_updated)")).forEach(target => {
                target.classList.add("ogl_updated");
                var timeObj = self.getObj(self.dateStringToTime(target.innerText)), date = new Date(self.ogl.db.options.useClientTime ? timeObj.client : timeObj.server);
                5 < target.innerText.split(/\.|:| /).length && (target.setAttribute("data-output-date", date.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })), target.setAttribute("data-time-utc", timeObj.utc), target.setAttribute("data-time-server", timeObj.server),
                    target.setAttribute("data-time-client", timeObj.client)), target.setAttribute("data-output-time", date.toLocaleTimeString("de-DE"));
            });
        });
    }
    observe(self) {
        (self = self || this).observeList.forEach(element => {
            document.querySelectorAll(element + ":not(.ogl_observed)").forEach(target => {
                target.classList.add("ogl_observed");
                var action = () => {
                    var timeObj = self.getObj(self.dateStringToTime(target.innerText)), date = new Date(self.ogl.db.options.useClientTime ? timeObj.client : timeObj.server);
                    target.setAttribute("data-output-date", date.toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })), target.setAttribute("data-output-time", date.toLocaleTimeString("de-DE")),
                        target.setAttribute("data-time-utc", timeObj.utc), target.setAttribute("data-time-server", timeObj.server),
                        target.setAttribute("data-time-client", timeObj.client);
                };
                action(), Util.observe(target, {
                    childList: !0
                }, action);
            });
        });
    }
    getObj(time, timeSource) {
        timeSource = timeSource || "server", time = time || ("server" == timeSource ? serverTime : localTime).getTime();
        var timezone = {};
        return timezone.serverOffset = 6e4 * -this.ogl.db.serverData.serverTimeZoneOffsetInMinutes,
            timezone.clientOffset = 6e4 * -this.ogl.db.serverData.localTimeZoneOffsetInMinutes,
            "server" == timeSource ? (timezone.client = time - timezone.serverOffset + timezone.clientOffset,
                timezone.server = time, timezone.utc = time - timezone.serverOffset) : (timezone.client = time,
                    timezone.server = time - timezone.clientOffset + timezone.serverOffset,
                    timezone.utc = time - timezone.clientOffset), timezone;
    }
    convertTimestampToDate(timestamp, full) {
        timestamp = new Date(timestamp);
        let target = Util.addDom("time", {
            child: timestamp.toLocaleTimeString("de-DE")
        });
        return target = full ? Util.addDom("time", {
            child: timestamp.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }) + " " + timestamp.toLocaleTimeString("de-DE")
        }) : target;
    }
    updateMovements() {
        let initialTime = new Date();
        document.querySelectorAll("[data-mission-type]").forEach(fleet => {
            if (!fleet.querySelector(".ogl_backTimer")) {
                let backButton = fleet.querySelector(".reversal_time a");
                if (backButton) {
                    let domElement = Util.addDom("div", {
                        class: "ogl_backTimer ogl_button",
                        parent: fleet.querySelector(".ogl_resourcesBlock"),
                        onclick: () => backButton.click()
                    }), time = backButton.getAttribute("data-tooltip-title") || backButton.getAttribute("title");
                    if (time) {
                        time = (time = (time = (time = time.replace("<br>", " ")).replace(/ \.$/, "")).trim().replace(/[ \.]/g, ":")).split(":"),
                            time = new Date(`${time[4]}-${time[3]}-${time[2]}T${time[5]}:${time[6]}:` + time[7]).getTime(),
                            this.updateBackTimer(initialTime, time, domElement);
                        let wrapper = Util.addDom("div"), interval = (Util.addDom("div", {
                            class: "ogl_backWrapper",
                            parent: wrapper,
                            child: domElement.innerText
                        }), backButton.addEventListener("tooltip", () => backButton._tippy.setContent(wrapper)),
                            setInterval(() => {
                                document.body.contains(fleet) ? this.updateBackTimer(initialTime, time, domElement) : clearInterval(interval);
                            }, 500));
                    }
                }
            }
        });
    }
    updateBackTimer(initialTime, time, domElement) {
        time = this.getObj(time), initialTime = new Date() - initialTime, time = new Date(time.server + 2 * initialTime);
        domElement.innerText = time.toLocaleDateString("de-DE") + " " + time.toLocaleTimeString("de-DE");
    }
    dateStringToTime(str) {
        return 2 == (str = (str = (str = str.split(/\.|:| /)).length <= 5 ? ["01", "01", "2000"].concat(str) : str).map(e => e.padStart(2, "0")))[2].length && (str[2] = "20" + str[2]),
            new Date(str[2] + `-${str[1]}-${str[0]}T${str[3]}:${str[4]}:` + str[5]).getTime();
    }
    timeToHMS(time) {
        return new Date(time).toLocaleTimeString("de-DE", {
            hour12: !1
        });
    }
}

class FetchManager extends Manager {
    load() {
        this.fetched = {
            empire0: 1,
            empire1: 1,
            lf: 1,
            prod: 1
        }, this.apiCooldown = 6048e5, this.pending = [], setInterval(() => this.resolve(), 500);
    }
    resolve() {
        var inProgress;
        this.pending.length < 1 || (inProgress = this.pending.splice(0, 7), Promise.all(inProgress.map(promise => fetch(promise.url).then(response => response.text()).then(text => ({
            result: text,
            callback: promise.callback
        })))).then(reqs => {
            reqs.forEach(req => {
                req.callback(req.result);
            });
        }));
    }
    fetchEmpire() {
        this.ogl._topbar.syncBtn.classList.add("ogl_active"), this.fetched.empire0 = 0;
        for (let i = this.fetched.empire1 = 0; i <= 1; i++) fetch(`${window.location.href.split('?')[0]}?page=ajax&component=empire&ajax=1&planetType=${i}&asJson=1`, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(response => response.json()).then(result => {
            this.ogl._empire.update(JSON.parse(result.mergedArray), i), this.ogl.save(),
                this.fetched["empire" + i] = 1, Object.values(this.fetched).indexOf(0) < 0 && this.ogl._topbar.syncBtn.classList.remove("ogl_active");
        });
    }
    fetchLFBonuses() {
        this.ogl._topbar.syncBtn.classList.add("ogl_active"), this.fetched.lf = 0,
            fetch(`${window.location.href.split('?')[0]}?page=ajax&component=lfbonuses`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            }).then(response => response.text()).then(result => {
                result = new DOMParser().parseFromString(result, "text/html");
                result.querySelector(".lfsettingsContentWrapper") && (this.ogl._empire.getLFBonuses(result),
                    this.ogl.db.lastLFBonusUpdate = Date.now(), this.fetched.lf = 1, Object.values(this.fetched).indexOf(0) < 0) && this.ogl._topbar.syncBtn.classList.remove("ogl_active");
            });
    }
    fetchProductionQueue() {
        this.ogl._topbar.syncBtn.classList.add("ogl_active"), this.fetched.prod = 0,
            fetch(`${window.location.href.split('?')[0]}?page=ajax&component=productionqueue&ajax=1`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            }).then(response => response.text()).then(result => {
                let xml = new DOMParser().parseFromString(result, "text/html"), hasResearch = xml.querySelector(".research time");
                document.querySelectorAll(".planetlink, .moonlink").forEach(planet => {
                    var key, level, entry, id = new URLSearchParams(planet.getAttribute("href")).get("cp").split("#")[0], times = {
                        baseBuilding: xml.querySelector("time.building" + id),
                        ship: xml.querySelector("time.ship" + id),
                        lfBuilding: xml.querySelector("time.lfbuilding" + id),
                        lfResearch: xml.querySelector("time.lfresearch" + id),
                        mechaShip: xml.querySelector("time.ship_2nd" + id)
                    };
                    this.ogl.db.myPlanets[id].upgrades = this.ogl.db.myPlanets[id].upgrades || {};
                    for ([key] of Object.entries(times)) times[key] ? (level = times[key].closest(".productionDetails")?.querySelector(".productionLevel")?.innerText?.replace(/\D/g, "") || "0",
                        (entry = {}).name = times[key].closest(".productionDetails").querySelector(".productionName").childNodes[0].textContent,
                        entry.lvl = parseInt(level), entry.end = 1e3 * parseInt(times[key].getAttribute("data-end")),
                        entry.type = key, this.ogl.db.myPlanets[id].upgrades[key] = [entry]) : this.ogl.db.myPlanets[id].upgrades[key] = [],
                        hasResearch || delete this.ogl.db.myPlanets[id].upgrades.baseResearch;
                }), this.ogl._topbar.checkUpgrade(), this.ogl.db.lastProductionQueueUpdate = Date.now(),
                    this.fetched.prod = 1, Object.values(this.fetched).indexOf(0) < 0 && this.ogl._topbar.syncBtn.classList.remove("ogl_active");
            });
    }
    fetchPlayerAPI(id, name, afterAjax) {
        if (id) {
            let player = this.ogl.db.udb[id] || this.ogl.createPlayer(id);
            player.uid = player.uid || id, player.api = player.api || 0, player.planets = player.planets || [],
                player.name = name || player.name, serverTime.getTime() - player.api > this.apiCooldown ? this.pending.push({
                    url: `https://bridge.hibot.fr/bridge?url=https://${universeUrl}/api/playerData.xml?id=` + player.uid,
                    callback: data => {
                        var xml = new DOMParser().parseFromString(data, "text/html");
                        if (xml.querySelector("playerdata")) {
                            let apiTime = 1e3 * parseInt(xml.querySelector("playerdata").getAttribute("timestamp"));
                            player.name || (player.name = xml.querySelector("playerdata").getAttribute("name")),
                                player.score = player.score || {}, player.score.global = Math.floor(xml.querySelector('positions position[type="0"]').getAttribute("score")),
                                player.score.economy = Math.floor(xml.querySelector('positions position[type="1"]').getAttribute("score")),
                                player.score.research = Math.floor(xml.querySelector('positions position[type="2"]').getAttribute("score")),
                                player.score.lifeform = Math.floor(xml.querySelector('positions position[type="8"]').getAttribute("score")),
                                player.score.military = Math.floor(xml.querySelector('positions position[type="3"]').getAttribute("score")),
                                player.score.globalRanking = Math.floor(xml.querySelector('positions position[type="0"]').innerText),
                                player.score.economyRanking = Math.floor(xml.querySelector('positions position[type="1"]').innerText),
                                player.score.researchRanking = Math.floor(xml.querySelector('positions position[type="2"]').innerText),
                                player.score.lifeformRanking = Math.floor(xml.querySelector('positions position[type="8"]').innerText),
                                player.score.militaryRanking = Math.floor(xml.querySelector('positions position[type="3"]').innerText),
                                player.api = apiTime, xml.querySelectorAll("planet").forEach((element, index) => {
                                    var pid = element.getAttribute("id"), coords = element.getAttribute("coords"), element = element.querySelector("moon")?.getAttribute("id"), planet = (this.ogl.db.pdb[coords] = this.ogl.db.pdb[coords] || {},
                                        this.ogl.db.pdb[coords]);
                                    planet.api = planet.api || 0, planet.api <= apiTime && (planet.uid = player.uid,
                                        planet.pid = pid, planet.mid = element, planet.coo = coords,
                                        planet.api = apiTime, 0 == index) && (planet.home = !0),
                                        player.planets.indexOf(coords) < 0 && player.planets.push(coords);
                                }), player.planets.forEach((coords, index) => {
                                    this.ogl.db.pdb[coords]?.api < apiTime && (player.planets.splice(index, 1),
                                        this.ogl.db.pdb[coords].uid == player.uid) && delete this.ogl.db.pdb[coords];
                                }), afterAjax && afterAjax();
                        } else this.ogl.db.currentSide == player.uid && (delete this.ogl.db.udb[id],
                            xml = Util.addDom("div"), Util.addDom("div", {
                                parent: xml,
                                class: "material-icons ogl_back",
                                child: "arrow_back",
                                onclick: () => {
                                    this.ogl._topbar.openPinned();
                                }
                            }), Util.addDom("div", {
                                parent: xml,
                                child: data
                            }), this.ogl._ui.openSide(xml, player.uid));
                    }
                }) : afterAjax && afterAjax(!1);
        }
    }
}

class UIManager extends Manager {
    load(reloaded) {
        document.querySelector("#planetList").classList.add("ogl_ogameDiv"), document.querySelector(".ogl_side") || (this.side = Util.addDom("div", {
            class: "ogl_side " + (this.ogl.db.currentSide ? "ogl_active" : ""),
            parent: document.body
        })), document.querySelector(".ogl_recap") || (this.resourceDiv = Util.addDom("div", {
            class: "ogl_recap",
            parent: document.querySelector("#planetList")
        }), Util.addDom("div", {
            class: "ogl_icon ogl_metal",
            parent: this.resourceDiv,
            child: "0"
        }), Util.addDom("div", {
            class: "ogl_icon ogl_crystal",
            parent: this.resourceDiv,
            child: "0"
        }), Util.addDom("div", {
            class: "ogl_icon ogl_deut",
            parent: this.resourceDiv,
            child: "0"
        }), Util.addDom("div", {
            class: "ogl_icon ogl_msu",
            parent: this.resourceDiv,
            child: "0"
        })), reloaded || (Util.addDom("li", {
            before: document.querySelector("#bar .OGameClock"),
            child: document.querySelector("#countColonies").innerText
        }), this.checkImportExport(), this.updateLeftMenu(), this.updateFooter()),
            this.attachGlobalClickEvent(reloaded), this.displayResourcesRecap(), this.groupPlanets(),
            "highscore" != this.ogl.page || reloaded || (this.updateHighscore(), this.updateStatus());
    }
    openSide(dom, pin, buttonSource) {
        var closeBtn = Util.addDom("div", {
            class: "material-icons ogl_close",
            child: "close",
            onclick: () => {
                this.side.classList.remove("ogl_active"), delete this.ogl.db.currentSide,
                    this.ogl._shortcut.load(), this.ogl._shortcut.updateShortcutsPosition();
            }
        });
        buttonSource && this.ogl.db.currentSide == pin && !this.side.querySelector(".ogl_loading") ? closeBtn.click() : (this.side.innerText = "",
            this.side.appendChild(closeBtn), this.side.appendChild(dom), this.side.classList.add("ogl_active"),
            this.lastOpenedSide != pin && this.ogl._shortcut.load(), this.ogl.db.currentSide = pin,
            this.lastOpenedSide = pin, this.ogl._shortcut.updateShortcutsPosition(),
            document.querySelectorAll(".ogl_inputCheck").forEach(e => Util.formatInput(e)),
            this.ogl._tooltip && this.ogl._tooltip.initTooltipList(this.side.querySelectorAll(getTooltipSelector())));
    }
    attachGlobalClickEvent(reloaded) {
        reloaded || (document.addEventListener("keyup", event => {
            var activeElement = document.activeElement.tagName;
            "INPUT" != activeElement && "TEXTAREA" != activeElement || document.activeElement.classList.contains("ogl_inputCheck") && Util.formatInput(document.activeElement);
        }), document.querySelectorAll(".planetlink, .moonlink").forEach(target => {
            target.addEventListener("pointerenter", event => {
                var coords, type;
                unsafeWindow.fleetDispatcher && this.ogl._fleet?.isReady && document.body.classList.contains("ogl_destinationPicker") && (fleetDispatcher.fetchTargetPlayerDataTimeout || (coords = event.target.closest(".smallplanet").querySelector(".planet-koords").innerText.split(":"),
                    event = (3 == (type = event.target.classList.contains("moonlink") ? 3 : 1) ? event.target.querySelector(".icon-moon") : event.target.querySelector(".planetPic")).getAttribute("alt"),
                    document.querySelector("#galaxy").value = fleetDispatcher.targetPlanet.galaxy,
                    document.querySelector("#system").value = fleetDispatcher.targetPlanet.system,
                    document.querySelector("#position").value = fleetDispatcher.targetPlanet.position,
                    fleetDispatcher.targetPlanet.type = type, fleetDispatcher.targetPlanet.galaxy = coords[0],
                    fleetDispatcher.targetPlanet.system = coords[1], fleetDispatcher.targetPlanet.position = coords[2],
                    fleetDispatcher.targetPlanet.name = event, fleetDispatcher.refresh()));
            }), target.addEventListener("pointerleave", () => {
                /Android|iPhone/i.test(navigator.userAgent) || unsafeWindow.fleetDispatcher && this.ogl._fleet?.isReady && document.body.classList.contains("ogl_destinationPicker") && (document.querySelector("#galaxy").value = fleetDispatcher.realTarget.galaxy,
                    document.querySelector("#system").value = fleetDispatcher.realTarget.system,
                    document.querySelector("#position").value = fleetDispatcher.realTarget.position,
                    fleetDispatcher.targetPlanet.galaxy = fleetDispatcher.realTarget.galaxy,
                    fleetDispatcher.targetPlanet.system = fleetDispatcher.realTarget.system,
                    fleetDispatcher.targetPlanet.position = fleetDispatcher.realTarget.position,
                    fleetDispatcher.targetPlanet.type = fleetDispatcher.realTarget.type,
                    fleetDispatcher.targetPlanet.name = fleetDispatcher.realTarget.name,
                    fleetDispatcher.refresh());
            });
        }), document.addEventListener("click", event => {
            if ("svg" != event.target.tagName && "path" != event.target.tagName) {
                var coords;
                if (event.target.getAttribute("data-galaxy") && (coords = event.target.getAttribute("data-galaxy").split(":"),
                    "galaxy" === this.ogl.page ? (galaxy = coords[0], system = coords[1],
                        loadContentNew(galaxy, system)) : (coords = `${window.location.href.split('?')[0]}?page=ingame&component=galaxy&galaxy=${coords[0]}&system=` + coords[1],
                            event.ctrlKey ? window.open(coords, "_blank") : window.location.href = coords)),
                    (event.target.classList.contains("planetlink") || event.target.classList.contains("moonlink") || event.target.closest(".planetlink, .moonlink")) && document.body.classList.contains("ogl_destinationPicker")) {
                    event.preventDefault();
                    let coords = event.target.closest(".smallplanet").querySelector(".planet-koords").innerText.split(":");
                    var type = event.target.closest(".planetlink, .moonlink").classList.contains("moonlink") ? 3 : 1, name = (3 == type ? event.target.closest(".smallplanet").querySelector(".icon-moon") : event.target.closest(".smallplanet").querySelector(".planetPic")).getAttribute("alt"), planet = this.ogl.account.planets.getByCoords(coords.join(":")), planet = 3 == type ? planet.moonID : planet.id;
                    if (document.body.classList.contains("ogl_initHarvest")) {
                        var firstSource = this.ogl.account.planets.getCurrent(), firstSource = "moon" == firstSource.currentType ? firstSource.moonID : firstSource.id;
                        window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=${type}&oglmode=1&ogldestinationid=${planet}&oglfirstsourceid=${firstSource}&ogldestinationtype=` + (3 == type ? "moon" : "planet");
                    } else {
                        if (!unsafeWindow.fleetDispatcher || !this.ogl._fleet?.isReady) return;
                        fleetDispatcher.targetPlanet.type = type, fleetDispatcher.targetPlanet.galaxy = coords[0],
                            fleetDispatcher.targetPlanet.system = coords[1], fleetDispatcher.targetPlanet.position = coords[2],
                            fleetDispatcher.targetPlanet.name = name, fleetDispatcher.refresh(),
                            this.ogl._fleet.setRealTarget(JSON.parse(JSON.stringify(fleetDispatcher.targetPlanet))),
                            "fleet1" == fleetDispatcher.currentPage ? fleetDispatcher.focusSubmitFleet1() : "fleet2" == fleetDispatcher.currentPage && (fleetDispatcher.focusSendFleet(),
                                fleetDispatcher.updateTarget());
                    }
                }
                event.target.getAttribute("data-api-code") && (navigator.clipboard.writeText(event.target.getAttribute("data-api-code")),
                    fadeBox("API code copied")), event.target.classList.contains("js_actionKillAll") && 20 == ogame?.messages?.getCurrentMessageTab() && (ogl.cache.reports = {});
            }
        }));
    }
    openFleetProfile() {
        var container = Util.addDom("div", {
            class: "ogl_keeper"
        }), leftSide = (Util.addDom("h2", {
            child: "Limiters",
            parent: container
        }), Util.addDom("div", {
            parent: container
        }));
        let limitResourceLabel = Util.addDom("label", {
            class: "ogl_limiterLabel tooltip",
            "data-limiter-type": "resource",
            title: this.ogl._lang.find("resourceLimiter"),
            parent: leftSide,
            child: "Resources"
        });
        var limitResourceCheckbox = Util.addDom("input", {
            type: "checkbox",
            parent: limitResourceLabel,
            onclick: () => {
                this.ogl.db.fleetLimiter.resourceActive = !this.ogl.db.fleetLimiter.resourceActive,
                    this.ogl._fleet.updateLimiter(), document.querySelectorAll(`[data-limiter-type="${limitResourceLabel.getAttribute("data-limiter-type")}"] input`).forEach(e => e.checked = this.ogl.db.fleetLimiter.resourceActive);
            }
        });
        let resourceContainer = Util.addDom("div", {
            parent: leftSide,
            class: "ogl_resourceLimiter"
        }), limitShipLabel = (Util.addDom("br", {
            parent: leftSide
        }), Util.addDom("label", {
            class: "ogl_limiterLabel tooltip",
            "data-limiter-type": "ship",
            title: this.ogl._lang.find("fleetLimiter"),
            parent: leftSide,
            child: "Ships"
        }));
        var limitShipCheckbox = Util.addDom("input", {
            type: "checkbox",
            parent: limitShipLabel,
            onclick: () => {
                this.ogl.db.fleetLimiter.shipActive = !this.ogl.db.fleetLimiter.shipActive,
                    this.ogl._fleet.updateLimiter(), document.querySelectorAll(`[data-limiter-type="${limitShipLabel.getAttribute("data-limiter-type")}"] input`).forEach(e => e.checked = this.ogl.db.fleetLimiter.shipActive);
            }
        });
        let fleetContainer = Util.addDom("div", {
            parent: leftSide,
            class: "ogl_shipLimiter"
        }), limitJumpgateLabel = (Util.addDom("br", {
            parent: leftSide
        }), Util.addDom("label", {
            class: "ogl_limiterLabel tooltip",
            "data-limiter-type": "jumpgate",
            title: this.ogl._lang.find("fleetLimiter"),
            parent: leftSide,
            child: "Jumpgate"
        }));
        var limitJumpgateCheckbox = Util.addDom("input", {
            type: "checkbox",
            parent: limitJumpgateLabel,
            onclick: () => {
                this.ogl.db.fleetLimiter.jumpgateActive = !this.ogl.db.fleetLimiter.jumpgateActive,
                    this.ogl._jumpgate.updateLimiter(), document.querySelectorAll(`[data-limiter-type="${limitJumpgateLabel.getAttribute("data-limiter-type")}"] input`).forEach(e => e.checked = this.ogl.db.fleetLimiter.jumpgateActive);
            }
        });
        let jumpgateContainer = Util.addDom("div", {
            parent: leftSide,
            class: "ogl_jumpgateLimiter"
        });
        return this.ogl.db.fleetLimiter.resourceActive && (limitResourceCheckbox.checked = !0),
            this.ogl.db.fleetLimiter.shipActive && (limitShipCheckbox.checked = !0),
            this.ogl.db.fleetLimiter.jumpgateActive && (limitJumpgateCheckbox.checked = !0),
            Object.keys(this.ogl.resourcesKeys).concat(this.ogl.shipsList).forEach(id => {
                if ("population" != id && "darkmatter" != id && "energy" != id) {
                    var parent = isNaN(id) ? resourceContainer : fleetContainer, parent = Util.addDom("div", {
                        parent: parent,
                        class: "ogl_icon ogl_" + id,
                        "data-id": id
                    });
                    let input = Util.addDom("input", {
                        class: "ogl_inputCheck",
                        parent: parent,
                        value: this.ogl.db.fleetLimiter.data[id] || 0,
                        oninput: () => {
                            setTimeout(() => {
                                this.ogl.db.fleetLimiter.data[id] = parseInt(input.value.replace(/\D/g, "")) || 0,
                                    this.ogl._fleet.updateLimiter(!0);
                            }, 200);
                        }
                    });
                    if (!isNaN(id)) {
                        parent = Util.addDom("div", {
                            parent: jumpgateContainer,
                            class: "ogl_icon ogl_" + id,
                            "data-id": id
                        });
                        let jumpgateInput = Util.addDom("input", {
                            class: "ogl_inputCheck",
                            parent: parent,
                            value: this.ogl.db.fleetLimiter.jumpgateData[id] || 0,
                            oninput: () => {
                                setTimeout(() => {
                                    this.ogl.db.fleetLimiter.jumpgateData[id] = parseInt(jumpgateInput.value.replace(/\D/g, "")) || 0,
                                        this.ogl._fleet.updateLimiter();
                                }, 200);
                            }
                        });
                    }
                }
            }), container.querySelectorAll(".ogl_inputCheck").forEach(e => Util.formatInput(e)),
            container;
    }
    openKeyboardActions() {
        let container = Util.addDom("div", {
            class: "ogl_keyboardActions"
        }), changes = {};
        return Util.addDom("h2", {
            parent: container,
            child: this.ogl._lang.find("keyboardActions")
        }), Object.entries(this.ogl.db.options.keyboardActions).forEach(key => {
            var label = Util.addDom("label", {
                parent: container,
                child: "" + this.ogl._lang.find(key[0])
            });
            let input = Util.addDom("input", {
                maxlength: "1",
                type: "text",
                value: key[1],
                parent: label,
                onclick: () => {
                    input.value = "", input.select();
                },
                onblur: () => {
                    "" == input.value && (input.value = key[1]);
                },
                onkeyup: event => {
                    "enter" != event.key.toLowerCase() && (changes[key[0]] = event.key.toLowerCase(),
                        input.value = event.key.toLowerCase());
                }
            });
            "fleetResourcesSplit" == key[0] && (input.classList.add("ogl_disabled"),
                input.disabled = !0);
        }), Util.addDom("button", {
            parent: container,
            class: "ogl_button",
            child: "save",
            onclick: () => {
                Object.entries(changes).forEach(key => {
                    this.ogl.db.options.keyboardActions[key[0]] = changes[key[0]],
                        window.location.reload();
                });
            }
        }), container;
    }
    openExpeditionFiller() {
        let container = Util.addDom("div", {
            class: "ogl_expeditionFiller"
        });
        return Util.addDom("h2", {
            parent: container,
            child: this.ogl._lang.find("expeditionBigShips")
        }), [204, 205, 206, 207, 215, 211, 213, 218].forEach(shipID => {
            let item = Util.addDom("div", {
                class: "ogl_icon ogl_" + shipID,
                parent: container,
                onclick: () => {
                    -1 < this.ogl.db.options.expeditionBigShips.indexOf(shipID) ? (this.ogl.db.options.expeditionBigShips = this.ogl.db.options.expeditionBigShips.filter(a => a !== shipID),
                        item.classList.remove("ogl_active")) : (this.ogl.db.options.expeditionBigShips.push(shipID),
                            item.classList.add("ogl_active"));
                }
            });
            -1 < this.ogl.db.options.expeditionBigShips.indexOf(shipID) && item.classList.add("ogl_active");
        }), container;
    }
    openDataManager() {
        var container = Util.addDom("div", {
            class: "ogl_manageData"
        }), grid = (Util.addDom("h2", {
            parent: container,
            child: this.ogl._lang.find("manageData")
        }), Util.addDom("div", {
            class: "ogl_grid",
            parent: container
        }));
        Util.addDom("label", {
            class: "ogl_button",
            for: "ogl_import",
            child: "Import data",
            parent: grid
        });
        let importButton = Util.addDom("input", {
            id: "ogl_import",
            class: "ogl_hidden",
            accept: "application/JSON",
            type: "file",
            parent: grid,
            onchange: () => {
                var file = importButton.files[0];
                let reader = new FileReader();
                reader.onload = () => {
                    let json, error;
                    try {
                        json = JSON.parse(reader.result);
                    } catch (e) {
                        error = "cannot read file";
                    }
                    !error && json && 10 < json.dataFormat ? (this.ogl.db = json,
                        document.location.reload()) : this.ogl._notification.addToQueue("Error, " + (error || "wrong data format"), !1);
                }, reader.readAsText(file);
            }
        });
        return Util.addDom("a", {
            class: "ogl_button",
            download: `oglight_${this.ogl.server.name}_${this.ogl.server.lang}_` + serverTime.getTime(),
            child: "Export data",
            parent: grid,
            href: URL.createObjectURL(new Blob([JSON.stringify(this.ogl.db)], {
                type: "application/json"
            }))
        }), Util.addDom("hr", {
            parent: grid
        }), Util.addDom("div", {
            class: "ogl_button ogl_danger",
            child: this.ogl._lang.find("resetStats") + ' <i class="material-icons">donut_large</i>',
            parent: grid,
            onclick: () => {
                confirm(this.ogl._lang.find("resetStatsLong")) && (this.ogl.cache.raids = {},
                    this.ogl.db.stats = {}, window.location.reload(), this.ogl.db.initialTime = Date.now());
            }
        }), Util.addDom("div", {
            class: "ogl_button ogl_danger",
            child: this.ogl._lang.find("resetTaggedPlanets") + ' <i class="material-icons">stroke_full</i>',
            parent: grid,
            onclick: () => {
                confirm(this.ogl._lang.find("resetTaggedPlanetsLong")) && (this.ogl.db.tdb = {},
                    this.ogl.db.quickRaidList = [], window.location.reload());
            }
        }), Util.addDom("div", {
            class: "ogl_button ogl_danger",
            child: this.ogl._lang.find("resetPinnedPlayers") + ' <i class="material-icons">push_pin</i>',
            parent: grid,
            onclick: () => {
                confirm(this.ogl._lang.find("resetPinnedPlayersLong")) && (this.ogl.db.lastStatusUpdate = 0,
                    this.ogl.db.lastGlobalScoreUpdate = 0, this.ogl.db.pdb = {}, this.ogl.db.udb = {},
                    this.ogl.db.lastPinnedList = [], this.ogl.db.quickRaidList = [],
                    window.location.reload());
            }
        }), Util.addDom("div", {
            class: "ogl_button ogl_danger",
            child: this.ogl._lang.find("resetAll"),
            parent: grid,
            onclick: () => {
                confirm(this.ogl._lang.find("resetAllLong")) && (this.ogl.cache = {},
                    this.ogl.db = {}, window.location.reload(), this.ogl.db.initialTime = Date.now());
            }
        }), container;
    }
    groupPlanets() {
        let lastCoords = 0, group = 1;
        document.querySelectorAll(".smallplanet").forEach(planet => {
            var newCoords = Util.coordsToID(planet.querySelector(".planet-koords").innerText).slice(0, -3);
            lastCoords === newCoords ? planet.setAttribute("data-group", group) : planet.previousElementSibling?.getAttribute("data-group") && group++,
                lastCoords = newCoords;
        });
    }
    checkImportExport() {
        (this.ogl.db.nextImportExport || 0) < Date.now() && document.querySelector(".menubutton[href*=traderOverview]").classList.add("ogl_active"),
            window.addEventListener("beforeunload", () => {
                var tomorow, textTarget = document.querySelector(".bargain_text"), button = document.querySelector(".import_bargain.hidden");
                textTarget && button ? (button = new Date(serverTime.getTime()), tomorow = new Date(serverTime.getTime() + 864e5),
                    textTarget.innerText.match(/\d+/g) ? this.ogl.db.nextImportExport = new Date(button.getFullYear(), button.getMonth(), button.getDate(), textTarget.innerText.match(/\d+/g)[0], 0, 0).getTime() : this.ogl.db.nextImportExport = new Date(tomorow.getFullYear(), tomorow.getMonth(), tomorow.getDate(), 0, 0, 1).getTime(),
                    this.ogl.save()) : textTarget && "" == textTarget.innerText && (this.ogl.db.nextImportExport = serverTime.getTime(),
                        this.ogl.save());
            });
    }
    getPlayerStatus(id, status) {
        status = status ? {
            status: status
        } : this.ogl.db.udb[id];
        if (status) return {
            statusClass: id = this.ogl._highscore.tagToNameList[status.status],
            statusTag: "status_abbr_inactive" === id ? this.ogl.db.serverData.inactive : "status_abbr_longinactive" === id ? this.ogl.db.serverData.inactiveLong : "status_abbr_banned" === id ? this.ogl.db.serverData.banned : "status_abbr_vacation" === id && this.ogl.db.serverData.vacation
        };
    }
    turnIntoPlayerLink(id, dom, name, status) {
        dom.closest(".ogl_spyLine") || (dom.setAttribute("title", "loading..."),
            dom.classList.add("tooltipUpdate"), dom.classList.add("tooltipRight"), dom.classList.add("tooltipClose")),
            (status || this.ogl.db.udb?.[id]?.status) && (dom.className = dom.className.replaceAll(/status_abbr_[a-zA-Z]+/g, ""),
                status = this.getPlayerStatus(id, status), dom.setAttribute("data-status-tag", status.statusTag),
                dom.classList.add(status.statusClass)), dom.addEventListener("click", event => {
                    dom.closest(".ogl_spyLine") || id == this.ogl.account.id || event.ctrlKey || (event.preventDefault(),
                        this.ogl._topbar.openPinnedDetail(id));
                }), dom.addEventListener("tooltip", () => {
                    var loading = Util.addDom("div", {
                        child: '<div class="ogl_loading"></div>'
                    });
                    dom._tippy.setContent(loading), this.ogl._fetch.fetchPlayerAPI(id, name, () => {
                        setTimeout(() => {
                            dom._tippy.setContent(this.getPlayerTooltip(id)), document.querySelector(".ogl_pinDetail") && this.ogl.db.currentSide == id && this.ogl._topbar.openPinnedDetail(id);
                        }, 100);
                    });
                });
    }
    getPlayerTooltip(id) {
        let player = this.ogl.db.udb[id];
        var page = Math.ceil(player.score.globalRanking / 100), page = Util.addDom("div", {
            class: "ogl_playerData",
            child: `
            <h1 class="${this.ogl._highscore.tagToNameList[player.status] || "status_abbr_active"}">${player.name} <a href="${window.location.href.split('?')[0]}?page=highscore&site=${page}&searchRelId=${id}">#${player.score.globalRanking}</a></h1>
            <div class="ogl_grid">
                <div class="ogl_tagSelector material-icons"></div>
                <div class="ogl_leftSide">
                    <div class="ogl_actions"></div>
                    <div class="ogl_score">
                        <div class="ogl_line"><i class="material-icons">trending_up</i><div>${Util.formatNumber(player.score.global)}</div></div>
                        <div class="ogl_line"><i class="material-icons">diamond</i><div>${Util.formatNumber(player.score.economy)}</div></div>
                        <div class="ogl_line"><i class="material-icons">science</i><div>${Util.formatNumber(player.score.research)}</div></div>
                        <div class="ogl_line"><i class="material-icons">genetics</i><div>${Util.formatNumber(player.score.lifeform)}</div></div>
                        <div class="ogl_line"><i class="material-icons">rocket_launch</i><div>${Util.formatNumber(Util.getPlayerScoreFD(player.score, "fleet"))}</div></div>
                        <div class="ogl_line"><i class="material-icons">security</i><div>${Util.formatNumber(Util.getPlayerScoreFD(player.score, "defense"))}</div></div>
                        <div class="ogl_line"><i class="material-icons">schedule</i><div>${new Date(player.api).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })}</div></div>
                    </div>
                </div>
                <div class="ogl_planetStalk"></div>
            </div>`
        }), writeIcon = Util.addDom("div", {
            child: "edit",
            class: "material-icons ogl_button",
            parent: page.querySelector(".ogl_actions"),
            onclick: () => {
                document.querySelector("#chatBar") || (window.location.href = `${window.location.href.split('?')[0]}?page=chat&playerId=` + player.uid);
            }
        });
        document.querySelector("#chatBar") && (writeIcon.classList.add("js_openChat"),
            writeIcon.setAttribute("data-playerId", player.uid)), Util.addDom("a", {
                child: "account-plus",
                class: "material-icons ogl_button overlay",
                parent: page.querySelector(".ogl_actions"),
                href: `${window.location.href.split('?')[0]}?page=ingame&component=buddies&action=7&id=${player.uid}&ajax=1`,
                onclick: () => {
                    tippy.hideAll();
                }
            }), Util.addDom("div", {
                child: "block",
                class: "material-icons ogl_button",
                parent: page.querySelector(".ogl_actions"),
                onclick: () => {
                    window.location.href = `${window.location.href.split('?')[0]}?page=ignorelist&action=1&id=` + player.uid;
                }
            }), Util.addDom("div", {
                child: "query_stats",
                class: "material-icons ogl_button",
                parent: page.querySelector(".ogl_actions"),
                onclick: () => {
                    window.open(Util.genMmorpgstatLink(this.ogl, player.uid), "_blank");
                }
            }), id != this.ogl.account.id && Util.addDom("div", {
                child: "arrow_forward",
                class: "material-icons ogl_button",
                parent: page.querySelector(".ogl_actions"),
                onclick: () => {
                    this.ogl._topbar.openPinnedDetail(player.uid);
                }
            });
        let planetList = page.querySelector(".ogl_planetStalk"), lastCoords = 0, group = 1;
        if (player.planets.sort((a, b) => Util.coordsToID(a) - Util.coordsToID(b)).forEach((planet, index) => {
            var coords = planet.split(":"), index = Util.addDom("div", {
                parent: planetList,
                child: `<div>${index + 1}</div><div data-galaxy="${coords[0]}:${coords[1]}">${planet}</div>`
            }), newCoords = Util.coordsToID(coords).slice(0, -3);
            lastCoords === newCoords ? index.setAttribute("data-group", group) : index.previousElementSibling?.getAttribute("data-group") && group++,
                lastCoords = newCoords, this.ogl.db.pdb[planet]?.home && index.classList.add("ogl_home"),
                unsafeWindow.galaxy == coords[0] && unsafeWindow.system == coords[1] && index.querySelector("[data-galaxy]").classList.add("ogl_active"),
                this.addSpyIcons(index, coords), this.ogl._ui.addTagButton(index, coords, !0);
        }), player.uid != this.ogl.account.id) {
            let tagSelector = page.querySelector(".ogl_tagSelector");
            Object.keys(this.ogl.db.tags).forEach(tag => {
                Util.addDom("div", {
                    parent: tagSelector,
                    "data-tag": tag,
                    onclick: () => {
                        player.planets.forEach(planet => {
                            planet = Util.coordsToID(planet.split(":"));
                            "none" != tag ? (this.ogl.db.tdb[planet] = {
                                tag: tag
                            }, document.querySelectorAll(`.ogl_tagPicker[data-raw="${planet}"]`).forEach(e => e.setAttribute("data-tag", tag))) : this.ogl.db.tdb[planet] && (delete this.ogl.db.tdb[planet],
                                document.querySelectorAll(`.ogl_tagPicker[data-raw="${planet}"]`).forEach(e => e.removeAttribute("data-tag")));
                        });
                    }
                });
            });
        }
        return page;
    }
    addPinButton(element, id) {
        var player = this.ogl.db.udb[id];
        let div = Util.addDom("div", {
            title: "loading...",
            class: "ogl_flagPicker material-icons tooltipLeft tooltipClick tooltipClose tooltipUpdate",
            "data-uid": id,
            parent: element,
            ontooltip: event => {
                div._tippy.setContent(tooltip);
            },
            onclick: event => {
                event.shiftKey && (event.preventDefault(), "none" == this.ogl.db.lastPinUsed && this.ogl.db.udb[id] ? (delete this.ogl.db.udb[id].pin,
                    document.querySelectorAll(`.ogl_flagPicker[data-uid="${id}"]`).forEach(e => {
                        e.removeAttribute("data-flag"), e.innerText = "";
                    })) : (this.ogl.db.udb[id] = this.ogl.db.udb[id] || this.ogl.createPlayer(id),
                        this.ogl.db.udb[id].pin = this.ogl.db.lastPinUsed, document.querySelectorAll(`.ogl_flagPicker[data-uid="${id}"]`).forEach(e => {
                            e.setAttribute("data-flag", this.ogl.db.lastPinUsed);
                        })));
            }
        }), tooltip = Util.addDom("div", {
            class: "ogl_flagSelector material-icons"
        });
        this.ogl.flagsList.forEach(pin => {
            "ptre" == pin && !this.ogl.ptreKey || Util.addDom("div", {
                "data-flag": pin,
                parent: tooltip,
                onclick: () => {
                    "none" == pin && this.ogl.db.udb[id] ? (delete this.ogl.db.udb[id].pin,
                        document.querySelectorAll(`.ogl_flagPicker[data-uid="${id}"]`).forEach(e => {
                            e.removeAttribute("data-flag"), e.innerText = "";
                        })) : (this.ogl.db.udb[id] = this.ogl.db.udb[id] || this.ogl.createPlayer(id),
                            this.ogl.db.udb[id].pin = pin, document.querySelectorAll(`.ogl_flagPicker[data-uid="${id}"]`).forEach(e => {
                                e.setAttribute("data-flag", pin);
                            })), "none" != (this.ogl.db.lastPinUsed = pin) && this.ogl._topbar.openPinnedDetail(id),
                        tippy.hideAll();
                }
            });
        }), player?.pin && div.setAttribute("data-flag", player.pin);
    }
    addTagButton(element, coords, disabled) {
        let raw = Util.coordsToID(coords);
        coords = this.ogl.db.tdb[raw];
        let div = Util.addDom("div", {
            title: "loading...",
            class: "ogl_tagPicker material-icons tooltipLeft tooltipClick tooltipClose tooltipUpdate",
            "data-raw": raw,
            parent: element,
            ontooltip: event => {
                disabled || div._tippy.setContent(tooltip);
            },
            onclick: event => {
                event.shiftKey && !disabled && ("none" == this.ogl.db.lastTagUsed && this.ogl.db.tdb[raw] ? (delete this.ogl.db.tdb[raw],
                    document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.removeAttribute("data-tag"))) : (this.ogl.db.tdb[raw] = this.ogl.db.tdb[raw] || {},
                        this.ogl.db.tdb[raw].tag = this.ogl.db.lastTagUsed, document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.setAttribute("data-tag", this.ogl.db.lastTagUsed))));
            }
        }), tooltip = Util.addDom("div", {
            class: "ogl_tagSelector material-icons"
        });
        Object.keys(this.ogl.db.tags).forEach(tag => {
            Util.addDom("div", {
                "data-tag": tag,
                parent: tooltip,
                onclick: () => {
                    "none" == tag && this.ogl.db.tdb[raw] ? (delete this.ogl.db.tdb[raw],
                        document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.removeAttribute("data-tag"))) : (this.ogl.db.tdb[raw] = this.ogl.db.tdb[raw] || {},
                            this.ogl.db.tdb[raw].tag = tag, document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.setAttribute("data-tag", tag))),
                        this.ogl.db.lastTagUsed = tag, tippy.hideAll();
                }
            });
        }), coords?.tag && div.setAttribute("data-tag", coords.tag);
    }
    addSpyIcons(parent, coords, uniqueType, displayActivity) {
        var planetIcon, activityDom;
        if (coords = "string" == typeof coords ? coords.split(":") : coords, "planet" != uniqueType && uniqueType || (planetIcon = Util.addDom("div", {
            class: "material-icons ogl_spyIcon",
            "data-spy-coords": `${coords[0]}:${coords[1]}:${coords[2]}:1`,
            child: "language",
            parent: parent,
            onclick: e => window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=1`
        }), lastPlanetSpy = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.spy?.[0] || 0,
            serverTime.getTime() - lastPlanetSpy < this.ogl.db.options.spyIndicatorDelay && (planetIcon.setAttribute("data-spy", "recent"),
                planetIcon.setAttribute("title", "recently spied")), displayActivity && (lastPlanetSpy = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.acti || [],
                    isRecent = serverTime.getTime() - lastPlanetSpy[2] < 36e5, activityDom = Util.addDom("span", {
                        parent: planetIcon,
                        child: isRecent ? lastPlanetSpy[0] : "?"
                    }), "*" == lastPlanetSpy[0] && isRecent ? activityDom.classList.add("ogl_danger") : 60 == lastPlanetSpy[0] && isRecent ? activityDom.classList.add("ogl_ok") : activityDom.classList.add("ogl_warning")),
            Object.values(ogl.cache.movements).flat().find(e => e.to.coords == `${coords[0]}:${coords[1]}:` + coords[2] && !e.to.isMoon && 1 == e.mission && !e.isBack) && planetIcon.classList.add("ogl_attacked")),
            "moon" == uniqueType || !uniqueType && this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.mid) {
            var lastPlanetSpy = 0 < this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.mid ? Util.addDom("div", {
                class: "material-icons ogl_spyIcon",
                "data-spy-coords": `${coords[0]}:${coords[1]}:${coords[2]}:3`,
                child: "bedtime",
                parent: parent,
                onclick: e => window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=3`
            }) : Util.addDom("div", {
                parent: parent
            }), isRecent = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.spy?.[1] || 0;
            if (serverTime.getTime() - isRecent < this.ogl.db.options.spyIndicatorDelay && (lastPlanetSpy.setAttribute("data-spy", "recent"),
                lastPlanetSpy.setAttribute("title", "recently spied")), displayActivity && -1 < this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.mid) {
                let activity = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.acti || [], isRecent = serverTime.getTime() - activity[2] < 36e5, activityDom = Util.addDom("span", {
                    parent: lastPlanetSpy,
                    child: isRecent ? activity[1] : "?"
                });
                "*" == activity[1] && isRecent ? activityDom.classList.add("ogl_danger") : 60 == activity[1] && isRecent ? activityDom.classList.add("ogl_ok") : activityDom.classList.add("ogl_warning");
            }
            Object.values(ogl.cache.movements).flat().find(e => e.to.coords == `${coords[0]}:${coords[1]}:` + coords[2] && e.to.isMoon && 1 == e.mission && !e.isBack) && lastPlanetSpy.classList.add("ogl_attacked");
        }
        uniqueType || this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.mid || Util.addDom("div", {
            parent: parent
        });
    }
    updateLeftMenu() {
        var leftMenu = document.querySelector("#menuTable"), version = oglVersion, oglBlock = Util.addDom("li", {
            parent: leftMenu
        });
        Util.addDom("span", {
            parent: oglBlock,
            class: "menu_icon ogl_leftMenuIcon",
            child: '<a class="tooltipRight" href="http://openuserjs.org/scripts/nullNaN/OGLight" target="_blank"><i class="material-icons">oglight_simple</i></a>'
        });
        Util.addDom("a", {
            parent: oglBlock,
            class: "menubutton tooltipRight",
            href: "http://board.fr.ogame.gameforge.com/index.php?thread/722955-oglight/",
            target: "_blank",
            child: `<span class="textlabel">OGLight ${version}</span>`
        }), this.ogl.ptreKey && (oglBlock = Util.addDom("li", {
            parent: leftMenu
        }), Util.addDom("span", {
            parent: oglBlock,
            class: "menu_icon ogl_leftMenuIcon ogl_ptreActionIcon",
            child: '<a class="tooltipRight" title="PTRE last request status" href="#"><i class="material-icons">sync_alt</i></a>',
            onclick: () => this.ogl.PTRE.displayLogs()
        }), Util.addDom("a", {
            parent: oglBlock,
            class: "menubutton tooltipRight",
            href: "http://ptre.chez.gg/",
            target: "_blank",
            child: '<span class="textlabel">PTRE</span>'
        }));
    }
    updateFooter() {
        var footer = document.querySelector("#siteFooter .fright"), lang = ["fr", "de", "en", "es", "pl", "it", "ru", "ar", "mx", "tr", "fi", "tw", "gr", "br", "nl", "hr", "sk", "cz", "ro", "us", "pt", "dk", "no", "se", "si", "hu", "jp", "ba"].indexOf(this.ogl.server.lang);
        footer.innerHTML += `
            | <a target="_blank" href="http://www.mmorpg-stat.eu/0_fiche_joueur.php?pays=${lang}&ftr=${this.ogl.account.id}.dat&univers=_${this.ogl.server.id}">Mmorpg-stat</a>
            | <a target="_blank" href="http://ogotcha.oplanet.eu/${this.ogl.server.lang}">Ogotcha</a>
            | <a>OGL ${this.ogl.version}</a>
        `;
    }
    updateHighscore() {
        return;
    }
    updateStatus() {
        return;
    }
    displayScoreDiff(highscore) {
        return;
    }
    displayStatus(highscore) { }
    displayResourcesRecap() {
        this.resources = {}, this.resources.total = {
            metal: 0,
            crystal: 0,
            deut: 0,
            msu: 0
        }, this.resources.prod = {
            metal: 0,
            crystal: 0,
            deut: 0,
            msu: 0
        }, this.resources.fly = {
            metal: 0,
            crystal: 0,
            deut: 0
        }, this.resources.ground = {
            metal: 0,
            crystal: 0,
            deut: 0
        }, this.resources.todo = {
            metal: 0,
            crystal: 0,
            deut: 0
        }, document.querySelectorAll(".planetlink, .moonlink").forEach(planet => {
            let id = new URLSearchParams(planet.getAttribute("href")).get("cp").split("#")[0];
            ["metal", "crystal", "deut"].forEach(resourceName => {
                this.resources.total[resourceName] += this.ogl.db.myPlanets[id]?.[resourceName] || 0,
                    this.resources.ground[resourceName] += this.ogl.db.myPlanets[id]?.[resourceName] || 0,
                    this.resources.prod[resourceName] += this.ogl.db.myPlanets[id]?.["prod" + resourceName] || 0;
            }), Object.values(this.ogl.db.myPlanets[id]?.todolist || {}).forEach(entry => {
                Object.values(entry || {}).forEach(todo => {
                    todo.cost && (this.resources.todo.metal += todo.cost.metal,
                        this.resources.todo.crystal += todo.cost.crystal, this.resources.todo.deut += todo.cost.deut);
                });
            });
        }), Object.entries(this.ogl.cache?.movements || {}).forEach(entry => {
            entry[1].forEach(line => {
                ["metal", "crystal", "deut"].forEach(resourceName => {
                    this.resources.total[resourceName] += line[resourceName] || 0,
                        this.resources.fly[resourceName] += line[resourceName] || 0;
                });
            });
        });
        var msuValue = this.ogl.db.options.msu;
        this.resources.total.msu = Util.getMSU(this.resources.total.metal, this.resources.total.crystal, this.resources.total.deut, msuValue),
            this.resources.prod.metal = Math.floor(3600 * this.resources.prod.metal * 24),
            this.resources.prod.crystal = Math.floor(3600 * this.resources.prod.crystal * 24),
            this.resources.prod.deut = Math.floor(3600 * this.resources.prod.deut * 24),
            this.resources.prod.msu = Util.getMSU(this.resources.prod.metal, this.resources.prod.crystal, this.resources.prod.deut, msuValue),
            this.resourceDiv.querySelector(".ogl_metal").innerHTML = `<span>${Util.formatToUnits(this.resources.total.metal)}</span><span>+${Util.formatToUnits(Math.floor(this.resources.prod.metal, 1))}</span>`,
            this.resourceDiv.querySelector(".ogl_crystal").innerHTML = `<span>${Util.formatToUnits(this.resources.total.crystal)}</span><span>+${Util.formatToUnits(Math.floor(this.resources.prod.crystal, 1))}</span>`,
            this.resourceDiv.querySelector(".ogl_deut").innerHTML = `<span>${Util.formatToUnits(this.resources.total.deut)}</span><span>+${Util.formatToUnits(Math.floor(this.resources.prod.deut, 1))}</span>`,
            this.resourceDiv.querySelector(".ogl_msu").innerHTML = `<span>${Util.formatToUnits(this.resources.total.msu)}</span><span>+${Util.formatToUnits(Math.floor(this.resources.prod.msu, 1))}</span>`,
            this.recapReady || (this.recapReady = !0, this.resourceDiv.addEventListener("click", () => {
                var container = Util.addDom("div", {
                    class: "ogl_resourcesDetail"
                });
                container.innerHTML = `
                    <div>
                        <h3 class="material-icons">precision_manufacturing</h3>
                        <h4>Construction</h4>
                        <div class="ogl_metal">+${Util.formatToUnits(this.resources.prod.metal)}</div>
                        <div class="ogl_crystal">+${Util.formatToUnits(this.resources.prod.crystal)}</div>
                        <div class="ogl_deut">+${Util.formatToUnits(this.resources.prod.deut)}</div>
                    </div>
                    <div>
                        <h3 class="material-icons">format_list_bulleted</h3>
                        <h4>Todolist</h4>
                        <div class="ogl_metal ogl_todoDays">${Util.formatToUnits(this.resources.todo.metal)} <span>(${Math.ceil(Math.max(0, this.resources.todo.metal - this.resources.total.metal) / this.resources.prod.metal)}${LocalizationStrings.timeunits.short.day})</span></div>
                        <div class="ogl_crystal ogl_todoDays">${Util.formatToUnits(this.resources.todo.crystal)} <span>(${Math.ceil(Math.max(0, this.resources.todo.crystal - this.resources.total.crystal) / this.resources.prod.crystal)}${LocalizationStrings.timeunits.short.day})</span></div>
                        <div class="ogl_deut ogl_todoDays">${Util.formatToUnits(this.resources.todo.deut)} <span>(${Math.ceil(Math.max(0, this.resources.todo.deut - this.resources.total.deut) / this.resources.prod.deut)}${LocalizationStrings.timeunits.short.day})</span></div>
                    </div>
                    <div>
                        <h3 class="material-icons">globe_uk</h3>
                        <h4>Planet / moon</h4>
                        <div class="ogl_metal">${Util.formatToUnits(this.resources.ground.metal)}</div>
                        <div class="ogl_crystal">${Util.formatToUnits(this.resources.ground.crystal)}</div>
                        <div class="ogl_deut">${Util.formatToUnits(this.resources.ground.deut)}</div>
                    </div>
                    <div>
                        <h3 class="material-icons">send</h3>
                        <h4>Flying</h4>
                        <div class="ogl_metal">${Util.formatToUnits(this.resources.fly.metal)}</div>
                        <div class="ogl_crystal">${Util.formatToUnits(this.resources.fly.crystal)}</div>
                        <div class="ogl_deut">${Util.formatToUnits(this.resources.fly.deut)}</div>
                    </div>
                    <div>
                        <h3 class="material-icons">sigma</h3>
                        <h4>Total</h4>
                        <div class="ogl_metal">${Util.formatToUnits(this.resources.total.metal)}</div>
                        <div class="ogl_crystal">${Util.formatToUnits(this.resources.total.crystal)}</div>
                        <div class="ogl_deut">${Util.formatToUnits(this.resources.total.deut)}</div>
                    </div>
                `, this.ogl._popup.open(container);
            }));
    }
}

class TopbarManager extends Manager {
    load(reloaded) {
        this.topbar = Util.addDom("div", {
            class: "ogl_topbar",
            prepend: document.querySelector("#planetList")
        }), Util.addDom("i", {
            class: "material-icons tooltip",
            child: "conversion_path",
            title: this.ogl._lang.find("collectResources"),
            parent: this.topbar,
            onclick: e => {
                this.ogl.db.harvestCoords = !1, document.body.classList.toggle("ogl_destinationPicker"),
                    document.body.classList.toggle("ogl_initHarvest");
            }
        }), Util.addDom("i", {
            class: "material-icons tooltip",
            child: "account_balance",
            parent: this.topbar,
            title: this.ogl._lang.find("accountSummary"),
            onclick: () => this.openAccount()
        }), Util.addDom("i", {
            class: "material-icons tooltip",
            child: "stroke_full",
            parent: this.topbar,
            title: this.ogl._lang.find("taggedPlanets"),
            onclick: () => this.openTagged(!0)
        }), Util.addDom("i", {
            class: "material-icons tooltip",
            child: "push_pin",
            parent: this.topbar,
            title: this.ogl._lang.find("pinnedPlayers"),
            onclick: () => this.openPinned(!0)
        }), Util.addDom("i", {
            class: "material-icons tooltip",
            child: "settings",
            parent: this.topbar,
            title: this.ogl._lang.find("oglSettings"),
            onclick: () => this.openSettings(!0)
        }), Util.addDom("a", {
            parent: this.topbar,
            class: "material-icons tooltip",
            child: "favorite",
            title: this.ogl._lang.find("coffee"),
            target: "_blank",
            href: "http://ko-fi.com/O4O22XV69"
        }), this.syncBtn = Util.addDom("i", {
            class: "material-icons tooltip",
            child: "directory_sync",
            title: this.ogl._lang.find("syncEmpire"),
            parent: this.topbar,
            onclick: () => {
                this.ogl._fetch.fetchValue = 0, this.ogl._fetch.fetchLFBonuses(),
                    this.ogl._fetch.fetchEmpire(), this.ogl._fetch.fetchProductionQueue();
            }
        }), reloaded || (isNaN(this.ogl.db.currentSide) ? "settings" == this.ogl.db.currentSide ? this.openSettings() : "pinned" == this.ogl.db.currentSide ? this.openPinned() : "tagged" == this.ogl.db.currentSide && this.openTagged() : this.openPinnedDetail(this.ogl.db.currentSide)),
            Util.addDom("button", {
                class: "ogl_button",
                child: this.ogl._lang.find("siblingPlanetMoon"),
                parent: this.topbar,
                onclick: () => {
                    var nextID;
                    this.ogl.currentPlanet.obj.planetID || this.ogl.currentPlanet.obj.moonID ? window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&oglmode=2` : (nextID = "planet" == this.ogl.planetType ? this.ogl.currentPlanet.dom.nextWithMoon.getAttribute("id").replace("planet-", "") : this.ogl.currentPlanet.dom.nextWithMoon.querySelector(".moonlink").getAttribute("href").match(/cp=(\d+)/)[1],
                        window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&cp=${nextID}&oglmode=2`);
                }
            });
    }
    openAccount() {
        let container = Util.addDom("div", {
            class: "ogl_empire"
        });
        var count = document.querySelectorAll(".smallplanet").length;
        let stack = {
            fieldUsed: 0,
            fieldMax: 0,
            fieldLeft: 0,
            temperature: 0,
            metal: 0,
            crystal: 0,
            deut: 0,
            prodmetal: 0,
            prodcrystal: 0,
            proddeut: 0
        };
        Util.addDom("div", {
            class: "ogl_invisible",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_invisible",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_invisible",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_invisible",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_invisible",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_invisible",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_invisible",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_icon ogl_metal",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_icon ogl_crystal",
            parent: container
        }), Util.addDom("div", {
            class: "ogl_icon ogl_deut",
            parent: container
        }), Util.addDom("div", {
            child: "Coords",
            parent: container
        }), Util.addDom("div", {
            child: "P",
            parent: container
        }), Util.addDom("div", {
            child: "M",
            parent: container
        }), Util.addDom("div", {
            child: "Name",
            parent: container
        }), Util.addDom("div", {
            child: "Fields",
            parent: container
        }), Util.addDom("div", {
            child: "T°c",
            parent: container
        }), Util.addDom("div", {
            child: "LF",
            parent: container
        });
        var metalStack = Util.addDom("div", {
            class: "ogl_metal",
            parent: container
        }), crystalStack = Util.addDom("div", {
            class: "ogl_crystal",
            parent: container
        }), deutStack = Util.addDom("div", {
            class: "ogl_deut",
            parent: container
        });
        document.querySelectorAll(".smallplanet").forEach(line => {
            var id = line.getAttribute("id").replace("planet-", ""), id = this.ogl.db.myPlanets[id], name = line.querySelector(".planet-name").innerText, coordDiv = Util.addDom("div", {
                parent: container,
                "data-galaxy": id.coords,
                child: id.coords
            }), coordDiv = (line.getAttribute("data-group") && coordDiv.setAttribute("data-group", line.getAttribute("data-group")),
                Util.addDom("a", {
                    parent: container,
                    href: line.querySelector(".planetlink").getAttribute("href"),
                    child: Util.addDom("img", {
                        src: line.querySelector(".planetPic").getAttribute("src")
                    })
                }), line.querySelector(".moonlink") ? Util.addDom("a", {
                    parent: container,
                    href: line.querySelector(".moonlink").getAttribute("href"),
                    child: Util.addDom("img", {
                        src: line.querySelector(".moonlink img").getAttribute("src")
                    })
                }) : Util.addDom("div", {
                    class: "ogl_invisible",
                    parent: container
                }), Util.addDom("div", {
                    parent: container,
                    child: name
                }), Util.addDom("div", {
                    parent: container,
                    child: `${id.fieldUsed}/${id.fieldMax} (<span>${id.fieldMax - id.fieldUsed}</span>)`
                }), stack.fieldUsed += id.fieldUsed, stack.fieldMax += id.fieldMax,
                stack.fieldLeft += id.fieldMax - id.fieldUsed, Util.addDom("div", {
                    parent: container,
                    child: id.temperature + 40 + "°C"
                })), line = (stack.temperature += id.temperature + 40, 110 <= id.temperature ? coordDiv.style.color = "#af644d" : 10 <= id.temperature ? coordDiv.style.color = "#af9e4d" : -40 <= id.temperature ? coordDiv.style.color = "#4daf67" : -140 <= id.temperature ? coordDiv.style.color = "#4dafa6" : coordDiv.style.color = "#4d79af",
                    Util.addDom("div", {
                        class: "ogl_icon ogl_lifeform" + (id.lifeform || 0),
                        parent: container
                    }), Util.addDom("div", {
                        class: "ogl_metal",
                        parent: container,
                        child: `<strong>${id[1]}</strong><small>+${Util.formatToUnits(Math.round(3600 * (id.prodmetal || 0) * 24))}</small>`
                    })), name = (id.upgrades?.baseBuilding?.[0]?.name.trim() == this.ogl.db.serverData[1] && serverTime.getTime() < id.upgrades?.baseBuilding?.[0]?.end && (line.querySelector("strong").innerHTML += `<span>${id[1] + 1}</span>`),
                        Util.addDom("div", {
                            class: "ogl_crystal",
                            parent: container,
                            child: `<strong>${id[2]}</strong><small>+${Util.formatToUnits(Math.round(3600 * (id.prodcrystal || 0) * 24))}</small>`
                        })), coordDiv = (id.upgrades?.baseBuilding?.[0]?.name.trim() == this.ogl.db.serverData[2] && serverTime.getTime() < id.upgrades?.baseBuilding?.[0]?.end && (name.querySelector("strong").innerHTML += `<span>${id[2] + 1}</span>`),
                            Util.addDom("div", {
                                class: "ogl_deut",
                                parent: container,
                                child: `<strong>${id[3]}</strong><small>+${Util.formatToUnits(Math.round(3600 * (id.proddeut || 0) * 24))}</small>`
                            }));
            stack.metal += id[1], stack.crystal += id[2], stack.deut += id[3], stack.prodmetal += id.prodmetal || 0,
                stack.prodcrystal += id.prodcrystal || 0, stack.proddeut += id.proddeut || 0,
                id.upgrades?.baseBuilding?.[0]?.name.trim() == this.ogl.db.serverData[3] && serverTime.getTime() < id.upgrades?.baseBuilding?.[0]?.end && (coordDiv.querySelector("strong").innerHTML += `<span>${id[3] + 1}</span>`);
        }), metalStack.innerHTML = `<strong>${(stack.metal / count).toFixed(1)}</strong><small>+${Util.formatToUnits(Math.round(3600 * (stack.prodmetal || 0) * 24))}</small>`,
            crystalStack.innerHTML = `<strong>${(stack.crystal / count).toFixed(1)}</strong><small>+${Util.formatToUnits(Math.round(3600 * (stack.prodcrystal || 0) * 24))}</small>`,
            deutStack.innerHTML = `<strong>${(stack.deut / count).toFixed(1)}</strong><small>+${Util.formatToUnits(Math.round(3600 * (stack.proddeut || 0) * 24))}</small>`,
            this.ogl._popup.open(container, !0);
    }
    openStats() {
        Util.runAsync(() => this.ogl._stats.buildStats(!1, !1)).then(e => this.ogl._popup.open(e, !0));
    }
    openSettings(buttonSource) {
        let container = Util.addDom("div", {
            class: "ogl_config",
            child: '<h2>Settings<i class="material-icons">settings</i></h2>'
        }), subContainer;
        ["defaultShip", "defaultMission", "profileButton", "resourceTreshold", "msu", "sim", "converter", "useClientTime", "keyboardActions", "showMenuResources", "shortcutsOnRight", "sidePanelOnLeft", "disablePlanetTooltips", "reduceLargeImages", "colorblindMode", "displayPlanetTimers", "expeditionValue", "expeditionRandomSystem", "expeditionRedirect", "expeditionBigShips", "expeditionShipRatio", "ignoreExpeShipsLoss", "ignoreConsumption", "displaySpyTable", "boardTab", "ptreTeamKey", "ptreLogs", "manageData", "debugMode"].forEach(opt => {
            var isBoolean = typeof this.ogl.db.options[opt] == typeof !0, isNumber = typeof this.ogl.db.options[opt] != typeof [] && ("number" == typeof this.ogl.db.options[opt] || Number(this.ogl.db.options[opt]));
            this.ogl.db.options[opt], "defaultShip" == opt ? subContainer = "fleet" : "resourceTreshold" == opt ? subContainer = "general" : "showMenuResources" == opt ? subContainer = "interface" : "expeditionValue" == opt ? subContainer = "expeditions" : "expeditionShipRatio" == opt ? subContainer = "stats" : "displaySpyTable" == opt ? subContainer = "messages" : "ptreTeamKey" == opt ? subContainer = "PTRE" : "manageData" == opt && (subContainer = "data");
            let currentContainer, label = (container.querySelector(`[data-container="${subContainer}"]`) ? currentContainer = container.querySelector(`[data-container="${subContainer}"]`) : (currentContainer = Util.addDom("div", {
                parent: container,
                "data-container": subContainer
            }), this.ogl.db.configState[subContainer] && currentContainer.classList.add("ogl_active"),
                Util.addDom("h3", {
                    parent: currentContainer,
                    child: subContainer,
                    onclick: () => {
                        currentContainer.classList.contains("ogl_active") ? (currentContainer.classList.remove("ogl_active"),
                            this.ogl.db.configState[currentContainer.getAttribute("data-container")] = !1) : (currentContainer.classList.add("ogl_active"),
                                this.ogl.db.configState[currentContainer.getAttribute("data-container")] = !0);
                    }
                })), Util.addDom("label", {
                    parent: currentContainer,
                    "data-label": "" + this.ogl._lang.find(opt),
                    "data-opt": opt
                }));
            var tooltip = this.ogl._lang.find(opt + "TT");
            if ("TEXT_NOT_FOUND" != tooltip && (label.classList.add("tooltipLeft"),
                label.setAttribute("title", `<div class="ogl_settingsTooltip">${tooltip}</div>`)),
                "defaultShip" == opt) this.ogl.fretShips.forEach(shipID => {
                    var div = Util.addDom("div", {
                        parent: label,
                        class: "ogl_icon ogl_" + shipID,
                        onclick: (event, element) => {
                            this.ogl.db.options.defaultShip = shipID, label.querySelector(".ogl_active")?.classList.remove("ogl_active"),
                                element.classList.add("ogl_active"), "fleetdispatch" == this.ogl.page && (document.querySelectorAll("#fleet1 .ogl_fav").forEach(e => e.classList.add("ogl_grayed")),
                                    document.querySelector(`[data-technology="${this.ogl.db.options.defaultShip}"]`)?.classList.remove("ogl_grayed"),
                                    this.ogl._fleet.updateLimiter(), 1 === this.ogl.mode || 2 === this.ogl.mode ? (this.ogl.fretShips.forEach(shipID => fleetDispatcher.selectShip(shipID, 0)),
                                        fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.ogl._fleet.shipsForResources()),
                                        fleetDispatcher.selectMaxAll()) : 3 === this.ogl.mode && this.ogl.cache.toSend && (this.ogl.fretShips.forEach(shipID => fleetDispatcher.selectShip(shipID, 0)),
                                            this.ogl._fleet.prefillTodolistCargo()));
                        }
                    });
                    this.ogl.db.options.defaultShip == shipID && div.classList.add("ogl_active");
                }); else if ("defaultMission" == opt) [3, 4, 8].forEach(missionID => {
                    var div = Util.addDom("div", {
                        parent: label,
                        class: "ogl_icon ogl_mission" + missionID,
                        onclick: (event, element) => {
                            this.ogl.db.options.defaultMission = missionID, label.querySelector(".ogl_active")?.classList.remove("ogl_active"),
                                element.classList.add("ogl_active");
                        }
                    });
                    this.ogl.db.options.defaultMission == missionID && div.classList.add("ogl_active");
                }); else if ("profileButton" == opt) label.innerHTML = '<button class="material-icons">transit_enterexit</button>',
                    label.querySelector("button").addEventListener("click", () => {
                        Util.runAsync(() => this.ogl._ui.openFleetProfile()).then(e => this.ogl._popup.open(e));
                    }); else if ("msu" == opt) {
                        label.classList.add("tooltipLeft"), label.setAttribute("title", "Format:<br>metal:crystal:deut");
                        let input = Util.addDom("input", {
                            type: "text",
                            placeholder: "m:c:d",
                            value: this.ogl.db.options[opt],
                            parent: label,
                            oninput: () => {
                                input.value && !/^[0-9]*[.]?[0-9]+:[0-9]*[.]?[0-9]+:[0-9]*[.]?[0-9]+$/.test(input.value) ? input.classList.add("ogl_danger") : (input.classList.remove("ogl_danger"),
                                    this.ogl.db.options[opt] = input.value.match(/^[0-9]*[.]?[0-9]+:[0-9]*[.]?[0-9]+:[0-9]*[.]?[0-9]+$/)[0]);
                            }
                        });
                    } else if ("showMenuResources" == opt) {
                        label.innerHTML = "";
                        let select = Util.addDom("select", {
                            parent: label,
                            class: "dropdownInitialized",
                            onchange: () => {
                                this.ogl.db.options[opt] = parseInt(select.value), localStorage.setItem("ogl_menulayout", this.ogl.db.options[opt]),
                                    document.body.setAttribute("data-menulayout", select.value);
                            }
                        });
                        ["All", "Coords", "Resources"].forEach((entry, index) => {
                            entry = Util.addDom("option", {
                                parent: select,
                                child: entry,
                                value: index
                            });
                            this.ogl.db.options[opt] == index && (entry.selected = !0);
                        });
                    } else if (isBoolean && "sim" != opt) if ("boardTab" == opt && "fr" != this.ogl.server.lang) label.remove(); else {
                        let input = Util.addDom("input", {
                            type: "checkbox",
                            parent: label,
                            onclick: () => {
                                this.ogl.db.options[opt] = !this.ogl.db.options[opt], input.checked = this.ogl.db.options[opt],
                                    "ignoreExpeShipsLoss" == opt && this.ogl.db.options.displayMiniStats || "ignoreConsumption" == opt && this.ogl.db.options.displayMiniStats ? this.ogl._stats.miniStats() : "displayPlanetTimers" == opt ? document.querySelector("#planetList").classList.toggle("ogl_alt") : "reduceLargeImages" == opt ? (localStorage.setItem("ogl_minipics", this.ogl.db.options[opt]),
                                        document.body.setAttribute("data-minipics", this.ogl.db.options[opt])) : "colorblindMode" == opt ? (localStorage.setItem("ogl_colorblind", this.ogl.db.options[opt]),
                                            document.body.setAttribute("data-colorblind", this.ogl.db.options[opt])) : "displaySpyTable" == opt && this.ogl._message?.spytable && 20 == this.ogl._message?.tabID ? this.ogl.db.options[opt] ? this.ogl._message.spytable.classList.remove("ogl_hidden") : this.ogl._message.spytable.classList.add("ogl_hidden") : "sidePanelOnLeft" == opt && document.body.setAttribute("data-sidepanel", this.ogl.db.options[opt]);
                            }
                        });
                        this.ogl.db.options[opt] && (input.checked = !0);
                    } else if (isNumber || "expeditionValue" == opt) {
                        let input = Util.addDom("input", {
                            class: "ogl_inputCheck",
                            type: "text",
                            value: this.ogl.db.options[opt],
                            parent: label,
                            oninput: () => {
                                setTimeout(() => {
                                    "expeditionShipRatio" == opt && (parseInt(input.value.replace(/\D/g, "")) < 0 ? input.value = 0 : 100 < parseInt(input.value.replace(/\D/g, "")) && (input.value = 100));
                                    let newValue;
                                    "true" == input.getAttribute("data-allowPercent") && 0 <= input.value.toLowerCase().indexOf("%") ? (newValue = parseInt(input.value.replace(/\D/g, "")) || !1) && (newValue += "%") : newValue = parseInt(input.value.replace(/\D/g, "")) || !1,
                                        this.ogl.db.options[opt] = newValue, "expeditionShipRatio" == opt && this.ogl._stats.miniStats();
                                }, 200);
                            }
                        });
                        "expeditionValue" == opt && (input.setAttribute("data-allowPercent", !0),
                            input.classList.add("ogl_placeholder"), input.setAttribute("placeholder", `(${Util.formatNumber(this.ogl.calcExpeditionMax().max)})`));
                    } else if ("keyboardActions" == opt) label.innerHTML = '<button class="material-icons">keyboard_alt</button>',
                        label.querySelector("button").addEventListener("click", () => {
                            Util.runAsync(() => this.ogl._ui.openKeyboardActions()).then(e => this.ogl._popup.open(e));
                        }); else if ("sim" == opt || "converter" == opt) {
                            tooltip = "sim" == opt ? Util.simList : Util.converterList;
                            label.innerHTML = "";
                            let select = Util.addDom("select", {
                                parent: label,
                                class: "dropdownInitialized",
                                child: '<option value="false" selected disabled>-</option>',
                                onchange: () => {
                                    this.ogl.db.options[opt] = select.value;
                                }
                            });
                            Object.entries(tooltip).forEach(entry => {
                                var selectOption = Util.addDom("option", {
                                    parent: select,
                                    child: entry[0],
                                    value: entry[0]
                                });
                                this.ogl.db.options[opt] == entry[0] && (selectOption.selected = !0);
                            });
                        } else if ("expeditionBigShips" == opt) label.innerHTML = '<button class="material-icons">rocket</button>',
                            label.querySelector("button").addEventListener("click", () => {
                                Util.runAsync(() => this.ogl._ui.openExpeditionFiller()).then(e => this.ogl._popup.open(e));
                            }); else if ("displayMiniStats" == opt) label.innerHTML = '<div class="ogl_choice" data-limiter="day">D</div><div class="ogl_choice" data-limiter="week">W</div><div class="ogl_choice" data-limiter="month">M</div>',
                                label.querySelectorAll("div").forEach(button => {
                                    button.addEventListener("click", () => {
                                        this.ogl.db.options[opt] = button.getAttribute("data-limiter"),
                                            this.ogl._stats.miniStats(), label.querySelector(".ogl_active") && label.querySelector(".ogl_active").classList.remove("ogl_active"),
                                            button.classList.add("ogl_active");
                                    }), button.getAttribute("data-limiter") == this.ogl.db.options[opt] && button.classList.add("ogl_active");
                                }); else if ("ptreTeamKey" == opt) {
                                    label.classList.add("tooltipLeft"), label.setAttribute("title", "Format:<br>TM-XXXX-XXXX-XXXX-XXXX");
                                    let input = Util.addDom("input", {
                                        type: "password",
                                        placeholder: "TM-XXXX-XXXX-XXXX-XXXX",
                                        value: localStorage.getItem("ogl-ptreTK") || "",
                                        parent: label,
                                        oninput: () => {
                                            !input.value || 18 == input.value.replace(/-/g, "").length && 0 == input.value.indexOf("TM") ? (input.classList.remove("ogl_danger"),
                                                localStorage.setItem("ogl-ptreTK", input.value), this.ogl.ptreKey = input.value) : input.classList.add("ogl_danger");
                                        },
                                        onfocus: () => input.type = "text",
                                        onblur: () => input.type = "password"
                                    });
                                } else "ptreLogs" == opt ? (label.innerHTML = '<button class="material-icons">bug</button>',
                                    label.querySelector("button").addEventListener("click", () => {
                                        this.ogl.PTRE.displayLogs();
                                    })) : "manageData" == opt && (label.innerHTML = '<button class="material-icons">database</button>',
                                        label.querySelector("button").addEventListener("click", () => {
                                            Util.runAsync(() => this.ogl._ui.openDataManager()).then(e => this.ogl._popup.open(e));
                                        }));
        }), this.ogl._ui.openSide(container, "settings", buttonSource);
    }
    openPinned(buttonSource) {
        this.ogl._ui.openSide(Util.addDom("div", {
            class: "ogl_loading"
        }), "pinned", buttonSource), Util.runAsync(() => {
            var container = Util.addDom("div", {
                class: "ogl_pinned",
                child: '<h2>Pinned players<i class="material-icons">push_pin</i></h2>'
            });
            let tabs = Util.addDom("div", {
                class: "ogl_tabs ogl_flagSelector material-icons",
                parent: container
            }), list = Util.addDom("div", {
                class: "ogl_list",
                parent: container
            }), recentTab = (this.ogl.flagsList.forEach(pin => {
                if ("none" != pin) {
                    let tab = Util.addDom("div", {
                        parent: tabs,
                        "data-flag": pin,
                        onclick: () => {
                            var actionList;
                            list.innerText = "", tabs.querySelector("[data-flag].ogl_active")?.classList.remove("ogl_active"),
                                tab.classList.add("ogl_active"), "ptre" == (this.ogl.db.lastPinTab = pin) && this.ogl.ptreKey && (actionList = Util.addDom("div", {
                                    class: "ogl_grid",
                                    parent: list
                                }), Util.addDom("button", {
                                    class: "ogl_button",
                                    child: this.ogl._lang.find("ptreSyncTarget"),
                                    parent: actionList,
                                    onclick: () => {
                                        this.ogl.PTRE.syncTargetList();
                                    }
                                }), Util.addDom("button", {
                                    class: "ogl_button",
                                    child: this.ogl._lang.find("ptreManageTarget"),
                                    parent: actionList,
                                    onclick: () => {
                                        window.open(this.ogl.PTRE.manageSyncedListUrl, "_blank");
                                    }
                                }), Util.addDom("hr", {
                                    parent: list
                                })), Object.values(this.ogl.db.udb).filter(u => u.pin == this.ogl.db.lastPinTab).sort((a, b) => a.score?.globalRanking - b.score?.globalRanking).forEach(player => {
                                    player.uid && this.addPinnedItemToList(player, list);
                                }), list.querySelector("[data-uid]") || list.querySelector(".ogl_button") || (list.innerHTML = `<p class="ogl_emptyList">${this.ogl._lang.find("emptyPlayerList")}</p>`);
                        }
                    });
                    pin == this.ogl.db.lastPinTab && tab.click();
                }
            }), Util.addDom("div", {
                "data-flag": "recent",
                parent: tabs,
                onclick: () => {
                    this.ogl.db.lastPinTab = "recent", list.innerText = "", tabs.querySelector("[data-flag].ogl_active")?.classList.remove("ogl_active"),
                        recentTab.classList.add("ogl_active"), this.ogl.db.lastPinnedList.forEach(id => {
                            id = this.ogl.db.udb[id];
                            id?.uid && this.addPinnedItemToList(id, list);
                        }), list.querySelector("[data-uid]") || (list.innerText = this.ogl._lang.find("emptyPlayerList"));
                }
            }));
            return "recent" == this.ogl.db.lastPinTab && recentTab.click(), container;
        }).then(container => this.ogl._ui.openSide(container, "pinned", buttonSource));
    }
    addPinnedItemToList(player, list) {
        let item = Util.addDom("div", {
            parent: list
        });
        list = Util.addDom("span", {
            class: "tooltipLeft tooltipClose tooltipUpdate " + (player.status || "status_abbr_active"),
            parent: item,
            child: "string" == typeof player.name ? player.name : "?"
        }), this.ogl._ui.turnIntoPlayerLink(player.uid, list), list = Math.max(1, Math.ceil((player.score?.globalRanking || 100) / 100)),
            list = Util.addDom("a", {
                class: "ogl_ranking",
                href: `${window.location.href.split('?')[0]}?page=highscore&site=${list}&searchRelId=` + player.uid,
                child: "#" + player.score?.globalRanking || "?"
            });
        Util.addDom("div", {
            parent: item,
            child: list.outerHTML
        }), this.ogl._ui.addPinButton(item, player.uid), Util.addDom("i", {
            class: "material-icons",
            parent: item,
            child: "delete",
            onclick: () => {
                this.ogl.db.lastPinnedList.splice(this.ogl.db.lastPinnedList.findIndex(e => e == player.uid), 1),
                    item.remove(), delete this.ogl.db.udb[player.uid].pin;
            }
        });
    }
    openPinnedDetail(id, update) {
        id = parseInt(id), this.ogl._ui.openSide(Util.addDom("div", {
            class: "ogl_loading"
        }), id);
        let updateSide = () => {
            let player = this.ogl.db.udb[id];
            if (player) {
                var container = Util.addDom("div", {
                    class: "ogl_pinDetail"
                }), title = (Util.addDom("div", {
                    parent: container,
                    class: "material-icons ogl_back",
                    child: "arrow_back",
                    onclick: () => {
                        this.openPinned();
                    }
                }), Util.addDom("h2", {
                    class: player.status || "status_abbr_active",
                    parent: container,
                    child: player.name
                })), score = Util.addDom("div", {
                    class: "ogl_score",
                    parent: container
                }), actions = Util.addDom("div", {
                    class: "ogl_actions",
                    parent: container
                });
                let list = Util.addDom("div", {
                    class: "ogl_list",
                    parent: container
                });
                this.ogl._ui.addPinButton(title, id);
                var writeIcon = Util.addDom("div", {
                    child: "edit",
                    class: "material-icons ogl_button",
                    parent: actions,
                    onclick: () => {
                        document.querySelector("#chatBar") || (window.location.href = `${window.location.href.split('?')[0]}?page=chat&playerId=` + id);
                    }
                }), writeIcon = (document.querySelector("#chatBar") && (writeIcon.classList.add("js_openChat"),
                    writeIcon.setAttribute("data-playerId", id)), Util.addDom("a", {
                        child: "account-plus",
                        class: "material-icons ogl_button overlay",
                        parent: container.querySelector(".ogl_actions"),
                        href: `${window.location.href.split('?')[0]}?page=ingame&component=buddies&action=7&id=${id}&ajax=1`,
                        onclick: () => {
                            tippy.hideAll();
                        }
                    }), Util.addDom("div", {
                        child: "block",
                        class: "material-icons ogl_button",
                        parent: actions,
                        onclick: () => {
                            window.location.href = `${window.location.href.split('?')[0]}?page=ignorelist&action=1&id=` + id;
                        }
                    }), Util.addDom("div", {
                        child: "query_stats",
                        class: "material-icons ogl_button",
                        parent: actions,
                        onclick: () => {
                            window.open(Util.genMmorpgstatLink(this.ogl, id), "_blank");
                        }
                    }), Util.addDom("div", {
                        child: "ptre",
                        class: "material-icons ogl_button",
                        parent: actions,
                        onclick: () => {
                            this.ogl.PTRE.getPlayerInfo({
                                name: player.name,
                                id: id
                            });
                        }
                    }), Util.addDom("div", {
                        child: "sync",
                        class: "material-icons ogl_button",
                        parent: actions,
                        onclick: () => {
                            this.ogl.PTRE.getPlayerPositions({
                                name: player.name,
                                id: id
                            });
                        }
                    }), this.ogl.db.lastPinnedList = Array.from(new Set([id, ...this.ogl.db.lastPinnedList].map(Number))),
                    30 < this.ogl.db.lastPinnedList.length && (this.ogl.db.lastPinnedList.length = 30),
                    update || (Util.addDom("div", {
                        class: "ogl_loading",
                        parent: container
                    }), this.ogl._ui.openSide(container, id), this.ogl.PTRE.getPlayerPositions({
                        name: player.name,
                        id: id
                    })), Math.max(1, Math.ceil((player.score?.globalRanking || 100) / 100))), actions = Util.addDom("a", {
                        class: "ogl_ranking",
                        href: `${window.location.href.split('?')[0]}?page=highscore&site=${writeIcon}&searchRelId=` + player.uid,
                        child: "#" + player.score?.globalRanking || "?"
                    });
                title.innerHTML = player.name + " " + actions.outerHTML, this.ogl._ui.addPinButton(title, id),
                    score.innerHTML = `
                <div class="ogl_line"><i class="material-icons">trending_up</i><div>${Util.formatNumber(player.score?.global)}</div></div>
                <div class="ogl_line"><i class="material-icons">diamond</i><div>${Util.formatNumber(player.score?.economy)}</div></div>
                <div class="ogl_line"><i class="material-icons">science</i><div>${Util.formatNumber(player.score?.research)}</div></div>
                <div class="ogl_line"><i class="material-icons">genetics</i><div>${Util.formatNumber(player.score?.lifeform)}</div></div>
                <div class="ogl_line"><i class="material-icons">rocket_launch</i><div>${Util.formatNumber(Util.getPlayerScoreFD(player.score, "fleet"))}</div></div>
                <div class="ogl_line"><i class="material-icons">security</i><div>${Util.formatNumber(Util.getPlayerScoreFD(player.score, "defense"))}</div></div>
            `;
                let lastCoords = 0, group = 1, index = 1;
                player.planets.sort((a, b) => Util.coordsToID(a) - Util.coordsToID(b)).forEach(planetID => {
                    var date, dateDiff, hourDiff, line, newCoords, planetID = this.ogl.db.pdb[planetID];
                    planetID && (date = new Date(planetID.api), dateDiff = Math.floor((serverTime.getTime() - date) / 864e5),
                        hourDiff = Math.round((serverTime.getTime() - date % 864e5) % 36e5 / 6e4),
                        line = Util.addDom("div", {
                            parent: list
                        }), planetID.home && line.classList.add("ogl_home"), newCoords = Util.coordsToID(planetID.coo).slice(0, -3),
                        lastCoords === newCoords ? line.setAttribute("data-group", group) : line.previousElementSibling?.getAttribute("data-group") && group++,
                        lastCoords = newCoords, Util.addDom("div", {
                            child: index,
                            parent: line
                        }), Util.addDom("div", {
                            child: planetID.coo,
                            parent: line,
                            "data-galaxy": planetID.coo
                        }), Util.addDom("div", {
                            class: "tooltip",
                            title: "Debris<br>" + Util.formatNumber(planetID.debris || 0),
                            child: Util.formatToUnits(planetID.debris || 0),
                            parent: line
                        }), this.ogl._ui.addSpyIcons(line, planetID.coo.split(":"), !1, !0),
                        newCoords = dateDiff || 0 === dateDiff ? 0 < dateDiff ? "" + dateDiff + LocalizationStrings.timeunits.short.hour + " ago" : "" + hourDiff + LocalizationStrings.timeunits.short.minute + " ago" : "?",
                        planetID = Util.addDom("date", {
                            class: "tooltipLeft",
                            child: newCoords,
                            title: `<span>${date.toLocaleDateString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            })}</span> <span>${date.toLocaleTimeString("de-DE")}</span>`,
                            parent: line
                        }), 5 <= dateDiff ? planetID.classList.add("ogl_danger") : 3 <= dateDiff && planetID.classList.add("ogl_warning"),
                        index += 1);
                }), this.ogl._ui.openSide(container, id), setTimeout(() => this.ogl._shortcut.load(), 50),
                    this.ogl._galaxy.checkCurrentSystem();
            }
        };
        Util.runAsync(() => {
            this.ogl._fetch.fetchPlayerAPI(id, !1, () => updateSide());
        });
    }
    openTagged(buttonSource) {
        this.ogl._ui.openSide(Util.addDom("div", {
            class: "ogl_loading"
        }), "tagged"), Util.runAsync(() => {
            var container = Util.addDom("div", {
                class: "ogl_tagged",
                child: '<h2>Tagged planets<i class="material-icons">stroke_full</i></h2>'
            });
            let tabs = Util.addDom("div", {
                class: "ogl_tabs ogl_tagSelector material-icons",
                parent: container
            });
            var inputs = Util.addDom("div", {
                class: "ogl_actions",
                parent: container
            });
            Util.addDom("hr", {
                parent: container
            });
            let list = Util.addDom("div", {
                class: "ogl_list",
                parent: container,
                child: '<p class="ogl_emptyList">Select a galaxy/system range</p>'
            }), buildList = () => {
                var start = Util.coordsToID(`${gStart.value}:${sStart.value}:000`), end = Util.coordsToID(`${gEnd.value}:${sEnd.value}:000`), start = this.getTaggedItems(start, end);
                if (list.innerText = "", start.length < 1) Util.addDom("p", {
                    child: "No result",
                    parent: list
                }); else {
                    let nextTargetFound = !1, newList = [];
                    start.forEach((item, index) => {
                        let coords = item.match(/.{1,3}/g).map(Number).join(":");
                        var item = Util.coordsToID(coords), line = Util.addDom("div", {
                            parent: list
                        });
                        Util.addDom("div", {
                            child: index + 1,
                            parent: line
                        }), Util.addDom("div", {
                            child: coords,
                            "data-galaxy": coords,
                            parent: line
                        });
                        let target = Util.addDom("div", {
                            class: "material-icons tooltip ogl_nextQuickTarget",
                            title: "Select as next quick raid target",
                            child: "swords",
                            parent: line,
                            onclick: () => {
                                var start = Util.coordsToID(coords), end = Util.coordsToID(`${gEnd.value}:${sEnd.value}:000`);
                                this.getTaggedItems(start, end, !0), this.ogl.db.quickRaidList = this.tmpRaidList,
                                    this.ogl._notification.addToQueue(`You can now use [${this.ogl.db.options.keyboardActions.quickRaid}] on fleet page to attack next target`, !0),
                                    setTimeout(() => this.ogl._shortcut.load(), 50),
                                    list.querySelectorAll(".ogl_nextQuickTarget.ogl_active").forEach(e => e.classList.remove("ogl_active")),
                                    target.classList.add("ogl_active");
                            }
                        });
                        this.ogl.db.quickRaidList && this.ogl.db.quickRaidList?.[0] == item && (target.classList.add("ogl_active"),
                            nextTargetFound = !0), nextTargetFound && newList.push(item),
                            this.ogl._ui.addSpyIcons(line, coords), this.ogl._ui.addTagButton(line, coords);
                    }), this.ogl.db.quickRaidList = nextTargetFound ? newList : [];
                }
            };
            Object.keys(this.ogl.db.tags).forEach(tag => {
                if ("none" != tag) {
                    let tab = Util.addDom("div", {
                        parent: tabs,
                        "data-tag": tag,
                        onclick: () => {
                            this.ogl.db.tags[tag] ? (this.ogl.db.tags[tag] = !1,
                                tab.classList.add("ogl_off")) : (this.ogl.db.tags[tag] = !0,
                                    tab.classList.remove("ogl_off"));
                        }
                    });
                    this.ogl.db.tags[tag] || tab.classList.add("ogl_off");
                }
            });
            var currentCoords = this.ogl.currentPlanet.obj.coords.split(":");
            let gStart = Util.addDom("input", {
                type: "text",
                min: "1",
                max: "10",
                parent: inputs,
                value: this.ogl.db.lastTaggedInput[0] || currentCoords[0],
                onblur: e => e.target.value = e.target.value || 1,
                oninput: () => saveInput()
            }), sStart = Util.addDom("input", {
                type: "text",
                min: "1",
                max: "499",
                parent: inputs,
                value: this.ogl.db.lastTaggedInput[1] || currentCoords[1],
                onblur: e => e.target.value = e.target.value || 1,
                oninput: () => saveInput()
            }), gEnd = (Util.addDom("div", {
                class: "material-icons",
                child: "arrow_right_alt",
                parent: inputs
            }), Util.addDom("input", {
                type: "text",
                min: "1",
                max: "10",
                parent: inputs,
                value: this.ogl.db.lastTaggedInput[2] || 1,
                onblur: e => e.target.value = e.target.value || 1,
                oninput: () => saveInput()
            })), sEnd = Util.addDom("input", {
                type: "text",
                min: "1",
                max: "499",
                parent: inputs,
                value: this.ogl.db.lastTaggedInput[3] || 1,
                onblur: e => e.target.value = e.target.value || 1,
                oninput: () => saveInput()
            }), ignoreNoobButton = Util.addDom("label", {
                class: "status_abbr_noob",
                parent: inputs,
                child: this.ogl._lang.find("noob") + '<input class="ogl_hidden" type="checkbox">',
                onclick: () => {
                    setTimeout(() => {
                        this.ogl.db.lastTaggedInput[4] = ignoreNoobButton.querySelector("input").checked,
                            this.ogl.db.lastTaggedInput[4] ? ignoreNoobButton.classList.remove("ogl_off") : ignoreNoobButton.classList.add("ogl_off"),
                            buildList();
                    }, 50);
                }
            }), ignoreVacationButton = Util.addDom("label", {
                class: "status_abbr_vacation",
                parent: inputs,
                child: this.ogl._lang.find("vacation") + '<input class="ogl_hidden" type="checkbox">',
                onclick: () => {
                    setTimeout(() => {
                        this.ogl.db.lastTaggedInput[5] = ignoreVacationButton.querySelector("input").checked,
                            this.ogl.db.lastTaggedInput[5] ? ignoreVacationButton.classList.remove("ogl_off") : ignoreVacationButton.classList.add("ogl_off"),
                            buildList();
                    }, 50);
                }
            }), saveInput = (Util.addDom("div", {
                class: "material-icons ogl_button",
                parent: inputs,
                child: "search",
                onclick: () => buildList()
            }), this.ogl.db.lastTaggedInput[0] && this.ogl.db.lastTaggedInput[1] && this.ogl.db.lastTaggedInput[2] && this.ogl.db.lastTaggedInput[3] && buildList(),
                this.ogl.db.lastTaggedInput[4] ? ignoreNoobButton.querySelector("input").checked = !0 : ignoreNoobButton.classList.add("ogl_off"),
                this.ogl.db.lastTaggedInput[5] ? ignoreVacationButton.querySelector("input").checked = !0 : ignoreVacationButton.classList.add("ogl_off"),
                () => {
                    this.timeout && clearTimeout(this.timeout), this.ogl.db.lastTaggedInput[0] = gStart.value,
                        this.ogl.db.lastTaggedInput[1] = sStart.value, this.ogl.db.lastTaggedInput[2] = gEnd.value,
                        this.ogl.db.lastTaggedInput[3] = sEnd.value;
                });
            return container;
        }).then(container => {
            this.ogl._ui.openSide(container, "tagged", buttonSource), setTimeout(() => this.ogl._shortcut.load(), 50);
        });
    }
    getTaggedItems(rawStart, rawEnd, newFlag) {
        rawStart = parseInt(rawStart), rawEnd = parseInt(rawEnd);
        let displayNoob = this.ogl.db.lastTaggedInput[4], displayVacation = this.ogl.db.lastTaggedInput[5];
        return newFlag || (rawStart <= rawEnd ? rawEnd += 15 : rawStart += 15),
            this.tmpRaidList = Object.keys(this.ogl.db.tdb).sort((a, b) => rawStart <= rawEnd ? a - b : b - a).filter(position => {
                var coords = position.match(/.{1,3}/g).map(Number).join(":"), coords = this.ogl.db.udb[this.ogl.db.pdb[coords]?.uid]?.status;
                return this.ogl.db.tags[this.ogl.db.tdb[position].tag] && (rawStart <= rawEnd ? rawStart <= position && position <= rawEnd : position <= rawStart && rawEnd <= position) && (displayNoob || !coords || !displayNoob && coords?.indexOf("n") < 0) && (displayVacation || !coords || !displayVacation && coords?.indexOf("v") < 0 && coords?.indexOf("b") < 0);
            }), this.tmpRaidList;
    }
    checkUpgrade() {
        this.PlanetBuildingtooltip = this.PlanetBuildingtooltip || {}, document.querySelectorAll(".planetlink, .moonlink").forEach(planet => {
            planet.querySelector(".ogl_buildIconList") && planet.querySelector(".ogl_buildIconList").remove();
            let id = new URLSearchParams(planet.getAttribute("href")).get("cp").split("#")[0];
            planet.classList.contains("moonlink");
            this.PlanetBuildingtooltip[id] = Util.addDom("ul", {
                class: "ogl_buildList"
            });
            let hasBaseBuilding = !1, hasBaseShip = !1, hasLFBuilding = !1;
            this.ogl.db.myPlanets[id] = this.ogl.db.myPlanets[id] || {}, Object.values(this.ogl.db.myPlanets[id].upgrades || {}).forEach(upgradeType => {
                let ready = !1;
                upgradeType?.id || upgradeType.forEach(upgrade => {
                    serverTime.getTime() < upgrade.end && (ready || (ready = !0,
                        Util.addDom("li", {
                            parent: this.PlanetBuildingtooltip[id],
                            child: `<i class="material-icons">fiber_manual_record</i><span class="ogl_slidingText" data-text="${upgrade.name}"></span><i class="material-icons">east</i><b>${upgrade.lvl}</b>`
                        }), "baseBuilding" == upgrade.type || "baseResearch" == upgrade.type ? hasBaseBuilding = !0 : "ship" == upgrade.type || "def" == upgrade.type || "mechaShip" == upgrade.type ? hasBaseShip = !0 : "lfBuilding" != upgrade.type && "lfResearch" != upgrade.type || (hasLFBuilding = !0)));
                });
            });
            planet = Util.addDom("div", {
                class: "ogl_buildIconList",
                parent: planet
            });
            hasBaseBuilding && Util.addDom("div", {
                class: "ogl_buildIcon material-icons",
                child: "stat_0",
                parent: planet
            }), hasBaseShip && Util.addDom("div", {
                class: "ogl_buildIcon ogl_baseShip material-icons",
                child: "stat_0",
                parent: planet
            }), hasLFBuilding && Util.addDom("div", {
                class: "ogl_buildIcon ogl_lfBuilding material-icons",
                child: "stat_0",
                parent: planet
            });
        });
    }
}

class FleetManager extends Manager {
    load() {
        if (this.validationReady = !0, this.miniFleetQueue = [], this.updateSpyFunctions(),
            "fleetdispatch" == this.ogl.page) {
            this.totalCapacity = 0, this.capacityWrapper = Util.addDom("div", {
                class: "capacityProgress",
                parent: document.querySelector("#fleet1 .content"),
                onclick: () => document.querySelector(".ogl_requiredShips .ogl_" + this.ogl.db.options.defaultShip).click()
            }), this.capacityBar = Util.addDom("progress", {
                "data-capacity": "",
                max: 100,
                value: 0,
                parent: this.capacityWrapper
            }), this.resOnPlanet = {
                metal: "metalOnPlanet",
                crystal: "crystalOnPlanet",
                deut: "deuteriumOnPlanet",
                food: "foodOnPlanet"
            }, this.cargo = {
                metal: "cargoMetal",
                crystal: "cargoCrystal",
                deut: "cargoDeuterium",
                food: "cargoFood"
            }, this.initialTarget = JSON.parse(JSON.stringify(targetPlanet));
            let initInterval = setInterval(() => {
                var params;
                unsafeWindow.fleetDispatcher && (this.setRealTarget(this.initialTarget),
                    fleetDispatcher.targetPlanet = fleetDispatcher.realTarget, this.initialResOnPlanet = {
                        metal: fleetDispatcher.metalOnPlanet,
                        crystal: fleetDispatcher.crystalOnPlanet,
                        deut: fleetDispatcher.deuteriumOnPlanet,
                        food: fleetDispatcher.foodOnPlanet
                    }, this.initialShipsOnPlanet = JSON.parse(JSON.stringify(fleetDispatcher.shipsOnPlanet)),
                    this.overwrited || this.overwrite(), fleetDispatcher.fetchTargetPlayerDataTimeout || (unsafeWindow.shipsData && fleetDispatcher?.fleetHelper?.shipsData ? (this.init(),
                        clearInterval(initInterval)) : (params = {}, fleetDispatcher.appendShipParams(params),
                            fleetDispatcher.appendTargetParams(params), fleetDispatcher.appendTokenParams(params),
                            params.union = fleetDispatcher.union, $.post(fleetDispatcher.checkTargetUrl, params, response => {
                                response = JSON.parse(response);
                                fleetDispatcher.fleetHelper.shipsData = response.shipsData,
                                    fleetDispatcher.updateToken(response.newAjaxToken), this.init(),
                                    clearInterval(initInterval);
                            }))));
            }, 50);
        }
    }
    overwrite() {
        this.overwrited = !0, fleetDispatcher.fleetHelper.getShipData = shipID => fleetDispatcher?.fleetHelper?.shipsData?.[shipID] || shipsData[shipID],
            fleetDispatcher.refreshDataAfterAjax = data => {
                let ownPlanet = Object.values(ogl.db.myPlanets).find(e => e.coords == `${data.targetPlanet.galaxy}:${data.targetPlanet.system}:` + data.targetPlanet.position);
                fleetDispatcher.setOrders(data.orders), fleetDispatcher.mission = 0,
                    fleetDispatcher.setTargetInhabited(data.targetInhabited), fleetDispatcher.setTargetPlayerId(data.targetPlayerId),
                    fleetDispatcher.setTargetPlayerName(data.targetPlayerName), fleetDispatcher.setTargetIsStrong(data.targetIsStrong),
                    fleetDispatcher.setTargetIsOutlaw(data.targetIsOutlaw), fleetDispatcher.setTargetIsBuddyOrAllyMember(data.targetIsBuddyOrAllyMember),
                    fleetDispatcher.setTargetPlayerColorClass(data.targetPlayerColorClass),
                    fleetDispatcher.setTargetPlayerRankIcon(data.targetPlayerRankIcon),
                    fleetDispatcher.setPlayerIsOutlaw(data.playerIsOutlaw), fleetDispatcher.targetPlanet.galaxy = data.targetPlanet.galaxy,
                    fleetDispatcher.targetPlanet.system = data.targetPlanet.system, fleetDispatcher.targetPlanet.position = data.targetPlanet.position,
                    fleetDispatcher.targetPlanet.type = data.targetPlanet.type, fleetDispatcher.targetPlanet.name = data.targetPlanet.name,
                    this.setRealTarget(JSON.parse(JSON.stringify(fleetDispatcher.targetPlanet))),
                    !data.targetOk && this.isQuickRaid && this.ogl.db.quickRaidList.shift(),
                    setTimeout(() => {
                        var hasMission = -1 < (fleetDispatcher.getAvailableMissions() || []).indexOf(fleetDispatcher.mission);
                        !hasMission && this.lastMissionOrder && -1 < (fleetDispatcher.getAvailableMissions() || []).indexOf(this.lastMissionOrder) ? fleetDispatcher.mission = this.lastMissionOrder : ownPlanet ? hasMission || "fleet2" != fleetDispatcher.currentPage || 1 != (fleetDispatcher.getAvailableMissions() || []).length ? !hasMission && -1 < (fleetDispatcher.getAvailableMissions() || []).indexOf(this.ogl.db.options.defaultMission) ? fleetDispatcher.mission = this.ogl.db.options.defaultMission : hasMission && (fleetDispatcher.mission = this.lastMissionOrder) : fleetDispatcher.mission = fleetDispatcher.getAvailableMissions()[0] : 2 == data.targetPlanet.type ? fleetDispatcher.mission = 8 : fleetDispatcher.union ? fleetDispatcher.mission = 2 : fleetDispatcher.mission = 1,
                            fleetDispatcher.refresh();
                    }, 50), 0 < fleetDispatcher.cargoMetal + fleetDispatcher.cargoCrystal + fleetDispatcher.cargoDeuterium && JSON.stringify(fleetDispatcher.realTarget) == JSON.stringify(fleetDispatcher.currentPlanet) && this.setRealTarget(fleetDispatcher.realTarget, {
                        type: 1 == fleetDispatcher.realTarget.type ? 3 : 1
                    });
            }, fleetDispatcher.selectShip = (shipId, number) => {
                var shipsAvailable = fleetDispatcher.getNumberOfShipsOnPlanet(shipId), input = document.querySelector(`[data-technology="${shipId}"] input`);
                0 === shipsAvailable || shipsAvailable < number && !document.querySelector(`[data-technology="${shipId}"]`)?.classList.contains("ogl_notEnough") ? input?.classList.add("ogl_flashNotEnough") : input.classList.remove("ogl_flashNotEnough"),
                    (number = Math.min(shipsAvailable, number)) <= 0 ? fleetDispatcher.removeShip(shipId) : fleetDispatcher.hasShip(shipId) ? fleetDispatcher.updateShip(shipId, number) : fleetDispatcher.addShip(shipId, number),
                    Util.formatInput(input, !1, !0), fleetDispatcher.refresh();
            }, fleetDispatcher.trySubmitFleet1 = () => {
                "fleet1" == fleetDispatcher.currentPage && (fleetDispatcher.targetPlanet = fleetDispatcher.realTarget,
                    !1 === fleetDispatcher.validateFleet1() ? this.validationReady = !0 : fleetDispatcher.switchToPage("fleet2"));
            }, Util.overWrite("refresh", fleetDispatcher, !1, () => {
                var totalResources = fleetDispatcher.metalOnPlanet + fleetDispatcher.crystalOnPlanet + fleetDispatcher.deuteriumOnPlanet + fleetDispatcher.foodOnPlanet, percentCapacity = (this.totalCapacity = this.totalCapacity || 1,
                    Math.floor(fleetDispatcher.getCargoCapacity() / this.totalCapacity * 100) || 0), percentResources = Math.floor(fleetDispatcher.getCargoCapacity() / totalResources * 100) || 0, percentRequired = Math.floor(totalResources / this.totalCapacity * 100) || 0, percentRequired = (this.capacityBar.style.setProperty("--capacity", `linear-gradient(to right, #641717, #938108 ${.8 * percentRequired}%, #055c54 ${percentRequired}%)`),
                        this.capacityWrapper.style.setProperty("--currentCapacityPercent", Math.min(94, percentCapacity) + "%"),
                        this.capacityWrapper.setAttribute("data-percentResources", Math.min(100, percentResources)),
                        this.capacityWrapper.setAttribute("data-rawCargo", `${Util.formatNumber(fleetDispatcher.getCargoCapacity())} / ${Util.formatNumber(this.totalCapacity)} - (req. ${Util.formatNumber(totalResources)})`),
                        this.capacityBar.setAttribute("max", 100), this.capacityBar.setAttribute("value", percentCapacity),
                        document.querySelector(".show_fleet_apikey"));
                percentRequired && (percentRequired.classList.add("tooltipClose"), percentRequired.classList.add("tooltipClick")),
                    this.ogl._time.timeLoop && this.ogl._time.timeLoop(!0);
            }), Util.overWrite("updateTarget", fleetDispatcher, () => {
                document.querySelector("#planetList").classList.add("ogl_notReady");
            }), fleetDispatcher.hasEnoughFuel = () => (this.initialResOnPlanet?.deut || fleetDispatcher.deuteriumOnPlanet) >= fleetDispatcher.getConsumption(),
            Util.overWrite("selectMission", fleetDispatcher, !1, () => {
                this.lastMissionOrder = fleetDispatcher.mission, document.querySelector("#fleet2").setAttribute("data-selected-mission", fleetDispatcher.mission);
            }), Util.overWrite("switchToPage", fleetDispatcher, () => {
                fleetDispatcher.getFreeCargoSpace() < 0 && fleetDispatcher.cargoFood && (fleetDispatcher.selectMinFood(),
                    fleetDispatcher.selectMaxFood()), fleetDispatcher.getFreeCargoSpace() < 0 && fleetDispatcher.cargoMetal && (fleetDispatcher.selectMinMetal(),
                        fleetDispatcher.selectMaxMetal()), fleetDispatcher.getFreeCargoSpace() < 0 && fleetDispatcher.cargoCrystal && (fleetDispatcher.selectMinCrystal(),
                            fleetDispatcher.selectMaxCrystal()), fleetDispatcher.getFreeCargoSpace() < 0 && fleetDispatcher.cargoDeuterium && (fleetDispatcher.selectMinDeuterium(),
                                fleetDispatcher.selectMaxDeuterium());
            }, () => {
                "fleet2" == fleetDispatcher.currentPage ? (document.body.classList.add("ogl_destinationPicker"),
                    fleetDispatcher.focusSendFleet()) : "fleet1" == fleetDispatcher.currentPage && (document.body.classList.remove("ogl_destinationPicker"),
                        fleetDispatcher.focusSubmitFleet1());
            }), Util.overWrite("stopLoading", fleetDispatcher, () => {
                "fleet2" == fleetDispatcher.currentPage && (this.validationReady = !0);
            }), fleetDispatcher.submitFleet2 = force => {
                if (this.sent) return !0;
                this.sent = !0, fleetDispatcher.realTarget && (fleetDispatcher.targetPlanet.galaxy = fleetDispatcher.realTarget.galaxy,
                    fleetDispatcher.targetPlanet.system = fleetDispatcher.realTarget.system,
                    fleetDispatcher.targetPlanet.position = fleetDispatcher.realTarget.position,
                    fleetDispatcher.targetPlanet.type = fleetDispatcher.realTarget.type,
                    fleetDispatcher.targetPlanet.name = fleetDispatcher.realTarget.name,
                    fleetDispatcher.refresh()), fleetDispatcher.realSpeedPercent && (fleetDispatcher.speedPercent = fleetDispatcher.realSpeedPercent),
                    force = force || !1;
                let self = this, that = fleetDispatcher;
                var params = {};
                self.ajaxSuccess || (fleetDispatcher.appendTokenParams(params), fleetDispatcher.appendShipParams(params),
                    fleetDispatcher.appendTargetParams(params), fleetDispatcher.appendCargoParams(params),
                    fleetDispatcher.appendPrioParams(params), params.mission = fleetDispatcher.mission,
                    params.speed = fleetDispatcher.speedPercent, params.retreatAfterDefenderRetreat = !0 === fleetDispatcher.retreatAfterDefenderRetreat ? 1 : 0,
                    params.lootFoodOnAttack = !0 === fleetDispatcher.lootFoodOnAttack ? 1 : 0,
                    params.union = fleetDispatcher.union, force && (params.force = force),
                    params.holdingtime = fleetDispatcher.getHoldingTime(), fleetDispatcher.startLoading(),
                    $.post(fleetDispatcher.sendFleetUrl, params, function (response) {
                        response = JSON.parse(response);
                        !0 === response.success ? (fadeBox(response.message, !1), $("#sendFleet").removeAttr("disabled"),
                            self.fleetSent(response.redirectUrl)) : (setTimeout(() => self.sent = !1, 500),
                                response.responseArray && response.responseArray.limitReached && !response.responseArray.force ? (that.updateToken(response.newAjaxToken || ""),
                                    errorBoxDecision(that.loca.LOCA_ALL_NETWORK_ATTENTION, that.locadyn.localBashWarning, that.loca.LOCA_ALL_YES, that.loca.LOCA_ALL_NO, function () {
                                        that.submitFleet2(!0);
                                    })) : (that.displayErrors(response.errors), that.updateToken(response.newAjaxToken || ""),
                                        $("#sendFleet").removeAttr("disabled"), that.stopLoading()));
                    }));
            }, Util.overWrite("refreshTargetPlanet", fleetDispatcher, () => {
                if (fleetDispatcher.union) {
                    fleetDispatcher.mission = 2, fleetDispatcher.refresh();
                    let acsEndTime = 1e3 * (Object.values(fleetDispatcher.unions).find(a => a.id == fleetDispatcher.union)?.time || 0);
                    if (acsEndTime) {
                        if (document.querySelector(".ogl_acsInfo")) return;
                        Util.addDom("hr", {
                            prepend: document.querySelector("#fleetBriefingPart1")
                        });
                        var liMax = Util.addDom("li", {
                            class: "ogl_acsInfo",
                            child: "Allowed max. duration:",
                            prepend: document.querySelector("#fleetBriefingPart1")
                        }), liOffset = Util.addDom("li", {
                            class: "ogl_acsInfo",
                            child: "ACS offset:",
                            prepend: document.querySelector("#fleetBriefingPart1")
                        });
                        let spanMax = Util.addDom("span", {
                            class: "ogl_warning value",
                            parent: liMax
                        }), spanOffset = Util.addDom("span", {
                            class: "value",
                            parent: liOffset
                        });
                        clearInterval(this.acsInterval), this.acsInterval = setInterval(() => {
                            var fleetDurationLeft, acsDurationLeft, acsDurationTreshold, delta;
                            fleetDispatcher.getDuration() && (fleetDurationLeft = 1e3 * fleetDispatcher.getDuration(),
                                acsDurationTreshold = .3 * (acsDurationLeft = acsEndTime - serverTime.getTime() - 1e3 * timeZoneDiffSeconds),
                                delta = fleetDurationLeft - acsDurationLeft, spanOffset.className = "value",
                                acsDurationLeft + acsDurationTreshold < fleetDurationLeft ? (spanOffset.textContent = " too late",
                                    spanOffset.classList.add("ogl_danger")) : acsDurationLeft < fleetDurationLeft ? (spanOffset.textContent = " +" + new Date(delta).toISOString().slice(11, 19),
                                        spanOffset.classList.add("ogl_warning")) : (spanOffset.textContent = " +00:00:00",
                                            spanOffset.classList.add("ogl_ok")), spanMax.textContent = " " + new Date(acsDurationLeft + acsDurationTreshold).toISOString().slice(11, 19));
                        }, 333);
                    }
                }
                fleetDispatcher.mission || ((liMax = new URLSearchParams(window.location.search)).get("mission") ? fleetDispatcher.mission = liMax.get("mission") : fleetDispatcher.mission = this.ogl.db.options.defaultMission,
                    fleetDispatcher.refresh());
            });
    }
    init() {
        if (this.isReady = !0, document.querySelector(".planetlink.active, .moonlink.active")?.classList.add("ogl_disabled"),
            this.addLimiters(), 1 === this.ogl.mode || 2 === this.ogl.mode || 5 === this.ogl.mode ? this.prepareRedirection() : 3 === this.ogl.mode && this.ogl.cache.toSend ? this.prefillTodolistCargo() : this.ogl.db.harvestCoords = void 0,
            !document.querySelector("#fleet1 #warning")) {
            if (this.updateSpeedBar(), this.ogl.shipsList.forEach(shipID => {
                var data, tech;
                fleetDispatcher.fleetHelper.shipsData?.[shipID] && (data = fleetDispatcher.fleetHelper.shipsData[shipID],
                    tech = document.querySelector(`[data-technology="${shipID}"]`),
                    this.ogl.db.shipsCapacity[shipID] = data.cargoCapacity || data.baseCargoCapacity,
                    tech) && tech.setAttribute("title", `
                    <div class="ogl_shipDataInfo">
                        <div class="ogl_icon ogl_${shipID}">${data.name}</div><hr>
                        <i class="material-icons">send</i> Amount : <b>${Util.formatNumber(parseInt(tech.querySelector(".amount").getAttribute("data-value")))}</b><br>
                        <i class="material-icons">package-variant-closed</i> Capacity : <b>${Util.formatNumber(data.cargoCapacity || data.baseCargoCapacity)}</b><br>
                        <i class="material-icons">mode_heat</i> Consumption : <b>${Util.formatNumber(data.fuelConsumption)}</b><br>
                        <i class="material-icons">speed</i> Speed : <b>${Util.formatNumber(data.speed)}</b>
                    </div>
                `);
            }), fleetDispatcher.selectMission(parseInt(fleetDispatcher.mission) || parseInt(this.ogl.db.options.defaultMission)),
                fleetDispatcher.speedPercent = fleetDispatcher.speedPercent || 10, fleetDispatcher.realSpeedPercent = fleetDispatcher.speedPercent,
                1 === this.ogl.mode || 2 === this.ogl.mode ? (fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.shipsForResources()),
                    fleetDispatcher.selectMaxAll()) : 5 === this.ogl.mode && fleetDispatcher.expeditionCount < fleetDispatcher.maxExpeditionCount && this.selectExpedition(this.ogl.db.lastExpeditionShip || this.ogl.db.options.defaultShip),
                8 == fleetDispatcher.mission && (fleetDispatcher.targetPlanet.type = 2),
                fleetDispatcher.refresh(), fleetDispatcher.focusSubmitFleet1(), document.querySelector(".secondcol")) {
                Util.runAsync(() => {
                    document.querySelector("#sendall").classList.add("material-icons"),
                        document.querySelector("#sendall").innerText = "chevron-double-right",
                        document.querySelector("#resetall").classList.add("material-icons"),
                        document.querySelector("#resetall").innerText = "exposure_zero";
                });
                let sender = Util.addDom("div", {
                    title: "loading...",
                    child: "cube-send",
                    class: "material-icons tooltipRight tooltipClose tooltipClick tooltipUpdate",
                    parent: document.querySelector(".secondcol"),
                    ontooltip: () => {
                        let container = Util.addDom("div", {
                            class: "ogl_resourcesPreselection"
                        }), resources = ["metal", "crystal", "deut", "food"];
                        resources.forEach(resourceName => {
                            var item = Util.addDom("div", {
                                class: "ogl_icon ogl_" + resourceName,
                                parent: container,
                                onclick: () => {
                                    input.value = input.value == fleetDispatcher[this.resOnPlanet[resourceName]] ? 0 : fleetDispatcher[this.resOnPlanet[resourceName]],
                                        fleetDispatcher[this.cargo[resourceName]] = input.value,
                                        input.dispatchEvent(new Event("input"));
                                }
                            });
                            let input = Util.addDom("input", {
                                type: "text",
                                parent: item,
                                onclick: e => {
                                    e.stopPropagation();
                                },
                                oninput: () => {
                                    Util.formatInput(input, () => {
                                        input.value = Math.min(fleetDispatcher[this.resOnPlanet[resourceName]], parseInt(input.value.replace(/\D/g, "")) || 0),
                                            fleetDispatcher[this.cargo[resourceName]] = input.value,
                                            input.value = parseInt(input.value.replace(/\D/g, "") || 0).toLocaleString("fr-FR");
                                    });
                                }
                            });
                        }), Util.addDom("hr", {
                            parent: container
                        }), Util.addDom("div", {
                            class: "ogl_button ogl_formValidation",
                            child: "OK",
                            parent: container,
                            onclick: () => {
                                let total = 0;
                                container.querySelectorAll("input").forEach(input => {
                                    total += parseInt(input.value.replace(/\D/g, "")) || 0;
                                }), 0 < total && fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.shipsForResources(!1, total)),
                                    container.querySelectorAll("input").forEach((input, index) => fleetDispatcher[this.cargo[resources[index]]] = parseInt(input.value.replace(/\D/g, "") || 0)),
                                    fleetDispatcher.refresh(), setTimeout(() => fleetDispatcher.focusSubmitFleet1(), 50),
                                    tippy.hideAll();
                            }
                        }), sender._tippy ? sender._tippy.setContent(container) : this.ogl._tooltip.update(container),
                            setTimeout(() => container.querySelector("input").focus(), 100);
                    }
                });
                Util.addDom("div", {
                    title: this.ogl._lang.find("fleetQuickCollect"),
                    child: "local_shipping",
                    class: "material-icons tooltip ogl_quickCollectBtn",
                    parent: document.querySelector(".secondcol"),
                    onclick: () => {
                        document.querySelector(".ogl_requiredShips .ogl_" + this.ogl.db.options.defaultShip)?.click();
                    }
                });
            }
            document.querySelectorAll("#fleet2 .resourceIcon").forEach(icon => {
                Util.addDom("div", {
                    class: "ogl_reverse material-icons",
                    child: "repeat",
                    parent: icon,
                    onclick: e => {
                        var type = icon.classList.contains("metal") ? "metal" : icon.classList.contains("crystal") ? "crystal" : icon.classList.contains("deuterium") ? "deut" : "food";
                        fleetDispatcher[this.cargo[type]] = Math.min(fleetDispatcher[this.resOnPlanet[type]] - fleetDispatcher[this.cargo[type]], fleetDispatcher.getFreeCargoSpace()),
                            fleetDispatcher.refresh();
                    }
                });
            }), this.ogl.mode || (this.hasBeenInitialized = !0);
        }
    }
    setRealTarget(obj, forceParam) {
        obj.galaxy = forceParam?.galaxy || obj.galaxy, obj.system = forceParam?.system || obj.system,
            obj.position = forceParam?.position || obj.position, obj.type = forceParam?.type || obj.type,
            obj.name = forceParam?.name || obj.name, fleetDispatcher.realTarget = obj,
            document.querySelector("#galaxy").value = fleetDispatcher.realTarget.galaxy,
            document.querySelector("#system").value = fleetDispatcher.realTarget.system,
            document.querySelector("#position").value = fleetDispatcher.realTarget.position,
            fleetDispatcher.targetPlanet.galaxy = fleetDispatcher.realTarget.galaxy,
            fleetDispatcher.targetPlanet.system = fleetDispatcher.realTarget.system,
            fleetDispatcher.targetPlanet.position = fleetDispatcher.realTarget.position,
            fleetDispatcher.targetPlanet.type = fleetDispatcher.realTarget.type, document.querySelectorAll(".smallplanet").forEach(planet => {
                var coords = planet.querySelector(".planet-koords").innerText.split(":");
                planet.querySelector(".ogl_currentDestination")?.classList.remove("ogl_currentDestination"),
                    fleetDispatcher.realTarget.galaxy == coords[0] && fleetDispatcher.realTarget.system == coords[1] && fleetDispatcher.realTarget.position == coords[2] && (coords = 1 == fleetDispatcher.realTarget.type ? planet.querySelector(".planetlink") : 3 == fleetDispatcher.realTarget.type && planet.querySelector(".moonlink")) && coords.classList.add("ogl_currentDestination");
            });
    }
    fleetSent(defaultRedirection) {
        if (!this.ajaxSuccess) {
            this.ajaxSuccess = !0, this.ogl.db.previousFleet = {}, this.ogl.db.previousFleet.shipsToSend = fleetDispatcher.shipsToSend,
                this.ogl.db.previousFleet.speedPercent = fleetDispatcher.speedPercent,
                this.ogl.db.previousFleet.targetPlanet = JSON.parse(JSON.stringify(fleetDispatcher.targetPlanet)),
                this.ogl.db.previousFleet.mission = fleetDispatcher.mission, this.ogl.db.previousFleet.expeditionTime = fleetDispatcher.expeditionTime,
                this.ogl.db.previousFleet.cargoMetal = fleetDispatcher.cargoMetal, this.ogl.db.previousFleet.cargoCrystal = fleetDispatcher.cargoCrystal,
                this.ogl.db.previousFleet.cargoDeuterium = fleetDispatcher.cargoDeuterium,
                this.ogl.db.previousFleet.cargoFood = fleetDispatcher.cargoFood;
            var conso = parseInt(parseFloat(fleetDispatcher.getConsumption() || 0)), stats = (this.ogl.currentPlanet.obj.metal -= Math.min(this.initialResOnPlanet.metal, fleetDispatcher.cargoMetal),
                this.ogl.currentPlanet.obj.crystal -= Math.min(this.initialResOnPlanet.crystal, fleetDispatcher.cargoCrystal),
                this.ogl.currentPlanet.obj.deut -= Math.min(this.initialResOnPlanet.deut, fleetDispatcher.cargoDeuterium + conso),
                this.ogl.currentPlanet.obj.food -= Math.min(this.initialResOnPlanet.food, fleetDispatcher.cargoFood),
                this.ogl._stats.getDayStats(serverTime.getTime()));
            if (stats.conso = (stats.conso || 0) + Math.min(this.initialResOnPlanet.deut, conso),
                this.isQuickRaid && this.ogl.db.quickRaidList.shift(), 5 === this.ogl.mode && 15 !== fleetDispatcher.mission && this.ogl.db.options.expeditionRedirect && (this.ogl.mode = 0),
                1 != this.ogl.mode && 2 != this.ogl.mode && 5 != this.ogl.mode && this.prepareRedirection(),
                1 === this.ogl.mode || 2 === this.ogl.mode || 5 === this.ogl.mode && this.ogl.db.options.expeditionRedirect) this.ogl._shortcut.redirectToPlanet(1); else if (5 === this.ogl.mode) this.ogl._shortcut.redirectToPlanet(0); else if (3 === this.ogl.mode && this.ogl.cache.toSend) {
                    let cumul = [0, 0, 0];
                    var stats = new URLSearchParams(window.location.search);
                    stats.get("substractMode") && stats.get("targetid") && (conso = stats.get("targetid"),
                        cumul[0] -= this.ogl.db.myPlanets[conso]?.metal || 0, cumul[1] -= this.ogl.db.myPlanets[conso]?.crystal || 0,
                        cumul[2] -= this.ogl.db.myPlanets[conso]?.deut || 0), this.ogl.cache.toSend.forEach(build => {
                            var id = new URLSearchParams(window.location.search).get("targetid"), cost = this.ogl.db.myPlanets[id].todolist[build.id][build.level].cost;
                            for (let i = 0; i < 3; i++) {
                                var res = 2 === i ? "deut" : 1 === i ? "crystal" : "metal", cargo = 2 == i ? "cargoDeuterium" : 1 == i ? "cargoCrystal" : "cargoMetal", cargo = Math.min(fleetDispatcher[cargo] - cumul[i], build.cost[res]);
                                cumul[i] += cargo, cost[res] -= cargo;
                            }
                            build.amount && cost.metal + cost.crystal + cost.deut <= 0 && delete this.ogl.db.myPlanets[id].todolist[build.id][build.level],
                                Object.values(this.ogl.db.myPlanets[id].todolist[build.id]).length < 1 && delete this.ogl.db.myPlanets[id].todolist[build.id];
                        }), window.location.href = defaultRedirection;
                } else 4 === this.ogl.mode ? (stats = parseInt(new URLSearchParams(window.location.search).get("oglmsg")) || 0,
                    this.ogl.cache.reports[stats] && (this.ogl.cache.reports[stats].attacked = !0),
                    window.location.href = this.ogl._shortcut.getRedirectionLink({
                        component: "messages"
                    })) : window.location.href = defaultRedirection;
            this.ogl.save();
        }
    }
    addLimiters() {
        var limiterContainer = document.querySelector("#fleetdispatchcomponent"), limiterContainer = Util.addDom("fieldset", {
            parent: limiterContainer
        }), limitResourceLabel = (Util.addDom("legend", {
            parent: limiterContainer,
            child: '<i class="material-icons">settings</i> Settings'
        }), Util.addDom("label", {
            class: "ogl_limiterLabel tooltip",
            "data-limiter-type": "resource",
            title: this.ogl._lang.find("resourceLimiter"),
            parent: limiterContainer,
            child: "Limit resources"
        })), limitResourceLabel = Util.addDom("input", {
            type: "checkbox",
            parent: limitResourceLabel,
            onclick: () => {
                this.ogl.db.fleetLimiter.resourceActive = !this.ogl.db.fleetLimiter.resourceActive,
                    this.updateLimiter();
            }
        }), limitShipLabel = Util.addDom("label", {
            class: "ogl_limiterLabel tooltip",
            "data-limiter-type": "ship",
            title: this.ogl._lang.find("fleetLimiter"),
            parent: limiterContainer,
            child: "Limit ships"
        }), limitShipLabel = Util.addDom("input", {
            type: "checkbox",
            parent: limitShipLabel,
            onclick: () => {
                this.ogl.db.fleetLimiter.shipActive = !this.ogl.db.fleetLimiter.shipActive,
                    this.updateLimiter();
            }
        }), limitFoodLabel = Util.addDom("label", {
            class: "ogl_limiterLabel tooltip",
            title: this.ogl._lang.find("forceIgnoreFood"),
            parent: limiterContainer,
            child: "Ignore Food"
        }), limitFoodLabel = Util.addDom("input", {
            type: "checkbox",
            parent: limitFoodLabel,
            onclick: () => {
                this.ogl.db.fleetLimiter.ignoreFood = !this.ogl.db.fleetLimiter.ignoreFood,
                    this.updateLimiter();
            }
        });
        let keepLabel = Util.addDom("div", {
            class: "ogl_limiterGroup tooltip",
            title: this.ogl._lang.find("forceKeepCapacity"),
            parent: limiterContainer,
            child: 'Locked <i class="material-icons">blocked</i>'
        });
        [202, 203, 219, 200].forEach(shipID => {
            let item = Util.addDom("div", {
                class: "ogl_icon ogl_" + shipID,
                parent: keepLabel,
                onclick: () => {
                    keepLabel.querySelector(".ogl_active")?.classList.remove("ogl_active"),
                        item.classList.add("ogl_active"), this.ogl.db.keepEnoughCapacityShip = shipID,
                        this.updateLimiter();
                }
            });
            this.ogl.db.keepEnoughCapacityShip == shipID && item.classList.add("ogl_active");
        }), this.ogl.db.fleetLimiter.resourceActive && (limitResourceLabel.checked = !0),
            this.ogl.db.fleetLimiter.shipActive && (limitShipLabel.checked = !0), this.ogl.db.fleetLimiter.ignoreFood && (limitFoodLabel.checked = !0),
            this.updateLimiter();
    }
    updateLimiter() {
        unsafeWindow.fleetDispatcher && (this.totalCapacity = 0, fleetDispatcher.shipsOnPlanet.forEach((entry, index) => {
            let forced = 0;
            this.ogl.db.keepEnoughCapacityShip == entry.id && 1 !== this.ogl.mode && 2 !== this.ogl.mode && (forced = this.shipsForResources(entry.id)),
                this.ogl.db.fleetLimiter.shipActive && this.ogl.db.fleetLimiter.data[entry.id] ? entry.number = Math.max(0, this.initialShipsOnPlanet.find(e => e.id == entry.id).number - Math.max(this.ogl.db.fleetLimiter.data[entry.id], forced)) : entry.number = this.initialShipsOnPlanet.find(e => e.id == entry.id).number - forced,
                fleetDispatcher.shipsToSend.find(e => e.id == entry.id)?.number >= entry.number && fleetDispatcher.selectShip(entry.id, entry.number);
            var text, techDom = document.querySelector(`[data-technology="${entry.id}"]`);
            techDom && (techDom.querySelector(".ogl_maxShip")?.remove(), (text = Util.addDom("div", {
                class: "ogl_maxShip",
                parent: techDom
            })).innerHTML = `<b>-${Util.formatToUnits(this.ogl.db.fleetLimiter.shipActive ? Math.max(this.ogl.db.fleetLimiter.data[entry.id], forced) : forced)}</b>`,
                text.addEventListener("click", () => {
                    Util.runAsync(() => this.ogl._ui.openFleetProfile()).then(e => this.ogl._popup.open(e));
                }), this.ogl.db.fleetLimiter.shipActive || this.ogl.db.keepEnoughCapacityShip == entry.id || text.classList.add("ogl_hidden"),
                entry.number <= 0 ? (techDom.classList.add("ogl_notEnough"), fleetDispatcher.removeShip(entry.id)) : techDom.classList.remove("ogl_notEnough"),
                this.totalCapacity += this.ogl.db.shipsCapacity[entry.id] * entry.number),
                document.querySelectorAll(".ogl_flashNotEnough").forEach(e => {
                    0 == e.value && e.classList.remove("ogl_flashNotEnough");
                });
        }), ["metal", "crystal", "deut", "food"].forEach(resourceName => {
            this.ogl.db.fleetLimiter.resourceActive ? fleetDispatcher[this.resOnPlanet[resourceName]] = Math.max(0, this.initialResOnPlanet[resourceName] - (this.ogl.db.fleetLimiter.data[resourceName] || 0)) : fleetDispatcher[this.resOnPlanet[resourceName]] = Math.max(0, this.initialResOnPlanet[resourceName]),
                "food" == resourceName && this.ogl.db.fleetLimiter.ignoreFood && (fleetDispatcher[this.resOnPlanet[resourceName]] = 0),
                fleetDispatcher[this.cargo[resourceName]] = Math.min(fleetDispatcher[this.cargo[resourceName]], fleetDispatcher[this.resOnPlanet[resourceName]]);
            var text, techDom = document.querySelector("#fleet2 #resources ." + resourceName?.replace("deut", "deuterium"));
            techDom && (techDom.querySelector(".ogl_maxShip")?.remove(), (text = Util.addDom("div", {
                class: "ogl_maxShip",
                parent: techDom
            })).innerHTML = `<b>-${Util.formatToUnits(this.ogl.db.fleetLimiter.resourceActive ? this.ogl.db.fleetLimiter.data[resourceName] : 0, 0)}</b>`,
                text.addEventListener("click", () => {
                    Util.runAsync(() => this.ogl._ui.openFleetProfile()).then(e => this.ogl._popup.open(e));
                }), techDom.parentNode.querySelector("input").classList.add("ogl_inputCheck"));
        }), fleetDispatcher.refresh(), this.updateRequiredShips(), initTooltips());
    }
    updateRequiredShips() {
        let requiredShips = document.querySelector(".ogl_requiredShips") || Util.addDom("span", {
            class: "ogl_requiredShips",
            parent: document.querySelector("#civilships #civil") || document.querySelector("#warning")
        });
        requiredShips.innerText = "", this.ogl.fretShips.forEach(shipID => {
            let amount = this.shipsForResources(shipID);
            var item = Util.addDom("div", {
                class: "tooltip ogl_required ogl_icon ogl_" + shipID,
                title: Util.formatNumber(amount),
                parent: requiredShips,
                child: Util.formatToUnits(amount),
                onclick: () => {
                    fleetDispatcher.selectShip(shipID, amount), fleetDispatcher.selectMaxAll(),
                        fleetDispatcher.refresh(), fleetDispatcher.focusSubmitFleet1();
                }
            });
            (fleetDispatcher.shipsOnPlanet.find(e => e.id == shipID)?.number || 0) < amount && item.classList.add("ogl_notEnough");
        }), fleetDispatcher.shipsOnPlanet.forEach((entry, index) => {
            let shipID = entry.id;
            var domElement = document.querySelector(`[data-technology="${shipID}"]`);
            if (domElement) {
                domElement = domElement.querySelector(".ogl_shipFlag") || Util.addDom("div", {
                    class: "ogl_shipFlag",
                    parent: domElement
                });
                if (domElement.innerText = "", Util.addDom("div", {
                    class: "ogl_reverse material-icons tooltip",
                    title: "Reverse selection",
                    child: "repeat",
                    parent: domElement,
                    onclick: e => {
                        e.stopPropagation();
                        e = fleetDispatcher.shipsOnPlanet.find(e => e.id == entry.id)?.number - (fleetDispatcher.findShip(entry.id)?.number || 0);
                        fleetDispatcher.selectShip(entry.id, e), fleetDispatcher.refresh();
                    }
                }), -1 < this.ogl.fretShips.indexOf(shipID)) {
                    let favIcon = Util.addDom("div", {
                        class: "material-icons ogl_fav tooltip",
                        title: "Default ship",
                        child: "star",
                        parent: domElement,
                        onclick: () => {
                            this.ogl.db.options.defaultShip = shipID, "settings" == this.ogl.db.currentSide && this.ogl.fretShips.forEach(sid => {
                                document.querySelector('.ogl_config [data-opt="defaultShip"] .ogl_' + sid).classList.remove("ogl_active"),
                                    sid == shipID && document.querySelector('.ogl_config [data-opt="defaultShip"] .ogl_' + sid).classList.add("ogl_active");
                            }), document.querySelectorAll("#fleet1 .ogl_fav").forEach(e => e.classList.add("ogl_grayed")),
                                favIcon.classList.remove("ogl_grayed"), this.updateLimiter(),
                                1 === this.ogl.mode || 2 === this.ogl.mode ? (this.ogl.fretShips.forEach(sid => fleetDispatcher.selectShip(sid, 0)),
                                    fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.shipsForResources()),
                                    fleetDispatcher.selectMaxAll()) : 3 === this.ogl.mode && this.ogl.cache.toSend && (this.ogl.fretShips.forEach(sid => fleetDispatcher.selectShip(sid, 0)),
                                        this.prefillTodolistCargo());
                        }
                    });
                    if (this.ogl.db.options.defaultShip != shipID && favIcon.classList.add("ogl_grayed"),
                        -1 < [202, 203, 219, 200].indexOf(shipID)) {
                        let forcedIcon = Util.addDom("div", {
                            class: "material-icons ogl_shipLock tooltip",
                            title: "Locked ship",
                            child: "blocked",
                            parent: domElement,
                            onclick: () => {
                                (this.ogl.db.keepEnoughCapacityShip == shipID ? (this.ogl.db.keepEnoughCapacityShip = 200,
                                    document.querySelectorAll("#fleet1 .ogl_shipLock").forEach(e => e.classList.add("ogl_grayed")),
                                    document.querySelectorAll(".ogl_limiterGroup .ogl_active").forEach(e => e.classList.remove("ogl_active")),
                                    document.querySelector(".ogl_limiterGroup .ogl_200")) : (this.ogl.db.keepEnoughCapacityShip = shipID,
                                        document.querySelectorAll("#fleet1 .ogl_shipLock").forEach(e => e.classList.add("ogl_grayed")),
                                        forcedIcon.classList.remove("ogl_grayed"), document.querySelectorAll(".ogl_limiterGroup .ogl_active").forEach(e => e.classList.remove("ogl_active")),
                                        document.querySelector(".ogl_limiterGroup .ogl_" + shipID))).classList.add("ogl_active"),
                                    this.updateLimiter();
                            }
                        });
                        this.ogl.db.keepEnoughCapacityShip != shipID && forcedIcon.classList.add("ogl_grayed");
                    }
                }
            }
        }), document.querySelector(".ogl_popup.ogl_active") || fleetDispatcher.focusSubmitFleet1();
    }
    shipsForResources(shipID, resource) {
        return shipID = shipID || this.ogl.db.options.defaultShip, -1 === (resource = 0 === resource ? 0 : resource || -1) && (unsafeWindow.fleetDispatcher ? ["metal", "crystal", "deut", "food"].forEach(resourceName => resource += fleetDispatcher[this.resOnPlanet[resourceName]]) : ["metal", "crystal", "deut", "food"].forEach(resourceName => resource += this.ogl.currentPlanet?.obj?.[resourceName])),
            Math.ceil(resource / this.ogl.db.shipsCapacity[shipID]) || 0;
    }
    selectExpedition(shipID) {
        if (!fleetDispatcher.fetchTargetPlayerDataTimeout) {
            this.ogl.mode = 5, fleetDispatcher.resetShips(), fleetDispatcher.resetCargo();
            var coords = [fleetDispatcher.currentPlanet.galaxy, fleetDispatcher.currentPlanet.system, fleetDispatcher.currentPlanet.position], expeditionData = this.ogl.calcExpeditionMax();
            let amount = Math.max(this.ogl.db.options.expeditionValue ? 0 : Math.ceil(expeditionData.treshold.base / {
                202: 1,
                203: 3,
                219: 5.75
            }[shipID]), this.shipsForResources(shipID, expeditionData.max)), fillerID = 0, randomSystem = ([218, 213, 211, 215, 207, 206, 205, 204].forEach(filler => {
                0 <= this.ogl.db.options.expeditionBigShips.indexOf(filler) && 0 == fillerID && 0 < document.querySelector(`.technology[data-technology="${filler}"] .amount`)?.getAttribute("data-value") && (fillerID = filler);
            }), fleetDispatcher.shipsOnPlanet.forEach(ship => {
                ship.id == shipID ? fleetDispatcher.selectShip(ship.id, amount) : (ship.id == fillerID && shipID != fillerID || 210 == ship.id || 219 == ship.id && 219 != shipID) && fleetDispatcher.selectShip(ship.id, 1);
            }), Math.round(Math.random() * this.ogl.db.options.expeditionRandomSystem) * (Math.round(Math.random()) ? 1 : -1) + coords[1]);
            500 <= randomSystem && (randomSystem -= 499), this.setRealTarget(fleetDispatcher.realTarget, {
                galaxy: coords[0],
                system: randomSystem,
                position: 16,
                type: 1,
                name: fleetDispatcher.loca.LOCA_EVENTH_ENEMY_INFINITELY_SPACE
            }), fleetDispatcher.selectMission(15), fleetDispatcher.expeditionTime = 1,
                fleetDispatcher.updateExpeditionTime(), fleetDispatcher.refresh(), fleetDispatcher.focusSubmitFleet1(),
                this.ogl.db.lastExpeditionShip = shipID, this.prepareRedirection();
        }
    }
    updateSpeedBar() {
        document.querySelector("#speedPercentage").addEventListener("mousemove", event => {
            document.querySelector("#speedPercentage").querySelectorAll(".selected").forEach(e => e.classList.remove("selected")),
                document.querySelector("#speedPercentage").querySelector(`[data-step="${fleetDispatcher.realSpeedPercent}"]`).classList.add("selected");
        }), document.querySelector("#speedPercentage").addEventListener("click", e => {
            e.target.getAttribute("data-step") && (document.querySelector("#speedPercentage .bar").style.width = e.target.offsetLeft + e.target.offsetWidth + "px",
                document.querySelector("#speedPercentage").querySelectorAll(".selected").forEach(e => e.classList.remove("selected")),
                e.target.classList.add("selected"), fleetDispatcher.speedPercent = e.target.getAttribute("data-step"),
                fleetDispatcher.realSpeedPercent = e.target.getAttribute("data-step"),
                fleetDispatcher.refresh()), fleetDispatcher.realSpeedPercent = fleetDispatcher.speedPercent,
                fleetDispatcher.setFleetPercent(fleetDispatcher.speedPercent), fleetDispatcher.cargoDeuterium + fleetDispatcher.getConsumption() >= fleetDispatcher.getDeuteriumOnPlanetWithoutConsumption() && (fleetDispatcher.cargoDeuterium = 0,
                    fleetDispatcher.selectMaxDeuterium(), fleetDispatcher.refresh()), fleetDispatcher.focusSendFleet();
        });
    }
    prefillTodolistCargo() {
        let curmulRes = [0, 0, 0];
        var maxRes = [0, 0, 0], urlParams = (this.ogl.cache.toSend.forEach(build => {
            curmulRes[0] = curmulRes[0] + build.cost.metal, curmulRes[1] = curmulRes[1] + build.cost.crystal,
                curmulRes[2] = curmulRes[2] + build.cost.deut;
        }), maxRes[0] = Math.min(fleetDispatcher.metalOnPlanet, curmulRes[0]), maxRes[1] = Math.min(fleetDispatcher.crystalOnPlanet, curmulRes[1]),
            maxRes[2] = Math.min(fleetDispatcher.deuteriumOnPlanet, curmulRes[2]), maxRes = maxRes[0] + maxRes[1] + maxRes[2],
            new URLSearchParams(window.location.search));
        urlParams.get("substractMode") && urlParams.get("targetid") && (urlParams = urlParams.get("targetid"),
            curmulRes[0] = Math.max(curmulRes[0] - (this.ogl.db.myPlanets[urlParams]?.metal || 0), 0),
            curmulRes[1] = Math.max(curmulRes[1] - (this.ogl.db.myPlanets[urlParams]?.crystal || 0), 0),
            curmulRes[2] = Math.max(curmulRes[2] - (this.ogl.db.myPlanets[urlParams]?.deut || 0), 0)),
            urlParams = curmulRes[0] + curmulRes[1] + curmulRes[2], fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.shipsForResources(this.ogl.db.options.defaultShip, Math.min(urlParams, maxRes))),
            0 < fleetDispatcher.shipsToSend.length && (fleetDispatcher.cargoMetal = Math.min(curmulRes[0], fleetDispatcher.metalOnPlanet),
                fleetDispatcher.cargoCrystal = Math.min(curmulRes[1], fleetDispatcher.crystalOnPlanet),
                fleetDispatcher.cargoDeuterium = Math.min(curmulRes[2], fleetDispatcher.deuteriumOnPlanet),
                fleetDispatcher.refresh());
    }
    prepareRedirection() {
        if (!this.redirectionReady || this.ogl.mode) return void (this.redirectionReady = !0);
    }
    sendNextMiniFleet() {
        if (!(this.miniFleetQueue.length < 1)) {
            let item = this.miniFleetQueue[0], params = {
                mission: item.order,
                galaxy: item.galaxy,
                system: item.system,
                position: item.position,
                type: item.type,
                shipCount: item.ships || this.ogl.db.spyProbesCount,
                token: token,
                uid: item.uid,
                popup: item.popup
            };
            item.additionalParams && "object" == typeof item.additionalParams && Object.keys(item.additionalParams).map(key => {
                params[key] || (params[key] = item.additionalParams[key]);
            }), $.ajax(miniFleetLink, {
                data: params,
                dataType: "json",
                type: "POST"
            });
        }
    }
    updateSpyFunctions() {
        sendShips = (order, galaxy, system, planet, planettype, shipCount, additionalParams, popup) => {
            var item = {}, shipCount = (item.order = order, item.galaxy = galaxy,
                item.system = system, item.position = planet, item.type = planettype,
                item.ships = shipCount, item.additionalParams = additionalParams, item.retry = 0,
                item.uid = crypto.randomUUID(), item.popup = popup || !1, document.querySelectorAll(`[onclick*="sendShips(${order}, ${galaxy}, ${system}, ${planet}, ${planettype}"]:not([data-spy-coords])`).forEach(e => {
                    e.setAttribute("data-spy-coords", galaxy + `:${system}:${planet}:` + planettype);
                }), document.querySelectorAll(`[data-spy-coords="${galaxy}:${system}:${planet}:${planettype}"]`).forEach(e => e.setAttribute("data-spy", "prepare")),
                this.miniFleetQueue.length < 1);
            this.miniFleetQueue.push(item), shipCount && this.sendNextMiniFleet();
        }, sendShipsWithPopup = (order, galaxy, system, planet, planettype, shipCount, additionalParams) => {
            sendShips(order, galaxy, system, planet, planettype, shipCount, additionalParams, !0);
        };
    }
    checkSendShips() {
        document.querySelectorAll('[onclick*="sendShips(6"]:not([data-spy-coords]), [onclick*="sendShipsWithPopup(6"]:not([data-spy-coords])').forEach(element => {
            var matches = element.getAttribute("onclick").match(/(?<=sendShips[WithPopup]*?\()(.*?)(?=\))/);
            matches && (matches = matches[0].match(/\d+/g), element.setAttribute("data-spy-coords", matches[1] + `:${matches[2]}:${matches[3]}:` + matches[4]),
                matches = this.ogl.db.pdb[`${matches[1]}:${matches[2]}:` + matches[3]]?.spy?.[1 == matches[4] ? 0 : 1] || 0,
                serverTime.getTime() - matches < this.ogl.db.options.spyIndicatorDelay) && element.setAttribute("data-spy", "recent");
        }), document.querySelectorAll('[onclick*="sendShips(8"]:not([data-spy-coords]), [onclick*="sendShipsWithPopup(8"]:not([data-spy-coords])').forEach(element => {
            var matches = element.getAttribute("onclick").match(/[sendShips|sendShipsWithPopup]\((\d|,| )+\)/);
            matches && (matches = matches[0].match(/\d+/g), element.setAttribute("data-spy-coords", matches[1] + `:${matches[2]}:${matches[3]}:` + matches[4]));
        });
    }
    updateSystemSpy() {
        let self = this;
        document.querySelector(".spysystemlink").addEventListener("click", event => {
            event.preventDefault(), event.stopPropagation();
            let shortcutButton = document.querySelector('[data-key-id="galaxySpySystem"]');
            event = event.target.getAttribute("data-target-url");
            if (event) {
                let hasError = !1;
                shortcutButton?.setAttribute("data-spy", "prepare"), $.post(event, {
                    galaxy: $("#galaxy_input").val(),
                    system: $("#system_input").val(),
                    token: token
                }, "json").done(function (json) {
                    json = JSON.parse(json);
                    token = json.newAjaxToken, updateOverlayToken("phalanxDialog", json.newAjaxToken),
                        updateOverlayToken("phalanxSystemDialog", json.newAjaxToken),
                        json.count || (self.ogl._notification.addToQueue(json.text, !1),
                            hasError = !0), json.planets.forEach(params => {
                                document.querySelectorAll(`[data-spy-coords="${params.galaxy}:${params.system}:${params.position}:${params.type}"]`).forEach(e => e.setAttribute("data-spy", "done")),
                                    self.ogl.db.pdb[params.galaxy + `:${params.system}:` + params.position] && (self.ogl.db.pdb[params.galaxy + `:${params.system}:` + params.position].spy = self.ogl.db.pdb[params.galaxy + `:${params.system}:` + params.position].spy || [],
                                        1 == params.type ? self.ogl.db.pdb[params.galaxy + `:${params.system}:` + params.position].spy[0] = serverTime.getTime() : self.ogl.db.pdb[params.galaxy + `:${params.system}:` + params.position].spy[1] = serverTime.getTime());
                            }), hasError ? shortcutButton?.setAttribute("data-spy", "fail") : shortcutButton?.setAttribute("data-spy", "done");
                });
            }
        });
    }
}

class GalaxyManager extends Manager {
    init() {
        this.isReady || (this.isReady = !0, this.unloadSystem(), submitForm());
    }
    load() {
        if ("galaxy" == this.ogl.page && unsafeWindow.galaxy) {
            this.galaxy = galaxy, this.system = system;
            let loader = document.querySelector("#galaxyLoading");
            loader.setAttribute("data-currentposition", this.galaxy + ":" + this.system),
                Util.overWrite("loadContentNew", unsafeWindow, (g, s) => {
                    this.unloadSystem(), loader.setAttribute("data-currentPosition", g + ":" + s),
                        tippy.hideAll();
                }), submitForm(), this.ogl._fleet.updateSystemSpy();
        }
    }
    check(data) {
        if (data.success && data.system) {
            this.galaxy = data.system.galaxy, this.system = data.system.system,
                galaxy = this.galaxy, system = this.system, document.querySelector("#galaxy_input").value = this.galaxy,
                document.querySelector("#system_input").value = this.system;
            let ptrePositions = {}, ptreActivities = {}, getActivity = (this.ogl.db.spyProbesCount = data.system.settingsProbeCount || 0,
                element => 15 == element.activity.showActivity ? "*" : element.activity.idleTime || 60);
            data.system.galaxyContent.forEach(line => {
                var position = line.position;
                let debris = {
                    metal: 0,
                    crystal: 0,
                    deut: 0,
                    total: 0
                }, row = document.querySelector("#galaxyRow" + position);
                if (16 == position) debris.metal = parseInt(line.planets.resources.metal.amount),
                    debris.crystal = parseInt(line.planets.resources.crystal.amount),
                    debris.deut = parseInt(line.planets.resources.deuterium.amount),
                    debris.total = debris.metal + debris.crystal + debris.deut, this.updateDebrisP16(debris, row); else {
                    var player, planet, coords = `${this.galaxy}:${this.system}:` + position, playerID = parseInt(99999 == line.player.playerId ? -1 : line.player.playerId), playerName = line.player.playerName, playerStatus = Array.from(row.querySelector('.cellPlayerName span[class*="status_"]')?.classList || []).filter(e => e.startsWith("status_"))[0], playerStatus = this.ogl._highscore.nameToTagList[playerStatus], isOwn = playerID == this.ogl.account.id, rank = line.player.highscorePositionPlayer;
                    let activities = [], planetID = -1, moonID = -1, moonSize = -1;
                    row.querySelector(".cellDebris").classList.remove("ogl_important"),
                        line.planets.forEach(element => {
                            1 == element.planetType ? (activities[0] = getActivity(element),
                                planetID = element.isDestroyed ? -1 : parseInt(element.planetId)) : 2 == element.planetType ? (debris.metal = parseInt(element.resources.metal.amount),
                                    debris.crystal = parseInt(element.resources.crystal.amount),
                                    debris.deut = parseInt(element.resources.deuterium.amount),
                                    debris.total = debris.metal + debris.crystal + debris.deut,
                                    this.updateDebris(debris, row)) : 3 == element.planetType && (activities[1] = getActivity(element),
                                        moonID = element.isDestroyed ? -1 : parseInt(element.planetId),
                                        moonSize = parseInt(element.size));
                        }), line.player.isAdmin || (line = this.ogl.db.pdb[coords] || {
                            pid: -1,
                            mid: -1
                        }, this.ogl.ptreKey && (ptrePositions[coords] = {}, ptrePositions[coords].teamkey = this.ogl.ptreKey,
                            ptrePositions[coords].galaxy = this.galaxy, ptrePositions[coords].system = this.system,
                            ptrePositions[coords].position = position, ptrePositions[coords].timestamp_ig = serverTime.getTime(),
                            ptrePositions[coords].old_player_id = line.uid || -1, ptrePositions[coords].timestamp_api = line?.api || -1,
                            ptrePositions[coords].old_name = line?.name || !1, ptrePositions[coords].old_rank = line?.score?.globalRanking || -1,
                            ptrePositions[coords].old_score = line?.score?.global || -1,
                            ptrePositions[coords].old_fleet = line?.score?.military || -1,
                            playerID < 0 && line.pid != planetID ? (ptrePositions[coords].id = -1,
                                ptrePositions[coords].player_id = -1, ptrePositions[coords].name = !1,
                                ptrePositions[coords].rank = -1, ptrePositions[coords].score = -1,
                                ptrePositions[coords].fleet = -1, ptrePositions[coords].status = !1,
                                ptrePositions[coords].moon = {
                                    id: -1
                                }) : playerID < 0 && delete ptrePositions[coords]), line.pid != planetID && (this.ogl.removeOldPlanetOwner(coords, playerID),
                                    delete this.ogl.db.pdb[coords]), 0 < playerID && (this.ogl.db.pdb[coords] = this.ogl.db.pdb[coords] || {},
                                        player = this.ogl.db.udb[playerID] || this.ogl.createPlayer(playerID),
                                        planet = this.ogl.db.pdb[coords], !this.ogl.ptreKey || line.pid == planetID && (line.mid || -1) == moonID ? delete ptrePositions[coords] : (ptrePositions[coords].id = planetID,
                                            ptrePositions[coords].player_id = playerID, ptrePositions[coords].name = playerName || !1,
                                            ptrePositions[coords].rank = rank || -1, ptrePositions[coords].score = player.score?.global || -1,
                                            ptrePositions[coords].fleet = player.score?.military || -1,
                                            ptrePositions[coords].status = playerStatus, -1 < moonID && (ptrePositions[coords].moon = {},
                                                ptrePositions[coords].moon.id = moonID, ptrePositions[coords].moon.size = moonSize),
                                            console.log(coords + ` | ${line.pid} -> ${planetID} | ${line.mid} -> ` + moonID)),
                                        planet.uid = playerID, planet.pid = planetID, planet.mid = moonID,
                                        planet.coo = coords, player.uid = playerID, player.name = playerName,
                                        player.status = playerStatus, player.liveUpdate = serverTime.getTime(),
                                        player.score = player.score || {}, player.score.globalRanking = rank,
                                        player.planets = player.planets || [], player.planets.indexOf(coords) < 0 && player.planets.push(coords),
                                        this.updateRow(player, row, isOwn, coords), player.pin || -1 < this.ogl.db.lastPinnedList.indexOf(playerID)) && this.ogl.db.pdb[coords] && (this.ogl.db.pdb[coords].api = serverTime.getTime(),
                                            this.ogl.db.pdb[coords].acti = [activities[0], activities[1], serverTime.getTime()],
                                            this.ogl.db.pdb[coords].debris = debris.total, document.querySelector(".ogl_side.ogl_active") && this.ogl.db.currentSide == playerID && this.ogl._topbar.openPinnedDetail(playerID),
                                            this.ogl.ptreKey) && (ptreActivities[coords] = {}, ptreActivities[coords].id = planetID,
                                                ptreActivities[coords].player_id = playerID, ptreActivities[coords].teamkey = this.ogl.ptreKey,
                                                ptreActivities[coords].mv = "v" == playerStatus, ptreActivities[coords].activity = activities[0],
                                                ptreActivities[coords].galaxy = this.galaxy, ptreActivities[coords].system = this.system,
                                                ptreActivities[coords].position = position, ptreActivities[coords].main = this.ogl.db.pdb[coords].home || !1,
                                                ptreActivities[coords].cdr_total_size = debris.total, -1 < moonID) && (ptreActivities[coords].moon = {},
                                                    ptreActivities[coords].moon.id = moonID, ptreActivities[coords].moon.activity = activities[1]));
                }
            }), 0 < Object.keys(ptrePositions).length && this.ogl.PTRE.postPositions(ptrePositions),
                0 < Object.keys(ptreActivities).length && this.ogl.PTRE.postActivities(ptreActivities),
                this.checkCurrentSystem();
            var data = document.querySelector(".ctGalaxyFooter .ogl_lastGalaxyRefresh") || Util.addDom("div", {
                class: "ogl_lastGalaxyRefresh tooltip",
                after: document.querySelector(".ctGalaxyFooter #colonized"),
                title: "Last galaxy refresh"
            }), timeObj = this.ogl._time.getObj();
            data.innerText = "", data.appendChild(this.ogl._time.convertTimestampToDate(this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server));
        } else this.ogl._notification.addToQueue(`Error, cannot fetch [${this.galaxy}:${this.system}] data`);
    }
    updateRow(player, row, isOwn, coords) {
        var page = Math.max(1, Math.ceil(player.score.globalRanking / 100));
        this.ogl._ui.turnIntoPlayerLink(player.uid, row.querySelector('.cellPlayerName [class*="status_abbr"]'), player.name, player.status),
            Util.addDom("a", {
                class: "ogl_ranking",
                parent: row.querySelector(".cellPlayerName"),
                href: `${window.location.href.split('?')[0]}?page=highscore&site=${page}&searchRelId=` + player.uid,
                child: "#" + player.score.globalRanking
            }), isOwn || (this.ogl._ui.addPinButton(row.querySelector(".cellPlayerName"), player.uid),
                this.ogl._ui.addTagButton(row.querySelector(".cellPlanetName"), coords)),
            player.uid == this.ogl.db.currentSide && row.querySelector(".cellPlayerName").classList.add("ogl_active");
    }
    updateDebris(debris, row) {
        if (0 < debris.total) {
            var row = row.querySelector(".microdebris"), ships = (row.classList.remove("debris_1"),
                row.querySelector('[onclick*="sendShips(8"]')), row = Util.addDom("div", {
                    parent: row
                });
            if (ships) {
                let params = ships.getAttribute("onclick").match(/\d+/g).map(Number);
                row.setAttribute("data-spy-coords", `${params[1]}:${params[2]}:${params[3]}:2`),
                    row.addEventListener("click", () => sendShips(params[0], params[1], params[2], params[3], params[4], params[5]));
            }
            row.innerHTML = Util.formatToUnits(debris.total, 0), debris.total >= this.ogl.db.options.resourceTreshold && row.closest(".cellDebris").classList.add("ogl_important");
        }
    }
    updateDebrisP16(debris, row) {
        if (0 < debris.total) {
            let content = row.querySelectorAll(".ListLinks li");
            var scouts = (content = content[0] ? content : document.querySelectorAll("#debris16 .ListLinks li"))[3], action = content[4];
            (document.querySelector(".expeditionDebrisSlotBox .ogl_expeditionRow") || Util.addDom("div", {
                class: "ogl_expeditionRow",
                parent: document.querySelector(".expeditionDebrisSlotBox")
            })).innerHTML = `
                <div>
                    <div class="material-icons">debris</div>
                </div>
                <div class="ogl_expeditionDebris">
                    <div class="ogl_icon ogl_metal">${Util.formatToUnits(debris.metal)}</div>
                    <div class="ogl_icon ogl_crystal">${Util.formatToUnits(debris.crystal)}</div>
                    <div class="ogl_icon ogl_deut">${Util.formatToUnits(debris.deut)}</div>
                    <div class="ogl_expeditionText">${scouts.innerText}</div>
                    <div class="ogl_expeditionText">${action.outerHTML}</div>
                </div>
            `, debris.total >= this.ogl.db.options.resourceTreshold && document.querySelector(".ogl_expeditionRow").classList.add("ogl_important");
        }
        row.classList.remove("ogl_hidden");
    }
    unloadSystem() {
        document.querySelector("#galaxyRow16") && (document.querySelector(".ogl_expeditionRow") && document.querySelector(".ogl_expeditionRow").remove(),
            document.querySelector("#galaxyRow16").classList.remove("ogl_important"));
        for (let i = 1; i < 16; i++) document.querySelectorAll(`#galaxyRow${i} .galaxyCell:not(.cellPosition)`).forEach(e => {
            e.innerText = "", e.classList.remove("ogl_important"), e.classList.remove("ogl_active");
        }), document.querySelector("#galaxyRow" + i).className = "galaxyRow ctContentRow empty_filter filtered_filter_empty";
    }
    checkCurrentSystem() {
        document.querySelectorAll("[data-galaxy]").forEach(element => {
            var coords = element.getAttribute("data-galaxy").split(":");
            this.galaxy == coords[0] && this.system == coords[1] ? element.classList.add("ogl_active") : element.classList.remove("ogl_active");
        }), this.ogl._tooltip && this.ogl._tooltip.initTooltipList(document.querySelectorAll("#galaxyContent .tooltipClick, #galaxyContent .ownPlayerRow"));
    }
}

class JumpgateManager extends Manager {
    load() {
        this.initialRel = {}, Util.overWrite("initJumpgate", unsafeWindow, !1, () => {
            this.check();
        }), Util.overWrite("initPhalanx", unsafeWindow, !1, () => {
            this.checkPhalanx();
        }), this.saveTimer(), this.displayTimer();
    }
    check() {
        var parent = document.querySelector("#jumpgate");
        if (parent && !parent.querySelector(".ogl_limiterLabel")) {
            document.querySelectorAll("#jumpgate .ship_input_row").forEach(line => {
                var shipID;
                line.previousElementSibling.classList.contains("tdInactive") || (shipID = (line = line.querySelector("input")).getAttribute("id").replace("ship_", ""),
                    this.initialRel[shipID] = parseInt(line.getAttribute("rel")));
            });
            var parent = Util.addDom("fieldset", {
                parent: document.querySelector("#jumpgateForm .ship_selection_table")
            }), limitShipLabel = (Util.addDom("legend", {
                parent: parent,
                child: "Settings"
            }), Util.addDom("label", {
                class: "ogl_limiterLabel",
                parent: parent,
                child: "Ships"
            })), limitShipLabel = Util.addDom("input", {
                type: "checkbox",
                parent: limitShipLabel,
                onclick: () => {
                    this.ogl.db.fleetLimiter.jumpgateActive = !this.ogl.db.fleetLimiter.jumpgateActive,
                        this.updateLimiter();
                }
            });
            let keepLabel = Util.addDom("div", {
                class: "ogl_limiterGroup",
                parent: parent,
                child: "Force (jumpgate)"
            });
            [202, 203, 219, 200].forEach(shipID => {
                let item = Util.addDom("div", {
                    class: "ogl_icon ogl_" + shipID,
                    parent: keepLabel,
                    onclick: () => {
                        keepLabel.querySelector(".ogl_active")?.classList.remove("ogl_active"),
                            item.classList.add("ogl_active"), this.ogl.db.keepEnoughCapacityShipJumpgate = shipID,
                            this.updateLimiter();
                    }
                });
                this.ogl.db.keepEnoughCapacityShipJumpgate == shipID && item.classList.add("ogl_active");
            }), this.ogl.db.fleetLimiter.jumpgateActive && (limitShipLabel.checked = !0),
                this.updateLimiter();
        }
    }
    updateLimiter() {
        if (document.querySelector("#jumpgate") && !document.querySelector("#jumpgateNotReady")) {
            let sendAllJson = {};
            document.querySelectorAll("#jumpgate .ship_input_row").forEach(line => {
                if (!line.previousElementSibling.classList.contains("tdInactive")) {
                    var input = line.querySelector("input"), shipID = input.getAttribute("id").replace("ship_", "");
                    let forced = 0;
                    this.ogl.db.keepEnoughCapacityShipJumpgate == shipID && (forced = this.ogl._fleet.shipsForResources(shipID));
                    var keeped = Math.max(forced, this.ogl.db.fleetLimiter.jumpgateActive && this.ogl.db.fleetLimiter.jumpgateData[shipID] || 0), amount = Math.max(0, this.initialRel[shipID] - keeped), input = (input.setAttribute("rel", amount),
                        input.value > amount && (input.value = amount), line.previousElementSibling.querySelector(".quantity").setAttribute("onclick", `toggleMaxShips('#jumpgateForm', ${shipID}, ${amount})`),
                        line.previousElementSibling.querySelector("a").setAttribute("onclick", `toggleMaxShips('#jumpgateForm', ${shipID}, ${amount})`),
                        line.querySelector(".ogl_keepRecap") || Util.addDom("div", {
                            parent: line,
                            class: "ogl_keepRecap"
                        }));
                    input.innerText = "-" + keeped, input.addEventListener("click", () => {
                        Util.runAsync(() => this.ogl._ui.openFleetProfile()).then(e => this.ogl._popup.open(e));
                    }), sendAllJson[shipID] = amount;
                }
            }), document.querySelector("#jumpgate #sendall").setAttribute("onclick", `setMaxIntInput("#jumpgateForm", ${JSON.stringify(sendAllJson)})`);
        }
    }
    checkPhalanx() {
        var parent = document.querySelector("#phalanxWrap"), parent = Util.addDom("div", {
            prepend: parent,
            child: "<span>Last update:</span><br>",
            class: "ogl_phalanxLastUpdate"
        });
        let clock = document.querySelector(".OGameClock").cloneNode(!0), refresh = (clock.className = "",
            parent.appendChild(clock), Util.addDom("span", {
                parent: parent,
                child: " - <b>0s</b>"
            }));
        setInterval(() => {
            var currentTime = parseInt(document.querySelector(".OGameClock").getAttribute("data-time-server")), refreshTime = parseInt(clock.getAttribute("data-time-server"));
            refresh.innerHTML = ` - <b>${Math.round((currentTime - refreshTime) / 1e3)}s</b>`;
        }, 1e3);
    }
    saveTimer() {
        let calcTimer = level => (.25 * Math.pow(level, 2) - 7.57 * level + 67.34) / this.ogl.server.warFleetSpeed * 6e4;
        jumpgateDone = a => {
            var originID, originLevel, destinationLevel, now;
            (a = $.parseJSON(a)).status && (planet = a.targetMoon, $(".overlayDiv").dialog("destroy"),
                originID = this.ogl.currentPlanet.obj.id, originLevel = this.ogl.currentPlanet.dom.element.parentNode.querySelector(".moonlink").getAttribute("data-jumpgatelevel"),
                destinationLevel = document.querySelector(`.moonlink[href*="${jumpGateTargetId}"]`).getAttribute("data-jumpgatelevel"),
                now = serverTime.getTime(), this.ogl.db.myPlanets[originID].jumpgateTimer = now + calcTimer(originLevel),
                this.ogl.db.myPlanets[jumpGateTargetId].jumpgateTimer = now + calcTimer(destinationLevel)),
                errorBoxAsArray(a.errorbox), void 0 !== a.newToken && setNewTokenData(a.newToken);
        };
    }
    displayTimer() {
        document.querySelectorAll(".moonlink").forEach(moon => {
            var targetDom = moon.parentNode.querySelector(".ogl_sideIconInfo") || Util.addDom("div", {
                class: "ogl_sideIconInfo tooltip",
                title: "Jumpgate not ready",
                parent: moon.parentNode
            });
            let moonID = moon.getAttribute("href").match(/cp=(\d+)/)[1];
            if (this.ogl.db.myPlanets[moonID]?.jumpgateTimer > serverTime.getTime()) {
                let updateTimer = () => new Date(this.ogl.db.myPlanets[moonID].jumpgateTimer - (serverTime.getTime() + 36e5)).toLocaleTimeString([], {
                    minute: "2-digit",
                    second: "2-digit"
                }), div = Util.addDom("div", {
                    class: "ogl_jumpgateTimer",
                    parent: targetDom,
                    child: updateTimer()
                }), interval = setInterval(() => {
                    this.ogl.db.myPlanets[moonID].jumpgateTimer <= serverTime.getTime() ? (clearInterval(interval),
                        div.remove()) : div.innerText = updateTimer();
                }, 1e3);
            }
        });
    }
}

class TooltipManager extends Manager {
    load() {
        this.openTimeout, this.lastSender, this.lastActiveSender, this.shouldWait = !1,
            unsafeWindow.tippy && Util.overWrite("initTooltips", unsafeWindow, null, () => {
                this.initTooltipList(document.querySelectorAll(getTooltipSelector()));
            }), this.tooltip = Util.addDom("div", {
                class: "ogl_tooltip",
                parent: document.body
            }), document.querySelector("#metal_box")?.getAttribute("title") || getAjaxResourcebox(),
            unsafeWindow.tippy ? initTooltips() : this.init();
    }
    initTooltipList(nodeList) {
        nodeList.forEach(element => {
            element._tippy?.oglTooltipReady || (element.title && !element.getAttribute("data-tooltip-title") && element.setAttribute("data-tooltip-title", element.title),
                element.removeAttribute("title"), element._tippy || tippy(element, {
                    content: element.getAttribute("data-tooltip-title"),
                    allowHTML: !0,
                    appendTo: document.body,
                    zIndex: 1000001,
                    placement: element.classList.contains("tooltipBottom") ? "bottom" : element.classList.contains("tooltipRight") ? "right" : element.classList.contains("tooltipLeft") ? "left" : "top",
                    interactive: element.getAttribute("data-tooltip-interactive") || !1,
                    maxWidth: 400
                }), element._tippy && (element._tippy.setProps({
                    animation: "pop",
                    delay: [element.classList.contains("tooltipClick") ? 0 : 400, null],
                    duration: [100, 0],
                    interactive: !(!element.classList.contains("tooltipClose") && !element.classList.contains("tooltipRel")),
                    trigger: element.classList.contains("tooltipClick") ? "click focus" : "mouseenter focus",
                    onShow: instance => {
                        tippy.hideAll();
                        let content = instance.props.content || element.getAttribute("data-tooltip-title");
                        if (element.classList.contains("planetlink") ? content = this.updatePlanetMenuTooltip(instance, "planet") || content : element.classList.contains("moonlink") ? content = this.updatePlanetMenuTooltip(instance, "moon") || content : "string" == typeof content && 0 <= content.indexOf('class="fleetinfo"') && (content = this.updateFleetTooltip(instance)),
                            !content || !1 === content || "" === content) return !1;
                        content && instance.setContent(content), element.classList.contains("tooltipUpdate") && element.dispatchEvent(this.ogl.tooltipEvent),
                            instance.popper.classList.add("ogl_noTouch");
                    },
                    onTrigger: instance => {
                        tippy.hideAll(), element.removeAttribute("title");
                    },
                    onShown: instance => {
                        instance.popper.classList.remove("ogl_noTouch");
                    }
                }), element._tippy.oglTooltipReady = !0, element.classList.add("ogl_ready")));
        });
    }
    updatePlanetMenuTooltip(instance, refType) {
        if (this.ogl.db.options.disablePlanetTooltips) return !1;
        if (!instance.oglContentInjected) if ("planet" == refType) {
            instance.setProps({
                placement: "left"
            });
            var planetID = instance.reference.parentNode.getAttribute("id").replace("planet-", ""), name = instance.reference.querySelector(".planet-name").innerText, data = this.ogl.db.myPlanets[planetID];
            let div = Util.addDom("div", {
                class: "ogl_planetTooltip"
            });
            var links = new DOMParser().parseFromString(instance.props.content, "text/html").querySelectorAll("a");
            if (data) return data?.lifeform && Util.addDom("div", {
                parent: div,
                class: "ogl_icon ogl_lifeform" + data.lifeform
            }), div.appendChild(instance.reference.querySelector(".planetPic").cloneNode()),
                Util.addDom("h3", {
                    parent: div,
                    child: `<span data-galaxy="${data.coords}">[${data.coords}]</span><br>` + name
                }), Util.addDom("div", {
                    class: "ogl_textCenter",
                    parent: div,
                    child: data.fieldUsed + "/" + data.fieldMax
                }), Util.addDom("div", {
                    class: "ogl_textCenter",
                    parent: div,
                    child: data.temperature + 40 + "°c"
                }), Util.addDom("hr", {
                    parent: div
                }), Util.addDom("div", {
                    class: "ogl_mineRecap",
                    child: `<span class='ogl_metal'>${data[1]}</span> <span class='ogl_crystal'>${data[2]}</span> <span class='ogl_deut'>${data[3]}</span>`,
                    parent: div
                }), this.ogl._topbar?.PlanetBuildingtooltip[planetID] && div.appendChild(this.ogl._topbar?.PlanetBuildingtooltip[planetID]),
                Util.addDom("hr", {
                    parent: div
                }), links.forEach(e => div.appendChild(e)), instance.oglContentInjected = !0,
                div.outerHTML;
        } else if ("moon" == refType) {
            instance.setProps({
                placement: "right"
            });
            let planetID = new URLSearchParams(instance.reference.getAttribute("href")).get("cp").split("#")[0], name = instance.reference.querySelector(".icon-moon").getAttribute("alt"), data = this.ogl.db.myPlanets[planetID], div = Util.addDom("div", {
                class: "ogl_planetTooltip"
            }), links = new DOMParser().parseFromString(instance.props.content, "text/html").querySelectorAll("a");
            if (data) return div.appendChild(instance.reference.querySelector(".icon-moon").cloneNode()),
                Util.addDom("h3", {
                    parent: div,
                    child: `<span data-galaxy="${data.coords}">[${data.coords}]</span><br>` + name
                }), Util.addDom("div", {
                    class: "ogl_textCenter",
                    parent: div,
                    child: data.fieldUsed + "/" + data.fieldMax
                }), Util.addDom("hr", {
                    parent: div
                }), this.ogl._topbar?.PlanetBuildingtooltip[planetID] && div.appendChild(this.ogl._topbar?.PlanetBuildingtooltip[planetID]),
                links.forEach(e => div.appendChild(e)), instance.oglContentInjected = !0,
                div.outerHTML;
        }
    }
    updateFleetTooltip(instance) {
        var sender = instance.reference, instance = new DOMParser().parseFromString(instance.props.content, "text/html");
        let origin = (sender.closest(".eventFleet")?.querySelector(".coordsOrigin") || sender.closest(".fleetDetails")?.querySelector(".originData a"))?.innerText.slice(1, -1), div = Util.addDom("div", {
            class: "ogl_fleetDetail"
        }), rawText = "", trashsimData = {
            ships: {}
        };
        if (instance.querySelectorAll("tr").forEach(line => {
            let name = line.querySelector("td")?.innerText.replace(":", "");
            var val, key = Object.entries(this.ogl.db.serverData).find(entry => entry[1] === name)?.[0], line = line.querySelector(".value")?.innerText.replace(/\.|,| /g, "");
            key && line && ("metal" == key && Util.addDom("hr", {
                parent: div
            }), val = "metal" == key || "crystal" == key || "deut" == key || "food" == key ? Util.formatNumber(parseInt(line)) : Util.formatToUnits(line),
                Util.addDom("div", {
                    parent: div,
                    class: "ogl_icon ogl_" + key,
                    child: val
                }), trashsimData.ships[key] = {
                    count: line
                }, rawText += `${name}: ${Util.formatNumber(parseInt(line))}\n`);
        }), 0 < rawText.length) {
            sender = Util.addDom("span", {
                parent: div,
                class: "ogl_fullgrid"
            });
            Util.addDom("hr", {
                parent: sender
            });
            let btn = Util.addDom("button", {
                class: "ogl_button",
                parent: sender,
                child: '<span class="material-icons">content-copy</span><span>Copy</span>',
                onclick: () => {
                    navigator.clipboard.writeText(rawText), btn.classList.remove("material-icons"),
                        btn.innerText = "Copied!";
                }
            });
            origin && Util.addDom("div", {
                class: "ogl_button",
                parent: sender,
                child: '<span class="material-icons">letter_s</span><span>Simulate</span>',
                onclick: () => {
                    Array.from(document.querySelectorAll(".planet-koords")).find(e => e.innerText == origin) ? window.open(Util.genTrashsimLink(this.ogl, !1, trashsimData, !1, !1), "_blank") : (trashsimData.planet = {
                        galaxy: origin.split(":")[0],
                        system: origin.split(":")[1],
                        position: origin.split(":")[2]
                    }, window.open(Util.genTrashsimLink(this.ogl, !1, !1, trashsimData, !0), "_blank"));
                }
            });
        }
        return 0 < rawText.length && div;
    }
}

class NotificationManager extends Manager {
    load() {
        this.data = {}, this.blocks = [], this.interval, this.hideTimer = 5e3, this.step = 200,
            this.currentValue = this.hideTimer, this.start = 0, this.timeLeft = this.hideTimer,
            this.elapsedInterval, this.notification = Util.addDom("div", {
                class: "ogl_notification",
                parent: document.body,
                onmouseenter: () => {
                    clearInterval(this.interval);
                },
                onmouseleave: () => {
                    this.interval = setInterval(() => this.updateClock(), this.step);
                },
                onclick: () => {
                    this.close();
                }
            }), this.clock = Util.addDom("progress", {
                parent: this.notification,
                min: 0,
                max: this.hideTimer,
                value: this.currentValue
            }), this.content = Util.addDom("div", {
                parent: this.notification
            });
    }
    open() {
        this.content.innerText = "", this.ogl._message.events?.mission && (this.ogl._message.events.mission = 0);
        let data = {}, blockCount = 0;
        var timeObj;
        if (this.blocks.forEach(block => {
            let icon = Util.addDom("i");
            var timeObj;
            0 < block.success ? icon = Util.addDom("i", {
                class: "material-icons ogl_ok",
                child: "done"
            }) : block.success < 0 && (icon = Util.addDom("i", {
                class: "material-icons ogl_danger",
                child: "alert"
            })), block.data && Object.entries(block.data).forEach(entry => {
                data[entry[0]] = (data[entry[0]] || 0) + (entry[1] || 0);
            }), block.message ? (timeObj = this.ogl._time.getObj(block.time), timeObj = this.ogl._time.timeToHMS(this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server),
                timeObj = Util.addDom("div", {
                    class: "ogl_notificationLine",
                    child: icon.outerHTML + `<b class="ogl_notificationTimer">[${timeObj}]</b>` + block.message,
                    prepend: this.content
                }), block.success < 0 && timeObj.classList.add("ogl_danger")) : blockCount++;
        }), 0 < blockCount && (timeObj = this.ogl._time.getObj(), timeObj = this.ogl._time.timeToHMS(this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server),
            Util.addDom("div", {
                class: "ogl_notificationLine",
                child: `<b class="ogl_notificationTimer">[${timeObj}]</b>` + blockCount + " mission(s) added",
                prepend: this.content
            })), 0 < Object.keys(data).length) {
            let hasResources = !1, hasShips = !1, hasLifeforms = !1, hasExpeditions = !1, grid = Util.addDom("div", {
                class: "ogl_grid",
                prepend: this.content
            });
            ["metal", "crystal", "deut", "dm"].forEach(type => {
                data[type] && (Util.addDom("div", {
                    class: "ogl_icon ogl_" + type,
                    child: Util.formatToUnits(data[type]),
                    parent: grid
                }), hasResources = !0);
            }), hasResources && Util.addDom("hr", {
                parent: grid
            }), this.ogl.shipsList.forEach(type => {
                data[type] && (Util.addDom("div", {
                    class: "ogl_icon ogl_" + type,
                    child: Util.formatToUnits(data[type]),
                    parent: grid
                }), hasShips = !0);
            }), hasShips && Util.addDom("hr", {
                parent: grid
            }), ["artefact", "lifeform1", "lifeform2", "lifeform3", "lifeform4"].forEach(type => {
                data[type] && (Util.addDom("div", {
                    class: "ogl_icon ogl_" + type,
                    child: Util.formatToUnits(data[type]),
                    parent: grid
                }), hasLifeforms = !0);
            }), hasLifeforms && Util.addDom("hr", {
                parent: grid
            }), ["blackhole", "trader", "early", "late", "pirate", "alien"].forEach(type => {
                data[type] && (Util.addDom("div", {
                    "data-resultType": type,
                    class: "ogl_icon ogl_" + type,
                    child: Util.formatToUnits(data[type]),
                    parent: grid
                }), hasExpeditions = !0);
            }), hasExpeditions && Util.addDom("hr", {
                parent: grid
            });
        }
        this.currentValue = this.hideTimer, this.notification.classList.add("ogl_active"),
            clearInterval(this.interval), this.interval = setInterval(() => this.updateClock(), this.step);
    }
    addToQueue(message, success, data) {
        this.blocks.push({
            time: serverTime.getTime(),
            message: message,
            data: data,
            success: success = !0 === success ? 1 : !1 === success ? -1 : 0
        }), this.blocks.sort((a, b) => a.time - b.time), this.blocks = this.blocks.filter(e => serverTime.getTime() < e.time + this.hideTimer),
            this.open();
    }
    updateClock() {
        this.currentValue -= this.step, this.clock.value = this.currentValue, this.currentValue < 0 && this.close();
    }
    close() {
        clearInterval(this.interval), this.notification.classList.remove("ogl_active");
    }
}

class PopupManager extends Manager {
    load() {
        this.popup = Util.addDom("div", {
            class: "ogl_popup",
            parent: document.body
        }), this.popup.addEventListener("click", event => {
            event.target === this.popup && this.close();
        });
    }
    open(dom, canShare) {
        tippy.hideAll(), this.popup.innerText = "", dom && (Util.addDom("div", {
            class: "ogl_close material-icons",
            child: "close-thick",
            prepend: dom,
            onclick: () => {
                this.close();
            }
        }), canShare && Util.addDom("div", {
            class: "ogl_share material-icons",
            child: "camera",
            prepend: dom,
            onclick: event => {
                event.target.classList.add("ogl_disabled"), Util.takeScreenshot(this.popup.querySelector("div"), event.target, `ogl_${this.ogl.server.id}_${this.ogl.server.lang}_empire_` + serverTime.getTime());
            }
        }), this.popup.appendChild(dom), this.popup.classList.add("ogl_active"),
            initTooltips());
    }
    close() {
        this.popup.classList.remove("ogl_active");
    }
    updatePosition() {
        var div = this.popup;
        div.style.top = visualViewport.offsetTop + "px", div.style.height = visualViewport.height - 25 + "px",
            div.style.left = visualViewport.offsetLeft + "px", div.style.width = visualViewport.width + "px";
    }
}

class MessageManager extends Manager {
    load() {
        this.ogl.cache.reports = this.ogl.cache.reports || {}, this.ogl.cache.raids = this.ogl.cache.raids || {},
            this.ogl.cache.counterSpies = this.ogl.cache.counterSpies || [], this.ogl.db.spytableFilters = this.ogl.db.spytableFilters || {
                age: "ASC",
                rawCoords: !1,
                playerName: !1,
                wave1: !1,
                fleetValue: !1,
                defValue: !1
            }, this.filterOrder = {
                age: "DESC",
                rawCoords: "ASC",
                playerName: "ASC",
                wave1: "DESC",
                fleetValue: "DESC",
                defValue: "DESC"
            }, this.checkBoard(), "messages" === this.ogl.page && (this.tokenReady = !0,
                this.deleteQueue = [], this.updateStatsTimeout, this.loopQueueTimeout, this.events = {
                    mission: 0
                }, this.hasNewEntry = !1, this.nextTarget, Util.overWrite("paginatorPrevious", unsafeWindow.ogame.messages, !1, () => {
                    20 != this.tabID && this.check();
                }), Util.overWrite("paginatorNext", unsafeWindow.ogame.messages, !1, () => {
                    20 != this.tabID && this.check();
                }), Util.overWrite("paginatorFirst", unsafeWindow.ogame.messages, !1, () => {
                    20 != this.tabID && this.check();
                }), Util.overWrite("paginatorLast", unsafeWindow.ogame.messages, !1, () => {
                    20 != this.tabID && this.check();
                }));
    }
    loopDeleteQueue() {
        this.deleteQueue.length, this.deleteMessage(), setTimeout(() => this.loopDeleteQueue(), 300);
    }
    check() {
        let ptreCounterSpies = {};
        let isTrash = document.querySelector(".tabsWrapper .innerTabItem.active.trashcan");
        this.reportList = [], 0 <= [11, 12, 20, 21, 22, 23, 24].indexOf(this.tabID) && (new DOMParser().parseFromString(ogame.messages.content.join(""), "text/html").querySelectorAll(".msg").forEach(msg => {
            var raw = msg.querySelector(".rawMessageData");
            if (raw) {
                let message = {};
                message.id = msg.getAttribute("data-msg-id"), message.globalTypeID = raw.dataset.rawMessagetype,
                    message.date = this.ogl._time.getObj(1e3 * parseInt(raw.dataset.rawTimestamp || raw.dataset.rawDatetime || 0), "client"),
                    message.api = raw.dataset.rawHashcode;
                var dom = document.querySelector(`[data-msg-id="${message.id}"]`);
                if (dom && (this.ogl._time.update(!1, dom.querySelector(".msgDate:not(.ogl_updated)")),
                    dom.querySelector(".icon_apikey")) && message.api && dom.querySelector(".icon_apikey").setAttribute("data-api-code", message.api),
                    20 != this.tabID && 25 != this.tabID || !this.ogl.db.options.displaySpyTable || isTrash) if (21 == this.tabID) {
                        if (message.coords = raw.dataset.rawCoords, message.defenderSpace = JSON.parse(raw.dataset.rawDefenderspaceobject || "{}"),
                            message.fleets = JSON.parse(raw.dataset.rawFleets || "{}"),
                            message.rounds = JSON.parse(raw.dataset.rawCombatrounds || "{}"),
                            message.result = JSON.parse(raw.dataset.rawResult || "{}"),
                            message.gain = {
                                metal: 0,
                                crystal: 0,
                                deut: 0
                            }, message.shipLost = {}, message.resultType = "raid", message.isOwnPlanet = message.defenderSpace.owner?.id == this.ogl.account.id,
                            message.probeOnly = !1, message.api && 35 != message.globalTypeID) {
                            let ownFleets = message.fleets?.filter(fleet => fleet.player?.id == this.ogl.account.id).map(fleet => fleet.fleetId);
                            var ownSides = message.fleets?.filter(fleet => fleet.player?.id == this.ogl.account.id).map(fleet => fleet.side), lastRound = message.rounds[message.rounds.length - 1], ownSides = (message.isAttacker = 0 <= ownSides.indexOf("attacker"),
                                message.isDefender = 0 <= ownSides.indexOf("defender"),
                                message.isWinner = 0 <= ownSides.indexOf(message.result.winner),
                                message.noWinner = "none" == message.result.winner, message.isWinner && message.isAttacker && (message.gain.metal = message.result.loot.resources.find(line => "metal" == line.resource)?.amount,
                                    message.gain.crystal = message.result.loot.resources.find(line => "crystal" == line.resource)?.amount,
                                    message.gain.deut = message.result.loot.resources.find(line => "deuterium" == line.resource)?.amount),
                                message.isWinner || message.noWinner || !message.isOwnPlanet || (message.gain.metal = -message.result.loot.resources.find(line => "metal" == line.resource)?.amount,
                                    message.gain.crystal = -message.result.loot.resources.find(line => "crystal" == line.resource)?.amount,
                                    message.gain.deut = -message.result.loot.resources.find(line => "deuterium" == line.resource)?.amount),
                                message.fleets?.filter(fleet => "attacker" == fleet.side).map(fleet => fleet.combatTechnologies).reduce((acc, obj) => ({
                                    ...acc,
                                    ...obj
                                }), {})), defenderShips = message.fleets?.filter(fleet => "defender" == fleet.side).map(fleet => fleet.combatTechnologies).reduce((acc, obj) => ({
                                    ...acc,
                                    ...obj
                                }), {});
                            1 == Object.values(ownSides).length && 210 == ownSides[0].technologyId && message.gain.metal + message.gain.crystal + message.gain.deut == 0 && (message.probeOnly = !0),
                                1 == Object.values(defenderShips).length && 210 == defenderShips[0].technologyId && message.gain.metal + message.gain.crystal + message.gain.deut == 0 && (message.probeOnly = !0),
                                lastRound && lastRound.fleets.forEach(fleet => {
                                    0 <= ownFleets.indexOf(fleet.fleetId) && fleet.technologies.forEach(tech => {
                                        tech.destroyedTotal && (message.shipLost[-tech.technologyId] = tech.destroyedTotal);
                                    });
                                }), message.isDefender && message.isOwnPlanet && message.result.repairedTechnologies.forEach(repaired => {
                                    message.shipLost[-repaired.technologyId] -= repaired.amount;
                                }), message.result?.debris?.resources && (message.debris = {},
                                    message.result.debris.resources.forEach(e => {
                                        0 < e.remaining && (message.debris[e.resource?.replace("deuterium", "deut")] = e.remaining);
                                    })), dom && Util.addDom("div", {
                                        class: "ogl_messageButton tooltip",
                                        title: "Convert this battle",
                                        parent: dom.querySelector("message-footer-actions"),
                                        child: "C",
                                        onclick: () => window.open(Util.genConverterLink(this.ogl, message.api), "_blank")
                                    }), message.resultType && (this.summarize(message), message.probeOnly || this.statify(message));
                        }
                    } else if (22 == this.tabID) {
                        message.lifeform = parseInt(raw.dataset.rawLifeform || 0), message.expeditionResult = raw.dataset.rawExpeditionresult,
                            message.resources = JSON.parse(raw.dataset.rawResourcesgained?.replace("deuterium", "deut")?.replace("darkMatter", "dm") || "{}"),
                            message.artefact = parseInt(raw.dataset.rawArtifactsfound || 0),
                            message.lfXP = parseInt(raw.dataset.rawLifeformgainedexperience || 0),
                            message.ships = {}, message.delay = JSON.parse(raw.dataset.rawNavigation || '{ "returnTimeAbsoluteIncreaseHours":0, "returnTimeMultiplier":1 }'),
                            message.item = JSON.parse(raw.dataset.rawItemsgained || "{}"),
                            message.depletion = parseInt(raw.dataset.rawDepletion || 0),
                            message.size = parseInt((raw.dataset.rawSize || raw.dataset.rawArtifactssize || "-1").replace("normal", "2").replace("big", "1").replace("huge", "0")),
                            message.shipLost = {};
                        for (var [lossID, amount] of Object.entries(JSON.parse(raw.dataset.rawShipslost || "{}"))) message.shipLost[-lossID] = amount;
                        ownSides = ["nothing", "trader", "blackhole", "lifeform"];
                        61 == message.globalTypeID ? 0 < message.artefact ? message.resultType = "artefact" : 0 < message.lfXP ? message.resultType = "lifeform" : message.resultType = "nothing" : "ressources" == message.expeditionResult ? message.resultType = "resource" : "darkmatter" == message.expeditionResult ? message.resultType = "darkmatter" : "nothing" == message.expeditionResult ? message.resultType = "nothing" : "shipwrecks" == message.expeditionResult ? message.resultType = "ship" : "trader" == message.expeditionResult ? message.resultType = "trader" : "items" == message.expeditionResult ? message.resultType = "item" : "fleetLost" == message.expeditionResult ? message.resultType = "blackhole" : "navigation" == message.expeditionResult && message.delay.returnTimeMultiplier < 1 ? message.resultType = "early" : "navigation" == message.expeditionResult && (1 < message.delay.returnTimeMultiplier || 0 < message.delay.returnTimeAbsoluteIncreaseHours) ? message.resultType = "late" : "combatPirates" == message.expeditionResult ? message.resultType = "pirate" : "combatAliens" == message.expeditionResult && (message.resultType = "alien"),
                            Object.entries(JSON.parse(raw.dataset.rawTechnologiesgained || "{}")).forEach(ship => {
                                message.ships[ship[0]] = ship[1].amount;
                            }), message.gain = {
                                ...message.resources,
                                ...message.ships,
                                artefact: message.artefact,
                                ["lifeform" + message.lifeform]: message.lfXP,
                                resultType: message.resultType
                            }, message.resultType && (0 <= ownSides.indexOf(message.resultType) && (message.size = -1),
                                this.summarize(message), this.statify(message));
                    } else 23 != this.tabID && 24 != this.tabID || (message.coords = raw.dataset.rawCoords,
                        message.debris = JSON.parse(raw.dataset.rawRecycledresources || "{}"),
                        message.cargo = JSON.parse(raw.dataset.rawCargo || "{}"), message.gain = {},
                        Object.entries(message.debris).forEach(entry => {
                            0 < entry[1] && (message.gain[entry[0].replace("deuterium", "deut")] = entry[1],
                                message.resultType = "debris");
                        }), message.debris = !1, Object.entries(message.cargo).forEach(entry => {
                            0 < entry[1] && (message.gain[entry[0].replace("deuterium", "deut")] = entry[1],
                                message.resultType = "cargo");
                        }), message.resultType && (this.summarize(message), 24 == this.tabID) && this.statify(message)); else {
                    if (this.spytable = document.querySelector(".ogl_spytable"),
                        this.spytable ? this.spytable.classList.remove("ogl_hidden") : (this.spytable = Util.addDom("div", {
                            class: "ogl_spytable",
                            before: document.querySelector("#filteredHeadersRow")
                        }), Util.addDom("div", {
                            class: "ogl_spyHeader",
                            parent: this.spytable,
                            child: `
                                <b class="ogl_textCenter">#</b>
                                <b class="material-icons" data-filter="age">schedule</b>
                                <b class="ogl_textCenter">*</b>
                                <b class="ogl_textCenter">&nbsp;</b>
                                <b data-filter="rawCoords">coords</b>
                                <b data-filter="playerName">name</b>
                                <b data-filter="wave1">loot</b>
                                <b class="material-icons" data-filter="fleetValue">rocket_launch</b>
                                <b class="material-icons" data-filter="defValue">security</b>
                                <b></b>
                            `,
                            onclick: event => {
                                let filter = event.target.getAttribute("data-filter");
                                filter && (document.querySelectorAll(".ogl_spyHeader .ogl_active").forEach(e => e.classList.remove("ogl_active")),
                                    event.target.classList.add("ogl_active"), Object.keys(this.ogl.db.spytableFilters).forEach(key => {
                                        filter.replace("DESC", "") == key ? "ASC" == this.ogl.db.spytableFilters[key] ? this.ogl.db.spytableFilters[key] = "DESC" : "DESC" == this.ogl.db.spytableFilters[key] ? this.ogl.db.spytableFilters[key] = "ASC" : this.ogl.db.spytableFilters[key] = this.filterOrder[key] : this.ogl.db.spytableFilters[key] = !1;
                                    }), this.createSpyTable());
                            }
                        }).querySelector(`[data-filter="${Object.keys(this.ogl.db.spytableFilters).find(e => e && this.ogl.db.spytableFilters[e]) || "age"}"]`)?.classList.add("ogl_active")),
                        message.playerID = raw.dataset.rawTargetplayerid, message.planetID = raw.dataset.rawTargetplanetid,
                        message.isCounterSpy = message.playerID == this.ogl.account.id,
                        message.playerName = raw.dataset.rawPlayername, message.playerStatus = this.ogl._highscore.nameToTagList[Array.from(msg.querySelector('.playerName span[class*="status_"]')?.classList || []).filter(e => e.startsWith("status_"))[0]],
                        message.targetType = 1 == raw.dataset.rawTargetplanettype ? "planet" : "moon",
                        message.targetTypeID = raw.dataset.rawTargetplanettype, message.coords = raw.dataset.rawCoordinates,
                        message.rawCoords = Util.coordsToID(message.coords), message.age = 1e3 * parseInt(raw.dataset.rawReportage),
                        message.isActive = parseInt(raw.dataset.rawActive), message.activity = parseInt(raw.dataset.rawActivity),
                        message.resources = parseInt(raw.dataset.rawResources), message.metal = parseInt(raw.dataset.rawMetal),
                        message.crystal = parseInt(raw.dataset.rawCrystal), message.deut = parseInt(raw.dataset.rawDeuterium),
                        message.hiddenFleet = 1 == raw.dataset.rawHiddenships, message.hiddenDef = 1 == raw.dataset.rawHiddendef,
                        message.fleet = "-" == raw.dataset.rawFleet ? {} : JSON.parse(raw.dataset.rawFleet || "{}"),
                        message.def = "-" == raw.dataset.rawDefense ? {} : JSON.parse(raw.dataset.rawDefense || "{}"),
                        message.loot = parseInt(raw.dataset.rawLoot), message.fleetValue = 0,
                        message.defValue = 0, message.isAttacked = msg.querySelector(".fleetAction.fleetHostile"),
                        (-1 == message.activity || !message.isActive && message.activity < 15) && (message.activity = 60),
                        message.isCounterSpy) {
                        let uid = Util.addDom("div", {
                            child: msg.querySelector(".player").getAttribute("title") || msg.querySelector(".player").dataset.tooltipTitle
                        }).querySelector("[data-playerid]").dataset.playerid;
                        this.ogl.cache.counterSpies.indexOf(message.id) < 0 && msg.querySelector(".msgTitle a") && (lastRound = [(defenderShips = new URLSearchParams(msg.querySelector(".msgTitle a").getAttribute("href"))).get("galaxy") || "0", defenderShips.get("system") || "0", defenderShips.get("position") || "0"],
                            ownSides = message.id, ptreCounterSpies[ownSides] = {},
                            ptreCounterSpies[ownSides].player_id = uid, ptreCounterSpies[ownSides].teamkey = this.ogl.ptreKey,
                            ptreCounterSpies[ownSides].galaxy = lastRound[0], ptreCounterSpies[ownSides].system = lastRound[1],
                            ptreCounterSpies[ownSides].position = lastRound[2], ptreCounterSpies[ownSides].spy_message_ts = parseInt(message.date.client),
                            ptreCounterSpies[ownSides].moon = {}, ptreCounterSpies[ownSides].activity = "*",
                            ptreCounterSpies[ownSides].moon.activity = "*");
                        raw = document.querySelector(`[data-msg-id="${message.id}"]`);
                        if (raw && !raw.querySelector(".ogl_checked")) {
                            msg = Util.addDom("div", {
                                class: "material-icons ogl_checked ogl_mainIcon tooltip",
                                child: "ptre",
                                title: this.ogl._lang.find("ptreMessageDone"),
                                parent: raw.querySelector("message-footer-actions")
                            });
                            let name = raw.querySelector(".player").innerText;
                            this.ogl._ui.turnIntoPlayerLink(uid, raw.querySelector(".player")),
                                this.ogl.ptreKey && msg.addEventListener("click", () => {
                                    this.ogl.PTRE.getPlayerInfo({
                                        name: name,
                                        id: uid
                                    });
                                });
                        }
                    } else this.ogl.db.udb[message.playerID] && (this.ogl.db.udb[message.playerID].name = message.playerName,
                        this.ogl.db.udb[message.playerID].status = message.playerStatus,
                        this.ogl.db.udb[message.playerID].liveUpdate = serverTime.getTime());
                    let currentRes = message.resources, currentRenta = 0;
                    for (let i = 1; i < 7; i++) currentRes -= currentRenta, currentRenta = Math.floor(currentRes * message.loot / 100),
                        message["wave" + i] = currentRenta;
                    if (message.hiddenFleet) message.fleetValue = -1; else for (let [techID, value] of Object.entries(message.fleet)) 200 < techID && techID < 300 && Object.entries(Datafinder.getTech(Math.abs(techID))).forEach(x => message.fleetValue += x[1] * value);
                    if (message.hiddenDef) message.defValue = -1; else for (let [techID, value] of Object.entries(message.def)) 400 < techID && techID < 500 && Object.entries(Datafinder.getTech(Math.abs(techID))).forEach(x => message.defValue += x[1] * value);
                    message.playerID != ogl.account.id && this.reportList.push(message),
                        dom && !message.isCounterSpy && (dom.querySelector(".ogl_tagPicker") || (defenderShips = Util.addDom("div", {
                            class: "ogl_messageButton",
                            parent: dom.querySelector("message-footer-actions")
                        }), this.ogl._ui.addTagButton(defenderShips, message.coords)),
                            dom.querySelector(".ogl_trashsim") || Util.addDom("div", {
                                class: "ogl_messageButton material-icons ogl_trashsim tooltip",
                                title: "Simulate",
                                parent: dom.querySelector("message-footer-actions"),
                                child: "letter_s",
                                onclick: () => window.open(Util.genTrashsimLink(this.ogl, message.api), "_blank")
                            }), dom.querySelector(".ogl_ptreBtn") || this.ogl.ptreKey && Util.addDom("div", {
                                class: "ogl_messageButton material-icons ogl_ptreBtn tooltip",
                                title: "Send this report to PTRE",
                                parent: dom.querySelector("message-footer-actions"),
                                child: "ptre",
                                onclick: () => this.ogl.PTRE.postSpyReport(message.api)
                            }));
                }
            }
        }), 20 == this.tabID && this.ogl.db.options.displaySpyTable && !isTrash ? this.createSpyTable() : this.spytable && this.spytable.classList.add("ogl_hidden"),
            21 != this.tabID && 22 != this.tabID && 24 != this.tabID || this.ogl._stats.miniStats(),
            0 < Object.keys(ptreCounterSpies).length) && this.ogl.PTRE.postActivities(ptreCounterSpies),
            initTooltips();
    }
    summarize(message) {
        let messageDom = document.querySelector(`[data-msg-id="${message.id}"]`);
        if (messageDom) {
            messageDom.querySelector(".ogl_battle") && messageDom.querySelector(".ogl_battle").remove(),
                messageDom.querySelector(".ogl_checked") || Util.addDom("div", {
                    class: "material-icons ogl_checked ogl_mainIcon tooltip",
                    child: "oglight_simple",
                    title: this.ogl._lang.find("oglMessageDone"),
                    parent: messageDom.querySelector("message-footer-actions")
                });
            var sizes, tooltipContent = Util.addDom("ul", {
                class: "ogl_battleTooltip"
            });
            let recap = Util.addDom("div", {
                class: "ogl_battle",
                "data-resultType": message.resultType || "unknown",
                before: messageDom.querySelector(".msg_actions"),
                onclick: () => {
                    recap.classList.contains("ogl_clickable") && messageDom.querySelector(".msgContent").classList.toggle("ogl_hidden");
                }
            }), gainSum = Object.values(message.gain).reduce((a, b) => parseInt(a) || 0 + parseInt(b) || 0, 0), gains = {
                ...message.gain
            };
            if (Object.entries(message.shipLost || {}).forEach(entry => {
                !isNaN(entry[0]) && entry[0] < 0 && Object.entries(Datafinder.getTech(-entry[0])).forEach(res => gains[res[0]] = (gains[res[0]] || 0) - res[1] * entry[1]);
            }), Object.entries(gains).forEach(entry => {
                isNaN(entry[1]) || 0 === entry[1] ? 0 == gainSum && isNaN(entry[1]) && Util.addDom("div", {
                    class: "ogl_icon ogl_" + entry[0],
                    child: this.ogl._lang.find(entry[1]),
                    parent: recap
                }) : Util.addDom("div", {
                    class: "ogl_icon ogl_" + entry[0],
                    child: Util.formatToUnits(entry[1], !1, !0),
                    parent: recap
                });
            }), message.debris && (message.debris.metal || 0) + (message.debris.crystal || 0) + (message.debris.deut || 0) != 0) {
                let recapDebris = Util.addDom("div", {
                    class: "ogl_battle ogl_clickable",
                    "data-resultType": "debris",
                    before: messageDom.querySelector(".msg_actions"),
                    onclick: () => messageDom.querySelector(".msgContent").classList.toggle("ogl_hidden")
                });
                Object.entries(message.debris).forEach(entry => {
                    isNaN(entry[1]) || 0 === entry[1] || Util.addDom("div", {
                        class: "ogl_icon ogl_" + entry[0],
                        child: Util.formatToUnits(entry[1]),
                        parent: recapDebris
                    });
                });
            }
            gains.metal + gains.crystal + gains.deut == 0 && Util.addDom("div", {
                class: "ogl_icon",
                child: "-",
                parent: recap
            }), message.resultType && (recap.classList.add("ogl_clickable"), 41 != message.globalTypeID && 61 != message.globalTypeID || messageDom.querySelector(".msgContent").classList.add("ogl_hidden")),
                message.item?.[0] && (recap.classList.add("tooltip"), tooltipContent.appendChild(Util.addDom("li", {
                    child: `Item : <b class="ogl_highlight">${message.item?.[0].name}</b>`
                }))), 0 <= message.size && (sizes = {
                    0: "Extraordinary",
                    1: "Especial",
                    2: "Normal"
                }, recap.classList.add("tooltip"), tooltipContent.appendChild(Util.addDom("li", {
                    child: `Size : <b data-size-value="${message.size}">${sizes[message.size]}</b>`
                })), recap.setAttribute("data-size", message.size)), 0 < message.depletion && (recap.classList.add("tooltip"),
                    tooltipContent.appendChild(Util.addDom("li", {
                        child: `Depletion value : <b data-depletion-value="${message.depletion}">${message.depletion}</b>`
                    })), recap.setAttribute("data-depletion", message.depletion)), "" != tooltipContent.innerText && (recap.title = tooltipContent.innerHTML);
        }
    }
    statify(message) {
        var isP16 = 16 == (message.coords || "0:0:0").split(":")[2], isPiralien = 25 == message.globalTypeID && isP16, type = isPiralien ? "expe" : 32 == message.globalTypeID && isP16 ? "debris16" : 41 == message.globalTypeID ? "expe" : 61 == message.globalTypeID ? "discovery" : 25 == message.globalTypeID ? "raid" : 32 == message.globalTypeID && "debris", isP16 = (41 == message.globalTypeID || 61 == message.globalTypeID) && message.resultType;
        if (type) {
            var stats = this.ogl._stats.getDayStats(message.date.server);
            if (!(-1 < stats.ids?.indexOf(message.id))) {
                var gainID, amount, sign, gid, notificationData = {};
                message.id && (stats.ids = stats.ids || [], stats.ids.push(message.id)),
                    stats[type] = stats[type] || {}, isPiralien || (stats[type].count = (stats[type].count || 0) + 1),
                    isP16 && (stats[type].occurence = stats[type].occurence || {}, stats[type].occurence[isP16] = (stats[type].occurence[isP16] || 0) + 1),
                    message.shipLost && (message.gain = {
                        ...message.gain,
                        ...message.shipLost
                    });
                for ([gainID, amount] of Object.entries(message.gain)) isNaN(amount) || 0 == amount ? "resultType" == gainID && (notificationData[amount] = (notificationData[amount] || 0) + 1) : (sign = !isNaN(gainID) && gainID < 0 ? -1 : 1,
                    notificationData[gid = isNaN(gainID) ? gainID : Math.abs(gainID)] = (notificationData[gid] || 0) + amount * sign,
                    stats[type].gain = stats[type].gain || {}, stats[type].gain[gainID] = (stats[type].gain[gainID] || 0) + ("?" == amount ? 1 : amount));
                document.querySelector("#ogame-tracker-menu") || this.ogl._notification.addToQueue(!1, void 0, notificationData);
            }
        }
    }
    addToSpyTable(message, wrapper) {
        if (!this.spytable.querySelector(`[data-id="${message.id}"]`)) {
            var delta = serverTime.getTime() - message.date.server, bonusFleetSpeed = 1 == this.ogl.server.warFleetSpeed ? .42 : 0;
            let bonusCargo = 1 + .042 * Math.ceil(delta / 36e5) + bonusFleetSpeed, messageDom = document.querySelector(`[data-msg-id="${message.id}"]`);
            delta = this.ogl._fleet.shipsForResources(this.ogl.db.options.defaultShip, Math.round(message.wave1 * bonusCargo));
            let age = 0, line = (age = 864e5 < message.age ? Math.floor(message.age / 864e5) + LocalizationStrings.timeunits.short.day : 36e5 < message.age ? Math.floor(message.age / 36e5) + LocalizationStrings.timeunits.short.hour : Math.floor(message.age / 6e4) + LocalizationStrings.timeunits.short.minute,
                Util.addDom("div", {
                    class: "ogl_spyLine",
                    "data-id": message.id,
                    parent: wrapper
                }));
            bonusFleetSpeed = Util.addDom("div", {
                parent: line
            });
            let more = Util.addDom("div", {
                parent: line,
                class: "ogl_more ogl_hidden"
            }), coords = message.coords.split(":");
            for (let i = 1; i < 7; i++) {
                let currentLoot = message["wave" + i], subLine = Util.addDom("div", {
                    parent: more,
                    child: `<div>${Util.formatToUnits(currentLoot)}</div>`
                });
                this.ogl.fretShips.forEach(shipID => {
                    var shipsCount = this.ogl._fleet.shipsForResources(shipID, currentLoot * bonusCargo);
                    Util.addDom("a", {
                        class: "ogl_icon ogl_" + shipID,
                        parent: subLine,
                        child: shipsCount.toLocaleString("de-DE") || "0",
                        href: `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=${message.targetTypeID}&mission=1&am${shipID}=${shipsCount}&oglmode=4&oglLazy=true`
                    });
                });
            }
            var wrapper = message.activity < 15 ? "*" : message.activity.toString().replace("60", "-"), time = this.ogl.db.options.useClientTime ? message.date.client : message.date.server, time = (Util.addDom("span", {
                parent: bonusFleetSpeed,
                class: "ogl_textCenter"
            }), Util.addDom("span", {
                child: age,
                parent: bonusFleetSpeed,
                class: "ogl_textCenter tooltip",
                title: this.ogl._time.convertTimestampToDate(time, !0).innerHTML
            }), Util.addDom("span", {
                child: wrapper,
                parent: bonusFleetSpeed,
                class: "ogl_textCenter"
            })), wrapper = Util.addDom("span", {
                parent: bonusFleetSpeed
            }), coordsDiv = Util.addDom("span", {
                child: `<span data-galaxy="${message.coords}">${message.coords}</<span>`,
                parent: bonusFleetSpeed
            }), name = Util.addDom("a", {
                child: message.playerName,
                parent: bonusFleetSpeed,
                class: "overlay",
                href: `${window.location.href.split('?')[0]}?page=componentOnly&component=messagedetails&messageId=` + message.id
            }), delta = Util.addDom("a", {
                child: Util.formatToUnits(message.wave1),
                parent: bonusFleetSpeed,
                class: "ogl_textRight ogl_loot",
                href: `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=${message.targetTypeID}&mission=1&am${this.ogl.db.options.defaultShip}=${delta}&oglmode=4`
            }), fleet = Util.addDom("span", {
                child: Util.formatToUnits(message.fleetValue, 0).replace("-1", "?"),
                parent: bonusFleetSpeed,
                class: "ogl_textRight"
            }), def = Util.addDom("span", {
                child: Util.formatToUnits(message.defValue, 0).replace("-1", "?"),
                parent: bonusFleetSpeed,
                class: "ogl_textRight"
            }), bonusFleetSpeed = Util.addDom("span", {
                class: "ogl_actions",
                parent: bonusFleetSpeed
            }), wrapper = (this.addSpyIcons(wrapper, message.coords, message.targetType),
                this.ogl._ui.addTagButton(coordsDiv, message.coords), this.ogl._ui.turnIntoPlayerLink(message.playerID, name, message.playerName),
                message.activity < 15 ? time.classList.add("ogl_danger") : message.activity < 60 && time.classList.add("ogl_warning"),
                message.wave1 >= this.ogl.db.options.resourceTreshold && delta.classList.add("ogl_important"),
                0 != message.fleetValue && (fleet.style.background = "linear-gradient(192deg, #622a2a, #3c1717 70%)"),
                0 != message.defValue && (def.style.background = "linear-gradient(192deg, #622a2a, #3c1717 70%)"),
                this.nextTarget || 0 != message.fleetValue || 0 != message.defValue || message.isAttacked || (this.nextTarget = message),
                Util.addDom("div", {
                    class: "ogl_button material-icons ogl_moreButton tooltip",
                    title: "more waves",
                    parent: bonusFleetSpeed,
                    child: "more_horiz",
                    onclick: () => more.classList.toggle("ogl_hidden")
                }), Util.addDom("a", {
                    class: "ogl_button material-icons tooltip",
                    title: "attack this position !",
                    parent: bonusFleetSpeed,
                    child: "target",
                    href: `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=${message.targetTypeID}&mission=1`
                }));
            return message.isAttacked && Util.addDom("div", {
                class: "fleetAction fleetHostile",
                parent: wrapper
            }), Util.addDom("div", {
                class: "ogl_button material-icons tooltip",
                title: "Simulate",
                parent: bonusFleetSpeed,
                child: "letter_s",
                onclick: () => window.open(Util.genTrashsimLink(this.ogl, message.api), "_blank")
            }), this.ogl.ptreKey && Util.addDom("div", {
                class: "ogl_button material-icons tooltip",
                title: "Send this report to PTRE",
                parent: bonusFleetSpeed,
                child: "ptre",
                onclick: () => this.ogl.PTRE.postSpyReport(message.api)
            }), Util.addDom("div", {
                class: "ogl_button material-icons",
                parent: bonusFleetSpeed,
                child: "close",
                onclick: () => {
                    $.ajax({
                        url: getAsJsonUrl + "&action=flagDeleted",
                        data: {
                            token: token,
                            messageIds: Array.isArray(message.id) ? message.id : [message.id]
                        },
                        type: "POST",
                        dataType: "json",
                        success: data => {
                            token = data.newAjaxToken, "failure" === data.status ? showNotification(data.errors[0].message, "error") : (messageDom && messageDom.remove(),
                                line.remove());
                        },
                        error: data => {
                            showNotification(data.errors[0].message, "error");
                        }
                    });
                }
            }), line;
        }
    }
    createSpyTable() {
        let wrapper = Util.addDom("div", {
            class: "ogl_lineWrapper"
        });
        this.spytable?.querySelector(".ogl_lineWrapper")?.remove(), this.nextTarget = !1;
        var filter = Object.entries(this.ogl.db.spytableFilters).find(e => 0 != e[1]);
        let isDesc = "DESC" == filter[1], filterKey = filter[0];
        this.reportList.sort(function (a, b) {
            return !a[filterKey = null != !a[filterKey] && null != !b[filterKey] ? filterKey : "age"] && 0 != a[filterKey] || !b[filterKey] && 0 != b[filterKey] ? a - b : isDesc && isNaN(a[filterKey]) ? b[filterKey].localeCompare(a[filterKey]) : !isDesc && isNaN(a[filterKey]) ? a[filterKey].localeCompare(b[filterKey]) : isDesc && !isNaN(a[filterKey]) ? b[filterKey] - a[filterKey] : a[filterKey] - b[filterKey];
        }).forEach(message => {
            this.addToSpyTable(message, wrapper);
        }), this.spytable?.appendChild(wrapper), initTooltips();
    }
    checkDialog() {
        if (!(serverTime.getTime() - this.dialogDelay < 500)) {
            this.dialogDelay = serverTime.getTime();
            var dialog = document.querySelector(".ui-dialog"), id = dialog.querySelector(".detail_msg")?.getAttribute("data-msg-id"), isCombat = dialog.querySelector("[data-combatreportid]"), isSpy = dialog.querySelector('[data-message-type="10"]');
            if (id && isCombat && !dialog.querySelector(".ogl_messageButton")) {
                isCombat = dialog.querySelector(".icon_apikey");
                let api = (isCombat.getAttribute("data-tooltip-title") || isCombat.getAttribute("title") || isCombat.getAttribute("data-title") || isCombat.getAttribute("data-api-code")).match(/cr-[a-z0-9-]*/)[0];
                isCombat.setAttribute("data-api-code", api), Util.addDom("div", {
                    class: "ogl_messageButton tooltip",
                    title: "Convert this battle",
                    parent: dialog.querySelector(".msg_actions"),
                    child: "C",
                    onclick: () => window.open(Util.genConverterLink(this.ogl, api), "_blank")
                });
            } else if (id && isSpy && !dialog.querySelector(".ogl_messageButton")) {
                isCombat = new URLSearchParams(dialog.querySelector(".msg_title a")?.href),
                    id = [isCombat.get("galaxy") || "0", isCombat.get("system") || "0", isCombat.get("position") || "0"];
                let apiButton = dialog.querySelector(".icon_apikey"), api = (apiButton.getAttribute("data-tooltip-title") || apiButton.getAttribute("title") || apiButton.getAttribute("data-title") || apiButton.getAttribute("data-api-code")).match(/sr-[a-z0-9-]*/)[0];
                apiButton.setAttribute("data-api-code", api), dialog.querySelector(".ogl_tagPicker") || (isSpy = Util.addDom("div", {
                    class: "ogl_messageButton",
                    parent: dialog.querySelector(".msg_actions")
                }), this.ogl._ui.addTagButton(isSpy, id)), dialog.querySelector(".ogl_trashsim") || Util.addDom("div", {
                    class: "ogl_messageButton material-icons ogl_trashsim tooltip",
                    parent: dialog.querySelector(".msg_actions"),
                    child: "letter_s",
                    onclick: () => window.open(Util.genTrashsimLink(this.ogl, api), "_blank")
                }), !dialog.querySelector(".ogl_ptre") && this.ogl.ptreKey && Util.addDom("div", {
                    class: "ogl_messageButton material-icons tooltip",
                    parent: dialog.querySelector(".msg_actions"),
                    child: "ptre",
                    onclick: () => this.ogl.PTRE.postSpyReport(api)
                });
            }
        }
    }
    addBoardTab() {
        let div = Util.addDom("div", {
            class: "ogl_boardMessageTab",
            parent: document.querySelector(".mainTabs")
        });
        Util.addDom("div", {
            class: "tabImage",
            parent: div,
            child: Util.addDom("div", {
                class: "material-icons",
                child: "menu_book"
            })
        }), Util.addDom("div", {
            class: "tabLabel",
            parent: div,
            child: "Board.fr"
        });
        let newMessagesCount = Util.addDom("div", {
            class: "newMessagesCount ogl_hidden",
            parent: div,
            child: this.ogl.db.lastBoardPosts[0]
        });
        0 < this.ogl.db.lastBoardPosts[0] && newMessagesCount.classList.remove("ogl_hidden"),
            div.addEventListener("click", () => {
                var wrapper = document.querySelector("#messagewrapper");
                wrapper.innerText = "";
                let inner = Util.addDom("div", {
                    id: "oglBoardTab",
                    class: "messagesHolder",
                    parent: wrapper,
                    child: '<div class="ogl_wrapperloading"><div class="ogl_loading"></div></div>'
                });
                document.querySelectorAll(".mainTabs .marker").forEach(e => e.classList.remove("marker")),
                    div.classList.add("marker"), GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://board.fr.ogame.gameforge.com/index.php?board-feed/101/",
                        onload: result => {
                            result = new DOMParser().parseFromString(result.responseText, "text/xml").querySelectorAll("item");
                            inner.innerText = "", result.forEach((item, index) => {
                                var rawDate = new Date(item.querySelector("pubDate").textContent), date = rawDate.toLocaleDateString("de-DE", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                }), time = rawDate.toLocaleTimeString("de-DE"), msg = Util.addDom("div", {
                                    class: "msg",
                                    parent: inner
                                });
                                Util.addDom("span", {
                                    class: "msg_title blue_txt",
                                    parent: msg,
                                    child: `${item.querySelector("title").textContent}<br><i>@${item.getElementsByTagName("dc:creator")[0].textContent}</i>`,
                                    onclick: () => {
                                        window.open(item.querySelector("link").textContent, "_blank");
                                    }
                                }), Util.addDom("span", {
                                    class: "msg_date fright ogl_CustomMessagedate",
                                    parent: msg,
                                    child: date + " " + time
                                }), Util.addDom("div", {
                                    class: "msg_content",
                                    parent: msg,
                                    child: item.getElementsByTagName("content:encoded")[0].textContent
                                }), 0 == index && (this.ogl.db.lastBoardPosts[1] = rawDate.getTime());
                            }), this.ogl._time.updateList.push(".ogl_CustomMessagedate"),
                                this.ogl.db.lastBoardPosts[0] = 0, this.ogl.db.lastBoardPosts[2] = Date.now(),
                                newMessagesCount.classList.add("ogl_hidden");
                        }
                    });
            });
    }
    checkBoard() {
        var count;
        "undefined" != typeof GM_xmlhttpRequest && "fr" == this.ogl.server.lang && this.ogl.db.options.boardTab && (this.ogl.db.lastBoardPosts = this.ogl.db.lastBoardPosts || [0, 0, 0],
            Date.now() > this.ogl.db.lastBoardPosts[2] + 36e5 ? GM_xmlhttpRequest({
                method: "GET",
                url: "http://board.fr.ogame.gameforge.com/index.php?board-feed/101/",
                onload: result => {
                    var result = new DOMParser().parseFromString(result.responseText, "text/xml");
                    this.ogl.db.lastBoardPosts[0] = 0, result.querySelectorAll("item").forEach((item, index) => {
                        item = new Date(item.querySelector("pubDate").textContent).getTime();
                        item > this.ogl.db.lastBoardPosts[1] && this.ogl.db.lastBoardPosts[0]++,
                            0 == index && (this.ogl.db.lastBoardPosts[1] = item);
                    }), 0 < this.ogl.db.lastBoardPosts[0] && ((result = document.querySelector(".comm_menu.messages .new_msg_count") || Util.addDom("span", {
                        class: "new_msg_count totalMessages news"
                    })).innerText = parseInt(result?.innerText || 0) + this.ogl.db.lastBoardPosts[0]),
                        this.ogl.db.lastBoardPosts[2] = Date.now(), "messages" == this.ogl.page && this.addBoardTab();
                }
            }) : (0 < this.ogl.db.lastBoardPosts[0] && ((count = document.querySelector(".comm_menu.messages .new_msg_count") || Util.addDom("span", {
                class: "new_msg_count totalMessages news",
                parent: document.querySelector(".comm_menu.messages")
            })).innerText = parseInt(count?.innerText || 0) + this.ogl.db.lastBoardPosts[0]),
                "messages" == this.ogl.page && this.addBoardTab()));
    }
    addSpyIcons(parent, coords, uniqueType, displayActivity) {
        var planetIcon;
        if (coords = "string" == typeof coords ? coords.split(":") : coords, "planet" != uniqueType && uniqueType || (planetIcon = Util.addDom("div", {
            class: "material-icons ogl_spyIcon tooltip",
            title: this.ogl._lang.find("spyPlanet"),
            "data-spy-coords": `${coords[0]}:${coords[1]}:${coords[2]}:1`,
            child: "language",
            parent: parent,
            onclick: e => sendShips(6, coords[0], coords[1], coords[2], 1)
        }), lastPlanetSpy = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.spy?.[0] || 0,
            serverTime.getTime() - lastPlanetSpy < this.ogl.db.options.spyIndicatorDelay && (planetIcon.setAttribute("data-spy", "recent"),
                planetIcon.setAttribute("title", "recently spied")), displayActivity && (lastPlanetSpy = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.acti || [],
                    isRecent = serverTime.getTime() - lastPlanetSpy[2] < 36e5, planetIcon = Util.addDom("span", {
                        parent: planetIcon,
                        child: isRecent ? lastPlanetSpy[0] : "?"
                    }), "*" == lastPlanetSpy[0] && isRecent ? planetIcon.classList.add("ogl_danger") : 60 == lastPlanetSpy[0] && isRecent ? planetIcon.classList.add("ogl_ok") : planetIcon.classList.add("ogl_warning"))),
            "moon" == uniqueType || !uniqueType && this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.mid) {
            var lastPlanetSpy = 0 < this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.mid ? Util.addDom("div", {
                class: "material-icons ogl_spyIcon tooltip",
                title: this.ogl._lang.find("spyMoon"),
                "data-spy-coords": `${coords[0]}:${coords[1]}:${coords[2]}:3`,
                child: "bedtime",
                parent: parent,
                onclick: e => sendShips(6, coords[0], coords[1], coords[2], 3)
            }) : Util.addDom("div", {
                parent: parent
            }), isRecent = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.spy?.[1] || 0;
            if (serverTime.getTime() - isRecent < this.ogl.db.options.spyIndicatorDelay && (lastPlanetSpy.setAttribute("data-spy", "recent"),
                lastPlanetSpy.setAttribute("title", "recently spied")), displayActivity && -1 < this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.mid) {
                let activity = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.acti || [], isRecent = serverTime.getTime() - activity[2] < 36e5, activityDom = Util.addDom("span", {
                    parent: lastPlanetSpy,
                    child: isRecent ? activity[1] : "?"
                });
                "*" == activity[1] && isRecent ? activityDom.classList.add("ogl_danger") : 60 == activity[1] && isRecent ? activityDom.classList.add("ogl_ok") : activityDom.classList.add("ogl_warning");
            }
        }
        uniqueType || this.ogl.db.pdb[`${coords[0]}:${coords[1]}:` + coords[2]]?.mid || Util.addDom("div", {
            parent: parent
        });
    }
}

class MovementManager extends Manager {
    load(reload) {
        this.ogl.cache.movements = this.ogl.cache.movements || {}, setTimeout(() => {
            this.eventLoaded || refreshFleetEvents(!0);
        }, 100), "movement" != this.ogl.page || reload || (unsafeWindow.timerHandler.pageReloadAlreadyTriggered = !0,
            this.updateMovement());
    }
    addFleetIcon(data, parent, reversed) {
        var targetClass = reversed ? "ogl_sideIconBottom" : "ogl_sideIconTop", targetClass = parent.querySelector("." + targetClass) || Util.addDom("div", {
            class: targetClass,
            parent: parent
        });
        Util.addDom("div", {
            class: "material-icons ogl_fleetIcon ogl_mission" + data[0].mission,
            parent: targetClass,
            "data-list": data.length,
            onclick: () => {
                let container = Util.addDom("div", {
                    class: "ogl_sideFleetTooltip"
                }), cumul = {
                    metal: 0,
                    crystal: 0,
                    deut: 0
                }, total = (data.forEach(line => {
                    var fleetImg = reversed ? "http://gf2.geo.gfsrv.net/cdn47/014a5d88b102d4b47ab5146d4807c6.gif" : "http://gf2.geo.gfsrv.net/cdnd9/f9cb590cdf265f499b0e2e5d91fc75.gif";
                    let shipAmount = 0, domLine = (Object.keys(line).filter(element => parseInt(element)).forEach(shipID => shipAmount += line[shipID]),
                        Util.addDom("div", {
                            class: `ogl_mission${line.mission} ogl_sideFleetIcon`,
                            child: `<div class="material-icons">${line.from.isMoon ? "bedtime" : "language"}</div><div>[${line.from.coords}]</div><span>${Util.formatToUnits(shipAmount)}</span><img src="${fleetImg}"><div class="material-icons">${8 == line.mission ? "debris" : line.to.isMoon ? "bedtime" : "language"}</div><div>[${line.to.coords}]</div>`,
                            parent: container
                        }));
                    ["metal", "crystal", "deut"].forEach(res => {
                        Util.addDom("div", {
                            class: "ogl_icon ogl_" + res,
                            parent: domLine,
                            child: Util.formatToUnits(line[res] || 0)
                        }), cumul[res] += line[res];
                    });
                    fleetImg = this.ogl._time.getObj(line.arrivalTime, "client"),
                        fleetImg = this.ogl.db.options.useClientTime ? fleetImg.client : fleetImg.server;
                    domLine.prepend(this.ogl._time.convertTimestampToDate(fleetImg));
                }), Util.addDom("div", {
                    class: "ogl_sideFleetIcon",
                    child: "<span></span><span></span><span></span><span></span><span></span><span></span><span></span>",
                    parent: container
                }));
                ["metal", "crystal", "deut"].forEach(res => Util.addDom("div", {
                    class: "ogl_icon ogl_" + res,
                    parent: total,
                    child: Util.formatToUnits(cumul[res] || 0)
                })), this.ogl._popup.open(container);
            }
        });
    }
    updateMovement() {
        let emptyData = !1;
        0 < document.querySelectorAll("#movementcomponent .reversal a").length && (document.querySelectorAll("#movementcomponent .reversal a")[0].setAttribute("data-key-color", "orange"),
            Array.from(document.querySelectorAll("#movementcomponent .reversal a")).sort((a, b) => parseInt(b.closest(".fleetDetails").getAttribute("id").replace("fleet", "")) - parseInt(a.closest(".fleetDetails").getAttribute("id").replace("fleet", "")))[0].setAttribute("data-key-color", "violet")),
            document.querySelectorAll(".route a").forEach((route, index) => {
                route.classList.add("tooltipRight");
                var parent = route.closest(".fleetDetails");
                let resourcesBlock = Util.addDom("div", {
                    class: "ogl_resourcesBlock"
                });
                var timeBlockRight, timeBlock = Util.addDom("div", {
                    class: "ogl_timeBlock"
                }), actionsBlock = Util.addDom("div", {
                    class: "ogl_actionsBlock"
                }), route = document.querySelector("#" + route.getAttribute("rel"));
                route ? (route.querySelectorAll(".fleetinfo tr").forEach(subline => {
                    if (subline.querySelector("td") && subline.querySelector(".value")) {
                        let name = subline.querySelector("td").innerText.replace(":", "");
                        var key = Object.entries(this.ogl.db.serverData).find(entry => entry[1] === name)[0], subline = parseInt(subline.querySelector(".value").innerText.replace(/\.|,| /g, "")), formattedValue = Util.formatToUnits(subline, 0);
                        subline && (isNaN(key) ? "metal" == key ? Util.addDom("div", {
                            class: "ogl_icon ogl_" + key,
                            child: formattedValue,
                            prepend: resourcesBlock
                        }) : "crystal" == key ? Util.addDom("div", {
                            class: "ogl_icon ogl_" + key,
                            child: formattedValue,
                            after: resourcesBlock.querySelector(".ogl_metal")
                        }) : "deut" == key ? Util.addDom("div", {
                            class: "ogl_icon ogl_" + key,
                            child: formattedValue,
                            after: resourcesBlock.querySelector(".ogl_crystal")
                        }) : "food" == key && Util.addDom("div", {
                            class: "ogl_icon ogl_" + key,
                            child: formattedValue,
                            after: resourcesBlock.querySelector(".ogl_deut")
                        }) : Util.addDom("div", {
                            class: "ogl_icon ogl_" + key,
                            child: formattedValue,
                            parent: resourcesBlock
                        }));
                    }
                }), 18 == parent.getAttribute("data-mission-type") && (Util.addDom("div", {
                    class: "ogl_icon ogl_metal",
                    child: 0,
                    prepend: resourcesBlock
                }), Util.addDom("div", {
                    class: "ogl_icon ogl_crystal",
                    child: 0,
                    prepend: resourcesBlock
                }), Util.addDom("div", {
                    class: "ogl_icon ogl_deut",
                    child: 0,
                    prepend: resourcesBlock
                }), Util.addDom("div", {
                    class: "ogl_icon ogl_food",
                    child: 0,
                    prepend: resourcesBlock
                })), route = Util.addDom("div", {
                    class: "ogl_timeBlockLeft",
                    parent: timeBlock
                }), timeBlockRight = Util.addDom("div", {
                    class: "ogl_timeBlockRight",
                    parent: timeBlock
                }), route.appendChild(parent.querySelector(".timer")), route.appendChild(parent.querySelector(".absTime")),
                    route.appendChild(parent.querySelector(".originData")), route.querySelector(".originData").appendChild(route.querySelector(".originCoords")),
                    timeBlockRight.appendChild(parent.querySelector(".destinationData")),
                    timeBlockRight.querySelector(".destinationData").appendChild(timeBlockRight.querySelector(".destinationPlanet")),
                    parent.querySelector(".nextabsTime") ? timeBlockRight.appendChild(parent.querySelector(".nextabsTime")) : Util.addDom("div", {
                        child: "-",
                        parent: timeBlockRight
                    }), parent.querySelector(".nextTimer") ? timeBlockRight.appendChild(parent.querySelector(".nextTimer")) : Util.addDom("div", {
                        child: "-",
                        parent: timeBlockRight
                    }), Util.addDom("div", {
                        class: "ogl_icon ogl_mission" + parent.getAttribute("data-mission-type"),
                        prepend: actionsBlock
                    }), actionsBlock.appendChild(parent.querySelector(".route a")), parent.querySelector(".fedAttack") && actionsBlock.appendChild(parent.querySelector(".fedAttack")),
                    parent.querySelector(".sendMail") && actionsBlock.appendChild(parent.querySelector(".sendMail")),
                    parent.prepend(resourcesBlock), parent.prepend(timeBlock), parent.prepend(actionsBlock)) : emptyData = !0;
            }), emptyData || this.ogl._time.updateMovements();
    }
    check(xml) {
        let movements = {}, ignored = [];
        xml.querySelectorAll("#eventContent tbody tr").forEach(line => {
            var dest, tooltip = Util.addDom("div", {
                child: (line.querySelector(".icon_movement .tooltip") || line.querySelector(".icon_movement_reserve .tooltip"))?.getAttribute("title")
            });
            let movement = {};
            if (movement.id = parseInt(line.getAttribute("id").replace("eventRow-", "")),
                movement.mission = line.getAttribute("data-mission-type"), movement.isBack = "true" === line.getAttribute("data-return-flight"),
                movement.arrivalTime = 1e3 * parseInt(line.getAttribute("data-arrival-time")),
                movement.isBack || ignored.push(movement.id + 1), !(-1 < ignored.indexOf(movement.id))) {
                movement.from = {}, movement.from.anotherPlayer = !Boolean(Array.from(document.querySelectorAll("#planetList .planet-koords")).find(p => p.innerText === line.querySelector(".coordsOrigin").innerText.trim().slice(1, -1))),
                    movement.from.isMoon = Boolean(line.querySelector(".originFleet figure.moon")),
                    movement.from.coords = line.querySelector(".coordsOrigin").innerText.trim().slice(1, -1),
                    movement.to = {}, movement.to.anotherPlayer = !Boolean(Array.from(document.querySelectorAll("#planetList .planet-koords")).find(p => p.innerText === line.querySelector(".destCoords").innerText.trim().slice(1, -1))),
                    movement.to.isMoon = Boolean(line.querySelector(".destFleet figure.moon")),
                    movement.to.coords = line.querySelector(".destCoords").innerText.trim().slice(1, -1),
                    1 != movement.mission && 6 != movement.mission && 9 != movement.mission || !movement.from.anotherPlayer || (dest = Array.from(document.querySelectorAll("#planetList .planet-koords")).find(p => p.innerText === line.querySelector(".destCoords").innerText.trim().slice(1, -1))) && (dest = dest.closest(".smallplanet"),
                        (movement.to.isMoon ? dest.querySelector(".moonlink") : dest.querySelector(".planetlink")).classList.add("ogl_attacked")),
                    tooltip.querySelectorAll(".fleetinfo tr").forEach(subline => {
                        if (subline.querySelector("td") && subline.querySelector(".value")) {
                            let name = subline.querySelector("td").innerText.replace(":", "");
                            var key = Object.entries(this.ogl.db.serverData).find(entry => entry[1] === name)?.[0], subline = subline.querySelector(".value").innerText.replace(/\.|,| /g, "");
                            key && (movement[key] = Number(subline));
                        }
                    });
                let target;
                (target = movement.isBack ? movement.from.coords + ":B" : movement.to.anotherPlayer ? movement.from.coords : movement.from.anotherPlayer ? movement.to.coords + ":B" : movement.to.coords) && (movements[target] = movements[target] || [],
                    movements[target].push(movement));
            }
        }), this.ogl.cache.movements = movements, document.querySelectorAll(".smallplanet").forEach(planet => {
            var coords = planet.querySelector(".planet-koords").innerText;
            planet.querySelectorAll(".ogl_fleetIcon").forEach(e => e.remove()),
                this.ogl.cache?.movements?.[coords] && this.addFleetIcon(this.ogl.cache.movements[coords], planet),
                this.ogl.cache?.movements?.[coords + ":B"] && this.addFleetIcon(this.ogl.cache.movements[coords + ":B"], planet, !0);
        }), Util.runAsync(() => {
            this.ogl._ui.displayResourcesRecap(), this.ogl._tech.checkTodolist(),
                this.ogl._time.updateMovements(), initTooltips();
        });
    }
}

class HighscoreManager extends Manager {
    load() {
        this.rankingDBName = this.ogl.DBName + "-highscore", this.ogl.db.lastPTREAPIUpdate = this.ogl.db.lastPTREAPIUpdate || 0,
            this.tagToNameList = {
                n: "status_abbr_active",
                v: "status_abbr_vacation",
                I: "status_abbr_longinactive",
                i: "status_abbr_inactive",
                b: "status_abbr_banned",
                a: "status_abbr_admin",
                HONORABLE: "status_abbr_honorableTarget"
            }, this.nameToTagList = Object.fromEntries(Object.entries(this.tagToNameList).map(e => e.reverse())),
            this.nameToServerTagList = {
                status_abbr_inactive: this.ogl.db.serverData.inactive,
                status_abbr_longinactive: this.ogl.db.serverData.inactiveLong,
                status_abbr_banned: this.ogl.db.serverData.banned,
                status_abbr_vacation: this.ogl.db.serverData.vacation,
                status_abbr_active: !1,
                status_abbr_honorableTarget: "HONORABLE"
            }, this.turnApiStatusToName = status => status = -1 < status.indexOf("v") ? "status_abbr_vacation" : -1 < status.indexOf("I") ? "status_abbr_longinactive" : -1 < status.indexOf("i") ? "status_abbr_inactive" : -1 < status.indexOf("b") ? "status_abbr_banned" : "status_abbr_active",
            "highscore" == this.ogl.page && this.check();
    }
    check() {
        216e5 < serverTime.getTime() - this.ogl.db.lastPTREAPIUpdate ? this.ogl.PTRE.getRank({}, data => {
            1 == data?.code && (GM_setValue(this.rankingDBName, JSON.stringify(data)),
                this.ogl.db.lastPTREAPIUpdate = serverTime.getTime()), this.loadData();
        }) : this.loadData();
    }
    loadData() {
        let typesList = {
            0: "global",
            1: "economy",
            2: "research",
            3: "military",
            8: "lifeform"
        };
        if (1 === currentCategory && typesList[currentType]) {
            document.querySelector("#stat_list_content").setAttribute("data-category", currentCategory),
                document.querySelector("#stat_list_content").setAttribute("data-type", currentType);
            let data = JSON.parse(GM_getValue(this.rankingDBName) || "{}");
            var ts = data?.ranks_array?.[0]?.timestamp;
            ts && (ts = Math.floor(Math.abs(serverTime.getTime() - 1e3 * parseInt(ts)) / 36e5),
                document.querySelector("#ranks td.score").innerText += ` (Δ ${ts}${LocalizationStrings.timeunits.short.hour})`),
                document.querySelectorAll("#ranks tbody tr").forEach(line => {
                    let id = parseInt(line.getAttribute("id").replace(/\D/g, ""));
                    var scoreDiff, domPlayerName = line.querySelector(".playername"), ranking = parseInt(line.querySelector(".position").innerText.replace(/\D/g, "")), name = -1 < domPlayerName.innerText.indexOf("...") && this.ogl.db.udb[id]?.name ? this.ogl.db.udb[id]?.name : domPlayerName.innerText.trim(), score = line.querySelector(".score"), currentScore = parseInt(score.innerText.replace(/\D/g, "")), oldData = data?.ranks_array?.find(e => e.player_id == id);
                    oldData && 0 == currentType && (scoreDiff = currentScore - parseInt(oldData?.total_score || "0"),
                        score = Util.addDom("div", {
                            class: "ogl_oldScore",
                            child: `<em>${Util.formatNumber(new Intl.NumberFormat("de-DE", {
                                signDisplay: "exceptZero"
                            }).format(scoreDiff))}</em>`,
                            parent: score
                        }), 0 < scoreDiff ? score.classList.add("ogl_ok") : scoreDiff < 0 && score.classList.add("ogl_danger")),
                        domPlayerName.innerText = name, this.ogl.db.udb[id]?.score?.[typesList[currentType]] && (this.ogl.db.udb[id].score[typesList[currentType]] = currentScore),
                        this.ogl.db.udb[id]?.score?.[typesList[currentType] + "Ranking"] && (this.ogl.db.udb[id].score[typesList[currentType] + "Ranking"] = ranking),
                        this.ogl.db.udb[id] && name.indexOf("...") < 0 && (this.ogl.db.udb[id].name = name);
                    let status = "";
                    status = this.ogl.db.udb[id] && oldData && (this.ogl.db.udb[id]?.liveUpdate || 0) < 1e3 * oldData.timestamp ? (this.ogl.db.udb[id].status = this.nameToTagList[this.turnApiStatusToName(oldData.status)],
                        this.ogl.db.udb[id].status) : this.ogl.db.udb[id] ? this.ogl.db.udb[id].status : oldData?.status ? this.nameToTagList[this.turnApiStatusToName(oldData.status)] : "n",
                        this.ogl._ui.turnIntoPlayerLink(id, domPlayerName, !1, status),
                        this.ogl._ui.addPinButton(line.querySelector(".highscoreNameFieldWrapper"), id);
                }), initTooltips();
        }
    }
}

class ShortcutManager extends Manager {
    load() {
        document.querySelector(".ogl_shortcuts")?.remove(), document.querySelector(".ogl_shortCutWrapper")?.remove(),
            this.keyList = {}, this.shortCutWrapper = Util.addDom("div", {
                class: "ogl_shortCutWrapper",
                child: "<div></div>"
            }), this.shortcutDiv = Util.addDom("div", {
                class: "ogl_shortcuts",
                parent: this.ogl.db.options.shortcutsOnRight ? document.querySelector("#rechts") : this.shortCutWrapper
            }), this.locked = !1, this.loaded || (document.addEventListener("keydown", event => {
                var activeElement = document.activeElement, tooltipVisible = document.querySelector('.tippy-box[data-state="visible"]'), tooltipValidationButton = document.querySelector(".tippy-box .ogl_formValidation"), popupVisible = document.querySelector(".ogl_popup.ogl_active"), activeElement = "INPUT" == activeElement.tagName || "TEXTAREA" == activeElement.tagName;
                if (!event.repeat) {
                    if ("enter" == event.key.toLowerCase() && tooltipVisible && tooltipValidationButton) return void tooltipValidationButton.click();
                    if ("escape" == event.key.toLowerCase() && popupVisible && !activeElement) return void this.ogl._popup.close();
                }
                activeElement || !this.keyList[event.key.toLowerCase()] || this.locked || event.ctrlKey || event.shiftKey ? activeElement || isNaN(event.key) || !this.keyList["2-9"] || this.locked || event.ctrlKey || event.shiftKey || (this.locked = !0,
                    this.keyList["2-9"](event.key)) : (this.locked = !0, this.keyList[event.key.toLowerCase()]());
            }), document.addEventListener("keyup", () => this.locked = !1), visualViewport.addEventListener("resize", () => this.updateShortcutsPosition()),
                visualViewport.addEventListener("scroll", () => this.updateShortcutsPosition())),
            this.loaded = !0, this.add("menu", () => (document.querySelector(".ogl_side.ogl_active .ogl_config") ? (this.ogl._ui.side.classList.remove("ogl_active"),
                delete this.ogl.db.currentSide) : this.ogl._topbar.openSettings(), !1)),
            this.add("showMenuResources", () => (this.ogl.db.options.showMenuResources++,
                2 < this.ogl.db.options.showMenuResources && (this.ogl.db.options.showMenuResources = 0),
                localStorage.setItem("ogl_menulayout", this.ogl.db.options.showMenuResources),
                document.body.setAttribute("data-menulayout", this.ogl.db.options.showMenuResources),
                !1)), this.add("previousPlanet", () => {
                    localStorage.setItem("ogl-redirect", !1), document.body.classList.remove("ogl_destinationPicker"),
                        this.redirectToPlanet(-1);
                }), this.add("nextPlanet", () => {
                    localStorage.setItem("ogl-redirect", !1), document.body.classList.remove("ogl_destinationPicker"),
                        this.redirectToPlanet(1);
                }), isNaN(this.ogl.db.currentSide) && "tagged" != this.ogl.db.currentSide || !document.querySelector(".ogl_side.ogl_active") || this.add("nextPinnedPosition", () => {
                    if (!isNaN(this.ogl.db.currentSide) && document.querySelector(".ogl_side.ogl_active")) {
                        var arr = Array.from(document.querySelectorAll(".ogl_pinDetail [data-galaxy]")), index = arr.findLastIndex(e => e.classList.contains("ogl_active")), arr = Util.reorderArray(arr, index)[1];
                        arr && arr.click();
                    } else if ("tagged" == this.ogl.db.currentSide && document.querySelector(".ogl_side.ogl_active")) {
                        let arr = Array.from(document.querySelectorAll(".ogl_tagged [data-galaxy]")), index = arr.findLastIndex(e => e.classList.contains("ogl_active")), target = Util.reorderArray(arr, index)[1];
                        target && target.click();
                    } else fadeBox(this.ogl._lang.find("noCurrentPin"), !0);
                    return !1;
                }), "fleetdispatch" == this.ogl.page ? (Util.addDom("div", {
                    class: "ogl_separator",
                    parent: this.shortcutDiv
                }), this.add("expeditionSC", () => {
                    "fleet1" == fleetDispatcher.currentPage && this.ogl._fleet.selectExpedition(202);
                }, "fleet"), this.add("expeditionLC", () => {
                    "fleet1" == fleetDispatcher.currentPage && this.ogl._fleet.selectExpedition(203);
                }, "fleet"), this.add("expeditionPF", () => {
                    "fleet1" == fleetDispatcher.currentPage && this.ogl._fleet.selectExpedition(219);
                }, "fleet"), this.add("fleetRepeat", () => {
                    if (!this.ogl._fleet.isReady) return !1;
                    "fleet1" == fleetDispatcher.currentPage && (fleetDispatcher.resetShips(),
                        Object.values(this.ogl.db.previousFleet.shipsToSend).forEach(ship => fleetDispatcher.selectShip(ship.id, ship.number))),
                        this.ogl._fleet.setRealTarget(fleetDispatcher.realTarget, {
                            galaxy: this.ogl.db.previousFleet.targetPlanet.galaxy,
                            system: this.ogl.db.previousFleet.targetPlanet.system,
                            position: this.ogl.db.previousFleet.targetPlanet.position,
                            type: this.ogl.db.previousFleet.targetPlanet.type,
                            name: this.ogl.db.previousFleet.targetPlanet.name
                        }), fleetDispatcher.selectMission(this.ogl.db.previousFleet.mission),
                        fleetDispatcher.cargoMetal = this.ogl.db.previousFleet.cargoMetal, fleetDispatcher.cargoCrystal = this.ogl.db.previousFleet.cargoCrystal,
                        fleetDispatcher.cargoDeuterium = this.ogl.db.previousFleet.cargoDeuterium,
                        fleetDispatcher.realSpeedPercent = this.ogl.db.previousFleet.speedPercent,
                        fleetDispatcher.speedPercent = this.ogl.db.previousFleet.speedPercent,
                        "fleet2" == fleetDispatcher.currentPage && fleetDispatcher.fetchTargetPlayerData(),
                        15 == fleetDispatcher.mission && (document.querySelector("#fleet2 #expeditiontime").value = this.ogl.db.previousFleet.expeditionTime,
                            document.querySelector("#fleet2 #expeditiontimeline .dropdown a").innerText = this.ogl.db.previousFleet.expeditionTime,
                            fleetDispatcher.updateExpeditionTime()), fleetDispatcher.setFleetPercent(fleetDispatcher.realSpeedPercent),
                        Object.values(document.querySelector("#speedPercentage"))[0].percentageBarInstance.setValue(fleetDispatcher.realSpeedPercent),
                        fleetDispatcher.refresh(), fleetDispatcher.focusSubmitFleet1();
                }, "fleet"), this.add("fleetSelectAll", () => {
                    if (!this.ogl._fleet.isReady) return !1;
                    "fleet1" == fleetDispatcher.currentPage ? fleetDispatcher.selectAllShips() : "fleet2" == fleetDispatcher.currentPage && fleetDispatcher.selectMaxAll(),
                        fleetDispatcher.refresh();
                }, "fleet"), this.ogl.db.quickRaidList && 0 < this.ogl.db.quickRaidList.length && this.add("quickRaid", () => {
                    if (!this.ogl._fleet.isReady) return !1;
                    var target, amount;
                    "fleet1" == fleetDispatcher.currentPage && (fleetDispatcher.resetShips(),
                        this.ogl._fleet.isQuickRaid = !0, target = this.ogl.db.quickRaidList[0].match(/.{1,3}/g).map(Number),
                        amount = this.ogl._fleet.shipsForResources(this.ogl.db.options.defaultShip, this.ogl.db.options.resourceTreshold),
                        fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, amount),
                        fleetDispatcher.realTarget.galaxy = target[0], fleetDispatcher.realTarget.system = target[1],
                        fleetDispatcher.realTarget.position = target[2], fleetDispatcher.realTarget.type = 1,
                        fleetDispatcher.selectMission(1), fleetDispatcher.targetPlanet.name = "Quick raid " + target.join(":"),
                        fleetDispatcher.cargoMetal = 0, fleetDispatcher.cargoCrystal = 0, fleetDispatcher.cargoDeuterium = 0,
                        fleetDispatcher.mission = 1, fleetDispatcher.speedPercent = 10, fleetDispatcher.refresh(),
                        fleetDispatcher.focusSubmitFleet1());
                }, "fleet"), this.add("fleetReverseAll", () => {
                    if (!this.ogl._fleet.isReady) return !1;
                    "fleet1" == fleetDispatcher.currentPage ? (fleetDispatcher.shipsOnPlanet.forEach(ship => {
                        var delta = ship.number - (fleetDispatcher.findShip(ship.id)?.number || 0);
                        fleetDispatcher.selectShip(ship.id, delta), fleetDispatcher.refresh();
                    }), fleetDispatcher.refresh(), fleetDispatcher.focusSubmitFleet1()) : "fleet2" == fleetDispatcher.currentPage && (["metal", "crystal", "deut", "food"].forEach(type => {
                        fleetDispatcher[this.ogl._fleet.cargo[type]] = Math.min(fleetDispatcher[this.ogl._fleet.resOnPlanet[type]] - fleetDispatcher[this.ogl._fleet.cargo[type]], fleetDispatcher.getFreeCargoSpace());
                    }), fleetDispatcher.refresh());
                }, "fleet"), this.add("fleetResourcesSplit", keyNumber => {
                    if (!this.ogl._fleet.isReady) return !1;
                    if (this.keyNumberClickFleet1 = this.keyNumberClickFleet1 || 0, this.keyNumberClickFleet2 = this.keyNumberClickFleet2 || 0,
                        "fleet1" == fleetDispatcher.currentPage) isNaN(keyNumber) && (keyNumber = 2 + this.keyNumberClickFleet1),
                            this.keyNumberClickFleet2 = this.keyNumberClickFleet1, this.keyNumberClickFleet1++,
                            7 < this.keyNumberClickFleet1 && (this.keyNumberClickFleet1 = 0), 0 == keyNumber ? fleetDispatcher.resetShips() : fleetDispatcher.shipsOnPlanet.forEach(ship => fleetDispatcher.selectShip(ship.id, Math.ceil(ship.number / keyNumber))); else if ("fleet2" == fleetDispatcher.currentPage) {
                                isNaN(keyNumber) && (keyNumber = 2 + this.keyNumberClickFleet2),
                                    this.keyNumberClickFleet2++, 7 < this.keyNumberClickFleet2 && (this.keyNumberClickFleet2 = 0);
                                let fleetDispatcherResources = ["metalOnPlanet", "crystalOnPlanet", "deuteriumOnPlanet"];
                                0 == keyNumber ? fleetDispatcher.resetCargo() : document.querySelectorAll("#fleet2 #resources .res_wrap").forEach((resource, index) => {
                                    var cargoType = ["cargoMetal", "cargoCrystal", "cargoDeuterium"];
                                    let currentMax = fleetDispatcher[fleetDispatcherResources[index]];
                                    2 == index && (currentMax -= fleetDispatcher.getConsumption()),
                                        fleetDispatcher[cargoType[index]] = Math.max(Math.ceil(currentMax / keyNumber), 0),
                                        resource.querySelector("input").value = fleetDispatcher[cargoType[index]];
                                });
                            }
                    fleetDispatcher.refresh();
                }), this.add("fleetQuickCollect", () => {
                    if (!this.ogl._fleet.isReady) return !1;
                    document.querySelector(".ogl_requiredShips .ogl_" + this.ogl.db.options.defaultShip)?.click();
                }), Util.addDom("div", {
                    class: "ogl_shortcut ogl_button",
                    "data-key": "enter",
                    child: '<span class="material-icons">subdirectory_arrow_left</span>',
                    parent: this.shortcutDiv,
                    onclick: () => {
                        if (!this.ogl._fleet.isReady) return !1;
                        document.querySelector("#fleetdispatchcomponent").dispatchEvent(new KeyboardEvent("keypress", {
                            keyCode: 13
                        }));
                    }
                })) : "messages" == this.ogl.page ? (Util.addDom("div", {
                    class: "ogl_separator",
                    parent: this.shortcutDiv
                }), this.add("enter", () => {
                    this.ogl._message.nextTarget && document.querySelector(`.ogl_spyLine[data-id="${this.ogl._message.nextTarget.id}"] .ogl_loot`).click();
                })) : "galaxy" == this.ogl.page ? (Util.addDom("div", {
                    class: "ogl_separator",
                    parent: this.shortcutDiv
                }), this.add("galaxyUp", () => (submitOnKey("ArrowUp"), !1)), this.add("galaxyLeft", () => (submitOnKey("ArrowLeft"),
                    !1)), this.add("galaxyDown", () => (submitOnKey("ArrowDown"), !1)), this.add("galaxyRight", () => (submitOnKey("ArrowRight"),
                        !1)), this.add("galaxyReload", () => (submitForm(), !1)), this.add("galaxySpySystem", () => (document.querySelector(".spysystemlink").click(),
                            !1)), this.add("discovery", () => sendSystemDiscoveryMission())) : "movement" == this.ogl.page && (Util.addDom("div", {
                                class: "ogl_separator",
                                parent: this.shortcutDiv
                            }), this.add("backFirstFleet", () => {
                                document.querySelector('#movementcomponent .reversal a[data-key-color="orange"]') && document.querySelector('#movementcomponent .reversal a[data-key-color="orange"]').click();
                            }, !1, "orange"), this.add("backLastFleet", () => {
                                document.querySelector('#movementcomponent .reversal a[data-key-color="violet"]') && document.querySelector('#movementcomponent .reversal a[data-key-color="violet"]').click();
                            }, !1, "violet")), this.ogl.db.options.shortcutsOnRight || document.body.appendChild(this.shortCutWrapper),
            this.updateShortcutsPosition();
    }
    add(id, callback, type, color) {
        let key = this.ogl.db.options.keyboardActions[id], callBackWithMessage = ("enter" == id && (key = id,
            id = "attackNext"), params => {
                !1 !== callback(params) && this.ogl._notification.addToQueue(this.ogl._lang.find(id));
            });
        color = Util.addDom("div", {
            "data-key": key,
            "data-key-color": color,
            "data-key-id": id,
            class: "ogl_shortcut ogl_button tooltip",
            parent: this.shortcutDiv,
            title: this.ogl._lang.find(id),
            child: key.replace("enter", '<span class="material-icons">subdirectory_arrow_left</span>'),
            onclick: () => callBackWithMessage()
        });
        "quickRaid" == id && (color.innerText += ` (${this.ogl.db.quickRaidList.length})`),
            this.keyList[key] = params => {
                ("fleet" != type || this.ogl._fleet.isReady && unsafeWindow.fleetDispatcher && !fleetDispatcher.fetchTargetPlayerDataTimeout) && callBackWithMessage(params);
            };
    }
    updateShortcutsPosition() {
        var div;
        this.ogl.db.options.shortcutsOnRight || ((div = this.shortCutWrapper).style.top = visualViewport.offsetTop + "px",
            div.style.height = visualViewport.height - 25 / window.visualViewport.scale + "px",
            div.style.left = visualViewport.offsetLeft + "px", div.style.width = visualViewport.width + "px",
            this.shortcutDiv.style.gridGap = 7 / window.visualViewport.scale + "px",
            div.querySelectorAll(".ogl_shortcut").forEach(e => e.style.zoom = 1 / visualViewport.scale));
    }
    redirectToPlanet(direction) {
        var url = new URLSearchParams(window.location.search), urlParams = {}, url = (urlParams.page = url.get("page"),
            urlParams.component = url.get("component"), urlParams.ogldestinationtype = url.get("ogldestinationtype"),
            urlParams.ogldestinationid = url.get("ogldestinationid"), urlParams.oglfirstsourceid = url.get("oglfirstsourceid"),
            urlParams.galaxy = url.get("galaxy"), urlParams.system = url.get("system"),
            urlParams.position = url.get("position"), urlParams.type = url.get("type"),
            this.ogl.account.planets.getCurrent()), url = urlParams.destination || url.currentType;
        let nextPlanet = this.ogl.account.planets.getNext(), nextPlanetWithMoon = this.ogl.account.planets.getNextWithMoon(), prevPlanet = this.ogl.account.planets.getPrev(), prevPlanetWithMoon = this.ogl.account.planets.getPrevWithMoon();
        urlParams.ogldestinationid == nextPlanet.id && (nextPlanet = this.ogl.account.planets.getNext(1)),
            urlParams.ogldestinationid == nextPlanetWithMoon.moonID && (nextPlanetWithMoon = this.ogl.account.planets.getNextWithMoon(1)),
            urlParams.ogldestinationid == prevPlanet.id && (prevPlanet = this.ogl.account.planets.getPrev(1)),
            urlParams.ogldestinationid == prevPlanetWithMoon.moonID && (prevPlanetWithMoon = this.ogl.account.planets.getPrevWithMoon(1));
        var key, value, params = {};
        params.page = urlParams.page, urlParams.component && (params.component = urlParams.component),
            params.cp = 1 == direction ? "moon" == url ? nextPlanetWithMoon.moonID : nextPlanet.id : "moon" == url ? prevPlanetWithMoon.moonID : prevPlanet.id,
            0 === direction && delete params.cp, this.ogl.mode && (params.oglmode = this.ogl.mode),
            urlParams.ogldestinationtype && (params.ogldestinationtype = urlParams.ogldestinationtype);
        for ([key, value] of Object.entries(urlParams)) value && (params[key] = value);
        0 === direction || !this.ogl.mode || urlParams.oglfirstsourceid != nextPlanet.id && urlParams.oglfirstsourceid != nextPlanetWithMoon.moonID ? window.location.href = this.getRedirectionLink(params) : window.location.href = this.getRedirectionLink({
            component: "overview",
            cp: params.cp
        });
    }
    getRedirectionLink(params) {
        (params = params || {}).page = params.page || "ingame";
        let link = `${window.location.href.split('?')[0]}?page=` + params.page;
        for (var [key, value] of Object.entries(params)) "page" != key && (link += `&${key}=` + value);
        return link;
    }
}

class TechManager extends Manager {
    load() {
        var urlTech;
        this.ogl.currentPlanet.obj.todolist = this.ogl.currentPlanet.obj.todolist || {},
            this.initialLevel = 0, this.levelOffset = 0, this.detailCumul = {}, this.checkProductionBoxes(),
            unsafeWindow.technologyDetails && (technologyDetails.show = technologyId => {
                this.xhr && this.xhr.abort();
                let wrapper = document.querySelector("#technologydetails_wrapper"), content = wrapper.querySelector("#technologydetails_content");
                content.querySelector(".ogl_loading") || (content.innerHTML = '<div class="ogl_wrapperloading"><div class="ogl_loading"></div></div>'),
                    wrapper.classList.add("ogl_active"), this.xhr = $.ajax({
                        url: technologyDetails.technologyDetailsEndpoint,
                        data: {
                            technology: technologyId
                        }
                    }).done(data => {
                        data = JSON.parse(data);
                        "failure" === data.status ? technologyDetails.displayErrors(data.errors) : (content.innerText = "",
                            $("#technologydetails_content").append(data.content[data.target]),
                            this.check(technologyId, wrapper));
                    });
            }, technologyDetails.hide = () => {
                document.querySelector("#technologydetails_wrapper").classList.remove("ogl_active"),
                    technologyDetails.id = !1, technologyDetails.lvl = !1;
            }, urlTech = new URLSearchParams(window.location.search).get("openTech")) && technologyDetails.show(urlTech),
            document.querySelectorAll("#technologies .technology[data-technology]").forEach(tech => {
                var id = tech.getAttribute("data-technology");
                this.ogl.db.serverData[id] = tech.getAttribute("aria-label") || id,
                    this.ogl.db.options.debugMode && Util.addDom("div", {
                        style: "background:rgba(0,0,0,.8); position:relative; top:20px; text-align:center;",
                        child: "#" + id,
                        parent: tech.querySelector(".icon")
                    });
            }), this.ogl._topbar.checkUpgrade(), Util.overWrite("reload_page", unsafeWindow, url => {
                this.ogl.db.noFetch = !0;
            });
    }
    check(id, details) {
        details.querySelector(".shipyardSelection") && details.querySelector(".sprite_large").appendChild(details.querySelector(".shipyardSelection"));
        var actions = Util.addDom("div", {
            parent: details.querySelector(".sprite") || details.querySelector(".sprite_large"),
            class: "ogl_actions"
        });
        let data = Datafinder.getTech(id), amount = (this.levelOffset = 0, this.initialLevel = parseInt(details.querySelector(".information .level")?.getAttribute("data-value") || 0),
            details.querySelector("#build_amount"));
        if (document.querySelector(`#technologies .technology[data-technology="${id}"] .targetlevel`)?.getAttribute("data-value") >= this.initialLevel && (this.initialLevel += 1),
            amount) {
            amount.addEventListener("input", () => {
                setTimeout(() => {
                    let value = parseInt(amount.value) || 0;
                    amount.value = Math.min(99999, value), amount.value && setTimeout(() => this.displayLevel(id, value, data, details));
                }, 100);
            }), amount.setAttribute("onkeyup", "checkIntInput(this, 1, 99999);event.stopPropagation();"),
                amount.parentNode.querySelector(".maximum") && amount.parentNode.querySelector(".maximum").addEventListener("click", () => amount.dispatchEvent(new Event("input"))),
                Util.addDom("div", {
                    parent: actions,
                    class: "material-icons ogl_button",
                    child: "format_list_bulleted_add",
                    onclick: e => {
                        this.todoData = {};
                        var number = amount.value && 0 < amount.value ? amount.value : 1, data = this.getTechData(id, number, this.ogl.currentPlanet.obj.id);
                        this.todoData[id] = {}, this.todoData[id].amount = parseInt(number) || 0,
                            this.todoData[id].id = id, this.todoData[id].metal = data.target.metal,
                            this.todoData[id].crystal = data.target.crystal, this.todoData[id].deut = data.target.deut,
                            this.addToTodolist(this.todoData);
                    }
                });
            var queueDiv = Util.addDom("div", {
                parent: details.querySelector(".build_amount"),
                class: "ogl_queueShip"
            });
            let btn10 = Util.addDom("div", {
                parent: queueDiv,
                title: this.ogl._lang.find("repeatQueue"),
                class: "ogl_button ogl_queue10 tooltip",
                child: "Repeat x",
                onclick: () => {
                    btn10.classList.add("ogl_disabled"), input10.classList.add("ogl_disabled");
                    let upgrade = () => {
                        fetch(scheduleBuildListEntryUrl + (`&technologyId=${id}&amount=${amount.value || 1}&mode=1&token=` + token), {
                            headers: {
                                "X-Requested-With": "XMLHttpRequest"
                            }
                        }).then(response => response.json()).then(result => {
                            var buildLeft = parseInt(input10.value?.replace(/\D/g, "") || 0) - 1;
                            input10.value = buildLeft, token = result.newAjaxToken,
                                window.stop(), 0 < buildLeft ? upgrade() : (btn10.classList.remove("ogl_disabled"),
                                    input10.classList.remove("ogl_disabled"));
                        });
                    };
                    upgrade();
                }
            }), input10 = Util.addDom("input", {
                type: "number",
                min: 0,
                max: 100,
                value: 1,
                parent: queueDiv,
                oninput: () => {
                    var value = parseInt(input10.value?.replace(/\D/g, "") || 0), min = parseInt(input10.getAttribute("min")), max = parseInt(input10.getAttribute("max"));
                    input10.value = Math.min(Math.max(value, min), max);
                }
            });
            details.querySelector(".build-it_wrap .upgrade[disabled]") && (btn10.classList.add("ogl_disabled"),
                input10.classList.add("ogl_disabled"));
        } else 407 != id && 408 != id && (Util.addDom("div", {
            parent: actions,
            class: "material-icons ogl_button",
            child: "chevron_left",
            onclick: () => {
                this.levelOffset > 1 - this.initialLevel && (this.levelOffset--,
                    this.displayLevel(id, this.initialLevel + this.levelOffset, data, details));
            }
        }), Util.addDom("div", {
            parent: actions,
            class: "material-icons ogl_button",
            child: "close",
            onclick: () => {
                this.levelOffset = 0, this.displayLevel(id, this.initialLevel, data, details);
            }
        }), Util.addDom("div", {
            parent: actions,
            class: "material-icons ogl_button",
            child: "chevron_right",
            onclick: () => {
                this.levelOffset++, this.displayLevel(id, this.initialLevel + this.levelOffset, data, details);
            }
        })), Util.addDom("div", {
            parent: actions,
            class: "material-icons ogl_button",
            child: "format_list_bulleted_add",
            onclick: e => {
                if (0 <= this.levelOffset) {
                    e.target.classList.add("ogl_active"), this.todoData = {};
                    for (let i = this.initialLevel; i <= this.initialLevel + this.levelOffset; i++) {
                        var data = this.getTechData(id, i, this.ogl.currentPlanet.obj.id);
                        this.todoData[i] = {}, this.todoData[i].level = i, this.todoData[i].id = id,
                            this.todoData[i].metal = data.target.metal, this.todoData[i].crystal = data.target.crystal,
                            this.todoData[i].deut = data.target.deut;
                    }
                    this.addToTodolist(this.todoData);
                } else this.ogl._notification.addToQueue("Cannot lock previous levels", !1);
            }
        });
        this.displayLevel(id, this.initialLevel, data, details);
    }
    displayLevel(id, lvl, data, details) {
        let techData = this.getTechData(id, lvl, this.ogl.currentPlanet.obj.id), cumul = {};
        this.detailCumul[id] = this.detailCumul[id] || {}, this.detailCumul[id][lvl] = this.detailCumul[id][lvl] || {};
        for (var [costID, cost] of Object.entries(techData.target || {})) this.detailCumul[id][lvl][costID] = cost;
        for (var [cumulLvl, cumulCost] of Object.entries(this.detailCumul[id] || {})) cumulLvl >= this.initialLevel && cumulLvl <= this.initialLevel + this.levelOffset && Object.entries(cumulCost).forEach(entry => {
            "energy" == entry[0] || "population" == entry[0] ? cumul[entry[0]] = entry[1] : cumul[entry[0]] = (cumul[entry[0]] || 0) + entry[1];
        });
        unsafeWindow.technologyDetails && (technologyDetails.id = id, technologyDetails.lvl = lvl),
            this.ogl.db.options.debugMode && !details.querySelector("[data-debug]") && (details.querySelector(".build_duration time").setAttribute("data-debug", details.querySelector(".build_duration time").innerText),
                details.querySelector(".information .level") && details.querySelector(".information .level").setAttribute("data-debug", details.querySelector(".information .level").innerText),
                details.querySelector(".costs .metal") && details.querySelector(".costs .metal").setAttribute("data-debug", details.querySelector(".costs .metal").innerText),
                details.querySelector(".costs .crystal") && details.querySelector(".costs .crystal").setAttribute("data-debug", details.querySelector(".costs .crystal").innerText),
                details.querySelector(".costs .deuterium") && details.querySelector(".costs .deuterium").setAttribute("data-debug", details.querySelector(".costs .deuterium").innerText),
                details.querySelector(".costs .energy") && details.querySelector(".costs .energy").setAttribute("data-debug", details.querySelector(".costs .energy").innerText),
                details.querySelector(".costs .population") && details.querySelector(".costs .population").setAttribute("data-debug", details.querySelector(".costs .population").innerText),
                details.querySelector(".additional_energy_consumption .value") && details.querySelector(".additional_energy_consumption .value").setAttribute("data-debug", details.querySelector(".additional_energy_consumption .value").innerText),
                details.querySelector(".energy_production .value")) && details.querySelector(".energy_production .value").setAttribute("data-debug", details.querySelector(".energy_production .value").innerText);
        let costsWrapper = details.querySelector(".ogl_costsWrapper") || Util.addDom("div", {
            class: "ogl_costsWrapper",
            parent: details.querySelector(".costs")
        });
        costsWrapper.innerText = "", details.querySelector(".build_duration time").innerText = techData.target.timeresult,
            details.querySelector(".additional_energy_consumption .value") && ((element = details.querySelector(".additional_energy_consumption .value")).classList.add("tooltip"),
                217 == id && (techData.target.conso = parseInt(element.getAttribute("data-value")) * (lvl || 1)),
                element.setAttribute("title", Util.formatNumber(techData.target.conso)),
                element.innerHTML = Util.formatToUnits(techData.target.conso, !1, !0)),
            details.querySelector(".energy_production .value") && (details.querySelector(".energy_production .value").innerHTML = `<span class="bonus">+${Util.formatToUnits(techData.target.prodEnergy, !1, !0)}</span>`),
            details.querySelector(".information .level") && (details.querySelector(".information .level").innerHTML = lvl - 1 + ` <i class="material-icons">east</i> <b>${lvl}</b>`,
                this.ogl.currentPlanet.obj.todolist[id]?.[lvl] ? details.querySelector(".ogl_actions .ogl_button:last-child").classList.add("ogl_active") : details.querySelector(".ogl_actions .ogl_button:last-child").classList.remove("ogl_active")),
            details.querySelector(".required_population") && details.querySelector(".required_population span").setAttribute("data-formatted", Util.formatToUnits(details.querySelector(".required_population span").getAttribute("data-value"), 0).replace(/<[^>]+>/g, ""));
        var element = Util.addDom("div", {
            class: "ogl_icon",
            parent: costsWrapper
        });
        Util.addDom("div", {
            parent: element
        }), Util.addDom("div", {
            parent: element,
            child: Math.max(lvl, 1)
        }), details.querySelector(".build_amount") || 407 == id || 408 == id || Util.addDom("div", {
            parent: element,
            child: this.initialLevel - 1 + ' <i class="material-icons">east</i> ' + (this.initialLevel + this.levelOffset)
        }), Util.addDom("div", {
            parent: element,
            class: "material-icons",
            child: "globe"
        });
        let rawText;
        ["metal", "crystal", "deut", "energy", "population"].forEach(resource => {
            var diff, line;
            details.querySelector(".costs ." + resource.replace("deut", "deuterium")) && (diff = details.querySelector(".build_amount") ? (this.ogl.currentPlanet.obj[resource] || 0) - (techData.target[resource] || 0) : (this.ogl.currentPlanet.obj[resource] || 0) - (cumul[resource] || 0),
                line = Util.addDom("div", {
                    class: "ogl_icon ogl_" + resource,
                    parent: costsWrapper
                }), Util.addDom("div", {
                    class: "tooltip",
                    title: Util.formatNumber(techData.target[resource]),
                    parent: line,
                    child: Util.formatToUnits(techData.target[resource], 2)
                }), details.querySelector(".build_amount") || Util.addDom("div", {
                    parent: line,
                    class: "ogl_text tooltip",
                    title: Util.formatNumber(cumul[resource]),
                    child: Util.formatToUnits(cumul[resource], 2)
                }), diff < 0 ? Util.addDom("div", {
                    parent: line,
                    class: "ogl_danger tooltip",
                    title: Util.formatNumber(diff),
                    child: Util.formatToUnits(diff, 2)
                }) : Util.addDom("div", {
                    parent: line,
                    class: "ogl_ok material-icons",
                    child: "check"
                }), rawText = (rawText ? rawText + " | " : "") + Util.formatNumber(cumul[resource]) + " " + this.ogl._lang.find(resource));
        }), details.querySelector(".costs").addEventListener("click", () => {
            navigator.clipboard.writeText(rawText), fadeBox("Price copied");
        });
        var element = this.ogl.db.options.msu, msuline = Util.addDom("div", {
            class: "ogl_icon ogl_msu",
            parent: costsWrapper
        }), msu = Util.getMSU(techData.target.metal, techData.target.crystal, techData.target.deut, element), msu = (Util.addDom("div", {
            class: "tooltip",
            title: Util.formatNumber(msu),
            parent: msuline,
            child: Util.formatToUnits(msu, 2)
        }), Util.getMSU(cumul.metal, cumul.crystal, cumul.deut, element));
        details.querySelector(".build_amount") || Util.addDom("div", {
            parent: msuline,
            class: "ogl_text tooltip",
            title: Util.formatNumber(msu),
            child: Util.formatToUnits(msu, 2)
        }), initTooltips();
    }
    addToTodolist(data) {
        this.ogl.currentPlanet.obj.todolist = this.ogl.currentPlanet.obj.todolist || {},
            Object.values(data).forEach(entry => {
                var todolist = this.ogl.currentPlanet.obj.todolist, entryLvl = entry.level || Date.now() + performance.now();
                todolist[entry.id] = todolist[entry.id] || {}, todolist[entry.id][entryLvl] = todolist[entry.id][entryLvl] || {},
                    todolist[entry.id][entryLvl].id = entry.id, todolist[entry.id][entryLvl].amount = entry.amount || 0,
                    todolist[entry.id][entryLvl].level = entryLvl, todolist[entry.id][entryLvl].cost = {
                        metal: entry.metal,
                        crystal: entry.crystal,
                        deut: entry.deut
                    };
            }), this.checkTodolist();
    }
    checkTodolist() {
        document.querySelectorAll(".planetlink, .moonlink").forEach(planet => {
            let isMoon = planet.classList.contains("moonlink");
            var targetClass;
            isMoon ? planet.parentNode.querySelectorAll(".ogl_todoIcon.ogl_moon").forEach(i => i.remove()) : planet.parentNode.querySelectorAll(".ogl_todoIcon.ogl_planet").forEach(i => i.remove());
            let id = new URLSearchParams(planet.getAttribute("href")).get("cp").split("#")[0], len = 0, icon;
            Object.values(this.ogl.db.myPlanets[id]?.todolist || {}).forEach((building, index) => {
                0 == index && (icon = Util.addDom("div", {
                    class: "material-icons ogl_todoIcon",
                    child: "format_list_bulleted",
                    onclick: () => {
                        this.openTodolist(this.ogl.db.myPlanets[id].todolist, planet.parentNode.querySelector(".planet-koords").innerText + ":" + (isMoon ? 3 : 1), id);
                    }
                })), Object.values(building).forEach(line => {
                    len++, (line.cost?.metal || 0) + (line.cost?.crystal || 0) + (line.cost?.deut || 0) <= 0 && icon.classList.add("ogl_ok");
                });
            }), icon && (targetClass = isMoon ? "ogl_sideIconBottom" : "ogl_sideIconTop",
                targetClass = planet.parentNode.querySelector("." + targetClass) || Util.addDom("div", {
                    class: targetClass,
                    parent: planet.parentNode
                }), isMoon ? icon.classList.add("ogl_moon") : icon.classList.add("ogl_planet"),
                icon.setAttribute("data-list", len), targetClass.appendChild(icon));
        });
        let requireUpdate = !1;
        document.querySelectorAll(".technology[data-technology]").forEach(techDom => {
            let techID = techDom.getAttribute("data-technology"), techLvL = techDom.querySelector(".targetlevel") || techDom.querySelector(".level");
            techLvL && (techLvL = parseInt(techLvL.getAttribute("data-value")),
                Object.keys(this.ogl.currentPlanet.obj.todolist?.[techID] || {}).forEach(key => {
                    techLvL >= parseInt(key) && (delete this.ogl.currentPlanet.obj.todolist[techID][key],
                        Object.values(this.ogl.currentPlanet.obj.todolist[techID]).length < 1) && (delete this.ogl.currentPlanet.obj.todolist[techID],
                            requireUpdate = !0);
                }));
        }), requireUpdate && this.checkTodolist();
    }
    openTodolist(data, coords, id) {
        let toSend = {};
        coords = coords.split(":");
        let container = Util.addDom("div", {
            class: "ogl_todoList",
            child: `<h2>Todolist ${1 == coords[3] ? "planet" : "moon"} [${coords[0]}:${coords[1]}:${coords[2]}]</h2>`
        }), leftDiv = Util.addDom("div", {
            parent: container
        }), rightDiv = Util.addDom("div", {
            parent: container,
            class: "ogl_actions"
        }), totalReq = {}, totalSelected = {}, updateHeader = (blockData, header, content, footer, block) => {
            setTimeout(() => {
                var checkedCount = content.querySelectorAll("input:checked").length, maxCount = Object.keys(blockData).length;
                let blockID = Object.values(blockData)[0]?.id;
                maxCount ? (header.innerHTML = this.ogl.db.serverData[blockID],
                    header.innerHTML += ` (<b>${checkedCount}</b>/${maxCount})`, checkedCount != maxCount && footer && footer.querySelector("input:checked") && (footer.querySelector("input:checked").checked = !1),
                    0 < Object.entries(toSend).length ? sendButton.classList.remove("ogl_disabled") : sendButton.classList.add("ogl_disabled"),
                    updateTotal()) : (block.remove(), Object.keys(toSend).filter(k => k.startsWith(blockID + "_")).forEach(k => delete toSend[k]),
                        delete this.ogl.db.myPlanets[id].todolist[blockID], this.checkTodolist());
            });
        }, updateTotal = () => {
            totalDiv.innerHTML = `
                <div class="ogl_grid">
                    <div class="ogl_icon"><div class="material-icons">sigma</div><div>Required</div><div>Selected</div></div>
                    <div class="ogl_icon ogl_metal"><div>${Util.formatToUnits(totalReq.metal || 0)}</div><div>${Util.formatToUnits(totalSelected.metal || 0)}</div></div>
                    <div class="ogl_icon ogl_crystal"><div>${Util.formatToUnits(totalReq.crystal || 0)}</div><div>${Util.formatToUnits(totalSelected.crystal || 0)}</div></div>
                    <div class="ogl_icon ogl_deut"><div>${Util.formatToUnits(totalReq.deut || 0)}</div><div>${Util.formatToUnits(totalSelected.deut || 0)}</div></div>
                </div>
            `;
        }, updateFooter = (footer, content, cumul) => {
            setTimeout(() => {
                footer.innerHTML = "";
                var line = Util.addDom("div", {
                    class: "ogl_line ogl_blockRecap",
                    parent: footer,
                    child: `
                    <div>all</div>
                    <div class="ogl_icon ogl_metal">${Util.formatToUnits(cumul.metal, 2)}</div>
                    <div class="ogl_icon ogl_crystal">${Util.formatToUnits(cumul.crystal, 2)}</div>
                    <div class="ogl_icon ogl_deut">${Util.formatToUnits(cumul.deut, 2)}</div>
                    <label></label>
                `
                });
                let input = Util.addDom("input", {
                    type: "checkbox",
                    parent: line.querySelector("label"),
                    oninput: () => {
                        input.checked ? content.querySelectorAll("input").forEach(input => {
                            1 != input.checked && input.click();
                        }) : content.querySelectorAll("input").forEach(input => {
                            1 == input.checked && input.click();
                        });
                    }
                });
                Util.addDom("button", {
                    class: "material-icons",
                    parent: line,
                    child: "cube-send",
                    onclick: () => {
                        content.querySelectorAll("input").forEach(input => {
                            1 != input.checked && input.click();
                        }), setTimeout(() => container.querySelector(".ogl_button").click(), 50);
                    }
                }), Util.addDom("button", {
                    class: "material-icons ogl_removeTodo",
                    parent: line,
                    child: "close",
                    onclick: () => {
                        content.querySelectorAll(".ogl_removeTodo").forEach(button => {
                            button.click();
                        }), setTimeout(() => updateTotal(), 10);
                    }
                });
            });
        }, url = (Object.values(data).forEach(blockData => {
            let block = Util.addDom("div", {
                class: "ogl_tech",
                parent: leftDiv
            }), header = Util.addDom("h3", {
                parent: block,
                onclick: () => block.classList.toggle("ogl_active")
            }), content = Util.addDom("div", {
                parent: block
            }), footer = Util.addDom("footer", {
                parent: block
            }), cumul = {};
            Object.values(blockData).forEach(todo => {
                var displayedCell = todo.amount || todo.level;
                let key = todo.id + "_" + todo.level, line = Util.addDom("div", {
                    class: "ogl_line",
                    "data-parent": this.ogl.db.serverData[todo.id],
                    parent: content,
                    child: `
                    <div>${displayedCell}</div><div class="ogl_icon ogl_metal">${Util.formatToUnits(todo.cost?.metal, 2)}</div>
                    <div class="ogl_icon ogl_crystal">${Util.formatToUnits(todo.cost?.crystal, 2)}</div>
                    <div class="ogl_icon ogl_deut">${Util.formatToUnits(todo.cost?.deut, 2)}</div>
                    <label></label>
                `
                }), input = (cumul.metal = (cumul.metal || 0) + (todo.cost?.metal || 0),
                    cumul.crystal = (cumul.crystal || 0) + (todo.cost?.crystal || 0),
                    cumul.deut = (cumul.deut || 0) + (todo.cost?.deut || 0), totalReq.metal = (totalReq.metal || 0) + (todo.cost?.metal || 0),
                    totalReq.crystal = (totalReq.crystal || 0) + (todo.cost?.crystal || 0),
                    totalReq.deut = (totalReq.deut || 0) + (todo.cost?.deut || 0), Util.addDom("input", {
                        type: "checkbox",
                        parent: line.querySelector("label"),
                        oninput: () => {
                            input.checked ? (toSend[key] = todo, input.setAttribute("data-clicked", performance.now()),
                                totalSelected.metal = (totalSelected.metal || 0) + (todo.cost?.metal || 0),
                                totalSelected.crystal = (totalSelected.crystal || 0) + (todo.cost?.crystal || 0),
                                totalSelected.deut = (totalSelected.deut || 0) + (todo.cost?.deut || 0)) : (delete toSend[key],
                                    input.removeAttribute("data-clicked"), totalSelected.metal = (totalSelected.metal || 0) - (todo.cost?.metal || 0),
                                    totalSelected.crystal = (totalSelected.crystal || 0) - (todo.cost?.crystal || 0),
                                    totalSelected.deut = (totalSelected.deut || 0) - (todo.cost?.deut || 0)),
                                leftDiv.querySelectorAll("label").forEach(e => e.removeAttribute("data-order")),
                                Array.from(leftDiv.querySelectorAll(".ogl_tech > div input:checked")).sort((a, b) => a.getAttribute("data-clicked") - b.getAttribute("data-clicked")).forEach((e, index) => {
                                    e.parentNode.setAttribute("data-order", index + 1);
                                }), updateHeader(blockData, header, content, footer, block);
                        }
                    }));
                Util.addDom("button", {
                    class: "material-icons",
                    parent: line,
                    child: "cube-send",
                    onclick: () => {
                        input.click(), setTimeout(() => container.querySelector(".ogl_button").click(), 50);
                    }
                }), Util.addDom("button", {
                    class: "material-icons ogl_removeTodo",
                    parent: line,
                    child: "close",
                    onclick: () => {
                        line.remove(), cumul.metal = (cumul.metal || 0) - (todo.cost?.metal || 0),
                            cumul.crystal = (cumul.crystal || 0) - (todo.cost?.crystal || 0),
                            cumul.deut = (cumul.deut || 0) - (todo.cost?.deut || 0),
                            totalSelected.metal = (totalSelected.metal || 0) - (todo.cost?.metal || 0),
                            totalSelected.crystal = (totalSelected.crystal || 0) - (todo.cost?.crystal || 0),
                            totalSelected.deut = (totalSelected.deut || 0) - (todo.cost?.deut || 0),
                            delete toSend[key], delete this.ogl.db.myPlanets[id].todolist[todo.id][todo.level],
                            Object.keys(this.ogl.db.myPlanets[id].todolist[todo.id] || {}).length <= 0 && (delete this.ogl.db.myPlanets[id].todolist[todo.id],
                                block.remove()), Object.keys(ogl.db.myPlanets[id].todolist || {}).length <= 0 && (this.ogl.db.myPlanets[id].todolist = {},
                                    this.ogl._popup.close()), Array.from(leftDiv.querySelectorAll(".ogl_tech > div input:checked")).sort((a, b) => a.getAttribute("data-clicked") - b.getAttribute("data-clicked")).forEach((e, index) => {
                                        e.parentNode.setAttribute("data-order", index + 1);
                                    }), unsafeWindow.technologyDetails && id == this.ogl.currentPlanet.obj.id && document.querySelector("#technologydetails .ogl_actions .ogl_active") && document.querySelector("#technologydetails .ogl_actions .ogl_active").classList.remove("ogl_active"),
                            updateHeader(blockData, header, content, footer, block),
                            updateFooter(footer, content, cumul), this.checkTodolist();
                    }
                });
            }), updateHeader(blockData, header, content, footer, block), updateFooter(footer, content, cumul);
        }), `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&oglmode=3&targetid=${id}&type=` + coords[3]), sendButton = Util.addDom("button", {
            class: "ogl_button ogl_disabled",
            parent: rightDiv,
            child: 'Send selection <i class="material-icons">cube-send</i>',
            onclick: () => {
                this.ogl.cache.toSend = Object.values(toSend), substractButton.querySelector("input").checked && (url += "&substractMode=true"),
                    window.location.href = url, rightDiv.querySelectorAll(".ogl_button").forEach(e => e.classList.add("ogl_disabled"));
            }
        }), substractButton = (Util.addDom("button", {
            class: "ogl_button",
            parent: rightDiv,
            child: 'Send all <i class="material-icons">cube-send</i>',
            onclick: () => {
                leftDiv.querySelectorAll("input").forEach(input => {
                    1 != input.checked && input.click();
                }), setTimeout(() => {
                    this.ogl.cache.toSend = Object.values(toSend), rightDiv.querySelectorAll(".ogl_button").forEach(e => e.classList.add("ogl_disabled")),
                        substractButton.querySelector("input").checked && (url += "&substractMode=true"),
                        window.location.href = url;
                }, 100);
            }
        }), Util.addDom("button", {
            class: "ogl_button ogl_removeTodo",
            parent: rightDiv,
            child: 'Remove all <i class="material-icons">close</i>',
            onclick: () => {
                this.ogl.db.myPlanets[id].todolist = {}, this.ogl._popup.close(),
                    this.checkTodolist(), unsafeWindow.technologyDetails && id == this.ogl.currentPlanet.obj.id && document.querySelector("#technologydetails .ogl_actions .ogl_active") && document.querySelector("#technologydetails .ogl_actions .ogl_active").classList.remove("ogl_active");
            }
        }), Util.addDom("label", {
            class: "ogl_button",
            parent: rightDiv,
            child: '<input type="checkbox">Substract planet resources'
        })), totalDiv = Util.addDom("div", {
            class: "ogl_totalRequired",
            parent: rightDiv
        });
        this.ogl._popup.open(container);
    }
    getTechData(id, level, planetID) {
        if (id) {
            var data = Datafinder.getTech(id), planetData = this.ogl.db.myPlanets[planetID] || {};
            let baseLabs = [], bestLabs = 0, labRequired = {
                113: 1,
                120: 1,
                121: 4,
                114: 7,
                122: 4,
                115: 1,
                117: 2,
                118: 7,
                106: 3,
                108: 1,
                124: 3,
                123: 10,
                199: 12,
                109: 4,
                110: 6,
                111: 2
            };
            document.querySelectorAll(".smallplanet").forEach(line => {
                var line = line.getAttribute("id").replace("planet-", ""), colo = this.ogl.db.myPlanets[line];
                colo && planetID != line && colo[31] >= labRequired[id] && baseLabs.push(colo[31]);
            }), baseLabs.sort((a, b) => b - a), (baseLabs = baseLabs.slice(0, Math.min(baseLabs.length, planetData[123]))).length && (bestLabs = baseLabs.reduce((a, b) => a + b));
            var planet = {}, tech = (planet.lifeform = planetData.lifeform || 0,
                this.totalLab = (planetData[31] || 0) + bestLabs, {}), data = (tech.id = id,
                    tech.isBaseBuilding = tech.id < 100, tech.isBaseResearch = 100 < tech.id && tech.id <= 199,
                    tech.isBaseShip = 200 < tech.id && tech.id <= 299, tech.isBaseDef = 400 < tech.id && tech.id <= 599,
                    tech.isLfBuilding = 11100 < tech.id && tech.id <= 11199 || 12100 < tech.id && tech.id <= 12199 || 13100 < tech.id && tech.id <= 13199 || 14100 < tech.id && tech.id <= 14199,
                    tech.isLfResearch = 11200 < tech.id && tech.id <= 11299 || 12200 < tech.id && tech.id <= 12299 || 13200 < tech.id && tech.id <= 13299 || 14200 < tech.id && tech.id <= 14299,
                    tech.base = {}, tech.base.metal = data.metal || 0, tech.base.crystal = data.crystal || 0,
                    tech.base.deut = data.deut || 0, tech.base.energy = data.energy || 0,
                    tech.base.duration = data.durationbase || 0, tech.base.conso = data.conso || 0,
                    tech.base.population = data.bonus1BaseValue || 0, tech.factor = {},
                    tech.factor.price = data.priceFactor || 2, tech.factor.duration = data.durationfactor || 2,
                    tech.factor.energy = data.energyFactor || data.energyIncreaseFactor || 2,
                    tech.factor.population = data.bonus1IncreaseFactor || 2, tech.bonus = {},
                    tech.bonus.price = 0, tech.bonus.duration = 0, tech.bonus.classDuration = 0,
                    tech.bonus.eventDuration = 0, tech.bonus.technocrat = 0, tech.bonus.engineer = 0,
                    tech.bonus.conso = 0, tech.bonus.prodEnergy = 0, 1 == this.ogl.account.class && (tech.bonus.prodEnergy += .1),
                    2 == this.ogl.db.allianceClass && (tech.bonus.prodEnergy += .05), 2 == planet.lifeform ? (tech.bonus.prodEnergy += planetData[12107] * Datafinder.getTech(12107).bonus1BaseValue / 100,
                        tech.bonus.conso += planetData[12107] * Datafinder.getTech(12107).bonus2BaseValue / 100,
                        tech.isLfBuilding && (tech.bonus.price += planetData[12108] * Datafinder.getTech(12108).bonus1BaseValue / 100,
                            tech.bonus.duration += planetData[12108] * Datafinder.getTech(12108).bonus2BaseValue / 100)) : 3 == planet.lifeform && (tech.bonus.prodEnergy += planetData[13107] * Datafinder.getTech(13107).bonus1BaseValue / 100,
                                tech.isBaseShip || tech.isBaseDef) && (tech.bonus.duration += planetData[13106] * Datafinder.getTech(13106).bonus1BaseValue / 100),
                    tech.isBaseResearch && document.querySelector(".technology .acceleration") && (tech.bonus.eventDuration += parseInt(document.querySelector(".technology .acceleration").getAttribute("data-value")) / 100),
                    tech.isBaseResearch && 3 == this.ogl.account.class && (tech.bonus.classDuration += .25 * (1 + (this.ogl.db.lfBonuses?.Characterclasses3?.bonus || 0) / 100)),
                    tech.isBaseResearch && document.querySelector("#officers .technocrat.on") && (tech.bonus.technocrat += .25),
                    document.querySelector("#officers .engineer.on") && (tech.bonus.engineer += .1),
                    tech.isLfResearch && (1 == planet.lifeform ? (tech.bonus.price += planetData[11103] * Datafinder.getTech(11103).bonus1BaseValue / 100,
                        tech.bonus.duration += planetData[11103] * Datafinder.getTech(11103).bonus2BaseValue / 100) : 2 == planet.lifeform ? (tech.bonus.price += planetData[12103] * Datafinder.getTech(12103).bonus1BaseValue / 100,
                            tech.bonus.duration += planetData[12103] * Datafinder.getTech(12103).bonus2BaseValue / 100) : 3 == planet.lifeform ? (tech.bonus.price += planetData[13103] * Datafinder.getTech(13103).bonus1BaseValue / 100,
                                tech.bonus.duration += planetData[13103] * Datafinder.getTech(13103).bonus2BaseValue / 100) : 4 == planet.lifeform && (tech.bonus.price += planetData[14103] * Datafinder.getTech(14103).bonus1BaseValue / 100,
                                    tech.bonus.duration += planetData[14103] * Datafinder.getTech(14103).bonus2BaseValue / 100),
                        tech.bonus.price += (this.ogl.db.lfBonuses?.LfResearch?.cost || 0) / 100,
                        tech.bonus.duration += (this.ogl.db.lfBonuses?.LfResearch?.duration || 0) / 100),
                    2 != planet.lifeform || 1 != tech.id && 2 != tech.id && 3 != tech.id && 4 != tech.id && 12 != tech.id && 12101 != tech.id && 12102 != tech.id || (tech.bonus.price += planetData[12111] * Datafinder.getTech(12111).bonus1BaseValue / 100),
                    (tech.isBaseResearch || tech.isBaseDef || tech.isBaseShip) && (tech.bonus.price += (this.ogl.db.lfBonuses?.[tech.id]?.cost || 0) / 100,
                        tech.bonus.duration += (this.ogl.db.lfBonuses?.[tech.id]?.duration || 0) / 100),
                    tech.target = {}, tech.isBaseBuilding || tech.isBaseResearch ? (data = Math.floor(tech.base.metal * Math.pow(tech.factor.price, level - 1)),
                        planet = Math.floor(tech.base.crystal * Math.pow(tech.factor.price, level - 1)),
                        rawDeut = Math.floor(tech.base.deut * Math.pow(tech.factor.price, level - 1)),
                        tech.target.metal = Math.floor(data * (1 - tech.bonus.price)), tech.target.crystal = Math.floor(planet * (1 - tech.bonus.price)),
                        tech.target.deut = Math.floor(rawDeut * (1 - tech.bonus.price)), tech.target.energy = Math.floor(tech.base.energy * Math.pow(tech.factor.energy, level - 1)),
                        1 != tech.id && 2 != tech.id || (tech.target.conso = Math.ceil(10 * level * Math.pow(1.1, level)) - Math.ceil(10 * (level - 1) * Math.pow(1.1, level - 1))),
                        3 == tech.id && (tech.target.conso = Math.ceil(20 * level * Math.pow(1.1, level)) - Math.ceil(20 * (level - 1) * Math.pow(1.1, level - 1))),
                        4 == tech.id && (tech.target.prodEnergy = Math.floor(20 * level * Math.pow(1.1, level)) - Math.floor(20 * (level - 1) * Math.pow(1.1, level - 1))),
                        12 == tech.id && (tech.target.prodEnergy = Math.floor(30 * level * Math.pow(1.05 + .01 * (planetData[113] || 0), level)) - Math.floor(30 * (level - 1) * Math.pow(1.05 + .01 * (planetData[113] || 0), level - 1))),
                        tech.target.duration = tech.isBaseBuilding ? (data + planet) / (2500 * Math.max(41 == id || 42 == id || 43 == id || 15 == id ? 1 : 4 - level / 2, 1) * (1 + (14 == id ? this.initialLevel + this.levelOffset - 1 : planetData[14]) || 0) * Math.pow(2, (15 == id ? this.initialLevel + this.levelOffset - 1 : planetData[15]) || 0)) * 3600 * 1e3 : (data + planet) / (1e3 * (1 + (planetData[31] || 0) + bestLabs)) * 3600 * 1e3) : tech.isLfBuilding || tech.isLfResearch ? (tech.target.metal = Math.floor(Math.floor(tech.base.metal * Math.pow(tech.factor.price, level - 1) * level) * (1 - tech.bonus.price)),
                            tech.target.crystal = Math.floor(Math.floor(tech.base.crystal * Math.pow(tech.factor.price, level - 1) * level) * (1 - tech.bonus.price)),
                            tech.target.deut = Math.floor(Math.floor(tech.base.deut * Math.pow(tech.factor.price, level - 1) * level) * (1 - tech.bonus.price)),
                            tech.target.energy = Math.floor(Math.floor(level * tech.base.energy * Math.pow(tech.factor.energy, level) * (1 - tech.bonus.price))),
                            tech.target.population = Math.floor(Math.floor(tech.base.population * Math.pow(tech.factor.population, level - 1) * (1 - tech.bonus.price))),
                            tech.target.conso = level < 2 ? Math.floor(level * tech.base.energy) : Math.floor(Math.floor(level * tech.base.energy * Math.pow(tech.factor.energy, level) - (level - 1) * tech.base.energy * Math.pow(tech.factor.energy, level - 1))),
                            tech.target.duration = tech.isLfBuilding ? Math.floor(level * tech.base.duration * 1e3 * (1 / ((1 + (planetData[14] || 0)) * Math.pow(2, planetData[15] || 0))) * Math.pow(tech.factor.duration, level)) : Math.floor(level * tech.base.duration * 1e3 * Math.pow(tech.factor.duration, level))) : (tech.isBaseShip || tech.isBaseDef) && (tech.target.metal = tech.base.metal * (rawDeut = level || 1),
                                tech.target.crystal = tech.base.crystal * rawDeut, tech.target.deut = tech.base.deut * rawDeut,
                                tech.target.duration = (tech.base.metal + tech.base.crystal) / 5e3 * (2 / (1 + planetData[21] || 0)) * Math.pow(.5, planetData[15] || 0) * 3600 * 1e3,
                                212 == tech.id) && (tech.target.prodEnergy = Math.floor(((planetData.temperature + 40 + planetData.temperature) / 2 + 160) / 6) * rawDeut),
                    this.ogl.db.options.debugMode && console.log(JSON.parse(JSON.stringify(tech))),
                    tech.target.prodEnergy = Math.floor(tech.target.prodEnergy * (1 + tech.bonus.prodEnergy + tech.bonus.engineer)) || 0,
                    tech.target.conso = -Math.ceil(tech.target.conso * (1 - tech.bonus.conso)) || 0,
                    tech.target.duration = tech.target.duration / (this.ogl.server.economySpeed * (tech.isBaseResearch ? this.ogl.db.serverData.researchSpeed : 1)) * (1 - tech.bonus.eventDuration) * (1 - tech.bonus.classDuration) * (1 - tech.bonus.technocrat) * (1 - Math.min(tech.bonus.duration, .99)),
                    tech.target.duration = Math.max(tech.target.duration, 1e3), (tech.isBaseShip || tech.isBaseDef) && (tech.target.duration = 1e3 * Math.floor(tech.target.duration / 1e3),
                        tech.target.duration = Math.max(tech.target.duration, 1e3) * (level || 1)),
                    tech.target.duration / 1e3), planet = Math.floor(data / 604800), planetData = Math.floor(data % 604800 / 86400), rawDeut = Math.floor(data % 86400 / 3600), level = Math.floor(data % 3600 / 60), data = Math.floor(data % 60);
            let displayed = 0;
            return tech.target.timeresult = "", 0 < planet && displayed < 3 && (tech.target.timeresult += "" + planet + LocalizationStrings.timeunits.short.week + " ",
                displayed++), 0 < planetData && displayed < 3 && (tech.target.timeresult += "" + planetData + LocalizationStrings.timeunits.short.day + " ",
                    displayed++), 0 < rawDeut && displayed < 3 && (tech.target.timeresult += "" + rawDeut + LocalizationStrings.timeunits.short.hour + " ",
                        displayed++), 0 < level && displayed < 3 && (tech.target.timeresult += "" + level + LocalizationStrings.timeunits.short.minute + " ",
                            displayed++), 0 < data && displayed < 3 && (tech.target.timeresult += "" + data + LocalizationStrings.timeunits.short.second,
                                displayed++), tech;
        }
    }
    checkProductionBoxes() {
        this.ogl.currentPlanet.obj.upgrades = this.ogl.currentPlanet.obj.upgrades || {},
            Object.entries(this.ogl._time.productionBoxes).forEach(box => {
                if (document.querySelector(`#${box[1]} time`)) {
                    let techType = "productionboxbuildingcomponent" == box[1] ? "baseBuilding" : "productionboxresearchcomponent" == box[1] ? "baseResearch" : "productionboxshipyardcomponent" == box[1] ? "ship" : "productionboxlfbuildingcomponent" == box[1] ? "lfBuilding" : "productionboxlfresearchcomponent" == box[1] ? "lfResearch" : "productionboxextendedshipyardcomponent" == box[1] ? "mechaShip" : "unknown", coords = document.querySelector(`#${[box[1]]} .first .queuePic`).parentNode.getAttribute("onclick")?.match(/[([0-9:]+]/)?.[0]?.slice(1, -1), itemEndTime = 0, len = document.querySelectorAll(`#${[box[1]]} .queuePic`).length;
                    document.querySelectorAll(`#${[box[1]]} .queuePic`).forEach((item, index) => {
                        var id = new URLSearchParams(item.parentNode.href).get("openTech") || item.parentNode?.getAttribute("onclick")?.match(/([0-9]+)/)[0];
                        if (id) {
                            var item = item.closest(".first")?.parentNode?.querySelector(".level")?.innerText.match(/\d+/)[0] || item.closest(".first")?.querySelector(".shipSumCount")?.innerText || item.parentNode.innerText, data = this.getTechData(id, item, this.ogl.currentPlanet.obj.id), data = 0 == index ? 1e3 * parseInt(document.querySelector(`#${[box[1]]} time.countdown`).getAttribute("data-end")) || serverTime.getTime() + data.target.duration : data.target.duration;
                            if (itemEndTime += data, 0 == index) {
                                var data = this.ogl._time.getObj(itemEndTime), div = document.querySelector(`#${[box[1]]} .content`), data = this.ogl.db.options.useClientTime ? data.client : data.server, data = (div.classList.add("ogl_" + techType),
                                    `<span>${new Date(data).toLocaleDateString("de-DE", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    })}</span>
                        ` + new Date(data).toLocaleTimeString("de-DE"));
                                Util.addDom("time", {
                                    class: "ogl_timeBox",
                                    prepend: div.querySelector(".build-faster").parentNode,
                                    child: data
                                }), "baseResearch" == techType && ((div = {}).name = this.ogl.db.serverData[id] || id,
                                    div.lvl = item, div.end = itemEndTime, div.type = techType,
                                    coords && coords != this.ogl.currentPlanet.obj.coords ? (data = Object.values(this.ogl.db.myPlanets).find(e => e.coords == coords && "planet" == e.type).id,
                                        this.ogl.db.myPlanets[data].upgrades = this.ogl.db.myPlanets[data].upgrades || [],
                                        this.ogl.db.myPlanets[data].upgrades[techType] = [div]) : coords == this.ogl.currentPlanet.obj.coords && "moon" != this.ogl.currentPlanet.obj.type && (this.ogl.currentPlanet.obj.upgrades = this.ogl.currentPlanet.obj.upgrades || [],
                                            this.ogl.currentPlanet.obj.upgrades[techType] = [div]));
                            } else if (index == len - 1) {
                                let timeObj = this.ogl._time.getObj(itemEndTime), div = document.querySelector(`#${[box[1]]} .content`), endDate = this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server, content = (div.classList.add("ogl_" + techType),
                                    `<span>${new Date(endDate).toLocaleDateString("de-DE", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    })}</span>
                        ` + new Date(endDate).toLocaleTimeString("de-DE"));
                                Util.addDom("time", {
                                    class: "ogl_timeBox",
                                    parent: div,
                                    child: content
                                });
                            }
                        }
                    });
                }
            });
    }
}

class StatsManager extends Manager {
    load() {
        this.ogl.db.stats = this.ogl.db.stats || {}, this.types = ["raid", "expe", "discovery", "debris", "debris16", "blackhole"],
            this.data = {}, this.miniStats();
    }
    getKey(time) {
        time = new Date(time);
        return `${time.getFullYear()}-${time.getMonth() + 1}-` + time.getDate();
    }
    getKeyDay(oldKey, newDay) {
        oldKey = new Date(oldKey);
        return this.getKey(new Date(oldKey.getFullYear(), oldKey.getMonth(), newDay, 0, 0, 0));
    }
    getKeysPrevMonth(oldKey) {
        oldKey = new Date(oldKey);
        return [this.getKey(new Date(oldKey.getFullYear(), oldKey.getMonth() - 1, 1, 0, 0, 0)), this.getKey(new Date(oldKey.getFullYear(), oldKey.getMonth(), 0, 23, 59, 59))];
    }
    getKeysNextMonth(oldKey) {
        oldKey = new Date(oldKey);
        return [this.getKey(new Date(oldKey.getFullYear(), oldKey.getMonth() + 1, 1, 0, 0, 0)), this.getKey(new Date(oldKey.getFullYear(), oldKey.getMonth() + 2, 0, 23, 59, 59))];
    }
    getDayStats(time) {
        time = this.getKey(time);
        return this.ogl.db.stats[time] = this.ogl.db.stats[time] || {}, this.ogl.db.stats[time];
    }
    getData(key) {
        let data = this.ogl.db.stats[key], ids = ["metal", "crystal", "deut", "dm", "artefact", "blackhole", 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 217, 218, 219, 401, 402, 403, 404, 405, 406, 407, 408], result = {
            total: {
                metal: 0,
                crystal: 0,
                deut: 0,
                dm: 0,
                artefact: 0,
                msu: 0
            },
            expe: {},
            raid: {}
        };
        this.types.forEach(type => {
            result[type] = result[type] || {};
            for (let [gainID, amount] of Object.entries(data?.[type]?.gain || {})) {
                var shipData, shipFactor, sign;
                -1 < ids.findIndex(e => e == gainID || e == -gainID) && (isNaN(gainID) ? (result.total[gainID] = (result.total[gainID] || 0) + amount,
                    "raid" != type && "debris" != type || (result.raid[gainID] = (result.raid[gainID] || 0) + amount),
                    "expe" != type && "debris16" != type && "blackhole" != type || (result.expe[gainID] = (result.expe[gainID] || 0) + amount)) : (shipData = Datafinder.getTech(Math.abs(gainID)),
                        shipFactor = "expe" == type && 0 < parseInt(gainID) ? this.ogl.db.options.expeditionShipRatio / 100 : 1,
                        (sign = 0 < parseInt(gainID) ? 1 : -1) < 0 && ("expe" == type || "blackhole" == type) && this.ogl.db.options.ignoreExpeShipsLoss || (result.total.metal = (result.total.metal || 0) + (shipData.metal || 0) * amount * shipFactor * sign,
                            result.total.crystal = (result.total.crystal || 0) + (shipData.crystal || 0) * amount * shipFactor * sign,
                            result.total.deut = (result.total.deut || 0) + (shipData.deut || 0) * amount * shipFactor * sign,
                            "expe" != type && "blackhole" != type || (result.expeShip = result.expeShip || {},
                                result.expeShip[Math.abs(gainID)] = (result.expeShip[Math.abs(gainID)] || 0) + amount * sign),
                            "raid" != type && "debris" != type || (result.raid.metal = (result.raid.metal || 0) + (shipData.metal || 0) * amount * shipFactor * sign,
                                result.raid.crystal = (result.raid.crystal || 0) + (shipData.crystal || 0) * amount * shipFactor * sign,
                                result.raid.deut = (result.raid.deut || 0) + (shipData.deut || 0) * amount * shipFactor * sign),
                            "expe" != type && "debris16" != type && "blackhole" != type) || (result.expe.metal = (result.expe.metal || 0) + (shipData.metal || 0) * amount * shipFactor * sign,
                                result.expe.crystal = (result.expe.crystal || 0) + (shipData.crystal || 0) * amount * shipFactor * sign,
                                result.expe.deut = (result.expe.deut || 0) + (shipData.deut || 0) * amount * shipFactor * sign)));
            }
            for (var [typeID, amount] of Object.entries(data?.[type]?.occurence || {})) result[type + "Occurence"] = result[type + "Occurence"] || {},
                result[type + "Occurence"][typeID] = (result[type + "Occurence"][typeID] || 0) + amount;
            result[type].count = (result[type].count || 0) + (data?.[type]?.count || 0);
        }), result.conso = (result.conso || 0) + (data?.conso || 0), this.ogl.db.options.ignoreConsumption || (result.total.deut -= result.conso);
        key = this.ogl.db.options.msu;
        return result.total.msu = Util.getMSU(result.total.metal, result.total.crystal, result.total.deut, key),
            result.expe.msu = Util.getMSU(result.expe.metal, result.expe.crystal, result.expe.deut, key),
            result.raid.msu = Util.getMSU(result.raid.metal, result.raid.crystal, result.raid.deut, key),
            result;
    }
    miniStats() {
        var now = serverTime, startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0), now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59), data = this.getData(this.getKey(startDate.getTime())), startDate = (this.miniDiv || (this.miniDiv = Util.addDom("div", {
            class: "ogl_miniStats ogl_ogameDiv",
            parent: document.querySelector("#links"),
            onclick: event => {
                event.target.classList.contains("ogl_blackHoleButton") || Util.runAsync(() => this.buildStats()).then(e => this.ogl._popup.open(e, !0));
            }
        })), this.miniDiv.innerText = "", new Date(startDate).toLocaleString("default", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })), now = new Date(now).toLocaleString("default", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }), startDate = startDate == now ? startDate : startDate + "&#10140;<br>" + now;
        Util.addDom("h3", {
            class: "ogl_header",
            child: startDate,
            parent: this.miniDiv
        });
        let content = Util.addDom("div", {
            parent: this.miniDiv
        });
        Object.entries(data.total).forEach(entry => {
            Util.addDom("div", {
                class: "ogl_icon ogl_" + entry[0],
                parent: content,
                child: `<span>${Util.formatToUnits(entry[1], 1, !0)}</span>`
            });
        });
    }
    buildStats(keyStart, keyEnd) {
        let now = serverTime;
        keyStart = keyStart || this.getKey(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime()),
            keyEnd = keyEnd || this.getKey(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime());
        var dayEnd = new Date(keyEnd), monthEnd = new Date(dayEnd.getFullYear(), dayEnd.getMonth() + 1, 0, 23, 59, 59), dayEnd = Util.addDom("div", {
            class: "ogl_stats"
        }), month = Util.addDom("div", {
            parent: dayEnd,
            class: "ogl_statsMonth"
        });
        Util.addDom("div", {
            parent: month,
            class: "ogl_button",
            child: LocalizationStrings?.timeunits?.short?.day || "D",
            onclick: () => {
                Util.runAsync(() => this.buildStats()).then(e => this.ogl._popup.open(e, !0));
            }
        }), Util.addDom("div", {
            parent: month,
            class: "ogl_button",
            child: LocalizationStrings?.timeunits?.short?.week || "W",
            onclick: () => {
                let currentMonthStart = this.getKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0).getTime()), currentMonthEnd = this.getKey(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime());
                Util.runAsync(() => this.buildStats(currentMonthStart, currentMonthEnd)).then(e => this.ogl._popup.open(e, !0));
            }
        }), Util.addDom("div", {
            parent: month,
            class: "ogl_button",
            child: LocalizationStrings?.timeunits?.short?.month || "M",
            onclick: () => {
                let currentMonthStart = this.getKey(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).getTime()), currentMonthEnd = this.getKey(new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime());
                Util.runAsync(() => this.buildStats(currentMonthStart, currentMonthEnd)).then(e => this.ogl._popup.open(e, !0));
            }
        }), Util.addDom("div", {
            parent: month,
            class: "ogl_button",
            child: "All",
            onclick: () => {
                var initialTime = new Date(this.ogl.db.initialTime);
                let currentMonthStart = this.getKey(new Date(initialTime.getFullYear(), initialTime.getMonth(), initialTime.getDate(), 0, 0, 0).getTime()), currentMonthEnd = this.getKey(new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime());
                Util.runAsync(() => this.buildStats(currentMonthStart, currentMonthEnd)).then(e => this.ogl._popup.open(e, !0));
            }
        }), Util.addDom("div", {
            parent: month,
            class: "ogl_separator"
        }), Util.addDom("div", {
            parent: month,
            class: "ogl_button material-icons",
            child: "arrow-left-thick",
            onclick: () => {
                let prevMonth = this.getKeysPrevMonth(keyEnd);
                Util.runAsync(() => this.buildStats(prevMonth[0], prevMonth[1])).then(e => this.ogl._popup.open(e, !0));
            }
        }), Util.addDom("div", {
            parent: month,
            child: monthEnd.toLocaleString("default", {
                month: "short",
                year: "numeric"
            })
        }), Util.addDom("div", {
            parent: month,
            class: "ogl_button material-icons",
            child: "arrow-right-thick",
            onclick: () => {
                let nextMonth = this.getKeysNextMonth(keyEnd);
                Util.runAsync(() => this.buildStats(nextMonth[0], nextMonth[1])).then(e => this.ogl._popup.open(e, !0));
            }
        });
        let first, initial, reset = () => {
            initial && dateBar && (dateBar.querySelectorAll("[data-day]").forEach(e => e.classList.remove("ogl_selected")),
                initial.forEach(e => e.classList.add("ogl_selected")));
        };
        var dataset = [];
        let subDataset = [], bars = [], dateBar = Util.addDom("div", {
            parent: dayEnd,
            class: "ogl_dateBar",
            onmouseup: () => {
                this.isMoving = !1;
                var selected = dateBar.querySelectorAll("[data-day].ogl_selected");
                if (!selected || selected.length < 2) reset(), initial.forEach(e => e.classList.add("ogl_selected")); else {
                    let start = this.getKeyDay(keyEnd, selected[0].getAttribute("data-day")), end = this.getKeyDay(keyEnd, selected[selected.length - 1].getAttribute("data-day"));
                    Util.runAsync(() => this.buildStats(start, end)).then(e => this.ogl._popup.open(e, !0));
                }
            },
            onmousedown: e => {
                initial = dateBar.querySelectorAll("[data-day].ogl_selected"), this.isMoving = !0,
                    dateBar.querySelectorAll("[data-day]").forEach(b => b.classList.remove("ogl_selected")),
                    e.target.getAttribute("data-day") && (first = parseInt(e.target.getAttribute("data-day"))),
                    e.target.parentNode.getAttribute("data-day") && (first = parseInt(e.target.parentNode.getAttribute("data-day")));
            },
            onmouseleave: () => {
                this.isMoving = !1, first = !1, reset();
            }
        }), details = Util.addDom("div", {
            parent: dayEnd,
            class: "ogl_statsDetails"
        }), highest = 0, lowest = 0;
        for (let i = 1; i <= monthEnd.getDate(); i++) {
            let barKey = this.getKeyDay(keyEnd, i), data = this.getData(barKey), bar = (data.total?.msu < lowest && (lowest = data.total?.msu || 0),
                data.total?.msu > highest && (highest = data.total?.msu || 0), dataset.push(data),
                Util.addDom("div", {
                    class: "ogl_item",
                    parent: dateBar,
                    "data-day": i,
                    "data-value": data.total?.msu || 0,
                    onclick: () => {
                        bars.forEach(e => e.classList.remove("ogl_selected")), bar.classList.add("ogl_selected"),
                            this.displayDetails([data], details, barKey, barKey), initial = dateBar.querySelectorAll("[data-day].ogl_selected");
                    },
                    onmouseenter: () => {
                        if (this.isMoving && (first = first || parseInt(bar.getAttribute("data-day")),
                            this.isMoving)) {
                            let current = parseInt(bar.getAttribute("data-day"));
                            dateBar.querySelectorAll("[data-day]").forEach(b => {
                                var num1, num2, dataDay = parseInt(b.getAttribute("data-day"));
                                dataDay = dataDay, num1 = current, num2 = first, dataDay >= Math.min(num1, num2) && dataDay <= Math.max(num1, num2) ? b.classList.add("ogl_selected") : b.classList.remove("ogl_selected");
                            });
                        }
                    }
                }));
            bars.push(bar), Date.parse(barKey) >= Date.parse(keyStart) && Date.parse(barKey) <= Date.parse(keyEnd) && bar.classList.add("ogl_selected");
        }
        let timeStart = new Date(keyStart).getTime(), timeEnd = new Date(keyEnd).getTime();
        if (Object.keys(this.ogl.db.stats).filter(stat => {
            var date = new Date(stat).getTime();
            date >= timeStart && date <= timeEnd && subDataset.push(this.getData(stat));
        }), bars.forEach(bar => {
            var value = parseInt(bar.getAttribute("data-value")), height = 0 < (height = Math.ceil(Math.abs(value) / (Math.max(Math.abs(highest), Math.abs(lowest)) / 100))) ? Math.max(height, 5) : 0, color = 0 < value ? "#35cf95" : "#e14848";
            Util.addDom("div", {
                parent: bar
            }).style.background = `linear-gradient(to top, ${color} ${height}%, #0e1116 ${height}%)`,
                0 != value && bar.classList.add("ogl_active");
        }), subDataset.length < 1) {
            let emptyData = {};
            this.types.forEach(type => emptyData[type] = {}), emptyData.total = {},
                subDataset.push(emptyData);
        }
        return this.displayDetails(subDataset, details, keyStart, keyEnd), dayEnd;
    }
    displayDetails(dataset, parent, keyStart, keyEnd) {
        parent.innerText = "";
        var start = new Date(keyStart).toLocaleString("default", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }), end = new Date(keyEnd).toLocaleString("default", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }), keyStart = keyStart == keyEnd ? start : start + " -> " + end;
        Util.addDom("h3", {
            child: keyStart,
            parent: parent
        });
        let data = dataset.reduce((acc, item) => (Object.entries(item).forEach(([key, value]) => {
            "object" == typeof value ? (acc[key] = acc[key] || {}, Object.entries(value).forEach(([k, v]) => acc[key][k] = (acc[key][k] || 0) + v)) : acc[key] = (acc[key] || 0) + value;
        }), acc), {}), shipTable = (parent.appendChild(this.buildPie(data.expeOccurence)),
            Util.addDom("div", {
                parent: parent,
                class: "ogl_shipTable"
            })), sumTable = ([202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 213, 214, 215, 218, 219].forEach(shipId => {
                Util.addDom("div", {
                    class: "ogl_icon ogl_" + shipId,
                    parent: shipTable,
                    child: Util.formatToUnits(data?.expeShip?.[shipId] || "-", !1, !0)
                });
            }), Util.addDom("div", {
                parent: parent,
                class: "ogl_sumTable"
            })), header = Util.addDom("div", {
                parent: sumTable
            });
        ["", "send", "metal", "crystal", "deut", "msu", "dm", "artefact"].forEach(resource => {
            "send" == resource ? Util.addDom("div", {
                class: "ogl_textCenter ogl_icon material-icons",
                child: "send",
                parent: header
            }) : Util.addDom("div", {
                class: "ogl_icon ogl_" + resource,
                parent: header
            });
        }), ["expe", "raid", "conso", "u", "total"].forEach(type => {
            var typeLabel = "u" == type ? "average" : type;
            let line = Util.addDom("div", {
                parent: sumTable,
                child: `<div>${typeLabel}</div>`
            });
            var typeLabel = {}, missions = (typeLabel.expe = data.expe.count + data.debris16.count,
                typeLabel.raid = data.raid.count + data.debris.count, typeLabel.total = data.debris.count + data.debris16.count + data.expe.count + data.raid.count + data.discovery.count,
                Util.addDom("div", {
                    parent: line,
                    child: Util.formatToUnits(typeLabel[type] || "-", !1, !0)
                }));
            typeLabel[type] && (typeLabel = "expe" == type ? `<div>Expedition: ${data.expe.count}</div><div>Debris p16: ${data.debris16.count}</div>` : "raid" == type ? `<div>Raid: ${data.raid.count}</div><div>Debris: ${data.debris.count}</div>` : "total" == type ? `<div>Expedition: ${data.expe.count}</div>
                        <div>Debris p16: <span>${data.debris16.count}</span></div>
                        <div>Raid: <span>${data.raid.count}</span></div>
                        <div>Debris: <span>${data.debris.count}</span></div>
                        <div>Discovery: <span>${data.discovery.count}</span></div>` : "",
                missions.classList.add("tooltip"), missions.setAttribute("title", typeLabel));
            let uResources = data.debris.count + data.debris16.count + data.expe.count + data.raid.count, uDM = data.expe.count, uArtefacts = data.discovery.count;
            ["metal", "crystal", "deut", "msu", "dm", "artefact"].forEach(resource => {
                if ("u" == type) {
                    let value = 0;
                    "metal" == resource || "crystal" == resource || "deut" == resource || "msu" == resource ? value = data.total[resource] / uResources : "dm" == resource ? value = data.total[resource] / uDM : "artefact" == resource && (value = data.total[resource] / uArtefacts),
                        Util.addDom("div", {
                            class: "ogl_" + resource,
                            parent: line,
                            child: Util.formatToUnits(Math.floor(isFinite(value) ? value : 0), !1, !0)
                        });
                } else "conso" == type && "deut" == resource ? Util.addDom("div", {
                    class: "ogl_" + resource,
                    parent: line,
                    child: Util.formatToUnits(-data.conso || 0, !1, !0)
                }) : "conso" == type && "msu" == resource ? Util.addDom("div", {
                    class: "ogl_" + resource,
                    parent: line,
                    child: Util.formatToUnits(Util.getMSU(0, 0, -data.conso, this.ogl.db.options.msu), !1, !0)
                }) : Util.addDom("div", {
                    class: "ogl_" + resource,
                    parent: line,
                    child: Util.formatToUnits(data[type]?.[resource] || 0, !1, !0)
                });
            });
        }), initTooltips();
    }
    buildPie(occurencesExpeDetail) {
        let pie = Util.addDom("div", {
            class: "ogl_pie"
        });
        if (!occurencesExpeDetail || Object.keys(occurencesExpeDetail || {}).length < 1) return pie.innerHTML = '<div class="ogl_noExpe"><span class="material-icons">compass</span>No expedition data</div>',
            pie;
        let cumulAngle = 1.5 * Math.PI;
        var colors = {
            nothing: "#ddd",
            resource: "#86edfd",
            darkmatter: "#b58cdb",
            ship: "#1dd1a1",
            battle: "#ffd60b",
            item: "#bf6c4d",
            blackhole: "#818181",
            duration: "#df5252",
            trader: "#ff7d30"
        }, pieData = {};
        pieData.resource = occurencesExpeDetail.resource || 0, pieData.darkmatter = occurencesExpeDetail.darkmatter || 0,
            pieData.ship = occurencesExpeDetail.ship || 0, pieData.nothing = occurencesExpeDetail.nothing || 0,
            pieData.blackhole = occurencesExpeDetail.blackhole || 0, pieData.trader = occurencesExpeDetail.trader || 0,
            pieData.item = occurencesExpeDetail.item || 0, pieData.battle = (occurencesExpeDetail.pirate || 0) + (occurencesExpeDetail.alien || 0),
            pieData.duration = (occurencesExpeDetail.early || 0) + (occurencesExpeDetail.late || 0);
        let size = 256, center = size / 2, radius = size / 2, slices = [];
        let drawPie = hoveredSlice => {
            ctx.clearRect(0, 0, size, size), slices.forEach(slice => {
                ctx.beginPath(), ctx.arc(center, center, radius, slice.startAngle, slice.endAngle),
                    ctx.lineTo(center, center), ctx.closePath(), ctx.fillStyle = slice.title == hoveredSlice?.title ? "white" : slice.color,
                    ctx.fill();
            }), ctx.fillStyle = "rgba(0,0,0,.5)", ctx.beginPath(), ctx.arc(size / 2, size / 2, size / 2.7, 0, 2 * Math.PI, !1),
                ctx.fill(), ctx.fillStyle = "#1b212a", ctx.beginPath(), ctx.arc(size / 2, size / 2, size / 3, 0, 2 * Math.PI, !1),
                ctx.fill(), pie.setAttribute("data-pie", (hoveredSlice ? this.ogl._lang.find(hoveredSlice.title) + "\r\n" : "") + (hoveredSlice ? hoveredSlice.percent + "%" : total + "\r\nExpeditions")),
                legend.querySelectorAll(".ogl_active").forEach(e => e.classList.remove("ogl_active")),
                hoveredSlice && legend.querySelector(`[data-entry="${hoveredSlice.title}"]`).classList.add("ogl_active");
        }, canvas = Util.addDom("canvas", {
            parent: pie,
            width: size,
            height: size,
            onmouseout: () => {
                drawPie(), canvas.classList.remove("ogl_interactive");
            }
        }), ctx = canvas.getContext("2d", {
            willReadFrequently: !0
        }), legend = Util.addDom("div", {
            parent: pie,
            class: "ogl_pieLegendContainer",
            onmouseleave: () => drawPie()
        });
        var title, value, slice, pieData = Object.entries(pieData || {});
        let total = Object.values(occurencesExpeDetail || {}).reduce((accumulator, e) => accumulator + Math.max(0, e), 0);
        pie.setAttribute("data-pie", total);
        for ([title, value] of pieData.sort((a, b) => b[1] - a[1])) 0 < value && ((slice = {}).title = title,
            slice.value = value, slice.percent = (value / total * 100).toFixed(2), slice.startAngle = cumulAngle,
            slice.angle = value / total * 2 * Math.PI, slice.endAngle = cumulAngle + slice.angle,
            slice.color = colors[title], slices.push(slice), cumulAngle = slice.endAngle,
            Util.addDom("div", {
                class: "ogl_pieLegend",
                "data-resultType": slice.title,
                "data-entry": slice.title,
                parent: legend,
                child: `<div>${this.ogl._lang.find(title)}</div><span>${Util.formatToUnits(value)}</span><i>${slice.percent}%</i>`
            }));
        return drawPie(), legend.querySelectorAll(".ogl_pieLegend").forEach(line => {
            line.addEventListener("mouseenter", () => {
                var slice = slices.find(slice => slice.title == line.getAttribute("data-entry"));
                drawPie(slice);
            });
        }), pie;
    }
    addBlackHoleButton() {
        Util.addDom("button", {
            class: "ogl_button material-icons tooltip ogl_blackHoleButton",
            title: this.ogl._lang.find("reportBlackhole"),
            parent: this.miniDiv,
            child: "skull",
            onclick: () => {
                this.ogl._popup.open(Util.addDom("div", {
                    child: '<div class="ogl_loading"></div>'
                }));
                let container = Util.addDom("div", {
                    class: "ogl_keeper ogl_blackhole"
                }), wrapper = (Util.addDom("h2", {
                    child: this.ogl._lang.find("reportBlackhole"),
                    parent: container
                }), Util.addDom("div", {
                    class: "ogl_shipLimiter",
                    parent: container
                }));
                [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 213, 214, 215, 218, 219].forEach(shipID => {
                    var item = Util.addDom("div", {
                        class: "ogl_icon ogl_" + shipID,
                        parent: wrapper
                    });
                    Util.addDom("input", {
                        class: "ogl_inputCheck",
                        "data-ship": shipID,
                        parent: item
                    });
                }), Util.addDom("div", {
                    class: "ogl_button",
                    child: "Add",
                    parent: container,
                    onclick: () => {
                        if (confirm(this.ogl._lang.find("reportBlackholeLong"))) {
                            let result = {};
                            result.date = new Date(), result.messageType = "blackhole",
                                result.gain = {}, container.querySelectorAll("input").forEach(input => {
                                    var shipID = parseInt(input.getAttribute("data-ship")), input = parseInt(input.value.replace(/\D/g, "")) || 0;
                                    isNaN(shipID) || isNaN(input) || (result.gain[-shipID] = input);
                                }), this.ogl._message.updateStats(result), this.ogl._popup.close();
                        }
                    }
                }), this.ogl._popup.open(container);
            }
        });
    }
}

class EmpireManager extends Manager {
    load() {
        if (this.getLFBonuses(), this.getAllianceClass(), "empire" == this.ogl.page) {
            unsafeWindow.jumpGateLink = `${window.location.href.split('?')[0]}?page=ajax&component=jumpgate&overlay=1&ajax=1`;
            let updateDone = !(unsafeWindow.jumpGateLoca = {
                LOCA_STATION_JUMPGATE_HEADLINE: "Jumpgate"
            }), planetData, planetName;
            Util.observe(document.body, {
                childList: !0,
                subtree: !0,
                attributes: !0
            }, mutation => {
                !updateDone && mutation.target.classList.contains("box-end") && mutation.target.closest(".summary") && mutation.target.closest(".groupresources") ? "none" == document.querySelector("#loading").style.display && (updateDone = !0,
                    this.update(document.querySelector("#mainContent script").innerText, new URLSearchParams(window.location.search).get("planetType"), !0),
                    document.querySelectorAll(".planet").forEach(planet => {
                        let data = this.ogl.db.myPlanets[planet.id.replace("planet", "")];
                        data && Util.addDom("div", {
                            class: "material-icons ogl_empireJumpgate",
                            child: "jump_to_element",
                            parent: planet.querySelectorAll(".row")[1],
                            onclick: e => {
                                e.preventDefault(), planetData = data, planetName = planet.querySelector(".planetname").getAttribute("title") || planet.querySelector(".planetname").innerText,
                                    document.querySelector(".ui-dialog")?.remove(), setTimeout(() => openJumpgate(), 5);
                            }
                        });
                    })) : mutation.target.classList.contains("ui-dialog") && document.querySelector("#jumpgate") && (document.querySelector("#jumpgateNotReady") || (document.querySelector(".currentlySelected") ? ((mutation = document.querySelector(".currentlySelected a")).setAttribute("data-value", planetData.planetID || planetData.moonID),
                        mutation.innerText = `${planetName} [${planetData.coords}]`) : document.querySelector("#selecttarget select").value = this.ogl.db.myPlanets[planetData.planetID].moonID,
                        mutation = [planetData.metal, planetData.crystal, planetData.deut, planetData.food],
                        this.ogl.db.fleetLimiter.resourceActive && (mutation[0] = Math.max(0, mutation[0] - (this.ogl.db.fleetLimiter.data.metal || 0)),
                            mutation[1] = Math.max(0, mutation[1] - (this.ogl.db.fleetLimiter.data.crystal || 0)),
                            mutation[2] = Math.max(0, mutation[2] - (this.ogl.db.fleetLimiter.data.deut || 0)),
                            mutation[3] = Math.max(0, mutation[3] - (this.ogl.db.fleetLimiter.data.food || 0))),
                        mutation = mutation[0] + mutation[1] + mutation[2] + mutation[3],
                        document.querySelector(`[name="ship_${this.ogl.db.options.defaultShip}"]`).value = this.ogl._fleet.shipsForResources(this.ogl.db.options.defaultShip, Math.max(0, mutation))));
            });
        }
    }
    update(data, type, fromEmpire) {
        this.ogl.db.lastEmpireUpdate = Date.now();
        let allowedEntries = ["id", "metal", "crystal", "deuterium", "energy", "food", "population", "fieldUsed", "fieldMax", "planetID", "moonID"];
        (data = fromEmpire ? JSON.parse(data.match(/{(.*)}/g)[1]) : data).planets?.forEach(planet => {
            this.ogl.db.myPlanets[planet.id] = this.ogl.db.myPlanets[planet.id] || {},
                this.ogl.db.myPlanets[planet.id].type = 0 === type ? "planet" : "moon",
                Object.entries(planet).forEach(entry => {
                    0 <= entry[0].indexOf("html") || ("temperature" === entry[0] ? this.ogl.db.myPlanets[planet.id][entry[0]] = parseInt(entry[1].match(/[-|0-9]+/g, "")[0]) : Number(entry[0]) || 0 <= entry[0].indexOf("Storage") || allowedEntries.includes(entry[0]) ? this.ogl.db.myPlanets[planet.id][entry[0].replace("deuterium", "deut")] = parseInt(entry[1]) : "coordinates" === entry[0] ? this.ogl.db.myPlanets[planet.id].coords = entry[1].slice(1, -1) : "production" === entry[0] && (this.ogl.db.myPlanets[planet.id].prodMetal = entry[1].hourly[0] / 3600,
                        this.ogl.db.myPlanets[planet.id].prodCrystal = entry[1].hourly[1] / 3600,
                        this.ogl.db.myPlanets[planet.id].prodDeut = entry[1].hourly[2] / 3600));
                });
        }), this.ogl.currentPlanet && (this.ogl.currentPlanet.obj = this.ogl.db.myPlanets[document.querySelector('head meta[name="ogame-planet-id"]')?.getAttribute("content")]),
            document.querySelectorAll(".planetlink, .moonlink").forEach(planet => {
                let id = new URLSearchParams(planet.getAttribute("href")).get("cp").split("#")[0];
                ["metal", "crystal", "deut"].forEach(resourceName => {
                    var resource = this.ogl.db.myPlanets[id]?.[resourceName] || 0, storage = this.ogl.db.myPlanets[id]?.[resourceName + "Storage"] || 0, selector = planet.querySelector(".ogl_available .ogl_" + resourceName);
                    selector ? (selector.innerHTML = Util.formatToUnits(resource, 1),
                        storage <= resource && planet.classList.contains("planetlink") ? selector.classList.add("ogl_danger") : .9 * storage <= resource && planet.classList.contains("planetlink") ? selector.classList.add("ogl_warning") : (selector.classList.remove("ogl_warning"),
                            selector.classList.remove("ogl_danger"))) : planet.querySelector(".ogl_available .ogl_" + resourceName) && (planet.querySelector(".ogl_available .ogl_" + resourceName).innerHTML = Util.formatToUnits(resource, 1));
                });
            }), this.ogl._ui && Util.runAsync(() => this.ogl._ui.displayResourcesRecap());
    }
    getLFBonuses(source) {
        var htmlSource = source || document;
        !source && "lfbonuses" != this.ogl.page || (this.ogl.db.lfBonuses = {},
            htmlSource.querySelectorAll("bonus-item-content-holder > [data-toggable]").forEach(item => {
                var id = item.getAttribute("data-toggable").replace(/subcategory|Ships|Defenses|CostAndTime/g, "");
                let regex = new RegExp(`[0-9|-]+(${LocalizationStrings.decimalPoint}[0-9]+)?`, "g");
                var isBaseResearch = 100 < id && id <= 199, isBaseShip = 200 < id && id <= 299, isBaseDef = 400 < id && id <= 499, lfBonuses = {};
                let bonuses = [];
                if (item.querySelectorAll("bonus-item").forEach(bonus => {
                    bonus = (bonus.innerText.match(regex) || []).map(e => "-" == e ? 0 : parseFloat(e.replace(LocalizationStrings.decimalPoint, ".")));
                    bonuses.push(bonus);
                }), 0 == bonuses.length) {
                    let value = (item.innerText.match(regex) || [])[0];
                    value = value && "-" != value ? parseFloat(value.replace(LocalizationStrings.decimalPoint, ".")) : 0,
                        lfBonuses.bonus = value;
                }
                isBaseShip ? (lfBonuses.armor = bonuses[0][0], lfBonuses.shield = bonuses[1][0],
                    lfBonuses.weapon = bonuses[2][0], lfBonuses.speed = bonuses[3][0], lfBonuses.cargo = bonuses[4][0],
                    lfBonuses.fuel = bonuses[5][0]) : isBaseDef ? (lfBonuses.armor = bonuses[0][0],
                        lfBonuses.shield = bonuses[1][0], lfBonuses.weapon = bonuses[2][0]) : !isBaseResearch && "LfResearch" != id || (lfBonuses.cost = bonuses[0][0],
                            lfBonuses.duration = bonuses[1][0]), this.ogl.db.lfBonuses[id] = lfBonuses;
            })), !source && "lfbonuses" != this.ogl.page && "lfsettings" != this.ogl.page || (this.ogl.db.lfBonuses = this.ogl.db.lfBonuses || {},
                htmlSource.querySelectorAll("lifeform-item, .lifeform-item").forEach(item => {
                    var lifeform = item.querySelector(".lifeform-item-icon").className.replace(/lifeform-item-icon| /g, ""), item = item.querySelector(".currentlevel").innerText.replace(/\D/g, "") / 10;
                    this.ogl.db.lfBonuses[lifeform] = {
                        bonus: item
                    };
                }));
    }
    getAllianceClass() {
        "alliance" == this.ogl.page && setTimeout(() => {
            var sprite = alliance.allianceContent[0].querySelector("#allyData .allianceclass.sprite");
            sprite ? (sprite = (Array.from(sprite.classList).filter(element => allianceClassArr.includes(element)) || ["neutral"])[0],
                sprite = allianceClassArr.indexOf(sprite), this.ogl.db.allianceClass = sprite) : this.getAllianceClass();
        }, 1e3);
    }
}

class Util {
    static get simList() {
        return {
            battlesim: "http://battlesim.logserver.net/",
            "simulator.ogame-tools": "http://simulator.ogame-tools.com/"
        };
    }
    static get converterList() {
        return {
            ogotcha: "http://ogotcha.oplanet.eu/",
            topraider: "http://topraider.eu/index.php",
            "ogame.tools": "http://battleconvertor.fr"
        };
    }
    static overWrite(fn, context, before, after, newParam1, newParam2) {
        let old = context[fn], locked = !1;
        context[fn] = function (param1, param2) {
            (locked = before && "function" == typeof before ? before(newParam1 || param1, newParam2 || param2) : locked) || old.call(context, newParam1 || param1, newParam2 || param2),
                after && "function" == typeof after && !locked && after(newParam1 || param1, newParam2 || param2);
        };
    }
    static drawLine(svg, parent, element1, element2) {
        var x1, x2;
        unsafeWindow.fleetDispatcher && fleetDispatcher.realTarget && (fleetDispatcher.targetPlanet.galaxy != fleetDispatcher.realTarget.galaxy || fleetDispatcher.targetPlanet.system != fleetDispatcher.realTarget.system || fleetDispatcher.targetPlanet.position != fleetDispatcher.realTarget.position || fleetDispatcher.targetPlanet.type != fleetDispatcher.realTarget.type) || (svg.querySelector("line")?.remove(),
            element1 && element2 && element1 != element2 && (element1 = element1.querySelector(".planetPic, .icon-moon"),
                element2 = element2.querySelector(".planetPic, .icon-moon"), x1 = Math.round(element1.getBoundingClientRect().left + element1.getBoundingClientRect().width / 2 - parent.getBoundingClientRect().left) - 2,
                element1 = Math.round(element1.getBoundingClientRect().top + element1.getBoundingClientRect().height / 2 - parent.getBoundingClientRect().top),
                x2 = Math.round(element2.getBoundingClientRect().left + element2.getBoundingClientRect().width / 2 - parent.getBoundingClientRect().left) - 2,
                element2 = Math.round(element2.getBoundingClientRect().top + element2.getBoundingClientRect().height / 2 - parent.getBoundingClientRect().top),
                parent.appendChild(svg), parent = document.createElementNS("http://www.w3.org/2000/svg", "line"),
                svg.appendChild(parent), parent.classList.add("ogl_line"), parent.setAttribute("x1", x1),
                parent.setAttribute("y1", element1), parent.setAttribute("x2", x2), parent.setAttribute("y2", element2),
                parent.setAttribute("stroke-dasharray", "7 5")));
    }
    static coordsToID(arr) {
        return ("string" == typeof arr ? arr.split(":").map(x => x.padStart(3, "0")) : arr.map(x => x.padStart(3, "0"))).join("");
    }
    static removeFromArray(arr, index) {
        arr.splice(index, 1);
    }
    static formatNumber(number) {
        return (number || "0").toLocaleString("de-DE");
    }
    static formatToUnits(value, forced, colored) {
        if (value = ((value = Math.round(value || 0)) || 0).toString().replace(/[\,\. ]/g, ""),
            isNaN(value)) return value;
        let precision = 0;
        value = parseInt(value), precision = 0 == value || 0 === forced || value < 1e3 && -1e3 < value ? 0 : 1 === forced || value < 1e6 && -1e6 < value ? 1 : 2;
        var forced = Intl.NumberFormat("fr-FR", {
            notation: "compact",
            minimumFractionDigits: precision,
            maximumFractionDigits: precision
        }).format(value).match(/[a-zA-Z]+|[0-9,-]+/g), result = forced[0].replace(/,/g, "."), forced = forced[1]?.replace("Md", "G").replace("Bn", "T") || "", result = Util.addDom("span", {
            class: "ogl_unit",
            child: `<span>${result}</span><span class="ogl_suffix">${forced}</span>`
        });
        return value < 0 && colored && result.classList.add("ogl_danger"), result.outerHTML;
    }
    static formatFromUnits(value) {
        if (!value) return 0;
        let offset = 3 * ((value = value.toLowerCase()).split(LocalizationStrings.thousandSeperator).length - 1);
        LocalizationStrings.thousandSeperator == LocalizationStrings.decimalPoint && (offset = 0);
        var splitted = value.match(/\d+/g)[0].length;
        return value = -1 < value.indexOf(LocalizationStrings.unitMilliard.toLowerCase()) ? (value = (value = value.replace(LocalizationStrings.unitMilliard.toLowerCase(), "")).replace(/[\,\. ]/g, "")).padEnd(9 + offset + splitted, "0") : -1 < value.indexOf(LocalizationStrings.unitMega.toLowerCase()) ? (value = (value = value.replace(LocalizationStrings.unitMega.toLowerCase(), "")).replace(/[\,\. ]/g, "")).padEnd(6 + offset + splitted, "0") : -1 < value.indexOf(LocalizationStrings.unitKilo.toLowerCase()) ? (value = (value = value.replace(LocalizationStrings.unitKilo.toLowerCase(), "")).replace(/[\,\. ]/g, "")).padEnd(3 + offset + splitted, "0") : value.replace(/[\,\. ]/g, ""),
            parseInt(value);
    }
    static formatInput(input, callback, canBeEmpty) {
        setTimeout(() => {
            if (input.value && 0 != input.value || !input.classList.contains("ogl_placeholder")) {
                input.value = input.value.slice(0, input.selectionStart) + input.value.slice(input.selectionEnd);
                var oldLength = input.value.length;
                let mult = 1;
                0 <= input.value.toLowerCase().indexOf("k") ? mult = 1e3 : 0 <= input.value.toLowerCase().indexOf("m") ? mult = 1e6 : 0 <= input.value.toLowerCase().indexOf("g") && (mult = 1e9);
                var cursorPosition = input.selectionStart;
                let formattedValue;
                "true" == input.getAttribute("data-allowPercent") && 0 <= input.value.toLowerCase().indexOf("%") ? (formattedValue = Math.min(parseInt(input.value?.replace(/\D/g, "") || 0), 100).toString(),
                    formattedValue += "%") : formattedValue = (formattedValue = (parseInt(input.value?.replace(/\D/g, "") || 0) * mult).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, " "),
                    input.value = formattedValue, cursorPosition += input.value.length > oldLength ? 1 : input.value.length < oldLength ? -1 : 0,
                    input.setSelectionRange(cursorPosition, cursorPosition), 0 == input.value && canBeEmpty && (input.value = ""),
                    callback && callback();
            } else input.value = "";
        }, 5);
    }
    static reorderArray(arr, index, reversed) {
        arr = arr.slice(index, arr.length).concat(arr.slice(0, index));
        return reversed ? arr.reverse() : arr;
    }
    static observe(element, options, callback, oglObj) {
        options = options || {}, new MutationObserver(mutations => {
            oglObj && "progress" !== mutations[0].target.tagName.toLowerCase() && (Util.runAsync(oglObj._time.update, oglObj._time),
                Util.runAsync(oglObj._time.observe, oglObj._time), document.querySelector('[onclick*="sendShips(6"]:not([data-spy-coords]), [onclick*="sendShipsWithPopup(6"]:not([data-spy-coords])')) && Util.runAsync(oglObj._fleet.checkSendShips, oglObj._fleet);
            for (let i = 0; i < mutations.length; i++) callback(mutations[i]);
        }).observe(element, options);
    }
    static addDom(tag, params) {
        params = params || {};
        let element = document.createElement(tag);
        return element.classList.add("ogl_addedElement"), Object.entries(params).forEach(param => {
            var isIgnored = "before" === param[0] || "prepend" === param[0] || "parent" === param[0] || "after" === param[0], isContent = "child" === param[0], isListener = param[0].startsWith("on");
            !isContent && !isListener && !isIgnored ? (element.setAttribute(param[0], param[1]),
                "class" == param[0] && -1 < param[1].indexOf("material-icons") && element.classList.add("notranslate")) : isListener ? element.addEventListener(param[0].toLowerCase().slice(2), event => {
                    param[1](event, element);
                }) : isContent && (typeof param[1] == typeof {} ? element.appendChild(param[1]) : "string" != typeof param[1] && "number" != typeof param[1] || (element.innerHTML = param[1].toString()));
        }), params.parent ? params.parent.appendChild(element) : params.before ? params.before.parentNode.insertBefore(element, params.before) : params.after ? params.after.after(element) : params.prepend && params.prepend.prepend(element),
            element;
    }
    static runAsync(fn, scope) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(scope ? scope[fn.toString().split("(")[0]]() : fn(scope));
            });
        });
    }
    static takeScreenshot(element, button, name, retry) {
        var rect;
        "undefined" == typeof html2canvas ? fetch("http://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js", {
            method: "get",
            headers: {
                Accept: "application/json"
            }
        }).then(response => response.text()).then(result => {
            3 < (retry = (retry || 0) + 1) || (document.head.appendChild(Util.addDom("script", {
                type: "text/javascript",
                child: result
            })), Util.takeScreenshot(element, button, name));
        }) : (rect = element.getBoundingClientRect(), html2canvas(element, {
            backgroundColor: null,
            useCORS: !0,
            ignoreElements: e => e.classList.contains("ogl_close") || e.classList.contains("ogl_share"),
            x: rect.x,
            y: rect.y,
            scrollX: 0,
            scrollY: 0,
            width: rect.width,
            height: rect.height,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        }).then(canvas => {
            canvas = canvas.toDataURL();
            Util.addDom("a", {
                download: name,
                href: canvas
            }).click(), button.classList.remove("ogl_disabled");
        }));
    }
    static hash(str) {
        return [...str].reduce((string, char) => Math.imul(31, string) + char.charCodeAt(0) | 0, 0);
    }
    static getMSU(metal, crystal, deut, ratio) {
        return ratio = ratio.split(":"), Math.ceil((metal || 0) + (crystal || 0) * ratio[0] / ratio[1] + (deut || 0) * ratio[0]);
    }
    static getPlayerScoreFD(score, type) {
        var defense;
        return score ? (defense = Math.max(score.military - (score.global - score.economy - score.research - score.lifeform), 0),
            score = score.military - defense, "defense" == type ? defense : score) : "?";
    }
    static genTrashsimLink(ogl, apiKey, attacker, defender, meAsDefender) {
        attacker && ["metal", "crystal", "deut", "food"].forEach(e => {
            attacker.ships?.[e] && delete attacker.ships?.[e];
        });
        var coords = ogl.currentPlanet.obj.coords.split(":");
        let jsonData = {
            0: [{
                planet: {
                    galaxy: coords[0],
                    system: coords[1],
                    position: coords[2]
                },
                class: ogl.account.class,
                characterClassesEnabled: !0,
                allianceClass: ogl.db.allianceClass || 0,
                research: {},
                ships: attacker?.ships || {}
            }],
            1: [{
                planet: defender?.planet || {},
                research: {},
                ships: defender?.ships || {}
            }]
        };
        [109, 110, 111, 114, 115, 117, 118].forEach(techID => {
            jsonData[0][0].research[techID] = {
                level: ogl.currentPlanet.obj[techID] || 0
            };
        }), console.log(jsonData[0][0].research), meAsDefender || (2 == ogl.account.class && (jsonData[0][0].research[109].level = (jsonData[0][0].research[109].level || 0) + 2,
            jsonData[0][0].research[110].level = (jsonData[0][0].research[110].level || 0) + 2,
            jsonData[0][0].research[111].level = (jsonData[0][0].research[111].level || 0) + 2),
            1 == ogl.db.allianceClass && (jsonData[0][0].research[109].level = (jsonData[0][0].research[109].level || 0) + 1,
                jsonData[0][0].research[110].level = (jsonData[0][0].research[110].level || 0) + 1,
                jsonData[0][0].research[111].level = (jsonData[0][0].research[111].level || 0) + 1),
            jsonData[0][0].lifeformBonuses = jsonData[0][0].lifeformBonuses || {}, jsonData[0][0].lifeformBonuses.BaseStatsBooster = jsonData[0][0].lifeformBonuses.BaseStatsBooster || {},
            ogl.shipsList.forEach(shipID => {
                jsonData[0][0].lifeformBonuses.BaseStatsBooster[shipID] = jsonData[0][0].lifeformBonuses.BaseStatsBooster[shipID] || {},
                    Object.entries(ogl.db.lfBonuses?.[shipID] || {
                        weapon: 0,
                        shield: 0,
                        armor: 0,
                        cargo: 0,
                        speed: 0,
                        fuel: 0
                    }).forEach(entry => {
                        "fuel" == entry[0] && 0 != entry[1] ? jsonData[0][0].lifeformBonuses.ShipFuelConsumption = Math.abs(entry[1] / 100) : jsonData[0][0].lifeformBonuses.BaseStatsBooster[shipID][entry[0]] = entry[1] / 100;
                    });
            }), jsonData[0][0].lifeformBonuses.CharacterClassBooster = {}, jsonData[0][0].lifeformBonuses.CharacterClassBooster[ogl.account.class] = (ogl.db.lfBonuses?.["Characterclasses" + ogl.account.class]?.bonus || 0) / 100),
            jsonData = btoa(JSON.stringify(jsonData));
        coords = "us" == ogl.account.lang ? "en" : "ar" == ogl.account.lang ? "es" : ogl.account.lang,
            defender = ogl.db.options.sim && Util.simList[ogl.db.options.sim] ? ogl.db.options.sim : Object.keys(Util.simList)[Math.floor(Math.random() * Object.keys(Util.simList).length)],
            meAsDefender = Util.simList[defender];
        return apiKey ? meAsDefender + coords + "?SR_KEY=" + apiKey + "#prefill=" + jsonData : meAsDefender + coords + "#prefill=" + jsonData;
    }
    static genConverterLink(ogl, apiKey) {
        var lang = "us" == ogl.account.lang ? "en" : "ar" == ogl.account.lang ? "es" : ogl.account.lang, ogl = ogl.db.options.converter && Util.converterList[ogl.db.options.converter] ? ogl.db.options.converter : Object.keys(Util.converterList)[Math.floor(Math.random() * Object.keys(Util.converterList).length)], link = Util.converterList[ogl];
        return "ogotcha" == ogl ? "" + link + lang + `?CR_KEY=${apiKey}&utm_source=OGLight` : "topraider" == ogl ? link + `?CR_KEY=${apiKey}&lang=` + lang : "ogame.tools" == ogl ? link + "?CR_KEY=" + apiKey : void 0;
    }
    static genOgotchaLink(ogl, apiKey) {
        return `http://ogotcha.universeview.be/${"us" == ogl.account.lang ? "en" : "ar" == ogl.account.lang ? "es" : ogl.account.lang}?CR_KEY=${apiKey}&utm_source=OGLight`;
    }
    static genTopRaiderLink(ogl, apiKey) {
        return `http://topraider.eu/index.php?CR_KEY=${apiKey}&lang=` + ("us" == ogl.account.lang ? "en" : "ar" == ogl.account.lang ? "es" : ogl.account.lang);
    }
    static genMmorpgstatLink(ogl, playerID) {
        return `http://www.mmorpg-stat.eu/0_fiche_joueur.php?pays=${["fr", "de", "en", "es", "pl", "it", "ru", "ar", "mx", "tr", "fi", "tw", "gr", "br", "nl", "hr", "sk", "cz", "ro", "us", "pt", "dk", "no", "se", "si", "hu", "jp", "ba"].indexOf(ogl.server.lang)}&ftr=${playerID}.dat&univers=_` + ogl.server.id;
    }
}

class PTRE {
    constructor(ogl) {
        this.ogl = ogl, this.url = "http://ptre.chez.gg/scripts/", this.playerPositionsDelay = 36e5,
            this.manageSyncedListUrl = "http://ptre.chez.gg/?page=players_list";
    }
    request(page, init) {
        let params = {}, options = {};
        document.querySelector(".ogl_ptreActionIcon i") && (this.ogl.ptreNotificationIconTimeout && clearTimeout(this.ogl.ptreNotificationIconTimeout),
            document.querySelector(".ogl_ptreActionIcon i").className = "material-icons ogl_warning",
            document.querySelector(".ogl_ptreActionIcon i").classList.add("ogl_active")),
            Object.entries(init).forEach(obj => {
                0 === obj[0].indexOf("_") ? options[obj[0].replace("_", "")] = obj[1] : params[obj[0]] = obj[1];
            }), params.tool = "oglight", params.team_key = this.ogl.ptreKey, params.country = this.ogl.server.lang,
            params.univers = universeId, params.version = this.ogl.version;
        init = params ? "?" + new URLSearchParams(params).toString() : "";
        return fetch("https://bridge.hibot.fr/bridge?url=" + this.url + page + init, options).then(response => response.json()).then(data => (this.ogl.ptreNotificationIconTimeout = setTimeout(() => this.notify(data.message, data.code, data.message_verbose), 100),
            Promise.resolve(data)));
    }
    notify(message, code, verbose) {
        document.querySelector(".ogl_ptreActionIcon i") && (document.querySelector(".ogl_ptreActionIcon i").className = "material-icons",
            document.querySelector(".ogl_ptreActionIcon i").classList.remove("ogl_active"),
            1 != code ? (this.log(code, verbose || message), document.querySelector(".ogl_ptreActionIcon i").classList.add("ogl_danger")) : document.querySelector(".ogl_ptreActionIcon i").classList.add("ogl_ok"));
    }
    log(code, message) {
        var id = serverTime.getTime();
        this.ogl.cache.ptreLogs = this.ogl.cache.ptreLogs || [], this.ogl.cache.ptreLogs.push({
            code: code,
            message: message,
            id: id
        }), 10 < this.ogl.cache.ptreLogs.length && this.ogl.cache.ptreLogs.shift();
    }
    displayLogs() {
        let container = Util.addDom("div", {
            class: "ogl_log"
        });
        0 < this.ogl.cache.ptreLogs?.length ? (this.ogl.cache.ptreLogs.forEach(log => {
            var time = this.ogl._time.convertTimestampToDate(log.id);
            Util.addDom("div", {
                child: `<div>${time.outerHTML}</div><div>${log.code}</div><div>${log.message}</div>`,
                prepend: container
            });
        }), Util.addDom("div", {
            child: "<div>time</div><div>error code</div><div>message</div>",
            prepend: container
        })) : Util.addDom("div", {
            child: "empty",
            parent: container
        }), Util.addDom("div", {
            child: "<h2>PTRE errors</h2>",
            prepend: container
        }), this.ogl._popup.open(container, !0);
    }
    postPositions(postData) {
        this.request("api_galaxy_import_infos.php", {
            _method: "POST",
            _body: JSON.stringify(postData)
        });
    }
    postActivities(postData) {
        this.request("oglight_import_player_activity.php", {
            _method: "POST",
            _body: JSON.stringify(postData)
        }).then(data => {
            1 == data.code && Object.keys(postData).forEach(id => {
                var parent = document.querySelector(`.msg[data-msg-id="${id}"] .msg_title`);
                parent && !document.querySelector(`.msg[data-msg-id="${id}"] .ogl_checked`) && Util.addDom("div", {
                    class: "material-icons ogl_checked tooltipLeft ogl_ptre",
                    child: "ptre",
                    title: this.ogl._lang.find("ptreActivityImported"),
                    parent: parent
                }), "messages" == this.ogl.page && this.ogl.cache.counterSpies.push(id);
            });
        });
    }
    postPTRECompatibility(postData) {
        this.request("oglight_update_version.php", {
            _method: "POST",
            _body: JSON.stringify(postData)
        }).then(data => {
            1 == data.code && (this.ogl.id[1] = serverTime.getTime(), GM_setValue("ogl_id", this.ogl.id));
        });
    }
    postSpyReport(apiKey) {
        this.request("oglight_import.php", {
            _method: "POST",
            sr_id: apiKey
        }).then(data => {
            this.ogl._notification.addToQueue("PTRE: " + data.message_verbose, 1 == data.code);
        });
    }
    syncTargetList() {
        let json = [];
        Object.values(this.ogl.db.udb).filter(u => "ptre" == u.pin).forEach(player => {
            json.push({
                id: player.uid,
                pseudo: player.name
            });
        }), this.request("api_sync_target_list.php", {
            _method: "POST",
            _body: JSON.stringify(json)
        }).then(data => {
            1 == data.code && (data.targets_array.forEach(playerData => {
                var id = parseInt(playerData.player_id), id = this.ogl.db.udb[id] || this.ogl.createPlayer(id);
                id.name = playerData.pseudo, id.pin || (id.pin = "ptre");
            }), document.querySelector(".ogl_side.ogl_active")) && "ptre" == this.ogl.db.lastPinTab && this.ogl._topbar.openPinned(),
                this.ogl._notification.addToQueue("PTRE: " + data.message, 1 == data.code);
        });
    }
    getPlayerInfo(player, frame) {
        let container = Util.addDom("div", {
            class: "ogl_ptreContent",
            child: '<div class="ogl_loading"></div>'
        });
        this.ogl._popup.open(container), frame = frame || "week", this.request("oglight_get_player_infos.php", {
            _method: "GET",
            player_id: player.id,
            pseudo: player.name,
            input_frame: frame
        }).then(data => {
            if (1 == data.code) {
                var arrData = JSON.parse(data.activity_array?.activity_array || "{}");
                let checkData = JSON.parse(data.activity_array?.check_array || "{}");
                container.innerHTML = `
                    <h3>${player.name}</h3>
                    <div class="ogl_ptreActivityBlock">
                        <div class="ogl_frameSelector"></div>
                        <div class="ogl_ptreActivities"><span></span><div></div></div>
                    </div>
                    <div class="ogl_ptreBestReport">
                        <div>${this.ogl._lang.find("reportFound")} (${new Date(1e3 * data.top_sr_timestamp).toLocaleDateString("fr-FR")})</div>
                        <div>
                            <div class="ogl_fleetDetail"></div>
                            <b><i class="material-icons">rocket_launch</i>${Util.formatToUnits(data.top_sr_fleet_points)} pts</b>
                        </div>
                        <div>
                            <a class="ogl_button" target="_blank" href="${data.top_sr_link}">${this.ogl._lang.find("topReportDetails")}</a>
                            <a class="ogl_button" target="_blank" href="http://ptre.chez.gg/?country=${this.ogl.server.lang}&univers=${this.ogl.server.id}&player_id=${player.id}">${this.ogl._lang.find("playerProfile")}</a>
                        </div>
                    </div>
                    <!--<ul class="ogl_ptreLegend">
                        <li><u>Green circle</u>: no activity detected & fully checked</li>
                        <li><u>Green dot</u>: no activity detected</li>
                        <li><u>Red dot</u>: multiple activities detected</li>
                        <li><u>Transparent dot</u>: not enough planet checked</li>
                    </ul>-->
                `, Object.entries({
                    last24h: "Last 24h",
                    "2days": "2 days",
                    "3days": "3 days",
                    week: "Week",
                    "2weeks": "2 weeks",
                    month: "Month"
                }).forEach(range => {
                    var button = Util.addDom("button", {
                        class: "ogl_button",
                        child: range[1],
                        parent: container.querySelector(".ogl_frameSelector"),
                        onclick: () => {
                            this.getPlayerInfo(player, range[0]);
                        }
                    });
                    range[0] == frame && button.classList.add("ogl_active");
                }), 1 == data.activity_array.succes && arrData.forEach((line, index) => {
                    if (!isNaN(line[1])) {
                        var div = Util.addDom("div", {
                            class: "tooltip",
                            child: `<div>${line[0]}</div>`
                        }), dot = div.appendChild(Util.addDom("span", {
                            class: "ogl_ptreDotStats"
                        })).appendChild(Util.addDom("div", {
                            "data-acti": line[1],
                            "data-check": checkData[index][1]
                        })), dotValue = line[1] / data.activity_array.max_acti_per_slot * 100 * 7, dotValue = 30 * Math.ceil(dotValue / 30);
                        dot.style.color = `hsl(${Math.max(0, 100 - dotValue)}deg 75% 40%)`,
                            dot.style.opacity = checkData[index][1] + "%";
                        let title;
                        dotValue = Math.max(0, 100 - dotValue);
                        title = 100 === dotValue ? "- No activity detected" : 60 <= dotValue ? "- A few activities detected" : 40 <= dotValue ? "- Some activities detected" : "- A lot of activities detected",
                            100 == checkData[index][1] ? title += "<br>- Perfectly checked" : 75 <= checkData[index][1] ? title += "<br>- Nicely checked" : 50 <= checkData[index][1] ? title += "<br>- Decently checked" : title = 0 < checkData[index][1] ? "Poorly checked" : "Not checked",
                            div.setAttribute("title", title), 100 === checkData[index][1] && 0 == line[1] && dot.classList.add("ogl_active"),
                            container.querySelector(".ogl_ptreActivities > div").appendChild(div);
                    }
                }), data.fleet_json && this.ogl.shipsList.forEach(shipID => {
                    var shipData = data.fleet_json.find(e => e.ship_type == shipID);
                    shipData && Util.addDom("div", {
                        class: "ogl_icon ogl_" + shipID,
                        child: Util.formatToUnits(shipData.count),
                        parent: container.querySelector(".ogl_fleetDetail")
                    });
                }), this.ogl._popup.open(container, !0);
            } else container.innerHTML = data.message + '<hr><a target="_blank" href="http://ptre.chez.gg/?page=splash">More informations here</a>';
        });
    }
    getPlayerPositions(playerData) {
        let updateList = () => {
            document.querySelector(".ogl_pinDetail") && this.ogl.db.currentSide == playerData.id && this.ogl._topbar.openPinnedDetail(playerData.id, !0);
        }, player = this.ogl.db.udb[playerData.id] || this.ogl.createPlayer(playerData.player_id);
        this.ogl._fetch.fetchPlayerAPI(playerData.id, playerData.name, () => {
            this.ogl.ptreKey && serverTime.getTime() - (player.ptre || 0) > this.playerPositionsDelay ? this.request("api_galaxy_get_infos.php", {
                _method: "GET",
                player_id: playerData.id
            }).then(data => {
                1 == data.code && (updateList(), player.ptre = serverTime.getTime(),
                    data.galaxy_array.forEach(ptrePlanet => {
                        var oglPlanet = this.ogl.db.pdb[ptrePlanet.coords] || {};
                        (oglPlanet.api || 0) < ptrePlanet.timestamp_ig && (oglPlanet.uid = ptrePlanet.player_id,
                            oglPlanet.pid = ptrePlanet.id, oglPlanet.mid = ptrePlanet.moon?.id || -1,
                            oglPlanet.coo = ptrePlanet.coords, oglPlanet.acti = ["60", "60", ptrePlanet.timestamp_ig],
                            this.ogl.removeOldPlanetOwner(ptrePlanet.coords, ptrePlanet.player_id),
                            player.planets && player.planets.indexOf(ptrePlanet.coords) < 0 && player.planets.push(ptrePlanet.coords),
                            this.ogl.db.pdb[ptrePlanet.coords] = oglPlanet, document.querySelector(".ogl_pinDetail")) && this.ogl.db.currentSide == ptrePlanet.player_id && this.ogl._topbar.openPinnedDetail(this.ogl.db.currentSide);
                    })), this.ogl._notification.addToQueue("PTRE: " + data.message, 1 == data.code);
            }) : updateList();
        });
    }
    getRank(params, callback) {
        this.request("api_get_ranks.php", {
            _method: "GET",
            country: (params = params || {}).country || this.ogl.server.lang,
            univers: params.univers || this.ogl.server.id,
            timestamp: params.timestamp || -1
        }).then(data => {
            callback && callback(data);
        });
    }
}

class Datafinder {
    static getTech(id) {
        return {
            1: {
                metal: 60,
                crystal: 15,
                deut: 0,
                priceFactor: 1.5
            },
            2: {
                metal: 48,
                crystal: 24,
                deut: 0,
                priceFactor: 1.6
            },
            3: {
                metal: 225,
                crystal: 75,
                deut: 0,
                priceFactor: 1.5
            },
            4: {
                metal: 75,
                crystal: 30,
                deut: 0,
                priceFactor: 1.5
            },
            12: {
                metal: 900,
                crystal: 360,
                deut: 180,
                priceFactor: 1.8
            },
            14: {
                metal: 400,
                crystal: 120,
                deut: 200
            },
            15: {
                metal: 1e6,
                crystal: 5e5,
                deut: 1e5
            },
            21: {
                metal: 400,
                crystal: 200,
                deut: 100
            },
            22: {
                metal: 1e3,
                crystal: 0,
                deut: 0
            },
            23: {
                metal: 1e3,
                crystal: 500,
                deut: 0
            },
            24: {
                metal: 1e3,
                crystal: 1e3,
                deut: 0
            },
            31: {
                metal: 200,
                crystal: 400,
                deut: 200
            },
            33: {
                metal: 0,
                crystal: 5e4,
                deut: 1e5,
                energy: 1e3,
                energyFactor: 2
            },
            34: {
                metal: 2e4,
                crystal: 4e4,
                deut: 0
            },
            36: {
                metal: 200,
                crystal: 0,
                deut: 50,
                energy: 50,
                priceFactor: 5,
                energyFactor: 2.5
            },
            41: {
                metal: 2e4,
                crystal: 4e4,
                deut: 2e4
            },
            42: {
                metal: 2e4,
                crystal: 4e4,
                deut: 2e4
            },
            43: {
                metal: 2e6,
                crystal: 4e6,
                deut: 2e6
            },
            44: {
                metal: 2e4,
                crystal: 2e4,
                deut: 1e3
            },
            106: {
                metal: 200,
                crystal: 1e3,
                deut: 200
            },
            108: {
                metal: 0,
                crystal: 400,
                deut: 600
            },
            109: {
                metal: 800,
                crystal: 200,
                deut: 0
            },
            110: {
                metal: 200,
                crystal: 600,
                deut: 0
            },
            111: {
                metal: 1e3,
                crystal: 0,
                deut: 0
            },
            113: {
                metal: 0,
                crystal: 800,
                deut: 400
            },
            114: {
                metal: 0,
                crystal: 4e3,
                deut: 2e3
            },
            115: {
                metal: 400,
                crystal: 0,
                deut: 600
            },
            117: {
                metal: 2e3,
                crystal: 4e3,
                deut: 600
            },
            118: {
                metal: 1e4,
                crystal: 2e4,
                deut: 6e3
            },
            120: {
                metal: 200,
                crystal: 100,
                deut: 0
            },
            121: {
                metal: 1e3,
                crystal: 300,
                deut: 100
            },
            122: {
                metal: 2e3,
                crystal: 4e3,
                deut: 1e3
            },
            123: {
                metal: 24e4,
                crystal: 4e5,
                deut: 16e4
            },
            124: {
                metal: 4e3,
                crystal: 8e3,
                deut: 4e3,
                priceFactor: 1.75
            },
            199: {
                metal: 0,
                crystal: 0,
                deut: 0,
                energy: 3e5,
                priceFactor: 3,
                energyFactor: 3,
                durationFactor: 1
            },
            202: {
                metal: 2e3,
                crystal: 2e3,
                deut: 0
            },
            203: {
                metal: 6e3,
                crystal: 6e3,
                deut: 0
            },
            204: {
                metal: 3e3,
                crystal: 1e3,
                deut: 0
            },
            205: {
                metal: 6e3,
                crystal: 4e3,
                deut: 0
            },
            206: {
                metal: 2e4,
                crystal: 7e3,
                deut: 2e3
            },
            207: {
                metal: 45e3,
                crystal: 15e3,
                deut: 0
            },
            208: {
                metal: 1e4,
                crystal: 2e4,
                deut: 1e4
            },
            209: {
                metal: 1e4,
                crystal: 6e3,
                deut: 2e3
            },
            210: {
                crystal: 1e3,
                deut: 0
            },
            211: {
                metal: 5e4,
                crystal: 25e3,
                deut: 15e3
            },
            212: {
                metal: 0,
                crystal: 2e3,
                deut: 500
            },
            213: {
                metal: 6e4,
                crystal: 5e4,
                deut: 15e3
            },
            214: {
                metal: 5e6,
                crystal: 4e6,
                deut: 1e6
            },
            215: {
                metal: 3e4,
                crystal: 4e4,
                deut: 15e3
            },
            217: {
                metal: 2e3,
                crystal: 2e3,
                deut: 1e3
            },
            218: {
                metal: 85e3,
                crystal: 55e3,
                deut: 2e4
            },
            219: {
                metal: 8e3,
                crystal: 15e3,
                deut: 8e3
            },
            401: {
                metal: 2e3,
                crystal: 0,
                deut: 0
            },
            402: {
                metal: 1500,
                crystal: 500,
                deut: 0
            },
            403: {
                metal: 6e3,
                crystal: 2e3,
                deut: 0
            },
            404: {
                metal: 2e4,
                crystal: 15e3,
                deut: 2e3
            },
            405: {
                metal: 5e3,
                crystal: 3e3,
                deut: 0
            },
            406: {
                metal: 5e4,
                crystal: 5e4,
                deut: 3e4
            },
            407: {
                metal: 1e4,
                crystal: 1e4,
                deut: 0
            },
            408: {
                metal: 5e4,
                crystal: 5e4,
                deut: 0
            },
            502: {
                metal: 8e3,
                crystal: 0,
                deut: 2e3
            },
            503: {
                metal: 12e3,
                crystal: 2500,
                deut: 1e4
            },
            11101: {
                type: "building",
                lifeform: "human",
                metal: 7,
                crystal: 2,
                deut: 0,
                priceFactor: 1.2,
                bonus1BaseValue: 210,
                bonus1IncreaseFactor: 1.21,
                bonus2BaseValue: 16,
                bonus2IncreaseFactor: 1.2,
                bonus3Value: 9,
                bonus3IncreaseFactor: 1.15,
                durationfactor: 1.21,
                durationbase: 40
            },
            11102: {
                type: "building",
                lifeform: "human",
                metal: 5,
                crystal: 2,
                deut: 0,
                energy: 8,
                priceFactor: 1.23,
                energyIncreaseFactor: 1.02,
                bonus1BaseValue: 10,
                bonus1IncreaseFactor: 1.15,
                bonus2BaseValue: 10,
                bonus2IncreaseFactor: 1.14,
                durationfactor: 1.25,
                durationbase: 40
            },
            11103: {
                type: "building",
                lifeform: "human",
                metal: 2e4,
                crystal: 25e3,
                deut: 1e4,
                energy: 10,
                priceFactor: 1.3,
                energyIncreaseFactor: 1.08,
                bonus1BaseValue: .25,
                bonus1IncreaseFactor: 1,
                bonus1Max: .25,
                bonus2BaseValue: 2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.25,
                durationbase: 16e3
            },
            11104: {
                type: "building",
                lifeform: "human",
                metal: 5e3,
                crystal: 3200,
                deut: 1500,
                energy: 15,
                priceFactor: 1.7,
                energyIncreaseFactor: 1.25,
                bonus1BaseValue: 2e7,
                bonus1IncreaseFactor: 1.1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.6,
                durationbase: 16e3
            },
            11105: {
                type: "building",
                lifeform: "human",
                metal: 5e4,
                crystal: 4e4,
                deut: 5e4,
                energy: 30,
                priceFactor: 1.7,
                energyIncreaseFactor: 1.25,
                bonus1BaseValue: 1e8,
                bonus1IncreaseFactor: 1.1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.7,
                durationbase: 64e3
            },
            11106: {
                type: "building",
                lifeform: "human",
                metal: 9e3,
                crystal: 6e3,
                deut: 3e3,
                energy: 40,
                priceFactor: 1.5,
                energyIncreaseFactor: 1.1,
                bonus1BaseValue: 1.5,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 2e3
            },
            11107: {
                type: "building",
                lifeform: "human",
                metal: 25e3,
                crystal: 13e3,
                deut: 7e3,
                priceFactor: 1.09,
                bonus1BaseValue: 1,
                bonus1IncreaseFactor: 1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                bonus2Max: .8,
                bonus3Value: .8,
                bonus3IncreaseFactor: 1,
                durationfactor: 1.17,
                durationbase: 12e3
            },
            11108: {
                type: "building",
                lifeform: "human",
                metal: 5e4,
                crystal: 25e3,
                deut: 15e3,
                energy: 80,
                priceFactor: 1.5,
                energyIncreaseFactor: 1.1,
                bonus1BaseValue: 1.5,
                bonus1IncreaseFactor: 1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 28e3
            },
            11109: {
                type: "building",
                lifeform: "human",
                metal: 75e3,
                crystal: 2e4,
                deut: 25e3,
                energy: 50,
                priceFactor: 1.09,
                energyIncreaseFactor: 1.02,
                bonus1BaseValue: 1.5,
                bonus1IncreaseFactor: 1,
                bonus2BaseValue: 1.5,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 4e4
            },
            11110: {
                type: "building",
                lifeform: "human",
                metal: 15e4,
                crystal: 3e4,
                deut: 15e3,
                energy: 60,
                priceFactor: 1.12,
                energyIncreaseFactor: 1.03,
                bonus1BaseValue: 5,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 52e3
            },
            11111: {
                type: "building",
                lifeform: "human",
                metal: 8e4,
                crystal: 35e3,
                deut: 6e4,
                energy: 90,
                priceFactor: 1.5,
                energyIncreaseFactor: 1.05,
                bonus1BaseValue: .5,
                bonus1IncreaseFactor: 1,
                bonus1Max: 1,
                durationfactor: 1.3,
                durationbase: 9e4
            },
            11112: {
                type: "building",
                lifeform: "human",
                metal: 25e4,
                crystal: 125e3,
                deut: 125e3,
                energy: 100,
                priceFactor: 1.15,
                energyIncreaseFactor: 1.02,
                bonus1BaseValue: 3,
                bonus1IncreaseFactor: 1,
                bonus1Max: .9,
                durationfactor: 1.2,
                durationbase: 95e3
            },
            11201: {
                type: "tech 1",
                lifeform: "human",
                metal: 5e3,
                crystal: 2500,
                deut: 500,
                priceFactor: 1.3,
                bonus1BaseValue: 1,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 1e3
            },
            11202: {
                type: "tech 2",
                lifeform: "human",
                metal: 7e3,
                crystal: 1e4,
                deut: 5e3,
                priceFactor: 1.5,
                bonus1BaseValue: .06,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 2e3
            },
            11203: {
                type: "tech 3",
                lifeform: "human",
                metal: 15e3,
                crystal: 1e4,
                deut: 5e3,
                priceFactor: 1.3,
                bonus1BaseValue: .5,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 2500
            },
            11204: {
                type: "tech 4",
                lifeform: "human",
                metal: 2e4,
                crystal: 15e3,
                deut: 7500,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 3500
            },
            11205: {
                type: "tech 5",
                lifeform: "human",
                metal: 25e3,
                crystal: 2e4,
                deut: 1e4,
                priceFactor: 1.3,
                bonus1BaseValue: 4,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 4500
            },
            11206: {
                type: "tech 6",
                lifeform: "human",
                metal: 35e3,
                crystal: 25e3,
                deut: 15e3,
                priceFactor: 1.5,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .99,
                durationfactor: 1.3,
                durationbase: 5e3
            },
            11207: {
                type: "tech 7",
                lifeform: "human",
                metal: 7e4,
                crystal: 4e4,
                deut: 2e4,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 8e3
            },
            11208: {
                type: "tech 8",
                lifeform: "human",
                metal: 8e4,
                crystal: 5e4,
                deut: 2e4,
                priceFactor: 1.5,
                bonus1BaseValue: .06,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 6e3
            },
            11209: {
                type: "tech 9",
                lifeform: "human",
                metal: 32e4,
                crystal: 24e4,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 6500
            },
            11210: {
                type: "tech 10",
                lifeform: "human",
                metal: 32e4,
                crystal: 24e4,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 7e3
            },
            11211: {
                type: "tech 11",
                lifeform: "human",
                metal: 12e4,
                crystal: 3e4,
                deut: 25e3,
                priceFactor: 1.5,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .99,
                durationfactor: 1.3,
                durationbase: 7500
            },
            11212: {
                type: "tech 12",
                lifeform: "human",
                metal: 1e5,
                crystal: 4e4,
                deut: 3e4,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 1e4
            },
            11213: {
                type: "tech 13",
                lifeform: "human",
                metal: 2e5,
                crystal: 1e5,
                deut: 1e5,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 8500
            },
            11214: {
                type: "tech 14",
                lifeform: "human",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 9e3
            },
            11215: {
                type: "tech 15",
                lifeform: "human",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 9500
            },
            11216: {
                type: "tech 16",
                lifeform: "human",
                metal: 32e4,
                crystal: 24e4,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 1e4
            },
            11217: {
                type: "tech 17",
                lifeform: "human",
                metal: 3e5,
                crystal: 18e4,
                deut: 12e4,
                priceFactor: 1.5,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                bonus1Max: .99,
                durationfactor: 1.3,
                durationbase: 11e3
            },
            11218: {
                type: "tech 18",
                lifeform: "human",
                metal: 5e5,
                crystal: 3e5,
                deut: 2e5,
                priceFactor: 1.2,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                bonus1Max: .99,
                durationfactor: 1.3,
                durationbase: 13e3
            },
            12101: {
                type: "building",
                lifeform: "rocktal",
                metal: 9,
                crystal: 3,
                deut: 0,
                priceFactor: 1.2,
                bonus1BaseValue: 150,
                bonus1IncreaseFactor: 1.216,
                bonus2BaseValue: 12,
                bonus2IncreaseFactor: 1.2,
                bonus3Value: 5,
                bonus3IncreaseFactor: 1.15,
                durationfactor: 1.21,
                durationbase: 40
            },
            12102: {
                type: "building",
                lifeform: "rocktal",
                metal: 7,
                crystal: 2,
                deut: 0,
                energy: 10,
                priceFactor: 1.2,
                energyIncreaseFactor: 1.03,
                bonus1BaseValue: 8,
                bonus1IncreaseFactor: 1.15,
                bonus2BaseValue: 6,
                bonus2IncreaseFactor: 1.14,
                durationfactor: 1.21,
                durationbase: 40
            },
            12103: {
                type: "building",
                lifeform: "rocktal",
                metal: 4e4,
                crystal: 1e4,
                deut: 15e3,
                energy: 15,
                priceFactor: 1.3,
                energyIncreaseFactor: 1.1,
                bonus1BaseValue: .25,
                bonus1IncreaseFactor: 1,
                bonus1Max: .25,
                bonus2BaseValue: 2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.25,
                durationbase: 16e3
            },
            12104: {
                type: "building",
                lifeform: "rocktal",
                metal: 5e3,
                crystal: 3800,
                deut: 1e3,
                energy: 20,
                priceFactor: 1.7,
                energyIncreaseFactor: 1.35,
                bonus1BaseValue: 16e6,
                bonus1IncreaseFactor: 1.14,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.6,
                durationbase: 16e3
            },
            12105: {
                type: "building",
                lifeform: "rocktal",
                metal: 5e4,
                crystal: 4e4,
                deut: 5e4,
                energy: 60,
                priceFactor: 1.65,
                energyIncreaseFactor: 1.3,
                bonus1BaseValue: 9e7,
                bonus1IncreaseFactor: 1.1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.7,
                durationbase: 64e3
            },
            12106: {
                type: "building",
                lifeform: "rocktal",
                metal: 1e4,
                crystal: 8e3,
                deut: 1e3,
                energy: 40,
                priceFactor: 1.4,
                energyIncreaseFactor: 1.1,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 2e3
            },
            12107: {
                type: "building",
                lifeform: "rocktal",
                metal: 2e4,
                crystal: 15e3,
                deut: 1e4,
                priceFactor: 1.2,
                bonus1BaseValue: 1.5,
                bonus1IncreaseFactor: 1,
                bonus2BaseValue: .5,
                bonus2IncreaseFactor: 1,
                bonus2Max: .4,
                durationfactor: 1.25,
                durationbase: 16e3
            },
            12108: {
                type: "building",
                lifeform: "rocktal",
                metal: 5e4,
                crystal: 35e3,
                deut: 15e3,
                energy: 80,
                priceFactor: 1.5,
                energyIncreaseFactor: 1.3,
                bonus1BaseValue: 1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                bonus2Max: .5,
                durationfactor: 1.4,
                durationbase: 4e4
            },
            12109: {
                type: "building",
                lifeform: "rocktal",
                metal: 85e3,
                crystal: 44e3,
                deut: 25e3,
                energy: 90,
                priceFactor: 1.4,
                energyIncreaseFactor: 1.1,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 4e4
            },
            12110: {
                type: "building",
                lifeform: "rocktal",
                metal: 12e4,
                crystal: 5e4,
                deut: 2e4,
                energy: 90,
                priceFactor: 1.4,
                energyIncreaseFactor: 1.1,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 52e3
            },
            12111: {
                type: "building",
                lifeform: "rocktal",
                metal: 25e4,
                crystal: 15e4,
                deut: 1e5,
                energy: 120,
                priceFactor: 1.8,
                energyIncreaseFactor: 1.3,
                bonus1BaseValue: .5,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                durationfactor: 1.3,
                durationbase: 9e4
            },
            12112: {
                type: "building",
                lifeform: "rocktal",
                metal: 25e4,
                crystal: 125e3,
                deut: 125e3,
                energy: 100,
                priceFactor: 1.5,
                energyIncreaseFactor: 1.1,
                bonus1BaseValue: .6,
                bonus1IncreaseFactor: 1,
                bonus1Max: .3,
                durationfactor: 1.3,
                durationbase: 95e3
            },
            12201: {
                type: "tech 1",
                lifeform: "rocktal",
                metal: 1e4,
                crystal: 6e3,
                deut: 1e3,
                priceFactor: 1.5,
                bonus1BaseValue: .25,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 1e3
            },
            12202: {
                type: "tech 2",
                lifeform: "rocktal",
                metal: 7500,
                crystal: 12500,
                deut: 5e3,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 2e3
            },
            12203: {
                type: "tech 3",
                lifeform: "rocktal",
                metal: 15e3,
                crystal: 1e4,
                deut: 5e3,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 2500
            },
            12204: {
                type: "tech 4",
                lifeform: "rocktal",
                metal: 2e4,
                crystal: 15e3,
                deut: 7500,
                priceFactor: 1.3,
                bonus1BaseValue: .4,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 3500
            },
            12205: {
                type: "tech 5",
                lifeform: "rocktal",
                metal: 25e3,
                crystal: 2e4,
                deut: 1e4,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 4500
            },
            12206: {
                type: "tech 6",
                lifeform: "rocktal",
                metal: 5e4,
                crystal: 5e4,
                deut: 2e4,
                priceFactor: 1.5,
                bonus1BaseValue: .25,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 5e3
            },
            12207: {
                type: "tech 7",
                lifeform: "rocktal",
                metal: 7e4,
                crystal: 4e4,
                deut: 2e4,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 5500
            },
            12208: {
                type: "tech 8",
                lifeform: "rocktal",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 6e3
            },
            12209: {
                type: "tech 9",
                lifeform: "rocktal",
                metal: 75e3,
                crystal: 55e3,
                deut: 25e3,
                priceFactor: 1.5,
                bonus1BaseValue: .15,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .3,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 6500
            },
            12210: {
                type: "tech 10",
                lifeform: "rocktal",
                metal: 85e3,
                crystal: 4e4,
                deut: 35e3,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 7e3
            },
            12211: {
                type: "tech 11",
                lifeform: "rocktal",
                metal: 12e4,
                crystal: 3e4,
                deut: 25e3,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 7500
            },
            12212: {
                type: "tech 12",
                lifeform: "rocktal",
                metal: 1e5,
                crystal: 4e4,
                deut: 3e4,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 8e3
            },
            12213: {
                type: "tech 13",
                lifeform: "rocktal",
                metal: 2e5,
                crystal: 1e5,
                deut: 1e5,
                priceFactor: 1.2,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 8500
            },
            12214: {
                type: "tech 14",
                lifeform: "rocktal",
                metal: 22e4,
                crystal: 11e4,
                deut: 11e4,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 9e3
            },
            12215: {
                type: "tech 15",
                lifeform: "rocktal",
                metal: 24e4,
                crystal: 12e4,
                deut: 12e4,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 9500
            },
            12216: {
                type: "tech 16",
                lifeform: "rocktal",
                metal: 25e4,
                crystal: 25e4,
                deut: 25e4,
                priceFactor: 1.4,
                bonus1BaseValue: .5,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 1e4
            },
            12217: {
                type: "tech 17",
                lifeform: "rocktal",
                metal: 5e5,
                crystal: 3e5,
                deut: 2e5,
                priceFactor: 1.5,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 13e3
            },
            12218: {
                type: "tech 18",
                lifeform: "rocktal",
                metal: 3e5,
                crystal: 18e4,
                deut: 12e4,
                priceFactor: 1.7,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 11e3
            },
            13101: {
                type: "building",
                lifeform: "mecha",
                metal: 6,
                crystal: 2,
                deut: 0,
                priceFactor: 1.21,
                bonus1BaseValue: 500,
                bonus1IncreaseFactor: 1.205,
                bonus2BaseValue: 24,
                bonus2IncreaseFactor: 1.2,
                bonus3Value: 22,
                bonus3IncreaseFactor: 1.15,
                durationfactor: 1.22,
                durationbase: 40
            },
            13102: {
                type: "building",
                lifeform: "mecha",
                metal: 5,
                crystal: 2,
                deut: 0,
                energy: 8,
                priceFactor: 1.18,
                energyIncreaseFactor: 1.02,
                bonus1BaseValue: 18,
                bonus1IncreaseFactor: 1.15,
                bonus2BaseValue: 23,
                bonus2IncreaseFactor: 1.12,
                durationfactor: 1.2,
                durationbase: 48
            },
            13103: {
                type: "building",
                lifeform: "mecha",
                metal: 3e4,
                crystal: 2e4,
                deut: 1e4,
                energy: 13,
                priceFactor: 1.3,
                energyIncreaseFactor: 1.08,
                bonus1BaseValue: .25,
                bonus1IncreaseFactor: 1,
                bonus1Max: .25,
                bonus2BaseValue: 2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.25,
                durationbase: 16e3
            },
            13104: {
                type: "building",
                lifeform: "mecha",
                metal: 5e3,
                crystal: 3800,
                deut: 1e3,
                energy: 10,
                priceFactor: 1.8,
                energyIncreaseFactor: 1.2,
                bonus1BaseValue: 4e7,
                bonus1IncreaseFactor: 1.1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.6,
                durationbase: 16e3
            },
            13105: {
                type: "building",
                lifeform: "mecha",
                metal: 5e4,
                crystal: 4e4,
                deut: 5e4,
                energy: 40,
                priceFactor: 1.8,
                energyIncreaseFactor: 1.2,
                bonus1BaseValue: 13e7,
                bonus1IncreaseFactor: 1.1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.7,
                durationbase: 64e3
            },
            13106: {
                type: "building",
                lifeform: "mecha",
                metal: 7500,
                crystal: 7e3,
                deut: 1e3,
                priceFactor: 1.3,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                bonus1Max: .99,
                durationfactor: 1.3,
                durationbase: 2e3
            },
            13107: {
                type: "building",
                lifeform: "mecha",
                metal: 35e3,
                crystal: 15e3,
                deut: 1e4,
                energy: 40,
                priceFactor: 1.5,
                energyIncreaseFactor: 1.05,
                bonus1BaseValue: 1,
                bonus1IncreaseFactor: 1,
                bonus1Max: 1,
                bonus2BaseValue: .3,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 16e3
            },
            13108: {
                type: "building",
                lifeform: "mecha",
                metal: 5e4,
                crystal: 2e4,
                deut: 3e4,
                energy: 40,
                priceFactor: 1.07,
                energyIncreaseFactor: 1.01,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                bonus2BaseValue: 2,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.17,
                durationbase: 12e3
            },
            13109: {
                type: "building",
                lifeform: "mecha",
                metal: 1e5,
                crystal: 1e4,
                deut: 3e3,
                energy: 80,
                priceFactor: 1.14,
                energyIncreaseFactor: 1.04,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                bonus2BaseValue: 6,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 4e4
            },
            13110: {
                type: "building",
                lifeform: "mecha",
                metal: 1e5,
                crystal: 4e4,
                deut: 2e4,
                energy: 60,
                priceFactor: 1.5,
                energyIncreaseFactor: 1.1,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 52e3
            },
            13111: {
                type: "building",
                lifeform: "mecha",
                metal: 55e3,
                crystal: 5e4,
                deut: 3e4,
                energy: 70,
                priceFactor: 1.5,
                energyIncreaseFactor: 1.05,
                bonus1BaseValue: .4,
                bonus1IncreaseFactor: 1,
                bonus1Max: 1,
                durationfactor: 1.3,
                durationbase: 5e4
            },
            13112: {
                type: "building",
                lifeform: "mecha",
                metal: 25e4,
                crystal: 125e3,
                deut: 125e3,
                energy: 100,
                priceFactor: 1.4,
                energyIncreaseFactor: 1.05,
                bonus1BaseValue: 1.3,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                durationfactor: 1.4,
                durationbase: 95e3
            },
            13201: {
                type: "tech 1",
                lifeform: "mecha",
                metal: 1e4,
                crystal: 6e3,
                deut: 1e3,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 1e3
            },
            13202: {
                type: "tech 2",
                lifeform: "mecha",
                metal: 7500,
                crystal: 12500,
                deut: 5e3,
                priceFactor: 1.3,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 2e3
            },
            13203: {
                type: "tech 3",
                lifeform: "mecha",
                metal: 15e3,
                crystal: 1e4,
                deut: 5e3,
                priceFactor: 1.5,
                bonus1BaseValue: .03,
                bonus1IncreaseFactor: 1,
                bonus1Max: .3,
                durationfactor: 1.4,
                durationbase: 2500
            },
            13204: {
                type: "tech 4",
                lifeform: "mecha",
                metal: 2e4,
                crystal: 15e3,
                deut: 7500,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 3500
            },
            13205: {
                type: "tech 5",
                lifeform: "mecha",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 4500
            },
            13206: {
                type: "tech 6",
                lifeform: "mecha",
                metal: 5e4,
                crystal: 5e4,
                deut: 2e4,
                priceFactor: 1.5,
                bonus1BaseValue: .06,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 5e3
            },
            13207: {
                type: "tech 7",
                lifeform: "mecha",
                metal: 7e4,
                crystal: 4e4,
                deut: 2e4,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 5500
            },
            13208: {
                type: "tech 8",
                lifeform: "mecha",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: 1,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 6e3
            },
            13209: {
                type: "tech 9",
                lifeform: "mecha",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 6500
            },
            13210: {
                type: "tech 10",
                lifeform: "mecha",
                metal: 85e3,
                crystal: 4e4,
                deut: 35e3,
                priceFactor: 1.2,
                bonus1BaseValue: .15,
                bonus1IncreaseFactor: 1,
                bonus1Max: .9,
                durationfactor: 1.3,
                durationbase: 7e3
            },
            13211: {
                type: "tech 11",
                lifeform: "mecha",
                metal: 12e4,
                crystal: 3e4,
                deut: 25e3,
                priceFactor: 1.3,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 7500
            },
            13212: {
                type: "tech 12",
                lifeform: "mecha",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 8e3
            },
            13213: {
                type: "tech 13",
                lifeform: "mecha",
                metal: 2e5,
                crystal: 1e5,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .06,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 8500
            },
            13214: {
                type: "tech 14",
                lifeform: "mecha",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 9e3
            },
            13215: {
                type: "tech 15",
                lifeform: "mecha",
                metal: 32e4,
                crystal: 24e4,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 9500
            },
            13216: {
                type: "tech 16",
                lifeform: "mecha",
                metal: 32e4,
                crystal: 24e4,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 1e4
            },
            13217: {
                type: "tech 17",
                lifeform: "mecha",
                metal: 5e5,
                crystal: 3e5,
                deut: 2e5,
                priceFactor: 1.5,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 13e3
            },
            13218: {
                type: "tech 18",
                lifeform: "mecha",
                metal: 3e5,
                crystal: 18e4,
                deut: 12e4,
                priceFactor: 1.7,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 11e3
            },
            14101: {
                type: "building",
                lifeform: "kaelesh",
                metal: 4,
                crystal: 3,
                deut: 0,
                priceFactor: 1.21,
                bonus1BaseValue: 250,
                bonus1IncreaseFactor: 1.21,
                bonus2BaseValue: 16,
                bonus2IncreaseFactor: 1.2,
                bonus3Value: 11,
                bonus3IncreaseFactor: 1.15,
                durationfactor: 1.22,
                durationbase: 40
            },
            14102: {
                type: "building",
                lifeform: "kaelesh",
                metal: 6,
                crystal: 3,
                deut: 0,
                energy: 9,
                priceFactor: 1.2,
                energyIncreaseFactor: 1.02,
                bonus1BaseValue: 12,
                bonus1IncreaseFactor: 1.15,
                bonus2BaseValue: 12,
                bonus2IncreaseFactor: 1.14,
                durationfactor: 1.22,
                durationbase: 40
            },
            14103: {
                type: "building",
                lifeform: "kaelesh",
                metal: 2e4,
                crystal: 15e3,
                deut: 15e3,
                energy: 10,
                priceFactor: 1.3,
                energyIncreaseFactor: 1.08,
                bonus1BaseValue: .25,
                bonus1IncreaseFactor: 1,
                bonus1Max: .25,
                bonus2BaseValue: 2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.25,
                durationbase: 16e3
            },
            14104: {
                type: "building",
                lifeform: "kaelesh",
                metal: 7500,
                crystal: 5e3,
                deut: 800,
                energy: 15,
                priceFactor: 1.8,
                energyIncreaseFactor: 1.3,
                bonus1BaseValue: 3e7,
                bonus1IncreaseFactor: 1.1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.7,
                durationbase: 16e3
            },
            14105: {
                type: "building",
                lifeform: "kaelesh",
                metal: 6e4,
                crystal: 3e4,
                deut: 5e4,
                energy: 30,
                priceFactor: 1.8,
                energyIncreaseFactor: 1.3,
                bonus1BaseValue: 1e8,
                bonus1IncreaseFactor: 1.1,
                bonus2BaseValue: 1,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.8,
                durationbase: 64e3
            },
            14106: {
                type: "building",
                lifeform: "kaelesh",
                metal: 8500,
                crystal: 5e3,
                deut: 3e3,
                priceFactor: 1.25,
                bonus1BaseValue: 1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                durationfactor: 1.35,
                durationbase: 2e3
            },
            14107: {
                type: "building",
                lifeform: "kaelesh",
                metal: 15e3,
                crystal: 15e3,
                deut: 5e3,
                priceFactor: 1.2,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 12e3
            },
            14108: {
                type: "building",
                lifeform: "kaelesh",
                metal: 75e3,
                crystal: 25e3,
                deut: 3e4,
                energy: 30,
                priceFactor: 1.05,
                energyIncreaseFactor: 1.03,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                bonus2BaseValue: 6,
                bonus2IncreaseFactor: 1,
                durationfactor: 1.18,
                durationbase: 16e3
            },
            14109: {
                type: "building",
                lifeform: "kaelesh",
                metal: 87500,
                crystal: 25e3,
                deut: 3e4,
                energy: 40,
                priceFactor: 1.2,
                energyIncreaseFactor: 1.02,
                bonus1BaseValue: 200,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 4e4
            },
            14110: {
                type: "building",
                lifeform: "kaelesh",
                metal: 15e4,
                crystal: 3e4,
                deut: 3e4,
                energy: 140,
                priceFactor: 1.4,
                energyIncreaseFactor: 1.05,
                bonus1BaseValue: 2,
                bonus1IncreaseFactor: 1,
                bonus1Max: .3,
                durationfactor: 1.8,
                durationbase: 52e3
            },
            14111: {
                type: "building",
                lifeform: "kaelesh",
                metal: 75e3,
                crystal: 5e4,
                deut: 55e3,
                energy: 90,
                priceFactor: 1.2,
                energyIncreaseFactor: 1.04,
                bonus1BaseValue: 1.5,
                bonus1IncreaseFactor: 1,
                bonus1Max: .7,
                durationfactor: 1.3,
                durationbase: 9e4
            },
            14112: {
                type: "building",
                lifeform: "kaelesh",
                metal: 5e5,
                crystal: 25e4,
                deut: 25e4,
                energy: 100,
                priceFactor: 1.4,
                energyIncreaseFactor: 1.05,
                bonus1BaseValue: .5,
                bonus1IncreaseFactor: 1,
                bonus1Max: .3,
                durationfactor: 1.3,
                durationbase: 95e3
            },
            14201: {
                type: "tech 1",
                lifeform: "kaelesh",
                metal: 1e4,
                crystal: 6e3,
                deut: 1e3,
                priceFactor: 1.5,
                bonus1BaseValue: .03,
                bonus1IncreaseFactor: 1,
                bonus1Max: .3,
                durationfactor: 1.4,
                durationbase: 1e3
            },
            14202: {
                type: "tech 2",
                lifeform: "kaelesh",
                metal: 7500,
                crystal: 12500,
                deut: 5e3,
                priceFactor: 1.5,
                bonus1BaseValue: .08,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 2e3
            },
            14203: {
                type: "tech 3",
                lifeform: "kaelesh",
                metal: 15e3,
                crystal: 1e4,
                deut: 5e3,
                priceFactor: 1.5,
                bonus1BaseValue: .05,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                durationfactor: 1.4,
                durationbase: 2500
            },
            14204: {
                type: "tech 4",
                lifeform: "kaelesh",
                metal: 2e4,
                crystal: 15e3,
                deut: 7500,
                priceFactor: 1.5,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 3500
            },
            14205: {
                type: "tech 5",
                lifeform: "kaelesh",
                metal: 25e3,
                crystal: 2e4,
                deut: 1e4,
                priceFactor: 1.5,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 4500
            },
            14206: {
                type: "tech 6",
                lifeform: "kaelesh",
                metal: 5e4,
                crystal: 5e4,
                deut: 2e4,
                priceFactor: 1.3,
                bonus1BaseValue: .4,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 5e3
            },
            14207: {
                type: "tech 7",
                lifeform: "kaelesh",
                metal: 7e4,
                crystal: 4e4,
                deut: 2e4,
                priceFactor: 1.5,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .99,
                durationfactor: 1.3,
                durationbase: 5500
            },
            14208: {
                type: "tech 8",
                lifeform: "kaelesh",
                metal: 8e4,
                crystal: 5e4,
                deut: 2e4,
                priceFactor: 1.2,
                bonus1BaseValue: .6,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 6e3
            },
            14209: {
                type: "tech 9",
                lifeform: "kaelesh",
                metal: 32e4,
                crystal: 24e4,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 6500
            },
            14210: {
                type: "tech 10",
                lifeform: "kaelesh",
                metal: 85e3,
                crystal: 4e4,
                deut: 35e3,
                priceFactor: 1.2,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.2,
                durationbase: 7e3
            },
            14211: {
                type: "tech 11",
                lifeform: "kaelesh",
                metal: 12e4,
                crystal: 3e4,
                deut: 25e3,
                priceFactor: 1.5,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 7500
            },
            14212: {
                type: "tech 12",
                lifeform: "kaelesh",
                metal: 1e5,
                crystal: 4e4,
                deut: 3e4,
                priceFactor: 1.5,
                bonus1BaseValue: .06,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.3,
                durationbase: 8e3
            },
            14213: {
                type: "tech 13",
                lifeform: "kaelesh",
                metal: 2e5,
                crystal: 1e5,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                bonus1Max: .99,
                durationfactor: 1.3,
                durationbase: 8500
            },
            14214: {
                type: "tech 14",
                lifeform: "kaelesh",
                metal: 16e4,
                crystal: 12e4,
                deut: 5e4,
                priceFactor: 1.5,
                bonus1BaseValue: 1,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 9e3
            },
            14215: {
                type: "tech 15",
                lifeform: "kaelesh",
                metal: 24e4,
                crystal: 12e4,
                deut: 12e4,
                priceFactor: 1.5,
                bonus1BaseValue: .1,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 9500
            },
            14216: {
                type: "tech 16",
                lifeform: "kaelesh",
                metal: 32e4,
                crystal: 24e4,
                deut: 1e5,
                priceFactor: 1.5,
                bonus1BaseValue: .3,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 1e4
            },
            14217: {
                type: "tech 17",
                lifeform: "kaelesh",
                metal: 5e5,
                crystal: 3e5,
                deut: 2e5,
                priceFactor: 1.5,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                bonus1Max: .5,
                bonus2BaseValue: .2,
                bonus2IncreaseFactor: 1,
                bonus2Max: .99,
                durationfactor: 1.3,
                durationbase: 13e3
            },
            14218: {
                type: "tech 18",
                lifeform: "kaelesh",
                metal: 3e5,
                crystal: 18e4,
                deut: 12e4,
                priceFactor: 1.7,
                bonus1BaseValue: .2,
                bonus1IncreaseFactor: 1,
                durationfactor: 1.4,
                durationbase: 11e3
            }
        }[parseInt(id)];
    }
}

let css = `
/*css*/

:root
{
    --ogl:#FFB800;
    --primary:linear-gradient(to bottom, #171d23, #101419);
    --secondary:linear-gradient(192deg, #252e3a, #171c24 70%);
    --secondaryReversed:linear-gradient(176deg, #252e3a, #171c24 70%);
    --tertiary:linear-gradient(to bottom, #293746, #212a36 max(5%, 8px), #171c24 max(14%, 20px));

    --date:#9c9cd7;
    --time:#85c1d3;
    --texthighlight:#6dbbb3;

    --metal:hsl(229.85deg 48.01% 62.14%);
    --crystal:hsl(201.27deg 73.83% 75.93%);
    --deut:hsl(166.15deg 41.73% 62.16%);
    --metal:hsl(240deg 24% 68%);
    --crystal:hsl(199deg 72% 74%);
    --deut:hsl(172deg 45% 46%);
    --energy:#f5bbb4;
    --dm:#b58cdb;
    --food:hsl(316deg 21% 70%);
    --artefact:#cda126;
    --population:#ccc;
    --lifeform:#d569b8;
    --msu:#c7c7c7;

    --nothing:#ddd;
    --resource:#86edfd;
    --ship:#1dd1a1;
    --pirate:#ffd60b;
    --alien:#5ce724;
    --item:#bf6c4d;
    --blackhole:#818181;
    --early:#79a2ff;
    --late:#df5252;
    --trader:#ff7d30;

    --red:#f9392b;
    --pink:#ff7ba8;
    --purple:#ba68c8;
    --indigo:#7e57c2;
    --blue:#3f51b5;
    --cyan:#29b6f6;
    --teal:#06a98b;
    --green:#4caf50;
    --lime:#97b327;
    --yellow:#fbea20;
    --amber:#ffa000;
    --orange:#f38b3f;
    --brown:#5d4037;
    --grey:#607d8b;

    --mission1:#ef5f5f;
    --mission2:#ef5f5f;
    --mission3:#66cd3d;
    --mission4:#00c5b2;
    --mission5:#d97235;
    --mission6:#e9c74b;
    --mission7:#5ae8ea;
    --mission8:#0cc14a;
    --mission10:#97b0c3;
    --mission15:#527dcb;
    --mission18:#7eacb5;

    --inactive:#b3b3b3;
    --longInactive:#767676;
    --banned:#ebb3b3;
    --vacation:#00ffff;
    --honorable:#FFFF66;
}

body[data-colorblind="true"]
{
    --vacation:#8592f5;
    --honorable:#f9ce27;
}

.material-icons
{
    direction:ltr;
    display:inline-block;
    font-family:'Material Icons' !important;
    font-weight:normal !important;
    font-style:normal !important;
    font-size:inherit !important;
    image-rendering:pixelated;
    line-height:inherit !important;
    letter-spacing:normal;
    user-select:none;
    text-transform:none;
    transform:rotate(0.03deg);
    white-space:nowrap;
    word-wrap:normal;
    -webkit-font-feature-settings:'liga';
    font-feature-settings:'liga';
    -webkit-font-smoothing:antialiased;
}

/*body
{
    background-attachment:fixed;
}*/

/*body
{
    background-size:cover !important;
}

@-moz-document url-prefix()
{
    body
    {
        background-size:unset !important;
    }
}*/

body.ogl_destinationPicker #planetList:before
{
    /*animation:border-dance 1s infinite linear;
    background-image:linear-gradient(90deg, var(--ogl) 50%, transparent 50%), linear-gradient(90deg, var(--ogl) 50%, transparent 50%), linear-gradient(0deg, var(--ogl) 50%, transparent 50%), linear-gradient(0deg, var(--ogl) 50%, transparent 50%);
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size: 15px 2px, 15px 2px, 2px 15px, 2px 15px;
    background-position: left top, right bottom, left bottom, right top;*/
    border:2px solid #fff;
    bottom:-2px;
    content:'';
    left:-2px;
    pointer-events:none;
    position:absolute;
    right:-2px;
    top:-2px;
    z-index:2;
}

/*@keyframes border-dance
{
    0% { background-position:left top, right bottom, left bottom, right top; }
    100% { background-position:left 15px top, right 15px bottom, left bottom 15px, right top 15px; }
}*/

line.ogl_line
{
    filter:drop-shadow(0 0 6px #000);
    marker-end:url(#arrow);
    marker-start:url(#circle);
    stroke:#ffffff;
    stroke-width:2px;
}

.ui-front:not([aria-describedby="fleetTemplatesEdit"]):not(.errorBox):not(:has(#rocketattack))
{
    z-index:9999 !important;
}

.ui-widget-overlay
{
    z-index:9998 !important;
}

.ogl_unit
{
    white-space:nowrap;
}

.ogl_suffix
{
    display:inline-block;
    font-size:smaller;
    margin-left:2px;
}

.ogl_text { color:var(--ogl) !important; }

.ogl_metal, #resources_metal, .resource.metal, resource-icon.metal .amount { color:var(--metal) !important; }
.ogl_crystal, #resources_crystal, .resource.crystal, resource-icon.crystal .amount  { color:var(--crystal) !important; }
.ogl_deut, #resources_deuterium, .resource.deuterium, resource-icon.deuterium .amount  { color:var(--deut) !important; }
.ogl_food, #resources_food, .resource.food, resource-icon.food .amount  { color:var(--food) !important; }
.ogl_dm, #resources_darkmatter, .resource.darkmatter  { color:var(--dm) !important; }
.ogl_energy, #resources_energy, .resource.energy, resource-icon.energy .amount  { color:var(--energy) !important; }
.ogl_population, #resources_population, .resource.population, resource-icon.population .amount  { color:var(--population) !important; }
.ogl_artefact { color:var(--artefact) !important; }
[class*="ogl_lifeform"] { color:var(--lifeform) !important; }
.ogl_msu { color:var(--msu) !important; }

.ogl_mission1, [data-mission-type="1"]:not(.fleetDetails) .detailsFleet { color:var(--mission1) !important; }
.ogl_mission2, [data-mission-type="2"]:not(.fleetDetails) .detailsFleet { color:var(--mission2) !important; }
.ogl_mission3, [data-mission-type="3"]:not(.fleetDetails) .detailsFleet { color:var(--mission3) !important; }
.ogl_mission4, [data-mission-type="4"]:not(.fleetDetails) .detailsFleet { color:var(--mission4) !important; }
.ogl_mission5, [data-mission-type="5"]:not(.fleetDetails) .detailsFleet { color:var(--mission5) !important; }
.ogl_mission6, [data-mission-type="6"]:not(.fleetDetails) .detailsFleet { color:var(--mission6) !important; }
.ogl_mission7, [data-mission-type="7"]:not(.fleetDetails) .detailsFleet { color:var(--mission7) !important; }
.ogl_mission8, [data-mission-type="8"]:not(.fleetDetails) .detailsFleet { color:var(--mission8) !important; }
.ogl_mission9, [data-mission-type="9"]:not(.fleetDetails) .detailsFleet { color:var(--mission9) !important; }
.ogl_mission10, [data-mission-type="10"]:not(.fleetDetails) .detailsFleet { color:var(--mission10) !important; }
.ogl_mission11, [data-mission-type="11"]:not(.fleetDetails) .detailsFleet { color:var(--mission11) !important; }
.ogl_mission12, [data-mission-type="12"]:not(.fleetDetails) .detailsFleet { color:var(--mission12) !important; }
.ogl_mission13, [data-mission-type="13"]:not(.fleetDetails) .detailsFleet { color:var(--mission13) !important; }
.ogl_mission14, [data-mission-type="14"]:not(.fleetDetails) .detailsFleet { color:var(--mission14) !important; }
.ogl_mission15, [data-mission-type="15"]:not(.fleetDetails) .detailsFleet { color:var(--mission15) !important; }
.ogl_mission18, [data-mission-type="18"]:not(.fleetDetails) .detailsFleet { color:var(--mission18) !important; }

[data-mission-type] { background: #121b22 !important; }
[data-mission-type] .detailsFleet span { filter:brightness(1.5) saturate(.8); }

[data-mission-type="1"] { background:linear-gradient(to right, #121b22, #482018, #121b22) !important; }
[data-mission-type="2"] { background:linear-gradient(to right, #121b22, #54271f, #121b22) !important; }
[data-mission-type="3"] { background:linear-gradient(to right, #121b22, #2c4a14, #121b22) !important; }
[data-mission-type="4"] { background:linear-gradient(to right, #121b22, #104841, #121b22) !important; }
[data-mission-type="5"] { background:linear-gradient(to right, #121b22, #643d25, #121b22) !important; }
[data-mission-type="6"] { background:linear-gradient(to right, #121b22, #4c401f, #121b22) !important; }
[data-mission-type="7"] { background:linear-gradient(to right, #121b22, #214350, #121b22) !important; }
[data-mission-type="8"] { background:linear-gradient(to right, #121b22, #004011, #121b22) !important; }
[data-mission-type="9"] { background:linear-gradient(to right, #121b22, #4a1b14, #121b22) !important; }
[data-mission-type="10"] { background:linear-gradient(to right, #121b22, #3f4b54, #121b22) !important; }
[data-mission-type="15"] { background:linear-gradient(to right, #121b22, #182542, #121b22) !important; }
[data-mission-type="18"] { background:linear-gradient(to right, #121b22, #203642, #121b22) !important; }

.ogl_icon, .ogl_metal.ogl_icon, .ogl_crystal.ogl_icon, .ogl_deut.ogl_icon, .ogl_food.ogl_icon,
.ogl_dm.ogl_icon, .ogl_energy.ogl_icon, .ogl_artefact.ogl_icon, .ogl_population.ogl_icon,
.ogl_icon[class*="ogl_2"], .ogl_icon[class*="ogl_mission"], .ogl_icon[class*="ogl_lifeform"],
.ogl_icon.ogl_msu
{
    align-items:center;
    border-radius:3px;
    display:flex;
    padding:3px;
    white-space:nowrap;
}

.ogl_metal.ogl_icon:before, .ogl_crystal.ogl_icon:before, .ogl_deut.ogl_icon:before, .ogl_food.ogl_icon:before,
.ogl_dm.ogl_icon:before, .ogl_energy.ogl_icon:before, .ogl_artefact.ogl_icon:before, .ogl_icon.ogl_population:before,
.ogl_icon.ogl_msu:before
{
    background-image:url(http://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);
    background-size:302px;
    border-radius:3px;
    content:'';
    display:inline-block;
    height:18px;
    image-rendering:pixelated;
    margin-right:10px;
    vertical-align:middle;
    width:28px;
}

.ogl_icon.ogl_metal:before { background-position:1% 11%; }
.ogl_icon.ogl_crystal:before { background-position:16% 11%; }
.ogl_icon.ogl_deut:before { background-position:30% 11%; }
.ogl_icon.ogl_dm:before { background-position:57% 11%; }
.ogl_icon.ogl_energy:before { background-position:43% 11%; }
.ogl_icon.ogl_food:before { background-position:85% 11%; }
.ogl_icon.ogl_population:before { background-position:98% 11%; }

.ogl_icon.ogl_artefact:before
{
    background-image:url(http://image.board.gameforge.com/uploads/ogame/fr/announcement_ogame_fr_59cb6f773531d4ad73e508c140cd2d3c.png);
    background-size:28px;
}

.ogl_miniStats, .ogl_recap, .ogl_stats, .ogl_todoList
{
    .ogl_icon.ogl_metal:before
    {
        background-image:url(http://gf2.geo.gfsrv.net/cdn1c/4230ff01e100a38a72dadfa7de0661.png);
        background-size:28px;
        image-rendering:auto;
    }

    .ogl_icon.ogl_crystal:before
    {
        background-image:url(http://gf1.geo.gfsrv.net/cdn65/596ba85baa74145390e04f7428d93e.png);
        background-size:28px;
        image-rendering:auto;
    }

    .ogl_icon.ogl_deut:before
    {
        background-image:url(http://gf1.geo.gfsrv.net/cdnc0/7a7bf2b8edcd74ebafe31dfbae14aa.png);
        background-size:28px;
        image-rendering:auto;
    }

    .ogl_icon.ogl_dm:before
    {
        background-image:url(http://gf2.geo.gfsrv.net/cdna3/4de426cb95e11af9cdabb901dfe802.png);
        background-size:28px;
        filter:hue-rotate(40deg) saturate(1);
        image-rendering:auto;
    }

    .ogl_icon.ogl_artefact:before
    {
        background-image:url(http://gf1.geo.gfsrv.net/cdn65/596ba85baa74145390e04f7428d93e.png);
        background-size:28px;
        filter:hue-rotate(200deg) saturate(4);
        image-rendering:auto;
        transform:scaleX(-1);
    }
}

.ogl_icon[class*="ogl_2"]:before
{
    background-position:center;
    border-radius:3px;
    content:'';
    display:inline-block;
    height:18px;
    image-rendering:pixelated;
    margin-right:5px;
    vertical-align:text-bottom;
    width:28px;
}

.ogl_icon.ogl_200:before
{
    background:linear-gradient(45deg, #784242, #dd4242);
    content:'close';
    font-family:'Material Icons';
    line-height:18px;
    text-align:center;
}

.ogl_icon.ogl_202:before { background-image:url(http://gf2.geo.gfsrv.net/cdnd9/60555c3c87b9eb3b5ddf76780b5712.jpg); }
.ogl_icon.ogl_203:before { background-image:url(http://gf1.geo.gfsrv.net/cdn34/fdbcc505474e3e108d10a3ed4a19f4.jpg); }
.ogl_icon.ogl_204:before { background-image:url(http://gf2.geo.gfsrv.net/cdnd2/9ed5c1b6aea28fa51f84cdb8cb1e7e.jpg); }
.ogl_icon.ogl_205:before { background-image:url(http://gf1.geo.gfsrv.net/cdnf1/8266a2cbae5ad630c5fedbdf270f3e.jpg); }
.ogl_icon.ogl_206:before { background-image:url(http://gf2.geo.gfsrv.net/cdn45/b7ee4f9d556a0f39dae8d2133e05b7.jpg); }
.ogl_icon.ogl_207:before { background-image:url(http://gf1.geo.gfsrv.net/cdn32/3f4a081f4d15662bed33473db53d5b.jpg); }
.ogl_icon.ogl_208:before { background-image:url(http://gf1.geo.gfsrv.net/cdn6f/41a21e4253d2231f8937ddef1ba43e.jpg); }
.ogl_icon.ogl_209:before { background-image:url(http://gf1.geo.gfsrv.net/cdn07/6246eb3d7fa67414f6b818fa79dd9b.jpg); }
.ogl_icon.ogl_210:before { background-image:url(http://gf3.geo.gfsrv.net/cdnb5/347821e80cafc52aec04f27c3a2a4d.jpg); }
.ogl_icon.ogl_211:before { background-image:url(http://gf1.geo.gfsrv.net/cdnca/4d55a520aed09d0c43e7b962f33e27.jpg); }
.ogl_icon.ogl_213:before { background-image:url(http://gf3.geo.gfsrv.net/cdn2a/c2b9fedc9c93ef22f2739c49fbac52.jpg); }
.ogl_icon.ogl_214:before { background-image:url(http://gf3.geo.gfsrv.net/cdn84/155e9e24fc1d34ed4660de8d428f45.jpg); }
.ogl_icon.ogl_215:before { background-image:url(http://gf3.geo.gfsrv.net/cdn5a/24f511ec14a71e2d83fd750aa0dee2.jpg); }
.ogl_icon.ogl_218:before { background-image:url(http://gf1.geo.gfsrv.net/cdn39/12d016c8bb0d71e053b901560c17cc.jpg); }
.ogl_icon.ogl_219:before { background-image:url(http://gf3.geo.gfsrv.net/cdne2/b8d8d18f2baf674acedb7504c7cc83.jpg); }

.ogl_icon[class*="ogl_mission"]:before
{
    background-image:url(http://gf2.geo.gfsrv.net/cdn14/f45a18b5e55d2d38e7bdc3151b1fee.jpg);
    background-position:0 0;
    background-size:344px !important;
    border-radius:3px;
    content:'';
    display:inline-block;
    height:18px;
    margin-right:10px;
    vertical-align:middle;
    width:28px;
}

.ogl_icon.ogl_mission1:before { background-position:80.2% 0 !important; }
.ogl_icon.ogl_mission2:before { background-position:99.7% 0 !important; }
.ogl_icon.ogl_mission3:before { background-position:50% 0 !important; }
.ogl_icon.ogl_mission4:before { background-position:30% 0 !important; }
.ogl_icon.ogl_mission5:before { background-position:69.5% 0 !important; }
.ogl_icon.ogl_mission6:before { background-position:59.75% 0 !important; }
.ogl_icon.ogl_mission7:before { background-position:20.75% 0 !important; }
.ogl_icon.ogl_mission8:before { background-position:40.1% 0 !important; }
.ogl_icon.ogl_mission9:before { background-position:89% 0 !important; }
.ogl_icon.ogl_mission15:before { background-position:0.2% 0 !important; }
.ogl_icon.ogl_mission18:before { background:url(http://gf2.geo.gfsrv.net/cdna8/1fc8d15445e97c10c7b6881bccabb2.gif); background-size:18px !important; }

.ogl_lifeform0.ogl_icon:before
{
    content:'-';
}

.ogl_lifeform1.ogl_icon:before, .ogl_lifeform2.ogl_icon:before,
.ogl_lifeform3.ogl_icon:before, .ogl_lifeform4.ogl_icon:before
{
    background-image:url(http://gf2.geo.gfsrv.net/cdna5/5681003b4f1fcb30edc5d0e62382a2.png);
    background-size:245px;
    content:'';
    display:inline-block;
    height:24px;
    image-rendering:pixelated;
    vertical-align:middle;
    width:24px;
}

.ogl_icon.ogl_lifeform0:before { background-position:1% 11%; }
.ogl_icon.ogl_lifeform1:before { background-position:0% 86%; }
.ogl_icon.ogl_lifeform2:before { background-position:11% 86%; }
.ogl_icon.ogl_lifeform3:before { background-position:22% 86%; }
.ogl_icon.ogl_lifeform4:before { background-position:33% 86%; }

.ogl_icon.ogl_msu:before
{
    align-items:center;
    background:none;
    color:#fff;
    content:'MSU';
    display:flex;
    font-size:11px;
    justify-content:center;
}

.ogl_gridIcon .ogl_icon
{
    display:grid;
    grid-gap:7px;
    justify-content:center;
    padding-top:6px;
    text-align:center;
}

.ogl_gridIcon .ogl_icon:before
{
    margin:auto;
}

.ogl_header
{
    color:#6F9FC8;
    font-size:11px;
    font-weight:700;
    height:27px;
    line-height:27px;
    position:relative;
    text-align:center;
}

.ogl_header .material-icons
{
    font-size:17px !important;
    line-height:28px !important;
}

.ogl_button, a.ogl_button
{
    background:linear-gradient(to bottom, #405064, #2D3743 2px, #181E25);
    border:1px solid #17191c;
    border-radius:3px;
    color:#b7c1c9 !important;
    cursor:pointer;
    display:inline-block;
    line-height:26px !important;
    padding:0 4px;
    text-align:center;
    text-decoration:none;
    text-shadow:1px 1px #000;
    user-select:none;
}

.ogl_button:hover
{
    color:var(--ogl) !important;
}

.ogl_invisible
{
    visibility:hidden;
}

.ogl_hidden
{
    display:none !important;
}

.ogl_reversed
{
    transform:scaleX(-1);
}

.ogl_textCenter
{
    justify-content:center;
    text-align:center;
}

.ogl_textRight
{
    justify-content:end;
    text-align:right;
}

.ogl_disabled
{
    color:rgba(255,255,255,.2);
    opacity:.5;
    pointer-events:none;
    user-select:none;
}

.ogl_interactive
{
    cursor:pointer;
}

.ogl_noTouch
{
    pointer-events:none !important;
}

.ogl_slidingText
{
    display:inline-flex !important;
    grid-gap:20px;
    overflow:hidden;
    position:relative;
    width:100%;
    white-space:nowrap;
}

.ogl_slidingText:before, .ogl_slidingText:after
{
    animation:textSlideLeft 6s infinite linear;
    content:attr(data-text);
}

@keyframes textSlideLeft
{
    0% { transform:translateX(20px); }
    100% { transform:translateX(-100%); }
}

[data-status="pending"]
{
    pointer-events:none;
    color:orange !important;
}

[data-status="done"]
{
    color:green !important;
}

time
{
    color:var(--time);
}

time span
{
    color:var(--date);
}

.menubutton.ogl_active .textlabel
{
    color:#75ffcc !important;
}

#productionboxBottom time
{
    font-size:11px;
    margin-top:10px;
    text-align:center;
}

[data-output-time], [data-output-date]
{
    color:transparent !important;
    display:inline-grid !important;
    grid-template-columns:auto 6px auto;
    overflow:hidden;
    position:relative;
    user-select:none;
    white-space:nowrap;
}

[data-output-time]:not([data-output-date])
{
    grid-template-columns:0 auto;
}

[data-output-time] span, [data-output-date] span
{
    display:none;
}

[data-output-date]:before
{
    color:var(--date);
    content:attr(data-output-date);
}

[data-output-time]:after
{
    color:var(--time);
    content:attr(data-output-time);
}

[data-output-time="Invalid Date"]
{
    display:none !important;
}

.honorRank.rank_0, .honorRank.rank_undefined
{
    display:none;
}

[data-galaxy]
{
    color:#c3c3c3;
    cursor:pointer;
}

[data-galaxy]:hover
{
    color:#fff;
    text-decoration:underline;
}

[data-galaxy].ogl_active
{
    color:#c3c3c3;
    box-shadow:inset 0 0 0 2px rgba(255, 165, 0, .2);
}

.galaxyCell.cellPlayerName.ogl_active
{
    box-shadow:inset 0 0 0 2px rgba(255, 165, 0, .2);
}

.ogl_tooltip
{
    border-radius:4px;
    box-sizing:border-box;
    font-size:11px;
    left:0;
    opacity:0;
    padding:10px;
    pointer-events:none;
    position:absolute;
    top:0;
    z-index:1000002;
}

.ogl_tooltip:not(:has(.ogl_close))
{
    pointer-events:none !important;
}

.ogl_tooltip:before
{
    border-radius:inherit;
    bottom:10px;
    box-shadow:0 0 15px 5px rgb(0,0,0,.6), 0 0 4px 1px rgba(0,0,0,.7);
    content:'';
    left:10px;
    position:absolute;
    right:10px;
    top:10px;
}

.ogl_tooltip .ogl_tooltipTriangle
{
    background:#171c24;
    box-shadow:0 0 15px 5px rgb(0,0,0,.6), 0 0 4px 1px rgba(0,0,0,.7);
    height:15px;
    pointer-events:none;
    position:absolute;
    width:15px;
}

.ogl_tooltip[data-direction="top"] .ogl_tooltipTriangle
{
    transform:translate(50%, -50%) rotate(45deg);
}

.ogl_tooltip[data-direction="bottom"] .ogl_tooltipTriangle
{
    background:#293746;
    transform:translate(50%, 50%) rotate(45deg);
}

.ogl_tooltip[data-direction="left"] .ogl_tooltipTriangle
{
    transform:translate(-50%, 50%) rotate(45deg);
}

.ogl_tooltip[data-direction="right"] .ogl_tooltipTriangle
{
    transform:translate(50%, 50%) rotate(45deg);
}

.ogl_tooltip .ogl_close
{
    align-items:center;
    background:#7c3434;
    border-radius:4px;
    box-shadow:0 0 8px rgb(0,0,0,.6);
    color:#fff;
    cursor:pointer;
    display:flex !important;
    font-size:16px !important;
    justify-content:center;
    height:22px;
    position:absolute;
    right:0;
    top:0;
    width:22px;
    z-index:1000004;
}

.ogl_tooltip .ogl_close:hover
{
    background:#9f3d3d;
}

.ogl_tooltip.ogl_active
{
    animation-fill-mode:forwards !important;
}

.ogl_tooltip[data-direction="top"].ogl_active
{
    animation:appearTop .1s;
}

@keyframes appearTop
{
    from { opacity:0; margin-top:20px; }
    to { opacity:1; margin-top:0; }
    99% { pointer-events:none; }
    100% { pointer-events:all; }
}

.ogl_tooltip[data-direction="bottom"].ogl_active
{
    animation:appearBottom .1s;
}

@keyframes appearBottom
{
    from { opacity:0; margin-top:-20px; }
    to { opacity:1; margin-top:0; }
    99% { pointer-events:none; }
    100% { pointer-events:all; }
}

.ogl_tooltip[data-direction="left"].ogl_active
{
    animation:appearLeft .1s;
}

@keyframes appearLeft
{
    from { opacity:0; margin-left:20px; }
    to { opacity:1; margin-left:0; }
    99% { pointer-events:none; }
    100% { pointer-events:all; }
}

.ogl_tooltip[data-direction="right"].ogl_active
{
    animation:appearRight .1s;
}

@keyframes appearRight
{
    from { opacity:0; margin-left:-20px; }
    to { opacity:1; margin-left:0; }
    99% { pointer-events:none; }
    100% { pointer-events:all; }
}

.ogl_tooltip hr, .ogl_notification hr
{
    background:#1e252e;
    border:none;
    grid-column:1 / -1;
    height:2px;
    width:100%;
}

.ogl_tooltip > div:not(.ogl_tooltipTriangle):not(.ogl_close)
{
    background:var(--tertiary);
    border-radius:inherit;
    display:block !important;
    line-height:1.25;
    max-height:90vh;
    max-width:400px;
    overflow-x:hidden;
    overflow-y:auto;
    padding:16px 20px;
    position:relative;
    z-index:1000003;
}

.ogl_tooltip .ogl_colorpicker
{
    display:grid !important;
    grid-auto-flow:column;
    grid-gap:3px;
    grid-template-rows:repeat(5, 1fr);
}

[class*="tooltip"]
{
    user-select:none !important;
}

[class*="tooltip"] input
{
    box-sizing:border-box;
    max-width:100%;
}

.ogl_colorpicker > div
{
    border-radius:50%;
    box-sizing:border-box;
    cursor:pointer;
    height:24px;
    width:24px;
}

.ogl_planetIcon, .ogl_moonIcon, .ogl_flagIcon, .ogl_searchIcon, .ogl_pinIcon, .ogl_fleetIcon
{
    display:inline-block !important;
    font-style:normal !important;
    text-align:center !important;
    vertical-align:text-top !important;
}

.ogl_planetIcon:before, .ogl_moonIcon:before, .ogl_flagIcon:before, .ogl_searchIcon:before, .ogl_pinIcon:before, .ogl_fleetIcon:before
{
    font-family:'Material Icons';
    font-size:20px !important;
}

.ogl_planetIcon:before
{
    content:'language';
}

.ogl_moonIcon:before
{
    content:'brightness_2';
}

.ogl_flagIcon:before
{
    content:'flag';
}

.ogl_pinIcon:before
{
    content:'push_pin';
}

.ogl_searchIcon:before
{
    content:'search';
}

.ogl_fleetIcon:before
{
    content:'send';
}

#bar
{
    line-height:17px !important;
    grid-gap:20px !important;
}

#bar li
{
    list-style:none !important;
}

#fleet1 .content
{
    padding-bottom:30px !important;
    padding-top:16px !important;
}

#fleet1 .ogl_shipFlag
{
    background:linear-gradient(180deg, #0d1014 30%, transparent);
    box-sizing:border-box;
    display:flex;
    grid-gap:4px;
    justify-content:space-evenly;
    padding:0 10px;
    position:absolute;
    right:0;
    text-align:center;
    top:0;
    width:100%;
}

#fleet1 .ogl_shipFlag > *
{
    color:#b1c2cb;
    display:block;
    font-size:14px !important;
    line-height:16px !important;
    position:relative;
    text-shadow:1px 2px #000;
    top:-4px;
    width:20px;
}

#fleet1 .ogl_shipFlag > *:hover
{
    color:#fff;
}

#fleet1 .ogl_fav:not(.ogl_grayed)
{
    color:var(--yellow);
}

#fleet1 .ogl_shipLock:not(.ogl_grayed)
{
    color:var(--red);
}

#fleet1 .ogl_shipLock
{
    font-size:12px !important;
}

#fleet1 .ogl_reverse
{
    font-size:12px !important;
}

#fleet1 progress
{
    appearance:none;
	border:0;
    bottom:-5px;
    display:block;
    height:5px;
    left:5px;
    position:absolute;
    width:655px;
    z-index:10;
}

#fleet1 progress, #fleet1 progress::-webkit-progress-bar
{
    background:var(--capacity);
}

#fleet1 .capacityProgress
{
    position:relative;
}

#fleet1 .capacityProgress::before
{
    background:#0c1014;
    border-radius:0 0 5px 5px;
    content:attr(data-rawCargo);
    display:inline-block;
    font-size:11px;
    left:3px;
    padding:6px 0;
    position:absolute;
    text-align:center;
    top:5px;
    width:658px;
}

#fleet1 .capacityProgress::after
{
    content:attr(data-percentResources)'%';
    display:block;
    font-size:10px;
    left:var(--currentCapacityPercent);
    position:absolute;
    text-shadow:2px 2px 1px #000;
    top:-14px;
    transform:translateX(5px);
    transition:left 0.5s;
}

#fleet1 progress::-webkit-progress-value
{
    background:rgba(255,255,255,.1);
    backdrop-filter:brightness(1.8);
    box-shadow:5px 0 10px #000;
    transition:width 0.5s;
}

#fleet1 progress::-moz-progress-bar
{
    background:rgba(255,255,255,.1);
    backdrop-filter:brightness(1.8);
    box-shadow:5px 0 10px #000;
    transition:width 0.5s;
}

.ogl_requiredShips
{
    align-items:center;
    display:grid;
    justify-content:center;
    user-select:none;
    width:80px;
}

#warning .ogl_requiredShips
{
    display:flex;
    grid-gap:28px;
    width: 100%;
}

.ogl_requiredShips .ogl_notEnough
{
    color:var(--red);
    filter:none;
}

.ogl_required
{
    background:linear-gradient(145deg, black, transparent);
    border-radius:3px;
    font-size:10px;
    overflow:hidden;
    padding:0 !important;
    white-space:nowrap;
}

.ogl_required:before
{
    vertical-align:middle !important;
}

.ogl_required:hover
{
    box-shadow:0 0 0 2px var(--ogl);
}

.ogl_maxShip
{
    background:#3c1a1a;
    border-radius:0;
    bottom:19px;
    box-sizing:border-box;
    color:var(--red);
    cursor:pointer;
    font-size:10px;
    height:14px;
    left:2px;
    line-height:14px;
    padding:0 5px;
    position:absolute;
    right:2px;
    text-align:right;
    user-select:none;
}

.ogl_maxShip:hover
{
    box-shadow:0 0 0 2px var(--ogl);
}

.resourceIcon .ogl_maxShip
{
    bottom:0;
}

.ogl_limiterLabel
{
    align-items:center;
    background:var(--secondary);
    border-radius:3px;
    cursor:pointer;
    display:inline-flex;
    grid-gap:5px;
    height:28px;
    padding:0 9px;
    user-select:none;
}

.ogl_limiterGroup
{
    align-items:center;
    background:var(--secondary);
    border-radius:3px;
    display:inline-flex;
    height:28px;
    margin-left:auto;
    padding:0 9px;
    user-select:none;
}

.ogl_limiterGroup > i
{
    margin:0 5px;
}

.ogl_limiterGroup .ogl_icon:first-child
{
    margin-left:5px;
}

.ogl_limiterGroup .ogl_icon:before
{
    margin-right:0;
}

.ogl_limiterGroup .ogl_icon:hover
{
    cursor:pointer;
}

.ogl_limiterGroup .ogl_icon:hover:before
{
    box-shadow:0 0 0 2px var(--ogl);
}

.ogl_limiterGroup .ogl_icon.ogl_active:before
{
    box-shadow:0 0 0 2px #fff;
}

.ogl_limiterGroup:has(.ogl_active:not(.ogl_200))
{
    box-shadow:0 0 0 2px var(--red);
}

#fleet2 #fleetBriefingPart1 li
{
    margin-bottom:1px !important;
}

#fleet2[data-selected-mission="4"] .ogl_return
{
    opacity:.6;
}

#fleet2 #buttonz .header
{
    display:none !important;
}

#fleet2 #buttonz .footer, #fleet2 .c-left, #fleet2 .c-right
{
    display:none !important;
}

#fleet2 #buttonz .content
{
    padding:2px 0 !important;
    margin:0 !important;
}

#fleet2 #resources.lifeforms-enabled
{
    height:216px !important;
}

#fleet2 #buttonz div.move-box
{
    top:-1px !important;
    right:7px !important;
}

#fleet2 #buttonz ul#missions
{
    height:auto !important;
}

#fleet2 #buttonz ul li span
{
    height:12px !important;
    min-width:122px !important;
}

#fleet2 #mission
{
    margin:auto !important;
}

#fleet2 div#mission .percentageBarWrapper
{
    margin-top:10px;
}

#fleet1 .ajax_loading_indicator,
#fleet2 .ajax_loading_indicator
{
    transform:scale(.5);
}

#speedPercentage
{
    float:none !important;
    margin:auto !important;
}

.percentageBar .steps .step:not(.selected)
{
    line-height:20px !important;
}

#speedPercentage .bar
{
    pointer-events:none;
}

.technology input[type="number"], .technology input[type="text"]
{
    background:#98b2bf !important;
    border:none !important;
    border-radius:2px !important;
    bottom:-20px !important;
    box-shadow:none !important;
    height:20px !important;
}

.ogl_notEnough
{
    filter:sepia(1) hue-rotate(300deg);
}

.technology.ogl_notEnough
{
    filter:none;
}

.technology.ogl_notEnough .icon
{
    filter:grayscale(1) brightness(0.5);
}

.technology.ogl_notEnough input
{
    background:#525556 !important;
    cursor:not-allowed !important;
}

.technology input.ogl_flashNotEnough
{
    background:#cf7e7e !important;
}

.technology:hover
{
    z-index:2;
}

.technology .icon
{
    border-radius:0 !important;
    box-shadow:0 0 0 1px #000 !important;
    position:relative;
}

.technology[data-status="active"] .icon
{
    box-shadow:0 0 5px 2px var(--ogl);
}

.technology .icon:hover, .technology.showsDetails .icon
{
    border:2px solid var(--ogl) !important;
}

.technology .icon .upgrade
{
    border-radius:0 !important;
    box-shadow:0 0 6px 0px rgba(0,0,0,.8) !important;
}

.technology .icon .upgrade:after
{
    border-color:transparent transparent currentColor transparent !important;
}

.technology .icon .level, .technology .icon .amount
{
    background:var(--primary) !important;
    border-radius:0 !important;
}

#technologydetails h3,
#technologydetails .level, #technologydetails .amount
{
    color:var(--ogl) !important;
}

#fleetdispatchcomponent #allornone
{
    left:5px !important;
    padding:0 !important;
    width:654px !important;
}

#fleetdispatchcomponent .allornonewrap
{
    align-items:center;
    background:none !important;
    border:none !important;
    box-sizing:border-box;
    display:flex;
    padding:24px 9px 15px 9px !important;
    width:100% !important;
}

#fleetdispatchcomponent .allornonewrap > div:not(.clearfloat)
{
    margin-right:10px !important;
}

#fleet1 .allornonewrap .firstcol
{
    display:grid;
    grid-gap:5px !important;
    justify-content:space-between !important;
    width:auto !important;
}

#fleetdispatchcomponent #continueToFleet2
{
    margin-left:auto;
}

#fleetdispatchcomponent #allornone .info
{
    display:none;
}

#fleetdispatchcomponent #buttonz #battleships
{
    width:408px !important;
}

#fleetdispatchcomponent #buttonz #civilships
{
    width:254px !important;
}

#fleetdispatchcomponent #buttonz #battleships ul,
#fleetdispatchcomponent #buttonz #civilships ul
{
    padding:0 !important;
}

#fleetdispatchcomponent #buttonz #battleships ul
{
    margin-left:8px !important;
}

#fleetdispatchcomponent #buttonz #battleships .header,
#fleetdispatchcomponent #buttonz #civilships .header
{
    display:none !important;
}

#fleetdispatchcomponent #buttonz #battleships .header
{
    border-radius:0 3px 3px 0;
    border-right:1px solid #000;
}

#fleetdispatchcomponent #buttonz #civilships .header
{
    border-radius:3px 0 0 3px;
    border-left:1px solid #000;
}

#fleetdispatchcomponent .resourceIcon
{
    cursor:default;
    position:relative;
}

#fleetdispatchcomponent .ogl_keepRecap
{
    background:#4c1b1b;
    box-sizing:border-box;
    bottom:0;
    color:#f45757;
    font-size:10px;
    padding-right:5px;
    position:absolute;
    text-align:right;
    width:100%;
}

#fleetdispatchcomponent fieldset,
#jumpgate fieldset
{
    background:#0c1014;
    border-radius:3px;
    box-sizing:border-box;
    color:#fff;
    display:flex;
    grid-gap:10px;
    margin:10px 5px 5px 5px;
    padding:12px;
    width:656px;
}

#jumpgate fieldset
{
    width:625px;
}

#fleetdispatchcomponent fieldset legend,
#jumpgate fieldset legend
{
    color:#6f9fc8;
}

#fleetdispatchcomponent .resourceIcon
{
    box-shadow:inset -8px 7px 10px rgba(0,0,0,.5);
}

#allornone .secondcol
{
    align-items:center;
    background:none !important;
    border:none !important;
    display:inline-flex !important;
    grid-gap:6px;
    padding:5px !important;
    width:auto !important;
}

#allornone .secondcol .ogl_icon:hover, #allornone .secondcol .material-icons:hover
{
    color:#ccc !important;
    filter:brightness(1.2);
}

#allornone .secondcol .clearfloat
{
    display:none !important;
}

#allornone .secondcol .ogl_icon:not(.ogl_icon .ogl_icon):before
{
    box-shadow:inset 0 0 1px 1px #000;
    height:31px;
    width:31px;
}

#allornone .secondcol .ogl_icon:before
{
    margin:0;
}

#allornone .secondcol .ogl_icon .ogl_icon:before
{
    border-radius:10px 10px 10px 0;
    box-shadow:0 0 0 2px #345eb4, 0 0 2px 4px rgba(0,0,0,.7);
    width:18px;
}

#allornone .secondcol .ogl_icon
{
    cursor:pointer;
    padding:0;
    position:relative;
}

#allornone .secondcol .ogl_icon .ogl_icon
{
    position:absolute;
    right:-4px;
    top:-5px;
    transform:scale(.8);
}

#resetall, #sendall
{
    border-radius:3px;
    overflow:hidden;
    transform:scale(.97);
}

#galaxyLoading:after
{
    background:rgba(0,0,0,.7);
    border-radius:8px;
    content:attr(data-currentposition);
    font-size:13px;
    font-weight:bold;
    left:50%;
    padding:5px;
    position:absolute;
    top:50%;
    transform:translate(-50%, -50%);
}

/*#pageContent, #mainContent
{
    width:1045px !important;
    width:990px !important;
}*/

#headerbarcomponent
{
    width:1045px !important;
}

#commandercomponent
{
    transform:translateX(55px);
}

#bar .OGameClock
{
    grid-gap:0 !important;
    margin:0 !important;
    padding-right:10px !important;
    width:auto !important;
}

#bar #headerBarLinks
{
    gap:18px !important;
}

#box, #standalonepage #mainContent
{
    width:100% !important;
}

#top
{
    background-repeat:no-repeat;
}

#middle
{
    padding-bottom:80px;
}

#right
{
    float:left !important;
    position:relative !important;
    z-index:2 !important;
}

#right .ogl_ogameDiv, #planetbarcomponent .ogl_ogameDiv
{
    margin-bottom:20px;
}

#myPlanets .ogl_header .material-icons, #myWorlds .ogl_header .material-icons
{
    color:#fff;
    cursor:pointer;
    position:absolute;
    right:5px;
    transform-origin:center;
    top:2px;
    z-index:1;
}

#countColonies
{
    display:none;
}

#bannerSkyscrapercomponent
{
    margin-left:290px !important;
}

#planetbarcomponent #rechts
{
    margin-bottom:20px !important;
    margin-left:5px !important;
    margin-top:-50px !important;
    width:176px !important;
}

#rechts .ogl_ogameDiv:first-child
{
    z-index:100001;
}

#myPlanets
{
    width:auto !important;
}

#planetList
{
    background:#15191e !important;
    padding:0 !important;
    position:relative;
    transform:translateX(-8px);
    user-select:none;
    width:206px;
    z-index:2;
}

#planetList.ogl_notReady .smallplanet:after
{
    background:rgba(0,0,0,.5);
    border-radius:7px;
    bottom:0px;
    content:'';
    left:0px;
    pointer-events:none;
    position:absolute;
    right:0px;
    top:0px;
    z-index:100;
}

#planetList.ogl_notReady .smallplanet
{
    pointer-events:none !important;
}

#myPlanets
{
    background:none !important;
    box-shadow:none !important;
}

.ogl_available
{
    display:grid;
    font-size:9px;
    font-weight:bold;
    line-height:11px;
    opacity:1;
    position:absolute;
    right:3px;
    text-align:right;
    top:4px;
    width:auto;
}

.smallplanet .planetlink:hover .ogl_available, .smallplanet .moonlink:hover .ogl_available
{
    opacity:1;
}

.smallplanet
{
    background:linear-gradient(341deg, transparent 29%, #283748);
    background:#0e1116;
    border-radius:0 !important;
    display:grid;
    font-size:10px;
    grid-gap:2px;
    grid-template-columns:139px 64px;
    height:41px !important;
    margin:0 !important;
    padding:1px;
    position:relative !important;
    width:100% !important;
}

.smallplanet:last-child
{
    border-radius:0 0 4px 4px !important;
    margin-bottom:0 !important;
}

@property --round
{
    syntax:'<integer>';
    inherits:false;
    initial-value:-50%;
}

[data-group]:before
{
    --round:-50%;
    border:2px solid #fff;
    border-right:none;
    content:'';
    height:calc(100% - 1px);
    position:absolute;
    top:0;
    transform:translate(-100%, round(down, -50%, 1px));
    transform:translate(-100%, var(--round));
    left:0;
    width:3px;
}

[data-group="1"]:before { border-color:#3F51B5; }
[data-group="2"]:before { border-color:#2196F3; }
[data-group="3"]:before { border-color:#009688; }
[data-group="4"]:before { border-color:#43A047; }
[data-group="5"]:before { border-color:#7CB342; }
[data-group="6"]:before { border-color:#FDD835; }
[data-group="7"]:before { border-color:#FB8C00; }
[data-group="8"]:before { border-color:#E53935; }
[data-group="9"]:before { border-color:#EC407A; }
[data-group="10"]:before { border-color:#5E35B1; }
[data-group="11"]:before { border-color:#795548; }
[data-group="12"]:before { border-color:#607D8B; }

.smallplanet .planetlink, .smallplanet .moonlink
{
    border-radius:4px !important;
    background-position:initial !important;
    height:43px !important;
    overflow:hidden !important;
    position:relative !important;
    padding:0 !important;
    position:relative !important;
    top:0 !important;
}

.smallplanet .planetlink:hover
{
    background:linear-gradient(207deg, #0d1014, #4869c7);
}

.smallplanet:last-child .planetlink:hover
{
    border-radius:0 0 0 4px !important;
}

.smallplanet .moonlink:hover
{
    background:linear-gradient(-207deg, #0d1014, #4869c7);
}

.smallplanet:last-child .moonlink:hover
{
    border-radius:0 0 4px 0 !important;
}

.ogl_destinationPicker .smallplanet .planetlink.ogl_currentDestination
{
    background:linear-gradient(207deg, #0d1014, #bb8c22) !important;
}

.ogl_destinationPicker .smallplanet .moonlink.ogl_currentDestination
{
    background:linear-gradient(-207deg, #0d1014, #bb8c22) !important;
}

.ogl_destinationPicker .smallplanet .ogl_currentDestination .planetPic,
.ogl_destinationPicker .smallplanet .ogl_currentDestination .icon-moon,
.ogl_destinationPicker .smallplanet .ogl_currentDestination .ogl_refreshTimer
{
    display:none;
}

.planetBarSpaceObjectContainer
{
    margin:0 !important;
    left:0 !important;
    top:0 !important;
}

.planetBarSpaceObjectHighlightContainer
{
    width:0 !important;
    height:0 !important;
    display:none !important;
}

.ogl_destinationPicker .smallplanet .ogl_currentDestination:after
{
    color:var(--ogl);
    content:'sports_score';
    font-family:'Material Icons';
    font-size:20px;
    left:6px;
    position:absolute;
    top:12px;
}

.ogl_destinationPicker .smallplanet .moonlink.ogl_currentDestination:after
{
    left:2px;
}

.smallplanet .ogl_disabled
{
    opacity:1;
    pointer-events:all;
}

.ogl_destinationPicker .smallplanet .ogl_disabled
{
    opacity:.5;
    pointer-events:none;
}

.smallplanet .planetlink
{
    background:linear-gradient(207deg, #0d1014, #212b34);
}

.smallplanet .moonlink
{
    background:linear-gradient(-207deg, #0d1014, #212b34);
}

.smallplanet.hightlightPlanet .planetlink
{
    background:linear-gradient(207deg, #0d1014, #4869c7);
}

.smallplanet.hightlightMoon .moonlink
{
    background:linear-gradient(-207deg, #0d1014, #4869c7);
}

.ogl_destinationPicker .smallplanet .planetlink.ogl_disabled
{
    background:linear-gradient(207deg, #0d1014, #c74848) !important;
}

.ogl_destinationPicker .smallplanet .moonlink.ogl_disabled
{
    background:linear-gradient(-207deg, #0d1014, #c74848) !important;
}

.smallplanet .planetlink.ogl_attacked,
.smallplanet .moonlink.ogl_attacked
{
    box-shadow:inset 0 0 0 2px #c93838 !important;
}

.smallplanet .moonlink
{
    left:auto !important;
}

.smallplanet .planet-name, .smallplanet .planet-koords
{
    font-weight:normal !important;
    left:32px !important;
    position:absolute !important;
    max-width:67px !important;
    overflow:hidden !important;
    text-overflow:ellipsis !important;
}

.smallplanet .planet-name
{
    color:hsl(208deg 32% 63%) !important;
    font-size:10px !important;
    font-weight:bold !important;
    top:9px !important;
}

.smallplanet .planet-koords
{
    bottom:10px !important;
    color:hsl(208deg 3% 57%) !important;
    letter-spacing:-0.05em;
    font-size:11px !important;
    top:auto !important;
}

.smallplanet .planetPic
{
    background:#1a2534;
    box-shadow:0 0 8px #000000 !important;
    height:22px !important;
    left:-1px !important;
    margin:0 !important;
    position:absolute !important;
    top:23px !important;
    transform:scale(1.4);
    width:22px !important;
}

.smallplanet .icon-moon
{
    background:#1a2534;
    box-shadow:0 0 8px #000000 !important;
    height:16px !important;
    left:0px !important;
    margin:0 !important;
    position:absolute !important;
    top:27px !important;
    transform: scale(1.5);
    width:16px !important;
}

.ogl_refreshTimer
{
    background:rgba(0,0,0,.8);
    border-radius:14px;
    bottom:2px;
    left:3px;
    padding:1px;
    position:absolute;
    text-align:center;
    transition:opacity .3s;
    width:15px;
}

.moonlink .ogl_refreshTimer
{
    left:1px;
}

.ogl_alt .ogl_refreshTimer
{
    opacity:0;
}

.smallplanet .constructionIcon
{
    display:none !important;
    left:3px !important;
    top:3px !important;
}

.smallplanet .constructionIcon.moon
{
    left:143px !important;
}

.smallplanet .alert
{
    display:none;
}

.smallplanet .ogl_sideIconBottom,
.smallplanet .ogl_sideIconTop,
.smallplanet .ogl_sideIconInfo
{
    align-items:center;
    display:flex;
    grid-gap:5px;
    position:absolute;
    right:-5px;
    text-shadow:0 0 5px #000;
    top:2px;
    transform:translateX(100%);
}

.smallplanet .ogl_sideIconBottom
{
    bottom:11px;
    top:auto;
}

.smallplanet .ogl_sideIconInfo
{
    bottom:2px;
    top:auto;
}

.smallplanet .ogl_sideIconBottom > *,
.smallplanet .ogl_sideIconTop > *,
.smallplanet .ogl_sideIconInfo > *,
.ogl_fleetIcon:before
{
    align-items:center;
    cursor:pointer;
    display:flex !important;
    font-size:14px !important;
}

.smallplanet .ogl_sideIconInfo > *
{
    color:var(--yellow);
    font-size:10px !important;
}

.smallplanet .ogl_sideIconBottom .ogl_fleetIcon:before
{
    transform:scaleX(-1);
}

.smallplanet .ogl_todoIcon
{
    color:#cfcfcf;
}

.smallplanet .ogl_todoIcon:hover,
.smallplanet .ogl_fleetIcon:hover
{
    color:var(--ogl) !important;
}

.smallplanet .ogl_todoIcon:after,
.smallplanet .ogl_fleetIcon:after
{
    content:attr(data-list);
    font-family:Verdana, Arial, SunSans-Regular, sans-serif;
    font-size:12px;
    font-weight:bold;
}

.msg
{
    background:var(--tertiary) !important;
    outline:1px solid #000;
    overflow:hidden;
    position:relative;
}

.msg[data-msgType] .msg_status:before { background:none !important; }
.msg[data-msgType="expe"] .msg_status { background:var(--mission15) !important; }
.msg[data-msgType="discovery"] .msg_status { background:var(--lifeform) !important; }

.msg_new
{
    background:linear-gradient(to bottom, #2e525e, #223644 6%, #172834 20%) !important;
}

.msg_title .ogl_mainIcon
{
    color:var(--ogl) !important;
}

.msg_title .ogl_ptre
{
    color:#ff942c !important;
}

.ogl_battle
{
    align-items:center;
    background:rgba(0, 0, 0, .15);
    border:2px solid #323d4e;
    /*border-radius:5px;*/
    box-shadow:0 0 6px -2px #000;
    color:#48566c !important;
    display:flex;
    flex-wrap:wrap;
    font-weight:bold;
    grid-gap:6px;
    justify-content:center;
    margin:8px auto;
    padding:3px 6px;
    position:relative;
    text-align:center;
    text-transform:capitalize;
    width:fit-content;
    width:-moz-fit-content;
}

.ogame-tracker-msg .ogl_battle
{
    display:none !important;
}

.ogl_battleTooltip
{
    font-size:14px !important;
}

[data-depletion]:after
{
    color:#eb5656;
    content:'\\e98b';
    font-family:'Material Icons';
    font-size:16px;
    font-weight:normal;
}

[data-depletion="1"]:after { color:#48566c;content:'\\e930'; }
[data-depletion="2"]:after { color:#ebb208;content:'\\e98a';transform: scaleX(-1); }
[data-depletion="3"]:after { color:#f58725;content:'\\e92d'; }

.ogl_battle[data-resultType][data-size="0"] { border-image:linear-gradient(to bottom right, #ede07c, #744407, #ede07c, #744407) 1 !important; }
.ogl_battle[data-resultType][data-size="1"] { border-image:linear-gradient(to bottom right, #d7d7d7, #525252, #d7d7d7, #525252) 1 !important; }
/*.ogl_battle[data-resultType][data-size="2"] { border-image:linear-gradient(to bottom right, #d17755, #623726, #d17755, #623726) 1 !important; }*/

[data-size-value] { font-weight:bold; }

[data-size-depletion] { color:#eb5656 !important; }
[data-size-depletion="1"] { color:#48566c !important; }
[data-size-depletion="2"] { color:#ebb208 !important; }
[data-size-depletion="3"] { color:#f58725 !important; }

[data-size-value="0"] { color:#ede07c !important; }
[data-size-value="1"] { color:#dddddd !important; }
[data-size-value="2"] { color:#d17755 !important; }

[data-resultType]:before
{
    content:'';
    display:block;
    font-family:'Material Icons';
    font-size:18px;
    font-weight:normal !important;
}

[data-resultType="raid"]:before, [data-resultType="battle"]:before { content:'\\ea15'; }
[data-resultType="resource"]:before, [data-resultType="darkmatter"]:before { content:'\\e972'; }
[data-resultType="artefact"]:before { content:'\\ea23'; }
[data-resultType="ship"]:before { content:'\\e961'; }
[data-resultType="other"]:before { content:'\\e9d0'; }
[data-resultType="nothing"]:before { content:'\\e92b'; }
[data-resultType*="lifeform"]:before { content:'\\e96e'; }
[data-resultType*="item"]:before { content:'\\e996'; }
[data-resultType*="debris"]:before { content:'\\e900'; }
[data-resultType*="cargo"]:before { content:'\\e950'; }
[data-resultType*="early"]:before { content:'\\ea54'; }
[data-resultType*="late"]:before, [data-resultType="duration"]:before { content:'\\ea27'; }
[data-resultType*="blackhole"]:before { content:'\\e960'; }
[data-resultType*="trader"]:before { content:'\\ea03'; }
[data-resultType="alien"]:before { content:'\\ea6b'; }
[data-resultType="pirate"]:before { content:'\\ea61'; }

[data-resultType="alien"] { color:var(--alien) !important; }
[data-resultType="pirate"], [data-resultType="battle"]  { color:var(--pirate) !important; }
[data-resultType="blackhole"] { color:var(--blackhole) !important; }
[data-resultType="trader"] { color:var(--trader) !important; }
[data-resultType="item"] { color:var(--item) !important; }
[data-resultType="early"] { color:var(--early) !important; }
[data-resultType="late"], [data-resultType="duration"] { color:var(--late) !important; }
[data-resultType="resource"] { color:var(--resource) !important; }
[data-resultType="ship"] { color:var(--ship) !important; }
[data-resultType="dm"], [data-resultType="darkmatter"] { color:var(--dm) !important; }
[data-resultType="lifeform"]:after, .ogl_notification .ogl_icon[class*="lifeform"]:after
{
    align-self:baseline;
    color:#fff;
    content:'XP';
    display:block;
    font-size:smaller;
    margin-left:3px;
}

.ogl_battle[data-resultType]:before
{
    color:#48566c !important;
}

.ogl_battle.ogl_clickable:hover
{
    border:2px solid var(--ogl) !important;
    cursor:pointer;
}

.ogl_battle .ogl_icon
{
    align-items:center;
    background:none;
    display:flex;
    line-height:16px;
    padding:0;
}

.ogl_battle .ogl_icon:not(:last-child)
{
    margin-right:20px;
}

.ogl_battle[data-resultType="ship"] .ogl_icon,
.ogl_battle[data-resultType="global"] .ogl_icon
{
    color:#98b1cb;
    display:grid;
    grid-gap:3px;
}

.ogl_battle[data-resultType="ship"] .ogl_icon:not(:last-child)
{
    margin-right:7px;
}

.ogl_battle[data-resultType="global"] .ogl_icon:not(:last-child)
{
    margin-right:0;
}

.ogl_battle .ogl_icon:before
{
    background-size:400px;
    border-radius:0;
    display:block;
    height:20px;
    image-rendering:auto;
    margin:0 5px 0 0;
    vertical-align:bottom;
    width:32px;
}

.ogl_battle[data-resultType="raid"] .ogl_icon
{
    display:grid;
}

.ogl_battle[data-resultType="raid"] .ogl_icon:before
{
    grid-row:1 / 3;
}

.ogl_battle[data-resultType="raid"] .ogl_icon > span:last-child
{
    grid-column:2;
    grid-row:2;
}

.ogl_battle[data-resultType="ship"] .ogl_icon:before,
.ogl_battle[data-resultType="global"] .ogl_icon:before
{
    margin:auto;
}

.ogl_battle .ogl_icon[class*="ogl_2"]:before
{
    background-size:40px;
}

.ogl_battle .ogl_icon.ogl_artefact:before
{
    background-position:59% 28%;
    background-size:50px;
}

.ogl_battle .ogl_icon.ogl_lifeform1:before { background-position:1px 76%; }
.ogl_battle .ogl_icon.ogl_lifeform2:before { background-position:11% 76%; }
.ogl_battle .ogl_icon.ogl_lifeform3:before { background-position:22% 76%; }
.ogl_battle .ogl_icon.ogl_lifeform4:before { background-position:32% 76%; }

.ogl_expeRecap
{
    background:#14181f;
    font-size:11px;
    grid-gap:8px;
    padding:10px 0 6px 0;
    position:relative;
    width:auto;
}

.ogl_expeRecap:before
{
    margin-left:0 !important;
}

.ogl_expeRecap:after
{
    background:var(--blue);
    border-radius:50px;
    box-shadow:0 0 6px -2px #000;
    color:#fff;
    content:attr(data-count);
    font-size:10px;
    padding:4px 5px;
    position:absolute;
    right:-3px;
    text-transform:lowercase;
    top:-3px;
}

#messages .tab_favorites, #messages .tab_inner
{
    background:#030406 !important;
    background-size:410px;
}

.ogl_deleted
{
    color:var(--red);
    opacity:.5;
}

.ogl_spytable
{
    background:#12161a;
    border-radius:5px;
    color:#93b3c9;
    counter-reset:spy;
    counter-increment:spy;
    font-size:11px;
    padding:5px;
    user-select:none;
}

.ogl_spytable:after
{
    content:attr(data-total);
    display:flex;
    justify-content:end;
    padding:5px 0;
    position:relative;
}

#fleetsTab .ogl_spytable
{
    margin-bottom:-25px;
    margin-top:55px;
}

.ogl_spytable a.ogl_important span
{
    color:#fff !important;
}

.ogl_spytable hr
{
    background:#1e252e;
    border:none;
    grid-column:1 / -1;
    height:2px;
    width:100%;
}

.ogl_spytable .ogl_spyIcon
{
    font-size:16px !important;
}

.ogl_spytable a:not(.ogl_button):not([class*="status_abbr"]), .ogl_spytable [data-galaxy]:not(.ogl_button)
{
    color:inherit !important;
}

.ogl_spytable a:hover, .ogl_spytable [data-galaxy]:hover
{
    text-decoration:underline !important;
}

.ogl_spytable .ogl_spyLine > div:not(.ogl_more), .ogl_spyHeader
{
    align-items:center;
    border-radius:3px;
    display:grid;
    grid-gap:3px;
    grid-template-columns:22px 34px 30px 24px 96px auto 70px 40px 40px 130px;
    margin-bottom:2px;
}

.ogl_spytable .ogl_spyLine:not(:first-child)
{
    counter-increment:spy;
}

.ogl_spytable .ogl_spyLine > div > span,
.ogl_spytable .ogl_spyLine > div > a
{
    align-items:center;
    background:var(--secondary);
    border-radius:3px;
    display:flex;
    height:24px;
    overflow:hidden;
    padding:0 4px;
    position:relative;
    text-overflow:ellipsis;
    white-space:nowrap;
}

.ogl_spytable .ogl_spyLine > div > a
{
    text-decoration:none;
}

.ogl_spytable .ogl_spyLine > div > span:nth-child(5), .ogl_spytable > div > span:nth-child(6), .ogl_spytable > div > span:nth-child(7) { justify-content:right; }

.ogl_spytable .ogl_spyLine > div > span:first-child:before
{
    content:counter(spy);
}

.ogl_spytable .msg_action_link
{
    overflow:hidden;
    padding:0 !important;
    text-overflow:ellipsis;
}

.ogl_spytable .ogl_fleetIcon
{
    bottom:-2px;
    left:1px;
    pointer-events:none;
    position:absolute;
    text-shadow:1px 1px 3px #000;
}

.ogl_spytable .ogl_spyLine > div > span a
{
    text-decoration:none;
}

.ogl_spytable .ogl_spyLine a:not(.ogl_button):hover,
.ogl_spytable .ogl_spyLine [data-galaxy]:hover
{
    color:#fff !important;
    cursor:pointer !important;
    text-decoration:underline !important;
}

.ogl_spytable .ogl_spyHeader b
{
    background:#12161a;
    border-radius:3px;
    color:#3c4f5a;
    font-size:11px !important;
    line-height:27px !important;
    padding-left:4px;
}

.ogl_spytable .ogl_spyHeader b.material-icons
{
    font-size:14px !important;
}

.ogl_spytable .ogl_spyHeader b:first-child,
.ogl_spytable .ogl_spyHeader b:nth-child(3)
{
    padding-left:0;
}

.ogl_spytable .ogl_spyHeader b:last-child,
.ogl_spytable .ogl_spyHeader span:last-child
{
    background:none;
    padding:0;
}

.ogl_spytable .ogl_spyHeader [data-filter].ogl_active
{
    color:var(--amber);
}

.ogl_spytable [data-title]:not(.ogl_spyIcon):not([class*="status_abbr"])
{
    color:inherit !important;
}

.ogl_spytable [data-filter]:after
{
    color:#3c4f5a;
    content:'\\ea28';
    font-family:'Material Icons';
    font-size:16px;
    float:right;
}

.ogl_spytable .ogl_spyHeader [data-filter]:hover
{
    color:#fff;
    cursor:pointer;
}

.ogl_spytable .ogl_actions
{
    background:none !important;
    border-radius:0 !important;
    font-size:16px;
    grid-gap:2px;
    justify-content:space-between;
    padding:0 !important;
}

.ogl_spytable .ogl_type > *
{
    color:#b7c1c9;
    font-size:16px !important;
}

.ogl_spytable .ogl_type > *:hover
{
    color:#fff;
}

.ogl_spytable .ogl_actions .ogl_button
{
    border:none;
    height:24px !important;
    line-height:24px !important;
    padding:0;
    text-decoration:none !important;
    width:100%;
}

.ogl_spytable .ogl_actions > *:not(.material-icons)
{
    font-weight:bold;
    font-size:12px;
}

.ogl_spytable .ogl_reportTotal,
.ogl_spytable .ogl_actions a:hover
{
    text-decoration:none;
}

.ogl_spyLine .ogl_more
{
    background:var(--primary);
    border-radius:3px;
    margin-bottom:3px;
    padding:7px;
}

.ogl_spyLine .ogl_more .ogl_icon
{
    align-items:center;
    display:flex;
}

.ogl_spyLine .ogl_more > div
{
    align-items:center;
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(auto-fit, minmax(0, 1fr));
    margin-bottom:5px;
}

.ogl_spyLine .ogl_more > div > *
{
    background:var(--secondary);
    border-radius:3px;
    line-height:20px;
    padding:2px;
    text-decoration:none;
}

.ogl_spyLine .ogl_more a:hover
{
    color:#fff;
}

.ogl_trashCounterSpy
{
    display:block !important;
    font-size:16px !important;
    line-height:26px !important;
    min-width:0 !important;
    padding:0 !important;
    position:absolute;
    right:104px;
    top:48px;
    width:28px;
}

.galaxyTable
{
    background:#10151a !important;
}

#galaxycomponent .systembuttons img
{
    pointer-events:none;
}

#galaxyContent .ctContentRow .galaxyCell
{
    background:var(--secondary) !important;
    border-radius:2px !important;
}

#galaxyContent .cellPlanetName, #galaxyContent .cellPlayerName
{
    justify-content:left !important;
    padding:0 5px;
}

#galaxyContent .cellPlanetName span
{
    max-width:62px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}

#galaxyContent .cellPlayerName
{
    flex-basis:106px !important;
}

#galaxyContent .cellPlayerName .tooltipRel:hover
{
    text-decoration:underline;
}

#galaxyContent .cellPlayerName [rel]
{
    display:inline-block !important;
    line-height:28px;
    max-width:110px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}

#galaxyContent .cellPlayerName pre
{
    display:none;
}

.ogl_ranking
{
    text-decoration:none !important;
}

#galaxyContent .ogl_ranking
{
    color:#7e95a9;
    cursor:pointer;
}

#galaxyContent .ogl_ranking:hover
{
    color:#fff;
}

#galaxyContent .ogl_ranking a
{
    color:inherit;
    text-decoration:none;
}

#galaxyHeader .btn_system_action
{
    max-width:100px;
    overflow:hidden
}

#galaxyContent .cellPlayerName [class*="status_abbr"]
{
    margin-right:auto;
}

#galaxyContent .ownPlayerRow
{
    cursor:pointer;
}

#galaxyContent .ctContentRow .cellDebris a
{
    line-height:30px;
    text-decoration:none;
    text-align:center;
    white-space:nowrap;
}

#galaxyContent .ctContentRow .cellDebris.ogl_important a
{
    color:#fff !important;
}

[class*="filtered_filter_"]
{
    opacity:1 !important;
}

#galaxyContent .ctContentRow[class*="filtered_filter_"] .galaxyCell:not(.ogl_important)
{
    background:#12181e !important;
}

#galaxyContent .expeditionDebrisSlotBox
{
    background:var(--primary) !important;
}

#galaxyContent .expeditionDebrisSlotBox .material-icons
{
    color:#48566c;
    font-size:20px !important;
}

#galaxyContent .ctContentRow .galaxyCell.cellDebris.ogl_important,
#galaxyContent .ogl_expeditionRow.ogl_important,
.ogl_spytable .ogl_important
{
    background:linear-gradient(192deg, #a96510, #6c2c0d 70%) !important;
}

#galaxyContent .ogl_expeditionRow.ogl_important .material-icons
{
    color:#bb6848;
}

[class*="filtered_filter_"] > .cellPlanet:not(.ogl_important) .microplanet,
[class*="filtered_filter_"] > .cellPlanetName:not(.ogl_important) span:not(.icon),
[class*="filtered_filter_"] > .cellMoon:not(.ogl_important) .micromoon,
[class*="filtered_filter_"] > .cellPlayerName:not(.ogl_important) span,
[class*="filtered_filter_"] > .cellPlayerName:not(.ogl_important) .ogl_ranking,
[class*="filtered_filter_"] > .cellAlliance:not(.ogl_important) span,
[class*="filtered_filter_"] > .cellAction:not(.ogl_important) a:not(.planetDiscover):not(.planetMoveIcons)
{
    opacity:.2 !important;
}

.ogl_popup
{
    align-items:center;
    background:rgba(0,0,0,.85);
    display:flex;
    flex-direction:column;
    height:100%;
    justify-content:center;
    left:0;
    opacity:0;
    pointer-events:none;
    position:fixed;
    top:0;
    width:100%;
    z-index:1000001;
}

.ogl_popup.ogl_active
{
    pointer-events:all;
    opacity:1;
}

.ogl_popup .ogl_close, .ogl_popup .ogl_share
{
    color:#556672;
    cursor:pointer;
    font-size:18px !important;
    line-height:30px!important;
    position:absolute;
    text-align:center;
    top:2px;
    right:0;
    width:30px;
}

.ogl_popup .ogl_close:hover, .ogl_popup .ogl_share:hover
{
    color:#fff;
}

.ogl_popup .ogl_share
{
    font-size:16px !important;
    top:30px;
}

.ogl_popup > *:not(.ogl_close):not(.ogl_share)
{
    animation:pop .15s;
    background:var(--primary);
    background:#0f1218;
    border-radius:3px;
    /* box-shadow:0 0 10px 1px #000; cause html2canvas to bug */
    max-height:80%;
    max-width:980px;
    overflow-y:auto;
    overflow-x:hidden;
    padding:30px;
    position:relative;
}

.ogl_popup h2
{
    border-bottom:2px solid #161b24;
    color:#9dbddd;
    font-size:14px;
    margin-bottom:16px;
    padding-bottom:7px;
    text-align:center;
}

@keyframes pop
{
    from { opacity:0; transform:translateY(-30px) };
    to { opacity:1; transform:translateY(0px) };
}

.ogl_keeper
{
    max-width:700px !important;
}

.ogl_keeper .ogl_limiterLabel
{
    float:left;
    margin-right:20px;
    width:100px;
}

.ogl_keeper .ogl_limiterLabel input
{
    margin-left:auto;
}

.ogl_keeper hr
{
    background:#1e252e;
    border:none;
    grid-column:1 / -1;
    height:2px;
    width:100%;
}

.ogl_resourceLimiter, .ogl_shipLimiter, .ogl_jumpgateLimiter
{
    background:#1b202a;
    border-radius:3px;
    display:grid;
    grid-gap:5px 18px;
    grid-template-columns:repeat(12, 1fr);
    padding:12px;
}

.ogl_shipLimiter, .ogl_jumpgateLimiter
{
    grid-template-columns:repeat(20, 1fr);
}

.ogl_keeper .ogl_icon
{
    grid-column:span 4;
    padding:0;
}

.ogl_keeper .ogl_metal, .ogl_keeper .ogl_crystal, .ogl_keeper .ogl_deut, .ogl_keeper .ogl_food
{
    grid-column:span 3;
}

.ogl_keeper .ogl_icon:before
{
    margin-right:5px !important;
    vertical-align:text-bottom;
}

.ogl_keeper input
{
    background:#121518;
    border:none;
    border-bottom:1px solid #242a32;
    border-radius:3px;
    border-top:1px solid #080b10;
    box-sizing:border-box;
    color:inherit;
    padding:4px 6px;
    width:calc(100% - 34px);
}

.ogl_keeper .ogl_button
{
    background:var(--secondary);
    border-radius:3px;
    color:#fff;
    cursor:pointer;
    line-height:24px !important;
}

.ogl_keeper .ogl_button.ogl_active
{
    background:var(--highlight);
}

.ogl_keeper .ogl_button:last-child
{
    grid-column:-2;
}

.ogl_keeper .ogl_profileTabs
{
    display:grid;
    grid-gap:0 5px;
    grid-template-columns:repeat(5, 1fr);
    grid-column:1 / -1;
}

.ogl_keeper input.ogl_title
{
    grid-column:1 / -1;
    padding:8px;
    text-align:center;
    width:100%;
}

.ogl_keeper h2
{
    grid-column:1 / -1;
}

.ogl_keeper h2:not(:nth-child(2))
{
    margin:20px 0 10px 0;
}

.ogl_keeper .ogl_missionPicker
{
    display:grid;
    grid-column:1 / -1;
    grid-gap:4px;
    grid-template-columns:repeat(11, auto);
    justify-content:end;
    margin-top:10px;
}

.ogl_keeper .ogl_missionPicker [data-mission]
{
    filter:grayscale(1);
}

.ogl_keeper .ogl_missionPicker [data-mission]:hover
{
    cursor:pointer;
    filter:grayscale(.5);
}

.ogl_keeper .ogl_missionPicker .ogl_active
{
    box-shadow:none !important;
    filter:grayscale(0) !important;
}

.ogl_empire
{
    color:#6a7d95;
    display:grid;
    font-size:11px;
    font-weight:bold;
    grid-gap:3px 8px;
    grid-template-columns:90px 24px 24px 100px 100px 60px 24px 130px 130px 130px;
}

.ogl_empire .ogl_icon
{
    background:none !important;
    justify-content:center;
    padding:0;
}

.ogl_empire .material-icons
{
    font-size:18px !important;
    line-height:30px !important;
}

.ogl_empire img
{
    box-sizing:border-box;
    height:24px;
    padding:3px;
}

.ogl_empire > *:not(.ogl_close):not(.ogl_share):not(a)
{
    background:var(--secondary);
    border-radius:3px;
    line-height:24px;
    position:relative;
    text-align:center;
}

.ogl_empire > [class*="ogl_lifeform"]:before
{
    border-radius:3px;
    image-rendering:pixelated;
}

.ogl_empire strong
{
    float:left;
    font-size:14px;
    padding-left:10px;
}

.ogl_empire strong span
{
    color:#ff982d !important;
    font-size:10px;
    margin-left:2px;
}

.ogl_empire small
{
    color:#ccc;
    float:right;
    font-size:10px;
    opacity:.6;
    padding-right:10px;
}

.ogl_empire .ogl_icon:before
{
    margin:0;
}

.ogl_empire img:hover
{
    filter:brightness(1.5);
}

.ogl_side
{
    background:var(--primary);
    box-shadow:0 0 50px #000;
    box-sizing:border-box;
    height:100%;
    overflow:auto;
    padding:40px 18px 18px 18px;
    position:fixed;
    right:0;
    top:0;
    transform:translateX(100%);
    transition:transform .3s;
    width:385px;
    z-index:1000000;
}

.ogl_side.ogl_active
{
    box-shadow:0 0 50px #000;
    transform:translateX(0%);
}

.ogl_side .ogl_close,
.ogl_side .ogl_back
{
    color:#556672;
    cursor:pointer;
    font-size:28px !important;
    position:absolute;
    top:10px;
    right:20px;
}

.ogl_side .ogl_close:hover,
.ogl_side .ogl_back:hover
{
    color:#fff;
}

.ogl_side .ogl_back
{
    left:20px;
    right:auto;
}

.ogl_side hr
{
    background:#151e28;
    border:none;
    grid-column:1 / -1;
    height:2px;
    width:100%;
}

.ogl_side h2
{
    align-items:center;
    color:#7e8dab;
    display:flex;
    font-size:14px;
    justify-content:center;
    margin-bottom:20px;
}

.ogl_side h2 .ogl_flagPicker
{
    height:17px;
    margin-left:5px;
}

.ogl_side h2 i
{
    margin-left:10px;
}

.ogl_topbar
{
    border-bottom:2px solid #0e1116;
    color:#546a89;
    display:grid;
    font-size:16px;
    grid-template-columns:repeat(7, 1fr);
    text-align:center;
    user-select:none;
    width:205px;
}

.ogl_topbar > *:nth-child(1):hover { color:#dbc453 !important; }
.ogl_topbar > *:nth-child(2):hover { color:#4bbbd5 !important; }
/*.ogl_topbar > *:nth-child(3):hover { color:#a978e9 !important; }*/
.ogl_topbar > *:nth-child(3):hover { color:#e17171 !important; }
.ogl_topbar > *:nth-child(4):hover { color:#76d19a !important; }
.ogl_topbar > *:nth-child(5):hover { color:#a1aac9 !important; }
.ogl_topbar > *:nth-child(6):hover { color:#fd7db8 !important; }
.ogl_topbar > *:nth-child(7):hover { color:#ffffff !important; }

.ogl_topbar > *:not(.ogl_button)
{
    cursor:pointer;
    color:inherit !important;
    display:block;
    line-height:30px !important;
    text-decoration:none;
}

.ogl_topbar > *:hover
{
    text-shadow:1px 1px 2px #000;
}

.ogl_topbar .ogl_disabled
{
    color:#898989 !important;
    opacity:.8 !important;
}

.ogl_topbar .ogl_active
{
    animation:spinAlt infinite 1s;
}

@keyframes spin
{
    0% { transform:rotate(0); }
    100% { transform:rotate(-360deg); }
}

.ogl_topbar button
{
    border:none;
    grid-column:1 / -1;
    line-height:26px !important;
    margin:0;
    max-height:0;
    opacity:0;
    pointer-events:none;
    transition:max-height .3s cubic-bezier(0, 1, 0, 1);
}

.ogl_initHarvest .ogl_topbar button
{
    boder:1px solid #17191c;
    display:block;
    margin:5px;
    max-height:30px;
    opacity:1;
    pointer-events:all;
    transition:max-height .1s ease-in-out;
}

.ogl_config
{
    display:grid;
    grid-gap:8px;
    line-height:26px;
}

.ogl_config label
{
    align-items:center;
    background:linear-gradient(-207deg, #0d1014, #212b34);
    border-radius:3px;
    color:#c7c7c7;
    display:flex;
    margin:2px 0px;
    padding:0;
}

.ogl_config label:before
{
    content:attr(data-label);
    display:block;
}

.ogl_config label.tooltipLeft:before
{
    text-decoration:underline dotted;
}

.ogl_config label > *:nth-child(1)
{
    margin-left:auto;
}

.ogl_config label > input[type="text"],
.ogl_config label > input[type="password"],
.ogl_config label > select
{
    background:#121518;
    border:none;
    border-bottom:1px solid #242a32;
    border-radius:3px;
    border-top:1px solid #080b10;
    box-shadow:none;
    box-sizing:border-box;
    color:#5d738d;
    font-size:12px;
    height:22px;
    visibility:visible !important;
    width:105px;
}

.ogl_config label > input[type="checkbox"],
.ogl_todoList input[type="checkbox"],
.ogl_limiterLabel input[type="checkbox"]
{
    align-items:center;
    appearance:none;
    background:#121518;
    border:none;
    border-bottom:1px solid #242a32;
    border-radius:2px;
    border-top:1px solid #080b10;
    color:var(--ogl);
    cursor:pointer;
    display:flex;
    height:16px;
    justify-content:center;
    width:16px;
}

.ogl_config label > input[type="checkbox"]:hover,
.ogl_todoList input[type="checkbox"]:hover,
.ogl_limiterLabel input[type="checkbox"]:hover
{
    box-shadow:0 0 0 2px var(--ogl);
}

.ogl_config label > input[type="checkbox"]:checked:before,
.ogl_todoList input[type="checkbox"]:checked:before,
.ogl_limiterLabel input[type="checkbox"]:checked:before
{
    content:'\\e936';
    font-family:'Material Icons';
    font-size:18px !important;
    pointer-events:none;
}

.ogl_config .ogl_icon[class*="ogl_2"],
.ogl_config .ogl_icon[class*="ogl_mission"]
{
    cursor:pointer;
    padding:0;
}

.ogl_config .ogl_icon[class*="ogl_2"]:not(:first-child),
.ogl_config .ogl_icon[class*="ogl_mission"]:not(:first-child)
{
    margin-left:5px;
}

.ogl_config .ogl_icon[class*="ogl_2"]:hover:before,
.ogl_config .ogl_icon[class*="ogl_mission"]:hover:before
{
    box-shadow:0 0 0 2px var(--ogl);
}

.ogl_config .ogl_icon[class*="ogl_2"].ogl_active:before,
.ogl_config .ogl_icon[class*="ogl_mission"].ogl_active:before
{
    box-shadow:0 0 0 2px #fff;
}

.ogl_config .ogl_icon[class*="ogl_2"]:before,
.ogl_config .ogl_icon[class*="ogl_mission"]:before
{
    margin:0;
    vertical-align:middle;
}

.ogl_config .ogl_icon[class*="ogl_mission"]:before
{
    background-size:318px !important;
    background-position-y:-6px !important;
}

.ogl_config [data-container]
{
    background:#0e1116;
    border-radius:3px;
    max-height:24px;
    overflow:hidden;
    padding:5px;
    transition:max-height .3s cubic-bezier(0, 1, 0, 1);
}

.ogl_config [data-container].ogl_active
{
    max-height:400px;
    transition:max-height .3s ease-in-out;
}

.ogl_config [data-container] > *
{
    padding:0 7px;
}

.ogl_config h3
{
    align-items:center;
    border-radius:3px;
    color:#90aed5;
    cursor:pointer;
    display:flex;
    font-size:12px;
    margin-bottom:5px;
    overflow:hidden;
    position:relative;
    text-align:left;
    text-transform:capitalize;
    user-select:none;
}

.ogl_config [data-container] h3:hover
{
    box-shadow:inset 0 0 0 2px var(--ogl);
    color:var(--ogl);
}

.ogl_config > div h3:before, .ogl_config svg
{
    color:inherit;
    fill:currentColor;
    font-family:'Material Icons';
    font-size:16px;
    height:26px;
    margin-right:5px;
}

.ogl_config [data-container="fleet"] h3:before { content:'\\e961'; }
.ogl_config [data-container="general"] h3:before { content:'\\e9e8'; }
.ogl_config [data-container="interface"] h3:before { content:'\\e95d'; }
.ogl_config [data-container="expeditions"] h3:before { content:'\\ea41'; }
.ogl_config [data-container="stats"] h3:before { content:'\\ea3e'; }
.ogl_config [data-container="messages"] h3:before { content:'\\e9be'; }
.ogl_config [data-container="PTRE"] h3:before { content:'\\ea1e'; }
.ogl_config [data-container="data"] h3:before { content:'\\ea3f'; }

.ogl_config h3:after
{
    content:'\\e9b5';
    font-family:'Material Icons';
    margin-left:auto;
}

.ogl_config label button
{
    background:linear-gradient(to bottom, #405064, #2D3743 2px, #181E25);
    border:1px solid #17191c;
    border-radius:3px;
    color:#b7c1c9;
    cursor:pointer;
    font-size:16px !important;
    height:22px !important;
    line-height:18px !important;
    position:relative;
    text-shadow:1px 1px #000;
    width:30px;
}

.ogl_config label button:hover
{
    color:var(--ogl);
}

.ogl_config label .ogl_choice
{
    background:linear-gradient(to bottom, #405064, #2D3743 2px, #181E25);
    border-bottom:1px solid #17191c;
    border-top:1px solid #17191c;
    color:#b7c1c9;
    cursor:pointer;
    font-size:11px !important;
    font-weight:bold;
    height:20px !important;
    line-height:20px !important;
    position:relative;
    text-align:center;
    width:30px;
}

.ogl_config label .ogl_choice:first-child
{
    border-radius:3px 0 0 3px;
}

.ogl_config label .ogl_choice:last-child
{
    border-radius:0 3px 3px 0;
}

.ogl_config label .ogl_choice.ogl_active
{
    border-radius:3px;
    box-shadow:0 0 0 2px #fff;
    z-index:2;
}

.ogl_config label .ogl_choice:hover
{
    color:var(--ogl);
}

.ogl_keyboardActions
{
    display:grid;
    grid-gap:5px 20px;
    grid-template-columns:repeat(2, 1fr);
}

.ogl_keyboardActions h2
{
    grid-column:1 / -1;
}

.ogl_keyboardActions label
{
    background:var(--secondary);
    align-items:center;
    display:grid;
    grid-gap:15px;
    grid-template-columns:auto 100px;
    padding-left:10px;
}

.ogl_keyboardActions label:hover
{
    color:var(--amber);
    cursor:pointer;
}

.ogl_keyboardActions label hr
{
    appearance:none;
    border:none;
    height:1px;
    margin:0;
    padding:0;
}

.ogl_keyboardActions input
{
    background:#fff !important;
    border:none !important;
    border-radius:0 !important;
    box-shadow:none !important;
    color:#000 !important;
    font-size:14px !important;
    font-weight:bold !important;
    height:21px !important;
    line-height:21px !important;
    padding:4px !important;
    text-align:center !important;
    text-transform:uppercase !important;
}

.ogl_keyboardActions input:focus
{
    background:#ffe395 !important;
    outline:2px solid var(--amber);
}

.ogl_keyboardActions button
{
    cursor:pointer;
    grid-column:1 / -1;
    line-height:30px !important;
    margin-top:10px;
}

.ogl_planetList
{
    color:#566c7c;
    font-size:11px;
    margin-top:10px;
}

.ogl_planetList > div
{
    align-items:center;
    display:grid;
    grid-gap:3px;
    grid-template-columns:24px 70px 44px 44px auto;
    margin-bottom:3px;
}

.ogl_planetList > div > *:nth-child(2)
{
    text-align:left;
    text-indent:5px;
}

.ogl_planetList > div > *:last-child
{
    color:var(--date);
    font-size:10px;
}

.ogl_planetList [class*="Icon"]
{
    font-size:10px;
}

.ogl_planetList [class*="Icon"]:before
{
    font-size:16px;
    margin-right:5px;
    vertical-align:bottom;
}

.ogl_filterColor
{
    display:grid;
    grid-auto-flow:column;
    grid-gap:3px;
    grid-template-rows:repeat(1, 1fr);
    margin:10px 0;
}

.ogl_filterColor > *
{
    cursor:pointer;
    height:18px;
    border-radius:50%;
}

.ogl_filterColor > *.ogl_off,
label.ogl_off
{
    opacity:.2;
}

.ogl_filterColor > *:hover,
label.ogl_off:hover
{
    opacity:.7;
}

.ogl_filterStatus
{
    display:grid;
    grid-auto-flow:column;
    grid-gap:3px;
    grid-template-rows:repeat(1, 1fr);
    justify-content:end;
    margin:10px 0;
}

.ogl_filterStatus > *
{
    background:#182b3b;
    border-radius:4px;
    cursor:pointer;
    line-height:24px;
    text-align:center;
    width:24px;
}

.ogl_filterStatus > *.ogl_off
{
    opacity:.2;
}

.ogl_filterStatus > *:hover
{
    opacity:.7;
}

.ogl_filterGalaxy, .ogl_filterSystem
{
    color:#a0bacd;
    display:grid;
    font-size:11px;
    grid-gap:3px;
    grid-template-columns:repeat(10, 1fr);
    line-height:24px;
    text-align:center;
}

.ogl_filterGalaxy > *, .ogl_filterSystem > *
{
    background:#182b3b;
    border-radius:4px;
    cursor:pointer;
}

.ogl_filterGalaxy > *:hover, .ogl_filterSystem > *:hover
{
    color:#fff;
    text-decoration:underline;
}

.ogl_filterGalaxy > .ogl_active:not(.ogl_disabled), .ogl_filterSystem > .ogl_active:not(.ogl_disabled)
{
    color:#ccc;
    filter:brightness(1.4);
}

.ogl_filterGalaxy
{
    margin-top:30px;
}

.ogl_filterSystem
{
    margin-top:10px;
}

.ogl_watchList
{
    display:grid;
    font-size:11px;
    grid-gap:3px;
    padding-top:40px;
}

.ogl_watchList > div
{
    display:grid;
    grid-gap:3px;
    grid-template-columns:24px auto 100px 50px;
}

.ogl_watchList > div > *
{
    background:#182b3b;
    border-radius:3px;
    height:24px;
    line-height:24px;
    padding:0 5px;
}

.ogl_watchList > div > *:nth-child(2):hover
{
    cursor:pointer;
    text-decoration:underline;
}

.ogl_targetList
{
    display:grid;
    font-size:11px;
    grid-gap:3px;
    padding-top:30px;
}

.ogl_targetList .honorRank
{
    margin-right:1px;
    transform:scale(75%);
    vertical-align:sub;
}

.ogl_targetList .ogl_target
{
    color:#566c7c;
    display:grid;
    grid-gap:3px;
    grid-template-columns:76px auto 24px 24px 24px 24px 24px;
    line-height:24px;
    position:relative;
}

.ogl_targetList .ogl_target > *
{
    background:#182b3b;
    border-radius:3px;
    height:24px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}

.ogl_targetList .ogl_target [data-galaxy]
{
    text-indent:17px;
}

.ogl_targetList .ogl_target [class*="status_abbr_"]
{
    text-indent:3px;
}

.ogl_targetList .ogl_target > *:first-child
{
    align-self:center;
    border-radius:50%;
    display:block;
    height:7px;
    left:6px;
    position:absolute;
    width:7px;
    z-index:2;
}

.ogl_targetList .ogl_target > *
{
    grid-row:1;
}

.ogl_targetList .ogl_target > [class*="Icon"]:hover
{
    color:#fff;
    cursor:pointer;
}

.ogl_ogameDiv
{
    background:linear-gradient(0deg, #0d1014, #1b222a);
    box-shadow:0 0 20px -5px #000, 0 0 0 1px #17191c;
    border-radius:0;
    padding:2px;
    position:relative;
}

.ogl_miniStats
{
    border-radius:3px;
    cursor:pointer;
    margin-top:10px;
    width:160px;
}

.ogl_miniStats:hover:not(:has(.ogl_button:hover))
{
    box-shadow:0 0 0 2px var(--ogl);
}

.ogl_miniStats > div
{
    background:var(--secondaryReversed);
    display:grid;
    font-size:11px;
    grid-gap:5px 0;
    grid-template-columns:repeat(3, 1fr);
    justify-content:center;
    padding:3px 2px;
}

.ogl_miniStats .ogl_header
{
    border-bottom:1px solid #2a3540;
    height:18px;
    line-height:18px;
    padding:5px;
    user-select:none;
}

.ogl_miniStats .ogl_header span
{
    display:inline-block;
    line-height:15px;
    text-transform:capitalize;
}

.ogl_miniStats .ogl_header div
{
    color:#fff;
    cursor:pointer;
    z-index:1;
}

.ogl_miniStats .ogl_header div:first-child
{
    left:6px;
    position:absolute;
}

.ogl_miniStats .ogl_header div:last-child
{
    right:2px;
    position:absolute;
}

.ogl_miniStats .ogl_icon
{
    align-items:center;
    background:#242c38;
    display:grid;
    grid-gap:3px;
    justify-content:center;
    margin:0 2px;
    padding:3px 0;
    text-align:center;
}

.ogl_miniStats .ogl_icon > span
{
    /*margin-left:auto;
    margin-right:30px;*/
}

.ogl_miniStats .ogl_icon:before
{
    margin:auto;
    height:20px;
}

.ogl_miniStats .ogl_artefact:before
{
    background-size:23px;
}

.ogl_stats
{
    display:grid;
}

.ogl_stats h3
{
    color:#97a7c5;
    font-size:11px;
    font-weight:bold;
    grid-column:1 / -1;
    margin-top:20px;
    text-align:center;
}

.ogl_statsMonth
{
    align-items:center;
    display:flex;
    grid-gap:5px;
}

.ogl_statsMonth > *
{
    padding:0 10px;
}

.ogl_statsMonth .ogl_button:not(.material-icons)
{
    text-transform:uppercase;
}

.ogl_dateBar
{
    background:#181d26;
    border-radius:5px;
    display:flex;
    margin:20px 0;
    padding:4px;
    user-select:none;
}

.ogl_dateBar .ogl_item
{
    align-items:end;
    box-sizing:border-box;
    cursor:ew-resize;
    display:grid;
    grid-template-rows:50px 16px;
    flex:1;
    justify-content:center;
    padding:12px 2px 5px 2px;
    position:relative;
}

.ogl_dateBar .ogl_item:after
{
    content:attr(data-day);
    display:block;
    opacity:.3;
    pointer-events:none;
    text-align:center;
}

.ogl_dateBar .ogl_item.ogl_active:after
{
    opacity:1;
}

.ogl_dateBar .ogl_item > div
{
    border-radius:4px;
    cursor:pointer;
    font-size:10px;
    font-weight:bold;
    height:100%;
    pointer-events:none;
    width:20px;
}

.ogl_dateBar .ogl_selected
{
    background:#524728;
    border-bottom:2px solid var(--ogl);
    border-top:2px solid var(--ogl);
    padding-bottom:3px;
    padding-top:10px;
}

.ogl_dateBar .ogl_selected:not(.ogl_selected + .ogl_selected)
{
    border-left:2px solid var(--ogl);
    border-bottom-left-radius:5px;
    border-top-left-radius:5px;
    padding-left:0;
}

.ogl_dateBar .ogl_selected:has(+ :not(.ogl_selected)),
.ogl_dateBar .ogl_item.ogl_selected:last-child
{
    border-right:2px solid var(--ogl);
    border-bottom-right-radius:5px;
    border-top-right-radius:5px;
    padding-right:0;
}

.ogl_dateBar > .ogl_item:hover
{
    background:#524728;
}

.ogl_popup.ogl_active .ogl_dateBar .ogl_active
{
    color:#fff !important;
    pointer-events:all;
}

.ogl_statsDetails
{
    align-items:end;
    display:grid;
    grid-gap:20px;
    grid-template-columns:430px 430px;
}

.ogl_statsDetails h3
{
    color:var(--ogl);
}

.ogl_pie
{
    align-items:center;
    background:var(--secondary);
    border-radius:5px;
    display:flex;
    grid-gap:20px;
    height:182px;
    justify-content:center;
    padding:0 20px;
    position:relative;
}

.ogl_pie:before
{
    align-items:center;
    content:attr(data-pie);
    color:#fff;
    display:grid;
    font-size:12px;
    height:100%;
    justify-content:center;
    left:0;
    line-height:18px;
    pointer-events:none;
    position:absolute;
    text-align:center;
    text-shadow:1px 1px 5px #000;
    top:0;
    width:200px;
    white-space:pre;
    z-index:3;
}

.ogl_noExpe
{
    display:grid;
    grid-gap:10px;
}

.ogl_pie span.material-icons
{
    color:#313e4e;
    font-size:100px !important;
    margin:auto;
}

.ogl_pie canvas
{
    height:160px;
    width:160px;
}

.ogl_pie .ogl_pieLegendContainer
{
    align-items:center;
    border-radius:5px;
    display:grid;
    min-height:120px;
    width:210px;
}

.ogl_pie .ogl_pieLegend
{
    align-items:center;
    border-radius:3px;
    cursor:pointer;
    display:grid;
    grid-gap:5px;
    grid-template-columns:18px auto 54px 41px;
    white-space:nowrap;
}

.ogl_pie .ogl_pieLegend:hover,
.ogl_pie .ogl_pieLegend.ogl_active
{
    box-shadow:0 0 0 2px #fff;
}

.ogl_pie .ogl_pieLegend > *
{
    color:#fff;
    overflow:hidden;
    text-overflow:ellipsis;
}

.ogl_pie .ogl_pieLegend > span
{
    justify-self:right;
}

.ogl_pie .ogl_pieLegend i
{
    font-size:smaller;
    font-weight:normal;
    opacity:.6;
    text-align:right;
}

.ogl_pie .ogl_pieLegend .ogl_suffix
{
    display:inline;
}

.ogl_shipTable
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(3, 1fr);
    height:100%;
}

.ogl_shipTable > .ogl_icon
{
    background:var(--secondary);
    box-sizing:border-box;
    padding-right:10px;
}

.ogl_shipTable > .ogl_icon:before
{
    height:26px;
    margin-right:auto;
    width:38px;
}

.ogl_sumTable
{
    display:grid;
    grid-column:1 / -1;
    grid-gap:3px;
    margin-top:20px;
}

.ogl_sumTable > *
{
    align-items:center;
    display:grid;
    grid-gap:3px;
    grid-template-columns:repeat(8, 1fr);
    line-height:26px;
    text-align:center;
}

.ogl_sumTable > *:first-child
{
    font-size:20px !important;
}

.ogl_sumTable > * > *:not(.ogl_icon)
{
    background:var(--secondary);
    border-radius:3px;
}

.ogl_sumTable > * > *:not(.ogl_icon):first-child
{
    text-transform:capitalize;
}

.ogl_sumTable .ogl_icon:before
{
    margin:auto;
}

.ogl_recap
{
    border-top:2px solid #0e1116;
    cursor:pointer;
    padding:10px 6px;
    position:relative;
    user-select:none;
}

.ogl_recap:hover
{
    box-shadow:0 0 0 2px var(--ogl);
}

.ogl_recap > div
{
    font-size:11px;
    font-weight:bold;
}

.ogl_recap .ogl_icon
{
    background:none;
    display:grid;
    grid-template-columns:26px auto 70px;
    text-align:right;
}

.ogl_recap .ogl_icon > *:last-child
{
    font-size:10px;
    letter-spacing:-0.03em;
    opacity:.5;
}

.ogl_recap .ogl_icon:before
{
    height:14px;
    vertical-align:bottom;
}

.ogl_shortCutWrapper
{
    box-sizing:border-box;
    display:flex;
    flex-direction:column;
    justify-content:center;
    pointer-events:none;
    position:fixed;
    text-transform:uppercase;
    z-index:10;

    top:0;
    height:calc(100vh - 25px);
    left:0;
    width:100vw;
}

.ogl_shortCutWrapper > div:nth-child(1)
{
    flex:1;
}

.ogl_shortcuts
{
    display:flex;
    grid-gap:7px;
    flex-wrap:wrap;
    justify-content:center;
}

#planetbarcomponent #rechts .ogl_shortcuts
{
    justify-content:left;
    transform:translateX(-8px);
    width:206px;
}

#planetbarcomponent #rechts .ogl_shortcuts .ogl_separator
{
    display:none;
}

/*.ogl_shortcuts:before
{
    background:rgba(0,0,0,.6);
    bottom:-5px;
    content:'';
    filter:blur(10px);
    left:-5px;
    position:absolute;
    right:-5px;
    top:-5px;
}*/

.ogl_shortcuts *
{
    z-index:1;
}

.ogl_shortcuts [data-key]
{
    align-items:center;
    box-shadow:0 0 5px rgba(0,0,0,.6);
    display:inline-flex;
    font-size:11px;
    grid-gap:2px;
    justify-content:space-evenly;
    line-height:26px;
    overflow:hidden;
    pointer-events:all;
    position:relative;
    text-transform:uppercase;
    width:40px;
}

#planetbarcomponent #rechts .ogl_shortcuts [data-key]
{
    width:36px;
}

.ogl_shortcuts [data-key-id]:after
{
    font-family:'Material Icons';
    font-size:16px !important;
    order:-1;
}

.ogl_shortcuts [data-key-id="menu"]:after { content:'\\e91d'; }
.ogl_shortcuts [data-key-id="showMenuResources"]:after { content:'\\e95d'; }
.ogl_shortcuts [data-key-id="previousPlanet"]:after { content:'\\ea39'; }
.ogl_shortcuts [data-key-id="nextPlanet"]:after { content:'\\ea2a'; }
.ogl_shortcuts [data-key-id="expeditionSC"]:after { color:var(--mission15);content:'\\ea41'; }
.ogl_shortcuts [data-key-id="expeditionLC"]:after { color:var(--mission15);content:'\\ea41'; }
.ogl_shortcuts [data-key-id="expeditionPF"]:after { color:var(--mission15);content:'\\ea41'; }
.ogl_shortcuts [data-key-id="fleetRepeat"]:after { content:'\\e91a'; }
.ogl_shortcuts [data-key-id="fleetSelectAll"]:after { color:#ffab43;content:'\\ea31'; }
.ogl_shortcuts [data-key-id="fleetReverseAll"]:after { content:'\\ea0c'; }
.ogl_shortcuts [data-key-id="backFirstFleet"]:after { content:'\\e94f'; }
.ogl_shortcuts [data-key-id="backLastFleet"]:after { content:'\\e94f'; }
.ogl_shortcuts [data-key-id="galaxyUp"]:after { color:#30ba44;content:'\\e946'; }
.ogl_shortcuts [data-key-id="galaxyDown"]:after { color:#30ba44;content:'\\e947'; }
.ogl_shortcuts [data-key-id="galaxyLeft"]:after { color:#30ba44;content:'\\e942'; }
.ogl_shortcuts [data-key-id="galaxyRight"]:after { color:#30ba44;content:'\\e940'; }
.ogl_shortcuts [data-key-id="galaxyReload"]:after { content:'\\e919'; }
.ogl_shortcuts [data-key-id="discovery"]:after { color:var(--lifeform);content:'\\ea46'; }
.ogl_shortcuts [data-key-id="galaxySpySystem"]:after { color:var(--mission6);content:'\\e9ca'; }
.ogl_shortcuts [data-key-id="nextPinnedPosition"]:after { content:'\\e9d1'; }
.ogl_shortcuts [data-key-id="fleetQuickCollect"]:after { content:'\\e950'; }

.ogl_shortcuts .ogl_separator, fieldset .ogl_separator,
.ogl_statsMonth .ogl_separator, .ogl_expeRecap .ogl_separator
{
    align-self:center;
    background:#2e3840;
    border-radius:50%;
    height:1px;
    padding:2px;
    width:1px;
}

.ogl_shorcuts .ogl_button
{
    box-shadow:0 1px 3px 0 #000, 0 1px 1px 0 #405064;
}

#technologydetails .build-it_wrap
{
    transform:scale(.75);
    transform-origin:bottom right;
}

#technologydetails .premium_info
{
    font-size:14px;
}

#technologydetails .information > ul
{
    bottom:8px !important;
    display:flex !important;
    flex-flow:row !important;
    grid-gap:3px !important;
    left:1px !important;
    position:absolute !important;
    top:auto !important;
    width:auto !important;
}

#technologydetails .information > ul li
{
    background:var(--secondary);
    border-radius:3px;
    margin-bottom:0 !important;
    padding:5px;
}

#technologydetails .build_duration,
#technologydetails .additional_energy_consumption,
#technologydetails .energy_production,
#technologydetails .possible_build_start,
#technologydetails .required_population,
#technologydetails .research_laboratory_levels_sum
{
    align-items:center;
    display:flex;
}

#technologydetails .build_duration strong,
#technologydetails .additional_energy_consumption strong,
#technologydetails .energy_production strong,
#technologydetails .possible_build_start strong,
#technologydetails .required_population strong,
#technologydetails .research_laboratory_levels_sum strong
{
    display:inline-flex;
    font-size:0;
}

#technologydetails .build_duration strong:before,
#technologydetails .additional_energy_consumption strong:before,
#technologydetails .energy_production strong:before,
#technologydetails .possible_build_start strong:before,
#technologydetails .required_population strong:before,
#technologydetails .research_laboratory_levels_sum strong:before
{
    display:block;
    font-family:'Material Icons';
    font-size:16px;
    margin-right:3px;
}

#technologydetails .build_duration strong:before { color:var(--time);content:'\\ea27'; }
#technologydetails .possible_build_start strong:before { color:#ccc;content:'\\ea03'; }
#technologydetails .additional_energy_consumption strong:before, #technologydetails .energy_production strong:before { color:var(--energy);content:'\\ea51'; }
#technologydetails .required_population strong:before { color:var(--lifeform);content:'\\ea46'; }
#technologydetails .research_laboratory_levels_sum strong:before { color:#21d19f;content:'\\ea17'; }

#technologydetails .required_population span { display:inline-flex;font-size:0; }
#technologydetails .required_population span:before { content:attr(data-formatted);font-size:11px; }

#technologydetails .energy_production .bonus
{
    color:#fff;
}

#technologydetails .build_amount
{
    top:35px;
}

#technologydetails .build_amount label
{
    display:none;
}

#technologydetails .build_amount .maximum
{
    background:none !important;
    margin:0 0 0 5px !important;
    min-width:0 !important;
    padding:0 !important;
}

#technologydetails .build_amount .maximum:before
{
    display:none !important;
}

#technologydetails_wrapper.ogl_active
{
    display:block !important;
}

#technologydetails_wrapper.ogl_active #technologydetails_content
{
    display:block !important;
    position:initial !important;
}

#technologydetails_content
{
    background:#0d1014 !important;
}

#technologydetails > .description
{
    background:var(--primary);
}

#technologydetails .costs
{
    left:5px !important;
    top:33px !important;
}

#technologydetails .costs .ipiHintable
{
    display:none !important;
}

#technologydetails .costs .ogl_costsWrapper
{
    display:grid;
    font-weight:bold;
    grid-gap:3px;
}

#technologydetails .costs .ogl_costsWrapper div:first-child .material-icons
{
    color:inherit !important;
}

#technologydetails .costs .ogl_costsWrapper .ogl_icon
{
    align-items:center;
    display:grid !important;
    grid-gap:8px;
    grid-template-columns:28px 70px 70px 70px;
    padding:0;
    text-align:center;
}

#technologydetails .costs .ogl_costsWrapper .ogl_icon:before
{
    margin:0;
}

#technologydetails .costs .ogl_costsWrapper .ogl_icon > div
{
    background:var(--secondary);
    border-radius:3px;
    color:inherit;
    line-height:18px !important;
}

#technologydetails .resource.icon
{
    border-radius:5px !important;
    flex:1 1 0;
    font-size:12px !important;
    height:auto !important;
    padding:2px !important;
    margin:0 !important;
    white-space:nowrap !important;
    width:auto !important;
}

#technologydetails .resource.icon .ogl_text,
#technologydetails .resource.icon .ogl_danger
{
    font-size:10px;
}

#technologydetails .ogl_actions
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(4, 1fr);
    line-height:28px;
    padding:5px;
}

#technologydetails .ogl_actions .ogl_button
{
    font-size:18px !important;
}

#technologydetails .ogl_actions .ogl_button.ogl_active
{
    box-shadow:0 0 0 2px var(--amber);
    color:var(--amber) !important;
}

#technologydetails .information .material-icons
{
    color:#fff;
    font-size:16px !important;
    vertical-align:bottom;
}

#technologydetails .information .costs > p
{
    display:none;
}

#technologydetails .information b
{
    font-size:16px;
}

.tippy-box .ogl_settingsTooltip ul
{
    list-style:square inside;
}

.tippy-box .ogl_settingsTooltip b
{
    color:var(--ogl);
    font-weight:bold;
}

.tippy-box .ogl_fleetDetail,
.ogl_ptreContent .ogl_fleetDetail
{
    display:grid !important;
    font-size:11px;
    grid-gap:4px 10px;
    grid-template-columns:repeat(2, 1fr);
}

.ogl_ptreContent .ogl_fleetDetail
{
    grid-template-columns:repeat(3, 1fr);
    padding:15px 0;
}

.ogl_fleetDetail > div
{
    background:var(--secondary);
    border-radius:3px;
    line-height:20px;
    min-width:70px;
    padding:0px 5px 0px 0px !important;
    text-align:right;
    white-space:nowrap;
}

.ogl_fleetDetail .ogl_metal, .ogl_fleetDetail .ogl_crystal,
.ogl_fleetDetail .ogl_deut, .ogl_fleetDetail .ogl_food
{
    grid-column:1 / -1;
}

.ogl_fleetDetail .ogl_icon
{
    color:#7c95ab;
    font-weight:bold;
}

.ogl_fleetDetail .ogl_icon:before
{
    float:left;
    margin-right:auto;
}

.ogl_fleetDetail .ogl_button
{
    color:#fff;
    line-height:22px;
    text-align:center;
    user-select:none;
}

.ogl_fullgrid
{
    grid-column:1 / -1;
}

.tippy-box .ogl_fleetDetail .ogl_fullgrid
{
    display:grid;
    grid-gap:7px;
    grid-template-columns:repeat(2, 1fr);
}

.tippy-box .ogl_fleetDetail .ogl_button span
{
    pointer-events:none;
}

.tippy-box .ogl_fleetDetail .ogl_button
{
    border:1px solid #17191c;
    display:flex;
    font-size:12px !important;
    grid-gap:5px;
    grid-template-columns:16px auto;
    padding:2px 12px;
    text-align:left;
}

.tippy-box .ogl_fleetDetail .ogl_button .material-icons
{
    font-size:16px !important;
}

#fleetboxmission .content
{
    min-height:0 !important;
}

#fleet2 #missionNameWrapper, #fleet2 ul#missions span.textlabel
{
    display:none !important;
}

.ogl_todoList
{
    align-items:center;
    display:grid;
    grid-gap:30px;
    grid-template-columns:auto auto;
}

.ogl_todoList .ogl_tech
{
    background:#0b0f12;
    border-bottom:1px solid #1c2630;
    border-radius:3px;
    display:grid;
    margin-bottom:10px;
    padding:7px;
}

.ogl_todoList h2
{
    grid-column:1 / -1;
}

.ogl_todoList h3
{
    align-items:center;
    border-radius:3px;
    color:#5d6f81;
    cursor:pointer;
    display:flex;
    font-size:12px;
    line-height:18px;
    overflow:hidden;
    position:relative;
    text-align:left;
    text-transform:capitalize;
}

.ogl_todoList h3:after
{
    content:'\\e933';
    font-family:'Material Icons';
    margin-left:auto;
}

.ogl_todoList h3:hover
{
    color:#fff;
}

.ogl_todoList h3:not(:first-child)
{
    margin-top:20px;
}

.ogl_todoList h3 b
{
    color:var(--ogl);
}

.ogl_todoList hr
{
    background:#1e252e;
    border:none;
    grid-column:1 / -1;
    height:2px;
    width:100%;
}

.ogl_todoList .ogl_line
{
    display:grid;
    grid-gap:8px;
    grid-template-columns:70px 114px 114px 114px 50px auto auto;
    transition:max-height .3s cubic-bezier(0, 1, 0, 1);
}

.ogl_todoList div > .ogl_line:not(:first-child)
{
    max-height:0;
    overflow:hidden;
}

.ogl_todoList .ogl_tech.ogl_active .ogl_line
{
    max-height:28px;
    transition:max-height .1s ease-in-out;
}

.ogl_todoList footer
{
    border-top:2px solid #181f24;
    margin-top:3px;
}

.ogl_todoList .ogl_line > *
{
    align-items:center;
    background:var(--secondary);
    border-radius:3px;
    color:#849ab9;
    display:flex;
    margin-top:3px;
    padding-right:7px;
    text-align:right;
}

.ogl_todoList .ogl_line > *:first-child
{
    justify-content:center;
    line-height:24px;
    padding-right:0;
}

.ogl_todoList .ogl_line .material-icons,
.ogl_todoList .ogl_actions .material-icons
{
    font-size:20px !important;
}

.ogl_todoList .ogl_line .material-icons:hover
{
    color:var(--ogl) !important;
}

.ogl_todoList .ogl_line label
{
    text-align:left;
}

.ogl_todoList .ogl_line label:after
{
    content:attr(data-order);
}

.ogl_todoList .ogl_line .ogl_icon:before
{
    float:left;
}

.ogl_todoList .ogl_line .ogl_textCenter
{
    padding:0;
}

.ogl_todoList .ogl_actions
{
    align-self:baseline;
    display:grid;
    grid-gap:7px;
    position:sticky;
    top:0;
}

.ogl_todoList .ogl_button
{
    align-items:center;
    display:flex;
    grid-gap:5px;
    padding:0 10px;
}

.ogl_todoList .ogl_button .material-icons
{
    margin-left:auto;
}

.ogl_removeTodo, .ogl_blockRecap > *:last-child
{
    color:#ff4f4f !important;
}

.ogl_todoList .ogl_line button:hover
{
    box-shadow:inset 0 0 0 2px var(--ogl);
    cursor:pointer;
}

.originFleet *
{
    color:inherit !important;
}

.ogl_playerData .ogl_actions
{
    display:flex;
    grid-gap:2px;
    margin-bottom:10px;
}

.ogl_playerData .ogl_actions .ogl_button
{
    border:1px solid #17191c;
    border-radius:5px;
    font-size:16px !important;
    width:100%;
}

.ogl_playerData .ogl_grid
{
    display:grid;
    grid-gap:12px;
    grid-template-columns:repeat(2, 1fr);
}

.ogl_playerData .ogl_tagSelector
{
    grid-column:1 / -1;
}

.ogl_playerData .ogl_leftSide
{
    background:#101418;
    border-radius:5px;
    font-size:12px;
    padding:7px;
}

.ogl_playerData h1
{
    background:var(--primary);
    border:2px solid #202834;
    border-radius:50px;
    font-size:14px;
    margin:0 auto 14px auto;
    padding:3px 12px;
    text-align:center;
    width:fit-content;
    width:-moz-fit-content;
}

.ogl_playerData h1:before
{
    background:red;
    content:'';
    height:2px;
}

.ogl_playerData h1 a
{
    font-size:12px;
    text-decoration:none;
}

.ogl_playerData h1 a:hover
{
    color:var(--ogl);
}

.ogl_score
{
    display:grid;
    grid-gap:3px;
}

.ogl_score .material-icons
{
    font-size:16px !important;
    line-height:20px !important;
}

.ogl_score .ogl_line
{
    background:var(--secondary);
    border-radius:5px;
    display:grid;
    grid-gap:3px;
    grid-template-columns:20px auto;
    padding:1px 5px;
}

.ogl_score .ogl_line div
{
    line-height:20px;
    text-align:right;
}

.ogl_score .ogl_line:nth-child(1) { color:#f9c846; }
.ogl_score .ogl_line:nth-child(2) { color:#6dd0ff; }
.ogl_score .ogl_line:nth-child(3) { color:#21d19f; }
.ogl_score .ogl_line:nth-child(4) { color:var(--lifeform); }
.ogl_score .ogl_line:nth-child(5) { color:#ff4646; }
.ogl_score .ogl_line:nth-child(6) { color:#f96e46; }
.ogl_score .ogl_line:nth-child(7) { color:#bfbfbf; }

.ogl_playerData .ogl_planetStalk
{
    background:#101418;
    border-radius:5px;
    display:flex;
    flex-direction:column;
    grid-gap:3px;
    padding:7px;
}

.ogl_playerData .ogl_planetStalk > div
{
    display:grid;
    font-size:12px;
    grid-gap:3px;
    grid-template-columns:24px auto 22px 22px 22px;
    position:relative;
}

.ogl_playerData .ogl_planetStalk > div:last-child
{
    border:none;
}

.ogl_playerData .ogl_planetStalk > div > *
{
    align-items:center;
    background:var(--secondary);
    border-radius:3px;
    display:flex;
    justify-content:center;
    line-height:22px;
    padding:0 5px;
}

.ogl_playerData .ogl_tagPicker
{
    background:none !important;
    pointer-events:none !important;
}

.ogl_playerData .ogl_tagPicker:before
{
    content:'fiber_manual_record' !important;
}

.ogl_playerData .ogl_planetStalk [data-galaxy]
{
    justify-content:left;
}

.ogl_home [data-galaxy]:before
{
    color:#fff;
    content:'\\e99d';
    display:inline-block;
    font-family:'Material Icons';
    margin-right:5px;
    text-decoration:none;
}

.ogl_playerData .ogl_planetStalk .ogl_spyIcon
{
    color:#687a89;
    font-size:15px !important;
}

.ogl_playerData .ogl_planetStalk .ogl_spyIcon:hover
{
    color:#fff;
}

#jumpgate .ship_input_row
{
    position:relative;
}

#jumpgate .ogl_keepRecap
{
    background:#4c1b1b;
    border-radius:4px;
    bottom:0;
    color:#f45757;
    font-size:10px;
    padding:2px 4px;
    position:absolute;
    right:0px;
}

#jumpgate .ship_input_row input
{
    text-align:left;
}

.eventFleet .tooltip
{
    color:inherit;
}

.galaxyTable .ogl_flagPicker
{
    margin-left:3px;
}

.ogl_flagPicker, .ogl_flagSelector
{
    cursor:pointer;
    font-size:19px !important;
    min-height:19px;
}

.ogl_flagSelector > *
{
    align-items:center;
    display:grid;
    justify-content:center;
}

.ogl_tooltip .ogl_flagSelector > *
{
    height:100%;
    min-height:19px;
}

.ogl_flagPicker:before, .ogl_flagSelector [data-flag="none"]:before { color:#4e5c68; content:'push_pin'; }
.ogl_flagPicker[data-flag="friend"]:before, .ogl_flagSelector [data-flag="friend"]:before { color:#ff78cf; content:'handshake'; }
.ogl_flagPicker[data-flag="danger"]:before, .ogl_flagSelector [data-flag="danger"]:before { color:#ff4343; content:'alert'; }
.ogl_flagPicker[data-flag="skull"]:before, .ogl_flagSelector [data-flag="skull"]:before { color:#e9e9e9; content:'skull'; }
.ogl_flagPicker[data-flag="rush"]:before, .ogl_flagSelector [data-flag="rush"]:before { color:#6cddff; content:'electric_bolt'; }
.ogl_flagPicker[data-flag="fridge"]:before, .ogl_flagSelector [data-flag="fridge"]:before { color:#667eff; content:'fridge'; }
.ogl_flagPicker[data-flag="star"]:before, .ogl_flagSelector [data-flag="star"]:before { color:#ffd745; content:'star'; }
.ogl_flagPicker[data-flag="trade"]:before, .ogl_flagSelector [data-flag="trade"]:before { color:#32db9d; content:'local_gas_station'; }
.ogl_flagPicker[data-flag="money"]:before, .ogl_flagSelector [data-flag="money"]:before { color:#ab7b65; content:'euro'; }
.ogl_flagPicker[data-flag="ptre"]:before, .ogl_flagSelector [data-flag="ptre"]:before { color:#ff942c; content:'ptre'; }
.ogl_flagPicker[data-flag="recent"]:before, .ogl_flagSelector [data-flag="recent"]:before { color:#41576c; content:'schedule'; }

.ogl_flagPicker:hover, .ogl_flagSelector [data-flag]:hover,
.ogl_tagPicker:hover, .ogl_tagSelector [data-tag]:hover
{
    filter:brightness(1.3);
}

.ogl_flagSelector [data-flag]:hover:after,
.ogl_tagSelector [data-tag]:hover:after
{
    border-left:5px solid transparent;
    border-right:5px solid transparent;
    border-top:6px solid #fff;
    top:-8px;
    content:'';
    left:50%;
    position:absolute;
    transform:translateX(-50%);
}

.ogl_tooltip > div.ogl_flagSelector:not(.ogl_tooltipTriangle):not(.ogl_close),
.ogl_tooltip > div.ogl_tagSelector:not(.ogl_tooltipTriangle):not(.ogl_close),
.tippy-content .ogl_flagSelector, .tippy-content .ogl_tagSelector
{
    align-items:center;
    display:flex !important;
    grid-auto-flow:column;
    grid-gap:4px 10px;
    justify-content:center;
}

.ogl_tagPicker, .ogl_tagSelector
{
    cursor:pointer;
    font-size:19px !important;
    user-select:none;
}

.ogl_tagPicker:before, .ogl_tagSelector [data-tag]:before { content:'stroke_full'; }
.ogl_tagPicker:before, .ogl_tagSelector [data-tag="none"]:before { color:#4e5c68; }
.ogl_tagPicker[data-tag="red"]:before, .ogl_tagSelector [data-tag="red"]:before { color:#eb3b5a; }
.ogl_tagPicker[data-tag="orange"]:before, .ogl_tagSelector [data-tag="orange"]:before { color:#fa8231; }
.ogl_tagPicker[data-tag="yellow"]:before, .ogl_tagSelector [data-tag="yellow"]:before { color:#f7b731; }
.ogl_tagPicker[data-tag="lime"]:before, .ogl_tagSelector [data-tag="lime"]:before { color:#7bbf20; }
.ogl_tagPicker[data-tag="green"]:before, .ogl_tagSelector [data-tag="green"]:before { color:#20bf6b; }
.ogl_tagPicker[data-tag="blue"]:before, .ogl_tagSelector [data-tag="blue"]:before { color:#5bbde3; }
.ogl_tagPicker[data-tag="dblue"]:before, .ogl_tagSelector [data-tag="dblue"]:before { color:#3867d6; }
.ogl_tagPicker[data-tag="violet"]:before, .ogl_tagSelector [data-tag="violet"]:before { color:#8854d0; }
.ogl_tagPicker[data-tag="magenta"]:before, .ogl_tagSelector [data-tag="magenta"]:before { color:#f95692; }
.ogl_tagPicker[data-tag="pink"]:before, .ogl_tagSelector [data-tag="pink"]:before { color:#fda7df; }
.ogl_tagPicker[data-tag="brown"]:before, .ogl_tagSelector [data-tag="brown"]:before { color:#996c5c; }
.ogl_tagPicker[data-tag="gray"]:before, .ogl_tagSelector [data-tag="gray"]:before { color:#75a1b7; }
[data-tag].ogl_off { opacity:.2; }

#galaxyContent .ctContentRow .galaxyCell:has([data-tag="red"]) { box-shadow:inset 0 0 100px rgba(255, 0, 0, .2); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="orange"]) { box-shadow:inset 0 0 100px rgba(235, 108, 59, .3); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="yellow"]) { box-shadow:inset 0 0 100px rgba(235, 181, 59, .3); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="lime"]) { box-shadow:inset 0 0 100px rgba(167, 235, 59, .2); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="green"]) { box-shadow:inset 0 0 100px rgba(59, 235, 89, .3); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="blue"]) { box-shadow:inset 0 0 100px rgba(59, 162, 235, .3); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="dblue"]) { box-shadow:inset 0 0 100px rgba(59, 81, 235, .3); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="violet"]) { box-shadow:inset 0 0 100px rgba(110, 59, 235, .3); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="magenta"]) { box-shadow:inset 0 0 100px rgba(235, 59, 165, .3); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="pink"]) { box-shadow:inset 0 0 100px rgba(255, 124, 179, .3); }
#galaxyContent .ctContentRow .galaxyCell:has([data-tag="brown"]) { box-shadow:inset 0 0 100px rgba(149, 111, 89, .3); }

.galaxyRow:has([data-tag="gray"]) { opacity:.2; }

.galaxyTable .ogl_tagPicker,
.ogl_spytable .ogl_tagPicker
{
    margin-left:auto;
}

.galaxyTable
{
    .phalanxlink
    {
        margin-left:auto !important;
    }

    .phalanxlink + .ogl_tagPicker
    {
        margin-left:1px;
    }
}

.ogl_list
{
    background:#0e1116;
    display:grid;
    grid-gap:3px;
    padding:10px;
}

.ogl_list .ogl_emptyList
{
    padding:10px;
}

.ogl_list > div
{
    align-items:center;
    border-radius:3px;
    display:grid;
    grid-gap:4px;
    position:relative;
}

.ogl_list > div > *:not(.ogl_button)
{
    align-items:center;
    background:var(--secondary);
    border-radius:3px;
    display:flex;
    justify-content:center;
    line-height:24px !important;
    padding:0 5px;
}

.ogl_list > div > .ogl_flagPicker
{
    padding:0;
}

.ogl_pinned .ogl_list > div
{
    grid-template-columns:auto 70px 30px 30px;
}

.ogl_pinned .ogl_list > div > *:first-child
{
    justify-content:left;
}

.ogl_pinned .ogl_list .ogl_grid
{
    display:grid;
    grid-template-columns:repeat(2, 1fr);
}

.ogl_pinned .ogl_list .material-icons
{
    cursor:pointer;
    font-size:17px !important;
    height:24px !important;
    user-select:none;
    text-align:right;
}

.ogl_pinned .ogl_list .material-icons:hover
{
    filter:brightness(1.3);
}

.ogl_pinned .ogl_list .material-icons:last-child
{
    color:#915454;
}

.ogl_pinned .ogl_detail
{
    cursor:pointer;
}

.ogl_pinned .ogl_detail:hover
{
    color:#fff;
}

.ogl_pinned .ogl_tabs
{
    display:flex;
    grid-template-columns:repeat(9, 1fr);
    justify-content:space-between;
    text-align:center;
}

.ogl_pinned .ogl_tabs > [data-flag]
{
    align-items:center;
    display:grid;
    justify-content:center;
    padding:5px 7px 7px 7px;
}

.ogl_pinned .ogl_tabs .ogl_active
{
    background:#0e1116;
    border-radius:3px 3px 0 0;
}

.ogl_pinned span:hover
{
    cursor:pointer;
    text-decoration:underline;
}

.ogl_expeditionFiller
{
    display:grid;
    grid-template-columns:repeat(8, 1fr);
}

.ogl_expeditionFiller h2
{
    grid-column:1 / -1;
}

.ogl_expeditionFiller .ogl_icon:before
{
    height:38px;
    width:38px;
}

.ogl_expeditionFiller .ogl_icon:hover:before
{
    cursor:pointer;
    box-shadow:0 0 0 2px var(--ogl);
}

.ogl_expeditionFiller .ogl_icon.ogl_active:before
{
    box-shadow:0 0 0 2px #fff;
}

.ogl_wrapperloading
{
    align-items:center;
    background:rgba(0,0,0, .7);
    display:flex;
    height:100%;
    justify-content:center;
    width:100%;
}

.ogl_loading
{
    animation:spinAlt .75s infinite linear;
    background:conic-gradient(#ffffff00, var(--ogl));
    mask:radial-gradient(#0000 40%, #fff 43%, #fff 0);
    border-radius:50%;
    height:25px;
    width:25px;
}

@keyframes spinAlt
{
    0% { transform:rotate(0); }
    100% { transform:rotate(360deg); }
}

.ogl_pinDetail h2
{
    display:flex;
    grid-gap:5px;
}

.ogl_pinDetail h2 .ogl_flagPicker
{
    margin:0;
}

.ogl_pinDetail .ogl_actions
{
    display:flex;
    grid-gap:3px;
    margin-bottom:20px;
}

.ogl_pinDetail .ogl_actions .ogl_button
{
    align-items:center;
    display:grid;
    flex:1;
    font-size:16px !important;
    justify-content:center;
}

.ogl_pinDetail .ogl_score
{
    grid-template-columns:repeat(2, 1fr);
    margin-bottom:20px;
}

.ogl_pinDetail .ogl_score > div
{
    padding:4px 5px;
}

.ogl_pinDetail .ogl_list > div
{
    grid-template-columns:20px auto 60px 38px 38px 67px;
}

.ogl_pinDetail .ogl_list [data-galaxy]
{
    justify-content:left;
}

.ogl_pinDetail .ogl_list .ogl_spyIcon
{
    color:#687a89;
    font-size:16px !important;
    justify-content:space-between;
    padding:0 3px;
}

.ogl_pinDetail .ogl_list .ogl_spyIcon:hover
{
    color:#fff;
}

.ogl_spyIcon
{
    align-items:center;
    cursor:pointer !important;
    display:flex;
}

.ogl_spyIcon span
{
    font-family:Verdana, Arial, SunSans-Regular, sans-serif;
    font-size:11px;
    margin-left:3px;
}

.ogl_spyIcon.ogl_attacked:before
{
    bottom:-6px;
    content:'send';
    color:var(--red);
    font-size:18px !important;
    display:block;
    pointer-events:none;
    position:absolute;
    left:-3px;
    text-shadow:1px 2px 3px #000;
}

.ogl_pinDetail date
{
    display:grid;
    font-size:10px;
    grid-gap:5px;
}

.ogl_pinDetail date span:nth-child(1) { color:var(--date); }
.ogl_pinDetail date span:nth-child(2) { color:var(--time); }

.ogl_nextQuickTarget
{
    color:#687a89;
    font-size:16px !important;
}

.ogl_nextQuickTarget.ogl_active
{
    color:var(--red);
}

.ogl_tagged .ogl_grid
{
    align-items:center;
    display:flex;
    grid-gap:5px;
    justify-content:end;
}

.ogl_tagged .ogl_grid label
{
    align-items:center;
    display:flex;
}

.ogl_tagged .ogl_list > div
{
    grid-template-columns:30px auto 30px 30px 30px 30px;
}

.ogl_tagged .ogl_list > div > div:first-child
{
    text-align:center;
}

.ogl_tagged .ogl_list .ogl_spyIcon
{
    color:#687a89;
    font-size:16px !important;
}

.ogl_tagged .ogl_list .ogl_spyIcon:hover
{
    color:#fff;
}

.ogl_tagged .ogl_tabs,
.ogl_playerData .ogl_tagSelector
{
    display:flex;
    grid-gap:12px 6px;
    margin-bottom:8px;
    text-align:center;
}

.ogl_tagged .ogl_tabs > *,
.ogl_playerData .ogl_tagSelector > *
{
    flex:1;
}

.ogl_tagged .ogl_actions
{
    align-items:center;
    display:grid;
    grid-gap:0 4px;
    grid-template-columns:repeat(15, 1fr);
}

.ogl_tagged .ogl_actions input
{
    background:#121518 !important;
    border:none !important;
    border-bottom:1px solid #212830 !important;
    border-radius:3px !important;
    border-top:1px solid #080b10 !important;
    box-shadow:none !important;
    color:#5d738d !important;
    font-weight:bold !important;
}

.ogl_tagged .ogl_actions label
{
    align-items:center;
    background:linear-gradient(to bottom, #405064, #2D3743 2px, #181E25);
    border-radius:50px;
    cursor:pointer;
    display:flex;
    justify-content:center;
}

.ogl_tagged .ogl_actions .material-icons
{
    color:#7d8caa;
    cursor:default;
    font-size:16px !important;
    text-align:center;
    user-select:none;
}

.ogl_tagged .ogl_actions input,
.ogl_tagged .ogl_actions .ogl_button,
.ogl_tagged .ogl_actions label
{
    align-self:flex-start;
    grid-column:span 2;
    line-height:24px !important;
    text-align:center;
    user-select:none;
    width:auto;
}

.ogl_tagged .ogl_actions .ogl_button,
.ogl_tagged .ogl_list .ogl_button
{
    cursor:pointer;
    display:inline-block;
    grid-template-columns:auto;
    line-height:26px;
    padding:0 4px;
    text-align:center;
    user-select:none;
}

.ogl_tagged .ogl_actions .ogl_button:hover,
.ogl_tagged .ogl_list .ogl_button:hover
{
    color:#fff;
}

.ogl_planetTooltip
{
    min-width:150px;
}

.ogl_planetTooltip [class*='ogl_lifeform']
{
    background:#000;
    border:2px solid var(--lifeform);
    border-radius:50%;
    box-shadow:0 0 5px 2px #000;
    position:absolute;
    right:50%;
    transform:translate(30px, -10px) scale(.75);
}

.ogl_planetTooltip [class*='ogl_lifeform']:before
{
    border-radius:50%;
}

.ogl_planetTooltip h3 span
{
    display:inline;
}

.ogl_planetTooltip img
{
    border:1px solid #000;
    border-radius:50%;
    box-shadow:0 0 10px -3px #000;
    display:block;
    margin:0 auto 7px auto;
}

.ogl_planetTooltip a
{
    display:block;
}

.ogl_planetTooltip a:hover
{
    color:#fff !important;
}

.ogl_planetTooltip h3
{
    text-align:center;
}

.ogl_planetTooltip .ogl_mineRecap
{
    font-size:14px;
    font-weight:bold;
    text-align:center;
}

#empire #siteFooter .content, #siteFooter .content
{
    width:1045px !important;
}

.ogl_danger
{
    color:#ff665b !important;
}

.ogl_warning
{
    color:var(--amber) !important;
}

.ogl_caution
{
    color:var(--yellow) !important;
}

.ogl_ok
{
    color:#77ddae !important;
}

.ogl_ping
{
    color:#aaa;
    font-size:10px;
    font-weight:bold;
    position:absolute;
    right:-14px;
    top:14px;
}

.secondcol .material-icons
{
    background:linear-gradient(to bottom, #2d6778 50%, #254650 50%);
    border-radius:2px !important;
    color:#fff;
    cursor:pointer;
    font-size:20px !important;
    height:26px !important;
    line-height:26px !important;
    text-align:center !important;
    text-decoration:none !important;
    text-shadow: 1px 1px #000 !important;
    transform:scale(1) !important;
    width:32px !important;
}

.secondcol .ogl_quickCollectBtn
{
    background:linear-gradient(to bottom, #5e782d 50%, #255026 50%);
}

.secondcol #resetall.material-icons
{
    background:linear-gradient(to bottom, #812727 50%, #5c1515 50%);
}

.secondcol #sendall.material-icons
{
    background:linear-gradient(to bottom, #b76908 50%, #9b4a11 50%);
}

.ogl_tooltip > div.ogl_resourcesPreselection:not(.ogl_tooltipTriangle):not(.ogl_close)
{
    display:grid !important;
    grid-gap:5px;
}

.ogl_tooltip > div.ogl_resourcesPreselection .ogl_icon
{
    padding:0;
}

.ogl_resourcesPreselection
{
    display:grid !important;
    grid-gap:5px;
}

.ogl_resourcesPreselection .ogl_icon
{
    padding:0;
}

.ogl_resourcesPreselection .ogl_icon:before
{
    color:#ffc800;
    content:'chevron-double-right';
    font-family:'Material Icons';
    font-size:20px;
    line-height:18px;
    text-align:center;
    text-shadow:1px 1px 2px #000;
}

.ogl_resourcesPreselection hr
{
    border:none;
    height:2px;
    width:100%;
}

.ogl_resourcesPreselection .ogl_button
{
    line-height:30px;
}

[data-spy="prepare"] { color:var(--amber) !important; }
[data-spy="done"] { color:var(--teal) !important; }
[data-spy="fail"] { color:var(--red) !important; }
[data-spy="recent"] { color:var(--purple) !important; }
[data-spy]:not(.ogl_spyIcon) { box-shadow:0 0 0 2px currentColor !important; border-radius:2px !important; }

.expeditionDebrisSlotBox
{
    align-items:center;
    border:none !important;
    box-shadow:none !important;
    box-sizing:border-box !important;
    display:flex !important;
    flex-wrap:wrap !important;
    padding:4px 16px !important;
    width:642px !important;
}

.expeditionDebrisSlotBox.ogl_hidden, #expeditionDebrisSlotDebrisContainer
{
    display:none !important;
}

.expeditionDebrisSlotBox li
{
    list-style:none;
}

.expeditionDebrisSlotBox > div
{
    display:flex;
    grid-gap:20px;
    line-height:1.4;
    text-align:left;
}

.expeditionDebrisSlotBox a
{
    color:var(--green1);
}

.expeditionDebrisSlotBox a:hover
{
    text-decoration:underline;
}

.ogl_expeditionRow
{
    border-top:2px solid #1a2129;
    grid-gap:10px !important;
    margin-top:5px;
    padding-top:5px;
    width:100% !important;
}

.ogl_expeditionRow.ogl_important
{
    border:none;
    border-radius:5px;
    padding:0;
}

.ogl_expeditionRow > div:not(:last-child)
{
    display:flex;
}

.ogl_expeditionRow *
{
    white-space:nowrap;
}

.ogl_expeditionText
{
    line-height:24px;
}

.ogl_expeditionDebris
{
    display:flex;
    grid-gap:10px;
}

.ogl_sideFleetTooltip:not(.ogl_tooltipTriangle):not(.ogl_close)
{
    display:grid !important;
    font-size:11px;
    grid-gap:2px;
    max-width:800px !important;
}

.ogl_sideFleetIcon
{
    align-items:center;
    display:grid;
    grid-gap:5px;
    grid-template-columns:70px 30px 70px 60px 20px 30px 70px 98px 98px 98px;
    justify-content:center;
}

.ogl_sideFleetIcon > *:not(img)
{
    background:var(--secondary);
    border-radius:3px;
}

.ogl_sideFleetIcon > *:not(img):not(.ogl_icon)
{
    line-height:24px;
    padding:0 3px;
    text-align:center;
}

.ogl_sideFleetIcon .material-icons
{
    color:#fff;
    font-size:14px !important;
    line-height:24px !important;
}

.ogl_sideFleetIcon > span
{
    color:#fff;
}

[data-return-flight="true"]
{
    filter:brightness(.7);
}

#movementcomponent .starStreak .route
{
    color:#aaa;
    text-align:center;
}

#movementcomponent .starStreak .route b
{
    color:#fff;
    font-weight:normal;
}

.msg gradient-button .custom_btn
{
    border:none !important;
}

gradient-button img
{
    pointer-events:none !important;
}

.msg:has(.ogl_checked) message-footer-details
{
    margin-right:48px;
}

.ogl_messageButton
{
    /*background:linear-gradient(to top, #151a20, #2e3948) !important;*/
    background:linear-gradient(160deg, rgba(54,77,99,1) 0%, rgba(40,57,72,1) 33%, rgba(20,30,38,1) 66%, rgba(18,26,33,1) 100%) !important;
    /*box-shadow:inset 0 2px 2px #374454, 0 0 0 1px #181f26;*/
    box-shadow:0px 2px 3px 1px rgb(0,0,0,.55);
    border-radius:5px;
    color:#9ea5af !important;
    cursor:pointer;
    float:left;
    font-size:20px !important;
    font-weight:bold;
    height:28px;
    line-height:28px !important;
    text-align:center;
    width:28px;
}

.ogl_messageButton:hover
{
    /*background:linear-gradient(to bottom, #1a2027, #2e3948) !important;
    box-shadow:inset 0 -1px 3px #374454;*/
    background:linear-gradient(160deg, rgba(67, 107, 145, 1) 0%, rgba(52, 76, 97, 1) 33%, rgba(40, 58, 71, 1) 66%, rgba(20, 26, 32, 1) 100%) !important;
    box-shadow:0px 0px 0px 0px transparent;
}

message-footer-actions gradient-button[sq30]
{
    height:26px !important;
    width:26px !important;
}

.ogl_messageButton.ogl_ignore.ogl_active
{
    color:#c65757 !important;
}

.ogl_messageButton.ogl_ignore:before
{
    content:'toggle_off';
    font-family:'Material Icons';
    font-size:18px !important;
}

.ogl_messageButton.ogl_ignore.ogl_active:before
{
    content:'toggle_on';
}

.ogl_messageButton.ogl_ignore:hover:after
{
    display:inline-block;
}

.ogl_resourcesDetail
{
    display:grid !important;
    grid-gap:5px;
    grid-template-columns:repeat(2, 1fr);
    max-width:800px;
}

.ogl_resourcesDetail > div:last-child
{
    grid-column:1 / -1;
}

.ogl_resourcesDetail > div:not(.ogl_close)
{
    background:var(--secondary);
    padding:10px 15px;
    position:relative;
    text-align:center;
}

.ogl_resourcesDetail h3, .ogl_resourcesDetail h4
{
    color:#9ea4af;
    display:block;
}

.ogl_resourcesDetail h3
{
    font-size:24px !important;
    margin-bottom:4px;
    text-align:center;
}

.ogl_resourcesDetail h4
{
    border-bottom:2px solid #353c46;
    margin-bottom:6px;
    padding-bottom:6px;
}

.ogl_resourcesDetail .ogl_todoDays span:not(.ogl_suffix)
{
    color:#fff;
}

[data-api-code]
{
    cursor:pointer;
}

.reversal
{
    overflow:unset !important;
}

.reversal a[data-key-color]:before
{
    color:transparent;
    content:'\\e98b';
    font-family:'Material Icons';
    font-size:11px;
    line-height:12px;
    pointer-events:none;
    position:absolute;
    right:-4px;
    text-shadow:-1px 1px 2px rgba(0,0,0,.4);
    top:-3px;
}

.reversal a:before
{
    right:-6px;
    top:0;
}

.ogl_button[data-key-color="orange"]:after { color:#ff7806; }
.ogl_button[data-key-color="violet"]:after { color:#fa59fd; }
.ogl_button[data-key-color="blue"]:after { color:var(--mission15); }
.ogl_button[data-key-color="cyan"]:after { color:#7bffed; }

.reversal a[data-key-color="orange"]:before { color:#ff7806; }
.reversal a[data-key-color="violet"]:before { color:#fa59fd; }

[data-key-color="undefined"]:before
{
    display:none !important;
}

.resourceIcon .ogl_reverse
{
    color:#b1c2cb;
    font-size:14px !important;
    position:absolute;
    right:5px;
    text-shadow:1px 2px #000;
    top:3px;
    z-index:10;
}

.resourceIcon .ogl_reverse:hover
{
    opacity:1;
}

.resourceIcon .ogl_reverse
{
    right:2px;
    top:1px;
}

.ogl_notification
{
    background:#191f26;
    bottom:5px;
    box-shadow:0 0 20px 10px rgba(0,0,0,.7);
    font-weight:bold;
    max-height:500px;
    min-width:275px;
    opacity:0;
    overflow-y:auto;
    overflow-x:hidden;
    padding:14px 14px 11px 14px;
    pointer-events:none;
    position:fixed;
    right:5px;
    transform:scaleX(0);
    transform-origin:center right;
    transition:transform .2s;
    z-index:1000003;
}

.ogl_notification.ogl_active
{
    opacity:1;
    pointer-events:all;
    transform:scaleX(1);
}

.ogl_notificationLine
{
    border-bottom:1px solid #2b3a42;
    display:flex;
    font-size:11px;
    grid-gap:7px;
    line-height:15px;
    padding:8px 0;
    max-width:380px;
}

.ogl_notificationLine:last-child
{
    border:none;
}

.ogl_notification > div > *:last-child > hr:last-child
{
    display:none;
}

.ogl_notification progress
{
    appearance:none;
    height:3px;
    left:0;
    position:absolute;
    top:0;
    width:100%;
}

.ogl_notification progress::-webkit-progress-value
{
    appearance:none;
    background:var(--ogl);
    transition:width .2s linear;
}

.ogl_notification progress::-moz-progress-bar
{
    appearance:none;
    background:var(--amber);
    transition:width .2s linear;
}

.ogl_notification .ogl_ok, .ogl_notification .ogl_danger
{
    font-size:12px !important;
    margin-left:4px;
    vertical-align:middle;
}

.ogl_notification h2
{
    font-size:14px;
    text-align:center;
}

.ogl_notification .ogl_grid
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(2, 1fr);
    max-width:275px;
}

.ogl_notification .ogl_icon
{
    align-items:center;
    background:#1f2730;
    border-radius:3px;
    display:flex;
}

.ogl_notification .ogl_icon:before
{
    margin-right:auto;
}

.ogl_notification .ogl_icon[class*="lifeform"]:before
{
    background-position-y:77%;
    background-size:335px;
    height:18px;
    image-rendering:auto;
    width:28px;
}

.ogl_notification .ogl_icon .ogl_suffix
{
    text-indent:0;
}

.ogl_notification .ogl_notificationTimer
{
    color:var(--date);
    display:inline-block;
    font-size:11px;
    margin-right:5px;
    opacity:.5;
}

.ogl_empireJumpgate
{
    font-size:20px !important;
    margin-top:3px;
    text-align:center;
    width:100%;
}

#eventboxContent .eventFleet, #eventboxContent .allianceAttack
{
    align-items:center;
    display:grid;
    grid-gap:2px;
    grid-template-columns:82px 62px 23px 70px 87px auto 19px 87px 70px 20px 21px 20px;
    white-space:nowrap;
}

#eventboxContent .eventFleet > td
{
    align-items:center;
    box-shadow:0 0 0 2px rgba(0,0,0,.25);
    box-sizing:border-box;
    border-radius:3px;
    display:flex;
    height:calc(100% - 2px);
    justify-content:left;
    overflow:hidden;
    padding:2px 4px;
    text-align:center;
    width:100%;
}

#eventboxContent .eventFleet { td.arrivalTime, td.coordsOrigin, td.destCoords { justify-content:center; }}
#eventboxContent .eventFleet > td:not(.icon_movement):not(.icon_movement_reserve) { padding:2px 2px; }
#eventboxContent .eventFleet > td:nth-child(3) { background:none !important; }
#eventboxContent .eventFleet > td:nth-child(5) { grid-column:4;grid-row:1; }

#eventboxContent .eventFleet > td:nth-child(10) span,
#eventboxContent .eventFleet > td:nth-child(11) span,
#eventboxContent .eventFleet > td:nth-child(12) span
{
    display:flex !important;
}

#eventboxContent .eventFleet > td a
{
    text-decoration:none !important;
}

#eventboxContent .eventFleet > td a:hover
{
    color:var(--ogl) !important;
}

.eventFleet [data-output-time]
{
    justify-self:flex-start;
}

.icon_movement, .icon_movement_reserve
{
    background-position:center !important;
}

.originFleet, .destFleet
{
    align-items:center;
    display:flex;
    grid-gap:2px;
    justify-content:center;
}

.originFleet .tooltip[data-title]:not(figure),
.destFleet .tooltip[data-title]:not(figure)
{
    align-items:center;
    display:inline-flex !important;
    font-size:0;
    grid-gap:1px;
}

.originFleet .tooltip[data-title]:not(figure):after,
.destFleet .tooltip[data-title]:not(figure):after
{
    content:attr(data-title);
    font-size:11px;
    overflow:hidden;
    text-overflow:ellipsis;
}

.originFleet figure, .destFleet figure
{
    flex-shrink:0;
}

#technologydetails .ogl_queueShip
{
    display:flex;
    position:absolute;
    top:52px;
}

#technologydetails .ogl_queueShip .ogl_button
{
    border-radius:3px 0 0 3px;
    width:60px;
}

#technologydetails .ogl_queueShip input
{
    background:#121518;
    border:none;
    border-bottom:1px solid #242a32;
    border-radius:0 3px 3px 0;
    border-top:1px solid #080b10;
    box-shadow:none;
    box-sizing:border-box;
    color:#5d738d;
    padding:0 4px;
    text-align:left;
    width:45px;
}

.fleetDetails
{
    background:linear-gradient(to bottom, #1a1d24, #0e1014 26px) !important;
    border:none !important;
    border-radius:0 !important;
    box-shadow:0 0 20px -5px #000, 0 0 0 1px #000 !important;
    display:inline-block !important;
    line-height:18px !important;
    margin:12px 0 0 6px !important;
    overflow:unset !important;
    padding:5px !important;
    position:relative !important;
    width:96% !important;
}

.fleetDetails.detailsOpened
{
    height:auto !important;
}

.fleetDetails .starStreak, .fleetDetails .nextMission,
.fleetDetails .mission, .fleetDetails.detailsClosed .ogl_shipsBlock,
.fleetDetails.detailsClosed .ogl_resourcesBlock,
.fleetDetails.detailsClosed .fedAttack,
.fleetDetails.detailsClosed .sendMail,
.fleetDetails .fleetDetailButton, .fleetDetails .marker01, .fleetDetails .marker02
{
    display:none !important;
}

.fleetDetails hr
{
    background:#1e252e;
    border:none;
    height:2px;
}

.fleetDetails .openDetails
{
    left:auto !important;
    position:absolute !important;
    right:0 !important;
    top:-2px !important;
}

.fleetDetails.detailsOpened .timer
{
    height:auto !important;
}

.ogl_resourcesBlock
{
    box-sizing:border-box;
    display:grid;
    font-size:11px;
    grid-gap:5px;
    grid-template-columns:repeat(8, 1fr);
    margin-top:5px;
    text-wrap:nowrap;
    width:100%;
}

.ogl_resourcesBlock .ogl_icon
{
    background:#191d26;
    margin:0;
    padding:3px;
    justify-content:end;
}

.ogl_resourcesBlock .ogl_icon:before
{
    display:block;
    margin:0 auto 0 0;
}

.ogl_shipsBlock
{
    box-sizing:border-box;
    color:#fff;
    display:grid;
    grid-template-columns:repeat(3, 1fr);
}

.ogl_backTimer
{
    align-items:center;
    box-shadow:0 0 0 1px #000;
    box-sizing:border-box;
    font-size:0;
    grid-column:-3 / -1;
    grid-row:1;
    line-height:14px !important;
    padding:5px 32px 5px 5px;
    text-align:right;
}

.ogl_backTimer:before, .ogl_backTimer:after
{
    font-size:11px;
}

.ogl_backTimer:hover
{
    box-shadow:0 0 0 2px var(--ogl);
    color:transparent !important;
}

.fleetDetails .reversal_time
{
    left:auto !important;
    pointer-events:none !important;
    position:absolute !important;
    right:10px !important;
    top:31px !important;
    z-index:2 !important;
}

.fleetDetails.detailsClosed .reversal_time
{
    pointer-events:all !important;
    right:0 !important;
    top:14px !important;
}

.ogl_timeBlock
{
    align-items:center;
    border-radius:3px;
    display:grid;
    grid-gap:78px;
    grid-template-columns:repeat(2, 1fr);
}

.ogl_timeBlockLeft, .ogl_timeBlockRight
{
    border-radius:3px;
    display:grid;
    grid-template-columns:70px 70px auto;
    padding:1px;
    justify-content:start;
}

.ogl_timeBlockRight
{
    grid-template-columns:auto 70px 70px;
    justify-content:end;
    text-align:right;
}

.ogl_timeBlock > div > *
{
    left:0 !important;
    line-height:14px !important;
    margin:0 !important;
    padding:0 !important;
    position:relative !important;
    text-align:inherit !important;
    top:0 !important;
    width:auto !important;
}

.ogl_timeBlock .tooltip
{
    color:inherit !important;
}

.ogl_timeBlock .originData, .ogl_timeBlock .destinationData
{
    display:flex;
    grid-gap:5px;
    justify-content:center;
}

.ogl_timeBlock .originPlanet, .ogl_timeBlock .destinationPlanet,
.ogl_timeBlock .originCoords, .ogl_timeBlock .destinationCoords
{
    left:0 !important;
    padding:0 !important;
    position:relative !important;
}

.detailsOpened .destinationPlanet, .detailsClosed .destinationPlanet,
.detailsOpened .originPlanet
{
    width:auto !important;
}

.ogl_actionsBlock
{
    align-items:center;
    background:var(--tertiary);
    border-radius:3px;
    box-shadow:0 3px 5px -2px #000;
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(2, 1fr);
    justify-content:center;
    left:50%;
    padding:2px;
    position:absolute;
    top:-5px;
    transform:translateX(-50%);
    z-index:2;
}

.ogl_actionsBlock *
{
    justify-self:center;
    left:0 !important;
    margin:0 !important;
    padding:0 !important;
    position:relative !important;
    top:0 !important;
    width:18px !important;
}

.ogl_actionsBlock .ogl_icon[class*="ogl_mission"]:not(.ogl_mission18):before
{
    background-size:212px !important;
}

.ogl_actionsBlock .ogl_icon[class*="ogl_mission"]:before
{
    margin:0;
    width:18px;
}

.fleetDetails .allianceName
{
    bottom:auto !important;
    left:auto !important;
    right:3px !important;
    top:-17px !important;
}

.ogl_phalanxLastUpdate
{
    background:var(--secondary);
    border-radius:4px;
    margin-bottom:10px;
    padding:5px;
    text-align:center;
}

.ogl_phalanxLastUpdate b
{
    color:var(--amber);
}

.ogl_universeName
{
    color:#aeaac1;
    font-size:12px;
    font-weight:bold;
    line-height:12px;
    pointer-events:none;
    position:absolute;
    text-align:right;
    top:102px;
    width:138px;
}

.ogl_universeInfoTooltip
{
    line-height:1.4;
}

.ogl_universeInfoTooltip div
{
    color:var(--amber);
    display:inline-block;
    float:right;
    font-size:11px;
    text-indent:10px;
}

.ogl_popup .ogl_frameSelector
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(6, 1fr);
    margin-bottom:10px;
}

.ogl_popup .ogl_frameSelector .ogl_button
{
    min-width:80px;
}

.ogl_popup .ogl_frameSelector .ogl_button.ogl_active
{
    box-shadow:0 0 0 2px var(--ogl);
}

.ogl_ptreContent
{
    display:grid;
    grid-gap:10px;
    grid-template-columns:auto auto;
}

.ogl_ptreContent b
{
    align-items:center;
    border-bottom:1px solid #1b222b;
    border-top:1px solid #1b222b;
    color:#ff4646;
    display:flex;
    font-size:12px;
    justify-content:center;
    margin-bottom:10px;
    padding:5px 0;
}

.ogl_ptreContent b .material-icons
{
    font-size:16px !important;
    margin-right:5px;
}

.ogl_ptreContent h3
{
    font-size:18px;
    grid-column:1 / -1;
    padding:8px;
    text-align:center;
}

.ogl_ptreContent hr
{
    background:#151e28;
    border:none;
    grid-column:1 / -1;
    height:2px;
    width:100%;
}

.ogl_ptreActivityBlock, .ogl_ptreBestReport
{
    background:rgba(0,0,0,.2);
    border-radius:9px;
    padding:10px;
}

.ogl_ptreLegend
{
    color:var(--blue);
    font-size:10px;
    margin-top:20px;
    text-align:left;
}

.ogl_ptreActivities [data-check]
{
    align-self:center;
    background:currentColor;
    border:3px solid currentColor;
    border-radius:50%;
    height:0;
    padding:4px;
    width:0;
}

.ogl_ptreActivities [data-check].ogl_active
{
    background:none;
}

.ogl_ptreActivities > span
{
    color:var(--red);
}

.ogl_ptreActivities > div
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(12, 1fr);
}

.ogl_ptreActivities > div > *
{
    align-items:center;
    background:var(--secondary);
    border-radius:2px;
    color:#656f78;
    display:grid;
    height:45px;
    padding:3px;
}

.ogl_ptreActivities > div > * > *
{
    display:inline-block;
    margin:auto;
}

.ogl_ptreActivities .ptreDotStats
{
    height:30px;
    position:relative;
    width:30px;
}

.ogl_ptreContent
{
    text-align:center;
}

.ogl_ptreBestReport > div:first-child
{
    padding:10px;
}

.ogl_checked
{
    align-items:center;
    bottom:5px;
    color:#4d5e78 !important;
    display:flex;
    font-size:20px !important;
    height:28px;
    justify-content:center;
    position:absolute;
    right:5px;
    width:24px;
}

.ogl_log > div:not(.ogl_close):not(.ogl_share)
{
    border-bottom:1px solid #20262c;
    display:grid;
    grid-template-columns:100px 100px 300px;
    margin-top:5px;
    padding-bottom:5px;
}

.ogl_log h2
{
    grid-column:1 / -1;
}

.ogl_ptreActionIcon
{
    align-items:center;
    display:inline-flex;
    justify-content:center;
}

.ogl_ptreActionIcon i
{
    color:inherit;
    font-size:12px !important;
}

.ogl_ptreActionIcon i.ogl_active
{
    animation:blink 1.5s linear infinite;
}

@keyframes blink
{
  50% { opacity: 0; }
}

.ogl_leftMenuIcon
{
    background:linear-gradient(to bottom, #1b2024 50%, #000 50%);
    border-radius:4px;
    display:block;
    height:27px;
    margin-right:11px;
    user-select:none;
    text-align:center;
    width:27px !important;
}

.ogl_leftMenuIcon a
{
    align-items:center;
    color:#353a3c !important;
    display:flex !important;
    height:100%;
    justify-content:center;
}

.ogl_leftMenuIcon a i
{
    font-size:21px !important;
    line-height:27px !important;
}

.ogl_leftMenuIcon a:hover
{
    color:#d39343 !important;
}

.ogl_resourceBoxStorage
{
    display:none;
    font-size:10px;
    left:0;
    pointer-events:none;
    position:absolute;
    top:12px;
    width:100%;
}

#resources:hover .ogl_resourceBoxStorage
{
    display:block;
}

#resources:hover .resource_tile .resourceIcon.metal,
#resources:hover .resource_tile .resourceIcon.crystal,
#resources:hover .resource_tile .resourceIcon.deuterium
{
    box-shadow:inset 0 0 0 20px rgba(0,0,0, .8);
}

.ogl_manageData .ogl_grid
{
    display:grid;
    grid-gap:5px;
}

.ogl_manageData .ogl_button
{
    align-items:center;
    display:flex;
    justify-content:center;
    padding:3px 9px;
}

.ogl_manageData .ogl_button .material-icons
{
    margin-left:auto;
}

.ogl_manageData .ogl_button.ogl_danger
{
    background:linear-gradient(to bottom, #7c4848, #5a3535 2px, #3a1818);
    color:#b7c1c9 !important;
}

.ogl_manageData .ogl_button.ogl_danger:hover
{
    color:var(--ogl) !important;
}

.ogl_manageData hr
{
    background:#151e28;
    border:none;
    grid-column:1 / -1;
    height:2px;
    width:100%;
}

.chat_msg .msg_date
{
    position:absolute;
}

.ogl_acsInfo .value span
{
    margin-left:5px;
}

.ogl_blackHoleButton
{
    font-size:16px !important;
    position:absolute;
    right:-3px;
    top:0;
    transform:translateX(100%);
    width:28px;
}

.ogl_blackhole .ogl_button
{
    float:right;
    margin-top:10px;
    width:70px;
}

.ogl_buildIconList
{
    bottom:0;
    display:flex;
    left:30px;
    pointer-events:none;
    position:absolute;
}

.ogl_buildIcon
{
    color:#73fff2;
}

.ogl_baseShip
{
    color:#ffcb55;
}

.ogl_buildIcon.ogl_lfBuilding
{
    color:#e598ff;
}

.ogl_buildList
{
    margin-top:5px;
}

.ogl_buildList li
{
    align-items:center;
    display:flex;
}

.ogl_buildList li span
{
    display:inline-block;
    max-width:100px;
}

.ogl_buildList .material-icons
{
    margin:0 7px;
}

.ogl_buildList .material-icons:first-child
{
    font-size:8px !important;
    margin:0 4px 0 0;
}

.ogl_buildList b
{
    color:var(--amber);
    font-size:12px;
    font-weight:bold;
}

[data-debug]
{
    position:relative;
}

[data-debug]:after
{
    background:rgba(0,0,0,.7);
    color:yellow !important;
    content:attr(data-debug);
    display:block;
    left:0;
    opacity:.8;
    position:absolute;
    text-shadow:1px 1px #000;
    top:12px;
    width:max-content;
}

.ogl_datePicker
{
    display:grid !important;
    grid-gap:10px;
    grid-template-columns:repeat(3, 1fr);
    user-select:none;
}

.ogl_datePicker .ogl_dateItem
{
    align-items:center;
    display:flex;
    font-size:14px;
    justify-content:center;
}

.ogl_datePicker .material-icons
{
    font-size:16px !important;
}

#jumpgate #selecttarget select
{
    display:block !important;
    visibility:visible !important;
}

#jumpgate #selecttarget .dropdown
{
    display:none !important;
}

#jumpgate select
{
    font-size:12px !important;
    padding:2px !important;
}

.ogl_boardMessageTab
{
    padding-top:7px;
    padding:7px 8px 0 8px;
    position:relative;
}

.ogl_boardMessageTab .newMessagesCount
{
    background-color:#242d37;
    border:1px solid #40c4c1;
    border-radius:8px;
    box-shadow:0 2px 4px rgba(0, 0, 0, 0.75);
    color:#ffffff;
    line-height:16px;
    font-size:9px;
    height:16px;
    min-width:16px;
    padding:0 2px;
    position:absolute;
    right:-3px;
    text-align:center;
    top:-3px;
}

.ogl_boardMessageTab.marker
{
    background:url('http://gf1.geo.gfsrv.net/cdn69/112960c1ace80c7dcb03ca88d4b6fc.png') no-repeat;
}

.ogl_boardMessageTab .tabLabel
{
    margin-top:6px;
}

.ogl_boardMessageTab .material-icons
{
    align-items:center;
    background:linear-gradient(to bottom, #d7dfe5 50%, #d4d9dd 50%);
    background-clip:text;
    color:transparent;
    display:flex;
    font-size:36px !important;
    height:100%;
    justify-content:center;
    margin-bottom:4px;
    width:100%;
}

.ogl_boardMessageTab .tabImage
{
    background:linear-gradient(135deg, #375063 33.33%, #23394a 33.33%, #23394a 50%, #375063 50%, #375063 83.33%, #23394a 83.33%, #23394a 100%) !important;
    background-size:3px 3px !important;
    border-bottom:1px solid #385365 !important;
    border-left:2px solid #3c596c !important;
    border-right:2px solid #3c596c !important;
    border-top:1px solid #385365 !important;
    border-radius:7px !important;
    box-shadow:inset 0 0 10px 6px #1c2831 !important;
    cursor:pointer !important;
    height:50px !important;
    margin-top:1px !important;
    position:relative !important;
    text-decoration:none !important;
    width:48px !important;
}

.ogl_boardMessageTab .tabImage:hover
{
    filter:brightness(1.2);
}

.ogl_boardMessageTab .tabImage:before
{
    background:#395467;
    border-radius:6px;
    content:'';
    filter:blur(0.5px);
    height:calc(50% + 2px);
    left:0;
    opacity:.6;
    position:absolute;
    right:0;
    top:-2px;
}

.ogl_boardMessageTab .tabImage:after
{
    background:#395467;
    border-radius:7px;
    bottom:2px;
    content:'';
    filter:blur(1px);
    height:4px;
    left:3px;
    opacity:.6;
    position:absolute;
    right:3px;
}

.ogl_boardMessageTab.ui-tabs-active .marker
{
    left:-10px !important;
    top:-9px !important;
}

#oglBoardTab *
{
    max-width:100%;
}

#oglBoardTab .msg
{
    padding:10px;
}

#oglBoardTab .msg_content
{
    margin-top:10px;
    padding:0;
}

#oglBoardTab .msg_title
{
    display:inline-block !important
}

#oglBoardTab .msg_title:hover
{
    color:#fff;
    cursor:pointer;
    text-decoration:underline;
}

#oglBoardTab .msg_title i
{
    color:var(--pink);
}

#oglBoardTab .spoilerBox
{
    display:none !important;
}

.ogl_sidenote
{
    color:#aaa;
    font-style:italic;
}

.ogl_shipDataInfo .material-icons
{
    color:#7ca8ad;
    font-size:18px !important;
    vertical-align:middle;
}

.ogl_shipDataInfo b
{
    color:var(--ogl);
}

.ogl_totalRequired
{
    background:var(--primary);
    border-radius:3px;
    margin-top:10px;
    padding:10px;
}

.ogl_totalRequired h3
{
    pointer-events:none;
    text-align:center;
}

.ogl_totalRequired h3:after
{
    content:none;
}

.ogl_totalRequired .ogl_200:before
{
    visibility:hidden;
}

.ogl_totalRequired .ogl_grid
{
    display:flex;
}

.ogl_totalRequired .ogl_icon
{
    display:grid;
    grid-gap:8px;
    text-align:center;
}

.ogl_totalRequired .ogl_icon:before
{
    margin:auto;
}

.shipyardSelection
{
    background:var(--primary);
    padding:10px;
    width:auto !important;
}

.ogl_timeBox
{
    display:block;
    margin-top:5px;
}

.ogl_lineBreakFlex
{
    flex-basis:100%;
    height:0;
}

#messagecontainercomponent .msgHead
{
    padding:5px 5px 0 8px !important;
}

.msg .content-box
{
    display:none !important;
}

.msg:has([data-raw-messagetype="25"]) { box-shadow:inset 3px 0 var(--mission1) !important; }
.msg:has([data-raw-messagetype="41"]) { box-shadow:inset 3px 0 var(--mission15) !important; }
.msg:has([data-raw-messagetype="61"]) { box-shadow:inset 3px 0 var(--lifeform) !important; }
.msg:has([data-raw-messagetype="32"]) { box-shadow:inset 3px 0 var(--mission8) !important; }
.msg:has([data-raw-messagetype="34"]):has(.ogl_battle) { box-shadow:inset 3px 0 var(--mission3) !important; }
.msg:has([data-raw-messagetype="35"]), .msg:has([data-raw-messagetype="54"])
{
    .content-box { display:block !important; }
}

.detail_msg .loot-row
{
    background:#1f252e;
    border-radius:5px;
    padding:5px;
}

.ogl_spytable .fleetAction
{
    right:0 !important;
    margin-left:0 !important;
    pointer-events:none !important;
}

#messagecontainercomponent .msg
{
    margin-bottom:3px !important;
}

.messagesHolder .msgWithFilter .msgFilteredHeaderRow
{
    border-bottom:1px solid #000;
    box-shadow:none !important;
}

.tippy-box
{
    box-shadow:0 0 20px -5px #000, 0 0 5px 2px rgba(0,0,0,.5) !important;
}

.tippy-content
{
    background:var(--tertiary) !important;
    border:none !important;
    border-radius:5px !important;
    font-size:11px !important;
    padding:20px !important;
}

.tippy-content hr, .ogl_notification hr
{
    background:#1e252e;
    border:none;
    grid-column:1 / -1;
    height:2px;
    width:100%;
}

.tippy-arrow
{
    color:#171c24 !important;
}

.tippy-box[data-animation='pop'][data-state='hidden'] { opacity:0; }
.tippy-box[data-animation='pop'][data-state='hidden'][data-placement^="left"] { transform:translateX(20px); }
.tippy-box[data-animation='pop'][data-state='hidden'][data-placement^="right"] { transform:translateX(-20px); }
.tippy-box[data-animation='pop'][data-state='hidden'][data-placement^="bottom"] { transform:translateY(-20px); }
.tippy-box[data-animation='pop'][data-state='hidden'][data-placement^="top"] { transform:translateY(20px); }

* /* trick to ignore !important */
{
    .status_abbr_inactive { color:var(--inactive) !important; }
    .status_abbr_longinactive { color:var(--longInactive) !important; }
    .status_abbr_banned { color:var(--banned) !important; }
    .status_abbr_vacation { color:var(--vacation) !important; }
    .status_abbr_honorableTarget { color:var(--honorable) !important; }
}

[data-status-tag]:not([data-status-tag='false']):before
{
    content:'('attr(data-status-tag)')';
    margin-right:2px;
    opacity:.75;
    white-space:nowrap;
}

.ogl_highlight
{
    color:var(--amber);
}

.ogl_oldScore
{
    font-weight:normal;
}

.ogl_oldScore em
{
    /*background:#343434;*/
    border-radius:2px;
    /*color:#707070;*/
    font-style:normal;
    padding:1px;
}

#highscoreContent form #content
{
    box-sizing:border-box !important;
    padding:10px !important;
}

#highscoreContent div.content table
{
    width:100% !important;
}

#highscoreContent #ranks tbody tr
{
    background:#151920 !important;
    border-bottom:3px solid #0d1014 !important;
}

#highscoreContent #ranks tbody tr.myrank
{
    background:linear-gradient(192deg, #23575c, #1c2a34 70%) !important;
}

#highscoreContent #ranks tbody tr.allyrank
{
    background:linear-gradient(192deg, #2f366a, #181a2c 70%) !important;
}

#highscoreContent #ranks td
{
    background:none !important;
    border:none !important;
    padding:0 !important;
}

#highscoreContent #ranks .playername
{
    font-size:11px !important;
    font-weight:normal !important;
}

#highscoreContent #ranks .ally-tag
{
    font-size:11px !important;
    margin-right:4px !important;
}

#highscoreContent #ranks profile-picture
{
    height:32px !important;
    width:32px !important;
}

#highscoreContent #ranks profile-picture *
{
    max-height:100% !important;
    max-width:100% !important;
}

#highscoreContent #ranks .highscoreNameFieldWrapper
{
    height:40px !important;
}

#highscoreContent #ranks .honorScore
{
    display:none !important;
}

#highscoreContent #ranks tr.expandedRow
{
    height:auto !important;
}

#highscoreContent #ranks thead .score
{
    font-weight:normal;
}

#highscoreContent #ranks .score
{
    color:#848484 !important;
    font-size:11px !important;
    padding-right:5px !important;
}

#highscoreContent #ranks .highscorePositionIcon
{
    background-size:75% !important;
    height:40px !important;
}

#highscoreContent #ranks .position
{
    text-align:center !important;
}

#highscoreContent #ranks.allyHighscore tbody .name
{
    display:flex;
    grid-gap:4px;
    line-height:34px;
    padding-left:14px !important;
}

.ogl_lastGalaxyRefresh
{
    font-size:11px;
    margin:auto 5px auto auto;
}

`, oglMaterial = (GM_addStyle(css), `
@font-face
{
    font-family:'Material Icons';
    font-style:normal;
    font-weight:400;
    src:url('data:font/woff2;base64,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') format('woff2');
}
`), miniImage = (GM_addStyle(oglMaterial), `
/*css*/
body[data-minipics="true"]
{
    .maincontent > div header, .maincontent .planet-header
    {
        height:34px !important;
    }

    .maincontent #overviewcomponent #planet,
    .maincontent #overviewcomponent #detailWrapper
    {
        height:auto !important;
        min-height:208px !important;
        position:relative !important;
    }

    .maincontent #technologydetails_wrapper:not(.slide-down)
    {
        position:relative !important;
    }

    .maincontent #detail.detail_screen
    {
        height:300px !important;
        position:relative !important;
    }
}
/*!css*/
`), altStyle = (GM_addStyle(miniImage), `
/*css*/
body[data-menulayout="1"], body[data-menulayout="2"]
{
    #bannerSkyscrapercomponent
    {
        margin-left:260px !important;
    }

    /*#pageContent, #mainContent
    {
        width:1016px !important;
        width:990px !important;
    }*/

    #headerbarcomponent
    {
        width:1016px !important;
    }

    #commandercomponent
    {
        transform:translateX(25px);
    }

    .ogl_topbar
    {
        font-size:16px;
        width:100%;
    }

    #planetbarcomponent #rechts
    {
        width:170px !important;
    }

    #planetList
    {
        transform:translate(0);
        width:100%;
    }

    .smallplanet
    {
        background:#0e1116;
        box-sizing:border-box;
        height:38px !important;
    }

    .smallplanet .planetlink, .smallplanet .moonlink
    {
        border-radius:4px !important;
        height:100% !important;
    }

    .smallplanet .planet-name
    {
        top:6px !important;
    }

    .smallplanet .planet-koords
    {
        bottom:7px !important;
    }

    .smallplanet .planetPic
    {
        box-shadow:0 0 2px #000000 !important;
        left:8px !important;
        top:7px !important;
        transform:scale(1.2);
    }

    .smallplanet .icon-moon
    {
        box-shadow:0 0 3px #000000 !important;
        left:11px !important;
        top:11px !important;
        transform:scale(1.1);
    }

    #planetbarcomponent #rechts .ogl_shortcuts
    {
        transform:translateX(0);
        width:170px;
    }

    #planetbarcomponent #rechts .ogl_shortcuts [data-key]
    {
        width:42px;
    }
}

body[data-menulayout="1"]
{
    .smallplanet { grid-template-columns:127px 38px; }
    .smallplanet .ogl_available { display:none; }
    .smallplanet .planet-name, .smallplanet .planet-koords { left:40px !important; }
    .ogl_refreshTimer { background:none;font-size:11px;left:auto;right:3px; }
    &.ogl_destinationPicker .smallplanet .planetlink.ogl_currentDestination:after { top:9px !important;left:9px !important; }
    &.ogl_destinationPicker .smallplanet .moonlink.ogl_currentDestination:after { top:9px !important;left:10px !important; }
    .ogl_buildIconList { left:4px; }
}

body[data-menulayout="2"]
{
    .smallplanet { grid-template-columns:101px 64px; }
    .smallplanet .ogl_available { line-height:10px; }
    .smallplanet .planet-name, .smallplanet .planet-koords { opacity:0 !important; }
    .smallplanet .icon-moon { left:4px !important; }
    &.ogl_destinationPicker .smallplanet .planetlink.ogl_currentDestination:after { top:9px !important;left:9px !important; }
    &.ogl_destinationPicker .smallplanet .moonlink.ogl_currentDestination:after { top:9px !important;left:4px !important; }
}

body[data-sidepanel="true"]
{
    .ogl_side
    {
        right:auto;
        transform:translateX(-100%);
    }

    .ogl_side.ogl_active
    {
        transform:translateX(-0%);
    }
}

/*!css*/
`);

GM_addStyle(altStyle);

class CSSManager {
    static miniMenu(layout) {
        document.body.setAttribute("data-menulayout", layout), localStorage.setItem("ogl_menulayout", layout);
    }
    static miniImage(state) {
        document.body.setAttribute("data-minipics", state), localStorage.setItem("ogl_minipics", state);
    }
    static sidePanelLeft(state) {
        document.body.setAttribute("data-sidepanel", state), localStorage.setItem("ogl_sidepanel", state);
    }
}