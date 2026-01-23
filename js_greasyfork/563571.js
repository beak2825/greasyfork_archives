// ==UserScript==
// @name          [Pokeclicker] Shared EVs
// @namespace     Pokeclicker Scripts
// @author        wizanyx
// @description   Share Effort Points (EVs) across all Pokemon with Pokerus (Resistant).
// @copyright     https://github.com/wizanyx
// @license       GPL-3.0 License
// @version       0.0.1

// @homepageURL   https://github.com/wizanyx/Pokeclicker-Scripts/
// @supportURL    https://github.com/wizanyx/Pokeclicker-Scripts/issues

// @match         https://www.pokeclicker.com/
// @icon          https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant         unsafeWindow
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/563571/%5BPokeclicker%5D%20Shared%20EVs.user.js
// @updateURL https://update.greasyfork.org/scripts/563571/%5BPokeclicker%5D%20Shared%20EVs.meta.js
// ==/UserScript==

const SETTINGS = {
    STORAGE_KEY: "pokeclicker_sharedEVs_settings",
    UI_CONTAINER_ID: "customScriptsContainer",
};

/**
 * Core Manager for the Shared EVs functionality.
 * Handles state management, persistence, and value tracking.
 */
const SharedEVsManager = {
    // Observable state
    totalEffortPoints: ko.observable(0),
    enabled: ko.observable(true),
    
    // Internal tracking
    _tempEffortPoints: 0,
    initialized: false,

    /**
     * Initializes the manager, loads settings, and calculates initial pool.
     */
    initialize() {
        this.load();
        
        // Calculate initial pool from all caught Pokemon
        const currentTotal = App.game.party.caughtPokemon.reduce(
            (acc, p) => acc + p.effortPoints,
            0
        );
        
        this.totalEffortPoints(currentTotal);
        this._tempEffortPoints = currentTotal;
        this.initialized = true;

        // Auto-save loop
        setInterval(() => this.save(), 60000);
        
        // Subscribe to changes
        this.enabled.subscribe(() => this.save());
    },

    /**
     * Loads settings from LocalStorage.
     */
    load() {
        try {
            const json = localStorage.getItem(SETTINGS.STORAGE_KEY);
            if (json) {
                const data = JSON.parse(json);
                if (data.enabled !== undefined) this.enabled(data.enabled);
            }
        } catch (e) {
            console.error("[SharedEVs] Failed to load settings:", e);
        }
    },

    /**
     * Saves current settings to LocalStorage.
     */
    save() {
        if (!this.initialized) return;
        
        // Update observable from temp tracker to ensure UI is fresh
        this.totalEffortPoints(this._tempEffortPoints);

        const data = {
            enabled: this.enabled()
        };
        localStorage.setItem(SETTINGS.STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Updates the internal tracker when EP is gained.
     * @param {number} delta - The amount of EP gained.
     */
    addEffortPoints(delta) {
        this._tempEffortPoints += delta;
    }
};

/**
 * Handles Game Logic patches (Monkey Patching).
 */
const GameMechanics = {
    applyPatches() {
        // Patch PartyPokemon.effortPoints setter to track gains
        const originalEffortPointsDescriptor = Object.getOwnPropertyDescriptor(
            PartyPokemon.prototype,
            "effortPoints"
        );

        Object.defineProperty(PartyPokemon.prototype, "effortPoints", {
            set: function (value) {
                SharedEVsManager.addEffortPoints(value - this._effortPoints());
                originalEffortPointsDescriptor.set.call(this, value);
            },
        });

        // Patch calculateEVs to use the shared pool
        PartyPokemon.prototype.calculateEVs = function () {
            const power = App.game.challenges.list.slowEVs.active.peek()
                ? GameConstants.EP_CHALLENGE_MODIFIER
                : 1;

            // Standard Behavior if disabled
            if (!SharedEVsManager.enabled()) {
                return this._effortPoints() / GameConstants.EP_EV_RATIO / power;
            }

            // Shared Behavior
            const epToUse = (this.pokerus >= GameConstants.Pokerus.Resistant)
                ? SharedEVsManager.totalEffortPoints()
                : this._effortPoints();

            return epToUse / GameConstants.EP_EV_RATIO / power;
        };
    }
};

/**
 * Handles User Interface Injection and Customizations.
 */
const UserInterface = {
    /**
     * Injects the shared scripts container into the Left Column.
     */
    createContainer() {
        if (document.getElementById(SETTINGS.UI_CONTAINER_ID)) return;

        const leftColumn = document.getElementById("left-column");
        if (leftColumn) {
            const div = document.createElement("div");
            div.id = SETTINGS.UI_CONTAINER_ID;
            div.className = "card sortable border-secondary mb-3";
            div.innerHTML = `
                <div class="card-header p-0" data-toggle="collapse" href="#customScriptsBody">
                    <span>Scripts</span>
                </div>
                <div id="customScriptsBody" class="card-body p-0 show"></div>
            `;
            leftColumn.appendChild(div);
        }
    },

    /**
     * Injects the Shared EVs card into the container.
     */
    injectScriptCard() {
        // Check if card already exists
        if (document.getElementById("sharedEVsDisplay")) return;
        
        const displayDiv = document.createElement("div");
        displayDiv.id = "sharedEVsDisplay";

        const html = `
            <div class="card-header p-0 border-top" data-toggle="collapse" href="#sharedEVsInner">
                <span>Shared EVs</span>
            </div>
            <div id="sharedEVsInner" class="collapse show">
                <div class="card-body p-0">
                     <button class="btn btn-block"
                        style="border-radius: 0;"
                        data-bind="
                            click: function() { SharedEVsManager.enabled(!SharedEVsManager.enabled()); },
                            class: SharedEVsManager.enabled() ? 'btn-success' : 'btn-danger',
                            text: 'Enabled [' + (SharedEVsManager.enabled() ? 'ON' : 'OFF') + ']'
                        ">
                    </button>
                </div>
            </div>
        `;
        
        displayDiv.innerHTML = html;
        const scriptBody = document.getElementById("customScriptsBody");
        scriptBody.appendChild(displayDiv);
        ko.applyBindings({ SharedEVsManager }, displayDiv);
    }
};

/**
 * Main Initialization Function
 */
function initializeSharedEVs() {
    SharedEVsManager.initialize();
    UserInterface.injectScriptCard();
}

/**
 * Run patches before game start
 */
function runPriorityPatches() {
    GameMechanics.applyPatches();
    UserInterface.createContainer();
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
    unsafeWindow.SharedEVsManager = SharedEVsManager;
} else {
    window.SharedEVsManager = SharedEVsManager;
}

loadScript("Shared EVs", initializeSharedEVs, runPriorityPatches);
