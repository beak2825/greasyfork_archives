// ==UserScript==
// @name          [Pokeclicker] Idle Battle Frontier
// @namespace     Pokeclicker Scripts
// @author        wizanyx
// @description   Runs the Battle Frontier in background, allowing you to do other things while progressing through the Battle Frontier.
// @copyright     https://github.com/wizanyx
// @license       GPL-3.0 License
// @version       0.0.1

// @homepageURL   https://github.com/wizanyx/Pokeclicker-Scripts/
// @supportURL    https://github.com/wizanyx/Pokeclicker-Scripts/issues

// @match         https://www.pokeclicker.com/
// @icon          https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant         unsafeWindow
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/563569/%5BPokeclicker%5D%20Idle%20Battle%20Frontier.user.js
// @updateURL https://update.greasyfork.org/scripts/563569/%5BPokeclicker%5D%20Idle%20Battle%20Frontier.meta.js
// ==/UserScript==

const SETTINGS = {
    TICK_RATE: 500,
    UI_CONTAINER_ID: "customScriptsContainer",
    STORAGE_KEY: "pokeclicker_idleBattleFrontier_settings",
};

/**
 * Manages the main execution loop for the Idle Battle Frontier.
 */
const IdleFrontierManager = {
    running: ko.observable(false),
    autoRestart: ko.observable(false),
    loopInterval: null,

    /**
     * Loads settings from local storage
     */
    load() {
        try {
            const saved = localStorage.getItem(SETTINGS.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.running(data.running || false);
                this.autoRestart(data.autoRestart || false);
            }
        } catch (e) {
            console.error("Failed to load Idle Battle Frontier settings", e);
        }
    },

    /**
     * Saves settings to local storage
     */
    save() {
        const data = {
            running: this.running(),
            autoRestart: this.autoRestart(),
        };
        localStorage.setItem(SETTINGS.STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Starts the idle runner.
     * @param {boolean} useCheckpoint - Whether to start from the highest checkpoint.
     */
    start(useCheckpoint) {
        IdleRunner.start(useCheckpoint);
        this.stopLoop(); // Ensure no duplicate loops

        this.loopInterval = setInterval(() => {
            if (this.running()) {
                BattleMechanics.tick();
                IdleRunner.tick();
            } else {
                this.end();
            }
        }, SETTINGS.TICK_RATE);

        this.save();
    },

    /**
     * Stops the idle runner and clears the loop.
     */
    end() {
        this.running(false);
        this.stopLoop();
        this.save();
    },

    /**
     * Clears the interval timer.
     */
    stopLoop() {
        if (this.loopInterval) {
            clearInterval(this.loopInterval);
            this.loopInterval = null;
        }
    },

    /**
     * Initializes the manager, restoring state if needed.
     */
    init() {
        IdleFrontierManager.autoRestart.subscribe(() => {
            IdleFrontierManager.save();
        });
        // Check if we should auto-start
        if (IdleFrontierManager.running()) {
            IdleFrontierManager.start(true);
        }
    },
};

/**
 * Handles battle simulation mechanics, including enemy generation and attacking.
 */
class BattleMechanics {
    static enemyPokemon = ko.observable(null);
    static alternateAttack = false;
    static pokemonIndex = ko.observable(0);

    /**
     * Performed every tick of the idle loop.
     */
    static tick() {
        this.pokemonAttack();
    }

    /**
     * Simulates player pokemon attacking the enemy.
     */
    static pokemonAttack() {
        // attack twice as fast if we have defeated this stage
        this.alternateAttack = !this.alternateAttack;
        if (
            this.alternateAttack &&
            IdleRunner.stage() >
                App.game.statistics.battleFrontierHighestStageCompleted()
        ) {
            return;
        }

        const enemy = this.enemyPokemon();
        if (!enemy?.isAlive()) return;

        // Calculate and apply damage
        const damage = App.game.party.calculatePokemonAttack(
            enemy.type1,
            enemy.type2,
            true, // ignoreRegionMultiplier
            GameConstants.Region.none,
            false, // includeBreeding
            false, // useBaseAttack
            WeatherType.Clear,
        );
        enemy.damage(damage);

        if (!enemy.isAlive()) {
            this.defeatPokemon();
        }
    }

    /**
     * Handles logic when an enemy is defeated (rewards, progression).
     */
    static defeatPokemon() {
        this.enemyPokemon().defeat(true);

        // Progress Eggs
        App.game.breeding.progressEggsBattle(
            IdleRunner.stage(),
            GameConstants.Region.none,
        );

        // Advance internal counter
        GameHelper.incrementObservable(this.pokemonIndex);

        if (this.pokemonIndex() >= 3) {
            IdleRunner.nextStage();
            this.pokemonIndex(0);
        }

        if (IdleRunner.started()) {
            this.generateNewEnemy();
        } else {
            this.enemyPokemon(null);
        }
    }

    /**
     * Generates a new enemy based on the current stage and highest region.
     */
    static generateNewEnemy() {
        const enemy = pokemonMap.randomRegion(player.highestRegion());
        const stage = IdleRunner.stage();

        const health = PokemonFactory.routeHealth(
            stage + 10,
            GameConstants.Region.none,
        );
        const level = Math.min(100, stage);
        const money = 0; // Money is awarded at the end of the run
        const shiny = PokemonFactory.generateShiny(
            GameConstants.SHINY_CHANCE_BATTLE,
        );
        const gems = Math.ceil(stage / 80);
        const gender = PokemonFactory.generateGender(
            enemy.gender.femaleRatio,
            enemy.gender.type,
        );

        if (shiny) {
            GameHelper.incrementObservable(
                App.game.statistics.totalShinyTrainerPokemonSeen,
            );
        }

        const enemyPokemon = new BattlePokemon(
            enemy.name,
            enemy.id,
            enemy.type[0],
            enemy.type[1],
            health,
            level,
            0, // catchRate
            enemy.exp,
            new Amount(money, GameConstants.Currency.money),
            shiny,
            gems,
            gender,
            GameConstants.ShadowStatus.None,
            EncounterType.trainer,
        );
        this.enemyPokemon(enemyPokemon);
    }
}

/**
 * Extends the game's BattleFrontierRunner to manage the idle run state.
 */
class IdleRunner extends BattleFrontierRunner {
    static timeLeft = ko.observable(GameConstants.GYM_TIME);
    static timeLeftPercentage = ko.observable(100);
    static started = ko.observable(false);

    /**
     * Updates time tracking for the current stage.
     */
    static tick() {
        if (!this.started()) return;

        if (this.timeLeft() < 0) {
            this.battleLost();
        }

        this.timeLeft(this.timeLeft() - SETTINGS.TICK_RATE);
        this.timeLeftPercentage(
            Math.floor((this.timeLeft() / GameConstants.GYM_TIME) * 100),
        );
    }

    /**
     * Initializes the idle run.
     * @param {boolean} useCheckpoint
     */
    static async start(useCheckpoint) {
        if (!useCheckpoint && this.hasCheckpoint()) {
            const confirmed = await Notifier.confirm({
                title: "Restart Battle Frontier?",
                message:
                    "Current progress will be lost and you will restart from the first stage.",
                type: NotificationConstants.NotificationOption.warning,
                confirm: "OK",
            });
            if (!confirmed) return;
        }

        this.started(true);
        this.stage(useCheckpoint ? BattleFrontierRunner.checkpoint() : 1);
        BattleFrontierRunner.highest(
            App.game.statistics.battleFrontierHighestStageCompleted(),
        );

        BattleMechanics.pokemonIndex(0);
        BattleMechanics.generateNewEnemy();

        this.timeLeft(GameConstants.GYM_TIME);
        this.timeLeftPercentage(100);
        IdleFrontierManager.running(true);
    }

    /**
     * Advances to the next stage.
     */
    static nextStage() {
        BattleFrontierMilestones.gainReward(this.stage());

        if (
            App.game.statistics.battleFrontierHighestStageCompleted() <
            this.stage()
        ) {
            App.game.statistics.battleFrontierHighestStageCompleted(
                this.stage(),
            );
        }

        GameHelper.incrementObservable(this.stage);
        GameHelper.incrementObservable(
            App.game.statistics.battleFrontierTotalStagesCompleted,
        );

        this.timeLeft(GameConstants.GYM_TIME);
        this.timeLeftPercentage(100);
        BattleFrontierRunner.checkpoint(this.stage());
    }

    /**
     * Stops the run normally.
     */
    static end() {
        BattleMechanics.enemyPokemon(null);
        this.stage(1);
        this.started(false);
        IdleFrontierManager.running(false);
    }

    /**
     * Handles loss condition (time ran out).
     */
    static battleLost() {
        const stageBeaten = this.stage() - 1;
        const battleMultiplier = Math.max(stageBeaten / 100, 1);
        const battlePointsEarned = App.game.wallet.gainBattlePoints(
            Math.round(stageBeaten * battleMultiplier),
        ).amount;
        const moneyEarned = App.game.wallet.gainMoney(
            stageBeaten * 100 * battleMultiplier,
            true,
        ).amount;

        Notifier.notify({
            title: "Battle Frontier",
            message: `You managed to beat stage ${stageBeaten.toLocaleString("en-US")}.\nYou received <img src="./assets/images/currency/battlePoint.svg" height="24px"/> ${battlePointsEarned.toLocaleString("en-US")}.\nYou received <img src="./assets/images/currency/money.svg" height="24px"/> ${moneyEarned.toLocaleString("en-US")}.`,
            strippedMessage: `You managed to beat stage ${stageBeaten.toLocaleString("en-US")}.\nYou received ${battlePointsEarned.toLocaleString("en-US")} Battle Points.\nYou received ${moneyEarned.toLocaleString("en-US")} Pokédollars.`,
            type: NotificationConstants.NotificationOption.success,
            setting:
                NotificationConstants.NotificationSetting.General
                    .battle_frontier,
            sound: NotificationConstants.NotificationSound.General
                .battle_frontier,
            timeout: 30 * GameConstants.MINUTE,
        });

        App.game.logbook.newLog(
            LogBookTypes.FRONTIER,
            createLogContent.gainBattleFrontierPoints({
                stage: stageBeaten.toLocaleString("en-US"),
                points: battlePointsEarned.toLocaleString("en-US"),
            }),
        );

        BattleFrontierRunner.checkpoint(1);
        this.end();

        if (IdleFrontierManager.autoRestart()) {
            setTimeout(() => {
                IdleFrontierManager.start(true);
            }, 1000);
        }
    }

    /**
     * Stops the idle run.
     */
    static stopIdle() {
        this.started(false);
        BattleMechanics.enemyPokemon(null);
        IdleFrontierManager.running(false);
    }

    static hasCheckpoint = ko.computed(() => {
        return BattleFrontierRunner.checkpoint() > 1;
    });

    /**
     * Patches the native BattleFrontierRunner.start to ensure idle mode stops when manual mode starts.
     */
    static overrideStart() {
        const originalStart = BattleFrontierRunner.start;
        BattleFrontierRunner.start = async function (useCheckpoint) {
            IdleRunner.stopIdle();
            await originalStart.call(BattleFrontierRunner, useCheckpoint);
        };
    }
}

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

    injectScriptCard() {
        // Check if card already exists
        if (document.getElementById("idleBattleFrontierDisplay")) return;

        const displayDiv = document.createElement("div");
        displayDiv.id = "idleBattleFrontierDisplay";

        const html = `
            <div class="card-header p-0 border-top" data-toggle="collapse" href="#idleBattleFrontierInner">
                <span>Idle Battle Frontier</span>
            </div>
            <div id="idleBattleFrontierInner" class="collapse show p-2">
                <table class="table table-bordered table-sm m-0">
                    <tbody>
                        <tr>
                            <td class="text-left w-50">Checkpoint:</td>
                            <td class="text-right" data-bind="text: BattleFrontierRunner.checkpoint().toLocaleString('en-US')"></td>
                        </tr>
                        <tr>
                            <td class="text-left">Highest:</td>
                            <td class="text-right" data-bind="text: App.game.statistics.battleFrontierHighestStageCompleted().toLocaleString('en-US')"></td>
                        </tr>
                        <!-- ko if: !IdleFrontierManager.running() -->
                        <tr>
                            <td colspan="2">
                                <button class="btn btn-primary btn-block btn-sm mb-1" data-bind="click: () => IdleFrontierManager.start(true)">
                                    Start (Checkpoint)
                                </button>
                                <button class="btn btn-secondary btn-block btn-sm" data-bind="click: () => IdleFrontierManager.start(false)">
                                    Start (Stage 1)
                                </button>
                            </td>
                        </tr>
                        <!-- /ko -->
                        <!-- ko if: IdleFrontierManager.running() -->
                        <tr>
                            <td class="text-left align-middle">Current Stage:</td>
                            <td class="text-right align-middle font-weight-bold" data-bind="text: IdleRunner.stage().toLocaleString('en-US')"></td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <div class="progress hitpoints mb-1" style="height: 20px;">
                                    <!-- ko if: BattleMechanics.enemyPokemon() -->
                                    <div class="progress-bar bg-danger" role="progressbar" 
                                        data-bind="style: { width: BattleMechanics.enemyPokemon().healthPercentage() + '%' }"
                                        aria-valuemin="0" aria-valuemax="100">
                                        <span data-bind="text: BattleMechanics.enemyPokemon().health().toLocaleString('en-US') + ' / ' + BattleMechanics.enemyPokemon().maxHealth().toLocaleString('en-US')" style="font-size: 12px;"></span>
                                    </div>
                                    <!-- /ko -->
                                </div>
                                <div class="progress" style="height: 20px; position: relative;">
                                    <div class="progress-bar bg-success" role="progressbar" 
                                        data-bind="style: { width: IdleRunner.timeLeftPercentage() + '%' }"
                                        aria-valuemin="0" aria-valuemax="100">
                                        <span data-bind="text: (IdleRunner.timeLeft() / 1000).toFixed(1) + 's'" style="font-size: 12px;"></span>
                                    </div>
                                </div>
                                <button class="btn btn-danger btn-block btn-sm mt-2" data-bind="click: () => IdleRunner.stopIdle()">
                                    Stop
                                </button>
                            </td>
                        </tr>
                        <!-- /ko -->
                        <tr>
                            <td colspan="2" class="text-center">
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="idleFrontierAutoRestart" data-bind="checked: IdleFrontierManager.autoRestart">
                                    <label class="custom-control-label" for="idleFrontierAutoRestart">Auto Restart</label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        displayDiv.innerHTML = html;
        const scriptBody = document.getElementById("customScriptsBody");
        scriptBody.appendChild(displayDiv);
        ko.applyBindings({}, displayDiv);
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
    unsafeWindow.IdleFrontierManager = IdleFrontierManager;
    unsafeWindow.IdleRunner = IdleRunner;
    unsafeWindow.BattleMechanics = BattleMechanics;
} else {
    window.IdleFrontierManager = IdleFrontierManager;
    window.IdleRunner = IdleRunner;
    window.BattleMechanics = BattleMechanics;
}

loadScript(
    "Idle Battle Frontier",
    () => {
        UserInterface.injectScriptCard();
        IdleFrontierManager.init();
    },
    () => {
        IdleFrontierManager.load();
        UserInterface.createContainer();
        IdleRunner.overrideStart();
    },
);
