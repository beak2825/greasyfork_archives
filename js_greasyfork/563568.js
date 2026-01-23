// ==UserScript==
// @name          [Pokeclicker] Farming Aura Manager
// @namespace     Pokeclicker Scripts
// @author        wizanyx
// @description   Manage farming auras
// @copyright     https://github.com/wizanyx
// @license       GPL-3.0 License
// @version       0.0.1

// @homepageURL   https://github.com/wizanyx/Pokeclicker-Scripts/
// @supportURL    https://github.com/wizanyx/Pokeclicker-Scripts/issues

// @match         https://www.pokeclicker.com/
// @icon          https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant         unsafeWindow
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/563568/%5BPokeclicker%5D%20Farming%20Aura%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/563568/%5BPokeclicker%5D%20Farming%20Aura%20Manager.meta.js
// ==/UserScript==

const STORAGE_KEY = "pokeclicker_farming_aura_manager";

const CATEGORY = {
    EXTERNAL: "External",
    PLOT: "Plot",
};

/**
 * Controller for a single Aura Type.
 * Tracks recorded min/max values and handles locking logic.
 */
class AuraController {
    constructor(type, gameObservable, category = CATEGORY.EXTERNAL) {
        this.type = type;
        this.category = category;
        this.name = AuraType[type] || "Unknown";
        this.gameObservable = gameObservable;

        const initialVal = gameObservable ? gameObservable() : 1;

        this.liveValue = ko.observable(initialVal);
        this.recordedMin = ko.observable(initialVal);
        this.recordedMax = ko.observable(initialVal);

        this.isLocked = ko.observable(false);
        this._userValue = ko.observable(initialVal);

        // Computed for UI slider interaction
        this.userValue = ko.pureComputed({
            read: () => this._userValue(),
            write: (val) => {
                let num = Number(val);
                // Clamp value to recorded range
                if (num < this.recordedMin()) num = this.recordedMin();
                if (num > this.recordedMax()) num = this.recordedMax();
                this._userValue(num);
            },
        });

        // Trigger save on manual changes
        this.isLocked.subscribe(() => AuraManager.save());
        this._userValue.subscribe(() => AuraManager.save());

        // Tracking subscription
        if (this.gameObservable) {
            this.gameObservable.subscribe((val) => this.updateStats(val));
        }
    }

    /**
     * Updates recorded statistics based on a new game value.
     */
    updateStats(val) {
        this.liveValue(val);

        if (val < this.recordedMin()) this.recordedMin(val);
        if (val > this.recordedMax()) this.recordedMax(val);

        AuraManager.save();
    }

    serialize() {
        return {
            type: this.type,
            category: this.category,
            min: this.recordedMin(),
            max: this.recordedMax(),
            locked: this.isLocked(),
            selected: this._userValue(),
        };
    }

    deserialize(data) {
        if (data.min !== undefined) this.recordedMin(data.min);
        if (data.max !== undefined) this.recordedMax(data.max);
        if (data.locked !== undefined) this.isLocked(data.locked);
        if (data.selected !== undefined) this._userValue(data.selected);

        // Sanity check
        if (this.liveValue() < this.recordedMin())
            this.recordedMin(this.liveValue());
        if (this.liveValue() > this.recordedMax())
            this.recordedMax(this.liveValue());
    }
}

const AuraManager = {
    records: ko.observableArray([]),
    initialized: false,

    save() {
        if (!this.initialized) return;
        const data = this.records().map((record) => record.serialize());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    load() {
        try {
            const str = localStorage.getItem(STORAGE_KEY);
            if (!str) return [];
            return JSON.parse(str);
        } catch (e) {
            console.error("[AuraManager] Error loading data", e);
            return [];
        }
    },
};

/**
 * Initializes External Auras (globally applied auras).
 */
function initializeExternalAuras(collection, category, savedData) {
    if (!collection) return;

    collection.forEach((gameObservable, index) => {
        if (!gameObservable) return;

        const controller = new AuraController(index, gameObservable, category);

        const saved = savedData.find(
            (d) => d.type === index && d.category === category,
        );

        if (saved) {
            controller.deserialize(saved);
        }

        AuraManager.records.push(controller);

        // Patch the game observable with our interception logic
        const patchedComputed = ko.pureComputed(() => {
            if (controller.isLocked()) {
                return Number(controller.userValue());
            }
            return Number(controller.gameObservable());
        });

        collection[index] = patchedComputed;
    });
}

/**
 * Initializes Plot Auras (per-plot auras, shared controller).
 */
function initializePlotAuras(plotList, savedData) {
    if (!plotList) return;

    const auraMap = [
        { prop: "auraGrowth", type: AuraType.Growth },
        { prop: "auraHarvest", type: AuraType.Harvest },
        { prop: "auraMutation", type: AuraType.Mutation },
        { prop: "auraReplant", type: AuraType.Replant },
        { prop: "auraDeath", type: AuraType.Death },
        { prop: "auraDecay", type: AuraType.Decay },
        { prop: "auraBoost", type: AuraType.Boost },
    ];

    const sharedControllers = {};

    // Create shared controllers for each aura type
    auraMap.forEach(({ type }) => {
        const controller = new AuraController(type, null, CATEGORY.PLOT);

        const saved = savedData.find(
            (d) => d.type === type && d.category === CATEGORY.PLOT,
        );

        if (saved) {
            controller.deserialize(saved);
        }

        AuraManager.records.push(controller);
        sharedControllers[type] = controller;
    });

    // Patch every plot to use shared controllers
    plotList.forEach((plot) => {
        auraMap.forEach(({ prop, type }) => {
            const originalComputed = plot[prop];
            if (!originalComputed) return;

            const controller = sharedControllers[type];

            // Feed plot values into the shared controller logic
            originalComputed.subscribe((val) => {
                controller.updateStats(val);
            });

            // Patch the plot property
            const patchedComputed = ko.pureComputed(() => {
                // Critical Check: Lum Berry ignores Boost Aura loops
                if (
                    type === AuraType.Boost &&
                    plot.berry === BerryType.Lum
                ) {
                    return 1;
                }

                if (controller.isLocked()) {
                    return Number(controller.userValue());
                }
                return Number(originalComputed());
            });

            plot[prop] = patchedComputed;
        });
    });
}

function init() {
    if (AuraManager.initialized) return;
    if (!App.game || !App.game.farming) return;

    const farming = App.game.farming;
    const savedData = AuraManager.load();

    initializeExternalAuras(
        farming.externalAuras,
        CATEGORY.EXTERNAL,
        savedData,
    );

    if (farming.plotList) {
        initializePlotAuras(farming.plotList, savedData);
    }

    injectUserInterface();
    AuraManager.initialized = true;
}

function injectUserInterface() {
    const modal = document.getElementById("farmModal");
    if (!modal) return;

    // Inject Tabs
    const navTabs = modal.querySelector(".nav-tabs");
    if (navTabs && !document.getElementById("auraManagerTab")) {
        const li = document.createElement("li");
        li.className = "nav-item";
        li.id = "auraManagerTab";
        li.innerHTML = `<a data-toggle='tab' class='nav-link' href="#auraManagerView" onclick="FarmController.farmingModalTabSelected('auraManagerView')">Auras</a>`;
        navTabs.insertBefore(li, navTabs.lastElementChild);
    }

    // Inject Content
    const tabContent = modal.querySelector(".tab-content");
    if (tabContent && !document.getElementById("auraManagerView")) {
        const div = document.createElement("div");
        div.id = "auraManagerView";
        div.className = "tab-pane fade";
        div.innerHTML = `
            <div class="row m-0 justify-content-center">
                <div class="col-12 p-3">
                    <h4 class="text-center">Aura Manager</h4>
                    <p class="text-center text-muted small">Lock an aura to force its value within recorded limits.</p>
                    
                    <h5 class="mt-2">External Auras</h5>
                    <!-- External Table -->
                    <table class="table table-striped table-hover table-bordered table-sm text-center">
                        <thead>
                            <tr>
                                <th class="align-middle">Aura</th>
                                <th class="align-middle">Live Value</th>
                                <th class="align-middle">Recorder (Min / Max)</th>
                                <th class="align-middle" style="width: 40%">Adjustment</th>
                            </tr>
                        </thead>
                        <tbody data-bind="foreach: AuraManager.records().filter(r => r.category === '${CATEGORY.EXTERNAL}')">
                            <tr>
                                <td class="align-middle font-weight-bold" data-bind="text: name"></td>
                                <td class="align-middle"><span data-bind="text: liveValue().toFixed(4)"></span></td>
                                <td class="align-middle">
                                    <span class="text-muted" data-bind="text: recordedMin().toFixed(4)"></span> - 
                                    <span class="text-success" data-bind="text: recordedMax().toFixed(4)"></span>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center justify-content-center">
                                        <div class="custom-control custom-switch mr-2">
                                            <input type="checkbox" class="custom-control-input" 
                                                data-bind="checked: isLocked, attr: { id: 'auraExternal_' + type }">
                                            <label class="custom-control-label" 
                                                data-bind="attr: { for: 'auraExternal_' + type }">Lock</label>
                                        </div>
                                        <input type="range" class="custom-range flex-grow-1 mx-2" 
                                            data-bind="value: userValue, enable: isLocked, attr: { min: recordedMin, max: recordedMax, step: (recordedMax()-recordedMin())/100, title: userValue().toFixed(4) }">
                                        <input type="number" class="form-control form-control-sm ml-1" style="width: 80px;" 
                                            data-bind="value: userValue, enable: isLocked, attr: { min: recordedMin, max: recordedMax, step: 'any' }">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <h5 class="mt-4">Plot Auras</h5>
                    <!-- Plot Table -->
                    <table class="table table-striped table-hover table-bordered table-sm text-center">
                        <thead>
                            <tr>
                                <th class="align-middle">Aura</th>
                                <th class="align-middle">Live Value</th>
                                <th class="align-middle">Recorder (Min / Max)</th>
                                <th class="align-middle" style="width: 40%">Adjustment</th>
                            </tr>
                        </thead>
                        <tbody data-bind="foreach: AuraManager.records().filter(r => r.category === '${CATEGORY.PLOT}')">
                            <tr>
                                <td class="align-middle font-weight-bold" data-bind="text: name"></td>
                                <td class="align-middle"><span data-bind="text: liveValue().toFixed(4)"></span></td>
                                <td class="align-middle">
                                    <span class="text-muted" data-bind="text: recordedMin().toFixed(4)"></span> - 
                                    <span class="text-success" data-bind="text: recordedMax().toFixed(4)"></span>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center justify-content-center">
                                        <div class="custom-control custom-switch mr-2">
                                            <input type="checkbox" class="custom-control-input" 
                                                data-bind="checked: isLocked, attr: { id: 'auraPlot_' + type }">
                                            <label class="custom-control-label" 
                                                data-bind="attr: { for: 'auraPlot_' + type }">Lock</label>
                                        </div>
                                        <input type="range" class="custom-range flex-grow-1 mx-2" 
                                            data-bind="value: userValue, enable: isLocked, attr: { min: recordedMin, max: recordedMax, step: (recordedMax()-recordedMin())/100, title: userValue().toFixed(4) }">
                                        <input type="number" class="form-control form-control-sm ml-1" style="width: 80px;" 
                                            data-bind="value: userValue, enable: isLocked, attr: { min: recordedMin, max: recordedMax, step: 'any' }">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        tabContent.appendChild(div);
        ko.applyBindings({ AuraManager }, div);
    }
}

// Loader
function loadScript(scriptName, initFunction, priorityFunction) {
    function reportScriptError(scriptName, error) {
        console.error(
            `Error while initializing '${scriptName}' userscript:\n${error}`,
        );
        Notifier.notify({
            type: NotificationConstants.NotificationOption.warning,
            title: scriptName,
            message: `The '${scriptName}' userscript crashed while loading. Check for updates or disable the script, then restart the game.\n\nReport script issues to the script developer, not to the Pokéclicker team.`,
            timeout: GameConstants.DAY,
        });
    }
    const windowObject = !App.isUsingClient ? unsafeWindow : window;
    // Inject handlers if they don't exist yet
    if (windowObject.ScriptInitializers === undefined) {
        windowObject.ScriptInitializers = {};
        const oldInit = Preload.hideSplashScreen;
        var hasInitialized = false;

        // Initializes scripts once enough of the game has loaded
        Preload.hideSplashScreen = function (...args) {
            var result = oldInit.apply(this, args);
            if (App.game && !hasInitialized) {
                // Initialize all attached userscripts
                Object.entries(windowObject.ScriptInitializers).forEach(
                    ([scriptName, initFunction]) => {
                        try {
                            initFunction();
                            console.log(`'${scriptName}' userscript loaded.`);
                        } catch (e) {
                            reportScriptError(scriptName, e);
                        }
                    },
                );
                hasInitialized = true;
            }
            return result;
        };
    }

    // Prevent issues with duplicate script names
    if (windowObject.ScriptInitializers[scriptName] !== undefined) {
        console.warn(`Duplicate '${scriptName}' userscripts found!`);
        Notifier.notify({
            type: NotificationConstants.NotificationOption.warning,
            title: scriptName,
            message: `Duplicate '${scriptName}' userscripts detected. This could cause unpredictable behavior and is not recommended.`,
            timeout: GameConstants.DAY,
        });
        let number = 2;
        while (
            windowObject.ScriptInitializers[`${scriptName} ${number}`] !==
            undefined
        ) {
            number++;
        }
        scriptName = `${scriptName} ${number}`;
    }
    // Add initializer for this particular script
    windowObject.ScriptInitializers[scriptName] = initFunction;
    // Run any functions that need to execute before the game starts
    if (priorityFunction) {
        $(document).ready(() => {
            try {
                priorityFunction();
            } catch (e) {
                reportScriptError(scriptName, e);
                // Remove main initialization function
                windowObject.ScriptInitializers[scriptName] = () => null;
            }
        });
    }
}

if (!App.isUsingClient) {
    unsafeWindow.AuraManager = AuraManager;
} else {
    window.AuraManager = AuraManager;
}

loadScript("Farming Aura Manager", init);
