// ==UserScript==
// @name         Company Optimizer
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  optimizes current employees
// @author       Allenone[2033011]
// @match        https://www.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562142/Company%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/562142/Company%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = "" // limited access API key

    // --- Efficiency Calculation ---
    function calcEfficiency(stat, required, BUS2110) {
        if (required === 0) return 0;
        if (BUS2110) stat *= 1.2;

        return Math.floor(
            Math.min(45, (45 / required) * stat) +
            Math.max(0, (5 * Math.log2(stat / required)))
        );
    }

    function getEfficiency(worker, requiredstats, BUS2110) {
        let total = 0;
        for (let statName in requiredstats) {
            let stat = worker[statName] || 0;
            let required = requiredstats[statName];
            if (required > 0) {
                total += calcEfficiency(stat, required, BUS2110);
            }
        }
        return total;
    }

    // --- Oil Rig Positions ---
    let positions = {};

    // --- Hungarian Algorithm ---
    function hungarian(matrix) {
        const n = matrix.length;
        const m = matrix[0].length;
        const u = Array(n+1).fill(0), v = Array(m+1).fill(0);
        const p = Array(m+1).fill(0), way = Array(m+1).fill(0);

        for (let i=1; i<=n; i++) {
            p[0] = i;
            let j0 = 0;
            const minv = Array(m+1).fill(Infinity);
            const used = Array(m+1).fill(false);
            do {
                used[j0] = true;
                const i0 = p[j0];
                let delta = Infinity, j1 = 0;
                for (let j=1; j<=m; j++) {
                    if (!used[j]) {
                        const cur = -(matrix[i0-1][j-1]) - u[i0] - v[j];
                        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
                        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
                    }
                }
                for (let j=0; j<=m; j++) {
                    if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
                    else { minv[j] -= delta; }
                }
                j0 = j1;
            } while (p[j0] != 0);

            do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0 != 0);
        }

        const assignment = Array(n).fill(-1);
        for (let j=1; j<=m; j++) if (p[j]>0) assignment[p[j]-1] = j-1;
        const totalScore = -v[0];
        return { totalScore, assignment };
    }

    // --- Fetch your company employees ---
    async function fetchMyEmployees(apiKey) {
        const response = await fetch(`https://api.torn.com/company/?selections=employees&key=${apiKey}`);
        const data = await response.json();
        if (data.error) throw new Error(`API error: ${data.error}`);

        let totalWorkingStats = 0;

        for (const employeeId in data.company_employees) {
            const employee = data.company_employees[employeeId];
            totalWorkingStats += employee.effectiveness.working_stats || 0;
        }

        console.log("Current total base efficiency:", totalWorkingStats);

        return Object.values(data.company_employees).map(e => ({
            Name: e.name,
            END: Number(e.endurance) || 0,
            INT: Number(e.intelligence) || 0,
            MAN: Number(e.manual_labor) || 0
        }));
    }

    async function fetchMyEmployeesCustom(apiKey) {
        const response = await fetch(`https://api.torn.com/company/?selections=employees&key=${apiKey}`);
        const data = await response.json();
        if (data.error) throw new Error(`API error: ${data.error}`);

        // Manually add employee "X" with custom stats
        const customEmployee = {
            name: "BLITZ",
            position: "Waiter",
            days_in_company: 0,
            manual_labor: 242617, // Custom manual labor stat
            intelligence: 211940, // Custom intelligence stat
            endurance: 226472, // Custom endurance stat
            effectiveness: {
                working_stats: 150, // Custom working stats
                settled_in: 10,
                merits: 10,
                director_education: 12,
                addiction: 0,
                total: 182
            },
            last_action: {
                status: "Offline",
                timestamp: Math.floor(Date.now() / 1000),
                relative: "Just now"
            },
            status: {
                description: "Okay",
                details: "",
                state: "Okay",
                color: "green",
                until: 0
            }
        };

        // Add custom employee to the company_employees object
        data.company_employees = {
            ...data.company_employees,
            //"9999999": customEmployee // Use a unique ID for the custom employee
        };

        let totalWorkingStats = 0;

        for (const employeeId in data.company_employees) {
            const employee = data.company_employees[employeeId];
            totalWorkingStats += employee.effectiveness.working_stats;
        }

        console.log("Current total base efficiency:", totalWorkingStats);

        return Object.values(data.company_employees).map(e => ({
            Name: e.name,
            END: Number(e.endurance) || 0,
            INT: Number(e.intelligence) || 0,
            MAN: Number(e.manual_labor) || 0
        }));
    }

    // --- Fetch current company composition ---
    async function fetchCurrentComposition(apiKey) {
        const response = await fetch(`https://api.torn.com/company/?selections=employees&key=${apiKey}`);
        const data = await response.json();
        if (data.error) throw new Error(`API error: ${data.error}`);

        return Object.values(data.company_employees)
            .filter(e => e.position !== "Director")
            .map(e => e.position);
    }

    // --- Fetch top-rated companies for position compositions ---
    async function fetchTopCompanies(apiKey, companyType) {
        const response = await fetch(`https://api.torn.com/company/${companyType}?selections=companies&key=${apiKey}`);
        const data = await response.json();
        if (data.error) throw new Error(`API error: ${data.error}`);

        return Object.values(data.company).filter(c => c.rating === 10);
    }

    // --- Get position composition from a company ---
    async function fetchCompanyComposition(companyId, apiKey) {
        const response = await fetch(`https://api.torn.com/company/${companyId}?selections=employees&key=${apiKey}`);
        const data = await response.json();
        if (data.error) throw new Error(`API error: ${data.error}`);

        return Object.values(data.company_employees)
            .filter(e => e.position !== "Director")
            .map(e => e.position);
    }

    // --- Assign your employees to a given composition and compute total efficiency ---
    function assignToComposition(workers, composition, BUS2110) {
        const numPositions = composition.length;
        const numWorkers = workers.length;
        const size = Math.max(numWorkers, numPositions); // square matrix size
        const matrix = Array.from({ length: size }, () => Array(size).fill(0));

        for (let i = 0; i < numWorkers; i++) {
            for (let j = 0; j < numPositions; j++) {
                const posName = composition[j];
                if (positions[posName]) {
                    matrix[i][j] = getEfficiency(workers[i], positions[posName].required, BUS2110);
                }
            }
        }

        const { totalScore, assignment } = hungarian(matrix);

        const assigned = [];
        for (let i = 0; i < numWorkers; i++) {
            const posIndex = assignment[i];
            if (posIndex !== -1 && posIndex < numPositions) {
                assigned.push({
                    employee: workers[i],
                    position: composition[posIndex],
                    efficiency: matrix[i][posIndex]
                });
            }
        }

        const score = assigned.reduce((sum, a) => sum + a.efficiency, 0);
        return { score, assignment: assigned };
    }

    // --- Find best composition across top companies, including company name ---
    async function findBestAssignment(apiKey, BUS2110 = true, companyType, keepCurrentComposition = false) {
        const workers = await fetchMyEmployeesCustom(apiKey);
        let bestScore = -Infinity;
        let bestAssignment = null;
        let bestComposition = null;
        let bestCompanyName = null;

        if (keepCurrentComposition) {
            // Use current company composition
            const composition = await fetchCurrentComposition(apiKey);
            if (composition.length > 0) {
                const { score, assignment } = assignToComposition(workers, composition, BUS2110);
                bestScore = score;
                bestAssignment = assignment;
                bestComposition = composition;
                bestCompanyName = "Current Company";
            }
        } else {
            // Search top companies for best composition
            const topCompanies = await fetchTopCompanies(apiKey, companyType);
            for (const company of topCompanies) {
                const composition = await fetchCompanyComposition(company.ID, apiKey);
                if (!composition.length) continue;

                const { score, assignment } = assignToComposition(workers, composition, BUS2110);

                if (score > bestScore) {
                    bestScore = score;
                    bestAssignment = assignment;
                    bestComposition = composition;
                    bestCompanyName = company.name; // store company name
                }
            }
        }

        // Fallback composition if none found
        if (!bestComposition) {
            bestComposition = ["Bouncer", "Manager", "Promoter", "Bartender", "Bartender", "Bartender", "Bartender", "Bartender", "Waiter", "Waiter"];
            const { score, assignment } = assignToComposition(workers, bestComposition, BUS2110);
            bestScore = score;
            bestAssignment = assignment;
            bestCompanyName = "Default Fallback";
        }

        return { bestScore, bestAssignment, bestComposition, bestCompanyName };
    }

    // --- Set positions ---
    async function setPositions(company_type, apikey){
        const response = await fetch(`https://api.torn.com/torn/${company_type}?selections=companies&key=${apikey}`);
        const data = await response.json();

        const companyPositions = data.companies[company_type].positions;

        for (let posName in companyPositions) {
            let p = companyPositions[posName];
            positions[posName] = {
                required: {
                    MAN: p.man_required,
                    INT: p.int_required,
                    END: p.end_required
                },
                dailyGains: {
                    MAN: p.man_gain,
                    INT: p.int_gain,
                    END: p.end_gain
                },
                special: p.special_ability === "None" ? null : p.special_ability
            };
        }
    }

    (async () => {
        const BUS2110 = true;
        const company_type = 40;
        const keepCurrentComposition = true; // Set to true to keep current company composition
        await setPositions(company_type, API_KEY);

        try {
            const { bestScore, bestAssignment, bestComposition, bestCompanyName } = await findBestAssignment(API_KEY, BUS2110, company_type, keepCurrentComposition);
            console.log("Best total base efficiency:", bestScore);
            console.log("Best with max EE on all:", bestScore + (10*20) + (10*12));
            console.log("Based on composition from:", bestCompanyName);
            console.log("Composition:", bestComposition);
            console.table(bestAssignment.map(a => ({ Name: a.employee.Name, Position: a.position, Efficiency: a.efficiency })));

            // --- Future Efficiency Timeline Simulation ---
            console.log("\n--- Future Efficiency Timeline ---");
            let previousEfficiencies = bestAssignment.map(a => a.efficiency);
            let currentTotal = bestScore;
            let day = 0;
            let timeline = [];
            const max_days = 365;
            let no_increase_streak = 0;
            const max_streak = 365;

            while (day < max_days) {
                day++;
                let changes = [];
                let newTotal = 0;
                let hasIncrease = false;

                for (let i = 0; i < bestAssignment.length; i++) {
                    const ass = bestAssignment[i];
                    const worker = ass.employee;
                    const posName = ass.position;
                    const gains = positions[posName].dailyGains;

                    // Update stats
                    if (gains.MAN !== undefined) worker.MAN += gains.MAN;
                    if (gains.INT !== undefined) worker.INT += gains.INT;
                    if (gains.END !== undefined) worker.END += gains.END;

                    // Recalculate efficiency
                    const newEff = getEfficiency(worker, positions[posName].required, BUS2110);
                    const oldEff = previousEfficiencies[i];

                    if (newEff > oldEff) {
                        changes.push(`${worker.Name}: +${newEff - oldEff}`);
                        hasIncrease = true;
                    }

                    previousEfficiencies[i] = newEff;
                    newTotal += newEff;
                }

                const totalIncrease = newTotal - currentTotal;

                if (hasIncrease) {
                    timeline.push(`Day ${day}: Total +${totalIncrease} [${changes.join(', ')}] (new total: ${newTotal})`);
                    currentTotal = newTotal;
                    no_increase_streak = 0;
                } else {
                    no_increase_streak++;
                    if (no_increase_streak >= max_streak) {
                        if (day > 1) {
                            console.log(`No increases for ${max_streak} consecutive days, stopping simulation at day ${day}.`);
                        }
                        break;
                    }
                }
            }

            if (timeline.length > 0) {
                console.log("Timeline of efficiency increases:");
                timeline.forEach(line => console.log(line));
            } else {
                console.log("No future efficiency increases within the simulation period.");
            }

        } catch (err) {
            console.error("Error:", err);
        }
    })();
})();