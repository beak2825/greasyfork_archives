// ==UserScript==
// @name         FMP Stadium Planner
// @namespace    https://github.com/napcoder/fmp-stadium-planner
// @version      0.5.0
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

    var apply$8 = "Apply";
    var advancedPlannerSubtitle$8 = "Plan seats per sector";
    var advancedPlannerTotalPlannedSeats$8 = "Total planned seats:";
    var buildingCost$8 = "Building cost";
    var costsTableHeader$8 = "Costs ⓕ";
    var controlsAdvancedManualLabel$8 = "Advanced - manual sector setup";
    var controlsAutomaticCustomLabel$8 = "Automatic - custom ratio";
    var controlsAutomaticKhristianLabel$8 = "Automatic default preset (recommended)";
    var controlsAutomaticTicketsLabel$8 = "Automatic preset based on ticket prices ratios";
    var current$8 = "Current";
    var currentInfoTitle$8 = "Current information";
    var delta$8 = "Delta";
    var desiredTotalSeats$8 = "Desired total seats";
    var detailedInfoTitle$8 = "Detailed information";
    var days$8 = "days";
    var lastGeneratedLayoutTitle$8 = "Seats layout (last generated)";
    var maintenanceCost$8 = "Maintenance cost";
    var maxIncome$8 = "Maximum income";
    var maxIncomeWithoutSeasonTickets$8 = "Maximum income (no seas. tkts)";
    var plan$8 = "Plan";
    var planned$8 = "Planned";
    var plannedInfoTitle$8 = "Planned information";
    var planner$9 = "Planner";
    var ratioLabel$8 = "Seats ratio";
    var seatsRatioDescription$8 = "Defines how many seats of each type are created for every 1 VIP seat.";
    var seatsRatioExtendedLabel$8 = "Seats ratio (VIP / Covered / Standard / Standing)";
    var sectorsTableHeader$8 = "Sector";
    var sizeDelta$8 = "Size delta";
    var timeTableHeader$8 = "Time (days)";
    var timeToBuild$8 = "Time to build";
    var total$8 = "Total";
    var totalSeats$8 = "Total seats";
    var en = {
    	apply: apply$8,
    	advancedPlannerSubtitle: advancedPlannerSubtitle$8,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats$8,
    	buildingCost: buildingCost$8,
    	costsTableHeader: costsTableHeader$8,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel$8,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel$8,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel$8,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel$8,
    	current: current$8,
    	currentInfoTitle: currentInfoTitle$8,
    	delta: delta$8,
    	desiredTotalSeats: desiredTotalSeats$8,
    	detailedInfoTitle: detailedInfoTitle$8,
    	days: days$8,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle$8,
    	maintenanceCost: maintenanceCost$8,
    	maxIncome: maxIncome$8,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets$8,
    	plan: plan$8,
    	planned: planned$8,
    	plannedInfoTitle: plannedInfoTitle$8,
    	planner: planner$9,
    	ratioLabel: ratioLabel$8,
    	seatsRatioDescription: seatsRatioDescription$8,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel$8,
    	sectorsTableHeader: sectorsTableHeader$8,
    	sizeDelta: sizeDelta$8,
    	timeTableHeader: timeTableHeader$8,
    	timeToBuild: timeToBuild$8,
    	total: total$8,
    	totalSeats: totalSeats$8
    };

    var advancedPlannerSubtitle$7 = "Pianifica i posti per ogni settore";
    var advancedPlannerTotalPlannedSeats$7 = "Posti totali pianificati:";
    var apply$7 = "Applica";
    var buildingCost$7 = "Costo di costruzione";
    var costsTableHeader$7 = "Costi (ⓕ)";
    var controlsAdvancedManualLabel$7 = "Avanzato - impostazione manuale dei settori";
    var controlsAutomaticCustomLabel$7 = "Automatico - rapporto personalizzato";
    var controlsAutomaticKhristianLabel$7 = "Automatico default (raccomandato)";
    var controlsAutomaticTicketsLabel$7 = "Automatico basato sui rapporti dei prezzi dei biglietti";
    var current$7 = "Attuale";
    var currentInfoTitle$7 = "Informazioni attuali";
    var delta$7 = "Delta";
    var desiredTotalSeats$7 = "Posti totali desiderati";
    var detailedInfoTitle$7 = "Informazioni dettagliate";
    var days$7 = "giorni";
    var lastGeneratedLayoutTitle$7 = "Layout posti (ultimi generati)";
    var maintenanceCost$7 = "Costo di manutenzione";
    var maxIncome$7 = "Massimo incasso";
    var maxIncomeWithoutSeasonTickets$7 = "Massimo incasso (meno quota abb.)";
    var plan$7 = "Pianifica";
    var planned$7 = "Pianificato";
    var plannedInfoTitle$7 = "Informazioni pianificate";
    var planner$8 = "Planner";
    var ratioLabel$7 = "Rapporto posti";
    var seatsRatioDescription$7 = "Definisce quanti posti di ogni tipo vengono creati per ogni posto VIP.";
    var seatsRatioExtendedLabel$7 = "Rapporto posti (VIP / Coperti / Standard / In piedi)";
    var sectorsTableHeader$7 = "Settore";
    var sizeDelta$7 = "Delta capienza";
    var timeTableHeader$7 = "Tempo (giorni)";
    var timeToBuild$7 = "Tempo di costruzione";
    var total$7 = "Totale";
    var totalSeats$7 = "Posti totali";
    var it = {
    	advancedPlannerSubtitle: advancedPlannerSubtitle$7,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats$7,
    	apply: apply$7,
    	buildingCost: buildingCost$7,
    	costsTableHeader: costsTableHeader$7,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel$7,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel$7,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel$7,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel$7,
    	current: current$7,
    	currentInfoTitle: currentInfoTitle$7,
    	delta: delta$7,
    	desiredTotalSeats: desiredTotalSeats$7,
    	detailedInfoTitle: detailedInfoTitle$7,
    	days: days$7,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle$7,
    	maintenanceCost: maintenanceCost$7,
    	maxIncome: maxIncome$7,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets$7,
    	plan: plan$7,
    	planned: planned$7,
    	plannedInfoTitle: plannedInfoTitle$7,
    	planner: planner$8,
    	ratioLabel: ratioLabel$7,
    	seatsRatioDescription: seatsRatioDescription$7,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel$7,
    	sectorsTableHeader: sectorsTableHeader$7,
    	sizeDelta: sizeDelta$7,
    	timeTableHeader: timeTableHeader$7,
    	timeToBuild: timeToBuild$7,
    	total: total$7,
    	totalSeats: totalSeats$7
    };

    var apply$6 = "Aplicar";
    var advancedPlannerSubtitle$6 = "Planificar asientos por sector";
    var advancedPlannerTotalPlannedSeats$6 = "Asientos planeados totales:";
    var buildingCost$6 = "Costo de construcción";
    var costsTableHeader$6 = "Costos ⓕ";
    var controlsAdvancedManualLabel$6 = "Avanzado - configuración manual de sectores";
    var controlsAutomaticCustomLabel$6 = "Automático - proporción personalizada";
    var controlsAutomaticKhristianLabel$6 = "Automático predeterminado (recomendado)";
    var controlsAutomaticTicketsLabel$6 = "Automático basado en proporciones de precios de entradas";
    var current$6 = "Actual";
    var currentInfoTitle$6 = "Información actual";
    var delta$6 = "Delta";
    var desiredTotalSeats$6 = "Asientos totales deseados";
    var detailedInfoTitle$6 = "Información detallada";
    var days$6 = "días";
    var lastGeneratedLayoutTitle$6 = "Diseño de asientos (último generado)";
    var maintenanceCost$6 = "Costo de mantenimiento";
    var maxIncome$6 = "Ingresos máximos";
    var maxIncomeWithoutSeasonTickets$6 = "Ingresos máximos (sin abonos)";
    var plan$6 = "Planificar";
    var planned$6 = "Planeado";
    var plannedInfoTitle$6 = "Información planificada";
    var planner$7 = "Planner";
    var ratioLabel$6 = "Proporción de asientos";
    var seatsRatioDescription$6 = "Define cuántos asientos de cada tipo se crean por cada 1 asiento VIP.";
    var seatsRatioExtendedLabel$6 = "Proporción de asientos (VIP / Cubiertos / Estándar / De pie)";
    var sectorsTableHeader$6 = "Sector";
    var sizeDelta$6 = "Delta de tamaño";
    var timeTableHeader$6 = "Tiempo (días)";
    var timeToBuild$6 = "Tiempo de construcción";
    var total$6 = "Total";
    var totalSeats$6 = "Asientos totales";
    var es = {
    	apply: apply$6,
    	advancedPlannerSubtitle: advancedPlannerSubtitle$6,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats$6,
    	buildingCost: buildingCost$6,
    	costsTableHeader: costsTableHeader$6,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel$6,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel$6,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel$6,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel$6,
    	current: current$6,
    	currentInfoTitle: currentInfoTitle$6,
    	delta: delta$6,
    	desiredTotalSeats: desiredTotalSeats$6,
    	detailedInfoTitle: detailedInfoTitle$6,
    	days: days$6,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle$6,
    	maintenanceCost: maintenanceCost$6,
    	maxIncome: maxIncome$6,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets$6,
    	plan: plan$6,
    	planned: planned$6,
    	plannedInfoTitle: plannedInfoTitle$6,
    	planner: planner$7,
    	ratioLabel: ratioLabel$6,
    	seatsRatioDescription: seatsRatioDescription$6,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel$6,
    	sectorsTableHeader: sectorsTableHeader$6,
    	sizeDelta: sizeDelta$6,
    	timeTableHeader: timeTableHeader$6,
    	timeToBuild: timeToBuild$6,
    	total: total$6,
    	totalSeats: totalSeats$6
    };

    var apply$5 = "Appliquer";
    var advancedPlannerSubtitle$5 = "Planifier les sièges par secteur";
    var advancedPlannerTotalPlannedSeats$5 = "Sièges planifiés au total :";
    var buildingCost$5 = "Coût de construction";
    var costsTableHeader$5 = "Coûts ⓕ";
    var controlsAdvancedManualLabel$5 = "Avancé - configuration manuelle des secteurs";
    var controlsAutomaticCustomLabel$5 = "Automatique - ratio personnalisé";
    var controlsAutomaticKhristianLabel$5 = "Préréglage automatique par défaut (recommandé)";
    var controlsAutomaticTicketsLabel$5 = "Préréglage automatique basé sur les ratios des prix des billets";
    var current$5 = "Actuel";
    var currentInfoTitle$5 = "Informations actuelles";
    var delta$5 = "Delta";
    var desiredTotalSeats$5 = "Nombre total de sièges souhaité";
    var detailedInfoTitle$5 = "Informations détaillées";
    var days$5 = "jours";
    var lastGeneratedLayoutTitle$5 = "Disposition des sièges (dernière générée)";
    var maintenanceCost$5 = "Coût d'entretien";
    var maxIncome$5 = "Revenu maximum";
    var maxIncomeWithoutSeasonTickets$5 = "Revenu maximum (sans abonnements)";
    var plan$5 = "Planifier";
    var planned$5 = "Planifié";
    var plannedInfoTitle$5 = "Informations planifiées";
    var planner$6 = "Planner";
    var ratioLabel$5 = "Ratio de sièges";
    var seatsRatioDescription$5 = "Définit combien de sièges de chaque type sont créés pour chaque siège VIP.";
    var seatsRatioExtendedLabel$5 = "Ratio de sièges (VIP / Couvert / Standard / Debout)";
    var sectorsTableHeader$5 = "Secteur";
    var sizeDelta$5 = "Delta de taille";
    var timeTableHeader$5 = "Temps (jours)";
    var timeToBuild$5 = "Temps de construction";
    var total$5 = "Total";
    var totalSeats$5 = "Nombre total de sièges";
    var fr = {
    	apply: apply$5,
    	advancedPlannerSubtitle: advancedPlannerSubtitle$5,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats$5,
    	buildingCost: buildingCost$5,
    	costsTableHeader: costsTableHeader$5,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel$5,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel$5,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel$5,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel$5,
    	current: current$5,
    	currentInfoTitle: currentInfoTitle$5,
    	delta: delta$5,
    	desiredTotalSeats: desiredTotalSeats$5,
    	detailedInfoTitle: detailedInfoTitle$5,
    	days: days$5,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle$5,
    	maintenanceCost: maintenanceCost$5,
    	maxIncome: maxIncome$5,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets$5,
    	plan: plan$5,
    	planned: planned$5,
    	plannedInfoTitle: plannedInfoTitle$5,
    	planner: planner$6,
    	ratioLabel: ratioLabel$5,
    	seatsRatioDescription: seatsRatioDescription$5,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel$5,
    	sectorsTableHeader: sectorsTableHeader$5,
    	sizeDelta: sizeDelta$5,
    	timeTableHeader: timeTableHeader$5,
    	timeToBuild: timeToBuild$5,
    	total: total$5,
    	totalSeats: totalSeats$5
    };

    var apply$4 = "Aplicar";
    var advancedPlannerSubtitle$4 = "Planear lugares por setor";
    var advancedPlannerTotalPlannedSeats$4 = "Total de lugares planeados:";
    var buildingCost$4 = "Custo de construção";
    var costsTableHeader$4 = "Custos ⓕ";
    var controlsAdvancedManualLabel$4 = "Avançado - configuração manual de setores";
    var controlsAutomaticCustomLabel$4 = "Automático - rácio personalizado";
    var controlsAutomaticKhristianLabel$4 = "Predefinição automática (recomendada)";
    var controlsAutomaticTicketsLabel$4 = "Predefinição automática baseada nas proporções dos preços dos bilhetes";
    var current$4 = "Atual";
    var currentInfoTitle$4 = "Informação atual";
    var delta$4 = "Delta";
    var desiredTotalSeats$4 = "Total de lugares desejado";
    var detailedInfoTitle$4 = "Informação detalhada";
    var days$4 = "dias";
    var lastGeneratedLayoutTitle$4 = "Layout de lugares (último gerado)";
    var maintenanceCost$4 = "Custo de manutenção";
    var maxIncome$4 = "Rendimento máximo";
    var maxIncomeWithoutSeasonTickets$4 = "Rendimento máximo (sem bilhetes de época)";
    var plan$4 = "Planear";
    var planned$4 = "Planeado";
    var plannedInfoTitle$4 = "Informação planeada";
    var planner$5 = "Planner";
    var ratioLabel$4 = "Rácio de lugares";
    var seatsRatioDescription$4 = "Define quantos lugares de cada tipo são criados para cada 1 lugar VIP.";
    var seatsRatioExtendedLabel$4 = "Rácio de lugares (VIP / Cobertos / Standard / Em pé)";
    var sectorsTableHeader$4 = "Setor";
    var sizeDelta$4 = "Delta de tamanho";
    var timeTableHeader$4 = "Tempo (dias)";
    var timeToBuild$4 = "Tempo de construção";
    var total$4 = "Total";
    var totalSeats$4 = "Total de lugares";
    var pt = {
    	apply: apply$4,
    	advancedPlannerSubtitle: advancedPlannerSubtitle$4,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats$4,
    	buildingCost: buildingCost$4,
    	costsTableHeader: costsTableHeader$4,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel$4,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel$4,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel$4,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel$4,
    	current: current$4,
    	currentInfoTitle: currentInfoTitle$4,
    	delta: delta$4,
    	desiredTotalSeats: desiredTotalSeats$4,
    	detailedInfoTitle: detailedInfoTitle$4,
    	days: days$4,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle$4,
    	maintenanceCost: maintenanceCost$4,
    	maxIncome: maxIncome$4,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets$4,
    	plan: plan$4,
    	planned: planned$4,
    	plannedInfoTitle: plannedInfoTitle$4,
    	planner: planner$5,
    	ratioLabel: ratioLabel$4,
    	seatsRatioDescription: seatsRatioDescription$4,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel$4,
    	sectorsTableHeader: sectorsTableHeader$4,
    	sizeDelta: sizeDelta$4,
    	timeTableHeader: timeTableHeader$4,
    	timeToBuild: timeToBuild$4,
    	total: total$4,
    	totalSeats: totalSeats$4
    };

    var apply$3 = "应用";
    var advancedPlannerSubtitle$3 = "按区域规划座位";
    var advancedPlannerTotalPlannedSeats$3 = "计划总座位：";
    var buildingCost$3 = "建设成本";
    var costsTableHeader$3 = "成本 ⓕ";
    var controlsAdvancedManualLabel$3 = "高级 - 手动设置分区";
    var controlsAutomaticCustomLabel$3 = "自动 - 自定义比例";
    var controlsAutomaticKhristianLabel$3 = "自动默认预设（推荐）";
    var controlsAutomaticTicketsLabel$3 = "基于票价比率的自动预设";
    var current$3 = "当前";
    var currentInfoTitle$3 = "当前信息";
    var delta$3 = "差值";
    var desiredTotalSeats$3 = "期望总座位数";
    var detailedInfoTitle$3 = "详细信息";
    var days$3 = "天";
    var lastGeneratedLayoutTitle$3 = "座位布局（最后生成）";
    var maintenanceCost$3 = "维护成本";
    var maxIncome$3 = "最大收入";
    var maxIncomeWithoutSeasonTickets$3 = "最大收入（无季票）";
    var plan$3 = "计划";
    var planned$3 = "已计划";
    var plannedInfoTitle$3 = "计划信息";
    var planner$4 = "Planner";
    var ratioLabel$3 = "座位比例";
    var seatsRatioDescription$3 = "定义每个 VIP 座位创建多少种类的座位。";
    var seatsRatioExtendedLabel$3 = "座位比例 (VIP / 覆盖 / 标准 / 站立)";
    var sectorsTableHeader$3 = "分区";
    var sizeDelta$3 = "容量差";
    var timeTableHeader$3 = "时间（天）";
    var timeToBuild$3 = "建造时间";
    var total$3 = "总计";
    var totalSeats$3 = "总座位数";
    var zh = {
    	apply: apply$3,
    	advancedPlannerSubtitle: advancedPlannerSubtitle$3,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats$3,
    	buildingCost: buildingCost$3,
    	costsTableHeader: costsTableHeader$3,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel$3,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel$3,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel$3,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel$3,
    	current: current$3,
    	currentInfoTitle: currentInfoTitle$3,
    	delta: delta$3,
    	desiredTotalSeats: desiredTotalSeats$3,
    	detailedInfoTitle: detailedInfoTitle$3,
    	days: days$3,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle$3,
    	maintenanceCost: maintenanceCost$3,
    	maxIncome: maxIncome$3,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets$3,
    	plan: plan$3,
    	planned: planned$3,
    	plannedInfoTitle: plannedInfoTitle$3,
    	planner: planner$4,
    	ratioLabel: ratioLabel$3,
    	seatsRatioDescription: seatsRatioDescription$3,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel$3,
    	sectorsTableHeader: sectorsTableHeader$3,
    	sizeDelta: sizeDelta$3,
    	timeTableHeader: timeTableHeader$3,
    	timeToBuild: timeToBuild$3,
    	total: total$3,
    	totalSeats: totalSeats$3
    };

    var apply$2 = "Uygula";
    var advancedPlannerSubtitle$2 = "Sektör başına koltuk planla";
    var advancedPlannerTotalPlannedSeats$2 = "Toplam planlanan koltuk:";
    var buildingCost$2 = "İnşaat maliyeti";
    var costsTableHeader$2 = "Maliyetler ⓕ";
    var controlsAdvancedManualLabel$2 = "Gelişmiş - sektörlerin elle yapılandırılması";
    var controlsAutomaticCustomLabel$2 = "Otomatik - özel oran";
    var controlsAutomaticKhristianLabel$2 = "Otomatik varsayılan ön ayar (önerilen)";
    var controlsAutomaticTicketsLabel$2 = "Bilet fiyat oranlarına göre otomatik ön ayar";
    var current$2 = "Güncel";
    var currentInfoTitle$2 = "Mevcut bilgiler";
    var delta$2 = "Delta";
    var desiredTotalSeats$2 = "İstenen toplam koltuk";
    var detailedInfoTitle$2 = "Detaylı bilgi";
    var days$2 = "gün";
    var lastGeneratedLayoutTitle$2 = "Koltuk düzeni (son oluşturulan)";
    var maintenanceCost$2 = "Bakım maliyeti";
    var maxIncome$2 = "Maksimum gelir";
    var maxIncomeWithoutSeasonTickets$2 = "Maksimum gelir (sezonluk bilet yok)";
    var plan$2 = "Planla";
    var planned$2 = "Planlandı";
    var plannedInfoTitle$2 = "Planlanan bilgiler";
    var planner$3 = "Planner";
    var ratioLabel$2 = "Koltuk oranı";
    var seatsRatioDescription$2 = "Her 1 VIP koltuk için her türden kaç koltuk oluşturulduğunu tanımlar.";
    var seatsRatioExtendedLabel$2 = "Koltuk oranı (VIP / Kapalı / Standart / Ayakta)";
    var sectorsTableHeader$2 = "Sektör";
    var sizeDelta$2 = "Boyut farkı";
    var timeTableHeader$2 = "Zaman (gün)";
    var timeToBuild$2 = "İnşa süresi";
    var total$2 = "Toplam";
    var totalSeats$2 = "Toplam koltuk";
    var tr = {
    	apply: apply$2,
    	advancedPlannerSubtitle: advancedPlannerSubtitle$2,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats$2,
    	buildingCost: buildingCost$2,
    	costsTableHeader: costsTableHeader$2,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel$2,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel$2,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel$2,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel$2,
    	current: current$2,
    	currentInfoTitle: currentInfoTitle$2,
    	delta: delta$2,
    	desiredTotalSeats: desiredTotalSeats$2,
    	detailedInfoTitle: detailedInfoTitle$2,
    	days: days$2,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle$2,
    	maintenanceCost: maintenanceCost$2,
    	maxIncome: maxIncome$2,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets$2,
    	plan: plan$2,
    	planned: planned$2,
    	plannedInfoTitle: plannedInfoTitle$2,
    	planner: planner$3,
    	ratioLabel: ratioLabel$2,
    	seatsRatioDescription: seatsRatioDescription$2,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel$2,
    	sectorsTableHeader: sectorsTableHeader$2,
    	sizeDelta: sizeDelta$2,
    	timeTableHeader: timeTableHeader$2,
    	timeToBuild: timeToBuild$2,
    	total: total$2,
    	totalSeats: totalSeats$2
    };

    var apply$1 = "Zastosuj";
    var advancedPlannerSubtitle$1 = "Planowanie miejsc według sektora";
    var advancedPlannerTotalPlannedSeats$1 = "Łączna liczba zaplanowanych miejsc:";
    var buildingCost$1 = "Koszt budowy";
    var costsTableHeader$1 = "Koszty ⓕ";
    var controlsAdvancedManualLabel$1 = "Zaawansowane - ręczne ustawienie sektorów";
    var controlsAutomaticCustomLabel$1 = "Automatyczne - niestandardowy stosunek";
    var controlsAutomaticKhristianLabel$1 = "Automatyczny domyślny preset (zalecane)";
    var controlsAutomaticTicketsLabel$1 = "Automatyczny preset oparty na stosunkach cen biletów";
    var current$1 = "Aktualne";
    var currentInfoTitle$1 = "Informacje aktualne";
    var delta$1 = "Delta";
    var desiredTotalSeats$1 = "Pożądana całkowita liczba miejsc";
    var detailedInfoTitle$1 = "Szczegółowe informacje";
    var days$1 = "dni";
    var lastGeneratedLayoutTitle$1 = "Układ miejsc (ostatnio wygenerowany)";
    var maintenanceCost$1 = "Koszt utrzymania";
    var maxIncome$1 = "Maksymalny przychód";
    var maxIncomeWithoutSeasonTickets$1 = "Maksymalny przychód (bez karnetów)";
    var plan$1 = "Zaplanuj";
    var planned$1 = "Zaplanowano";
    var plannedInfoTitle$1 = "Informacje zaplanowane";
    var planner$2 = "Planner";
    var ratioLabel$1 = "Stosunek miejsc";
    var seatsRatioDescription$1 = "Określa, ile miejsc każdego typu jest tworzonych dla każdego 1 miejsca VIP.";
    var seatsRatioExtendedLabel$1 = "Stosunek miejsc (VIP / Zadaszone / Standard / Stojące)";
    var sectorsTableHeader$1 = "Sektor";
    var sizeDelta$1 = "Różnica wielkości";
    var timeTableHeader$1 = "Czas (dni)";
    var timeToBuild$1 = "Czas budowy";
    var total$1 = "Razem";
    var totalSeats$1 = "Łączna liczba miejsc";
    var pl = {
    	apply: apply$1,
    	advancedPlannerSubtitle: advancedPlannerSubtitle$1,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats$1,
    	buildingCost: buildingCost$1,
    	costsTableHeader: costsTableHeader$1,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel$1,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel$1,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel$1,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel$1,
    	current: current$1,
    	currentInfoTitle: currentInfoTitle$1,
    	delta: delta$1,
    	desiredTotalSeats: desiredTotalSeats$1,
    	detailedInfoTitle: detailedInfoTitle$1,
    	days: days$1,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle$1,
    	maintenanceCost: maintenanceCost$1,
    	maxIncome: maxIncome$1,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets$1,
    	plan: plan$1,
    	planned: planned$1,
    	plannedInfoTitle: plannedInfoTitle$1,
    	planner: planner$2,
    	ratioLabel: ratioLabel$1,
    	seatsRatioDescription: seatsRatioDescription$1,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel$1,
    	sectorsTableHeader: sectorsTableHeader$1,
    	sizeDelta: sizeDelta$1,
    	timeTableHeader: timeTableHeader$1,
    	timeToBuild: timeToBuild$1,
    	total: total$1,
    	totalSeats: totalSeats$1
    };

    var apply = "Anwenden";
    var advancedPlannerSubtitle = "Sitze pro Sektor planen";
    var advancedPlannerTotalPlannedSeats = "Insgesamt geplante Sitze:";
    var buildingCost = "Baukosten";
    var costsTableHeader = "Kosten ⓕ";
    var controlsAdvancedManualLabel = "Erweitert - manuelle Sektoreinstellung";
    var controlsAutomaticCustomLabel = "Automatisch - benutzerdefiniertes Verhältnis";
    var controlsAutomaticKhristianLabel = "Automatische Standardvoreinstellung (empfohlen)";
    var controlsAutomaticTicketsLabel = "Automatische Vorgabe basierend auf Ticketpreisverhältnissen";
    var current = "Aktuell";
    var currentInfoTitle = "Aktuelle Informationen";
    var delta = "Delta";
    var desiredTotalSeats = "Gewünschte Gesamtanzahl Plätze";
    var detailedInfoTitle = "Detaillierte Informationen";
    var days = "Tage";
    var lastGeneratedLayoutTitle = "Sitzplan (zuletzt generiert)";
    var maintenanceCost = "Wartungskosten";
    var maxIncome = "Maximaler Erlös";
    var maxIncomeWithoutSeasonTickets = "Maximaler Erlös (ohne Dauerkarten)";
    var plan = "Planen";
    var planned = "Geplant";
    var plannedInfoTitle = "Geplante Informationen";
    var planner$1 = "Planner";
    var ratioLabel = "Sitzverhältnis";
    var seatsRatioDescription = "Definiert, wie viele Sitze jedes Typs für je 1 VIP-Sitz erstellt werden.";
    var seatsRatioExtendedLabel = "Sitzverhältnis (VIP / Überdacht / Standard / Stehend)";
    var sectorsTableHeader = "Sektor";
    var sizeDelta = "Größendifferenz";
    var timeTableHeader = "Zeit (Tage)";
    var timeToBuild = "Bauzeit";
    var total = "Gesamt";
    var totalSeats = "Gesamtanzahl Plätze";
    var de = {
    	apply: apply,
    	advancedPlannerSubtitle: advancedPlannerSubtitle,
    	advancedPlannerTotalPlannedSeats: advancedPlannerTotalPlannedSeats,
    	buildingCost: buildingCost,
    	costsTableHeader: costsTableHeader,
    	controlsAdvancedManualLabel: controlsAdvancedManualLabel,
    	controlsAutomaticCustomLabel: controlsAutomaticCustomLabel,
    	controlsAutomaticKhristianLabel: controlsAutomaticKhristianLabel,
    	controlsAutomaticTicketsLabel: controlsAutomaticTicketsLabel,
    	current: current,
    	currentInfoTitle: currentInfoTitle,
    	delta: delta,
    	desiredTotalSeats: desiredTotalSeats,
    	detailedInfoTitle: detailedInfoTitle,
    	days: days,
    	lastGeneratedLayoutTitle: lastGeneratedLayoutTitle,
    	maintenanceCost: maintenanceCost,
    	maxIncome: maxIncome,
    	maxIncomeWithoutSeasonTickets: maxIncomeWithoutSeasonTickets,
    	plan: plan,
    	planned: planned,
    	plannedInfoTitle: plannedInfoTitle,
    	planner: planner$1,
    	ratioLabel: ratioLabel,
    	seatsRatioDescription: seatsRatioDescription,
    	seatsRatioExtendedLabel: seatsRatioExtendedLabel,
    	sectorsTableHeader: sectorsTableHeader,
    	sizeDelta: sizeDelta,
    	timeTableHeader: timeTableHeader,
    	timeToBuild: timeToBuild,
    	total: total,
    	totalSeats: totalSeats
    };

    const translationsMap = {
        en,
        it,
        es,
        fr,
        pt,
        zh,
        tr,
        pl,
        de,
    };
    // Returns the best matching user language present in translationsMap, falls back to 'en'
    function getUserLang() {
        try {
            const raw = (typeof navigator !== 'undefined' && (navigator.language || (navigator.languages && navigator.languages[0]))) || 'en';
            const parts = raw.toLowerCase().split('-');
            // exact match
            if (parts[0] && translationsMap[parts[0]])
                return parts[0];
            // try full tag
            if (raw && translationsMap[raw])
                return raw;
        }
        catch (e) {
            // ignore
        }
        return 'en';
    }
    function getTranslator$1(lang) {
        const userLang = (lang || getUserLang());
        const chosen = translationsMap[userLang] || translationsMap[userLang.split('-')[0]] || translationsMap['en'];
        return function t(key) {
            return chosen[key] || translationsMap['en'][key] || key;
        };
    }
    // Helper to retrieve host-provided translation object `window.trxt` when available
    function getHostTrxt() {
        try {
            const host = (typeof window !== 'undefined') ? window : (typeof globalThis !== 'undefined' ? globalThis : undefined);
            if (host && host.trxt)
                return host.trxt;
        }
        catch (e) {
            // ignore
        }
        return null;
    }
    function getHostLabel$1(label) {
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

    const getTranslator = getTranslator$1;
    const getHostLabel = getHostLabel$1;

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

    const t$4 = getTranslator();
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
            const title = makeTitleContainer('FMP Stadium Planner', t$4('currentInfoTitle'));
            container.appendChild(title);
            const content = createItemContainer$2();
            const totalSeatsRow = createRow$1(t$4('totalSeats'), totalSeats.toLocaleString());
            const currentRatioRow = createRow$1(t$4('ratioLabel'), currentRatio);
            const maintenanceCostRow = createRow$1(t$4('maintenanceCost'), `ⓕ ${maintainanceCost.toLocaleString()}`);
            const maxIncomeRow = createRow$1(t$4('maxIncome'), `ⓕ ${maxIncome.toLocaleString()}`);
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
                const plannedTitle = makeTitleContainer(null, t$4('plannedInfoTitle'));
                container.appendChild(plannedTitle);
                const plannedContent = createItemContainer$2();
                const plannedTotalSeatsRow = createRow$1(t$4('totalSeats'), plannedTotalSeats.toLocaleString());
                const plannedRatioRow = createRow$1(t$4('ratioLabel'), plannedRatio);
                const plannedMaintenanceCostRow = createRow$1(t$4('maintenanceCost'), `ⓕ ${plannedMaintenanceCost.toLocaleString()}`);
                const plannedMaxIncomeRow = createRow$1(t$4('maxIncome'), `ⓕ ${plannedMaxIncome.toLocaleString()}`);
                const plannedBuildingCostRow = createRow$1(t$4('buildingCost'), `ⓕ ${plannedBuildingCost.toLocaleString()}`);
                const plannedTimeToBuildRow = createRow$1(t$4('timeToBuild'), `${plannedTimeToBuild} ${t$4('days')}`);
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

    const VERSION = "0.5.0";
    const MAX_SEATS = 1000000;
    const MAX_SEATS_PER_SECTOR = 600000;

    var PlannerMode;
    (function (PlannerMode) {
        PlannerMode["PRESET_KHRISTIAN"] = "preset-khristian";
        PlannerMode["PRESET_TICKETS"] = "preset-tickets";
        PlannerMode["CUSTOM"] = "custom";
        PlannerMode["ADVANCED"] = "advanced";
    })(PlannerMode || (PlannerMode = {}));

    const t$3 = getTranslator();
    function createPlannerAutomaticView(props) {
        const autoInputsContainer = document.createElement('div');
        autoInputsContainer.id = 'autoInputsContainer';
        const desiredTotalContainer = document.createElement('div');
        desiredTotalContainer.className = 'mb-3';
        const desiredTotalLabel = document.createElement('label');
        desiredTotalLabel.className = 'form-label';
        desiredTotalLabel.htmlFor = 'totalSeats';
        desiredTotalLabel.textContent = t$3('desiredTotalSeats');
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
        ratioLabel.textContent = t$3('seatsRatioExtendedLabel');
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
        description.textContent = t$3('seatsRatioDescription');
        ratioContainer.appendChild(description);
        const previewLayout = createGeneratedLayoutView(props.currentSeatsLayout);
        autoInputsContainer.appendChild(previewLayout);
        const planButton = document.createElement('button');
        planButton.className = 'btn fmp-btn btn-green fmp-stadium-planner-button w-100 mt-3 btn-lg';
        planButton.id = 'planBtn';
        planButton.textContent = t$3('plan').toLocaleUpperCase();
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
        title.textContent = t$3('lastGeneratedLayoutTitle');
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
        totalItem.innerHTML = `<i class="fmp-icons fmp-stadium" style="font-size: 20px;"></i> ${t$3('totalSeats')} <span class="float-end">${totalSeats}</span>`;
        listGroup.appendChild(totalItem);
        previewContainer.appendChild(listGroup);
        return previewContainer;
    }

    const t$2 = getTranslator();
    function createAdvancedPlannerView(props) {
        function sanitizeInputs() {
            let vip = parseInt(vipInput.value, 10) || 0;
            if (vip < 0)
                vip = 0;
            if (vip > MAX_SEATS_PER_SECTOR)
                vip = MAX_SEATS_PER_SECTOR;
            let covered = parseInt(coveredInput.value, 10) || 0;
            if (covered < 0)
                covered = 0;
            if (covered > MAX_SEATS_PER_SECTOR)
                covered = MAX_SEATS_PER_SECTOR;
            let standard = parseInt(standardInput.value, 10) || 0;
            if (standard < 0)
                standard = 0;
            if (standard > MAX_SEATS_PER_SECTOR)
                standard = MAX_SEATS_PER_SECTOR;
            let standing = parseInt(standingInput.value, 10) || 0;
            if (standing < 0)
                standing = 0;
            if (standing > MAX_SEATS_PER_SECTOR)
                standing = MAX_SEATS_PER_SECTOR;
            return { vip, covered, standard, standing };
        }
        function onApplyEventHandler() {
            const sanitizedInputs = sanitizeInputs();
            props.onApply(sanitizedInputs);
        }
        function onInputEventHandler() {
            const sanitizedInputs = sanitizeInputs();
            upsertTotal({ container, plannedSeats: sanitizedInputs });
        }
        const { vip, covered, standard, standing } = props.plannedSeatsLayout;
        const container = document.createElement('div');
        container.id = 'advancedInputs';
        const subTitle = document.createElement('div');
        subTitle.className = 'h5 mb-2';
        subTitle.textContent = t$2('advancedPlannerSubtitle');
        container.appendChild(subTitle);
        const vipInput = document.createElement('input');
        vipInput.id = 'plannerAdvancedVipSeats';
        vipInput.type = 'number';
        vipInput.className = 'form-control mb-2 fmp-stadium-planner-input';
        vipInput.placeholder = getHostLabel('stadium.VIP Seats');
        vipInput.value = vip.toString();
        const vipInputLabel = document.createElement('label');
        vipInputLabel.className = 'form-label';
        vipInputLabel.htmlFor = 'plannerAdvancedVipSeats';
        vipInputLabel.textContent = getHostLabel('stadium.VIP Seats');
        container.appendChild(vipInputLabel);
        container.appendChild(vipInput);
        const coveredInput = document.createElement('input');
        coveredInput.id = 'plannerAdvancedCoveredSeats';
        coveredInput.type = 'number';
        coveredInput.className = 'form-control mb-2 fmp-stadium-planner-input';
        coveredInput.placeholder = getHostLabel('stadium.Covered Seats');
        coveredInput.value = covered.toString();
        const coveredInputLabel = document.createElement('label');
        coveredInputLabel.htmlFor = 'plannerAdvancedCoveredSeats';
        coveredInputLabel.className = 'form-label';
        coveredInputLabel.textContent = getHostLabel('stadium.Covered Seats');
        container.appendChild(coveredInputLabel);
        container.appendChild(coveredInput);
        const standardInput = document.createElement('input');
        standardInput.id = 'plannerAdvancedStandardSeats';
        standardInput.type = 'number';
        standardInput.className = 'form-control mb-2 fmp-stadium-planner-input';
        standardInput.placeholder = getHostLabel('stadium.Other Seats');
        standardInput.value = standard.toString();
        const standardInputLabel = document.createElement('label');
        standardInputLabel.className = 'form-label';
        standardInputLabel.htmlFor = 'plannerAdvancedStandardSeats';
        standardInputLabel.textContent = getHostLabel('stadium.Other Seats');
        container.appendChild(standardInputLabel);
        container.appendChild(standardInput);
        const standingInput = document.createElement('input');
        standingInput.id = 'plannerAdvancedStandingSeats';
        standingInput.type = 'number';
        standingInput.className = 'form-control mb-2 fmp-stadium-planner-input';
        standingInput.placeholder = getHostLabel('stadium.Standing');
        standingInput.value = standing.toString();
        const standingInputLabel = document.createElement('label');
        standingInputLabel.className = 'form-label';
        standingInputLabel.htmlFor = 'plannerAdvancedStandingSeats';
        standingInputLabel.textContent = getHostLabel('stadium.Standing');
        container.appendChild(standingInputLabel);
        container.appendChild(standingInput);
        vipInput.addEventListener('input', onInputEventHandler);
        coveredInput.addEventListener('input', onInputEventHandler);
        standardInput.addEventListener('input', onInputEventHandler);
        standingInput.addEventListener('input', onInputEventHandler);
        upsertTotal({ container, plannedSeats: props.plannedSeatsLayout });
        const planButton = document.createElement('button');
        planButton.className = 'btn fmp-btn btn-green fmp-stadium-planner-button w-100 mt-3 btn-lg';
        planButton.id = 'planBtn';
        planButton.textContent = t$2('apply').toLocaleUpperCase();
        planButton.style.paddingBottom = '16px';
        planButton.style.paddingTop = '16px';
        planButton.style.fontSize = '1.5rem';
        planButton.addEventListener('click', onApplyEventHandler);
        container.appendChild(planButton);
        return container;
    }
    function upsertTotal({ container, plannedSeats }) {
        const { vip, covered, standard, standing } = plannedSeats;
        let totalPlannedSeatsDiv = container.querySelector('#totalPlannedSeatsDiv');
        if (!totalPlannedSeatsDiv) {
            totalPlannedSeatsDiv = document.createElement('div');
            totalPlannedSeatsDiv.id = 'totalPlannedSeatsDiv';
            totalPlannedSeatsDiv.className = 'mt-2 text-muted';
            container.appendChild(totalPlannedSeatsDiv);
        }
        totalPlannedSeatsDiv.innerHTML = `${t$2('advancedPlannerTotalPlannedSeats')} <strong>${vip + covered + standard + standing}</strong>`;
    }

    const t$1 = getTranslator();
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
            onApply: (plannedSeatsLayout) => {
                console.log('Apply clicked with layout:', plannedSeatsLayout);
                store.setState({ ...componentContext, plannedStadium: new Stadium(plannedSeatsLayout) });
            }
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
            const advancedView = createAdvancedPlannerView({
                plannedSeatsLayout: state.plannedStadium?.getLayout() || state.currentStadium.getLayout(),
                onApply: componentContext.onApply,
            });
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
