// ==UserScript==
// @name         FMP Stadium Planner
// @namespace    https://github.com/napcoder/fmp-stadium-planner
// @version      0.4.0
// @description  Plan, analyze and optimize your Football Manager Project (FMP) stadium!
// @author       Marco Travaglini (Napcoder)
// @match        https://footballmanagerproject.com/Economy/Stadium
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/napcoder/fmp-stadium-planner
// @supportURL   https://github.com/napcoder/fmp-stadium-planner/issues
// @downloadURL https://update.greasyfork.org/scripts/559696/FMP%20Stadium%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/559696/FMP%20Stadium%20Planner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class SeatsRatio {
        vip;
        covered;
        standard;
        standing;
        constructor({ vip, covered, standard, standing }) {
            this.vip = vip;
            this.covered = covered;
            this.standard = standard;
            this.standing = standing;
        }
        getTotalWeight() {
            return this.vip + this.covered + this.standard + this.standing;
        }
        toString() {
            return `${this.vip}-${this.covered}-${this.standard}-${this.standing}`;
        }
        static getDefaultRatio() {
            return new SeatsRatio({ vip: 1, covered: 4, standard: 8, standing: 16 });
        }
        static getMaintananceOptimizedRatio() {
            return new SeatsRatio({ vip: 1, covered: 3, standard: 6, standing: 12 });
        }
    }

    class Stadium {
        standing;
        standard;
        covered;
        vip;
        static config = {
            vip: {
                ticketMultiplier: 12,
                maintainCostFactor: 12,
                buildTimeFactor: 40,
            },
            covered: {
                ticketMultiplier: 4,
                maintainCostFactor: 4,
                buildTimeFactor: 20,
            },
            standard: {
                ticketMultiplier: 2,
                maintainCostFactor: 2,
                buildTimeFactor: 10,
            },
            standing: {
                ticketMultiplier: 1,
                maintainCostFactor: 1,
                buildTimeFactor: 5,
            }
        };
        constructor(layout) {
            this.standing = layout.standing;
            this.standard = layout.standard;
            this.covered = layout.covered;
            this.vip = layout.vip;
        }
        calcMaxIncome(baseTicketPrice) {
            return baseTicketPrice * ((this.standing * Stadium.config.standing.ticketMultiplier) +
                (this.standard * Stadium.config.standard.ticketMultiplier) +
                (this.covered * Stadium.config.covered.ticketMultiplier) +
                (this.vip * Stadium.config.vip.ticketMultiplier));
        }
        calcMaxIncomeWithoutSeasonTickets(baseTicketPrice, seasonTickets) {
            return baseTicketPrice * (((this.standing - seasonTickets.standing) * Stadium.config.standing.ticketMultiplier) +
                ((this.standard - seasonTickets.standard) * Stadium.config.standard.ticketMultiplier) +
                ((this.covered - seasonTickets.covered) * Stadium.config.covered.ticketMultiplier) +
                ((this.vip - seasonTickets.vip) * Stadium.config.vip.ticketMultiplier));
        }
        getTotalSeats() {
            return this.standing + this.standard + this.covered + this.vip;
        }
        getLayout() {
            return {
                standing: this.standing,
                standard: this.standard,
                covered: this.covered,
                vip: this.vip
            };
        }
        isDifferentLayout(other) {
            return this.standing !== other.standing ||
                this.standard !== other.standard ||
                this.covered !== other.covered ||
                this.vip !== other.vip;
        }
        calcMaintainCost(seats, maintainCostFactor) {
            return Math.ceil(0.01 * Math.pow(seats * maintainCostFactor, 2.0) * 4.5 / 32400) * 100;
        }
        getMaintainCost() {
            return this.calcMaintainCost(this.standing, Stadium.config.standing.maintainCostFactor) +
                this.calcMaintainCost(this.standard, Stadium.config.standard.maintainCostFactor) +
                this.calcMaintainCost(this.covered, Stadium.config.covered.maintainCostFactor) +
                this.calcMaintainCost(this.vip, Stadium.config.vip.maintainCostFactor);
        }
        clone() {
            return new Stadium(this.getLayout());
        }
        getRatio() {
            const totalSeats = this.getTotalSeats();
            if (totalSeats === 0) {
                return new SeatsRatio({
                    vip: 0,
                    covered: 0,
                    standard: 0,
                    standing: 0
                });
            }
            // find the lower non zero number in seats and use it to calculate ratio
            const nonZeroSeats = [this.standing, this.standard, this.covered, this.vip].filter(seat => seat > 0);
            const minNonZeroSeat = nonZeroSeats.length > 0 ? Math.min(...nonZeroSeats) : 1;
            return new SeatsRatio({
                vip: Math.round(this.vip / minNonZeroSeat),
                covered: Math.round(this.covered / minNonZeroSeat),
                standard: Math.round(this.standard / minNonZeroSeat),
                standing: Math.round(this.standing / minNonZeroSeat)
            });
        }
    }

    async function getStadiumData() {
        try {
            const response = await fetch('/Economy/Stadium?handler=StadiumData');
            if (!response.ok)
                throw new Error('Network response was not ok');
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Error fetching stadium data:', error);
            return undefined;
        }
    }

    class Store {
        state;
        listeners = [];
        constructor(initialState) {
            this.state = initialState;
        }
        getState() {
            return this.state;
        }
        setState(partial) {
            const prevState = this.state;
            const newState = { ...this.state, ...partial };
            if (!this.isChanged(newState, prevState)) {
                return; // No relevant changes
            }
            this.state = newState;
            this.notify(newState, prevState);
        }
        subscribe(listener) {
            this.listeners.push(listener);
            // Call immediately with current state
            listener(this.state, this.state);
            return () => {
                this.listeners = this.listeners.filter(l => l !== listener);
            };
        }
        isChanged(newState, prevState) {
            return (newState.currentStadium !== prevState.currentStadium && prevState.currentStadium.isDifferentLayout(newState.currentStadium)) ||
                (newState.plannedStadium !== prevState.plannedStadium && prevState.plannedStadium.isDifferentLayout(newState.plannedStadium)) ||
                (newState.baseTicketPrice !== prevState.baseTicketPrice) ||
                (prevState.seasonTickets.isDifferent(newState.seasonTickets));
        }
        notify(newState, prevState) {
            for (const l of this.listeners)
                l(newState, prevState);
        }
    }

    const translations = {
        en: {
            totalSeats: "Total seats",
            currentInfoTitle: "Current information",
            plannedInfoTitle: "Planned information",
            detailedInfoTitle: "Detailed information",
            constructionDetailsTitle: "Construction details per sector",
            maxIncome: "Maximum income",
            maxIncomeWithoutSeasonTickets: "Maximum income (no seas. tkts)",
            maintenanceCost: "Maintenance cost",
            ratioLabel: "Seats ratio",
            seatsRatioExtendedLabel: "Seats ratio (VIP / Covered / Standard / Standing)",
            seatsRatioDescription: "Defines how many seats of each type are created for every 1 VIP seat.",
            plan: "Plan",
            planner: "Planner",
            planned: "Planned",
            current: "Current",
            desiredTotalSeats: "Desired total seats",
            days: "days",
            buildingCost: "Building cost",
            timeToBuild: "Time to build",
            delta: "Delta",
            sizeDelta: "Size delta",
            costsTableHeader: "Costs ⓕ",
            timeTableHeader: "Time (days)",
            sectorsTableHeader: "Sector",
            total: "Total",
            controlsAutomaticKhristianLabel: "Automatic default preset (recommended)",
            controlsAutomaticTicketsLabel: "Automatic preset based on ticket prices ratios",
            controlsAutomaticCustomLabel: "Automatic - custom ratio",
            controlsAdvancedManualLabel: "Advanced - manual sector setup",
            lastGeneratedLayoutTitle: "Seats layout (last generated)",
        },
        it: {
            totalSeats: "Posti totali",
            currentInfoTitle: "Informazioni attuali",
            plannedInfoTitle: "Informazioni pianificate",
            detailedInfoTitle: "Informazioni dettagliate",
            constructionDetailsTitle: "Dettagli costruzione per settore",
            maxIncome: "Massimo incasso",
            maxIncomeWithoutSeasonTickets: "Massimo incasso (meno quota abb.)",
            maintenanceCost: "Costo di manutenzione",
            ratioLabel: "Rapporto posti",
            seatsRatioExtendedLabel: "Rapporto posti (VIP / Coperti / Standard / In piedi)",
            seatsRatioDescription: "Definisce quanti posti di ogni tipo vengono creati per ogni posto VIP.",
            plan: "Pianifica",
            planner: "Planner",
            planned: "Pianificato",
            current: "Attuale",
            desiredTotalSeats: "Posti totali desiderati",
            days: "giorni",
            buildingCost: "Costo di costruzione",
            timeToBuild: "Tempo di costruzione",
            delta: "Delta",
            sizeDelta: "Delta capienza",
            costsTableHeader: "Costi (ⓕ)",
            timeTableHeader: "Tempo (giorni)",
            sectorsTableHeader: "Settore",
            total: "Totale",
            controlsAutomaticKhristianLabel: "Automatico default (raccomandato)",
            controlsAutomaticTicketsLabel: "Automatico basato sui rapporti dei prezzi dei biglietti",
            controlsAutomaticCustomLabel: "Automatico - rapporto personalizzato",
            controlsAdvancedManualLabel: "Avanzato - impostazione manuale dei settori",
            lastGeneratedLayoutTitle: "Layout posti (ultimi generati)",
        }
    };
    function getUserLang() {
        const lang = navigator.language || navigator.languages[0] || 'en';
        return lang.startsWith('it') ? 'it' : 'en';
    }
    const supportedLangs = ['en', 'it'];
    function getTranslator(lang) {
        let userLang = getUserLang();
        if (!supportedLangs.includes(userLang)) {
            userLang = 'en';
        }
        return function t(key) {
            return translations[userLang][key] || translations['en'][key] || key;
        };
    }
    // Helper to retrieve host-provided translation object `window.trxt` when available
    function getHostTrxt() {
        try {
            // Prefer host globals exposed on window in browser, but also
            // support test environments where globals are on globalThis.
            const host = (typeof window !== 'undefined') ? window : (typeof globalThis !== 'undefined' ? globalThis : undefined);
            if (host && host.trxt)
                return host.trxt;
        }
        catch (e) {
            // ignore
        }
        return null;
    }
    // Try to retrieve a label from the host-provided `trxt` object.
    // `label` is the key to look up; `label` is returned when not found.
    function getHostLabel(label) {
        const trxt = getHostTrxt();
        if (!trxt)
            return label;
        try {
            return trxt[label] || label;
        }
        catch (e) {
            // ignore errors and fall through to fallback
        }
        return label;
    }

    class UpgradeManager {
        currentStadium;
        plannedStadium;
        baseTicketPrice;
        constructor(currentLayout, baseTicketPrice, plannedLayout) {
            this.currentStadium = new Stadium(currentLayout);
            this.plannedStadium = new Stadium(plannedLayout || currentLayout);
            this.baseTicketPrice = baseTicketPrice;
        }
        static fromStadium(currentStadium, baseTicketPrice) {
            return new UpgradeManager(currentStadium.getLayout(), baseTicketPrice);
        }
        setPlannedLayout(layout) {
            this.plannedStadium = new Stadium(layout);
        }
        calcSectorBuildingCost(newseats, oldseats, maintainCostFactor) {
            if (newseats <= oldseats)
                return 0;
            return Math.ceil(0.15 * (Math.pow(newseats * maintainCostFactor, 2.0)
                - Math.pow(oldseats * maintainCostFactor, 2.0)) * 4.5 / 32400) * 2500;
        }
        TimeToBuild(newseats, oldseats, buildTimeFact) {
            if (newseats === oldseats) {
                return 0;
            }
            return Math.round((1.0 + buildTimeFact * Math.abs(newseats - oldseats) / 1000.0));
        }
        getVipBuildingCost() {
            return this.calcSectorBuildingCost(this.plannedStadium.vip, this.currentStadium.vip, Stadium.config.vip.maintainCostFactor);
        }
        getCoveredBuildingCost() {
            return this.calcSectorBuildingCost(this.plannedStadium.covered, this.currentStadium.covered, Stadium.config.covered.maintainCostFactor);
        }
        getStandardBuildingCost() {
            return this.calcSectorBuildingCost(this.plannedStadium.standard, this.currentStadium.standard, Stadium.config.standard.maintainCostFactor);
        }
        getStandingBuildingCost() {
            return this.calcSectorBuildingCost(this.plannedStadium.standing, this.currentStadium.standing, Stadium.config.standing.maintainCostFactor);
        }
        getTotalBuildingCost() {
            return this.getVipBuildingCost() +
                this.getCoveredBuildingCost() +
                this.getStandardBuildingCost() +
                this.getStandingBuildingCost();
        }
        getVipTimeToBuild() {
            return this.TimeToBuild(this.plannedStadium.vip, this.currentStadium.vip, Stadium.config.vip.buildTimeFactor);
        }
        getCoveredTimeToBuild() {
            return this.TimeToBuild(this.plannedStadium.covered, this.currentStadium.covered, Stadium.config.covered.buildTimeFactor);
        }
        getStandardTimeToBuild() {
            return this.TimeToBuild(this.plannedStadium.standard, this.currentStadium.standard, Stadium.config.standard.buildTimeFactor);
        }
        getStandingTimeToBuild() {
            return this.TimeToBuild(this.plannedStadium.standing, this.currentStadium.standing, Stadium.config.standing.buildTimeFactor);
        }
        getTotalTimeToBuild() {
            return Math.max(this.getVipTimeToBuild(), this.getCoveredTimeToBuild(), this.getStandardTimeToBuild(), this.getStandingTimeToBuild());
        }
    }

    function makeTitleContainer(mainTitle, subTitle, showBorder = true) {
        const title = document.createElement('div');
        title.className = 'title';
        if (showBorder === false) {
            title.style.border = 'none';
            title.style.margin = '0';
        }
        if (mainTitle) {
            const main = document.createElement('div');
            main.className = 'main';
            main.textContent = mainTitle;
            title.appendChild(main);
        }
        if (subTitle) {
            const section = document.createElement('div');
            section.className = 'section';
            section.textContent = subTitle;
            title.appendChild(section);
        }
        return title;
    }

    const t$3 = getTranslator();
    // Renders general-info-view and subscribes to store updates
    function renderGeneralInfoView(container, store) {
        // Clear container
        container.innerHTML = '';
        // Subscribe to store
        store.subscribe((state, prevState) => {
            const totalSeats = state.currentStadium.getTotalSeats();
            const currentRatio = state.currentStadium.getRatio().toString();
            const maxIncome = state.currentStadium.calcMaxIncome(state.baseTicketPrice);
            const maintainanceCost = state.currentStadium.getMaintainCost();
            container.innerHTML = '';
            const title = makeTitleContainer('FMP Stadium Planner', t$3('currentInfoTitle'));
            container.appendChild(title);
            const content = createItemContainer$2();
            const totalSeatsRow = createRow$1(t$3('totalSeats'), totalSeats.toLocaleString());
            const currentRatioRow = createRow$1(t$3('ratioLabel'), currentRatio);
            const maintenanceCostRow = createRow$1(t$3('maintenanceCost'), `ⓕ ${maintainanceCost.toLocaleString()}`);
            const maxIncomeRow = createRow$1(t$3('maxIncome'), `ⓕ ${maxIncome.toLocaleString()}`);
            content.appendChild(totalSeatsRow);
            content.appendChild(currentRatioRow);
            content.appendChild(maintenanceCostRow);
            content.appendChild(maxIncomeRow);
            container.appendChild(content);
            // Planned stadium info (if available)
            if (state.plannedStadium) {
                const upgradeManager = new UpgradeManager(state.currentStadium.getLayout(), state.baseTicketPrice, state.plannedStadium.getLayout());
                const plannedMaxIncome = state.plannedStadium.calcMaxIncome(state.baseTicketPrice);
                const plannedMaintenanceCost = state.plannedStadium.getMaintainCost();
                const plannedTotalSeats = state.plannedStadium.getTotalSeats();
                const plannedBuildingCost = upgradeManager.getTotalBuildingCost();
                const plannedTimeToBuild = upgradeManager.getTotalTimeToBuild();
                const plannedRatio = state.plannedStadium.getRatio().toString();
                const plannedTitle = makeTitleContainer(null, t$3('plannedInfoTitle'));
                container.appendChild(plannedTitle);
                const plannedContent = createItemContainer$2();
                const plannedTotalSeatsRow = createRow$1(t$3('totalSeats'), plannedTotalSeats.toLocaleString());
                const plannedRatioRow = createRow$1(t$3('ratioLabel'), plannedRatio);
                const plannedMaintenanceCostRow = createRow$1(t$3('maintenanceCost'), `ⓕ ${plannedMaintenanceCost.toLocaleString()}`);
                const plannedMaxIncomeRow = createRow$1(t$3('maxIncome'), `ⓕ ${plannedMaxIncome.toLocaleString()}`);
                const plannedBuildingCostRow = createRow$1(t$3('buildingCost'), `ⓕ ${plannedBuildingCost.toLocaleString()}`);
                const plannedTimeToBuildRow = createRow$1(t$3('timeToBuild'), `${plannedTimeToBuild} ${t$3('days')}`);
                plannedContent.appendChild(plannedTotalSeatsRow);
                plannedContent.appendChild(plannedRatioRow);
                plannedContent.appendChild(plannedMaintenanceCostRow);
                plannedContent.appendChild(plannedMaxIncomeRow);
                plannedContent.appendChild(plannedBuildingCostRow);
                plannedContent.appendChild(plannedTimeToBuildRow);
                container.appendChild(plannedContent);
            }
        });
    }
    function createItemContainer$2() {
        const item = document.createElement('div');
        item.className = 'item economy';
        item.style.padding = '0 8px 0 24px';
        return item;
    }
    function createRow$1(captionText, value) {
        const row = document.createElement('div');
        row.className = 'row g-0';
        row.style.padding = '4px 0 4px 0';
        row.style.borderBottom = '1px solid #103201';
        const col1 = document.createElement('div');
        col1.className = 'col-6';
        col1.textContent = captionText;
        const col2 = document.createElement('div');
        col2.className = 'col-6 text-end';
        col2.textContent = value;
        row.appendChild(col1);
        row.appendChild(col2);
        return row;
    }

    const defaultRatio = SeatsRatio.getDefaultRatio();
    function planner(desiredTotal, currentStadium, desiredRatio = defaultRatio) {
        const currentTotal = currentStadium.getTotalSeats();
        if (currentTotal >= desiredTotal) {
            return currentStadium; // No changes needed
        }
        // Desired proportion: vip:covered:standard:standing = e.g. default ratio 1:4:8:16
        // Total weight = 1+4+8+16 = 29
        const totalWeight = desiredRatio.getTotalWeight();
        // Get current layout
        const layout = currentStadium.getLayout();
        let remaining = desiredTotal - currentTotal;
        // Calculate the ideal seat counts for each type
        const idealLayout = {
            vip: desiredTotal * desiredRatio.vip / totalWeight,
            covered: desiredTotal * desiredRatio.covered / totalWeight,
            standard: desiredTotal * desiredRatio.standard / totalWeight,
            standing: desiredTotal * desiredRatio.standing / totalWeight
        };
        // Calculate how many more seats are needed for each type to reach the ideal
        const addLayout = {
            vip: Math.max(0, Math.ceil(idealLayout.vip - layout.vip)),
            covered: Math.max(0, Math.ceil(idealLayout.covered - layout.covered)),
            standard: Math.max(0, Math.ceil(idealLayout.standard - layout.standard)),
            standing: Math.max(0, Math.ceil(idealLayout.standing - layout.standing)),
        };
        let totalAdded = addLayout.vip + addLayout.covered + addLayout.standard + addLayout.standing;
        if (totalAdded > remaining) {
            return distributeGreedy(layout, idealLayout, remaining, desiredRatio);
        }
        else {
            let extra = remaining - totalAdded;
            return distributeWithExtra(layout, addLayout, extra, desiredRatio);
        }
    }
    /**
     * Distributes remaining seats to approach the ideal 1-4-8-16 proportion, never decreasing any type.
     * Uses a greedy algorithm to increment the type with the largest gap to its ideal until all seats are assigned.
     * @param layout The current seat layout (SeatsLayout)
     * @param idealLayout The ideal seat layout (SeatsLayout)
     * @param remaining Number of seats left to assign
     * @param desiredRatio The desired seats ratio (SeatsRatio)
     * @returns A new Stadium instance with the updated seat distribution
     */
    function distributeGreedy(layout, idealLayout, remaining, desiredRatio) {
        let needs = [
            { type: 'vip', current: layout.vip, ideal: idealLayout.vip, weight: desiredRatio.vip },
            { type: 'covered', current: layout.covered, ideal: idealLayout.covered, weight: desiredRatio.covered },
            { type: 'standard', current: layout.standard, ideal: idealLayout.standard, weight: desiredRatio.standard },
            { type: 'standing', current: layout.standing, ideal: idealLayout.standing, weight: desiredRatio.standing },
        ];
        while (remaining > 0) {
            needs.sort((a, b) => (b.ideal - b.current) - (a.ideal - a.current));
            for (let i = 0; i < needs.length; i++) {
                if (needs[i].current < needs[i].ideal) {
                    needs[i].current++;
                    remaining--;
                    break;
                }
            }
            if (needs.every(n => n.current >= n.ideal)) {
                needs.find(n => n.type === 'standing').current++;
                remaining--;
            }
        }
        return new Stadium({
            standing: needs.find(n => n.type === 'standing').current,
            standard: needs.find(n => n.type === 'standard').current,
            covered: needs.find(n => n.type === 'covered').current,
            vip: needs.find(n => n.type === 'vip').current
        });
    }
    /**
     * Adds the minimum needed to reach the ideal for each type, then distributes any extra seats in 1-4-8-16 order.
     * Never decreases any seat type below the current value.
     * @param layout The current seat layout (SeatsLayout)
     * @param addLayout Object with seats to add for each type (SeatsLayout)
     * @param extra Remaining seats to distribute after reaching all ideals
     * @param desiredRatio The desired seats ratio (SeatsRatio)
     * @returns A new Stadium instance with the updated seat distribution
     */
    function distributeWithExtra(layout, addLayout, extra, desiredRatio) {
        let vip = layout.vip + addLayout.vip;
        let covered = layout.covered + addLayout.covered;
        let standard = layout.standard + addLayout.standard;
        let standing = layout.standing + addLayout.standing;
        const weights = [
            { type: 'vip', weight: desiredRatio.vip },
            { type: 'covered', weight: desiredRatio.covered },
            { type: 'standard', weight: desiredRatio.standard },
            { type: 'standing', weight: desiredRatio.standing },
        ];
        while (extra > 0) {
            for (const w of weights) {
                if (extra === 0)
                    break;
                switch (w.type) {
                    case 'vip':
                        vip++;
                        break;
                    case 'covered':
                        covered++;
                        break;
                    case 'standard':
                        standard++;
                        break;
                    case 'standing':
                        standing++;
                        break;
                }
                extra--;
            }
        }
        return new Stadium({ standing, standard, covered, vip });
    }

    const VERSION = "0.4.0";
    const MAX_SEATS = 1000000;

    const t$2 = getTranslator();
    function createPlannerAutomaticView(props) {
        const autoInputsContainer = document.createElement('div');
        autoInputsContainer.id = 'autoInputsContainer';
        const desiredTotalContainer = document.createElement('div');
        desiredTotalContainer.className = 'mb-3';
        const desiredTotalLabel = document.createElement('label');
        desiredTotalLabel.className = 'form-label';
        desiredTotalLabel.htmlFor = 'totalSeats';
        desiredTotalLabel.textContent = t$2('desiredTotalSeats');
        const desiredTotalInput = document.createElement('input');
        desiredTotalInput.type = 'number';
        desiredTotalInput.className = 'form-control fmp-stadium-planner-input';
        desiredTotalInput.id = 'desiredTotalSeatsInput';
        desiredTotalInput.min = props.desiredTotalSeatsMin.toString();
        desiredTotalInput.max = props.desiredTotalSeatsMax.toString();
        desiredTotalInput.value = props.desiredTotalSeats?.toString() || '';
        desiredTotalInput.placeholder = props.desiredTotalSeats?.toString() || '';
        desiredTotalInput.addEventListener('input', () => {
            const value = parseInt(desiredTotalInput.value, 10);
            if (isNaN(value)) {
                props.onDesiredTotalSeatsChange(null);
            }
            else {
                props.onDesiredTotalSeatsChange(value);
            }
        });
        desiredTotalContainer.appendChild(desiredTotalLabel);
        desiredTotalContainer.appendChild(desiredTotalInput);
        autoInputsContainer.appendChild(desiredTotalContainer);
        const ratioContainer = document.createElement('div');
        ratioContainer.id = 'ratioContainer';
        ratioContainer.className = 'mb-3';
        const ratioLabel = document.createElement('label');
        ratioLabel.className = 'form-label';
        ratioLabel.textContent = t$2('seatsRatioExtendedLabel');
        ratioContainer.appendChild(ratioLabel);
        autoInputsContainer.appendChild(ratioContainer);
        if (props.modeSelected === PlannerMode.CUSTOM) {
            const customView = createAutomaticCustomView(props.currentSeatsRatio || SeatsRatio.getDefaultRatio(), props.onCurrentSeatsRatioChange);
            ratioContainer.appendChild(customView);
        }
        else {
            const presetRatioValue = document.createElement('div');
            presetRatioValue.className = 'h4';
            presetRatioValue.id = 'presetLabel';
            presetRatioValue.textContent = props.currentSeatsRatio?.toString() || '';
            ratioContainer.appendChild(presetRatioValue);
        }
        const description = document.createElement('div');
        description.textContent = t$2('seatsRatioDescription');
        ratioContainer.appendChild(description);
        const previewLayout = createGeneratedLayoutView(props.currentSeatsLayout);
        autoInputsContainer.appendChild(previewLayout);
        const planButton = document.createElement('button');
        planButton.className = 'btn fmp-btn btn-green fmp-stadium-planner-button w-100 mt-3 btn-lg';
        planButton.id = 'planBtn';
        planButton.textContent = t$2('plan').toLocaleUpperCase();
        planButton.style.paddingBottom = '16px';
        planButton.style.paddingTop = '16px';
        planButton.style.fontSize = '1.5rem';
        planButton.addEventListener('click', props.onPlanClick);
        autoInputsContainer.appendChild(planButton);
        return autoInputsContainer;
    }
    function createAutomaticCustomView(currentSeatsRatio, onCurrentSeatsRatioChange) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'd-flex gap-2';
        function inputEventHandler() {
            let vip = parseInt(vipInput.value, 10) || 0;
            if (vip < 0)
                vip = 0;
            if (vip > 1)
                vip = 1;
            let covered = parseInt(coveredInput.value, 10) || 0;
            if (covered < 1)
                covered = 1;
            let standard = parseInt(standardInput.value, 10) || 0;
            if (standard < 1)
                standard = 1;
            let standing = parseInt(standingInput.value, 10) || 0;
            if (standing < 1)
                standing = 1;
            onCurrentSeatsRatioChange(new SeatsRatio({ vip, covered, standard, standing }));
        }
        const vipInput = document.createElement('input');
        const isVipEnabled = currentSeatsRatio.vip !== 1;
        if (isVipEnabled) {
            vipInput.type = 'number';
        }
        vipInput.className = 'form-control text-center ratio fmp-stadium-planner-input';
        vipInput.value = currentSeatsRatio.vip.toString();
        vipInput.min = '0';
        vipInput.max = '1';
        vipInput.addEventListener('input', inputEventHandler);
        vipInput.disabled = !isVipEnabled;
        const coveredInput = document.createElement('input');
        coveredInput.type = 'number';
        coveredInput.className = 'form-control text-center ratio fmp-stadium-planner-input';
        coveredInput.value = currentSeatsRatio.covered.toString();
        coveredInput.min = '1';
        coveredInput.addEventListener('input', inputEventHandler);
        const standardInput = document.createElement('input');
        standardInput.type = 'number';
        standardInput.className = 'form-control text-center ratio fmp-stadium-planner-input';
        standardInput.value = currentSeatsRatio.standard.toString();
        standardInput.min = '1';
        standardInput.addEventListener('input', inputEventHandler);
        const standingInput = document.createElement('input');
        standingInput.type = 'number';
        standingInput.className = 'form-control text-center ratio fmp-stadium-planner-input';
        standingInput.value = currentSeatsRatio.standing.toString();
        standingInput.min = '1';
        standingInput.addEventListener('input', inputEventHandler);
        inputContainer.appendChild(vipInput);
        inputContainer.appendChild(coveredInput);
        inputContainer.appendChild(standardInput);
        inputContainer.appendChild(standingInput);
        return inputContainer;
    }
    function createGeneratedLayoutView(layout) {
        const previewContainer = document.createElement('div');
        previewContainer.id = 'preview';
        previewContainer.className = 'mt-3';
        const title = document.createElement('div');
        title.className = 'fw-bold mb-2';
        title.textContent = t$2('lastGeneratedLayoutTitle');
        previewContainer.appendChild(title);
        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group fmp-stadium-planner-list-group';
        // listGroup.style.borderRadius = '3px';
        const vipItem = document.createElement('li');
        vipItem.className = 'list-group-item fmp-stadium-planner-list-item';
        vipItem.innerHTML = `<i class="fmp-icons fmp-stadium" style="font-size: 20px;"></i> ${getHostLabel('stadium.VIP Seats')} <span class="float-end">${layout.vip}</span>`;
        listGroup.appendChild(vipItem);
        const coveredItem = document.createElement('li');
        coveredItem.className = 'list-group-item fmp-stadium-planner-list-item';
        coveredItem.innerHTML = `<i class="fmp-icons fmp-stadium" style="font-size: 20px;"></i> ${getHostLabel('stadium.Covered Seats')} <span class="float-end">${layout.covered}</span>`;
        listGroup.appendChild(coveredItem);
        const standardItem = document.createElement('li');
        standardItem.className = 'list-group-item fmp-stadium-planner-list-item';
        standardItem.innerHTML = `<i class="fmp-icons fmp-stadium" style="font-size: 20px;"></i> ${getHostLabel('stadium.Other Seats')} <span class="float-end">${layout.standard}</span>`;
        listGroup.appendChild(standardItem);
        const standingItem = document.createElement('li');
        standingItem.className = 'list-group-item fmp-stadium-planner-list-item';
        standingItem.innerHTML = `<i class="fmp-icons fmp-stadium" style="font-size: 20px;"></i> ${getHostLabel('stadium.Standing')} <span class="float-end">${layout.standing}</span>`;
        listGroup.appendChild(standingItem);
        const totalItem = document.createElement('li');
        totalItem.className = 'list-group-item fw-bold fmp-stadium-planner-list-item';
        const totalSeats = layout.vip + layout.covered + layout.standard + layout.standing;
        totalItem.innerHTML = `<i class="fmp-icons fmp-stadium" style="font-size: 20px;"></i> ${t$2('totalSeats')} <span class="float-end">${totalSeats}</span>`;
        listGroup.appendChild(totalItem);
        previewContainer.appendChild(listGroup);
        return previewContainer;
    }

    const t$1 = getTranslator();
    var PlannerMode;
    (function (PlannerMode) {
        PlannerMode["PRESET_KHRISTIAN"] = "preset-khristian";
        PlannerMode["PRESET_TICKETS"] = "preset-tickets";
        PlannerMode["CUSTOM"] = "custom";
        PlannerMode["ADVANCED"] = "advanced";
    })(PlannerMode || (PlannerMode = {}));
    // Renders planner-view and subscribes to store updates
    function renderPlannerView(container, store) {
        container.innerHTML = '';
        let componentContext = {
            modeSelected: PlannerMode.PRESET_KHRISTIAN,
            currentSeatsRatio: SeatsRatio.getDefaultRatio(),
            desiredTotalSeats: store.getState().plannedStadium?.getTotalSeats() || store.getState().currentStadium.getTotalSeats(),
            onModeChange: (mode, seatsRatio) => {
                const newContext = {
                    ...componentContext,
                    modeSelected: mode,
                };
                if (seatsRatio !== undefined) {
                    newContext.currentSeatsRatio = seatsRatio;
                }
                componentContext = newContext;
                onStateUpdate(container, store.getState(), store, newContext);
            },
            onDesiredTotalSeatsChange: (seats) => {
                const newContext = {
                    ...componentContext,
                    desiredTotalSeats: seats
                };
                componentContext = newContext;
            },
            onCurrentSeatsRatioChange: (seatsRatio) => {
                const newContext = {
                    ...componentContext,
                    currentSeatsRatio: seatsRatio
                };
                componentContext = newContext;
            },
            onPlanClick: () => {
                let desiredTotal = componentContext.desiredTotalSeats;
                let shouldUpdateInput = false;
                const state = store.getState();
                if (!desiredTotal || isNaN(desiredTotal) || desiredTotal < state.currentStadium.getTotalSeats()) {
                    desiredTotal = state.currentStadium.getTotalSeats();
                    shouldUpdateInput = true;
                }
                else if (desiredTotal > MAX_SEATS) {
                    desiredTotal = MAX_SEATS;
                    shouldUpdateInput = true;
                }
                // Use store to update plannedStadium
                const planned = planner(desiredTotal, state.currentStadium, componentContext.currentSeatsRatio || SeatsRatio.getDefaultRatio());
                if (shouldUpdateInput) {
                    const newContext = {
                        ...componentContext,
                        desiredTotalSeats: desiredTotal
                    };
                    componentContext = newContext;
                }
                store.setState({ plannedStadium: planned });
                if (!state.plannedStadium.isDifferentLayout(planned) && shouldUpdateInput) {
                    // Force re-render to update input value
                    onStateUpdate(container, store.getState(), store, componentContext);
                }
            },
        };
        store.subscribe((state, prevState) => {
            onStateUpdate(container, state, store, componentContext);
        });
    }
    function onStateUpdate(container, state, store, componentContext) {
        container.innerHTML = '';
        const title = makeTitleContainer('FMP Stadium Planner', t$1('planner'));
        container.appendChild(title);
        const itemContainer = createItemContainer$1();
        container.appendChild(itemContainer);
        const controlsContainer = createModeControls(componentContext.modeSelected, componentContext.onModeChange);
        itemContainer.appendChild(controlsContainer);
        // Mode-specific views
        if (componentContext.modeSelected === PlannerMode.ADVANCED) {
            const advancedView = createAdvancedView();
            itemContainer.appendChild(advancedView);
        }
        else {
            const automaticView = createPlannerAutomaticView({
                modeSelected: componentContext.modeSelected,
                currentSeatsRatio: componentContext.currentSeatsRatio,
                desiredTotalSeats: componentContext.desiredTotalSeats,
                onDesiredTotalSeatsChange: componentContext.onDesiredTotalSeatsChange,
                desiredTotalSeatsMin: state.currentStadium.getTotalSeats(),
                desiredTotalSeatsMax: MAX_SEATS,
                onCurrentSeatsRatioChange: componentContext.onCurrentSeatsRatioChange,
                currentSeatsLayout: state.plannedStadium?.getLayout() || state.currentStadium.getLayout(),
                onPlanClick: componentContext.onPlanClick,
            });
            itemContainer.appendChild(automaticView);
        }
    }
    function createItemContainer$1() {
        const item = document.createElement('div');
        item.className = 'item economy';
        return item;
    }
    function createModeControls(selectedMode, onModeChange) {
        const mainContainer = document.createElement('div');
        mainContainer.className = 'mb-3';
        const modes = [
            { value: PlannerMode.PRESET_KHRISTIAN, label: t$1('controlsAutomaticKhristianLabel'), seatsRatio: SeatsRatio.getDefaultRatio() },
            { value: PlannerMode.PRESET_TICKETS, label: t$1('controlsAutomaticTicketsLabel'), seatsRatio: SeatsRatio.getMaintananceOptimizedRatio() },
            { value: PlannerMode.CUSTOM, label: t$1('controlsAutomaticCustomLabel'), seatsRatio: undefined },
            { value: PlannerMode.ADVANCED, label: t$1('controlsAdvancedManualLabel'), seatsRatio: null },
        ];
        modes.forEach(mode => {
            const formCheck = document.createElement('div');
            formCheck.className = 'form-check';
            const input = document.createElement('input');
            input.className = 'form-check-input fmp-stadium-planner-radio';
            input.type = 'radio';
            input.name = 'mode';
            input.id = `mode-${mode.value}`;
            input.value = mode.value;
            if (selectedMode === mode.value) {
                input.checked = true;
            }
            if (mode.value === PlannerMode.ADVANCED) {
                input.disabled = true; // Advanced mode is disabled for now
            }
            input.addEventListener('change', () => {
                onModeChange(mode.value, mode.seatsRatio);
            });
            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.style.color = '#cce8ba';
            label.htmlFor = `mode-${mode.value}`;
            label.textContent = mode.label;
            formCheck.appendChild(input);
            formCheck.appendChild(label);
            mainContainer.appendChild(formCheck);
        });
        return mainContainer;
    }
    function createAdvancedView() {
        const container = document.createElement('div');
        container.textContent = 'Advanced view content goes here.';
        return container;
    }

    const t = getTranslator();
    function renderDetailedInfoView(container, store) {
        // Clear container
        container.innerHTML = '';
        // Subscribe to store
        store.subscribe((state, prevState) => {
            container.innerHTML = '';
            const infoTitle = makeTitleContainer('FMP Stadium Planner', t('detailedInfoTitle'), false);
            container.appendChild(infoTitle);
            const content = createItemContainer();
            const upgradeManager = new UpgradeManager(state.currentStadium.getLayout(), state.baseTicketPrice, state.plannedStadium.getLayout());
            const table = createMainTable(state, upgradeManager);
            content.appendChild(table);
            container.appendChild(content);
        });
    }
    function createHeaders(captions, addPadding = false) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        captions.forEach((caption, index) => {
            // all but first are right-aligned
            const th = document.createElement('th');
            th.textContent = caption;
            if (index > 0) {
                th.style.textAlign = 'right';
            }
            th.style.borderColor = '#a2dc7d';
            if (addPadding) {
                th.style.paddingTop = '24px';
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        return thead;
    }
    function createRow(cells) {
        const row = document.createElement('tr');
        cells.forEach((cellText, index) => {
            // all but first are right-aligned
            const cell = document.createElement('td');
            cell.textContent = cellText;
            if (index > 0) {
                cell.style.textAlign = 'right';
            }
            cell.style.borderColor = '#103201';
            row.appendChild(cell);
        });
        return row;
    }
    function createMainTable(state, upgradeManager) {
        // container responsive div
        const containerDiv = document.createElement('div');
        containerDiv.className = 'table-responsive';
        // create table
        const table = document.createElement('table');
        table.className = 'table table-hover';
        table.style.minWidth = '600px'; // ensure table is wide enough, important for responsiveness
        appendInfoTableSection(table, state);
        appendSectorsTableSection(table, state, upgradeManager);
        containerDiv.appendChild(table);
        return containerDiv;
    }
    function appendInfoTableSection(table, state) {
        // header
        const tableHead = createHeaders(["", t('current'), t('planned'), t('delta')]);
        table.appendChild(tableHead);
        // body
        const tableBody = document.createElement('tbody');
        // tableBody.className = 'table-group-divider';
        const totalSeatsRow = createRow([
            t('totalSeats'),
            state.currentStadium.getTotalSeats().toLocaleString(),
            state.plannedStadium.getTotalSeats().toLocaleString(),
            (state.plannedStadium.getTotalSeats() - state.currentStadium.getTotalSeats()).toLocaleString()
        ]);
        tableBody.appendChild(totalSeatsRow);
        const vipSeatsRow = createRow([
            getHostLabel('stadium.VIP Seats'),
            state.currentStadium.getLayout().vip.toLocaleString(),
            state.plannedStadium.getLayout().vip.toLocaleString(),
            (state.plannedStadium.getLayout().vip - state.currentStadium.getLayout().vip).toLocaleString()
        ]);
        tableBody.appendChild(vipSeatsRow);
        const coveredSeatsRow = createRow([
            getHostLabel('stadium.Covered Seats'),
            state.currentStadium.getLayout().covered.toLocaleString(),
            state.plannedStadium.getLayout().covered.toLocaleString(),
            (state.plannedStadium.getLayout().covered - state.currentStadium.getLayout().covered).toLocaleString()
        ]);
        tableBody.appendChild(coveredSeatsRow);
        const standardSeatsRow = createRow([
            getHostLabel('stadium.Other Seats'),
            state.currentStadium.getLayout().standard.toLocaleString(),
            state.plannedStadium.getLayout().standard.toLocaleString(),
            (state.plannedStadium.getLayout().standard - state.currentStadium.getLayout().standard).toLocaleString()
        ]);
        tableBody.appendChild(standardSeatsRow);
        const standingSeatsRow = createRow([
            getHostLabel('stadium.Standing'),
            state.currentStadium.getLayout().standing.toLocaleString(),
            state.plannedStadium.getLayout().standing.toLocaleString(),
            (state.plannedStadium.getLayout().standing - state.currentStadium.getLayout().standing).toLocaleString()
        ]);
        tableBody.appendChild(standingSeatsRow);
        const maintenanceCostRow = createRow([
            t('maintenanceCost'),
            `ⓕ ${state.currentStadium.getMaintainCost().toLocaleString()}`,
            `ⓕ ${state.plannedStadium.getMaintainCost().toLocaleString()}`,
            `ⓕ ${(state.plannedStadium.getMaintainCost() - state.currentStadium.getMaintainCost()).toLocaleString()}`
        ]);
        tableBody.appendChild(maintenanceCostRow);
        const maxIncomeRow = createRow([
            t('maxIncome'),
            `ⓕ ${state.currentStadium.calcMaxIncome(state.baseTicketPrice).toLocaleString()}`,
            `ⓕ ${state.plannedStadium.calcMaxIncome(state.baseTicketPrice).toLocaleString()}`,
            `ⓕ ${(state.plannedStadium.calcMaxIncome(state.baseTicketPrice) - state.currentStadium.calcMaxIncome(state.baseTicketPrice)).toLocaleString()}`
        ]);
        tableBody.appendChild(maxIncomeRow);
        const maxIncomeWithoutSeasonTicketsRow = createRow([
            t('maxIncomeWithoutSeasonTickets'),
            `ⓕ ${state.currentStadium.calcMaxIncomeWithoutSeasonTickets(state.baseTicketPrice, state.seasonTickets).toLocaleString()}`,
            `ⓕ ${state.plannedStadium.calcMaxIncomeWithoutSeasonTickets(state.baseTicketPrice, state.seasonTickets).toLocaleString()}`,
            `ⓕ ${(state.plannedStadium.calcMaxIncomeWithoutSeasonTickets(state.baseTicketPrice, state.seasonTickets) - state.currentStadium.calcMaxIncomeWithoutSeasonTickets(state.baseTicketPrice, state.seasonTickets)).toLocaleString()}`
        ]);
        tableBody.appendChild(maxIncomeWithoutSeasonTicketsRow);
        table.appendChild(tableBody);
    }
    function appendSectorsTableSection(table, state, upgradeManager) {
        const vipCost = upgradeManager.getVipBuildingCost();
        const coveredCost = upgradeManager.getCoveredBuildingCost();
        const standardCost = upgradeManager.getStandardBuildingCost();
        const standingCost = upgradeManager.getStandingBuildingCost();
        const totalCost = upgradeManager.getTotalBuildingCost();
        const vipTime = upgradeManager.getVipTimeToBuild();
        const coveredTime = upgradeManager.getCoveredTimeToBuild();
        const standardTime = upgradeManager.getStandardTimeToBuild();
        const standingTime = upgradeManager.getStandingTimeToBuild();
        const totalTime = upgradeManager.getTotalTimeToBuild();
        // header
        const thead = createHeaders([t('constructionDetailsTitle'), t('sizeDelta'), t('costsTableHeader'), t('timeTableHeader')], true);
        table.appendChild(thead);
        // body
        const tableBody = document.createElement('tbody');
        // tableBody.className = 'table-group-divider';
        table.appendChild(tableBody);
        const vipSeatsRow = createRow([
            getHostLabel('stadium.VIP Seats'),
            (state.plannedStadium.getLayout().vip - state.currentStadium.getLayout().vip).toLocaleString(),
            vipCost.toLocaleString(),
            `${vipTime}`,
        ]);
        tableBody.appendChild(vipSeatsRow);
        const coveredSeatsRow = createRow([
            getHostLabel('stadium.Covered Seats'),
            (state.plannedStadium.getLayout().covered - state.currentStadium.getLayout().covered).toLocaleString(),
            coveredCost.toLocaleString(),
            `${coveredTime}`,
        ]);
        tableBody.appendChild(coveredSeatsRow);
        const standardSeatsRow = createRow([
            getHostLabel('stadium.Other Seats'),
            (state.plannedStadium.getLayout().standard - state.currentStadium.getLayout().standard).toLocaleString(),
            standardCost.toLocaleString(),
            `${standardTime}`,
        ]);
        tableBody.appendChild(standardSeatsRow);
        const standingSeatsRow = createRow([
            getHostLabel('stadium.Standing'),
            (state.plannedStadium.getLayout().standing - state.currentStadium.getLayout().standing).toLocaleString(),
            standingCost.toLocaleString(),
            `${standingTime}`,
        ]);
        tableBody.appendChild(standingSeatsRow);
        const totalRow = createRow([
            t('total'),
            (state.plannedStadium.getTotalSeats() - state.currentStadium.getTotalSeats()).toLocaleString(),
            totalCost.toLocaleString(),
            `${totalTime}`,
        ]);
        tableBody.appendChild(totalRow);
    }
    function createItemContainer() {
        const item = document.createElement('div');
        item.className = 'item economy';
        return item;
    }

    // Inject custom CSS if not already present
    function injectCustomStyles() {
        if (document.getElementById('fmp-stadium-planner-style'))
            return;
        const style = document.createElement('style');
        style.id = 'fmp-stadium-planner-style';
        style.textContent = `
        .d-flex, .flexbox, .economy {
            min-width: 0 !important;
        }
        input.form-check-input.fmp-stadium-planner-radio:checked {
            background-color: #4caf50 !important;
            border-color: #388e3c !important;
        }
        input.form-check-input.fmp-stadium-planner-radio {
            background-color: #8bb299;
        }
        .fmp-stadium-planner-input {
            background-color: #467246 !important;
            color: #cce8ba !important;
            border: 1px solid #5ea141 !important;
            border-radius: 3px !important;
        }
        .fmp-stadium-planner-button {
            border-radius: 3px !important;
        }
        .fmp-stadium-planner-list-group {
            border-radius: 3px !important;
        }
        .fmp-stadium-planner-list-item {
            color: #cce8ba !important;
            background-color: transparent !important;
            border-color: #cce8ba !important;
            border-width: 0.5px !important;
        }
    `;
        document.head.appendChild(style);
    }

    getTranslator();
    function buildView(store) {
        const injectionPoint = findInjectionPoint();
        if (!injectionPoint) {
            console.error('FMP Stadium Planner: Unable to find injection point in DOM.');
            return;
        }
        injectCustomStyles();
        const mainHeader = makeMainHeader(VERSION);
        const mainContainer = makeMainContainer();
        injectionPoint.after(mainHeader);
        mainHeader.after(mainContainer);
        // Planner view
        const plannerSection = makeSectionContainer();
        renderPlannerView(plannerSection, store);
        mainContainer.appendChild(plannerSection);
        // General info view
        const generalInfoSection = makeSectionContainer();
        renderGeneralInfoView(generalInfoSection, store);
        mainContainer.appendChild(generalInfoSection);
        // Detailed info view
        const detailedInfoSection = makeSectionContainer();
        detailedInfoSection.style.flexBasis = '100%';
        renderDetailedInfoView(detailedInfoSection, store);
        mainContainer.appendChild(detailedInfoSection);
    }
    function findInjectionPoint() {
        const candidates = document.querySelectorAll('div.d-flex.flex-row.flex-wrap');
        return candidates.length > 0 ? candidates[0] : null;
    }
    function makeSectionContainer() {
        const container = document.createElement('div');
        container.className = 'fmpx board flexbox box';
        container.style.flexGrow = '1';
        container.style.flexBasis = '400px';
        return container;
    }
    function makeMainContainer() {
        const container = document.createElement('div');
        container.id = 'fmp-stadium-planner-main';
        container.className = 'd-flex flex-row flex-wrap';
        return container;
    }
    function makeMainHeader(version) {
        const mainContainer = document.createElement('div');
        mainContainer.id = 'fmp-stadium-planner-header';
        mainContainer.className = 'd-flex';
        mainContainer.style.marginTop = '12px';
        const panelHeader = document.createElement('div');
        panelHeader.className = 'panel header flex-grow-1';
        const header = document.createElement('div');
        header.className = 'lheader';
        const title = document.createElement('h3');
        title.textContent = 'FMP Stadium Planner';
        const versionSubtitle = document.createElement('h6');
        versionSubtitle.textContent = `v${version}`;
        header.appendChild(title);
        header.appendChild(versionSubtitle);
        panelHeader.appendChild(header);
        mainContainer.appendChild(panelHeader);
        return mainContainer;
    }

    class SeasonTickets {
        standing;
        standard;
        covered;
        vip;
        tot;
        constructor(standing, standard, covered, vip, total) {
            this.standing = standing;
            this.standard = standard;
            this.covered = covered;
            this.vip = vip;
            this.tot = total;
        }
        isDifferent(other) {
            return this.standing !== other.standing ||
                this.standard !== other.standard ||
                this.covered !== other.covered ||
                this.vip !== other.vip ||
                this.tot !== other.tot;
        }
    }

    (function () {
        async function run() {
            const stadiumData = await getStadiumData();
            let stadium;
            let baseTicketPrice;
            let seasonTickets;
            if (stadiumData && stadiumData.stadium && stadiumData.stadium.stands) {
                stadium = new Stadium({
                    standing: stadiumData.stadium.stands.sta,
                    standard: stadiumData.stadium.stands.std,
                    covered: stadiumData.stadium.stands.cov,
                    vip: stadiumData.stadium.stands.vip,
                });
                baseTicketPrice = stadiumData.standingPlacePrice;
                seasonTickets = new SeasonTickets(stadiumData.stadium.seasTkts.sta, stadiumData.stadium.seasTkts.std, stadiumData.stadium.seasTkts.cov, stadiumData.stadium.seasTkts.vip, stadiumData.stadium.seasTkts.tot);
            }
            else {
                console.error('FMP Stadium Planner: Unable to retrieve stadium data from page.');
                return;
            }
            // Initialize store with current stadium
            const store = new Store({
                currentStadium: stadium,
                plannedStadium: stadium.clone(),
                baseTicketPrice: baseTicketPrice,
                seasonTickets: seasonTickets,
            });
            buildView(store);
        }
        if (window.location.pathname.endsWith('Economy/Stadium')) {
            run();
        }
    })();

})();
