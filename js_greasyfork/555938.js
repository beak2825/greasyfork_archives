// ==UserScript==
// @name         OGLight-Bot-Sid
// @version      5.3.6
// @description  OGLight script for OGame
// @author       Oz
// @license      MIT
// @copyright    2019, Oz

// @match        http://212.195.47.38:8080/bots/*/browser/*
// @match        http://192.168.1.88:8080/bots/*/browser/*
// @match        http://5.49.35.107:16387/bots/*/browser/*
// @match        http://79.87.64.111:8080/bots/*/browser/*
// @match        http://87.64.122.4:3005/bots/*/browser/*
// @grant           GM_addStyle
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_xmlhttpRequest
// @grant			GM_getTab
// @grant			GM_saveTab
// @grant			GM_notification
// @grant           GM_setClipboard
// @run-at          document-start
// @namespace https://greasyfork.org/users/1501974
// @downloadURL https://update.greasyfork.org/scripts/555938/OGLight-Bot-Sid.user.js
// @updateURL https://update.greasyfork.org/scripts/555938/OGLight-Bot-Sid.meta.js
// ==/UserScript==
'use strict';

// FIREFOX FIXES

console.log('OGLight 5.3.3 loaded');
console.log('typeof Object.values:', typeof Object.values);

if (!Object.values) {
    console.log('Polyfill Object.values for Firefox');
    Object.values = function(obj) {
        return Object.keys(obj).map(key => obj[key]);
    };
}


let oglVersion = "5.3.0";
let betaVersion = "-b92";

const universeUrl = document.querySelector('head meta[name="ogame-universe"]')?.getAttribute("content");
const universeId = universeUrl.split('-')[0].replace('s', "");

crypto.randomUUID = function randomUUID() {
    return (
        [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
            c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
};

// redirect user if needed
const oglRedirection = localStorage.getItem('ogl-redirect');
if(oglRedirection?.indexOf('http') > -1)
{
    if(typeof window?.GM_addStyle !== typeof undefined)
    {
        GM_addStyle(`
            body { background:#000 !important; }
            body * { display:none !important; }
        `);
    }

    localStorage.setItem('ogl-redirect', false);
    setTimeout(() => window.location.replace(oglRedirection));
}

// fix for firefox
if(unsafeWindow?.ogl) unsafeWindow.ogl = null;

// update body attributes as fast as possible
const updateOGLBody = () =>
{
    document.body.dataset.minipics = localStorage.getItem('ogl_minipics') || false;
    document.body.dataset.menulayout = localStorage.getItem('ogl_menulayout') || 0;
    document.body.dataset.colorblind = localStorage.getItem('ogl_colorblind') || false;
    document.body.dataset.sidepanel = localStorage.getItem('ogl_sidepanelleft') || false;
}

if(document.body)
{
    updateOGLBody();
}
else
{
    document.addEventListener('readystatechange', () =>
    {
        if(document.readyState === "loading") updateOGLBody();
        else if(!document.body?.dataset?.minipics) updateOGLBody();
    });
}

if(typeof window?.GM_getTab == typeof undefined)
{
    window.GM_getTab = tab =>
    {
        const params = JSON.parse(GM_getValue('ogl_tab') || '{}');
        tab(params);
    }
}

if(typeof window?.GM_saveTab == typeof undefined)
{
    window.GM_saveTab = data =>
    {
        GM_setValue('ogl_tab', JSON.stringify(data ||  {}));
    }
}

if(typeof window?.GM_addStyle === typeof undefined)
{
    window.GM_addStyle = css =>
    {
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        document.head.appendChild(style);
    }
}

if(typeof window?.GM_info == typeof undefined)
{
    window.GM_info = {};
    window.GM_info.script = {};
    window.GM_info.script.name = 'OGLight GM_less';
    window.GM_info.script.version = oglVersion;
    window.GM_info.script.downloadURL = 'http://openuserjs.org/install/nullNaN/OGLight.user.js';
}

if(typeof window?.GM_xmlhttpRequest == typeof undefined)
{
    window.GM_xmlhttpRequest = () => {};
}

if(typeof window?.GM_notification == typeof undefined)
{
    window.GM_notification = () => {};
}

class OGLight
{
    constructor(params)
    {

        //console.log(Util.hash('test'))

        // OGL database
        //this.DBName = `${this.server.lang}_${this.server.id}_${this.account.id}`;
        this.DBName = window.location.pathname.replaceAll('/', ''),
        this.db = this.load();
        
        //this.db = new Database(this.DBName);

        // fix beta old DB
        if(!GM_getValue(this.DBName) && GM_getValue(window.location.host))
        {
            GM_setValue(this.DBName, GM_getValue(window.location.host));
            GM_deleteValue(window.location.host);
            window.location.reload();
        }

        const dbDefaults =
        {
            lastServerUpdate: 0,
            lastEmpire0Update: 0,
            lastEmpire1Update: 0,
            lastLFBonusUpdate: 0,
            lastProductionQueueUpdate: 0,
            udb: {}, // players
            pdb: {}, // planets
            tdb: {}, // targets
            myPlanets: {},
            activeItems: [],
            dataFormat: 0,
            tags:
            {
                red: true,
                orange: true,
                yellow: true,
                lime: true,
                green: true,
                blue: true,
                dblue: true,
                violet: true,
                magenta: true,
                pink: true,
                brown: true,
                gray: true,
                none: false
            },
            lastPinTab: 'miner',
            shipsCapacity: {},
            spytableSort: 'total',
            lastTaggedInput: [],
            lastPinnedList: [],
            initialTime: Date.now(),
            fleetLimiter:
            {
                data: {},
                jumpgateData: {},
                moonData: {},
                shipActive: false,
                resourceActive: false,
                jumpgateActive: false
            },
            keepEnoughCapacityShip: 200,
            keepEnoughCapacityShipJumpgate: 200,
            spyProbesCount: 6,
            configState:
            {
                fleet: true,
                general: true,
                expeditions: true,
                stats: true,
                messages: true,
                data: true,
                PTRE: true,
                interface: true
            },
            browserNotificationList: {},
            lastAccountTab: {},
            lastBoardPosts: [0, 0, 0],
            options:
            {
                defaultShip: 202,
                defaultMission: 3,
                resourceTreshold: 300000,
                ignoreConsumption: false,
                ignoreExpeShipsLoss: false,
                useClientTime: false,
                displayMiniStats: 'day',
                collectLinked: false,
                expeditionValue: 0,
                expeditionBigShips: [204, 205, 206, 207, 215],
                expeditionRandomSystem: 0,
                expeditionRedirect: false,
                expeditionShipRatio: 100,
                displayPlanetTimers: false,
                reduceLargeImages: false,
                colorblindMode: false,
                showMenuResources: 0,
                autoCleanReports: false,
                autoCleanCounterSpies: false,
                tooltipDelay: 400,
                spyIndicatorDelay: 3600000,
                debugMode: false,
                sim: false,
                boardTab: true,
                msu: '3:2:1',
                disablePlanetTooltips: false,
                displaySpyTable: true,
                shortcutsOnRight: false,
                sidePanelOnLeft: false,
                spyTableRules: [],
                spyTableMSU: false,
                keyboardActions:
                {
                    menu: '²',
                    previousPlanet: 'i',
                    nextPlanet: 'o',
                    nextPinnedPosition: 'm',
                    fleetRepeat: 'p',
                    fleetSelectAll: 'a',
                    fleetReverseAll: 'r',
                    fleetQuickCollect: 'q',
                    expeditionSC: 's',
                    expeditionLC: 'l',
                    expeditionPF: 'f',
                    quickRaid: 't',
                    fleetResourcesSplit: '2-9',
                    galaxyUp: window.location.host.split(/[-.]/)[1] == 'fr' ? 'z' : 'w',
                    galaxyLeft: window.location.host.split(/[-.]/)[1] == 'fr' ? 'q' : 'a',
                    galaxyDown: 's',
                    galaxyRight: 'd',
                    galaxyReload: 'f',
                    galaxySpySystem: 'r',
                    backFirstFleet: 'f',
                    backLastFleet: 'l',
                    discovery: 'u',
                    showMenuResources: 'v'
                }
            }
        }

        this.db = Object.assign({}, dbDefaults, this.db);
        this.db.options = Object.assign({}, dbDefaults.options, this.db.options || {});
        this.db.options.keyboardActions = Object.assign({}, dbDefaults.options.keyboardActions, this.db.options.keyboardActions || {});
        this.db.fleetLimiter = Object.assign({}, dbDefaults.fleetLimiter, this.db.fleetLimiter || {});
        this.db.configState = Object.assign({}, dbDefaults.configState, this.db.configState || {});
        this.db.tags = Object.assign({}, dbDefaults.tags, this.db.tags || {});

        this.db.fleetLimiter.moonData = this.db.fleetLimiter.moonData || this.db.fleetLimiter.data;
        this.db.options.expeditionShipRatio = Math.min(this.db.options.expeditionShipRatio, 100);
        this.db.options.tooltipDelay = this.db.options.tooltipDelay !== false ? Math.max(this.db.options.tooltipDelay, 100) : 400;

        /*this.db.lastServerUpdate = this.db.lastServerUpdate || 0;
        this.db.lastEmpire0Update = this.db.lastEmpire0Update || 0;
        this.db.lastEmpire1Update = this.db.lastEmpire1Update || 0;
        this.db.lastLFBonusUpdate = this.db.lastLFBonusUpdate || 0;
        this.db.lastProductionQueueUpdate = this.db.lastProductionQueueUpdate || 0;

        this.db.udb = this.db.udb || {}; // players
        this.db.pdb = this.db.pdb || {}; // planets
        this.db.tdb = this.db.tdb || {}; // tagged positions
        this.db.myPlanets = this.db.myPlanets || {};
        this.db.activeItems = this.db.activeItems || [];

        this.db.dataFormat = this.db.dataFormat || 0;
        this.db.tags = Object.keys(this.db.tags || {}).length == 13 ? this.db.tags : { red:true, orange:true, yellow:true, lime:true, green:true, blue:true, dblue:true, violet:true, magenta:true, pink:true, brown:true, gray:true, none:false };
        this.db.lastPinTab = this.db.lastPinTab || 'miner';
        this.db.shipsCapacity = this.db.shipsCapacity || {};
        this.db.spytableSort = this.db.spytableSort || 'total';
        this.db.lastTaggedInput = this.db.lastTaggedInput || [];
        this.db.lastPinnedList = this.db.lastPinnedList || [];
        this.db.initialTime = this.db.initialTime || Date.now();
        this.db.fleetLimiter = this.db.fleetLimiter || { data:{}, jumpgateData:{}, moonData:{}, shipActive:false, resourceActive:false, jumpgateActive:false };
        this.db.fleetLimiter.moonData = this.db.fleetLimiter.moonData || this.db.fleetLimiter.data;
        this.db.keepEnoughCapacityShip = this.db.keepEnoughCapacityShip || 200;
        this.db.keepEnoughCapacityShipJumpgate = this.db.keepEnoughCapacityShipJumpgate || 200;
        this.db.spyProbesCount = this.db.spyProbesCount || 6;
        this.db.configState = this.db.configState || { fleet:true, general:true, expeditions:true, stats:true, messages:true, data:true, PTRE:true, interface:true };
        this.db.browserNotificationList = this.db.browserNotificationList || {};
        this.db.lastAccountTab = this.db.lastAccountTab || {};
        this.db.lastBoardPosts = this.db.lastBoardPosts || [0, 0, 0];

        this.db.options = this.db.options || {};
        this.db.options.defaultShip = this.db.options.defaultShip || 202;
        this.db.options.defaultMission = this.db.options.defaultMission || 3;
        this.db.options.resourceTreshold = this.db.options.resourceTreshold || 300000;
        this.db.options.ignoreConsumption = this.db.options.ignoreConsumption || false;
        this.db.options.ignoreExpeShipsLoss = this.db.options.ignoreExpeShipsLoss || false;
        this.db.options.useClientTime = this.db.options.useClientTime || false;
        this.db.options.displayMiniStats = typeof(this.db.options.displayMiniStats) !== "undefined" ? this.db.options.displayMiniStats : 'day';
        this.db.options.collectLinked = this.db.options.collectLinked || false;
        this.db.options.expeditionValue = this.db.options.expeditionValue || 0;
        this.db.options.expeditionBigShips = this.db.options.expeditionBigShips || [204, 205, 206, 207, 215];
        this.db.options.expeditionRandomSystem = this.db.options.expeditionRandomSystem || 0;
        this.db.options.expeditionRedirect = this.db.options.expeditionRedirect || false;
        this.db.options.expeditionShipRatio = Math.min(this.db.options.expeditionShipRatio || 100, 100);
        this.db.options.displayPlanetTimers = this.db.options.displayPlanetTimers === false ? false : true;
        this.db.options.reduceLargeImages = this.db.options.reduceLargeImages || false;
        this.db.options.colorblindMode = this.db.options.colorblindMode || false;
        this.db.options.showMenuResources = this.db.options.showMenuResources || 0;
        this.db.options.autoCleanReports = this.db.options.autoCleanReports || false;
        this.db.options.autoCleanCounterSpies = this.db.options.autoCleanCounterSpies || false;
        this.db.options.tooltipDelay = this.db.options.tooltipDelay !== false ? Math.max(this.db.options.tooltipDelay, 100) : 400;
        this.db.options.spyIndicatorDelay = this.db.options.spyIndicatorDelay || 3600000; // 1h
        //this.db.options.lootFoodOnAttack = this.db.options.lootFoodOnAttack === false ? false : true;
        this.db.options.debugMode = this.db.options.debugMode || false;
        this.db.options.sim = this.db.options.sim || false;
        this.db.options.boardTab = this.db.options.boardTab === false ? false : true;
        this.db.options.msu = this.db.options.msu || '3:2:1';
        this.db.options.disablePlanetTooltips = this.db.options.disablePlanetTooltips || false;
        this.db.options.displaySpyTable = this.db.options.displaySpyTable === false ? false : true;
        this.db.options.shortcutsOnRight = this.db.options.shortcutsOnRight || false;
        this.db.options.sidePanelOnLeft = this.db.options.sidePanelOnLeft || false;
        this.db.options.spyTableRules = this.db.options.spyTableRules || [];

        this.db.options.keyboardActions = this.db.options.keyboardActions || {};
        this.db.options.keyboardActions.menu = this.db.options.keyboardActions.menu || '²';
        this.db.options.keyboardActions.previousPlanet = this.db.options.keyboardActions.previousPlanet || 'i';
        this.db.options.keyboardActions.nextPlanet = this.db.options.keyboardActions.nextPlanet || 'o';
        this.db.options.keyboardActions.nextPinnedPosition = this.db.options.keyboardActions.nextPinnedPosition || 'm';
        this.db.options.keyboardActions.fleetRepeat = this.db.options.keyboardActions.fleetRepeat || 'p';
        this.db.options.keyboardActions.fleetSelectAll = this.db.options.keyboardActions.fleetSelectAll || 'a';
        this.db.options.keyboardActions.fleetReverseAll = this.db.options.keyboardActions.fleetReverseAll || 'r';
        this.db.options.keyboardActions.fleetQuickCollect = this.db.options.keyboardActions.fleetQuickCollect || 'q';
        this.db.options.keyboardActions.expeditionSC = this.db.options.keyboardActions.expeditionSC || 's';
        this.db.options.keyboardActions.expeditionLC = this.db.options.keyboardActions.expeditionLC || 'l';
        this.db.options.keyboardActions.expeditionPF = this.db.options.keyboardActions.expeditionPF || 'f';
        this.db.options.keyboardActions.quickRaid = this.db.options.keyboardActions.quickRaid || 't';
        this.db.options.keyboardActions.fleetResourcesSplit = this.db.options.keyboardActions.fleetResourcesSplit || '2-9';
        this.db.options.keyboardActions.galaxyUp = this.db.options.keyboardActions.galaxyUp || (window.location.host.split(/[-.]/)[1] == 'fr' ? 'z' : 'w');
        this.db.options.keyboardActions.galaxyLeft = this.db.options.keyboardActions.galaxyLeft || (window.location.host.split(/[-.]/)[1] == 'fr' ? 'q' : 'a');
        this.db.options.keyboardActions.galaxyDown = this.db.options.keyboardActions.galaxyDown || 's';
        this.db.options.keyboardActions.galaxyRight = this.db.options.keyboardActions.galaxyRight || 'd';
        this.db.options.keyboardActions.galaxyReload = this.db.options.keyboardActions.galaxyReload || 'f';
        this.db.options.keyboardActions.galaxySpySystem = this.db.options.keyboardActions.galaxySpySystem || 'r';
        this.db.options.keyboardActions.backFirstFleet = this.db.options.keyboardActions.backFirstFleet || 'f';
        this.db.options.keyboardActions.backLastFleet = this.db.options.keyboardActions.backLastFleet || 'l';
        this.db.options.keyboardActions.discovery = this.db.options.keyboardActions.discovery || 'u';
        this.db.options.keyboardActions.showMenuResources = this.db.options.keyboardActions.showMenuResources || 'v';*/

        // init OGL when the DOM is loaded
        const checkDocumentState = () =>
        {
            if(document.readyState !== 'loading' && !this.isReady)
            {
                // checking if class Datafinder exist to prevent JS hoisting issues
                if(typeof Datafinder !== 'undefined')
                {
                    this.isReady = true;
                    this.init(params.cache);
                }
                else
                {
                    setTimeout(() => checkDocumentState(), 100);
                }
            }

            if(document.readyState === 'complete')
            {
                this._dom.updatePing();
            }
        }

        checkDocumentState();
        document.addEventListener('readystatechange', () => checkDocumentState());
    }

    init(cache)
    {
        document.body.classList.add('oglight');

        this.id = GM_getValue('ogl_id') || false;
        this.version = GM_info.script.version.indexOf('b') > -1 ? oglVersion+betaVersion : oglVersion;
        this.tooltipEvent = new Event('tooltip');

        this.mode = parseInt(new URLSearchParams(window.location.search).get('oglmode')) || 0; // 1:collect, 2:collectLinked, 3:todolist, 4:reportQuickRaid, 5:expedition
        this.page = new URL(window.location.href).searchParams.get('component') || new URL(window.location.href).searchParams.get('page');
        this.resourcesKeys = { metal:'metal', crystal:'crystal', deut:'deuterium', food:'food', population:'population', energy:'energy', darkmatter:'darkmatter' };
        this.shipsList = [202,203,204,205,206,207,208,209,210,211,213,214,215,218,219];
        this.fretShips = [202, 203, 209, 210, 219];
        this.ptreKey = localStorage.getItem('ogl-ptreTK') || false;
        this.planetType = document.querySelector('head meta[name="ogame-planet-type"]').getAttribute('content');
        this.flagsList = ['friend', 'rush', 'danger', 'skull', 'fridge', 'star', 'trade', 'money', 'ptre', 'none'];

        this.server = {};
        this.server.id = window.location.host.replace(/\D/g,'');
        this.server.name = document.querySelector('head meta[name="ogame-universe-name"]').getAttribute('content');
        this.server.lang = document.querySelector('head meta[name="ogame-language"]').getAttribute('content');
        this.server.economySpeed = parseInt(document.querySelector('head meta[name="ogame-universe-speed"]').getAttribute('content'));
        this.server.peacefulFleetSpeed = parseInt(document.querySelector('head meta[name="ogame-universe-speed-fleet-peaceful"]').getAttribute('content'));
        this.server.holdingFleetSpeed = parseInt(document.querySelector('head meta[name="ogame-universe-speed-fleet-holding"]').getAttribute('content'));
        this.server.warFleetSpeed = parseInt(document.querySelector('head meta[name="ogame-universe-speed-fleet-war"]').getAttribute('content'));

        if(this.server.id == 300 && this.server.lang == 'en') return; // graveyard

        this.account = {};
        this.account.id = document.querySelector('head meta[name="ogame-player-id"]').getAttribute('content');
        this.account.class = document.querySelector('#characterclass .sprite')?.classList.contains('miner') ? 1 : document.querySelector('#characterclass .sprite')?.classList.contains('warrior') ? 2 : 3;
        this.account.name = document.querySelector('head meta[name="ogame-player-name"]').getAttribute('content');
        this.account.rank = document.querySelector('#bar a[href*="searchRelId"]')?.parentNode.innerText.replace(/\D/g, '');
        this.account.lang = document.querySelector('head meta[name="ogame-language"]').getAttribute('content');
        this.account.currentPlanetID = document.querySelector('head meta[name="ogame-planet-id"]').getAttribute('content');
        this.account.chatEnabled = document.querySelector('#chatBar');
        this.account.hasGeologist = document.querySelector('#officers .geologist.on');

        this.db.serverData = this.db.serverData || {};
        this.db.serverData.serverFullID = this.db.serverData.serverFullID || this.server.id + this.server.lang;
        this.db.serverData.localTimeZoneOffsetInMinutes = unsafeWindow.localTimeZoneOffsetInMinutes === 0 ? 0 : (unsafeWindow.localTimeZoneOffsetInMinutes || this.db.serverData.localTimeZoneOffsetInMinutes || 0);
        this.db.serverData.serverTimeZoneOffsetInMinutes = unsafeWindow.serverTimeZoneOffsetInMinutes === 0 ? 0 : (unsafeWindow.serverTimeZoneOffsetInMinutes || this.db.serverData.serverTimeZoneOffsetInMinutes || 0);
        this.db.serverData.metal = unsafeWindow.loca?.LOCA_ALL_METAL || this.db.serverData.metal || 'Metal';
        this.db.serverData.crystal = unsafeWindow.loca?.LOCA_ALL_CRYSTAL || this.db.serverData.crystal || 'Crystal';
        this.db.serverData.deut = unsafeWindow.loca?.LOCA_ALL_DEUTERIUM || this.db.serverData.deut || 'Deut';
        this.db.serverData.food = unsafeWindow.loca?.LOCA_ALL_FOOD || this.db.serverData.food || 'Food';
        this.db.serverData.dm = unsafeWindow.LocalizationStrings?.darkMatter || this.db.serverData.dm || 'Darkmatter';
        this.db.serverData.energy = unsafeWindow.resourcesBar?.resources?.energy.tooltip.split('|')[0] || this.db.serverData.energy || 'Energy';
        this.db.serverData.conso = unsafeWindow.loca?.LOCA_FLEET_FUEL_CONSUMPTION || this.db.serverData.conso || 'Conso';
        this.db.serverData.noob = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_N || this.db.serverData.noob || 'n';
        this.db.serverData.vacation = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_U || this.db.serverData.vacation || 'v';
        this.db.serverData.inactive = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_I || this.db.serverData.inactive || 'i';
        this.db.serverData.inactiveLong = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_I_LONG || this.db.serverData.inactiveLong || 'I';
        this.db.serverData.banned = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_G || this.db.serverData.banned || 'b';
        this.db.serverData.admin = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_A || this.db.serverData.admin || 'A';
        this.db.serverData.outlaw = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_O || this.db.serverData.outlaw || 'o';
        this.db.serverData.noob = unsafeWindow.loca?.LOCA_GALAXY_PLAYER_STATUS_N || this.db.serverData.noob || 'd';
        this.db.serverData.population = 'Population';
        this.db.serverData.item = 'Item';
        this.db.serverData.topScore = this.db.serverData.topScore || 0;
        this.db.serverData.probeCargo = this.db.serverData.probeCargo || 0;
        this.db.serverData.debrisFactor = this.db.serverData.debrisFactor || 30;

        if(!this.db.serverData.probeCargo) this.fretShips = [202, 203, 209, 219];
        
        if(this.page == 'overview')
        {
            this.db.activeItems = [];

            document.querySelectorAll('#buffBar [data-uuid]').forEach(item =>
            {
                const itemID = item.dataset.uuid;
                if(itemID) this.db.activeItems.push(itemID);
            });
        }

        if(this.account.lang != this.db.userLang && this.page != 'fleetdispatch' && this.page != 'intro')
        {
            window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch`;
            return;
        }
        else if(this.page != 'intro')
        {
            this.db.userLang = this.account.lang;
        }

        this.cache = cache || {};
        if(window.location.href.indexOf('&relogin=1') > -1) this.cache = {};

        this.playerStatus =
        [
            { defaultTag:'n', serverTag:false, class:'status_abbr_active' },
            { defaultTag:'v', serverTag:this.db.serverData.vacation, class:'status_abbr_vacation' },
            { defaultTag:'I', serverTag:this.db.serverData.inactiveLong, class:'status_abbr_longinactive' },
            { defaultTag:'i', serverTag:this.db.serverData.inactive, class:'status_abbr_inactive' },
            { defaultTag:'b', serverTag:this.db.serverData.banned, class:'status_abbr_banned' },
            { defaultTag:'a', serverTag:this.db.serverData.admin, class:'status_abbr_admin' },
            { defaultTag:'o', serverTag:this.db.serverData.outlaw, class:'status_abbr_outlaw' },
            { defaultTag:'d', serverTag:this.db.serverData.noob, class:'status_abbr_noob' },
            { defaultTag:'HONORABLE', serverTag:'HONORABLE', class:'status_abbr_honorableTarget' },
        ]

        this.updateJQuerySettings();

        if(this.page != 'empire')
        {
            // generate a new id
            if(!this.id || !this.id[0])
            {
                let uuid = [crypto.randomUUID(), 0];
                GM_setValue('ogl_id', uuid);
                this.id == uuid;
            }

            this.loadPlanetList();

            new PopupManager(this);

            this.checkDataFormat();

            new DomManager(this);
            new LangManager(this);
            new TimeManager(this);
            new FetchManager(this);
    
            this.getPlanetData();
            this.getServerData();
    
            new UIManager(this);
            new ShortcutManager(this);
            new TopbarManager(this);
            new FleetManager(this);
            new AccountManager(this);
            new TooltipManager(this);
            new NotificationManager(this);
            new StatsManager(this);
            new GalaxyManager(this);
            new MessageManager(this);
            this.PTRE = new PTRE(this);
            new HighscoreManager(this);
            new MovementManager(this);
            new TechManager(this);
            new JumpgateManager(this);
            new EmpireManager(this);

            /*
            this.excludeFromObserver = ['OGameClock', 'resources_metal', 'resources_crystal', 'resources_deuterium', 'smallplanet',
            'resources_food', 'resources_population', 'resources_energy', 'resources_darkmatter', 'mmoNewsticker', 'mmoTickShow',
            'tempcounter', 'counter-eventlist', 'js_duration',
            'ogl_tooltip', 'ogl_tooltipTriangle', 'ogl_ready', 'ogl_addedElement'];

            Util.observe(document.body, { childList:true, subtree:true, attributes:true }, mutation =>
            {
                let isExcluded = Array.from(mutation.target.classList).some(r=> this.excludeFromObserver.includes(r)) || this.excludeFromObserver.includes(mutation.target.id) || this.excludeFromObserver.some(r => mutation.target.id.startsWith(r));

                if(!isExcluded)
                {
                    //if(mutation.target.id) console.log(mutation.target.id)

                    if(mutation.target.classList.contains('ui-dialog') && mutation.target.querySelector('.detail_msg')) Util.runAsync(this._message.checkDialog, this._message);
                }
            }, this);*/

            let universeInfo = `<ul class="ogl_universeInfoTooltip">
                <li>Economy:<div>x${this.server.economySpeed}</div></li>
                <li>Debris:<div>${this.db.serverData.debrisFactor}%</div></li>
                <hr>
                <li>Peaceful fleets:<div>x${this.server.peacefulFleetSpeed}</div></li>
                <li>Holding fleets:<div>x${this.server.holdingFleetSpeed}</div></li>
                <li>War fleets:<div>x${this.server.warFleetSpeed}</div></li>
            </ul>`;

            (document.querySelector('#pageReloader') || document.querySelector('#logoLink')).classList.add('tooltipBottom');
            (document.querySelector('#pageReloader') || document.querySelector('#logoLink')).setAttribute('title', universeInfo);
            document.querySelector('#pageContent').appendChild(Util.addDom('div', { class:'ogl_universeName', child:`${this.server.name}.${this.server.lang}` }));

            this.checkPTRECompatibility();
            
            if(this.db.serverData.serverFullID != this.server.id + this.server.lang) // reset players data after a merge
            {
                this.db.serverData.serverFullID = false;
                /*this.ogl.db.lastStatusUpdate = 0;
                this.ogl.db.lastGlobalScoreUpdate = 0;*/
                this.db.lastPTREAPIUpdate = 0;

                this.db.tdb = {};
                this.db.pdb = {};
                this.db.udb = {};
                this.db.lastPinnedList = [];
                this.db.quickRaidList = [];
                window.location.reload();
            }
        }
        else
        {
            this._fleet = new FleetManager(this);
            this._empire = new EmpireManager(this);
        }

        this.lastUserActivity = Date.now();
        this.pendingSave = false;
        setInterval(() => this.scheduleSave(), 5000);

        ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event =>
        {
            window.addEventListener(event, () => this.lastUserActivity = Date.now());
        });

        window.addEventListener('visibilitychange', () =>
        {
            if(document.visibilityState === 'hidden')
            {
                this.save();
            }
        });

        window.addEventListener('beforeunload', () =>
        {
            this.save();
        });

        // save changes + allow tab sync (firefox can bug here)
        /*window.addEventListener('visibilitychange', () =>
        {
            if(document.visibilityState === 'hidden')
            {
                this.save();
            }
            else if(document.visibilityState === 'visible')
            {
                setTimeout(() => this.db = this.load(), 10);
            }
        });*/
    }

    load(data)
    {
        data = data || GM_getValue(this.DBName) || {};
        return typeof data === typeof '' ? JSON.parse(data) : data;
    }

    save(data)
    {
        if(this.page == 'empire') return;

        try
        {
            if(data && typeof data === 'object') this.db = data;
            GM_saveTab({ cache:this.cache }); // doublon for tmp fix
            GM_setValue(this.DBName, JSON.stringify(this.db));
            this.pendingSave = false;
        }
        catch(error)
        {
            console.log(error);
        }
    }

    isUserActive()
    {
        return Date.now() - this.lastUserActivity < 10000; // 10 sec of inactivity to be inactive
    }

    scheduleSave()
    {
        if(this.isUserActive() || this.pendingSave)
        {
            return;
        }

        this.pendingSave = true;
        this.save();
    }
    
    getServerData()
    {
        if(!this.db.serverData.galaxies || !this.db.serverData.topScore || Date.now() > this.db.lastServerUpdate + 3600000) // 1h
        {
            this._fetch.pending.push(
            {
                url:`https://bridge.hibot.fr/bridge?url=https://${universeUrl}/api/serverData.xml`,
                callback:data =>
                {
                    let xml = new DOMParser().parseFromString(data, 'text/html');
                    this.db.serverData.topScore = parseInt(Number(xml.querySelector('topscore').innerText));
                    this.db.serverData.probeCargo = parseInt(xml.querySelector('probeCargo').innerText);
                    this.db.serverData.debrisFactor = parseFloat(xml.querySelector('debrisFactor').innerText) * 100;
                    this.db.serverData.researchSpeed = parseInt(xml.querySelector('researchDurationDivisor').innerText);
                    this.db.serverData.galaxies = parseInt(xml.querySelector('galaxies').innerText);
                    this.db.serverData.systems = parseInt(xml.querySelector('systems').innerText);
                    this.db.serverData.donutGalaxy = xml.querySelector('donutGalaxy').innerText == 1;
                    this.db.serverData.donutSystem = xml.querySelector('donutSystem').innerText == 1;
                    this.db.serverData.emptySystems = xml.querySelector('fleetIgnoreEmptySystems').innerText == 1;
                    this.db.serverData.inactiveSystems = xml.querySelector('fleetIgnoreInactiveSystems').innerText == 1;
                    this.db.lastServerUpdate = Date.now();
                }
            });
        }
    }

    getPlanetData(reloaded)
    {
        if(!reloaded)
        {
            if(this.cache.toSend && this.mode !== 3) delete this.cache.toSend;

            this.currentPlanet = {};
            this.currentPlanet.dom = this._dom.planet[this.account.currentPlanetID];

            const planetExist = this.db.myPlanets?.[this.account.currentPlanetID] ? true : false;

            if(!this.db.noFetch)
            {
                if(this.page != 'fleetdispatch')
                {
                    setTimeout(() =>
                    {
                        this._fetch.fetchMainData(false, !planetExist);
                        this._fetch.fetchStatus();
                    }, 3000);
                }
            }
            else
            {
                this.db.noFetch = false;
            }

            this.db.myPlanets[this.account.currentPlanetID] = this.db.myPlanets[this.account.currentPlanetID] || {};
            this.currentPlanet.obj = this.db.myPlanets[this.account.currentPlanetID];
            this.currentPlanet.obj.type = document.querySelector('head meta[name="ogame-planet-type"]').getAttribute('content');
            this.currentPlanet.obj.metal = Math.floor(resourcesBar.resources.metal?.amount || 0);
            this.currentPlanet.obj.crystal = Math.floor(resourcesBar.resources.crystal?.amount || 0);
            this.currentPlanet.obj.deut = Math.floor(resourcesBar.resources.deuterium?.amount || 0);
            this.currentPlanet.obj.energy = Math.floor(resourcesBar.resources.energy?.amount || 0);
            this.currentPlanet.obj.food = Math.floor(resourcesBar.resources.food?.amount || 0);
            this.currentPlanet.obj.population = Math.floor(resourcesBar.resources.population?.amount || 0);
            this.currentPlanet.obj.lifeform = document.querySelector('#lifeform .lifeform-item-icon')?.className.replace(/\D/g, '');
            this.currentPlanet.obj.lastRefresh = this._time.serverTime;

            ['metal', 'crystal', 'deut'].forEach(resource =>
            {
                // update prod / sec
                let prod = resourcesBar.resources[resource.replace('deut', 'deuterium')].production;
                if(prod > 0) this.currentPlanet.obj[`prod${resource}`] = prod;

                // update top icon storage indicator
                const box = document.querySelector(`#${resource.replace('deut', 'deuterium')}_box`);
                if(this.currentPlanet.obj.type == 'moon' || box.querySelector('.ogl_resourceBoxStorage')) return;
                
                prod = prod * 3600;
                const storage = this.currentPlanet.obj[`${resource}Storage`];
                const timeLeft = prod > 0 ? Math.floor((storage - this.currentPlanet.obj[resource]) / prod) || 0 : Infinity;
                const day = Math.max(0, Math.floor(timeLeft / 24));
                const hour = Math.max(0, Math.floor(timeLeft % 24));

                let text = day > 365 ? `> 365${LocalizationStrings.timeunits.short.day}` : `${day}${LocalizationStrings.timeunits.short.day} ${hour}${LocalizationStrings.timeunits.short.hour}`;
                Util.addDom('div', { class:'ogl_resourceBoxStorage', child:text, parent:box });
            });
        }

        this._dom.updateAvailable();
        this._dom.updatePlanetTimers();
    }

    updateJQuerySettings()
    {
        const self = this;

        $(document).on("ajaxSend", (function(event, xhr, settings)
        {
            if(settings.url.indexOf('page=messages&tab=') >= 0)
            {
                const tabID = new URLSearchParams(settings.url).get('tab');

                if(tabID != 20)
                {
                    if(self._message.spytable) self._message.spytable.classList.add('ogl_hidden');
                }
            }
        }));

        $(document).on("ajaxSuccess", function(event, xhr, settings)
        {
            if(settings.url.indexOf('action=getMessagesList') >= 0 && settings.data.indexOf('showTrash=true') < 0)
            {
                const tabID = parseInt(new URLSearchParams(settings.data).get('activeSubTab')) || -1;
                self._message.tabID = tabID;
                self._message.checkTab(); // check messages after pagination
            }
            else if(settings.url.indexOf('page=standalone') >= 0 && settings.url.indexOf('component=planetbar') >= 0)
            {
                self._dom.loadBase(true); // right menu reloaded
                self._movement.updateSideIcons();

                self.getPlanetData(true);
                self._topbar.load(true);
                self._ui.load(true);
                self._movement.load(true);
                self._topbar.checkUpgrade();
            }
            else if(settings.url.indexOf('action=flagArchived') >= 0)
            {
                let messageID = new URLSearchParams(settings.data).get('messageId') || -1;

                if(self._message.messageDB?.[messageID])
                {
                    if(xhr.responseJSON?.isArchived == 1) self._message.messageDB[messageID].isFav = true;
                    else self._message.messageDB[messageID].isFav = false;

                    self._message.saveMessagesDB();
                }
            }
            else if(settings.url.indexOf('action=flagDeleted') >= 0)
            {
                let messageIDs = new URLSearchParams(settings.data.replace(/%5B%5D/g, '')).getAll('messageIds') || [-1];
                messageIDs = Array.isArray(messageIDs) ? messageIDs : [messageIDs];

                if(self._message.messageDB)
                {
                    messageIDs.forEach(messageID =>
                    {
                        delete self._message.messageDB[messageID];

                        const spyTableLine = document.querySelector(`.ogl_spyLine[data-id="${messageID}"]`);

                        if(spyTableLine)
                        {
                            spyTableLine.remove();

                            self._message.spyRecap.count--;
                            self._message.spyRecap.value -= parseInt(spyTableLine.dataset.wave1);
                            self._message.updateSumLine();
                        }

                        if(document.querySelector(`.msg[data-msg-id="${messageID}"]`)) document.querySelector(`.msg[data-msg-id="${messageID}"]`).remove();
                    });

                    self._message.saveMessagesDB();
                }
            }
            else if(settings.url.indexOf('action=fetchGalaxyContent') >= 0) // check galaxy on system change
            {
                self._galaxy.check(JSON.parse(xhr.responseText));
            }
            else if(settings.url.indexOf('action=checkTarget') >= 0) // fleetdispatcher fetchTargetPlayerData()
            {
                document.querySelector('#planetList').classList.remove('ogl_notReady');
            }
            else if(settings.url.indexOf('component=eventList') >= 0 && settings.url.indexOf('asJson=1') < 0)
            {
                const checkMovement = () =>
                {
                    setTimeout(() => // we wait to be sure xml as been added to the DOM and OGL has been red
                    {
                        if(!self._movement)
                        {
                            checkMovement();
                        }
                        else
                        {
                            const xml = new DOMParser().parseFromString(xhr.responseText, 'text/html');
                            self._movement.check(xml);
                            self._movement.eventLoaded = true;
                        }
                    }, 50);
                }

                checkMovement();
            }
            else if(settings.url.indexOf('action=miniFleet') >= 0)
            {
                const json = xhr.responseJSON;
                const url = new URLSearchParams(settings.data);
                const mission = url.get('mission');
                const galaxy = url.get('galaxy');
                const system = url.get('system');
                const position = url.get('position');
                const type = url.get('type');
                const uid = url.get('uid');
                const popup = url.get('popup');
                const status = json.response.success ? 'done' : 'fail';
                
                token = json.newAjaxToken;
                updateOverlayToken('phalanxSystemDialog', json.newAjaxToken);
                updateOverlayToken('phalanxDialog', json.newAjaxToken);
                getAjaxEventbox();
                refreshFleetEvents(true);

                const itemIndex = self._fleet.miniFleetQueue.findIndex(e => e.uid == uid);
                const item = self._fleet.miniFleetQueue.find(e => e.uid == uid);
                
                if(itemIndex > -1) self._fleet.miniFleetQueue.splice(itemIndex, 1);

                if(status == 'fail')
                {
                    if(item.retry < 2)
                    {
                        item.uid = crypto.randomUUID();
                        item.retry++;
                        self._fleet.miniFleetQueue.push(item);
                    }
                    else
                    {
                        self._notification.addToQueue(`[${galaxy}:${system}:${position}] ${json.response.message}`, false);
                        document.querySelectorAll(`[data-spy-coords="${galaxy}:${system}:${position}:${type}"]`).forEach(e => e.setAttribute('data-spy', status));
                    }
                }
                else
                {
                    if(mission == 6 && self.db.pdb[`${galaxy}:${system}:${position}`])
                    {
                        self.db.pdb[`${galaxy}:${system}:${position}`].spy =  self.db.pdb[`${galaxy}:${system}:${position}`].spy || [];

                        if(type == 1) self.db.pdb[`${galaxy}:${system}:${position}`].spy[0] = serverTime.getTime();
                        else if(type == 3) self.db.pdb[`${galaxy}:${system}:${position}`].spy[1] = serverTime.getTime();
                    }

                    document.querySelectorAll(`[data-spy-coords="${galaxy}:${system}:${position}:${type}"]`).forEach(e => e.setAttribute('data-spy', status));

                    /*if(json.response.slots && document.querySelector('#galaxycomponent #slotUsed'))
                    {
                        document.querySelector('#galaxycomponent #slotUsed').innerText = json.response.slots;
                    }

                    if(json.response.probes && document.querySelector('#galaxycomponent #probeValue'))
                    {
                        document.querySelector('#galaxycomponent #probeValue').innerText = json.response.probes;
                    }*/

                    //addToTable(json.response.message, "success", json.response.shipsSent);
                    $("#slotUsed").html(tsdpkt(json.response.slots));
                    setShips("probeValue", tsdpkt(json.response.probes));
                    setShips("recyclerValue", tsdpkt(json.response.recyclers));
                    setShips("missileValue", tsdpkt(json.response.missiles));
                }

                if(popup && mission != 6)
                {
                    if (json.response.success)
                    {
                        fadeBox(json.response.message + ' ' + json.response.coordinates.galaxy + ":" + json.response.coordinates.system + ":" + json.response.coordinates.position, !json.response.success);
                    }
                    else
                    {
                        fadeBox(json.response.message, true);
                    }
                }
                
                if(self._fleet.miniFleetQueue.length > 0)
                {
                    setTimeout(() => self._fleet.sendNextMiniFleet(), 500)
                }
            }
            else if(settings.url.indexOf('page=highscoreContent') >= 0)
            {
                self._highscore.check();
            }
            else if(settings.url.indexOf('action=reCommission') >= 0)
            {
                window.stop();
                /*window.stop();

                self.currentPlanet.obj.wreckfield = false;

                ogl.save();
                window.location.reload();*/
            }
            else if(settings.url.indexOf('action=startRepairs') >= 0)
            {
                window.stop();
                /*window.stop();

                const stats = self._stats.getDayStats(self._time.timeToKey(serverTime.getTime()));
                const shipsToRepair = document.querySelectorAll('.repairableShips .ships');

                const debugObj = {};
                debugObj.key = self._time.timeToKey(serverTime.getTime());
                debugObj.ships = {};

                shipsToRepair.forEach(item =>
                {
                    const ship = {};
                    ship.id = parseInt(item.id.replace(/\D/g, '') || 0);
                    ship.amount = parseInt(item.querySelector('.level')?.innerText?.replace(/\D/g, '') || 0);

                    debugObj.ships[ship.id] = ship;

                    stats.raid = stats.raid || {};
                    stats.raid.gain = stats.raid.gain || {};
                    stats.raid.gain[ship.id] = (stats.raid.gain[ship.id] || 0) + ship.amount;
                });

                self.currentPlanet.obj.wreckfield = 9999999999999;

                self.db.debugData = self.db.debugData || [];
                self.db.debugData.push(debugObj);

                ogl.save();
                window.location.reload();*/
            }
            else if(settings.url.indexOf('component=repairlayer') >= 0)
            {
                initTooltips();
            }
            else if(settings.url.indexOf('action=getDetails') >= 0)
            {
                document.querySelectorAll('#technologydetails').forEach((e, index) => { if(index > 0) e.remove(); });
            }
            else if(settings.url.indexOf('component=messagedetails') >= 0 && settings.url.indexOf('messageId') >= 0)
            {
                self._message.checkDialog();
            }
            else if(settings.url.indexOf('action=sendDiscoveryFleet') >= 0 || settings.url.indexOf('action=sendSystemDiscoveryFleet') >= 0)
            {
                const result = xhr?.responseJSON?.response;

                if(result && result.success)
                {
                    if(result.coordinates)
                    {
                        self.db.lastDiscovery = `${result.coordinates.galaxy}:${result.coordinates.system}`;
                    }
                    else
                    {
                        self.db.lastDiscovery = `${result.sentToCoordinates[0].galaxy}:${result.sentToCoordinates[0].system}`;
                    }

                    self.save();
                }
            }
        });

        $.ajaxSetup(
        {
            beforeSend:function(xhr, settings)
            {
                if(this.url.indexOf('action=checkTarget') >= 0 && !self?._fleet?.firstLoadCancelled) // clear default fleet loading
                {
                    if(window.fleetDispatcher)
                    {
                        fleetDispatcher.fetchTargetPlayerDataTimeout = null;
                        self._fleet.firstLoadCancelled = true;
                        xhr.abort();
                    }
                }
                else if(this.url.indexOf('action=fetchGalaxyContent') >= 0) // abort galaxy spam
                {
                    if(self._galaxy.xhr) self._galaxy.xhr.abort();
                    self._galaxy.xhr = xhr;
                }
                else if(this.url.indexOf('action=getMessagesList') >= 0) // abort message spam
                {
                    if(self._message.xhr) self._message.xhr.abort();
                    self._message.xhr = xhr;

                    if(settings.data.indexOf('activeSubTab=20') > -1 && settings.data.indexOf('showTrash=false') > -1)
                    {
                        self._message.loadSpyTable(true);
                    }
                }
            }
        });
    }

    checkPTRECompatibility()
    {
        if(serverTime.getTime() > this.id[1] + 86400000)
        {
            let json =
            {
                ogl_id:this.id[0] || '-',
                version:this.version || '-',
                script_name:GM_info.script.name || '-',
                script_namespace:GM_info.script.downloadURL || '-',
            }

            this.PTRE.postPTRECompatibility(json);
        }
    }

    createPlayer(id)
    {
        this.db.udb[id] = { uid:parseInt(id) };
        return this.db.udb[id];
    }

    removeOldPlanetOwner(coords, newUid)
    {
        Object.values(this.db.udb).filter(e => e.planets?.indexOf(coords) > -1).forEach(old =>
        {
            if(old.uid != newUid)
            {
                // remove the planet from the old user list
                const index = this.db.udb[old.uid].planets.indexOf(coords);
                this.db.udb[old.uid].planets.splice(index, 1);

                // delete the old user if the planet list is empty
                if(this.db.udb[old.uid].planets.length < 1) delete this.db.udb[old.uid];

                if(this.db.udb[old.uid] && document.querySelector('.ogl_side.ogl_active') && this.db.currentSide == old.uid)
                {
                    if(document.querySelector('.ogl_side.ogl_active') && this.db.currentSide == old.uid) this._topbar.openPinnedDetail(old.uid);
                }
            }
        });
    }

    importData(importButton, dataType)
    {
        const file = importButton.files[0];
        const reader = new FileReader();

        reader.onload = () =>
        {
            this._popup.open(Util.addDom('div', { child:'<div>Importing data, please wait...</div><hr><div class="ogl_loading"></div>' }));

            let imported;
            let error;

            try { imported = JSON.parse(reader.result); }
            catch (e) { error = 'cannot read file'; }

            if(!error && imported && imported.dataFormat > 10)
            {
                if(dataType == 'all')
                {
                    const stats = JSON.parse(JSON.stringify(this.db.stats));
                    this.db = imported;

                    for(const date in stats)
                    {
                        if(!this.db.stats.hasOwnProperty(date))
                        {
                            this.db.stats[date] = stats[date];
                        }
                    }
                }
                else if(dataType == 'stats')
                {
                    for(const date in imported.stats)
                    {
                        if(!this.db.stats.hasOwnProperty(date))
                        {
                            this.db.stats[date] = imported.stats[date];
                        }
                    }
                }

                document.location.reload();
            }
            else
            {
                this._popup.close();
                this._notification.addToQueue(`Error, ${error||"wrong data format"}`, false);
            }
        }

        if(file) reader.readAsText(file);
    }

    checkDataFormat()
    {
        if(this.db.dataFormat < 10) // fix v4 data
        {
            let legacyDBName = `ogl_test_${this.server.id}-${this.server.lang}_${this.account.id}`;
            let legacyDB = JSON.parse(GM_getValue(legacyDBName) || '{}');

            if(legacyDB.pinnedList?.length > 0 || legacyDB.positions?.length > 0)
            {
                if(confirm('Do you want to import v4 pinned targets ?'))
                {
                    this._popup.open(Util.addDom('div', { child:'<div>importing v4 targets, please wait...</div><hr><div class="ogl_loading"></div>' }));

                    // add v4 pinned players
                    legacyDB.pinnedList.forEach(id =>
                    {
                        this.db.lastPinnedList = Array.from(new Set([id, ...this.db.lastPinnedList]));
                    });
                    
                    if(this.db.lastPinnedList.length > 30) this.db.lastPinnedList.length = 30;
        
                    // add v4 tagged planets
                    legacyDB.positions.filter(position => position.color).forEach(position =>
                    {
                        this.db.tdb[position.rawCoords] = { tag:position.color.replace('half', '') };
                    });

                    this.db.dataFormat = 10;

                    this._popup.close();

                    window.location.reload();
                }
                else
                {
                    this.db.dataFormat = 10;
                }
            }
            else
            {
                this.db.dataFormat = 10;
            }
        }

        if(this.db.dataFormat < 12) // fix beta todolist
        {
            document.querySelectorAll('.planetlink, .moonlink').forEach(planet =>
            {
                const urlParams = new URLSearchParams(planet.getAttribute('href'));
                const id = urlParams.get('cp').split('#')[0];
                if(this.db.myPlanets[id]) delete this.db.myPlanets[id].todolist;
            });

            if(this.cache) delete this.cache.toSend;
            this.db.dataFormat = 12;
        }

        if(this.db.dataFormat < 14) // fix beta stats
        {
            this.db.initialTime = Date.now();
            this.db.stats = {};
            this.cache.raid = {};
            this.db.dataFormat = 14;
        }

        if(this.db.dataFormat < 15) // fix beta stats
        {
            Object.entries(this.db.stats || {}).forEach(entry =>
            {
                if(entry[0].indexOf('-') > -1) return;

                const midnight = parseInt(entry[0]);
                const value = entry[1];
                const date = new Date(midnight);
                const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

                if(!this.db.stats[key])
                {
                    this.db.stats[key] = value;
                    delete this.db.stats[midnight];
                }
            });
            
            this.db.dataFormat = 15;
        }

        if(this.db.dataFormat < 16) // fix beta stats
        {
            Object.entries(this.db.stats || {}).forEach(entry =>
            {
                const oldKey = entry[0].split('-');
                let newMonth = parseInt(oldKey[1]) + 1;
                let newYear = parseInt(oldKey[0]);
                if(newMonth > 12)
                {
                    newMonth = 1;
                    newYear++;
                }

                const value = entry[1];
                const key = `${newYear}-${newMonth}-${oldKey[2]}`;

                delete this.db.stats[oldKey.join('-')];
                this.db.stats[key] = value;
            });
            
            this.db.dataFormat = 16;
        }

        if(this.db.dataFormat < 17) // fix msu
        {
            this.db.options.msu = '3:2:1';
            this.db.dataFormat = 17;
        }
    }

    calcExpeditionMax()
    {
        const threshold =
        [
            { topScore:10000, base:10, max:40000 },
            { topScore:100000, base:125, max:500000 },
            { topScore:1000000, base:300, max:1200000 },
            { topScore:5000000, base:450, max:1800000 },
            { topScore:25000000, base:600, max:2400000 },
            { topScore:50000000, base:750, max:3000000 },
            { topScore:75000000, base:900, max:3600000 },
            { topScore:100000000, base:1050, max:4200000 },
            { topScore:Infinity, base:1250, max:5000000 },
        ].find(e => e.topScore >= this.db.serverData.topScore);

        let itemBoost = 1;

        const bonusItems =
        {
            "83e5d5b5e3e6ba16eb73edd6731a25ed1feff8a1":0.1, 
            "f2f1bf68ded681adf6b45b24a8084b3861a5ce94":0.15,
            "d831a85f8f53defc3e51b7551401b21fb98c28ad":0.2,
            "fd38bf4fa0e07377c2a18556424eee14a6700654":0.25,
            "7e05baae79bde905f5b2c89bb881d7ff04e8fa73":0.3,
            "23c859c9f8b4ea7c562719ac829bfc9799250b33":0.35,
            "a5ab323cadd8c172957451f8ddd9950f1c101966":0.4
        }

        this.db.activeItems.forEach(item =>
        {
            if(bonusItems[item]) itemBoost += bonusItems[item];
        });

        const base = (this.account.class == 3 ? threshold.max * 3 * this.server.economySpeed : threshold.max * 2);

        let maxResources = 
            base * 
            (1+(this.db.lfBonuses?.Characterclasses3?.bonus||0)/100) * 
            (1+(this.db.lfBonuses?.ResourcesExpedition?.bonus||0)/100) * 
            itemBoost;
    
        if(this.db.options.expeditionValue)
        {
            if(this.db.options.expeditionValue.toString().indexOf('%') >= 1) // percent mode
            {
                maxResources = Math.ceil(maxResources * this.db.options.expeditionValue.replace(/\D/g, '') / 100);
            }
            else // value mode
            {
                maxResources = this.db.options.expeditionValue;
            }
        }

        return { max:Math.round(maxResources), threshold:threshold };
    }

    loadPlanetList()
    {
        this.account.planets = [];
        this.account.planetsIDs = [];

        document.querySelectorAll('.smallplanet').forEach(line =>
        {
            const planet = {};
            planet.id = new URLSearchParams(line.querySelector('.planetlink')?.getAttribute('href'))?.get('cp')?.split('#')?.[0] || -1;
            planet.moonID = new URLSearchParams(line.querySelector('.moonlink')?.getAttribute('href'))?.get('cp')?.split('#')?.[0] || -1;
            planet.coords = line.querySelector('.planet-koords').textContent.slice(1, -1);
            planet.isCurrent = line.classList.contains('hightlightPlanet') || line.classList.contains('hightlightMoon');
            planet.currentType = planet.isCurrent && line.classList.contains('hightlightPlanet') ? 'planet' : planet.isCurrent && line.classList.contains('hightlightMoon') ? 'moon' : false;

            this.account.planets.push(planet);

            if(planet.id > -1) this.account.planetsIDs.push(planet.id);
            if(planet.moonID > -1) this.account.planetsIDs.push(planet.moonID);
        });

        this.account.planets.getNext = offset => Util.reorderArray(this.account.planets, this.account.planets.findIndex(e => e.isCurrent))?.[(offset||0)+1] || this.account.planets[0];;
        this.account.planets.getNextWithMoon = offset => Util.reorderArray(this.account.planets.filter(e => e.moonID > -1), this.account.planets.filter(e => e.moonID > -1).findIndex(e => e.isCurrent))?.[(offset||0)+1] || this.account.planets[0];;
        this.account.planets.getPrev = offset => Util.reorderArray(this.account.planets, this.account.planets.findIndex(e => e.isCurrent), true)?.[offset||0] || this.account.planets[0];;
        this.account.planets.getPrevWithMoon = offset => Util.reorderArray(this.account.planets.filter(e => e.moonID > -1), this.account.planets.filter(e => e.moonID > -1).findIndex(e => e.isCurrent), true)?.[offset||0] || this.account.planets[0];;
        this.account.planets.getCurrent = () => this.account.planets.find(e => e.isCurrent) || this.account.planets[0];
        this.account.planets.getByCoords = coords => this.account.planets.find(e => coords == e.coords);

        // remove old planets
        Object.keys(this.db.myPlanets).forEach(dbPlanetID =>
        {
            if(this.account.planetsIDs.indexOf(dbPlanetID) < 0) delete(this.db.myPlanets[dbPlanetID]);
        });
    }
}

GM_getTab(params => unsafeWindow.ogl = new OGLight(params));

class Manager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.ogl['_'+this.constructor.name.toLowerCase().replace('manager', '')] = this;
        if(this.load) this.load();
    }
}

class DomManager extends Manager
{
    load()
    {
        this.loadBase();
        this.loadFleet();

        this.updateRecap();
        this.updateLeftMenu();
        this.updateFooter();
        this.updateTop();
    }

    redraw(element, fragment, callback)
    {
        requestAnimationFrame(() =>
        {
            if(callback) callback();
            element.innerText = '';
            element.appendChild(fragment);
        });
    }

    loadBase(reload)
    {
        this.planet = {};
        this.planetList = document.querySelector('#planetList');
        this.smallplanet = document.querySelectorAll('.smallplanet');
        this.links = document.querySelector('#links');
        this.leftMenu = document.querySelector('#menuTable');
        this.footer = document.querySelector('#siteFooter .fright');
        this.mainClock = document.querySelector('#bar .OGameClock');
        this.countColonies = document.querySelector('#countColonies');

        if(!this.ogl.db.options.displayPlanetTimers)
        {
            this.planetList.classList.add('ogl_alt');
        }

        this.smallplanet.forEach(line =>
        {
            const planet = line.querySelector('.planetlink');
            const moon = line.querySelector('.moonlink');

            const planetID = new URLSearchParams(line.querySelector('.planetlink')?.getAttribute('href'))?.get('cp')?.split('#')?.[0] || -1;
            const moonID = new URLSearchParams(line.querySelector('.moonlink')?.getAttribute('href'))?.get('cp')?.split('#')?.[0] || -1;

            planet._ogl = {};
            planet._ogl.type = 'planet';
            planet._ogl.id = planetID;
            planet._ogl.relatedID = moonID;
            planet._ogl.moonLink = moon;
            planet._ogl.resources = Util.addDom('div', { class:'ogl_available', parent:planet });
            planet._ogl.timer = Util.addDom('div', { class:'ogl_refreshTimer', parent:planet });
            planet._ogl.queue = Util.addDom('div', { class:'ogl_buildIconList', parent:planet });
            planet._ogl.coords = planet.querySelector('.planet-koords').textContent.slice(1, -1);
            planet._ogl.name = planet.querySelector('.planet-name').textContent;
            planet._ogl.sideIcon = Util.addDom('div', { class:'ogl_sideIconTop', parent:line });
            planet._ogl.sideIconBack = Util.addDom('div', { class:'ogl_sideIconBottom', parent:line });
            planet._ogl.sideInfo = Util.addDom('div', { class:'ogl_sideIconInfo', parent:line });

            this.planet[planetID] = planet;

            if(moon)
            {
                moon._ogl = {};
                moon._ogl.type = 'moon';
                moon._ogl.id = moonID;
                moon._ogl.relatedID = planetID;
                moon._ogl.planetLink = planet;
                moon._ogl.resources = Util.addDom('div', { class:'ogl_available', parent:moon });
                moon._ogl.timer = Util.addDom('div', { class:'ogl_refreshTimer', parent:moon });
                moon._ogl.queue = Util.addDom('div', { class:'ogl_buildIconList', parent:moon });
                moon._ogl.jumpgateLevel = moon.getAttribute('data-jumpgatelevel');
                moon._ogl.coords = planet.querySelector('.planet-koords').innerText.slice(1, -1);
                moon._ogl.sideIcon = planet._ogl.sideIconBack;
                moon._ogl.sideInfo = planet._ogl.sideInfo;

                this.planet[moonID] = moon;
            }
        });

        this.recap = Util.addDom('div', { class:'ogl_recap', parent:this.planetList });

        if(reload) return;

        this.miniStats = Util.addDom('div', { class:'ogl_miniStats ogl_ogameDiv', parent:this.links, onclick:() => { this.ogl._stats.showDetails(); }});

        const LFComponent = document.querySelector('#commandercomponent #lifeform');
        if(LFComponent) Util.addDom('a', { child:'genetics', href:`${window.location.href.split('?')[0]}?page=ingame&component=lfbonuses`, class:'ogl_lfBonusesLink tooltip', title:'Lifeforms Bonuses', parent:LFComponent });
    }

    loadFleet()
    {
        if(this.ogl.page !== 'fleetdispatch') return;

        this.fleet1 = document.querySelector('#fleet1');
        this.fleet2 = document.querySelector('#fleet2');
        this.sendAll = document.querySelector('#sendall');
        this.resetAll = document.querySelector('#resetall');
        this.secondCol = document.querySelector('.secondcol');
        this.warning = this.fleet1.querySelector('#warning');
        this.component = document.querySelector('#fleetdispatchcomponent');
        this.fleetResources = document.querySelectorAll('#fleet2 .resourceIcon');
        this.requiredShips = Util.addDom('span', { class:'ogl_requiredShips', parent:document.querySelector("#civilships #civil") || this.warning });
        this.technology = document.querySelectorAll('[data-technology]');
        this.tech = {};

        this.technology.forEach(tech =>
        {
            tech._ogl = {};
            tech._ogl.id = parseInt(tech.getAttribute('data-technology'));
            tech._ogl.shipFlag = Util.addDom('div', { class:'ogl_shipFlag', parent:tech });
            tech._ogl.input = tech.querySelector('input');
            tech._ogl.amount = tech.querySelector('.amount');
            tech._ogl.reverse = Util.addDom('div', { class:'ogl_reverse material-icons tooltip', title:'Invert selection', child:'contrast', parent:tech._ogl.shipFlag, onclick:e =>
            {
                e.stopPropagation();
                this.ogl._fleet.reverseShip(tech._ogl.id);
            }});

            if(this.ogl.fretShips.indexOf(tech._ogl.id) > -1)
            {
                const favClass = tech._ogl.id == this.ogl.db.options.defaultShip ? 'material-icons ogl_fav tooltip' : 'material-icons ogl_fav tooltip ogl_grayed';
                const lockClass = tech._ogl.id == this.ogl.db.keepEnoughCapacityShip ? 'material-icons ogl_shipLock tooltip' : 'material-icons ogl_shipLock tooltip ogl_grayed';

                tech._ogl.fav = Util.addDom('div', { class:favClass, title:'Default ship', child:'star', parent:tech._ogl.shipFlag, onclick:e =>
                {
                    e.stopPropagation();
                    this.ogl._fleet.favShip(tech._ogl.id);
                }});

                if([202, 203, 219, 200].indexOf(tech._ogl.id) > -1)
                {
                    tech._ogl.lock = Util.addDom('div', { class:lockClass, title:'Locked ship', child:'blocked', parent:tech._ogl.shipFlag, onclick:e =>
                    {
                        e.stopPropagation();
                        this.ogl._fleet.lockShip(tech._ogl.id);
                    }});
                }
            }

            this.tech[tech._ogl.id] = tech;
        });

        this.fleetResources.forEach(resourceIcon =>
        {
            Util.addDom('div', { class:'ogl_reverse material-icons', child:'contrast', parent:resourceIcon, onclick:() =>
            {
                this.ogl._fleet.reverseResources(resourceIcon);
            }});
        });
    }

    updateRecap(data)
    {
        const fragment = document.createDocumentFragment();

        ['metal', 'crystal', 'deut', 'msu'].forEach(resource =>
        {
            const line = Util.addDom('div', { class:`ogl_icon ogl_${resource}`, parent:fragment });
            Util.addDom('span', { parent:line, child:Util.formatToUnits(data?.total?.[resource] || 0) });
            Util.addDom('span', { parent:line, child:'+'+Util.formatToUnits(Math.floor(data?.prod?.[resource] || 0, 1)) });
        });

        this.redraw(this.recap, fragment);
    }

    updateLeftMenu()
    {
        const version = oglVersion;
        const fragment = document.createDocumentFragment();

        const oglBlock = Util.addDom('li', { parent:fragment });
        Util.addDom('span', { parent:oglBlock, class:'menu_icon ogl_leftMenuIcon', child:`<a class="tooltipRight" href="http://greasyfork.org/fr/scripts/514909-oglight" target="_blank"><i class="material-icons">oglight_simple</i></a>` });
        Util.addDom('a', { parent:oglBlock, class:'menubutton tooltipRight', href:'http://board.fr.ogame.gameforge.com/index.php?thread/722955-oglight/', target:'_blank', child:`<span class="textlabel">OGLight ${version}</span>` });

        if(this.ogl.ptreKey)
        {
            const ptreBlock = Util.addDom('li', { parent:fragment });
            Util.addDom('span', { parent:ptreBlock, class:'menu_icon ogl_leftMenuIcon ogl_ptreActionIcon', child:`<a class="tooltipRight" title="PTRE last request status" href="#"><i class="material-icons">sync_alt</i></a>`, onclick:() => this.ogl.PTRE.displayLogs() });
            Util.addDom('a', { parent:ptreBlock, class:'menubutton tooltipRight', href:'http://ptre.chez.gg/', target:'_blank', child:`<span class="textlabel">PTRE</span>` });
        }

        this.leftMenu.appendChild(fragment);
    }

    updateFooter()
    {
        const lang = ['fr', 'de', 'en', 'es', 'pl', 'it', 'ru', 'ar', 'mx', 'tr', 'fi', 'tw', 'gr', 'br', 'nl',
        'hr', 'sk', 'cz', 'ro', 'us', 'pt', 'dk', 'no', 'se', 'si', 'hu', 'jp', 'ba'].indexOf(this.ogl.server.lang);

        this.footer.innerHTML +=
        `
            | <a target="_blank" href="http://www.mmorpg-stat.eu/0_fiche_joueur.php?pays=${lang}&ftr=${this.ogl.account.id}.dat&univers=_${this.ogl.server.id}">Mmorpg-stat</a>
            | <a target="_blank" href="http://ogotcha.oplanet.eu/${this.ogl.server.lang}">Ogotcha</a>
            | <a>OGL ${this.ogl.version}</a>
        `;
    }

    updateTop()
    {
        // ping
        this.ping = Util.addDom('div', { class:'ogl_ping', parent:document.querySelector('#bar') });
        this.updatePing();

        // LF top icon
        if(this.ogl.db?.myPlanets && this.ogl.db?.lfBonuses)
        {
            const currentLF = `lifeform${this.ogl.db.myPlanets[this.ogl.account.currentPlanetID]?.lifeform || 0}`;
            const iconLF = document.querySelector('#lifeform .lifeform-item-icon');
            if(iconLF) iconLF.innerHTML = `<span>${(this.ogl.db.lfBonuses[currentLF]?.bonus || 0) * 10}</span>`;
        }
    
        // wreckfield top icon
        const wreckfield = document.querySelector('#attack_alert.wreckField a');

        if(wreckfield)
        {
            wreckfield.setAttribute('href', `${window.location.href.split('?')[0]}?page=ingame&component=facilities&openTech=36`);
            wreckfield.classList.remove('overlay');
        }
    }

    updatePing()
    {
        if(performance.getEntriesByType)
        {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.pageLoadingTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            this.ping.innerText = `${Util.formatNumber(Math.round(Math.max(this.pageLoadingTime, 0)))} ms`;

            if(this.pageLoadingTime > 1000) this.ping.className = 'ogl_ping ogl_danger';
            else if(this.pageLoadingTime > 700) this.ping.className = 'ogl_ping ogl_warning';
            else this.ping.className = 'ogl_ping ogl_ok';
        }
    }

    updateMiniStats(data)
    {
        const fragment = document.createDocumentFragment();
        
        Util.addDom('h3', { class:'ogl_header', child:data.title, parent:fragment });

        let content = Util.addDom('div', { parent:fragment });

        ['metal', 'crystal', 'deut', 'dm', 'artefact', 'msu'].forEach(type =>
        {
            Util.addDom('div', {class:`ogl_icon ogl_${type}`, parent:content, child:`<span>${Util.formatToUnits(data[type], 1, true)}</span>`});
        });

        this.redraw(this.miniStats, fragment);
    }

    updateAvailable()
    {
        Object.values(this.ogl._dom.planet).forEach(planet =>
        {
            const id = planet._ogl.id;
            const div = planet._ogl.resources;
            const fragment = document.createDocumentFragment();

            this.ogl.db.myPlanets[id] = this.ogl.db.myPlanets[id] || {};

            ['metal', 'crystal', 'deut'].forEach(resourceName =>
            {
                const resource = this.ogl.db.myPlanets[id]?.[resourceName] || 0;
                const storage = this.ogl.db.myPlanets[id]?.[resourceName+'Storage'] || 0;
                const span = Util.addDom('span', { class:'ogl_'+resourceName, parent:fragment, child:Util.formatToUnits(resource, 1) });

                if(resource >= storage && planet._ogl.type == 'planet') span.classList.add('ogl_danger');
                else if(resource >= storage * .9 && planet._ogl.type == 'planet') span.classList.add('ogl_warning');
                else
                {
                    span.classList.remove('ogl_warning');
                    span.classList.remove('ogl_danger');
                }
            });

            this.ogl._dom.redraw(div, fragment, () =>
            {
                if(!planet.classList.contains('tooltipLeft'))
                {
                    if(planet._ogl.type == 'planet')
                    {
                        planet.classList.add('tooltipLeft');
                        planet.classList.remove('tooltipRight');
                        planet.querySelector('.planet-koords').innerHTML = `<span class="ogl_hidden">[</span>${planet._ogl.coords}<span class="ogl_hidden">]</span>`;
                    }
                    else
                    {
                        planet.classList.add('tooltipRight');
                        planet.classList.remove('tooltipLeft');
                    }

                    if(this.ogl.db.myPlanets[id]?.wreckfield && !planet.querySelector('.wreckFieldIcon'))
                    {
                        const icon = Util.addDom('a', { class:'wreckFieldIcon tooltip js_hideTipOnMobile ogl_active ogl_wreckfieldIcon', parent:planet.parentNode, href:`${window.location.href.split('?')[0]}?page=ingame&component=facilities&cp=${id}&openTech=36`, child:'<span class="icon icon_wreck_field"></span>' });
                        if(serverTime.getTime() >= this.ogl.db.myPlanets[id].wreckfield) icon.classList.add('ogl_ok');
                    }
                }
            });
        });
    }

    updatePlanetTimers()
    {
        Object.values(this.planet).forEach(planet =>
        {
            const id = planet._ogl.id;
            const timerDom = planet._ogl.timer;

            if(!timerDom) return;

            let timerValue = serverTime.getTime() - (this.ogl.db.myPlanets[id]?.lastRefresh || 1);
            timerValue = Math.min(Math.floor(timerValue / 60000), 60);
            const timerColor = timerValue > 30 ? '#ef7676' : timerValue > 15 ? '#d99c5d' : '#67ad7d';

            requestAnimationFrame(() =>
            {
                timerDom.style.color = timerColor;
                timerDom.innerText = timerValue.toString();
            });
        });

        if(!this.planetTimerInterval)
        {
            this.planetTimerInterval = setInterval(() => this.ogl._dom.updatePlanetTimers(), 60000);
        }
    }
}

class LangManager extends Manager
{
    load()
    {
        this.raw =
        {
            metal:'Metal',
            crystal:'Crystal',
            deut:'Deuterium',
            artefact:'Artefact',
            dm:'Dark Matter',
            202:'Small Cargo',
            203:'Large Cargo',
            204:'Light Fighter',
            205:'Heavy Fighter',
            206:'Cruiser',
            207:'Battleship',
            208:'Colony Ship',
            209:'Recycler',
            210:'Espionage Probe',
            211:'Bomber',
            212:'Solar Satellite',
            213:'Destroyer',
            214:'Deathstar',
            215:'Battlecruiser',
            216:'Trade Ship',
            217:'Crawler',
            218:'Reaper',
            219:'Pathfinder',
            220:'Trade Ship',
        }

        this.en =
        {
            ship:"Ships",
            item:"Item",
            other:"Other",
            resource:"Resources",
            battle:"Battle",
            blackhole:"Black hole",
            early:"Early",
            late:"Late",
            trader:"Trader",
            nothing:"Nothing",
            pirate:"Pirates",
            alien:"Aliens",
            duration:"Duration",
            defaultShip:"Default ship type",
            defaultMission:"Default mission type",
            useClientTime:"Use client time",
            displayMiniStats:"Stats range",
            displaySpyTable:"Display spy table",
            spyTableRules:"Spy table rules",
            displayPlanetTimers:"Display planets timer",
            disablePlanetTooltips:"Disable planets menu tooltips",
            showMenuResources:"Planets menu layout",
            reduceLargeImages:"Fold large images",
            ignoreExpeShips:"Ignore ships found in expeditions",
            ignoreExpeShipsLoss:"Ignore ships lost in expeditions",
            ignoreConsumption:"Ignore fleet consumption",
            resourceTreshold:"Resource threshold",
            tooltipDelay:"Tooltip delay (ms)",
            galaxyUp:"Next galaxy",
            galaxyDown:"Previous galaxy",
            galaxyLeft:"Previous system",
            galaxyRight:"Next system",
            previousPlanet:"Previous planet",
            nextPlanet:"Next planet",
            nextPinnedPosition:"Next pinned position",
            fleetRepeat:"Repeat last fleet",
            fleetSelectAll:"<div>Select all ships (fleet1)<hr>Select all resources (fleet2)</div>",
            expeditionSC:'Small cargo expedition',
            expeditionLC:'Large cargo expedition',
            expeditionPF:'Pathfinder expedition',
            galaxySpySystem:"System spy",
            collectLinked:"Collect to linked planet/moon",
            keyboardActions:"Keyboard settings",
            enableNotifications:"Enable notifications",
            expeditionValue:"Expedition value",
            expeditionValueTT:"<ul><li>The custom value aimed by your expeditions</li><li>Set it to <b>0</b> to use the default calculated value</li><li>You can use <b>%</b> to aim a percent of the calculated value</li></ul>",
            expeditionBigShips:"Allowed biggest ships",
            expeditionRandomSystem:"Random system",
            expeditionShipRatio:"Ships found value (%)",
            fleetLimiter:"Fleet limiter",
            fleetLimiterTT:"Chose the amount of ships / resources to keep on your planets",
            menu:"Toggle OGLight menu",
            quickRaid:"Quick raid",
            attackNext:"Attack next planet",
            autoCleanReports:"Auto clean reports",
            autoCleanCounterSpies:"Auto clean counter spies",
            noCurrentPin:"Error, no target pinned",
            backFirstFleet:"Back first fleet",
            backLastFleet:"Back last fleet sent",
            fleetReverseAll:"Invert selection",
            fleetResourcesSplit:"Split ships/resources",
            manageData:"Manage OGLight data",
            profileButton:"Limiters settings",
            limiters:"Limiters",
            expeditionRedirect:"Redirect to the next planet/moon",
            playerProfile:"Player profile",
            topReportDetails:"Top report details",
            reportFound:"Top report",
            discovery:"Send a discovery",
            collectResources:"Collect resources",
            accountSummary:"Account summary",
            stats:"Stats",
            taggedPlanets:"Tagged planets",
            pinnedPlayers:"Pinned players",
            oglSettings:"OGLight settings",
            coffee:"Buy me a coffee",
            syncEmpire:"Sync empire data",
            repeatQueue:"Repeat the amount above in a new queue X time.<br>This operation can take a while",
            spyPlanet:"Spy this planet",
            spyMoon:"Spy this moon",
            resourceLimiter:"Substract the amount of resources defined in your profile limiter",
            fleetLimiter:"Substract the amount of ships defined in your profile limiter",
            forceKeepCapacity:"Keep enough capacity on you planet to move your resources (has priority over limiters)",
            forceIgnoreFood:"Ignore food (has priority over limiters)",
            resetStats:"Reset stats",
            resetTaggedPlanets:"Reset tagged planets",
            resetPinnedPlayers:"Reset pinned players",
            resetAll:"Reset all data",
            resetStatsLong:"Do you really want to reset OGLight stats data ?",
            resetTaggedPlanetsLong:"Do you really want to reset OGLight tagged planets data ?",
            resetPinnedPlayersLong:"Do you really want to reset OGLight pinned players data ?",
            resetAllLong:"Do you really want to reset all OGLight data ?",
            reportBlackhole:"Report a black hole",
            reportBlackholeLong:"Do you really want to add this black hole ?",
            emptyPlayerList:"There is no player in this list",
            debugMode:"Debug mode",
            sim:"Battle sim",
            converter:"Battle converter",
            siblingPlanetMoon:"Sibling planet / moon",
            oglMessageDone:"This message has been read by OGLight",
            ptreMessageDone:"activity sent to PTRE",
            boardTab:"Display board news",
            msu:"Metal standard unit",
            notifyNoProbe:"Feature disabled :(",
            shortcutsOnRight:"Display shortcuts under the planet menu",
            ptreTeamKey:"Team key",
            ptreLogs:"Display PTRE errors",
            ptreActivityImported:"activity imported to PTRE",
            ptreActivityAlreadyImported:"activity already imported to PTRE",
            ptreSyncTarget:"Sync with PTRE",
            ptreManageTarget:"Manage on PTRE",
            colorblindMode:"Colorblind mode",
            fleetQuickCollect:"Quick collect this planet resources",
            sidePanelOnLeft:"Side panel on left",
            galaxyReload:"Reload galaxy",
            spyTableMSU:"Use MSU in the spy table",
        };

        this.fr =
        {
            ship:"Vaisseaux",
            item:"Item",
            other:"Autre",
            resource:"Ressources",
            battle:"Combat",
            blackhole:"Trou noir",
            early:"Avance",
            late:"Retard",
            trader:"Marchand",
            nothing:"Rien",
            pirate:"Pirates",
            alien:"Aliens",
            duration:"Durée",
            defaultShip:"Vaisseau par défaut",
            defaultMission:"Mission par défaut",
            useClientTime:"Utiliser l'heure du client",
            displayMiniStats:"Fourchette",
            displaySpyTable:"Afficher le tableau d'espio",
            spyTableRules:"Règles du tableau d'espio",
            displayPlanetTimers:"Afficher les timers des planètes",
            disablePlanetTooltips:"Cacher les tooltips du menu des planètes",
            showMenuResources:"Affichage du menu des planètes",
            reduceLargeImages:"Réduire les grandes images",
            ignoreExpeShips:"Ignorer les vaisseaux trouvés en expédition",
            ignoreExpeShipsLoss:"Ignorer les vaisseaux perdus en expédition",
            ignoreConsumption:"Ignorer la consommation des flottes",
            resourceTreshold:"Seuil de ressources",
            tooltipDelay:"Délai des tooltips (ms)",
            galaxyUp:"Galaxie suivante",
            galaxyDown:"Galaxie précédente",
            galaxyLeft:"Système précédent",
            galaxyRight:"Système suivant",
            previousPlanet:"Planète précédente",
            nextPlanet:"Planète suivante",
            nextPinnedPosition:"Position épinglée suivante",
            fleetRepeat:"Répéter la dernière flotte",
            fleetSelectAll:"<div>Selectionner tous les vaisseaux (fleet1)<hr>Selectionner toutes les ressources (fleet2)</div>",
            expeditionSC:"Expédition au petit transporteur",
            expeditionLC:"Expédition au grand transporteur",
            expeditionPF:"Expédition à l'éclaireur",
            galaxySpySystem:"Espionnage du système",
            collectLinked:"Rapatrier vers les planètes/lunes liée",
            keyboardActions:"Raccourcis clavier",
            enableNotifications:"Activer les notifications",
            expeditionValue:"Valeur max. expédition",
            expeditionValueTT:"<ul><li>La valeur visée par les expédition</li><li>Laisser à <b>0</b> pour utiliser la valeur calculée par OGLight</li><li>Vous pouvez mettre une valeur fixe pour viser un montant précis</li><li>Vous pouvez utiliser <b>%</b> pour viser un pourcentage de la valeur calculée</li><ul>",
            expeditionBigShips:"Gros vaisseaux autorisés",
            expeditionRandomSystem:"Système aléatoire",
            expeditionShipRatio:"Valeur vaisseaux trouvés (%)",
            fleetLimiter:"Limiteur de flotte",
            fleetLimiterTT:"Choisir le nombre de vaisseau et la quantité de ressources à garder sur les planètes/lunes",
            menu:"Afficher/masquer le menu OGLight",
            quickRaid:"Raid rapide",
            attackNext:"Attaquer la planète suivante",
            autoCleanReports:"Nettoyage automatique des rapports",
            autoCleanCounterSpies:"Nettoyage automatique des contre-espio",
            noCurrentPin:"Pas de cible épinglée actuellement",
            backFirstFleet:"Rappeler la prochaine flotte",
            backLastFleet:"Rappeler la dernière flotte envoyée",
            fleetReverseAll:"Inverser la sélection",
            fleetResourcesSplit:"Diviser les vaisseaux/ressources",
            manageData:"Gestion des données OGLight",
            profileButton:"Configuration des limiteurs",
            limiters:"Limiteurs",
            expeditionRedirect:"Rediriger vers la planète/lune suivante",
            playerProfile:"Profil du joueur",
            topReportDetails:"Détails du meilleur rapport",
            reportFound:"Meilleur rapport",
            discovery:"Envoyer une exploration",
            collectResources:"Rapatrier les ressources",
            accountSummary:"Résumé du compte",
            stats:"Statistiques",
            taggedPlanets:"Planètes marquées",
            pinnedPlayers:"Joueurs épinglés",
            oglSettings:"Configuration d'OGLight",
            coffee:"Buy me a coffee",
            syncEmpire:"Synchroniser les données de l'empire",
            repeatQueue:"Répéter le nombre ci-dessus dans une nouvelle file X fois.<br>Cette opération peut prendre un moment",
            spyPlanet:"Espionner cette planète",
            spyMoon:"Espionner cette lune",
            resourceLimiter:"Soustraire le montant de ressources indiqué dans le limiteur",
            fleetLimiter:"Soustraire le nombre de vaisseaux indiqué dans le limiteur",
            forceKeepCapacity:"Garder assez de capacité sur la planète pour bouger les ressources (a la priorité sur le limiteur)",
            forceIgnoreFood:"Ignorer la nourriture (a la priorité sur le limiteur)",
            resetStats:"Réinitialiser stats",
            resetTaggedPlanets:"Réinitialiser les planètes marquées",
            resetPinnedPlayers:"Réinitialiser les joueurs épinglés",
            resetAll:"Réinitialiser toutes les données OGLight",
            resetStatsLong:"Voulez-vous vraiment réinitialiser les stats ?",
            resetTaggedPlanetsLong:"Voulez-vous vraiment réinitialiser les planètes marquées ?",
            resetPinnedPlayersLong:"Voulez-vous vraiment réinitialiser les joueurs épinglés ?",
            resetAllLong:"Voulez-vous vraiment réinitialiser toutes les données OGLight ?",
            reportBlackhole:"Signaler un trou noir",
            reportBlackholeLong:"Voulez vous vraiment ajouter ce trou noir ?",
            emptyPlayerList:"Cette liste de joueurs est vide",
            debugMode:"Mode debug",
            sim:"Simulateur de combat",
            converter:"Convertisseur de combat",
            siblingPlanetMoon:"Planète / lune liée",
            oglMessageDone:"Ce message a été traité par OGLight",
            ptreMessageDone:"Activité envoyée à PTRE",
            boardTab:"Afficher les annonces du board",
            msu:"Metal standard unit",
            notifyNoProbe:"Fonctionnalité desactivée :(",
            shortcutsOnRight:"Raccourcis sous le menu des planètes",
            ptreTeamKey:"Team key",
            ptreLogs:"Afficher les erreurs PTRE",
            ptreActivityImported:"Activité importée dans PTRE",
            ptreActivityAlreadyImported:"Activité déjà importée dans PTRE",
            ptreSyncTarget:"Synchroniser avec PTRE",
            ptreManageTarget:"Gérer sur PTRE",
            colorblindMode:"Mode daltonien",
            fleetQuickCollect:"Collecte rapide des ressources de cette planète",
            sidePanelOnLeft:"Panneau latéral à gauche",
            galaxyReload:"Recharger la galaxie",
            spyTableMSU:"Utiliser le MSU dans le tableau d'espio",
        };

        this.de =
        {
            ship:"Schiffe",
            item:"Item",
            other:"Sonstiges",
            resource:"Ressourcen",
            battle:"Kampf",
            blackhole:"Schwarzes Loch",
            early:"Verfrühung",
            late:"Verspätung",
            trader:"Händler",
            nothing:"Nichts",
            pirate:"Piraten",
            alien:"Aliens",
            duration:"Dauer",
            defaultShip:"Standard Schiff",
            defaultMission:"Standard Mission",
            useClientTime:"Nutze Clientzeit",
            displayMiniStats:"Zeige Statistik Bereich",
            displaySpyTable:"Zeige Spionagetabelle",
            displayPlanetTimers:"Zeige Planetentimer",
            disablePlanetTooltips:"Deaktiviere Planetenmenü Tooltip",
            showMenuResources:"Planeten Menü-Anordnung",
            reduceLargeImages:"Klappe große Bilder zu",
            ignoreExpeShips:"Ignoriere Schiffsfunde in Expeditionen",
            ignoreExpeShipsLoss:"Ignoriere Flottenverluste in Expeditionen",
            ignoreConsumption:"Ignoriere Treibstoffverbrauch",
            resourceTreshold:"Ressourcen Grenzwert",
            tooltipDelay:"Tooltip Verzögerung (ms)",
            galaxyUp:"Nächste Galaxie",
            galaxyDown:"Vorherige Galaxie",
            galaxyLeft:"Vorheriges System",
            galaxyRight:"Nächstes System",
            previousPlanet:"Vorheriger Planet",
            nextPlanet:"Nächster Planet",
            nextPinnedPosition:"Nächste angepinnte Position",
            fleetRepeat:"Wiederhole letzte Flotte",
            fleetSelectAll:"<div>Wähle alle Schiffe (flotte1)<hr>Wähle alle Ressourcen (flotte2)</div>",
            expeditionSC:"Kleiner Transporter Expedition",
            expeditionLC:"Großer Transporter Expedition",
            expeditionPF:"Pathfinder Expedition",
            galaxySpySystem:"System Spionage",
            collectLinked:"Sammle zu verlinktem Planet/Mond",
            keyboardActions:"Tastatureinstellungen",
            expeditionValue:"Expedition Maximalwert",
            expeditionValueTT:"Benutzerdefinierter Maximalwert für Expeditionen.<br> Setze ihn auf <b>0</b> um berechnete Werte zu verwenden.",
            expeditionBigShips:"Erlaubtes größtes Schiff",
            expeditionRandomSystem:"Zufälliges System",
            expeditionShipRatio:"Schiffsfund Wert(%)",
            fleetLimiter:"Flottenbegrenzer",
            fleetLimiterTT:"Wähle die Anzahl an Schiffen / Ressourcen die auf dem Planeten bleiben sollen",
            menu:"OGLight Einstellungen",
            quickRaid:"Schnell-Angriff",
            attackNext:"Attackiere nächsten Planeten",
            autoCleanReports:"Automatische Spionagebericht-Bereinigung",
            noCurrentPin:"Fehler: Kein angepinntes Ziel",
            backFirstFleet:"Ziehe erste Flotte zurück",
            backLastFleet:"Ziehe letzte Flotte zurück",
            fleetReverseAll:"Auswahl umkehren",
            fleetResourcesSplit:"Teile Schiffe/Ressourcen",
            manageData:"Verwalte OGLight Daten",
            profileButton:"Profil Maximalwerte",
            limiters:"Maximalwerte",
            expeditionRedirect:"Zum nächsten Planet/Mond weiterleiten",
            playerProfile:"Spielerprofil",
            topReportDetails:"Informationen oberster Bericht",
            reportFound:"oberster Bericht",
            discovery:"Sende Erkundung",
            collectResources:"Ressourcen zusammenziehen",
            accountSummary:"Accountzusammenfassung",
            stats:"Statistiken",
            taggedPlanets:"Getaggte Planeten",
            pinnedPlayers:"Angepinnte Spieler",
            oglSettings:"OGLight Einstellungen",
            coffee:"Unterstütze mich",
            syncEmpire:"Synchronisiere Imperiumsdaten",
            repeatQueue:"Wiederhole Anzahl in neuer Schleife X mal.<br>Diese Option kann etwas dauern.",
            spyPlanet:"Spioniere diesen Planeten",
            spyMoon:"Spioniere diesen Mond",
            resourceLimiter:"Subtrahiere Anzahl der Ressourcen die im Profilmaximalwert definiert sind.",
            fleetLimiter:"Subtrahiere Anzahl der Schiffe die im Profilmaximalwert definiert sind.",
            forceKeepCapacity:"Genügend Ladekapazität zurückhalten, um Rohstoffe zu transportieren (hat Priorität über definierten Grenzwerten)",
            forceIgnoreFood:"Ignoriere Nahrung (hat Priorität über definierten Grenzwerten)",
            resetStats:"Setze Statistik zurück",
            resetTaggedPlanets:"Setze getaggte Planeten zurück",
            resetPinnedPlayers:"Setze angepinnte Spieler zurück",
            resetAll:"Setze alle Daten zurück",
            resetStatsLong:"Möchtest du wirklich die OGL Daten zurücksetzen?",
            resetTaggedPlanetsLong:"Möchtest du wirklich die getaggten Planeten zurücksetzen?",
            resetPinnedPlayersLong:"Möchtest du wirklich die Spielerdaten zurücksetzen?",
            resetAllLong:"Möchtest du wirklich alle OGL Daten zurücksetzen?",
            reportBlackhole:"Melde schwarzes Loch",
            reportBlackholeLong:"Möchtest du dieses Schwarze Loch wirklich hinzufügen?",
            emptyPlayerList:"Es ist kein Spieler in der Liste",
            debugMode:"Debug Modus",
            sim:"Kampfsimulator",
            siblingPlanetMoon:"Verknüpfter Planet / Mond",
            oglMessageDone:"Diese Nachricht wurde von OGLight gelesen",
            boardTab:"Zeige Forum Neuigkeiten an",
            msu:"Metall Standardeinheit (MSE)",
            notifyNoProbe:"Funktion deaktiviert :(",
            shortcutsOnRight:"Zeige Kurzmenü unter Planeten",
            ptreTeamKey:"PTRE Team Key",
            ptreLogs:"Zeige PTRE Fehler",
            ptreActivityImported:"Aktivität zu PTRE importiert",
            ptreActivityAlreadyImported:"Aktivität bereits im PTRE",
            ptreSyncTarget:"Synchronisiere mit PTRE",
            ptreManageTarget:"Verwalte auf PTRE"
        };

        this.gr =
        {
            ship:"Πλοία",
            item:"Αντικείμενο",
            other:"Άλλο",
            resource:"Πόροι",
            battle:"Μάχη",
            blackhole:"Μαύρη τρύπα",
            early:"Νωρίς",
            late:"Αργά",
            trader:"Εμπόριο",
            nothing:"Τίποτα",
            pirate:"Πειρατές",
            alien:"Άλιεν ",
            duration:"Διάρκεια",
            defaultShip:"Προεπιλογή πλοίου",
            defaultMission:"Προεπιλεγμένη αποστολή",
            useClientTime:"Χρήση ρολογιού OGlight",
            displayMiniStats:"Εύρος στατιστικών",
            displaySpyTable:"Πίνακας κατασκοπείας",
            displayPlanetTimers:"Χρόνος δραστηριότητας",
            disablePlanetTooltips:"Απενεργοποίηση μενού πλανητών",
            showMenuResources:"Διάταξη μενού πλανητών",
            reduceLargeImages:"Μικρότερες εικόνες",
            ignoreExpeShips:"Αγνόησε πλοία που βρέθηκαν σε αποστολές",
            ignoreExpeShipsLoss:"Αγνόησε πλοία που χάθηκαν σε αποστολές",
            ignoreConsumption:"Αγνόησε την κατανάλωση πλοίων",
            resourceTreshold:"Ανώτατο όριο πόρων",
            tooltipDelay:"Καθυστέρηση επεξήγησης (ms)",
            galaxyUp:"Επόμενος γαλαξίας",
            galaxyDown:"Προηγούμενος γαλαξίας",
            galaxyLeft:"Προηγούμενο σύστημα",
            galaxyRight:"Επόμενο σύστημα",
            previousPlanet:"Προηγούμενος πλανήτης",
            nextPlanet:"Επόμενος πλανήτης",
            nextPinnedPosition:"Επόμενη καρφιτσωμένη θέση",
            fleetRepeat:"Επανάληψη τελευταίου στόλου",
            fleetSelectAll:"<div>Επιλογή όλων των πλοίων (fleet1)<hr>Επιλογή όλων των πόρων (fleet2)</div>",
            expeditionSC:'Αποστολή με μικρά μεταγωγικά',
            expeditionLC:'Αποστολή με μεγάλα μεταγωγικά',
            expeditionPF:'Αποστολή με pathfinder',
            galaxySpySystem:"Κατασκοπεία συστήματος",
            collectLinked:"Συλλογή στο συνδεδεμένο πλανήτη/φεγγάρι",
            keyboardActions:"Ρυθμίσεις πληκτρολογίου",
            expeditionValue:"Αξία αποστολής",
            expeditionValueTT:"Προσαρμοσμένη αξία των αποστολών.<br> Ρύθμιση σε <b>0</b> για να χρησιμοποιηθεί η προεπιλεγμένη τιμή",
            expeditionBigShips:"Επιτρέπονται μεγαλύτερα πλοία",
            expeditionRandomSystem:"Τυχαίο σύστημα",
            expeditionShipRatio:"Αξία πλοίων που βρέθηκαν (%)",
            fleetLimiter:"Περιοριστής στόλου",
            fleetLimiterTT:"Επιλέξτε την ποσότητα πλοίων / πόρων που θα παραμείνουν στον πλανήτη",
            menu:"Εναλλαγή μενού OGLight",
            quickRaid:"Γρήγορη επιδρομή",
            attackNext:"Επίθεση στον επόμενο πλανήτη",
            autoCleanReports:"Αυτόματο σβήσιμο αναφορών",
            noCurrentPin:"Σφάλμα, δεν καρφιτσώθηκε στόχος",
            backFirstFleet:"Επιστροφή πρώτος στόλος",
            backLastFleet:"Επιστροφή τελευταίος στόλος",
            fleetReverseAll:"Αντίστροφη επιλογή",
            fleetResourcesSplit:"Διαχωρισμός πλοίων/πόρων",
            manageData:"Διαχείριση δεδομένων OGLight",
            profileButton:"Προφίλ περιορισμού",
            limiters:"Περιορισμοί",
            expeditionRedirect:"Ανακατεύθυνση στον επόμενο πλανήτη/φεγγάρι",
            playerProfile:"Προφίλ παίχτη",
            topReportDetails:"Λεπτομέρειες κορυφαίας αναφοράς",
            reportFound:"Κορυφαία αναφορά",
            discovery:"Μαζική Αποστολή Ανιχνευτικών Σκαφών",
            collectResources:"Συλλογή πόρων",
            accountSummary:"Περίληψη λογαριασμού",
            stats:"Στατιστικά",
            taggedPlanets:"Πλανήτες με ετικέτα",
            pinnedPlayers:"Καρφιτσωμένοι παίκτες",
            oglSettings:"Ρυθμίσεις OGLight",
            coffee:"Buy me a coffee",
            syncEmpire:"Συγχρονισμός δεδομένων",
            repeatQueue:"Επανέλαβε το παραπάνω ποσό σε νέα ουρά  X χρόνο.<br>Αυτή η λειτουργία μπορεί να διαρκέσει λίγο",
            spyPlanet:"Κατασκοπεία αυτού του πλανήτη",
            spyMoon:"Κατασκοπεία αυτού του φεγγαριού",
            resourceLimiter:"Αφαιρέστε το ποσό των πόρων που ορίζονται στον περιοριστή ",
            fleetLimiter:"Αφαιρέστε τον αριθμό των πλοίων που ορίζεται στον περιοριστή ",
            forceKeepCapacity:"Διατηρήστε αρκετή ποσότητα στον πλανήτη σας για να μεταφέρετε τους πόρους σας(has priority over limiters)",
            forceIgnoreFood:"Αγνόησε την τροφή (has priority over limiters)",
            resetStats:"Επαναφορά στατιστικών",
            resetTaggedPlanets:"Επαναφορά πλανητών με ετικέτα",
            resetPinnedPlayers:"Επαναφορά καρφιτσωμένων παικτών ",
            resetAll:"Επαναφορά όλων των δεδομένων",
            resetStatsLong:"Θέλετε να επαναφέρετε τα δεδομένα των στατιστικών του OGLight;",
            resetTaggedPlanetsLong:"Θέλετε να επαναφέρετε τα δεδομένα πλανητών με ετικέτα του OGLight;",
            resetPinnedPlayersLong:"Θέλετε να επαναφέρετε τα δεδομένα των καρφιτσωμένων παικτών του OGLight;",
            resetAllLong:"Θέλετε να επαναφέρετε όλα τα δεδομένα του OGLight;",
            reportBlackhole:"Ανάφερε μια μαύρη τρύπα",
            reportBlackholeLong:"Θέλετε να προσθέσετε αυτή την μαύρη τρύπα;",
            emptyPlayerList:"Δεν υπάρχει παίχτης σε αυτή τη λίστα",
            debugMode:"Εντοπισμός σφαλμάτων",
            sim:"Προσομοιωτής μάχης",
            siblingPlanetMoon:"Αδελφός πλανήτης / φεγγάρι",
            oglMessageDone:"Αυτό το μήνυμα διαβάστηκε από το OGLight",
            boardTab:"Εμφάνιση πίνακα ειδήσεων",
            msu:"Αξια σε Μέταλλο",
            notifyNoProbe:"Απενεργοποιημένη δυνατότητα :(",
            shortcutsOnRight:"Εμφάνιση συντομεύσεων κάτω από τους πλανήτες",
            ptreTeamKey:"Team key",
            ptreLogs:"Εμφάνισε PTRE σφάλματα",
            ptreActivityImported:"δραστηριότητα εισήχθη στο PTRE",
            ptreActivityAlreadyImported:"δραστηριότητα που έχει ήδη εισαχθεί PTRE",
            ptreSyncTarget:"Συγχρονισμός με PTRE",
            ptreManageTarget:"Διαχείριση PTRE",
        };
    }

    find(key, isRaw)
    {
        if(key == 'darkmatter') key = 'dm';

        if(isRaw && this.raw[key]) return this.raw[key];
        else if(this[this.ogl.account.lang] && this[this.ogl.account.lang][key]) return this[this.ogl.account.lang][key];
        else if(this.ogl.db.serverData[key]) return this.ogl.db.serverData[key];
        else if(this.en[key]) return this.en[key];
        else return 'TEXT_NOT_FOUND';
    }
}

class TimeManager extends Manager
{
    load()
    {
        this.units = LocalizationStrings.timeunits.short;
        this.serverTimeZoneOffset = this.ogl.db.serverData.serverTimeZoneOffsetInMinutes * 60000;
        //this.clientTimeZoneOffset = serverTime.getTimezoneOffset() * 60000;
        this.clientTimeZoneOffset = Math.round((serverTime.getTime() - Date.now()) / (1000 * 60 * 60)) * 60 * 60000;

        // times at script load; /!\ those values are not refreshed
        this.UTC = serverTime.getTime() + this.serverTimeZoneOffset;
        this.serverTime = serverTime.getTime();
        this.clientTime = this.UTC - this.clientTimeZoneOffset;

        this.observeList = ['.OGameClock', '.ogl_backTimer', '.ogl_backWrapper'];
        //this.observeList = ['.OGameClock', '#fleet2 #arrivalTime', '#fleet2 #returnTime', '.ogl_backTimer', '.ogl_backWrapper'];
        this.updateList = ['.OGameClock', '.arrivalTime', '.absTime', '.nextabsTime', '.ui-dialog .msg_date'];

        this.productionBoxes =
        {
            restTimebuilding:'productionboxbuildingcomponent', // base building
            restTimeresearch:'productionboxresearchcomponent', // base research
            restTimeship2:'productionboxshipyardcomponent', // base ships
            restTimelfbuilding:'productionboxlfbuildingcomponent', // lifeform building
            restTimelfresearch:'productionboxlfresearchcomponent', // lifeform research
            mecha:'productionboxextendedshipyardcomponent', // mecha ships
        };

        if(this.ogl.page == 'fleetdispatch')
        {
            // update fleet2 arrival / back time to be much more precise
            let lastLoop = 0;
            let arrivalDom, backDom;
            
            document.querySelectorAll('#fleet2 #arrivalTime, #fleet2 #returnTime').forEach((e, index) =>
            {
                if(index == 0) arrivalDom = Util.addDom('div', { class:'ogl_missionTime ogl_arrival', parent:e.parentNode, child:'loading...' });
                else backDom = Util.addDom('div', { class:'ogl_missionTime ogl_return', parent:e.parentNode, child:'loading...' });
                e.remove();
            });

            this.timeLoop = noLoop =>
            {
                //const time = serverTime.getTime();
                const timeObj = this.getObj();

                if(unsafeWindow.fleetDispatcher && (timeObj.server != lastLoop || noLoop))
                {
                    const duration = (fleetDispatcher.getDuration() || 0) * 1000;
                    const arrival = new Date(duration + (this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server));
                    const back = new Date(fleetDispatcher.mission == 15 ? duration * 2 + (this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server) + fleetDispatcher.expeditionTime * 3600000 : 
                        fleetDispatcher.mission == 5 ? duration * 2 + (this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server) + fleetDispatcher.holdingTime * 3600000 :
                        duration * 2 + (this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server));
                    
                    arrivalDom.setAttribute('data-output-date', arrival.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'}));
                    arrivalDom.setAttribute('data-output-time', arrival.toLocaleTimeString('de-DE'));

                    backDom.setAttribute('data-output-date', back.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'}));
                    backDom.setAttribute('data-output-time', back.toLocaleTimeString('de-DE'));

                    lastLoop = timeObj.server;
                }
    
                if(!noLoop) requestAnimationFrame(() => this.timeLoop());
            }

            this.timeLoop();
        }

        // ping
        const ping = (performance.timing.responseEnd - performance.timing.requestStart) / 1000;
        let li = Util.addDom('li', { 'class':'ogl_ping', child:`${ping} s`, parent:document.querySelector('#bar ul') });
        if(ping >= 2) li.classList.add('ogl_danger');
        else if(ping >= 1) li.classList.add('ogl_warning');

        Util.runAsync(this.update, this);
        Util.runAsync(this.observe, this);
    }

    update(self, domTarget)
    {
        self = self || this;

        self.updateList.forEach(element =>
        {
            let targets = domTarget ? [domTarget] : document.querySelectorAll(`${element}:not(.ogl_updated)`);

            targets.forEach(target =>
            {
                target.classList.add('ogl_updated');

                const timeObj = self.getObj(self.dateStringToTime(target.innerText));
                const date = new Date(self.ogl.db.options.useClientTime ? timeObj.client : timeObj.server);

                if(target.innerText.split(/\.|:| /).length > 5)
                {
                    target.setAttribute('data-output-date', date.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'}));
                    //target.setAttribute('data-time-utc', timeObj.utc);
                }

                target.setAttribute('data-output-time', date.toLocaleTimeString('de-DE'));
                target.setAttribute('data-time-server', timeObj.server);
                target.setAttribute('data-time-client', timeObj.client);
            });
        });
    }

    observe(self)
    {
        self = self || this;

        self.observeList.forEach(element =>
        {
            let targets = document.querySelectorAll(`${element}:not(.ogl_observed)`);

            targets.forEach(target =>
            {
                target.classList.add('ogl_observed');

                let action = () =>
                {
                    const timeObj = self.getObj(self.dateStringToTime(target.innerText));
                    const date = new Date(self.ogl.db.options.useClientTime ? timeObj.client : timeObj.server);
    
                    target.setAttribute('data-output-date', date.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'}));
                    target.setAttribute('data-output-time', date.toLocaleTimeString('de-DE'));
                    //target.setAttribute('data-time-utc', timeObj.utc);
                    target.setAttribute('data-time-server', timeObj.server);
                    target.setAttribute('data-time-client', timeObj.client);
                }

                action();
    
                Util.observe(target, {childList:true}, action);
            });
        });
    }

    getObj(time, timeSource)
    {
        timeSource = timeSource || 'server';
        time = time || (timeSource == 'server' ? serverTime.getTime() : Date.now());

        const timezone = {};
        timezone.serverOffset = 0;
        timezone.clientOffset = Math.round((serverTime.getTime() - Date.now()) / (1000 * 60 * 60)) * 60 * 60000;

        if(timeSource == 'server')
        {
            timezone.client = time - timezone.clientOffset;
            timezone.server = time;
        }
        else
        {
            timezone.client = time;
            timezone.server = time + timezone.clientOffset;
        }

        return timezone;
    }

    convertTimestampToDate(timestamp, full)
    {
        const date = new Date(timestamp);

        let target = Util.addDom('time', { child:date.toLocaleTimeString('de-DE') });

        if(full)
        {
            target = Util.addDom('time', { child:`${date.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'})} ${date.toLocaleTimeString('de-DE')}` });
        }

        return target;
    }

    updateMovements()
    {
        const initialTime = new Date();

        document.querySelectorAll('[data-mission-type]').forEach(fleet =>
        {
            if(fleet.querySelector('.ogl_backTimer')) return;

            const backButton = fleet.querySelector('.reversal_time a');
            if(!backButton) return;

            const domElement = Util.addDom('div', { class:'ogl_backTimer ogl_button', parent:fleet.querySelector('.ogl_resourcesBlock'), onclick:() => backButton.click() });

            let time = backButton.getAttribute('data-tooltip-title') || backButton.getAttribute('title');
            if(!time) return;

            time = time.replace('<br>',' ');
            time = time.replace(/ \.$/, '');
            time = time.trim().replace(/[ \.]/g, ':');
            time = time.split(':');
            time = new Date(`${time[4]}-${time[3]}-${time[2]}T${time[5]}:${time[6]}:${time[7]}`).getTime();

            this.updateBackTimer(initialTime, time, domElement);

            const wrapper = Util.addDom('div');
            Util.addDom('div', { class:'ogl_backWrapper', parent:wrapper, child:domElement.innerText });
            backButton.addEventListener('tooltip', () => backButton._tippy.setContent(wrapper));
            //backButton.addEventListener('tooltip', () => this.ogl._tooltip.update(wrapper));

            const interval = setInterval(() =>
            {
                if(document.body.contains(fleet)) this.updateBackTimer(initialTime, time, domElement);
                else clearInterval(interval);
            }, 500);
        });
    }

    updateBackTimer(initialTime, time, domElement)
    {
        const timeObj = this.getObj(time);
        const deltaTime = new Date() - initialTime;
        const newTime = new Date(timeObj.server + deltaTime * 2);
        domElement.innerText = `${newTime.toLocaleDateString('de-DE')} ${newTime.toLocaleTimeString('de-DE')}`;
    }

    dateStringToTime(str)
    {
        str = str.split(/\.|:| /);

        if(str.length <= 5)
        {
            str = ["01","01","2000"].concat(str);
        }

        str = str.map(e => e.padStart(2, '0'));
        if(str[2].length == 2) str[2] = '20' + str[2]; // ex: 10.05.22 => 10.05.2022

        return new Date(`${str[2]}-${str[1]}-${str[0]}T${str[3]}:${str[4]}:${str[5]}`).getTime();
    }

    timeToKey(time) // can only receive server time
    {
        const dateObj = new Date(this.getObj(time, 'server').server);
        return `${dateObj.getFullYear()}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${('0' + dateObj.getDate()).slice(-2)}`;
    }

    timeToHMS(time)
    {
        //return new Date(time).toISOString().slice(11, 19);
        return new Date(time).toLocaleTimeString('de-DE', { hour12:false });
    }

    durationToHMS(duration)
    {
        const totalSeconds = Math.floor(duration / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const pad = (num) => num.toString().padStart(2, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    stringToTime(str)
    {
        if(!str) return;

        const pattern = `(\\d+)(?:${this.units.hour}|${this.units.minute}|${this.units.second})`;
        const regex = new RegExp(pattern, 'g');
        const match = str.match(regex);

        if(!match) return 0;

        const hMatch = match.find(e => e.indexOf(this.units.hour) >= 0);
        const mMatch = match.find(e => e.indexOf(this.units.minute) >= 0);
        const sMatch = match.find(e => e.indexOf(this.units.second) >= 0);

        const hour = hMatch ? parseInt(hMatch.replace(/\D/g, '')) : 0;
        const minute = mMatch ? parseInt(mMatch.replace(/\D/g, '')) : 0;
        const second = sMatch ? parseInt(sMatch.replace(/\D/g, '')) : 0;

        const ms = ((hour * 3600) + (minute * 60) + second) * 1000;

        return ms;
    }

    isoDurationToMs = (isoStr) =>
    {
        const regex = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?)?/;
        const parts = isoStr.match(regex);
        if(!parts) return 0;

        const [, , , weeks, days, hours, minutes, seconds] = parts.map(p => parseFloat(p) || 0);

        return (
            weeks * 7 * 86400000 + // 1 semaine = 7 jours
            days * 86400000 +
            hours * 3600000 +
            minutes * 60000 +
            seconds * 1000
        );
    }
}

class FetchManager extends Manager
{
    load()
    {
        this.fetched = { empire0:1, empire1:1, lf:1, prod:1 };
        this.fetchedError = { empire0:0, empire1:0, lf:0, prod:0 };
        this.apiCooldown = 86400000 * 7;
        this.pending = [];
        setInterval(() => this.resolve(), 500);
    }

    resolve()
    {
        if(this.pending.length < 1) return;

        let inProgress = this.pending.splice(0, 7);
        Promise.all(inProgress.map(promise => fetch(promise.url).then(response => response.text()).then(text => { return {'result':text, 'callback':promise.callback} }))).then(reqs =>
        {
            reqs.forEach(req =>
            {
                req.callback(req.result);
            });
        });
    }

    fetchMainData(callback, ignoreDelay)
    {
        /*
        this.ogl._topbar?.syncBtn.classList.add('ogl_active');
        Promise.all([
            this.fetchLFBonuses(false, ignoreDelay),
            this.fetchEmpire(0, false, ignoreDelay),
            this.fetchEmpire(1, false, ignoreDelay),
            this.fetchProductionQueue(false, ignoreDelay)
        ])
        .then(results =>
        {
            this.ogl._topbar.syncBtn.classList.remove('ogl_active');
            this.ogl.save();
            if(callback) callback();
        })
        .catch(error =>
        {
            this.ogl._topbar.syncBtn.classList.remove('ogl_active');
            console.error(`Fetch error`);
        });
        */
    }

    async fetchEmpire(type, callback, ignoreDelay)
    {
        type = type || 0;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 600_000);

        this.ogl.db[`lastEmpire${type}Update`] = this.ogl.db[`lastEmpire${type}Update`] || 0;
        if(!ignoreDelay && Date.now() < this.ogl.db[`lastEmpire${type}Update`] + 60000 * 3) return;  // 3mn

        return fetch(`${window.location.href.split('?')[0]}?page=ajax&component=empire&ajax=1&planetType=${type}&asJson=1`,
        {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            signal: controller.signal
        })
        .then(response =>
        {
            clearTimeout(timeout);
            return response.json();
        })
        .then(result =>
        {
            this.ogl._empire.update(JSON.parse(result.mergedArray), type);
            if(callback) callback();
        })
        .catch(error =>
        {
            console.error(`Can't fetch empire data`);
        });
    }

    async fetchLFBonuses(callback, ignoreDelay)
    {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 600_000);

        this.ogl.db.lastLFBonusUpdate = this.ogl.db.lastLFBonusUpdate || 0;
        if(!ignoreDelay && Date.now() < this.ogl.db.lastLFBonusUpdate + 60000 * 4) return;  // 4mn

        return fetch(`${window.location.href.split('?')[0]}?page=ajax&component=lfbonuses`,
        {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            signal: controller.signal
        })
        .then(response =>
        {
            clearTimeout(timeout);
            return response.text();
        })
        .then(result =>
        {
            let xml = new DOMParser().parseFromString(result, 'text/html');
            if(!xml.querySelector('.lfsettingsContentWrapper')) return;

            this.ogl._empire.getLFBonuses(xml);
            this.ogl.db.lastLFBonusUpdate = Date.now();

            if(callback) callback();
        })
        .catch(error =>
        {
            console.error(`Can't fetch LF data`);
        });
    }

    async fetchProductionQueue(callback, ignoreDelay)
    {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 600_000);

        this.ogl.db.lastProductionQueueUpdate = this.ogl.db.lastProductionQueueUpdate || 0;
        if(!ignoreDelay && Date.now() < this.ogl.db.lastProductionQueueUpdate + 10000) return;  // 10sec

        return fetch(`${window.location.href.split('?')[0]}?page=ajax&component=productionqueue&ajax=1`,
        {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            signal: controller.signal
        })
        .then(response =>
        {
            clearTimeout(timeout);
            return response.text();
        })
        .then(result =>
        {
            const xml = new DOMParser().parseFromString(result, 'text/html');
            const hasResearch = xml.querySelector(`.research time`);

            Object.values(this.ogl._dom.planet).forEach(planet =>
            {
                const id = planet._ogl.id;

                const times =
                {
                    baseBuilding:xml.querySelector(`time.building${id}`),
                    //baseResearch:xml.querySelector(`time.research${id}`),
                    ship:xml.querySelector(`time.ship${id}`),
                    lfBuilding:xml.querySelector(`time.lfbuilding${id}`),
                    lfResearch:xml.querySelector(`time.lfresearch${id}`),
                    mechaShip:xml.querySelector(`time.ship_2nd${id}`),
                }

                this.ogl.db.myPlanets[id].upgrades = this.ogl.db.myPlanets[id].upgrades || {}

                for(let [key] of Object.entries(times))
                {
                    if(times[key])
                    {
                        const level = times[key].closest('.productionDetails')?.querySelector('.productionLevel')?.innerText?.replace(/\D/g,'') || '0'; // 0 for ships/defs
                        const entry = {};
                        entry.name = times[key].closest('.productionDetails').querySelector('.productionName').childNodes[0].textContent.trim();

                        const entryID = Object.entries(this.ogl.db.serverData || {}).find(e => e[1] == entry.name);
                        entry.id = entryID ? parseInt(entryID[0]) : -1;
                        entry.lvl = parseInt(level);
                        entry.end = parseInt(times[key].getAttribute('data-end')) * 1000;
                        entry.type = key;

                        this.ogl.db.myPlanets[id].upgrades[key] = [entry];
                    }
                    else
                    {
                        this.ogl.db.myPlanets[id].upgrades[key] = [];
                    }

                    if(!hasResearch)
                    {
                        delete this.ogl.db.myPlanets[id].upgrades.baseResearch;
                    }
                }
            });

            this.ogl._topbar.checkUpgrade();
            this.ogl.db.lastProductionQueueUpdate = Date.now();

            if(callback) callback();
        })
        .catch(error =>
        {
            console.error(`Can't fetch production queue data`);
        });
    }

    async fetchStatus(callback, ignoreDelay)
    {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 600_000);

        this.ogl.db.lastStatusUpdate = this.ogl.db.lastStatusUpdate || 0;
        if(!ignoreDelay && serverTime.getTime() < this.ogl.db.lastStatusUpdate + 1000 * 4000) return; // 1h+

        const getMainStatus = status =>
        {
            if(status.indexOf('v') > -1) status = 'v';
            else if(status.indexOf('I') > -1) status = 'I';
            else if(status.indexOf('i') > -1) status = 'i';
            else if(status.indexOf('o') > -1) status = 'o';
            else if(status.indexOf('b') > -1) status = 'b';
            else status = 'n';

            return status;
        }

        return fetch(`https://bridge.hibot.fr/bridge?url=https://${universeUrl}/api/players.xml`,
        {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            signal: controller.signal
        })
        .then(response =>
        {
            clearTimeout(timeout);
            return response.text();
        })
        .then(result =>
        {
            const xml = new DOMParser().parseFromString(result, 'text/xml');
            const apiTime = parseInt(xml.querySelector('players').getAttribute('timestamp')) * 1000;

            xml.querySelectorAll('player').forEach(entry =>
            {
                const id = parseInt(entry.getAttribute('id'));
                const name = entry.getAttribute('name');
                const status = entry.getAttribute('status') || 'n';

                const player = this.ogl.db.udb[id];

                if(player && apiTime > (player.liveUpdate || 0))
                {
                    const newStatus = getMainStatus(status);

                    player.name = name;

                    if(player?.status != 'HONORABLE' || newStatus != 'n') player.status = newStatus;
                }
            });

            this.ogl.db.lastStatusUpdate = Date.now();
        });
    }

    fetchPlayerAPI(id, name, afterAjax)
    {
        if(!id) return;

        const player = this.ogl.db.udb[id] || this.ogl.createPlayer(id);
        player.uid = player.uid || id;
        player.api = player.api || 0;
        player.planets = player.planets || [];
        player.name = name || player.name;

        if(serverTime.getTime() - player.api > this.apiCooldown)
        {
            this.pending.push(
            {
                url:`https://bridge.hibot.fr/bridge?url=https://${universeUrl}/api/playerData.xml?id=${player.uid}`,
                callback:data =>
                {
                    const xml = new DOMParser().parseFromString(data, 'text/html');
                    if(!xml.querySelector('playerdata'))
                    {
                        if(this.ogl.db.currentSide == player.uid)
                        {
                            delete this.ogl.db.udb[id];

                            const container = Util.addDom('div');
                            Util.addDom('div', { parent:container, class:'material-icons ogl_back', child:'arrow_back', onclick:() => { this.ogl._topbar.openPinned() } });
                            Util.addDom('div', { parent:container, child:data });
                            this.ogl._ui.openSide(container, player.uid);
                        }

                        return;
                    }

                    const apiTime = parseInt(xml.querySelector('playerdata').getAttribute('timestamp')) * 1000;
    
                    if(!player.name) player.name = xml.querySelector('playerdata').getAttribute('name');
                    player.score = player.score || {};

                    // score
                    player.score.global = Math.floor(xml.querySelector('positions position[type="0"]').getAttribute('score'));
                    player.score.economy = Math.floor(xml.querySelector('positions position[type="1"]').getAttribute('score'));
                    player.score.research = Math.floor(xml.querySelector('positions position[type="2"]').getAttribute('score'));
                    player.score.lifeform = Math.floor(xml.querySelector('positions position[type="8"]').getAttribute('score'));
                    player.score.military = Math.floor(xml.querySelector('positions position[type="3"]').getAttribute('score'));

                    // ranking
                    player.score.globalRanking = Math.floor(xml.querySelector('positions position[type="0"]').innerText);
                    player.score.economyRanking = Math.floor(xml.querySelector('positions position[type="1"]').innerText);
                    player.score.researchRanking = Math.floor(xml.querySelector('positions position[type="2"]').innerText);
                    player.score.lifeformRanking = Math.floor(xml.querySelector('positions position[type="8"]').innerText);
                    player.score.militaryRanking = Math.floor(xml.querySelector('positions position[type="3"]').innerText);

                    player.api = apiTime;

                    xml.querySelectorAll('planet').forEach((element, index) =>
                    {
                        const pid = element.getAttribute('id');
                        const coords = element.getAttribute('coords');
                        const moon = element.querySelector('moon')?.getAttribute('id');

                        this.ogl.db.pdb[coords] = this.ogl.db.pdb[coords] || {};
                        const planet = this.ogl.db.pdb[coords];
                        planet.api = planet.api || 0;

                        if(planet.api <= apiTime)
                        {
                            planet.uid = player.uid;
                            planet.pid = pid;
                            planet.mid = moon;
                            planet.coo = coords;
                            planet.api = apiTime;
                            if(index == 0) planet.home = true;
                        }
        
                        if(player.planets.indexOf(coords) < 0) player.planets.push(coords);
                    });

                    // clear old planets
                    player.planets.forEach((coords, index) =>
                    {
                        if(this.ogl.db.pdb[coords]?.api < apiTime)
                        {
                            player.planets.splice(index, 1);
                            if(this.ogl.db.pdb[coords].uid == player.uid) delete this.ogl.db.pdb[coords];
                        }
                    });

                    if(afterAjax) afterAjax();
                }
            });
        }
        else // no api request required
        {
            if(afterAjax) afterAjax(false);
        }
    }
}

class UIManager extends Manager
{
    load(reloaded)
    {
        // build side panel
        if(!document.querySelector('.ogl_side'))
        {
            this.side = Util.addDom('div', { class:`ogl_side ${this.ogl.db.currentSide ? 'ogl_active': ''}`, parent:document.body });
        }

        if(!reloaded)
        {
            Util.addDom('li', { before:this.ogl._dom.mainClock, child:this.ogl._dom.countColonies.innerText });
            this.checkImportExport();
        }

        this.attachGlobalClickEvent(reloaded);
        this.displayResourcesRecap();
        this.groupPlanets();
    }

    openSide(dom, pin, buttonSource)
    {
        let closeBtn = Util.addDom('div', {class:'material-icons ogl_close', child:'close', onclick:() =>
        {
            this.side.classList.remove('ogl_active');
            delete this.ogl.db.currentSide;
            this.ogl._shortcut.load();
            this.ogl._shortcut.updateShortcutsPosition();
        }});

        if(buttonSource && this.ogl.db.currentSide == pin && !this.side.querySelector('.ogl_loading'))
        {
            closeBtn.click();
            return;
        }

        this.side.innerText = '';
        this.side.appendChild(closeBtn);
        this.side.appendChild(dom);
        this.side.classList.add('ogl_active');

        if(this.lastOpenedSide != pin) this.ogl._shortcut.load(); // refresh shortcuts

        this.ogl.db.currentSide = pin;
        this.lastOpenedSide = pin;
        this.ogl._shortcut.updateShortcutsPosition();
        document.querySelectorAll('.ogl_inputCheck').forEach(e => Util.formatInput(e));
        if(this.ogl._tooltip) this.ogl._tooltip.initTooltipList(this.side.querySelectorAll(getTooltipSelector()));
    }

    attachGlobalClickEvent(reloaded)
    {
        if(!reloaded)
        {
            document.addEventListener('keyup', event =>
            {
                let activeElement = document.activeElement.tagName;

                if(activeElement == 'INPUT' || activeElement == 'TEXTAREA')
                {
                    if(document.activeElement.classList.contains('ogl_inputCheck'))
                    {
                        Util.formatInput(document.activeElement);
                    }
                }
            });

            document.querySelectorAll('.planetlink, .moonlink').forEach(target =>
            {
                target.addEventListener('pointerenter', event =>
                {
                    if(!unsafeWindow.fleetDispatcher || !this.ogl._fleet?.isReady || !document.body.classList.contains('ogl_destinationPicker')) return;
                    if(fleetDispatcher.fetchTargetPlayerDataTimeout) return;

                    //fleetDispatcher.realTarget = JSON.parse(JSON.stringify(fleetDispatcher.targetPlanet));

                    const coords = event.target.closest('.smallplanet').querySelector('.planet-koords').innerText.split(':');
                    const type = event.target.classList.contains('moonlink') ? 3 : 1;
                    const name = type == 3 ? event.target.querySelector('.icon-moon').getAttribute('alt') : event.target.querySelector('.planetPic').getAttribute('alt');

                    document.querySelector('#galaxy').value = fleetDispatcher.targetPlanet.galaxy;
                    document.querySelector('#system').value = fleetDispatcher.targetPlanet.system;
                    document.querySelector('#position').value = fleetDispatcher.targetPlanet.position;

                    fleetDispatcher.targetPlanet.type = type;
                    fleetDispatcher.targetPlanet.galaxy = coords[0];
                    fleetDispatcher.targetPlanet.system = coords[1];
                    fleetDispatcher.targetPlanet.position = coords[2];
                    fleetDispatcher.targetPlanet.name = name;
                    fleetDispatcher.refresh();
                });

                target.addEventListener('pointerleave', () =>
                {
                    if(/Android|iPhone/i.test(navigator.userAgent)) return;
                    if(!unsafeWindow.fleetDispatcher || !this.ogl._fleet?.isReady || !document.body.classList.contains('ogl_destinationPicker')) return;

                    document.querySelector('#galaxy').value = fleetDispatcher.realTarget.galaxy;
                    document.querySelector('#system').value = fleetDispatcher.realTarget.system;
                    document.querySelector('#position').value = fleetDispatcher.realTarget.position;

                    fleetDispatcher.targetPlanet.galaxy = fleetDispatcher.realTarget.galaxy;
                    fleetDispatcher.targetPlanet.system = fleetDispatcher.realTarget.system;
                    fleetDispatcher.targetPlanet.position = fleetDispatcher.realTarget.position;
                    fleetDispatcher.targetPlanet.type = fleetDispatcher.realTarget.type;
                    fleetDispatcher.targetPlanet.name = fleetDispatcher.realTarget.name;
                    fleetDispatcher.refresh();
                });
            });

            document.addEventListener('click', async event =>
            {
                if(event.target.tagName == 'svg' || event.target.tagName == 'path') return;
                
                if(event.target.getAttribute('data-galaxy'))
                {
                    let coords = event.target.getAttribute('data-galaxy').split(':');

                    if(this.ogl.page === 'galaxy')
                    {
                        galaxy = coords[0];
                        system = coords[1];
                        loadContentNew(galaxy, system);
                    }
                    else
                    {
                        const url = `${window.location.href.split('?')[0]}?page=ingame&component=galaxy&galaxy=${coords[0]}&system=${coords[1]}`;
                        if(event.ctrlKey) window.open(url, '_blank');
                        else window.location.href = url;
                    }
                }

                if(event.target.classList.contains('planetlink') || event.target.classList.contains('moonlink')
                || event.target.closest('.planetlink, .moonlink'))
                {
                    if(document.body.classList.contains('ogl_destinationPicker'))
                    {
                        event.preventDefault();

                        const coords = event.target.closest('.smallplanet').querySelector('.planet-koords').innerText.split(':');
                        const type = event.target.closest('.planetlink, .moonlink').classList.contains('moonlink') ? 3 : 1;
                        const name = type == 3 ? event.target.closest('.smallplanet').querySelector('.icon-moon').getAttribute('alt') : event.target.closest('.smallplanet').querySelector('.planetPic').getAttribute('alt');
                        const planet = this.ogl.account.planets.getByCoords(coords.join(':'));
                        
                        const id = type == 3 ? planet.moonID : planet.id;

                        if(document.body.classList.contains('ogl_initHarvest'))
                        {
                            const firstSource = this.ogl.account.planets.getCurrent();
                            const firstSourceId = firstSource.currentType == 'moon' ? firstSource.moonID : firstSource.id;

                            window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=${type}&oglmode=1&ogldestinationid=${id}&oglfirstsourceid=${firstSourceId}&ogldestinationtype=${type == 3 ? 'moon' : 'planet'}`;
                        }
                        else
                        {
                            if(!unsafeWindow.fleetDispatcher || !this.ogl._fleet?.isReady) return;
                        
                            fleetDispatcher.targetPlanet.type = type;
                            fleetDispatcher.targetPlanet.galaxy = coords[0];
                            fleetDispatcher.targetPlanet.system = coords[1];
                            fleetDispatcher.targetPlanet.position = coords[2];
                            fleetDispatcher.targetPlanet.name = name;
                            fleetDispatcher.refresh();

                            this.ogl._fleet.setRealTarget(JSON.parse(JSON.stringify(fleetDispatcher.targetPlanet)));

                            if(fleetDispatcher.currentPage == 'fleet1')
                            {
                                fleetDispatcher.focusSubmitFleet1();
                            }
                            else if(fleetDispatcher.currentPage == 'fleet2')
                            {
                                fleetDispatcher.focusSendFleet();
                                fleetDispatcher.updateTarget();
                            }
                        }
                    }
                }

                if(event.target.getAttribute('data-api-code')) // copy api code
                {
                    GM_setClipboard(event.target.getAttribute('data-api-code'), 'text');
                    fadeBox('API code copied');
                }

                if(event.target.classList.contains('js_actionKillAll')) // clear ogl reports cache
                {
                    if(ogame?.messages?.getCurrentMessageTab() == 20)
                    {
                        ogl.cache.reports = {};
                    }
                }
            });
        }
    }

    openFleetProfile()
    {
        const inputKeys = ['metal', 'crystal', 'deut', 'food', 'space', ...this.ogl.shipsList];
        const container = Util.addDom('div', { class:'ogl_limiterSettings' });
        Util.addDom('h2', { child:'Limiters settings', parent:container });
        const grid = Util.addDom('div', { class:'ogl_grid', parent:container });
        const dataKey = { planet:'data', moon:'moonData', jumpgate:'jumpgateData' };
        const iconKey = { planet:'planet', moon:'bedtime', jumpgate:'door_back' };

        ['', 'planet', 'moon', 'jumpgate'].forEach(type =>
        {
            const column = Util.addDom('div', { class:'ogl_limiterColumn', parent:grid });
            const header = Util.addDom('div', { class:'ogl_header', parent:column, child:`<div><i class="material-icons">${iconKey[type] || ''}</i> ${type}</div>` });
            const action = Util.addDom('div', { class:'ogl_limiterColumnAction', parent:header });

            if(type !== '')
            {
                ['planet', 'moon', 'jumpgate'].forEach(syncFrom =>
                {
                    const btn = Util.addDom('div', { parent:action, class:'ogl_syncLimiter ogl_button tooltip', title:`Same as ${syncFrom}`, child:`<i class="material-icons">${iconKey[syncFrom]}</i>`, onclick:() =>
                    {
                        this.ogl.db.fleetLimiter[dataKey[type]] = JSON.parse(JSON.stringify(this.ogl.db.fleetLimiter[dataKey[syncFrom]]));
                        
                        // clear jumpgate resources
                        delete this.ogl.db.fleetLimiter[dataKey['jumpgate']].metal;
                        delete this.ogl.db.fleetLimiter[dataKey['jumpgate']].crystal;
                        delete this.ogl.db.fleetLimiter[dataKey['jumpgate']].deut;
                        delete this.ogl.db.fleetLimiter[dataKey['jumpgate']].food;

                        this.ogl._fleet.updateLimiter();
                        this.ogl._jumpgate.updateLimiter();
    
                        Util.runAsync(() => this.openFleetProfile()).then(e => this.ogl._popup.open(e));
                    }});

                    if(type === syncFrom) btn.classList.add('ogl_disabled');
                });
            }

            inputKeys.forEach(key =>
            {
                if(key == 'space')
                {
                    Util.addDom('br', { parent:column });
                }
                else
                {
                    if(type == '')
                    {
                        Util.addDom('div', { class:`ogl_icon ogl_${key}`, parent:column });
                    }
                    else
                    {
                        const input = Util.addDom('input', { class:`ogl_inputCheck ogl_inputField ogl_${key}`, parent:column, value:this.ogl.db.fleetLimiter?.[dataKey[type]]?.[key] || 0, oninput:() =>
                        {
                            setTimeout(() =>
                            {
                                this.ogl.db.fleetLimiter[dataKey[type]][key] = parseInt(input.value.replace(/\D/g, '')) || 0;
                                if(type == 'moon') this.ogl._fleet.updateLimiter();
                                else if(type == 'jumpgate') this.ogl._jumpgate.updateLimiter();
                            }, 200);
                        }});

                        if(type == 'jumpgate' && (key == 'metal' || key == 'crystal' || key == 'deut' || key == 'food'))
                        {
                            input.classList.add('ogl_disabled');
                            input.value = 0;
                        }

                        Util.formatInput(input);
                    }
                }
            });
        });

        return container;
    }

    openKeyboardActions()
    {
        const container = Util.addDom('div', {class:'ogl_keyboardActions'});
        const changes = {};

        Util.addDom('h2', { parent:container, child:this.ogl._lang.find('keyboardActions') });

        Object.entries(this.ogl.db.options.keyboardActions).forEach(key =>
        {
            const label = Util.addDom('label', { parent:container, child:`${this.ogl._lang.find(key[0])}` });
            const input = Util.addDom('input', { maxlength:'1', type:'text', value:key[1], parent:label,
            onclick:() =>
            {
                input.value = '';
                input.select();
            },
            onblur:() =>
            {
                if(input.value == '') input.value = key[1];
            },
            onkeyup:event =>
            {
                if(event.key.toLowerCase() == 'enter') return;

                changes[key[0]] = event.key.toLowerCase();
                input.value = event.key.toLowerCase();
                //changes[key[0]] = input.value;
            }});


            if(key[0] == 'fleetResourcesSplit')
            {
                input.classList.add('ogl_disabled');
                input.disabled = true;
            }
        });

        Util.addDom('button', { parent:container, class:'ogl_button', child:'save', onclick:() =>
        {
            Object.entries(changes).forEach(key =>
            {
                this.ogl.db.options.keyboardActions[key[0]] = changes[key[0]];
                window.location.reload();
            });
        }});

        return container;
    }

    openExpeditionFiller()
    {
        const container = Util.addDom('div', {class:'ogl_expeditionFiller'});

        Util.addDom('h2', { parent:container, child:this.ogl._lang.find('expeditionBigShips') });

        [204, 205, 206, 207, 215, 211, 213, 218].forEach(shipID =>
        {
            const item = Util.addDom('div', { class:`ogl_icon ogl_${shipID}`, parent:container, onclick:() =>
            {
                if(this.ogl.db.options.expeditionBigShips.indexOf(shipID) > -1)
                {
                    this.ogl.db.options.expeditionBigShips = this.ogl.db.options.expeditionBigShips.filter(a => a !== shipID);
                    item.classList.remove('ogl_active');
                }
                else
                {
                    this.ogl.db.options.expeditionBigShips.push(shipID);
                    item.classList.add('ogl_active');
                }
            }});

            if(this.ogl.db.options.expeditionBigShips.indexOf(shipID) > -1) item.classList.add('ogl_active');
        });

        return container;
    }

    openDataManager()
    {
        const container = Util.addDom('div', {class:'ogl_manageData'});
        Util.addDom('h2', { parent:container, child:this.ogl._lang.find('manageData') });
        
        const grid = Util.addDom('div', { class:'ogl_grid', parent:container });

        // import data
        Util.addDom('label', { class:'ogl_button', for:'ogl_import', child:'<i class="material-icons">file_open</i>Import all data', parent:grid, onclick:() => this.lastImportButton = 'all' });
        Util.addDom('label', { class:'ogl_button', for:'ogl_import', child:'<i class="material-icons">monitoring</i>Import stats', parent:grid, onclick:() => this.lastImportButton = 'stats' });
        Util.addDom('input', { id:'ogl_import', class:'ogl_hidden', accept:"application/JSON", type:'file', parent:grid, onchange:e =>
        {
            setTimeout(() => this.ogl.importData(e.target, this.lastImportButton), 200);
        }});

        // export
        Util.addDom('a', { class:'ogl_button', download:`oglight_${this.ogl.server.name}_${this.ogl.server.lang}_${serverTime.getTime()}`, child:'<i class="material-icons">file_export</i>Export data', parent:grid, href:URL.createObjectURL(new Blob([JSON.stringify(this.ogl.db)], {type: 'application/json'})) });

        const dangerZone = Util.addDom('fieldset', { class:'ogl_grid ogl_dangerZone', parent:grid, child:'<legend>Danger zone</legend>' });

        // stats
        Util.addDom('div', { class:'ogl_button', child:'<i class="material-icons">monitoring</i>' + this.ogl._lang.find('resetStats'), parent:dangerZone, onclick:() =>
        {
            if(confirm(this.ogl._lang.find('resetStatsLong')))
            {
                this.ogl.cache.raids = {};
                this.ogl.db.stats = {};
                window.location.reload();
                this.ogl.db.initialTime = Date.now();
            }
        }});

        // tagged
        Util.addDom('div', { class:'ogl_button', child:'<i class="material-icons">stroke_full</i>' + this.ogl._lang.find('resetTaggedPlanets'), parent:dangerZone, onclick:() =>
        {
            if(confirm(this.ogl._lang.find('resetTaggedPlanetsLong')))
            {
                this.ogl.db.tdb = {};
                this.ogl.db.quickRaidList = [];
                window.location.reload();
            }
        }});

        // pinned
        Util.addDom('div', { class:'ogl_button', child:'<i class="material-icons">keep</i>' + this.ogl._lang.find('resetPinnedPlayers'), parent:dangerZone, onclick:() =>
        {
            if(confirm(this.ogl._lang.find('resetPinnedPlayersLong')))
            {
                this.ogl.db.lastStatusUpdate = 0;
                this.ogl.db.lastGlobalScoreUpdate = 0;

                this.ogl.db.pdb = {};
                this.ogl.db.udb = {};
                this.ogl.db.lastPinnedList = [];
                this.ogl.db.quickRaidList = [];
                window.location.reload();
            }
        }});

        // all
        Util.addDom('div', { class:'ogl_button', child:'<i class="material-icons">database</i>' + this.ogl._lang.find('resetAll'), parent:dangerZone, onclick:() =>
        {
            if(confirm(this.ogl._lang.find('resetAllLong')))
            {
                this.ogl.cache = {};
                this.ogl.db = {};
                window.location.reload();
                this.ogl.db.initialTime = Date.now();
            }
        }});

        return container;
    }

    groupPlanets()
    {
        let lastCoords = 0;
        let group = 1;

        document.querySelectorAll('.smallplanet').forEach(planet =>
        {
            let newCoords = Util.coordsToID(planet.querySelector('.planet-koords').innerText).slice(0, -3);
            if(lastCoords === newCoords) planet.setAttribute('data-group', group);
            else if(planet.previousElementSibling?.getAttribute('data-group')) group++;
            lastCoords = newCoords;
        });
    }

    checkImportExport()
    {
        if((this.ogl.db.nextImportExport || 0) < serverTime.getTime())
        {
            document.querySelector('.menubutton[href*=traderOverview]').classList.add('ogl_active');
        }

        window.addEventListener('beforeunload', () =>
        {
            let textTarget = document.querySelector('.bargain_text');
            let button = document.querySelector('.import_bargain.hidden');

            if(textTarget && button)
            {
                let today = new Date(serverTime.getTime());
                let tomorow = new Date(serverTime.getTime() + 86400000);

                if(textTarget.innerText.match(/\d+/g))
                {
                    this.ogl.db.nextImportExport = new Date(today.getFullYear(), today.getMonth(), today.getDate(), textTarget.innerText.match(/\d+/g)[0], 0, 0).getTime();
                }
                else
                {
                    this.ogl.db.nextImportExport = new Date(tomorow.getFullYear(), tomorow.getMonth(), tomorow.getDate(), 0, 0, 1).getTime();
                }

                this.ogl.save();
            }
            else if(textTarget && textTarget.innerText == '')
            {
                this.ogl.db.nextImportExport = serverTime.getTime();
                this.ogl.save();
            }
        });
    }

    turnIntoPlayerLink(id, dom, name, status)
    {
        if(!dom.closest('.ogl_spyLine'))
        {
            dom.setAttribute('title', 'loading...');
            dom.classList.add('tooltipUpdate');
            dom.classList.add('tooltipRight');
            dom.classList.add('tooltipClose');
        }

        if(status || this.ogl.db.udb?.[id]?.status)
        {
            dom.className = dom.className.replaceAll(/status_abbr_[a-zA-Z]+/g, '');
            const playerStatus = status || this.ogl.db.udb?.[id]?.status || 'n';

            const statusObj = this.ogl.playerStatus.find(e => e.defaultTag == playerStatus);
            if(statusObj.serverTag != 'HONORABLE') dom.setAttribute('data-status-tag', statusObj.serverTag);
            dom.classList.add(statusObj.class);
        }
    
        dom.addEventListener('click', event =>
        {
            if(!dom.closest('.ogl_spyLine'))
            {
                if(id == this.ogl.account.id || event.ctrlKey) return;
                event.preventDefault();
                this.ogl._topbar.openPinnedDetail(id);
            }
        });

        dom.addEventListener('tooltip', () =>
        {
            const loading = Util.addDom('div', { child:'<div class="ogl_loading"></div>' });

            dom._tippy.setContent(loading);

            this.ogl._fetch.fetchPlayerAPI(id, name, () =>
            {
                setTimeout(() =>
                {
                    dom._tippy.setContent(this.getPlayerTooltip(id));
    
                    if(document.querySelector('.ogl_pinDetail') && this.ogl.db.currentSide == id) // current pin
                    {
                        this.ogl._topbar.openPinnedDetail(id);
                    }
                }, 100);
            });
        });
    }

    getPlayerTooltip(id)
    {
        const player = this.ogl.db.udb[id];
        const page = Math.ceil(player.score.globalRanking / 100);
        const status = this.ogl.playerStatus.find(e => e.defaultTag == player.status)?.class || 'status_abbr_active';
        const container = Util.addDom('div',
        {
            class:'ogl_playerData' ,
            child:`
            <h1 class="${status}">${player.name} <a href="${window.location.href.split('?')[0]}?page=highscore&site=${page}&searchRelId=${id}">#${player.score.globalRanking}</a></h1>
            <div class="ogl_grid">
                <div class="ogl_tagSelector material-icons"></div>
                <div class="ogl_leftSide">
                    <div class="ogl_actions"></div>
                    <div class="ogl_score">
                        <div class="ogl_line"><i class="material-icons">crown</i><div>${Util.formatNumber(player.score.global)}</div></div>
                        <div class="ogl_line"><i class="material-icons">diamond</i><div>${Util.formatNumber(player.score.economy)}</div></div>
                        <div class="ogl_line"><i class="material-icons">science</i><div>${Util.formatNumber(player.score.research)}</div></div>
                        <div class="ogl_line"><i class="material-icons">genetics</i><div>${Util.formatNumber(player.score.lifeform)}</div></div>
                        <div class="ogl_line"><i class="material-icons">rocket_launch</i><div>${Util.formatNumber(Util.getPlayerScoreFD(player.score, 'fleet'))}</div></div>
                        <div class="ogl_line"><i class="material-icons">security</i><div>${Util.formatNumber(Util.getPlayerScoreFD(player.score, 'defense'))}</div></div>
                        <div class="ogl_line"><i class="material-icons">schedule</i><div>${new Date(player.api).toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'})}</div></div>
                    </div>
                </div>
                <div class="ogl_planetStalk"></div>
            </div>`
        });

        // write
        const writeIcon = Util.addDom('div', { child:'edit', class:'material-icons ogl_button', parent:container.querySelector('.ogl_actions'), onclick:() =>
        {
            if(!this.ogl.account.chatEnabled)
            {
                window.location.href = `${window.location.href.split('?')[0]}?page=chat&playerId=${player.uid}`;
            }
        }});

        if(this.ogl.account.chatEnabled)
        {
            writeIcon.classList.add('js_openChat');
            writeIcon.setAttribute('data-playerId', player.uid);
        }

        // buddy
        Util.addDom('a', { child:'person_add', class:'material-icons ogl_button overlay', parent:container.querySelector('.ogl_actions'), href:`${window.location.href.split('?')[0]}?page=ingame&component=buddies&action=7&id=${player.uid}&ajax=1`, onclick:() =>
        {
            tippy.hideAll();
        }});
        
        // ignore
        Util.addDom('div', { child:'block', class:'material-icons ogl_button', parent:container.querySelector('.ogl_actions'), onclick:() =>
        {
            window.location.href = `${window.location.href.split('?')[0]}?page=ignorelist&action=1&id=${player.uid}`;
        }});

        // mmorpgstat
        Util.addDom('div', { child:'query_stats', class:'material-icons ogl_button', parent:container.querySelector('.ogl_actions'), onclick:() =>
        {
            window.open(Util.genMmorpgstatLink(this.ogl, player.uid), '_blank');
        }});

        if(id != this.ogl.account.id)
        {
            // pin to right
            Util.addDom('div', { child:'arrow_forward', class:'material-icons ogl_button', parent:container.querySelector('.ogl_actions'), onclick:() =>
            {
                this.ogl._topbar.openPinnedDetail(player.uid);
            }});
        }

        const planetList = container.querySelector('.ogl_planetStalk');

        let lastCoords = 0;
        let group = 1;

        player.planets.sort((a, b) => Util.coordsToID(a) - Util.coordsToID(b)).forEach((planet, index) =>
        {
            let coords = planet.split(':');

            let div = Util.addDom('div',
            {
                parent:planetList,
                child:`<div>${index+1}</div><div data-galaxy="${coords[0]}:${coords[1]}">${planet}</div>`
            });

            let newCoords = Util.coordsToID(coords).slice(0, -3);
            if(lastCoords === newCoords) div.setAttribute('data-group', group);
            else if(div.previousElementSibling?.getAttribute('data-group')) group++;
            lastCoords = newCoords;

            if(this.ogl.db.pdb[planet]?.home) div.classList.add('ogl_home');

            if(unsafeWindow['galaxy'] == coords[0] && unsafeWindow['system'] == coords[1]) div.querySelector('[data-galaxy]').classList.add('ogl_active');

            this.addSpyIcons(div, coords);
            this.addTagButton(div, coords, true);
        });

        if(player.uid != this.ogl.account.id)
        {
            const tagSelector = container.querySelector('.ogl_tagSelector');

            Object.keys(this.ogl.db.tags).forEach(tag =>
            {
                Util.addDom('div', { parent:tagSelector, 'data-tag':tag, onclick:() =>
                {
                    player.planets.forEach(planet =>
                    {
                        let raw = Util.coordsToID(planet.split(':'));

                        if(tag != 'none')
                        {
                            this.ogl.db.tdb[raw] = { tag:tag };
                            document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.setAttribute('data-tag', tag));
                        }
                        else if(this.ogl.db.tdb[raw])
                        {
                            delete this.ogl.db.tdb[raw];
                            document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.removeAttribute('data-tag'));
                        }
                    });
                }});
            });
        }

        return container;
    }

    addPinButton(element, id)
    {
        const player = this.ogl.db.udb[id];

        const div = Util.addDom('div', { title:'loading...', class:'ogl_flagPicker material-icons tooltipLeft tooltipClick tooltipClose tooltipUpdate', 'data-uid':id, parent:element, ontooltip:event =>
        {
            div._tippy.setContent(tooltip);
        }, onclick:event =>
        {
            if(event.shiftKey)
            {
                event.preventDefault();
                if(this.ogl.db.lastPinUsed == 'none' && this.ogl.db.udb[id])
                {
                    delete this.ogl.db.udb[id].pin;
                    document.querySelectorAll(`.ogl_flagPicker[data-uid="${id}"]`).forEach(e =>
                    {
                        e.removeAttribute('data-flag');
                        e.innerText = '';
                    });
                }
                else
                {
                    this.ogl.db.udb[id] = this.ogl.db.udb[id] || this.ogl.createPlayer(id);
                    this.ogl.db.udb[id].pin = this.ogl.db.lastPinUsed;
                    document.querySelectorAll(`.ogl_flagPicker[data-uid="${id}"]`).forEach(e =>
                    {
                        e.setAttribute('data-flag', this.ogl.db.lastPinUsed);
                    });
                }
            }
        }});

        const tooltip = Util.addDom('div', { class:'ogl_flagSelector material-icons' });
        this.ogl.flagsList.forEach(pin =>
        {
            if(pin == 'ptre' && !this.ogl.ptreKey) return;

            const icon = Util.addDom('div', { 'data-flag':pin, parent:tooltip, onclick:() =>
            {
                if(pin == 'none' && this.ogl.db.udb[id])
                {
                    delete this.ogl.db.udb[id].pin;
                    document.querySelectorAll(`.ogl_flagPicker[data-uid="${id}"]`).forEach(e =>
                    {
                        e.removeAttribute('data-flag');
                        e.innerText = '';
                    });
                }
                else
                {
                    this.ogl.db.udb[id] = this.ogl.db.udb[id] || this.ogl.createPlayer(id);
                    this.ogl.db.udb[id].pin = pin;
                    document.querySelectorAll(`.ogl_flagPicker[data-uid="${id}"]`).forEach(e =>
                    {
                        e.setAttribute('data-flag', pin);
                    });
                }

                this.ogl.db.lastPinUsed = pin;
                if(pin != 'none') this.ogl._topbar.openPinnedDetail(id);
                tippy.hideAll();
            }});
        });

        if(player?.pin)
        {
            div.setAttribute('data-flag', player.pin);
        }
    }

    addTagButton(element, coords, disabled)
    {
        const raw = Util.coordsToID(coords);
        const position = this.ogl.db.tdb[raw];

        const div = Util.addDom('div', { title:'loading...', class:'ogl_tagPicker material-icons tooltipLeft tooltipClick tooltipClose tooltipUpdate', 'data-raw':raw, parent:element, ontooltip:event =>
        {
            if(!disabled)
            {
                div._tippy.setContent(tooltip);
            }
        },
        onclick:event =>
        {
            if(event.shiftKey && !disabled)
            {
                if(this.ogl.db.lastTagUsed == 'none' && this.ogl.db.tdb[raw])
                {
                    delete this.ogl.db.tdb[raw];
                    document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.removeAttribute('data-tag'));
                }
                else
                {
                    this.ogl.db.tdb[raw] = this.ogl.db.tdb[raw] || {};
                    this.ogl.db.tdb[raw].tag = this.ogl.db.lastTagUsed;
                    document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.setAttribute('data-tag', this.ogl.db.lastTagUsed));
                }
            }
        }});

        const tooltip = Util.addDom('div', { class:'ogl_tagSelector material-icons' });
        Object.keys(this.ogl.db.tags).forEach(tag =>
        {
            Util.addDom('div', { 'data-tag':tag, parent:tooltip, onclick:() =>
            {
                if(tag == 'none' && this.ogl.db.tdb[raw])
                {
                    delete this.ogl.db.tdb[raw];
                    document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.removeAttribute('data-tag'));
                }
                else
                {
                    this.ogl.db.tdb[raw] = this.ogl.db.tdb[raw] || {};
                    this.ogl.db.tdb[raw].tag = tag;
                    document.querySelectorAll(`.ogl_tagPicker[data-raw="${raw}"]`).forEach(e => e.setAttribute('data-tag', tag));
                }

                this.ogl.db.lastTagUsed = tag;
                tippy.hideAll();
            }});
        });

        if(position?.tag)
        {
            div.setAttribute('data-tag', position.tag);
        }
    }

    addSpyIcons(parent, coords, uniqueType, displayActivity)
    {
        coords = typeof coords == typeof '' ? coords = coords.split(':') : coords;

        if(uniqueType == 'planet' || !uniqueType)
        {
            const planetIcon = Util.addDom('div', 
            {
                class:'material-icons ogl_spyIcon',
                'data-spy-coords':`${coords[0]}:${coords[1]}:${coords[2]}:1`, child:'language', parent:parent,
                onclick:e => window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=1`,
                //onclick:e => this.ogl._notification.addToQueue(this.ogl._lang.find('notifyNoProbe'), false, true)
            });

            const lastPlanetSpy = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.spy?.[0] || 0;
            if(serverTime.getTime() - lastPlanetSpy < this.ogl.db.options.spyIndicatorDelay)
            {
                planetIcon.setAttribute('data-spy', 'recent');
                planetIcon.setAttribute('title', 'recently spied');
            }

            if(displayActivity)
            {
                const activity = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.acti || [];
                const isRecent = serverTime.getTime() - activity[2] < 3600000;
                const activityDom = Util.addDom('span', { parent:planetIcon, child:isRecent ? activity[0] : '?' });
                (activity[0] == '*' && isRecent) ? activityDom.classList.add('ogl_danger') : (activity[0] == 60 && isRecent) ? activityDom.classList.add('ogl_ok') : activityDom.classList.add('ogl_warning');
            }

            if(Object.values(ogl.cache.movements).flat().find(e => e.to.coords == `${coords[0]}:${coords[1]}:${coords[2]}` && !e.to.isMoon && e.mission == 1 && !e.isBack))
            {
                planetIcon.classList.add('ogl_attacked');
            }
        }
        
        if(uniqueType == 'moon' || (!uniqueType && this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.mid))
        {// onclick:e => this.ogl._fleet.addToSpyQueue(6, coords[0], coords[1], coords[2], 3)
            const moonIcon = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.mid > 0 ? Util.addDom('div', 
            {
                class:'material-icons ogl_spyIcon',
                'data-spy-coords':`${coords[0]}:${coords[1]}:${coords[2]}:3`,
                child:'bedtime',
                parent:parent,
                onclick:e => window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=3`
            }) : Util.addDom('div', { parent:parent, class:'ogl_invisible' });

            const lastMoontSpy = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.spy?.[1] || 0;
            if(serverTime.getTime() - lastMoontSpy < this.ogl.db.options.spyIndicatorDelay)
            {
                moonIcon.setAttribute('data-spy', 'recent');
                moonIcon.setAttribute('title', 'recently spied');
            }

            if(displayActivity && this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.mid > -1)
            {
                const activity = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.acti || [];
                const isRecent = serverTime.getTime() - activity[2] < 3600000;
                const activityDom = Util.addDom('span', { parent:moonIcon, child:isRecent ? activity[1] : '?' });
                (activity[1] == '*' && isRecent) ? activityDom.classList.add('ogl_danger') : (activity[1] == 60 && isRecent) ? activityDom.classList.add('ogl_ok') : activityDom.classList.add('ogl_warning');
            }

            if(Object.values(ogl.cache.movements).flat().find(e => e.to.coords == `${coords[0]}:${coords[1]}:${coords[2]}` && e.to.isMoon && e.mission == 1 && !e.isBack))
            {
                moonIcon.classList.add('ogl_attacked');
            }
        }

        if(!uniqueType && ! this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.mid)
        {
            Util.addDom('div', { parent:parent });
        }
    }

    displayResourcesRecap()
    {
        const resources = {};
        resources.total = { metal:0, crystal:0, deut:0, msu:0 };
        resources.prod = { metal:0, crystal:0, deut:0, msu:0 };
        resources.fly = { metal:0, crystal:0, deut:0 };
        resources.ground = { metal:0, crystal:0, deut:0 };
        resources.todo = { metal:0, crystal:0, deut:0 };

        Object.values(this.ogl._dom.planet).forEach(planet =>
        {     
            const id = planet._ogl.id;
            const planetObj = this.ogl.db.myPlanets[id];
            if(!planetObj) return;

            ['metal', 'crystal', 'deut'].forEach(resourceName =>
            {
                resources.total[resourceName] += this.ogl.db.myPlanets[id]?.[resourceName] || 0;
                resources.ground[resourceName] += this.ogl.db.myPlanets[id]?.[resourceName] || 0;
                
                const prod = planet._ogl.type == 'planet' ? this.ogl.db.myPlanets[id]?.['prod'+resourceName] : 0;
                resources.prod[resourceName] += prod || 0;
            });

            Object.values(this.ogl.db.myPlanets[id]?.todolist || {}).forEach(entry =>
            {
                Object.values(entry || {}).forEach(todo =>
                {
                    if(!todo.cost) return;

                    resources.todo.metal += todo.cost.metal;
                    resources.todo.crystal += todo.cost.crystal;
                    resources.todo.deut += todo.cost.deut;
                });
            });
        });

        Object.entries(this.ogl.cache?.movements || {}).forEach(entry =>
        {
            entry[1].forEach(line =>
            {
                ['metal', 'crystal', 'deut'].forEach(resourceName =>
                {
                    resources.total[resourceName] += line[resourceName] || 0;
                    resources.fly[resourceName] += line[resourceName] || 0;
                });
            });
        });

        const msuValue = this.ogl.db.options.msu;
        resources.total.msu = Util.getMSU(resources.total.metal, resources.total.crystal, resources.total.deut, msuValue);

        resources.prod.metal = Math.round((resources.prod.metal || 0) * 3600 * 24);
        resources.prod.crystal = Math.round((resources.prod.crystal || 0) * 3600 * 24);
        resources.prod.deut = Math.round((resources.prod.deut || 0) * 3600 * 24);
        resources.prod.msu = Util.getMSU(resources.prod.metal, resources.prod.crystal, resources.prod.deut, msuValue);

        this.ogl._dom.updateRecap(resources);

        if(!this.recapReady)
        {
            this.recapReady = true;
    
            this.ogl._dom.recap.addEventListener('click', () =>
            {
                const container = Util.addDom('div', { class:'ogl_resourcesDetail' });
    
                container.innerHTML =
                `
                    <div>
                        <div class="ogl_group">
                            <h3 class="material-icons">handyman</h3>
                            <h4>Construction</h4>
                        </div>
                        <div class="ogl_metal">+${Util.formatToUnits(resources.prod.metal)}</div>
                        <div class="ogl_crystal">+${Util.formatToUnits(resources.prod.crystal)}</div>
                        <div class="ogl_deut">+${Util.formatToUnits(resources.prod.deut)}</div>
                    </div>
                    <div>
                        <div class="ogl_group">
                            <h3 class="material-icons">lists</h3>
                            <h4>Todolist</h4>
                        </div>
                        <div class="ogl_metal ogl_todoDays">${Util.formatToUnits(resources.todo.metal)} <span>${Math.ceil(Math.max(0, resources.todo.metal - resources.total.metal) / resources.prod.metal)}${LocalizationStrings.timeunits.short.day}</span></div>
                        <div class="ogl_crystal ogl_todoDays">${Util.formatToUnits(resources.todo.crystal)} <span>${Math.ceil(Math.max(0, resources.todo.crystal - resources.total.crystal) / resources.prod.crystal)}${LocalizationStrings.timeunits.short.day}</span></div>
                        <div class="ogl_deut ogl_todoDays">${Util.formatToUnits(resources.todo.deut)} <span>${Math.ceil(Math.max(0, resources.todo.deut - resources.total.deut) / resources.prod.deut)}${LocalizationStrings.timeunits.short.day}</span></div>
                    </div>
                    <div>
                        <div class="ogl_group">
                            <h3 class="material-icons">globe_uk</h3>
                            <h4>Planet / moon</h4>
                        </div>
                        <div class="ogl_metal">${Util.formatToUnits(resources.ground.metal)}</div>
                        <div class="ogl_crystal">${Util.formatToUnits(resources.ground.crystal)}</div>
                        <div class="ogl_deut">${Util.formatToUnits(resources.ground.deut)}</div>
                    </div>
                    <div>
                        <div class="ogl_group">
                            <h3 class="material-icons">send</h3>
                            <h4>Flying</h4>
                        </div>
                        <div class="ogl_metal">${Util.formatToUnits(resources.fly.metal)}</div>
                        <div class="ogl_crystal">${Util.formatToUnits(resources.fly.crystal)}</div>
                        <div class="ogl_deut">${Util.formatToUnits(resources.fly.deut)}</div>
                    </div>
                    <div>
                        <div class="ogl_group">
                            <h3 class="material-icons">functions</h3>
                            <h4>Total</h4>
                        </div>
                        <div class="ogl_metal">${Util.formatToUnits(resources.total.metal)}</div>
                        <div class="ogl_crystal">${Util.formatToUnits(resources.total.crystal)}</div>
                        <div class="ogl_deut">${Util.formatToUnits(resources.total.deut)}</div>
                    </div>
                `;

                this.ogl._popup.open(container);
            });
        }
    }
}

class TopbarManager extends Manager
{
    load(reloaded)
    {
        this.ogl.db.lastAccountView = this.ogl.db.lastAccountView || 'summary';
        this.topbar = Util.addDom('div', {class:'ogl_topbar', prepend:document.querySelector('#planetList')});

        Util.addDom('i', {class:'material-icons tooltip', child:'conversion_path', title:this.ogl._lang.find('collectResources'),parent:this.topbar, onclick:e =>
        {
            this.ogl.db.harvestCoords = false;
            document.body.classList.toggle('ogl_destinationPicker');
            document.body.classList.toggle('ogl_initHarvest');
        }});

        Util.addDom('i', { class:'material-icons tooltip', child:'account_balance', parent:this.topbar, title:this.ogl._lang.find('accountSummary'), onclick:() =>
        {
            this.ogl._account.openSummary(true);
        }});

        //Util.addDom('i', { class:'material-icons tooltip', child:'clock_loader_60', parent:this.topbar, title:this.ogl._lang.find('stats'), onclick:() => this.openStats() });
        Util.addDom('i', { class:'material-icons tooltip', child:'stroke_full', parent:this.topbar, title:this.ogl._lang.find('taggedPlanets'), onclick:() => this.openTagged(true) });
        Util.addDom('i', { class:'material-icons tooltip', child:'keep', parent:this.topbar, title:this.ogl._lang.find('pinnedPlayers'), onclick:() => this.openPinned(true) });
        Util.addDom('i', { class:'material-icons tooltip', child:'settings', parent:this.topbar, title:this.ogl._lang.find('oglSettings'), onclick:() => this.openSettings(true) });

        Util.addDom('a', { parent:this.topbar, class:'material-icons tooltip', child:'favorite', title:this.ogl._lang.find('coffee'), target:'_blank', href:'http://ko-fi.com/O4O22XV69' });
        
        this.syncBtn = Util.addDom('i', {class:'material-icons tooltip', child:'directory_sync', title:this.ogl._lang.find('syncEmpire'), parent:this.topbar, onclick:() =>
        {
            this.ogl._fetch.fetchMainData(false, true);
        }});

        if(!reloaded)
        {
            if(!isNaN(this.ogl.db.currentSide)) this.openPinnedDetail(this.ogl.db.currentSide);
            else if(this.ogl.db.currentSide == 'settings') this.openSettings();
            else if(this.ogl.db.currentSide == 'pinned') this.openPinned();
            else if(this.ogl.db.currentSide == 'tagged') this.openTagged();
        }

        Util.addDom('button', { class:'ogl_button', child:this.ogl._lang.find('siblingPlanetMoon'), parent:this.topbar, onclick:() =>
        {
            window.location.href = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&oglmode=2`;
        }});
    }
    
    openCards(type)
    {
        type = type || 'planet';
        this.ogl.db.lastAccountView = type;

        const container = Util.addDom('div', { class:'ogl_empireCards', 'data-type':type });
        const icon = Util.addDom('div', { class:`ogl_empireType`, parent:container });
        const grid = Util.addDom('div', { class:'ogl_grid', parent:container });
        const lineDoms = {};
        const cumul = {};
        const typeLen = Object.values(this.ogl._dom.planet).filter(e => e._ogl.type == type)?.length || 0;

        if(Object.values(this.ogl._fetch.fetchedError).indexOf(1) >= 0)
        {
            Util.addDom('div', { class:'ogl_outdated ogl_danger tooltip', title:'Warning : fetch has failed, data may be outdated', parent:container, child:'<span class="material-icons">schedule</span>Outdated' });
        }

        Util.addDom('div', { class:`material-icons`, onclick:() => this.openAccount(), parent:icon, child:'diamond' });

        ['planet', 'moon'].forEach(typeName =>
        {
            Util.addDom('div', { class:`ogl_${typeName}Icon`, onclick:() => this.openCards(typeName), parent:icon });
        });

        lineDoms.icons = Util.addDom('div', { parent:grid, class:`ogl_icon ogl_iconsList`, child:'<div class="ogl_invisible"></div>' });
        lineDoms.planets = Util.addDom('div', { parent:grid, class:`ogl_icon ogl_coordsList`, child:'<div class="ogl_invisible"></div>' });

        ['metal', 'crystal', 'deut'].forEach(resource =>
        {
            lineDoms[resource] = Util.addDom('div', { class:`ogl_icon ogl_${resource}`, parent:grid });
        });

        [...this.ogl.shipsList, '217'].forEach(shipID =>
        {
            lineDoms[shipID] = Util.addDom('div', { class:`ogl_icon ogl_${shipID}`, parent:grid });
        });

        Object.values(this.ogl._dom.planet).filter(e => e._ogl.type == type).sort((a, b) => Util.coordsToID(a._ogl.coords) - Util.coordsToID(b._ogl.coords)).forEach((planet, index) =>
        {     
            const planetObj = this.ogl.db.myPlanets[planet._ogl.id];
            if(!planetObj) return;

            const pic = type == 'moon' ? planet.querySelector('img') : planet.querySelector('.planetPic');

            Util.addDom('img', 
            {
                parent:lineDoms.icons,
                src:pic.getAttribute('src')
            });
            if(index == typeLen-1) Util.addDom('div', { class:'ogl_empireTotal', parent:lineDoms.icons, child:typeLen });

            Util.addDom('div', { parent:lineDoms.planets, child:planetObj.coords, 'data-galaxy':planetObj.coords });
            if(index == typeLen-1) Util.addDom('div', { class:'ogl_empireTotal', parent:lineDoms.planets, child:'total' });

            ['metal', 'crystal', 'deut'].forEach(resource =>
            {
                const total = planetObj[resource] || 0;
                Util.addDom('div', { 'data-value':total, child:Util.formatToUnits(total, 0), parent:lineDoms[resource] });
                cumul[resource] = (cumul[resource] || 0) + total;

                if(index == typeLen-1)
                {
                    Util.addDom('div', { class:'ogl_empireTotal', 'data-value':cumul[resource], child:Util.formatToUnits(cumul[resource], 0), parent:lineDoms[resource] });
                }
            });

            [...this.ogl.shipsList, '217'].forEach(shipID =>
            {
                const total = planetObj[shipID] || 0;
                Util.addDom('div', { 'data-value':total, child:Util.formatToUnits(total, 0), parent:lineDoms[shipID] });
                cumul[shipID] = (cumul[shipID] || 0) + total;

                if(index == typeLen-1)
                {
                    Util.addDom('div', { class:'ogl_empireTotal', 'data-value':cumul[shipID], child:Util.formatToUnits(cumul[shipID], 0), parent:lineDoms[shipID] });
                }
            });
        });

        this.ogl._popup.open(container, true);
    }

    openAccount()
    {
        const container = Util.addDom('div', {class:'ogl_empire'});
        this.ogl.db.lastAccountView = 'summary';
        
        if(Object.values(this.ogl._fetch.fetchedError).indexOf(1) >= 0)
        {
            Util.addDom('div', { class:'ogl_outdated ogl_danger tooltip', title:'Warning : fetch has failed, data may be outdated', parent:container, child:'<span class="material-icons">schedule</span>Outdated' });
        }

        const icon = Util.addDom('div', { class:`ogl_empireType`, parent:container });
        const grid = Util.addDom('div', { class:'ogl_grid', parent:container });

        Util.addDom('div', { class:`material-icons`, onclick:() => this.openAccount(), parent:icon, child:'diamond' });

        ['planet', 'moon'].forEach(typeName =>
        {
            Util.addDom('div', { class:`ogl_${typeName}Icon`, onclick:() => this.openCards(typeName), parent:icon });
        });

        const count = document.querySelectorAll('.smallplanet').length;
        const stack = {};
        stack.fieldUsed = 0;
        stack.fieldMax = 0;
        stack.fieldLeft = 0;
        stack.temperature = 0;
        stack.metal = 0;
        stack.crystal = 0;
        stack.deut = 0;
        stack.prodmetal = 0;
        stack.prodcrystal = 0;
        stack.proddeut = 0;

        // top
        Util.addDom('div', {class:'ogl_invisible', parent:grid});
        Util.addDom('div', {class:'ogl_invisible', parent:grid});
        Util.addDom('div', {class:'ogl_invisible', parent:grid});
        Util.addDom('div', {class:'ogl_invisible', parent:grid});
        Util.addDom('div', {class:'ogl_invisible', parent:grid});
        Util.addDom('div', {class:'ogl_invisible', parent:grid});
        Util.addDom('div', {class:'ogl_invisible', parent:grid});
        Util.addDom('div', {class:'ogl_icon ogl_metal', parent:grid});
        Util.addDom('div', {class:'ogl_icon ogl_crystal', parent:grid});
        Util.addDom('div', {class:'ogl_icon ogl_deut', parent:grid});

        Util.addDom('div', {child:'Coords', parent:grid});
        Util.addDom('div', {child:'P', parent:grid});
        Util.addDom('div', {child:'M', parent:grid});
        Util.addDom('div', {child:'Name', parent:grid});
        Util.addDom('div', {child:'Fields', parent:grid});
        Util.addDom('div', {child:'T°c', parent:grid});
        Util.addDom('div', {child:'LF', parent:grid});

        let metalStack = Util.addDom('div',
        {
            class:'ogl_metal',
            parent:grid
        });

        let crystalStack = Util.addDom('div',
        {
            class:'ogl_crystal',
            parent:grid
        });

        let deutStack = Util.addDom('div',
        {
            class:'ogl_deut',
            parent:grid
        });

        document.querySelectorAll('.smallplanet').forEach(line =>
        {
            const id = line.getAttribute('id').replace('planet-', '');
            const planet = this.ogl.db.myPlanets[id];
            const moon = this.ogl.db.myPlanets[planet.moonID];
            const name = line.querySelector('.planet-name').innerText;

            // coords
            let coordDiv = Util.addDom('div',
            {
                parent:grid,
                'data-galaxy':planet.coords,
                child:planet.coords
            });

            if(line.getAttribute('data-group')) coordDiv.setAttribute('data-group', line.getAttribute('data-group'));

            // planet picture
            Util.addDom('a', 
            {
                parent:grid,
                href:line.querySelector('.planetlink').getAttribute('href'),
                child:Util.addDom('img',
                {
                    src:line.querySelector('.planetPic').getAttribute('src')
                })
            });

            // moon picture
            if(line.querySelector('.moonlink'))
            {
                Util.addDom('a', 
                {
                    parent:grid,
                    href:line.querySelector('.moonlink').getAttribute('href'),
                    child:Util.addDom('img',
                    {
                        src:line.querySelector('.moonlink img').getAttribute('src')
                    })
                });
            }
            else
            {
                Util.addDom('div', { class:'ogl_invisible', parent:grid });
            }

            // planet name
            Util.addDom('div',
            {
                parent:grid,
                child:name
            });

            // planet fields
            Util.addDom('div',
            {
                parent:grid,
                child:`${planet.fieldUsed}/${planet.fieldMax} (<span>${planet.fieldMax-planet.fieldUsed}</span>)`
            });

            stack.fieldUsed += planet.fieldUsed;
            stack.fieldMax += planet.fieldMax;
            stack.fieldLeft += (planet.fieldMax-planet.fieldUsed);

            // °C
            let temperature = Util.addDom('div',
            {
                parent:grid,
                child:planet.temperature + 40 + '°C'
            });

            stack.temperature += (planet.temperature + 40);

            if(planet.temperature >= 110) temperature.style.color = "#af644d"; // too hot
            else if(planet.temperature>= 10) temperature.style.color = "#af9e4d"; // hot
            else if(planet.temperature >= -40) temperature.style.color = "#4daf67"; // normal
            else if(planet.temperature >= -140) temperature.style.color = "#4dafa6"; // cold
            else temperature.style.color = "#4d79af"; // too cold

            // lieform
            Util.addDom('div',
            {
                class:`ogl_icon ogl_lifeform${planet.lifeform || 0}`,
                parent:grid
            });

            // metal mine
            let metal = Util.addDom('div',
            {
                class:'ogl_metal',
                parent:grid,
                child:`<strong>${planet[1]}</strong><small>+${Util.formatToUnits(Math.round((planet.prodmetal || 0) * 3600 * 24))}</small>`
            });

            if(planet.upgrades?.['baseBuilding']?.[0]?.name.trim() == this.ogl.db.serverData[1] && serverTime.getTime() < planet.upgrades?.['baseBuilding']?.[0]?.end) metal.querySelector('strong').innerHTML += `<span>${planet[1]+1}</span>`;

            // crystal mine
            let crystal = Util.addDom('div',
            {
                class:'ogl_crystal',
                parent:grid,
                child:`<strong>${planet[2]}</strong><small>+${Util.formatToUnits(Math.round((planet.prodcrystal || 0) * 3600 * 24))}</small>`
            });

            if(planet.upgrades?.['baseBuilding']?.[0]?.name.trim() == this.ogl.db.serverData[2] && serverTime.getTime() < planet.upgrades?.['baseBuilding']?.[0]?.end) crystal.querySelector('strong').innerHTML += `<span>${planet[2]+1}</span>`;

            // deut mine
            let deut = Util.addDom('div',
            {
                class:'ogl_deut',
                parent:grid,
                child:`<strong>${planet[3]}</strong><small>+${Util.formatToUnits(Math.round((planet.proddeut || 0) * 3600 * 24))}</small>`
            });

            stack.metal += planet[1];
            stack.crystal += planet[2];
            stack.deut += planet[3];

            stack.prodmetal += planet.prodmetal || 0;
            stack.prodcrystal += planet.prodcrystal || 0;
            stack.proddeut += planet.proddeut || 0;

            if(planet.upgrades?.['baseBuilding']?.[0]?.name.trim() == this.ogl.db.serverData[3] && serverTime.getTime() < planet.upgrades?.['baseBuilding']?.[0]?.end) deut.querySelector('strong').innerHTML += `<span>${planet[3]+1}</span>`;
        });

        metalStack.innerHTML = `<strong>${(stack.metal / count).toFixed(1)}</strong><small>+${Util.formatToUnits(Math.round((stack.prodmetal || 0) * 3600 * 24))}</small>`;
        crystalStack.innerHTML = `<strong>${(stack.crystal / count).toFixed(1)}</strong><small>+${Util.formatToUnits(Math.round((stack.prodcrystal || 0) * 3600 * 24))}</small>`;
        deutStack.innerHTML = `<strong>${(stack.deut / count).toFixed(1)}</strong><small>+${Util.formatToUnits(Math.round((stack.proddeut || 0) * 3600 * 24))}</small>`;

        this.ogl._popup.open(container, true);
    }

    openStats()
    {
        Util.runAsync(() => this.ogl._stats.buildStats(false, false)).then(e => this.ogl._popup.open(e, true));
    }

    openSettings(buttonSource)
    {
        const container = Util.addDom('div', {class:'ogl_config', child:'<h2>Settings<i class="material-icons">settings</i></h2>'});

        let subContainer;
        let options =
        [
            'defaultShip', 'defaultMission', 'profileButton',
            'resourceTreshold', 'msu', 'sim', 'converter', 'useClientTime', 'keyboardActions',
            'showMenuResources', /*'tooltipDelay',*/ 'shortcutsOnRight', 'sidePanelOnLeft', 'disablePlanetTooltips', 'reduceLargeImages', 'colorblindMode', 'displayPlanetTimers',
            'expeditionValue', 'expeditionRandomSystem', 'expeditionRedirect', 'expeditionBigShips',
            'expeditionShipRatio', 'ignoreExpeShipsLoss', 'ignoreConsumption',
            'displaySpyTable', 'autoCleanReports', 'autoCleanCounterSpies', 'boardTab', 'spyTableMSU', 'spyTableRules',
            'ptreTeamKey', 'ptreLogs',
            'manageData', 'debugMode',
        ];

        options.forEach(opt =>
        {
            const isBoolean = typeof this.ogl.db.options[opt] === typeof true;
            const isNumber = typeof this.ogl.db.options[opt] !== typeof [] && (typeof this.ogl.db.options[opt] === typeof 0 || Number(this.ogl.db.options[opt]));
            //const isString = typeof this.ogl.db.options[opt] === typeof '';

            if(!this.ogl.db.options[opt]) this.ogl.db.options[opt]

            if(opt == 'defaultShip') subContainer = 'fleet';
            else if(opt == 'resourceTreshold') subContainer = 'general';
            else if(opt == 'showMenuResources') subContainer = 'interface';
            else if(opt == 'expeditionValue') subContainer = 'expeditions';
            else if(opt == 'expeditionShipRatio') subContainer = 'stats';
            else if(opt == 'displaySpyTable') subContainer = 'messages';
            else if(opt == 'ptreTeamKey') subContainer = 'PTRE';
            else if(opt == 'manageData') subContainer = 'data';

            let currentContainer;

            if(!container.querySelector(`[data-container="${subContainer}"]`))
            {
                currentContainer = Util.addDom('div', { parent:container, 'data-container':subContainer });
                if(this.ogl.db.configState[subContainer]) currentContainer.classList.add('ogl_active');
                Util.addDom('h3', { parent:currentContainer, child:subContainer, onclick:() =>
                {
                    if(currentContainer.classList.contains('ogl_active'))
                    {
                        currentContainer.classList.remove('ogl_active');
                        this.ogl.db.configState[currentContainer.getAttribute('data-container')] = false;
                    }
                    else
                    {
                        currentContainer.classList.add('ogl_active');
                        this.ogl.db.configState[currentContainer.getAttribute('data-container')] = true;
                    }
                }});
            }
            else
            {
                currentContainer = container.querySelector(`[data-container="${subContainer}"]`);
            }

            const label = Util.addDom('label', { parent:currentContainer, 'data-label':`${this.ogl._lang.find(opt)}`, 'data-opt':opt });
            const tooltip = this.ogl._lang.find(opt+'TT');

            if(tooltip != 'TEXT_NOT_FOUND')
            {
                label.classList.add('tooltipLeft');
                label.setAttribute('title', `<div class="ogl_settingsTooltip">${tooltip}</div>`);
            }

            if(opt == 'defaultShip')
            {
                this.ogl.fretShips.forEach(shipID =>
                {
                    let div = Util.addDom('div', {parent:label, class:`ogl_icon ogl_${shipID}`, onclick:(event, element) =>
                    {
                        this.ogl.db.options.defaultShip = shipID;
                        label.querySelector('.ogl_active')?.classList.remove('ogl_active');
                        element.classList.add('ogl_active');
        
                        if(this.ogl.page == 'fleetdispatch')
                        {
                            document.querySelectorAll('#fleet1 .ogl_fav').forEach(e => e.classList.add('ogl_grayed'));
                            document.querySelector(`[data-technology="${this.ogl.db.options.defaultShip}"]`)?.classList.remove('ogl_grayed');
        
                            this.ogl._fleet.updateLimiter();

                            if(this.ogl.mode === 1 || this.ogl.mode === 2)
                            {
                                this.ogl.fretShips.forEach(shipID => fleetDispatcher.selectShip(shipID, 0));
                                fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.ogl._fleet.shipsForResources());
                                fleetDispatcher.selectMaxAll();
                            }
                            else if(this.ogl.mode === 3 && this.ogl.cache.toSend)
                            {
                                this.ogl.fretShips.forEach(shipID => fleetDispatcher.selectShip(shipID, 0));
                                this.ogl._fleet.prefillTodolistCargo();
                            }
                        }
                    }});
        
                    if(this.ogl.db.options.defaultShip == shipID) div.classList.add('ogl_active');
                });
            }
            else if(opt == 'defaultMission')
            {
                [3, 4, 8, 1].forEach(missionID =>
                {
                    let div = Util.addDom('div', {parent:label, class:`ogl_icon ogl_mission${missionID}`, onclick:(event, element) =>
                    {
                        this.ogl.db.options.defaultMission = missionID;
                        label.querySelector('.ogl_active')?.classList.remove('ogl_active');
                        element.classList.add('ogl_active');
                    }});
        
                    if(this.ogl.db.options.defaultMission == missionID) div.classList.add('ogl_active');
                });
            }
            else if(opt == 'profileButton')
            {
                label.innerHTML = `<button class="material-icons">cancel_schedule_send</button>`;

                label.querySelector('button').addEventListener('click', () =>
                {
                    Util.runAsync(() => this.ogl._ui.openFleetProfile()).then(e => this.ogl._popup.open(e));
                });
            }
            else if(opt == 'msu')
            {
                label.classList.add('tooltipLeft');
                label.setAttribute('title', 'Format:<br>metal:crystal:deut');

                const input = Util.addDom('input', { type:'text', placeholder:'m:c:d', value:this.ogl.db.options[opt], parent:label,
                oninput:() =>
                {
                    if(input.value && !/^[0-9]*[.]?[0-9]+:[0-9]*[.]?[0-9]+:[0-9]*[.]?[0-9]+$/.test(input.value))
                    {
                        input.classList.add('ogl_danger');
                    }
                    else
                    {
                        input.classList.remove('ogl_danger');
                        this.ogl.db.options[opt] = input.value.match(/^[0-9]*[.]?[0-9]+:[0-9]*[.]?[0-9]+:[0-9]*[.]?[0-9]+$/)[0];
                    }
                }});
            }
            else if(opt == 'showMenuResources')
            {
                label.innerHTML = ``;
                const select = Util.addDom('select', { parent:label, class:'dropdownInitialized', onchange:() =>
                {
                    this.ogl.db.options[opt] = parseInt(select.value);
                    localStorage.setItem('ogl_menulayout', this.ogl.db.options[opt]);
                    document.body.setAttribute('data-menulayout', select.value);
                }});

                ['All', 'Coords', 'Resources'].forEach((entry, index) =>
                {
                    const selectOption = Util.addDom('option', { parent:select, child:entry, value:index });
                    if(this.ogl.db.options[opt] == index) selectOption.selected = true;
                });
            }
            else if(isBoolean && opt != 'sim')
            {
                if(opt == 'boardTab' && this.ogl.server.lang != 'fr') { label.remove(); return; }

                const input = Util.addDom('input', { type:'checkbox', parent:label, onclick:() =>
                {
                    this.ogl.db.options[opt] = !this.ogl.db.options[opt];
                    input.checked = this.ogl.db.options[opt];

                    if (opt == 'ignoreExpeShipsLoss' && this.ogl.db.options.displayMiniStats)
                    {
                        this.ogl._stats.showMiniRecap();
                    }
                    else if (opt == 'ignoreConsumption' && this.ogl.db.options.displayMiniStats)
                    {
                        this.ogl._stats.showMiniRecap();
                    }
                    else if(opt == 'displayPlanetTimers')
                    {
                        document.querySelector('#planetList').classList.toggle('ogl_alt')
                    }
                    else if(opt == 'reduceLargeImages')
                    {
                        localStorage.setItem('ogl_minipics', this.ogl.db.options[opt]);
                        document.body.setAttribute('data-minipics', this.ogl.db.options[opt]);
                    }
                    else if(opt == 'colorblindMode')
                    {
                        localStorage.setItem('ogl_colorblind', this.ogl.db.options[opt]);
                        document.body.setAttribute('data-colorblind', this.ogl.db.options[opt]);
                    }
                    else if(opt == 'displaySpyTable' && this.ogl._message?.spytable && this.ogl._message?.tabID == 20)
                    {
                        if(this.ogl.db.options[opt]) this.ogl._message.spytable.classList.remove('ogl_hidden');
                        else this.ogl._message.spytable.classList.add('ogl_hidden')
                    }
                    else if(opt == 'sidePanelOnLeft')
                    {
                        localStorage.setItem('ogl_sidepanelleft', this.ogl.db.options[opt]);
                        document.body.setAttribute('data-sidepanel', this.ogl.db.options[opt]);
                    }
                    else if(opt == 'spyTableMSU')
                    {
                        this.ogl._message.loadSpyTable();
                        this.ogl._message.spytable.querySelector('[data-filter="wave1"]').innerText = this.ogl.db.options.spyTableMSU ? 'MSU' : 'loot';
                    }
                }});

                if(this.ogl.db.options[opt]) input.checked = true;
            }
            else if(isNumber || opt == 'expeditionValue')
            {
                const input = Util.addDom('input', { class:'ogl_inputCheck', type:'text', value:this.ogl.db.options[opt], parent:label, oninput:() =>
                {
                    setTimeout(() =>
                    {
                        if(opt == 'expeditionShipRatio') // min
                        {
                            if(parseInt(input.value.replace(/\D/g, '')) < 0) input.value = 0;
                            else if(parseInt(input.value.replace(/\D/g, '')) > 100) input.value = 100;
                        }

                        let newValue;

                        if(input.getAttribute('data-allowPercent') == 'true' && input.value.toLowerCase().indexOf('%') >= 0)
                        {
                            newValue = (parseInt(input.value.replace(/\D/g, '')) || false);
                            if(newValue) newValue += '%';
                        }
                        else
                        {
                            newValue = (parseInt(input.value.replace(/\D/g, '')) || false)
                        }

                        this.ogl.db.options[opt] = newValue;

                        if(opt == 'expeditionShipRatio') this.ogl._stats.showMiniRecap();
                    }, 200);
                }});

                if(opt == 'expeditionValue')
                {
                    input.setAttribute('data-allowPercent', true);
                    input.classList.add('ogl_placeholder');
                    input.setAttribute('placeholder', `(${Util.formatNumber(this.ogl.calcExpeditionMax().max)})`);
                }

                //Util.formatInput(input);
            }
            else if(opt == 'keyboardActions')
            {
                label.innerHTML = `<button class="material-icons">keyboard_alt</button>`;
                label.querySelector('button').addEventListener('click', () =>
                {
                    Util.runAsync(() => this.ogl._ui.openKeyboardActions()).then(e => this.ogl._popup.open(e));
                });
            }
            else if(opt == 'sim' || opt == 'converter')
            {
                const list = opt == 'sim' ? Util.simList : Util.converterList;

                label.innerHTML = ``;
                const select = Util.addDom('select', { parent:label, class:'dropdownInitialized', child:'<option value="false" selected disabled>-</option>', onchange:() =>
                {
                    this.ogl.db.options[opt] = select.value;
                }});

                Object.entries(list).forEach(entry =>
                {
                    const selectOption = Util.addDom('option', { parent:select, child:entry[0], value:entry[0] });
                    if(this.ogl.db.options[opt] == entry[0]) selectOption.selected = true;
                });
            }
            else if(opt == 'expeditionBigShips')
            {
                label.innerHTML = `<button class="material-icons">rocket</button>`;
                label.querySelector('button').addEventListener('click', () =>
                {
                    Util.runAsync(() => this.ogl._ui.openExpeditionFiller()).then(e => this.ogl._popup.open(e));
                });
            }
            else if(opt == 'displayMiniStats')
            {
                label.innerHTML = `<div class="ogl_choice" data-limiter="day">D</div><div class="ogl_choice" data-limiter="week">W</div><div class="ogl_choice" data-limiter="month">M</div>`;

                label.querySelectorAll('div').forEach(button =>
                {
                    button.addEventListener('click', () =>
                    {
                        this.ogl.db.options[opt] = button.getAttribute('data-limiter');
                        this.ogl._stats.showMiniRecap();

                        label.querySelector('.ogl_active') && label.querySelector('.ogl_active').classList.remove('ogl_active');
                        button.classList.add('ogl_active');
                    });

                    if(button.getAttribute('data-limiter') == this.ogl.db.options[opt])
                    {
                        button.classList.add('ogl_active');
                    }
                });
            }
            else if(opt == 'spyTableRules')
            {
                label.innerHTML = `<button class="material-icons">filter_alt</button>`;
                label.querySelector('button').addEventListener('click', () =>
                {
                    this.ogl._message.openSpyTableRules();
                });
            }
            else if(opt == 'ptreTeamKey')
            {
                label.classList.add('tooltipLeft');
                label.setAttribute('title', 'Format:<br>TM-XXXX-XXXX-XXXX-XXXX');

                const input = Util.addDom('input', { type:'password', placeholder:'TM-XXXX-XXXX-XXXX-XXXX', value:localStorage.getItem('ogl-ptreTK') || '', parent:label,
                oninput:() =>
                {
                    if(input.value && (input.value.replace(/-/g, '').length != 18 || input.value.indexOf('TM') != 0))
                    {
                        input.classList.add('ogl_danger');
                    }
                    else
                    {
                        input.classList.remove('ogl_danger');
                        localStorage.setItem('ogl-ptreTK', input.value);
                        this.ogl.ptreKey = input.value;
                    }
                },
                onfocus:() => input.type = 'text',
                onblur:() => input.type = 'password'
                });
            }
            else if(opt == 'ptreLogs')
            {
                label.innerHTML = `<button class="material-icons">bug_report</button>`;
                label.querySelector('button').addEventListener('click', () =>
                {
                    this.ogl.PTRE.displayLogs();
                });
            }
            else if(opt == 'manageData')
            {
                label.innerHTML = `<button class="material-icons">database</button>`;
                label.querySelector('button').addEventListener('click', () =>
                {
                    Util.runAsync(() => this.ogl._ui.openDataManager()).then(e => this.ogl._popup.open(e));
                });
            }
        });

        this.ogl._ui.openSide(container, 'settings', buttonSource);
    }

    openPinned(buttonSource)
    {
        this.ogl._ui.openSide(Util.addDom('div', { class:'ogl_loading' }), 'pinned', buttonSource);

        Util.runAsync(() =>
        {
            const container = Util.addDom('div', {class:'ogl_pinned', child:'<h2>Pinned players<i class="material-icons">keep</i></h2>'});

            const tabs = Util.addDom('div', { class:'ogl_tabs ogl_flagSelector material-icons', parent:container });
            const list = Util.addDom('div', { class:'ogl_list', parent:container });

            this.ogl.flagsList.forEach(pin =>
            {
                if(pin != 'none')
                {
                    const tab = Util.addDom('div', { parent:tabs, 'data-flag':pin, onclick:() =>
                    {
                        list.innerText = '';
                        tabs.querySelector('[data-flag].ogl_active')?.classList.remove('ogl_active');
                        tab.classList.add('ogl_active');

                        this.ogl.db.lastPinTab = pin;

                        if(pin == 'ptre' && this.ogl.ptreKey)
                        {
                            const actionList = Util.addDom('div', { class:'ogl_grid', parent:list });

                            Util.addDom('button', { class:'ogl_button', child:this.ogl._lang.find('ptreSyncTarget'), parent:actionList, onclick:() =>
                            {
                                this.ogl.PTRE.syncTargetList();
                            }});

                            Util.addDom('button', { class:'ogl_button', child:this.ogl._lang.find('ptreManageTarget'), parent:actionList, onclick:() =>
                            {
                                window.open(this.ogl.PTRE.manageSyncedListUrl, '_blank');
                            }})

                            Util.addDom('hr', { parent:list });
                        }

                        Object.values(this.ogl.db.udb).filter(u => u.pin == this.ogl.db.lastPinTab).sort((a, b) => a.score?.globalRanking - b.score?.globalRanking).forEach(player =>
                        {
                            if(player.uid)
                            {
                                this.addPinnedItemToList(player, list);
                            }
                        });

                        if(!list.querySelector('[data-uid]') && !list.querySelector('.ogl_button')) list.innerHTML = `<p class="ogl_emptyList">${this.ogl._lang.find('emptyPlayerList')}</p>`;
                    }});

                    if(pin == this.ogl.db.lastPinTab)
                    {
                        tab.click();
                    }
                }
            });

            const recentTab = Util.addDom('div', { 'data-flag':'recent', parent:tabs, onclick:() =>
            {
                this.ogl.db.lastPinTab = 'recent';

                list.innerText = '';
                tabs.querySelector('[data-flag].ogl_active')?.classList.remove('ogl_active');
                recentTab.classList.add('ogl_active');

                this.ogl.db.lastPinnedList.forEach(id =>
                {
                    const player = this.ogl.db.udb[id];

                    if(player?.uid)
                    {
                        this.addPinnedItemToList(player, list);
                    }
                });

                if(!list.querySelector('[data-uid]')) list.innerText = this.ogl._lang.find('emptyPlayerList');
            }});

            if(this.ogl.db.lastPinTab == 'recent')
            {
                recentTab.click();
            }

            return container;
        })
        .then(container => this.ogl._ui.openSide(container, 'pinned', buttonSource));
    }

    addPinnedItemToList(player, list)
    {
        const item = Util.addDom('div', { parent:list });

        const playerDiv = Util.addDom('span',
        {
            class:`tooltipLeft tooltipClose tooltipUpdate ${player.status || 'status_abbr_active'}`,
            parent:item,
            child:typeof player.name == typeof '' ? player.name : '?',
        });

        this.ogl._ui.turnIntoPlayerLink(player.uid, playerDiv);

        const page = Math.max(1, Math.ceil((player.score?.globalRanking || 100) / 100));
        const rankLink = Util.addDom('a', { class:'ogl_ranking', href:`${window.location.href.split('?')[0]}?page=highscore&site=${page}&searchRelId=${player.uid}`, child:'#'+player.score?.globalRanking || '?' });

        Util.addDom('div', { parent:item, child:rankLink.outerHTML });
        this.ogl._ui.addPinButton(item, player.uid);

        Util.addDom('i', { class:'material-icons', parent:item, child:'delete', onclick:() =>
        {
            this.ogl.db.lastPinnedList.splice(this.ogl.db.lastPinnedList.findIndex(e => e == player.uid), 1);
            item.remove();
            delete this.ogl.db.udb[player.uid].pin;
        }});
    }

    openPinnedDetail(id, update)
    {
        id = parseInt(id);

        this.ogl._ui.openSide(Util.addDom('div', { class:'ogl_loading' }), id);

        const updateSide = () =>
        {
            const player = this.ogl.db.udb[id];
            if(!player) return;
    
            const container = Util.addDom('div', { class:'ogl_pinDetail' });
            const status = this.ogl.playerStatus.find(e => e.defaultTag == player.status)?.class || 'status_abbr_active';
    
            Util.addDom('div', { parent:container, class:'material-icons ogl_back', child:'arrow_back', onclick:() => { this.openPinned() } })
            const title = Util.addDom('h2', { class:status, parent:container, child:player.name });
            const score = Util.addDom('div', { class:'ogl_score', parent:container });
            const actions = Util.addDom('div', { class:'ogl_actions', parent:container });
            const list = Util.addDom('div', { class:'ogl_list', parent:container });

            this.ogl._ui.addPinButton(title, id);

            // write
            const writeIcon = Util.addDom('div', { child:'edit', class:'material-icons ogl_button', parent:actions, onclick:() =>
            {
                if(!document.querySelector('#chatBar'))
                {
                    window.location.href = `${window.location.href.split('?')[0]}?page=chat&playerId=${id}`;
                }
            }});

            if(document.querySelector('#chatBar'))
            {
                writeIcon.classList.add('js_openChat');
                writeIcon.setAttribute('data-playerId', id);
            }

            // buddy
            Util.addDom('a', { child:'person_add', class:'material-icons ogl_button overlay', parent:container.querySelector('.ogl_actions'), href:`${window.location.href.split('?')[0]}?page=ingame&component=buddies&action=7&id=${id}&ajax=1`, onclick:() =>
            {
                tippy.hideAll();
            }});
            
            // ignore
            Util.addDom('div', { child:'block', class:'material-icons ogl_button', parent:actions, onclick:() =>
            {
                window.location.href = `${window.location.href.split('?')[0]}?page=ignorelist&action=1&id=${id}`;
            }});

            // mmorpgstat
            Util.addDom('div', { child:'query_stats', class:'material-icons ogl_button', parent:actions, onclick:() =>
            {
                window.open(Util.genMmorpgstatLink(this.ogl, id), '_blank');
            }});

            // ptre get player info
            Util.addDom('div', { child:'ptre', class:'material-icons ogl_button', parent:actions, onclick:() =>
            {
                this.ogl.PTRE.getPlayerInfo({ name:player.name, id:id });
            }});

            Util.addDom('div', { child:'sync', class:'material-icons ogl_button', parent:actions, onclick:() =>
            {
                this.ogl.PTRE.getPlayerPositions({ name:player.name, id:id });
            }});
    
            this.ogl.db.lastPinnedList = Array.from(new Set([id, ...this.ogl.db.lastPinnedList].map(Number)));
            if(this.ogl.db.lastPinnedList.length > 30) this.ogl.db.lastPinnedList.length = 30;

            if(!update)
            {
                Util.addDom('div', { class:'ogl_loading', parent:container });
                this.ogl._ui.openSide(container, id);
                this.ogl.PTRE.getPlayerPositions({ name:player.name, id:id }); // includes _fetch.fetchPlayerAPI()
            }
    
            const page = Math.max(1, Math.ceil((player.score?.globalRanking || 100) / 100));
            const rankLink = Util.addDom('a', { class:'ogl_ranking', href:`${window.location.href.split('?')[0]}?page=highscore&site=${page}&searchRelId=${player.uid}`, child:'#'+player.score?.globalRanking || '?' });

            title.innerHTML = `${player.name} ${rankLink.outerHTML}`;

            this.ogl._ui.addPinButton(title, id);
            
            score.innerHTML =
            `
                <div class="ogl_line tooltip" title="Global"><i class="material-icons">crown</i><div>${Util.formatNumber(player.score?.global)}</div></div>
                <div class="ogl_line tooltip" title="Economy"><i class="material-icons">diamond</i><div>${Util.formatNumber(player.score?.economy)}</div></div>
                <div class="ogl_line tooltip" title="Research"><i class="material-icons">science</i><div>${Util.formatNumber(player.score?.research)}</div></div>
                <div class="ogl_line tooltip" title="Lifeforms"><i class="material-icons">genetics</i><div>${Util.formatNumber(player.score?.lifeform)}</div></div>
                <div class="ogl_line tooltip" title="Fleet"><i class="material-icons">rocket_launch</i><div>${Util.formatNumber(Util.getPlayerScoreFD(player.score, 'fleet'))}</div></div>
                <div class="ogl_line tooltip" title="Defense"><i class="material-icons">security</i><div>${Util.formatNumber(Util.getPlayerScoreFD(player.score, 'defense'))}</div></div>
                <div class="ogl_line tooltip" title="Astro lvl: ${player.astro || '?'}"><i class="material-icons">planet</i><div>${Util.formatNumber(player.astro ? (Math.ceil(player.astro / 2) + 1) + ' planets max.' : '?')}</div></div>
            `;

            let lastCoords = 0;
            let group = 1;
            let index = 1;

            player.planets.sort((a, b) => Util.coordsToID(a) - Util.coordsToID(b)).forEach((planetID) =>
            {
                const planet = this.ogl.db.pdb[planetID];

                if(!planet) return;

                const date = new Date(planet.api);
                const dateDiff = Math.floor((serverTime.getTime() - date) / (1000 * 3600 * 24));
                const hourDiff = Math.round(((serverTime.getTime() - date % 86400000) % 3600000) / 60000);
                const line = Util.addDom('div', { parent:list });

                if(planet.home) line.classList.add('ogl_home');

                let newCoords = Util.coordsToID(planet.coo).slice(0, -3);
                if(lastCoords === newCoords) line.setAttribute('data-group', group);
                else if(line.previousElementSibling?.getAttribute('data-group')) group++;
                lastCoords = newCoords;

                Util.addDom('div', { child:index, parent:line });
                Util.addDom('div', { child:planet.coo, parent:line, 'data-galaxy':planet.coo });
                const debrisDiv = Util.addDom('div', { class:'tooltip', 'data-debris-coords':planet.coo, title:'Debris<br>'+Util.formatNumber(planet.debris || 0), child:Util.formatToUnits(planet.debris || 0), parent:line });
                
                if(this.ogl._movement?.destinationList?.[planet.coo]?.indexOf('8') >= 0) debrisDiv.classList.add('ogl_attacked');

                this.ogl._ui.addSpyIcons(line, planet.coo.split(':'), false, true);

                let ageStr = !dateDiff && dateDiff !== 0 ? '?' : dateDiff > 0 ? `${dateDiff}${LocalizationStrings.timeunits.short.hour} ago` : `${hourDiff}${LocalizationStrings.timeunits.short.minute} ago`;

                const dateDiv = Util.addDom('date', { class:'tooltipLeft', child:ageStr, title:`<span>${date.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'})}</span> <span>${date.toLocaleTimeString('de-DE')}</span>`, parent:line });
                if(dateDiff >= 5) dateDiv.classList.add('ogl_danger');
                else if(dateDiff >= 3) dateDiv.classList.add('ogl_warning');

                index += 1;

                //Util.addDom('date', { child:`<span>${date.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'})}</span><span>${date.toLocaleTimeString('de-DE')}</span>`, parent:line });
            });

            this.ogl._ui.openSide(container, id);
            setTimeout(() => this.ogl._shortcut.load(), 50);

            this.ogl._galaxy.checkCurrentSystem();
        }

        Util.runAsync(() =>
        {
            this.ogl._fetch.fetchPlayerAPI(id, false, () => updateSide());
        });
    }

    openTagged(buttonSource)
    {
        this.ogl._ui.openSide(Util.addDom('div', { class:'ogl_loading' }), 'tagged');

        Util.runAsync(() =>
        {
            const container = Util.addDom('div', {class:'ogl_tagged', child:'<h2>Tagged planets<i class="material-icons">stroke_full</i></h2>'});
            const tabs = Util.addDom('div', { class:'ogl_tabs ogl_tagSelector material-icons', parent:container });
            const inputs = Util.addDom('div', { class:'ogl_actions', parent:container });
            Util.addDom('hr', { parent:container });
            const list = Util.addDom('div', { class:'ogl_list', parent:container, child:'<p class="ogl_emptyList">Select a galaxy/system range</p>' });

            const buildList = () =>
            {
                const start = Util.coordsToID(`${gStart.value}:${sStart.value}:000`);
                const end = Util.coordsToID(`${gEnd.value}:${sEnd.value}:000`);

                const items = this.getTaggedItems(start, end);
                list.innerText = '';

                if(items.length < 1)
                {
                    Util.addDom('p', { child:'No result', parent:list } );
                }
                else
                {
                    let nextTargetFound = false;
                    let newList = [];
        
                    items.forEach((item, index) =>
                    {
                        const coords = item.match(/.{1,3}/g).map(Number).join(':');
                        const coordsID = Util.coordsToID(coords);

                        const line = Util.addDom('div', { parent:list });
                        Util.addDom('div', { child:index+1, parent:line });
                        Util.addDom('div', { child:coords, 'data-galaxy':coords, parent:line});
                        const target = Util.addDom('div', { class:'material-icons tooltip ogl_nextQuickTarget', title:'Select as next quick raid target', child:'swords', parent:line, onclick:() =>
                        {
                            const start = Util.coordsToID(coords);
                            const end = Util.coordsToID(`${gEnd.value}:${sEnd.value}:000`);
                            this.getTaggedItems(start, end, true);

                            this.ogl.db.quickRaidList = this.tmpRaidList;
                            this.ogl._notification.addToQueue(`You can now use [${this.ogl.db.options.keyboardActions.quickRaid}] on fleet page to attack next target`, true);
                            setTimeout(() => this.ogl._shortcut.load(), 50);

                            list.querySelectorAll('.ogl_nextQuickTarget.ogl_active').forEach(e => e.classList.remove('ogl_active'));
                            target.classList.add('ogl_active');
                        }});

                        if(this.ogl.db.quickRaidList && this.ogl.db.quickRaidList?.[0] == coordsID)
                        {
                            target.classList.add('ogl_active');
                            nextTargetFound = true;
                        }

                        if(nextTargetFound) newList.push(coordsID);
        
                        this.ogl._ui.addSpyIcons(line, coords);
                        this.ogl._ui.addTagButton(line, coords);
                    });

                    this.ogl.db.quickRaidList = nextTargetFound ? newList : [];
                }
            }

            Object.keys(this.ogl.db.tags).forEach(tag =>
            {
                if(tag != 'none')
                {
                    const tab = Util.addDom('div', { parent:tabs, 'data-tag':tag, onclick:() =>
                    {
                        if(this.ogl.db.tags[tag])
                        {
                            this.ogl.db.tags[tag] = false;
                            tab.classList.add('ogl_off');
                        }
                        else
                        {
                            this.ogl.db.tags[tag] = true;
                            tab.classList.remove('ogl_off');
                        }
                    }});

                    if(!this.ogl.db.tags[tag]) tab.classList.add('ogl_off');
                }
            });

            const currentCoords = this.ogl.currentPlanet.obj.coords.split(':');

            const gStart = Util.addDom('input', { type:'text', min:'1', max:'10', parent:inputs, value:this.ogl.db.lastTaggedInput[0] || currentCoords[0], onblur:e => e.target.value = e.target.value || 1, oninput:() => saveInput() });
            const sStart = Util.addDom('input', { type:'text', min:'1', max:'499', parent:inputs, value:this.ogl.db.lastTaggedInput[1] || currentCoords[1], onblur:e => e.target.value = e.target.value || 1, oninput:() => saveInput() });
            Util.addDom('div', { class:'material-icons', child:'arrow_right_alt', parent:inputs });
            const gEnd = Util.addDom('input', { type:'text', min:'1', max:'10', parent:inputs, value:this.ogl.db.lastTaggedInput[2] || 1, onblur:e => e.target.value = e.target.value || 1, oninput:() => saveInput() });
            const sEnd = Util.addDom('input', { type:'text', min:'1', max:'499', parent:inputs, value:this.ogl.db.lastTaggedInput[3] || 1, onblur:e => e.target.value = e.target.value || 1, oninput:() => saveInput() });
            const ignoreNoobButton = Util.addDom('label', { class:'status_abbr_noob', parent:inputs, child:this.ogl._lang.find('noob')+'<input class="ogl_hidden" type="checkbox">', onclick:() =>
            {
                setTimeout(() =>
                {
                    this.ogl.db.lastTaggedInput[4] = ignoreNoobButton.querySelector('input').checked;
                    this.ogl.db.lastTaggedInput[4] ? ignoreNoobButton.classList.remove('ogl_off') : ignoreNoobButton.classList.add('ogl_off');
                    buildList();
                }, 50);
            }});
            const ignoreVacationButton = Util.addDom('label', { class:'status_abbr_vacation', parent:inputs, child:this.ogl._lang.find('vacation')+'<input class="ogl_hidden" type="checkbox">', onclick:() =>
            {
                setTimeout(() =>
                {
                    this.ogl.db.lastTaggedInput[5] = ignoreVacationButton.querySelector('input').checked;
                    this.ogl.db.lastTaggedInput[5] ? ignoreVacationButton.classList.remove('ogl_off') : ignoreVacationButton.classList.add('ogl_off');
                    buildList();
                }, 50);
            }});
            Util.addDom('div', { class:'material-icons ogl_button', parent:inputs, child:'search', onclick:() => buildList() });

            if(this.ogl.db.lastTaggedInput[0] && this.ogl.db.lastTaggedInput[1] && this.ogl.db.lastTaggedInput[2] && this.ogl.db.lastTaggedInput[3]) buildList();

            if(!this.ogl.db.lastTaggedInput[4]) ignoreNoobButton.classList.add('ogl_off');
            else ignoreNoobButton.querySelector('input').checked = true;
            if(!this.ogl.db.lastTaggedInput[5]) ignoreVacationButton.classList.add('ogl_off');
            else ignoreVacationButton.querySelector('input').checked = true;

            const saveInput = () =>
            {
                if(this.timeout) clearTimeout(this.timeout);

                this.ogl.db.lastTaggedInput[0] = gStart.value;
                this.ogl.db.lastTaggedInput[1] = sStart.value;
                this.ogl.db.lastTaggedInput[2] = gEnd.value;
                this.ogl.db.lastTaggedInput[3] = sEnd.value;
            }

            return container;
        }).then(container =>
        {
            this.ogl._ui.openSide(container, 'tagged', buttonSource);
            setTimeout(() => this.ogl._shortcut.load(), 50);
        });
    }

    getTaggedItems(rawStart, rawEnd, newFlag)
    {
        rawStart = parseInt(rawStart);
        rawEnd = parseInt(rawEnd);
        
        const displayNoob = this.ogl.db.lastTaggedInput[4];
        const displayVacation = this.ogl.db.lastTaggedInput[5];

        if(!newFlag)
        {
            if(rawStart <= rawEnd) rawEnd += 15;
            else rawStart += 15;
        }

        this.tmpRaidList = Object.keys(this.ogl.db.tdb).sort((a, b) => rawStart <= rawEnd ? a-b : b-a).filter(position =>
        {
            const coords = position.match(/.{1,3}/g).map(Number).join(':');
            const status = this.ogl.db.udb[this.ogl.db.pdb[coords]?.uid]?.status;

            return this.ogl.db.tags[this.ogl.db.tdb[position].tag]
            && (rawStart <= rawEnd ? position >= rawStart && position <= rawEnd : position <= rawStart && position >= rawEnd)
            && (displayNoob || !status || (!displayNoob && status?.indexOf('n') < 0))
            && (displayVacation || !status || (!displayVacation && (status?.indexOf('v') < 0 && status?.indexOf('b') < 0)))
        });

        return this.tmpRaidList;
    }

    checkUpgrade()
    {
        this.PlanetBuildingtooltip = this.PlanetBuildingtooltip || {};

        document.querySelectorAll('.planetlink, .moonlink').forEach(planet =>
        {
            //if(planet.querySelector('.ogl_buildIconList')) planet.querySelector('.ogl_buildIconList').innerText = '';
            if(planet.querySelector('.ogl_buildIconList')) planet.querySelector('.ogl_buildIconList').remove();

            const urlParams = new URLSearchParams(planet.getAttribute('href'));
            const id = urlParams.get('cp').split('#')[0];
            const isMoon = planet.classList.contains('moonlink');

            this.PlanetBuildingtooltip[id] = Util.addDom('ul', { class:'ogl_buildList' });

            let hasBaseBuilding = false;
            let hasBaseResearch = false;
            let hasBaseShip = false;
            let hasLFBuilding = false;
            let hasLFResearch = false;

            this.ogl.db.myPlanets[id] = this.ogl.db.myPlanets[id] || {};

            Object.values(this.ogl.db.myPlanets[id].upgrades || {}).forEach(upgradeType =>
            {
                let ready = false;

                if(upgradeType?.id) return; // clear old beta data

                upgradeType.forEach(upgrade =>
                {
                    if(serverTime.getTime() < upgrade.end)
                    {
                        if(!ready)
                        {
                            ready = true;

                            let content = `<i class="material-icons">fiber_manual_record</i><span class="ogl_slidingText" data-text="${upgrade.name}"></span>`;
                            
                            if(upgrade.lvl) content += `<i class="material-icons">east</i><b>${upgrade.lvl}</b>`;

                            Util.addDom('li', { parent:this.PlanetBuildingtooltip[id], child:content });
                        
                            if(upgrade.type == 'baseBuilding') hasBaseBuilding = true;
                            else if(upgrade.type == 'baseResearch') hasBaseResearch = true;
                            else if(upgrade.type == 'ship' || upgrade.type == 'def' || upgrade.type == 'mechaShip') hasBaseShip = true;
                            else if(upgrade.type == 'lfBuilding') hasLFBuilding = true;
                            else if(upgrade.type == 'lfResearch') hasLFResearch = true;
                        }
                    }
                });
            });

            const parent = Util.addDom('div', { class:'ogl_buildIconList', parent:planet });

            if(hasBaseBuilding) Util.addDom('div', { class:'ogl_buildIcon', 'data-type':'building', parent:parent });
            if(hasBaseResearch) Util.addDom('div', { class:'ogl_buildIcon', 'data-type':'research', parent:parent });
            if(hasBaseShip) Util.addDom('div', { class:'ogl_buildIcon', 'data-type':'ship', parent:parent });
            if(hasLFBuilding) Util.addDom('div', { class:'ogl_buildIcon', 'data-type':'lfbuilding', parent:parent });
            if(hasLFResearch) Util.addDom('div', { class:'ogl_buildIcon', 'data-type':'lfresearch', parent:parent });
        });
    }
}

class FleetManager extends Manager
{
    load()
    {
        this.validationReady = true;
        this.miniFleetQueue = [];

        this.updateSpyFunctions();

        if(this.ogl.page == 'fleetdispatch')
        {
            this.totalCapacity = 0;
            this.capacityWrapper = Util.addDom('div', { 'class':'capacityProgress', parent:document.querySelector('#fleet1 .content'), onclick:() => document.querySelector(`.ogl_requiredShips .ogl_${this.ogl.db.options.defaultShip}`).click() });
            this.capacityBar = Util.addDom('progress', { 'data-capacity':'', max:100, value:0, parent:this.capacityWrapper });

            this.resOnPlanet = { metal:'metalOnPlanet', crystal:'crystalOnPlanet', deut:'deuteriumOnPlanet', food:'foodOnPlanet' };
            this.cargo = { metal:'cargoMetal', crystal:'cargoCrystal', deut:'cargoDeuterium', food:'cargoFood' };

            this.initialTarget = JSON.parse(JSON.stringify(targetPlanet));

            // wait for fleetDispatcher to be ready
            let initInterval = setInterval(() =>
            {
                if(unsafeWindow.fleetDispatcher)
                {
                    // initialize realTarget
                    this.setRealTarget(this.initialTarget);

                    fleetDispatcher.targetPlanet = fleetDispatcher.realTarget;

                    // get initial resources / ships on planet
                    this.initialResOnPlanet = { metal:fleetDispatcher.metalOnPlanet, crystal:fleetDispatcher.crystalOnPlanet, deut:fleetDispatcher.deuteriumOnPlanet, food:fleetDispatcher.foodOnPlanet };
                    this.initialShipsOnPlanet = JSON.parse(JSON.stringify(fleetDispatcher.shipsOnPlanet));

                    /// overwrite default methods
                    if(!this.overwrited) this.overwrite();
                    if(!this.hasBeenRefreshed) this.switchSelfTargetType();

                    if(!fleetDispatcher.fetchTargetPlayerDataTimeout)
                    {
                        // force shipsData fetch (can happen when the server is laggy)
                        if(!unsafeWindow.shipsData || !fleetDispatcher?.fleetHelper?.shipsData)
                        {
                            let params = {};
                            fleetDispatcher.appendShipParams(params);
                            fleetDispatcher.appendTargetParams(params);
                            fleetDispatcher.appendTokenParams(params);
                            params.union = fleetDispatcher.union;

                            $.post(fleetDispatcher.checkTargetUrl, params, response =>
                            {
                                let data = JSON.parse(response);
                                fleetDispatcher.fleetHelper.shipsData = data.shipsData;
                                fleetDispatcher.updateToken(data.newAjaxToken);
                                this.init();
                                clearInterval(initInterval);
                            });
                        }
                        else
                        {
                            this.init();
                            clearInterval(initInterval);
                        }
                    }
                }
            }, 50);
        }
    }

    overwrite()
    {
        this.overwrited = true;

        fleetDispatcher.fleetHelper.getShipData = shipID =>
        {
            return fleetDispatcher?.fleetHelper?.shipsData?.[shipID] || shipsData[shipID];
        }

        fleetDispatcher.refreshDataAfterAjax = data =>
        {
            this.hasBeenRefreshed = true;

            const ownPlanet = Object.values(ogl.db.myPlanets).find(e => e.coords == `${data.targetPlanet.galaxy}:${data.targetPlanet.system}:${data.targetPlanet.position}`);

            fleetDispatcher.setOrders(data.orders);
            
            fleetDispatcher.mission = 0;

            fleetDispatcher.setTargetInhabited(data.targetInhabited);
            fleetDispatcher.setTargetPlayerId(data.targetPlayerId);
            fleetDispatcher.setTargetPlayerName(data.targetPlayerName);
            fleetDispatcher.setTargetIsStrong(data.targetIsStrong);
            fleetDispatcher.setTargetIsOutlaw(data.targetIsOutlaw);
            fleetDispatcher.setTargetIsBuddyOrAllyMember(data.targetIsBuddyOrAllyMember);
            fleetDispatcher.setTargetPlayerColorClass(data.targetPlayerColorClass);
            fleetDispatcher.setTargetPlayerRankIcon(data.targetPlayerRankIcon);
            fleetDispatcher.setPlayerIsOutlaw(data.playerIsOutlaw);

            fleetDispatcher.targetPlanet.galaxy = data.targetPlanet.galaxy;
            fleetDispatcher.targetPlanet.system = data.targetPlanet.system;
            fleetDispatcher.targetPlanet.position = data.targetPlanet.position;
            fleetDispatcher.targetPlanet.type = data.targetPlanet.type;
            fleetDispatcher.targetPlanet.name = data.targetPlanet.name;

            this.setRealTarget(JSON.parse(JSON.stringify(fleetDispatcher.targetPlanet)));

            /*if(JSON.stringify(fleetDispatcher.realTarget) == JSON.stringify(fleetDispatcher.currentPlanet))
            {
                this.setRealTarget(fleetDispatcher.realTarget, { type:fleetDispatcher.realTarget.type == 1 ? 3 : 1 });
            }*/

            if(!data.targetOk && this.isQuickRaid)
            {
                this.ogl.db.quickRaidList.shift();
            }

            setTimeout(() =>
            {
                const hasMission = (fleetDispatcher.getAvailableMissions() || []).indexOf(fleetDispatcher.mission) > -1;
                
                if(!hasMission && this.lastMissionOrder && (fleetDispatcher.getAvailableMissions() || []).indexOf(this.lastMissionOrder) > -1)
                {
                    fleetDispatcher.mission = this.lastMissionOrder;
                }
                else if(!ownPlanet)
                {
                    if(data.targetPlanet.type == 2) fleetDispatcher.mission = 8;
                    else if(fleetDispatcher.union) fleetDispatcher.mission = 2;
                    else fleetDispatcher.mission = 1;
                }
                else if(!hasMission && fleetDispatcher.currentPage == 'fleet2' && (fleetDispatcher.getAvailableMissions() || []).length == 1)
                {
                    fleetDispatcher.mission = fleetDispatcher.getAvailableMissions()[0];
                }
                else if(!hasMission && (fleetDispatcher.getAvailableMissions() || []).indexOf(this.ogl.db.options.defaultMission) > -1)
                {
                    fleetDispatcher.mission = this.ogl.db.options.defaultMission;
                }
                else if(hasMission)
                {
                    fleetDispatcher.mission = this.lastMissionOrder;
                }
                else if(this.ogl.mode && this.ogl.db.options.defaultMission == 1)
                {
                    fleetDispatcher.mission = 3;
                }

                fleetDispatcher.refresh();
            }, 50);

            this.switchSelfTargetType();
        }

        fleetDispatcher.selectShip = (shipID, number) =>
        {
            let shipsAvailable = fleetDispatcher.getNumberOfShipsOnPlanet(shipID);
            const tech = this.ogl._dom.tech[shipID];
            const input = tech._ogl.input;

            if(shipsAvailable === 0 || (number > shipsAvailable && !tech?.classList.contains('ogl_notEnough'))) input?.classList.add('ogl_flashNotEnough');
            else input.classList.remove('ogl_flashNotEnough');
            number = Math.min(shipsAvailable, number);

            if (number <= 0) fleetDispatcher.removeShip(shipID);
            else if (fleetDispatcher.hasShip(shipID)) fleetDispatcher.updateShip(shipID, number);
            else fleetDispatcher.addShip(shipID, number);

            Util.formatInput(input, false, true);
            fleetDispatcher.refresh();
        }

        fleetDispatcher.trySubmitFleet1 = () =>
        {
            if(fleetDispatcher.currentPage != 'fleet1') return;

            fleetDispatcher.targetPlanet = fleetDispatcher.realTarget;

            if(fleetDispatcher.validateFleet1() === false)
            {
                this.validationReady = true;
                return;
            }

            fleetDispatcher.switchToPage('fleet2');
        }

        Util.overWrite('refresh', fleetDispatcher, false, () =>
        {
            /*if(fleetDispatcher.shipsToSend.length > 0) document.body.classList.add('ogl_destinationPicker');
            else if(!document.body.classList.contains('ogl_initHarvest')) document.body.classList.remove('ogl_destinationPicker');*/

            // capacity bar
            let totalResources = fleetDispatcher.metalOnPlanet + fleetDispatcher.crystalOnPlanet + fleetDispatcher.deuteriumOnPlanet + fleetDispatcher.foodOnPlanet;
            this.totalCapacity = this.totalCapacity || 1;

            const percentCapacity = Math.floor((fleetDispatcher.getCargoCapacity() / this.totalCapacity) * 100) || 0;
            const percentResources = Math.floor((fleetDispatcher.getCargoCapacity() / totalResources) * 100) || 0;
            const percentRequired = Math.floor((totalResources / this.totalCapacity) * 100) || 0;

            this.capacityBar.style.setProperty('--capacity', `linear-gradient(to right, #641717, #938108 ${percentRequired * .8}%, #055c54 ${percentRequired}%)`);
            this.capacityWrapper.style.setProperty('--currentCapacityPercent', Math.min(94, percentCapacity)+'%');

            this.capacityWrapper.setAttribute('data-percentResources', Math.min(100, percentResources));
            this.capacityWrapper.setAttribute('data-rawCargo', `${Util.formatNumber(fleetDispatcher.getCargoCapacity())} / ${Util.formatNumber(this.totalCapacity)} - (req. ${Util.formatNumber(totalResources)})`);
            this.capacityBar.setAttribute('max', 100);
            this.capacityBar.setAttribute('value', percentCapacity);

            const apiButton = document.querySelector('.show_fleet_apikey');
            if(apiButton)
            {
                apiButton.classList.add('tooltipClose');
                apiButton.classList.add('tooltipClick');
                /*const apiRaw = Util.addDom('div', {child:apiButton.getAttribute('data-tooltip-title') || apiButton.getAttribute('title') || apiButton.getAttribute('data-title')});

                if(apiRaw)
                {
                    const api = apiRaw.querySelector('#FLEETAPI_JSON').getAttribute('value');
                    apiButton.setAttribute('data-api-code', api);
                }*/
            }

            if(this.ogl._time.timeLoop) this.ogl._time.timeLoop(true);
        });

        Util.overWrite('updateTarget', fleetDispatcher, () =>
        {
            document.querySelector('#planetList').classList.add('ogl_notReady');
        });

        // fix undefined "hasEnoughFuel" value
        fleetDispatcher.hasEnoughFuel = () => (this.initialResOnPlanet?.deut || fleetDispatcher.deuteriumOnPlanet) >= fleetDispatcher.getConsumption();

        Util.overWrite('selectMission', fleetDispatcher, false, () =>
        {
            this.lastMissionOrder = fleetDispatcher.mission;
            document.querySelector('#fleet2').setAttribute('data-selected-mission', fleetDispatcher.mission);
        });

        Util.overWrite('switchToPage', fleetDispatcher, () =>
        {
            if(fleetDispatcher.getFreeCargoSpace() < 0 && fleetDispatcher.cargoFood) { fleetDispatcher.selectMinFood(); fleetDispatcher.selectMaxFood(); }
            if(fleetDispatcher.getFreeCargoSpace() < 0 && fleetDispatcher.cargoMetal) { fleetDispatcher.selectMinMetal(); fleetDispatcher.selectMaxMetal(); }
            if(fleetDispatcher.getFreeCargoSpace() < 0 && fleetDispatcher.cargoCrystal) { fleetDispatcher.selectMinCrystal(); fleetDispatcher.selectMaxCrystal(); }
            if(fleetDispatcher.getFreeCargoSpace() < 0 && fleetDispatcher.cargoDeuterium) { fleetDispatcher.selectMinDeuterium(); fleetDispatcher.selectMaxDeuterium(); }
        }, () =>
        {
            if(fleetDispatcher.currentPage == 'fleet2')
            {
                document.body.classList.add('ogl_destinationPicker');
                fleetDispatcher.focusSendFleet();
            }
            else if(fleetDispatcher.currentPage == 'fleet1')
            {
                document.body.classList.remove('ogl_destinationPicker');
                fleetDispatcher.focusSubmitFleet1();
            }
        });

        Util.overWrite('stopLoading', fleetDispatcher, () =>
        {
            if(fleetDispatcher.currentPage == 'fleet2') this.validationReady = true;
        });

        fleetDispatcher.submitFleet2 = force =>
        {
            let self = this;
            if(self.sent || self.ajaxSuccess) return true;

            self.sent = true;

            if(fleetDispatcher.realTarget)
            {
                fleetDispatcher.targetPlanet.galaxy = fleetDispatcher.realTarget.galaxy;
                fleetDispatcher.targetPlanet.system = fleetDispatcher.realTarget.system;
                fleetDispatcher.targetPlanet.position = fleetDispatcher.realTarget.position;
                fleetDispatcher.targetPlanet.type = fleetDispatcher.realTarget.type;
                fleetDispatcher.targetPlanet.name = fleetDispatcher.realTarget.name;
                fleetDispatcher.refresh();
            }

            if(fleetDispatcher.realSpeedPercent)
            {
                fleetDispatcher.speedPercent = fleetDispatcher.realSpeedPercent;
            }

            force = force || false;

            let that = fleetDispatcher;
            let params = {};

            fleetDispatcher.appendTokenParams(params);
            fleetDispatcher.appendShipParams(params);
            fleetDispatcher.appendTargetParams(params);
            fleetDispatcher.appendCargoParams(params);
            fleetDispatcher.appendPrioParams(params);

            params.mission = fleetDispatcher.mission;
            params.speed = fleetDispatcher.speedPercent;
            params.retreatAfterDefenderRetreat = fleetDispatcher.retreatAfterDefenderRetreat === true ? 1 : 0;
            params.lootFoodOnAttack = fleetDispatcher.lootFoodOnAttack === true ? 1 : 0;
            params.union = fleetDispatcher.union;

            if(force) params.force = force;
            params.holdingtime = fleetDispatcher.getHoldingTime();
            fleetDispatcher.startLoading();

            $.post(fleetDispatcher.sendFleetUrl, params, function(response)
            {
                let data = JSON.parse(response);

                if(data.success === true)
                {
                    fadeBox(data.message, false);
                    $("#sendFleet").removeAttr("disabled");
                    self.fleetSent(data.redirectUrl);
                }
                else
                {
                    setTimeout(() => self.sent = false, 500);

                    if(data.responseArray && data.responseArray.limitReached && !data.responseArray.force)
                    {
                        that.updateToken(data.newAjaxToken || '');
                        errorBoxDecision(that.loca.LOCA_ALL_NETWORK_ATTENTION, that.locadyn.localBashWarning, that.loca.LOCA_ALL_YES, that.loca.LOCA_ALL_NO, function () { that.submitFleet2(true); });
                    }
                    else
                    {
                        that.displayErrors(data.errors);
                        that.updateToken(data.newAjaxToken || '');
                        $("#sendFleet").removeAttr("disabled");
                        that.stopLoading();
                    }
                }
            });
        };

        Util.overWrite('refreshTargetPlanet', fleetDispatcher, () =>
        {
            // update ACS data
            if(fleetDispatcher.union)
            {
                // preselect default mission
                fleetDispatcher.mission = 2;
                fleetDispatcher.refresh();

                const acsEndTime = (Object.values(fleetDispatcher.unions).find(a => a.id == fleetDispatcher.union)?.time || 0) * 1000;
                if(acsEndTime)
                {
                    if(document.querySelector('.ogl_acsInfo')) return;

                    const timeObj = this.ogl._time.getObj(acsEndTime);
                    const acsEnd = this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server;

                    Util.addDom('hr', { prepend:document.querySelector('#fleetBriefingPart1') });
                    const liLeft = Util.addDom('li', { class:'ogl_acsInfo', child:"Time remaining: ", prepend:document.querySelector('#fleetBriefingPart1') });
                    const liOffset = Util.addDom('li', { class:'ogl_acsInfo', child:'Time difference: ', prepend:document.querySelector('#fleetBriefingPart1') });

                    const spanLeft = Util.addDom('span', { class:'ogl_warning value', parent:liLeft });
                    const spanOffset = Util.addDom('span', { class:'value', parent:liOffset });

                    clearInterval(this.acsInterval);
                    this.acsInterval = setInterval(() =>
                    {
                        if(!fleetDispatcher.getDuration()) return;

                        const currentTime = this.ogl.db.options.useClientTime ? localTime.getTime() : serverTime.getTime();
                        const fleetDurationLeft = fleetDispatcher.getDuration() * 1000;
                        const acsDurationLeft = acsEnd - currentTime;
                        const acsDurationLeftWithMaxOffset = acsDurationLeft * 1.3;
                        const timeLeft = acsDurationLeftWithMaxOffset - fleetDurationLeft;
                        const timeEnd = timeLeft > 0 ? this.ogl._time.durationToHMS(timeLeft) : 'Too late';
                        const delta = fleetDurationLeft - acsDurationLeft;

                        spanOffset.className = 'value';
                        spanLeft.className = 'value';
                        spanLeft.textContent = timeEnd;

                        if(fleetDurationLeft > acsDurationLeftWithMaxOffset)
                        {
                            spanOffset.textContent = `Too late`;
                            spanOffset.classList.add('ogl_danger');
                            spanLeft.classList.add('ogl_danger');
                        }
                        else if(fleetDurationLeft > acsDurationLeft)
                        {
                            spanOffset.textContent = `+${new Date(delta).toISOString().slice(11,19)}`;
                            spanOffset.classList.add('ogl_warning');
                            spanLeft.classList.add('ogl_warning');
                        }
                        else
                        {
                            spanOffset.textContent = '+00:00:00';
                            spanOffset.classList.add('ogl_ok');
                            spanLeft.classList.add('ogl_ok');
                        }
                    }, 333);
                }
            }

            if(!fleetDispatcher.mission)
            {
                let urlParams = new URLSearchParams(window.location.search);

                if(urlParams.get('mission')) fleetDispatcher.mission = urlParams.get('mission');
                else fleetDispatcher.mission = this.ogl.db.options.defaultMission;

                fleetDispatcher.refresh();
            }
        });
    }
    
    switchSelfTargetType()
    {
        if(JSON.stringify(fleetDispatcher.realTarget) == JSON.stringify(fleetDispatcher.currentPlanet))
        {
            if(this.ogl.db.options.defaultMission != 1 || (fleetDispatcher.cargoMetal + fleetDispatcher.cargoCrystal + fleetDispatcher.cargoDeuterium > 0) || this.ogl.mode === 2 || this.ogl.mode === 3)
            {
                this.setRealTarget(fleetDispatcher.realTarget, { type:fleetDispatcher.realTarget.type == 1 ? 3 : 1 });
            }
        }
    }

    init()
    {
        this.isReady = true;

        //document.querySelector('.planetlink.active, .moonlink.active')?.classList.add('ogl_disabled');

        // preselect related planet/moon
        /*if(JSON.stringify(fleetDispatcher.realTarget) == JSON.stringify(fleetDispatcher.currentPlanet))
        {
            this.setRealTarget(fleetDispatcher.realTarget, { type:fleetDispatcher.realTarget.type == 1 ? 3 : 1 });
        }*/
        
        this.addLimiters();

        if(this.ogl.mode === 3 && this.ogl.cache.toSend)
        {
            this.prefillTodolistCargo();
        }
        else
        {
            this.ogl.db.harvestCoords = undefined;
        }

        if(this.ogl._dom.warning) return;

        this.updateSpeedBar();

        // save ships data in OGL DB
        this.ogl.shipsList.forEach(shipID =>
        {
            if(fleetDispatcher.fleetHelper.shipsData?.[shipID])
            {
                const data = fleetDispatcher.fleetHelper.shipsData[shipID];
                const tech = this.ogl._dom.tech[shipID];

                this.ogl.db.shipsCapacity[shipID] = data.cargoCapacity || data.baseCargoCapacity;

                if(!tech) return;

                const content = `
                    <div class="ogl_shipDataInfo">
                        <div class="ogl_icon ogl_${shipID}">${data.name}</div><hr>
                        <i class="material-icons">send</i> Amount : <b>${Util.formatNumber(parseInt(tech._ogl.amount.getAttribute('data-value')))}</b><br>
                        <i class="material-icons">package_2</i> Capacity : <b>${Util.formatNumber(data.cargoCapacity || data.baseCargoCapacity)}</b><br>
                        <i class="material-icons">mode_heat</i> Consumption : <b>${Util.formatNumber(data.fuelConsumption)}</b><br>
                        <i class="material-icons">speed</i> Speed : <b>${Util.formatNumber(data.speed)}</b>
                    </div>
                `;

                tech.setAttribute('title', content);
            }
        });

        fleetDispatcher.selectMission((this.ogl.mode === 3 && this.ogl.db.options.defaultMission === 8 ? 3 : parseInt(fleetDispatcher.mission || this.ogl.db.options.defaultMission)));
        fleetDispatcher.speedPercent = fleetDispatcher.speedPercent || 10;
        fleetDispatcher.realSpeedPercent = fleetDispatcher.speedPercent;

        if(this.ogl.mode === 1 || this.ogl.mode === 2)
        {
            fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.shipsForResources());
            fleetDispatcher.selectMaxAll();
        }
        else if(this.ogl.mode === 5 && fleetDispatcher.expeditionCount < fleetDispatcher.maxExpeditionCount)
        {
            this.selectExpedition(this.ogl.db.lastExpeditionShip || this.ogl.db.options.defaultShip);
        }

        if(fleetDispatcher.mission == 8)
        {
            fleetDispatcher.targetPlanet.type = 2;
        }

        fleetDispatcher.refresh();
        fleetDispatcher.focusSubmitFleet1();

        if(this.ogl._dom.secondCol)
        {
            requestAnimationFrame(() =>
            {
                this.ogl._dom.sendAll.classList.add('material-icons');
                this.ogl._dom.sendAll.innerText = 'keyboard_double_arrow_right';
                this.ogl._dom.resetAll.classList.add('material-icons');
                this.ogl._dom.resetAll.innerText = 'exposure_zero';
            });
    
            const sender = Util.addDom('div', { title:'loading...', child:'cube-send', class:'material-icons tooltipRight tooltipClose tooltipClick tooltipUpdate', parent:this.ogl._dom.secondCol, ontooltip:() =>
            {
                const container = Util.addDom('div', { class:'ogl_resourcesPreselection' });
                const resources = ['metal', 'crystal', 'deut', 'food'];

                resources.forEach(resourceName =>
                {
                    const item = Util.addDom('div', { class:`ogl_icon ogl_${resourceName}`, parent:container, onclick:() =>
                    {
                        input.value =  input.value == fleetDispatcher[this.resOnPlanet[resourceName]] ? 0 : fleetDispatcher[this.resOnPlanet[resourceName]];
                        fleetDispatcher[this.cargo[resourceName]] = input.value;
                        input.dispatchEvent(new Event('input'));
                    }});
    
                    const input = Util.addDom('input', { type:'text', parent:item,
                    onclick:e =>
                    {
                        e.stopPropagation();
                    },
                    oninput:() =>
                    {
                        Util.formatInput(input, () =>
                        {
                            input.value = Math.min(fleetDispatcher[this.resOnPlanet[resourceName]], (parseInt(input.value.replace(/\D/g, '')) || 0));
                            fleetDispatcher[this.cargo[resourceName]] = input.value;
                            input.value = (parseInt(input.value.replace(/\D/g, '') || 0)).toLocaleString('fr-FR');
                        });
                    }});
                });
    
                Util.addDom('hr', { parent:container });
    
                Util.addDom('div', { class:'ogl_button ogl_formValidation', child:'OK', parent:container, onclick:() =>
                {
                    let total = 0;
    
                    container.querySelectorAll('input').forEach(input =>
                    {
                        total += parseInt(input.value.replace(/\D/g, '')) || 0;
                    });
    
                    if(total > 0) fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.shipsForResources(false, total));

                    container.querySelectorAll('input').forEach((input, index) => fleetDispatcher[this.cargo[resources[index]]] = parseInt(input.value.replace(/\D/g, '') || 0));
    
                    fleetDispatcher.refresh();
                    setTimeout(() => fleetDispatcher.focusSubmitFleet1(), 50);

                    tippy.hideAll();
                }});
    
                //this.ogl._popup.open(container);
                
                if(sender._tippy)
                {
                    sender._tippy.setContent(container);
                }
                else
                {
                    this.ogl._tooltip.update(container);
                }

                setTimeout(() => container.querySelector('input').focus(), 100);
            }});

            Util.addDom('div', { title:this.ogl._lang.find('fleetQuickCollect'), child:'local_shipping', class:'material-icons tooltip ogl_quickCollectBtn', parent:this.ogl._dom.secondCol, onclick:() =>
            {
                this.ogl._dom.requiredShips.querySelector(`.ogl_${this.ogl.db.options.defaultShip}`)?.click();
            }});

            // todo
            /*Util.addDom('div', { title:this.ogl._lang.find('fleetQuickCollect'), child:'REC <span class="material-icons">fiber_manual_record</span>', class:'tooltip ogl_recordBtn', parent:this.ogl._dom.secondCol, onclick:() =>
            {
                
            }});*/
        }
    }

    setRealTarget(obj, forceParam)
    {
        // set realTarget and inputs
        obj.galaxy = forceParam?.galaxy || obj.galaxy;
        obj.system = forceParam?.system || obj.system;
        obj.position = forceParam?.position || obj.position;
        obj.type = forceParam?.type || obj.type;
        obj.name = forceParam?.name || obj.name;

        fleetDispatcher.realTarget = obj;

        document.querySelector('#galaxy').value = fleetDispatcher.realTarget.galaxy;
        document.querySelector('#system').value = fleetDispatcher.realTarget.system;
        document.querySelector('#position').value = fleetDispatcher.realTarget.position;

        fleetDispatcher.targetPlanet.galaxy = fleetDispatcher.realTarget.galaxy;
        fleetDispatcher.targetPlanet.system = fleetDispatcher.realTarget.system;
        fleetDispatcher.targetPlanet.position = fleetDispatcher.realTarget.position;
        fleetDispatcher.targetPlanet.type = fleetDispatcher.realTarget.type;

        // update the flag icon
        document.querySelectorAll('.smallplanet').forEach(planet =>
        {
            const coords = planet.querySelector('.planet-koords').innerText.split(':');
            planet.querySelector('.ogl_currentDestination')?.classList.remove('ogl_currentDestination');

            if(fleetDispatcher.realTarget.galaxy == coords[0] && fleetDispatcher.realTarget.system == coords[1] && fleetDispatcher.realTarget.position == coords[2])
            {
                const parent = fleetDispatcher.realTarget.type == 1 ? planet.querySelector('.planetlink') : fleetDispatcher.realTarget.type == 3 ? planet.querySelector('.moonlink') : false;
                if(parent) parent.classList.add('ogl_currentDestination');
            }
        });
    }

    fleetSent(defaultRedirection)
    {
        if(this.ajaxSuccess) return;

        this.ajaxSuccess = true;

        // save fleet data
        this.ogl.db.previousFleet = {};
        this.ogl.db.previousFleet.shipsToSend = fleetDispatcher.shipsToSend;
        this.ogl.db.previousFleet.speedPercent = fleetDispatcher.speedPercent;
        this.ogl.db.previousFleet.targetPlanet = JSON.parse(JSON.stringify(fleetDispatcher.targetPlanet)); // unproxify
        this.ogl.db.previousFleet.mission = fleetDispatcher.mission;
        this.ogl.db.previousFleet.expeditionTime = fleetDispatcher.expeditionTime;
        this.ogl.db.previousFleet.cargoMetal = fleetDispatcher.cargoMetal;
        this.ogl.db.previousFleet.cargoCrystal = fleetDispatcher.cargoCrystal;
        this.ogl.db.previousFleet.cargoDeuterium = fleetDispatcher.cargoDeuterium;
        this.ogl.db.previousFleet.cargoFood = fleetDispatcher.cargoFood;

        const conso = parseInt(parseFloat(fleetDispatcher.getConsumption() || 0)); // fleetDispatcher.getConsumption() can return a decimal value

        // update planet resources left
        this.ogl.currentPlanet.obj.metal -= Math.min(this.initialResOnPlanet.metal, fleetDispatcher.cargoMetal);
        this.ogl.currentPlanet.obj.crystal -= Math.min(this.initialResOnPlanet.crystal, fleetDispatcher.cargoCrystal);
        this.ogl.currentPlanet.obj.deut -= Math.min(this.initialResOnPlanet.deut, fleetDispatcher.cargoDeuterium + conso);
        this.ogl.currentPlanet.obj.food -= Math.min(this.initialResOnPlanet.food, fleetDispatcher.cargoFood);

        // add conso to stats
        const stats = this.ogl._stats.getDayStats(this.ogl._time.timeToKey(serverTime.getTime()));
        stats.conso = (stats.conso || 0) + Math.min(this.initialResOnPlanet.deut, conso);

        if(this.isQuickRaid) this.ogl.db.quickRaidList.shift();
        if(this.ogl.mode === 5 && fleetDispatcher.mission !== 15 && this.ogl.db.options.expeditionRedirect) this.ogl.mode = 0;

        if(this.ogl.mode === 1 || this.ogl.mode === 2 || (this.ogl.mode === 5 && this.ogl.db.options.expeditionRedirect))
        {
            //localStorage.setItem('ogl-redirect', this.ogl.nextRedirection);
            //window.location.href = this.ogl.nextRedirection;
            this.ogl._shortcut.redirectToPlanet(1);
        }
        else if(this.ogl.mode === 5)
        {
            this.ogl._shortcut.redirectToPlanet(0);
        }
        else if(this.ogl.mode === 3 && this.ogl.cache.toSend)
        {
            let cumul = [0,0,0];
            let urlParams = new URLSearchParams(window.location.search);
            
            if(urlParams.get('substractMode') && urlParams.get('targetid'))
            {
                const targetID = urlParams.get('targetid');
                cumul[0] -= (this.ogl.db.myPlanets[targetID]?.metal || 0);
                cumul[1] -= (this.ogl.db.myPlanets[targetID]?.crystal || 0);
                cumul[2] -= (this.ogl.db.myPlanets[targetID]?.deut || 0);
            }

            this.ogl.cache.toSend.forEach(build =>
            {                    
                const id = new URLSearchParams(window.location.search).get('targetid');
                const cost = this.ogl.db.myPlanets[id].todolist[build.id][build.level].cost;

                for(let i=0; i<3; i++)
                {
                    let res = i === 2 ? 'deut' : i === 1 ? 'crystal' : 'metal';
                    let cargo = i == 2 ? 'cargoDeuterium' : i == 1 ? 'cargoCrystal' : 'cargoMetal';
                    let newVal = Math.min(fleetDispatcher[cargo] - cumul[i], build.cost[res]);
                    cumul[i] += newVal;

                    cost[res] -= newVal;
                }

                if(build.amount && cost.metal + cost.crystal + cost.deut <= 0) delete this.ogl.db.myPlanets[id].todolist[build.id][build.level];

                if(Object.values(this.ogl.db.myPlanets[id].todolist[build.id]).length < 1)
                {
                    delete this.ogl.db.myPlanets[id].todolist[build.id];
                }
            });

            window.location.href = defaultRedirection;
        }
        else if(this.ogl.mode === 4)
        {
            // save report state (spy table quick raid)
            // prevent to duplicate position when spamming too quick

            const messageID = parseInt(new URLSearchParams(window.location.search).get('oglmsg')) || 0;
            this.ogl._message.initMessageDB();

            if(this.ogl._message.messageDB[messageID])
            {
                this.ogl._message.messageDB[messageID].isAttacked = 1;
                this.ogl._message.saveMessagesDB();
            }

            window.location.href = this.ogl._shortcut.getRedirectionLink({ component:'messages' });
        }
        else
        {
            window.location.href = defaultRedirection;
        }

        this.ogl.save();
    }

    addLimiters()
    {
        // add limiters
        const limiterContainer = this.ogl._dom.component;

        const limiterField = Util.addDom('fieldset', { parent:limiterContainer });
        Util.addDom('legend', { parent:limiterField, child:'<i class="material-icons">settings</i> Settings' });

        const limitResourceLabel = Util.addDom('label', { class:'ogl_limiterLabel tooltip', 'data-limiter-type':'resource', title:this.ogl._lang.find('resourceLimiter'), parent:limiterField, child:'Limit resources' });
        const limitResourceCheckbox = Util.addDom('input', { type:'checkbox', parent:limitResourceLabel, onclick:() =>
        {
            this.ogl.db.fleetLimiter.resourceActive = !this.ogl.db.fleetLimiter.resourceActive;
            this.updateLimiter();
        }});

        const limitShipLabel = Util.addDom('label', { class:'ogl_limiterLabel tooltip', 'data-limiter-type':'ship', title:this.ogl._lang.find('fleetLimiter'), parent:limiterField, child:'Limit ships' });
        const limitShipCheckbox = Util.addDom('input', { type:'checkbox', parent:limitShipLabel, onclick:() =>
        {
            this.ogl.db.fleetLimiter.shipActive = !this.ogl.db.fleetLimiter.shipActive;
            this.updateLimiter();
        }});

        const limitFoodLabel = Util.addDom('label', { class:'ogl_limiterLabel tooltip', title:this.ogl._lang.find('forceIgnoreFood'), parent:limiterField, child:'Ignore Food' });
        const limitFoodCheckbox = Util.addDom('input', { type:'checkbox', parent:limitFoodLabel, onclick:() =>
        {
            this.ogl.db.fleetLimiter.ignoreFood = !this.ogl.db.fleetLimiter.ignoreFood;
            this.updateLimiter();
        }});

        const keepLabel = Util.addDom('div', { class:'ogl_limiterGroup tooltip', title:this.ogl._lang.find('forceKeepCapacity'), parent:limiterField, child:'Locked <i class="material-icons">blocked</i>' });

        [202, 203, 219, 200].forEach(shipID =>
        {
            const item = Util.addDom('div', { class:`ogl_icon ogl_${shipID}`, parent:keepLabel, onclick:() =>
            {
                keepLabel.querySelector('.ogl_active')?.classList.remove('ogl_active');
                item.classList.add('ogl_active');
                this.ogl.db.keepEnoughCapacityShip = shipID;
                this.updateLimiter();
            }});

            if(this.ogl.db.keepEnoughCapacityShip == shipID) item.classList.add('ogl_active');
        });

        if(this.ogl.db.fleetLimiter.resourceActive) limitResourceCheckbox.checked = true;
        if(this.ogl.db.fleetLimiter.shipActive) limitShipCheckbox.checked = true;
        if(this.ogl.db.fleetLimiter.ignoreFood) limitFoodCheckbox.checked = true;

        this.updateLimiter();
    }

    updateLimiter()
    {
        if(!unsafeWindow.fleetDispatcher) return;

        const dataKey = this.ogl.currentPlanet.obj.type == 'moon' ? 'moonData' : 'data';

        this.totalCapacity = 0;

        // ships
        fleetDispatcher.shipsOnPlanet.forEach((entry, index) =>
        {
            let forced = 0;

            if(this.ogl.db.keepEnoughCapacityShip == entry.id && this.ogl.mode !== 1 && this.ogl.mode !== 2)
            {
                forced = this.shipsForResources(entry.id);
            }

            if(this.ogl.db.fleetLimiter.shipActive && this.ogl.db.fleetLimiter[dataKey][entry.id]) entry.number = Math.max(0, this.initialShipsOnPlanet.find(e => e.id == entry.id).number - Math.max(this.ogl.db.fleetLimiter[dataKey][entry.id], forced));
            else entry.number = this.initialShipsOnPlanet.find(e => e.id == entry.id).number - forced;

            if(fleetDispatcher.shipsToSend.find(e => e.id == entry.id)?.number >= entry.number)
            {
                fleetDispatcher.selectShip(entry.id, entry.number);
            }

            const techDom = document.querySelector(`[data-technology="${entry.id}"]`);
            if(techDom)
            {
                techDom.querySelector('.ogl_maxShip')?.remove();
                const text = Util.addDom('div', { class:'ogl_maxShip', parent:techDom });
                text.innerHTML = `<b>-${Util.formatToUnits(this.ogl.db.fleetLimiter.shipActive ? Math.max(this.ogl.db.fleetLimiter[dataKey][entry.id], forced) : forced)}</b>`;
                text.addEventListener('click', () => { Util.runAsync(() => this.ogl._ui.openFleetProfile()).then(e => this.ogl._popup.open(e)); });

                if(!this.ogl.db.fleetLimiter.shipActive && this.ogl.db.keepEnoughCapacityShip != entry.id) text.classList.add('ogl_hidden');
    
                if(entry.number <= 0)
                {
                    techDom.classList.add('ogl_notEnough');
                    fleetDispatcher.removeShip(entry.id);
                }
                else techDom.classList.remove('ogl_notEnough');
    
                this.totalCapacity += this.ogl.db.shipsCapacity[entry.id] * entry.number;

                //techDom.querySelector('input').classList.add('ogl_inputCheck');
            }

            document.querySelectorAll(`.ogl_flashNotEnough`).forEach(e => { if(e.value == 0) e.classList.remove('ogl_flashNotEnough') });
        });

        // resources
        ['metal', 'crystal', 'deut', 'food'].forEach(resourceName =>
        {
            if(this.ogl.db.fleetLimiter.resourceActive)
            {
                fleetDispatcher[this.resOnPlanet[resourceName]] = Math.max(0, this.initialResOnPlanet[resourceName] - (this.ogl.db.fleetLimiter[dataKey][resourceName] || 0));
            }
            else
            {
                fleetDispatcher[this.resOnPlanet[resourceName]] = Math.max(0, this.initialResOnPlanet[resourceName]);
            }

            if(resourceName == 'food' && this.ogl.db.fleetLimiter.ignoreFood) fleetDispatcher[this.resOnPlanet[resourceName]] = 0;

            fleetDispatcher[this.cargo[resourceName]] = Math.min(fleetDispatcher[this.cargo[resourceName]], fleetDispatcher[this.resOnPlanet[resourceName]]);

            const techDom = document.querySelector(`#fleet2 #resources .${resourceName?.replace('deut', 'deuterium')}`);

            if(techDom)
            {
                techDom.querySelector('.ogl_maxShip')?.remove();
                const text = Util.addDom('div', { class:'ogl_maxShip', parent:techDom });
                text.innerHTML = `<b>-${Util.formatToUnits(this.ogl.db.fleetLimiter.resourceActive ? this.ogl.db.fleetLimiter[dataKey][resourceName] : 0, 0)}</b>`;
                text.addEventListener('click', () => { Util.runAsync(() => this.ogl._ui.openFleetProfile()).then(e => this.ogl._popup.open(e)); });

                techDom.parentNode.querySelector('input').classList.add('ogl_inputCheck');
            }
        });

        fleetDispatcher.refresh();
        this.updateRequiredShips();

        initTooltips();
    }

    reverseShip(shipID)
    {
        const delta = fleetDispatcher.shipsOnPlanet.find(e => e.id == shipID)?.number - (fleetDispatcher.findShip(shipID)?.number || 0);
        fleetDispatcher.selectShip(shipID, delta);
        fleetDispatcher.refresh();
    }

    reverseResources(icon)
    {
        let type = icon.classList.contains('metal') ? 'metal' : icon.classList.contains('crystal') ? 'crystal' : icon.classList.contains('deuterium') ? 'deut' : 'food';
        fleetDispatcher[this.cargo[type]] = Math.min(fleetDispatcher[this.resOnPlanet[type]] - fleetDispatcher[this.cargo[type]], fleetDispatcher.getFreeCargoSpace());
        fleetDispatcher.refresh();
    }

    favShip(shipID)
    {
        this.ogl.db.options.defaultShip = shipID;

        if(this.ogl.db.currentSide == 'settings')
        {
            this.ogl.fretShips.forEach(sID =>
            {
                document.querySelector(`.ogl_config [data-opt="defaultShip"] .ogl_${sID}`).classList.remove('ogl_active');
                if(sID == shipID) document.querySelector(`.ogl_config [data-opt="defaultShip"] .ogl_${sID}`).classList.add('ogl_active');
            });
        }

        this.ogl.fretShips.forEach(sID =>
        {
            this.ogl._dom.tech[sID]._ogl.fav.classList.add('ogl_grayed');
        });

        this.ogl._dom.tech[shipID]._ogl.fav.classList.remove('ogl_grayed');

        this.updateLimiter();

        if(this.ogl.mode === 1 || this.ogl.mode === 2)
        {
            this.ogl.fretShips.forEach(sID => fleetDispatcher.selectShip(sID, 0));
            fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.shipsForResources());
            fleetDispatcher.selectMaxAll();
        }
        else if(this.ogl.mode === 3 && this.ogl.cache.toSend)
        {
            this.ogl.fretShips.forEach(sID => fleetDispatcher.selectShip(sID, 0));
            this.prefillTodolistCargo();
        }
    }

    lockShip(shipID)
    {
        this.ogl.db.keepEnoughCapacityShip = this.ogl.db.keepEnoughCapacityShip == shipID ? 200 : shipID; 

        Object.values(this.ogl._dom.tech).forEach(tech =>
        {
            if(tech._ogl.lock)
            {
                if(tech._ogl.id == this.ogl.db.keepEnoughCapacityShip) tech._ogl.lock.classList.remove('ogl_grayed');
                else tech._ogl.lock.classList.add('ogl_grayed');
            }
        });

        document.querySelectorAll('.ogl_limiterGroup .ogl_active').forEach(e => e.classList.remove('ogl_active'));
        document.querySelector(`.ogl_limiterGroup .ogl_${this.ogl.db.keepEnoughCapacityShip}`).classList.add('ogl_active');

        this.updateLimiter();
    }
    
    updateRequiredShips()
    {
        const fragment = document.createDocumentFragment();

        this.ogl.fretShips.forEach(shipID =>
        {
            const amount = this.shipsForResources(shipID);

            const item = Util.addDom('div', { class:`tooltip ogl_required ogl_icon ogl_${shipID}`, title:Util.formatNumber(amount), parent:fragment, child:Util.formatToUnits(amount), onclick:() =>
            {
                fleetDispatcher.selectShip(shipID, amount);
                fleetDispatcher.selectMaxAll();
                fleetDispatcher.refresh();
                fleetDispatcher.focusSubmitFleet1();
            }});

            if((fleetDispatcher.shipsOnPlanet.find(e => e.id == shipID)?.number || 0) < amount) item.classList.add('ogl_notEnough');
        });

        this.ogl._dom.redraw(this.ogl._dom.requiredShips, fragment);

    
        fleetDispatcher.shipsOnPlanet.forEach(entry =>
        {
            const shipID = entry.id;
            const domElement = this.ogl._dom.technology[shipID];

            if(!domElement) return;

            const shipFlag = domElement._ogl.shipFlag;
            shipFlag.innerText = '';
        });

        if(!document.querySelector('.ogl_popup.ogl_active')) fleetDispatcher.focusSubmitFleet1();
    }

    shipsForResources(shipID, resource)
    {
        shipID = shipID || this.ogl.db.options.defaultShip;
        resource = resource === 0 ? 0 : (resource || -1);

        if(resource === -1)
        {
            if(unsafeWindow.fleetDispatcher)
            {
                ['metal', 'crystal', 'deut', 'food'].forEach(resourceName => resource += fleetDispatcher[this.resOnPlanet[resourceName]]);
            }
            else
            {
                ['metal', 'crystal', 'deut', 'food'].forEach(resourceName => resource += this.ogl.currentPlanet?.obj?.[resourceName]) || 0;
            }
        }

        return Math.ceil(resource / this.ogl.db.shipsCapacity[shipID]) || 0;
    }

    selectExpedition(shipID)
    {
        if(fleetDispatcher.fetchTargetPlayerDataTimeout) return;

        this.ogl.mode = 5;

        fleetDispatcher.resetShips();
        fleetDispatcher.resetCargo();

        const coords = [fleetDispatcher.currentPlanet.galaxy, fleetDispatcher.currentPlanet.system, fleetDispatcher.currentPlanet.position];
        const factor = { 202:1, 203:3, 219:5.75 };
        const expeditionData = this.ogl.calcExpeditionMax();

        //const maxResources = this.ogl.db.options.expeditionValue || base * (1 + (cumul[14205] + cumul[14211])) * (1 + cumul[14218]);

        //const maxResources = this.ogl.db.options.expeditionValue || (this.ogl.account.class == 3 ? treshold.max * 3 * this.ogl.server.economySpeed : treshold.max * 2) * (1 + LFbonus / 100);
        const amount = Math.max(this.ogl.db.options.expeditionValue ? 0 : Math.ceil(expeditionData.threshold.base / factor[shipID]), this.shipsForResources(shipID, expeditionData.max));

        let fillerID = 0;

        [218, 213, 211, 215, 207, 206, 205, 204].forEach(filler =>
        {
            if(this.ogl.db.options.expeditionBigShips.indexOf(filler) >= 0 && fillerID == 0 && document.querySelector(`.technology[data-technology="${filler}"] .amount`)?.getAttribute('data-value') > 0) fillerID = filler;
        });

        fleetDispatcher.shipsOnPlanet.forEach(ship =>
        {
            if(ship.id == shipID) fleetDispatcher.selectShip(ship.id, amount);
            else if(ship.id == fillerID && shipID != fillerID) fleetDispatcher.selectShip(ship.id, 1);
            else if(ship.id == 210) fleetDispatcher.selectShip(ship.id, 1);
            else if(ship.id == 219 && shipID != 219) fleetDispatcher.selectShip(ship.id, 1);
        });

        let randomSystem = coords[1];

        if(this.ogl.db.options.expeditionRandomSystem)
        {
            do
            {
                randomSystem = Math.round(Math.random() * this.ogl.db.options.expeditionRandomSystem) * (Math.round(Math.random()) ? 1 : -1) + coords[1];
                if(randomSystem >= 500) randomSystem = randomSystem - 499;
                if(randomSystem <= -1) randomSystem = 499 - randomSystem;
            }
            while(randomSystem === coords[1]);
        }

        this.setRealTarget(fleetDispatcher.realTarget,
        {
            galaxy:coords[0],
            system:randomSystem,
            position:16,
            type:1,
            name:fleetDispatcher.loca.LOCA_EVENTH_ENEMY_INFINITELY_SPACE
        });
    
        fleetDispatcher.selectMission(15);
        fleetDispatcher.expeditionTime = 1;
        fleetDispatcher.updateExpeditionTime();
        fleetDispatcher.refresh();
        fleetDispatcher.focusSubmitFleet1();

        this.ogl.db.lastExpeditionShip = shipID;
    }

    updateSpeedBar()
    {
        // update speed selector
        document.querySelector('#speedPercentage').addEventListener('mousemove', event =>
        {
            document.querySelector('#speedPercentage').querySelectorAll('.selected').forEach(e => e.classList.remove('selected'));
            document.querySelector('#speedPercentage').querySelector(`[data-step="${fleetDispatcher.realSpeedPercent}"]`).classList.add('selected');
        });

        document.querySelector('#speedPercentage').addEventListener('click', e =>
        {
            // fix OGame bug for ff mobile
            if(e.target.getAttribute('data-step'))
            {
                document.querySelector('#speedPercentage .bar').style.width = e.target.offsetLeft + e.target.offsetWidth + 'px';
                document.querySelector('#speedPercentage').querySelectorAll('.selected').forEach(e => e.classList.remove('selected'));
                e.target.classList.add('selected');
                fleetDispatcher.speedPercent = e.target.getAttribute('data-step');
                fleetDispatcher.realSpeedPercent = e.target.getAttribute('data-step');
                fleetDispatcher.refresh();
            }

            fleetDispatcher.realSpeedPercent = fleetDispatcher.speedPercent;
            fleetDispatcher.setFleetPercent(fleetDispatcher.speedPercent);

            if(fleetDispatcher.cargoDeuterium + fleetDispatcher.getConsumption() >= fleetDispatcher.getDeuteriumOnPlanetWithoutConsumption())
            {
                fleetDispatcher.cargoDeuterium = 0;
                fleetDispatcher.selectMaxDeuterium();
                fleetDispatcher.refresh();
            }

            fleetDispatcher.focusSendFleet();
        });
    }

    prefillTodolistCargo()
    {
        let cumul = 0;
        let curmulRes = [0,0,0];
        let max = 0;
        let maxRes = [0, 0, 0];

        this.ogl.cache.toSend.forEach(build =>
        {
            curmulRes[0] = curmulRes[0] + build.cost.metal;
            curmulRes[1] = curmulRes[1] + build.cost.crystal;
            curmulRes[2] = curmulRes[2] + build.cost.deut;
        });
        
        maxRes[0] = Math.min(fleetDispatcher.metalOnPlanet, curmulRes[0]);
        maxRes[1] = Math.min(fleetDispatcher.crystalOnPlanet, curmulRes[1]);
        maxRes[2] = Math.min(fleetDispatcher.deuteriumOnPlanet, curmulRes[2]);

        max = maxRes[0] + maxRes[1] + maxRes[2];

        let urlParams = new URLSearchParams(window.location.search);

        if(urlParams.get('substractMode') && urlParams.get('targetid'))
        {
            const targetID = urlParams.get('targetid');
            curmulRes[0] = Math.max(curmulRes[0] - (this.ogl.db.myPlanets[targetID]?.metal || 0), 0);
            curmulRes[1] = Math.max(curmulRes[1] - (this.ogl.db.myPlanets[targetID]?.crystal || 0), 0);
            curmulRes[2] = Math.max(curmulRes[2] - (this.ogl.db.myPlanets[targetID]?.deut || 0), 0);
        }

        cumul = curmulRes[0] + curmulRes[1] + curmulRes[2];

        fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, this.shipsForResources(this.ogl.db.options.defaultShip, Math.min(cumul, max)));

        if(fleetDispatcher.shipsToSend.length > 0)
        {
            fleetDispatcher.cargoMetal = Math.min(curmulRes[0], fleetDispatcher.metalOnPlanet);
            fleetDispatcher.cargoCrystal = Math.min(curmulRes[1], fleetDispatcher.crystalOnPlanet);
            fleetDispatcher.cargoDeuterium = Math.min(curmulRes[2], fleetDispatcher.deuteriumOnPlanet);
            fleetDispatcher.refresh();
        }
    }

    sendNextMiniFleet()
    {
        if(this.miniFleetQueue.length < 1) return;

        const item = this.miniFleetQueue[0];
        const params =
        {
            mission:item.order,
            galaxy:item.galaxy,
            system:item.system,
            position:item.position,
            type:item.type,
            shipCount:item.ships || this.ogl.db.spyProbesCount,
            token:token,
            uid:item.uid,
            popup:item.popup
        };

        if(item.additionalParams && typeof item.additionalParams === 'object')
        {
            Object.keys(item.additionalParams).map(key =>
            {
                if(!params[key]) params[key] = item.additionalParams[key];
            });
        }

        $.ajax(miniFleetLink,
        {
            data:params,
            dataType:"json",
            type:"POST"
        });
    }

    updateSpyFunctions()
    {
        sendShips = (order, galaxy, system, planet, planettype, shipCount, additionalParams, popup) =>
        {
            const item = {};
            item.order = order;
            item.galaxy = galaxy;
            item.system = system;
            item.position = planet;
            item.type = planettype;
            item.ships = shipCount;
            item.additionalParams = additionalParams;
            item.retry = 0;
            item.uid = crypto.randomUUID();
            item.popup = popup || false;

            document.querySelectorAll(`[onclick*="sendShips(${order}, ${galaxy}, ${system}, ${planet}, ${planettype}"]:not([data-spy-coords])`).forEach(e =>
            {
                e.setAttribute('data-spy-coords', `${galaxy}:${system}:${planet}:${planettype}`);
            });

            document.querySelectorAll(`[data-spy-coords="${galaxy}:${system}:${planet}:${planettype}"]`).forEach(e => e.setAttribute('data-spy', 'prepare'));

            const shouldSend = this.miniFleetQueue.length < 1;
            
            this.miniFleetQueue.push(item);
            if(shouldSend) this.sendNextMiniFleet();
        }

        sendShipsWithPopup = (order, galaxy, system, planet, planettype, shipCount, additionalParams) =>
        {
            sendShips(order, galaxy, system, planet, planettype, shipCount, additionalParams, true);
        }
    }

    checkSendShips()
    {
        // spy
        document.querySelectorAll(`[onclick*="sendShips(6"]:not([data-spy-coords]), [onclick*="sendShipsWithPopup(6"]:not([data-spy-coords])`).forEach(element =>
        {
            const matches = element.getAttribute('onclick').match(/(?<=sendShips[WithPopup]*?\()(.*?)(?=\))/);

            if(matches)
            {
                const params = matches[0].match(/\d+/g)
                element.setAttribute('data-spy-coords', `${params[1]}:${params[2]}:${params[3]}:${params[4]}`);

                const lastSpy = this.ogl.db.pdb[`${params[1]}:${params[2]}:${params[3]}`]?.spy?.[params[4] == 1 ? 0 : 1] || 0;

                if(serverTime.getTime() - lastSpy < this.ogl.db.options.spyIndicatorDelay)
                {
                    element.setAttribute('data-spy', 'recent');
                }
            }
        });

        // df
        document.querySelectorAll(`[onclick*="sendShips(8"]:not([data-spy-coords]), [onclick*="sendShipsWithPopup(8"]:not([data-spy-coords])`).forEach(element =>
        {
            const matches = element.getAttribute('onclick').match(/[sendShips|sendShipsWithPopup]\((\d|,| )+\)/);

            if(matches)
            {
                const params = matches[0].match(/\d+/g)
                element.setAttribute('data-spy-coords', `${params[1]}:${params[2]}:${params[3]}:${params[4]}`);
            }
        });
    }

    updateSystemSpy()
    {
        const self = this;

        document.querySelector('.spysystemlink').addEventListener('click', event =>
        {
            event.preventDefault();
            event.stopPropagation();
            
            const shortcutButton = document.querySelector('[data-key-id="galaxySpySystem"]');
            const targetUrl =  event.target.getAttribute('data-target-url');
            if(!targetUrl) return;

            let hasError = false;

            shortcutButton?.setAttribute('data-spy', 'prepare');

            $.post(targetUrl,
            {
                galaxy:$("#galaxy_input").val(),
                system:$("#system_input").val(),
                token:token
            }, 'json')
            .done(function(json)
            {
                const data = JSON.parse(json);
                token = data.newAjaxToken;

                updateOverlayToken('phalanxDialog', data.newAjaxToken);
                updateOverlayToken('phalanxSystemDialog', data.newAjaxToken);

                if(!data.count)
                {
                    self.ogl._notification.addToQueue(data.text, false);
                    hasError = true;
                }

                data.planets.forEach(params =>
                {
                    document.querySelectorAll(`[data-spy-coords="${params.galaxy}:${params.system}:${params.position}:${params.type}"]`).forEach(e => e.setAttribute('data-spy', 'done'));

                    if(self.ogl.db.pdb[`${params.galaxy}:${params.system}:${params.position}`])
                    {
                        self.ogl.db.pdb[`${params.galaxy}:${params.system}:${params.position}`].spy = self.ogl.db.pdb[`${params.galaxy}:${params.system}:${params.position}`].spy || [];

                        if(params.type == 1)
                        {
                            self.ogl.db.pdb[`${params.galaxy}:${params.system}:${params.position}`].spy[0] = serverTime.getTime();
                        }
                        else
                        {
                            self.ogl.db.pdb[`${params.galaxy}:${params.system}:${params.position}`].spy[1] = serverTime.getTime();
                        }
                    }
                });

                if(hasError) shortcutButton?.setAttribute('data-spy', 'fail');
                else shortcutButton?.setAttribute('data-spy', 'done');
            });
        });
    }
}

class GalaxyManager extends Manager
{
    init()
    {
        if(!this.isReady)
        {
            this.isReady = true;
            this.unloadSystem();
            submitForm();
        }
    }

    load()
    {
        if(this.ogl.page != 'galaxy' || !unsafeWindow.galaxy) return;

        this.galaxy = galaxy;
        this.system = system;

        const loader = document.querySelector('#galaxyLoading');
        loader.setAttribute('data-currentposition', this.galaxy+':'+this.system);

        Util.overWrite('loadContentNew', unsafeWindow, (g, s) =>
        {
            this.unloadSystem();
            loader.setAttribute('data-currentPosition', `${g}:${s}`);
            tippy.hideAll();
        });

        submitForm();

        this.ogl._fleet.updateSystemSpy();
    }

    check(data)
    {
        if(!data.success || !data.system)
        {
            this.ogl._notification.addToQueue(`Error, cannot fetch [${this.galaxy}:${this.system}] data`);
            return;
        }

        let isEmpty = true;

        this.galaxy = data.system.galaxy;
        this.system = data.system.system;

        galaxy = this.galaxy;
        system = this.system;

        document.querySelector('#galaxy_input').value = this.galaxy;
        document.querySelector('#system_input').value = this.system;

        let ptrePositions = {}; // ptre positions data
        let ptreActivities = {}; // ptre activities data

        this.ogl.db.spyProbesCount = data.system.settingsProbeCount || 0;

        let getActivity = element =>
        {
            if(element.activity.showActivity == 15) return '*'; // acti
            else return element.activity.idleTime || 60;
        }
        
        data.system.galaxyContent.forEach(line =>
        {
            const position = line.position;
            const debris = { metal:0, crystal:0, deut:0, total:0 };
            const row = document.querySelector(`#galaxyRow${position}`);

            if(position == 16)
            {
                debris.metal = parseInt(line.planets.resources.metal.amount);
                debris.crystal = parseInt(line.planets.resources.crystal.amount);
                debris.deut = parseInt(line.planets.resources.deuterium.amount);
                debris.total = debris.metal + debris.crystal + debris.deut;

                this.updateDebrisP16(debris, row);
                return;
            }

            const coords = `${this.galaxy}:${this.system}:${position}`;
            const playerID = parseInt(line.player.playerId == 99999 ? -1 : line.player.playerId);
            const playerName = line.player.playerName;
            const playerStatus = Array.from(row.querySelector(`.cellPlayerName span[class*="status_"]`)?.classList || []).filter(e => e.startsWith('status_'))[0];
            const playerStatusTag = this.ogl.playerStatus.find(e => e.class == playerStatus)?.defaultTag || 'n';
            //const playerStatusTag = line.player.isOnVacation ? 'v' : line.player.isLongInactive ? 'I' : line.player.isInactive ? 'i' : 'n';
            const isOwn = playerID == this.ogl.account.id;
            const rank = line.player.highscorePositionPlayer;
            const activities = [];

            let planetID = -1;
            let moonID = -1;
            let moonSize = -1;

            row.querySelector('.cellDebris').classList.remove('ogl_important');
            
            line.planets.forEach(element =>
            {
                if(element.planetType == 1) // planet
                {
                    activities[0] = getActivity(element);
                    planetID = element.isDestroyed ? -1 : parseInt(element.planetId);
                    if(!line.player.isInactive) isEmpty = false;
                }
                else if(element.planetType == 2) // debris
                {
                    debris.metal = parseInt(element.resources.metal.amount);
                    debris.crystal = parseInt(element.resources.crystal.amount);
                    debris.deut = parseInt(element.resources.deuterium.amount);
                    debris.total = debris.metal + debris.crystal + debris.deut;

                    this.updateDebris(debris, row);
                }
                else if(element.planetType == 3) // moon
                {
                    activities[1] = getActivity(element);
                    moonID = element.isDestroyed ? -1 : parseInt(element.planetId);
                    moonSize = parseInt(element.size);
                }
            });

            if(line.player.isAdmin) return;

            const oldEntry = this.ogl.db.pdb[coords] || { pid:-1, mid:-1 };

            if(this.ogl.ptreKey)
            {
                ptrePositions[coords] = {};
                ptrePositions[coords].teamkey = this.ogl.ptreKey;
                ptrePositions[coords].galaxy = this.galaxy;
                ptrePositions[coords].system = this.system;
                ptrePositions[coords].position = position;
                ptrePositions[coords].timestamp_ig = serverTime.getTime();

                ptrePositions[coords].old_player_id = oldEntry.uid || -1;
                ptrePositions[coords].timestamp_api = oldEntry?.api || -1;
                ptrePositions[coords].old_name = oldEntry?.name || false;
                ptrePositions[coords].old_rank = oldEntry?.score?.globalRanking || -1;
                ptrePositions[coords].old_score = oldEntry?.score?.global || -1;
                ptrePositions[coords].old_fleet = oldEntry?.score?.military || -1;

                if(playerID < 0 && oldEntry.pid != planetID) // old:occupied -> now:empty
                {
                    ptrePositions[coords].id = -1;
                    ptrePositions[coords].player_id = -1;
                    ptrePositions[coords].name = false;
                    ptrePositions[coords].rank = -1;
                    ptrePositions[coords].score = -1;
                    ptrePositions[coords].fleet = -1;
                    ptrePositions[coords].status = false;
                    ptrePositions[coords].moon = { id:-1 };
                }
                else if(playerID < 0) // old:empty -> now:empty
                {
                    delete ptrePositions[coords];
                }
            }

            // planet has changed
            if(oldEntry.pid != planetID)
            {
                this.ogl.removeOldPlanetOwner(coords, playerID);
                delete this.ogl.db.pdb[coords];
            }

            // valid player
            if(playerID > 0)
            {
                this.ogl.db.pdb[coords] = this.ogl.db.pdb[coords] || {};

                const player = this.ogl.db.udb[playerID] || this.ogl.createPlayer(playerID);
                const planet = this.ogl.db.pdb[coords];

                if(this.ogl.ptreKey && (oldEntry.pid != planetID || (oldEntry.mid || -1) != moonID)) // planet or moon has changed
                {
                    ptrePositions[coords].id = planetID;
                    ptrePositions[coords].player_id = playerID;
                    ptrePositions[coords].name = playerName || false;
                    ptrePositions[coords].rank = rank || -1;
                    ptrePositions[coords].score = player.score?.global || -1;
                    ptrePositions[coords].fleet = player.score?.military || -1;
                    ptrePositions[coords].status = playerStatusTag;

                    if(moonID > -1)
                    {
                        ptrePositions[coords].moon = {};
                        ptrePositions[coords].moon.id = moonID;
                        ptrePositions[coords].moon.size = moonSize;
                    }

                    console.log(`${coords} | ${oldEntry.pid} -> ${planetID} | ${oldEntry.mid} -> ${moonID}`)
                }
                else // no change
                {
                    delete ptrePositions[coords];
                }

                // update planet data
                planet.uid = playerID;
                planet.pid = planetID;
                planet.mid = moonID;
                planet.coo = coords;

                // update player data
                player.uid = playerID;
                player.name = playerName;
                player.status = playerStatusTag;
                player.liveUpdate = serverTime.getTime();
                player.score = player.score || {};
                player.score.globalRanking = rank;
                player.planets = player.planets || [];
                if(player.planets.indexOf(coords) < 0) player.planets.push(coords);

                this.updateRow(player, row, isOwn, coords);

                // get the activities if the player has been pinned
                if((player.pin || this.ogl.db.lastPinnedList.indexOf(playerID) > -1) && this.ogl.db.pdb[coords])
                {
                    this.ogl.db.pdb[coords].api = serverTime.getTime();
                    this.ogl.db.pdb[coords].acti = [activities[0], activities[1], serverTime.getTime()];
                    this.ogl.db.pdb[coords].debris = debris.total;

                    if(document.querySelector('.ogl_side.ogl_active') && this.ogl.db.currentSide == playerID) this.ogl._topbar.openPinnedDetail(playerID);

                    if(this.ogl.ptreKey)
                    {
                        ptreActivities[coords] = {};
                        ptreActivities[coords].id = planetID;
                        ptreActivities[coords].player_id = playerID;
                        ptreActivities[coords].teamkey = this.ogl.ptreKey;
                        ptreActivities[coords].mv = playerStatusTag == 'v' ? true : false;
                        ptreActivities[coords].activity = activities[0];
                        ptreActivities[coords].galaxy = this.galaxy;
                        ptreActivities[coords].system = this.system;
                        ptreActivities[coords].position = position;
                        ptreActivities[coords].main = this.ogl.db.pdb[coords].home || false;
                        ptreActivities[coords].cdr_total_size = debris.total;
        
                        if(moonID > -1)
                        {
                            ptreActivities[coords].moon = {};
                            ptreActivities[coords].moon.id = moonID;
                            ptreActivities[coords].moon.activity = activities[1];
                        }
                    }
                }
            }
        });

        // send positions data to the PTRE server
        if(Object.keys(ptrePositions).length > 0) this.ogl.PTRE.postPositions(ptrePositions);

        // send acivities data to the PTRE server
        if(Object.keys(ptreActivities).length > 0) this.ogl.PTRE.postActivities(ptreActivities);

        // update galaxy bottom bar
        const galaxyMoreInfo = document.querySelector('.ctGalaxyFooter .ogl_moreGalaxyInfo') ||  Util.addDom('div', { class:'ogl_moreGalaxyInfo' });
        galaxyMoreInfo.innerText = '';

        const timeObj = this.ogl._time.getObj();
        const discovery = Util.addDom('div', { class:'ogl_lastDiscovery tooltip', title:'Last discovery', 'data-galaxy':this.ogl.db.lastDiscovery || '1:1', parent:galaxyMoreInfo, child:`<i class="material-icons">genetics</i>${this.ogl.db.lastDiscovery || '?'}` });
        Util.addDom('div', { class:'ogl_separator', parent:galaxyMoreInfo });
        const empty = Util.addDom('div', { class:'ogl_systemState material-icons tooltip', parent:galaxyMoreInfo });
        Util.addDom('div', { class:'ogl_separator', parent:galaxyMoreInfo });
        const refresh = Util.addDom('div', { class:'ogl_lastGalaxyRefresh tooltip', parent:galaxyMoreInfo, title:'Last galaxy refresh', child:'<span class="material-icons">schedule</span>' });

        requestAnimationFrame(() =>
        {
            refresh.appendChild(this.ogl._time.convertTimestampToDate(this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server));

            if(this.ogl.db.lastDiscovery) discovery.classList.remove('ogl_hidden');

            empty.innerText = 'person_cancel';
            empty.title = isEmpty ? 'This system is "empty"' : 'This system is NOT "empty"';
            isEmpty ? empty.classList.add('ogl_danger') : empty.classList.remove('ogl_danger');

            if(!galaxyMoreInfo.parentElement)
            {
                document.querySelector('.ctGalaxyFooter #colonized').appendChild(galaxyMoreInfo);
            }

            this.checkCurrentSystem();
        });
    }

    updateRow(player, row, isOwn, coords)
    {
        const page = Math.max(1, Math.ceil(player.score.globalRanking / 100));

        this.ogl._ui.turnIntoPlayerLink(player.uid, row.querySelector('.cellPlayerName [class*="status_abbr"]'), player.name, player.status);
        Util.addDom('a', { class:'ogl_ranking', parent:row.querySelector('.cellPlayerName'), href:`${window.location.href.split('?')[0]}?page=highscore&site=${page}&searchRelId=${player.uid}`, child:'#'+player.score.globalRanking });

        if(!isOwn)
        {
            this.ogl._ui.addPinButton(row.querySelector('.cellPlayerName'), player.uid);
            this.ogl._ui.addTagButton(row.querySelector('.cellPlanetName'), coords);
        }

        if(player.uid == this.ogl.db.currentSide)
        {
            row.querySelector('.cellPlayerName').classList.add('ogl_active');
        }
    }

    updateDebris(debris, row)
    {
        if(debris.total > 0)
        {
            const dom = row.querySelector('.microdebris');
            dom.classList.remove('debris_1');

            const ships = dom.querySelector('[onclick*="sendShips(8"]');
            const div = Util.addDom('div', { parent:dom });

            if(ships)
            {
                const params = ships.getAttribute('onclick').match(/\d+/g).map(Number);
                div.setAttribute('data-spy-coords', `${params[1]}:${params[2]}:${params[3]}:2`);
                div.addEventListener('click', () => sendShips(params[0], params[1], params[2], params[3], params[4], params[5]));
            }

            div.innerHTML = Util.formatToUnits(debris.total, 0);

            if(debris.total >= this.ogl.db.options.resourceTreshold)
            {
                div.closest('.cellDebris').classList.add('ogl_important');
            }
        }
    }

    updateDebrisP16(debris, row)
    {
        if(debris.total > 0)
        {
            let content = row.querySelectorAll('.ListLinks li');
            if(!content[0]) content = document.querySelectorAll('#debris16 .ListLinks li');

            let scouts = content[3];
            let action = content[4];

            (document.querySelector('.expeditionDebrisSlotBox .ogl_expeditionRow') || Util.addDom('div', { class:'ogl_expeditionRow', parent:document.querySelector('.expeditionDebrisSlotBox') })).innerHTML = `
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
            `;

            if(debris.total >= this.ogl.db.options.resourceTreshold) document.querySelector('.ogl_expeditionRow').classList.add('ogl_important');
        }

        row.classList.remove('ogl_hidden');
    }

    unloadSystem()
    {
        if(document.querySelector('#galaxyRow16'))
        {
            //if(document.querySelector('.ogl_expeditionRow')) document.querySelector('.ogl_expeditionRow').innerText = '';
            document.querySelector('.ogl_expeditionRow') && document.querySelector('.ogl_expeditionRow').remove();
            document.querySelector('#galaxyRow16').classList.remove('ogl_important');
        }

        for(let i=1; i<16; i++)
        {
            document.querySelectorAll(`#galaxyRow${i} .galaxyCell:not(.cellPosition)`).forEach(e =>
            {
                e.innerText = '';
                e.classList.remove('ogl_important');
                e.classList.remove('ogl_active');
            });

            document.querySelector(`#galaxyRow${i}`).className = 'galaxyRow ctContentRow empty_filter filtered_filter_empty';
        }
    }

    checkCurrentSystem()
    {
        document.querySelectorAll('[data-galaxy]').forEach(element =>
        {
            let coords = element.getAttribute('data-galaxy').split(':');
            if(this.galaxy == coords[0] && this.system == coords[1]) element.classList.add('ogl_active');
            else element.classList.remove('ogl_active');
        });

        if(this.ogl._tooltip) this.ogl._tooltip.initTooltipList(document.querySelectorAll('#galaxyContent .tooltipClick, #galaxyContent .ownPlayerRow, .ogl_moreGalaxyInfo .tooltip'));
        //initTooltips();
        this.ogl._fleet.checkSendShips();
    }
}

class JumpgateManager extends Manager
{
    load()
    {
        this.initialRel = {};

        Util.overWrite('initJumpgate', unsafeWindow, false, () =>
        {
            this.check();
        });

        Util.overWrite('initPhalanx', unsafeWindow, false, () =>
        {
            this.checkPhalanx();
        });

        this.saveTimer();
        this.displayTimer();
    }

    check()
    {
        const parent = document.querySelector('#jumpgate');

        if(!parent || parent.querySelector('.ogl_limiterLabel')) return;

        document.querySelectorAll('#jumpgate .ship_input_row').forEach(line =>
        {
            if(line.previousElementSibling.classList.contains('tdInactive')) return;

            const input = line.querySelector('input');
            const shipID = input.getAttribute('id').replace('ship_', '');
            this.initialRel[shipID] = parseInt(input.getAttribute('rel'));
        });

        const limiterField = Util.addDom('fieldset', { parent:document.querySelector('#jumpgateForm .ship_selection_table') });
        Util.addDom('legend', { parent:limiterField, child:'Settings' });

        const limitShipLabel = Util.addDom('label', { class:'ogl_limiterLabel', parent:limiterField, child:'Ships' });
        const limitShipCheckbox = Util.addDom('input', { type:'checkbox', parent:limitShipLabel, onclick:() =>
        {
            this.ogl.db.fleetLimiter.jumpgateActive = !this.ogl.db.fleetLimiter.jumpgateActive;
            this.updateLimiter();
        }});

        const keepLabel = Util.addDom('div', { class:'ogl_limiterGroup', parent:limiterField, child:'Force (jumpgate)' });

        [202, 203, 219, 200].forEach(shipID =>
        {
            const item = Util.addDom('div', { class:`ogl_icon ogl_${shipID}`, parent:keepLabel, onclick:() =>
            {
                keepLabel.querySelector('.ogl_active')?.classList.remove('ogl_active');
                item.classList.add('ogl_active');
                this.ogl.db.keepEnoughCapacityShipJumpgate = shipID;
                this.updateLimiter();
            }});

            if(this.ogl.db.keepEnoughCapacityShipJumpgate == shipID) item.classList.add('ogl_active');
        });

        if(this.ogl.db.fleetLimiter.jumpgateActive) limitShipCheckbox.checked = true;

        this.updateLimiter();
    }

    updateLimiter()
    {
        if(!document.querySelector('#jumpgate') || document.querySelector('#jumpgateNotReady')) return;

        const sendAllJson = {};
        
        document.querySelectorAll('#jumpgate .ship_input_row').forEach(line =>
        {
            if(line.previousElementSibling.classList.contains('tdInactive')) return;

            const input = line.querySelector('input');
            const shipID = input.getAttribute('id').replace('ship_', '');
            let forced = 0;

            if(this.ogl.db.keepEnoughCapacityShipJumpgate == shipID)
            {
                forced = this.ogl._fleet.shipsForResources(shipID);
            }

            const keeped = Math.max(forced, (this.ogl.db.fleetLimiter.jumpgateActive ? (this.ogl.db.fleetLimiter.jumpgateData[shipID] || 0) : 0));
            const amount = Math.max(0, this.initialRel[shipID] - keeped);
            input.setAttribute('rel', amount);
            if(input.value > amount) input.value = amount;

            line.previousElementSibling.querySelector('.quantity').setAttribute('onclick', `toggleMaxShips('#jumpgateForm', ${shipID}, ${amount})`);
            line.previousElementSibling.querySelector('a').setAttribute('onclick', `toggleMaxShips('#jumpgateForm', ${shipID}, ${amount})`);

            let text = line.querySelector('.ogl_keepRecap') || Util.addDom('div', { parent:line, class:'ogl_keepRecap' });
            text.innerText = `-${keeped}`;
            text.addEventListener('click', () => { Util.runAsync(() => this.ogl._ui.openFleetProfile()).then(e => this.ogl._popup.open(e)); });

            sendAllJson[shipID] = amount;
        });

        document.querySelector('#jumpgate #sendall').setAttribute('onclick', `setMaxIntInput("#jumpgateForm", ${JSON.stringify(sendAllJson)})`);
    }

    checkPhalanx()
    {
        const parent = document.querySelector('.ui-dialog .phalanx').parentElement.querySelector('.ui-dialog-titlebar .ui-dialog-title');
        this.lastPhalanxRefresh = Date.now();
        if(parent.querySelector('.ogl_phalanxLastRefresh')) return;

        const refresh =  Util.addDom('span', { class:'ogl_phalanxLastRefresh', parent:parent, child:'<b>0s</b>' });

        setInterval(() =>
        {
            refresh.innerText = `${Math.floor(( Date.now() - this.lastPhalanxRefresh) / 1000)}s`;
        }, 500);

        /*
        const clock = document.querySelector('.OGameClock').cloneNode(true);
        clock.className='';

        container.appendChild(clock);
        const refresh =  Util.addDom('span', { parent:container, child:' - <b>0s</b>' });
        
        setInterval(() =>
        {
            const currentTime = parseInt(document.querySelector('.OGameClock').getAttribute('data-time-server'));
            const refreshTime = parseInt(clock.getAttribute('data-time-server'));

            refresh.innerHTML = ` - <b>${Math.round((currentTime - refreshTime) / 1000)}s</b>`;
        }, 1000);*/
    }

    saveTimer()
    {
        const calcTimer = level =>
        {
            return (0.25 * Math.pow(level, 2) - 7.57 * level + 67.34) / this.ogl.server.warFleetSpeed * 60000;
        }
        
        jumpgateDone = a =>
        {
            var a = $.parseJSON(a);

            if(a.status)
            {
                planet = a.targetMoon;
                $(".overlayDiv").dialog("destroy");

                const originID = this.ogl.currentPlanet.obj.id;
                const originLevel = this.ogl.currentPlanet.dom._ogl.jumpgateLevel;
                const destinationLevel = this.ogl._dom.planet[jumpGateTargetId].getAttribute('data-jumpgatelevel');

                const now = serverTime.getTime();
                this.ogl.db.myPlanets[originID].jumpgateTimer = now + calcTimer(originLevel);
                this.ogl.db.myPlanets[jumpGateTargetId].jumpgateTimer = now + calcTimer(destinationLevel);
            }

            errorBoxAsArray(a.errorbox);
            if(typeof(a.newToken) != "undefined") setNewTokenData(a.newToken);
        }
    }

    displayTimer()
    {
        document.querySelectorAll('.moonlink').forEach(moon =>
        {
            const targetDom = moon.parentNode.querySelector(`.ogl_sideIconInfo`) || Util.addDom('div', { class:'ogl_sideIconInfo tooltip', 'title':'Jumpgate not ready', parent:moon.parentNode });
            const moonID = moon.getAttribute('href').match(/cp=(\d+)/)[1];

            if(this.ogl.db.myPlanets[moonID]?.jumpgateTimer > serverTime.getTime())
            {
                const updateTimer = () => new Date(this.ogl.db.myPlanets[moonID].jumpgateTimer - (serverTime.getTime() + 3600000)).toLocaleTimeString([], { minute:'2-digit', second:'2-digit' });

                const div = Util.addDom('div', { class:'ogl_jumpgateTimer', parent:targetDom, child:updateTimer() });

                let interval = setInterval(() =>
                {
                    if(this.ogl.db.myPlanets[moonID].jumpgateTimer <= serverTime.getTime())
                    {
                        clearInterval(interval);
                        div.remove();
                    }
                    else div.innerText = updateTimer();
                }, 1000);
            }
        });
    }
}

class AccountManager extends Manager
{
    load()
    {
        this.buildingList = [1, 2, 3, 4, 12, 14, 15, 21, 22, 23, 24, 31, 33, 34, 36, 44];
        this.buildingListMoon = [14, 21, 41, 42, 43];
        this.defenseList = [401, 402, 403, 404, 405, 406, 407, 408, 502];
        this.shipsList = [...this.ogl.shipsList, 217];
        this.fleetEconomyHalfValue = [202, 203, 208, 210, 209, 217];

        this.calcCumul();
        this.calcScore();
    }

    openSummary(fetchData)
    {
        if(fetchData)
        {
            this.ogl._popup.open(Util.addDom('div', { child:'<h2>Fetching account data, please wait</h2><div class="ogl_blocCenter ogl_loading"></div>' }));
            this.ogl._fetch.fetchMainData(() => this.openSummary(), true);
        }
        else
        {
            if(this.ogl._popup.isActive())
            {
                this.calcCumul();
                this.openMethod(this.ogl.db.lastAccountTab, this.ogl.db.lastAccountTab);
            }
        }
    }

    openEmpire()
    {
        const content = Util.addDom('div', { class:'ogl_accountContainer ogl_accountMain', child:
        `
            <div class="ogl_accountRank">
                <i class="material-icons">crown</i>
                <div class="ogl_accountScore">${Util.formatToUnits(this.score.global)} pts</div>
                <div class="ogl_accountRanking">#${Util.formatNumber(this.ranking.global)}</div>
                <div class="ogl_accountGraph"></div>
            </div>
            <div class="ogl_accountRank ogl_accountEconomy">
                <i class="material-icons">diamond</i>
                <div class="ogl_accountScore">${Util.formatToUnits(this.score.economy)} pts</div>
                <div class="ogl_accountRanking">#${Util.formatNumber(this.ranking.economy)}</div>
                <div class="ogl_accountProduction">
                    <div class="ogl_icon ogl_metal">${Util.formatNumber(this.cumul.planet.mineMetal / this.cumul.planet.count, 1)}</div>
                    <div class="ogl_icon ogl_crystal">${Util.formatNumber(this.cumul.planet.mineCrystal / this.cumul.planet.count, 1)}</div>
                    <div class="ogl_icon ogl_deut">${Util.formatNumber(this.cumul.planet.mineDeut / this.cumul.planet.count, 1)}</div>
                    <div class="ogl_icon ogl_metal ogl_plus">+${Util.formatToUnits(Math.round((this.cumul.planet.prodMetal || 0) * 3600 * 24))}</div>
                    <div class="ogl_icon ogl_crystal ogl_plus">+${Util.formatToUnits(Math.round((this.cumul.planet.prodCrystal || 0) * 3600 * 24))}</div>
                    <div class="ogl_icon ogl_deut ogl_plus">+${Util.formatToUnits(Math.round((this.cumul.planet.prodDeut || 0) * 3600 * 24))}</div>
                    <div class="ogl_icon ogl_113">${this.ogl.currentPlanet.obj[113]}</div>
                    <div class="ogl_icon ogl_122">${this.ogl.currentPlanet.obj[122]}</div>
                    <div class="ogl_icon ogl_124">${this.ogl.currentPlanet.obj[124]}</div>
                </div>
            </div>
            <div class="ogl_accountRank ogl_accountFleet">
                <i class="material-icons">rocket_launch</i>
                <div class="ogl_accountScore">${Util.formatToUnits(this.score.fleet)} pts</div>
                <div class="ogl_accountRanking">#${Util.formatToUnits(this.ranking.fleet)}</div>
                <div class="ogl_accountProduction">
                    <div class="ogl_icon ogl_109">${this.ogl.currentPlanet.obj[109]}</div>
                    <div class="ogl_icon ogl_110">${this.ogl.currentPlanet.obj[110]}</div>
                    <div class="ogl_icon ogl_111">${this.ogl.currentPlanet.obj[111]}</div>
                    <div class="ogl_icon ogl_115">${this.ogl.currentPlanet.obj[115]}</div>
                    <div class="ogl_icon ogl_117">${this.ogl.currentPlanet.obj[117]}</div>
                    <div class="ogl_icon ogl_118">${this.ogl.currentPlanet.obj[118]}</div>
                </div>
            </div>
            <div class="ogl_accountRank ogl_accountLifeform">
                <i class="material-icons">genetics</i>
                <div class="ogl_accountScore">${Util.formatToUnits(this.score.lifeform)} pts</div>
                <div class="ogl_accountRanking">#${Util.formatNumber(this.ranking.lifeform)}</div>
                <div class="ogl_accountProduction">
                    <div class="ogl_icon ogl_lifeform1">${(this.ogl.db.lfBonuses?.lifeform1?.bonus || 0) * 10}</div>
                    <div class="ogl_icon ogl_lifeform2">${(this.ogl.db.lfBonuses?.lifeform2?.bonus || 0) * 10}</div>
                    <div class="ogl_icon ogl_lifeform3">${(this.ogl.db.lfBonuses?.lifeform3?.bonus || 0) * 10}</div>
                    <div class="ogl_icon ogl_lifeform4">${(this.ogl.db.lfBonuses?.lifeform4?.bonus || 0) * 10}</div>
                </div>
            </div>
        `});

        const icons =
        {
            'global':'crown',
            'economy':'diamond',
            'research':'science',
            'fleet':'rocket_launch',
            'defense':'security',
            'lifeform':'genetics',
        }

        Object.entries(this.scorePercent).forEach(entry =>
        {
            Util.addDom('div', { class:'ogl_accountBar', parent:content.querySelector('.ogl_accountGraph'), child:`<label data-value="(${entry[1]}%)">${icons[entry[0]]}</label>`, style:`height:${Math.ceil(parseFloat(entry[1] || 0) / 2)}px` });
        });

        const container = Util.addDom('div', { class:'ogl_accountSummary' });
        container.appendChild(this.addTabs('empire'));
        container.appendChild(content);
        this.ogl._popup.open(container);
    }

    openProduction()
    {
        const container = Util.addDom('div', { class:'ogl_accountSummary' });
        container.appendChild(this.addTabs('production'));

        const grid = Util.addDom('div', { class:'ogl_accountContainer ogl_accountEmpire ogl_grid', parent:container });

        Util.addDom('div', { class:'ogl_line', parent:grid, child:
        `
            <div>Coords</div>
            <div>P</div>
            <div>M</div>
            <div>Name</div>
            <div>Fields</div>
            <div>T°c</div>
            <div>LF</div>
            <div class="ogl_icon ogl_metal"></div>
            <div class="ogl_icon ogl_crystal"></div>
            <div class="ogl_icon ogl_deut"></div>
        `});

        document.querySelectorAll('.smallplanet .planetlink').forEach(item =>
        {
            const planet = this.ogl.db.myPlanets[item._ogl.id];
            if(!planet) return;

            const metalUpgrade = Object.values(planet.upgrades?.baseBuilding || {}).find(e => e.id == 1);
            const crystalUpgrade = Object.values(planet.upgrades?.baseBuilding || {}).find(e => e.id == 2);
            const deutUpgrade = Object.values(planet.upgrades?.baseBuilding || {}).find(e => e.id == 3);

            const line = Util.addDom('div', { class:'ogl_line', parent:grid, child:
            `
                <div data-galaxy="${planet.coords}">${planet.coords}</div>
                <a href="${item.getAttribute('href')}"><img src="${item.querySelector('.planetPic')?.getAttribute('src')}"></a>
                ${
                    item._ogl.moonLink
                    ? `<a href="${item._ogl.moonLink.getAttribute('href')}"><img src="${item._ogl.moonLink.querySelector('.moonlink img')?.getAttribute('src')}"></a>`
                    : '<div>-</div>'
                }
                <div>${item._ogl.name}</div>
                <div>${planet.fieldUsed}/${planet.fieldMax} (<span>${planet.fieldMax-planet.fieldUsed}</span>)</div>
                <div class="ogl_temperature">${planet.temperature}°c</div>
                <div class="ogl_icon ogl_lifeform${planet.lifeform || 0}"></div>
                <div class="ogl_metal">
                    <strong>${planet[1]}</strong>
                    <div class="ogl_upgrade">${metalUpgrade ? `(${metalUpgrade.lvl})` : ``}</div>
                    <small>+${Util.formatToUnits(Math.round((planet.prodMetal || 0) * 3600 * 24))}</small>
                </div>
                <div class="ogl_crystal">
                    <strong>${planet[2]}</strong>
                    <div class="ogl_upgrade">${crystalUpgrade ? `(${crystalUpgrade.lvl})` : ``}</div>
                    <small>+${Util.formatToUnits(Math.round((planet.prodCrystal || 0) * 3600 * 24))}</small>
                </div>
                <div class="ogl_deut">
                    <strong>${planet[3]}</strong>
                    <div class="ogl_upgrade">${deutUpgrade ? `(${deutUpgrade.lvl})` : ``}</div>
                    <small>+${Util.formatToUnits(Math.round((planet.prodDeut || 0) * 3600 * 24))}</small>
                </div>
            `});

            const temperature = line.querySelector('.ogl_temperature');

            if(planet.temperature >= 110) temperature.style.color = "#af644d"; // too hot
            else if(planet.temperature >= 10) temperature.style.color = "#af9e4d"; // hot
            else if(planet.temperature >= -40) temperature.style.color = "#4daf67"; // normal
            else if(planet.temperature >= -140) temperature.style.color = "#4dafa6"; // cold
            else temperature.style.color = "#4d79af"; // too cold
        });

        Util.addDom('div', { class:'ogl_line', parent:grid, child:
        `
            <div class="ogl_invisible"></div>
            <div class="ogl_invisible"></div>
            <div class="ogl_invisible"></div>
            <div class="ogl_invisible"></div>
            <div class="ogl_invisible"></div>
            <div class="ogl_invisible"></div>
            <div class="ogl_invisible"></div>
            <div class="ogl_metal">
                <strong>${Util.formatNumber(this.cumul.planet.mineMetal / this.cumul.planet.count, 1)}</strong>
                <small>+${Util.formatToUnits(Math.round((this.cumul.planet.prodMetal || 0) * 3600 * 24))}</small>
            </div>
            <div class="ogl_crystal">
                <strong>${Util.formatNumber(this.cumul.planet.mineCrystal / this.cumul.planet.count, 1)}</strong>
                <small>+${Util.formatToUnits(Math.round((this.cumul.planet.prodCrystal || 0) * 3600 * 24))}</small>
            </div>
            <div class="ogl_deut">
                <strong>${Util.formatNumber(this.cumul.planet.mineDeut / this.cumul.planet.count, 1)}</strong>
                <small>+${Util.formatToUnits(Math.round((this.cumul.planet.prodDeut || 0) * 3600 * 24))}</small>
            </div>
        `});

        this.ogl._popup.open(container);
    }

    openPlanets(type, tech)
    {
        type = type || 'planets'; // planets / moons
        tech = tech || 'buildings'; // buildings / ships / defenses / lifeforms

        let cumulFleetPercent = 0;
        const list = type == 'planets' ? this.buildingList : this.buildingListMoon;

        const container = Util.addDom('div', { class:'ogl_accountSummary' });
        container.appendChild(this.addTabs(type, tech));

        const grid = Util.addDom('div', { class:'ogl_accountContainer ogl_accountShips ogl_grid', parent:container });
        const header = Util.addDom('div', { class:'ogl_line', parent:grid, child:`<div>Coords</div>` });

        // headers
        if(tech =='ships')
        {
            ['metal', 'crystal', 'deut', ...this.shipsList].forEach(itemID =>
            {
                Util.addDom('div', { class:`ogl_icon ogl_${itemID} tooltip`, parent:header, title:this.ogl._lang.find(itemID) });
            });

            Util.addDom('div', { parent:header, child:'%' });
        }
        else if(tech == 'defenses')
        {
            this.defenseList.forEach(itemID =>
            {
                Util.addDom('div', { class:`ogl_icon ogl_${itemID} tooltip`, parent:header, title:this.ogl._lang.find(itemID) });
            });
        }
        else if(tech == 'buildings')
        {
            list.forEach(itemID =>
            {
                Util.addDom('div', { class:`ogl_icon ogl_${itemID} tooltip`, parent:header, title:this.ogl._lang.find(itemID) });
            });
        }

        const selector = type == 'planets' ? '.smallplanet .planetlink' : '.smallplanet .moonlink';

        document.querySelectorAll(selector).forEach(item =>
        {
            const planet = this.ogl.db.myPlanets[item._ogl.id];
            if(!planet) return;

            const line = Util.addDom('div', { class:'ogl_line', parent:grid, child:`<div data-galaxy="${planet.coords}">${planet.coords}</div>` });

            // lines
            if(tech =='ships')
            {
                let fleetValue = 0;

                ['metal', 'crystal', 'deut', ...this.shipsList].forEach(itemID =>
                {
                    const entry = Util.addDom('div', { class:`ogl_${itemID}`, 'data-amount':planet[itemID] || 0, parent:line, child:Util.formatToUnits(planet[itemID], 0) });
                    const shipValueScaling = this.fleetEconomyHalfValue.indexOf(itemID) > -1 ? .5 : 1;

                    if(!isNaN(itemID))
                    {
                        const shipValue = Object.values(Datafinder.getTech(itemID)).reduce((sum, value) => sum + value, 0) / 1000 * planet[itemID] * shipValueScaling;
                        entry.dataset.value = shipValue;
                        fleetValue += shipValue;
                    }
                });

                const fleetPercent = fleetValue / this.score.fleet * 100;
                const percent = Util.addDom('div', { parent:line, child:`<div>${Util.formatNumber(Math.min(100, fleetPercent), 1)}%</div>` });

                if(fleetPercent >= 30) percent.style.color = "#af644d"; // too hot
                else if(fleetPercent >= 20) percent.style.color = "#af9e4d"; // hot
                else if(fleetPercent >= 10) percent.style.color = "#4daf67"; // normal
                else if(fleetPercent >= 5) percent.style.color = "#4dafa6"; // cold
                else percent.style.color = "#4d79af"; // too cold

                cumulFleetPercent += fleetPercent;
            }
            else if(tech == 'defenses')
            {
                this.defenseList.forEach(itemID =>
                {
                    Util.addDom('div', { class:`ogl_${itemID}`, 'data-amount':planet[itemID] || 0, parent:line, child:Util.formatToUnits(planet[itemID], 0) });
                });
            }
            else if(tech == 'buildings')
            {
                list.forEach(itemID =>
                {
                    Util.addDom('div', { class:`ogl_${itemID}`, 'data-amount':planet[itemID] || 0, parent:line, child:Util.formatToUnits(planet[itemID], 0) });
                });
            }
        });

        const footer = Util.addDom('div', { class:'ogl_line', parent:grid, child:`<div>Total</div>` });
        
        // footer
        if(tech =='ships')
        {
            ['metal', 'crystal', 'deut', ...this.shipsList].forEach(itemID =>
            {
                const amount = this.cumul[type.replace('s', '')]?.[itemID] || 0;
                Util.addDom('div', { class:`ogl_${itemID}`, 'data-amount':amount, parent:footer, child:Util.formatToUnits(amount, 0) });
            });

            Util.addDom('div', { parent:footer, child:`${Util.formatToUnits(cumulFleetPercent, 1)}%` });
        }
        else if(tech =='defenses')
        {
            this.defenseList.forEach(itemID =>
            {
                const amount = this.cumul[type.replace('s', '')]?.[itemID] || 0;
                Util.addDom('div', { class:`ogl_${itemID}`, 'data-amount':amount, parent:footer, child:Util.formatToUnits(amount, 0) });
            });
        }
        else if(tech =='buildings')
        {
            list.forEach(itemID =>
            {
                const amount = this.cumul[type.replace('s', '')]?.[itemID] || 0;
                Util.addDom('div', { class:`ogl_${itemID}`, 'data-amount':amount, parent:footer, child:Util.formatToUnits(amount, 0) });
            });
        }

        this.ogl._popup.open(container);
    }

    openMoons(type, tech)
    {
        this.openPlanets(type, tech);
    }

    calcCumul()
    {
        this.cumul = { planet:{}, moon:{} };

        Object.values(this.ogl.db.myPlanets).forEach(planet =>
        {
            if(!planet.type || (planet.type != 'planet' && planet.type != 'moon')) return;

            this.cumul[planet.type].metal = (this.cumul[planet.type].metal || 0) + (planet.metal || 0);
            this.cumul[planet.type].crystal = (this.cumul[planet.type].crystal || 0) + (planet.crystal || 0);
            this.cumul[planet.type].deut = (this.cumul[planet.type].deut || 0) + (planet.deut || 0);

            this.cumul[planet.type].mineMetal = (this.cumul[planet.type].mineMetal || 0) + (planet[1] || 0);
            this.cumul[planet.type].mineCrystal = (this.cumul[planet.type].mineCrystal || 0) + (planet[2] || 0);
            this.cumul[planet.type].mineDeut = (this.cumul[planet.type].mineDeut || 0) + (planet[3] || 0);

            this.cumul[planet.type].prodMetal = (this.cumul[planet.type].prodMetal || 0) + planet.prodMetal;
            this.cumul[planet.type].prodCrystal = (this.cumul[planet.type].prodCrystal || 0) + planet.prodCrystal;
            this.cumul[planet.type].prodDeut = (this.cumul[planet.type].prodDeut || 0) + planet.prodDeut;

            this.cumul[planet.type].count = (this.cumul[planet.type].count  || 0) + 1;
            this.cumul[planet.type]['lifeform'+(planet.lifeform || 0)] = (this.cumul[planet.type]['lifeform'+(planet.lifeform || 0)] || 0) + 1;

            [...this.shipsList].forEach(techID => this.cumul[planet.type][techID] = (this.cumul[planet.type][techID] || 0) + planet[techID]);
            this.defenseList.forEach(techID => this.cumul[planet.type][techID] = (this.cumul[planet.type][techID] || 0) + planet[techID]);
            this.buildingList.forEach(techID => this.cumul[planet.type][techID] = (this.cumul[planet.type][techID] || 0) + planet[techID]);
            this.buildingListMoon.forEach(techID => this.cumul[planet.type][techID] = (this.cumul[planet.type][techID] || 0) + planet[techID]);
        });
    }

    calcScore()
    {
        this.score = {};
        this.scorePercent = {};
        this.ranking = {};

        const player = this.ogl.db.udb[this.ogl.account.id];
        if(!player) return;

        this.score.global = player.score.global;
        this.score.economy = player.score.economy;
        this.score.research = player.score.research;
        this.score.lifeform = player.score.lifeform;
        this.score.fleet = Util.getPlayerScoreFD(player.score, 'fleet');
        this.score.defense = Util.getPlayerScoreFD(player.score, 'defense');

        this.ranking.global = player.score.globalRanking;
        this.ranking.economy = player.score.economyRanking;
        this.ranking.research = player.score.researchRanking;
        this.ranking.lifeform = player.score.lifeformRanking;
        this.ranking.fleet = player.score.militaryRanking;
        this.ranking.defense = player.score.militaryRanking;

        this.scorePercent.global = 100;
        this.scorePercent.economy = Util.formatNumber(this.score.economy / this.score.global * 100, 2);
        this.scorePercent.research = Util.formatNumber(this.score.research / this.score.global * 100, 2);
        this.scorePercent.lifeform = Util.formatNumber(this.score.lifeform / this.score.global * 100, 2);
        this.scorePercent.fleet = Util.formatNumber(this.score.fleet / this.score.global * 100, 2);
        this.scorePercent.defense = Util.formatNumber(this.score.defense / this.score.global * 100, 2);
    }

    addTabs(activeType, activeTech)
    {
        const items =
        [
            { title:'empire', icon:'account_balance', type:'empire' },
            { title:'production', icon:'factory', type:'production' },
            //{ title:'research', icon:'science', type:'research' },
            {
                title:'planets', icon:'planet', type:'planets',
                subItems: [
                    { title:'buildings', icon:'diamond', tech:'buildings' },
                    { title:'ships', icon:'rocket_launch', tech:'ships' },
                    { title:'defenses', icon:'security', tech:'defenses' },
                    //{ title:'lifeforms', icon:'genetics', tech:'lifeforms' },
                ]
            },
            {
                title:'moons', icon:'bedtime', type:'moons',
                subItems: [
                    { title:'buildings', icon:'diamond', tech:'buildings' },
                    { title:'ships', icon:'rocket_launch', tech:'ships' },
                    { title:'defenses', icon:'security', tech:'defenses' },
                    //{ title:'lifeforms', icon:'genetics', tech:'lifeforms' },
                ]
            },
        ];

        const container = Util.addDom('div');
        const tabs = Util.addDom('div', { class:'ogl_tabs', parent:container });
        const subtabs = Util.addDom('div', { class:'ogl_tabs', parent:container });

        items.forEach(item =>
        {
            const btn = Util.addDom('div', { class:'ogl_tab', child:`<i class="material-icons">${item.icon}</i><span>${item.title}</span>`, parent:tabs, onclick:e =>
            {
                this.openMethod(item);
            }});

            if(activeType == item.type)
            {
                btn.classList.add('ogl_active');

                if(!item.subItems) return;

                item.subItems.forEach(subItem =>
                {
                    const subbtn = Util.addDom('div', { class:'ogl_tab', child:`<i class="material-icons">${subItem.icon}</i><span>${subItem.title}</span>`, parent:subtabs, onclick:e =>
                    {
                        this.openMethod(item, subItem);
                    }});

                    if(activeTech == subItem.tech)
                    {
                        subbtn.classList.add('ogl_active');
                    }
                });
            }

            

            //if(activeType == item.type && activeTech == item.tech) btn.classList.add('ogl_active');
        });

        return container;
    }

    openMethod(item, subItem)
    {
        if(!item || !item.type)
        {
            this.ogl.db.lastAccountTab = { type:'empire' };
            this.openEmpire();
        }
        else
        {
            const methodName = `open${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`;

            if(typeof this[methodName] === 'function')
            {
                this.ogl.db.lastAccountTab = { type:item.type, tech:subItem?.tech };
                this[methodName](item.type, subItem?.tech);
            }
            else
            {
                this.ogl.db.lastAccountTab = { type:'empire' };
                this.openEmpire();
            }
        }
    }
}

class TooltipManager extends Manager
{
    load()
    {
        this.openTimeout;
        this.lastSender;
        this.lastActiveSender;
        this.shouldWait = false;
                
        if(unsafeWindow['tippy'])
        {
            Util.overWrite('initTooltips', unsafeWindow, null, () =>
            {
                this.initTooltipList(document.querySelectorAll(getTooltipSelector()));
            });
        }

        this.tooltip = Util.addDom('div',
        {
            class:'ogl_tooltip',
            parent:document.body
        });

        // fix resources tooltips
        if(!document.querySelector('#metal_box')?.getAttribute('title')) getAjaxResourcebox();

        if(unsafeWindow['tippy']) initTooltips();
        else this.init();
    }

    initTooltipList(nodeList)
    {
        this.lastReference = false;

        nodeList.forEach(element =>
        {
            if(!element._tippy?.oglTooltipReady)
            {
                if(element.title && !element.getAttribute('data-tooltip-title')) element.setAttribute('data-tooltip-title', element.title);
                element.removeAttribute('title');

                if(!element._tippy)
                {
                    const getDirection = () =>
                    {
                        return element.classList.contains('tooltipBottom') ? 'bottom' :
                            element.classList.contains('tooltipRight') ? 'right' :
                            element.classList.contains('tooltipLeft') ? 'left' : 'top';
                    }

                    tippy(element,
                    {
                        content:element.getAttribute('data-tooltip-title'),
                        allowHTML:true,
                        appendTo:document.body,
                        zIndex:1000001,
                        placement:getDirection(),
                        interactive:element.getAttribute('data-tooltip-interactive') || false,
                        maxWidth:400
                    });
                }

                if(element._tippy)
                {
                    element._tippy.setProps(
                    {
                        animation:'pop',
                        delay:[element.classList.contains('tooltipClick') ? 0 : 400 , null],
                        duration: [100, 10],
                        interactive:(element.classList.contains('tooltipClose') || element.classList.contains('tooltipRel')) ? true : false,
                        interactiveBorder:15,
                        interactiveDebounce:75,
                        trigger:element.classList.contains('tooltipClick') ? 'click focus' : 'mouseenter focus',
                        onShow:instance =>
                        {
                            if(this.lastReference !== instance.reference) return false;

                            tippy.hideAll();
                            let content = instance.props.content || element.getAttribute('data-tooltip-title');

                            if(element.classList.contains('planetlink')) content = this.updatePlanetMenuTooltip(instance, 'planet') ?? content;
                            else if(element.classList.contains('moonlink')) content = this.updatePlanetMenuTooltip(instance, 'moon') ?? content; 
                            else if(typeof content == 'string' && content.indexOf('class="fleetinfo') >= 0) content = this.updateFleetTooltip(instance);

                            if(!content || content === false || content === '') return false;
                            else if(content) instance.setContent(content);

                            if(element.classList.contains('tooltipUpdate'))
                            {
                                element.dispatchEvent(this.ogl.tooltipEvent);
                            }

                            instance.popper.classList.add('ogl_noTouch');
                        },
                        onTrigger:instance =>
                        {
                            //tippy.hideAll();
                            this.lastReference = instance.reference;
                            element.removeAttribute('title');
                        },
                        onShown:instance =>
                        {
                            instance.popper.classList.remove('ogl_noTouch');
                            this.ogl._fleet.checkSendShips();
                        },
                        onHide:instance =>
                        {
                            if(this.lastReference === instance.reference) this.lastReference = false;
                        }
                    });

                    element._tippy.oglTooltipReady = true;

                    element.classList.add('ogl_ready');
                }
            }
        });
    }

    updatePlanetMenuTooltip(instance, refType)
    {
        if(this.ogl.db.options.disablePlanetTooltips) return false;
        if(instance.oglContentInjected) return;

        if(refType == 'planet')
        {
            instance.setProps({ placement:'left' });

            const planetID = instance.reference.parentNode.getAttribute('id').replace('planet-', '');
            const name = instance.reference.querySelector('.planet-name').innerText;
            const data = this.ogl.db.myPlanets[planetID];
            const div = Util.addDom('div', { class:'ogl_planetTooltip' });
            const links = new DOMParser().parseFromString(instance.props.content, 'text/html').querySelectorAll('a');

            if(!data) return;

            div.innerHTML =
            `
                <div>
                    <h3>${name}<br><span data-galaxy="${data.coords}">[${data.coords}]</span></h3>
                    <div>
                        ${
                            data?.lifeform
                            ? `<div class="ogl_icon ogl_lifeform${data.lifeform}"></div>`
                            : ``
                        }
                        <div>${instance.reference.querySelector('.planetPic').outerHTML}</div>
                    </div>
                    <div class="ogl_planetTooltipData">
                        <div class="ogl_textCenter"><i class="material-icons">flex_wrap</i>${data.fieldUsed}/${data.fieldMax}</div>
                        <div class="ogl_textCenter"><i class="material-icons">device_thermostat</i>${data.temperature + 40}°c</div>
                    </div>
                    <div class="ogl_mineRecap"><span class='ogl_metal'>${data[1]}</span> <span class='ogl_crystal'>${data[2]}</span> <span class='ogl_deut'>${data[3]}</span></div>
                </div>
            `;

            const linkDiv = Util.addDom('div', { class:'ogl_linkDiv', parent:div });
            links.forEach(e => linkDiv.appendChild(e));

            if(this.ogl._topbar?.PlanetBuildingtooltip[planetID])
            {
                div.appendChild(this.ogl._topbar?.PlanetBuildingtooltip[planetID]);
            }

            instance.oglContentInjected = true;
            return div.outerHTML;
        }
        else if(refType == 'moon')
        {
            instance.setProps({ placement:'right' });

            const urlParams = new URLSearchParams(instance.reference.getAttribute('href'));
            const planetID = urlParams.get('cp').split('#')[0];
            const name = instance.reference.querySelector('.icon-moon').getAttribute('alt');
            const data = this.ogl.db.myPlanets[planetID];
            const div = Util.addDom('div', { class:'ogl_planetTooltip' });
            const links = new DOMParser().parseFromString(instance.props.content, 'text/html').querySelectorAll('a');
            const jumpgate = instance.reference.dataset.jumpgatelevel || '0';

            if(!data) return;

            div.innerHTML =
            `
                <div>
                    <h3>${name}<br><span data-galaxy="${data.coords}">[${data.coords}]</span></h3>
                    <div>
                        ${
                            data?.lifeform
                            ? `<div class="ogl_icon ogl_lifeform${data.lifeform}"></div>`
                            : ``
                        }
                        <div>${instance.reference.querySelector('.icon-moon').outerHTML}</div>
                    </div>
                    <div class="ogl_planetTooltipData">
                        <div class="ogl_textCenter"><i class="material-icons">flex_wrap</i>${data.fieldUsed}/${data.fieldMax}</div>
                        <div class="ogl_textCenter"><i class="material-icons">door_back</i>${jumpgate}</div>
                    </div>
                </div>
            `;

            const linkDiv = Util.addDom('div', { class:'ogl_linkDiv', parent:div });
            links.forEach(e => linkDiv.appendChild(e));

            if(this.ogl._topbar?.PlanetBuildingtooltip[planetID])
            {
                div.appendChild(this.ogl._topbar?.PlanetBuildingtooltip[planetID]);
            }

            instance.oglContentInjected = true;
            return div.outerHTML;
        }
    }

    updateFleetTooltip(instance)
    {
        const sender = instance.reference;
        const xml = new DOMParser().parseFromString(instance.props.content, 'text/html');
        const div = Util.addDom('div', { class:'ogl_fleetDetail' });

        let origin = (sender.closest('.eventFleet')?.querySelector('.coordsOrigin') || sender.closest('.fleetDetails')?.querySelector('.originData a'))?.innerText.slice(1, -1);
        origin = origin || { galaxy:0, system:0, position:0 };
        let originType = (sender.closest('.eventFleet')?.querySelector('.originFleet figure.moon') || sender.closest('.fleetDetails')?.querySelector('.originPlanet figure.moon')) ? 'moon' : 'planet';

        let destination = (sender.closest('.eventFleet')?.querySelector('.destCoords') || sender.closest('.fleetDetails')?.querySelector('.destinationData a'))?.innerText.slice(1, -1);
        destination = destination || { galaxy:0, system:0, position:0 };
        let destinationType = (sender.closest('.eventFleet')?.querySelector('.destFleet figure.moon') || sender.closest('.fleetDetails')?.querySelector('.destinationPlanet figure.moon')) ? 'moon' : 'planet';

        const meAsAttacker = Array.from(document.querySelectorAll('.planet-koords')).find(e => e.innerText == origin) ? true : false;
        const meAsDefender = Array.from(document.querySelectorAll('.planet-koords')).find(e => e.innerText == destination) ? true : false;

        let rawText = '';
        let trashsimData =
        {
            ships:{},
            meAsAttacker:meAsAttacker,
            meAsDefender:meAsDefender,
            origin:{ coords:origin, type:originType },
            destination:{ coords:destination, type:destinationType }
        };

        xml.querySelectorAll('tr').forEach(line =>
        {
            const name = line.querySelector('td')?.innerText.replace(':', '');
            const key = Object.entries(this.ogl.db.serverData).find(entry => entry[1] === name)?.[0];
            const value = line.querySelector('.value')?.innerText.replace(/\.|,| /g, '');

            if(key && value)
            {
                if(key == 'metal') Util.addDom('hr', { parent:div });

                const val = key == 'metal' || key == 'crystal' || key == 'deut' || key == 'food' ? Util.formatNumber(parseInt(value)) : Util.formatToUnits(value);

                Util.addDom('div', { parent:div, class:`ogl_icon ogl_${key}`, child:val });
                trashsimData.ships[key] = { count:value };

                rawText += `${name}: ${Util.formatNumber(parseInt(value))}\n`;
            }
        });

        if(rawText.length > 0 && !xml.querySelector('.ogl_custom'))
        {
            const container = Util.addDom('span', { parent:div, class:'ogl_fullgrid' });
            Util.addDom('hr', { parent:container });
            const btn = Util.addDom('button',
            {
                class:'ogl_button',
                parent:container,
                child:'<span class="material-icons">file_copy</span><span>Copy</span>',
                onclick:() =>
                {
                    GM_setClipboard(rawText, 'text');
                    btn.classList.remove('material-icons');
                    btn.innerText = 'Copied!';
                }
            });

            if(origin)
            {
                Util.addDom('div',
                {
                    class:'ogl_button',
                    parent:container,
                    child:'<span class="material-icons">play_arrow</span><span>Simulate</span>',
                    onclick:() => 
                    {
                        window.open(Util.genTrashsimLink(this.ogl, false, trashsimData), '_blank');
                    }
                });
            }
        }

        if(rawText.length > 0) return div;
        else return false;
    }
}

class NotificationManager extends Manager
{
    load()
    {
        this.data = {};
        this.blocks = [];
        this.interval;
        this.hideTimer = 5000;
        this.step = 200;
        this.currentValue = this.hideTimer;
        
        this.start = 0;
        this.timeLeft = this.hideTimer;
        this.elapsedInterval;
        this.notification = Util.addDom('div', { class:'ogl_notification', parent:document.body,
        onmouseenter:() =>
        {
            clearInterval(this.interval);
        },
        onmouseleave:() =>
        {
            this.interval = setInterval(() => this.updateClock(), this.step);
        },
        onclick:() =>
        {
            this.close();
        }});

        this.clock = Util.addDom('progress', { parent:this.notification, min:0, max:this.hideTimer, value:this.currentValue });
        this.content = Util.addDom('div', { parent:this.notification });

        setInterval(() =>
        {
            Object.values(this.ogl.db.browserNotificationList).forEach(notif =>
            {
                if(notif.arrivalTime <= serverTime.getTime())
                {
                    this.triggerBrowserNotification(notif);
                }
            });
        }, 10000);
    }

    open()
    {
        this.content.innerText = '';
        if(this.ogl._message.events?.mission) this.ogl._message.events.mission = 0;

        const data = {};
        let blockCount = 0;

        this.blocks.forEach(block =>
        {
            let icon = Util.addDom('i');
            if(block.success > 0) icon = Util.addDom('i', { class:'material-icons ogl_ok', child:'done' });
            else if(block.success < 0) icon = Util.addDom('i', { class:'material-icons ogl_danger', child:'alert' });

            if(block.data)
            {
                Object.entries(block.data).forEach(entry =>
                {
                    data[entry[0]] = (data[entry[0]] || 0) + (entry[1] || 0);
                });
            }

            if(block.message)
            {
                const timeObj = this.ogl._time.getObj(block.time);
                const time = this.ogl._time.timeToHMS(this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server);
                const line = Util.addDom('div', { class:'ogl_notificationLine', child:`${icon.outerHTML}<b class="ogl_notificationTimer">[${time}]</b>` + block.message, prepend:this.content });
                if(block.success < 0) line.classList.add('ogl_danger');
            }
            else
            {
                blockCount++;
            }
        });

        if(blockCount > 0)
        {
            const timeObj = this.ogl._time.getObj();
            const time = this.ogl._time.timeToHMS(this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server);
            Util.addDom('div', { class:'ogl_notificationLine', child:`<b class="ogl_notificationTimer">[${time}]</b>` + `${blockCount} mission(s) added`, prepend:this.content });
        }

        if(Object.keys(data).length > 0)
        {
            let hasResources = false;
            let hasShips = false;
            let hasLifeforms = false;
            let hasExpeditions = false;

            const grid = Util.addDom('div', { class:'ogl_grid', prepend:this.content });

            ['metal', 'crystal', 'deut', 'dm'].forEach(type =>
            {
                if(data[type])
                {
                    Util.addDom('div', { class:`ogl_icon ogl_${type}`, child:Util.formatToUnits(data[type]), parent:grid });
                    hasResources = true;
                }
            });

            if(hasResources) Util.addDom('hr', { parent:grid });

            this.ogl.shipsList.forEach(type =>
            {
                if(data[type])
                {
                    Util.addDom('div', { class:`ogl_icon ogl_${type}`, child:Util.formatToUnits(data[type]), parent:grid });
                    hasShips = true;
                }
            });

            if(hasShips) Util.addDom('hr', { parent:grid });

            ['artefact', 'lifeform1', 'lifeform2', 'lifeform3', 'lifeform4'].forEach(type =>
            {
                if(data[type])
                {
                    Util.addDom('div', { class:`ogl_icon ogl_${type}`, child:Util.formatToUnits(data[type]), parent:grid });
                    hasLifeforms = true;
                }
            });

            if(hasLifeforms) Util.addDom('hr', { parent:grid });

            ['blackhole', 'trader', 'early', 'late', 'pirate', 'alien'].forEach(type =>
            {
                if(data[type])
                {
                    Util.addDom('div', { 'data-resultType':type, class:`ogl_icon ogl_${type}`, child:Util.formatToUnits(data[type]), parent:grid });
                    hasExpeditions = true;
                }
            });

            if(hasExpeditions) Util.addDom('hr', { parent:grid });
        }

        this.currentValue = this.hideTimer;
        this.notification.classList.add('ogl_active');
        clearInterval(this.interval);
        this.interval = setInterval(() => this.updateClock(), this.step);
    }

    addToQueue(message, success, data)
    {
        this.blocks.push({ time:serverTime.getTime(), message:message, data:data, success:(success = success === true ? 1 : success === false ? -1 : 0) });
        this.blocks.sort((a, b) => a.time - b.time);
        this.blocks = this.blocks.filter(e => serverTime.getTime() < e.time + this.hideTimer);
    
        this.open();
    }

    updateClock()
    {
        this.currentValue -= this.step;
        this.clock.value = this.currentValue;
        if(this.currentValue < 0) this.close();
    }

    close()
    {
        clearInterval(this.interval);
        this.notification.classList.remove('ogl_active');
    }

    triggerBrowserNotification(data)
    {
        if(Notification.permission === 'granted')
        {
            const notif = new Notification(`OGame - ${this.ogl.server.name}.${this.ogl.server.lang}`,
            {
                body:data.message,
                requireInteraction:true,
            });

            notif.addEventListener('show', () =>
            {
                delete this.ogl.db.browserNotificationList[data.id];
            });
        }
        
        /*GM_notification(
        {
            title:`OGame - ${this.ogl.server.name}.${this.ogl.server.lang}`,
            text:notif.message
        });

        delete this.ogl.db.browserNotificationList[notif.id];*/
    }

    addNotification(data, sender)
    {
        if(Notification.permission === 'default')
        {
            Notification.requestPermission().then(permission =>
            {
                if(Notification.permission === 'granted')
                {
                    this.addNotification(data, sender);
                }
            });
        }
        else if(Notification.permission === 'granted')
        {
            if(!this.ogl.db.browserNotificationList[data.id])
            {
                this.ogl.db.browserNotificationList[data.id] = data;
                sender.classList.add('ogl_active');
            }
            else
            {
                delete this.ogl.db.browserNotificationList[data.id];
                sender.classList.remove('ogl_active');
                sender.classList.remove('ogl_altered');
            }
        }
        else
        {
            alert('You have to enable notifications in your browser setting !');
        }
    }

    testNotification()
    {
        const browserNotification = {};
        browserNotification.id = '-99999999';
        browserNotification.arrivalTime = serverTime.getTime() + 10000;
        browserNotification.message = `Test`;

        this.ogl.db.browserNotificationList[browserNotification.id] = browserNotification;
    }
}

class PopupManager extends Manager
{
    load()
    {
        this.popup = Util.addDom('div', {class:'ogl_popup', parent:document.body});

        this.popup.addEventListener('click', event =>
        {
            if(event.target === this.popup) this.close();
        });

        //visualViewport.addEventListener('resize', () => this.updatePosition());
        //visualViewport.addEventListener('scroll', () => this.updatePosition());
    }

    open(dom, canShare)
    {
        tippy.hideAll();
        this.popup.innerText = '';

        if(!dom) return;

        Util.addDom('div',
        {
            class:'ogl_close material-icons',
            child:'close',
            prepend:dom,
            onclick:() =>
            {
                this.close();
            }
        });

        if(canShare)
        {
            Util.addDom('div',
            {
                class:'ogl_share material-icons',
                child:'photo_camera',
                prepend:dom,
                onclick:event =>
                {
                    event.target.classList.add('ogl_disabled');
                    Util.takeScreenshot(this.popup.querySelector('div'), event.target, `ogl_${this.ogl.server.id}_${this.ogl.server.lang}_empire_${serverTime.getTime()}`);
                }
            });
        }

        dom.classList.add('ogl_popupContent');
        this.popup.appendChild(dom);
        this.popup.classList.add('ogl_active');
        initTooltips();
    }

    close()
    {
        this.popup.classList.remove('ogl_active');
    }

    updatePosition()
    {
        const div = this.popup;
        div.style.top = visualViewport.offsetTop + 'px';
        div.style.height = visualViewport.height - 25 + 'px';
        div.style.left = visualViewport.offsetLeft + 'px';
        div.style.width = visualViewport.width + 'px';
    }

    isActive()
    {
        return this.popup.classList.contains('ogl_active');
    }
}

class MessageManager extends Manager
{
    load()
    {
        this.initSpyTable();

        if(this.ogl.page !== 'messages') return;

        this.counterSpiesList = [];
        this.initMessageDB();
        this.tabID = this.tabID || 20;
        this.deleteList = [];
        this.dialogDelay = 0;

        Util.overWrite('paginatorPrevious', unsafeWindow.ogame.messages, false, () => { if(this.tabID != 20) this.checkTab() });
        Util.overWrite('paginatorNext', unsafeWindow.ogame.messages, false, () => { if(this.tabID != 20) this.checkTab() });
        Util.overWrite('paginatorFirst', unsafeWindow.ogame.messages, false, () => { if(this.tabID != 20) this.checkTab() });
        Util.overWrite('paginatorLast', unsafeWindow.ogame.messages, false, () => { if(this.tabID != 20) this.checkTab() });

        // occurs if OGL loads after ogame messages
        if(document.querySelector('.msg'))
        {
            this.checkTab();
        }

        setTimeout(() => this.checkBoard(), 400);
        this.addBoardTab();
    }

    initMessageDB()
    {
        this.messageDBName = this.ogl.DBName + '_messages';
        const data = GM_getValue(this.messageDBName) || {};
        this.messageDB = typeof data === typeof '' ? JSON.parse(data) : {};
    }

    saveMessagesDB()
    {
        if(this.ogl.page !== 'messages' && this.ogl.page !== 'fleetdispatch') return;

        try
        {
            GM_setValue(this.messageDBName, JSON.stringify(this.messageDB));
        }
        catch(error)
        {
            console.log(error);
        }
    }

    purgeMessageDB()
    {
        this.messageDB = {};
        this.saveMessagesDB();
    }

    checkTab()
    {
        document.querySelector('.ogl_boardMessageTab')?.classList.remove('marker');

        this.readMessagesData();

        if(this.tabID == 20 && this.ogl.db.options.displaySpyTable)
        {
            Util.runAsync(() => this.loadSpyTable());
        }
    }

    initSpyTable()
    {
        this.spytable = Util.addDom('div', { class:'ogl_spytable' });
        this.ogl.db.spytableFilters = this.ogl.db.spytableFilters || { age:'ASC', rawCoords:false, playerName:false, wave1:false, fleetValue:false, defValue:false };
        this.filterOrder = { age:'DESC', rawCoords:'ASC', playerName:'ASC', wave1:'DESC', fleetValue:'DESC', defValue:'DESC' };

        Util.addDom('div',
        {
            class:'ogl_spyHeader',
            parent:this.spytable,
            child:
            `
                <b class="ogl_textCenter">#</b>
                <b class="material-icons" data-filter="age">schedule</b>
                <b class="ogl_textCenter">*</b>
                <b class="ogl_textCenter">&nbsp;</b>
                <b data-filter="rawCoords">coords</b>
                <b data-filter="playerName">name</b>
                <b data-filter="wave1">${this.ogl.db.options.spyTableMSU ? 'MSU' : 'loot'}</b>
                <b class="material-icons" data-filter="fleetValue">rocket_launch</b>
                <b class="material-icons" data-filter="defValue">security</b>
                <b class="ogl_spytableSettings">
                    <div class="material-icons ogl_button tooltip" title="Clean reports" data-action="broom">mop</div>
                    <div class="material-icons ogl_button tooltip" title="Ignore rules" data-action="ignore" data-label="0">block</div>
                    <div class="material-icons ogl_button tooltip" title="Highlight rules" data-action="highlight" data-label="0">star</div>
                </b>
            `,
            onclick:event =>
            {
                let broom = event.target.dataset?.action == 'broom';
                let ignore = event.target.dataset?.action == 'ignore';
                let highlight = event.target.dataset?.action == 'highlight';
                let filter = event.target.getAttribute('data-filter');

                if(!filter && !ignore && !highlight && !broom) return;

                if(filter)
                {
                    Object.keys(this.ogl.db.spytableFilters).forEach(key =>
                    {
                        if(filter.replace('DESC', '') == key)
                        {
                            if(this.ogl.db.spytableFilters[key] == 'ASC')
                            {
                                this.ogl.db.spytableFilters[key] = 'DESC';
                            }
                            else if(this.ogl.db.spytableFilters[key] == 'DESC')
                            {
                                this.ogl.db.spytableFilters[key] = 'ASC';
                            }
                            else
                            {
                                this.ogl.db.spytableFilters[key] = this.filterOrder[key];
                            }
                        }
                        else this.ogl.db.spytableFilters[key] = false;
                    });

                    this.loadSpyTable();
                }
                
                if(ignore || highlight)
                {
                    this.openSpyTableRules(event.target.dataset.action);
                }

                if(broom)
                {
                    this.counterSpiesList.forEach(e => this.deleteList.push(e));
                    this.counterSpiesList = [];
                    this.loadSpyTable(false, true);
                }
            }
        });
    }

    readMessagesData()
    {
        this.ptreCounterSpies = {};

        const messageIds = [];
        const xml = new DOMParser().parseFromString(ogame.messages.content.join(''), 'text/html');
        xml.querySelectorAll('.msg').forEach(xmlLine =>
        {
            const rawData = xmlLine.querySelector('.rawMessageData');
            if(!rawData) return;

            const message = {};
            message.id = xmlLine.getAttribute('data-msg-id');
            message.globalTypeID = rawData.dataset.rawMessagetype;
            message.date = this.ogl._time.getObj(parseInt(rawData.dataset.rawTimestamp || rawData.dataset.rawDatetime || 0) * 1000, 'client');
            message.api = rawData.dataset.rawHashcode;
            message.playerID = rawData.dataset.rawTargetplayerid;
            messageIds.push(message.id);

            const dom = document.querySelector(`[data-msg-id="${message.id}"]`);

            if(dom)
            {
                this.ogl._time.update(false, dom.querySelector('.msgDate:not(.ogl_updated)'));
                if(dom.querySelector('.icon_apikey') && message.api) dom.querySelector('.icon_apikey').setAttribute('data-api-code', message.api);
            }

            // clean counter spies
            if(this.ogl.db.options.autoCleanCounterSpies && message.playerID == this.ogl.account.id)
            {
                this.deleteList.push(message.id);
            }

            if(this.messageDB[message.id] && this.messageDB[message.id].msu !== undefined)
            {
                // we need to update "attacked" state if the report already exist
                this.messageDB[message.id].isAttacked = parseInt(rawData.dataset.rawAttacking || '0');
                return;
            }

            if((this.tabID == 20 || this.tabID == 25) && this.ogl.db.options.displaySpyTable) // spies
            {
                this.readSpyData(message, xmlLine, rawData, dom);
            }
            else if(this.tabID == 21) // combat
            {
                if(message.globalTypeID == 25) this.readCombatData(message, xmlLine, rawData, dom);
                else if(message.globalTypeID == 48) this.readProbeData(message, xmlLine, rawData, dom);
            }
            else if(this.tabID == 22) // expeditions & discoveries
            {
                this.readExpeditionData(message, xmlLine, rawData, dom);
            }
            else if(this.tabID == 23 || this.tabID == 24) // cargo & debris
            {
                this.readOtherData(message, xmlLine, rawData, dom);
            }
        });

        if(this.tabID == 20)
        {
            // clean old report then update changes
            this.messageDB = Object.fromEntries(Object.entries(this.messageDB).filter(([id]) => messageIds.includes(id)));
            this.saveMessagesDB();

            if(Object.keys(this.ptreCounterSpies).length > 0)
            {
                this.ogl.PTRE.postActivities(this.ptreCounterSpies);
                this.ptreCounterSpies = {};
            }
        }

        if(this.tabID == 21 || this.tabID == 22 || this.tabID == 24)
        {
            this.ogl._stats.showMiniRecap();
        }

        initTooltips();
        this.ogl._fleet.checkSendShips();
    }

    readSpyData(message, xmlLine, rawData, dom)
    {
        const rawStatusClass = Array.from(xmlLine.querySelector(`.playerName span[class*="status_"]`)?.classList || []).filter(e => e.startsWith('status_'))[0];

        message.planetID = rawData.dataset.rawTargetplanetid;
        message.isCounterSpy = message.playerID == this.ogl.account.id;
        message.playerName = rawData.dataset.rawPlayername;
        message.playerStatus = this.ogl.playerStatus.find(e => e.class == rawStatusClass)?.defaultTag || 'n';
        message.targetType = rawData.dataset.rawTargetplanettype == 1 ? 'planet' : 'moon';
        message.targetTypeID = rawData.dataset.rawTargetplanettype;
        message.coords = rawData.dataset.rawCoordinates;
        message.rawCoords = Util.coordsToID(message.coords);
        message.age = parseInt(message.date.server);
        message.isActive = parseInt(rawData.dataset.rawActive);
        message.activity = parseInt(rawData.dataset.rawActivity);
        message.resources = parseInt(rawData.dataset.rawResources);
        message.metal = parseInt(rawData.dataset.rawMetal);
        message.crystal = parseInt(rawData.dataset.rawCrystal);
        message.deut = parseInt(rawData.dataset.rawDeuterium);
        message.msu = Util.getMSU(message.metal, message.crystal, message.deut, this.ogl.db.options.msu);
        message.hiddenFleet = rawData.dataset.rawHiddenships == 1 ? true : false;
        message.hiddenDef = rawData.dataset.rawHiddendef == 1 ? true : false;
        message.fleet = rawData.dataset.rawFleet == '-' ? {} : JSON.parse(rawData.dataset.rawFleet || '{}');
        message.def = rawData.dataset.rawDefense == '-' ? {} : JSON.parse(rawData.dataset.rawDefense || '{}');
        message.loot = parseInt(rawData.dataset.rawLoot);
        message.fleetValue = message.hiddenFleet ? -1 : parseInt(rawData.dataset.rawFleetvalue || 0);
        message.defValue = message.hiddenDef ? -1 : parseInt(rawData.dataset.rawDefensevalue || 0);
        message.techs = rawData.dataset.rawResearch == '-' ? {} : JSON.parse(rawData.dataset.rawResearch || '{}');
        message.isAttacked = parseInt(rawData.dataset.rawAttacking);

        if(message.playerID == 99999) return; // p16

        if(message.activity == -1 || !message.isActive && message.activity < 15) message.activity = 60;
    
        if(message.isCounterSpy)
        {
            message.sourceID = rawData.dataset.rawSourceplayerid;
            message.sourceCoords = rawData.dataset.rawSourceplanetcoordinates;

            const coords = message.sourceCoords.split(':');

            if(this.ogl.ptreKey)
            {
                this.ptreCounterSpies[message.id] = {};
                this.ptreCounterSpies[message.id].player_id = message.sourceID;
                this.ptreCounterSpies[message.id].teamkey = this.ogl.ptreKey;
                this.ptreCounterSpies[message.id].galaxy = coords[0];
                this.ptreCounterSpies[message.id].system = coords[1];
                this.ptreCounterSpies[message.id].position = coords[2];
                this.ptreCounterSpies[message.id].spy_message_ts = parseInt(message.date.client);
                this.ptreCounterSpies[message.id].moon = {};
                this.ptreCounterSpies[message.id].activity = '*';
                this.ptreCounterSpies[message.id].moon.activity = '*';

                this.counterSpiesList.push(message.id);
            }

            if(dom) 
            {
                setTimeout(() => this.ogl._ui.turnIntoPlayerLink(message.sourceID, dom.querySelector('.tooltipCustom.player')));
            }
        }
        else
        {
            if(this.ogl.db.udb[message.playerID])
            {
                if(message.techs?.[124]) this.ogl.db.udb[message.playerID].astro = message.techs[124];
                this.ogl.db.udb[message.playerID].name = message.playerName;
                this.ogl.db.udb[message.playerID].status = message.playerStatus;
                this.ogl.db.udb[message.playerID].liveUpdate = serverTime.getTime();
            }

            const resources = message.resources;
            const loot = message.loot / 100;

            for(let i = 1; i <= 6; i++)
            {
                message['wave' + i] = Math.floor(resources * Math.pow(1 - loot, i - 1) * loot);
            }

            this.messageDB[message.id] = message;
        }
    }

    readExpeditionData(message, xmlLine, rawData, dom)
    {
        message.lifeform = parseInt(rawData.dataset.rawLifeform || 0);
        message.expeditionResult = rawData.dataset.rawExpeditionresult;
        message.resources = JSON.parse(rawData.dataset.rawResourcesgained?.replace('deuterium', 'deut')?.replace('darkMatter', 'dm') || '{}');
        message.artefact = parseInt(rawData.dataset.rawArtifactsfound || 0);
        message.lfXP = parseInt(rawData.dataset.rawLifeformgainedexperience || 0);
        message.ships = {};
        message.delay = JSON.parse(rawData.dataset.rawNavigation || '{ "returnTimeAbsoluteIncreaseHours":0, "returnTimeMultiplier":1 }');
        message.item = JSON.parse(rawData.dataset.rawItemsgained || '{}');
        message.depletion = parseInt(rawData.dataset.rawDepletion || 0);
        message.size = parseInt((rawData.dataset.rawSize || rawData.dataset.rawArtifactssize || '-1').replace('normal', '2').replace('big', '1').replace('huge', '0'));
        message.shipLost = {};

        for(let [lossID, amount] of Object.entries(JSON.parse(rawData.dataset.rawShipslost || '{}')))
        {
            message.shipLost[-lossID] = amount;
        }

        const backListedSize = ['nothing', 'trader', 'blackhole', 'lifeform'];

        if(message.globalTypeID == 61) // discoveries
        {
            if(message.artefact > 0) message.resultType = 'artefact';
            else if(message.lfXP > 0) message.resultType = 'lifeform';
            else message.resultType = 'nothing';
        }
        else
        {
            if(message.expeditionResult == 'ressources') message.resultType = 'resource';
            else if(message.expeditionResult == 'darkmatter') message.resultType = 'darkmatter';
            else if(message.expeditionResult == 'nothing') message.resultType = 'nothing';
            else if(message.expeditionResult == 'shipwrecks') message.resultType = 'ship';
            else if(message.expeditionResult == 'trader') message.resultType = 'trader';
            else if(message.expeditionResult == 'items') message.resultType = 'item';
            else if(message.expeditionResult == 'fleetLost') message.resultType = 'blackhole';
            else if(message.expeditionResult == 'navigation' && message.delay.returnTimeMultiplier < 1) message.resultType = 'early';
            else if(message.expeditionResult == 'navigation' && (message.delay.returnTimeMultiplier > 1 || message.delay.returnTimeAbsoluteIncreaseHours >= 0)) message.resultType = 'late';
            else if(message.expeditionResult == 'combatPirates') message.resultType = 'pirate';
            else if(message.expeditionResult == 'combatAliens') message.resultType = 'alien';
        }

        Object.entries(JSON.parse(rawData.dataset.rawTechnologiesgained || '{}')).forEach(ship =>
        {
            message.ships[ship[0]] = ship[1].amount;
        });

        message.gain = { ...message.resources, ...message.ships, ...{artefact:message.artefact}, ...{['lifeform'+message.lifeform]:message.lfXP}, ...{resultType:message.resultType} };

        if(message.resultType)
        {
            if(backListedSize.indexOf(message.resultType) >= 0) message.size = -1;

            this.summarize(message);
            this.statify(message);
        }
    }

    readOtherData(message, xmlLine, rawData, dom)
    {
        message.coords = rawData.dataset.rawCoords;
        message.debris = JSON.parse(rawData.dataset.rawRecycledresources || '{}');
        message.cargo = JSON.parse(rawData.dataset.rawCargo || '{}');
        message.gain = {};

        Object.entries(message.debris).forEach(entry =>
        {
            if(entry[1] > 0)
            {
                message.gain[entry[0].replace('deuterium', 'deut')] = entry[1];
                message.resultType = 'debris';
            }
        });

        message.debris = false;

        Object.entries(message.cargo).forEach(entry =>
        {
            if(entry[1] > 0)
            {
                message.gain[entry[0].replace('deuterium', 'deut')] = entry[1];
                message.resultType = 'cargo';
            }
        });

        if(message.resultType)
        {
            this.summarize(message);
            if(this.tabID == 24) this.statify(message);
        }
    }

    readProbeData(message, xmlLine, rawData, dom)
    {
        message.coords = rawData.dataset.rawCoords;
        message.gain = { metal:0, crystal:0, deut:0 };

        // we need to work with negative keys
        message.shipLost = Object.fromEntries(Object.entries(JSON.parse(rawData.dataset.rawShipslost || "{}")).map(([k, v]) => [`-${k}`, v]));

        this.summarize(message);

        if(Object.keys(message.shipLost).length > 1 || !('-210' in message.shipLost)) // 1 turn (not probe only) battle
        {
            this.statify(message);
        }
    }

    readCombatData(message, xmlLine, rawData, dom)
    {
        message.coords = rawData.dataset.rawCoords;
        message.defenderSpace = JSON.parse(rawData.dataset.rawDefenderspaceobject || '{}');
        message.fleets = JSON.parse(rawData.dataset.rawFleets || '{}');
        message.rounds = JSON.parse(rawData.dataset.rawCombatrounds || '{}');
        message.result = JSON.parse(rawData.dataset.rawResult || '{}');
        message.gain = { metal:0, crystal:0, deut:0 };
        message.shipLost = {};
        message.resultType = 'raid';
        message.isOwnPlanet = message.defenderSpace.owner?.id == this.ogl.account.id;
        message.probeOnly = false;

        if(!message.api || message.globalTypeID == 35) return;

        const ownFleets = message.fleets?.filter(fleet => fleet.player?.id == this.ogl.account.id).map(fleet => fleet.fleetId);
        const ownSides = message.fleets?.filter(fleet => fleet.player?.id == this.ogl.account.id).map(fleet => fleet.side);
        const lastRound = message.rounds[message.rounds.length - 1];

        message.isAttacker = ownSides.indexOf('attacker') >= 0;
        message.isDefender = ownSides.indexOf('defender') >= 0;
        message.isWinner = ownSides.indexOf(message.result.winner) >= 0;
        message.noWinner = message.result.winner == 'none';

        if(message.isWinner && message.isAttacker)
        {
            message.gain.metal = message.result.loot.resources.find(line => line.resource == 'metal')?.amount;
            message.gain.crystal = message.result.loot.resources.find(line => line.resource == 'crystal')?.amount;
            message.gain.deut = message.result.loot.resources.find(line => line.resource == 'deuterium')?.amount;
        }
        
        if(!message.isWinner && !message.noWinner && message.isOwnPlanet)
        {
            message.gain.metal = -message.result.loot.resources.find(line => line.resource == 'metal')?.amount;
            message.gain.crystal = -message.result.loot.resources.find(line => line.resource == 'crystal')?.amount;
            message.gain.deut = -message.result.loot.resources.find(line => line.resource == 'deuterium')?.amount;
        }

        const attackerShips = message.fleets?.filter(fleet => fleet.side == 'attacker').map(fleet => fleet.combatTechnologies).reduce((acc, obj) => ({...acc, ...obj}), {});
        const defenderShips = message.fleets?.filter(fleet => fleet.side == 'defender').map(fleet => fleet.combatTechnologies).reduce((acc, obj) => ({...acc, ...obj}), {});

        if(Object.values(attackerShips).length == 1 && attackerShips[0].technologyId == 210 && (message.gain.metal + message.gain.crystal + message.gain.deut == 0)) message.probeOnly = true;
        if(Object.values(defenderShips).length == 1 && defenderShips[0].technologyId == 210 && (message.gain.metal + message.gain.crystal + message.gain.deut == 0)) message.probeOnly = true;

        if(lastRound)
        {
            lastRound.fleets.forEach(fleet =>
            {
                if(ownFleets.indexOf(fleet.fleetId) >= 0)
                {
                    fleet.technologies.forEach(tech =>
                    {
                        if(tech.destroyedTotal) message.shipLost[-tech.technologyId] = tech.destroyedTotal;
                    });
                }
            });
        }

        if(message.isDefender && message.isOwnPlanet)
        {
            message.result.repairedTechnologies.forEach(repaired =>
            {
                message.shipLost[-repaired.technologyId] -= repaired.amount;
            });
        }

        if(message.result?.debris?.resources)
        {
            message.debris = {};

            message.result.debris.resources.forEach(e =>
            {
                if(e.remaining > 0)
                {
                    message.debris[e.resource?.replace('deuterium', 'deut')] = e.remaining;
                }
            });
        }

        if(dom)
        {
            Util.addDom('div',
            {
                class:'ogl_messageButton tooltip',
                title:'Convert this battle',
                parent:dom.querySelector('message-footer-actions'),
                child:'C',
                onclick:() => window.open(Util.genConverterLink(this.ogl, message.api), '_blank')
            });
        }

        if(message.resultType)
        {
            this.summarize(message);
            if(!message.probeOnly) this.statify(message);
        }
    }

    loadSpyTable(isOutdated, forceClean)
    {
        const rulesCount = Object.values(this.ogl.db.options.spyTableRules || {}).filter(item => item.active).reduce((acc, item) => (acc[item.type || 'ignore'] = (acc[item.type || 'ignore'] || 0) + 1, acc), { ignore:0, highlight:0 });
        Object.entries(rulesCount).forEach(entry =>
        {
            this.spytable.querySelector(`.ogl_spyHeader [data-action="${entry[0]}"]`).dataset.label = entry[1];
        });

        const wrapper = Util.addDom('div', { class:'ogl_lineWrapper' });
        if(isOutdated) this.spytable.classList.add('ogl_outdated');

        this.spySumLine = Util.addDom('div', { class:'ogl_spyLine ogl_spySum' });
        this.spyRecap = { count:0, value:0 };

        const filter = ([Object.entries(this.ogl.db.spytableFilters).find(e => e[1] != false)] || [['age', 'ASC']])[0];
        let isDesc = filter[1] == 'DESC';
        let filterKey = filter[0];

        this.spytable.querySelectorAll('.ogl_spyHeader .ogl_active').forEach(e => e.classList.remove('ogl_active'));
        this.spytable.querySelector(`.ogl_spyHeader [data-filter="${filter[0]}"]`)?.classList.add('ogl_active');

        this.nextTarget = false;

        const currentPlanet = (([g, s, p]) => ({ galaxy: g, system: s, position: p }))(this.ogl.currentPlanet.obj.coords.split(':').map(Number));

        const shouldIgnore = message =>
        {
            let resultFlags = 0;

            for (const rule of this.ogl.db.options.spyTableRules)
            {
                if(!rule.active) continue;

                const ruleType = rule.type || 'ignore';
                let isRuleSatisfied = false;
                let value;

                if (rule.field === 'distance')
                {
                    const [g, s, p] = message.coords.split(':').map(Number);
                    const targetPlanet = { galaxy: g, system: s, position: p };
                    const targetIsInRange = Util.planetIsInRange(this.ogl, currentPlanet, targetPlanet, rule.value);

                    if(rule.operator === '>')
                    {
                        isRuleSatisfied = !targetIsInRange;
                    }
                    else
                    {
                        isRuleSatisfied = targetIsInRange;
                    }
                }

                if(rule.field === 'total') value = message.wave1 + (message.fleetValue * this.ogl.db.serverData.debrisFactor / 100);
                else if(rule.field === 'resources') value = message.wave1;
                else if(rule.field === 'fleet') value = message.fleetValue;
                else if(rule.field === 'def') value = message.defValue;
                else if(rule.field === 'metal') value = message.metal;
                else if(rule.field === 'crystal') value = message.crystal;
                else if(rule.field === 'deut') value = message.deut;

                if((rule.operator === '<' && value < rule.value) || (rule.operator === '>' && value > rule.value))
                {
                    isRuleSatisfied = true;
                }

                if(isRuleSatisfied)
                {
                    if (ruleType === 'ignore')
                    {
                        resultFlags |= 1;
                    }
                    else if (ruleType === 'highlight')
                    {
                        resultFlags |= 2;
                    }
                }
            }

            return resultFlags;
        }

        const list = Object.values(this.messageDB).map(message =>
        {
            const rulesState = shouldIgnore(message);

            if((rulesState & 1) > 0) message.ignored = true;
            else message.ignored = false;
            
            if((rulesState & 2) > 0) message.highlighted = true;
            else message.highlighted = false;

            if(!isOutdated && message.ignored && !message.highlighted && (this.ogl.db.options.autoCleanReports || forceClean))
            {
                this.deleteList.push(message.id);
            }

            return message;
        });

        list.sort((a, b) =>
        {
            if(a[filterKey] === undefined || b[filterKey] === undefined) filterKey = 'age';

            if(a.ignored && !b.ignored) return 1;
            if(!a.ignored && b.ignored) return -1;

            const valA = this.ogl.db.options.spyTableMSU ? a.msu : a[filterKey];
            const valB = this.ogl.db.options.spyTableMSU ? b.msu : b[filterKey];

            if((valA == null && valA !== 0) || (valB == null && valB !== 0)) return 0;

            if(isNaN(valA) || isNaN(valB))
            {
                return isDesc ?
                    String(valB).localeCompare(String(valA)) :
                    String(valA).localeCompare(String(valB));
            }

            return isDesc ? valB - valA : valA - valB;
        });

        if(this.deleteList.length > 0)
        {
            this.deleteList = [...new Set(this.deleteList)];
            this.deleteMessageList(this.deleteList);
            this.deleteList = [];
        }

        list.forEach(message =>
        {
            const delta = serverTime.getTime() - message.date.server;

            let age = delta;
            if(age > 86400000) age = Math.floor(age / (1000 * 3600 * 24)) + LocalizationStrings.timeunits.short.day;
            else if(age > 3600000) age = Math.floor(age / (1000 * 3600)) + LocalizationStrings.timeunits.short.hour;
            else age = Math.floor(age / (1000 * 60)) + LocalizationStrings.timeunits.short.minute;

            const bonusFleetSpeed = this.ogl.server.warFleetSpeed == 1 ? .042 : 0;
            const bonusCargo = 1 + (Math.ceil(delta / 3600000) * .042) + bonusFleetSpeed; // +4.2% cargo per hour (100% per 24h)
            const requiredShips = this.ogl._fleet.shipsForResources(this.ogl.db.options.defaultShip, Math.round(message.wave1 * bonusCargo)); 
            const line = Util.addDom('div', { class:'ogl_spyLine', 'data-id':message.id, 'data-wave1':message.wave1, parent:wrapper });
            const content = Util.addDom('div', { parent:line });
            const more = Util.addDom('div', { parent:line, class:'ogl_more ogl_hidden' });
            const coords = message.coords.split(':');
            const timer = message.activity < 15 ? '*' : message.activity.toString().replace('60', '-');
            const time = this.ogl.db.options.useClientTime ? message.date.client : message.date.server;
            
            Util.addDom('span', { parent:content, class:'ogl_textCenter' });
            Util.addDom('span', { child:age, parent:content, class:'ogl_textCenter tooltip', title:this.ogl._time.convertTimestampToDate(time, true).innerHTML });

            const lootValue = this.ogl.db.options.spyTableMSU ? message.msu : message.wave1;

            const timerDom = Util.addDom('span', { child:timer, parent:content, class:'ogl_textCenter' });
            const targetType = Util.addDom('span', { parent:content });
            const coordsDiv = Util.addDom('span', { child:`<span data-galaxy="${message.coords}">${message.coords}</<span>`, parent:content });
            const nameContainer = Util.addDom('div', { parent:content, class:'ogl_spyTableName' });
            const name =  Util.addDom('a', { child:message.playerName, parent:nameContainer, class:'overlay', href:`${window.location.href.split('?')[0]}?page=componentOnly&component=messagedetails&messageId=${message.id}` });
            const pin = Util.addDom('div', { parent:nameContainer });
            const loot = Util.addDom('a', { child:Util.formatToUnits(lootValue), parent:content, class:'ogl_textRight ogl_loot', href:`${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=${message.targetTypeID}&mission=1&am${this.ogl.db.options.defaultShip}=${requiredShips}&oglmode=4&oglmsg=${message.id}` });
            const fleet = Util.addDom('span', { child:Util.formatToUnits(message.fleetValue, 0).replace('-1', '?'), parent:content, class:'ogl_textRight' });
            const def = Util.addDom('span', { child:Util.formatToUnits(message.defValue, 0).replace('-1', '?'), parent:content, class:'ogl_textRight' });
            const actions = Util.addDom('span', { class:'ogl_actions', parent:content });
            const messageDom = document.querySelector(`[data-msg-id="${message.id}"]`);

            this.addSpyIcons(targetType, message.coords, message.targetType);
            this.ogl._ui.addTagButton(coordsDiv, message.coords);
            this.ogl._ui.addPinButton(pin, message.playerID);
            this.ogl._ui.turnIntoPlayerLink(message.playerID, name, message.playerName);

            if(message.activity < 15) timerDom.classList.add('ogl_danger');
            else if(message.activity < 60) timerDom.classList.add('ogl_warning');

            //if(message.wave1 >= this.ogl.db.options.resourceTreshold) loot.classList.add('ogl_important');

            if(message.ignored) line.classList.add('ogl_ignored');
            if(message.highlighted) line.classList.add('ogl_highlighted');
            
            this.spyRecap.count++;
            this.spyRecap.value += message.wave1;

            if(message.fleetValue != 0) fleet.style.background = 'linear-gradient(192deg, #622a2a, #3c1717 70%)';
            if(message.defValue != 0) def.style.background = 'linear-gradient(192deg, #622a2a, #3c1717 70%)';

            // update message content actions
            if(messageDom && !message.isCounterSpy && (!message.ignored || !this.ogl.db.options.autoCleanReports))
            {
                
            }

            // next target (when you press enter)
            if(!this.nextTarget && message.fleetValue == 0 && message.defValue == 0 && !message.isAttacked && !message.ignored)
            {
                this.nextTarget = message;
            }

            for(let i=1; i<7; i++)
            {
                const currentLoot = message['wave'+i];
                const subLine = Util.addDom('div', { parent:more, child:`<div>${Util.formatToUnits(currentLoot)}</div>` });

                this.ogl.fretShips.forEach(shipID =>
                {
                    const shipsCount = this.ogl._fleet.shipsForResources(shipID, currentLoot * bonusCargo);

                    Util.addDom('a',
                    {
                        class:`ogl_icon ogl_${shipID}`,
                        parent:subLine,
                        child:shipsCount.toLocaleString('de-DE') || '0',
                        href:`${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=${message.targetTypeID}&mission=1&am${shipID}=${shipsCount}&oglmode=4&oglLazy=true`
                    });
                });
            }

            Util.addDom('div',
            {
                class:'ogl_button material-icons ogl_moreButton tooltip',
                title:'more waves',
                parent:actions,
                child:'more_horiz',
                onclick:() => more.classList.toggle('ogl_hidden')
            });

            const attackBtn = Util.addDom('a',
            {
                class:'ogl_button material-icons tooltip',
                title:'attack this position !',
                parent:actions,
                child:'swords',
                href:`${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${coords[0]}&system=${coords[1]}&position=${coords[2]}&type=${message.targetTypeID}&mission=1`
            });

            if(message.isAttacked) Util.addDom('div', { class:'fleetAction fleetHostile', parent:attackBtn });

            Util.addDom('div',
            {
                class:'ogl_button material-icons tooltip',
                title:'Simulate',
                parent:actions,
                child:'play_arrow',
                onclick:() =>  window.open(Util.genTrashsimLink(this.ogl, message.api), '_blank')
            });

            if(this.ogl.ptreKey)
            {
                // ptre action
                Util.addDom('div',
                {
                    class:'ogl_button material-icons tooltip',
                    title:'Send this report to PTRE',
                    parent:actions,
                    child:'ptre',
                    onclick:() => this.ogl.PTRE.postSpyReport(message.api)
                });
            }

            // delete action
            Util.addDom('div',
            {
                class:'ogl_button material-icons',
                parent:actions,
                child:'delete_forever',
                onclick:() => this.deleteMessageList(message.id)
            });

            wrapper.appendChild(line);
        });

        if(!isOutdated) this.spytable.classList.remove('ogl_outdated');
        this.spytable.querySelector('.ogl_lineWrapper')?.remove();
        this.spytable.appendChild(wrapper);
        document.querySelector('#messagecontainercomponent .content').insertBefore(this.spytable, document.querySelector('#messagecontainercomponent .content .messageContent'));

        this.updateSumLine();
        wrapper.appendChild(this.spySumLine);
        initTooltips();
    }

    updateSumLine()
    {
        this.spySumLine.innerHTML = `<div><span></span><span></span><span></span><span></span><span></span><span>Total</span><span class="ogl_textRight">${Util.formatToUnits(this.spyRecap.value)}</span><span></span><span></span><div>`;
    }

    addSpyIcons(parent, coords, uniqueType, displayActivity)
    {
        coords = typeof coords == typeof '' ? coords = coords.split(':') : coords;

        if(uniqueType == 'planet' || !uniqueType)
        {
            const planetIcon = Util.addDom('div', { class:'material-icons ogl_spyIcon tooltip', title:this.ogl._lang.find('spyPlanet'), 'data-spy-coords':`${coords[0]}:${coords[1]}:${coords[2]}:1`, child:'language', parent:parent, onclick:e => sendShips(6, coords[0], coords[1], coords[2], 1) });
            const lastPlanetSpy = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.spy?.[0] || 0;
            if(serverTime.getTime() - lastPlanetSpy < this.ogl.db.options.spyIndicatorDelay)
            {
                planetIcon.setAttribute('data-spy', 'recent');
                planetIcon.setAttribute('title', 'recently spied');
            }

            if(displayActivity)
            {
                const activity = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.acti || [];
                const isRecent = serverTime.getTime() - activity[2] < 3600000;
                const activityDom = Util.addDom('span', { parent:planetIcon, child:isRecent ? activity[0] : '?' });
                (activity[0] == '*' && isRecent) ? activityDom.classList.add('ogl_danger') : (activity[0] == 60 && isRecent) ? activityDom.classList.add('ogl_ok') : activityDom.classList.add('ogl_warning');
            }
        }
        
        if(uniqueType == 'moon' || (!uniqueType && this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.mid))
        {
            const moonIcon = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.mid > 0 ? Util.addDom('div', { class:'material-icons ogl_spyIcon tooltip', title:this.ogl._lang.find('spyMoon'), 'data-spy-coords':`${coords[0]}:${coords[1]}:${coords[2]}:3`,child:'bedtime', parent:parent, onclick:e => sendShips(6, coords[0], coords[1], coords[2], 3) }) : Util.addDom('div', { parent:parent });
            const lastMoontSpy = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.spy?.[1] || 0;
            if(serverTime.getTime() - lastMoontSpy < this.ogl.db.options.spyIndicatorDelay)
            {
                moonIcon.setAttribute('data-spy', 'recent');
                moonIcon.setAttribute('title', 'recently spied');
            }

            if(displayActivity && this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.mid > -1)
            {
                const activity = this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.acti || [];
                const isRecent = serverTime.getTime() - activity[2] < 3600000;
                const activityDom = Util.addDom('span', { parent:moonIcon, child:isRecent ? activity[1] : '?' });
                (activity[1] == '*' && isRecent) ? activityDom.classList.add('ogl_danger') : (activity[1] == 60 && isRecent) ? activityDom.classList.add('ogl_ok') : activityDom.classList.add('ogl_warning');
            }
        }

        if(!uniqueType && ! this.ogl.db.pdb[`${coords[0]}:${coords[1]}:${coords[2]}`]?.mid)
        {
            Util.addDom('div', { parent:parent });
        }
    }

    openSpyTableRules(type)
    {
        const fields =
        {
            total:'Resources + Fleet debris',
            resources:'Resources',
            fleet:'Fleet debris',
            def:'Defense',
            metal:'Metal',
            crystal:'Crystal',
            deut:'Deut',
            distance:'Distance (systems)'
        }
        
        const title = type == 'ignore' ? '<i class="material-icons ogl_danger">block</i> I want to ignore all reports with...' : '<i class="material-icons ogl_caution">star</i> I want to highlight all reports with...'

        const container = Util.addDom('div', { class:'ogl_spyTableRules' });
        const rulePicker = Util.addDom('fieldset', { parent:container, class:'ogl_addRule' });
        const rulesList = Util.addDom('div', { parent:container, class:'ogl_rulesList' });
        Util.addDom('legend', { parent:rulePicker, child:title });
        const field = Util.addDom('select', { parent:rulePicker, class:'dropdownInitialized ogl_inputField', child:
            `
            <option value="total">${fields.total}</option>
            <option value="resources">${fields.resources}</option>
            <option value="fleet">${fields.fleet}</option>
            <option value="def">${fields.def}</option>
            <option value="metal">${fields.metal}</option>
            <option value="crystal">${fields.crystal}</option>
            <option value="deut">${fields.deut}</option>
            <option value="distance">${fields.distance}</option>
            `
        });
        const operator = Util.addDom('select', { parent:rulePicker, class:'dropdownInitialized ogl_inputField', child:
            `
            <option value="<"><</option>
            <option value=">">></option>
            `
        });
        const input = Util.addDom('input', { class:'ogl_inputCheck ogl_inputField', type:'text', parent:rulePicker, value:this.ogl.db.options.resourceTreshold });
        Util.addDom('button', { parent:rulePicker, child:'<i>+</i> add a rule', class:'ogl_button', onclick:() =>
        {
            const value = parseInt(input.value.replace(/\D/g, '')) || 0;
            this.ogl.db.options.spyTableRules.push({ field:field.value, operator:operator.value, value:value, active:true, type:type });
            this.openSpyTableRules(type);
            this.loadSpyTable();
        }});

        this.ogl.db.options.spyTableRules.filter(e => (e.type || 'ignore') == type).forEach(rule =>
        {
            const line = Util.addDom('div', { parent:rulesList });
            Util.addDom('div', { child:fields[rule.field], parent:line });
            Util.addDom('div', { child:rule.operator, parent:line });
            Util.addDom('div', { child:Util.formatNumber(rule.value), parent:line });
            const checkbox = Util.addDom('input', { type:'checkbox', class:'ogl_inputField', parent:line, onchange:() =>
            {
                rule.active = !rule.active;
                checkbox.checked = rule.active;
                this.loadSpyTable();
            }});

            if(rule.active) checkbox.checked = true;

            Util.addDom('div', { class:'material-icons ogl_button ogl_danger', child:'delete', parent:line, onclick:() =>
            {
                const rulesTypeIndex = this.ogl.db.options.spyTableRules.findIndex(r => r === rule);

                this.ogl.db.options.spyTableRules.splice(rulesTypeIndex, 1);
                this.openSpyTableRules(type);
                this.loadSpyTable();
            }});
        });

        this.ogl._popup.open(container);
        setTimeout(() => Util.formatInput(input));
    }

    summarize(message)
    {
        const messageDom = document.querySelector(`[data-msg-id="${message.id}"]`);
        if(!messageDom) return;

        if(messageDom.querySelector('.ogl_battle')) messageDom.querySelector('.ogl_battle').remove();
        if(!messageDom.querySelector(`.ogl_checked`)) Util.addDom('div', { class:'material-icons ogl_checked ogl_mainIcon tooltip', child:'oglight_simple', title:this.ogl._lang.find('oglMessageDone'), parent:messageDom.querySelector('message-footer-actions') });

        const tooltipContent = Util.addDom('ul', { class:'ogl_battleTooltip' });

        const recap = Util.addDom('div', { class:'ogl_battle', 'data-resultType':message.resultType || 'unknown', before:messageDom.querySelector('.msg_actions'), onclick:() =>
        {
            if(recap.classList.contains('ogl_clickable')) messageDom.querySelector('.msgContent').classList.toggle('ogl_hidden');
        }});

        const gainSum = Object.values(message.gain).reduce((a, b) => parseInt(a) || 0 + parseInt(b) || 0, 0);
        const gains = { ...message.gain };

        Object.entries(message.shipLost || {}).forEach(entry =>
        {
            if(!isNaN(entry[0]) && entry[0] < 0)
            {
                Object.entries(Datafinder.getTech(-entry[0])).forEach(res => gains[res[0]] = (gains[res[0]] || 0) - res[1] * entry[1]);
            }
        });

        Object.entries(gains).forEach(entry =>
        {
            if(!isNaN(entry[1]) && entry[1] !== 0) Util.addDom('div', { class:`ogl_icon ogl_${entry[0]}`, child:Util.formatToUnits(entry[1], false, true), parent:recap });
            else if(gainSum == 0 && isNaN(entry[1])) Util.addDom('div', { class:`ogl_icon ogl_${entry[0]}`, child:this.ogl._lang.find(entry[1]), parent:recap });
        });

        if(message.debris && (message.debris.metal || 0) + (message.debris.crystal || 0) + (message.debris.deut || 0) != 0)
        {
            const recapDebris = Util.addDom('div', { class:'ogl_battle ogl_clickable', 'data-resultType':'debris', before:messageDom.querySelector('.msg_actions'), onclick:() => messageDom.querySelector('.msgContent').classList.toggle('ogl_hidden')});

            Object.entries(message.debris).forEach(entry =>
            {
                if(!isNaN(entry[1]) && entry[1] !== 0) Util.addDom('div', { class:`ogl_icon ogl_${entry[0]}`, child:Util.formatToUnits(entry[1]), parent:recapDebris });
            });
        }

        if(gains.metal + gains.crystal + gains.deut == 0)
        {
            Util.addDom('div', { class:`ogl_icon`, child:'-', parent:recap });
        }

        if(message.resultType)
        {
            recap.classList.add('ogl_clickable');
            if(message.globalTypeID == 41 || message.globalTypeID == 61 || message.globalTypeID == 32) messageDom.querySelector('.msgContent').classList.add('ogl_hidden');
        }

        if(message.item?.[0])
        {
            recap.classList.add('tooltip');
            tooltipContent.appendChild(Util.addDom('li', { child:`Item : <b class="ogl_highlight">${message.item?.[0].name}</b>` }));
        }

        if(message.size >= 0)
        {
            const sizes = { 0:'Extraordinary', 1:'Especial', 2:'Normal' };

            recap.classList.add('tooltip');
            tooltipContent.appendChild(Util.addDom('li', { child:`Size : <b data-size-value="${message.size}">${sizes[message.size]}</b>` }));
            recap.setAttribute('data-size', message.size);

            //Util.addDom('div', { class:'material-icons', child:'trophy', 'data-size-value':message.size, parent:messageDom.querySelector('.msgTitle') });
        }

        if(message.depletion > 0)
        {
            recap.classList.add('tooltip');
            tooltipContent.appendChild(Util.addDom('li', { child:`Depletion value : <b data-depletion-value="${message.depletion}">${message.depletion}</b>` }));
            recap.setAttribute('data-depletion', message.depletion);
        }

        if(message.itemName)
        {
            recap.innerText = message.itemName;
        }

        if(tooltipContent.innerText != '') recap.title = tooltipContent.innerHTML;
    }

    statify(message)
    {
        const isP16 = (message.coords || '0:0:0').split(':')[2] == 16;
        const isPiralien = (message.globalTypeID == 25 || message.globalTypeID == 48) && isP16;
        const isDebris16 = message.globalTypeID == 32 && isP16;

        // expe, raid, discovery, debris, debris16, blackhole
        const type =
            isPiralien ? 'expe' : 
            isDebris16 ? 'debris16' : 
            message.globalTypeID == 41 ? 'expe' :
            message.globalTypeID == 61 ? 'discovery' :
            (message.globalTypeID == 25 || message.globalTypeID == 48) ? 'raid' :
            message.globalTypeID == 32 ? 'debris' : false;

        // resource, ship, pirate, alien, late, early, darkmatter, blackhole, nothing, item, trader
        const occurence =
            message.globalTypeID == 41 ? message.resultType :
            message.globalTypeID == 61 ? message.resultType : false;

        if(type)
        {
            const stats = this.ogl._stats.getDayStats(this.ogl._time.timeToKey(message.date.server));

            if(this.ogl.db.options.debugMode)
            {
                const debugText = stats.ids?.indexOf(message.id) > -1 ? 'OLD ENTRY' : 'NEW ENTRY';
                const dom = document.querySelector(`[data-msg-id="${message.id}"]`);
                if(dom) Util.addDom('div', { style:'background:rgba(0,0,0,.8); position:absolute; bottom:30px; right:10px; text-align:center; color:var(--ogl);', child:debugText, parent:dom });
            }

            if(stats.ids?.indexOf(message.id) > -1) return;

            const notificationData = {};

            if(message.id)
            {
                stats.ids = stats.ids || [];
                stats.ids.push(message.id);
            }

            stats[type] = stats[type] || {};

            if(!isPiralien) stats[type].count = (stats[type].count || 0) + 1;

            if(occurence)
            {
                stats[type].occurence = stats[type].occurence || {};
                stats[type].occurence[occurence] = (stats[type].occurence[occurence] || 0) + 1;
            }

            if(message.shipLost)
            {
                message.gain = { ...message.gain, ...message.shipLost };
            }

            for(let [gainID, amount] of Object.entries(message.gain))
            {
                if(!isNaN(amount) && amount != 0)
                {
                    const sign = !isNaN(gainID) && gainID < 0 ? -1 : 1;
                    const gid = !isNaN(gainID) ? Math.abs(gainID) : gainID;
                    notificationData[gid] = (notificationData[gid] || 0) + amount * sign;

                    stats[type].gain = stats[type].gain || {};
                    stats[type].gain[gainID] = (stats[type].gain[gainID] || 0) + (amount == '?' ? 1 : amount);
                }
                else if(gainID == 'resultType')
                {
                    notificationData[amount] = (notificationData[amount] || 0) + 1;
                }
            }

            if(!document.querySelector('#ogame-tracker-menu')) this.ogl._notification.addToQueue(false, undefined, notificationData);
        }
    }

    deleteMessageList(IDList)
    {
        IDList = Array.isArray(IDList) ? IDList : [IDList];

        $.ajax({
            url:getAsJsonUrl + '&action=flagDeleted',
            data:
            {
                token:token,
                messageIds:IDList
            },
            type: "POST",
            dataType: "json",
            success:data =>
            {
                token = data.newAjaxToken;

                if(data.status === 'failure')
                {
                    showNotification(data.errors[0].message, 'error');
                    return;
                }
            },
            error:data =>
            {
                showNotification(data.errors[0].message, 'error');
            }
        });
    }

    checkDialog()
    {
        if(serverTime.getTime() - this.dialogDelay < 500) return;
        this.dialogDelay = serverTime.getTime();

        const dialog = document.querySelector('.ui-dialog');
        const id = dialog.querySelector('.detail_msg')?.getAttribute('data-msg-id');
        const isCombat = dialog.querySelector('[data-combatreportid]');
        const isSpy = dialog.querySelector('[data-message-type="10"]');
        const actionDiv = dialog.querySelector('message-footer-actions');

        if(id && isCombat && !dialog.querySelector('.ogl_messageButton'))
        {
            const apiButton = dialog.querySelector('.icon_apikey');
            const api = (apiButton.getAttribute('data-tooltip-title') || apiButton.getAttribute('title') || apiButton.getAttribute('data-title') || apiButton.getAttribute('data-api-code')).match(/cr-[a-z0-9-]*/)[0];
            apiButton.setAttribute('data-api-code', api);

            Util.addDom('div',
            {
                class:'ogl_messageButton tooltip',
                title:'Convert this battle',
                parent:actionDiv,
                child:'C',
                onclick:() =>  window.open(Util.genConverterLink(this.ogl, api), '_blank')
            });
        }
        else if(id && isSpy && !dialog.querySelector('.ogl_messageButton'))
        {
            const params = new URLSearchParams(dialog.querySelector('.msg_title a')?.href);
            const coords = [params.get('galaxy') || "0", params.get('system') || "0", params.get('position') || "0"];
            const apiButton = dialog.querySelector('.icon_apikey');
            const api = (apiButton.getAttribute('data-tooltip-title') || apiButton.getAttribute('title') || apiButton.getAttribute('data-title') || apiButton.getAttribute('data-api-code')).match(/sr-[a-z0-9-]*/)[0];
            apiButton.setAttribute('data-api-code', api);

            if(!dialog.querySelector('.ogl_tagPicker'))
            {
                const colorButton = Util.addDom('div',
                {
                    class:'ogl_messageButton',
                    parent:actionDiv
                });
    
                this.ogl._ui.addTagButton(colorButton, coords);
            }

            if(!dialog.querySelector('.ogl_trashsim'))
            {
                Util.addDom('div',
                {
                    class:'ogl_messageButton material-icons ogl_trashsim tooltip',
                    parent:actionDiv,
                    child:'play_arrow',
                    onclick:() =>  window.open(Util.genTrashsimLink(this.ogl, api), '_blank')
                });
            }

            if(!dialog.querySelector('.ogl_ptre') && this.ogl.ptreKey)
            {
                Util.addDom('div',
                {
                    class:'ogl_messageButton material-icons tooltip',
                    parent:actionDiv,
                    child:'ptre',
                    onclick:() => this.ogl.PTRE.postSpyReport(api)
                });
            }
        }

        initTooltips();
    }

    checkBoard()
    {
        if(this.ogl.server.lang != 'fr' || !this.ogl.db.options.boardTab) return;

        this.ogl.db.lastBoardPosts = this.ogl.db.lastBoardPosts || [0, 0, 0]; // count, last post, last check

        if(Date.now() > this.ogl.db.lastBoardPosts[2] + 3600000) // 1h
        {
            GM_xmlhttpRequest(
            {
                method:'GET',
                url:'http://board.fr.ogame.gameforge.com/index.php?board-feed/101/',
                onload:result =>
                {
                    const xml = new DOMParser().parseFromString(result.responseText, 'text/xml');
                    this.ogl.db.lastBoardPosts[0] = 0;

                    const initialLastPost = this.ogl.db.lastBoardPosts[1];
        
                    const items = xml.querySelectorAll('item');
                    items.forEach((item, index) =>
                    {
                        const date = new Date(item.querySelector('pubDate').textContent).getTime();
        
                        if(date > initialLastPost)
                        {
                            this.ogl.db.lastBoardPosts[0]++;
                        }

                        if(index == 0) this.ogl.db.lastBoardPosts[1] = date;
                    
                        if(this.ogl.db.lastBoardPosts[0] > 0)
                        {
                            const count = document.querySelector('.comm_menu.messages .new_msg_count') || Util.addDom('span', { class:'new_msg_count totalMessages news' });
                            count.innerText = parseInt((count?.innerText || 0)) + this.ogl.db.lastBoardPosts[0];
                        }

                        this.ogl.db.lastBoardPosts[2] = Date.now();
                    });
                }
            });
        }
    }

    addBoardTab()
    {
        if(this.ogl.server.lang != 'fr' || !this.ogl.db.options.boardTab) return;

        const div = Util.addDom('div', { class:'ogl_boardMessageTab', parent:document.querySelector('.mainTabs') });
        Util.addDom('div', { class:'tabImage', parent:div, child:Util.addDom('div', { class:'material-icons', child:'newspaper' }) });
        Util.addDom('div', { class:'tabLabel', parent:div, child:'Board.fr' });
        const newMessagesCount = Util.addDom('div', { class:'newMessagesCount ogl_hidden', parent:div, child:this.ogl.db.lastBoardPosts[0] });

        if(this.ogl.db.lastBoardPosts[0] > 0) newMessagesCount.classList.remove('ogl_hidden');

        div.addEventListener('click', () =>
        {
            const wrapper = document.querySelector('#messagewrapper');
            wrapper.innerText = '';
            const inner = Util.addDom('div', { id:'oglBoardTab', class:'messagesHolder', parent:wrapper, child:'<div class="ogl_wrapperloading"><div class="ogl_loading"></div></div>' });

            document.querySelectorAll('.mainTabs .marker').forEach(e => e.classList.remove('marker'));
            div.classList.add('marker');

            GM_xmlhttpRequest(
            {
                method:'GET',
                url:'http://board.fr.ogame.gameforge.com/index.php?board-feed/101/',
                onload:result =>
                {
                    const xml = new DOMParser().parseFromString(result.responseText, 'text/xml');
                    const items = xml.querySelectorAll('item');

                    inner.innerText = '';

                    items.forEach((item, index) =>
                    {
                        const rawDate = new Date(item.querySelector('pubDate').textContent);
                        const date = rawDate.toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'});
                        const time = rawDate.toLocaleTimeString('de-DE');
                        const msg = Util.addDom('div', { class:'msg', parent:inner });

                        Util.addDom('span', { class:'msg_title blue_txt', parent:msg, child:`${item.querySelector('title').textContent}<br><i>@${item.getElementsByTagName('dc:creator')[0].textContent}</i>`, onclick:() =>
                        {
                            window.open(item.querySelector('link').textContent, '_blank');
                        }});

                        Util.addDom('span', { class:'msg_date fright ogl_CustomMessagedate', parent:msg, child:`${date} ${time}` });
                        Util.addDom('div', { class:'msg_content', parent:msg, child:item.getElementsByTagName('content:encoded')[0].textContent });

                        if(index == 0) this.ogl.db.lastBoardPosts[1] = rawDate.getTime();
                    });

                    this.ogl._time.updateList.push('.ogl_CustomMessagedate');

                    this.ogl.db.lastBoardPosts[0] = 0;
                    this.ogl.db.lastBoardPosts[2] = Date.now();
                    newMessagesCount.classList.add('ogl_hidden');
                }
            });
        });
    }
}

class MovementManager extends Manager
{
    load(reload)
    {
        this.ogl.cache.movements = this.ogl.cache.movements || {};
        this.destinationList = {};

        // if eventFleets are already loaded, we still need to get data
        if(document.querySelector('#eventboxContent .eventFleet'))
        {
            $.ajax({
                url:eventlistLink,
                success:function() {}
            });
        }

        if(this.ogl.page == 'movement' && !reload)
        {
            unsafeWindow['timerHandler'].pageReloadAlreadyTriggered = true; // prevent auto reload
            this.updateMovement();
        }
    }

    addFleetIcon(data, planet, reversed)
    {
        Util.addDom('div', { class:`material-icons ogl_fleetIcon ogl_mission${data[0].mission} tooltip`, parent:reversed ? planet._ogl.sideIconBack : planet._ogl.sideIcon, 'data-list':data.length, onclick:() =>
        {
            const container = Util.addDom('div', { class:'ogl_sideFleetTooltip' });
            let cumul = { metal:0, crystal:0, deut:0 };

            data.forEach(line =>
            {
                const fleetImg = reversed ? 'http://gf2.geo.gfsrv.net/cdn47/014a5d88b102d4b47ab5146d4807c6.gif' : 'http://gf2.geo.gfsrv.net/cdnd9/f9cb590cdf265f499b0e2e5d91fc75.gif';

                let shipAmount = 0;
                Object.keys(line).filter(element => parseInt(element)).forEach(shipID => shipAmount += line[shipID]);

                let tooltip = Util.addDom('table', { class:'fleetinfo ogl_custom', child:'' });

                [...this.ogl.shipsList, 'metal', 'crystal', 'deut', 'food'].forEach(item =>
                {
                    if(line[item] || isNaN(item)) tooltip.innerHTML += `<tr><td>${this.ogl._lang.find(item)}</td><td class="value">${line[item] || 0}</td></tr>`;
                });

                const domLine = Util.addDom('div', { class:`ogl_mission${line.mission} ogl_sideFleetIcon`, child:`<div class="ogl_icon ogl_mission${line.mission}"></div><div class="material-icons">${line.from.isMoon ? 'bedtime' : 'language'}</div><div>[${line.from.coords}]</div><span>${Util.formatToUnits(shipAmount)}</span><img class="tooltip" title='${tooltip.outerHTML}' src="${fleetImg}"><div class="material-icons">${line.mission == 8 ? 'debris' : line.to.isMoon ? 'bedtime' : 'language'}</div><div>[${line.to.coords}]</div>`, parent:container });
            
                ['metal', 'crystal', 'deut'].forEach(res =>
                {
                    Util.addDom('div', { class:`ogl_icon ogl_${res}`, parent:domLine, child:Util.formatToUnits(line[res] || 0) });
                    cumul[res] = cumul[res] + (line[res] || 0);
                });

                // /!\ caution, line.arrivalTime is the client time (wtf gf)
                const timeObj = this.ogl._time.getObj(line.arrivalTime, 'client');
                const time = this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server;
                domLine.prepend(this.ogl._time.convertTimestampToDate(time));
            });

            const total = Util.addDom('div', { class:`ogl_sideFleetIcon`, child:`<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>`, parent:container });
            ['metal', 'crystal', 'deut'].forEach(res => Util.addDom('div', { class:`ogl_icon ogl_${res}`, parent:total, child:Util.formatToUnits(cumul[res] || 0) }));

            //const docked = Util.addDom('div', { class:`ogl_sideFleetIcon`, child:`<span></span><span></span><span></span><span></span><span></span><span></span><span>docked</span>`, parent:container });
            //['metal', 'crystal', 'deut'].forEach(res => Util.addDom('div', { class:`ogl_icon ogl_${res}`, parent:docked, child:Util.formatToUnits(ogl.db.myPlanets?.[targetID]?.[res] || 0) }));

            this.ogl._popup.open(container);
        }});
    }

    updateMovement()
    {
        let emptyData = false;

        if(document.querySelectorAll('#movementcomponent .reversal a').length > 0)
        {
            document.querySelectorAll('#movementcomponent .reversal a')[0].setAttribute('data-key-color', 'orange');

            Array.from(document.querySelectorAll('#movementcomponent .reversal a')).sort((a, b) => parseInt(b.closest('.fleetDetails').getAttribute('id').replace('fleet', '')) - parseInt(a.closest('.fleetDetails').getAttribute('id').replace('fleet', '')))[0].setAttribute('data-key-color', 'violet');
        }

        document.querySelectorAll('.route a').forEach((route, index) =>
        {
            route.classList.add('tooltipRight');

            const parent = route.closest('.fleetDetails');
            const resourcesBlock = Util.addDom('div', { class:'ogl_resourcesBlock' });
            const timeBlock = Util.addDom('div', { class:'ogl_timeBlock' });
            const actionsBlock = Util.addDom('div', { class:'ogl_actionsBlock' });

            const htmlData = document.querySelector(`#${route.getAttribute('rel')}`);

            if(!htmlData)
            {
                emptyData = true;
                return;
            }

            // get fleet compo
            htmlData.querySelectorAll('.fleetinfo tr').forEach(subline =>
            {
                if(subline.querySelector('td') && subline.querySelector('.value'))
                {
                    const name = subline.querySelector('td').innerText.replace(':', '');
                    const key = Object.entries(this.ogl.db.serverData).find(entry => entry[1] === name)[0];
                    const value = parseInt(subline.querySelector('.value').innerText.replace(/\.|,| /g, ''));
                    const formattedValue = Util.formatToUnits(value, 0);

                    if(!value) return;

                    if(!isNaN(key))
                    {
                        Util.addDom('div', { class:`ogl_icon ogl_${key}`, child:formattedValue, parent:resourcesBlock });
                    }
                    else
                    {
                        if(key == 'metal') Util.addDom('div', { class:`ogl_icon ogl_${key}`, child:formattedValue, prepend:resourcesBlock });
                        else if(key == 'crystal') Util.addDom('div', { class:`ogl_icon ogl_${key}`, child:formattedValue, after:resourcesBlock.querySelector('.ogl_metal') });
                        else if(key == 'deut') Util.addDom('div', { class:`ogl_icon ogl_${key}`, child:formattedValue, after:resourcesBlock.querySelector('.ogl_crystal') });
                        else if(key == 'food') Util.addDom('div', { class:`ogl_icon ogl_${key}`, child:formattedValue, after:resourcesBlock.querySelector('.ogl_deut') });
                    }
                }
            });

            if(parent.getAttribute('data-mission-type') == 17 || parent.getAttribute('data-mission-type') == 18) // docks & discoveries
            {
                Util.addDom('div', { class:`ogl_icon ogl_metal`, child:0, prepend:resourcesBlock });
                Util.addDom('div', { class:`ogl_icon ogl_crystal`, child:0, prepend:resourcesBlock });
                Util.addDom('div', { class:`ogl_icon ogl_deut`, child:0, prepend:resourcesBlock });
                Util.addDom('div', { class:`ogl_icon ogl_food`, child:0, prepend:resourcesBlock });
            }

            /*const fleetID = parent.id;
            const arrival = parseInt(parent.dataset.arrivalTime) * 1000;

            if(this.ogl.db.browserNotificationList[fleetID])
            {
                const browserNotification = {};
                browserNotification.id = fleetID;
                browserNotification.arrivalTime = arrival;

                this.ogl.db.browserNotificationList[fleetID] = browserNotification;
            }*/

            /*Util.addDom('div', { parent:resourcesBlock, class:this.ogl.db.browserNotificationList[fleetID] ? 'ogl_clockNotif ogl_button ogl_active': 'ogl_clockNotif ogl_button', onclick:e =>
            {
                const browserNotification = {};
                browserNotification.id = fleetID;
                browserNotification.arrivalTime = arrival;

                if(!this.ogl.db.browserNotificationList[fleetID])
                {
                    this.ogl.db.browserNotificationList[fleetID] = browserNotification;
                    e.target.classList.add('ogl_active');
                }
                else
                {
                    delete this.ogl.db.browserNotificationList[fleetID];
                    e.target.classList.remove('ogl_active');
                }

                console.log(this.ogl.db.browserNotificationList);
            }});*/

            const timeBlockLeft = Util.addDom('div', { class:'ogl_timeBlockLeft', parent:timeBlock });
            const timeBlockRight = Util.addDom('div', { class:'ogl_timeBlockRight', parent:timeBlock });
            timeBlockLeft.appendChild(parent.querySelector('.timer'));
            timeBlockLeft.appendChild(parent.querySelector('.absTime'));
            timeBlockLeft.appendChild(parent.querySelector('.originData'));
            timeBlockLeft.querySelector('.originData').appendChild(timeBlockLeft.querySelector('.originCoords'));
            timeBlockRight.appendChild(parent.querySelector('.destinationData'));
            timeBlockRight.querySelector('.destinationData').appendChild(timeBlockRight.querySelector('.destinationPlanet'));
            if(parent.querySelector('.nextabsTime')) timeBlockRight.appendChild(parent.querySelector('.nextabsTime'));
            else Util.addDom('div', { child:'-', parent:timeBlockRight });
            if(parent.querySelector('.nextTimer')) timeBlockRight.appendChild(parent.querySelector('.nextTimer'));
            else Util.addDom('div', { child:'-', parent:timeBlockRight });
            
            Util.addDom('div', { class:`ogl_icon ogl_mission${parent.getAttribute('data-mission-type')}`, prepend:actionsBlock });
            actionsBlock.appendChild(parent.querySelector('.route a'));
            //if(parent.querySelector('.openDetails')) actionsBlock.appendChild(parent.querySelector('.openDetails'));
            if(parent.querySelector('.fedAttack')) actionsBlock.appendChild(parent.querySelector('.fedAttack'));
            if(parent.querySelector('.sendMail')) actionsBlock.appendChild(parent.querySelector('.sendMail'));

            parent.prepend(resourcesBlock);
            parent.prepend(timeBlock);
            parent.prepend(actionsBlock);
        });

        if(!emptyData) this.ogl._time.updateMovements();
    }

    check(xml)
    {
        let movements = {};
        let ignored = [];

        xml.querySelectorAll('#eventContent tbody tr').forEach(line =>
        {
            const tooltip = Util.addDom('div', {child:(line.querySelector('.icon_movement .tooltip') || line.querySelector('.icon_movement_reserve .tooltip'))?.getAttribute('title')});
            const movement = {};
            movement.id = parseInt(line.getAttribute('id').replace('eventRow-', ''));
            movement.mission = line.getAttribute('data-mission-type');
            movement.isBack = line.getAttribute('data-return-flight') === 'true';
            movement.arrivalTime = parseInt(line.getAttribute('data-arrival-time')) * 1000;
            
            if(!movement.isBack) ignored.push(movement.id + 1);

            movement.from = {};
            movement.from.anotherPlayer = !Boolean(Array.from(document.querySelectorAll('#planetList .planet-koords')).find(p => p.innerText === line.querySelector('.coordsOrigin').innerText.trim().slice(1, -1)));
            movement.from.isMoon = Boolean(line.querySelector('.originFleet figure.moon'));
            movement.from.coords = line.querySelector('.coordsOrigin').innerText.trim().slice(1, -1);

            movement.to = {};
            movement.to.anotherPlayer = !Boolean(Array.from(document.querySelectorAll('#planetList .planet-koords')).find(p => p.innerText === line.querySelector('.destCoords').innerText.trim().slice(1, -1)));
            movement.to.isMoon = Boolean(line.querySelector('.destFleet figure.moon'));
            movement.to.coords = line.querySelector('.destCoords').innerText.trim().slice(1, -1);

            const fleetID = `fleetEvent-${movement.id}`;
            const timeObj = this.ogl._time.getObj(movement.arrivalTime, 'client');
            const arrival = timeObj.server;
            const parent = document.querySelector(`#eventRow-${movement.id}`);

            if(parent)
            {
                this.ogl._time.update(parent.querySelector('arrivalTime'));

                const notifIcon = Util.addDom('div', { parent:parent, class:this.ogl.db.browserNotificationList[fleetID] ? 'ogl_clockNotif ogl_button ogl_active': 'ogl_clockNotif ogl_button', onclick:e =>
                {
                    const browserNotification = {};
                    browserNotification.id = fleetID;
                    browserNotification.arrivalTime = arrival;
                    browserNotification.message = `[${movement.to.coords}] ${movement.to.isMoon ? 'moon' : 'planet'} : Your fleet is ready`;

                    this.ogl._notification.addNotification(browserNotification, e.target);
                }});

                if(this.ogl.db.browserNotificationList[fleetID] && Math.abs(this.ogl.db.browserNotificationList[fleetID].arrivalTime - arrival) > 5)
                {
                    notifIcon.classList.add('ogl_altered');
                }
            }
            
            if(ignored.indexOf(movement.id) > -1) return;

            this.destinationList[movement.to.coords] = this.destinationList[movement.to.coords] || [];
            if(!movement.isBack && this.destinationList[movement.to.coords].indexOf(movement.mission) < 0) this.destinationList[movement.to.coords].push(movement.mission);

            if((movement.mission == 1 || movement.mission == 6 || movement.mission == 9) && movement.from.anotherPlayer)
            {
                const dest = Array.from(document.querySelectorAll('#planetList .planet-koords')).find(p => p.innerText === line.querySelector('.destCoords').innerText.trim().slice(1, -1));
                
                if(dest)
                {
                    const destSmallPlanet = dest.closest('.smallplanet');
                    const destTarget = movement.to.isMoon ? destSmallPlanet.querySelector('.moonlink') : destSmallPlanet.querySelector('.planetlink');
                    destTarget.classList.add('ogl_attacked');
                }
            }

            tooltip.querySelectorAll('.fleetinfo tr').forEach(subline =>
            {
                if(subline.querySelector('td') && subline.querySelector('.value'))
                {
                    let name = subline.querySelector('td').innerText.replace(':', '');
                    let key = Object.entries(this.ogl.db.serverData).find(entry => entry[1] === name)?.[0];
                    let value = subline.querySelector('.value').innerText.replace(/\.|,| /g, '');

                    if(key) movement[key] = Number(value);
                }
            });

            let target;
            if(movement.isBack) target = movement.from.coords + ':B';
            else if(movement.to.anotherPlayer) target = movement.from.coords;
            else if(movement.from.anotherPlayer) target = movement.to.coords + ':B';
            else target = movement.to.coords;

            if(target)
            {
                movements[target] = movements[target] || [];
                movements[target].push(movement);
            }
        });

        this.ogl.cache.movements = movements;
        this.updateSideIcons();

        Util.runAsync(() =>
        {
            this.ogl._ui.displayResourcesRecap();
            this.ogl._time.updateMovements(); // /!\ time.updateMovements != this.updateMovements
            this.updateDebrisIndicators();

            initTooltips();
        });
    }

    updateSideIcons()
    {
        Object.values(this.ogl._dom.planet).filter(e => e._ogl.type == 'planet').forEach(planet =>
        {
            planet.parentNode.querySelectorAll('.ogl_fleetIcon').forEach(e => e.remove());

            const coords = planet._ogl.coords;

            if(this.ogl.cache?.movements?.[coords])
            {
                this.addFleetIcon(this.ogl.cache.movements[coords], planet);
            }

            if(this.ogl.cache?.movements?.[coords+':B'])
            {
                this.addFleetIcon(this.ogl.cache.movements[coords+':B'], planet, true);
            }
        });

        if(this.ogl._tech) this.ogl._tech.checkTodolist();
    }

    updateDebrisIndicators()
    {
        for(let [coords, missionList] of Object.entries(this.destinationList))
        {
            if(missionList.indexOf('8') >= 0)
            {
                document.querySelectorAll(`[data-debris-coords="${coords}"]`).forEach(element =>
                {
                    element.classList.add('ogl_attacked');
                });
            }
        }
    }
}

class HighscoreManager extends Manager
{
    load()
    {
        /*this.ogl.db.lastStatusUpdate = this.ogl.db.lastStatusUpdate || 0;
        this.ogl.db.lastGlobalScoreUpdate = this.ogl.db.lastGlobalScoreUpdate || 0;*/

        this.rankingDBName = `${this.ogl.DBName}-highscore`;
        this.ogl.db.lastPTREAPIUpdate = this.ogl.db.lastPTREAPIUpdate || 0;

        this.tagToNameList =
        {
            n:'status_abbr_active',
            v:'status_abbr_vacation',
            I:'status_abbr_longinactive',
            i:'status_abbr_inactive',
            b:'status_abbr_banned',
            a:'status_abbr_admin',
            HONORABLE:'status_abbr_honorableTarget',
        }

        this.nameToTagList = Object.fromEntries(Object.entries(this.tagToNameList).map(e => e.reverse()));
        
        this.nameToServerTagList =
        {
            'status_abbr_inactive' : this.ogl.db.serverData.inactive,
            'status_abbr_longinactive' : this.ogl.db.serverData.inactiveLong,
            'status_abbr_banned' : this.ogl.db.serverData.banned,
            'status_abbr_vacation' : this.ogl.db.serverData.vacation,
            'status_abbr_active' : false,
            'status_abbr_honorableTarget' : 'HONORABLE', // as it is relative to the difference between two players, this status doesn't exist in ogame API
        }

        this.turnApiStatusToName = status =>
        {
            if(status.indexOf('v') > -1) status = 'status_abbr_vacation';
            else if(status.indexOf('I') > -1) status = 'status_abbr_longinactive';
            else if(status.indexOf('i') > -1) status = 'status_abbr_inactive';
            else if(status.indexOf('b') > -1) status = 'status_abbr_banned';
            else status = 'status_abbr_active';

            return status;
        }

        if(this.ogl.page == 'highscore')
        {
            setTimeout(() => this.check());
        }
    }

    check()
    {
        if(serverTime.getTime() - this.ogl.db.lastPTREAPIUpdate > 86400000 / 4) // 6h
        {
            this.ogl.PTRE.getRank({},
            data =>
            {
                if(data?.code == 1)
                {
                    GM_setValue(this.rankingDBName, JSON.stringify(data));
                    this.ogl.db.lastPTREAPIUpdate = serverTime.getTime(); // (data?.ranks_array?.[0].timestamp || 0) * 1000;
                    //console.log(data)
                }

                this.loadData();
            });
        }
        else this.loadData();
    }

    loadData()
    {
        const typesList = { 0:'global', 1:'economy', 2:'research', 3:'military', 8:'lifeform' };

        if(currentCategory !== 1 || !typesList[currentType]) return;

        document.querySelector('#stat_list_content').setAttribute('data-category', currentCategory);
        document.querySelector('#stat_list_content').setAttribute('data-type', currentType);

        const data = JSON.parse(GM_getValue(this.rankingDBName) || '{}');
        const ts = data?.ranks_array?.[0]?.timestamp;

        if(ts)
        {
            const hours = Math.floor(Math.abs(serverTime.getTime() - (parseInt(ts) * 1000)) / 36e5);
            document.querySelector('#ranks td.score').innerText += ` (Δ ${hours}${LocalizationStrings.timeunits.short.hour})`;
        }

        document.querySelectorAll('#ranks tbody tr').forEach(line =>
        {
            const id = parseInt(line.getAttribute('id').replace(/\D/g, ''));
            const domPlayerName = line.querySelector('.playername');
            const ranking = parseInt(line.querySelector('.position').innerText.replace(/\D/g, '')) || parseInt(line.querySelector('.highscorePositionIcon')?.className?.replace(/\D/g, ''));
            const name = domPlayerName.innerText.indexOf('...') > -1 && this.ogl.db.udb[id]?.name ? this.ogl.db.udb[id]?.name : domPlayerName.innerText.trim();
            const score = line.querySelector('.score');
            const currentScore = parseInt(score.innerText.replace(/\D/g, ''));
            const oldData = data?.ranks_array?.find(e => e.player_id == id);
            const statusClass = domPlayerName.className?.match(/\b(status_abbr\S*)/)?.[1] || null;
            //const lastData = data.ranks_array_last.find(e => e.player_id == id);

            if(currentType == 0 && ranking == 1) // update top 1 score for expeditions
            {
                this.ogl.db.serverData.topScore = currentScore;
            }

            if(oldData && currentType == 0)
            {
                const scoreDiff = currentScore - parseInt(oldData?.total_score || '0');
                //const ratio = ((scoreDiff / currentScore) * 100).toFixed(2);
    
                const div = Util.addDom('div', { class:'ogl_oldScore', child:`<em>${Util.formatNumber(new Intl.NumberFormat("de-DE", { signDisplay: "exceptZero" }).format(scoreDiff))}</em>`, parent:score });
    
                if(scoreDiff > 0)
                {
                    div.classList.add('ogl_ok');
                }
                else if(scoreDiff < 0)
                {
                    div.classList.add('ogl_danger');
                }
            }

            domPlayerName.innerText = name;

            if(this.ogl.db.udb[id]?.score?.[typesList[currentType]]) this.ogl.db.udb[id].score[typesList[currentType]] = currentScore;
            if(this.ogl.db.udb[id]?.score?.[typesList[currentType]+'Ranking']) this.ogl.db.udb[id].score[typesList[currentType]+'Ranking'] = ranking;
            if(this.ogl.db.udb[id] && name.indexOf('...') < 0) this.ogl.db.udb[id].name = name;

            let status = '';

            if(this.ogl.db.udb[id] && (this.ogl.db.udb[id].status == 'v' || this.ogl.db.udb[id].status == 'o' || this.ogl.db.udb[id].status == 'd' || !statusClass))
            {
                status = this.ogl.db.udb[id].status || 'I';
            }
            else
            {
                status = this.ogl.playerStatus.find(e => e.class == statusClass)?.defaultTag || 'n';
            }

            if(this.ogl.db.udb[id]) this.ogl.db.udb[id].status = status;


            /*if(this.ogl.db.udb[id] && oldData && (this.ogl.db.udb[id]?.liveUpdate || 0) < oldData.timestamp * 1000) // update player status
            {
                this.ogl.db.udb[id].status = this.ogl.playerStatus.find(e => e.class == statusClass || e.class == this.turnApiStatusToName(oldData.status))?.defaultTag || 'n';
                status = this.ogl.db.udb[id].status;
            }
            else if(this.ogl.db.udb[id]) // get status from OGL player db
            {
                status = this.ogl.db.udb[id].status;
            }
            else if(oldData?.status) // get status from last api update
            {
                status = this.ogl.playerStatus.find(e => e.defaultTag == oldData.status)?.defaultTag || statusClass;
            }
            else status = 'n';*/

            if(!line.querySelector('.ogl_flagPicker'))
            {
                this.ogl._ui.turnIntoPlayerLink(id, domPlayerName, false, status);
                this.ogl._ui.addPinButton(line.querySelector('.highscoreNameFieldWrapper'), id);
            }
        });

        initTooltips();
    }
}

class ShortcutManager extends Manager
{
    load()
    {
        document.querySelector('.ogl_shortcuts')?.remove();
        document.querySelector('.ogl_shortCutWrapper')?.remove();

        this.keyList = {};
        this.shortCutWrapper = Util.addDom('div', { class:'ogl_shortCutWrapper', child:'<div></div>' });
        this.shortcutDiv = Util.addDom('div', { class:'ogl_shortcuts', parent:this.ogl.db.options.shortcutsOnRight ? document.querySelector('#rechts') : this.shortCutWrapper });
        this.locked = false;
        this.lastExecution = 0;

        if(!this.loaded)
        {
            document.addEventListener('keydown', event =>
            {
                let activeElement = document.activeElement;

                const tooltipVisible = document.querySelector('.tippy-box[data-state="visible"]');
                const tooltipValidationButton = document.querySelector('.tippy-box .ogl_formValidation');
                const popupVisible = document.querySelector('.ogl_popup.ogl_active');
                const inputFocused = activeElement.tagName == 'INPUT' || activeElement.tagName == 'TEXTAREA';

                if(!event.repeat)
                {
                    if(event.key.toLowerCase() == 'enter' && tooltipVisible && tooltipValidationButton)
                    {
                        tooltipValidationButton.click();
                        return;
                    }
                    else if(event.key.toLowerCase() == 'escape' && popupVisible && !inputFocused)
                    {
                        this.ogl._popup.close();
                        return;
                    }
                }
                
                if(!inputFocused && this.keyList[event.key.toLowerCase()] && !this.locked && !event.ctrlKey && !event.shiftKey) // can use !event.repeat instead of this.locked
                {
                    this.locked = true;
                    this.keyList[event.key.toLowerCase()]();
                }
                else if(!inputFocused && !isNaN(event.key) && this.keyList['2-9'] && !this.locked && !event.ctrlKey && !event.shiftKey) // can use !event.repeat instead of this.locked
                {
                    this.locked = true;
                    this.keyList['2-9'](event.key);
                }
            }, { capture: true });

            document.addEventListener('keyup', () => this.locked = false);

            visualViewport.addEventListener('resize', () => this.updateShortcutsPosition());
            visualViewport.addEventListener('scroll', () => this.updateShortcutsPosition());
        }

        this.loaded = true;

        this.add('menu', () =>
        {
            if(document.querySelector('.ogl_side.ogl_active .ogl_config'))
            {
                this.ogl._ui.side.classList.remove('ogl_active');
                delete this.ogl.db.currentSide;
            }
            else this.ogl._topbar.openSettings();

            return false;
        });

        this.add('showMenuResources', () =>
        {
            this.ogl.db.options.showMenuResources++;
            if(this.ogl.db.options.showMenuResources > 2) this.ogl.db.options.showMenuResources = 0;
            localStorage.setItem('ogl_menulayout', this.ogl.db.options.showMenuResources);
            document.body.setAttribute('data-menulayout', this.ogl.db.options.showMenuResources);

            return false;
        });

        this.add('previousPlanet', () =>
        {
            localStorage.setItem('ogl-redirect', false);
            document.body.classList.remove('ogl_destinationPicker');

            this.redirectToPlanet(-1);
        });

        this.add('nextPlanet', () =>
        {
            localStorage.setItem('ogl-redirect', false);
            document.body.classList.remove('ogl_destinationPicker');

            this.redirectToPlanet(1);
        });

        if((!isNaN(this.ogl.db.currentSide) || this.ogl.db.currentSide == "tagged") && document.querySelector('.ogl_side.ogl_active'))
        {
            this.add('nextPinnedPosition', () =>
            {
                if(!isNaN(this.ogl.db.currentSide) && document.querySelector('.ogl_side.ogl_active'))
                {
                    const arr = Array.from(document.querySelectorAll('.ogl_pinDetail [data-galaxy]'));
                    const index = arr.findLastIndex(e => e.classList.contains('ogl_active'));
                    const target = Util.reorderArray(arr, index)[1];
    
                    if(target) target.click();
                }
                else if(this.ogl.db.currentSide == "tagged" && document.querySelector('.ogl_side.ogl_active'))
                {
                    const arr = Array.from(document.querySelectorAll('.ogl_tagged [data-galaxy]'));
                    const index = arr.findLastIndex(e => e.classList.contains('ogl_active'));
                    const target = Util.reorderArray(arr, index)[1];
    
                    if(target) target.click();
                }
                else
                {
                    fadeBox(this.ogl._lang.find('noCurrentPin'), true);
                }

                return false;
            });
        }

        if(this.ogl.page == 'fleetdispatch')
        {
            Util.addDom('div', {class:'ogl_separator', parent:this.shortcutDiv});

            this.add('expeditionSC', () => { if(fleetDispatcher.currentPage == 'fleet1') this.ogl._fleet.selectExpedition(202) }, 'fleet');
            this.add('expeditionLC', () => { if(fleetDispatcher.currentPage == 'fleet1') this.ogl._fleet.selectExpedition(203) }, 'fleet');
            this.add('expeditionPF', () => { if(fleetDispatcher.currentPage == 'fleet1') this.ogl._fleet.selectExpedition(219) }, 'fleet');

            this.add('fleetRepeat', () =>
            {
                if(!this.ogl._fleet.isReady) return false;
                if(fleetDispatcher.currentPage == 'fleet1')
                {
                    fleetDispatcher.resetShips();
                    Object.values(this.ogl.db.previousFleet.shipsToSend).forEach(ship => fleetDispatcher.selectShip(ship.id, ship.number));
                }

                this.ogl._fleet.setRealTarget(fleetDispatcher.realTarget,
                {
                    galaxy:this.ogl.db.previousFleet.targetPlanet.galaxy,
                    system:this.ogl.db.previousFleet.targetPlanet.system,
                    position:this.ogl.db.previousFleet.targetPlanet.position,
                    type:this.ogl.db.previousFleet.targetPlanet.type,
                    name:this.ogl.db.previousFleet.targetPlanet.name
                });

                fleetDispatcher.selectMission(this.ogl.db.previousFleet.mission);
                fleetDispatcher.cargoMetal = this.ogl.db.previousFleet.cargoMetal;
                fleetDispatcher.cargoCrystal = this.ogl.db.previousFleet.cargoCrystal;
                fleetDispatcher.cargoDeuterium = this.ogl.db.previousFleet.cargoDeuterium;
                fleetDispatcher.realSpeedPercent = this.ogl.db.previousFleet.speedPercent;
                fleetDispatcher.speedPercent = this.ogl.db.previousFleet.speedPercent;

                if(fleetDispatcher.currentPage == 'fleet2')
                {
                    fleetDispatcher.fetchTargetPlayerData();
                }

                if(fleetDispatcher.mission == 15)
                {
                    document.querySelector('#fleet2 #expeditiontime').value = this.ogl.db.previousFleet.expeditionTime;
                    document.querySelector('#fleet2 #expeditiontimeline .dropdown a').innerText = this.ogl.db.previousFleet.expeditionTime;
                    fleetDispatcher.updateExpeditionTime();
                }

                fleetDispatcher.setFleetPercent(fleetDispatcher.realSpeedPercent);

                Object.values(document.querySelector('#speedPercentage'))[0].percentageBarInstance.setValue(fleetDispatcher.realSpeedPercent);

                fleetDispatcher.refresh();
                fleetDispatcher.focusSubmitFleet1();
            }, 'fleet');

            this.add('fleetSelectAll', () =>
            {
                if(!this.ogl._fleet.isReady) return false;
                if(fleetDispatcher.currentPage == 'fleet1') fleetDispatcher.selectAllShips();
                else if(fleetDispatcher.currentPage == 'fleet2') fleetDispatcher.selectMaxAll();
                fleetDispatcher.refresh();
            }, 'fleet');

            if(this.ogl.db.quickRaidList && this.ogl.db.quickRaidList.length > 0)
            {
                this.add('quickRaid', () =>
                {
                    if(!this.ogl._fleet.isReady) return false;
                    if(fleetDispatcher.currentPage == 'fleet1')
                    {
                        fleetDispatcher.resetShips();
    
                        this.ogl._fleet.isQuickRaid = true;
                        
                        const target = this.ogl.db.quickRaidList[0].match(/.{1,3}/g).map(Number);
                        const amount = this.ogl._fleet.shipsForResources(this.ogl.db.options.defaultShip, this.ogl.db.options.resourceTreshold);
                        fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, amount);
    
                        fleetDispatcher.realTarget.galaxy = target[0];
                        fleetDispatcher.realTarget.system = target[1];
                        fleetDispatcher.realTarget.position = target[2];
                        fleetDispatcher.realTarget.type = 1;
                        fleetDispatcher.selectMission(1);
                        fleetDispatcher.targetPlanet.name = `Quick raid ${target.join(':')}`;
                        fleetDispatcher.cargoMetal = 0;
                        fleetDispatcher.cargoCrystal = 0;
                        fleetDispatcher.cargoDeuterium = 0;
                        fleetDispatcher.mission = 1;
                        fleetDispatcher.speedPercent = 10;
    
                        fleetDispatcher.refresh();
                        fleetDispatcher.focusSubmitFleet1();
                    }
                }, 'fleet');
            }

            this.add('fleetReverseAll', () =>
            {
                if(!this.ogl._fleet.isReady) return false;
                if(fleetDispatcher.currentPage == 'fleet1')
                {
                    fleetDispatcher.shipsOnPlanet.forEach(ship =>
                    {
                        const delta = ship.number - (fleetDispatcher.findShip(ship.id)?.number || 0);
                        fleetDispatcher.selectShip(ship.id, delta);
                        fleetDispatcher.refresh();
                    });

                    fleetDispatcher.refresh();
                    fleetDispatcher.focusSubmitFleet1();
                }
                else if(fleetDispatcher.currentPage == 'fleet2')
                {
                    ['metal', 'crystal', 'deut', 'food'].forEach(type =>
                    {
                        fleetDispatcher[this.ogl._fleet.cargo[type]] = Math.min(fleetDispatcher[this.ogl._fleet.resOnPlanet[type]] - fleetDispatcher[this.ogl._fleet.cargo[type]], fleetDispatcher.getFreeCargoSpace());
                    });
                    
                    fleetDispatcher.refresh();
                }
            }, 'fleet');

            this.add('fleetResourcesSplit', keyNumber =>
            {
                if(!this.ogl._fleet.isReady) return false;
                this.keyNumberClickFleet1 = this.keyNumberClickFleet1 || 0;
                this.keyNumberClickFleet2 = this.keyNumberClickFleet2 || 0;

                if(fleetDispatcher.currentPage == 'fleet1')
                {
                    if(!keyNumber || isNaN(keyNumber)) keyNumber = 2 + this.keyNumberClickFleet1;
                    this.keyNumberClickFleet2 = this.keyNumberClickFleet1;
                    this.keyNumberClickFleet1++;
                    if(this.keyNumberClickFleet1 > 7) this.keyNumberClickFleet1 = 0;

                    if(keyNumber == 0) fleetDispatcher.resetShips();
                    else fleetDispatcher.shipsOnPlanet.forEach(ship => fleetDispatcher.selectShip(ship.id, Math.ceil(ship.number / keyNumber)));
                }
                else if(fleetDispatcher.currentPage == 'fleet2')
                {
                    if(!keyNumber || isNaN(keyNumber)) keyNumber = 2 + this.keyNumberClickFleet2;
                    this.keyNumberClickFleet2++;
                    if(this.keyNumberClickFleet2 > 7) this.keyNumberClickFleet2 = 0;
                    fleetDispatcher.resetCargo();

                    let fleetDispatcherResources = ['metalOnPlanet', 'crystalOnPlanet', 'deuteriumOnPlanet'];

                    if(keyNumber == 0) fleetDispatcher.resetCargo();
                    else
                    {
                        document.querySelectorAll('#fleet2 #resources .res_wrap').forEach((resource, index) =>
                        {
                            let cargoType = ['cargoMetal', 'cargoCrystal', 'cargoDeuterium'];
    
                            let currentMax = fleetDispatcher[fleetDispatcherResources[index]];
                            if(index == 2) currentMax -= fleetDispatcher.getConsumption();

                            currentMax = Math.min(currentMax / keyNumber, fleetDispatcher.getFreeCargoSpace());
    
                            fleetDispatcher[cargoType[index]] = Math.max(Math.ceil(currentMax), 0);
                            resource.querySelector('input').value = fleetDispatcher[cargoType[index]];
    
                            //fleetDispatcher.focusSendFleet();
                        });
                    }
                }

                fleetDispatcher.refresh();
            });

            this.add('fleetQuickCollect', () =>
            {
                if(!this.ogl._fleet.isReady) return false;
                document.querySelector(`.ogl_requiredShips .ogl_${this.ogl.db.options.defaultShip}`)?.click();
            });

            Util.addDom('div', { class:'ogl_shortcut ogl_button', 'data-key':'enter', child:'<span class="material-icons">subdirectory_arrow_left</span>', parent:this.shortcutDiv, onclick:() =>
            {
                if(!this.ogl._fleet.isReady) return false;
                document.querySelector('#fleetdispatchcomponent').dispatchEvent(new KeyboardEvent('keypress', { keyCode:13 }));
            }});
        }
        else if(this.ogl.page == 'messages')
        {
            Util.addDom('div', {class:'ogl_separator', parent:this.shortcutDiv});

            this.add('enter', () =>
            {
                if(this.ogl._message.nextTarget)
                {
                    document.querySelector(`.ogl_spyLine[data-id="${this.ogl._message.nextTarget.id}"] .ogl_loot`).click();
                }
            });
        }
        else if(this.ogl.page == 'galaxy')
        {
            Util.addDom('div', {class:'ogl_separator', parent:this.shortcutDiv});

            this.add('galaxyUp', () => { submitOnKey('ArrowUp');return false; });
            this.add('galaxyLeft', () => { submitOnKey('ArrowLeft');return false; });
            this.add('galaxyDown', () => { submitOnKey('ArrowDown');return false; });
            this.add('galaxyRight', () => { submitOnKey('ArrowRight');return false; });
            this.add('galaxyReload', () => { submitForm();return false; });
            this.add('galaxySpySystem', () => { document.querySelector('.spysystemlink').click();return false; });
            this.add('discovery', () => sendSystemDiscoveryMission());
        }
        else if(this.ogl.page == 'movement')
        {
            Util.addDom('div', {class:'ogl_separator', parent:this.shortcutDiv});

            this.add('backFirstFleet', () =>
            {
                document.querySelector('#movementcomponent .reversal a[data-key-color="orange"]') && document.querySelector('#movementcomponent .reversal a[data-key-color="orange"]').click();
            }, false, 'orange');

            this.add('backLastFleet', () =>
            {
                document.querySelector('#movementcomponent .reversal a[data-key-color="violet"]') && document.querySelector('#movementcomponent .reversal a[data-key-color="violet"]').click();
            }, false, 'violet');
        }

        if(!this.ogl.db.options.shortcutsOnRight) document.body.appendChild(this.shortCutWrapper);
        this.updateShortcutsPosition();
    }

    add(id, callback, type, color)
    {
        let key = this.ogl.db.options.keyboardActions[id];

        if(id == 'enter')
        {
            key = id;
            id = 'attackNext';
        }

        const callBackWithMessage = params =>
        {
            const result = callback(params);
            if(result !== false) this.ogl._notification.addToQueue(this.ogl._lang.find(id));
        }

        const btn = Util.addDom('div',
        {
            'data-key':key,
            'data-key-color':color,
            'data-key-id':id,
            class:'ogl_shortcut ogl_button tooltip',
            parent:this.shortcutDiv,
            title:this.ogl._lang.find(id),
            child:key.replace('enter', '<span class="material-icons">subdirectory_arrow_left</span>'),
            onclick:() => callBackWithMessage()
        });

        if(id == 'quickRaid') btn.innerText += ` (${this.ogl.db.quickRaidList.length})`;

        this.keyList[key] = params =>
        {
            if(type == 'fleet' && (!this.ogl._fleet.isReady || !unsafeWindow.fleetDispatcher || unsafeWindow.fleetDispatcher.fetchTargetPlayerDataTimeout)) return;
            callBackWithMessage(params);
        };
    }

    updateShortcutsPosition()
    {
        if(this.ogl.db.options.shortcutsOnRight) return;

        const div = this.shortCutWrapper;
        div.style.top = visualViewport.offsetTop + 'px';
        div.style.height = visualViewport.height - 25 / window.visualViewport.scale + 'px';
        div.style.left = visualViewport.offsetLeft + 'px';
        div.style.width = visualViewport.width + 'px';
        this.shortcutDiv.style.gridGap = 7 / window.visualViewport.scale + 'px';
        div.querySelectorAll('.ogl_shortcut').forEach(e => e.style.zoom = 1 / visualViewport.scale);
    }

    redirectToPlanet(direction)
    {
        const url = new URLSearchParams(window.location.search);

        let urlParams = {};
        urlParams.page = url.get('page');
        urlParams.component = url.get('component');
        urlParams.ogldestinationtype = url.get('ogldestinationtype');
        urlParams.ogldestinationid = url.get('ogldestinationid');
        urlParams.oglfirstsourceid = url.get('oglfirstsourceid');
        urlParams.galaxy = url.get('galaxy');
        urlParams.system = url.get('system');
        urlParams.position = url.get('position');
        urlParams.type = url.get('type');

        const currentPlanet = this.ogl.account.planets.getCurrent();
        const destination = urlParams.destination || currentPlanet.currentType;

        let nextPlanet = this.ogl.account.planets.getNext();
        let nextPlanetWithMoon = this.ogl.account.planets.getNextWithMoon();
        let prevPlanet = this.ogl.account.planets.getPrev();
        let prevPlanetWithMoon = this.ogl.account.planets.getPrevWithMoon();

        if(urlParams.ogldestinationid == nextPlanet.id) nextPlanet = this.ogl.account.planets.getNext(1);
        if(urlParams.ogldestinationid == nextPlanetWithMoon.moonID) nextPlanetWithMoon = this.ogl.account.planets.getNextWithMoon(1);
        if(urlParams.ogldestinationid == prevPlanet.id) prevPlanet = this.ogl.account.planets.getPrev(1);
        if(urlParams.ogldestinationid == prevPlanetWithMoon.moonID) prevPlanetWithMoon = this.ogl.account.planets.getPrevWithMoon(1);

        const params = {};
        params.page = urlParams.page;
        if(urlParams.component) params.component = urlParams.component;
        params.cp = direction == 1 ? (destination == 'moon' ? nextPlanetWithMoon.moonID : nextPlanet.id) : (destination == 'moon' ? prevPlanetWithMoon.moonID : prevPlanet.id);
        if(direction === 0) delete params.cp;
        if(this.ogl.mode) params.oglmode = this.ogl.mode;
        if(urlParams.ogldestinationtype) params.ogldestinationtype = urlParams.ogldestinationtype;

        for(let [key, value] of Object.entries(urlParams))
        {
            if(value) params[key] = value;
        }

        if(direction !== 0 && this.ogl.mode && (urlParams.oglfirstsourceid == nextPlanet.id || urlParams.oglfirstsourceid == nextPlanetWithMoon.moonID))
        {
            window.location.href = this.getRedirectionLink({ component:'overview', cp:params.cp });
        }
        else
        {
            window.location.href = this.getRedirectionLink(params);
        }
    }

    getRedirectionLink(params)
    {
        params = params || {};
        params.page = params.page || 'ingame';

        let link = `${window.location.href.split('?')[0]}?page=${params.page}`;

        for(let [key, value] of Object.entries(params))
        {
            if(key != 'page') link += `&${key}=${value}`;
        }

        return link;
    }
}

class TechManager extends Manager
{
    load()
    {
        this.ogl.currentPlanet.obj.todolist = this.ogl.currentPlanet.obj.todolist || {};

        this.initialLevel = 0;
        this.levelOffset = 0;
        this.detailCumul = {};

        this.checkProductionBoxes();
        this.ogl._movement.updateSideIcons();

        if(unsafeWindow['technologyDetails'])
        {
            document.querySelectorAll('#technologydetails').forEach((e, index) => { if(index > 0) e.remove(); });

            technologyDetails.show = technologyId =>
            {
                if(this.xhr)
                {
                    this.xhr.abort();
                }

                const wrapper = document.querySelector('#technologydetails_wrapper');
                const content = wrapper.querySelector('#technologydetails_content');

                document.querySelectorAll('.technology.showsDetails').forEach(e => e.classList.remove('showsDetails'));

                if(!content.querySelector('.ogl_loading'))
                {
                    content.innerHTML = '<div class="ogl_wrapperloading"><div class="ogl_loading"></div></div>';
                }

                wrapper.classList.add('ogl_active');

                const getData = tries =>
                {
                    tries = tries || 0;

                    this.xhr = $.ajax(
                    {
                        url:technologyDetails.technologyDetailsEndpoint,
                        data: { technology:technologyId }
                    })
                    .done(data =>
                    {
                        try
                        {
                            const json = JSON.parse(data);
            
                            if(json.status === 'failure') technologyDetails.displayErrors(json.errors);
                            else
                            {
                                $('#technologydetails_content').html(json.content[json.target]);
                                this.check(technologyId, wrapper);
                            }
                        }
                        catch(error)
                        {
                            if(tries < 2) setTimeout(() => getData(tries + 1), 1000);
                        }
                    });
                }

                getData();
            }
    
            technologyDetails.hide = () =>
            {
                const wrapper = document.querySelector('#technologydetails_wrapper');
                wrapper.classList.remove('ogl_active');
                wrapper.classList.remove('slide-up');

                document.querySelectorAll('.technology.showsDetails').forEach(e => e.classList.remove('showsDetails'));

                technologyDetails.id = false;
                technologyDetails.lvl = false;
            }

            const urlTech = new URLSearchParams(window.location.search).get('openTech');
            if(urlTech) technologyDetails.show(urlTech);
        }

        document.querySelectorAll('#technologies .technology[data-technology]').forEach(tech =>
        {
            const id = tech.getAttribute('data-technology');
            this.ogl.db.serverData[id] = tech.getAttribute('aria-label') || id;
            if(id == 217)
            {
                const amount = this.calcMaxCrawler();
                const crawlerInfo = Util.addDom('div', { class:'ogl_crawlerInfo' });

                Object.entries(amount).forEach(entry =>
                {
                    Util.addDom('div', { parent:crawlerInfo, child:`${entry[0]}%<i class="material-icons">arrow_forward</i>${Util.formatNumber(entry[1])}` });
                });

                tech.appendChild(crawlerInfo);
            }

            if(this.ogl.db.options.debugMode)
            {
                Util.addDom('div', { style:'background:rgba(0,0,0,.8); position:relative; top:20px; text-align:center;', child:`#${id}`, parent:tech.querySelector('.icon') });
            }
        });

        this.ogl._topbar.checkUpgrade();

        Util.overWrite('reload_page', unsafeWindow, url =>
        {
            this.ogl.db.noFetch = true;
        });
    }

    check(id, details)
    {
        if(details.querySelector('.shipyardSelection'))
        {
            details.querySelector('.sprite_large').appendChild(details.querySelector('.shipyardSelection'));
        }

        const actions = Util.addDom('div', { parent:details.querySelector('.sprite') || details.querySelector('.sprite_large'), class:'ogl_actions' });
        const data = Datafinder.getTech(id);

        this.levelOffset = 0;
        this.initialLevel = parseInt(details.querySelector('.information .level')?.getAttribute('data-value') || 0);
        let amount = details.querySelector('#build_amount');

        if(document.querySelector(`#technologies .technology[data-technology="${id}"] .targetlevel`)?.getAttribute('data-value') >= this.initialLevel)
        {
            this.initialLevel += 1;
        }

        if(!amount)
        {
            if(id != 407 && id != 408) // defense shieds
            {
                Util.addDom('div', { parent:actions, class:'material-icons ogl_button', child:'chevron_left', onclick:() =>
                {
                    if(this.levelOffset > 1 - this.initialLevel)
                    {
                        this.levelOffset--;
                        this.displayLevel({ id:id, level:this.initialLevel + this.levelOffset, dom:details });
                    }
                }});
                
                Util.addDom('div', { parent:actions, class:'material-icons ogl_button', child:'close', onclick:() =>
                {
                    this.levelOffset = 0;
                    this.displayLevel({ id:id, level:this.initialLevel, dom:details })
                }});
        
                Util.addDom('div', { parent:actions, class:'material-icons ogl_button', child:'chevron_right', onclick:() =>
                {
                    this.levelOffset++;
                    this.displayLevel({ id:id, level:this.initialLevel + this.levelOffset, dom:details });
                }});
            }

            Util.addDom('div', { parent:actions, class:'material-icons ogl_button', child:'lists', onclick:e =>
            {
                if(this.levelOffset >= 0)
                {
                    //if(this.todoData) this.addToTodolist(tech, this.todoData);
                    e.target.classList.add('ogl_active');
                    this.todoData = {};

                    for(let i=this.initialLevel; i<=this.initialLevel+this.levelOffset;  i++)
                    {
                        const data = this.getTechData(id, i, this.ogl.currentPlanet.obj.id);

                        this.todoData[i] = {};
                        this.todoData[i].level = (id == 407 || id == 408) ? 1 : i;
                        this.todoData[i].id = id;
                        this.todoData[i].metal = data.target.metal;
                        this.todoData[i].crystal = data.target.crystal;
                        this.todoData[i].deut = data.target.deut;
                    }

                    this.addToTodolist(this.todoData);
                }
                else
                {
                    this.ogl._notification.addToQueue('Cannot lock previous levels', false);
                }
            }});
        }
        else
        {
            amount.addEventListener('input', () =>
            {
                setTimeout(() =>
                {
                    const value = parseInt(amount.value) || 0;
                    amount.value = Math.min(99999, value);
    
                    if(amount.value)
                    {
                        setTimeout(() => this.displayLevel({ id:id, amount:value, dom:details }));
                    }
                }, 100);
            });

            amount.setAttribute('onkeyup', 'checkIntInput(this, 1, 99999);event.stopPropagation();');
            if(amount.parentNode.querySelector('.maximum')) amount.parentNode.querySelector('.maximum').addEventListener('click', () => amount.dispatchEvent(new Event('input')));

            Util.addDom('div', { parent:actions, class:'material-icons ogl_button', child:'lists', onclick:e =>
            {
                this.todoData = {};

                const number = amount.value && amount.value > 0 ? amount.value : 1;
                const data = this.getTechData(id, number, this.ogl.currentPlanet.obj.id);

                this.todoData[id] = {};
                this.todoData[id].amount = parseInt(number) || 0;
                this.todoData[id].id = id;
                this.todoData[id].metal = data.target.metal;
                this.todoData[id].crystal = data.target.crystal;
                this.todoData[id].deut = data.target.deut;

                this.addToTodolist(this.todoData);
            }});

            const queueDiv = Util.addDom('div', { parent:details.querySelector('.build_amount'), class:'ogl_queueShip' });

            const btn10 = Util.addDom('div', { parent:queueDiv, title:this.ogl._lang.find('repeatQueue'), class:'ogl_button ogl_queue10 tooltip', child:'Repeat x', onclick:() =>
            {
                btn10.classList.add('ogl_disabled');
                input10.classList.add('ogl_disabled');

                const upgrade = () =>
                {
                    fetch(scheduleBuildListEntryUrl+`&technologyId=${id}&amount=${amount.value || 1}&mode=1&token=${token}`,
                    {
                        headers: { 'X-Requested-With': 'XMLHttpRequest' },
                    })
                    .then(response => response.json())
                    .then(result =>
                    {
                        const buildLeft = parseInt(input10.value?.replace(/\D/g,'') || 0) - 1;
                        input10.value = buildLeft;

                        token = result.newAjaxToken;
                        window.stop();

                        if(buildLeft > 0) upgrade();
                        else
                        {
                            btn10.classList.remove('ogl_disabled');
                            input10.classList.remove('ogl_disabled');
                        }
                    });
                }

                upgrade();
            }});

            const input10 = Util.addDom('input', { type:'number', min:0, max:100, value:1, parent:queueDiv, oninput:() =>
            {
                const value = parseInt(input10.value?.replace(/\D/g,'') || 0);
                const min = parseInt(input10.getAttribute('min'));
                const max = parseInt(input10.getAttribute('max'));

                input10.value = Math.min(Math.max(value, min), max);
            }});

            if(details.querySelector('.build-it_wrap .upgrade[disabled]'))
            {
                btn10.classList.add('ogl_disabled');
                input10.classList.add('ogl_disabled');
            }
        }

        // dock
        if(id == 36)
        {
            const wreckfieldButton = details.querySelector('#wreckfield-btns');

            if(wreckfieldButton)
            {
                const checkWreckfield = tries =>
                {
                    //wreckfieldButton.innerText = '';
                    tries = tries || 0;

                    fetch(`${window.location.href.split('?')[0]}?page=ajax&component=repairlayer&asJson=1`,
                    {
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    })
                    .then(response =>
                    {
                        return response.text();
                    })
                    .then(response =>
                    {
                        try
                        {
                            let result = JSON.parse(response);
                            return result;
                        }
                        catch(e)
                        {
                            if(tries < 2)
                            {
                                setTimeout(() => checkWreckfield(tries+1), 1000);
                            }
                            else throw new Error(`Error, wrong serveur data: ${response}`);
                        }
                    })
                    .then(result =>
                    {
                        const shipList = {};
                        const txt = result.hasRepairOrder ? result.loca.shipsUndergoingRepairs : result.loca.availableShipsForRepair;

                        Util.addDom('div', { class:'ogl_button', parent:wreckfieldButton, child:txt.replace(':', ''), onclick:() =>
                        {
                            const container = Util.addDom('div');
                            Util.addDom('h2', { parent:container, child:txt });

                            for(let [shipID, value] of Object.entries(shipList))
                            {
                                Util.addDom('div', { class:`ogl_icon ogl_${shipID}`, child:Util.formatNumber(value), parent:container });
                            }

                            this.ogl._popup.open(container);
                        }});

                        if(result.hasRepairOrder) // ships are ready or under repair
                        {
                            for(let [shipID, value] of Object.entries(result.shipsInRepairOrder))
                            {
                                shipList[shipID] = parseInt(value.amountTotal);
                            }

                            const btn = Util.addDom('div', { class:'ogl_button ogl_disabled', parent:wreckfieldButton, child:result.loca.submitButtonFinishRepair, onclick:() =>
                            {
                                fetch(result.ajaxEndpointReCommission,
                                {
                                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                                })
                                .then(() =>
                                {
                                    this.ogl.currentPlanet.obj.wreckfield = false;
                                    this.ogl.save();

                                    window.location.reload();
                                })
                            }});

                            if(result.canShipsBeDeployedButtonState)
                            {
                                btn.classList.remove('ogl_disabled');
                                Util.addDom('div', { parent:wreckfieldButton, child:result.autoDeployTimeForWF });
                            }
                            else
                            {
                                Util.addDom('div', { parent:wreckfieldButton, child:result.canShipsBeDeployedErrorText });
                            }
                        }
                        else if(result.hasWF) // there is a wreckfield
                        {
                            for(let [shipID, value] of Object.entries(result.shipData))
                            {
                                shipList[shipID] = parseInt(value.amount);
                            }

                            Util.addDom('div', { class:'ogl_button', parent:wreckfieldButton, child:result.loca.submitButtonRepair, onclick:() =>
                            {
                                fetch(result.ajaxEndpointStartRepairs,
                                {
                                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                                })
                                .then(() =>
                                {
                                    const stats = this.ogl._stats.getDayStats(this.ogl._time.timeToKey(serverTime.getTime()));
                                    const durationDom = document.querySelector('.repair_order time')?.getAttribute('datetime');
                                    const duration = this.ogl._time.isoDurationToMs(durationDom) || 0;

                                    for(let [shipID, amount] of Object.entries(shipList))
                                    {
                                        stats.raid = stats.raid || {};
                                        stats.raid.gain = stats.raid.gain || {};
                                        stats.raid.gain[shipID] = (stats.raid.gain[shipID] || 0) + amount;
                                    }

                                    this.ogl.currentPlanet.obj.wreckfield = serverTime.getTime() + Math.max(duration, 1800000); // 30 minutes minimum
                                    this.ogl.save();

                                    window.location.reload();
                                })
                            }});
                        }
                    });

                    wreckfieldButton.classList.add('ogl_active');
                }

                checkWreckfield();
            }
            else
            {
                this.ogl.currentPlanet.obj.wreckfield = false;
                this.ogl.save();
            }
        }

        this.displayLevel({ id:id, amount:amount ? this.initialLevel : 0, level:amount ? 0 : this.initialLevel, dom:details });
    }

    displayLevel(obj)
    {
        obj = obj || obj;

        const id = obj.id || -1;
        const level = obj.level || 0;
        const amount = obj.amount || (level == 0 ? 1 : 0);
        const dom = obj.dom || -1;
        const data = this.getTechData(id, level, this.ogl.currentPlanet.obj.id);
        const cumul = {};

        const costs = dom.querySelector('.costs');
        const narrow = dom.querySelector('.information .narrow') || dom.querySelector('.information ul');
        const costsWrapper = costs.querySelector('.ogl_costsWrapper') || Util.addDom('div', { class:'ogl_costsWrapper' });
        const range = `${this.initialLevel-1} <i class="material-icons">east</i> ${this.initialLevel + this.levelOffset}`;
        const title = dom.querySelector('.information .level');

        this.detailCumul[id] = this.detailCumul[id] || {};
        this.detailCumul[id][level] = this.detailCumul[id][level] || {};

        for(let [costID, cost] of Object.entries(data.target || {}))
        {
            this.detailCumul[id][level][costID] = cost;
        }

        for(let [cumulLvl, cumulCost] of Object.entries(this.detailCumul[id] || {}))
        {
            if(amount || (cumulLvl >= this.initialLevel && cumulLvl <= this.initialLevel + this.levelOffset))
            {
                Object.entries(cumulCost).forEach(entry =>
                {
                    if(amount) cumul[entry[0]] = (entry[1] || 0) * amount;
                    else if(entry[0] == 'energy' || entry[0] == 'population') cumul[entry[0]] = entry[1];
                    else if(entry[0] !== 'timeresult') cumul[entry[0]] = (cumul[entry[0]] || 0) + entry[1];
                });
            }
        }

        cumul.timeresult = this.getTimeString(cumul.duration);

        data.target.requiredPop = parseInt(narrow.querySelector('.required_population .value')?.getAttribute('data-value') || 0);

        if(unsafeWindow['technologyDetails'])
        {
            technologyDetails.id = id;
            technologyDetails.lvl = level || amount;
        }
        
        const costsFragment = document.createDocumentFragment();

        const header = Util.addDom('div', { class:'ogl_icon', parent:costsFragment });
        Util.addDom('div', { parent:header });
        Util.addDom('div', { parent:header, child:Math.max(level || amount, 1) });
        if(!amount && id != 407 && id != 408) Util.addDom('div', { parent:header, child:range });
        Util.addDom('div', { parent:header, class:'material-icons', child:'globe' });

        let rawText;

        ['metal', 'crystal', 'deut', 'energy', 'population'].forEach(resource =>
        {
            if(costs.querySelector(`.${resource.replace('deut', 'deuterium')}`))
            {
                const diff = amount ? (this.ogl.currentPlanet.obj[resource] || 0) - (data.target[resource] || 0) : (this.ogl.currentPlanet.obj[resource] || 0) - (cumul[resource] || 0);
                const line = Util.addDom('div', { class:`ogl_icon ogl_${resource.replace('conso', 'energy')}`, parent:costsFragment });

                // cost
                const costValue = Util.formatToUnits(amount ? cumul[resource] : data.target[resource], 2);
                Util.addDom('div', { class:'tooltip', title:Util.formatNumber(data.target[resource]), parent:line, child:costValue });

                // cumul
                if(!amount) Util.addDom('div', { parent:line, class:'ogl_text tooltip', title:Util.formatNumber(cumul[resource]), child:Util.formatToUnits(cumul[resource], 2) });

                // diff
                if(diff < 0) Util.addDom('div', { parent:line, class:'ogl_danger tooltip', title:Util.formatNumber(diff), child:Util.formatToUnits(diff, 2) });
                else Util.addDom('div', { parent:line, class:'ogl_ok material-icons', child:'check' });

                rawText = (rawText ? rawText + ' | ' : '') + `${Util.formatNumber(cumul[resource])} ${this.ogl._lang.find(resource)}`;
            }
        });

        costs.addEventListener('click', () =>
        {
            GM_setClipboard(rawText, 'text');
            fadeBox('Price copied');
        });

        const narrowKeys = { duration:'build_duration', conso:'additional_energy_consumption', prodEnergy:'energy_production', requiredPop:'required_population' };
        const narrowFragment = document.createDocumentFragment();

        for(let [key, value] of Object.entries(narrowKeys))
        {
            if(data.target[key] && (key != 'conso' || !costsFragment.querySelector('.ogl_energy')))
            {
                const text = (amount && key == 'duration') ? cumul.timeresult : key == 'requiredPop' ? Util.formatToUnits(data.target[key], 0) : key == 'duration' ? data.target.timeresult : Util.formatToUnits(data.target[key], false, true);
                const readableValue = key == 'requiredPop' ? Util.formatToUnits(data.target[key], 0) : key == 'duration' ? data.target.timeresult : isNaN(data.target[key]) ? data.target[key] : Util.formatNumber(data.target[key]);
                const readableCumul = key == 'duration' ? cumul.timeresult : isNaN(cumul[key]) ? cumul[key] : Util.formatNumber(cumul[key]);
                const tooltip = level ?
                    `<div class="ogl_readableTooltip">Level ${level}: <b>${readableValue}</b><br>Level ${range} : <b>${readableCumul || readableValue}</b></div>` :
                    `<div class="ogl_readableTooltip">${this.ogl._lang.find(id)} x1: <b>${readableValue}</b><br>${this.ogl._lang.find(id)} x${amount} : <b>${readableCumul || readableValue}</div>`;

                const li = Util.addDom('li', { class:value, parent:narrowFragment, child:'<strong></strong>' });
                Util.addDom('span', { class:'value tooltip', 'data-value':data.target[key], title:tooltip, parent:li, child:text });
            }
        }

        const msuValue = this.ogl.db.options.msu;
        const msuline = Util.addDom('div', { class:`ogl_icon ogl_msu`, parent:costsFragment });
        const msu = Util.getMSU(data.target.metal, data.target.crystal, data.target.deut, msuValue);
        Util.addDom('div', { class:'tooltip', title:Util.formatNumber(msu), parent:msuline, child:Util.formatToUnits(msu, 2) });

        const cumulMsu = Util.getMSU(cumul.metal, cumul.crystal, cumul.deut, msuValue);
        if(!amount) Util.addDom('div', { parent:msuline, class:'ogl_text tooltip', title:Util.formatNumber(cumulMsu), child:Util.formatToUnits(cumulMsu, 2) });
    

        requestAnimationFrame(() =>
        {
            if(title) title.innerHTML = range;

            if(this.ogl.currentPlanet.obj.todolist[id]?.[level])
            {
                dom.querySelector('.ogl_actions .ogl_button:last-child').classList.add('ogl_active');
            }
            else
            {
                dom.querySelector('.ogl_actions .ogl_button:last-child').classList.remove('ogl_active');
            }

            costsWrapper.innerText = '';
            costsWrapper.appendChild(costsFragment);

            narrow.innerText = '';
            narrow.appendChild(narrowFragment);

            if(!costsWrapper.parentElement)
            {
                costs.appendChild(costsWrapper);
            }

            initTooltips();
        });
    }

    addToTodolist(data)
    {
        this.ogl.currentPlanet.obj.todolist = this.ogl.currentPlanet.obj.todolist || {};

        Object.values(data).forEach(entry =>
        {
            const todolist = this.ogl.currentPlanet.obj.todolist;
            const entryLvl = entry.level || Date.now() + performance.now();
    
            todolist[entry.id] = todolist[entry.id] || {};
            todolist[entry.id][entryLvl] = todolist[entry.id][entryLvl] || {};
            todolist[entry.id][entryLvl].id = entry.id;
            todolist[entry.id][entryLvl].amount = entry.amount || 0;
            todolist[entry.id][entryLvl].level = entryLvl;
            todolist[entry.id][entryLvl].cost =
            {
                metal:entry.metal,
                crystal:entry.crystal,
                deut:entry.deut,
            }
        });

        this.checkTodolist();
    }

    checkTodolist()
    {
        let requireUpdate = false;

        Object.values(this.ogl._dom.planet).forEach(planet =>
        {
            const id = planet._ogl.id;
            const isMoon = planet._ogl.type == 'moon';
            const todolist = this.ogl.db.myPlanets[id]?.todolist || {};
            planet._ogl.sideIcon.querySelectorAll('.ogl_todoIcon').forEach(e => e.remove());

            const count = Object.values(todolist).reduce((accumulator, currentValue) => { return accumulator + Object.keys(currentValue).length; }, 0);
            const total = Object.values(todolist).flatMap(Object.values).reduce((acc, item) => acc + (item.cost?.metal || 0) + (item.cost?.crystal || 0) + (item.cost?.deut || 0), 0);

            Object.values(todolist).forEach((building, index) =>
            {
                if(index == 0)
                {
                    const icon = Util.addDom('div', { class:'material-icons ogl_todoIcon tooltip', child:'lists', 'data-list':`${count}`, parent:planet._ogl.sideIcon, onclick:() =>
                    {
                        this.openTodolist(todolist, `${planet._ogl.coords}:${isMoon ? 3 : 1}`, id);
                    }});

                    if(total <= 0) icon.classList.add('ogl_ok');
                }
            });
        });

        document.querySelectorAll('.technology[data-technology]').forEach(techDom =>
        {
            let techID = techDom.getAttribute('data-technology');
            let techLvL = techDom.querySelector('.targetlevel') || techDom.querySelector('.level');

            if(!techLvL) return;

            techLvL = parseInt(techLvL.getAttribute('data-value'));

            Object.keys(this.ogl.currentPlanet.obj.todolist?.[techID] || {}).forEach(key =>
            {
                if(techLvL >= parseInt(key))
                {
                    delete this.ogl.currentPlanet.obj.todolist[techID][key];

                    if(Object.values(this.ogl.currentPlanet.obj.todolist[techID]).length < 1)
                    {
                        delete this.ogl.currentPlanet.obj.todolist[techID];
                        requireUpdate = true;
                    }
                }
            });
        });

        if(requireUpdate)
        {
            this.checkTodolist();
        }
    }

    openTodolist(data, coords, id)
    {
        let toSend = {};
        const splitted = coords.split(':');

        const container = Util.addDom('div', {class:'ogl_todoList', child:`<h2>Todolist ${splitted[3] == 1 ? 'planet' : 'moon'} [${splitted[0]}:${splitted[1]}:${splitted[2]}]</h2>`});
        const leftDiv = Util.addDom('div', { parent:container });
        const rightDiv = Util.addDom('div', { parent:container, class:'ogl_actions' });

        let totalReq = {};
        let totalSelected = {};

        let updateHeader = (blockData, header, content, footer, block) =>
        {
            setTimeout(() =>
            {
                const checkedCount = content.querySelectorAll('input:checked').length;
                const maxCount = Object.keys(blockData).length;
                const blockID = Object.values(blockData)[0]?.id;

                if(!maxCount)
                {
                    block.remove();
                    Object.keys(toSend).filter(k => k.startsWith(blockID+'_')).forEach(k => delete toSend[k]);
                    delete this.ogl.db.myPlanets[id].todolist[blockID];
                    this.checkTodolist();
                    return;
                }
    
                header.innerHTML = this.ogl.db.serverData[blockID];
                header.innerHTML += ` (<b>${checkedCount}</b>/${maxCount})`;
    
                if(checkedCount != maxCount && footer && footer.querySelector('input:checked')) footer.querySelector('input:checked').checked = false;
                
                if(Object.entries(toSend).length > 0) sendButton.classList.remove('ogl_disabled');
                else sendButton.classList.add('ogl_disabled');

                updateTotal();
            });
        }

        let updateTotal = () =>
        {
            totalDiv.innerHTML = `
                <div class="ogl_grid">
                    <div class="ogl_icon"><div class="material-icons">sigma</div><div>Required</div><div>Selected</div></div>
                    <div class="ogl_icon ogl_metal"><div>${Util.formatToUnits(totalReq.metal || 0)}</div><div>${Util.formatToUnits(totalSelected.metal || 0)}</div></div>
                    <div class="ogl_icon ogl_crystal"><div>${Util.formatToUnits(totalReq.crystal || 0)}</div><div>${Util.formatToUnits(totalSelected.crystal || 0)}</div></div>
                    <div class="ogl_icon ogl_deut"><div>${Util.formatToUnits(totalReq.deut || 0)}</div><div>${Util.formatToUnits(totalSelected.deut || 0)}</div></div>
                </div>
            `;
        }

        let updateFooter = (footer, content, cumul) =>
        {
            setTimeout(() =>
            {
                footer.innerHTML = '';

                let line = Util.addDom('div', { class:'ogl_line ogl_blockRecap', parent:footer, child:
                `
                    <div>all</div>
                    <div class="ogl_icon ogl_metal">${Util.formatToUnits(cumul.metal, 2)}</div>
                    <div class="ogl_icon ogl_crystal">${Util.formatToUnits(cumul.crystal, 2)}</div>
                    <div class="ogl_icon ogl_deut">${Util.formatToUnits(cumul.deut, 2)}</div>
                    <label></label>
                ` });

                // select block
                let input = Util.addDom('input', { type:'checkbox', parent:line.querySelector('label'), oninput:() =>
                {
                    if(input.checked) content.querySelectorAll('input').forEach(input => { if(input.checked != true) input.click(); });
                    else content.querySelectorAll('input').forEach(input => { if(input.checked == true) input.click(); });
                }});

                // send block
                Util.addDom('button', { class:'material-icons', parent:line, child:'cube-send', onclick:() =>
                {
                    content.querySelectorAll('input').forEach(input => { if(input.checked != true) input.click(); });
                    setTimeout(() => container.querySelector('.ogl_button').click(), 50);
                }});

                // remove block
                Util.addDom('button', { class:'material-icons ogl_removeTodo', parent:line, child:'close', onclick:() =>
                {
                    content.querySelectorAll('.ogl_removeTodo').forEach(button => { button.click(); });
                    setTimeout(() => updateTotal(), 10);
                }});
            });
        }

        Object.values(data).forEach(blockData =>
        {
            const block = Util.addDom('div', { class:'ogl_tech', parent:leftDiv });
            const header = Util.addDom('h3', { parent:block, onclick:() => block.classList.toggle('ogl_active') });
            const content = Util.addDom('div', { parent:block });
            const footer = Util.addDom('footer', { parent:block });
            const cumul = {};

            Object.values(blockData).forEach(todo =>
            {
                const displayedCell = todo.amount || todo.level;
                const key = `${todo.id}_${todo.level}`;

                let line = Util.addDom('div', { class:'ogl_line', 'data-parent':this.ogl.db.serverData[todo.id], parent:content, child:
                `
                    <div>${displayedCell}</div><div class="ogl_icon ogl_metal">${Util.formatToUnits(todo.cost?.metal, 2)}</div>
                    <div class="ogl_icon ogl_crystal">${Util.formatToUnits(todo.cost?.crystal, 2)}</div>
                    <div class="ogl_icon ogl_deut">${Util.formatToUnits(todo.cost?.deut, 2)}</div>
                    <label></label>
                ` });

                cumul.metal = (cumul.metal || 0) + (todo.cost?.metal || 0);
                cumul.crystal = (cumul.crystal || 0) + (todo.cost?.crystal || 0);
                cumul.deut = (cumul.deut || 0) + (todo.cost?.deut || 0);

                totalReq.metal = (totalReq.metal || 0) + (todo.cost?.metal || 0);
                totalReq.crystal = (totalReq.crystal || 0) + (todo.cost?.crystal || 0);
                totalReq.deut = (totalReq.deut || 0) + (todo.cost?.deut || 0);

                // select line
                let input = Util.addDom('input', { type:'checkbox', parent:line.querySelector('label'), oninput:() =>
                {
                    if(input.checked)
                    {
                        toSend[key] = todo;
                        input.setAttribute('data-clicked', performance.now());

                        totalSelected.metal = (totalSelected.metal || 0) + (todo.cost?.metal || 0);
                        totalSelected.crystal = (totalSelected.crystal || 0) + (todo.cost?.crystal || 0);
                        totalSelected.deut = (totalSelected.deut || 0) + (todo.cost?.deut || 0);
                    }
                    else
                    {
                        delete toSend[key];
                        input.removeAttribute('data-clicked');

                        totalSelected.metal = (totalSelected.metal || 0) - (todo.cost?.metal || 0);
                        totalSelected.crystal = (totalSelected.crystal || 0) - (todo.cost?.crystal || 0);
                        totalSelected.deut = (totalSelected.deut || 0) - (todo.cost?.deut || 0);
                    }

                    leftDiv.querySelectorAll('label').forEach(e => e.removeAttribute('data-order'));

                    Array.from(leftDiv.querySelectorAll('.ogl_tech > div input:checked')).sort((a, b) => a.getAttribute('data-clicked') - b.getAttribute('data-clicked')).forEach((e, index) =>
                    {
                        e.parentNode.setAttribute('data-order', index+1);
                    });

                    updateHeader(blockData, header, content, footer, block);
                }});

                // send line
                Util.addDom('button', { class:'material-icons', parent:line, child:'cube-send', onclick:() =>
                {
                    input.click();
                    setTimeout(() => container.querySelector('.ogl_button').click(), 50);
                }});

                // remove line
                Util.addDom('button', { class:'material-icons ogl_removeTodo', parent:line, child:'close', onclick:() =>
                {
                    line.remove();

                    cumul.metal = (cumul.metal || 0) - (todo.cost?.metal || 0);
                    cumul.crystal = (cumul.crystal || 0) - (todo.cost?.crystal || 0);
                    cumul.deut = (cumul.deut || 0) - (todo.cost?.deut || 0);

                    totalSelected.metal = (totalSelected.metal || 0) - (todo.cost?.metal || 0);
                    totalSelected.crystal = (totalSelected.crystal || 0) - (todo.cost?.crystal || 0);
                    totalSelected.deut = (totalSelected.deut || 0) - (todo.cost?.deut || 0);

                    delete toSend[key];
                    delete this.ogl.db.myPlanets[id].todolist[todo.id][todo.level];

                    if(Object.keys(this.ogl.db.myPlanets[id].todolist[todo.id] || {}).length <= 0)
                    {
                        delete this.ogl.db.myPlanets[id].todolist[todo.id];
                        block.remove();
                    }

                    if(Object.keys(ogl.db.myPlanets[id].todolist || {}).length <= 0)
                    {
                        this.ogl.db.myPlanets[id].todolist = {};
                        this.ogl._popup.close();
                    }

                    Array.from(leftDiv.querySelectorAll('.ogl_tech > div input:checked')).sort((a, b) => a.getAttribute('data-clicked') - b.getAttribute('data-clicked')).forEach((e, index) =>
                    {
                        e.parentNode.setAttribute('data-order', index+1);
                    });

                    if(unsafeWindow['technologyDetails'])
                    {
                        if(id == this.ogl.currentPlanet.obj.id && document.querySelector('#technologydetails .ogl_actions .ogl_active'))
                        {
                            document.querySelector('#technologydetails .ogl_actions .ogl_active').classList.remove('ogl_active');
                        }
                    }

                    updateHeader(blockData, header, content, footer, block);
                    updateFooter(footer, content, cumul);
                    this.checkTodolist();
                }});
            });

            updateHeader(blockData, header, content, footer, block);
            updateFooter(footer, content, cumul);
        });

        let url = `${window.location.href.split('?')[0]}?page=ingame&component=fleetdispatch&galaxy=${splitted[0]}&system=${splitted[1]}&position=${splitted[2]}&oglmode=3&targetid=${id}&type=${splitted[3]}`;

        let sendButton = Util.addDom('button', { class:'ogl_button ogl_disabled', parent:rightDiv, child:'Send selection <i class="material-icons">cube-send</i>', onclick:() =>
        {
            this.ogl.cache.toSend = Object.values(toSend);
            if(substractButton.querySelector('input').checked) url += '&substractMode=true';
            window.location.href = url;
            rightDiv.querySelectorAll('.ogl_button').forEach(e => e.classList.add('ogl_disabled'));
        }});

        Util.addDom('button', { class:'ogl_button', parent:rightDiv, child:'Send all <i class="material-icons">cube-send</i>', onclick:() =>
        {
            leftDiv.querySelectorAll('input').forEach(input => { if(input.checked != true) input.click(); });

            setTimeout(() =>
            {
                this.ogl.cache.toSend = Object.values(toSend);
                rightDiv.querySelectorAll('.ogl_button').forEach(e => e.classList.add('ogl_disabled'));
                if(substractButton.querySelector('input').checked) url += '&substractMode=true';
                window.location.href = url;
            }, 100);
        }});

        Util.addDom('button', { class:'ogl_button ogl_removeTodo', parent:rightDiv, child:'Remove all <i class="material-icons">close</i>', onclick:() =>
        {
            this.ogl.db.myPlanets[id].todolist = {};
            this.ogl._popup.close();
            this.checkTodolist();

            if(unsafeWindow['technologyDetails'])
            {
                if(id == this.ogl.currentPlanet.obj.id && document.querySelector('#technologydetails .ogl_actions .ogl_active'))
                {
                    document.querySelector('#technologydetails .ogl_actions .ogl_active').classList.remove('ogl_active');
                }
            }
        }});

        let substractButton = Util.addDom('label', { class:'ogl_button', parent:rightDiv, child:'<input type="checkbox">Substract planet resources' });

        const totalDiv = Util.addDom('div', { class:'ogl_totalRequired', parent:rightDiv });

        this.ogl._popup.open(container);
    }

    getTechData(id, level, planetID)
    {
        if(!id) return;

        const data = Datafinder.getTech(id);
        const planetData = this.ogl.db.myPlanets[planetID] || {};

        let baseLabs = [];
        let bestLabs = 0;
        let labRequired =
        {
            // you can't use a lab with a too low level for the tech
            113:1, 120:1, 121:4, 114:7, 122:4, 115:1, 117:2, 118:7,
            106:3, 108:1, 124:3, 123:10, 199:12, 109:4, 110:6, 111:2,
        }

        document.querySelectorAll('.smallplanet').forEach(line =>
        {
            const coloID = line.getAttribute('id').replace('planet-', '');
            const colo = this.ogl.db.myPlanets[coloID];
            
            if(!colo) return;

            if(planetID != coloID && colo[31] >= labRequired[id]) baseLabs.push(colo[31]); // base labo
        });

        baseLabs.sort((a, b) => b - a);
        baseLabs = baseLabs.slice(0, Math.min(baseLabs.length, planetData[123]));
        if(baseLabs.length) bestLabs = baseLabs.reduce((a, b) => a + b);

        const planet = {};
        planet.lifeform = planetData.lifeform || 0;
        //planet.activeLF = planetData.activeLFTechs || [];

        this.totalLab = (planetData[31] || 0) + bestLabs;

        const tech = {};

        tech.id = id;
        tech.isBaseBuilding = tech.id < 100;
        tech.isBaseResearch = tech.id > 100 && tech.id <= 199;
        tech.isBaseShip = tech.id > 200 && tech.id <= 299;
        tech.isBaseDef = tech.id > 400 && tech.id <= 599;
        tech.isLfBuilding = (tech.id > 11100 && tech.id <= 11199) || (tech.id > 12100 && tech.id <= 12199) || (tech.id > 13100 && tech.id <= 13199) || (tech.id > 14100 && tech.id <= 14199);
        tech.isLfResearch = (tech.id > 11200 && tech.id <= 11299) || (tech.id > 12200 && tech.id <= 12299) || (tech.id > 13200 && tech.id <= 13299) || (tech.id > 14200 && tech.id <= 14299);

        tech.base = {};
        tech.base.metal = data.metal || 0;
        tech.base.crystal = data.crystal || 0;
        tech.base.deut = data.deut || 0;
        tech.base.energy = data.energy || 0;
        tech.base.duration = data.durationbase || 0;
        tech.base.conso = data.conso || 0;
        tech.base.population = data.bonus1BaseValue || 0;

        tech.factor = {};
        tech.factor.price = data.priceFactor || 2;
        tech.factor.duration = data.durationfactor || 2;
        tech.factor.energy = data.energyFactor || data.energyIncreaseFactor || 2;
        tech.factor.population = data.bonus1IncreaseFactor || 2;

        tech.bonus = {};
        tech.bonus.price = 0;
        tech.bonus.duration = 0;
        tech.bonus.classDuration = 0;
        tech.bonus.eventDuration = 0;
        tech.bonus.technocrat = 0;
        tech.bonus.engineer = 0;
        tech.bonus.conso = 0;
        tech.bonus.prodEnergy = 0;

        if(this.ogl.account.class == 1) tech.bonus.prodEnergy += .1; // 10% rocktal energy bonus
        if(this.ogl.db.allianceClass == 2) tech.bonus.prodEnergy += .05; // 5% trader alliance bonus

        //tech.bonus.race = localBonusRaceLevel * (1 + localBonus11111 + localBonus13107 + localBonus13111);

        if(planet.lifeform == 2)
        {
            // rocktal chamber
            tech.bonus.prodEnergy += planetData[12107] * Datafinder.getTech(12107).bonus1BaseValue / 100;
            tech.bonus.conso += planetData[12107] * Datafinder.getTech(12107).bonus2BaseValue / 100;

            if(tech.isLfBuilding)
            {
                // rocktal monument
                tech.bonus.price += planetData[12108] * Datafinder.getTech(12108).bonus1BaseValue / 100;
                tech.bonus.duration += planetData[12108] * Datafinder.getTech(12108).bonus2BaseValue / 100;
            }
        }
        else if(planet.lifeform == 3)
        {
            tech.bonus.prodEnergy += planetData[13107] * Datafinder.getTech(13107).bonus1BaseValue / 100;

            if(tech.isBaseShip || tech.isBaseDef)
            {
                tech.bonus.duration += planetData[13106] * Datafinder.getTech(13106).bonus1BaseValue / 100; // meca center
            }
        }

        if(tech.isBaseResearch && document.querySelector('.technology .acceleration')) tech.bonus.eventDuration += parseInt(document.querySelector('.technology .acceleration').getAttribute('data-value')) / 100; // research speed event bonus
        //if(tech.isBaseResearch && this.ogl.account.class == 3) tech.bonus.classDuration += 0.25 * (1 + cumul[14218] * Datafinder.getTech(14218).bonus1BaseValue / 100 * tech.bonus.race); // explo class research speed bonus
        if(tech.isBaseResearch && this.ogl.account.class == 3) tech.bonus.classDuration += .25 * (1 + (this.ogl.db.lfBonuses?.Characterclasses3?.bonus || 0) / 100); // explo class research speed bonus
        if(tech.isBaseResearch && document.querySelector('#officers .technocrat.on')) tech.bonus.technocrat += 0.25; // technocrat research speed bonus
        if(document.querySelector('#officers .engineer.on')) tech.bonus.engineer += 0.10; // engineer energy prod bonus

        if(tech.isLfResearch)
        {
            if(planet.lifeform == 1) // human
            {
                tech.bonus.price += planetData[11103] * Datafinder.getTech(11103).bonus1BaseValue / 100;
                tech.bonus.duration += planetData[11103] * Datafinder.getTech(11103).bonus2BaseValue / 100;
            }
            else if(planet.lifeform == 2) // rocktal
            {
                tech.bonus.price += planetData[12103] * Datafinder.getTech(12103).bonus1BaseValue / 100;
                tech.bonus.duration += planetData[12103] * Datafinder.getTech(12103).bonus2BaseValue / 100;
            }
            else if(planet.lifeform == 3) // meca
            {
                tech.bonus.price += planetData[13103] * Datafinder.getTech(13103).bonus1BaseValue / 100;
                tech.bonus.duration += planetData[13103] * Datafinder.getTech(13103).bonus2BaseValue / 100;
            }
            else if(planet.lifeform == 4) // kaelesh
            {
                tech.bonus.price += planetData[14103] * Datafinder.getTech(14103).bonus1BaseValue / 100;
                tech.bonus.duration += planetData[14103] * Datafinder.getTech(14103).bonus2BaseValue / 100;
            }

            tech.bonus.price += (this.ogl.db.lfBonuses?.LfResearch?.cost || 0) / 100;
            tech.bonus.duration += (this.ogl.db.lfBonuses?.LfResearch?.duration || 0) / 100;
        }

        if(planet.lifeform == 2 && (tech.id == 1 || tech.id == 2 || tech.id == 3 || tech.id == 4 || tech.id == 12 || tech.id == 12101 || tech.id == 12102))
        {
            tech.bonus.price += planetData[12111] * Datafinder.getTech(12111).bonus1BaseValue / 100;
        }

        if(tech.isBaseResearch || tech.isBaseDef || tech.isBaseShip)
        {
            tech.bonus.price += (this.ogl.db.lfBonuses?.[tech.id]?.cost || 0) / 100;
            tech.bonus.duration += (this.ogl.db.lfBonuses?.[tech.id]?.duration || 0) / 100;
        }

        tech.target = {};

        if(tech.isBaseBuilding || tech.isBaseResearch)
        {
            const rawMetal = Math.floor(tech.base.metal * Math.pow(tech.factor.price, level - 1));
            const rawCrystal =  Math.floor(tech.base.crystal * Math.pow(tech.factor.price, level - 1));
            const rawDeut =  Math.floor(tech.base.deut * Math.pow(tech.factor.price, level - 1));

            tech.target.metal = Math.floor(rawMetal * (1 - tech.bonus.price));
            tech.target.crystal =  Math.floor(rawCrystal * (1 - tech.bonus.price));
            tech.target.deut =  Math.floor(rawDeut * (1 - tech.bonus.price));
            tech.target.energy =  Math.floor(tech.base.energy * Math.pow(tech.factor.energy, level - 1));

            if(tech.id == 1 || tech.id == 2) tech.target.conso = Math.ceil(10 * level * Math.pow(1.1, level)) - Math.ceil(10 * (level-1) * Math.pow(1.1, level-1));
            if(tech.id == 3) tech.target.conso = Math.ceil(20 * level * Math.pow(1.1, level)) - Math.ceil(20 * (level-1) * Math.pow(1.1, level-1));
            if(tech.id == 4) tech.target.prodEnergy = Math.floor(20 * level * Math.pow(1.1, level)) - Math.floor(20 * (level-1) * Math.pow(1.1, level-1));
            if(tech.id == 12) tech.target.prodEnergy = Math.floor(30 * level * Math.pow((1.05 + (planetData[113] || 0) * 0.01), level)) - Math.floor(30 * (level-1) * Math.pow((1.05 + (planetData[113] || 0) * 0.01), level-1));

            if(tech.isBaseBuilding) tech.target.duration = (rawMetal + rawCrystal) / (2500 * Math.max((id == 41 || id == 42 || id == 43 || id == 15) ? 1 : 4 - level / 2, 1) * (1 + (id == 14 ? this.initialLevel+this.levelOffset-1 : planetData[14]) || 0) * (Math.pow(2, (id == 15 ? this.initialLevel+this.levelOffset-1 : planetData[15]) || 0))) * 3600 * 1000;
            else tech.target.duration = (rawMetal + rawCrystal) / (1000 * (1 + (planetData[31] || 0) + bestLabs)) * 3600 * 1000;
        }
        else if(tech.isLfBuilding || tech.isLfResearch)
        {
            tech.target.metal = Math.floor(Math.floor(tech.base.metal * Math.pow(tech.factor.price, level - 1) * level) * (1 - tech.bonus.price));
            tech.target.crystal = Math.floor(Math.floor(tech.base.crystal * Math.pow(tech.factor.price, level - 1) * level) * (1 - tech.bonus.price));
            tech.target.deut =  Math.floor(Math.floor(tech.base.deut * Math.pow(tech.factor.price, level - 1) * level) * (1 - tech.bonus.price));
            tech.target.energy = Math.floor(Math.floor(level * tech.base.energy * Math.pow(tech.factor.energy, level) * (1 - tech.bonus.price)));
            tech.target.population = Math.floor(Math.floor(tech.base.population * Math.pow(tech.factor.population, level-1) * (1 - tech.bonus.price)));

            if(level < 2) tech.target.conso = Math.floor(level * tech.base.energy);
            else tech.target.conso = Math.floor(Math.floor(level * tech.base.energy * Math.pow(tech.factor.energy, level) - (level-1) * tech.base.energy * Math.pow(tech.factor.energy, level-1)));

            if(tech.isLfBuilding) tech.target.duration = Math.floor(level * tech.base.duration * 1000 * (1 / ((1 + (planetData[14] || 0)) * (Math.pow(2, planetData[15] || 0)))) * Math.pow(tech.factor.duration, level));
            else tech.target.duration = Math.floor(level * tech.base.duration * 1000 * Math.pow(tech.factor.duration, level));
        }
        else if(tech.isBaseShip || tech.isBaseDef)
        {
            const amount = level || 1;

            tech.target.metal = tech.base.metal * amount;
            tech.target.crystal =  tech.base.crystal * amount;
            tech.target.deut =  tech.base.deut * amount;
            tech.target.duration = ((tech.base.metal + tech.base.crystal) / 5000) * (2 / (1 + planetData[21] || 0)) * Math.pow(0.5, (planetData[15] || 0)) * 3600 * 1000;
            if(tech.id == 212) tech.target.prodEnergy = Math.floor(((planetData.temperature + 40 + planetData.temperature) / 2 + 160) / 6) * amount;
        }

        if(this.ogl.db.options.debugMode)
        {
            console.log(JSON.parse(JSON.stringify(tech)));
        }

        tech.target.prodEnergy = Math.floor(tech.target.prodEnergy * (1 + tech.bonus.prodEnergy + tech.bonus.engineer)) || 0;
        tech.target.conso = -Math.ceil(tech.target.conso * (1 - tech.bonus.conso)) || 0;
        tech.target.duration = tech.target.duration / (this.ogl.server.economySpeed * (tech.isBaseResearch ? this.ogl.db.serverData.researchSpeed : 1)) * (1 - tech.bonus.eventDuration) * (1 - tech.bonus.classDuration) * (1 - tech.bonus.technocrat) * (1 - Math.min(tech.bonus.duration, .99));
        tech.target.duration = Math.max(tech.target.duration, 1000);

        if(tech.isBaseShip || tech.isBaseDef)
        {
            tech.target.duration = Math.floor(tech.target.duration / 1000) * 1000;
            tech.target.duration = Math.max(tech.target.duration, 1000) * (level || 1);
        }

        tech.target.timeresult = this.getTimeString(tech.target.duration);

        return tech;
    }

    getTimeString(duration)
    {
        let seconds = duration / 1000;
        let w = Math.floor(seconds / (3600*24*7));
        let d = Math.floor(seconds % (3600*24*7) / (3600*24));
        let h = Math.floor(seconds % (3600*24) / 3600);
        let m = Math.floor(seconds % 3600 / 60);
        let s = Math.floor(seconds % 60);

        let timeString = '';
        let displayed = 0;

        if(w > 0 && displayed < 3) { timeString += `${w}${LocalizationStrings.timeunits.short.week} `; displayed++; }
        if(d > 0 && displayed < 3) { timeString += `${d}${LocalizationStrings.timeunits.short.day} `; displayed++; }
        if(h > 0 && displayed < 3) { timeString += `${h}${LocalizationStrings.timeunits.short.hour} `; displayed++; }
        if(m > 0 && displayed < 3) { timeString += `${m}${LocalizationStrings.timeunits.short.minute} `; displayed++; }
        if(s > 0 && displayed < 3) { timeString += `${s}${LocalizationStrings.timeunits.short.second}`; displayed++; }

        return timeString;
    }

    checkProductionBoxes()
    {
        this.ogl.currentPlanet.obj.upgrades = this.ogl.currentPlanet.obj.upgrades || {};

        Object.entries(this.ogl._time.productionBoxes).forEach(box =>
        {
            const dom = document.querySelectorAll(`#${box[1]} .countdown`);
            if(!dom) return;

            const dateTime = dom[dom.length-1]?.getAttribute('datetime');
            if(!dateTime) return;

            const techType = box[1] == 'productionboxbuildingcomponent' ? 'baseBuilding' : box[1] == 'productionboxresearchcomponent' ? 'baseResearch' : box[1] == 'productionboxshipyardcomponent' ? 'ship' : box[1] == 'productionboxlfbuildingcomponent' ? 'lfBuilding' : box[1] == 'productionboxlfresearchcomponent' ? 'lfResearch' : box[1] == 'productionboxextendedshipyardcomponent' ? 'mechaShip' : 'unknown';
            const [, years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0] = dateTime.match(/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/) || [];
            const totalSeconds = (years * 31536000) + (months * 2592000) + (weeks * 604800) + (days * 86400) + (hours * 3600) + (minutes * 60) + parseFloat(seconds);
            const itemEndTime = serverTime.getTime() + totalSeconds * 1000;
            const timeObj = this.ogl._time.getObj(itemEndTime, 'server');
            const endDate = this.ogl.db.options.useClientTime ? timeObj.client : timeObj.server;

            const div = document.querySelector(`#${[box[1]]} .content`);
            div.classList.add(`ogl_${techType}`);

            let content = `<span>${new Date(endDate).toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit', year:'numeric'})} </span>${new Date(endDate).toLocaleTimeString('de-DE')}`;
            Util.addDom('time', { class:'ogl_timeBox', prepend:div.querySelector('.build-faster').parentNode, child:content, 'data-time-server':timeObj.server, 'data-time-client':timeObj.client });

            const boxID = `${techType}Queue-${this.ogl.currentPlanet.obj.id}`;
            const arrival = timeObj.server;

            const notifIcon = Util.addDom('div', { prepend:div.querySelector('.build-faster').parentNode, class:this.ogl.db.browserNotificationList[boxID] ? 'ogl_clockNotif ogl_button ogl_active': 'ogl_clockNotif ogl_button', onclick:e =>
            {
                const browserNotification = {};
                browserNotification.id = boxID;
                browserNotification.arrivalTime = arrival;
                browserNotification.message = `[${this.ogl.currentPlanet.obj.coords}] ${this.ogl.currentPlanet.obj.type} : Production complete`;

                this.ogl._notification.addNotification(browserNotification, e.target);
            }});

            if(this.ogl.db.browserNotificationList[boxID] && Math.abs(this.ogl.db.browserNotificationList[boxID].arrivalTime - arrival) > 5)
            {
                notifIcon.classList.add('ogl_altered');
            }

            if(techType == 'baseResearch')
            {
                const element = document.querySelector(`#${box[1]} .queuePic`).parentNode;
                const lvl = document.querySelector(`#${box[1]} .level`).innerText;
                const id = element.getAttribute('onclick')?.match(/([0-9]+)/)[0];
                const coords = element.getAttribute('onclick')?.match(/[([0-9:]+]/)?.[0]?.slice(1, -1);

                if(!id || !lvl || !coords) return;

                const upgrade = {};
                upgrade.id = id;
                upgrade.name = this.ogl.db.serverData[id] || id;
                upgrade.lvl = lvl;
                upgrade.end = itemEndTime;
                upgrade.type = techType;

                if(coords && coords != this.ogl.currentPlanet.obj.coords)
                {
                    console.log("values:", Object.values(this.ogl.db.myPlanets));
                    console.log("typeof:", typeof Object.values(this.ogl.db.myPlanets)[0]);
                    console.log("full object:", this.ogl.db.myPlanets);
                    console.log("searching for coords:", coords);

                    const tmpObj = Object.values(this.ogl.db.myPlanets).find(e => e.coords == coords && e.type == "planet");

                    if(!tmpObj) return;

                    const pid = tmpObj.id;
                    this.ogl.db.myPlanets[pid].upgrades = this.ogl.db.myPlanets[pid].upgrades || [];
                    this.ogl.db.myPlanets[pid].upgrades[techType] = [upgrade];
                }
                else if(coords == this.ogl.currentPlanet.obj.coords && this.ogl.currentPlanet.obj.type != 'moon')
                {
                    this.ogl.currentPlanet.obj.upgrades = this.ogl.currentPlanet.obj.upgrades || [];
                    this.ogl.currentPlanet.obj.upgrades[techType] = [upgrade];
                }
            }
        });

        document.querySelectorAll('.queuePic').forEach(element =>
        {
            const id = element.closest('a')?.getAttribute('onclick')?.match(/([0-9]+)/)[0];
            if(!id) return;

            const technology = document.querySelector(`.technology[data-technology="${id}"]`);
            if(!technology) return;

            technology.classList.add('ogl_active');
        });
    }

    calcMaxCrawler()
    {
        const planet = this.ogl.currentPlanet.obj;
        const base = (planet[1] + planet[2] + planet[3]) * 8;
        const lf31BonusValue = this.ogl.db.lfBonuses?.MiscImprovedCrawler?.bonus || 0;
        const lf36BonusValue = this.ogl.account.class === 1 ? (this.ogl.db.lfBonuses?.Characterclasses1?.bonus || 0) : 0;
        const lf36AmountBonus = (this.ogl.account.hasGeologist && this.ogl.account.class === 1) ? (1.1 + (.1 * lf36BonusValue / 100)) : 1;
        const result = {};
        let i = this.ogl.account.class === 1 ? 1.5 : 1;

        for (i; i>0.9; i = i-0.1)
        {
            const totalBonus = (lf31BonusValue / 100) + (0.5 * lf36BonusValue / 100);
            const crawlerProd = (0.02 * (1.5 + totalBonus)) * i;
            const crawlerMaxProdTreshold = Math.ceil(50 / crawlerProd);
            const maxAmount = Math.min(Math.floor(base * lf36AmountBonus), crawlerMaxProdTreshold);

            result[Math.round(i * 100)] = maxAmount;
        }

        return result;
    }
}

class StatsManager extends Manager
{
    load()
    {
        this.ogl.db.stats = this.ogl.db.stats || {};
        this.types = ['raid', 'expe', 'discovery', 'debris', 'debris16', 'blackhole'];
        this.displayedRange = { start:this.ogl._time.timeToKey(serverTime.getTime()), end:this.ogl._time.timeToKey(serverTime.getTime()) };

        this.showMiniRecap();
    }

    showMiniRecap()
    {
        const data = this.filterStatsByDateRange(this.ogl._time.timeToKey(serverTime.getTime()), this.ogl._time.timeToKey(serverTime.getTime()));
        const total = { metal:0, crystal:0, deut:0, dm:0, artefact:0, msu:0 };

        ['expe', 'debris16', 'raid', 'debris', 'discovery'].forEach(key =>
        {
            for(let [gainID, value] of Object.entries(Object.values(data)[0]?.[key]?.gain || {}))
            {
                if(!isNaN(gainID))
                {
                    const shipData = Datafinder.getTech(Math.abs(gainID));
                    const shipFactor = key == 'expe' && parseInt(gainID) > 0 ? this.ogl.db.options.expeditionShipRatio / 100 : 1;
                    const sign = parseInt(gainID) > 0 ? 1 : -1;
                    const isIgnored = sign < 0 && key == 'expe' && this.ogl.db.options.ignoreExpeShipsLoss;

                    if(!isIgnored)
                    {
                        total.metal += ((shipData.metal || 0) * value * shipFactor * sign);
                        total.crystal += ((shipData.crystal || 0) * value * shipFactor * sign);
                        total.deut += ((shipData.deut || 0) * value * shipFactor * sign);
                    }
                }
                else
                {
                    if(gainID == 'metal') total.metal += (value || 0);
                    else if (gainID == 'crystal') total.crystal += (value || 0);
                    else if (gainID == 'deut') total.deut += (value || 0);
                    else if (gainID == 'dm') total.dm += (value || 0);
                    else if (gainID == 'artefact') total.artefact += (value || 0);
                }
            }
        });

        if(!this.ogl.db.options.ignoreConsumption) total.deut -= (Object.values(data)?.[0]?.conso || 0);
        total.msu = Util.getMSU(total.metal, total.crystal, total.deut, this.ogl.db.options.msu) || 0;

        const start = new Date(this.displayedRange.start).toLocaleString('default', { day:'numeric', month:'long', year:'numeric' });
        const end = new Date(this.displayedRange.end).toLocaleString('default', { day:'numeric', month:'long', year:'numeric' });
        total.title = start == end ? start : `${start}&#10140;<br>${end}`;

        this.ogl._dom.updateMiniStats(total);
    }

    // turn db key date ('2024-7-9') into valid date keys ('2024-07-09')
    // fix for iOS / OSX
    normalizeDateKey(dateKey)
    {
        return dateKey.replace(/\b(\d)\b/g, '0$1');
    }

    // compare two keys : a > b = 1 | a == b = 0 | a < b = -1
    compareDateKey(dateKeyA, dateKeyB)
    {
        return this.normalizeDateKey(dateKeyA).localeCompare(this.normalizeDateKey(dateKeyB));
    }

    filterStatsByDateRange(startKey, endKey)
    {
        endKey = endKey || startKey;

        const data = this.ogl.db.stats;
        const serverTimeKey = this.ogl._time.timeToKey(serverTime.getTime());

        this.displayedRange.start = this.compareDateKey(serverTimeKey, startKey) > 0 ? startKey : serverTimeKey;
        this.displayedRange.end = this.compareDateKey(serverTimeKey, endKey) > 0 ? endKey : serverTimeKey;

        const filtered = Object.keys(data).filter(key =>
        {
            return this.compareDateKey(key, this.displayedRange.start) >= 0 && this.compareDateKey(key, this.displayedRange.end) <= 0;
    
        }).reduce((result, key) =>
        {
            result[key] = data[key];
            return result;
        }, {});

        return filtered;
    }

    getTotalFiltered(data)
    {
        const total = {};

        for(const key in data)
        {
            const entry = data[key];
            
            for(const prop in entry)
            {
                if(typeof entry[prop] === "number") // cumul int values
                {
                    total[prop] = (total[prop] || 0) + entry[prop];
                }
                else if (Array.isArray(entry[prop])) // merge arrays
                {
                    total[prop] = [...new Set([...(total[prop] || []), ...entry[prop]])];
                }
                else if (typeof entry[prop] === "object" && entry[prop] !== null) // merge objects recursively
                {
                    total[prop] = this.getTotalFiltered([entry[prop], total[prop] || {}]);
                }
            }
        }
    
        return total;
    }

    getDayStats(dateKey)
    {
        const [year, month, day] = dateKey.split('-');
        dateKey = `${year}-${parseInt(month)}-${parseInt(day)}`; // 2024-07-12 -> 2024-7-12

        this.ogl.db.stats[dateKey] = this.ogl.db.stats[dateKey] || {};
        return this.ogl.db.stats[dateKey];
    }

    getDaysInDisplayedMonth(dateKey)
    {
        dateKey = dateKey || this.displayedRange.end;

        const end = new Date(dateKey);
        const year = end.getFullYear();
        const month = end.getMonth();

        return new Date(year, month + 1, 0).getDate();
    }

    getTotalDaysInFilteredRange()
    {
        const start = new Date(this.displayedRange.start);
        const end = new Date(this.displayedRange.end);
        const timeDifference = end - start;

        return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;
    }

    showDetails()
    {
        const dataByDay = this.filterStatsByDateRange(this.displayedRange.start, this.displayedRange.end);
        const dataTotal = this.getTotalFiltered(Object.values(dataByDay));
        const daysInDisplayedMonth = this.getDaysInDisplayedMonth();

        const container = Util.addDom('div', { class:'ogl_stats' });
        const month = Util.addDom('div', { parent:container, class:'ogl_statsMonth' });
        const dateBar = Util.addDom('div', { parent:container, class:'ogl_dateBar' });
        const details = Util.addDom('div', { parent:container, class:'ogl_statsDetails' });
        const title = Util.addDom('h3', { child:'date', parent:details });
        const pie = Util.addDom('div', { class:'ogl_pie', parent:details });
        const shipTable = Util.addDom('div', { parent:details, class:'ogl_shipTable' });
        const sumTable = Util.addDom('div', { parent:details, class:'ogl_sumTable' });

        const displayed = this.displayedRange.end.split('-');
        const now = this.ogl._time.timeToKey(serverTime.getTime());

        let highest = 0, lowest = 0;

        // day bars
        for(let i=1; i<=daysInDisplayedMonth; i++)
        {
            const dateString = `${displayed[0]}-${displayed[1].toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            const dataMonth = this.ogl.db.stats[`${displayed[0]}-${parseInt(displayed[1])}-${i}`];

            let metal = 0, crystal = 0, deut = 0;

            ['expe', 'debris', 'raid', 'debris16'].forEach(key =>
            {
                for(let [gainID, value] of Object.entries(dataMonth?.[key]?.gain || {}))
                {
                    if(!isNaN(gainID))
                    {
                        const shipData = Datafinder.getTech(Math.abs(gainID));
                        const shipFactor = key == 'expe' && parseInt(gainID) > 0 ? this.ogl.db.options.expeditionShipRatio / 100 : 1;
                        const sign = parseInt(gainID) > 0 ? 1 : -1;
                        const isIgnored = sign < 0 && key == 'expe' && this.ogl.db.options.ignoreExpeShipsLoss;

                        if(!isIgnored)
                        {
                            metal += ((shipData.metal || 0) * value * shipFactor * sign);
                            crystal += ((shipData.crystal || 0) * value * shipFactor * sign);
                            deut += ((shipData.deut || 0) * value * shipFactor * sign);
                        }
                    }
                    else
                    {
                        if(gainID == 'metal') metal += (value || 0);
                        else if (gainID == 'crystal') crystal += (value || 0);
                        else if (gainID == 'deut') deut += (value || 0);
                    }
                }
            });

            if(!this.ogl.db.options.ignoreConsumption) deut -= (dataMonth?.conso || 0);

            const totalMSU = Util.getMSU(metal, crystal, deut, this.ogl.db.options.msu) || 0;
            if(totalMSU < lowest) lowest = totalMSU;
            if(totalMSU > highest) highest = totalMSU;

            const item = Util.addDom('div', { class:'ogl_item', parent:dateBar, 'data-day':i, 'data-date':dateString, 'data-value':totalMSU });
            if(dateString == now) item.classList.add('ogl_today');
        }

        this.addButtons(month);
        this.updateTitle(title);
        this.updatePie(pie, dataTotal);
        this.updateShips(shipTable, dataTotal);
        this.updateRecap(sumTable, dataTotal);
        this.initRangeSelection(dateBar, lowest, highest);

        this.ogl._popup.open(container, true);
    }

    addButtons(container)
    {
        container.innerText = '';
        
        // filter today
        Util.addDom('div', { parent:container, class:'ogl_button', child:LocalizationStrings?.timeunits?.short?.day || 'D', onclick:() =>
        {
            this.displayedRange = { start:this.ogl._time.timeToKey(serverTime.getTime()), end:this.ogl._time.timeToKey(serverTime.getTime()) };
            this.showDetails();
        }});

        // filter current week
        Util.addDom('div', { parent:container, class:'ogl_button', child:LocalizationStrings?.timeunits?.short?.week || 'W', onclick:() =>
        {
            const now = serverTime;
            const startDate = this.ogl._time.timeToKey(new Date(now.setDate(now.getDate() - now.getDay() + 1)));
            const endDate = this.ogl._time.timeToKey(new Date(now.setDate(now.getDate() + 7 - now.getDay())));
    
            this.displayedRange.start = startDate;
            this.displayedRange.end = endDate;

            this.showDetails();
        }});

        // filter current month
        Util.addDom('div', { parent:container, class:'ogl_button', child:LocalizationStrings?.timeunits?.short?.month || 'M', onclick:() =>
        {
            const now = serverTime;
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const year = now.getFullYear();
            const start = `${year}-${month}-01`;
            const end = `${year}-${month}-${this.getDaysInDisplayedMonth(start).toString().padStart(2, '0')}`;

            this.displayedRange.start = start;
            this.displayedRange.end = end;

            this.showDetails();
        }});

        Util.addDom('div', { parent:container, class:'ogl_button', child:'All', onclick:() =>
        {
            const oldestEntry = Object.keys(this.ogl.db.stats).reduce((oldestKey, currentKey) =>
            {
                return this.compareDateKey(currentKey, oldestKey) <= 0 ? currentKey : oldestKey;
            });

            this.displayedRange = { start:this.normalizeDateKey(oldestEntry), end:this.ogl._time.timeToKey(serverTime.getTime()) };

            this.showDetails();
        }});

        Util.addDom('div', { parent:container, class:'ogl_separator' });

        Util.addDom('div', { parent:container, class:'ogl_button material-icons', child:'keyboard_arrow_left', onclick:() =>
        {
            const start = new Date(this.displayedRange.end);
            const previousMonth = start.getMonth() === 0 ? 11 : start.getMonth() - 1;
            const year = start.getMonth() === 0 ? start.getFullYear() - 1 : start.getFullYear();
            const formattedMonth = (previousMonth + 1).toString().padStart(2, '0');
            const startPrevMonth = `${year}-${formattedMonth}-01`;
            const endPrevMonth = `${year}-${formattedMonth}-${this.getDaysInDisplayedMonth(startPrevMonth).toString().padStart(2, '0')}`;

            this.displayedRange.start = startPrevMonth;
            this.displayedRange.end = endPrevMonth;

            this.showDetails();
        }});

        Util.addDom('div', { parent:container, child:new Date(this.displayedRange.end).toLocaleString('default', { month:'short', year:'numeric' }) });

        Util.addDom('div', { parent:container, class:'ogl_button material-icons', child:'keyboard_arrow_right', onclick:() =>
        {
            const start = new Date(this.displayedRange.end);
            const nextMonth = start.getMonth() === 11 ? 0 : start.getMonth() + 1;
            const year = start.getMonth() === 11 ? start.getFullYear() + 1 : start.getFullYear();
            const now = serverTime;

            if(nextMonth > now.getMonth() && year >= now.getFullYear()) return null;

            const formattedMonth = (nextMonth + 1).toString().padStart(2, '0');
            const startNextMonth = `${year}-${formattedMonth}-01`;
            const endNextMonth = `${year}-${formattedMonth}-${this.getDaysInDisplayedMonth(startNextMonth).toString().padStart(2, '0')}`;

            this.displayedRange.start = startNextMonth;
            this.displayedRange.end = endNextMonth;

            this.showDetails();
        }});
    }

    initRangeSelection(bars, lowest, highest)
    {
        let isSelecting = false;
        let startDate = null;
        let endDate = null;

        bars.querySelectorAll('.ogl_item').forEach(bar =>
        {
            const value = parseInt(bar.getAttribute('data-value'));
            let height = Math.ceil(Math.abs(value) / (Math.max(Math.abs(highest), Math.abs(lowest)) / 100));
            height = height > 0 ? Math.max(height, 5) : 0;
            const color = value > 0 ? '#35cf95' : '#e14848';
            
            const content = Util.addDom('div', { parent:bar });
            content.style.background = `linear-gradient(to top, ${color} ${height}%, #0e1116 ${height}%)`;

            if(value != 0) bar.classList.add('ogl_active');
        });

        bars.addEventListener('mousedown', e =>
        {
            if(e.target.classList.contains('ogl_item') && e.button === 0)
            {
                isSelecting = true;
                startDate = e.target.dataset.date;
                endDate = startDate;
            }
        });

        bars.addEventListener('mouseover', e =>
        {
            if(isSelecting && e.target.classList.contains('ogl_item'))
            {
                endDate = e.target.dataset.date;
                this.highlightRange(bars, startDate, endDate);
            }
        });

        bars.addEventListener('mouseup', e =>
        {
            if(isSelecting)
            {
                isSelecting = false;
    
                this.displayedRange.start = this.compareDateKey(startDate, endDate) <= 0 ? startDate : endDate;
                this.displayedRange.end = this.compareDateKey(startDate, endDate) <= 0 ? endDate : startDate;
    
                this.showDetails();
            }
        });

        this.highlightRange(bars, this.displayedRange.start, this.displayedRange.end);
    }

    highlightRange(bars, startDate, endDate)
    {
        bars.querySelectorAll('.ogl_item').forEach(bar =>
        {
            const date = bar.dataset.date;

            if((this.compareDateKey(date, startDate) >= 0 && this.compareDateKey(date, endDate) <= 0) || (this.compareDateKey(date, endDate) >= 0 && this.compareDateKey(date, startDate) <= 0)) bar.classList.add('ogl_selected');
            else bar.classList.remove('ogl_selected');
        });
    }

    updateTitle(container)
    {
        const startText = new Date(this.displayedRange.start).toLocaleString('default', { day:'numeric', month:'long', year:'numeric' });
        const endText = new Date(this.displayedRange.end).toLocaleString('default', { day:'numeric', month:'long', year:'numeric' });
        const rangeText = this.displayedRange.start == this.displayedRange.end ? startText : `${startText} <i class="material-icons">east</i> ${endText}`;

        container.innerHTML = rangeText;

        const icons = Util.addDom('div', { class:'ogl_statsSettingsIcons', parent:container });
        Util.addDom('div', { class:this.ogl.db.options.ignoreConsumption ? 'material-icons tooltip ogl_active ogl_bool' : 'material-icons tooltip ogl_bool', child:'local_gas_station', title:'Consumption', parent:icons,  });
        Util.addDom('div', { class:this.ogl.db.options.ignoreExpeShipsLoss ? 'material-icons tooltip ogl_active ogl_bool' : 'material-icons tooltip ogl_bool', child:'skull', title:'Ships lost in expedition', parent:icons });
        Util.addDom('div', { class:'tooltip', child:`<i class="material-icons">rocket</i><span>${this.ogl.db.options.expeditionShipRatio || 0}%</span>`, title:this.ogl._lang.find('expeditionShipRatio'), parent:icons });
    }

    updateShips(container, data)
    {
        container.innerText = '';

        [202,203,204,205,206,207,208,209,210,211,213,214,215,218,219].forEach(shipId =>
        {
            const expe = (data?.expe?.gain?.[shipId] || 0) - (data?.expe?.gain?.[-shipId] || 0);
            const raid = (data?.raid?.gain?.[shipId] || 0) - (data?.raid?.gain?.[-shipId] || 0);
            const total = expe + raid;

            Util.addDom('div', { class:`ogl_icon ogl_${shipId} tooltip`, title:`<div class="ogl_infoStats"><h3 class="ogl_textCenter">${this.ogl._lang.find(shipId)}</h3><hr>Expeditions: <b>${Util.formatNumber(expe)}</b><br>Raids: <b>${Util.formatNumber(raid)}</b></div>`, parent:container, child:Util.formatToUnits(total || '-', false, true) });
        });
    }

    updatePie(container, data)
    {
        container.innerText = '';

        const occurences = data?.expe?.occurence;

        if(!occurences)
        {
            container.innerHTML = '<div class="ogl_noExpe"><span class="material-icons">compass</span>No expedition data</div>';
            return;
        }

        let cumulAngle = 1.5 * Math.PI;
        let colors =
        {
            nothing:'#ddd',
            resource:'#86edfd',
            darkmatter:'#b58cdb',
            ship:'#1dd1a1',
            battle:'#ffd60b',
            item:'#bf6c4d',
            blackhole:'#818181',
            duration:'#df5252',
            trader:'#ff7d30',
        }

        const pieData = {};
        pieData.resource = occurences.resource || 0;
        pieData.darkmatter = occurences.darkmatter || 0;
        pieData.ship = occurences.ship || 0;
        pieData.nothing = occurences.nothing || 0;
        pieData.blackhole = occurences.blackhole || 0;
        pieData.trader = occurences.trader || 0;
        pieData.item = occurences.item || 0;
        pieData.battle = (occurences.pirate || 0) + (occurences.alien || 0);
        pieData.duration = (occurences.early || 0) + (occurences.late || 0);

        const size = 256;
        const center = size / 2;
        const radius = size / 2;
        const slices = [];

        const drawPie = hoveredSlice =>
        {
            ctx.clearRect(0, 0, size, size);

            slices.forEach(slice =>
            {
                ctx.beginPath();
                ctx.arc(center, center, radius, slice.startAngle, slice.endAngle);
                ctx.lineTo(center, center);
                ctx.closePath();
                ctx.fillStyle = slice.title == hoveredSlice?.title ? 'white' : slice.color;
                ctx.fill();
            });

            // donut
            ctx.fillStyle = "rgba(0,0,0,.5)";
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2.7, 0, 2 * Math.PI, false);
            ctx.fill();
    
            ctx.fillStyle = "#1b212a";
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/3, 0, 2 * Math.PI, false);
            ctx.fill();

            container.setAttribute('data-pie', `${hoveredSlice ? this.ogl._lang.find(hoveredSlice.title) + '\r\n' : ''}${hoveredSlice ? hoveredSlice.percent + '%' : total + '\r\nExpeditions'}`);

            legend.querySelectorAll('.ogl_active').forEach(e => e.classList.remove('ogl_active'));

            if(hoveredSlice)
            {
                legend.querySelector(`[data-entry="${hoveredSlice.title}"]`).classList.add('ogl_active');
            }
        }

        const canvas = Util.addDom('canvas', { parent:container, width:size, height:size, onmouseout:() => { drawPie();canvas.classList.remove('ogl_interactive'); }});
        const ctx = canvas.getContext('2d', { willReadFrequently:true });
        const legend = Util.addDom('div', { parent:container, class:'ogl_pieLegendContainer', onmouseleave:() => drawPie() });
        const dataArray = Object.entries(pieData || {});
        const total = Object.values(occurences || {}).reduce((accumulator, e) => accumulator + Math.max(0, e), 0);

        container.setAttribute('data-pie', total);

        for(let [title, value] of dataArray.sort((a, b) => b[1] - a[1]))
        {
            if(value > 0)
            {
                const slice = {};
                slice.title = title;
                slice.value = value;
                slice.percent = (value / total * 100).toFixed(2);
                slice.startAngle = cumulAngle;
                slice.angle = (value / total) * 2 * Math.PI;
                slice.endAngle = cumulAngle + slice.angle;
                slice.color = colors[title];
    
                slices.push(slice);
    
                cumulAngle = slice.endAngle;
    
                Util.addDom('div', { class:'ogl_pieLegend', 'data-resultType':slice.title, 'data-entry':slice.title, parent:legend, child:`<div>${this.ogl._lang.find(title)}</div><span>${Util.formatToUnits(value)}</span><i>${slice.percent}%</i>` });
            }
        }

        drawPie();

        legend.querySelectorAll('.ogl_pieLegend').forEach(line =>
        {
            line.addEventListener('mouseenter', () =>
            {
                const slice = slices.find(slice => slice.title == line.getAttribute('data-entry'));
                drawPie(slice);
            });
        });
    }

    updateRecap(container, data)
    {
        container.innerText = '';

        const typeLong = { expe:'expeditions', raid:'raids', conso:'consumption', u:'average', total:'total' };
        const header = Util.addDom('div', { parent:container });

        ['', 'send', 'metal', 'crystal', 'deut', 'msu', 'dm', 'artefact'].forEach(resource =>
        {
            if(resource == 'send') Util.addDom('div', { class:`ogl_textCenter ogl_icon material-icons`, child:'send', parent:header });
            else Util.addDom('div', { class:`ogl_icon ogl_${resource}`, parent:header });
        });

        ['expe', 'raid', 'conso', 'u', 'total'].forEach(type =>
        {
            const line = Util.addDom('div', { parent:container, child:`<div class="ogl_statsRecapHeader">${typeLong[type]}</div>` });
            const missions = Util.addDom('div', { parent:line, class:'tooltip' });

            let missionsCount = 0;
            let missionsDetail = Util.addDom('div', { class:'ogl_infoStats' });
            let metal = 0, crystal = 0, deut = 0, dm = 0, artefact = 0;

            let dataKeys = [];

            if(type == 'expe') dataKeys = ['expe', 'debris16'];
            else if(type == 'raid') dataKeys = ['raid', 'debris'];
            else if(type == 'total' || type == 'u') dataKeys = ['expe', 'debris16', 'raid', 'debris', 'discovery'];

            dataKeys.forEach(key =>
            {
                if(key == 'discovery' && type == 'u') Util.addDom('div', { parent:missionsDetail, child:'<hr>' });
                else missionsCount += (data?.[key]?.count || 0);
 
                Util.addDom('div', { parent:missionsDetail, child:`${key}: <b>${Util.formatNumber(data?.[key]?.count || 0)}</b>` });
                
                for(let [gainID, value] of Object.entries(data?.[key]?.gain || {}))
                {
                    if(!isNaN(gainID))
                    {
                        const shipData = Datafinder.getTech(Math.abs(gainID));
                        const shipFactor = key == 'expe' && parseInt(gainID) > 0 ? this.ogl.db.options.expeditionShipRatio / 100 : 1;
                        const sign = parseInt(gainID) > 0 ? 1 : -1;
                        const isIgnored = sign < 0 && key == 'expe' && this.ogl.db.options.ignoreExpeShipsLoss;

                        if(!isIgnored)
                        {
                            metal += ((shipData.metal || 0) * value * shipFactor * sign);
                            crystal += ((shipData.crystal || 0) * value * shipFactor * sign);
                            deut += ((shipData.deut || 0) * value * shipFactor * sign);
                        }
                    }
                    else
                    {
                        if(gainID == 'metal') metal += (value || 0);
                        else if (gainID == 'crystal') crystal += (value || 0);
                        else if (gainID == 'deut') deut += (value || 0);
                        else if (gainID == 'dm') dm += (value || 0);
                        else if (gainID == 'artefact') artefact += (value || 0);
                    }
                }
            });

            if(type == 'expe' || type == 'raid')
            {
                Util.addDom('div', { parent:line, class:'ogl_metal', child:Util.formatToUnits(metal, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_crystal', child:Util.formatToUnits(crystal, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_deut', child:Util.formatToUnits(deut, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_msu', child:Util.formatToUnits(Util.getMSU(metal, crystal, deut, this.ogl.db.options.msu), false, true) });
                Util.addDom('div', { parent:line, class:'ogl_dm', child:type == 'raid' ? '-' : Util.formatToUnits(dm, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_artefact', child:'-' });
            }
            else if(type == 'u')
            {
                if(!this.ogl.db.options.ignoreConsumption) deut -= (data.conso || 0);

                Util.addDom('div', { parent:line, class:'ogl_metal', child:!missionsCount ? 0 : Util.formatToUnits(Math.floor(metal / missionsCount), false, true) });
                Util.addDom('div', { parent:line, class:'ogl_crystal', child:!missionsCount ? 0 : Util.formatToUnits(Math.floor(crystal / missionsCount), false, true) });
                Util.addDom('div', { parent:line, class:'ogl_deut', child:!missionsCount ? 0 : Util.formatToUnits(Math.floor(deut / missionsCount), false, true) });
                Util.addDom('div', { parent:line, class:'ogl_msu', child:!missionsCount ? 0 : Util.formatToUnits(Util.getMSU(metal, crystal, deut, this.ogl.db.options.msu) / missionsCount, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_dm', child:!data?.expe?.count ? 0 : Util.formatToUnits(Math.floor(dm / data?.expe?.count), false, true) });
                Util.addDom('div', { parent:line, class:'ogl_artefact', child:!data?.discovery?.count ? 0 : Util.formatToUnits(Math.floor(artefact / data?.discovery?.count), false, true) });
            }
            else if(type == 'conso')
            {
                Util.addDom('div', { parent:line, class:'ogl_metal', child:'-' });
                Util.addDom('div', { parent:line, class:'ogl_crystal', child:'-' });
                Util.addDom('div', { parent:line, class:'ogl_deut', child:Util.formatToUnits(-data.conso, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_msu', child:Util.formatToUnits(Util.getMSU(0, 0, -data.conso, this.ogl.db.options.msu), false, true) });
                Util.addDom('div', { parent:line, class:'ogl_dm', child:'-' });
                Util.addDom('div', { parent:line, class:'ogl_artefact', child:'-' });
            }
            else if(type == 'total')
            {
                if(!this.ogl.db.options.ignoreConsumption) deut -= (data.conso || 0);

                Util.addDom('div', { parent:line, class:'ogl_metal', child:Util.formatToUnits(metal, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_crystal', child:Util.formatToUnits(crystal, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_deut', child:Util.formatToUnits(deut, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_msu', child:Util.formatToUnits(Util.getMSU(metal, crystal, deut, this.ogl.db.options.msu), false, true) });
                Util.addDom('div', { parent:line, class:'ogl_dm', child:Util.formatToUnits(dm, false, true) });
                Util.addDom('div', { parent:line, class:'ogl_artefact', child:Util.formatToUnits(artefact, false, true) });
            }

            missions.innerHTML = missionsCount == 0 ? '-' : Util.formatToUnits(missionsCount, false, true);
            if(missionsCount) missions.title = missionsDetail.outerHTML;
        });
    }
}

class EmpireManager extends Manager
{
    load()
    {
        this.getLFBonuses();
        this.getAllianceClass();

        if(this.ogl.page != 'empire') return;

        unsafeWindow.jumpGateLink = `${window.location.href.split('?')[0]}?page=ajax&component=jumpgate&overlay=1&ajax=1`;
        unsafeWindow.jumpGateLoca = { LOCA_STATION_JUMPGATE_HEADLINE: 'Jumpgate' };

        let updateDone = false;

        let planetData, planetName;

        Util.observe(document.body, {childList:true, subtree:true, attributes:true}, mutation =>
        {
            if(!updateDone && mutation.target.classList.contains('box-end') && mutation.target.closest('.summary') && mutation.target.closest('.groupresources'))
            {
                if(document.querySelector('#loading').style.display == 'none')
                {
                    updateDone = true;

                    this.update(document.querySelector('#mainContent script').innerText, new URLSearchParams(window.location.search).get('planetType'), true);

                    document.querySelectorAll('.planet').forEach(planet =>
                    {
                        const data = this.ogl.db.myPlanets[planet.id.replace('planet', '')];
                        if(!data) return;
    
                        Util.addDom('div', { class:'material-icons ogl_empireJumpgate', child:'jump_to_element', parent:planet.querySelectorAll('.row')[1], onclick:e =>
                        {
                            e.preventDefault();

                            planetData = data;
                            planetName = planet.querySelector('.planetname').getAttribute('title') || planet.querySelector('.planetname').innerText;
                            document.querySelector('.ui-dialog')?.remove();

                            setTimeout(() => openJumpgate(), 5);
                        }});
                    });
                }
            }
            else if(mutation.target.classList.contains('ui-dialog') && document.querySelector('#jumpgate'))
            {
                if(document.querySelector('#jumpgateNotReady')) return;

                if(document.querySelector('.currentlySelected'))
                {
                    const target = document.querySelector('.currentlySelected a');

                    target.setAttribute('data-value', planetData.planetID || planetData.moonID);
                    target.innerText = `${planetName} [${planetData.coords}]`;
                }
                else
                {
                    document.querySelector('#selecttarget select').value = this.ogl.db.myPlanets[planetData.planetID].moonID;
                }

                let resources = [planetData.metal, planetData.crystal, planetData.deut, planetData.food];

                if(this.ogl.db.fleetLimiter.resourceActive)
                {
                    resources[0] = Math.max(0, resources[0] - (this.ogl.db.fleetLimiter.data.metal || 0));
                    resources[1] = Math.max(0, resources[1] - (this.ogl.db.fleetLimiter.data.crystal || 0));
                    resources[2] = Math.max(0, resources[2] - (this.ogl.db.fleetLimiter.data.deut || 0));
                    resources[3] = Math.max(0, resources[3] - (this.ogl.db.fleetLimiter.data.food || 0));
                }

                const total = resources[0] + resources[1] + resources[2] + resources[3];

                document.querySelector(`[name="ship_${this.ogl.db.options.defaultShip}"]`).value = this.ogl._fleet.shipsForResources(this.ogl.db.options.defaultShip, Math.max(0, total));
            }
        });
    }

    update(data, type, fromEmpire)
    {
        this.ogl.db[`lastEmpire${type}Update`] = Date.now();
        let allowedEntries = ['id', 'metal', 'crystal', 'deuterium', 'energy', 'food', 'population', 'fieldUsed', 'fieldMax', 'planetID', 'moonID'];

        data = fromEmpire ? JSON.parse(data.match(/{(.*)}/g)[1]) : data;

        data.planets?.forEach(planet =>
        {
            this.ogl.db.myPlanets[planet.id] = this.ogl.db.myPlanets[planet.id] || {};
            this.ogl.db.myPlanets[planet.id].type = type === 0 ? 'planet' : 'moon';

            Object.entries(planet).forEach(entry =>
            {
                if(entry[0].indexOf('html') >= 0) return;
                else if(entry[0] === 'temperature') this.ogl.db.myPlanets[planet.id][entry[0]] = parseInt(entry[1].match(/[-|0-9]+/g, '' )[0]);
                else if(Number(entry[0]) || entry[0].indexOf('Storage') >= 0 || allowedEntries.includes(entry[0])) this.ogl.db.myPlanets[planet.id][entry[0].replace('deuterium', 'deut')] = parseInt(entry[1]);
                else if(entry[0] === 'coordinates') this.ogl.db.myPlanets[planet.id].coords = entry[1].slice(1, -1);
                else if(entry[0] === 'production')
                {
                    this.ogl.db.myPlanets[planet.id].prodMetal = entry[1].hourly[0] / 3600;
                    this.ogl.db.myPlanets[planet.id].prodCrystal = entry[1].hourly[1] / 3600;
                    this.ogl.db.myPlanets[planet.id].prodDeut = entry[1].hourly[2] / 3600;
                }
            });
        });

        if(this.ogl.currentPlanet) this.ogl.currentPlanet.obj = this.ogl.db.myPlanets[document.querySelector('head meta[name="ogame-planet-id"]')?.getAttribute('content')];

        this.ogl._dom.updateAvailable();

        if(this.ogl._ui) Util.runAsync(() => this.ogl._ui.displayResourcesRecap());
    }

    getLFBonuses(source)
    {
        const htmlSource = source || document;

        // lf bonuses
        if(source || this.ogl.page == 'lfbonuses')
        {
            this.ogl.db.lfBonuses = {};

            htmlSource.querySelectorAll('bonus-item-content-holder > [data-toggable]').forEach(item =>
            {
                const id = item.getAttribute('data-toggable').replace(/subcategory|Ships|Defenses|CostAndTime/g, '');
                const regex = new RegExp(`[0-9|-]+(${LocalizationStrings.decimalPoint}[0-9]+)?`, 'g');

                const isBaseBuilding = id < 100;
                const isBaseResearch = id > 100 && id <= 199;
                const isBaseShip = id > 200 && id <= 299;
                const isBaseDef = id > 400 && id <= 499;

                const lfBonuses = {};
                const bonuses = []; // bonuses [0]:value, [1]:max

                item.querySelectorAll('bonus-item').forEach(bonus =>
                {
                    const values = (bonus.innerText.match(regex) || []).map(e =>
                    {
                        if(e == '-') return 0;
                        else return parseFloat(e.replace(LocalizationStrings.decimalPoint, '.'));
                    });

                    bonuses.push(values);
                });

                if(bonuses.length == 0)
                {
                    let value = (item.innerText.match(regex) || [])[0];
                    if(!value || value == '-') value = 0;
                    else value = parseFloat(value.replace(LocalizationStrings.decimalPoint, '.'));

                    lfBonuses.bonus = value;
                }

                if(isBaseShip)
                {
                    lfBonuses.armor = bonuses[0][0];
                    lfBonuses.shield = bonuses[1][0];
                    lfBonuses.weapon = bonuses[2][0];
                    lfBonuses.speed = bonuses[3][0];
                    lfBonuses.cargo = bonuses[4][0];
                    lfBonuses.fuel = bonuses[5][0];
                }
                else if(isBaseDef)
                {
                    lfBonuses.armor = bonuses[0][0];
                    lfBonuses.shield = bonuses[1][0];
                    lfBonuses.weapon = bonuses[2][0];
                }
                else if(isBaseResearch || id == 'LfResearch')
                {
                    lfBonuses.cost = bonuses[0][0];
                    lfBonuses.duration = bonuses[1][0];
                }

                if(id == 'MiscImprovedCrawler')
                {
                    lfBonuses.bonus = bonuses[1][0];
                }

                this.ogl.db.lfBonuses[id] = lfBonuses;
            });
        }

        // race level
        if(source || this.ogl.page == 'lfbonuses' || this.ogl.page == 'lfsettings')
        {
            this.ogl.db.lfBonuses = this.ogl.db.lfBonuses || {};
    
            htmlSource.querySelectorAll('lifeform-item, .lifeform-item').forEach(item =>
            {
                const lifeform = item.querySelector('.lifeform-item-icon').className.replace(/lifeform-item-icon| /g, '');
                const bonus = item.querySelector('.currentlevel').innerText.replace(/\D/g, '') / 10;
                this.ogl.db.lfBonuses[lifeform] = { bonus:bonus };
            });
        }
    }

    getAllianceClass()
    {
        if(this.ogl.page == 'alliance')
        {
            setTimeout(() =>
            {
                const sprite = alliance.allianceContent[0].querySelector('#allyData .allianceclass.sprite');

                if(!sprite)
                {
                    this.getAllianceClass();
                }
                else
                {   
                    const className = (Array.from(sprite.classList).filter(element => allianceClassArr.includes(element)) || ['neutral'])[0];
                    const classID = allianceClassArr.indexOf(className);

                    this.ogl.db.allianceClass = classID >= 0 ? classID : 0;
                }
            }, 1000);
        }
    }
}

class Util
{
    static get simList()
    {
        return {
            battlesim:'http://battlesim.logserver.net/',
            'simulator.ogame-tools':'http://simulator.ogame-tools.com/',
        }
    }

    static get converterList()
    {
        return {
            ogotcha:'http://ogotcha.oplanet.eu/',
            topraider:'http://topraider.eu/index.php',
            'ogame.tools':'http://battleconvertor.fr',
        }
    }

    static overWrite(fn, context, before, after, newParam1, newParam2)
    {
        const old = context[fn];
        let locked = false;

        context[fn] = function(param1, param2)
        {
            if(before && typeof before === typeof function(){}) locked = before(newParam1 || param1, newParam2 || param2);
            if(!locked) old.call(context, newParam1 || param1, newParam2 || param2);
            if(after && typeof after === typeof function(){} && !locked) after(newParam1 || param1, newParam2 || param2);
        }
    }

    static drawLine(svg, parent, element1, element2)
    {
        if(unsafeWindow.fleetDispatcher && fleetDispatcher.realTarget
        && (fleetDispatcher.targetPlanet.galaxy != fleetDispatcher.realTarget.galaxy
        || fleetDispatcher.targetPlanet.system != fleetDispatcher.realTarget.system
        || fleetDispatcher.targetPlanet.position != fleetDispatcher.realTarget.position
        || fleetDispatcher.targetPlanet.type != fleetDispatcher.realTarget.type)) return;

        svg.querySelector('line')?.remove();

        if(!element1 || !element2 || element1 == element2) return;

        element1 = element1.querySelector('.planetPic, .icon-moon');
        element2 = element2.querySelector('.planetPic, .icon-moon');

        let x1 = Math.round(element1.getBoundingClientRect().left + element1.getBoundingClientRect().width / 2 - parent.getBoundingClientRect().left) - 2;
        let y1 = Math.round(element1.getBoundingClientRect().top + element1.getBoundingClientRect().height / 2 - parent.getBoundingClientRect().top);
        let x2 = Math.round(element2.getBoundingClientRect().left + element2.getBoundingClientRect().width / 2 - parent.getBoundingClientRect().left) - 2;
        let y2 = Math.round(element2.getBoundingClientRect().top + element2.getBoundingClientRect().height / 2 - parent.getBoundingClientRect().top);

        parent.appendChild(svg);

        let line = document.createElementNS('http://www.w3.org/2000/svg','line');
        svg.appendChild(line);

        line.classList.add('ogl_line');
        line.setAttribute('x1',x1);
        line.setAttribute('y1',y1);
        line.setAttribute('x2',x2);
        line.setAttribute('y2',y2);
        line.setAttribute('stroke-dasharray', '7 5');
    }

    static coordsToID(arr)
    {
        if(typeof arr === typeof '') return arr.split(':').map(x => x.padStart(3, '0')).join('');
        else return arr.map(x => x.padStart(3, '0')).join('');
    }

    static removeFromArray(arr, index)
    {
        arr.splice(index, 1);
    }

    static formatNumber(number, fixed)
    {
        number = number || 0;

        if(fixed)
        {
            number = number % 1 === 0 ? number : number.toFixed(fixed);
        }

        return number.toLocaleString('de-DE');
    }

    static formatToUnits(value, forced, colored)
    {
        value = Math.round(value || 0);
        value = (value || 0).toString().replace(/[\,\. ]/g, '');
        if(isNaN(value)) return value;

        let precision = 0;

        value = parseInt(value);

        if(value == 0 || forced === 0 || (value < 1000 && value > -1000)) precision = 0;
        else if(forced === 1 || (value < 1000000 && value > -1000000)) precision = 1;
        else precision = 2;

        const split = Intl.NumberFormat('fr-FR', { notation:'compact', minimumFractionDigits:precision, maximumFractionDigits:precision }).format(value).match(/[a-zA-Z]+|[0-9,-]+/g);
        const result = split[0].replace(/,/g, '.');
        const suffix = split[1]?.replace('Md', 'G').replace('Bn', 'T') || '';

        const resultDom = Util.addDom('span', { class:'ogl_unit', child:`<span>${result}</span><span class="ogl_suffix">${suffix}</span>` });
        if(value < 0 && colored) resultDom.classList.add('ogl_danger');

        return resultDom.outerHTML;
    }

    static formatFromUnits(value)
    {
        if(!value) return 0;
        value = value.toLowerCase();
        let offset = (value.split(LocalizationStrings.thousandSeperator).length - 1) * 3;

        if(LocalizationStrings.thousandSeperator == LocalizationStrings.decimalPoint) offset = 0;

        let splitted = value.match(/\d+/g)[0].length;

        if(value.indexOf(LocalizationStrings.unitMilliard.toLowerCase()) > -1)
        {
            value = value.replace(LocalizationStrings.unitMilliard.toLowerCase(), '');
            value = value.replace(/[\,\. ]/g, '');
            value = value.padEnd(9 + offset + splitted, '0');
        }
        else if(value.indexOf(LocalizationStrings.unitMega.toLowerCase()) > -1)
        {
            value = value.replace(LocalizationStrings.unitMega.toLowerCase(), '');
            value = value.replace(/[\,\. ]/g, '');
            value = value.padEnd(6 + offset + splitted, '0');
        }
        else if(value.indexOf(LocalizationStrings.unitKilo.toLowerCase()) > -1)
        {
            value = value.replace(LocalizationStrings.unitKilo.toLowerCase(), '');
            value = value.replace(/[\,\. ]/g, '');
            value = value.padEnd(3 + offset + splitted, '0');
        }
        else
        {
            value = value.replace(/[\,\. ]/g, '');
        }

        return parseInt(value);
    }

    static formatInput(input, callback, canBeEmpty)
    {
        setTimeout(() =>
        {
            if((!input.value || input.value == 0) && input.classList.contains('ogl_placeholder'))
            {
                input.value = '';
                return;
            }

            // firefox fix
            input.value = input.value.slice(0, input.selectionStart) + input.value.slice(input.selectionEnd);

            let oldLength = input.value.length;
            let mult = 1;
            if(input.value.toLowerCase().indexOf('k') >= 0) mult = 1000;
            else if(input.value.toLowerCase().indexOf('m') >= 0) mult = 1000000;
            else if(input.value.toLowerCase().indexOf('g') >= 0) mult = 1000000000;

            let cursorPosition = input.selectionStart;
            let formattedValue;

            if(input.getAttribute('data-allowPercent') == 'true' && input.value.toLowerCase().indexOf('%') >= 0)
            {
                formattedValue = parseInt(input.value?.replace(/\D/g, '') || 0).toString();
                formattedValue += '%';
            }
            else
            {
                formattedValue = (parseInt(input.value?.replace(/\D/g, '') || 0) * mult).toString();
                formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }

            input.value = formattedValue;

            cursorPosition += input.value.length > oldLength ? 1 : input.value.length < oldLength ? -1 : 0;
            input.setSelectionRange(cursorPosition, cursorPosition);

            if(input.value == 0 && canBeEmpty) input.value = '';

            if(callback) callback();
        }, 5);
    }

    static reorderArray(arr, index, reversed)
    {
        let newArray = arr.slice(index, arr.length).concat(arr.slice(0, index));;
        return reversed ? newArray.reverse() : newArray;
    }

    static observe(element, options, callback, oglObj)
    {
        options = options || {};

        let tooltipTimeout;
        let sendShipsTimeout;

        new MutationObserver(mutations =>
        {
            if(oglObj && mutations[0].target.tagName.toLowerCase() !== 'progress')
            {
                Util.runAsync(oglObj._time.update, oglObj._time);
                Util.runAsync(oglObj._time.observe, oglObj._time);

                if(document.querySelector('[onclick*="sendShips(6"]:not([data-spy-coords]), [onclick*="sendShipsWithPopup(6"]:not([data-spy-coords])'))
                {
                    Util.runAsync(oglObj._fleet.checkSendShips, oglObj._fleet);
                }
            }

            for(let i=0; i<mutations.length; i++) callback(mutations[i]);

        }).observe(element, options);
    }

    static addDom(tag, params)
    {
        params = params || {};

        let element = document.createElement(tag);
        element.classList.add('ogl_addedElement');

        Object.entries(params).forEach(param =>
        {
            const isIgnored = param[0] === 'before' || param[0] === 'prepend' || param[0] === 'parent' || param[0] === 'after';
            const isContent = param[0] === 'child';
            const isListener = param[0].startsWith('on');
            const isAttribute = !isContent && !isListener && !isIgnored;

            if(isAttribute)
            {
                element.setAttribute(param[0], param[1]);

                if(param[0] == 'class' && param[1].indexOf('material-icons') > -1) element.classList.add('notranslate');
            }
            else if(isListener)
            {
                element.addEventListener(param[0].toLowerCase().slice(2), event => {param[1](event, element)});
            }
            else if(isContent)
            {
                if(typeof param[1] === typeof {})
                {
                    element.appendChild(param[1]);
                }
                else if(typeof param[1] === typeof '' || typeof param[1] === typeof 1)
                {
                    element.innerHTML = param[1].toString();
                }
            }
        });

        if(params.parent) params.parent.appendChild(element);
        else if(params.before) params.before.parentNode.insertBefore(element, params.before);
        else if(params.after) params.after.after(element);
        else if(params.prepend) params.prepend.prepend(element);

        return element;
    }

    static runAsync(fn, scope)
    {
        return new Promise(resolve =>
        {
            setTimeout(() =>
            {
                resolve(scope ? scope[fn.toString().split('(')[0]]() : fn(scope));
            });
        });
    }

    static takeScreenshot(element, button, name, retry)
    {
        if(typeof html2canvas === 'undefined')
        {
            fetch('http://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js', {method:'get', headers:{'Accept':'application/json'}})
            .then(response => response.text())
            .then(result =>
            {
                retry = (retry || 0) + 1;
                if(retry > 3) return;

                document.head.appendChild(Util.addDom('script', { type:'text/javascript', child:result }));
                Util.takeScreenshot(element, button, name);
            });
        }
        else
        {
            const rect = element.getBoundingClientRect();

            html2canvas(element,
            {
                backgroundColor:null,
                useCORS:true,
                ignoreElements:e => e.classList.contains('ogl_close') || e.classList.contains('ogl_share'),
                x:rect.x,
                y:rect.y,
                scrollX:0,
                scrollY:0,
                width:rect.width,
                height:rect.height,
                windowWidth:document.documentElement.offsetWidth,
                windowHeight:document.documentElement.offsetHeight
            }).then(canvas =>
            {
                const dataURL = canvas.toDataURL();
                const link = Util.addDom('a', {'download':name, 'href':dataURL});
                link.click();
                button.classList.remove('ogl_disabled');
            });
        }
    }

    static hash(str)
    {
        return [...str].reduce((string, char) => Math.imul(31, string) + char.charCodeAt(0) | 0, 0);
    }

    static getMSU(metal, crystal, deut, ratio)
    {
        ratio = ratio.split(':');
        return Math.ceil((metal || 0) + (crystal || 0) * ratio[0] / ratio[1] + (deut || 0) * ratio[0]);
    }

    static getPlayerScoreFD(score, type)
    {
        if(!score) return '?';

        const defense = Math.max(score.military - (score.global - score.economy - score.research - score.lifeform), 0);
        const fleet = score.military - defense;

        return type == 'defense' ? defense : fleet;
    }

    static getDistance(ogl, from, to)
    {
        const emptySystems = ogl.db.serverData.emptySystems || false;
        const inactiveSystems = ogl.db.serverData.inactiveSystems || false;
        const donutGalaxy = ogl.db.serverData.donutGalaxy || false;
        const donutSystem = ogl.db.serverData.donutSystem || false;
        const maxGalaxy = ogl.db.serverData.galaxies || 9;
        const maxSystem = ogl.db.serverData.systems || 499;

        let diffGalaxy = Math.abs(from.galaxy - to.galaxy);
        let diffSystem = Math.abs(from.system - to.system);
        let diffPlanet = Math.abs(from.position - to.position);

        if(diffGalaxy != 0)
        {
            let diff2 = Math.abs(diffGalaxy - maxGalaxy);

            if(donutGalaxy && diff2 < diffGalaxy) return diff2 * 20000;
            else return diffGalaxy * 20000;
        }
        else if (diffSystem != 0)
        {
            let diff2 = Math.abs(diffSystem - maxSystem);
            let deltaSystem = 0;

            if(donutSystem && diff2 < diffSystem) deltaSystem = diff2;
            else deltaSystem = diffSystem;

            deltaSystem = Math.max(deltaSystem - emptySystems - inactiveSystems, 1);
            return deltaSystem * 5 * 19 + 2700;
        }
        else if (diffPlanet != 0)
        {
            return diffPlanet * 5 + 1000;
        }
        else
        {
            return 5;
        }
    }

    static planetIsInRange(ogl, from, to, maxSystem)
    {
        const maxDistance = 2700 + 95 * maxSystem;
        const distance = Util.getDistance(ogl, from, to); 

        return distance < maxDistance;
    }

    static genTrashsimLink(ogl, apiKey, data)
    {
        const attackerCoords = (data?.origin?.coords || ogl.currentPlanet.obj.coords).split(':');
        const defenderCoords = (data?.destination?.coords || '0:0:0').split(':');

        let jsonData = { settings:{ server:`s${ogl.server.id}-${ogl.server.lang}` } };
        
        const player1 = // attacker
        {
            planet:
            {
                galaxy:attackerCoords[0],
                system:attackerCoords[1],
                position:attackerCoords[2],
            },
            research:{},
        };

        const player2 =  // defender
        {
            planet:
            {
                galaxy:defenderCoords[0],
                system:defenderCoords[1],
                position:defenderCoords[2],
            },
            research:{},
            resources:{},
            defence:{},
        };

        // ################### me
        const me = data?.meAsDefender ? player2 : player1;

        me.class = ogl.account.class;
        me.characterClassesEnabled = true;
        me.allianceClass = ogl.db.allianceClass || 0;

        [109, 110, 111, 114, 115, 117, 118].forEach(techID => me.research[techID] = { level:ogl.currentPlanet.obj[techID] || 0 });

        let bonusBattleTechs = 0;

        if(ogl.account.class == 2) // player general class +2 combat techs
        {
            bonusBattleTechs += 2;

            // player general class 3.6 boost (50% = +1 level)
            const classLFBoost = Math.floor((ogl.db.lfBonuses?.['Characterclasses'+ogl.account.class]?.bonus || 0) / 50);
            bonusBattleTechs += classLFBoost;
        }
        
        if(ogl.db.allianceClass == 1) // alliance warrior class +1 combat techs
        {
            bonusBattleTechs++;
        }

        me.research[109].level = (me.research[109].level || 0) + bonusBattleTechs;
        me.research[110].level = (me.research[110].level || 0) + bonusBattleTechs;
        me.research[111].level = (me.research[111].level || 0) + bonusBattleTechs;

        me.lifeformBonuses = me.lifeformBonuses || {};
        me.lifeformBonuses.BaseStatsBooster = me.lifeformBonuses.BaseStatsBooster || {};
        me.lifeformBonuses.CharacterClassBooster = {};
        me.lifeformBonuses.CharacterClassBooster[ogl.account.class] = (ogl.db.lfBonuses?.['Characterclasses'+ogl.account.class]?.bonus || 0) / 100;

        if(data?.meAsAttacker)
        {
            me.ships = data.ships;
        }

        ogl.shipsList.forEach(shipID =>
        {
            me.lifeformBonuses.BaseStatsBooster[shipID] = me.lifeformBonuses.BaseStatsBooster[shipID] || {};

            Object.entries(ogl.db.lfBonuses?.[shipID] || { weapon:0, shield:0, armor:0, cargo:0, speed:0, fuel:0 }).forEach(entry =>
            {
                if(entry[0] == 'fuel' && entry[1] != 0) me.lifeformBonuses.ShipFuelConsumption = Math.abs(entry[1] / 100);
                else me.lifeformBonuses.BaseStatsBooster[shipID][entry[0]] = entry[1] / 100;
            });
        });

        if(data?.meAsDefender)
        {
            const planet = Object.values(ogl.db.myPlanets).find(e => e.coords == data.destination.coords && e.type == data.destination.type);
            if(!planet) return;

            ogl._account.defenseList.forEach(techID =>
            {
                me.defence[techID] = { count:planet[techID] };
            });
        }

        // ################### enemy
        const enemy = data?.meAsDefender ? player1 : player2;
        if(data && !data.meAsAttacker) enemy.ships = data.ships;

        ['metal', 'crystal', 'deut', 'food'].forEach(e => 
        {
            player2.resources[e.replace('deut', 'deuterium')] = player2.ships?.[e]?.count || 0;

            if(player1.ships?.[e]) delete player1.ships?.[e];
            if(player2.ships?.[e]) delete player2.ships?.[e];
        });

        jsonData[0] = [player1];
        jsonData[1] = [player2];
        jsonData = btoa(JSON.stringify(jsonData));

        let lang = ogl.account.lang == 'us' ? 'en' : ogl.account.lang == 'ar' ? 'es' : ogl.account.lang;
        let toolID = ogl.db.options.sim && Util.simList[ogl.db.options.sim] ? ogl.db.options.sim : Object.keys(Util.simList)[Math.floor(Math.random() * Object.keys(Util.simList).length)];
        const link = Util.simList[toolID];

        if(apiKey) return link + lang + '?SR_KEY=' + apiKey + '#prefill=' + jsonData;
        else return link + lang + '#prefill=' + jsonData;
    }

    static genConverterLink(ogl, apiKey)
    {
        let lang = ogl.account.lang == 'us' ? 'en' : ogl.account.lang == 'ar' ? 'es' : ogl.account.lang;
        let toolID = ogl.db.options.converter && Util.converterList[ogl.db.options.converter] ? ogl.db.options.converter : Object.keys(Util.converterList)[Math.floor(Math.random() * Object.keys(Util.converterList).length)];
        const link = Util.converterList[toolID];

        if(toolID == 'ogotcha') return `${link}${lang}?CR_KEY=${apiKey}&utm_source=OGLight`;
        else if(toolID == 'topraider') return `${link}?CR_KEY=${apiKey}&lang=${lang}`;
        else if(toolID == 'ogame.tools') return `${link}?CR_KEY=${apiKey}`;
    }

    static genOgotchaLink(ogl, apiKey)
    {
        let lang = ogl.account.lang == 'us' ? 'en' : ogl.account.lang == 'ar' ? 'es' : ogl.account.lang;
        return `http://ogotcha.universeview.be/${lang}?CR_KEY=${apiKey}&utm_source=OGLight`;
    }

    static genTopRaiderLink(ogl, apiKey)
    {
        let lang = ogl.account.lang == 'us' ? 'en' : ogl.account.lang == 'ar' ? 'es' : ogl.account.lang;
        return `http://topraider.eu/index.php?CR_KEY=${apiKey}&lang=${lang}`;
    }

    static genMmorpgstatLink(ogl, playerID)
    {
        let lang = ['fr', 'de', 'en', 'es', 'pl', 'it', 'ru', 'ar', 'mx', 'tr', 'fi', 'tw', 'gr', 'br', 'nl',
                    'hr', 'sk', 'cz', 'ro', 'us', 'pt', 'dk', 'no', 'se', 'si', 'hu', 'jp', 'ba'].indexOf(ogl.server.lang);

        return `http://www.mmorpg-stat.eu/0_fiche_joueur.php?pays=${lang}&ftr=${playerID}.dat&univers=_${ogl.server.id}`;
    }
}

class PTRE
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.url = `http://ptre.chez.gg/scripts/`;
        this.playerPositionsDelay = 1000*60*60;
        this.manageSyncedListUrl = `http://ptre.chez.gg/?page=players_list`;
    }

    request(page, init)
    {
        const params = {};
        const options = {};

        if(document.querySelector('.ogl_ptreActionIcon i'))
        {
            if(this.ogl.ptreNotificationIconTimeout) clearTimeout(this.ogl.ptreNotificationIconTimeout);
            document.querySelector('.ogl_ptreActionIcon i').className = 'material-icons ogl_warning';
            document.querySelector('.ogl_ptreActionIcon i').classList.add('ogl_active');
        }

        Object.entries(init).forEach(obj =>
        {
            if(obj[0].indexOf('_') === 0) options[obj[0].replace('_', '')] = obj[1];
            else params[obj[0]] = obj[1];
        });

        params.tool = 'oglight';
        params.team_key = this.ogl.ptreKey;
        params.country = this.ogl.server.lang;
        params.univers = this.ogl.server.id;
        params.version = this.ogl.version;

        const strParams = !params ? '' : '?' + new URLSearchParams(params).toString();

        return fetch(`${this.url}${page}${strParams}`, options)
        .then(response => response.json())
        .then(data =>
        {
            this.ogl.ptreNotificationIconTimeout = setTimeout(() => this.notify(data.message, data.code, data.message_verbose), 100);
            return Promise.resolve(data);
        });
    }

    notify(message, code, verbose)
    {
        return;
        /*if(!document.querySelector('.ogl_ptreActionIcon i')) return;

        document.querySelector('.ogl_ptreActionIcon i').className = 'material-icons';
        document.querySelector('.ogl_ptreActionIcon i').classList.remove('ogl_active');

        if(code != 1)
        {
            this.log(code, verbose || message); // log errors
            document.querySelector('.ogl_ptreActionIcon i').classList.add('ogl_danger');
        }
        else
        {
            document.querySelector('.ogl_ptreActionIcon i').classList.add('ogl_ok');
        }*/
    }

    log(code, message)
    {
        const id = serverTime.getTime();

        this.ogl.cache.ptreLogs = this.ogl.cache.ptreLogs || [];
        this.ogl.cache.ptreLogs.push({code:code, message:message, id:id });

        if(this.ogl.cache.ptreLogs.length > 10) this.ogl.cache.ptreLogs.shift();
    }

    displayLogs()
    {
        const container = Util.addDom('div', { class:'ogl_log' });

        if(this.ogl.cache.ptreLogs?.length > 0)
        {
            this.ogl.cache.ptreLogs.forEach(log =>
            {
                const time = this.ogl._time.convertTimestampToDate(log.id);
    
                Util.addDom('div', { child:`<div>${time.outerHTML}</div><div>${log.code}</div><div>${log.message}</div>`, prepend:container });
            });
    
            Util.addDom('div', { child:`<div>time</div><div>error code</div><div>message</div>`, prepend:container });
        }
        else
        {
            Util.addDom('div', { child:'empty', parent:container });
        }

        Util.addDom('div', { child:`<h2>PTRE errors</h2>`, prepend:container });

        this.ogl._popup.open(container, true);
    }

    postPositions(postData)
    {
        return;
       /* this.request('api_galaxy_import_infos.php',
        {
            _method:'POST',
            _body:JSON.stringify(postData)
        });*/
    }

    postActivities(postData)
    {
        return;
        /*
        this.request('oglight_import_player_activity.php',
        {
            _method:'POST',
            _body:JSON.stringify(postData)
        })
        .then(data =>
        {
            if(data.code == 1)
            {
                Object.keys(postData).forEach(id =>
                {
                    const parent = document.querySelector(`.msg[data-msg-id="${id}"] .msg_title`);
                    if(parent && !document.querySelector(`.msg[data-msg-id="${id}"] .ogl_checked`)) Util.addDom('div', { class:'material-icons ogl_checked tooltipLeft ogl_ptre', child:'ptre', title:this.ogl._lang.find('ptreActivityImported'), parent:parent });

                    //if(this.ogl.page == 'messages') this.ogl.cache.counterSpies.push(id);
                });
            }
        });*/
    }

    postPTRECompatibility(postData)
    {
        return;
        /*
        this.request('oglight_update_version.php',
        {
            _method:'POST',
            _body:JSON.stringify(postData)
        })
        .then(data =>
        {
            if(data.code == 1)
            {
                this.ogl.id[1] = serverTime.getTime();
                GM_setValue('ogl_id', this.ogl.id);
            }
        });*/
    }

    postSpyReport(apiKey)
    {
        return; 
        /*
        this.request('oglight_import.php',
        {
            _method:'POST',
            sr_id:apiKey
        })
        .then(data =>
        {
            this.ogl._notification.addToQueue(`PTRE: ${data.message_verbose}`, data.code == 1);
        });
        */
    }

    // export targets with the "ptre" flag
    // import all ptre targets and give them the "ptre" flag
    syncTargetList()
    {
        return;
        /*
        let json = [];
        Object.values(this.ogl.db.udb).filter(u => u.pin == 'ptre').forEach(player => { json.push({ id:player.uid, pseudo:player.name }); });

        this.request('api_sync_target_list.php',
        {
            _method:'POST',
            _body:JSON.stringify(json)
        })
        .then(data =>
        {
            if(data.code == 1)
            {
                data.targets_array.forEach(playerData =>
                {
                    const id = parseInt(playerData.player_id)
                    const player = this.ogl.db.udb[id] || this.ogl.createPlayer(id);

                    player.name = playerData.pseudo;

                    if(!player.pin) player.pin = 'ptre';
                });

                if(document.querySelector('.ogl_side.ogl_active') && this.ogl.db.lastPinTab == 'ptre')
                {
                    this.ogl._topbar.openPinned();
                }
            }

            this.ogl._notification.addToQueue(`PTRE: ${data.message}`, data.code == 1);
        });
        */
    }

    // player activities in frame
    getPlayerInfo(player, frame)
    {
        return;

        /*

        const container = Util.addDom('div', { class:'ogl_ptreContent', child:'<div class="ogl_loading"></div>' });
        this.ogl._popup.open(container);

        frame = frame || 'week';

        this.request('oglight_get_player_infos.php',
        {
            _method:'GET',
            player_id:player.id,
            pseudo:player.name,
            input_frame:frame
        })
        .then(data =>
        {
            if(data.code == 1)
            {
                const arrData = JSON.parse(data.activity_array?.activity_array || '{}');
                const checkData = JSON.parse(data.activity_array?.check_array || '{}');

                container.innerHTML = `
                    <h3>${player.name}</h3>
                    <div class="ogl_ptreActivityBlock">
                        <div class="ogl_frameSelector"></div>
                        <div class="ogl_ptreActivities"><span></span><div></div></div>
                    </div>
                    <div class="ogl_ptreBestReport">
                        <div>${this.ogl._lang.find('reportFound')} (${new Date(data.top_sr_timestamp * 1000).toLocaleDateString('fr-FR')})</div>
                        <div>
                            <div class="ogl_fleetDetail"></div>
                            <b><i class="material-icons">rocket_launch</i>${Util.formatToUnits(data.top_sr_fleet_points)} pts</b>
                        </div>
                        <div>
                            <a class="ogl_button" target="_blank" href="${data.top_sr_link}">${this.ogl._lang.find('topReportDetails')}</a>
                            <a class="ogl_button" target="_blank" href="http://ptre.chez.gg/?country=${this.ogl.server.lang}&univers=${this.ogl.server.id}&player_id=${player.id}">${this.ogl._lang.find('playerProfile')}</a>
                        </div>
                    </div>
                    <!--<ul class="ogl_ptreLegend">
                        <li><u>Green circle</u>: no activity detected & fully checked</li>
                        <li><u>Green dot</u>: no activity detected</li>
                        <li><u>Red dot</u>: multiple activities detected</li>
                        <li><u>Transparent dot</u>: not enough planet checked</li>
                    </ul>-->
                `;

                Object.entries({ 'last24h':'Last 24h', '2days':'2 days', '3days':'3 days', 'week':'Week', '2weeks':'2 weeks', 'month':'Month' }).forEach(range =>
                {
                    const button = Util.addDom('button', { class:'ogl_button', child:range[1], parent:container.querySelector('.ogl_frameSelector'), onclick:() =>
                    {
                        this.getPlayerInfo(player, range[0]);
                    }});

                    if(range[0] == frame) button.classList.add('ogl_active');
                });

                if(data.activity_array.succes == 1)
                {
                    arrData.forEach((line, index) =>
                    {
                        if(!isNaN(line[1]))
                        {
                            let div = Util.addDom('div', { class:'tooltip', child:`<div>${line[0]}</div>` });
                            let span = div.appendChild(Util.addDom('span', { class:'ogl_ptreDotStats' }));
                            let dot = span.appendChild(Util.addDom('div', { 'data-acti':line[1], 'data-check':checkData[index][1] }));

                            let dotValue = line[1] / data.activity_array.max_acti_per_slot * 100 * 7;
                            dotValue = Math.ceil(dotValue / 30) * 30;

                            dot.style.color = `hsl(${Math.max(0, 100 - dotValue)}deg 75% 40%)`;
                            dot.style.opacity = checkData[index][1] + '%';

                            let title;
                            let checkValue = Math.max(0, 100 - dotValue);

                            if(checkValue === 100) title = '- No activity detected';
                            else if(checkValue >= 60) title = '- A few activities detected';
                            else if(checkValue >= 40) title = '- Some activities detected';
                            else title = '- A lot of activities detected';

                            if(checkData[index][1] == 100) title += '<br>- Perfectly checked';
                            else if(checkData[index][1] >= 75) title += '<br>- Nicely checked';
                            else if(checkData[index][1] >= 50) title += '<br>- Decently checked';
                            else if(checkData[index][1] > 0) title = 'Poorly checked';
                            else title = 'Not checked';

                            div.setAttribute('title', title);

                            if(checkData[index][1] === 100 && line[1] == 0) dot.classList.add('ogl_active');

                            container.querySelector('.ogl_ptreActivities > div').appendChild(div);
                        }
                    });
                }

                if(data.fleet_json)
                {
                    this.ogl.shipsList.forEach(shipID =>
                    {
                        const shipData = data.fleet_json.find(e => e.ship_type == shipID);
                        if(shipData)
                        {
                            Util.addDom('div', { class:`ogl_icon ogl_${shipID}`, child:Util.formatToUnits(shipData.count), parent:container.querySelector('.ogl_fleetDetail') });
                        }
                    });
                }

                this.ogl._popup.open(container, true);
            }
            else
            {
                container.innerHTML = `${data.message}<hr><a target="_blank" href="http://ptre.chez.gg/?page=splash">More informations here</a>`;
            }
        });
        */
    }

    // check for new positions
    getPlayerPositions(playerData)
    {
        return;

        /*
        const updateList = () =>
        {
            if(document.querySelector('.ogl_pinDetail') && this.ogl.db.currentSide == playerData.id) // current pin
            {
                this.ogl._topbar.openPinnedDetail(playerData.id, true);
            }
        }

        const player = this.ogl.db.udb[playerData.id] || this.ogl.createPlayer(playerData.player_id);

        this.ogl._fetch.fetchPlayerAPI(playerData.id, playerData.name, () =>
        {
            if(this.ogl.ptreKey && serverTime.getTime() - (player.ptre || 0) > this.playerPositionsDelay)
            {
                this.request('api_galaxy_get_infos.php',
                {
                    _method:'GET',
                    player_id:playerData.id,
                })
                .then(data =>
                {
                    if(data.code == 1)
                    {
                        if(data.last_astro_level_seen > 0 && data.last_astro_level_seen_timestamp * 1000 > (player.liveUpdate || 0))
                        {
                            player.astro = data.last_astro_level_seen;
                        }

                        updateList();
                        player.ptre = serverTime.getTime();

                        data.galaxy_array.forEach(ptrePlanet =>
                        {
                            const oglPlanet = this.ogl.db.pdb[ptrePlanet.coords] || {};

                            if((oglPlanet.api || 0) < ptrePlanet.timestamp_ig)
                            {
                                oglPlanet.uid = ptrePlanet.player_id;
                                oglPlanet.pid = ptrePlanet.id;
                                oglPlanet.mid = ptrePlanet.moon?.id || -1;
                                oglPlanet.coo = ptrePlanet.coords;
                                oglPlanet.acti = ['60', '60', ptrePlanet.timestamp_ig];

                                // remove old planet owner
                                this.ogl.removeOldPlanetOwner(ptrePlanet.coords, ptrePlanet.player_id);

                                // add new planet owner
                                if(player.planets && player.planets.indexOf(ptrePlanet.coords) < 0)
                                {
                                    player.planets.push(ptrePlanet.coords);
                                }

                                this.ogl.db.pdb[ptrePlanet.coords] = oglPlanet;

                                if(document.querySelector('.ogl_pinDetail') && this.ogl.db.currentSide == ptrePlanet.player_id)
                                {
                                    this.ogl._topbar.openPinnedDetail(this.ogl.db.currentSide);
                                }
                            }
                        });
                    }

                    this.ogl._notification.addToQueue(`PTRE: ${data.message}`, data.code == 1);
                });
            }
            else
            {
                updateList();
            }
        });
        */
    }

    getRank(params, callback)
    {
        return;
        /*
        params = params || {};

        this.request('api_get_ranks.php',
        {
            _method:'GET',
            country:params.country || this.ogl.server.lang,
            univers:params.univers || this.ogl.server.id,
            timestamp:params.timestamp || -1,
        })
        .then(data =>
        {
            if(callback) callback(data);
        });
        */
    }
}

class Datafinder
{
    static getTech(id)
    {
        let tech =
        {
            // base building
            1: { metal:60, crystal:15, deut:0, priceFactor:1.5 },
            2: { metal:48, crystal:24, deut:0, priceFactor:1.6 },
            3: { metal:225, crystal:75, deut:0, priceFactor:1.5 },
            4: { metal:75, crystal:30, deut:0, priceFactor:1.5 },
            12: { metal:900, crystal:360, deut:180, priceFactor:1.8 },
            14: { metal:400, crystal:120, deut:200 },
            15: { metal:1000000, crystal:500000, deut:100000 },
            21: { metal:400, crystal:200, deut:100 },
            22: { metal:1000, crystal:0, deut:0 },
            23: { metal:1000, crystal:500, deut:0 },
            24: { metal:1000, crystal:1000, deut:0 },
            31: { metal:200, crystal:400, deut:200 },
            33: { metal:0, crystal:50000, deut:100000, energy:1000, energyFactor:2 },
            34: { metal:20000, crystal:40000, deut:0 },
            36: { metal:200, crystal:0, deut:50, energy:50, priceFactor:5, energyFactor:2.5 },
            41: { metal:20000, crystal:40000, deut:20000 },
            42: { metal:20000, crystal:40000, deut:20000 },
            43: { metal:2000000, crystal:4000000, deut:2000000 },
            44: { metal:20000, crystal:20000, deut:1000 },

            // base research
            106: { metal:200, crystal:1000, deut:200 },
            108: { metal:0, crystal:400, deut:600 },
            109: { metal:800, crystal:200, deut:0 },
            110: { metal:200, crystal:600, deut:0 },
            111: { metal:1000, crystal:0, deut:0 },
            113: { metal:0, crystal:800, deut:400 },
            114: { metal:0, crystal:4000, deut:2000 },
            115: { metal:400, crystal:0, deut:600 },
            117: { metal:2000, crystal:4000, deut:600 },
            118: { metal:10000, crystal:20000, deut:6000 },
            120: { metal:200, crystal:100, deut:0 },
            121: { metal:1000, crystal:300, deut:100 },
            122: { metal:2000, crystal:4000, deut:1000 },
            123: { metal:240000, crystal:400000, deut:160000 },
            124: { metal:4000, crystal:8000, deut:4000, priceFactor:1.75 },
            199: { metal:0, crystal:0, deut:0, energy:300000, priceFactor:3, energyFactor:3, durationFactor:1 },

            // ship
            202: { metal:2000,      crystal:2000,       deut:0 },
            203: { metal:6000,      crystal:6000,       deut:0 },
            204: { metal:3000,      crystal:1000,       deut:0 },
            205: { metal:6000,      crystal:4000,       deut:0 },
            206: { metal:20000,     crystal:7000,       deut:2000 },
            207: { metal:45000,     crystal:15000,      deut:0 },
            208: { metal:10000,     crystal:20000,      deut:10000 },
            209: { metal:10000,     crystal:6000,       deut:2000 },
            210: { crystal:1000,       deut:0 },
            211: { metal:50000,     crystal:25000,      deut:15000 },
            212: { metal:0,         crystal:2000,       deut:500 },
            213: { metal:60000,     crystal:50000,      deut:15000 },
            214: { metal:5000000,   crystal:4000000,    deut:1000000 },
            215: { metal:30000,     crystal:40000,      deut:15000 },
            217: { metal:2000,      crystal:2000,       deut:1000 },
            218: { metal:85000,     crystal:55000,      deut:20000 },
            219: { metal:8000,      crystal:15000,      deut:8000 },
            
            // def
            401: { metal:2000,  crystal:0,      deut:0 },
            402: { metal:1500,  crystal:500,    deut:0 },
            403: { metal:6000,  crystal:2000,   deut:0 },
            404: { metal:20000, crystal:15000,  deut:2000 },
            405: { metal:5000,  crystal:3000,   deut:0 },
            406: { metal:50000, crystal:50000,  deut:30000 },
            407: { metal:10000, crystal:10000,  deut:0 },
            408: { metal:50000, crystal:50000,  deut:0 },

            // missile
            502: { metal:8000, crystal:0, deut:2000 },
            503: { metal:12000, crystal:2500, deut:10000 },

            // lifeforms
            "11101":{"type":"building","lifeform":"human","metal":7,"crystal":2,"deut":0,"priceFactor":1.2,"bonus1BaseValue":210,"bonus1IncreaseFactor":1.21,"bonus2BaseValue":16,"bonus2IncreaseFactor":1.2,"bonus3Value":9,"bonus3IncreaseFactor":1.15,"durationfactor":1.21,"durationbase":40},"11102":{"type":"building","lifeform":"human","metal":5,"crystal":2,"deut":0,"energy":8,"priceFactor":1.23,"energyIncreaseFactor":1.02,"bonus1BaseValue":10,"bonus1IncreaseFactor":1.15,"bonus2BaseValue":10,"bonus2IncreaseFactor":1.14,"durationfactor":1.25,"durationbase":40},"11103":{"type":"building","lifeform":"human","metal":20000,"crystal":25000,"deut":10000,"energy":10,"priceFactor":1.3,"energyIncreaseFactor":1.08,"bonus1BaseValue":0.25,"bonus1IncreaseFactor":1,"bonus1Max":0.25,"bonus2BaseValue":2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.25,"durationbase":16000},"11104":{"type":"building","lifeform":"human","metal":5000,"crystal":3200,"deut":1500,"energy":15,"priceFactor":1.7,"energyIncreaseFactor":1.25,"bonus1BaseValue":20000000,"bonus1IncreaseFactor":1.1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.6,"durationbase":16000},"11105":{"type":"building","lifeform":"human","metal":50000,"crystal":40000,"deut":50000,"energy":30,"priceFactor":1.7,"energyIncreaseFactor":1.25,"bonus1BaseValue":100000000,"bonus1IncreaseFactor":1.1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.7,"durationbase":64000},"11106":{"type":"building","lifeform":"human","metal":9000,"crystal":6000,"deut":3000,"energy":40,"priceFactor":1.5,"energyIncreaseFactor":1.1,"bonus1BaseValue":1.5,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":2000},"11107":{"type":"building","lifeform":"human","metal":25000,"crystal":13000,"deut":7000,"priceFactor":1.09,"bonus1BaseValue":1,"bonus1IncreaseFactor":1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"bonus2Max":0.8,"bonus3Value":0.8,"bonus3IncreaseFactor":1,"durationfactor":1.17,"durationbase":12000},"11108":{"type":"building","lifeform":"human","metal":50000,"crystal":25000,"deut":15000,"energy":80,"priceFactor":1.5,"energyIncreaseFactor":1.1,"bonus1BaseValue":1.5,"bonus1IncreaseFactor":1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.2,"durationbase":28000},"11109":{"type":"building","lifeform":"human","metal":75000,"crystal":20000,"deut":25000,"energy":50,"priceFactor":1.09,"energyIncreaseFactor":1.02,"bonus1BaseValue":1.5,"bonus1IncreaseFactor":1,"bonus2BaseValue":1.5,"bonus2IncreaseFactor":1,"durationfactor":1.2,"durationbase":40000},"11110":{"type":"building","lifeform":"human","metal":150000,"crystal":30000,"deut":15000,"energy":60,"priceFactor":1.12,"energyIncreaseFactor":1.03,"bonus1BaseValue":5,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":52000},"11111":{"type":"building","lifeform":"human","metal":80000,"crystal":35000,"deut":60000,"energy":90,"priceFactor":1.5,"energyIncreaseFactor":1.05,"bonus1BaseValue":0.5,"bonus1IncreaseFactor":1,"bonus1Max":1,"durationfactor":1.3,"durationbase":90000},"11112":{"type":"building","lifeform":"human","metal":250000,"crystal":125000,"deut":125000,"energy":100,"priceFactor":1.15,"energyIncreaseFactor":1.02,"bonus1BaseValue":3,"bonus1IncreaseFactor":1,"bonus1Max":0.9,"durationfactor":1.2,"durationbase":95000},"11201":{"type":"tech 1","lifeform":"human","metal":5000,"crystal":2500,"deut":500,"priceFactor":1.3,"bonus1BaseValue":1,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":1000},"11202":{"type":"tech 2","lifeform":"human","metal":7000,"crystal":10000,"deut":5000,"priceFactor":1.5,"bonus1BaseValue":0.06,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":2000},"11203":{"type":"tech 3","lifeform":"human","metal":15000,"crystal":10000,"deut":5000,"priceFactor":1.3,"bonus1BaseValue":0.5,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":2500},"11204":{"type":"tech 4","lifeform":"human","metal":20000,"crystal":15000,"deut":7500,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":3500},"11205":{"type":"tech 5","lifeform":"human","metal":25000,"crystal":20000,"deut":10000,"priceFactor":1.3,"bonus1BaseValue":4,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":4500},"11206":{"type":"tech 6","lifeform":"human","metal":35000,"crystal":25000,"deut":15000,"priceFactor":1.5,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.99,"durationfactor":1.3,"durationbase":5000},"11207":{"type":"tech 7","lifeform":"human","metal":70000,"crystal":40000,"deut":20000,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":8000},"11208":{"type":"tech 8","lifeform":"human","metal":80000,"crystal":50000,"deut":20000,"priceFactor":1.5,"bonus1BaseValue":0.06,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":6000},"11209":{"type":"tech 9","lifeform":"human","metal":320000,"crystal":240000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":6500},"11210":{"type":"tech 10","lifeform":"human","metal":320000,"crystal":240000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":7000},"11211":{"type":"tech 11","lifeform":"human","metal":120000,"crystal":30000,"deut":25000,"priceFactor":1.5,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.99,"durationfactor":1.3,"durationbase":7500},"11212":{"type":"tech 12","lifeform":"human","metal":100000,"crystal":40000,"deut":30000,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":10000},"11213":{"type":"tech 13","lifeform":"human","metal":200000,"crystal":100000,"deut":100000,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":8500},"11214":{"type":"tech 14","lifeform":"human","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":9000},"11215":{"type":"tech 15","lifeform":"human","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":9500},"11216":{"type":"tech 16","lifeform":"human","metal":320000,"crystal":240000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":10000},"11217":{"type":"tech 17","lifeform":"human","metal":300000,"crystal":180000,"deut":120000,"priceFactor":1.5,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"bonus1Max":0.99,"durationfactor":1.3,"durationbase":11000},"11218":{"type":"tech 18","lifeform":"human","metal":500000,"crystal":300000,"deut":200000,"priceFactor":1.2,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"bonus1Max":0.99,"durationfactor":1.3,"durationbase":13000},"12101":{"type":"building","lifeform":"rocktal","metal":9,"crystal":3,"deut":0,"priceFactor":1.2,"bonus1BaseValue":150,"bonus1IncreaseFactor":1.216,"bonus2BaseValue":12,"bonus2IncreaseFactor":1.2,"bonus3Value":5,"bonus3IncreaseFactor":1.15,"durationfactor":1.21,"durationbase":40},"12102":{"type":"building","lifeform":"rocktal","metal":7,"crystal":2,"deut":0,"energy":10,"priceFactor":1.2,"energyIncreaseFactor":1.03,"bonus1BaseValue":8,"bonus1IncreaseFactor":1.15,"bonus2BaseValue":6,"bonus2IncreaseFactor":1.14,"durationfactor":1.21,"durationbase":40},"12103":{"type":"building","lifeform":"rocktal","metal":40000,"crystal":10000,"deut":15000,"energy":15,"priceFactor":1.3,"energyIncreaseFactor":1.1,"bonus1BaseValue":0.25,"bonus1IncreaseFactor":1,"bonus1Max":0.25,"bonus2BaseValue":2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.25,"durationbase":16000},"12104":{"type":"building","lifeform":"rocktal","metal":5000,"crystal":3800,"deut":1000,"energy":20,"priceFactor":1.7,"energyIncreaseFactor":1.35,"bonus1BaseValue":16000000,"bonus1IncreaseFactor":1.14,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.6,"durationbase":16000},"12105":{"type":"building","lifeform":"rocktal","metal":50000,"crystal":40000,"deut":50000,"energy":60,"priceFactor":1.65,"energyIncreaseFactor":1.3,"bonus1BaseValue":90000000,"bonus1IncreaseFactor":1.1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.7,"durationbase":64000},"12106":{"type":"building","lifeform":"rocktal","metal":10000,"crystal":8000,"deut":1000,"energy":40,"priceFactor":1.4,"energyIncreaseFactor":1.1,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":2000},"12107":{"type":"building","lifeform":"rocktal","metal":20000,"crystal":15000,"deut":10000,"priceFactor":1.2,"bonus1BaseValue":1.5,"bonus1IncreaseFactor":1,"bonus2BaseValue":0.5,"bonus2IncreaseFactor":1,"bonus2Max":0.4,"durationfactor":1.25,"durationbase":16000},"12108":{"type":"building","lifeform":"rocktal","metal":50000,"crystal":35000,"deut":15000,"energy":80,"priceFactor":1.5,"energyIncreaseFactor":1.3,"bonus1BaseValue":1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"bonus2Max":0.5,"durationfactor":1.4,"durationbase":40000},"12109":{"type":"building","lifeform":"rocktal","metal":85000,"crystal":44000,"deut":25000,"energy":90,"priceFactor":1.4,"energyIncreaseFactor":1.1,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":40000},"12110":{"type":"building","lifeform":"rocktal","metal":120000,"crystal":50000,"deut":20000,"energy":90,"priceFactor":1.4,"energyIncreaseFactor":1.1,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":52000},"12111":{"type":"building","lifeform":"rocktal","metal":250000,"crystal":150000,"deut":100000,"energy":120,"priceFactor":1.8,"energyIncreaseFactor":1.3,"bonus1BaseValue":0.5,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"durationfactor":1.3,"durationbase":90000},"12112":{"type":"building","lifeform":"rocktal","metal":250000,"crystal":125000,"deut":125000,"energy":100,"priceFactor":1.5,"energyIncreaseFactor":1.1,"bonus1BaseValue":0.6,"bonus1IncreaseFactor":1,"bonus1Max":0.3,"durationfactor":1.3,"durationbase":95000},"12201":{"type":"tech 1","lifeform":"rocktal","metal":10000,"crystal":6000,"deut":1000,"priceFactor":1.5,"bonus1BaseValue":0.25,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":1000},"12202":{"type":"tech 2","lifeform":"rocktal","metal":7500,"crystal":12500,"deut":5000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":2000},"12203":{"type":"tech 3","lifeform":"rocktal","metal":15000,"crystal":10000,"deut":5000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":2500},"12204":{"type":"tech 4","lifeform":"rocktal","metal":20000,"crystal":15000,"deut":7500,"priceFactor":1.3,"bonus1BaseValue":0.4,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":3500},"12205":{"type":"tech 5","lifeform":"rocktal","metal":25000,"crystal":20000,"deut":10000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":4500},"12206":{"type":"tech 6","lifeform":"rocktal","metal":50000,"crystal":50000,"deut":20000,"priceFactor":1.5,"bonus1BaseValue":0.25,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":5000},"12207":{"type":"tech 7","lifeform":"rocktal","metal":70000,"crystal":40000,"deut":20000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":5500},"12208":{"type":"tech 8","lifeform":"rocktal","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":6000},"12209":{"type":"tech 9","lifeform":"rocktal","metal":75000,"crystal":55000,"deut":25000,"priceFactor":1.5,"bonus1BaseValue":0.15,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.3,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":6500},"12210":{"type":"tech 10","lifeform":"rocktal","metal":85000,"crystal":40000,"deut":35000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":7000},"12211":{"type":"tech 11","lifeform":"rocktal","metal":120000,"crystal":30000,"deut":25000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":7500},"12212":{"type":"tech 12","lifeform":"rocktal","metal":100000,"crystal":40000,"deut":30000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":8000},"12213":{"type":"tech 13","lifeform":"rocktal","metal":200000,"crystal":100000,"deut":100000,"priceFactor":1.2,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.1,"bonus2IncreaseFactor":1,"durationfactor":1.3,"durationbase":8500},"12214":{"type":"tech 14","lifeform":"rocktal","metal":220000,"crystal":110000,"deut":110000,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":9000},"12215":{"type":"tech 15","lifeform":"rocktal","metal":240000,"crystal":120000,"deut":120000,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":9500},"12216":{"type":"tech 16","lifeform":"rocktal","metal":250000,"crystal":250000,"deut":250000,"priceFactor":1.4,"bonus1BaseValue":0.5,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":10000},"12217":{"type":"tech 17","lifeform":"rocktal","metal":500000,"crystal":300000,"deut":200000,"priceFactor":1.5,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":13000},"12218":{"type":"tech 18","lifeform":"rocktal","metal":300000,"crystal":180000,"deut":120000,"priceFactor":1.7,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":11000},"13101":{"type":"building","lifeform":"mecha","metal":6,"crystal":2,"deut":0,"priceFactor":1.21,"bonus1BaseValue":500,"bonus1IncreaseFactor":1.205,"bonus2BaseValue":24,"bonus2IncreaseFactor":1.2,"bonus3Value":22,"bonus3IncreaseFactor":1.15,"durationfactor":1.22,"durationbase":40},"13102":{"type":"building","lifeform":"mecha","metal":5,"crystal":2,"deut":0,"energy":8,"priceFactor":1.18,"energyIncreaseFactor":1.02,"bonus1BaseValue":18,"bonus1IncreaseFactor":1.15,"bonus2BaseValue":23,"bonus2IncreaseFactor":1.12,"durationfactor":1.2,"durationbase":48},"13103":{"type":"building","lifeform":"mecha","metal":30000,"crystal":20000,"deut":10000,"energy":13,"priceFactor":1.3,"energyIncreaseFactor":1.08,"bonus1BaseValue":0.25,"bonus1IncreaseFactor":1,"bonus1Max":0.25,"bonus2BaseValue":2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.25,"durationbase":16000},"13104":{"type":"building","lifeform":"mecha","metal":5000,"crystal":3800,"deut":1000,"energy":10,"priceFactor":1.8,"energyIncreaseFactor":1.2,"bonus1BaseValue":40000000,"bonus1IncreaseFactor":1.1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.6,"durationbase":16000},"13105":{"type":"building","lifeform":"mecha","metal":50000,"crystal":40000,"deut":50000,"energy":40,"priceFactor":1.8,"energyIncreaseFactor":1.2,"bonus1BaseValue":130000000,"bonus1IncreaseFactor":1.1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.7,"durationbase":64000},"13106":{"type":"building","lifeform":"mecha","metal":7500,"crystal":7000,"deut":1000,"priceFactor":1.3,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"bonus1Max":0.99,"durationfactor":1.3,"durationbase":2000},"13107":{"type":"building","lifeform":"mecha","metal":35000,"crystal":15000,"deut":10000,"energy":40,"priceFactor":1.5,"energyIncreaseFactor":1.05,"bonus1BaseValue":1,"bonus1IncreaseFactor":1,"bonus1Max":1,"bonus2BaseValue":0.3,"bonus2IncreaseFactor":1,"durationfactor":1.4,"durationbase":16000},"13108":{"type":"building","lifeform":"mecha","metal":50000,"crystal":20000,"deut":30000,"energy":40,"priceFactor":1.07,"energyIncreaseFactor":1.01,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"bonus2BaseValue":2,"bonus2IncreaseFactor":1,"durationfactor":1.17,"durationbase":12000},"13109":{"type":"building","lifeform":"mecha","metal":100000,"crystal":10000,"deut":3000,"energy":80,"priceFactor":1.14,"energyIncreaseFactor":1.04,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"bonus2BaseValue":6,"bonus2IncreaseFactor":1,"durationfactor":1.3,"durationbase":40000},"13110":{"type":"building","lifeform":"mecha","metal":100000,"crystal":40000,"deut":20000,"energy":60,"priceFactor":1.5,"energyIncreaseFactor":1.1,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":52000},"13111":{"type":"building","lifeform":"mecha","metal":55000,"crystal":50000,"deut":30000,"energy":70,"priceFactor":1.5,"energyIncreaseFactor":1.05,"bonus1BaseValue":0.4,"bonus1IncreaseFactor":1,"bonus1Max":1,"durationfactor":1.3,"durationbase":50000},"13112":{"type":"building","lifeform":"mecha","metal":250000,"crystal":125000,"deut":125000,"energy":100,"priceFactor":1.4,"energyIncreaseFactor":1.05,"bonus1BaseValue":1.3,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"durationfactor":1.4,"durationbase":95000},"13201":{"type":"tech 1","lifeform":"mecha","metal":10000,"crystal":6000,"deut":1000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":1000},"13202":{"type":"tech 2","lifeform":"mecha","metal":7500,"crystal":12500,"deut":5000,"priceFactor":1.3,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":2000},"13203":{"type":"tech 3","lifeform":"mecha","metal":15000,"crystal":10000,"deut":5000,"priceFactor":1.5,"bonus1BaseValue":0.03,"bonus1IncreaseFactor":1,"bonus1Max":0.3,"durationfactor":1.4,"durationbase":2500},"13204":{"type":"tech 4","lifeform":"mecha","metal":20000,"crystal":15000,"deut":7500,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":3500},"13205":{"type":"tech 5","lifeform":"mecha","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":4500},"13206":{"type":"tech 6","lifeform":"mecha","metal":50000,"crystal":50000,"deut":20000,"priceFactor":1.5,"bonus1BaseValue":0.06,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":5000},"13207":{"type":"tech 7","lifeform":"mecha","metal":70000,"crystal":40000,"deut":20000,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":5500},"13208":{"type":"tech 8","lifeform":"mecha","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":1,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":6000},"13209":{"type":"tech 9","lifeform":"mecha","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":6500},"13210":{"type":"tech 10","lifeform":"mecha","metal":85000,"crystal":40000,"deut":35000,"priceFactor":1.2,"bonus1BaseValue":0.15,"bonus1IncreaseFactor":1,"bonus1Max":0.9,"durationfactor":1.3,"durationbase":7000},"13211":{"type":"tech 11","lifeform":"mecha","metal":120000,"crystal":30000,"deut":25000,"priceFactor":1.3,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":7500},"13212":{"type":"tech 12","lifeform":"mecha","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":8000},"13213":{"type":"tech 13","lifeform":"mecha","metal":200000,"crystal":100000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.06,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":8500},"13214":{"type":"tech 14","lifeform":"mecha","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":9000},"13215":{"type":"tech 15","lifeform":"mecha","metal":320000,"crystal":240000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":9500},"13216":{"type":"tech 16","lifeform":"mecha","metal":320000,"crystal":240000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":10000},"13217":{"type":"tech 17","lifeform":"mecha","metal":500000,"crystal":300000,"deut":200000,"priceFactor":1.5,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":13000},"13218":{"type":"tech 18","lifeform":"mecha","metal":300000,"crystal":180000,"deut":120000,"priceFactor":1.7,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":11000},"14101":{"type":"building","lifeform":"kaelesh","metal":4,"crystal":3,"deut":0,"priceFactor":1.21,"bonus1BaseValue":250,"bonus1IncreaseFactor":1.21,"bonus2BaseValue":16,"bonus2IncreaseFactor":1.2,"bonus3Value":11,"bonus3IncreaseFactor":1.15,"durationfactor":1.22,"durationbase":40},"14102":{"type":"building","lifeform":"kaelesh","metal":6,"crystal":3,"deut":0,"energy":9,"priceFactor":1.2,"energyIncreaseFactor":1.02,"bonus1BaseValue":12,"bonus1IncreaseFactor":1.15,"bonus2BaseValue":12,"bonus2IncreaseFactor":1.14,"durationfactor":1.22,"durationbase":40},"14103":{"type":"building","lifeform":"kaelesh","metal":20000,"crystal":15000,"deut":15000,"energy":10,"priceFactor":1.3,"energyIncreaseFactor":1.08,"bonus1BaseValue":0.25,"bonus1IncreaseFactor":1,"bonus1Max":0.25,"bonus2BaseValue":2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.25,"durationbase":16000},"14104":{"type":"building","lifeform":"kaelesh","metal":7500,"crystal":5000,"deut":800,"energy":15,"priceFactor":1.8,"energyIncreaseFactor":1.3,"bonus1BaseValue":30000000,"bonus1IncreaseFactor":1.1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.7,"durationbase":16000},"14105":{"type":"building","lifeform":"kaelesh","metal":60000,"crystal":30000,"deut":50000,"energy":30,"priceFactor":1.8,"energyIncreaseFactor":1.3,"bonus1BaseValue":100000000,"bonus1IncreaseFactor":1.1,"bonus2BaseValue":1,"bonus2IncreaseFactor":1,"durationfactor":1.8,"durationbase":64000},"14106":{"type":"building","lifeform":"kaelesh","metal":8500,"crystal":5000,"deut":3000,"priceFactor":1.25,"bonus1BaseValue":1,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"durationfactor":1.35,"durationbase":2000},"14107":{"type":"building","lifeform":"kaelesh","metal":15000,"crystal":15000,"deut":5000,"priceFactor":1.2,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":12000},"14108":{"type":"building","lifeform":"kaelesh","metal":75000,"crystal":25000,"deut":30000,"energy":30,"priceFactor":1.05,"energyIncreaseFactor":1.03,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"bonus2BaseValue":6,"bonus2IncreaseFactor":1,"durationfactor":1.18,"durationbase":16000},"14109":{"type":"building","lifeform":"kaelesh","metal":87500,"crystal":25000,"deut":30000,"energy":40,"priceFactor":1.2,"energyIncreaseFactor":1.02,"bonus1BaseValue":200,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":40000},"14110":{"type":"building","lifeform":"kaelesh","metal":150000,"crystal":30000,"deut":30000,"energy":140,"priceFactor":1.4,"energyIncreaseFactor":1.05,"bonus1BaseValue":2,"bonus1IncreaseFactor":1,"bonus1Max":0.3,"durationfactor":1.8,"durationbase":52000},"14111":{"type":"building","lifeform":"kaelesh","metal":75000,"crystal":50000,"deut":55000,"energy":90,"priceFactor":1.2,"energyIncreaseFactor":1.04,"bonus1BaseValue":1.5,"bonus1IncreaseFactor":1,"bonus1Max":0.7,"durationfactor":1.3,"durationbase":90000},"14112":{"type":"building","lifeform":"kaelesh","metal":500000,"crystal":250000,"deut":250000,"energy":100,"priceFactor":1.4,"energyIncreaseFactor":1.05,"bonus1BaseValue":0.5,"bonus1IncreaseFactor":1,"bonus1Max":0.3,"durationfactor":1.3,"durationbase":95000},"14201":{"type":"tech 1","lifeform":"kaelesh","metal":10000,"crystal":6000,"deut":1000,"priceFactor":1.5,"bonus1BaseValue":0.03,"bonus1IncreaseFactor":1,"bonus1Max":0.3,"durationfactor":1.4,"durationbase":1000},"14202":{"type":"tech 2","lifeform":"kaelesh","metal":7500,"crystal":12500,"deut":5000,"priceFactor":1.5,"bonus1BaseValue":0.08,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":2000},"14203":{"type":"tech 3","lifeform":"kaelesh","metal":15000,"crystal":10000,"deut":5000,"priceFactor":1.5,"bonus1BaseValue":0.05,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"durationfactor":1.4,"durationbase":2500},"14204":{"type":"tech 4","lifeform":"kaelesh","metal":20000,"crystal":15000,"deut":7500,"priceFactor":1.5,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":3500},"14205":{"type":"tech 5","lifeform":"kaelesh","metal":25000,"crystal":20000,"deut":10000,"priceFactor":1.5,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":4500},"14206":{"type":"tech 6","lifeform":"kaelesh","metal":50000,"crystal":50000,"deut":20000,"priceFactor":1.3,"bonus1BaseValue":0.4,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":5000},"14207":{"type":"tech 7","lifeform":"kaelesh","metal":70000,"crystal":40000,"deut":20000,"priceFactor":1.5,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.99,"durationfactor":1.3,"durationbase":5500},"14208":{"type":"tech 8","lifeform":"kaelesh","metal":80000,"crystal":50000,"deut":20000,"priceFactor":1.2,"bonus1BaseValue":0.6,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":6000},"14209":{"type":"tech 9","lifeform":"kaelesh","metal":320000,"crystal":240000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":6500},"14210":{"type":"tech 10","lifeform":"kaelesh","metal":85000,"crystal":40000,"deut":35000,"priceFactor":1.2,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"durationfactor":1.2,"durationbase":7000},"14211":{"type":"tech 11","lifeform":"kaelesh","metal":120000,"crystal":30000,"deut":25000,"priceFactor":1.5,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":7500},"14212":{"type":"tech 12","lifeform":"kaelesh","metal":100000,"crystal":40000,"deut":30000,"priceFactor":1.5,"bonus1BaseValue":0.06,"bonus1IncreaseFactor":1,"durationfactor":1.3,"durationbase":8000},"14213":{"type":"tech 13","lifeform":"kaelesh","metal":200000,"crystal":100000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"bonus1Max":0.99,"durationfactor":1.3,"durationbase":8500},"14214":{"type":"tech 14","lifeform":"kaelesh","metal":160000,"crystal":120000,"deut":50000,"priceFactor":1.5,"bonus1BaseValue":1,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":9000},"14215":{"type":"tech 15","lifeform":"kaelesh","metal":240000,"crystal":120000,"deut":120000,"priceFactor":1.5,"bonus1BaseValue":0.1,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":9500},"14216":{"type":"tech 16","lifeform":"kaelesh","metal":320000,"crystal":240000,"deut":100000,"priceFactor":1.5,"bonus1BaseValue":0.3,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":10000},"14217":{"type":"tech 17","lifeform":"kaelesh","metal":500000,"crystal":300000,"deut":200000,"priceFactor":1.5,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"bonus1Max":0.5,"bonus2BaseValue":0.2,"bonus2IncreaseFactor":1,"bonus2Max":0.99,"durationfactor":1.3,"durationbase":13000},"14218":{"type":"tech 18","lifeform":"kaelesh","metal":300000,"crystal":180000,"deut":120000,"priceFactor":1.7,"bonus1BaseValue":0.2,"bonus1IncreaseFactor":1,"durationfactor":1.4,"durationbase":11000}
        }

        return tech[parseInt(id)];
    }
}

GM_addStyle(`:root{--ogl:#ffb800;--primary:linear-gradient(to bottom,#171d23,#101419);--secondary:linear-gradient(192deg,#252e3a,#171c24 70%);--secondaryReversed:linear-gradient(176deg,#252e3a,#171c24 70%);--tertiary:linear-gradient(to bottom,#293746,#212a36 max(5%,8px),#171c24 max(14%,20px));--date:#9c9cd7;--time:#85c1d3;--texthighlight:#6dbbb3;--metal:#9a9ac1;--crystal:#8dceec;--deut:#41aa9c;--energy:#f5bbb4;--dm:#b58cdb;--food:#c3a2ba;--artefact:#cda126;--population:#ccc;--lifeform:#d569b8;--msu:#c7c7c7;--nothing:#ddd;--resource:#86edfd;--ship:#1dd1a1;--pirate:#ffd60b;--alien:#5ce724;--item:#bf6c4d;--blackhole:#818181;--early:#79a2ff;--late:#df5252;--trader:#ff7d30;--red:#f9392b;--pink:#ff7ba8;--purple:#ba68c8;--indigo:#7e57c2;--blue:#3f51b5;--cyan:#29b6f6;--teal:#06a98b;--green:#4caf50;--lime:#97b327;--yellow:#fbea20;--amber:#ffa000;--orange:#f38b3f;--brown:#5d4037;--grey:#607d8b;--mission1:#ef5f5f;--mission2:#ef5f5f;--mission3:#66cd3d;--mission4:#00c5b2;--mission5:#d97235;--mission6:#e9c74b;--mission7:#5ae8ea;--mission8:#0cc14a;--mission9:#ff4545;--mission10:#97b0c3;--mission15:#527dcb;--mission17:#7eacb5;--mission18:#7eacb5;--inactive:#b3b3b3;--longInactive:#767676;--banned:#ebb3b3;--vacation:#0ff;--honorable:#ff6}body[data-colorblind=true]{--vacation:#8592f5;--honorable:#f9ce27}.material-icons{image-rendering:pixelated;letter-spacing:normal;user-select:none;text-transform:none;white-space:nowrap;word-wrap:normal;-webkit-font-feature-settings:"liga";font-feature-settings:"liga";-webkit-font-smoothing:antialiased;direction:ltr;display:inline-block;transform:rotate(.03deg);font-family:Material Icons!important;font-style:normal!important;font-weight:400!important;font-size:inherit!important;line-height:inherit!important}body{background:url(https://gf2.geo.gfsrv.net/cdn4e/d07c90d96bbc823d6d53953a94aacb.jpg) 50% 0!important}body.ogl_destinationPicker #planetList:before{box-shadow:inset 0 0 100px -1px var(--ogl);content:"";opacity:0;pointer-events:none;z-index:10;-webkit-border-radius:7px;border-radius:7px;animation:2.5s ease-in-out infinite pulseOGL;display:block;position:absolute;top:0;bottom:0;left:0;right:0}@keyframes pulseOGL{0%{opacity:0}50%{opacity:.35}to{opacity:0}}body.ogl_destinationPicker .planetlink,body.ogl_destinationPicker .moonlink{cursor:crosshair}line.ogl_line{filter:drop-shadow(0 0 6px #000);marker-end:url(#arrow);marker-start:url(#circle);stroke:#fff;stroke-width:2px}.ui-front:not([aria-describedby=fleetTemplatesEdit]):not(.errorBox):not(:has(#rocketattack)){z-index:9999!important}.ui-widget-overlay{z-index:9998!important}.ogl_unit{white-space:nowrap}.ogl_suffix{margin-left:2px;font-size:smaller;display:inline-block}.ogl_text{color:var(--ogl)!important}.ogl_metal,#resources_metal,.resource.metal,resource-icon.metal .amount{color:var(--metal)!important}.ogl_crystal,#resources_crystal,.resource.crystal,resource-icon.crystal .amount{color:var(--crystal)!important}.ogl_deut,#resources_deuterium,.resource.deuterium,resource-icon.deuterium .amount{color:var(--deut)!important}.ogl_food,#resources_food,.resource.food,resource-icon.food .amount{color:var(--food)!important}.ogl_dm,#resources_darkmatter,.resource.darkmatter{color:var(--dm)!important}.ogl_energy,#resources_energy,.resource.energy,resource-icon.energy .amount{color:var(--energy)!important}.ogl_population,#resources_population,.resource.population,resource-icon.population .amount{color:var(--population)!important}.ogl_artefact{color:var(--artefact)!important}[class*=ogl_lifeform]{color:var(--lifeform)!important}.ogl_msu{color:var(--msu)!important}.ogl_mission1{color:var(--mission1)!important}[data-mission-type="1"]:not(.fleetDetails) .detailsFleet{color:var(--mission1)!important}.ogl_mission2{color:var(--mission2)!important}[data-mission-type="2"]:not(.fleetDetails) .detailsFleet{color:var(--mission2)!important}.ogl_mission3{color:var(--mission3)!important}[data-mission-type="3"]:not(.fleetDetails) .detailsFleet{color:var(--mission3)!important}.ogl_mission4{color:var(--mission4)!important}[data-mission-type="4"]:not(.fleetDetails) .detailsFleet{color:var(--mission4)!important}.ogl_mission5{color:var(--mission5)!important}[data-mission-type="5"]:not(.fleetDetails) .detailsFleet{color:var(--mission5)!important}.ogl_mission6{color:var(--mission6)!important}[data-mission-type="6"]:not(.fleetDetails) .detailsFleet{color:var(--mission6)!important}.ogl_mission7{color:var(--mission7)!important}[data-mission-type="7"]:not(.fleetDetails) .detailsFleet{color:var(--mission7)!important}.ogl_mission8{color:var(--mission8)!important}[data-mission-type="8"]:not(.fleetDetails) .detailsFleet{color:var(--mission8)!important}.ogl_mission9{color:var(--mission9)!important}[data-mission-type="9"]:not(.fleetDetails) .detailsFleet{color:var(--mission9)!important}.ogl_mission10{color:var(--mission10)!important}[data-mission-type="10"]:not(.fleetDetails) .detailsFleet{color:var(--mission10)!important}.ogl_mission11{color:var(--mission11)!important}[data-mission-type="11"]:not(.fleetDetails) .detailsFleet{color:var(--mission11)!important}.ogl_mission12{color:var(--mission12)!important}[data-mission-type="12"]:not(.fleetDetails) .detailsFleet{color:var(--mission12)!important}.ogl_mission13{color:var(--mission13)!important}[data-mission-type="13"]:not(.fleetDetails) .detailsFleet{color:var(--mission13)!important}.ogl_mission14{color:var(--mission14)!important}[data-mission-type="14"]:not(.fleetDetails) .detailsFleet{color:var(--mission14)!important}.ogl_mission15{color:var(--mission15)!important}[data-mission-type="15"]:not(.fleetDetails) .detailsFleet{color:var(--mission15)!important}.ogl_mission17{color:var(--mission17)!important}[data-mission-type="17"]:not(.fleetDetails) .detailsFleet{color:var(--mission17)!important}.ogl_mission18{color:var(--mission18)!important}[data-mission-type="18"]:not(.fleetDetails) .detailsFleet{color:var(--mission18)!important}[data-mission-type]{background:#121b22!important}[data-mission-type] .detailsFleet span{filter:brightness(1.5)saturate(.8)}[data-mission-type="1"]{background:linear-gradient(90deg,#121b22,#482018,#121b22)!important}[data-mission-type="2"]{background:linear-gradient(90deg,#121b22,#54271f,#121b22)!important}[data-mission-type="3"]{background:linear-gradient(90deg,#121b22,#2a5d21,#121b22)!important}[data-mission-type="4"]{background:linear-gradient(90deg,#121b22,#104841,#121b22)!important}[data-mission-type="5"]{background:linear-gradient(90deg,#121b22,#643d25,#121b22)!important}[data-mission-type="6"]{background:linear-gradient(90deg,#121b22,#4c401f,#121b22)!important}[data-mission-type="7"]{background:linear-gradient(90deg,#121b22,#214350,#121b22)!important}[data-mission-type="8"]{background:linear-gradient(90deg,#121b22,#004011,#121b22)!important}[data-mission-type="9"]{background:linear-gradient(90deg,#121b22,#4a1b14,#121b22)!important}[data-mission-type="10"]{background:linear-gradient(90deg,#121b22,#3f4b54,#121b22)!important}[data-mission-type="15"]{background:linear-gradient(90deg,#121b22,#182542,#121b22)!important}[data-mission-type="17"]{background:linear-gradient(90deg,#121b22,#203642,#121b22)!important}[data-mission-type="18"]{background:linear-gradient(90deg,#121b22,#203642,#121b22)!important}.ogl_icon,.ogl_metal.ogl_icon,.ogl_crystal.ogl_icon,.ogl_deut.ogl_icon,.ogl_food.ogl_icon,.ogl_dm.ogl_icon,.ogl_energy.ogl_icon,.ogl_artefact.ogl_icon,.ogl_population.ogl_icon,.ogl_icon.ogl_msu{white-space:nowrap;-webkit-border-radius:3px;border-radius:3px;align-items:center;padding:3px;display:flex;position:relative}.ogl_icon[class*=ogl_1] .ogl_icon[class*=ogl_2]{white-space:nowrap;-webkit-border-radius:3px;border-radius:3px;align-items:center;padding:3px;display:flex;position:relative}.ogl_icon[class*=ogl_mission]{white-space:nowrap;-webkit-border-radius:3px;border-radius:3px;align-items:center;padding:3px;display:flex;position:relative}.ogl_icon[class*=ogl_lifeform]{white-space:nowrap;-webkit-border-radius:3px;border-radius:3px;align-items:center;padding:3px;display:flex;position:relative}.ogl_metal.ogl_icon:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_crystal.ogl_icon:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_deut.ogl_icon:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_food.ogl_icon:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_dm.ogl_icon:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_energy.ogl_icon:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_artefact.ogl_icon:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_icon.ogl_population:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_icon.ogl_msu:before{content:"";height:18px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png);background-size:302px;-webkit-border-radius:3px;border-radius:3px;width:28px;margin-right:10px;display:inline-block}.ogl_icon.ogl_metal:before{background-position:1% 11%}.ogl_icon.ogl_crystal:before{background-position:16% 11%}.ogl_icon.ogl_deut:before{background-position:30% 11%}.ogl_icon.ogl_dm:before{background-position:57% 11%}.ogl_icon.ogl_energy:before{background-position:43% 11%}.ogl_icon.ogl_food:before{background-position:85% 11%}.ogl_icon.ogl_population:before{background-position:98% 11%}.ogl_icon.ogl_artefact:before{background-image:url(https://image.board.gameforge.com/uploads/ogame/fr/announcement_ogame_fr_59cb6f773531d4ad73e508c140cd2d3c.png);background-size:28px}.ogl_icon.ogl_plus:after{color:#fff;content:"+";background:linear-gradient(164deg,#434343,#838383);-webkit-border-radius:3px;border-radius:3px;justify-content:center;align-items:center;width:12px;height:12px;font-size:10px;font-weight:700;display:flex;position:absolute;top:3px;left:15px;box-shadow:-1px 2px 3px #000}:is(.ogl_miniStats,.ogl_recap,.ogl_stats,.ogl_todoList) .ogl_icon.ogl_metal:before{image-rendering:auto;background-image:url(https://gf2.geo.gfsrv.net/cdn1c/4230ff01e100a38a72dadfa7de0661.png);background-size:28px}:is(.ogl_miniStats,.ogl_recap,.ogl_stats,.ogl_todoList) .ogl_icon.ogl_crystal:before{image-rendering:auto;background-image:url(https://gf1.geo.gfsrv.net/cdn65/596ba85baa74145390e04f7428d93e.png);background-size:28px}:is(.ogl_miniStats,.ogl_recap,.ogl_stats,.ogl_todoList) .ogl_icon.ogl_deut:before{image-rendering:auto;background-image:url(https://gf1.geo.gfsrv.net/cdnc0/7a7bf2b8edcd74ebafe31dfbae14aa.png);background-size:28px}:is(.ogl_miniStats,.ogl_recap,.ogl_stats,.ogl_todoList) .ogl_icon.ogl_dm:before{filter:hue-rotate(40deg)saturate();image-rendering:auto;background-image:url(https://gf2.geo.gfsrv.net/cdna3/4de426cb95e11af9cdabb901dfe802.png);background-size:28px}:is(.ogl_miniStats,.ogl_recap,.ogl_stats,.ogl_todoList) .ogl_icon.ogl_artefact:before{filter:hue-rotate(200deg)saturate(4);image-rendering:auto;background-image:url(https://gf1.geo.gfsrv.net/cdn65/596ba85baa74145390e04f7428d93e.png);background-size:28px;transform:scaleX(-1)}.ogl_icon[class*=ogl_1]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon[class*=ogl_2]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon[class*=ogl_3]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon[class*=ogl_4]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon[class*=ogl_5]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon[class*=ogl_6]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon[class*=ogl_7]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon[class*=ogl_8]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon[class*=ogl_9]:before{content:"";image-rendering:auto;vertical-align:text-bottom;background-position:50%;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:5px;display:inline-block}.ogl_icon.ogl_200:before{content:"close";text-align:center;background:linear-gradient(45deg,#784242,#dd4242);font-family:Material Icons;line-height:18px}.ogl_icon.ogl_1:before{background-image:url(https://gf2.geo.gfsrv.net/cdn74/696be2632de1977d0bd923e05d37b0.jpg)}.ogl_icon.ogl_2:before{background-image:url(https://gf3.geo.gfsrv.net/cdn21/6468ceef42917eea7b76f72dd3b70a.jpg)}.ogl_icon.ogl_3:before{background-image:url(https://gf1.geo.gfsrv.net/cdn97/f208f485246b04abc54cb9a229fff7.jpg)}.ogl_icon.ogl_4:before{background-image:url(https://gf2.geo.gfsrv.net/cdn70/6ae8432102c9b802ec4eec6917e020.jpg)}.ogl_icon.ogl_12:before{background-image:url(https://gf2.geo.gfsrv.net/cdn79/42f8c414d245b04a0104f411958dde.jpg)}.ogl_icon.ogl_14:before{background-image:url(https://gf3.geo.gfsrv.net/cdn21/034ea2b2e9d16eb350116cb1391a8f.jpg)}.ogl_icon.ogl_15:before{background-image:url(https://gf1.geo.gfsrv.net/cdn93/203bf2febc6a24812457f1611621c5.jpg)}.ogl_icon.ogl_21:before{background-image:url(https://gf3.geo.gfsrv.net/cdn83/8443bf78a6cbe448f68c791f3532f6.jpg)}.ogl_icon.ogl_22:before{background-image:url(https://gf3.geo.gfsrv.net/cdn8c/472a30155cdad9776b319a6590099c.jpg)}.ogl_icon.ogl_23:before{background-image:url(https://gf3.geo.gfsrv.net/cdnb3/c95c16f22b5a2c6ced74bcf32f3932.jpg)}.ogl_icon.ogl_24:before{background-image:url(https://gf2.geo.gfsrv.net/cdn70/6fb935649c27645d709977ad47cb98.jpg)}.ogl_icon.ogl_31:before{background-image:url(https://gf3.geo.gfsrv.net/cdn24/81c2103d9ae1d22abb23dddd4e45cc.jpg)}.ogl_icon.ogl_33:before{background-image:url(https://gf3.geo.gfsrv.net/cdn8c/162541a8e2df809b2d8655334157b1.jpg)}.ogl_icon.ogl_34:before{background-image:url(https://gf3.geo.gfsrv.net/cdn88/8cdbff7898af1160195944b20feed7.jpg)}.ogl_icon.ogl_36:before{background-image:url(https://gf2.geo.gfsrv.net/cdn14/3ab386e1e6bedbcf263197fe268bf2.jpg)}.ogl_icon.ogl_41:before{background-image:url(https://gf1.geo.gfsrv.net/cdn65/94b9b8a961d01b3dff6cc8d1962031.jpg)}.ogl_icon.ogl_42:before{background-image:url(https://gf1.geo.gfsrv.net/cdn03/47840e9f771909ba356a6384799005.jpg)}.ogl_icon.ogl_43:before{background-image:url(https://gf2.geo.gfsrv.net/cdnda/f5b003cb40143133188be46600b0a7.jpg)}.ogl_icon.ogl_44:before{background-image:url(https://gf2.geo.gfsrv.net/cdnd7/99d1eeb073c2654140cd353677881e.jpg)}.ogl_icon.ogl_109:before{background-image:url(https://gf2.geo.gfsrv.net/cdna7/d6e7869f6b8150c44e275e38c0b27c.jpg)}.ogl_icon.ogl_110:before{background-image:url(https://gf1.geo.gfsrv.net/cdn9d/96f4ec3ea10b15523591efb7d1c5f7.jpg)}.ogl_icon.ogl_111:before{background-image:url(https://gf3.geo.gfsrv.net/cdnb3/8bcbf1b317ff5c97b969b69e6ffb11.jpg)}.ogl_icon.ogl_115:before{background-image:url(https://gf2.geo.gfsrv.net/cdnd5/5c1c1ea00023c4552489d9d13c8944.jpg)}.ogl_icon.ogl_117:before{background-image:url(https://gf1.geo.gfsrv.net/cdn62/f5755473fdb7dc5fafa863a6f3507a.jpg)}.ogl_icon.ogl_118:before{background-image:url(https://gf2.geo.gfsrv.net/cdn78/6bba453cc20b677b268a1160f23cc1.jpg)}.ogl_icon.ogl_113:before{background-image:url(https://gf2.geo.gfsrv.net/cdn77/6f71772b30c8f00b94a6888cd6846b.jpg)}.ogl_icon.ogl_122:before{background-image:url(https://gf1.geo.gfsrv.net/cdncf/34a78ce2f7f4ad15de745ade2a96ec.jpg)}.ogl_icon.ogl_124:before{background-image:url(https://gf3.geo.gfsrv.net/cdnb1/148d695e299644aacdd2ef9149db0d.jpg)}.ogl_icon.ogl_202:before{background-image:url(https://gf2.geo.gfsrv.net/cdnd9/60555c3c87b9eb3b5ddf76780b5712.jpg)}.ogl_icon.ogl_203:before{background-image:url(https://gf1.geo.gfsrv.net/cdn34/fdbcc505474e3e108d10a3ed4a19f4.jpg)}.ogl_icon.ogl_204:before{background-image:url(https://gf2.geo.gfsrv.net/cdnd2/9ed5c1b6aea28fa51f84cdb8cb1e7e.jpg)}.ogl_icon.ogl_205:before{background-image:url(https://gf1.geo.gfsrv.net/cdnf1/8266a2cbae5ad630c5fedbdf270f3e.jpg)}.ogl_icon.ogl_206:before{background-image:url(https://gf2.geo.gfsrv.net/cdn45/b7ee4f9d556a0f39dae8d2133e05b7.jpg)}.ogl_icon.ogl_207:before{background-image:url(https://gf1.geo.gfsrv.net/cdn32/3f4a081f4d15662bed33473db53d5b.jpg)}.ogl_icon.ogl_208:before{background-image:url(https://gf1.geo.gfsrv.net/cdn6f/41a21e4253d2231f8937ddef1ba43e.jpg)}.ogl_icon.ogl_209:before{background-image:url(https://gf1.geo.gfsrv.net/cdn07/6246eb3d7fa67414f6b818fa79dd9b.jpg)}.ogl_icon.ogl_210:before{background-image:url(https://gf3.geo.gfsrv.net/cdnb5/347821e80cafc52aec04f27c3a2a4d.jpg)}.ogl_icon.ogl_211:before{background-image:url(https://gf1.geo.gfsrv.net/cdnca/4d55a520aed09d0c43e7b962f33e27.jpg)}.ogl_icon.ogl_213:before{background-image:url(https://gf3.geo.gfsrv.net/cdn2a/c2b9fedc9c93ef22f2739c49fbac52.jpg)}.ogl_icon.ogl_214:before{background-image:url(https://gf3.geo.gfsrv.net/cdn84/155e9e24fc1d34ed4660de8d428f45.jpg)}.ogl_icon.ogl_215:before{background-image:url(https://gf3.geo.gfsrv.net/cdn5a/24f511ec14a71e2d83fd750aa0dee2.jpg)}.ogl_icon.ogl_217:before{background-image:url(https://gf3.geo.gfsrv.net/cdn26/28e8d79a5b489dc795cc47f3adf165.jpg)}.ogl_icon.ogl_218:before{background-image:url(https://gf1.geo.gfsrv.net/cdn39/12d016c8bb0d71e053b901560c17cc.jpg)}.ogl_icon.ogl_219:before{background-image:url(https://gf3.geo.gfsrv.net/cdne2/b8d8d18f2baf674acedb7504c7cc83.jpg)}.ogl_icon.ogl_401:before{background-image:url(https://gf2.geo.gfsrv.net/cdnaf/b5d139528cdf1233e61bd58184e1c5.jpg)}.ogl_icon.ogl_402:before{background-image:url(https://gf2.geo.gfsrv.net/cdn7d/34b3f95bf2d4e3355fed09a3e1877e.jpg)}.ogl_icon.ogl_403:before{background-image:url(https://gf2.geo.gfsrv.net/cdnd4/9d88c2d9b8e5872bef32a7f8659695.jpg)}.ogl_icon.ogl_404:before{background-image:url(https://gf3.geo.gfsrv.net/cdn2c/0fc6c29d06858b5b9ca0b0a4d1532e.jpg)}.ogl_icon.ogl_405:before{background-image:url(https://gf2.geo.gfsrv.net/cdn11/4dd51eeb4ab03af617828169bffd5b.jpg)}.ogl_icon.ogl_406:before{background-image:url(https://gf1.geo.gfsrv.net/cdn07/ea3e0adf01fb3cf64e1938a7c55dfb.jpg)}.ogl_icon.ogl_407:before{background-image:url(https://gf2.geo.gfsrv.net/cdna9/4d20894a828929ff5a61f62c757149.jpg)}.ogl_icon.ogl_408:before{background-image:url(https://gf2.geo.gfsrv.net/cdnda/533c32ff26f4db6857e3e41c09d443.jpg)}.ogl_icon.ogl_502:before{background-image:url(https://gf2.geo.gfsrv.net/cdn7a/40a392214240328e42014108815526.jpg)}.ogl_icon[class*=ogl_mission]:before{content:"";vertical-align:middle;background-image:url(https://gf2.geo.gfsrv.net/cdn14/f45a18b5e55d2d38e7bdc3151b1fee.jpg);background-position:0 0;-webkit-border-radius:3px;border-radius:3px;width:28px;height:18px;margin-right:10px;display:inline-block;background-size:344px!important}.ogl_icon.ogl_mission1:before{background-position:80.05% 0!important}.ogl_icon.ogl_mission2:before{background-position:99.7% 0!important}.ogl_icon.ogl_mission3:before{background-position:50% 0!important}.ogl_icon.ogl_mission4:before{background-position:30% 0!important}.ogl_icon.ogl_mission5:before{background-position:69.5% 0!important}.ogl_icon.ogl_mission6:before{background-position:59.75% 0!important}.ogl_icon.ogl_mission7:before{background-position:20.75% 0!important}.ogl_icon.ogl_mission8:before{background-position:40.1% 0!important}.ogl_icon.ogl_mission9:before{background-position:89% 0!important}.ogl_icon.ogl_mission15:before{background-position:.2% 0!important}.ogl_icon.ogl_mission18:before{background:url(https://gf2.geo.gfsrv.net/cdna8/1fc8d15445e97c10c7b6881bccabb2.gif);background-size:18px!important}.ogl_lifeform0.ogl_icon:before{content:"-"}.ogl_lifeform1.ogl_icon:before{content:"";height:24px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf2.geo.gfsrv.net/cdna5/5681003b4f1fcb30edc5d0e62382a2.png);background-size:245px;width:24px;display:inline-block}.ogl_lifeform2.ogl_icon:before{content:"";height:24px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf2.geo.gfsrv.net/cdna5/5681003b4f1fcb30edc5d0e62382a2.png);background-size:245px;width:24px;display:inline-block}.ogl_lifeform3.ogl_icon:before{content:"";height:24px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf2.geo.gfsrv.net/cdna5/5681003b4f1fcb30edc5d0e62382a2.png);background-size:245px;width:24px;display:inline-block}.ogl_lifeform4.ogl_icon:before{content:"";height:24px;image-rendering:pixelated;vertical-align:middle;background-image:url(https://gf2.geo.gfsrv.net/cdna5/5681003b4f1fcb30edc5d0e62382a2.png);background-size:245px;width:24px;display:inline-block}.ogl_icon.ogl_lifeform0:before{background-position:1% 11%}.ogl_icon.ogl_lifeform1:before{background-position:0 86%}.ogl_icon.ogl_lifeform2:before{background-position:11% 86%}.ogl_icon.ogl_lifeform3:before{background-position:22% 86%}.ogl_icon.ogl_lifeform4:before{background-position:33% 86%}.ogl_icon.ogl_msu:before{color:#fff;content:"MSU";background:0 0;justify-content:center;align-items:center;font-size:11px;display:flex}.ogl_gridIcon .ogl_icon{grid-gap:7px;text-align:center;justify-content:center;padding-top:6px;display:grid}.ogl_gridIcon .ogl_icon:before{margin:auto}.ogl_header{color:#6f9fc8;text-align:center;height:27px;font-size:11px;font-weight:700;line-height:27px;position:relative}.ogl_header .material-icons{font-size:17px!important;line-height:28px!important}.ogl_button,a.ogl_button{cursor:pointer;text-align:center;text-shadow:1px 1px #000;user-select:none;background:linear-gradient(#405064,#2d3743 2px,#181e25);border:1px solid #17191c;-webkit-border-radius:3px;border-radius:3px;padding:0 4px;text-decoration:none;display:inline-block;color:#b7c1c9!important;line-height:26px!important}.ogl_button:hover{color:var(--ogl)!important}.ogl_invisible{visibility:hidden}.ogl_hidden{display:none!important}.ogl_reversed{transform:scaleX(-1)}.ogl_blocCenter{margin:auto}.ogl_textCenter{text-align:center;justify-content:center}.ogl_textRight{text-align:right;justify-content:end}.ogl_disabled{color:rgba(255,255,255,.2);opacity:.5;pointer-events:none;user-select:none}.ogl_interactive{cursor:pointer}.ogl_noTouch{pointer-events:none!important}.ogl_slidingText{grid-gap:20px;white-space:nowrap;width:100%;position:relative;overflow:hidden;display:inline-flex!important}.ogl_slidingText:before{content:attr(data-text);animation:6s linear infinite textSlideLeft}.ogl_slidingText:after{content:attr(data-text);animation:6s linear infinite textSlideLeft}@keyframes textSlideLeft{0%{transform:translate(20px)}to{transform:translate(-100%)}}[data-status=pending]{pointer-events:none;color:orange!important}[data-status=done]{color:green!important}time{color:var(--time)}time span{color:var(--date)}.menubutton.ogl_active .textlabel{color:#75ffcc!important}#productionboxBottom time{text-align:center;margin-top:10px;font-size:11px}[data-output-time]{user-select:none;white-space:nowrap;grid-template-columns:auto 6px auto;position:relative;overflow:hidden;color:transparent!important;display:inline-grid!important}[data-output-date]{user-select:none;white-space:nowrap;grid-template-columns:auto 6px auto;position:relative;overflow:hidden;color:transparent!important;display:inline-grid!important}[data-output-time]:not([data-output-date]){grid-template-columns:0 auto}[data-output-time] span{display:none}[data-output-date] span{display:none}[data-output-date]:before{color:var(--date);content:attr(data-output-date)}[data-output-time]:after{color:var(--time);content:attr(data-output-time)}[data-output-time=Invalid\ Date]{display:none!important}.honorRank.rank_0,.honorRank.rank_undefined{display:none}[data-galaxy]{color:#c3c3c3;cursor:pointer}[data-galaxy]:hover{color:#fff;text-decoration:underline}[data-galaxy].ogl_active{color:#c3c3c3;box-shadow:inset 0 0 0 2px rgba(255,165,0,.2)}.galaxyCell.cellPlayerName.ogl_active{box-shadow:inset 0 0 0 2px rgba(255,165,0,.2)}.ogl_tooltip{box-sizing:border-box;opacity:0;pointer-events:none;z-index:1000002;-webkit-border-radius:4px;border-radius:4px;padding:10px;font-size:11px;position:absolute;top:0;left:0}.ogl_tooltip:not(:has(.ogl_close)){pointer-events:none!important}.ogl_tooltip:before{-webkit-border-radius:inherit;border-radius:inherit;content:"";position:absolute;top:10px;bottom:10px;left:10px;right:10px;box-shadow:0 0 15px 5px rgba(0,0,0,.6),0 0 4px 1px rgba(0,0,0,.7)}.ogl_tooltip .ogl_tooltipTriangle{pointer-events:none;background:#171c24;width:15px;height:15px;position:absolute;box-shadow:0 0 15px 5px rgba(0,0,0,.6),0 0 4px 1px rgba(0,0,0,.7)}.ogl_tooltip[data-direction=top] .ogl_tooltipTriangle{transform:translate(50%,-50%)rotate(45deg)}.ogl_tooltip[data-direction=bottom] .ogl_tooltipTriangle{background:#293746;transform:translate(50%,50%)rotate(45deg)}.ogl_tooltip[data-direction=left] .ogl_tooltipTriangle{transform:translate(-50%,50%)rotate(45deg)}.ogl_tooltip[data-direction=right] .ogl_tooltipTriangle{transform:translate(50%,50%)rotate(45deg)}.ogl_tooltip .ogl_close{color:#fff;cursor:pointer;z-index:1000004;background:#7c3434;-webkit-border-radius:4px;border-radius:4px;justify-content:center;align-items:center;width:22px;height:22px;position:absolute;top:0;right:0;box-shadow:0 0 8px rgba(0,0,0,.6);font-size:16px!important;display:flex!important}.ogl_tooltip .ogl_close:hover{background:#9f3d3d}.ogl_tooltip.ogl_active{animation-fill-mode:forwards!important}.ogl_tooltip[data-direction=top].ogl_active{animation:.1s appearTop}@keyframes appearTop{0%{opacity:0;margin-top:20px}to{opacity:1;margin-top:0}99%{pointer-events:none}to{pointer-events:all}}.ogl_tooltip[data-direction=bottom].ogl_active{animation:.1s appearBottom}@keyframes appearBottom{0%{opacity:0;margin-top:-20px}to{opacity:1;margin-top:0}99%{pointer-events:none}to{pointer-events:all}}.ogl_tooltip[data-direction=left].ogl_active{animation:.1s appearLeft}@keyframes appearLeft{0%{opacity:0;margin-left:20px}to{opacity:1;margin-left:0}99%{pointer-events:none}to{pointer-events:all}}.ogl_tooltip[data-direction=right].ogl_active{animation:.1s appearRight}@keyframes appearRight{0%{opacity:0;margin-left:-20px}to{opacity:1;margin-left:0}99%{pointer-events:none}to{pointer-events:all}}.ogl_tooltip hr,.ogl_notification hr{background:#1e252e;border:none;grid-column:1/-1;width:100%;height:2px}.ogl_tooltip>div:not(.ogl_tooltipTriangle):not(.ogl_close){background:var(--tertiary);-webkit-border-radius:inherit;border-radius:inherit;z-index:1000003;max-width:400px;max-height:90vh;padding:16px 20px;line-height:1.25;position:relative;overflow-x:hidden;overflow-y:auto;display:block!important}.ogl_tooltip .ogl_colorpicker{grid-gap:3px;grid-template-rows:repeat(5,1fr);grid-auto-flow:column;display:grid!important}[class*=tooltip]{user-select:none!important}[class*=tooltip] input{box-sizing:border-box;max-width:100%}.ogl_colorpicker>div{box-sizing:border-box;cursor:pointer;-webkit-border-radius:50%;border-radius:50%;width:24px;height:24px}.ogl_planetIcon,.ogl_moonIcon,.ogl_flagIcon,.ogl_searchIcon,.ogl_pinIcon,.ogl_fleetIcon{text-align:center!important;vertical-align:text-top!important;font-style:normal!important;display:inline-block!important}.ogl_planetIcon:before{font-family:Material Icons;font-size:20px!important}.ogl_moonIcon:before{font-family:Material Icons;font-size:20px!important}.ogl_flagIcon:before{font-family:Material Icons;font-size:20px!important}.ogl_searchIcon:before{font-family:Material Icons;font-size:20px!important}.ogl_pinIcon:before{font-family:Material Icons;font-size:20px!important}.ogl_fleetIcon:before{font-family:Material Icons;font-size:20px!important}.ogl_planetIcon:before{content:"language"}.ogl_moonIcon:before{content:"bedtime"}.ogl_flagIcon:before{content:"flag"}.ogl_pinIcon:before{content:"keep"}.ogl_searchIcon:before{content:"search"}.ogl_fleetIcon:before{content:"send"}#bar{grid-gap:20px!important;line-height:17px!important}#bar li{list-style:none!important}#fleet1 .content{padding-top:16px!important;padding-bottom:30px!important}#fleet1 .ogl_shipFlag{box-sizing:border-box;grid-gap:4px;text-align:center;background:linear-gradient(#0d1014 30%,transparent);justify-content:space-evenly;width:100%;padding:0 10px;display:flex;position:absolute;top:0;right:0}#fleet1 .ogl_shipFlag>*{color:#b1c2cb;text-shadow:1px 2px #000;width:20px;display:block;position:relative;top:-4px;font-size:16px!important;line-height:14px!important}#fleet1 .ogl_shipFlag>:hover{color:#fff}#fleet1 .ogl_fav:not(.ogl_grayed){color:var(--yellow)}#fleet1 .ogl_shipLock:not(.ogl_grayed){color:var(--red)}#fleet1 .ogl_shipLock,#fleet1 .ogl_reverse{font-size:14px!important}#fleet1 progress{appearance:none;z-index:10;background:var(--capacity);border:0;width:655px;height:5px;display:block;position:absolute;bottom:-5px;left:5px}#fleet1 .capacityProgress{position:relative}#fleet1 .capacityProgress:before{content:attr(data-rawCargo);text-align:center;background:#0c1014;-webkit-border-radius:0 0 5px 5px;border-radius:0 0 5px 5px;width:658px;padding:6px 0;font-size:11px;display:inline-block;position:absolute;top:5px;left:3px}#fleet1 .capacityProgress:after{content:attr(data-percentResources)"%";left:var(--currentCapacityPercent);text-shadow:2px 2px 1px #000;font-size:10px;transition:left .5s;display:block;position:absolute;top:-14px;transform:translate(5px)}#fleet1 progress::-webkit-progress-value{backdrop-filter:brightness(1.8);background:rgba(255,255,255,.1);transition:width .5s;box-shadow:5px 0 10px #000}#fleet1 progress::-moz-progress-bar{backdrop-filter:brightness(1.8);background:rgba(255,255,255,.1);transition:width .5s;box-shadow:5px 0 10px #000}.ogl_requiredShips{user-select:none;justify-content:center;align-items:center;width:80px;display:grid}#warning .ogl_requiredShips{grid-gap:28px;width:100%;display:flex}.ogl_requiredShips .ogl_notEnough{color:var(--red);filter:none}.ogl_required{white-space:nowrap;background:linear-gradient(145deg,#000,transparent);-webkit-border-radius:3px;border-radius:3px;font-size:10px;overflow:hidden;padding:0!important}.ogl_required:before{vertical-align:middle!important}.ogl_required:hover{box-shadow:0 0 0 2px var(--ogl)}.ogl_maxShip{box-sizing:border-box;color:var(--red);cursor:pointer;text-align:right;user-select:none;background:#3c1a1a;-webkit-border-radius:0;border-radius:0;height:14px;padding:0 5px;font-size:10px;line-height:14px;position:absolute;bottom:19px;left:2px;right:2px}.ogl_maxShip:hover{box-shadow:0 0 0 2px var(--ogl)}.resourceIcon .ogl_maxShip{bottom:0}.ogl_limiterLabel{background:var(--secondary);cursor:pointer;grid-gap:5px;user-select:none;-webkit-border-radius:3px;border-radius:3px;align-items:center;height:28px;padding:0 9px;display:inline-flex}.ogl_limiterGroup{background:var(--secondary);user-select:none;-webkit-border-radius:3px;border-radius:3px;align-items:center;height:28px;margin-left:auto;padding:0 9px;display:inline-flex}.ogl_limiterGroup>i{margin:0 5px}.ogl_limiterGroup .ogl_icon:first-child{margin-left:5px}.ogl_limiterGroup .ogl_icon:before{margin-right:0}.ogl_limiterGroup .ogl_icon:hover{cursor:pointer}.ogl_limiterGroup .ogl_icon:hover:before{box-shadow:0 0 0 2px var(--ogl)}.ogl_limiterGroup .ogl_icon.ogl_active:before{box-shadow:0 0 0 2px #fff}.ogl_limiterGroup:has(.ogl_active:not(.ogl_200)){box-shadow:0 0 0 2px var(--red)}#fleet2 #fleetBriefingPart1 li{margin-bottom:1px!important}#fleet2[data-selected-mission="4"] .ogl_return{opacity:.6}#fleet2 #buttonz .header,#fleet2 #buttonz .footer,#fleet2 .c-left,#fleet2 .c-right{display:none!important}#fleet2 #buttonz .content{margin:0!important;padding:2px 0!important}#fleet2 #resources.lifeforms-enabled{height:216px!important}#fleet2 #buttonz div.move-box{top:-1px!important;right:7px!important}#fleet2 #buttonz ul#missions{height:auto!important}#fleet2 #buttonz ul li span{min-width:122px!important;height:12px!important}#fleet2 #mission{margin:auto!important}#fleet2 div#mission .percentageBarWrapper{margin-top:10px}#fleet1 .ajax_loading_indicator,#fleet2 .ajax_loading_indicator{transform:scale(.5)}#speedPercentage{float:none!important;margin:auto!important}.percentageBar .steps .step:not(.selected){line-height:20px!important}#speedPercentage .bar{pointer-events:none}.technology.ogl_active .icon{border:2px solid #36d7e7!important}.technology.ogl_active .icon:before{content:"";pointer-events:none;z-index:0;background-color:rgba(54,215,231,.25);position:absolute;top:0;bottom:0;left:0;right:0}.technology input[type=number]{box-shadow:none!important;background:#98b2bf!important;border:none!important;-webkit-border-radius:2px!important;border-radius:2px!important;height:20px!important;bottom:-20px!important}.technology input[type=text]{box-shadow:none!important;background:#98b2bf!important;border:none!important;-webkit-border-radius:2px!important;border-radius:2px!important;height:20px!important;bottom:-20px!important}.ogl_notEnough{filter:sepia()hue-rotate(300deg)}.technology.ogl_notEnough{filter:none}.technology.ogl_notEnough .icon{filter:grayscale()brightness(.5)}.technology.ogl_notEnough input{cursor:not-allowed!important;background:#525556!important}.technology input.ogl_flashNotEnough{background:#cf7e7e!important}.technology:hover{z-index:2}.technology .icon{position:relative;-webkit-border-radius:0!important;border-radius:0!important;box-shadow:0 0 0 1px #000!important}.technology .icon>*{z-index:1;position:relative}.technology[data-status=active] .icon{box-shadow:0 0 5px 2px var(--ogl)}.technology.showsDetails .icon{border:2px solid var(--ogl)!important}.technology .icon:hover{border:2px solid var(--ogl)!important}.technology .icon .upgrade{-webkit-border-radius:0!important;border-radius:0!important;box-shadow:0 0 6px rgba(0,0,0,.8)!important}.technology .icon .upgrade:after{border-color:transparent transparent currentColor!important}.technology .icon .level,.technology .icon .amount{background:var(--primary)!important;-webkit-border-radius:0!important;border-radius:0!important}#technologydetails h3,#technologydetails .level,#technologydetails .amount{color:var(--ogl)!important}#fleetdispatchcomponent #allornone{width:654px!important;padding:0!important;left:5px!important}#fleetdispatchcomponent .allornonewrap{box-sizing:border-box;align-items:center;display:flex;background:0 0!important;border:none!important;width:100%!important;padding:24px 9px 15px!important}#fleetdispatchcomponent .allornonewrap>div:not(.clearfloat){margin-right:4px!important}#fleet1 .allornonewrap .firstcol{display:grid;grid-gap:5px!important;justify-content:space-between!important;width:auto!important}#fleetdispatchcomponent #continueToFleet2{margin-left:auto}#fleetdispatchcomponent #allornone .info{display:none}#fleetdispatchcomponent #buttonz #battleships{width:408px!important}#fleetdispatchcomponent #buttonz #civilships{width:254px!important}#fleetdispatchcomponent #buttonz #battleships ul,#fleetdispatchcomponent #buttonz #civilships ul{padding:0!important}#fleetdispatchcomponent #buttonz #battleships ul{margin-left:8px!important}#fleetdispatchcomponent #buttonz #battleships .header,#fleetdispatchcomponent #buttonz #civilships .header{display:none!important}#fleetdispatchcomponent #buttonz #battleships .header{border-right:1px solid #000;-webkit-border-radius:0 3px 3px 0;border-radius:0 3px 3px 0}#fleetdispatchcomponent #buttonz #civilships .header{border-left:1px solid #000;-webkit-border-radius:3px 0 0 3px;border-radius:3px 0 0 3px}#fleetdispatchcomponent .resourceIcon{cursor:default;position:relative}#fleetdispatchcomponent .ogl_keepRecap{box-sizing:border-box;color:#f45757;text-align:right;background:#4c1b1b;width:100%;padding-right:5px;font-size:10px;position:absolute;bottom:0}#fleetdispatchcomponent fieldset,#jumpgate fieldset{box-sizing:border-box;color:#fff;grid-gap:10px;background:#0c1014;-webkit-border-radius:3px;border-radius:3px;width:656px;margin:10px 5px 5px;padding:12px;display:flex}#jumpgate fieldset{width:625px}#fleetdispatchcomponent fieldset legend,#jumpgate fieldset legend{color:#6f9fc8}#fleetdispatchcomponent .resourceIcon{box-shadow:inset -8px 7px 10px rgba(0,0,0,.5)}#allornone .secondcol{grid-gap:4px;align-items:center;background:0 0!important;border:none!important;width:auto!important;padding:5px!important;display:inline-flex!important}#allornone .secondcol .clearfloat{display:none!important}#allornone .secondcol .ogl_icon:not(.ogl_icon .ogl_icon):before{width:31px;height:31px;box-shadow:inset 0 0 1px 1px #000}#allornone .secondcol .ogl_icon:before{margin:0}#allornone .secondcol .ogl_icon .ogl_icon:before{-webkit-border-radius:10px 10px 10px 0;border-radius:10px 10px 10px 0;width:18px;box-shadow:0 0 0 2px #345eb4,0 0 2px 4px rgba(0,0,0,.7)}#allornone .secondcol .ogl_icon{cursor:pointer;padding:0;position:relative}#allornone .secondcol .ogl_icon .ogl_icon{position:absolute;top:-5px;right:-4px;transform:scale(.8)}#resetall,#sendall{-webkit-border-radius:3px;border-radius:3px;overflow:hidden;transform:scale(.97)}#galaxyLoading:after{content:attr(data-currentposition);background:rgba(0,0,0,.7);-webkit-border-radius:8px;border-radius:8px;padding:5px;font-size:13px;font-weight:700;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}#headerbarcomponent{width:1045px!important}#commandercomponent{transform:translate(48px)}#bar .OGameClock{grid-gap:0!important;width:auto!important;margin:0!important}#bar #headerBarLinks{gap:18px!important}#box,#standalonepage #mainContent{width:100%!important}#top{background-repeat:no-repeat}@property --round{syntax:"<percentage>";inherits:false;initial-value:-50%}[data-group]:before{--round:-50%;content:"";height:calc(100% - 1px);transform:translate(-100%,round(down,-50%,1px));transform:translate(-100%,var(--round));z-index:2;border:2px solid #fff;border-right:none;width:3px;position:absolute;top:0;left:0}[data-group="1"]:before{border-color:#3f51b5}[data-group="2"]:before{border-color:#2196f3}[data-group="3"]:before{border-color:#009688}[data-group="4"]:before{border-color:#43a047}[data-group="5"]:before{border-color:#7cb342}[data-group="6"]:before{border-color:#fdd835}[data-group="7"]:before{border-color:#fb8c00}[data-group="8"]:before{border-color:#e53935}[data-group="9"]:before{border-color:#ec407a}[data-group="10"]:before{border-color:#5e35b1}[data-group="11"]:before{border-color:#795548}[data-group="12"]:before{border-color:#607d8b}.planetBarSpaceObjectContainer{margin:0!important;top:0!important;left:0!important}.planetBarSpaceObjectHighlightContainer{width:0!important;height:0!important;display:none!important}div#bannerSkyscrapercomponent{margin-left:300px!important}#planetbarcomponent #myPlanets,#planetbarcomponent #myWorlds{width:192px!important}#planetbarcomponent #countColonies{display:none}#planetbarcomponent #rechts{margin-top:-50px!important}.ogl_topbar{background:var(--tertiary);z-index:11;-webkit-border-radius:3px;border-radius:3px;align-content:space-evenly;justify-content:space-evenly;align-items:center;height:30px;margin-bottom:3px;display:flex;position:relative;box-shadow:0 0 20px -5px #000,0 0 0 1px #17191c}.ogl_topbar i,.ogl_topbar a{text-decoration:none;color:#737ca9!important;font-size:17px!important}.ogl_topbar .ogl_active{animation:1s infinite spin}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(-360deg)}}.ogl_topbar>:first-child:hover{color:#dbc453!important}.ogl_topbar>:nth-child(2):hover{color:#4bbbd5!important}.ogl_topbar>:nth-child(3):hover{color:#e17171!important}.ogl_topbar>:nth-child(4):hover{color:#76d19a!important}.ogl_topbar>:nth-child(5):hover{color:#a1aac9!important}.ogl_topbar>:nth-child(6):hover{color:#fd7db8!important}.ogl_topbar>:nth-child(7):hover{color:#fff!important}.ogl_topbar .ogl_button{white-space:nowrap;z-index:10000000;border:none;width:80%;height:80%;display:none;position:absolute;top:9%;right:2%;box-shadow:-5px 0 8px rgba(0,0,0,.65),inset 0 0 15px rgba(99,125,159,.39)}.ogl_initHarvest .ogl_topbar .ogl_button{display:block}#planetList{box-shadow:none;grid-gap:2px;background:#0a121a;-webkit-border-radius:5px;border-radius:5px;padding:2px;display:grid;position:relative}.smallplanet{grid-gap:3px;grid-template-columns:68% 30%;display:grid;width:100%!important;height:46px!important;margin:0!important}.planetlink,.moonlink{box-sizing:border-box;background:linear-gradient(45deg,#29334b,#0f121c);-webkit-border-radius:4px;border-radius:4px;background-position:0!important;height:100%!important;position:relative!important;top:0!important;left:0!important;overflow:hidden!important}.planetlink.ogl_attacked,.moonlink.ogl_attacked{box-shadow:inset 0 6px 17px rgba(90,124,153,.22),0 0 12px -1px rgba(0,0,0,.98),inset 0 0 12px #e00000}.planetlink.active,.moonlink.active{background:linear-gradient(45deg,#374fc5,#14141e 80%)}body.ogl_destinationPicker .planetlink.active,body.ogl_destinationPicker .moonlink.active{opacity:.3;pointer-events:none;background:#05050a}.planetlink:hover{background:linear-gradient(45deg,#5d5da3,#14141e 80%)}.moonlink:hover{background:linear-gradient(45deg,#5d5da3,#14141e 80%)}.planetlink.ogl_currentDestination,.moonlink.ogl_currentDestination{background:linear-gradient(45deg,#ffc107,#14141e 80%)}.ogl_destinationPicker .smallplanet .ogl_currentDestination .ogl_available,.ogl_destinationPicker .smallplanet .ogl_currentDestination .ogl_refreshTimer{opacity:0!important}.ogl_destinationPicker .smallplanet .ogl_currentDestination:after{color:var(--ogl);content:"sports_score";text-shadow:1px 2px 4px #000;z-index:2;font-family:Material Icons;font-size:20px;position:absolute;top:50%;transform:translateY(-50%)}.ogl_destinationPicker .smallplanet .planetlink.ogl_currentDestination:after{text-align:right;right:2px}.ogl_destinationPicker .smallplanet .moonlink.ogl_currentDestination:after{text-align:left;left:2px}.smallplanet .planet-name,.smallplanet .planet-koords{font-weight:400!important;left:18px!important}.smallplanet .planet-name{background:#2a2c49;-webkit-border-radius:3px;border-radius:3px;padding:1px 3px;color:#878ab3!important;max-width:42%!important;font-size:10px!important;font-weight:700!important;top:9px!important;box-shadow:2px 3px 17px rgba(0,0,0,.71)!important}.smallplanet .planetlink.active .planet-name{background:#323f7d;color:#8094ff!important}.smallplanet .planetlink.ogl_currentDestination .planet-name{background:#ffc107;color:#384976!important}.smallplanet .planet-koords{color:#fff!important;font-size:11px!important;top:25px!important}.smallplanet .wreckFieldIcon{transform:translate(-100%);position:absolute!important;top:auto!important;bottom:auto!important;left:0!important;right:auto!important}.smallplanet .wreckFieldIcon .material-icons{color:var(--ogl);text-shadow:2px 1px #102742;position:relative;top:5px;left:5px;font-size:12px!important}.ogl_wreckfieldIcon .icon{filter:sepia()hue-rotate(345deg)saturate(300%)}.ogl_wreckfieldIcon.ogl_ok .icon{filter:sepia()hue-rotate(63deg)saturate(350%)}.smallplanet .wreckFieldIcon:hover .material-icons{filter:brightness(1.4)}.smallplanet .wreckFieldIcon.ogl_ok .material-icons{color:#24f38a}.smallplanet .ogl_available{box-sizing:border-box;text-shadow:1px 1px 4px #000;align-items:center;padding:3px 0;font-size:9px;font-weight:700;line-height:9px;display:grid;position:absolute;top:0}.smallplanet .planetlink .ogl_available{text-align:right;right:3px}.smallplanet .moonlink .ogl_available{text-align:left;left:3px}.smallplanet .ogl_refreshTimer{text-shadow:1px 1px 4px #000;align-items:center;font-size:9px;font-weight:700;display:flex;position:absolute;bottom:3px}#planetList.ogl_alt .smallplanet{height:39px!important}#planetList.ogl_alt .planet-name{top:7px!important}#planetList.ogl_alt .planet-koords{top:23px!important}#planetList.ogl_alt .ogl_available{height:100%}#planetList.ogl_alt .smallplanet .ogl_refreshTimer{display:none!important}.smallplanet .planetlink .ogl_refreshTimer{right:2px}.smallplanet .moonlink .ogl_refreshTimer{left:2px}.smallplanet .ogl_refreshTimer:after{content:"\\f12d";font-family:Material Icons;font-size:10px;font-weight:400}.smallplanet .planetPic{width:44px;height:44px;top:2px;left:1px}.smallplanet .icon-moon{width:44px;height:44px;top:2px;right:-2px}.smallplanet .ogl_sideIconInfo,.smallplanet .ogl_sideIconTop,.smallplanet .ogl_sideIconBottom{gap:5px;display:flex;position:absolute;left:calc(100% + 4px);font-size:14px!important}.smallplanet .ogl_fleetIcon:before{font-size:15px!important}.smallplanet .ogl_todoIcon:after{content:attr(data-list);font-family:Verdana,Arial,SunSans-Regular,sans-serif;font-size:12px;font-weight:700}.smallplanet .ogl_fleetIcon:after{content:attr(data-list);font-family:Verdana,Arial,SunSans-Regular,sans-serif;font-size:12px;font-weight:700}.smallplanet .ogl_sideIconInfo>div{align-items:center;display:flex!important}.smallplanet .ogl_sideIconTop>div{align-items:center;display:flex!important}.smallplanet .ogl_sideIconBottom>div{align-items:center;display:flex!important}.smallplanet .ogl_sideIconBottom{top:14px}.smallplanet .ogl_sideIconBottom .ogl_fleetIcon:before{transform:scaleX(-1)}.smallplanet .ogl_sideIconInfo{top:28px}.smallplanet .ogl_jumpgateTimer{font-size:11px}.smallplanet .ogl_sideIconInfo .material-icons,.smallplanet .ogl_sideIconTop .material-icons,.smallplanet .ogl_sideIconBottom .material-icons{cursor:pointer}.msg{outline:1px solid #000;position:relative;overflow:hidden;background:var(--tertiary)!important}.msg[data-msgType] .msg_status:before{background:0 0!important}.msg[data-msgType="expe"] .msg_status{background:var(--mission15)!important}.msg[data-msgType="discovery"] .msg_status{background:var(--lifeform)!important}.msg_new{background:linear-gradient(#2e525e,#223644 6%,#172834 20%)!important}.msg_title .ogl_mainIcon{color:var(--ogl)!important}.msg_title .ogl_ptre{color:#ff942c!important}.ogl_battle{grid-gap:6px;text-align:center;text-transform:capitalize;width:fit-content;background:rgba(0,0,0,.15);border:2px solid #323d4e;flex-wrap:wrap;justify-content:center;align-items:center;width:-moz-fit-content;margin:8px auto;padding:3px 6px;font-weight:700;display:flex;position:relative;box-shadow:0 0 6px -2px #000;color:#48566c!important}.ogame-tracker-msg .ogl_battle{display:none!important}.ogl_battleTooltip{font-size:14px!important}[data-depletion]:after{color:#eb5656;content:"\\f164";font-family:Material Icons;font-size:16px;font-weight:400}[data-depletion="1"]:after{color:#48566c;content:"\\f165"}[data-depletion="2"]:after{color:#ebb208;content:"\\f14f";transform:scaleX(-1)}[data-depletion="3"]:after{color:#f58725;content:"\\f166"}.ogl_battle[data-resultType][data-size="0"]{border-image:linear-gradient(to bottom right,#ede07c,#744407,#ede07c,#744407) 1!important}.ogl_battle[data-resultType][data-size="1"]{border-image:linear-gradient(to bottom right,#d7d7d7,#525252,#d7d7d7,#525252) 1!important}[data-size-value]{font-weight:700}[data-size-depletion]{color:#eb5656!important}[data-size-depletion="1"]{color:#48566c!important}[data-size-depletion="2"]{color:#ebb208!important}[data-size-depletion="3"]{color:#f58725!important}[data-size-value="0"]{color:#ede07c!important}[data-size-value="1"]{color:#ddd!important}[data-size-value="2"]{color:#d17755!important}[data-resultType]:before{content:"";font-family:Material Icons;font-size:18px;display:block;font-weight:400!important}[data-resultType="raid"]:before{content:"\\f14a"}[data-resultType="battle"]:before{content:"\\f14a"}[data-resultType="resource"]:before{content:"\\f13f"}[data-resultType="darkmatter"]:before{content:"\\f13f"}[data-resultType="artefact"]:before{content:"\\f168"}[data-resultType="ship"]:before{content:"\\f119"}[data-resultType="other"]:before{content:"\\e9d0"}[data-resultType="nothing"]:before{content:"\\f106"}[data-resultType*="lifeform"]:before{content:"\\f12c"}[data-resultType*="item"]:before{content:"\\f15b"}[data-resultType*="debris"]:before{content:"\\f160"}[data-resultType*="cargo"]:before{content:"\\f13f"}[data-resultType*="early"]:before{content:"\\f13a"}[data-resultType*="late"]:before{content:"\\f13a"}[data-resultType="duration"]:before{content:"\\f13a"}[data-resultType*="blackhole"]:before{content:"\\f13b"}[data-resultType*="trader"]:before{content:"\\f15d"}[data-resultType="alien"]:before{content:"\\f15a"}[data-resultType="pirate"]:before{content:"\\f15c"}[data-resultType="alien"]{color:var(--alien)!important}[data-resultType="pirate"]{color:var(--pirate)!important}[data-resultType="battle"]{color:var(--pirate)!important}[data-resultType="blackhole"]{color:var(--blackhole)!important}[data-resultType="trader"]{color:var(--trader)!important}[data-resultType="item"]{color:var(--item)!important}[data-resultType="early"]{color:var(--early)!important}[data-resultType="late"]{color:var(--late)!important}[data-resultType="duration"]{color:var(--late)!important}[data-resultType="resource"]{color:var(--resource)!important}[data-resultType="ship"]{color:var(--ship)!important}[data-resultType="dm"]{color:var(--dm)!important}[data-resultType="darkmatter"]{color:var(--dm)!important}[data-resultType="lifeform"]:after{color:#fff;content:"XP";align-self:baseline;margin-left:3px;font-size:smaller;display:block}.ogl_notification .ogl_icon[class*=lifeform]:after{color:#fff;content:"XP";align-self:baseline;margin-left:3px;font-size:smaller;display:block}.ogl_battle[data-resultType]:before{color:#48566c!important}.ogl_battle.ogl_clickable:hover{cursor:pointer;border:2px solid var(--ogl)!important}.ogl_battle .ogl_icon{background:0 0;align-items:center;padding:0;line-height:16px;display:flex}.ogl_battle .ogl_icon:not(:last-child){margin-right:20px}.ogl_battle[data-resultType="ship"] .ogl_icon{color:#98b1cb;grid-gap:3px;display:grid}.ogl_battle[data-resultType="global"] .ogl_icon{color:#98b1cb;grid-gap:3px;display:grid}.ogl_battle[data-resultType="ship"] .ogl_icon:not(:last-child){margin-right:7px}.ogl_battle[data-resultType="global"] .ogl_icon:not(:last-child){margin-right:0}.ogl_battle .ogl_icon:before{image-rendering:auto;background-size:400px;-webkit-border-radius:0;border-radius:0;width:32px;height:20px;margin:0 5px 0 0;display:block}.ogl_battle[data-resultType="raid"] .ogl_icon{display:grid}.ogl_battle[data-resultType="raid"] .ogl_icon:before{grid-row:1/3}.ogl_battle[data-resultType="raid"] .ogl_icon>span:last-child{grid-area:2/2}.ogl_battle[data-resultType="ship"] .ogl_icon:before{margin:auto}.ogl_battle[data-resultType="global"] .ogl_icon:before{margin:auto}.ogl_battle .ogl_icon[class*=ogl_2]:before{background-size:40px}.ogl_battle .ogl_icon.ogl_artefact:before{background-position:59% 28%;background-size:50px}.ogl_battle .ogl_icon.ogl_lifeform1:before{background-position:1px 76%}.ogl_battle .ogl_icon.ogl_lifeform2:before{background-position:11% 76%}.ogl_battle .ogl_icon.ogl_lifeform3:before{background-position:22% 76%}.ogl_battle .ogl_icon.ogl_lifeform4:before{background-position:32% 76%}.ogl_expeRecap{grid-gap:8px;background:#14181f;width:auto;padding:10px 0 6px;font-size:11px;position:relative}.ogl_expeRecap:before{margin-left:0!important}.ogl_expeRecap:after{background:var(--blue);color:#fff;content:attr(data-count);text-transform:lowercase;-webkit-border-radius:50px;border-radius:50px;padding:4px 5px;font-size:10px;position:absolute;top:-3px;right:-3px;box-shadow:0 0 6px -2px #000}#messages .tab_favorites,#messages .tab_inner{background-size:410px;background:#030406!important}.ogl_deleted{color:var(--red);opacity:.5}.ogl_spytable{color:#93b3c9;counter-reset:spy;counter-increment:spy;user-select:none;background:#12161a;-webkit-border-radius:5px;border-radius:5px;width:100%;margin:40px 0 10px;padding:5px;font-size:11px}.ogl_spytable:not(:has(.ogl_spyLine:not(.ogl_spySum))){display:none!important}#messagecontainercomponent:has(.active:not([data-subtab-id="20"])) .ogl_spytable{display:none!important}#messagecontainercomponent:has(.ogl_boardMessageTab.marker) .ogl_spytable{display:none!important}.ogl_spytable .ogl_spytableSettings{justify-content:right;align-items:center;display:flex}.ogl_spytable.ogl_outdated .ogl_spytableSettings:before{color:var(--ogl);content:"\\f10e";font-family:Material Icons;animation:1s infinite spin;font-size:16px!important}.ogl_spytable .ogl_spytableSettings [data-label]:before{content:attr(data-label);color:#fff;text-shadow:1px 1px #000;background:#4466a3;-webkit-border-radius:4px;border-radius:4px;padding:0 4px;font-family:monospace;font-size:12px;line-height:14px;display:block;position:absolute;top:8px;right:-2px}.ogl_spytable .ogl_spytableSettings>div{float:right;background:0 0;border:none;height:20px;padding:0 6px;font-size:18px!important;line-height:20px!important}.ogl_spytable .ogl_spytableSettings>div:hover{color:#fff!important}.ogl_spytable .ogl_spytableSettings [data-action=ignore]{color:var(--red)!important}.ogl_spytable .ogl_spytableSettings [data-action=highlight]{color:var(--ogl)!important}.ogl_spytable .ogl_spytableSettings [data-action=broom]{font-size:14px!important}.ogl_spyTableRules .ogl_addRule{grid-gap:10px;background:#191f2a;border:2px solid #2f384a;-webkit-border-radius:3px;border-radius:3px;align-items:center;padding:16px;display:flex}.ogl_spyTableRules .ogl_addRule select,.ogl_spyTableRules .ogl_addRule input,.ogl_spyTableRules .ogl_addRule button{height:26px!important;line-height:26px!important}.ogl_spyTableRules .ogl_addRule .ogl_button{padding:0 8px!important}.ogl_spyTableRules legend{grid-gap:5px;align-items:center;display:flex}.ogl_spyTableRules legend .material-icons{font-size:23px!important}.ogl_rulesList{grid-gap:5px;margin-top:20px;display:grid}.ogl_rulesList>div{background:var(--secondaryReversed);-webkit-border-radius:3px;border-radius:3px;grid-template-columns:40px 200px 30px auto 30px 50px;align-items:center;padding-left:10px;display:grid}.ogl_rulesList>div:first-child:before{content:""}.ogl_rulesList>div:not(:first-child):before{content:"OR";color:#5e6a7c;font-size:10px}.ogl_rulesList .ogl_danger{font-size:16px!important}#fleetsTab .ogl_spytable{margin-top:55px;margin-bottom:-25px}.ogl_spytable a.ogl_important span{color:#fff!important}.ogl_spytable hr{background:#1e252e;border:none;grid-column:1/-1;width:100%;height:2px}.ogl_spytable .ogl_spyIcon{font-size:16px!important}.ogl_spytable a:not(.ogl_button):not([class*=status_abbr]){color:inherit!important}.ogl_spytable [data-galaxy]:not(.ogl_button){color:inherit!important}.ogl_spytable a:hover{text-decoration:underline!important}.ogl_spytable [data-galaxy]:hover{text-decoration:underline!important}.ogl_spyHeader{grid-gap:3px;-webkit-border-radius:3px;border-radius:3px;grid-template-columns:22px 34px 30px 24px 96px auto 70px 43px 43px 130px;align-items:center;margin-bottom:2px;display:grid}.ogl_spytable .ogl_spyLine>div:not(.ogl_more){grid-gap:3px;-webkit-border-radius:3px;border-radius:3px;grid-template-columns:22px 34px 30px 24px 96px auto 70px 43px 43px 130px;align-items:center;margin-bottom:2px;display:grid}.ogl_spytable .ogl_spyLine:not(:first-child){counter-increment:spy}.ogl_spytable .ogl_spyLine>div>*{background:var(--secondary);text-overflow:ellipsis;white-space:nowrap;-webkit-border-radius:3px;border-radius:3px;align-items:center;height:24px;padding:0 4px;display:flex;position:relative;overflow:hidden}.ogl_spytable .ogl_spyLine>div>a{text-decoration:none}.ogl_spytable .ogl_spyLine>div>span:nth-child(5){justify-content:right}.ogl_spytable>div>span:nth-child(6){justify-content:right}.ogl_spytable>div>span:nth-child(7){justify-content:right}.ogl_spytable .ogl_spyLine:not(.ogl_spySum)>div>span:first-child:before{content:counter(spy)}.ogl_spytable .msg_action_link{text-overflow:ellipsis;overflow:hidden;padding:0!important}.ogl_spytable .ogl_fleetIcon{pointer-events:none;text-shadow:1px 1px 3px #000;position:absolute;bottom:-2px;left:1px}.ogl_spytable .ogl_spyLine>div>span a{text-decoration:none}.ogl_spytable .ogl_spyLine a:not(.ogl_button):hover{color:#fff!important;cursor:pointer!important;text-decoration:underline!important}.ogl_spytable .ogl_spyLine [data-galaxy]:hover{color:#fff!important;cursor:pointer!important;text-decoration:underline!important}.ogl_spytable .ogl_spyHeader b{color:#3c4f5a;background:#12161a;-webkit-border-radius:3px;border-radius:3px;padding-left:4px;font-size:11px!important;line-height:27px!important}.ogl_spytable .ogl_spyHeader b.material-icons{font-size:14px!important}.ogl_spytable .ogl_spyHeader b:first-child{padding-left:0}.ogl_spytable .ogl_spyHeader b:nth-child(3){padding-left:0}.ogl_spytable .ogl_spyHeader b:last-child{background:0 0;padding:0}.ogl_spytable .ogl_spyHeader span:last-child{background:0 0;padding:0}.ogl_spytable .ogl_spyHeader [data-filter].ogl_active{color:var(--amber)}.ogl_spytable [data-title]:not(.ogl_spyIcon):not([class*=status_abbr]){color:inherit!important}.ogl_spytable [data-filter]:after{color:#3c4f5a;content:"\\f15f";float:right;font-family:Material Icons;font-size:16px}.ogl_spytable .ogl_spyHeader [data-filter]:hover{color:#fff;cursor:pointer}.ogl_spytable .ogl_actions{grid-gap:2px;justify-content:space-between;font-size:16px;background:0 0!important;-webkit-border-radius:0!important;border-radius:0!important;padding:0!important}.ogl_spytable .ogl_type>*{color:#b7c1c9;font-size:16px!important}.ogl_spytable .ogl_type>:hover{color:#fff}.ogl_spytable .ogl_actions .ogl_button{border:none;width:100%;padding:0;height:24px!important;line-height:24px!important;text-decoration:none!important}.ogl_spytable .ogl_actions>:not(.material-icons){font-size:12px;font-weight:700}.ogl_spytable .ogl_reportTotal{text-decoration:none}.ogl_spytable .ogl_actions a:hover{text-decoration:none}.ogl_spyLine .ogl_more{background:var(--primary);-webkit-border-radius:3px;border-radius:3px;margin-bottom:3px;padding:7px}.ogl_spyLine .ogl_more .ogl_icon{align-items:center;display:flex}.ogl_spyLine .ogl_more>div{grid-gap:5px;grid-template-columns:repeat(auto-fit,minmax(0,1fr));align-items:center;margin-bottom:5px;display:grid}.ogl_spyLine .ogl_more>div>*{background:var(--secondary);-webkit-border-radius:3px;border-radius:3px;padding:2px;line-height:20px;text-decoration:none}.ogl_spyLine .ogl_more a:hover{color:#fff}.ogl_spyLine .ogl_spyTableName{background:var(--secondary);align-items:center;height:100%;display:flex}.ogl_spyLine .ogl_spyTableName a{text-overflow:ellipsis;white-space:nowrap;align-items:center;width:86%;height:100%;text-decoration:none;display:flex;overflow:hidden}.ogl_trashCounterSpy{width:28px;position:absolute;top:48px;right:104px;min-width:0!important;padding:0!important;font-size:16px!important;line-height:26px!important;display:block!important}.galaxyTable{background:#10151a!important}#galaxycomponent .systembuttons img{pointer-events:none}#galaxyContent .ctContentRow .galaxyCell{background:var(--secondary)!important;-webkit-border-radius:2px!important;border-radius:2px!important}#galaxyContent .cellPlanetName,#galaxyContent .cellPlayerName{padding:0 5px;justify-content:left!important}#galaxyContent .cellPlanetName span{text-overflow:ellipsis;white-space:nowrap;max-width:62px;overflow:hidden}#galaxyContent .cellPlayerName{flex-basis:106px!important}#galaxyContent .cellPlayerName .tooltipRel:hover{text-decoration:underline}#galaxyContent .cellPlayerName [rel]{text-overflow:ellipsis;white-space:nowrap;max-width:110px;line-height:28px;overflow:hidden;display:inline-block!important}#galaxyContent .cellPlayerName pre{display:none}.ogl_ranking{text-decoration:none!important}#galaxyContent .ogl_ranking{color:#7e95a9;cursor:pointer}#galaxyContent .ogl_ranking:hover{color:#fff}#galaxyContent .ogl_ranking a{color:inherit;text-decoration:none}#galaxyHeader .btn_system_action{max-width:100px;overflow:hidden}#galaxyContent .cellPlayerName [class*=status_abbr]{margin-right:auto}#galaxyContent .ownPlayerRow{cursor:pointer}#galaxyContent .ctContentRow .cellDebris a{text-align:center;white-space:nowrap;line-height:30px;text-decoration:none}#galaxyContent .ctContentRow .cellDebris.ogl_important a{color:#fff!important}[class*=filtered_filter_]{opacity:1!important}#galaxyContent .ctContentRow[class*=filtered_filter_] .galaxyCell:not(.ogl_important){background:#12181e!important}#galaxyContent .expeditionDebrisSlotBox{background:var(--primary)!important}#galaxyContent .expeditionDebrisSlotBox .material-icons{color:#48566c;font-size:20px!important}#galaxyContent .ctContentRow .galaxyCell.cellDebris.ogl_important,#galaxyContent .ogl_expeditionRow.ogl_important{background:linear-gradient(192deg,#a96510,#6c2c0d 70%)!important}.ogl_spytable .ogl_spyLine:not(.ogl_ignored) .ogl_important{background:linear-gradient(192deg,#a96510,#6c2c0d 70%)!important}.ogl_spytable .ogl_ignored{opacity:.2}.ogl_spytable .ogl_ignored.ogl_highlighted{opacity:.5}.ogl_spytable .ogl_highlighted>div:not(.ogl_more)>:not(.ogl_actions){background:linear-gradient(192deg,#3d4757,#2a2439 70%)}.ogl_spytable .ogl_highlighted>div:not(.ogl_more)>.ogl_textRight{font-weight:700;color:var(--ogl)!important}#galaxyContent .ogl_expeditionRow.ogl_important .material-icons{color:#bb6848}[class*=filtered_filter_]>.cellPlanet:not(.ogl_important) .microplanet{opacity:.2!important}[class*=filtered_filter_]>.cellPlanetName:not(.ogl_important) span:not(.icon){opacity:.2!important}[class*=filtered_filter_]>.cellMoon:not(.ogl_important) .micromoon{opacity:.2!important}[class*=filtered_filter_]>.cellPlayerName:not(.ogl_important) span{opacity:.2!important}[class*=filtered_filter_]>.cellPlayerName:not(.ogl_important) .ogl_ranking{opacity:.2!important}[class*=filtered_filter_]>.cellAlliance:not(.ogl_important) span{opacity:.2!important}[class*=filtered_filter_]>.cellAction:not(.ogl_important) a:not(.planetDiscover):not(.planetMoveIcons){opacity:.2!important}.ogl_popup{opacity:0;pointer-events:none;z-index:1000001;background:rgba(0,0,0,.85);flex-direction:column;justify-content:center;align-items:center;width:100dvw;height:100dvh;transition:opacity .3s,pointer-events .3s;display:flex;position:fixed;top:0;left:0}.ogl_popup.ogl_active{pointer-events:all;opacity:1}.ogl_popup .ogl_close,.ogl_popup .ogl_share{color:#556672;cursor:pointer;text-align:center;width:30px;position:absolute;top:2px;right:0;font-size:18px!important;line-height:30px!important}.ogl_popup .ogl_close:hover{color:#fff}.ogl_popup .ogl_share:hover{color:#fff}.ogl_popup .ogl_share{top:30px;font-size:16px!important}.ogl_popup>.ogl_popupContent{background:var(--primary);background:#0f1218;-webkit-border-radius:3px;border-radius:3px;max-width:980px;max-height:80%;padding:30px;animation:.15s pop;position:relative;overflow-x:hidden;overflow-y:auto}.ogl_popup h2{color:#9dbddd;text-align:center;border-bottom:2px solid #161b24;margin-bottom:16px;padding-bottom:7px;font-size:14px}@keyframes pop{0%{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}.ogl_keeper{max-width:700px!important}.ogl_keeper .ogl_limiterLabel{float:left;width:100px;margin-right:20px}.ogl_keeper .ogl_limiterLabel input{margin-left:auto}.ogl_keeper hr{background:#1e252e;border:none;grid-column:1/-1;width:100%;height:2px}.ogl_resourceLimiter,.ogl_shipLimiter,.ogl_jumpgateLimiter{grid-gap:5px 18px;background:#1b202a;-webkit-border-radius:3px;border-radius:3px;grid-template-columns:repeat(12,1fr);padding:12px;display:grid;position:relative}.ogl_shipLimiter,.ogl_jumpgateLimiter{grid-template-columns:repeat(20,1fr)}.ogl_keeper .ogl_icon{grid-column:span 4;padding:0}.ogl_keeper .ogl_metal,.ogl_keeper .ogl_crystal,.ogl_keeper .ogl_deut,.ogl_keeper .ogl_food{grid-column:span 3}.ogl_keeper .ogl_icon:before{vertical-align:text-bottom;margin-right:5px!important}.ogl_keeper input{box-sizing:border-box;color:inherit;background:#121518;border:none;border-top:1px solid #080b10;border-bottom:1px solid #242a32;-webkit-border-radius:3px;border-radius:3px;width:calc(100% - 34px);padding:4px 6px}.ogl_keeper .ogl_button{background:var(--secondary);color:#fff;cursor:pointer;-webkit-border-radius:3px;border-radius:3px;line-height:24px!important}.ogl_keeper .ogl_button.ogl_active{background:var(--highlight)}.ogl_keeper .ogl_button:last-child{grid-column:-2}.ogl_keeper .ogl_profileTabs{grid-gap:0 5px;grid-column:1/-1;grid-template-columns:repeat(5,1fr);display:grid}.ogl_keeper input.ogl_title{text-align:center;grid-column:1/-1;width:100%;padding:8px}.ogl_keeper h2{grid-column:1/-1}.ogl_keeper h2:not(:nth-child(2)){margin:20px 0 10px}.ogl_keeper .ogl_missionPicker{grid-gap:4px;grid-column:1/-1;grid-template-columns:repeat(11,auto);justify-content:end;margin-top:10px;display:grid}.ogl_keeper .ogl_missionPicker [data-mission]{filter:grayscale()}.ogl_keeper .ogl_missionPicker [data-mission]:hover{cursor:pointer;filter:grayscale(.5)}.ogl_keeper .ogl_missionPicker .ogl_active{box-shadow:none!important;filter:grayscale(0)!important}.ogl_side{background:var(--primary);box-sizing:border-box;z-index:1000000;width:385px;height:100%;padding:40px 18px 18px;transition:transform .3s;position:fixed;top:0;right:0;overflow:auto;transform:translate(100%);box-shadow:0 0 50px #000}.ogl_side.ogl_active{transform:translate(0%);box-shadow:0 0 50px #000}.ogl_side .ogl_close,.ogl_side .ogl_back{color:#556672;cursor:pointer;position:absolute;top:10px;right:20px;font-size:28px!important}.ogl_side .ogl_close:hover{color:#fff}.ogl_side .ogl_back:hover{color:#fff}.ogl_side .ogl_back{left:20px;right:auto}.ogl_side hr{background:#151e28;border:none;grid-column:1/-1;width:100%;height:2px}.ogl_side h2{color:#7e8dab;justify-content:center;align-items:center;margin-bottom:20px;font-size:14px;display:flex}.ogl_side h2 .ogl_flagPicker{height:17px;margin-left:5px}.ogl_side h2 i{margin-left:10px}.ogl_config{grid-gap:8px;line-height:26px;display:grid}.ogl_config label{color:#c7c7c7;background:linear-gradient(-207deg,#0d1014,#212b34);-webkit-border-radius:3px;border-radius:3px;align-items:center;margin:2px 0;padding:0;display:flex}.ogl_config label:before{content:attr(data-label);display:block}.ogl_config label.tooltipLeft:before{text-decoration:underline dotted}.ogl_config label>:first-child{margin-left:auto}.ogl_inputField{box-sizing:border-box!important;visibility:visible!important;background:#121518!important;border:1px solid #080b10!important;-webkit-border-radius:3px!important;border-radius:3px!important;height:22px!important;padding:0 5px!important;font-size:12px!important;box-shadow:inset 0 2px 3px #0b0e12!important}.ogl_config label>input[type=text]{box-sizing:border-box!important;visibility:visible!important;background:#121518!important;border:1px solid #080b10!important;-webkit-border-radius:3px!important;border-radius:3px!important;height:22px!important;padding:0 5px!important;font-size:12px!important;box-shadow:inset 0 2px 3px #0b0e12!important}.ogl_config label>input[type=password]{box-sizing:border-box!important;visibility:visible!important;background:#121518!important;border:1px solid #080b10!important;-webkit-border-radius:3px!important;border-radius:3px!important;height:22px!important;padding:0 5px!important;font-size:12px!important;box-shadow:inset 0 2px 3px #0b0e12!important}.ogl_config label>input[type=checkbox]{box-sizing:border-box!important;visibility:visible!important;background:#121518!important;border:1px solid #080b10!important;-webkit-border-radius:3px!important;border-radius:3px!important;height:22px!important;padding:0 5px!important;font-size:12px!important;box-shadow:inset 0 2px 3px #0b0e12!important}.ogl_config label>select{box-sizing:border-box!important;visibility:visible!important;background:#121518!important;border:1px solid #080b10!important;-webkit-border-radius:3px!important;border-radius:3px!important;height:22px!important;padding:0 5px!important;font-size:12px!important;box-shadow:inset 0 2px 3px #0b0e12!important}.ogl_todoList input[type=checkbox]{box-sizing:border-box!important;visibility:visible!important;background:#121518!important;border:1px solid #080b10!important;-webkit-border-radius:3px!important;border-radius:3px!important;height:22px!important;padding:0 5px!important;font-size:12px!important;box-shadow:inset 0 2px 3px #0b0e12!important}.ogl_limiterLabel input[type=checkbox]{box-sizing:border-box!important;visibility:visible!important;background:#121518!important;border:1px solid #080b10!important;-webkit-border-radius:3px!important;border-radius:3px!important;height:22px!important;padding:0 5px!important;font-size:12px!important;box-shadow:inset 0 2px 3px #0b0e12!important}.ogl_config label>input[type=text]{color:#5d738d!important}.ogl_config label>input[type=password]{color:#5d738d!important}.ogl_config label>input[type=checkbox]{color:#5d738d!important}.ogl_config label>select{color:#5d738d!important}.ogl_inputField:not(.ogl_metal):not(.ogl_crystal):not(.ogl_deut):not([type=checkbox]){color:#5d738d!important}.ogl_todoList input[type=checkbox]{color:#5d738d!important}.ogl_limiterLabel input[type=checkbox]{color:#5d738d!important}.ogl_config label>input[type=text]{width:105px!important}.ogl_config label>input[type=password]{width:105px!important}.ogl_config label>select{width:105px!important}.ogl_config label>input[type=checkbox]{appearance:none!important;color:var(--ogl)!important;cursor:pointer!important;justify-content:center!important;align-items:center!important;width:16px!important;height:16px!important;display:flex!important}.ogl_todoList input[type=checkbox]{appearance:none!important;color:var(--ogl)!important;cursor:pointer!important;justify-content:center!important;align-items:center!important;width:16px!important;height:16px!important;display:flex!important}.ogl_limiterLabel input[type=checkbox]{appearance:none!important;color:var(--ogl)!important;cursor:pointer!important;justify-content:center!important;align-items:center!important;width:16px!important;height:16px!important;display:flex!important}.ogl_inputField[type=checkbox]{appearance:none!important;color:var(--ogl)!important;cursor:pointer!important;justify-content:center!important;align-items:center!important;width:16px!important;height:16px!important;display:flex!important}.ogl_config label>input[type=checkbox]:hover{box-shadow:0 0 0 2px var(--ogl)}.ogl_todoList input[type=checkbox]:hover{box-shadow:0 0 0 2px var(--ogl)}.ogl_limiterLabel input[type=checkbox]:hover{box-shadow:0 0 0 2px var(--ogl)}.ogl_inputField[type=checkbox]:hover{box-shadow:0 0 0 2px var(--ogl)}.ogl_config label>input[type=checkbox]:checked:before{content:"\\f103";pointer-events:none;font-family:Material Icons;font-size:18px!important}.ogl_todoList input[type=checkbox]:checked:before{content:"\\f103";pointer-events:none;font-family:Material Icons;font-size:18px!important}.ogl_limiterLabel input[type=checkbox]:checked:before{content:"\\f103";pointer-events:none;font-family:Material Icons;font-size:18px!important}.ogl_inputField[type=checkbox]:checked:before{content:"\\f103";pointer-events:none;font-family:Material Icons;font-size:18px!important}.ogl_config .ogl_icon[class*=ogl_2]{cursor:pointer;padding:0}.ogl_config .ogl_icon[class*=ogl_mission]{cursor:pointer;padding:0}.ogl_config .ogl_icon[class*=ogl_2]:not(:first-child){margin-left:5px}.ogl_config .ogl_icon[class*=ogl_mission]:not(:first-child){margin-left:5px}.ogl_config .ogl_icon[class*=ogl_2]:hover:before{box-shadow:0 0 0 2px var(--ogl)}.ogl_config .ogl_icon[class*=ogl_mission]:hover:before{box-shadow:0 0 0 2px var(--ogl)}.ogl_config .ogl_icon[class*=ogl_2].ogl_active:before{box-shadow:0 0 0 2px #fff}.ogl_config .ogl_icon[class*=ogl_mission].ogl_active:before{box-shadow:0 0 0 2px #fff}.ogl_config .ogl_icon[class*=ogl_2]:before{vertical-align:middle;margin:0}.ogl_config .ogl_icon[class*=ogl_mission]:before{vertical-align:middle;margin:0}.ogl_config .ogl_icon[class*=ogl_mission]:before{background-position-y:-6px!important;background-size:318px!important}.ogl_config [data-container]{background:#0e1116;-webkit-border-radius:3px;border-radius:3px;max-height:24px;padding:5px;transition:max-height .3s cubic-bezier(0,1,0,1);overflow:hidden}.ogl_config [data-container].ogl_active{max-height:400px;transition:max-height .3s ease-in-out}.ogl_config [data-container]>*{padding:0 7px}.ogl_config h3{color:#90aed5;cursor:pointer;text-align:left;text-transform:capitalize;user-select:none;-webkit-border-radius:3px;border-radius:3px;align-items:center;margin-bottom:5px;font-size:12px;display:flex;position:relative;overflow:hidden}.ogl_config [data-container] h3:hover{box-shadow:inset 0 0 0 2px var(--ogl);color:var(--ogl)}.ogl_config svg{color:inherit;fill:currentColor;height:26px;margin-right:5px;font-family:Material Icons;font-size:16px}.ogl_config>div h3:before{color:inherit;fill:currentColor;height:26px;margin-right:5px;font-family:Material Icons;font-size:16px}.ogl_config [data-container=fleet] h3:before{content:"\\f119"}.ogl_config [data-container=general] h3:before{content:"\\f111"}.ogl_config [data-container=interface] h3:before{content:"\\f10f"}.ogl_config [data-container=expeditions] h3:before{content:"\\f115"}.ogl_config [data-container=stats] h3:before{content:"\\f118"}.ogl_config [data-container=messages] h3:before{content:"\\f117"}.ogl_config [data-container=PTRE] h3:before{content:"\\f11d"}.ogl_config [data-container=data] h3:before{content:"\\f114"}.ogl_config h3:after{content:"\\f105";margin-left:auto;font-family:Material Icons}.ogl_config label button{color:#b7c1c9;cursor:pointer;text-shadow:1px 1px #000;background:linear-gradient(#405064,#2d3743 2px,#181e25);border:1px solid #17191c;-webkit-border-radius:3px;border-radius:3px;width:30px;position:relative;height:22px!important;font-size:16px!important;line-height:18px!important}.ogl_config label button.ogl_active{color:var(--ogl)}.ogl_config label button:hover{color:var(--ogl)}.ogl_config label .ogl_choice{color:#b7c1c9;cursor:pointer;text-align:center;background:linear-gradient(#405064,#2d3743 2px,#181e25);border-top:1px solid #17191c;border-bottom:1px solid #17191c;width:30px;font-weight:700;position:relative;height:20px!important;font-size:11px!important;line-height:20px!important}.ogl_config label .ogl_choice:first-child{-webkit-border-radius:3px 0 0 3px;border-radius:3px 0 0 3px}.ogl_config label .ogl_choice:last-child{-webkit-border-radius:0 3px 3px 0;border-radius:0 3px 3px 0}.ogl_config label .ogl_choice.ogl_active{z-index:2;-webkit-border-radius:3px;border-radius:3px;box-shadow:0 0 0 2px #fff}.ogl_config label .ogl_choice:hover{color:var(--ogl)}.ogl_keyboardActions{grid-gap:5px 20px;grid-template-columns:repeat(2,1fr);display:grid}.ogl_keyboardActions h2{grid-column:1/-1}.ogl_keyboardActions label{background:var(--secondary);grid-gap:15px;grid-template-columns:auto 100px;align-items:center;padding-left:10px;display:grid}.ogl_keyboardActions label:hover{color:var(--amber);cursor:pointer}.ogl_keyboardActions label hr{appearance:none;border:none;height:1px;margin:0;padding:0}.ogl_keyboardActions input{box-shadow:none!important;color:#000!important;text-align:center!important;text-transform:uppercase!important;background:#fff!important;border:none!important;-webkit-border-radius:0!important;border-radius:0!important;height:21px!important;padding:4px!important;font-size:14px!important;font-weight:700!important;line-height:21px!important}.ogl_keyboardActions input:focus{outline:2px solid var(--amber);background:#ffe395!important}.ogl_keyboardActions button{cursor:pointer;grid-column:1/-1;margin-top:10px;line-height:30px!important}.ogl_planetList{color:#566c7c;margin-top:10px;font-size:11px}.ogl_planetList>div{grid-gap:3px;grid-template-columns:24px 70px 44px 44px auto;align-items:center;margin-bottom:3px;display:grid}.ogl_planetList>div>:nth-child(2){text-align:left;text-indent:5px}.ogl_planetList>div>:last-child{color:var(--date);font-size:10px}.ogl_planetList [class*=Icon]{font-size:10px}.ogl_planetList [class*=Icon]:before{vertical-align:bottom;margin-right:5px;font-size:16px}.ogl_filterColor{grid-gap:3px;grid-template-rows:repeat(1,1fr);grid-auto-flow:column;margin:10px 0;display:grid}.ogl_filterColor>*{cursor:pointer;-webkit-border-radius:50%;border-radius:50%;height:18px}label.ogl_off{opacity:.2}.ogl_filterColor>.ogl_off{opacity:.2}.ogl_filterColor>:hover{opacity:.7}label.ogl_off:hover{opacity:.7}.ogl_filterStatus{grid-gap:3px;grid-template-rows:repeat(1,1fr);grid-auto-flow:column;justify-content:end;margin:10px 0;display:grid}.ogl_filterStatus>*{cursor:pointer;text-align:center;background:#182b3b;-webkit-border-radius:4px;border-radius:4px;width:24px;line-height:24px}.ogl_filterStatus>.ogl_off{opacity:.2}.ogl_filterStatus>:hover{opacity:.7}.ogl_filterGalaxy,.ogl_filterSystem{color:#a0bacd;grid-gap:3px;text-align:center;grid-template-columns:repeat(10,1fr);font-size:11px;line-height:24px;display:grid}.ogl_filterGalaxy>*{cursor:pointer;background:#182b3b;-webkit-border-radius:4px;border-radius:4px}.ogl_filterSystem>*{cursor:pointer;background:#182b3b;-webkit-border-radius:4px;border-radius:4px}.ogl_filterGalaxy>:hover{color:#fff;text-decoration:underline}.ogl_filterSystem>:hover{color:#fff;text-decoration:underline}.ogl_filterGalaxy>.ogl_active:not(.ogl_disabled){color:#ccc;filter:brightness(1.4)}.ogl_filterSystem>.ogl_active:not(.ogl_disabled){color:#ccc;filter:brightness(1.4)}.ogl_filterGalaxy{margin-top:30px}.ogl_filterSystem{margin-top:10px}.ogl_watchList{grid-gap:3px;padding-top:40px;font-size:11px;display:grid}.ogl_watchList>div{grid-gap:3px;grid-template-columns:24px auto 100px 50px;display:grid}.ogl_watchList>div>*{background:#182b3b;-webkit-border-radius:3px;border-radius:3px;height:24px;padding:0 5px;line-height:24px}.ogl_watchList>div>:nth-child(2):hover{cursor:pointer;text-decoration:underline}.ogl_targetList{grid-gap:3px;padding-top:30px;font-size:11px;display:grid}.ogl_targetList .honorRank{vertical-align:sub;margin-right:1px;transform:scale(.75)}.ogl_targetList .ogl_target{color:#566c7c;grid-gap:3px;grid-template-columns:76px auto 24px 24px 24px 24px 24px;line-height:24px;display:grid;position:relative}.ogl_targetList .ogl_target>*{text-overflow:ellipsis;white-space:nowrap;background:#182b3b;-webkit-border-radius:3px;border-radius:3px;height:24px;overflow:hidden}.ogl_targetList .ogl_target [data-galaxy]{text-indent:17px}.ogl_targetList .ogl_target [class*=status_abbr_]{text-indent:3px}.ogl_targetList .ogl_target>:first-child{z-index:2;-webkit-border-radius:50%;border-radius:50%;align-self:center;width:7px;height:7px;display:block;position:absolute;left:6px}.ogl_targetList .ogl_target>*{grid-row:1}.ogl_targetList .ogl_target>[class*=Icon]:hover{color:#fff;cursor:pointer}.ogl_ogameDiv{background:var(--tertiary);-webkit-border-radius:0;border-radius:0;padding:2px;position:relative;box-shadow:0 0 20px -5px #000,0 0 0 2px #142030}.ogl_miniStats{cursor:pointer;-webkit-border-radius:3px;border-radius:3px;width:160px;margin-top:10px}.ogl_miniStats:hover:not(:has(.ogl_button:hover)){box-shadow:0 0 0 2px var(--ogl)}.ogl_miniStats>div{grid-gap:5px 0;grid-template-columns:repeat(3,1fr);justify-content:center;padding:3px 2px;font-size:11px;display:grid}.ogl_miniStats .ogl_header{user-select:none;height:18px;padding:5px;line-height:18px}.ogl_miniStats .ogl_header span{text-transform:capitalize;line-height:15px;display:inline-block}.ogl_miniStats .ogl_header div{color:#fff;cursor:pointer;z-index:1}.ogl_miniStats .ogl_header div:first-child{position:absolute;left:6px}.ogl_miniStats .ogl_header div:last-child{position:absolute;right:2px}.ogl_miniStats .ogl_icon{background:var(--secondary);grid-gap:3px;text-align:center;justify-content:center;align-items:center;margin:0 2px;padding:3px 0;display:grid}.ogl_miniStats .ogl_icon:before{height:20px;margin:auto}.ogl_miniStats .ogl_artefact:before{background-size:23px}.ogl_stats{display:grid}.ogl_stats h3{color:#97a7c5;text-align:center;grid-column:1/-1;margin-top:20px;font-size:11px;font-weight:700}.ogl_statsMonth{grid-gap:5px;align-items:center;display:flex}.ogl_statsMonth>*{padding:0 10px}.ogl_statsMonth .ogl_button:not(.material-icons){text-transform:uppercase}.ogl_dateBar{user-select:none;background:#181d26;-webkit-border-radius:5px;border-radius:5px;margin:20px 0;padding:4px;display:flex}.ogl_dateBar .ogl_item{box-sizing:border-box;cursor:ew-resize;flex:1;grid-template-rows:50px 16px;justify-content:center;align-items:end;padding:12px 2px 5px;display:grid;position:relative}.ogl_dateBar .ogl_item:after{content:attr(data-day);opacity:.3;pointer-events:none;text-align:center;display:block}.ogl_dateBar .ogl_item.ogl_active:after{opacity:1}.ogl_dateBar .ogl_item.ogl_today{text-decoration:underline}.ogl_dateBar .ogl_item>div{cursor:pointer;pointer-events:none;-webkit-border-radius:4px;border-radius:4px;width:20px;height:100%;font-size:10px;font-weight:700}.ogl_dateBar .ogl_selected{border-bottom:2px solid var(--ogl);border-top:2px solid var(--ogl);background:#524728;padding-top:10px;padding-bottom:3px}.ogl_dateBar .ogl_selected:not(.ogl_selected+.ogl_selected){border-left:2px solid var(--ogl);-webkit-border-top-left-radius:5px;border-top-left-radius:5px;-webkit-border-bottom-left-radius:5px;border-bottom-left-radius:5px;padding-left:0}.ogl_dateBar .ogl_selected:has(+:not(.ogl_selected)){border-right:2px solid var(--ogl);-webkit-border-top-right-radius:5px;border-top-right-radius:5px;-webkit-border-bottom-right-radius:5px;border-bottom-right-radius:5px;padding-right:0}.ogl_dateBar .ogl_item.ogl_selected:last-child{border-right:2px solid var(--ogl);-webkit-border-top-right-radius:5px;border-top-right-radius:5px;-webkit-border-bottom-right-radius:5px;border-bottom-right-radius:5px;padding-right:0}.ogl_dateBar>.ogl_item:hover{background:#524728}.ogl_popup.ogl_active .ogl_dateBar .ogl_active{pointer-events:all;color:#fff!important}.ogl_statsDetails{grid-gap:20px;grid-template-columns:430px 430px;align-items:end;display:grid}.ogl_statsDetails h3{color:var(--ogl);position:relative}.ogl_pie{background:var(--secondary);grid-gap:20px;-webkit-border-radius:5px;border-radius:5px;justify-content:center;align-items:center;height:182px;padding:0 20px;display:flex;position:relative}.ogl_pie:before{content:attr(data-pie);color:#fff;pointer-events:none;text-align:center;text-shadow:1px 1px 5px #000;white-space:pre;z-index:3;justify-content:center;align-items:center;width:200px;height:100%;font-size:12px;line-height:18px;display:grid;position:absolute;top:0;left:0}.ogl_noExpe{grid-gap:10px;display:grid}.ogl_pie span.material-icons{color:#313e4e;margin:auto;font-size:100px!important}.ogl_pie canvas{width:160px;height:160px}.ogl_pie .ogl_pieLegendContainer{-webkit-border-radius:5px;border-radius:5px;align-items:center;width:210px;min-height:120px;display:grid}.ogl_pie .ogl_pieLegend{cursor:pointer;grid-gap:5px;white-space:nowrap;-webkit-border-radius:3px;border-radius:3px;grid-template-columns:18px auto 54px 41px;align-items:center;display:grid}.ogl_pie .ogl_pieLegend.ogl_active{box-shadow:0 0 0 2px #fff}.ogl_pie .ogl_pieLegend:hover{box-shadow:0 0 0 2px #fff}.ogl_pie .ogl_pieLegend>*{color:#fff;text-overflow:ellipsis;overflow:hidden}.ogl_pie .ogl_pieLegend>span{justify-self:right}.ogl_pie .ogl_pieLegend i{opacity:.6;text-align:right;font-size:smaller;font-weight:400}.ogl_pie .ogl_pieLegend .ogl_suffix{display:inline}.ogl_shipTable{grid-gap:5px;grid-template-columns:repeat(3,1fr);height:100%;display:grid}.ogl_shipTable>.ogl_icon{background:var(--secondary);box-sizing:border-box;padding-right:10px}.ogl_shipTable>.ogl_icon:before{width:38px;height:26px;margin-right:auto}.ogl_sumTable{grid-gap:3px;grid-column:1/-1;margin-top:20px;display:grid}.ogl_sumTable>*{grid-gap:3px;text-align:center;grid-template-columns:repeat(8,1fr);align-items:center;line-height:26px;display:grid}.ogl_sumTable>:first-child{font-size:20px!important}.ogl_sumTable>*>:not(.ogl_icon){background:var(--secondary);-webkit-border-radius:3px;border-radius:3px}.ogl_sumTable>*>:not(.ogl_icon):first-child{text-transform:capitalize}.ogl_sumTable .ogl_icon:before{margin:auto}.ogl_statsSettingsIcons{grid-gap:12px;background:#181d26;-webkit-border-radius:3px;border-radius:3px;margin-left:auto;padding:5px 26px 5px 8px;display:flex;position:absolute;top:-8px;right:0}.ogl_statsSettingsIcons>*{grid-gap:3px;justify-content:center;align-items:center;display:flex;position:relative}.ogl_statsSettingsIcons span{font-size:10px;position:absolute;top:9px;left:12px}.ogl_statsSettingsIcons .material-icons{color:#566279;position:relative;font-size:18px!important}.ogl_statsSettingsIcons .ogl_bool:after{color:#22bda2;content:"\\f103";text-shadow:-2px -1px 1px #000;font-size:12px;font-weight:700;display:block;position:absolute;top:48%;left:54%}.ogl_statsSettingsIcons .ogl_bool.ogl_active:after{color:red;content:"\\f13e"}.ogl_recap{background:var(--tertiary);cursor:pointer;user-select:none;z-index:11;-webkit-border-radius:3px;border-radius:3px;margin-top:3px;padding:10px 6px;position:relative;box-shadow:0 0 20px -5px #000,0 0 0 1px #17191c}.ogl_recap:hover{box-shadow:0 0 0 2px var(--ogl)}.ogl_recap>div{font-size:11px;font-weight:700}.ogl_recap .ogl_icon{text-align:right;background:0 0;grid-template-columns:28px auto 65px;display:grid}.ogl_recap .ogl_icon>:last-child{letter-spacing:-.03em;opacity:.5;font-size:10px}.ogl_recap .ogl_icon:before{vertical-align:bottom;height:14px}.ogl_shortCutWrapper{box-sizing:border-box;pointer-events:none;text-transform:uppercase;z-index:10;flex-direction:column;justify-content:center;width:100vw;height:calc(100dvh - 25px);display:flex;position:fixed;top:0;left:0}.ogl_shortCutWrapper>div:first-child{flex:1}.ogl_shortcuts{grid-gap:7px;flex-wrap:wrap;justify-content:center;display:flex}#planetbarcomponent #rechts .ogl_shortcuts{grid-gap:6px;justify-content:center;width:206px;margin-top:8px;transform:translate(-8px)}#planetbarcomponent #rechts .ogl_shortcuts .ogl_separator{display:none}.ogl_shortcuts *{z-index:1}.ogl_shortcuts [data-key]{grid-gap:2px;pointer-events:all;text-transform:uppercase;white-space:nowrap;justify-content:space-evenly;align-items:center;width:40px;font-size:11px;line-height:26px;display:inline-flex;position:relative;overflow:hidden;box-shadow:0 0 5px rgba(0,0,0,.6)}#planetbarcomponent #rechts .ogl_shortcuts [data-key]{width:33px}.ogl_shortcuts [data-key-id]:after{order:-1;font-family:Material Icons;font-size:16px!important}.ogl_shortcuts [data-key-id=menu]:after{content:"\\f10a"}.ogl_shortcuts [data-key-id=showMenuResources]:after{content:"\\f10f"}.ogl_shortcuts [data-key-id=previousPlanet]:after{content:"\\f14d"}.ogl_shortcuts [data-key-id=nextPlanet]:after{content:"\\f14c"}.ogl_shortcuts [data-key-id=expeditionSC]:after{color:var(--mission15);content:"\\f115"}.ogl_shortcuts [data-key-id=expeditionLC]:after{color:var(--mission15);content:"\\f115"}.ogl_shortcuts [data-key-id=expeditionPF]:after{color:var(--mission15);content:"\\f115"}.ogl_shortcuts [data-key-id=fleetRepeat]:after{content:"\\f14e"}.ogl_shortcuts [data-key-id=fleetSelectAll]:after{color:#ffab43;content:"\\f133"}.ogl_shortcuts [data-key-id=fleetReverseAll]:after{content:"\\f14f"}.ogl_shortcuts [data-key-id=backFirstFleet]:after{content:"\\f158"}.ogl_shortcuts [data-key-id=backLastFleet]:after{content:"\\f158"}.ogl_shortcuts [data-key-id=galaxyUp]:after{color:#30ba44;content:"\\f157"}.ogl_shortcuts [data-key-id=galaxyDown]:after{color:#30ba44;content:"\\f154"}.ogl_shortcuts [data-key-id=galaxyLeft]:after{color:#30ba44;content:"\\f155"}.ogl_shortcuts [data-key-id=galaxyRight]:after{color:#30ba44;content:"\\f156"}.ogl_shortcuts [data-key-id=galaxyReload]:after{content:"\\f151"}.ogl_shortcuts [data-key-id=discovery]:after{color:var(--lifeform);content:"\\f12c"}.ogl_shortcuts [data-key-id=galaxySpySystem]:after{color:var(--mission6);content:"\\f153"}.ogl_shortcuts [data-key-id=nextPinnedPosition]:after{content:"\\f120"}.ogl_shortcuts [data-key-id=fleetQuickCollect]:after{content:"\\f128"}.ogl_shortcuts .ogl_separator,fieldset .ogl_separator,.ogl_statsMonth .ogl_separator,.ogl_expeRecap .ogl_separator{background:#2e3840;-webkit-border-radius:50%;border-radius:50%;align-self:center;width:1px;height:1px;padding:2px}.ogl_shorcuts .ogl_button{box-shadow:0 1px 3px #000,0 1px 1px #405064}#technologydetails .build-it_wrap{transform-origin:100% 100%;transform:scale(.75)}#technologydetails .premium_info{font-size:14px}#technologydetails .information>ul{grid-gap:3px!important;flex-flow:row!important;width:auto!important;display:flex!important;position:absolute!important;top:auto!important;bottom:8px!important;left:1px!important}#technologydetails .information>ul li{background:var(--secondary);-webkit-border-radius:3px;border-radius:3px;padding:5px;margin-bottom:0!important}#technologydetails .build_duration,#technologydetails .additional_energy_consumption,#technologydetails .energy_production,#technologydetails .possible_build_start,#technologydetails .required_population,#technologydetails .research_laboratory_levels_sum{align-items:center;display:flex}#technologydetails .build_duration strong,#technologydetails .additional_energy_consumption strong,#technologydetails .energy_production strong,#technologydetails .possible_build_start strong,#technologydetails .required_population strong,#technologydetails .research_laboratory_levels_sum strong{font-size:0;display:inline-flex}#technologydetails .build_duration strong:before{margin-right:3px;font-family:Material Icons;font-size:16px;display:block}#technologydetails .additional_energy_consumption strong:before{margin-right:3px;font-family:Material Icons;font-size:16px;display:block}#technologydetails .energy_production strong:before{margin-right:3px;font-family:Material Icons;font-size:16px;display:block}#technologydetails .possible_build_start strong:before{margin-right:3px;font-family:Material Icons;font-size:16px;display:block}#technologydetails .required_population strong:before{margin-right:3px;font-family:Material Icons;font-size:16px;display:block}#technologydetails .research_laboratory_levels_sum strong:before{margin-right:3px;font-family:Material Icons;font-size:16px;display:block}#technologydetails .build_duration strong:before{color:var(--time);content:"\\f12d"}#technologydetails .possible_build_start strong:before{color:#ccc;content:"\\ea03"}#technologydetails .additional_energy_consumption strong:before{color:var(--energy);content:"\\f102"}#technologydetails .energy_production strong:before{color:var(--energy);content:"\\f102"}#technologydetails .required_population strong:before{color:var(--lifeform);content:"\\f12c"}#technologydetails .research_laboratory_levels_sum strong:before{color:#21d19f;content:"\\f143"}#technologydetails .energy_production .bonus{color:#fff}#technologydetails .build_amount{top:35px}#technologydetails .build_amount label{display:none}#technologydetails .build_amount .maximum{background:0 0!important;min-width:0!important;margin:0 0 0 5px!important;padding:0!important}#technologydetails .build_amount .maximum:before{display:none!important}#technologydetails_wrapper.ogl_active{display:block!important}#technologydetails_wrapper.ogl_active #technologydetails_content{position:initial!important;display:block!important}#technologydetails_content{background:#0d1014!important}#technologydetails>.description{background:var(--primary)}#technologydetails .costs{top:33px!important;left:5px!important}#technologydetails .costs .ipiHintable{display:none!important}#technologydetails .costs .ogl_costsWrapper{grid-gap:3px;font-weight:700;display:grid}#technologydetails .costs .ogl_costsWrapper div:first-child .material-icons{color:inherit!important}#technologydetails .costs .ogl_costsWrapper .ogl_icon{grid-gap:8px;text-align:center;grid-template-columns:28px 70px 70px 70px;align-items:center;padding:0;display:grid!important}#technologydetails .costs .ogl_costsWrapper .ogl_icon:before{margin:0}#technologydetails .costs .ogl_costsWrapper .ogl_icon>div{background:var(--secondary);color:inherit;-webkit-border-radius:3px;border-radius:3px;line-height:18px!important}#technologydetails .resource.icon{flex:1 1 0;white-space:nowrap!important;-webkit-border-radius:5px!important;border-radius:5px!important;width:auto!important;height:auto!important;margin:0!important;padding:2px!important;font-size:12px!important}#technologydetails .resource.icon .ogl_text,#technologydetails .resource.icon .ogl_danger{font-size:10px}#technologydetails .ogl_actions{grid-gap:5px;grid-template-columns:repeat(4,1fr);padding:5px;line-height:28px;display:grid}#technologydetails .ogl_actions .ogl_button{font-size:18px!important}#technologydetails .ogl_actions .ogl_button.ogl_active{box-shadow:0 0 0 2px var(--amber);color:var(--amber)!important}#technologydetails .information .material-icons{color:#fff;vertical-align:bottom;font-size:16px!important}#technologydetails .information .costs>p{display:none}#technologydetails .information b{font-size:16px}.tippy-box .ogl_settingsTooltip ul{list-style:inside square}.tippy-box .ogl_settingsTooltip b,.tippy-box .ogl_readableTooltip b{color:var(--ogl);font-weight:700}.tippy-box .ogl_fleetDetail,.ogl_ptreContent .ogl_fleetDetail{grid-gap:4px 10px;grid-template-columns:repeat(2,1fr);font-size:11px;display:grid!important}.ogl_ptreContent .ogl_fleetDetail{grid-template-columns:repeat(3,1fr);padding:15px 0}.ogl_fleetDetail>div{background:var(--secondary);text-align:right;white-space:nowrap;-webkit-border-radius:3px;border-radius:3px;min-width:70px;line-height:20px;padding:0 5px 0 0!important}.ogl_fleetDetail .ogl_metal,.ogl_fleetDetail .ogl_crystal,.ogl_fleetDetail .ogl_deut,.ogl_fleetDetail .ogl_food{grid-column:1/-1}.ogl_fleetDetail .ogl_icon{color:#7c95ab;grid-gap:10px;font-weight:700}.ogl_fleetDetail .ogl_icon:before{margin-right:auto}.ogl_fleetDetail .ogl_button .ogl_icon:before{float:left}.ogl_fleetDetail .ogl_button{color:#fff;text-align:center;user-select:none;line-height:22px}.ogl_fullgrid{grid-column:1/-1}.tippy-box .ogl_fleetDetail .ogl_fullgrid{grid-gap:7px;grid-template-columns:repeat(2,1fr);display:grid}.tippy-box .ogl_fleetDetail .ogl_button span{pointer-events:none}.tippy-box .ogl_fleetDetail .ogl_button{grid-gap:3px;border:1px solid #17191c;grid-template-columns:16px auto;justify-content:center;align-items:center;padding:2px 12px;display:flex;font-size:12px!important}.tippy-box .ogl_fleetDetail .ogl_button .material-icons{font-size:16px!important}#fleetboxmission .content{min-height:0!important}#fleet2 #missionNameWrapper,#fleet2 ul#missions span.textlabel{display:none!important}.ogl_todoList{grid-gap:30px;grid-template-columns:auto auto;align-items:center;display:grid}.ogl_todoList .ogl_tech{background:#0b0f12;border-bottom:1px solid #1c2630;-webkit-border-radius:3px;border-radius:3px;margin-bottom:10px;padding:7px;display:grid}.ogl_todoList h2{grid-column:1/-1}.ogl_todoList h3{color:#5d6f81;cursor:pointer;text-align:left;text-transform:capitalize;-webkit-border-radius:3px;border-radius:3px;align-items:center;font-size:12px;line-height:18px;display:flex;position:relative;overflow:hidden}.ogl_todoList h3:after{content:"\\f105";margin-left:auto;font-family:Material Icons}.ogl_todoList h3:hover{color:#fff}.ogl_todoList h3:not(:first-child){margin-top:20px}.ogl_todoList h3 b{color:var(--ogl)}.ogl_todoList hr{background:#1e252e;border:none;grid-column:1/-1;width:100%;height:2px}.ogl_todoList .ogl_line{grid-gap:8px;grid-template-columns:70px 114px 114px 114px 50px auto auto;transition:max-height .3s cubic-bezier(0,1,0,1);display:grid}.ogl_todoList div>.ogl_line:not(:first-child){max-height:0;overflow:hidden}.ogl_todoList .ogl_tech.ogl_active .ogl_line{max-height:28px;transition:max-height .1s ease-in-out}.ogl_todoList footer{border-top:2px solid #181f24;margin-top:3px}.ogl_todoList .ogl_line>*{background:var(--secondary);color:#849ab9;text-align:right;-webkit-border-radius:3px;border-radius:3px;align-items:center;margin-top:3px;padding-right:7px;display:flex}.ogl_todoList .ogl_line>:first-child{justify-content:center;padding-right:0;line-height:24px}.ogl_todoList .ogl_line .material-icons,.ogl_todoList .ogl_actions .material-icons{font-size:20px!important}.ogl_todoList .ogl_line .material-icons:hover{color:var(--ogl)!important}.ogl_todoList .ogl_line label{text-align:left}.ogl_todoList .ogl_line label:after{content:attr(data-order)}.ogl_todoList .ogl_line .ogl_icon:before{float:left}.ogl_todoList .ogl_line .ogl_textCenter{padding:0}.ogl_todoList .ogl_actions{grid-gap:7px;align-self:baseline;display:grid;position:sticky;top:0}.ogl_todoList .ogl_button{grid-gap:5px;align-items:center;padding:0 10px;display:flex}.ogl_todoList .ogl_button .material-icons{margin-left:auto}.ogl_removeTodo{color:#ff4f4f!important}.ogl_blockRecap>:last-child{color:#ff4f4f!important}.ogl_todoList .ogl_line button:hover{box-shadow:inset 0 0 0 2px var(--ogl);cursor:pointer}.originFleet *{color:inherit!important}.ogl_playerData .ogl_actions{grid-gap:2px;margin-bottom:10px;display:flex}.ogl_playerData .ogl_actions .ogl_button{border:1px solid #17191c;-webkit-border-radius:5px;border-radius:5px;width:100%;font-size:16px!important}.ogl_playerData .ogl_grid{grid-gap:12px;grid-template-columns:repeat(2,1fr);display:grid}.ogl_playerData .ogl_tagSelector{grid-column:1/-1}.ogl_playerData .ogl_leftSide{background:#101418;-webkit-border-radius:5px;border-radius:5px;padding:7px;font-size:12px}.ogl_playerData h1{background:var(--primary);text-align:center;width:fit-content;border:2px solid #202834;-webkit-border-radius:50px;border-radius:50px;width:-moz-fit-content;margin:0 auto 14px;padding:3px 12px;font-size:14px}.ogl_playerData h1:before{content:"";background:red;height:2px}.ogl_playerData h1 a{font-size:12px;text-decoration:none}.ogl_playerData h1 a:hover{color:var(--ogl)}.ogl_score{grid-gap:3px;display:grid}.ogl_score .material-icons{font-size:16px!important;line-height:20px!important}.ogl_score .ogl_line{background:var(--secondary);grid-gap:3px;-webkit-border-radius:5px;border-radius:5px;grid-template-columns:20px auto;padding:1px 5px;display:grid}.ogl_score .ogl_line div{text-align:right;line-height:20px}.ogl_score .ogl_line:first-child{color:#f9c846}.ogl_score .ogl_line:nth-child(2){color:#6dd0ff}.ogl_score .ogl_line:nth-child(3){color:#21d19f}.ogl_score .ogl_line:nth-child(4){color:var(--lifeform)}.ogl_score .ogl_line:nth-child(5){color:#ff4646}.ogl_score .ogl_line:nth-child(6){color:#f96e46}.ogl_score .ogl_line:nth-child(7){color:#bfbfbf}.ogl_pinDetail .ogl_score .ogl_line:nth-child(7){color:#8b84ff;grid-column:1/-1}.ogl_playerData .ogl_planetStalk{grid-gap:3px;background:#101418;-webkit-border-radius:5px;border-radius:5px;flex-direction:column;padding:7px;display:flex}.ogl_playerData .ogl_planetStalk>div{grid-gap:3px;grid-template-columns:24px auto 22px 22px 22px;font-size:12px;display:grid;position:relative}.ogl_playerData .ogl_planetStalk>div:last-child{border:none}.ogl_playerData .ogl_planetStalk>div>*{background:var(--secondary);-webkit-border-radius:3px;border-radius:3px;justify-content:center;align-items:center;padding:0 5px;line-height:22px;display:flex}.ogl_playerData .ogl_tagPicker{pointer-events:none!important;background:0 0!important}.ogl_playerData .ogl_tagPicker:before{content:"fiber_manual_record"!important}.ogl_playerData .ogl_planetStalk [data-galaxy]{justify-content:left}.ogl_home [data-galaxy]:before{color:#fff;content:"\\f109";margin-right:5px;font-family:Material Icons;text-decoration:none;display:inline-block}.ogl_playerData .ogl_planetStalk .ogl_spyIcon{color:#687a89;font-size:15px!important}.ogl_playerData .ogl_planetStalk .ogl_spyIcon:hover{color:#fff}#jumpgate .ship_input_row{position:relative}#jumpgate .ogl_keepRecap{color:#f45757;background:#4c1b1b;-webkit-border-radius:4px;border-radius:4px;padding:2px 4px;font-size:10px;position:absolute;bottom:0;right:0}#jumpgate .ship_input_row input{text-align:left}.eventFleet .tooltip{color:inherit}.galaxyTable .ogl_flagPicker{margin-left:3px}.ogl_flagPicker,.ogl_flagSelector{cursor:pointer;min-height:19px;font-size:19px!important}.ogl_flagSelector>*{justify-content:center;align-items:center;display:grid}.ogl_tooltip .ogl_flagSelector>*{height:100%;min-height:19px}.ogl_flagPicker:before{color:#4e5c68;content:"keep"}.ogl_flagSelector [data-flag=none]:before{color:#4e5c68;content:"keep"}.ogl_flagPicker[data-flag=friend]:before{color:#ff78cf;content:"handshake"}.ogl_flagSelector [data-flag=friend]:before{color:#ff78cf;content:"handshake"}.ogl_flagPicker[data-flag=danger]:before{color:#ff4343;content:"warning"}.ogl_flagSelector [data-flag=danger]:before{color:#ff4343;content:"warning"}.ogl_flagPicker[data-flag=skull]:before{color:#e9e9e9;content:"skull"}.ogl_flagSelector [data-flag=skull]:before{color:#e9e9e9;content:"skull"}.ogl_flagPicker[data-flag=rush]:before{color:#6cddff;content:"electric_bolt"}.ogl_flagSelector [data-flag=rush]:before{color:#6cddff;content:"electric_bolt"}.ogl_flagPicker[data-flag=fridge]:before{color:#667eff;content:"kitchen"}.ogl_flagSelector [data-flag=fridge]:before{color:#667eff;content:"kitchen"}.ogl_flagPicker[data-flag=star]:before{color:#ffd745;content:"star"}.ogl_flagSelector [data-flag=star]:before{color:#ffd745;content:"star"}.ogl_flagPicker[data-flag=trade]:before{color:#32db9d;content:"local_gas_station"}.ogl_flagSelector [data-flag=trade]:before{color:#32db9d;content:"local_gas_station"}.ogl_flagPicker[data-flag=money]:before{color:#ab7b65;content:"euro_symbol"}.ogl_flagSelector [data-flag=money]:before{color:#ab7b65;content:"euro_symbol"}.ogl_flagPicker[data-flag=ptre]:before{color:#ff942c;content:"ptre"}.ogl_flagSelector [data-flag=ptre]:before{color:#ff942c;content:"ptre"}.ogl_flagPicker[data-flag=recent]:before{color:#41576c;content:"schedule"}.ogl_flagSelector [data-flag=recent]:before{color:#41576c;content:"schedule"}.ogl_flagPicker:hover{filter:brightness(1.3)}.ogl_flagSelector [data-flag]:hover{filter:brightness(1.3)}.ogl_tagPicker:hover{filter:brightness(1.3)}.ogl_tagSelector [data-tag]:hover{filter:brightness(1.3)}.ogl_flagSelector [data-flag]:hover:after{content:"";border-top:6px solid #fff;border-left:5px solid transparent;border-right:5px solid transparent;position:absolute;top:-8px;left:50%;transform:translate(-50%)}.ogl_tagSelector [data-tag]:hover:after{content:"";border-top:6px solid #fff;border-left:5px solid transparent;border-right:5px solid transparent;position:absolute;top:-8px;left:50%;transform:translate(-50%)}.tippy-content .ogl_flagSelector,.tippy-content .ogl_tagSelector{grid-gap:4px 10px;grid-auto-flow:column;justify-content:center;align-items:center;display:flex!important}.ogl_tooltip>div.ogl_flagSelector:not(.ogl_tooltipTriangle):not(.ogl_close){grid-gap:4px 10px;grid-auto-flow:column;justify-content:center;align-items:center;display:flex!important}.ogl_tooltip>div.ogl_tagSelector:not(.ogl_tooltipTriangle):not(.ogl_close){grid-gap:4px 10px;grid-auto-flow:column;justify-content:center;align-items:center;display:flex!important}.ogl_tagPicker,.ogl_tagSelector{cursor:pointer;user-select:none;font-size:19px!important}.ogl_tagPicker:before{content:"stroke_full"}.ogl_tagSelector [data-tag]:before{content:"stroke_full"}.ogl_tagPicker:before{color:#4e5c68}.ogl_tagSelector [data-tag=none]:before{color:#4e5c68}.ogl_tagPicker[data-tag=red]:before{color:#eb3b5a}.ogl_tagSelector [data-tag=red]:before{color:#eb3b5a}.ogl_tagPicker[data-tag=orange]:before{color:#fa8231}.ogl_tagSelector [data-tag=orange]:before{color:#fa8231}.ogl_tagPicker[data-tag=yellow]:before{color:#f7b731}.ogl_tagSelector [data-tag=yellow]:before{color:#f7b731}.ogl_tagPicker[data-tag=lime]:before{color:#7bbf20}.ogl_tagSelector [data-tag=lime]:before{color:#7bbf20}.ogl_tagPicker[data-tag=green]:before{color:#20bf6b}.ogl_tagSelector [data-tag=green]:before{color:#20bf6b}.ogl_tagPicker[data-tag=blue]:before{color:#5bbde3}.ogl_tagSelector [data-tag=blue]:before{color:#5bbde3}.ogl_tagPicker[data-tag=dblue]:before{color:#3867d6}.ogl_tagSelector [data-tag=dblue]:before{color:#3867d6}.ogl_tagPicker[data-tag=violet]:before{color:#8854d0}.ogl_tagSelector [data-tag=violet]:before{color:#8854d0}.ogl_tagPicker[data-tag=magenta]:before{color:#f95692}.ogl_tagSelector [data-tag=magenta]:before{color:#f95692}.ogl_tagPicker[data-tag=pink]:before{color:#fda7df}.ogl_tagSelector [data-tag=pink]:before{color:#fda7df}.ogl_tagPicker[data-tag=brown]:before{color:#996c5c}.ogl_tagSelector [data-tag=brown]:before{color:#996c5c}.ogl_tagPicker[data-tag=gray]:before{color:#75a1b7}.ogl_tagSelector [data-tag=gray]:before{color:#75a1b7}[data-tag].ogl_off{opacity:.2}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=red]){box-shadow:inset 0 0 100px rgba(255,0,0,.2)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=orange]){box-shadow:inset 0 0 100px rgba(235,108,59,.3)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=yellow]){box-shadow:inset 0 0 100px rgba(235,181,59,.3)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=lime]){box-shadow:inset 0 0 100px rgba(167,235,59,.2)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=green]){box-shadow:inset 0 0 100px rgba(59,235,89,.3)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=blue]){box-shadow:inset 0 0 100px rgba(59,162,235,.3)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=dblue]){box-shadow:inset 0 0 100px rgba(59,81,235,.3)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=violet]){box-shadow:inset 0 0 100px rgba(110,59,235,.3)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=magenta]){box-shadow:inset 0 0 100px rgba(235,59,165,.3)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=pink]){box-shadow:inset 0 0 100px rgba(255,124,179,.3)}#galaxyContent .ctContentRow .galaxyCell:has([data-tag=brown]){box-shadow:inset 0 0 100px rgba(149,111,89,.3)}.galaxyRow:has([data-tag=gray]){opacity:.2}.galaxyTable .ogl_tagPicker,.ogl_spytable .ogl_tagPicker{margin-left:auto}.galaxyTable .phalanxlink{margin-left:auto!important}.galaxyTable .phalanxlink+.ogl_tagPicker{margin-left:1px}.ogl_list{grid-gap:3px;background:#0e1116;padding:10px;display:grid}.ogl_list .ogl_emptyList{padding:10px}.ogl_list>div{grid-gap:4px;-webkit-border-radius:3px;border-radius:3px;align-items:center;display:grid;position:relative}.ogl_list>div>:not(.ogl_button){background:var(--secondary);-webkit-border-radius:3px;border-radius:3px;justify-content:center;align-items:center;padding:0 5px;display:flex;line-height:24px!important}.ogl_list>div>.ogl_flagPicker{padding:0}.ogl_pinned .ogl_list>div{grid-template-columns:auto 70px 30px 30px}.ogl_pinned .ogl_list>div>:first-child{justify-content:left}.ogl_pinned .ogl_list .ogl_grid{grid-template-columns:repeat(2,1fr);display:grid}.ogl_pinned .ogl_list .material-icons{cursor:pointer;user-select:none;text-align:right;height:24px!important;font-size:17px!important}.ogl_pinned .ogl_list .material-icons:hover{filter:brightness(1.3)}.ogl_pinned .ogl_list .material-icons:last-child{color:#915454}.ogl_pinned .ogl_detail{cursor:pointer}.ogl_pinned .ogl_detail:hover{color:#fff}.ogl_pinned .ogl_tabs{text-align:center;grid-template-columns:repeat(9,1fr);justify-content:space-between;display:flex}.ogl_pinned .ogl_tabs>[data-flag]{justify-content:center;align-items:center;padding:5px 7px 7px;display:grid}.ogl_pinned .ogl_tabs .ogl_active{background:#0e1116;-webkit-border-radius:3px 3px 0 0;border-radius:3px 3px 0 0}.ogl_pinned span:hover{cursor:pointer;text-decoration:underline}.ogl_expeditionFiller{grid-template-columns:repeat(8,1fr);display:grid}.ogl_expeditionFiller h2{grid-column:1/-1}.ogl_expeditionFiller .ogl_icon:before{width:38px;height:38px}.ogl_expeditionFiller .ogl_icon:hover:before{cursor:pointer;box-shadow:0 0 0 2px var(--ogl)}.ogl_expeditionFiller .ogl_icon.ogl_active:before{box-shadow:0 0 0 2px #fff}.ogl_wrapperloading{background:rgba(0,0,0,.7);justify-content:center;align-items:center;width:100%;height:100%;display:flex}.ogl_loading{background:conic-gradient(rgba(255,255,255,0),var(--ogl));-webkit-border-radius:50%;border-radius:50%;width:25px;height:25px;animation:.75s linear infinite spinAlt;mask:radial-gradient(transparent 40%,#fff 43%,#fff 0)}@keyframes spinAlt{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.ogl_pinDetail h2{grid-gap:5px;display:flex}.ogl_pinDetail h2 .ogl_flagPicker{margin:0}.ogl_pinDetail .ogl_actions{grid-gap:3px;margin-bottom:20px;display:flex}.ogl_pinDetail .ogl_actions .ogl_button{flex:1;justify-content:center;align-items:center;display:grid;font-size:16px!important}.ogl_pinDetail .ogl_score{grid-template-columns:repeat(2,1fr);margin-bottom:20px}.ogl_pinDetail .ogl_score>div{padding:4px 5px}.ogl_pinDetail .ogl_list>div{grid-template-columns:20px auto 60px 38px 38px 67px}.ogl_pinDetail .ogl_list [data-galaxy]{justify-content:left}.ogl_pinDetail .ogl_list .ogl_spyIcon{color:#687a89;justify-content:space-between;padding:0 3px;font-size:16px!important}.ogl_pinDetail .ogl_list .ogl_spyIcon:hover{color:#fff}.ogl_spyIcon{align-items:center;display:flex;cursor:pointer!important}.ogl_spyIcon span{margin-left:3px;font-family:Verdana,Arial,SunSans-Regular,sans-serif;font-size:11px}.ogl_spyIcon.ogl_attacked:before{content:"send";color:var(--mission1);pointer-events:none;text-shadow:1px 2px 3px #000;font-family:Material Icons;display:block;position:absolute;bottom:-6px;left:-3px;font-size:18px!important}[data-debris-coords].ogl_attacked:before{content:"send";color:var(--mission1);pointer-events:none;text-shadow:1px 2px 3px #000;font-family:Material Icons;display:block;position:absolute;bottom:-6px;left:-3px;font-size:18px!important}[data-debris-coords]{position:relative}[data-debris-coords]:before{color:var(--mission8)!important}.ogl_pinDetail date{grid-gap:5px;font-size:10px;display:grid}.ogl_pinDetail date span:first-child{color:var(--date)}.ogl_pinDetail date span:nth-child(2){color:var(--time)}.ogl_nextQuickTarget{color:#687a89;font-size:16px!important}.ogl_nextQuickTarget.ogl_active{color:var(--red)}.ogl_tagged .ogl_grid{grid-gap:5px;justify-content:end;align-items:center;display:flex}.ogl_tagged .ogl_grid label{align-items:center;display:flex}.ogl_tagged .ogl_list>div{grid-template-columns:30px auto 30px 30px 30px 30px}.ogl_tagged .ogl_list>div>div:first-child{text-align:center}.ogl_tagged .ogl_list .ogl_spyIcon{color:#687a89;font-size:16px!important}.ogl_tagged .ogl_list .ogl_spyIcon:hover{color:#fff}.ogl_tagged .ogl_tabs,.ogl_playerData .ogl_tagSelector{grid-gap:12px 6px;text-align:center;margin-bottom:8px;display:flex}.ogl_tagged .ogl_tabs>*{flex:1}.ogl_playerData .ogl_tagSelector>*{flex:1}.ogl_tagged .ogl_actions{grid-gap:0 4px;grid-template-columns:repeat(15,1fr);align-items:center;display:grid}.ogl_tagged .ogl_actions input{box-shadow:none!important;color:#5d738d!important;background:#121518!important;border:none!important;border-top:1px solid #080b10!important;border-bottom:1px solid #212830!important;-webkit-border-radius:3px!important;border-radius:3px!important;font-weight:700!important}.ogl_tagged .ogl_actions label{cursor:pointer;background:linear-gradient(#405064,#2d3743 2px,#181e25);-webkit-border-radius:50px;border-radius:50px;justify-content:center;align-items:center;display:flex}.ogl_tagged .ogl_actions .material-icons{color:#7d8caa;cursor:default;text-align:center;user-select:none;font-size:16px!important}.ogl_tagged .ogl_actions input,.ogl_tagged .ogl_actions .ogl_button,.ogl_tagged .ogl_actions label{text-align:center;user-select:none;grid-column:span 2;align-self:flex-start;width:auto;line-height:24px!important}.ogl_tagged .ogl_actions .ogl_button,.ogl_tagged .ogl_list .ogl_button{cursor:pointer;text-align:center;user-select:none;grid-template-columns:auto;padding:0 4px;line-height:26px;display:inline-block}.ogl_tagged .ogl_actions .ogl_button:hover{color:#fff}.ogl_tagged .ogl_list .ogl_button:hover{color:#fff}.tippy-content:has(.ogl_planetTooltip){background:url(https://gf2.geo.gfsrv.net/cdn4e/d07c90d96bbc823d6d53953a94aacb.jpg) 50%/cover!important;padding:0!important}.ogl_planetTooltip{color:#fff;background:linear-gradient(rgba(74,126,251,.45),rgba(34,32,116,.4) 30px,rgba(3,3,10,.9));-webkit-border-radius:7px;border-radius:7px;width:175px;padding:22px;position:relative}.ogl_planetTooltip>div:first-child{align-items:center;display:grid}.ogl_planetTooltip [class*=ogl_lifeform]{border:2px solid var(--lifeform);background:#000;-webkit-border-radius:50%;border-radius:50%;position:absolute;top:70px;left:65%;box-shadow:0 0 5px 2px #000}.ogl_planetTooltip [class*=ogl_lifeform]:before{-webkit-border-radius:50%;border-radius:50%}.ogl_planetTooltip h3{font-size:15px}.ogl_planetTooltip h3 span{font-size:11px;display:inline}.ogl_planetTooltip img{filter:drop-shadow(2px 4px 6px #000);width:125px;height:125px;margin:0 auto 7px;display:block}.ogl_planetTooltip a{display:block}.ogl_planetTooltip a:hover{color:#fff!important}.ogl_planetTooltip .ogl_linkDiv{border-top:2px solid #233563;margin-top:7px;padding-top:7px}.ogl_planetTooltip .ogl_linkDiv a{color:#759eff}.ogl_planetTooltip h3{text-align:center}.ogl_planetTooltip .ogl_mineRecap{text-align:center;margin-top:5px;font-size:14px;font-weight:700}.ogl_planetTooltip .ogl_planetTooltipData{grid-gap:15px;justify-content:center;display:flex}.ogl_planetTooltip .ogl_planetTooltipData>*{grid-gap:4px;align-items:center;display:flex}.ogl_planetTooltip .ogl_planetTooltipData .material-icons{color:#546fff;font-size:14px!important}#empire #siteFooter .content,#siteFooter .content{width:1045px!important}.ogl_danger{color:#ff665b!important}.ogl_warning{color:var(--amber)!important}.ogl_caution{color:var(--yellow)!important}.ogl_ok{color:#77ddae!important}.ogl_ping{color:#aaa;align-items:center;font-size:10px;font-weight:700;display:flex;position:absolute;top:23px;right:0}.ogl_ping:before{content:"\\f173";margin-right:3px;font-family:Material Icons;font-size:12px;display:block}.secondcol>[class*=ogl_]{color:#fff;cursor:pointer;background:linear-gradient(#424e5e 50%,#222f3c 50%);justify-content:center;align-items:center;display:inline-flex;text-align:center!important;text-shadow:1px 1px #000!important;-webkit-border-radius:3px!important;border-radius:3px!important;width:32px!important;height:26px!important;font-size:20px!important;line-height:26px!important;text-decoration:none!important;transform:scale(1)!important}.secondcol>span>.material-icons{color:#fff;cursor:pointer;background:linear-gradient(#424e5e 50%,#222f3c 50%);justify-content:center;align-items:center;display:inline-flex;text-align:center!important;text-shadow:1px 1px #000!important;-webkit-border-radius:3px!important;border-radius:3px!important;width:32px!important;height:26px!important;font-size:20px!important;line-height:26px!important;text-decoration:none!important;transform:scale(1)!important}.secondcol>[class*=ogl_]:hover{filter:brightness(1.2);color:#ccc!important}.secondcol>span>.material-icons:hover{filter:brightness(1.2);color:#ccc!important}.secondcol .ogl_recordBtn{padding:0 3px 0 8px;width:auto!important;font-size:11px!important}.secondcol .ogl_recordBtn .material-icons{color:var(--red);font-size:16px!important}.secondcol #resetall.material-icons{background:linear-gradient(#812727 50%,#5c1515 50%)}.secondcol #sendall.material-icons{background:linear-gradient(#b76908 50%,#9b4a11 50%)}.ogl_tooltip>div.ogl_resourcesPreselection:not(.ogl_tooltipTriangle):not(.ogl_close){grid-gap:5px;display:grid!important}.ogl_tooltip>div.ogl_resourcesPreselection .ogl_icon{padding:0}.ogl_resourcesPreselection{grid-gap:5px;display:grid!important}.ogl_resourcesPreselection .ogl_icon{padding:0}.ogl_resourcesPreselection .ogl_icon:before{color:#ffc800;content:"chevron-double-right";text-align:center;text-shadow:1px 1px 2px #000;font-family:Material Icons;font-size:20px;line-height:18px}.ogl_resourcesPreselection hr{border:none;width:100%;height:2px}.ogl_resourcesPreselection .ogl_button{line-height:30px}[data-spy=prepare]{color:var(--amber)!important}[data-spy=done]{color:var(--teal)!important}[data-spy=fail]{color:var(--red)!important}[data-spy=recent]{color:var(--purple)!important}[data-spy]:not(.ogl_spyIcon){-webkit-border-radius:2px!important;border-radius:2px!important;box-shadow:0 0 0 2px!important}.expeditionDebrisSlotBox{align-items:center;box-shadow:none!important;box-sizing:border-box!important;border:none!important;flex-wrap:wrap!important;width:642px!important;padding:4px 16px!important;display:flex!important}.expeditionDebrisSlotBox.ogl_hidden,#expeditionDebrisSlotDebrisContainer{display:none!important}.expeditionDebrisSlotBox li{list-style:none}.expeditionDebrisSlotBox>div{grid-gap:20px;text-align:left;line-height:1.4;display:flex}.expeditionDebrisSlotBox a{color:var(--green1)}.expeditionDebrisSlotBox a:hover{text-decoration:underline}.ogl_expeditionRow{border-top:2px solid #1a2129;margin-top:5px;padding-top:5px;grid-gap:10px!important;width:100%!important}.ogl_expeditionRow.ogl_important{border:none;-webkit-border-radius:5px;border-radius:5px;padding:0}.ogl_expeditionRow>div:not(:last-child){display:flex}.ogl_expeditionRow *{white-space:nowrap}.ogl_expeditionText{line-height:24px}.ogl_expeditionDebris{grid-gap:10px;display:flex}.ogl_sideFleetTooltip:not(.ogl_tooltipTriangle):not(.ogl_close){grid-gap:2px;font-size:11px;max-width:800px!important;display:grid!important}.ogl_sideFleetIcon{grid-gap:5px;grid-template-columns:70px 28px 30px 70px 60px 20px 30px 70px 98px 98px 98px;justify-content:center;align-items:center;display:grid}.ogl_sideFleetIcon>:not(img){background:var(--secondary);-webkit-border-radius:3px;border-radius:3px}.ogl_sideFleetIcon>:not(img):not(.ogl_icon){text-align:center;padding:0 3px;line-height:24px}.ogl_sideFleetIcon .material-icons{color:#fff;font-size:14px!important;line-height:24px!important}.ogl_sideFleetIcon>span{color:#fff}.ogl_sideFleetIcon .ogl_icon[class*=ogl_mission]:before{width:18px;background-size:200px!important;margin:auto!important}.ogl_sideFleetIcon .ogl_icon.ogl_mission18:before{background-size:18px!important}[data-return-flight=true]>:not(.ogl_clockNotif){opacity:.5;background-color:rgba(0,0,0,.7)}#phalanxEventContent [data-return-flight=true]{filter:brightness(.6)}#phalanxEventContent [data-return-flight=true]>:not(.ogl_clockNotif){opacity:1;background:0 0}#movementcomponent .starStreak .route{color:#aaa;text-align:center}#movementcomponent .starStreak .route b{color:#fff;font-weight:400}.msg gradient-button .custom_btn{border:none!important}gradient-button img{pointer-events:none!important}.msg:has(.ogl_checked) message-footer-details{margin-right:48px}.ogl_messageButton{cursor:pointer;float:left;text-align:center;-webkit-border-radius:5px;border-radius:5px;width:28px;height:28px;font-weight:700;box-shadow:0 2px 3px 1px rgba(0,0,0,.55);color:#9ea5af!important;background:linear-gradient(160deg,#364d63 0%,#283948 33%,#141e26 66%,#121a21 100%)!important;font-size:20px!important;line-height:28px!important}.ogl_messageButton:hover{box-shadow:0 0 transparent;background:linear-gradient(160deg,#436b91 0%,#344c61 33%,#283a47 66%,#141a20 100%)!important}message-footer-actions gradient-button[sq30]{width:26px!important;height:26px!important}.ogl_messageButton.ogl_ignore.ogl_active{color:#c65757!important}.ogl_messageButton.ogl_ignore:before{content:"toggle_off";font-family:Material Icons;font-size:18px!important}.ogl_messageButton.ogl_ignore.ogl_active:before{content:"toggle_on"}.ogl_messageButton.ogl_ignore:hover:after{display:inline-block}.ogl_resourcesDetail{grid-gap:5px;grid-template-columns:repeat(4,1fr);max-width:800px;display:grid!important}.ogl_resourcesDetail .ogl_group{border-bottom:2px solid #28303c;justify-content:center;align-items:center;gap:5px;margin-bottom:8px;padding-bottom:8px;display:flex}.ogl_resourcesDetail>div:last-child{grid-column:1/-1}.ogl_resourcesDetail>div:not(.ogl_close){background:var(--secondary);text-align:center;-webkit-border-radius:5px;border-radius:5px;padding:10px 15px;line-height:15px;position:relative}.ogl_resourcesDetail .ogl_todoDays>.ogl_unit+span{color:var(--ogl);font-size:11px}.ogl_resourcesDetail .ogl_todoDays>.ogl_unit+span:before{color:#6b7597;content:"- "}.ogl_resourcesDetail h3,.ogl_resourcesDetail h4{color:#9ea4af;display:block}.ogl_resourcesDetail h3{font-size:18px!important}.ogl_resourcesDetail h4{font-size:14px!important}[data-api-code]{cursor:pointer}.reversal{overflow:unset!important}.reversal a[data-key-color]:before{color:transparent;content:"\\f12f";pointer-events:none;text-shadow:-1px 1px 2px rgba(0,0,0,.4);font-family:Material Icons;font-size:11px;line-height:12px;position:absolute;top:-3px;right:-4px}.reversal a:before{top:0;right:-6px}.ogl_button[data-key-color=orange]:after{color:#ff7806}.ogl_button[data-key-color=violet]:after{color:#fa59fd}.ogl_button[data-key-color=blue]:after{color:var(--mission15)}.ogl_button[data-key-color=cyan]:after{color:#7bffed}.reversal a[data-key-color=orange]:before{color:#ff7806}.reversal a[data-key-color=violet]:before{color:#fa59fd}[data-key-color=undefined]:before{display:none!important}.resourceIcon .ogl_reverse{color:#b1c2cb;text-shadow:1px 2px #000;z-index:10;position:absolute;top:3px;right:5px;font-size:14px!important}.resourceIcon .ogl_reverse:hover{opacity:1}.resourceIcon .ogl_reverse{top:1px;right:2px}.ogl_notification{opacity:0;pointer-events:none;transform-origin:100%;z-index:1000003;background:#191f26;min-width:275px;max-height:500px;padding:14px 14px 11px;font-weight:700;transition:transform .2s;position:fixed;bottom:5px;right:5px;overflow-x:hidden;overflow-y:auto;transform:scaleX(0);box-shadow:0 0 20px 10px rgba(0,0,0,.7)}.ogl_notification.ogl_active{opacity:1;pointer-events:all;transform:scaleX(1)}.ogl_notificationLine{grid-gap:7px;border-bottom:1px solid #2b3a42;max-width:380px;padding:8px 0;font-size:11px;line-height:15px;display:flex}.ogl_notificationLine:last-child{border:none}.ogl_notification>div>:last-child>hr:last-child{display:none}.ogl_notification progress{appearance:none;width:100%;height:3px;position:absolute;top:0;left:0}.ogl_notification progress::-webkit-progress-value{appearance:none;background:var(--ogl);transition:width .2s linear}.ogl_notification progress::-moz-progress-bar{appearance:none;background:var(--amber);transition:width .2s linear}.ogl_notification .ogl_ok,.ogl_notification .ogl_danger{vertical-align:middle;margin-left:4px;font-size:12px!important}.ogl_notification h2{text-align:center;font-size:14px}.ogl_notification .ogl_grid{grid-gap:5px;grid-template-columns:repeat(2,1fr);max-width:275px;display:grid}.ogl_notification .ogl_icon{background:#1f2730;-webkit-border-radius:3px;border-radius:3px;align-items:center;display:flex}.ogl_notification .ogl_icon:before{margin-right:auto}.ogl_notification .ogl_icon[class*=lifeform]:before{image-rendering:auto;background-position-y:77%;background-size:335px;width:28px;height:18px}.ogl_notification .ogl_icon .ogl_suffix{text-indent:0}.ogl_notification .ogl_notificationTimer{color:var(--date);opacity:.5;margin-right:5px;font-size:11px;display:inline-block}.ogl_empireJumpgate{text-align:center;width:100%;margin-top:3px;font-size:20px!important}#eventboxContent .eventFleet,#eventboxContent .allianceAttack{grid-gap:2px;white-space:nowrap;z-index:1;grid-template-columns:82px 62px 23px 70px 87px auto 19px 87px 70px 20px 21px 20px;align-items:center;display:grid;position:relative}#eventboxContent .eventFleet:hover{z-index:2}#eventboxContent .eventFleet>td{box-sizing:border-box;text-align:center;-webkit-border-radius:2px;border-radius:2px;justify-content:left;align-items:center;width:100%;height:calc(100% - 2px);padding:2px 4px;display:flex;overflow:hidden;box-shadow:0 0 0 2px #110e1c,inset 0 10px rgba(255,255,255,.03)}#eventboxContent .eventFleet td.arrivalTime{justify-content:center}#eventboxContent .eventFleet td.coordsOrigin{justify-content:center}#eventboxContent .eventFleet td.destCoords{justify-content:center}#eventboxContent .eventFleet>td:not(.icon_movement):not(.icon_movement_reserve){padding:2px}#eventboxContent .eventFleet>td:nth-child(3){background:0 0!important}#eventboxContent .eventFleet>td:nth-child(5){grid-area:1/4}#eventboxContent .eventFleet>td:nth-child(10) span{display:flex!important}#eventboxContent .eventFleet>td:nth-child(11) span{display:flex!important}#eventboxContent .eventFleet>td:nth-child(12) span{display:flex!important}#eventboxContent .eventFleet>td a{text-decoration:none!important}#eventboxContent .eventFleet>td a:hover{color:var(--ogl)!important}.eventFleet [data-output-time]{justify-self:flex-start}.icon_movement,.icon_movement_reserve{background-position:50%!important}.originFleet,.destFleet{grid-gap:2px;justify-content:center;align-items:center;display:flex}.originFleet .tooltip[data-title]:not(figure){grid-gap:1px;align-items:center;font-size:0;display:inline-flex!important}.destFleet .tooltip[data-title]:not(figure){grid-gap:1px;align-items:center;font-size:0;display:inline-flex!important}.originFleet .tooltip[data-title]:not(figure):after{content:attr(data-title);text-overflow:ellipsis;font-size:11px;overflow:hidden}.destFleet .tooltip[data-title]:not(figure):after{content:attr(data-title);text-overflow:ellipsis;font-size:11px;overflow:hidden}.originFleet figure,.destFleet figure{flex-shrink:0}#technologydetails .ogl_queueShip{display:flex;position:absolute;top:52px}#technologydetails .ogl_queueShip .ogl_button{-webkit-border-radius:3px 0 0 3px;border-radius:3px 0 0 3px;width:60px}#technologydetails .ogl_queueShip input{box-shadow:none;box-sizing:border-box;color:#5d738d;text-align:left;background:#121518;border:none;border-top:1px solid #080b10;border-bottom:1px solid #242a32;-webkit-border-radius:0 3px 3px 0;border-radius:0 3px 3px 0;width:45px;padding:0 4px}.fleetDetails{overflow:unset!important;background:linear-gradient(#1a1d24,#0e1014 26px)!important;border:none!important;-webkit-border-radius:0!important;border-radius:0!important;width:96%!important;margin:12px 0 0 6px!important;padding:5px!important;line-height:18px!important;display:inline-block!important;position:relative!important;box-shadow:0 0 20px -5px #000,0 0 0 1px #000!important}.fleetDetails.detailsOpened{height:auto!important}.fleetDetails .starStreak,.fleetDetails .nextMission,.fleetDetails .mission,.fleetDetails.detailsClosed .ogl_shipsBlock,.fleetDetails.detailsClosed .ogl_resourcesBlock,.fleetDetails.detailsClosed .fedAttack,.fleetDetails.detailsClosed .sendMail,.fleetDetails .fleetDetailButton,.fleetDetails .marker01,.fleetDetails .marker02{display:none!important}.fleetDetails hr{background:#1e252e;border:none;height:2px}.fleetDetails .openDetails{position:absolute!important;top:-2px!important;left:auto!important;right:0!important}.fleetDetails.detailsOpened .timer{height:auto!important}.ogl_resourcesBlock{box-sizing:border-box;grid-gap:5px;text-wrap:nowrap;grid-template-columns:repeat(8,1fr);width:100%;margin-top:5px;font-size:11px;display:grid}.ogl_resourcesBlock .ogl_icon{background:#191d26;justify-content:end;margin:0;padding:3px}.ogl_resourcesBlock .ogl_icon:before{margin:0 auto 0 0;display:block}.ogl_shipsBlock{box-sizing:border-box;color:#fff;grid-template-columns:repeat(3,1fr);display:grid}.ogl_backTimer{box-sizing:border-box;text-align:right;grid-area:1/-3/auto/-1;align-items:center;padding:5px 32px 5px 5px;font-size:0;box-shadow:0 0 0 1px #000;line-height:14px!important}.ogl_backTimer:before{font-size:11px}.ogl_backTimer:after{font-size:11px}.ogl_backTimer:hover{box-shadow:0 0 0 2px var(--ogl);color:transparent!important}.fleetDetails .reversal_time{pointer-events:none!important;z-index:2!important;position:absolute!important;top:31px!important;left:auto!important;right:10px!important}.fleetDetails.detailsClosed .reversal_time{pointer-events:all!important;top:14px!important;right:0!important}.ogl_timeBlock{grid-gap:78px;-webkit-border-radius:3px;border-radius:3px;grid-template-columns:repeat(2,1fr);align-items:center;display:grid}.ogl_timeBlockLeft,.ogl_timeBlockRight{-webkit-border-radius:3px;border-radius:3px;grid-template-columns:70px 70px auto;justify-content:start;padding:1px;display:grid}.ogl_timeBlockRight{text-align:right;grid-template-columns:auto 70px 70px;justify-content:end}.ogl_timeBlock>div>*{text-align:inherit!important;width:auto!important;margin:0!important;padding:0!important;line-height:14px!important;position:relative!important;top:0!important;left:0!important}.ogl_timeBlock .tooltip{color:inherit!important}.ogl_timeBlock .originData,.ogl_timeBlock .destinationData{grid-gap:5px;justify-content:center;display:flex}.ogl_timeBlock .originPlanet,.ogl_timeBlock .destinationPlanet,.ogl_timeBlock .originCoords,.ogl_timeBlock .destinationCoords{padding:0!important;position:relative!important;left:0!important}.detailsOpened .destinationPlanet,.detailsClosed .destinationPlanet,.detailsOpened .originPlanet{width:auto!important}.ogl_actionsBlock{background:var(--tertiary);grid-gap:5px;z-index:2;-webkit-border-radius:3px;border-radius:3px;grid-template-columns:repeat(2,1fr);justify-content:center;align-items:center;padding:2px;display:grid;position:absolute;top:-5px;left:50%;transform:translate(-50%);box-shadow:0 3px 5px -2px #000}.ogl_actionsBlock *{justify-self:center;width:18px!important;margin:0!important;padding:0!important;position:relative!important;top:0!important;left:0!important}.ogl_actionsBlock .ogl_icon[class*=ogl_mission]:not(.ogl_mission18):before{background-size:212px!important}.ogl_actionsBlock .ogl_icon[class*=ogl_mission]:before{width:18px;margin:0}.fleetDetails .allianceName{top:-17px!important;bottom:auto!important;left:auto!important;right:3px!important}.ogl_phalanxLastRefresh{color:var(--ogl);margin-left:30px;font-size:11px}.ogl_universeName{color:#aeaac1;pointer-events:none;text-align:right;width:138px;font-size:12px;font-weight:700;line-height:12px;position:absolute;top:102px}.ogl_universeInfoTooltip{line-height:1.4}.ogl_universeInfoTooltip div{color:var(--amber);float:right;text-indent:10px;font-size:11px}.ogl_popup .ogl_frameSelector{grid-gap:5px;grid-template-columns:repeat(6,1fr);margin-bottom:10px;display:grid}.ogl_popup .ogl_frameSelector .ogl_button{min-width:80px}.ogl_popup .ogl_frameSelector .ogl_button.ogl_active{box-shadow:0 0 0 2px var(--ogl)}.ogl_ptreContent{grid-gap:10px;grid-template-columns:auto auto;display:grid}.ogl_ptreContent b{color:#ff4646;border-top:1px solid #1b222b;border-bottom:1px solid #1b222b;justify-content:center;align-items:center;margin-bottom:10px;padding:5px 0;font-size:12px;display:flex}.ogl_ptreContent b .material-icons{margin-right:5px;font-size:16px!important}.ogl_ptreContent h3{text-align:center;grid-column:1/-1;padding:8px;font-size:18px}.ogl_ptreContent hr{background:#151e28;border:none;grid-column:1/-1;width:100%;height:2px}.ogl_ptreActivityBlock,.ogl_ptreBestReport{background:rgba(0,0,0,.2);-webkit-border-radius:9px;border-radius:9px;padding:10px}.ogl_ptreLegend{color:var(--blue);text-align:left;margin-top:20px;font-size:10px}.ogl_ptreActivities [data-check]{background:currentColor;border:3px solid;-webkit-border-radius:50%;border-radius:50%;align-self:center;width:0;height:0;padding:4px}.ogl_ptreActivities [data-check].ogl_active{background:0 0}.ogl_ptreActivities>span{color:var(--red)}.ogl_ptreActivities>div{grid-gap:5px;grid-template-columns:repeat(12,1fr);display:grid}.ogl_ptreActivities>div>*{background:var(--secondary);color:#656f78;-webkit-border-radius:2px;border-radius:2px;align-items:center;height:45px;padding:3px;display:grid}.ogl_ptreActivities>div>*>*{margin:auto;display:inline-block}.ogl_ptreActivities .ptreDotStats{width:30px;height:30px;position:relative}.ogl_ptreContent{text-align:center}.ogl_ptreBestReport>div:first-child{padding:10px}.ogl_checked{justify-content:center;align-items:center;width:24px;height:28px;display:flex;position:absolute;bottom:5px;right:5px;color:#4d5e78!important;font-size:20px!important}.ogl_log>div:not(.ogl_close):not(.ogl_share){border-bottom:1px solid #20262c;grid-template-columns:100px 100px 300px;margin-top:5px;padding-bottom:5px;display:grid}.ogl_log h2{grid-column:1/-1}.ogl_ptreActionIcon{justify-content:center;align-items:center;display:inline-flex}.ogl_ptreActionIcon i{color:inherit;font-size:12px!important}.ogl_ptreActionIcon i.ogl_active{animation:1.5s linear infinite blink}@keyframes blink{50%{opacity:0}}.ogl_leftMenuIcon{user-select:none;text-align:center;background:linear-gradient(#1b2024 50%,#000 50%);-webkit-border-radius:4px;border-radius:4px;height:27px;margin-right:11px;display:block;width:27px!important}.ogl_leftMenuIcon a{justify-content:center;align-items:center;height:100%;color:#353a3c!important;display:flex!important}.ogl_leftMenuIcon a i{font-size:21px!important;line-height:27px!important}.ogl_leftMenuIcon a:hover{color:#d39343!important}.ogl_resourceBoxStorage{pointer-events:none;width:100%;font-size:10px;display:none;position:absolute;top:12px;left:0}#resources:hover .ogl_resourceBoxStorage{display:block}#resources:hover .resource_tile .resourceIcon.metal{box-shadow:inset 0 0 0 20px rgba(0,0,0,.8)}#resources:hover .resource_tile .resourceIcon.crystal{box-shadow:inset 0 0 0 20px rgba(0,0,0,.8)}#resources:hover .resource_tile .resourceIcon.deuterium{box-shadow:inset 0 0 0 20px rgba(0,0,0,.8)}.ogl_manageData .ogl_grid{grid-gap:3px;display:grid}.ogl_manageData .ogl_button{grid-gap:6px;justify-content:center;align-items:center;width:100%;padding:11px 0;display:grid;line-height:18px!important}.ogl_manageData .ogl_button .material-icons{font-size:22px!important}.ogl_manageData .ogl_button.ogl_danger:hover{color:var(--ogl)!important}.ogl_manageData .ogl_dangerZone{border:2px solid var(--red);background:#241313;-webkit-border-radius:3px;border-radius:3px;margin-top:14px;padding:16px}.ogl_manageData .ogl_dangerZone .ogl_button{width:240px}.ogl_manageData hr{background:#151e28;border:none;grid-column:1/-1;width:100%;height:2px}.chat_msg .msg_date,.detail_msg .msg_date{position:absolute}.ogl_acsInfo .value span{margin-left:5px}.ogl_blackHoleButton{width:28px;position:absolute;top:0;right:-3px;transform:translate(100%);font-size:16px!important}.ogl_blackhole .ogl_button{float:right;width:70px;margin-top:10px}.ogl_buildIconList{grid-gap:2px;pointer-events:none;display:flex;position:absolute;bottom:1px;left:18px;box-shadow:0 0 12px 1px #000}.ogl_buildIcon{color:red;background:currentColor;-webkit-border-radius:2px;border-radius:2px;width:10px;height:2px;padding:0!important}.ogl_buildIcon[data-type=building]{color:#ff8200}.ogl_buildIcon[data-type=research]{color:#32fb2f}.ogl_buildIcon[data-type=ship]{color:#ffeb00}.ogl_buildIcon[data-type=lfbuilding]{color:#ff79bd}.ogl_buildIcon[data-type=lfresearch]{color:#42afff}.smallplanet .constructionIcon{display:none!important}.ogl_buildList:has(li){margin-top:5px}.ogl_buildList li{align-items:center;display:flex}.ogl_buildList li span{max-width:100px;display:inline-block}.ogl_buildList .material-icons{margin:0 7px}.ogl_buildList .material-icons:first-child{margin:0 4px 0 0;font-size:8px!important}.ogl_buildList b{color:var(--amber);font-size:12px;font-weight:700}[data-debug]{position:relative}[data-debug]:after{content:attr(data-debug);opacity:.8;text-shadow:1px 1px #000;background:rgba(0,0,0,.7);width:max-content;display:block;position:absolute;top:12px;left:0;color:#ff0!important}.ogl_datePicker{grid-gap:10px;user-select:none;grid-template-columns:repeat(3,1fr);display:grid!important}.ogl_datePicker .ogl_dateItem{justify-content:center;align-items:center;font-size:14px;display:flex}.ogl_datePicker .material-icons{font-size:16px!important}#jumpgate #selecttarget select{visibility:visible!important;display:block!important}#jumpgate #selecttarget .dropdown{display:none!important}#jumpgate select{padding:2px!important;font-size:12px!important}.ogl_boardMessageTab{padding:7px 8px 0;position:relative}.ogl_boardMessageTab .newMessagesCount{color:#fff;text-align:center;background-color:#242d37;border:1px solid #40c4c1;-webkit-border-radius:8px;border-radius:8px;min-width:16px;height:16px;padding:0 2px;font-size:9px;line-height:16px;position:absolute;top:-3px;right:-3px;box-shadow:0 2px 4px rgba(0,0,0,.75)}.ogl_boardMessageTab.marker{background:url(https://gf1.geo.gfsrv.net/cdn69/112960c1ace80c7dcb03ca88d4b6fc.png) no-repeat}.ogl_boardMessageTab .tabLabel{margin-top:6px}.ogl_boardMessageTab .material-icons{color:transparent;background:linear-gradient(#d7dfe5 50%,#d4d9dd 50%) text;justify-content:center;align-items:center;width:100%;height:100%;margin-bottom:4px;display:flex;font-size:38px!important}.ogl_boardMessageTab .tabImage{cursor:pointer!important;background:linear-gradient(135deg,#375063 33.33%,#23394a 33.33%,#23394a 50%,#375063 50%,#375063 83.33%,#23394a 83.33%,#23394a 100%) 0 0/3px 3px!important;border:1px solid #385365!important;border-left:2px solid #3c596c!important;border-right:2px solid #3c596c!important;-webkit-border-radius:7px!important;border-radius:7px!important;width:48px!important;height:50px!important;margin-top:1px!important;text-decoration:none!important;position:relative!important;box-shadow:inset 0 0 10px 6px #1c2831,0 0 1px 1px #000!important}.ogl_boardMessageTab .tabImage:hover{filter:brightness(1.2)}.ogl_boardMessageTab .tabImage:before{content:"";filter:blur(.5px);opacity:.6;background:#395467;-webkit-border-radius:6px;border-radius:6px;height:calc(50% + 2px);position:absolute;top:-2px;left:0;right:0}.ogl_boardMessageTab .tabImage:after{content:"";filter:blur(1px);opacity:.6;background:#395467;-webkit-border-radius:7px;border-radius:7px;height:4px;position:absolute;bottom:2px;left:3px;right:3px}.ogl_boardMessageTab.ui-tabs-active .marker{top:-9px!important;left:-10px!important}#oglBoardTab *{max-width:100%}#oglBoardTab .msg{padding:10px}#oglBoardTab .msg_content{margin-top:10px;padding:0}#oglBoardTab .msg_content>ul li{margin-bottom:10px}#oglBoardTab .msg_title{line-height:15px;display:inline-block!important}#oglBoardTab .msg_title:hover{color:#fff;cursor:pointer;text-decoration:underline}#oglBoardTab .msg_title i{color:var(--pink)}#oglBoardTab .spoilerBox{display:none!important}.ogl_sidenote{color:#aaa;font-style:italic}.ogl_shipDataInfo .material-icons{color:#7ca8ad;vertical-align:middle;font-size:18px!important}.ogl_shipDataInfo b{color:var(--ogl)}.ogl_totalRequired{background:var(--primary);-webkit-border-radius:3px;border-radius:3px;margin-top:10px;padding:10px}.ogl_totalRequired h3{pointer-events:none;text-align:center}.ogl_totalRequired h3:after{content:none}.ogl_totalRequired .ogl_200:before{visibility:hidden}.ogl_totalRequired .ogl_grid{display:flex}.ogl_totalRequired .ogl_icon{grid-gap:8px;text-align:center;display:grid}.ogl_totalRequired .ogl_icon:before{margin:auto}.shipyardSelection{background:var(--primary);padding:10px;width:auto!important}.ogl_timeBox{margin-top:5px;display:block}.ogl_lineBreakFlex{flex-basis:100%;height:0}#messagecontainercomponent .msgHead{padding:5px 5px 0 8px!important}.msg:not(:has([data-raw-messagetype="65"],[data-raw-messagetype="68"])) .content-box{display:none!important}.msg:has([data-raw-messagetype="25"]){box-shadow:inset 3px 0 var(--mission1)!important}.msg:has([data-raw-messagetype="41"]){box-shadow:inset 3px 0 var(--mission15)!important}.msg:has([data-raw-messagetype="61"]){box-shadow:inset 3px 0 var(--lifeform)!important}.msg:has([data-raw-messagetype="32"]){box-shadow:inset 3px 0 var(--mission8)!important}.msg:has([data-raw-messagetype="34"]):has(.ogl_battle){box-shadow:inset 3px 0 var(--mission3)!important}.msg:has([data-raw-messagetype="35"]) .content-box{display:block!important}.msg:has([data-raw-messagetype="54"]) .content-box{display:block!important}.detail_msg .loot-row{background:#1f252e;-webkit-border-radius:5px;border-radius:5px;padding:5px}.ogl_spytable .fleetAction{pointer-events:none!important;margin-left:0!important;right:0!important}#messagecontainercomponent .msg{margin-bottom:3px!important}.messagesHolder .msgWithFilter .msgFilteredHeaderRow{border-bottom:1px solid #000;box-shadow:none!important}#messagecontainercomponent .ogl_spytable:has(.ogl_spyLine:not(.ogl_spySum))+.messageContent .tabsWrapper:has(.active[data-subtab-id="20"]){border-left:1px solid #000;border-right:1px solid #000;-webkit-border-radius:5px;border-radius:5px;width:650px;position:absolute;top:114px;left:10px;overflow:hidden}.tippy-box{-webkit-border-radius:8px!important;border-radius:8px!important;box-shadow:0 0 20px -5px #000,0 0 5px 2px rgba(0,0,0,.5)!important}.tippy-content{background:var(--tertiary)!important;border:none!important;-webkit-border-radius:5px!important;border-radius:5px!important;padding:20px!important;font-size:11px!important}.tippy-content hr,.ogl_notification hr{background:#1e252e;border:none;grid-column:1/-1;width:100%;height:2px}.tippy-arrow{color:#171c24!important}.tippy-box[data-animation=pop][data-state=hidden]{opacity:0}.tippy-box[data-animation=pop][data-state=hidden][data-placement^=left]{transform:translate(20px)}.tippy-box[data-animation=pop][data-state=hidden][data-placement^=right]{transform:translate(-20px)}.tippy-box[data-animation=pop][data-state=hidden][data-placement^=bottom]{transform:translateY(-20px)}.tippy-box[data-animation=pop][data-state=hidden][data-placement^=top]{transform:translateY(20px)}* .status_abbr_inactive{color:var(--inactive)!important}* .status_abbr_longinactive{color:var(--longInactive)!important}* .status_abbr_banned{color:var(--banned)!important}* .status_abbr_vacation{color:var(--vacation)!important}* .status_abbr_honorableTarget{color:var(--honorable)!important}[data-status-tag]:not([data-status-tag=false]):before{content:"("attr(data-status-tag)")";opacity:.75;white-space:nowrap;margin-right:2px}.ogl_highlight{color:var(--amber)}.ogl_oldScore{font-weight:400}.ogl_oldScore em{-webkit-border-radius:2px;border-radius:2px;padding:1px;font-style:normal}#highscoreContent form #content{box-sizing:border-box!important;padding:10px!important}#highscoreContent div.content table{width:100%!important}#highscoreContent #ranks tbody tr{background:#151920!important;border-bottom:2px solid #0d1014!important}#highscoreContent #ranks tbody tr.myrank{background:linear-gradient(192deg,#23575c,#1c2a34 70%)!important}#highscoreContent #ranks tbody tr.allyrank{background:linear-gradient(192deg,#2f366a,#181a2c 70%)!important}#highscoreContent #ranks tbody tr.buddyrank{background:linear-gradient(192deg,#672f6a,#181a2c 70%)!important}#highscoreContent #ranks td{background:0 0!important;border:none!important;padding:0!important}#highscoreContent #ranks .playername{font-size:11px!important;font-weight:400!important}#highscoreContent #ranks .ally-tag,#highscoreContent #ranks .honorRank{margin-right:0!important;font-size:11px!important}#highscoreContent #ranks .highscoreNameHolder:not(:has(.honorRank)){margin-left:19px}#highscoreContent #ranks .movement{text-align:left!important;font-size:10px!important}#highscoreContent #ranks profile-picture{width:32px!important;height:32px!important}#highscoreContent #ranks profile-picture *{max-width:100%!important;max-height:100%!important}#highscoreContent #ranks .highscoreNameFieldWrapper{height:34px!important}#highscoreContent #ranks .honorScore{display:none!important}#highscoreContent #ranks tr.expandedRow{height:auto!important}#highscoreContent #ranks thead .score{font-weight:400}#highscoreContent #ranks .score{color:#748999!important;padding-right:5px!important;font-size:11px!important}#highscoreContent #ranks .highscorePositionIcon{background-size:50%!important;height:28px!important}#highscoreContent #ranks .position{text-align:center!important}#highscoreContent #ranks.allyHighscore tbody .name{grid-gap:4px;line-height:34px;display:flex;padding-left:14px!important}.ogl_moreGalaxyInfo{grid-gap:10px;align-items:center;margin:auto 14px auto auto;display:flex}.ogl_moreGalaxyInfo .ogl_separator{background:#2e3840;-webkit-border-radius:50%;border-radius:50%;align-self:center;width:1px;height:1px;padding:2px}.ogl_lastGalaxyRefresh,.ogl_lastDiscovery{grid-gap:4px;align-items:center;font-size:11px;display:flex}.ogl_lastGalaxyRefresh .material-icons{color:var(--time);font-size:14px!important}.ogl_systemState.tooltip{color:#263a4a;font-size:16px!important}.ogl_lastDiscovery{color:var(--lifeform)!important}.ogl_lastDiscovery.ogl_active{box-shadow:none}.ogl_infoStats b{color:var(--ogl)}.ogl_statsRecapHeader{font-size:11px!important}.ogl_limiterSettings .ogl_grid{grid-gap:14px;grid-auto-flow:column;margin-top:40px;display:grid}.ogl_limiterColumn{grid-gap:3px;background:linear-gradient(266deg,#252e3a,#171c24 70%);border:2px solid #1a202d;-webkit-border-radius:4px;border-radius:4px;padding:12px;display:grid}.ogl_limiterColumn .ogl_header{color:#fff;background:linear-gradient(45deg,#161927,#2d3447);-webkit-border-radius:5px;border-radius:5px;justify-content:center;align-items:center;height:40px;margin-top:-38px;margin-bottom:55px;font-size:14px;display:grid;box-shadow:2px 3px 9px rgba(0,0,0,.74)}.ogl_limiterColumn:first-child .ogl_header{opacity:0}.ogl_limiterColumn .ogl_header>div{align-items:center;display:flex}.ogl_limiterColumn .ogl_header .material-icons{margin-right:5px;font-size:17px!important;line-height:17px!important}.ogl_limiterColumn .ogl_limiterColumnAction{box-sizing:border-box;background:#11161a;border:2px solid #202934;-webkit-border-radius:5px;border-radius:5px;gap:2px;width:100%;padding:2px;display:flex;position:absolute;top:46px}.ogl_limiterSettings .ogl_icon{height:25px;padding:0}.ogl_limiterSettings .ogl_icon:before{width:33px;height:20px;margin:0}.ogl_limiterSettings input.ogl_inputField{width:160px!important;height:25px!important;padding:4px 6px!important}.ogl_syncLimiter{justify-content:center;align-items:center;width:100%;padding:4px;display:inline-flex}.ogl_syncLimiter.ogl_disabled{opacity:1;filter:grayscale()invert()brightness(.4)}.ogl_limiterColumn .ogl_header .ogl_button .material-icons{margin:0}#links .leftmenu li{white-space:nowrap}.ogl_accountProduction{grid-gap:4px;grid-template-columns:repeat(3,1fr);margin-top:14px;display:grid}.ogl_accountProduction .ogl_icon{background:var(--secondary);min-width:120px;padding:3px 6px 3px 3px}.ogl_accountProduction .ogl_icon:before{width:24px;height:20px;margin-right:auto}.ogl_accountRank{text-align:center;background:#14171e;border:3px solid #171c23;-webkit-border-radius:7px;border-radius:7px;margin:10px;padding:10px;display:grid;position:relative}.ogl_accountRank .material-icons{color:var(--ogl);font-size:30px!important}.ogl_accountRank h3{margin:5px auto;font-size:18px}.ogl_accountRank.ogl_accountEconomy .material-icons{color:#3eebff}.ogl_accountRank.ogl_accountFleet .material-icons{color:#ff403e}.ogl_accountRank.ogl_accountLifeform .material-icons{color:#b351ed}.ogl_accountRank.ogl_accountLifeform .ogl_accountProduction{grid-template-columns:repeat(2,1fr)}.ogl_accountRanking{background:var(--secondary);color:#8498bb;-webkit-border-radius:3px;border-radius:3px;padding:6px;font-weight:700;position:absolute;top:5px;right:5px}.ogl_accountScore{color:#9d9d9d;margin-top:4px;font-size:14px;font-style:italic}.ogl_clockNotif{background:var(--tertiary);justify-content:center;align-items:center;width:19px;padding:0;display:flex;position:absolute;right:0;box-shadow:0 0 0 1px #000;color:#4c6373!important;line-height:normal!important}.content-box-s .ogl_clockNotif{top:5px;right:18px}.ogl_clockNotif:before{content:"\\f170";font-family:Material Icons;font-size:16px!important}.ogl_clockNotif:hover{box-shadow:0 0 0 2px var(--ogl);color:#4c6373!important}.ogl_clockNotif.ogl_active{color:var(--ogl)!important}.ogl_clockNotif.ogl_active.ogl_altered{color:#b556fb!important}.ogl_accountContainer{background:#0c0d14;-webkit-border-radius:0 0 7px 7px;border-radius:0 0 7px 7px;padding:7px;display:grid}.ogl_accountSummary{display:grid}.ogl_accountSummary .ogl_tabs{grid-template-columns:repeat(5,1fr);font-size:12px;font-weight:700;display:grid}.ogl_accountSummary .ogl_tabs+.ogl_tabs{grid-gap:4px;background:#0c0d14;border-top:2px solid #191f2b;grid-template-columns:repeat(6,1fr)}.ogl_accountSummary .ogl_tab{color:#627799;cursor:pointer;grid-gap:6px;text-align:center;text-transform:capitalize;justify-content:center;align-items:center;min-width:125px;padding:14px 0 7px;display:grid}.ogl_accountSummary .ogl_tabs+.ogl_tabs .ogl_tab{background:linear-gradient(#405064,#2d3743 2px,#181e25);-webkit-border-radius:3px;border-radius:3px;margin:5px 0 0 5px;padding:7px 0;font-size:11px;display:flex}.ogl_accountSummary .ogl_tab:hover{color:#80b6fb}.ogl_accountSummary .ogl_tab.ogl_active{color:var(--ogl);text-shadow:0 0 4px var(--ogl);background:linear-gradient(#28323e,#1c2028 max(5%,5px),#121418 max(16%,24px),#0f1014);-webkit-border-radius:7px 7px 0 0;border-radius:7px 7px 0 0}.ogl_accountSummary .ogl_tab .material-icons{font-size:20px!important}.ogl_accountEmpire{grid-gap:3px}.ogl_accountEmpire .ogl_line{grid-gap:3px;grid-template-columns:90px 24px 24px 100px 100px 60px 30px 130px 130px 130px;height:26px;font-size:11px;display:grid}.ogl_accountEmpire .ogl_line>*{background:var(--secondary);color:#a0abbf;-webkit-border-radius:2px;border-radius:2px;justify-content:center;align-items:center;display:flex;overflow:hidden}.ogl_accountEmpire .ogl_line>:has(img){background:0 0}.ogl_accountEmpire .ogl_line>:before{margin:auto}.ogl_accountEmpire .ogl_upgrade{color:var(--ogl);margin-left:3px;font-size:11px}.ogl_accountEmpire .ogl_line strong{margin-left:12px;font-size:14px;font-weight:700}.ogl_accountEmpire .ogl_line small{margin-left:auto;margin-right:12px}.ogl_accountEmpire img{width:24px}.ogl_accountGraph{border-bottom:4px solid #21252e;justify-content:center;align-items:flex-end;height:50px;margin-bottom:30px;display:flex}.ogl_accountGraph .ogl_accountBar{background-color:#3498db;align-self:flex-end;align-items:center;width:15%;margin:0 2px;position:relative}.ogl_accountGraph .ogl_accountBar:first-child{background:var(--ogl)}.ogl_accountGraph .ogl_accountBar:nth-child(2){background:#3eebff}.ogl_accountGraph .ogl_accountBar:nth-child(3){background:#21d19f}.ogl_accountGraph .ogl_accountBar:nth-child(4){background:#b351ed}.ogl_accountGraph .ogl_accountBar:nth-child(5){background:#ff403e}.ogl_accountGraph .ogl_accountBar:nth-child(6){background:#f96e46}.ogl_accountGraph .ogl_accountBar:first-child label{color:var(--ogl)}.ogl_accountGraph .ogl_accountBar:nth-child(2) label{color:#3eebff}.ogl_accountGraph .ogl_accountBar:nth-child(3) label{color:#21d19f}.ogl_accountGraph .ogl_accountBar:nth-child(4) label{color:#b351ed}.ogl_accountGraph .ogl_accountBar:nth-child(5) label{color:#ff403e}.ogl_accountGraph .ogl_accountBar:nth-child(6) label{color:#f96e46}.ogl_accountGraph label{text-align:center;width:100%;margin-top:10px;font-family:Material Icons;font-size:18px;position:absolute;top:100%;left:0}.ogl_accountGraph label:after{color:#aaa;content:attr(data-value);margin-top:3px;font-family:Verdana,Arial,SunSans-Regular,sans-serif;font-size:10px;display:block}.ogl_accountMain{grid-template-columns:repeat(2,1fr)}.ogl_accountShips{grid-gap:3px;font-size:12px}.ogl_accountShips .ogl_line{grid-gap:3px;display:flex}.ogl_accountShips .ogl_line>*{background:var(--secondary);color:#a0abbf;-webkit-border-radius:3px;border-radius:3px;flex-grow:1;justify-content:center;align-items:center;width:42px;height:24px;display:flex}.ogl_accountShips .ogl_line [data-galaxy]{color:#fff}.ogl_accountShips .ogl_line>:first-child{width:70px;font-size:11px}.ogl_accountShips .ogl_line>[data-amount="0"]{opacity:.2}.ogl_accountShips .ogl_icon{padding:0!important}.ogl_accountShips .ogl_icon:before{margin:auto!important}.ogl_accountShips .ogl_line:last-child{border-top:2px solid #24272f;padding-top:3px}.ogl_accountEmpire .ogl_line:last-child{border-top:2px solid #24272f;padding-top:3px}.recomission[disabled]{pointer-events:none}.reCommissionButton>[disabled]{pointer-events:none}#technologydetails[data-technology-id="36"] .description .txt_box{width:fit-content!important;width:-moz-fit-content!important;position:absolute!important;top:0!important;right:5px!important}#technologydetails .description .repair_order{width:215px;display:block}#technologydetails .description #wreckfield-btns{grid-gap:5px;flex-wrap:wrap;position:absolute;top:25px;right:0;display:flex!important}#wreckfield-btns .ogl_button{border:#030a14;align-items:center;max-width:200px;margin-left:auto;padding:7px 11px;font-size:12px;display:flex;line-height:14px!important}#wreckfield-btns .ogl_button:hover{box-shadow:0 0 0 2px #fff}#wreckfield-btns .ogl_button+.ogl_button{margin-left:0;color:var(--ogl)!important}#wreckfield-btns>:not(.ogl_button){margin-left:auto}#wreckfield-btns:not(.ogl_active){pointer-events:none;visibility:hidden;display:none}#wreckfield-btns .btn:not(.ogl_active){pointer-events:none;visibility:hidden;display:none}.complex_action[class*=wreckfield_]{border:none!important}.complex_action[class*=wreckfield_] #description{font-size:10px!important}.complex_action[class*=wreckfield_] #description>a{display:none}.complex_action[class*=wreckfield_] hr{background:#1e252e;border:none;width:100%;height:2px}.ogl_crawlerInfo{box-sizing:border-box;color:#97b4db;pointer-events:none;background:rgba(0,0,0,.8);width:96px;height:82px;padding:5px 0;font-size:11px;display:none;position:absolute;top:2px;right:6px}#shipyard .ogl_crawlerInfo{width:76px;height:61px;padding:0;font-size:10px;top:2px;right:2px}.technology:has(.ogl_crawlerInfo):hover .ogl_crawlerInfo{display:block}.ogl_crawlerInfo>div{justify-content:center;align-items:center;display:flex}.ogl_crawlerInfo .material-icons{color:#fff;margin:0 4px;font-size:12px!important}#shipyard .ogl_crawlerInfo .material-icons{margin:0 1px;font-size:11px!important}#commandercomponent #lifeform .lifeform-item-icon span{color:#fff;text-shadow:1px 1px 3px #000;background:rgba(0,0,0,.7);-webkit-border-radius:4px 0 0 4px;border-radius:4px 0 0 4px;padding:3px 5px;font-weight:700;position:absolute;bottom:-1px;right:-1px}#commandercomponent #lifeform:hover{transform:scale(1)!important}.ogl_lfBonusesLink{justify-content:center;align-items:center;font-family:Material icons;position:absolute;top:0;right:100%;color:var(--lifeform)!important;background:0 0!important;border:none!important;width:25px!important;height:36px!important;font-size:18px!important;display:flex!important}.ogl_lfBonusesLink:hover{color:var(--ogl)!important}body[data-minipics=true] .maincontent>div header{height:34px!important}body[data-minipics=true] .maincontent .planet-header{height:34px!important}body[data-minipics=true] .maincontent #overviewcomponent #planet{height:auto!important;min-height:208px!important;position:relative!important}body[data-minipics=true] .maincontent #overviewcomponent #detailWrapper{height:auto!important;min-height:208px!important;position:relative!important}body[data-minipics=true] .maincontent #technologydetails_wrapper:not(.slide-down){position:relative!important}body[data-minipics=true] .maincontent #detail.detail_screen{height:300px!important;position:relative!important}body[data-menulayout="1"] #headerbarcomponent{width:1016px!important}body[data-menulayout="1"] #commandercomponent{transform:translate(25px)}body[data-menulayout="1"] #planetbarcomponent #myPlanets{width:172px!important}body[data-menulayout="1"] #planetbarcomponent #myWorlds{width:172px!important}body[data-menulayout="1"] .smallplanet .planet-name{left:28px!important}body[data-menulayout="1"] .smallplanet .planet-koords{left:28px!important}body[data-menulayout="2"] #headerbarcomponent{width:1016px!important}body[data-menulayout="2"] #commandercomponent{transform:translate(25px)}body[data-menulayout="2"] #planetbarcomponent #myPlanets{width:172px!important}body[data-menulayout="2"] #planetbarcomponent #myWorlds{width:172px!important}body[data-menulayout="2"] .smallplanet .planet-name{left:28px!important}body[data-menulayout="2"] .smallplanet .planet-koords{left:28px!important}body[data-menulayout="1"] .smallplanet .ogl_available{display:none!important}body[data-menulayout="1"] .smallplanet .planet-name{max-width:67%!important}body[data-menulayout="2"] .smallplanet .planet-name{opacity:0!important}body[data-menulayout="2"] .smallplanet .planet-koords{opacity:0!important}body[data-sidepanel=true] .ogl_side{right:auto;transform:translate(-100%)}body[data-sidepanel=true] .ogl_side.ogl_active{transform:translate(-0%)}`);

GM_addStyle(`@font-face{font-family:Material Icons;src:url(data:font/woff2;base64,d09GMgABAAAAACZ4AAsAAAAAUqgAACYnAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHJceBmAAk1QK3mTNSAE2AiQDhFgLgi4ABCAFhFsHjFQbGkh1B8j1OIDkOHcW0qzFqTOiilSe/f9fkxtDFGagNfv/ELWyJKaSqdoW7OiqA0eFBrvgOJp3nCICkXrpRD09l27ln/xa9sarDIG4UGJ21ocP22Gm8SpfKDa7fuTPO7TQxYGhraeTfkiSNHkeu70vQWJxiygPkOIoPGhlQbsgCW6I3Kyh7FIWVhYVwwwaWAskQaM0TTPSbCm7FlIBU+Fdks65acWadFK9L5DSTK41+NJN0a/qVf9aF7818CHd+l4Qy8KKsWawZvpFLTYhk4EQAnyB3d+deKVSnVd3VXFFb4e6qqrSqrvMkgfueMCwSN29SDMtqe6Bo0ROrVS2h56bZhnTf7ax0mLAMqAbSan1e+8LAJ7n8Q+9P0ShpKBzCitwBQxrpy57t+lNzWlqG/uwmy6M7BQKPXY2tY19LGHyBSCFMMLOdTkeoAmGXK7VPgzfzHxNW3vPvvhw+eupk7l33a4ciHySGFMAC4B2lJF1HWK7EK0N1quk3zkGC7nNrxIBlu19xU8GpAHU1gU2BM2AddpfR4vsvjoZP637uZTKKyAJagXFuqTDVsWDogDSaEckhPHw8HOxfKFfiF4QXrE3+YyD7fbb2jikiyFJ19pN/r3Osr1j316wTCrgzk2RtvB/kuFJsvB2J1+Lko5kBywvyj4Cxxuk6ibVVVunkmQvaB2Q7COyHcIyXWaLKlAB9SmaKv97Ju8IDQP8CaqY42r7k520V5pOoCstH2eZDWEKl8DezC74d2Pk2ygBKvanWnLXwb2L7/9vb9m2Y8xPkvSTJOMMY67/wG4Nj0xzoxmaYaKM5Xv/77cRAD0qQS0QztcvbQfknfXRbQACMR6OBuB7cu50htcD6Xk7xJPSQPqZ8WUgH1SC/9hqhUeEr4sUohrR98Rq8UUMYLV4UKKT/Cv9SdYoXyfvlr9DyIEEKuAAq8AecBEMgR8DMdS+AoxJoirj/SxFVMAMtVxYQ7jkIY6XmdOZnFwikeShglBFhl8qUIiok588HJew88N2vrGjxEQxNy8ZQT2OKmjUxkmj//5Qv0qLrol/9IuiAjauIPqYUyOgSPRJNCpLlKKGTENvG1OFUSgXkhjUzx9VYFCmev6iaJa8TEpNokhv1dJ/xVWmgEjl84sibc0NK5mePB+RJ+d8robGiTLbwxH0lUot4UE0JJjACsu5ZURFMQUt4KKzTYGecDKbKFbsGSQeH+T0Oa6wcWm0ISDpKWsKVXFdYzje2JwklibM87idR61OD/GUSKElQhKRhY+4mIYTRh9w2IBEiTeatsqPElGsj6khxUWxdX4SQtcCkc7emrXGmwZYLptJmZHBavfwaZlo6IpkWvU+l+VKM5UpBGq836xNp+TwkVG9jNa5EkZ4uM2DWPWUJyPqoXj9rBTF/JD9MsPH4cDjCacc3TZdcMesfFwo0KiS4UENcJmhw3MC89FWSjfFBmyKh/AZlwmSdIaTTh+0pjlunal4q0Xn3CNq4o/IRARz0Ksi2qyZ36FRtWTTpjqi9gohK5ET1WcSBA1zn4kWrW/gSKI2cridFW88atkxl5xjh+ZSQqUR+sFEqdPuIs6SWqkzgAaZCoiztoxUeZ6TFBL0FEcokOJuXOIpNwHjMzzzv8A89Sqy/n6St/5wR7jG2IyrQDNmsg0Gg1cizbBd6KJlVT0+XxFlHajWjyrMduxB8m6yXXD6Mflw6TJzQu4czDXIrpw0IoceaohJ7si4dKoYdvZJqelRYNC+O2j2vc9rVSCdIqMqggerejbJViOA6gaZc9M7QkhZJR6RClSSSTaZhfoT0tGy/kdF3pUQNmbROp0QpExhVKUFEd/Vqv6VFXWx27h9twTO+ujHP40K6QfobZKAUiXRnIIobkYHvsqDVEULEjKii28khMzu9bfzIt1RG4cznVt3llJFNw4ecKiKMoHZA67CsmZDq2Wk5aDLoCXdIq7Cd8/4lBh1zAPxNz7/yaZY5GOSZJlgqWNWpFk0s9O2nlnrZru4JLG7jCAJ8BAJ3LmCbT5CY4FhHPAdFWSy6Ld4o+OOMtXzE2sKjG1QN/aAV4Lf59on3IYSxzkQRWhDF0b39IRLloBUb3aAa46VATeXpG71aDFJYhxzl2C+pyp1zQJo6LrMHkwYUG3TjYw/2Qff/mF3evyAgwvgttJmgKF3O41gHVXtvyEnLdzxnKkyegsEK7Fa3JpMo7nAsz/Ryzw3IsevmasbkCDvpkhaF7mJeyET0UvZVwHj8Xe4VupCw7rGKSak1znT6ECu+KDGTc/nCthdDhm+gm3XoF5RDmaiLrL6Ft/jIqiDT8iodUM9rzK2WxAhfSDuoj8RTsKslGBdBtYZjOXiPjHY2pqgolrpSdVg1dXrmgt4fGQ0+mqrFtkR4+TCEhpKtovM4hSnMbsz5Y5/HIvGjLiZsM6eLf3a4R/glRP8d2DO+3f/k2sXSjhL8fAC+64sXMFPplfk6kBr/Lv3ZaAtwIvSs/FQBiX/5j3FX8CNKux8ox1FBDTpb9rBXN16DTtPjvj//5uKi+FWAApSFmKz4POL5y8zqxFiORA3HdOzMU1CiQqvi/4wQpaOHmaO3PXj5cqTr1i1VoMWXHLVTXfxcvgFVKgUNmLekrPO2bDpOE6pwk/Ro0efAVOmzbnilia9hjRoc0aZZuN23RDSb9KsC655ysmrTqNtJ1102T2PzVhx4I4af5zLKSVuO+2RJ0bVpWMmPLj+OW7Z80y7h6p06HRMgUJF7E6ot69LuaD7Wqyr1W3VmkXX7ViGogIP7Z//u1cd+AT/9x8QHooGjSdTejamJRTJfM0sIqejh5kjHFrUAZVTDP6Cuc/0GRbQR1hEH2AFfYKz9ACcp1vgAj0EF+k2uEQv4DI9hiv0EtrpLXTQO+ikJ9BFX6GbnkMPPQK99Br66B7opztggF7BIP2Aq/QUrtEbuE73wQ26C27Ke+v1AfnMbkB+kwrIL/iAy3cEQCUEhxoIHo0QApogRDRDSBgOIWMchIJZECqWQWjYDKHjAoSByxAmOiEs9ELYFSMcqBgBoWIEgooRGNACQdAKQTEdgmElhItNEB62Qvg4DRHgDESI3RAR9kDEOAqRoIBIMRIiwwqIHGchClRBlFgIUWExRI2lEA3WQ7Rog+iwEaLHJYgBXRBjw9VNgEUQM5ZDLJgMsVY+YgOcgtgxGuLADIgTayAuHIC40QHxYBrE2+C6D7AO4scGSADnIEFcgYRwAxJGOSSCakgUEyExTIHEsQ+SwHFIEuchKVyEpNEHyeAaJNtw9RxstkNwGFJAD6SI8ZASyiBlVEAqOAGpYgSkhm5IHSchDVyFNHEd0sIqSBtNkA6aIV2shvSwFtLHAGSAEsgQeyGjRq6PATchE8yBTDEImWEsZI65kAXmQZY4AllhCGSNoZANhkG2KIXsGgt9D5gEOeAQ5Ij5kBPGQM4YBbls+iGYCblhF+SOCZAHFkCe2AF5YSfkjS2QD9ohX+yH/P7YBvgJijnlxylorAea54cVktaXlzy+Bxry9buNMmCmMZmhwxnq5oA+w/gsj3Mx3ckPtsgzbZ1jycIX71noO5kMs5uETFUHFVkcO2/czIN4MKVp0Rnnn3tY+KoYdYABbgaDaiIpPjjpx7zMgtDSTMxnC2/wMbrABx04/2sPjkfVxLF0mXO3V5mIuQE6nB4MA1I6JNrjJRty6PXQ7pJj+PC8TMEnO/yPJzekqdUhBh6qzCIWqYomEzFXFNBEesZRxtUb0XalTNN82lSmqaQ0eK/sxzKwmJe4jGY0P3OAvtyzCPijKmZ2jlbW63sjpow6WKiikBN0DvoJNq4QCRsQME1DyOdom1jO54dqf+IHg7IOCG4QwmZm/JTAUzYuBRkYPdzgl+CQL1As/CLMnxrZbFVvCuV7/m+7lRntPBxP/3w8hl1+/KfXXFOjFmkPGyXpAXcYk3ix/zZzkhsGcWUPGQa5ELIrrSkEzxRNK/Thvw1gdWQuyrW77cZR3QcvlV0f5hmHEVYBXTYS/I4ol3rxqYrV9Xio8vGf/YaepO5+elQ9/vw+vP340D/48KYIrdTFEPi9dFGsDlTXExESNn5RghVnBuFAAQiQwRNyDFQz7MW5QMitA6PbscJzO54WZd6Zyn2yhioGajQAt4MH1kbbcbcukLhIqB5iFUx7Zb/LchiAJ4ltjCSLfinzPuborEjyzCAJtH47sPWw+hw++g8MMdYkl/mx7q7JOjjidI52fw87ImG9O2K94vhZkWLAdZYz837E1jNfeH2sDsf+64ymWlX3mQOvWqKYyieHtOJg+xkViG+Yp0IA5zrAV2eCDM5RzaouNJAkJy+0DDMyXfPcaa1BL3wkMo5/PHL+7DH7CwNW0F27et0B461rcF3gKu7wLOJkRBh8S/EQu40XY911WXGM4XIbWen/1kV9QyRdi8N5WctkdBMGf5r7C6PqU/3Bf5RwrS71yZ9vhdbr+wjeevGifvXqHqK3X760NWWCHDiuFsU2EBuMCO9RBZjuJKCaAExfUnjoKOXA4yIBKkHvxV3754AayQaY/bvVKVVqbgZmn/3T86oB8ced3v3pXk6bkcdu3f6Nv+92VWMUSM1nAvMTcCFFskCRgQC960Fxpp/1zpgOgnAZhzPGwQ0M+b4IEgTMKwURtsZBkV1U+ELYDOo1ziL/PIZ1tIshIXOcMUDpvsJU3lAfEyNlkYm4i3ytkXrzjRNZYxrF+vOWQ0NlbYbq9hwDJYlSDx6bHQ7ZNI91iR3mHF+8hY9GhDueVrMw8eNTZql6VD/wD0sUEGCgXjd4Yuri3Tlg1FWRogdzC6sRV6blahXx4MMJqQ/VMez97gpzOCaHBCYo2Jls6MQUA0IGwluMeR0BtdVIR57wRQbbh7fhnsMPzbXM0hIz1C4hu6gRAQG1ta4o/p5iFaUuDlnDIFjNTneniDwPerpfxY9PdCYAhJpgTkzLr5wautbhlJRhrZOz3DJNkUj7YzoSIl4AmgsVT1tmRBieNQkaesMEQ4f6bqfjyBrKWkM5cKyYXl90UuTgrSwSp1vWkanbaMkFVK/LgXf1W0pytpbFL7746kg4Xaf+oAefA12SHih47HWwi0wbGHb4Dspc+4EwVqqegcHEKq1OihweAgQ+vzQuADBIXpiSaCQs68ULizUWKCjK+lO111A9VwSzum7I3bUwacBGRSf5GV5nWxgJECNlrCvIjsC4GbIEG/+9/skldcGUGrnUBjRt2naaW6QoHGudphSN1sVxiqgpAc1yx6tWkwLN8ZZaaaRhAiMKw+TDI0vcKotEJy31v0vEw4J1pLjmjiLDIcjT0CFGQLUyC2aR3mowaOU1JD6VrLyTKss9ReBzQO21pHlFTk7reB8N2V0UNA6Mfxq5pZp9xqtgpEmMNB1X1k7tgtba7J+JwoKbk6LkHARjVFU8HWAJOsrncYomfyhrAmZ9wC6kPsCpP5ClOpDa7rTRY+jZbRtL2FSfk3hS3L+yUnt0fbLF/eXqU0zZto8oHW8aMDElLdLfqgaWrbrNcUfdmerz8jI8zCDnUbSmCzJWo9XbKhsPABg4p1/sibyaYjX7Pwdo2Mj4nqLYHE/TRvPj/1CNhETetX7hx59GY4DN8K6SMYygRWY6Wmx03hn/g/AXqUrmHtzMcXAz7zEm0ansT2qPpvLC4w/r7XBfbSIKOvBUWek4ohmedq0/WbLz+SfEVYjOsnJGJArTVni5bLNMKcpicrlML6cwzRnLKpWfGU4YKznnBksiUZzn2/7/qFs08bQPLbqJHkUwAyNXBMn3HDVfyZOxe+ydejuc6vs1dEWalyrLTULFV1M9PI/dajHCQOvrOtVQ2cgv7aM971aFV62FfTJwRPEO9LpbmBzlgM94r0OBh/FyZGGlbqTa7nHYa5Flm7TSuuPppvTR3on7k/M3E7XQyN3x8S6H1ZBqK9kdHBsIWoXneQsDG6zBcNzcEPVXpeItRh7W0a661VTi8GkA402u3im3btgBKhF/i1bgD7hEqom6kzO5sMSBsU6SNDRdkZ6ck2Vz3vTt8lp+1/Y3lbBJhO2G2pNMZ+5rMHVArTmGsYMWh868mzN5q0trVsWht8g7K/GgATuWO9xaq3CDaR+ebobnV7cSWF1L+ww+NjdDtr2+HV1cBAoyXIyzWZ7l55a3S+X969HwKbPaS9K8tWUOTXvlfEMS15m7Pon1I3+OahfYTjEKSuhNa6ZDfBXB0lCsn0LA7VKuz2M9BZB2kWba8JHo3RT0B7dJZSw/9F1jN4D2qwuiwIanU9nZt040oPjCVvsTkG9apI+cP4146sLRNP2Wv26gOn7uBBjg5NljSfKVY/WphfcdMYIOg63a2pojDPvHxMYsgW2Ei0CabCpGo+s101tUoXbryeBDSSQknL9m3lGQcGBtngJmn1SYIC/4/HXtjghg85UQO4/dvuOiqXA7GfWNaHMQKerkAa+Bw5ya3c9067PiwaZSWa8xkrnoF+OlOpPiTPTrhQZ9UKRPvsLGIdshsp5MoTA7rqXymrtCIcMVnJa0uaA9I6rGYV1WlELWpNgUzbog40TpyVA3kIAFe/tL0VrCAIfUExFnDpM7bOmCaAiA4RZRL6MXfg9Css3u3iB3xXAt6094/b0F7r/nMM/5mshiisT2W3r64QuzYE+A0Zjm/D43kB1Fe9n6ExMVzy3grPIHYzNX+jgdi84UGbN2JJfK6n6Hyx+EQQdynrchOXLaTns/5FG3S98DBOIFhi3TIx2LnjY9vahj3vQWWee5r88Y6v4bMcx9znDov9OGM1/rI4pd6y2UIL9601MK6nv1GKAs63eBcKy5mea+c/S99wYEcYal6axcvi9LgzezN+CNloeBGLM/a1iZMWQVuDu37CXL/1Qu9NDe/JEeoWGKllZWN+zIidbWqwYJqBNb63RVi5r+tV0x9RF2uHkRiEPd36xMDWP9W03c+I0C4p2LF595Xl0+eWTWHssr0QAHFX43/wApOtmeODDGOCLLi2q72aBgjyR6IqU7x5gI6w3iRo0nVoZ0mESJ4uyVElwHy6p/GPXRI8dyYyO0b9NIdRnU4S2+mA6VxTyVLgd0oDAW+KSNZdf/XGqYMig2r8ry//c4RRZLatawrJWwpqwEeDwW5gdD4cGolO+6qmI5aA3ZHzNiY8gYcOpC1btgcIhZsoTu37eXBknmu0o9MgLuxEfUwdGmfVRGkKnLkUh/qTWTDWpv7LEEtLuopmYhhcSm09E6/vl8FV3bujYK/hdW1i7wajLmjAYSWZ3lvQtqlVSIDlE45+Mk1qXoIoJuAZcNJdEbFSpOJBui7lMpqVgY66cbMFlSlZRhDXR/TCiWpj6iDclEKu4GPNNV8cMfVix3gDGf385lLtBXDmjM5YXXc1EArV5eu7x7Ue3WalgNXTCKTAjEOc2UOeRWXx/AxSzebKmon+zQlHsUJYX5H22a/LumQuF2FbZslWAGKtw3T+worrIZplzAA8QfWLwzzd6iTZkzP/FVZM/am6Qh54a/W9ftv5FjIG+u7VG6yJ6XDTSna1tPx+gBSRsyYTyGlB+/LH75YyUC/iZkUvEqhIdwpUMZIfqo31uZz0Ty/QMdd4oviUs3WbTBnf/PaygBIUo/npmaLvnG+e4Hg2MaGa79dd7S+ZWDgvWO0/sFwdIedt6SJf2OfTee/98jo1AA/EYiTTxDIreSVboR+Qx0cja0B9n4gxsc2EjTakqtfkhtL65cfh7wwKQQUr37iFtdL+7RuyoUMp2HpDK2IaUXHlaEcbDv97RXnL4V3981sDt34MRuZ65BeWUvwOUxeAGPUHIY7EUzkgjFOJwXPtLhWcPom/DNUYPfD/h5zz1rvSC/YFVb5hE11mefG3hOTRmAH9o3cor4VXT83MBw2Pjei3PRLIzEZqG5L75nLDibCb3xWKUduLkM+TAcx3xo2c0Breqde6HMS2zc6IfQ74cCxavCl5DskBiHyxBloy70MLlmpW2l+SLBUMJvRC5o4hJp7UQkglxauDOwCtphO7Ij1nXHjvx2l6LT9FF6AsSN+qJU7Hs5+sGZVObBxxlq5qA+53uxVNGgw0bf8tANlhJpIgVTF0j8iIymiCwHGKY3vRTneZfTBeJx/4A6VISWLIVFTshecLsDvajJiDBM4kgBA/fCRImyyN12wRN7oF/cVQSXLkFFoc+ICRCz4TzOLl1fv02WlG2rf5At7lWEnG3dOQ08Ftk9CC0c10I37LFVnHKI3GjMdSgBjA2tYPQQlDCtq3ed1zoTcCnIitU63eoKEook3XgezCfysQji3PGg11+2r8xfvdmXtCQJT6NPnmTf0Is7FmMUTyr7Wo6IKYJ0QCLLSumJtvW/l4DuuDVTGtJUsv5nIGHEeEyUR703OEo5RRiPi3Kp0f73qCoRvtubS01eHfkI4vYb09REWS9gREaxedZU+7hq3NfnWy7HA95t2+jKKNfnDVBBz/D5VDW2wuOm8oT4QO1VUSnwn3Khk3K7qVw8l/ohVYfV5Vx5WB6VopzJej4FbpzXW3g/lMt7+3NDKybpsv70QKlhyhdQBdtT9KTHo/N6KSdoSHCMfqMEG3AEAGfjTJq0Oa2xOyEy5dNyOZ1vQnACxAdjbw9BNzs6yrrhUIBEvYgEUSLLCZSfjr0eGDnE7YYINqMAiGuyR+O50MwmBBHE1bA5iO9iGMPIiAHEnxtxqUPgsHsYvLgwUQF/vBiGzr53DLE/yuLGoAkmoBvCbiKjeyb27G9PPnCDoNluEIfIztrVjFVcvWSJ6roLSabeqLXUvnF5TZ/ZeO7hSiz/4Tmjue9sbblSIY9yjY7UNeG1hco5qVZHKtcoK4qmPFNwZ1c7f01fs+JS++TJN+pJktwa/IF/GKVQ0gZTMGk/FT/iMJ4IxXZXIfoqawluOuwO5Eg6ZEyig4ZxJ06QElBCZSGmjfqCrdPrJSRNEolYajLHs1RymKR1NOnO28TFWBcbd+IhRegCjI0Kq9CFizxTDlPUjVRhOqxihyHHw0QvY0T4duKHu2rehMBDpIkEyk/EpVyAcyLOpRAEjAyaRmkXnIZp5+k7BmzdxZrov71mBSnHL9pWHvz9gt9ubdggJy8Pfvvt4GVSvqFh62+5opQvIFWF6JBKGvABHt2zQ3YogiJPs4i9x8GeoUTaU+b3tydEJvi8Ds2HhSETukeImWJrw9iv/8h8pPzbH9WIiIzag5NQgvbsAEQ1LhUDptsa1l9IPnOg+6nsgfry6WnH86UeXVHrD2nxtSU/P1jjvXGhibkurGvJE855DjY2LlZTrntvt/ue3G35VV8BPgkaiDQx7ovBzb4DN14qhUE2yDPBiSh089oJ0wSwuWBuWH5b5uSp7Lb87aOCnJHIqIPItDpNM+PG4jkvFsuOLO6ttG/p/DKzUHTt+VLCsmKxCveDWB6vMraBVXPAtrKSOTf0r77dahALfrf3n1d+Ny/z1uGRfyhefxgof1kprfScoYGhoPRV+6Tw0Ttkjl5VVmerd3jtd0pmLT/wU5VqunRx6BZcEFZQWsEMgZYCscJ93KKIJNLG+xbYlqT8nJZ1+W2tZOuzxo1dnQu7QDpmMqEfJQb9C0yHnU4d4cqIFy/OGzIPzbv4IlEGPs8aUikaviND8qTynGJ8hZa2wLsHyGIdPVy8p5GXnFPE7BPsidkx8NU3DLb8wFAmlNxV9kteu0ONH7n2Moa+on608TZ9e+OPqK8Q9vK1I+MCkYz+7wu3D/W0t1DYL29FIy/8lz69ke6nf7q300eq5aXfGETStvAXv3Mr+z706DW+Bs9xwsJalv0AScz7glo9Fsbfu43lgksvSfrJAXKQvHrsKvnZjfU/xY0+I16IzT5Eygap1MGNr7k3tL7iH97/s00zsB88o1732sFfrl3rPVD65d3cqxv9UvUv3Sr2ydplHpm3rEGZ/kBxSbD6s38uztVtRnkfHzaNREOAcyXP+3UMh4gM3Dy1KuTNGSKN4wFePg1EfZhVuGjsIxLIUtQdzeESFYCFTwNAqteVCB4CREX6Ha+/VbJOK2yMAkD3fucJ0ynjdwAdAPxP7aS9J9kWtPLlKlzl3brgwtm1zbqV81v1rTMlex1fF8MDurvD1XnQ5ttvbuhwfmd/VcuZrcdIi86qW6MpLTbrpr95ly1cK62st4LjLv2XtV/q22na9R1M0+35X5m+yu+AIG7bageXF8Q+LEXBIKqJeTQ+ZUwDPMXrjp0Cfujx0J5+B2Sve8yHDgJdjAKaGTzi/hJdueN45RqcrW+8fr1VzYaJV0sCREZJvzeZp3j1nSvoS3cEB/oXedsv1gvznf0mfpAeadaJWV3zqGGIN/p5zVTBlCZTAO6wAyXOKmyh5/X8lCFED/VHcp2vAt7oYHHr5pL12OnHL2/tW88QvX7zobhbP3lpjcGTC7SqFjYqDntOrVxG6tsHTatZJc4TPM5FspL9CXnwLQXE4ba2K1fJUqopnCglB/YeQ1ebON8DxOE7C1utLZzR5Bbrav67fycbmE6m0IsxIPq7UJz/3QL7YFNVVXT7ci2m1C7fHt39mwlbtJQiwawHZ7Ev937ZfSOaBE5uNVV/NE+OtGaqk5g6EnZ57uZrfmUZ5kh7k6srfe0kN2z5VY0JIghRPHBiR9+RVU3btzc/VVDrkfy69OwRtY7riMNbLKhTHztrf1UC+LTrVRnugPa39ZeQzSmQS9ROGCTiE1AhQI1wZyGb5ZuvARgvsMyYF2io7ZCUrFRqpFbqdeqWKvCDrVH0osuhzicL6+uveKRtR4/+JRr1Xbx0+/z50rktt88n2qPRuX8+B9BtZBiWUWeVOExcyvp/TWh0MFQQ7gsX8P2jK6xy67SVoMcuX1aFC0KDoyErUYogt64Y7ecLwtTlK/Zh3ul02P2nBh5U6sn5NK/0kUnHP4I591MWPWTbMpFtDANmRr1+Q7vHXYxYFhb/tVhbwG9Ejlmi48Fj+VqSyChEvchHjUNq848Fj4tmOVBPnxWSirHlFQ5WYVmX2qJt9ktjChK6DMDvgh3ScojqMLIUBuLGFN3XR2/aUJxKFffng7UvZmdb5mS/nEc4ph/XLP1DtMCrjmosXuhCy9wLz6obYe09wP9vIGGPv5EYDmXCkXApvANMIlnpiDEQ50TO6svxFIVz01WMvVDHODakS1fI2MFw9n9ADLt6DHtGjGvDGOIcnio6wCByVNSe4V/yX3A4+31LsxISWOMgHhTMeBZeQACAikxRdy1DgjLIeF8mE1RntKEhboof/BkAG6aD4aEM2Ghj9nD5DIB9Q1Khse1YZVDgpMXEGxfEOlwMkhiYgpAoa9PBaTdNeSGtGGQR49kwBsC0b6Oylm4s1TA1DZHNGGqjFlPf2uQTMTaWYhAQPLhMEHzMIiy4tx4rKYLUBjqOXTTNQCpNkxzSOE+DFCi7BQtZaceg+kiIPhYMrz1vF1Sl8JpkVhF1sR2D84KiskVQSrsdCqvumQrSbO+dDoukXasqEZtodbjcSAuGWEiVqdiZwhWImgFEn4go8AoBgAAMTz62dOQsxPo8PDcNxYnqj4c03lG0iTtW/RuvfQFFG85EFAfjz5a/I/rcsCkEa3tXIND/Il48Hfl/MF2TP0SxKTpg0alzC2Sh9ITFYFTGGqAcrwcq+I1DjTYr12sVesKOK/OCU8ncgU3A+8GOY18EB2B/gVOJv8Gl3P/gc6zQvgEvlEtdN8ihmcrhxyhsf2FohfRz4ANuqf+gloUPN5fXtcze/h4MLX2c6dDNBzsNt+79oVeZDt8JO0qRQ1X5hOiXo3v9eHXVgy5cRpnu/EoOzVQOP0Zh+2tHh/b49kk7HTOe/y9Ae4JiitPfXF53PuRx/fc8Q7bVmQ7dHIXZabh17w/IVpkC/jsy21HCohwqvtEnRL8cCez68QrW67vylyNL0z9wfSQywq3/oEmlG6b1V1exHq/j84MQjKD//Apsf5sCoUgskcrkCqVK63dBq9MbjCazxWqzO5wut8cLgv2BYCgciern7kFhcAQShcZgcXgCkUSmUGl0hn+j8f/GZLE5XB5fIBSJJVKZXKFUqTVand5gNJktVpvd4XS5PV7ePr5+SCxqHmLKpbY+5trnvq8+OhdjlMYeOirEEUsqGbwjVTlXR+LxcXpXkjOfp6RAxe+96r3oXnhYGGq16WK31FwUjPO6Q/I8YdkVicdFJ8VX3ZntGXZdG4Kiivqya7mkp3Hk0BIsjkitIBg4LXM0Hu9GS5xUOBT0fg+sonkYfRWzxoIHceg1CEUoQcPt9dft316Xr2EThV3J/EEinOTUGSr5uIz0lPM2tg4X16TrOJ+9ju9K5NSp2Cd6kE45nauETrMd7ytw3Ac2IPq73EcJpxwRfIROYk6+Tpkm4bRNIjqbfguQ+QIp+z2ysuiaY2CKe4+mEmyecu41PtciintxFLGmCF+gsu4puui8Kf05iWbHkz530DARNypBEUXTts8FIUqd9ycg3qGOuVsqeId+ASzS3L7gczgrVXrQOHoWts0Ahudoy6FIh+1InGykIzYnnK+z8mKUCfdGaToUMgteFlscgXr3iLmT9a95ksvyTr1H1fFW3zxOS9K6glpmWaUHX5em8Ka8PmaPI3hTiIdGAxYlmy8PgfaoSKQSBrLA7p1Z+H7F28Zca+ZhMVEuFg/ctpMkhBHku0k4u2iT8c0kNY9aS95Kvtxj+BntGHivgy3jbJUq9B6L5z7HwQt2X4Zyk7NDn0tByvtZnmrBtlI8ftJwuyPaz4QDpXQvZcXccbeO4vLhNUFpVbOSYz6sEMN3wsyI/jyqKoPCLFD0fMo+L6or1nVWmnLa/9+g85SvzBaKJGtFr7BxpaggX6nEI/we/IBQqHEclyrNsVGzFdcWMzhiZSCN4wY9Nr0KSAIpdNc982BLO7ZSllaBdNeqqFuwKIqFOeneXOWI0LdXvbDWpazg1PR6gtrGWNlZNNnCZo57V3Aast3Q6spV6jgvGifZN+6lpLASwatWEzm2p4zzxSKvujtly10u2ef1mZRXFRapT0EjicGmtwrEWpnK7NBI5UadxZC2t0NsPvNf7XSbLgA=)format("woff2");font-style:normal;font-weight:400}`);

