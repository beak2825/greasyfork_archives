// ==UserScript==
// @name         Torn Gym Stat Percentages 
// @namespace    torn-gym-stat-percentages
// @version      2.0.0
// @author       RussianRob
// @description  Shows each gym battle stat as a percentage of your total next to the stat name, plus a compact summary line.
// @match        https://www.torn.com/gym.php*
// @match        https://www.torn.com/loader.php?sid=gym*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562419/Torn%20Gym%20Stat%20Percentages.user.js
// @updateURL https://update.greasyfork.org/scripts/562419/Torn%20Gym%20Stat%20Percentages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------- MODEL --------
    const GymStatsModel = {
        selectors: {
            strength:  'li[class*="strength"] span[class*="propertyValue"], li[class*="strength"] .stat-value',
            defense:   'li[class*="defense"] span[class*="propertyValue"],  li[class*="defense"] .stat-value',
            speed:     'li[class*="speed"] span[class*="propertyValue"],    li[class*="speed"] .stat-value',
            dexterity: 'li[class*="dexterity"] span[class*="propertyValue"], li[class*="dexterity"] .stat-value'
        },

        // Cache of DOM elements for each stat so we do not query repeatedly
        statElements: {
            strength: null,
            defense: null,
            speed: null,
            dexterity: null
        },

        getGymContainer() {
            // Try common gym containers used on web and PDA
            return document.querySelector('#gymroot, .gym-root, #gym, .gym-wrap') || document.body;
        },

        getStatElement(key) {
            if (this.statElements[key] && document.contains(this.statElements[key])) {
                return this.statElements[key];
            }
            const selector = this.selectors[key];
            if (!selector) return null;

            const el = document.querySelector(selector);
            if (!el) return null;

            this.statElements[key] = el;
            return el;
        },

        readStatValue(key) {
            const element = this.getStatElement(key);
            if (!element) return null;

            const match = (element.textContent || '').match(/[\d,]+/);
            if (!match) return null;

            return Number(match[0].replace(/,/g, '')) || 0;
        },

        getStats() {
            return {
                strength:  this.readStatValue('strength'),
                defense:   this.readStatValue('defense'),
                speed:     this.readStatValue('speed'),
                dexterity: this.readStatValue('dexterity')
            };
        }
    };

    // -------- VIEW --------
    const StatDistributionView = {
        // Cache <li> and name elements for each statKey
        liCache: {},
        nameCache: {},

        getLi(statKey) {
            if (this.liCache[statKey] && document.contains(this.liCache[statKey])) {
                return this.liCache[statKey];
            }
            const li = document.querySelector(`li[class*="${statKey}"]`);
            if (li) this.liCache[statKey] = li;
            return li;
        },

        getNameElement(statKey) {
            if (this.nameCache[statKey] && document.contains(this.nameCache[statKey])) {
                return this.nameCache[statKey];
            }

            const li = this.getLi(statKey);
            if (!li) return null;

            const nameElement =
                li.querySelector('span[class*="propertyName"], .title, .gym-stat-name') ||
                li.querySelector('span, div');

            if (nameElement) this.nameCache[statKey] = nameElement;
            return nameElement;
        },

        injectPercentageIntoStatName(statKey, percentage, isMax) {
            const nameElement = this.getNameElement(statKey);
            if (!nameElement) return;

            // Remove any stale duplicate spans (in case Torn rewrote the innerHTML)
            const existingSpans = nameElement.querySelectorAll('.stat-name-percentage');
            if (existingSpans.length > 1) {
                existingSpans.forEach((span, idx) => {
                    if (idx > 0) span.remove();
                });
            }

            let percentageElement = nameElement.querySelector('.stat-name-percentage');
            if (!percentageElement) {
                percentageElement = document.createElement('span');
                percentageElement.className = 'stat-name-percentage';
                nameElement.appendChild(percentageElement);
            }

            percentageElement.textContent = ` (${percentage}%)`;
            percentageElement.classList.toggle('stat-name-percentage-max', !!isMax);
        },

        ensureSummaryBar() {
            if (this.summaryElement && document.contains(this.summaryElement)) {
                return this.summaryElement;
            }
            const container = GymStatsModel.getGymContainer();
            if (!container) return null;

            const bar = document.createElement('div');
            bar.className = 'gym-stat-summary-bar';
            bar.textContent = 'Loading distribution…';
            container.insertBefore(bar, container.firstChild);
            this.summaryElement = bar;
            return bar;
        },

        updateSummaryBar(percentages) {
            const bar = this.ensureSummaryBar();
            if (!bar) return;

            bar.textContent =
                `STR ${percentages.strength}% | ` +
                `DEF ${percentages.defense}% | ` +
                `SPD ${percentages.speed}% | ` +
                `DEX ${percentages.dexterity}%`;
        }
    };

    // -------- CONTROLLER --------
    const StatDistributionController = {
        refreshIntervalMs: 3000,

        start() {
            this.update();
            setInterval(() => this.update(), this.refreshIntervalMs);
            this.attachTrainClickHandler();
        },

        isGymStillPresent() {
            return !!document.querySelector('li[class*="strength"]');
        },

        update() {
            if (!this.isGymStillPresent()) {
                return;
            }

            const stats = GymStatsModel.getStats();

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

            const percentages = this.calculatePercentages(stats, total);
            this.injectNamePercentages(percentages);
            StatDistributionView.updateSummaryBar(percentages);
        },

        calculatePercentages(stats, total) {
            return {
                strength:  this.calculatePercentage(stats.strength, total),
                defense:   this.calculatePercentage(stats.defense, total),
                speed:     this.calculatePercentage(stats.speed, total),
                dexterity: this.calculatePercentage(stats.dexterity, total)
            };
        },

        injectNamePercentages(percentages) {
            // Find max percentage to lightly highlight main stat
            const values = [
                percentages.strength,
                percentages.defense,
                percentages.speed,
                percentages.dexterity
            ].map(Number);
            const maxValue = Math.max.apply(null, values);

            const isMax = (val) => Number(val) === maxValue;

            StatDistributionView.injectPercentageIntoStatName('strength',  percentages.strength,  isMax(percentages.strength));
            StatDistributionView.injectPercentageIntoStatName('defense',   percentages.defense,   isMax(percentages.defense));
            StatDistributionView.injectPercentageIntoStatName('speed',     percentages.speed,     isMax(percentages.speed));
            StatDistributionView.injectPercentageIntoStatName('dexterity', percentages.dexterity, isMax(percentages.dexterity));
        },

        calculatePercentage(value, total) {
            return ((value / total) * 100).toFixed(2);
        },

        attachTrainClickHandler() {
            let trainRecheckScheduled = false;

            document.addEventListener('click', (event) => {
                const clickedElement = event.target.closest('a, button, input');
                if (!clickedElement) return;

                const label = (clickedElement.textContent || '').trim().toUpperCase();
                if (label !== 'TRAIN') return;

                if (trainRecheckScheduled) return;
                trainRecheckScheduled = true;
                this.forceRecheckAfterTrain(() => {
                    trainRecheckScheduled = false;
                });
            }, true);
        },

        forceRecheckAfterTrain(doneCb) {
            const delays = [100, 250, 500, 900, 1400, 2000];
            let remaining = delays.length;

            const checkDone = () => {
                remaining--;
                if (remaining <= 0 && typeof doneCb === 'function') doneCb();
            };

            this.update();
            delays.forEach((ms) => {
                setTimeout(() => {
                    this.update();
                    checkDone();
                }, ms);
            });
        }
    };

    // -------- BOOTSTRAP --------
    const gymReadyObserver = new MutationObserver((mutations, obs) => {
        if (document.querySelector('li[class*="strength"]')) {
            obs.disconnect();
            StatDistributionController.start();
        }
    });

    // Observe only body once; disconnects quickly when gym appears
    gymReadyObserver.observe(document.body, { childList: true, subtree: true });

    // -------- STYLE --------
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .stat-name-percentage {
            font-size: 0.85em;
            opacity: 0.65;
            margin-left: 4px;
            white-space: nowrap;
        }
        .stat-name-percentage-max {
            opacity: 0.95;
            font-weight: 600;
        }
        .gym-stat-summary-bar {
            margin-bottom: 6px;
            font-size: 0.85em;
            opacity: 0.75;
        }
    `;
    document.head.appendChild(styleElement);
})();
