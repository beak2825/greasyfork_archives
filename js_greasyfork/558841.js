// ==UserScript==
// @name         LWM Army Planner
// @author       ImmortalRegis
// @namespace    https://www.lordswm.com/pl_info.php?id=6736731
// @version      v0.5
// @description  Will help you min-max your recruitment plans
// @match        https://www.lordswm.com/army.php*
// @grant        unsafeWindow
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/558841/LWM%20Army%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/558841/LWM%20Army%20Planner.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const pageWindow = typeof unsafeWindow !== 'undefined' ?
        unsafeWindow :
        window;
    let EQUIPPED_TALENTS = null;
    let TALENTS_LOADING = null;
    let IS_RENDERING = false;
    let ACTIVE_MODIFIERS = {
        meleeTalent: 0,
        rangedTalent: 0,
        meleeEquip: 0,
        rangedEquip: 0,
        rangeBonus: 0,
        waterBonus: 0,
        fireBonus: 0,
        earthBonus: 0,
        airBonus: 0,
        otherBonus: 0,
        retriBonus: 0,
        addAttackStat: 0
    };
    const TALENT_MODIFIER_RULES = [{
            nameid: 'attack1',
            apply(mods) {
                mods.meleeTalent = 10;
            }
        },
        {
            nameid: 'attack2',
            apply(mods) {
                mods.meleeTalent = 20;
            }
        },
        {
            nameid: 'attack3',
            apply(mods) {
                mods.meleeTalent = 30;
            }
        },
        {
            nameid: 'archery',
            apply(mods) {
                mods.rangedTalent = 20;
            }
        },
        {
            nameid: 'battle_frenzy',
            apply(mods) {
                mods.rangeBonus = 1;
            }
        },
        {
            nameid: 'cold_steel',
            apply(mods) {
                mods.waterBonus = 10;
            }
        }
    ];

    function applyPercent(value, percent) {
        return value * (1 + percent / 100);
    }

    function round2(n) {
        return Math.round(n * 100) / 100;
    }

    function applyDamageRangeBonus(min, max, rangeBonus) {
        if (!rangeBonus) return {
            min,
            max
        };
        return {
            min: min + rangeBonus,
            max: max + rangeBonus
        };
    }

    function calculatePhysicalAndElementalDamage(baseDamage, mods, isRanged) {
        // Step 1: apply talent
        let physical = baseDamage;
        if (isRanged) {
            physical = applyPercent(physical, mods.rangedTalent);
            physical = applyPercent(physical, mods.rangedEquip);
        } else {
            physical = applyPercent(physical, mods.meleeTalent);
            physical = applyPercent(physical, mods.meleeEquip);
        }
        physical = round2(physical);
        // Step 2: elemental bonuses (additive, based on physical)
        const water = round2(physical * (mods.waterBonus / 100));
        const fire = round2(physical * (mods.fireBonus / 100));
        const earth = round2(physical * (mods.earthBonus / 100));
        const air = round2(physical * (mods.airBonus / 100));
        const elementalTotal = water + fire + earth + air;
        return {
            physical,
            elemental: {
                water,
                fire,
                earth,
                air
            },
            total: round2(physical + elementalTotal)
        };
    }

    function parseTalentModifiers(talents) {
        const mods = structuredClone(ACTIVE_MODIFIERS);
        for (const rule of TALENT_MODIFIER_RULES) {
            if (talents.some(t => t.nameid === rule.nameid)) {
                rule.apply(mods);
            }
        }
        return mods;
    }

    function applyTalentDefaultsToModifiers() {
        if (!Array.isArray(EQUIPPED_TALENTS)) return;
        const parsed = parseTalentModifiers(EQUIPPED_TALENTS);
        Object.assign(ACTIVE_MODIFIERS, parsed);
    }
    async function fetchEquippedTalents() {
        const url = 'https://www.lordswm.com/skillwheel.php';
        const res = await fetch(url, {
            credentials: 'include'
        });
        const html = await res.text();
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument;
        doc.open();
        doc.write(html);
        doc.close();
        await new Promise(r => setTimeout(r, 300));
        const win = iframe.contentWindow;
        if (!win.icos) {
            document.body.removeChild(iframe);
            throw new Error('Failed to load talent data (icos not found)');
        }
        const talents = [];
        for (let k = win.num; k >= 1; k--) {
            const ico = win.icos[k];
            if (ico && ico.isperk === 1) {
                talents.push({
                    name: ico.name,
                    nameid: ico._name ?? null
                });
            }
        }
        document.body.removeChild(iframe);
        return talents;
    }
    async function loadTalentsOnce() {
        if (EQUIPPED_TALENTS) return EQUIPPED_TALENTS;
        if (TALENTS_LOADING) return TALENTS_LOADING;
        TALENTS_LOADING = fetchEquippedTalents()
            .then(t => {
                EQUIPPED_TALENTS = t;
                return t;
            })
            .catch(err => {
                console.error('Talent fetch failed:', err);
                EQUIPPED_TALENTS = [];
                return [];
            });
        return TALENTS_LOADING;
    }

    function renderModifierInputs(mods) {
        const row = (label, key) => `
        <tr>
            <td>${label}</td>
            <td>
                <input type="number" step="1" value="${mods[key]}"
                       data-modifier="${key}"
                       style="width:60px; text-align:right;">
            </td>
        </tr>
    `;
        return `
        <table style="border-collapse:separate; border-spacing:8px 4px;">
            ${row('Melee Talent Multiplier (%)', 'meleeTalent')}
            ${row('Ranged Talent Multiplier (%)', 'rangedTalent')}
            ${row('Melee Equipment Multiplier (%)', 'meleeEquip')}
            ${row('Ranged Equipment Multiplier (%)', 'rangedEquip')}
            ${row('Damage Range Bonus', 'rangeBonus')}
            ${row('Water Element Bonus (%)', 'waterBonus')}
            ${row('Fire Element Bonus (%)', 'fireBonus')}
            ${row('Earth Element Bonus (%)', 'earthBonus')}
            ${row('Air Element Bonus (%)', 'airBonus')}
            ${row('Other Bonus (%)', 'otherBonus')}
            ${row('Retribution Bonus (%)', 'retriBonus')}
            ${row('Additional Attack Stats', 'addAttackStat')}
        </table>
    `;
    }

    function hookModifierInputs(modifiers) {
        document.querySelectorAll('[data-modifier]').forEach(input => {
            input.addEventListener('input', () => {
                const key = input.dataset.modifier;
                modifiers[key] = parseInt(input.value, 10) || 0;
                updateArmyCalculations(); // recalculates everything
            });
        });
    }

    function insertArmyPlannerContainer() {
        if (document.getElementById('lwm_army_planner_container')) return;
        const recruitHeader = Array.from(
            document.querySelectorAll('.global_container_block_header')
        ).find(h => h.textContent.trim() === 'Recruiting');
        if (!recruitHeader) return;
        const recruitContainer = recruitHeader.closest('.global_container_block');
        if (!recruitContainer) return;
        const plannerContainer = document.createElement('div');
        plannerContainer.id = 'lwm_army_planner_container';
        plannerContainer.className = 'global_container_block';
        plannerContainer.style.marginLeft = 'auto';
        plannerContainer.style.marginRight = 'auto';
        plannerContainer.style.paddingTop = '0.8em';
        plannerContainer.style.justifyContent = 'flex-start';
        const header = document.createElement('div');
        header.className = 'global_container_block_header';
        header.textContent = 'Army Planner';
        const content = document.createElement('div');
        content.id = 'lwm_army_planner_content';
        content.style.padding = '0.6em';
        content.style.fontSize = '14px';
        content.style.display = 'block';
        content.style.justifyContent = 'flex-start';
        content.style.alignItems = 'flex-start';
        content.style.textAlign = 'left';
        content.innerHTML = `
        <div style="opacity:0.7;">
            Unit effective damage analysis will appear here.
        </div>
    `;
        plannerContainer.appendChild(header);
        plannerContainer.appendChild(content);
        // Insert directly after Recruiting container
        recruitContainer.insertAdjacentElement('afterend', plannerContainer);
    }

    function calculateEffectiveDamage({
        count,
        attack,
        defence,
        minDamage,
        maxDamage,
        attackType,
        mods
    }) {
        let minUnit = minDamage + (mods.rangeBonus || 0);
        let maxUnit = maxDamage + (mods.rangeBonus || 0);
        const calcattack = attack + (mods.addAttackStat || 0);
        let minEff, maxEff;
        if (calcattack >= defence) {
            const multiplier = 1 + 0.05 * (calcattack - defence);
            minEff = minUnit * multiplier;
            maxEff = maxUnit * multiplier;
        } else {
            const divisor = 1 + 0.05 * (defence - calcattack);
            minEff = minUnit / divisor;
            maxEff = maxUnit / divisor;
        }
        minEff *= count;
        maxEff *= count;
        const avgEff = (minEff + maxEff) / 2;
        const minDmg = applyAllModifiers(minEff, mods, attackType);
        const avgDmg = applyAllModifiers(avgEff, mods, attackType);
        const maxDmg = applyAllModifiers(maxEff, mods, attackType);
        return {
            min: round2(minDmg.total),
            max: round2(maxDmg.total),
            avg: round2(avgDmg.total),
            physical: round2(avgDmg.physical),
            elemental: {
                water: round2(avgDmg.elemental.water),
                fire: round2(avgDmg.elemental.fire),
                earth: round2(avgDmg.elemental.earth),
                air: round2(avgDmg.elemental.air)
            },
            total: round2(avgDmg.total)
        };
    }

    function applyAllModifiers(base, mods, attackType) {
        let physical = base;
        // Talent + equipment multipliers
        if (attackType === 'ranged') {
            physical *= 1 + (mods.rangedTalent || 0) / 100;
            physical *= 1 + (mods.rangedEquip || 0) / 100;
        } else {
            physical *= 1 + (mods.meleeTalent || 0) / 100;
            physical *= 1 + (mods.meleeEquip || 0) / 100;
        }
        // Shooter melee penalty
        if (attackType === 'melee_half') {
            physical *= 0.5;
        }
        // melee_full → no change
        // Retribution / global bonuses
        physical *= 1 + (mods.retriBonus || 0) / 100;
        // Elemental conversion
        const elemental = {
            water: physical * (mods.waterBonus || 0) / 100,
            fire: physical * (mods.fireBonus || 0) / 100,
            earth: physical * (mods.earthBonus || 0) / 100,
            air: physical * (mods.airBonus || 0) / 100
        };
        const elementalTotal =
            elemental.water +
            elemental.fire +
            elemental.earth +
            elemental.air;
        let total = physical + elementalTotal;
        total *= 1 + (mods.otherBonus || 0) / 100;
        return {
            physical,
            elemental,
            total
        };
    }

    function aggregateDamageTotals(effects) {
        let min = 0,
            max = 0,
            avg = 0;
        for (const e of effects) {
            min += e.min;
            max += e.max;
            avg += e.avg;
        }
        return {
            min,
            max,
            avg
        };
    }

    function calculateContribution(avgDamage, totalAvg) {
        if (totalAvg <= 0) return 0;
        return (avgDamage / totalAvg) * 100;
    }

    function getEnemyDefense() {
        const input = document.getElementById('lwm_enemy_defense');
        if (!input) return 0;
        return Math.max(0, parseInt(input.value, 10) || 0);
    }

    function extractNumber(value) {
        if (value == null) return 0;
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const match = value.replace(/<[^>]*>/g, '').match(/-?\d+(\.\d+)?/);
            return match ? Number(match[0]) : 0;
        }
        return 0;
    }

    function getArmyUnits() {
        const obj = pageWindow.obj;
        if (!Array.isArray(obj)) return [];
        const units = [];
        for (let i = 1; i <= 7; i++) {
            const u = obj[i];
            if (!u || !u.name) continue;
            const base = {
                tier: i,
                name: u.name,
                count: extractNumber(u.nownumberd ?? u.count),
                attack: extractNumber(u.attack) + extractNumber(u.nano_arts?.naa?.effect ?? 0),
                minDamage: extractNumber(u.mindam),
                maxDamage: extractNumber(u.maxdam)
            };
            // Ranged attack
            if (u.shooter === 1) {
                units.push({
                    ...base,
                    attackType: 'ranged'
                });
                // Melee fallback
                units.push({
                    ...base,
                    tier: i + 0.5,
                    name: u.name + ' (Melee)',
                    attackType: u.nopenalty === 1 ? 'melee_full' : 'melee_half'
                });
            } else {
                // Pure melee unit
                units.push({
                    ...base,
                    attackType: 'melee_full'
                });
            }
        }
        return units;
    }

    function aggregateDamageByType(rows) {
        const result = {
            ranged: {
                min: 0,
                max: 0,
                avg: 0
            },
            melee: {
                min: 0,
                max: 0,
                avg: 0
            }
        };
        for (const r of rows) {
            const isRanged = r.attackType === 'ranged';
            const bucket = isRanged ? result.ranged : result.melee;
            bucket.min += r.eff.min;
            bucket.max += r.eff.max;
            bucket.avg += r.eff.avg;
        }
        return result;
    }

    function setupArmyPlannerUI() {
        const container = document.getElementById('lwm_army_planner_content');
        if (!container) return;
        container.innerHTML = `
        <div style="margin-bottom:8px;">
            <label>
                <b>Enemy Defense:</b>
                <input
                    id="lwm_enemy_defense"
                    type="number"
                    min="0"
                    step="1"
                    value="0"
                    style="width:60px; margin-left:6px;"
                >
            </label>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-top:4px;">
            <thead>
                <tr style="font-weight:bold; border-bottom:1px solid #777;">
                    <td style="padding:4px 8px;">Name</td>
                    <td style="padding:4px 8px; text-align:right;">Count</td>
                    <td style="padding:4px 8px; text-align:right;">Atk</td>
                    <td style="padding:4px 8px; text-align:right;">Damage Range</td>
                    <td style="padding:4px 8px; text-align:right;">Avg</td>
                    <td style="padding:4px 8px; text-align:right;">% of Total</td>
                </tr>
            </thead>
            <tbody id="army-table-body"></tbody>
            <tfoot id="army-table-total"></tfoot>
        </table>

        <div style="margin-top:6px; font-weight:bold;">Damage Breakdown:</div>
        <div style="margin-left:8px;">
            <div id="ranged-breakdown"></div>
            <div id="melee-breakdown"></div>
        </div>

        <div style="margin-top:8px; padding-top:6px; border-top:1px solid #777;">
            <b>Advanced Analysis</b>
            <div id="talent-analysis" style="margin-top:4px;"></div>
            <div id="advanced-analysis" style="margin-top:4px;"></div>
        </div>
    `;
        // Static content
        document.getElementById('talent-analysis').innerHTML =
            renderTalentList(EQUIPPED_TALENTS);
        applyTalentDefaultsToModifiers();
        document.getElementById('advanced-analysis').innerHTML = `
        <b>Advanced Modifiers</b>
        ${renderModifierInputs(ACTIVE_MODIFIERS)}
    `;
        container.addEventListener('input', handleArmyPlannerInput);
    }

    function handleArmyPlannerInput(e) {
        if (e.target.id === 'lwm_enemy_defense') {
            updateArmyCalculations();
            return;
        }
        const modInput = e.target.closest('[data-modifier]');
        if (modInput) {
            ACTIVE_MODIFIERS[modInput.dataset.modifier] =
                parseInt(modInput.value, 10) || 0;
            updateArmyCalculations();
        }
    }

    function updateArmyCalculations() {
        const enemyDef = getEnemyDefense();
        const units = getArmyUnits();
        const tbody = document.getElementById('army-table-body');
        const tfoot = document.getElementById('army-table-total');
        if (!tbody || units.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No units detected.</td></tr>`;
            return;
        }
        const rows = [];
        tbody.innerHTML = '';
        for (const u of units) {
            if (u.count <= 0) continue;
            const eff = calculateEffectiveDamage({
                count: u.count,
                attack: u.attack,
                defence: enemyDef,
                minDamage: u.minDamage,
                maxDamage: u.maxDamage,
                attackType: u.attackType,
                mods: ACTIVE_MODIFIERS
            });
            rows.push({
                ...u,
                eff
            });
        }
        const totals = aggregateDamageTotals(rows.map(r => r.eff));
        const split = aggregateDamageByType(rows);
        for (const r of rows) {
            const pct = calculateContribution(r.eff.avg, totals.avg);
            tbody.insertAdjacentHTML('beforeend', `
            <tr>
                <td style="padding:3px 8px;">${r.name}</td>
                <td style="padding:3px 8px; text-align:right;">${r.count}</td>
                <td style="padding:3px 8px; text-align:right;">${r.attack}</td>
                <td style="padding:3px 8px; text-align:right;">
                    ${r.eff.min.toFixed(2)} – ${r.eff.max.toFixed(2)}
                </td>
                <td style="padding:3px 8px; text-align:right;">
                    <b>${r.eff.avg.toFixed(2)}</b>
                </td>
                <td style="padding:3px 8px; text-align:right;">
                    ${pct.toFixed(1)}%
                </td>
            </tr>
        `);
        }
        tfoot.innerHTML = `
        <tr style="font-weight:bold; border-top:1px solid #777;">
            <td colspan="3" style="padding:4px 8px;">Total</td>
            <td style="padding:4px 8px; text-align:right;">
                ${totals.min.toFixed(2)} – ${totals.max.toFixed(2)}
            </td>
            <td style="padding:4px 8px; text-align:right;">
                ${totals.avg.toFixed(2)}
            </td>
            <td style="padding:4px 8px; text-align:right;">100%</td>
        </tr>
    `;
        document.getElementById('ranged-breakdown').textContent =
            `Ranged: ${split.ranged.min.toFixed(2)} – ${split.ranged.max.toFixed(2)}
        (avg ${split.ranged.avg.toFixed(2)})`;
        document.getElementById('melee-breakdown').textContent =
            `Melee: ${split.melee.min.toFixed(2)} – ${split.melee.max.toFixed(2)}
        (avg ${split.melee.avg.toFixed(2)})`;
    }

    function renderTalentList(talents) {
        if (!talents || talents.length === 0) {
            return `<div style="font-style:italic;">No talents detected</div>`;
        }
        let html = `<div><u>Equipped Talents</u>:</div>`;
        html += `<ul style="margin:2px 0 0 16px; padding:0;">`;
        for (const t of talents) {
            html += `<li>${t.name}</li>`;
        }
        html += `</ul>`;
        return html;
    }
    let __lwm_army_dirty = false;

    function scheduleArmyRecalc() {
        if (__lwm_army_dirty) return;
        __lwm_army_dirty = true;
        requestAnimationFrame(() => {
            __lwm_army_dirty = false;
            if (document.getElementById('lwm_army_planner_container')) {
                updateArmyCalculations();
            }
        });
    }

    function hookArmyObject() {
        const obj = pageWindow.obj;
        if (!Array.isArray(obj)) return false;
        if (pageWindow.__lwm_obj_hooked) return true;
        for (let i = 1; i <= 7; i++) {
            const u = obj[i];
            if (!u || u.__lwm_proxied) continue;
            obj[i] = new Proxy(u, {
                set(target, prop, value) {
                    target[prop] = value;
                    if (
                        prop === 'nownumberd' ||
                        prop === 'count' ||
                        prop === 'max_pos_count'
                    ) {
                        scheduleArmyRecalc();
                    }
                    return true;
                }
            });
            obj[i].__lwm_proxied = true;
        }
        pageWindow.__lwm_obj_hooked = true;
        return true;
    }

    function waitForArmyData(timeout = 5000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const tick = () => {
                if (isArmyDataReady()) {
                    resolve();
                } else if (Date.now() - start > timeout) {
                    reject(new Error('Army data not ready'));
                } else {
                    requestAnimationFrame(tick);
                }
            };
            tick();
        });
    }

    function isArmyDataReady() {
        const obj = pageWindow.obj;
        return (
            Array.isArray(obj) &&
            obj.length >= 2
        );
    }
    (async function initArmyPlanner() {
        await loadTalentsOnce();
        insertArmyPlannerContainer();
        try {
            await waitForArmyData();
            hookArmyObject();
            setupArmyPlannerUI();
            updateArmyCalculations();
            //hookChangeSlider();
        } catch (e) {
            console.warn('[Army Planner] Army data not ready, retrying once');
            setTimeout(async () => {
                try {
                    await waitForArmyData(3000);
                    hookArmyObject();
                    setupArmyPlannerUI();
                    updateArmyCalculations();
                    //hookChangeSlider();
                } catch {
                    console.warn('[Army Planner] No units detected');
                }
            }, 1000);
        }
    })();
})();