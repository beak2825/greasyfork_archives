// ==UserScript==
// @name         Torn Gym Stat Distribution + Percentages
// @namespace    torn-gym-stat-distribution-mvc
// @match        https://www.torn.com/gym.php*
// @version      1.0.0
// @description  Displays stat percentage distribution in the Torn Gym and updates automatically after training.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561831/Torn%20Gym%20Stat%20Distribution%20%2B%20Percentages.user.js
// @updateURL https://update.greasyfork.org/scripts/561831/Torn%20Gym%20Stat%20Distribution%20%2B%20Percentages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       DEVELOPMENT TOGGLES
       - Comment/uncomment these lines to enable/disable features.
       - The floating window is marked as development-only.
    ========================== */

    // const ENABLE_DEV_WINDOW = true;   // ✅ DEV ONLY: Floating distribution window
    const ENABLE_DEV_WINDOW = false;     // ❌ DEV ONLY: Floating distribution window

    // const ENABLE_INLINE_PERCENTAGES = true; // Inline (in tiles) percentages
    const ENABLE_INLINE_PERCENTAGES = true;

    // const OVERRIDE_MAIN_CONTAINER_WIDTH = true; // Layout tweak
    const OVERRIDE_MAIN_CONTAINER_WIDTH = true;

    const MAIN_CONTAINER_WIDTH_PX = 1200;

    /* =========================
       MODEL
    ========================== */
    const GymStatsModel = {
        selectors: {
            strength:  'li[class^="strength__"] span[class^="propertyValue__"]',
            defense:   'li[class^="defense__"] span[class^="propertyValue__"]',
            speed:     'li[class^="speed__"] span[class^="propertyValue__"]',
            dexterity: 'li[class^="dexterity__"] span[class^="propertyValue__"]'
        },

        readStatValue(selector) {
            const element = document.querySelector(selector);
            if (!element) return null;

            // Extract ONLY the first numeric chunk (handles "1,234 (12.34%)")
            const match = (element.textContent || '').match(/[\d,]+/);
            if (!match) return null;

            return Number(match[0].replace(/,/g, '')) || 0;
        },

        getStats() {
            return {
                strength:  this.readStatValue(this.selectors.strength),
                defense:   this.readStatValue(this.selectors.defense),
                speed:     this.readStatValue(this.selectors.speed),
                dexterity: this.readStatValue(this.selectors.dexterity)
            };
        }
    };

    /* =========================
       VIEW
    ========================== */
    const StatDistributionView = {
        container: null,

        ensureDevWindowExists() {
            if (!ENABLE_DEV_WINDOW) return;

            if (this.container) return;

            this.container = document.createElement('div');
            this.container.id = 'gymStatDistributionBox';
            this.container.setAttribute('data-dev-only', 'true'); // marks as dev-only
            document.body.appendChild(this.container);
        },

        renderDevWindow(viewModel) {
            if (!ENABLE_DEV_WINDOW) return;
            this.ensureDevWindowExists();
            if (!this.container) return;

            this.container.innerHTML = `
                <div class="title">Stat Distribution <span class="dev-badge">DEV</span></div>
                <div class="row">Strength <span>${viewModel.strengthPct}%</span></div>
                <div class="row">Defense <span>${viewModel.defensePct}%</span></div>
                <div class="row">Speed <span>${viewModel.speedPct}%</span></div>
                <div class="row">Dexterity <span>${viewModel.dexterityPct}%</span></div>
                <div class="total">Total: ${viewModel.total.toLocaleString()}</div>
            `;
        },

        injectPercentageIntoStatTile(statKey, percentage) {
            if (!ENABLE_INLINE_PERCENTAGES) return;

            const statValueElement = document.querySelector(
                `li[class^="${statKey}__"] span[class^="propertyValue__"]`
            );
            if (!statValueElement) return;

            let percentageElement = statValueElement.querySelector('.stat-percentage');
            if (!percentageElement) {
                percentageElement = document.createElement('span');
                percentageElement.className = 'stat-percentage stat-percentage--inline';
                statValueElement.appendChild(percentageElement);
            }

            percentageElement.textContent = ` (${percentage}%)`;
        }
    };

    /* =========================
       CONTROLLER
    ========================== */
    const StatDistributionController = {
        refreshIntervalMs: 3000,
        lastTotal: null,

        start() {
            if (ENABLE_DEV_WINDOW) {
                StatDistributionView.ensureDevWindowExists();
            }

            this.update();
            setInterval(() => this.update(), this.refreshIntervalMs);
            this.attachTrainClickHandler();
        },

        update() {
            const stats = GymStatsModel.getStats();

            // If Torn is mid-rerender and any stat is missing, don't update yet.
            if (
                stats.strength === null ||
                stats.defense === null ||
                stats.speed === null ||
                stats.dexterity === null
            ) {
                return;
            }

            const total = stats.strength + stats.defense + stats.speed + stats.dexterity;
            if (!total) return;

            // Guard against transient "only one stat loaded" states
            if (this.lastTotal !== null && total < this.lastTotal * 0.5) {
                return;
            }

            const percentages = this.calculatePercentages(stats, total);

            // Render dev window (if enabled)
            StatDistributionView.renderDevWindow({
                strengthPct:  percentages.strength,
                defensePct:   percentages.defense,
                speedPct:     percentages.speed,
                dexterityPct: percentages.dexterity,
                total
            });

            // Always attempt to re-inject inline percentages (Torn may swap nodes)
            this.injectInlinePercentages(percentages);
            this.lastTotal = total;
        },

        calculatePercentages(stats, total) {
            return {
                strength:  this.calculatePercentage(stats.strength, total),
                defense:   this.calculatePercentage(stats.defense, total),
                speed:     this.calculatePercentage(stats.speed, total),
                dexterity: this.calculatePercentage(stats.dexterity, total)
            };
        },

        injectInlinePercentages(percentages) {
            StatDistributionView.injectPercentageIntoStatTile('strength',  percentages.strength);
            StatDistributionView.injectPercentageIntoStatTile('defense',   percentages.defense);
            StatDistributionView.injectPercentageIntoStatTile('speed',     percentages.speed);
            StatDistributionView.injectPercentageIntoStatTile('dexterity', percentages.dexterity);
        },

        calculatePercentage(value, total) {
            return ((value / total) * 100).toFixed(2);
        },

        attachTrainClickHandler() {
            document.addEventListener('click', (event) => {
                const clickedElement = event.target.closest('a, button, input');
                if (!clickedElement) return;

                const label = (clickedElement.textContent || '').trim().toUpperCase();
                if (label !== 'TRAIN') return;

                this.forceRecheckAfterTrain();
            }, true);
        },

        forceRecheckAfterTrain() {
            this.update();
            const delays = [100, 250, 500, 900, 1400, 2000, 3000];
            delays.forEach((ms) => setTimeout(() => this.update(), ms));
        }
    };

    /* =========================
       BOOTSTRAP
    ========================== */
    const gymReadyObserver = new MutationObserver(() => {
        if (document.querySelector(GymStatsModel.selectors.strength)) {
            gymReadyObserver.disconnect();
            StatDistributionController.start();
        }
    });

    gymReadyObserver.observe(document.body, { childList: true, subtree: true });

    /* =========================
       STYLE
    ========================== */
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* DEV ONLY: Floating distribution box */
        #gymStatDistributionBox {
            position: fixed;
            top: 140px;
            right: 20px;
            background: #111;
            border: 1px solid #444;
            color: #eee;
            padding: 10px 12px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            border-radius: 6px;
            min-width: 190px;
            z-index: 9999;
        }

        #gymStatDistributionBox .title {
            text-align: center;
            font-weight: bold;
            margin-bottom: 6px;
        }

        #gymStatDistributionBox .dev-badge {
            font-size: 10px;
            font-weight: normal;
            opacity: 0.75;
            margin-left: 6px;
            padding: 1px 6px;
            border: 1px solid #333;
            border-radius: 10px;
        }

        #gymStatDistributionBox .row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
        }

        #gymStatDistributionBox .total {
            margin-top: 6px;
            padding-top: 4px;
            border-top: 1px solid #333;
            font-size: 11px;
            text-align: center;
            opacity: 0.85;
        }

        /* Inline stat percentages */
        .stat-percentage--inline {
            font-size: 0.85em;
            font-weight: normal;
            opacity: 0.65;
            margin-left: 2px;
            white-space: nowrap;
        }

        /* Optional layout override */
        ${OVERRIDE_MAIN_CONTAINER_WIDTH ? `
        #mainContainer {
            width: ${MAIN_CONTAINER_WIDTH_PX}px !important;
        }` : ``}
    `;
    document.head.appendChild(styleElement);

})();