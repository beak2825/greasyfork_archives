// ==UserScript==
// @name          [Pokeclicker] Multiple Held Items
// @namespace     Pokeclicker Scripts
// @author        wizanyx
// @description   Allows pokemon to hold multiple items
// @copyright     https://github.com/wizanyx
// @license       GPL-3.0 License
// @version       0.0.1

// @homepageURL   https://github.com/wizanyx/Pokeclicker-Scripts/
// @supportURL    https://github.com/wizanyx/Pokeclicker-Scripts/issues

// @match         https://www.pokeclicker.com/
// @icon          https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant         unsafeWindow
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/563570/%5BPokeclicker%5D%20Multiple%20Held%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/563570/%5BPokeclicker%5D%20Multiple%20Held%20Items.meta.js
// ==/UserScript==

const SETTINGS = {
    STORAGE_KEY: "pokeclicker_multipleHeldItems_backup",
    SETTINGS_KEY: "pokeclicker_multipleHeldItems_settings",
    UI_CONTAINER_ID: "customScriptsContainer",
};

/**
 * Controller for Multiple Held Items feature.
 * Manages game logic patches, data persistence, and state synchronization.
 */
const HeldItemsManager = {
    backupData: null,
    enabled: ko.observable(true),

    /**
     * Saves the current held items state to local storage.
     * Prevents data loss by backing up assignment.
     */
    save() {
        if (!App.game || !App.game.party) return;
        const backup = {};
        let hasData = false;
        App.game.party.caughtPokemon.forEach((p) => {
            if (p.heldItems && p.heldItems().length > 0) {
                backup[p.id] = p.heldItems().map((i) => i.name);
                hasData = true;
            }
        });
        if (hasData) {
            localStorage.setItem(SETTINGS.STORAGE_KEY, JSON.stringify(backup));
        }

        // Save settings
        localStorage.setItem(
            SETTINGS.SETTINGS_KEY,
            JSON.stringify({
                enabled: this.enabled(),
            }),
        );
    },

    /**
     * Loads backup data from local storage.
     */
    load() {
        // Load Settings
        try {
            const settings = localStorage.getItem(SETTINGS.SETTINGS_KEY);
            if (settings) {
                const data = JSON.parse(settings);
                this.enabled(data.enabled !== undefined ? data.enabled : true);
            }
        } catch (e) {
            console.error("[MultipleHeldItems] Failed to load settings", e);
        }

        if (Party.multipleHeldItemsPatched) return;
        try {
            const json = localStorage.getItem(SETTINGS.STORAGE_KEY);
            if (json) {
                this.backupData = JSON.parse(json);
                console.log("[MultipleHeldItems] Backup loaded.");
                Party.multipleHeldItemsPatched = true;
            }
        } catch (e) {
            console.error("[MultipleHeldItems] Failed to load backup", e);
        }
    },

    /**
     * Augments a specific Pokemon instance to support multiple held items.
     * Monkey-patches observables and computed properties for item bonuses.
     * @param {PartyPokemon} pokemon - The pokemon instance to patch.
     */
    augmentPokemon(pokemon) {
        if (pokemon._multipleHeldItemsPatched) return;
        pokemon._multipleHeldItemsPatched = true;

        if (!pokemon.heldItems) {
            pokemon.heldItems = ko.observableArray([]);
        }

        // Migration: Sync initial heldItem to heldItems list if not present
        if (
            pokemon.heldItem() &&
            !pokemon.heldItems().some((i) => i.name == pokemon.heldItem().name)
        ) {
            pokemon.heldItems.push(pokemon.heldItem());
        }

        // Patch heldItemAttackBonus to sum up modifiers
        if (pokemon.heldItemAttackBonus) {
            pokemon.heldItemAttackBonus.dispose();
            pokemon.heldItemAttackBonus = ko.pureComputed(() => {
                if (!HeldItemsManager.enabled()) {
                    // Fallback to original single item behavior
                    const item = pokemon.heldItem();
                    return item && item.attackBonus ? item.attackBonus : 1;
                }
                return pokemon.heldItems().reduce((acc, item) => {
                    const bonus =
                        item && item.attackBonus ? item.attackBonus : 1;
                    return acc * bonus;
                }, 1);
            });
        }

        // Patch clickAttackBonus
        if (pokemon.clickAttackBonus) {
            pokemon.clickAttackBonus.dispose();
            pokemon.clickAttackBonus = ko.pureComputed(() => {
                const bonus =
                    1 +
                    +pokemon.shiny +
                    +(pokemon.pokerus >= GameConstants.Pokerus.Resistant) +
                    +(pokemon.shadow == GameConstants.ShadowStatus.Purified);

                let itemBonus = 1;

                if (!HeldItemsManager.enabled()) {
                    // Fallback
                    const item = pokemon.heldItem();
                    itemBonus =
                        item && item.clickAttackBonus
                            ? item.clickAttackBonus
                            : 1;
                } else {
                    itemBonus = pokemon.heldItems().reduce((acc, item) => {
                        const bonus =
                            item && item.clickAttackBonus
                                ? item.clickAttackBonus
                                : 1;
                        return acc * bonus;
                    }, 1);
                }
                return bonus * itemBonus;
            });
        }

        // Patch _canUseHeldItem to check all items and remove invalid ones
        if (pokemon._canUseHeldItem) {
            pokemon._canUseHeldItem.dispose();
            ko.computed(() => {
                const items = [...pokemon.heldItems()];
                items.forEach((item) => {
                    if (item && item.canUse && !item.canUse(pokemon)) {
                        pokemon.addOrRemoveHeldItem(item);
                    }
                });
            });
            pokemon._canUseHeldItem = ko.pureComputed(() => {
                if (!HeldItemsManager.enabled()) {
                    const item = pokemon.heldItem();
                    return !item || !item.canUse || item.canUse(pokemon);
                }
                return pokemon
                    .heldItems()
                    .every(
                        (item) => item && item.canUse && item.canUse(pokemon),
                    );
            });
        }

        // Patch giveHeldItem
        pokemon.giveHeldItem = function (heldItem) {
            if (!heldItem) return;

            const alreadyHolding = pokemon
                .heldItems()
                .some((i) => i.name == heldItem.name);

            if (alreadyHolding) {
                if (Settings.getSetting("confirmChangeHeldItem").value) {
                    Notifier.confirm({
                        title: "Remove held item",
                        message:
                            "Held items are one time use only.\nRemoved items will be lost.\nAre you sure you want to remove it?",
                        confirm: "Remove",
                        type: NotificationConstants.NotificationOption.warning,
                    }).then((confirmed) => {
                        if (confirmed) {
                            pokemon.addOrRemoveHeldItem(heldItem);
                        }
                    });
                } else {
                    pokemon.addOrRemoveHeldItem(heldItem);
                }
                return;
            }

            if (heldItem.canUse && !heldItem.canUse(pokemon)) {
                Notifier.notify({
                    message: `This Pokémon cannot use ${heldItem.displayName}.`,
                    type: NotificationConstants.NotificationOption.warning,
                });
                return;
            }
            if (player.amountOfItem(heldItem.name) < 1) {
                Notifier.notify({
                    message: `You don't have any ${heldItem.displayName} left.`,
                    type: NotificationConstants.NotificationOption.warning,
                });
                return;
            }

            pokemon.addOrRemoveHeldItem(heldItem);
        };
    },

    /**
     * Applies prototype override patches to PartyPokemon, Party, and Controllers.
     * Hooks into JSON serialization and calculation methods.
     */
    applyPrototypePatches() {
        // Hook Prototype methods
        const oldFromJSON = PartyPokemon.prototype.fromJSON;
        PartyPokemon.prototype.fromJSON = function (json) {
            oldFromJSON.call(this, json);

            if (!this.heldItems) {
                this.heldItems = ko.observableArray([]);
            }

            if (json && json.heldItems) {
                const items = json.heldItems
                    .map((name) => ItemList[name])
                    .filter((i) => i instanceof HeldItem);
                this.heldItems(items);

                if (!this.heldItem() && items.length > 0) {
                    this.heldItem(items[items.length - 1]);
                }
            }
        };

        const oldToJSON = PartyPokemon.prototype.toJSON;
        PartyPokemon.prototype.toJSON = function () {
            const json = oldToJSON.call(this);
            json.heldItems = this.heldItems().map((i) => i.name);
            return json;
        };

        const oldPartyToJSON = Party.prototype.toJSON;
        Party.prototype.toJSON = function () {
            const json = oldPartyToJSON.call(this);
            json.multipleHeldItemsPatched = Party.multipleHeldItemsPatched;
            return json;
        };

        const oldPartyFromJSON = Party.prototype.fromJSON;
        Party.prototype.fromJSON = function (json) {
            Party.multipleHeldItemsPatched =
                json.multipleHeldItemsPatched || false;
            oldPartyFromJSON.call(this, json);
        };

        // Override getExpMultiplier logic
        PartyPokemon.prototype.getExpMultiplier = function () {
            let result = 1;
            if (HeldItemsManager.enabled() && this.heldItems) {
                this.heldItems().forEach((item) => {
                    if (item && item instanceof ExpGainedBonusHeldItem) {
                        result *= item.gainedBonus;
                    }
                });
            } else if (
                this.heldItem &&
                this.heldItem() &&
                this.heldItem() instanceof ExpGainedBonusHeldItem
            ) {
                result *= this.heldItem().gainedBonus;
            }
            return result;
        };

        // Override calculateEffortPoints logic
        if (Party.prototype.calculateEffortPoints) {
            Party.prototype.calculateEffortPoints = function (
                pokemon,
                shiny,
                shadow,
                number = GameConstants.BASE_EP_YIELD,
                ignore = false,
            ) {
                if (pokemon.pokerus < GameConstants.Pokerus.Contagious) {
                    return 0;
                }

                if (ignore) {
                    return 0;
                }

                let EPNum = number * App.game.multiplier.getBonus("ev");

                if (
                    HeldItemsManager.enabled() &&
                    pokemon.heldItems &&
                    pokemon.heldItems().length > 0
                ) {
                    pokemon.heldItems().forEach((item) => {
                        if (item && item instanceof EVsGainedBonusHeldItem) {
                            EPNum *= item.gainedBonus;
                        }
                    });
                } else if (
                    pokemon.heldItem() &&
                    pokemon.heldItem() instanceof EVsGainedBonusHeldItem
                ) {
                    EPNum *= pokemon.heldItem().gainedBonus;
                }

                if (shiny) {
                    EPNum *= GameConstants.SHINY_EP_MODIFIER;
                }

                if (shadow == GameConstants.ShadowStatus.Shadow) {
                    EPNum *= GameConstants.SHADOW_EP_MODIFIER;
                }

                return Math.floor(EPNum);
            };
        }

        // Patch addOrRemoveHeldItem
        PartyPokemon.prototype.addOrRemoveHeldItem = function (heldItem) {
            const existing = this.heldItems().find(
                (i) => i.name == heldItem.name,
            );
            if (existing) {
                this.heldItems.remove(existing);
                if (this.heldItem() && this.heldItem().name == heldItem.name) {
                    this.heldItem(
                        this.heldItems().length
                            ? this.heldItems()[this.heldItems().length - 1]
                            : undefined,
                    );
                }
            } else {
                player.loseItem(heldItem.name, 1);
                this.heldItems.push(heldItem);
                if (!this.heldItem()) {
                    this.heldItem(heldItem);
                }
            }
        };

        // Patch PartyController.getHeldItemFilteredList
        PartyController.getHeldItemFilteredList = function () {
            return App.game.party.caughtPokemon.filter((pokemon) => {
                if (pokemon.id <= 0) return false;

                const selectedItem = HeldItem.heldItemSelected();
                if (!selectedItem || !selectedItem.canUse(pokemon))
                    return false;

                const searchFilterSetting = Settings.getSetting(
                    "heldItemSearchFilter",
                );
                if (searchFilterSetting.observableValue() != "") {
                    const regex = searchFilterSetting.regex();
                    let match;
                    if (
                        Settings.getSetting(
                            "heldItemDropdownPokemonOrItem",
                        ).observableValue() === "pokemon"
                    ) {
                        match = PokemonHelper.matchPokemonByNames(
                            regex,
                            pokemon.name,
                            pokemon,
                        );
                    } else {
                        match = pokemon
                            .heldItems()
                            .some((h) => regex.test(h.displayName));
                    }
                    if (!match) return false;
                }

                if (
                    Settings.getSetting(
                        "heldItemRegionFilter",
                    ).observableValue() > -2
                ) {
                    if (
                        PokemonHelper.calcNativeRegion(pokemon.name) !==
                        Settings.getSetting(
                            "heldItemRegionFilter",
                        ).observableValue()
                    ) {
                        return false;
                    }
                }
                const type1 =
                    Settings.getSetting("heldItemTypeFilter").observableValue();
                const type2 = Settings.getSetting(
                    "heldItemType2Filter",
                ).observableValue();
                if (type1 !== -2 || type2 !== -2) {
                    const { type: types } = pokemonMap[pokemon.name];
                    if ([type1, type2].includes(PokemonType.None)) {
                        const type = type1 == PokemonType.None ? type2 : type1;
                        if (
                            !BreedingController.isPureType(
                                pokemon,
                                type === -2 ? null : type,
                            )
                        ) {
                            return false;
                        }
                    } else if (
                        (type1 !== -2 && !types.includes(type1)) ||
                        (type2 !== -2 && !types.includes(type2))
                    ) {
                        return false;
                    }
                }

                if (
                    Settings.getSetting(
                        "heldItemHideHoldingPokemon",
                    ).observableValue() &&
                    pokemon.heldItems().length > 0
                ) {
                    return false;
                }
                if (
                    Settings.getSetting(
                        "heldItemHideHoldingThisItem",
                    ).observableValue() &&
                    pokemon.heldItems().some((i) => i.name == selectedItem.name)
                ) {
                    return false;
                }

                return true;
            });
        };
    },
};

/**
 * Manages UI injections and customizations.
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

    injectScriptCard() {
        // Check if card already exists
        if (document.getElementById("multipleHeldItemsDisplay")) return;

        const displayDiv = document.createElement("div");
        displayDiv.id = "multipleHeldItemsDisplay";

        const html = `
            <div class="card-header p-0 border-top" data-toggle="collapse" href="#multipleHeldItemsInner">
                <span>Multiple Held Items</span>
            </div>
            <div id="multipleHeldItemsInner" class="collapse show">
                <div class="card-body p-0">
                     <button class="btn btn-block"
                        style="border-radius: 0;"
                        data-bind="
                            click: function() { HeldItemsManager.enabled(!HeldItemsManager.enabled()); },
                            class: HeldItemsManager.enabled() ? 'btn-success' : 'btn-danger',
                            text: 'Enabled [' + (HeldItemsManager.enabled() ? 'ON' : 'OFF') + ']'
                        ">
                    </button>
                </div>
            </div>
        `;

        displayDiv.innerHTML = html;
        const scriptBody = document.getElementById("customScriptsBody");
        scriptBody.appendChild(displayDiv);
        ko.applyBindings({ HeldItemsManager }, displayDiv);
    },

    injectStatsModal() {
        if (document.getElementById("multipleHeldItemsModalDisplay")) return;

        const target = document.querySelector(
            "#pokemonStatisticsModal .modal-body .col-12.col-lg-6",
        );
        if (!target) return;

        const html = `
        <div id="multipleHeldItemsModalDisplay" class="mt-2">
            <!-- ko if: App.game.party.getPokemon(App.game.statistics.selectedPokemonID()) -->
            <table class="table table-striped table-hover table-bordered table-sm m-0 mb-2">
                <thead>
                    <tr class="bg-secondary">
                        <th colspan="2">Held Items (Multiple)</th>
                    </tr>
                </thead>
                <tbody data-bind="foreach: App.game.party.getPokemon(App.game.statistics.selectedPokemonID()).heldItems">
                    <tr>
                        <td class="text-left align-middle">
                            <span data-bind="text: displayName"></span>
                            <!-- ko if: App.game.party.getPokemon(App.game.statistics.selectedPokemonID()).heldItem() && App.game.party.getPokemon(App.game.statistics.selectedPokemonID()).heldItem().name == $data.name -->
                                <span class="badge badge-primary float-right" style="font-size: 0.8em; margin-top: 3px;">Primary</span>
                            <!-- /ko -->
                            <!-- ko if: !App.game.party.getPokemon(App.game.statistics.selectedPokemonID()).heldItem() || App.game.party.getPokemon(App.game.statistics.selectedPokemonID()).heldItem().name != $data.name -->
                                 <button class="btn btn-sm btn-secondary float-right" style="padding: 0px 6px; font-size: 0.8em;"
                                     data-bind="click: function() { App.game.party.getPokemon(App.game.statistics.selectedPokemonID()).heldItem($data) }">
                                     Set Primary
                                 </button>
                            <!-- /ko -->
                        </td>
                        <td class="text-center align-middle tight">
                            <button class="btn btn-sm btn-danger" style="padding: 0px 6px;" 
                                data-bind="click: function() { App.game.party.getPokemon(App.game.statistics.selectedPokemonID()).addOrRemoveHeldItem($data) }">
                                &#x00d7;
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- /ko -->
        </div>`;

        const div = document.createElement("div");
        div.innerHTML = html;
        target.appendChild(div);
        ko.applyBindings({}, div);
    },

    injectBatchButton() {
        const modalId = "heldItemModal";
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const inject = () => {
            const sticky = modal.querySelector(".sticky-top");
            if (!sticky) return;
            if (document.getElementById("heldItemBatchGiveContainer")) return;

            const container = document.createElement("div");
            container.id = "heldItemBatchGiveContainer";
            container.className = "px-1 mt-1 pb-2";

            const html = `
            <!-- ko if: Settings.getSetting('heldItemHideHoldingThisItem') && Settings.getSetting('heldItemHideHoldingThisItem').observableValue() -->
            <button class="btn btn-block btn-success" data-bind="click: function() {
                const item = HeldItem.heldItemSelected();
                if (!item) return;

                const visiblePokemon = ko.unwrap(PartyController.getHeldItemSortedList());
                
                if (visiblePokemon.length === 0) {
                    Notifier.notify({ message: 'No Pokémon visible to give items to!', type: NotificationConstants.NotificationOption.warning });
                    return;
                }

                if (player.amountOfItem(item.name) <= 0) {
                    Notifier.notify({ message: 'You have no ' + item.displayName + ' left!', type: NotificationConstants.NotificationOption.danger });
                    return;
                }

                Notifier.confirm({
                        title: 'Batch Give Item',
                        message: 'Give ' + item.displayName + ' to all ' + visiblePokemon.length + ' visible Pokémon?<br/>(Stops if you run out of items)',
                        confirm: 'Give All',
                        type: NotificationConstants.NotificationOption.warning,
                    }).then((confirmed) => {
                        if (confirmed) {
                            let count = 0;
                            const list = [...visiblePokemon];
                            for (const p of list) {
                                if (player.amountOfItem(item.name) <= 0) break;
                                if (!p.heldItems().some(i => i.name == item.name)) {
                                    p.addOrRemoveHeldItem(item);
                                    count++;
                                }
                            }
                            Notifier.notify({ message: 'Gave ' + item.displayName + ' to ' + count + ' Pokémon.', type: NotificationConstants.NotificationOption.success });
                        }
                    });
            }">
                Give <strong data-bind="text: HeldItem.heldItemSelected()?.displayName"></strong> to All Visible
            </button>
            <!-- /ko -->
            `;

            container.innerHTML = html;
            sticky.appendChild(container);
            ko.applyBindings({}, container);
        };

        inject();
        const observer = new MutationObserver(() => inject());
        observer.observe(modal, { childList: true, subtree: true });
    },

    injectHeldItemModalObserver() {
        const modalId = "heldItemModal";
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const tbody = modal.querySelector("table tbody");
        if (!tbody) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === "TR") {
                        const td = node.querySelectorAll("td")[1];
                        if (td) {
                            ko.cleanNode(td);
                            td.innerHTML = `
                           <!-- ko foreach: $data.heldItems -->
                               <div style="display: inline-block; margin-right: 2px;"
                                    data-bind="tooltip: {
                                        title: $data.displayName,
                                        trigger: 'hover',
                                        placement: 'bottom'
                                    }">
                                   <img width="20" data-bind="attr: { src: $data.image }" />
                               </div>
                           <!-- /ko -->
                           `;
                            const context = ko.contextFor(node);
                            if (context) {
                                ko.applyBindings(context, td);
                            }
                        }
                    }
                });
            });
        });

        observer.observe(tbody, { childList: true });
    },
};

/**
 * Main Initialization Function
 */
function initializeMultipleHeldItems() {
    // Load persisted data
    HeldItemsManager.load();

    // Augment existing party members based on loaded backup or current state
    const backup = HeldItemsManager.backupData;

    if (App.game.party && App.game.party.caughtPokemon) {
        App.game.party.caughtPokemon.forEach((p) => {
            HeldItemsManager.augmentPokemon(p);

            // Restore from backup if needed
            if (backup && backup[p.id]) {
                const items = backup[p.id]
                    .map((name) => ItemList[name])
                    .filter((i) => i instanceof HeldItem);

                items.forEach((item) => {
                    if (!p.heldItems().some((i) => i.name == item.name)) {
                        p.heldItems.push(item);
                    }
                });
                // Sync visual state
                if (!p.HeldItem() && items.length > 0) {
                    p.heldItem(items[items.length - 1]);
                }
            }
        });

        // Watch for new Pokemon catches to augment them immediately
        App.game.party._caughtPokemon.subscribe(
            (changes) => {
                changes.forEach((change) => {
                    if (change.status === "added") {
                        HeldItemsManager.augmentPokemon(change.value);
                    }
                });
            },
            null,
            "arrayChange",
        );
    }

    // Initialize UI Components
    UserInterface.injectScriptCard();
    UserInterface.injectStatsModal();
    UserInterface.injectBatchButton();
    UserInterface.injectHeldItemModalObserver();

    // Setup Auto-Save
    setInterval(() => HeldItemsManager.save(), 60000);
    setTimeout(() => HeldItemsManager.save(), 5000);
}

// Hook to run prototype patches before main init
function runPatches() {
    HeldItemsManager.applyPrototypePatches();
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
    unsafeWindow.HeldItemsManager = HeldItemsManager;
} else {
    window.HeldItemsManager = HeldItemsManager;
}

loadScript("Multiple Held Items", initializeMultipleHeldItems, () => {
    runPatches()
    UserInterface.createContainer();
});
