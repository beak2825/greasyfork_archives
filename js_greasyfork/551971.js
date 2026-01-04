// ==UserScript==
// @name         E-Flux Maandoverzicht
// @namespace    https://greasyfork.org/nl/users/577673-kaj
// @version      1.3
// @description  Toont maandelijkse totalen van laadsessies op E-Flux en slaat voltooide sessies op in localStorage voor een overzicht van kosten en kWh.
// @author       Kaj
// @match        https://*.e-flux.io/*
// @match        https://e-flux.io/*
// @icon         https://www.e-flux.io/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551971/E-Flux%20Maandoverzicht.user.js
// @updateURL https://update.greasyfork.org/scripts/551971/E-Flux%20Maandoverzicht.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug functie
    function debug(message, data = null) {
        console.log('[E-Flux Maandoverzicht]', message, data);
    }

    // Functie om sessies op te slaan in localStorage
    function saveSessionToStorage(session) {
        try {
            let storedSessions = JSON.parse(localStorage.getItem('eFluxSessions') || '{}');
            if (!storedSessions[session.id]) {
                storedSessions[session.id] = {
                    id: session.id,
                    endDate: session.endDate.toISOString(),
                    totalAmount: session.totalAmount,
                    kwh: session.kwh,
                    status: session.status
                };
                localStorage.setItem('eFluxSessions', JSON.stringify(storedSessions));
                debug('Sessie opgeslagen:', session.id);
            } else {
                debug('Sessie al opgeslagen, overslaan:', session.id);
            }
            // Log het totaal aantal opgeslagen sessies
            debug('Totaal opgeslagen sessies:', Object.keys(storedSessions).length);
        } catch (e) {
            debug('Fout bij opslaan in localStorage:', e);
        }
    }

    // Functie om opgeslagen sessies op te halen
    function getStoredSessions() {
        try {
            const storedSessions = JSON.parse(localStorage.getItem('eFluxSessions') || '{}');
            const sessions = Object.values(storedSessions).map(session => ({
                id: session.id,
                endDate: new Date(session.endDate),
                totalAmount: parseFloat(session.totalAmount) || 0,
                kwh: parseFloat(session.kwh) || 0,
                status: session.status
            }));
            debug('Opgehaalde sessies uit localStorage:', sessions.length);
            return sessions;
        } catch (e) {
            debug('Fout bij ophalen uit localStorage:', e);
            return [];
        }
    }

    // Functie om oude sessies op te schonen (ouder dan 1 jaar)
    function cleanOldSessions() {
        try {
            let storedSessions = JSON.parse(localStorage.getItem('eFluxSessions') || '{}');
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            let removedCount = 0;

            for (const id in storedSessions) {
                const sessionDate = new Date(storedSessions[id].endDate);
                if (sessionDate < oneYearAgo) {
                    delete storedSessions[id];
                    removedCount++;
                }
            }

            if (removedCount > 0) {
                localStorage.setItem('eFluxSessions', JSON.stringify(storedSessions));
                debug(`Oude sessies verwijderd: ${removedCount}`);
            }
        } catch (e) {
            debug('Fout bij opschonen localStorage:', e);
        }
    }

    function parseSessionData() {
        debug('Parsing sessie data...');
        const rows = document.querySelectorAll('table.ui.celled.table tbody tr');
        const sessions = [];

        debug('Gevonden rijen:', rows.length);

        rows.forEach((row, index) => {
            try {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 7) {
                    const id = cells[0].textContent.trim();
                    const durationCell = cells[1];
                    const totalCell = cells[2].textContent.trim();
                    const kwhCell = cells[3].textContent.trim();
                    const statusCell = cells[4];
                    const status = statusCell.textContent.trim();

                    debug(`Rij ${index}:`, { id, totalCell, kwhCell, status });

                    // Parse de einddatum uit de duration cell
                    const dateInfo = durationCell.querySelector('div[style*="font-size: 10px"]');
                    if (dateInfo) {
                        const dateText = dateInfo.innerHTML;
                        const endDateMatch = dateText.match(/Einde:\s*(\d{1,2})\s*(\w{3})\s*(\d{4})/);

                        if (endDateMatch) {
                            const [, day, monthStr, year] = endDateMatch;
                            debug('Datum match:', { day, monthStr, year });

                            // Nederlandse maandafkortingen naar maandnummer
                            const monthMap = {
                                'jan': 0, 'feb': 1, 'mrt': 2, 'apr': 3, 'mei': 4, 'jun': 5,
                                'jul': 6, 'aug': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'dec': 11
                            };

                            const monthNum = monthMap[monthStr.toLowerCase()];
                            if (monthNum !== undefined) {
                                const endDate = new Date(parseInt(year), monthNum, parseInt(day));

                                // Parse totaal bedrag (verwijder € en spaties)
                                const totalAmount = parseFloat(totalCell.replace(/[€\s]/g, '').replace(',', '.')) || 0;

                                // Parse kWh
                                const kwh = parseFloat(kwhCell.replace(',', '.')) || 0;

                                const session = {
                                    id: id,
                                    endDate: endDate,
                                    totalAmount: totalAmount,
                                    kwh: kwh,
                                    status: status
                                };

                                sessions.push(session);

                                // Sla voltooide sessies op
                                if (status === 'Voltooid' && totalAmount > 0) {
                                    saveSessionToStorage(session);
                                }

                                debug(`Sessie toegevoegd:`, session);
                            } else {
                                debug(`Ongeldige maand in rij ${index}:`, monthStr);
                            }
                        } else {
                            debug(`Geen einddatum gevonden in rij ${index}`);
                        }
                    } else {
                        debug(`Geen datum-info gevonden in rij ${index}`);
                    }
                } else {
                    debug(`Onvoldoende cellen in rij ${index}:`, cells.length);
                }
            } catch (e) {
                debug(`Fout bij parsen van rij ${index}:`, e);
            }
        });

        // Combineer met opgeslagen sessies
        const storedSessions = getStoredSessions();
        const allSessions = [...sessions, ...storedSessions].reduce((acc, session) => {
            if (!acc.some(s => s.id === session.id)) {
                acc.push(session);
            } else {
                debug('Duplicaat sessie overgeslagen:', session.id);
            }
            return acc;
        }, []);

        debug('Totaal sessies (huidige pagina + opgeslagen):', allSessions.length);
        return allSessions;
    }

    function groupByMonth(sessions) {
        debug('Groeperen per maand...');
        const monthlyData = {};

        sessions.forEach(session => {
            try {
                if (session.status === 'Voltooid' && session.totalAmount > 0) {
                    const monthKey = `${session.endDate.getFullYear()}-${String(session.endDate.getMonth() + 1).padStart(2, '0')}`;

                    if (!monthlyData[monthKey]) {
                        monthlyData[monthKey] = {
                            totalAmount: 0,
                            totalKwh: 0,
                            sessionCount: 0,
                            month: session.endDate.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long' })
                        };
                    }

                    monthlyData[monthKey].totalAmount += session.totalAmount;
                    monthlyData[monthKey].totalKwh += session.kwh;
                    monthlyData[monthKey].sessionCount += 1;
                }
            } catch (e) {
                debug('Fout bij groeperen van sessie:', e);
            }
        });

        debug('Maandelijkse data:', monthlyData);
        return monthlyData;
    }

    function createMonthlyOverview() {
        debug('Creating monthly overview...');

        // Verwijder bestaand overzicht
        const existingOverview = document.getElementById('monthly-overview');
        if (existingOverview) {
            existingOverview.remove();
            debug('Bestaand overzicht verwijderd');
        }

        // Schoon oude sessies op
        cleanOldSessions();

        const sessions = parseSessionData();
        if (sessions.length === 0) {
            debug('Geen sessies gevonden, stoppen...');
            return;
        }

        const monthlyData = groupByMonth(sessions);
        const months = Object.keys(monthlyData).sort().reverse(); // Nieuwste eerst

        if (months.length === 0) {
            debug('Geen maandelijkse data, stoppen...');
            return;
        }

        // Bereken totalen
        let totalAmount = 0, totalKwh = 0, totalSessions = 0;
        try {
            totalAmount = Object.values(monthlyData).reduce((sum, data) => sum + data.totalAmount, 0);
            totalKwh = Object.values(monthlyData).reduce((sum, data) => sum + data.totalKwh, 0);
            totalSessions = Object.values(monthlyData).reduce((sum, data) => sum + data.sessionCount, 0);
        } catch (e) {
            debug('Fout bij berekenen totalen:', e);
        }
        const avgPricePerKwh = totalKwh > 0 ? (totalAmount / totalKwh) : 0;

        debug('Totalen berekend:', { totalAmount, totalKwh, totalSessions, avgPricePerKwh });

        // Maak het overzicht met E-Flux styling
        const overviewHTML = `
            <div id="monthly-overview" style="margin-bottom: 30px;">
                <div class="ui hidden divider"></div>

                <h2 class="ui header">Totaaloverzicht</h2>

                <div class="ui four column stackable grid" style="margin-bottom: 20px;">
                    <div class="column">
                        <div class="ui fluid card">
                            <div class="content" style="text-align: center; padding: 20px;">
                                <div class="header" style="font-size: 24px; color: #2185d0; margin-bottom: 5px;">€${totalAmount.toFixed(2)}</div>
                                <div class="meta">Totaal bedrag</div>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="ui fluid card">
                            <div class="content" style="text-align: center; padding: 20px;">
                                <div class="header" style="font-size: 24px; color: #00b5ad; margin-bottom: 5px;">${totalKwh.toFixed(1)}</div>
                                <div class="meta">kWh totaal</div>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="ui fluid card">
                            <div class="content" style="text-align: center; padding: 20px;">
                                <div class="header" style="font-size: 24px; color: #f2711c; margin-bottom: 5 classroompx;">${totalSessions}</div>
                                <div class="meta">Aantal sessies</div>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="ui fluid card">
                            <div class="content" style="text-align: center; padding: 20px;">
                                <div class="header" style="font-size: 24px; color: #a333c8; margin-bottom: 5px;">€${avgPricePerKwh.toFixed(3)}</div>
                                <div class="meta">Gemiddeld per kWh</div>
                            </div>
                        </div>
                    </div>
                </div>

                <table class="ui celled table">
                    <thead>
                        <tr>
                            <th class="four wide">Maand</th>
                            <th class="two wide">Bedrag</th>
                            <th class="two wide">kWh</th>
                            <th class="two wide">Sessies</th>
                            <th class="two wide">€/kWh</th>
                            <th class="four wide">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${months.map(monthKey => {
                            const data = monthlyData[monthKey];
                            const pricePerKwh = data.totalKwh > 0 ? (data.totalAmount / data.totalKwh) : 0;
                            const isCurrentMonth = new Date().getMonth() === new Date(monthKey + '-01').getMonth() &&
                                                 new Date().getFullYear() === new Date(monthKey + '-01').getFullYear();
                            return `
                                <tr ${isCurrentMonth ? 'style="background-color: #f8f9fa;"' : ''}>
                                    <td>
                                        <strong>${data.month}</strong>
                                        ${isCurrentMonth ? '<div class="ui mini blue label">Huidige maand</div>' : ''}
                                    </td>
                                    <td class="right aligned"><strong>€&nbsp;${data.totalAmount.toFixed(2)}</strong></td>
                                    <td class="right aligned">${data.totalKwh.toFixed(1)}</td>
                                    <td class="center aligned">
                                        <div class="ui small circular label">${data.sessionCount}</div>
                                    </td>
                                    <td class="right aligned">€${pricePerKwh.toFixed(3)}</td>
                                    <td class="center aligned">
                                        <div class="ui olive label">Voltooid</div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="positive">
                            <th><strong>Totaal</strong></th>
                            <th class="right aligned"><strong>€&nbsp;${totalAmount.toFixed(2)}</strong></th>
                            <th class="right aligned"><strong>${totalKwh.toFixed(1)}</strong></th>
                            <th class="center aligned"><strong>${totalSessions}</strong></th>
                            <th class="right aligned"><strong>€${avgPricePerKwh.toFixed(3)}</strong></th>
                            <th class="center aligned">
                                <div class="ui blue label">${months.length} ${months.length === 1 ? 'maand' : 'maanden'}</div>
                            </th>
                        </tr>
                    </tfoot>
                </table>

                <div class="ui message">
                    <div class="ui grid">
                        <div class="eight wide column">
                            <small><strong>Laatste update:</strong> ${new Date().toLocaleString('nl-NL')}</small>
                        </div>
                        <div class="eight wide right aligned column">
                            <small><strong>Geanalyseerd:</strong> ${sessions.length} sessies (inclusief opgeslagen)</small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Zoek de juiste plek om het in te voegen
        const container = document.querySelector('.ui.container');
        const existingTable = document.querySelector('table.ui.celled.table');

        if (container && existingTable) {
            try {
                existingTable.insertAdjacentHTML('beforebegin', overviewHTML);
                debug('Overzicht toegevoegd!');
            } catch (e) {
                debug('Fout bij toevoegen overzicht:', e);
            }
        } else {
            debug('Kon container of tabel niet vinden', { container: !!container, existingTable: !!existingTable });
        }
    }

    // Verbeterde detectie voor SPA's
    function checkForSessionsPage() {
        const isSessionsPage = window.location.href.includes('/sessions') &&
                              document.querySelector('.ui.pointing.secondary.stackable.menu .item.active[href*="sessions"]');
        if (isSessionsPage) {
            debug('Op sessies pagina, controleer tabel...');
            waitForTable();
        } else {
            debug('Niet op sessies pagina');
            const existingOverview = document.getElementById('monthly-overview');
            if (existingOverview) {
                existingOverview.remove();
                debug('Overzicht verwijderd (andere tab)');
            }
        }
    }

    // Wacht tot de pagina geladen is
    function waitForTable() {
        debug('Wachten op tabel...');
        const table = document.querySelector('table.ui.celled.table tbody');
        if (table && table.children.length > 0) {
            debug('Tabel gevonden met', table.children.length, 'rijen');
            createMonthlyOverview();
        } else {
            debug('Tabel nog niet geladen, probeer opnieuw...');
            setTimeout(waitForTable, 500);
        }
    }

    // Detecteer URL veranderingen (voor SPA navigation)
    let currentUrl = window.location.href;
    function detectUrlChange() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            debug('URL veranderd naar:', currentUrl);
            setTimeout(checkForSessionsPage, 1000);
        }
    }

    // Polling systeem voor SPA's
    function startPolling() {
        setInterval(() => {
            checkForSessionsPage();
        }, 3000);
        setInterval(detectUrlChange, 1000);
    }

    // Start het script
    debug('Script gestart voor SPA, start polling...');
    setTimeout(checkForSessionsPage, 2000);
    setTimeout(startPolling, 3000);
})();