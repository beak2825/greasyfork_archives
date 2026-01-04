// ==UserScript==
// @name         Lokacje do zamknięcia
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Tworzy kompaktową tabelę lokacji do zamknięcia
// @author       @nowaratn
// @match        https://sort-eu.aka.amazon.com/foresight/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558126/Lokacje%20do%20zamkni%C4%99cia.user.js
// @updateURL https://update.greasyfork.org/scripts/558126/Lokacje%20do%20zamkni%C4%99cia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Ustaw datę testową
    const TEST_MODE = false;
    const TEST_DATE = new Date('2025-12-08T07:00:00');

    function getCurrentDate() {
        return TEST_MODE ? TEST_DATE : new Date();
    }

    function formatTime(timestamp) {
        if (timestamp === 0 || !timestamp) return "N/A";

        const date = new Date(timestamp);

        // Sprawdź czy data jest poprawna
        if (isNaN(date.getTime())) {
            console.error('Invalid timestamp:', timestamp);
            return "N/A";
        }

        return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    }

    function isWithinShift(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const time = hours * 60 + minutes;

        const now = getCurrentDate();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHours * 60 + currentMinutes;

        // Zmiana dzienna (07:00 - 17:30)
        if (currentTime >= 7 * 60 && currentTime < 17 * 60 + 30) {
            return time >= 7 * 60 && time < 17 * 60 + 30;
        }
        // Zmiana nocna (18:30 - 05:00 następnego dnia)
        else {
            // Jeśli czas jest przed północą
            if (time >= 18 * 60 + 30) {
                return true;
            }
            // Jeśli czas jest po północy
            if (time < 5 * 60) {
                return true;
            }
            return false;
        }
    }



    function extractDirection(stackingFilter) {
        if (!stackingFilter) return "N/A";
        const parts = stackingFilter.split('-');
        if (parts.length >= 2) {
            return parts[0] + '-' + parts[1];
        }
        return stackingFilter;
    }

    function categorizeLocation(location) {
        if (location.includes('BOX-B')) return 'Manualna Sortacja';
        const number = parseInt(location.match(/\d+/)[0]);
        if (number >= 100 && number <= 150) return 'Manualna Sortacja';
        if (number >= 150 && number <= 299) return 'Flat Bramy';
        if (number >= 300 && number <= 400) return 'Flat TSO';
        return 'Bagowa Sortacja';
    }

    function createTableForCategory(category, timeGroups) {
        const tableContainer = document.createElement('div');
        tableContainer.style.flex = '0 0 auto';

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '12px';
        table.style.width = 'auto';

        // Nagłówki
        const header = table.createTHead();
        const headerRow = header.insertRow();
        const headers = ['', 'CPT', 'Lokacja', 'Kierunek'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.style.border = '1px solid black';
            th.style.padding = '4px';
            th.style.backgroundColor = '#e0e0e0';
            th.textContent = text;
            headerRow.appendChild(th);
        });

        // Zawartość tabeli
        timeGroups.forEach((timeGroup, timeIndex) => {
            timeGroup.locations.forEach((loc, locIndex) => {
                const row = table.insertRow();

                // Dodaj komórkę kategorii tylko dla pierwszej lokacji
                if (timeIndex === 0 && locIndex === 0) {
                    const categoryCell = row.insertCell();
                    categoryCell.style.border = '1px solid black';
                    categoryCell.style.padding = '4px';
                    categoryCell.style.backgroundColor = '#f0f0f0';
                    categoryCell.style.writingMode = 'vertical-lr'; // zmiana z 'vertical-rl' na 'vertical-lr'
                    categoryCell.style.textOrientation = 'upleft'; // zmiana z 'mixed' na 'upright'
                    categoryCell.style.transform = 'rotate(180deg)'; // obrót o 180 stopni
                    categoryCell.style.whiteSpace = 'nowrap'; // zapobiega łamaniu tekstu
                    categoryCell.style.height = '100%'; // zapewnia pełną wysokość
                    categoryCell.textContent = category;
                    const totalLocationsInCategory = timeGroups.reduce(
                        (sum, group) => sum + group.locations.length, 0
                    );
                    categoryCell.rowSpan = totalLocationsInCategory;
                }


                // Dodaj komórkę CPT tylko dla pierwszej lokacji w grupie czasowej
                if (locIndex === 0) {
                    const timeCell = row.insertCell();
                    timeCell.style.border = '1px solid black';
                    timeCell.style.padding = '4px';
                    timeCell.textContent = timeGroup.closeTime;
                    timeCell.rowSpan = timeGroup.locations.length;
                }

                // Dodaj komórki lokacji i kierunku
                const nameCell = row.insertCell();
                nameCell.style.border = '1px solid black';
                nameCell.style.padding = '4px';
                nameCell.textContent = loc.name;

                const directionCell = row.insertCell();
                directionCell.style.border = '1px solid black';
                directionCell.style.padding = '4px';
                directionCell.textContent = loc.direction;
            });
        });

        tableContainer.appendChild(table);
        return tableContainer;
    }

    function createPrintButton() {
        const printButton = document.createElement('button');
        printButton.textContent = 'Drukuj tabele';
        printButton.style.position = 'fixed';
        printButton.style.top = '10%';
        printButton.style.right = '10%';
        printButton.style.marginRight = '12%'; // Odstęp od drugiego przycisku
        printButton.style.zIndex = '9999';
        printButton.style.padding = '10px 20px';
        printButton.style.fontSize = '14px';
        printButton.style.fontWeight = 'bold';
        printButton.style.backgroundColor = '#4CAF50';
        printButton.style.color = 'white';
        printButton.style.border = 'none';
        printButton.style.borderRadius = '5px';
        printButton.style.cursor = 'pointer';
        printButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // Efekt hover
        printButton.onmouseover = function() {
            this.style.backgroundColor = '#45a049';
        };
        printButton.onmouseout = function() {
            this.style.backgroundColor = '#4CAF50';
        };

        printButton.onclick = function() {
            const tablesContainer = document.getElementById('locations-table-container');
            if (tablesContainer) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write('<html><head><title>Lokacje do zamknięcia</title>');
                printWindow.document.write('<style>');
                printWindow.document.write(`
                    table { border-collapse: collapse; font-size: 12px; margin: 10px; }
                    th, td { border: 1px solid black; padding: 4px; }
                    th { background-color: #e0e0e0; }
                    .category-cell { background-color: #f0f0f0; }
                    @media print {
                        table { page-break-inside: avoid; }
                        div { display: inline-block; vertical-align: top; }
                    }
                `);
                printWindow.document.write('</style></head><body>');
                printWindow.document.write(tablesContainer.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        };

        return printButton;
    }

    async function createLocationTable() {
        try {
            const response = await fetch("https://sort-eu.aka.amazon.com/graphql", {
                credentials: "include",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/json",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=4"
                },
                referrer: "https://sort-eu.aka.amazon.com/foresight/KTW1/KTW1-ShippingSorter",
                body: "{\"query\":\"query getFacilityProjections($nodeId: String!) {\\n  facilityProjections(nodeId: $nodeId) {\\n    destinations {\\n      edges {\\n        vertex {\\n          destinations {\\n            edges {\\n              vertex {\\n                destinations {\\n                  edges {\\n                    vertex {\\n                      type\\n                      name\\n                      criticalPullTime\\n                      stackingFilter\\n                    }\\n                  }\\n                }\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  }\\n}\",\"variables\":{\"nodeId\":\"KTW1\"}}",
                method: "POST",
                mode: "cors"
            });

            const data = await response.json();

            const locations = [];
            const edges = data.data.facilityProjections.destinations.edges;

            edges.forEach(edge => {
                edge.vertex.destinations.edges.forEach(subEdge => {
                    subEdge.vertex.destinations.edges.forEach(finalEdge => {
                        const loc = finalEdge.vertex;
                        if (loc.type === "STACKING_AREA") {
                            const direction = extractDirection(loc.stackingFilter);

                            // Znajdź wszystkie wystąpienia tej samej lokacji
                            const sameLocationInstances = [];
                            const now = getCurrentDate();
                            const tomorrow = new Date(now);
                            tomorrow.setDate(tomorrow.getDate() + 1);

                            // Ustaw zakres dat dla aktualnej zmiany
                            let startDate = new Date(now);
                            let endDate = new Date(now);

                            const currentHours = now.getHours();
                            const currentMinutes = now.getMinutes();
                            const currentTime = currentHours * 60 + currentMinutes;

                            if (currentTime >= 7 * 60 && currentTime < 17 * 60 + 30) {
                                // Zmiana dzienna - tylko dzisiejszy dzień
                                startDate.setHours(7, 0, 0, 0);
                                endDate.setHours(17, 30, 0, 0);
                            } else {
                                // Zmiana nocna - dzisiaj od 18:30 do jutra 5:00
                                if (currentTime >= 18 * 60 + 30) {
                                    startDate.setHours(18, 30, 0, 0);
                                    endDate = tomorrow;
                                    endDate.setHours(5, 0, 0, 0);
                                } else {
                                    startDate.setDate(startDate.getDate() - 1);
                                    startDate.setHours(18, 30, 0, 0);
                                    endDate.setHours(5, 0, 0, 0);
                                }
                            }

                            edges.forEach(e => {
                                e.vertex.destinations.edges.forEach(se => {
                                    se.vertex.destinations.edges.forEach(fe => {
                                        const otherLoc = fe.vertex;
                                        if (otherLoc.type === "STACKING_AREA" &&
                                            otherLoc.name === loc.name &&
                                            otherLoc.criticalPullTime > 0) {

                                            const date = new Date(otherLoc.criticalPullTime);
                                            // Sprawdź czy data mieści się w zakresie dla aktualnej zmiany
                                            if (date >= startDate && date <= endDate) {
                                                sameLocationInstances.push(otherLoc);
                                            }
                                        }
                                    });
                                });
                            });

                            // Znajdź najbliższy CPT w zakresie czasowym dla danej zmiany
                            let nearestValidCPT = null;
                            let smallestTimeDiff = Infinity;
                            sameLocationInstances.forEach(instance => {
                                const date = new Date(instance.criticalPullTime);
                                if (date >= startDate && date <= endDate) {
                                    const timeDiff = Math.abs(date - now);
                                    if (timeDiff < smallestTimeDiff) {
                                        smallestTimeDiff = timeDiff;
                                        nearestValidCPT = instance.criticalPullTime;
                                    }
                                }
                            });

                            // Debug log
                            if (loc.name === 'BOX-B-001-J') {
                                console.log('Current shift range:', startDate, 'to', endDate);
                                console.log('Location instances:', sameLocationInstances.map(i => ({
                                    cpt: new Date(i.criticalPullTime),
                                    formatted: formatTime(i.criticalPullTime)
                                })));
                                console.log('Selected CPT:', nearestValidCPT ? new Date(nearestValidCPT) : 'None',
                                            nearestValidCPT ? formatTime(nearestValidCPT) : 'None');
                            }

                            // Kontynuuj tylko jeśli znaleziono poprawny CPT
                            if (nearestValidCPT) {
                                const closeTime = formatTime(nearestValidCPT);

                                if (direction !== "N/A" && closeTime !== "N/A" && loc.stackingFilter) {
                                    const existingLocation = locations.find(l => l.name === loc.name);
                                    if (!existingLocation) {
                                        locations.push({
                                            name: loc.name,
                                            category: categorizeLocation(loc.name),
                                            direction: direction,
                                            closeTime: closeTime,
                                            rawCloseTime: nearestValidCPT
                                        });
                                    }
                                }
                            }
                        }
                    });
                });
            });


            // Grupowanie lokacji najpierw według kategorii
            const categoryGroups = {};
            locations.forEach(loc => {
                if (!categoryGroups[loc.category]) {
                    categoryGroups[loc.category] = [];
                }
                categoryGroups[loc.category].push(loc);
            });

            // Dla każdej kategorii, grupowanie według CPT
            const finalGroups = {};
            Object.entries(categoryGroups).forEach(([category, locs]) => {
                finalGroups[category] = {};
                locs.forEach(loc => {
                    const key = loc.closeTime;
                    if (!finalGroups[category][key]) {
                        finalGroups[category][key] = {
                            closeTime: loc.closeTime,
                            rawCloseTime: loc.rawCloseTime,
                            locations: []
                        };
                    }
                    finalGroups[category][key].locations.push({
                        name: loc.name,
                        direction: loc.direction
                    });
                });
            });

            // Tworzenie kontenera dla wszystkich tabel
            const mainContainer = document.createElement('div');
            mainContainer.style.padding = '20px';
            mainContainer.style.display = 'flex';
            mainContainer.style.flexWrap = 'wrap';
            mainContainer.style.gap = '20px';
            mainContainer.id = 'locations-table-container';

            // Kolejność kategorii
            const categoryOrder = ['Flat Bramy', 'Flat TSO', 'Manualna Sortacja', 'Bagowa Sortacja'];

            // Tworzenie osobnych tabel dla każdej kategorii
            categoryOrder.forEach(category => {
                if (finalGroups[category]) {
                    const timeGroups = Object.values(finalGroups[category]);

                    // Sortowanie grup czasowych
                    timeGroups.sort((a, b) => a.rawCloseTime - b.rawCloseTime);

                    // Sortowanie lokacji w każdej grupie
                    timeGroups.forEach(timeGroup => {
                        timeGroup.locations.sort((a, b) => {
                            // Funkcja do wyciągania numeru z końca lokacji
                            const getLocationNumber = (name) => {
                                if (name.startsWith('FST') || name.startsWith('FLAT')) {
                                    const match = name.match(/[A-Z-]*(\d+)/);
                                    return match ? parseInt(match[1]) : 0;
                                }
                                return null;
                            };

                            // Sprawdź czy lokacje są typu FST lub FLAT
                            const aNum = getLocationNumber(a.name);
                            const bNum = getLocationNumber(b.name);

                            // Jeśli obie są FST lub FLAT, sortuj po numerze
                            if (aNum !== null && bNum !== null) {
                                // Jeśli numery są różne, sortuj po nich
                                if (aNum !== bNum) {
                                    return aNum - bNum;
                                }
                                // Jeśli numery są takie same, sortuj alfabetycznie
                                return a.name.localeCompare(b.name);
                            }

                            // Jeśli tylko jedna jest FST/FLAT lub żadna nie jest, użyj standardowego sortowania
                            return a.name.localeCompare(b.name);
                        });
                    });

                    // Tworzenie tabeli dla kategorii
                    if (timeGroups.length > 0) {
                        const table = createTableForCategory(category, timeGroups);
                        mainContainer.appendChild(table);
                    }

                }
            });

            // Usunięcie poprzedniego kontenera, jeśli istnieje
            const existingContainer = document.getElementById('locations-table-container');
            if (existingContainer) {
                existingContainer.remove();
            }

            document.body.insertBefore(mainContainer, document.body.firstChild);
            document.body.appendChild(createPrintButton());

        } catch (error) {
            console.error('Błąd:', error);
        }
    }

    // Dodanie przycisków
    // Modyfikacja głównego przycisku
    const button = document.createElement('button');
    button.textContent = 'Pokaż lokacje do zamknięcia';
    button.style.position = 'fixed';
    button.style.top = '10%';
    button.style.right = '10%';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.fontSize = '14px';
    button.style.fontWeight = 'bold';
    button.style.backgroundColor = '#2196F3';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    // Efekt hover dla głównego przycisku
    button.onmouseover = function() {
        this.style.backgroundColor = '#1976D2';
    };
    button.onmouseout = function() {
        this.style.backgroundColor = '#2196F3';
    };

    button.onclick = createLocationTable;
    document.body.appendChild(button);

})();
