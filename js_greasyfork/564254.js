// ==UserScript==
// @name Driver Ticket Generator
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Generate printable driver tickets directly on Amazon logistics page (Sesame Gate Console)
// @author @NOWARATN
// @match https://trans-logistics-eu.amazon.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/564254/Driver%20Ticket%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/564254/Driver%20Ticket%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createTicketButton() {
        const elements = document.querySelectorAll('.css-1tjbqgb');

        elements.forEach((element, index) => {
            // Sprawdź czy przycisk już istnieje
            if (element.querySelector('.ticket-generator-btn')) return;

            const ticketBtn = document.createElement('button');
            ticketBtn.className = 'ticket-generator-btn';
            ticketBtn.innerText = '🎫 Generuj bilet';
            ticketBtn.style.marginLeft = '10px';
            ticketBtn.style.padding = '8px 12px';
            ticketBtn.style.backgroundColor = '#28a745';
            ticketBtn.style.color = 'white';
            ticketBtn.style.border = 'none';
            ticketBtn.style.borderRadius = '4px';
            ticketBtn.style.cursor = 'pointer';
            ticketBtn.style.fontSize = '12px';

            ticketBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                generateTicket(index);
            });

            element.appendChild(ticketBtn);
        });
    }

    function extractVridData(element) {
        try {
            // Znajdź kontener z danymi VRID/ISA
            const loadIdContainer = element.querySelector('[data-testid="loadIdContainer"]') ||
                                   element.querySelector('.css-jjv6lf') ||
                                   element.querySelector('.css-t4qdd4');

            if (!loadIdContainer) {
                return '[No VRID]';
            }

            // Pobierz wszystkie linki i elementy z identyfikatorami
            const links = loadIdContainer.querySelectorAll('a[mdn-link]');
            const textElements = loadIdContainer.querySelectorAll('p[title*="ISA"], p[title*="VRID"]');

            let isaValue = '';
            let vridValue = '';

            // Sprawdź linki
            links.forEach(link => {
                const titleAttr = link.querySelector('p')?.getAttribute('title') || '';
                const textContent = link.querySelector('p')?.textContent?.trim() || '';

                if (titleAttr.includes('ISA') || textContent.includes('ISA')) {
                    isaValue = textContent.replace(/^ISA\s*/, '').trim();
                } else if (titleAttr.includes('VRID') || textContent.includes('VRID')) {
                    vridValue = textContent.replace(/^VRID\s*/, '').trim();
                }
            });

            // Sprawdź bezpośrednie elementy tekstowe jeśli linki nie dały rezultatu
            if (!isaValue && !vridValue) {
                textElements.forEach(elem => {
                    const title = elem.getAttribute('title') || '';
                    const text = elem.textContent?.trim() || '';

                    if (title.includes('ISA') || text.includes('ISA')) {
                        isaValue = text.replace(/^ISA\s*/, '').trim();
                    } else if (title.includes('VRID') || text.includes('VRID')) {
                        vridValue = text.replace(/^VRID\s*/, '').trim();
                    }
                });
            }

            // Sprawdź czy mamy oba identyfikatory
            if (isaValue && vridValue) {
                return `ISA ${isaValue}\nVRID ${vridValue}`;
            } else if (isaValue) {
                return `ISA ${isaValue}`;
            } else if (vridValue) {
                return `VRID ${vridValue}`;
            }

            // Fallback - pobierz cały tekst ale usuń "Scheduled"
            const allText = loadIdContainer.textContent || '';
            const cleanText = allText
                .replace(/Scheduled/gi, '')
                .replace(/\s+/g, ' ')
                .trim();

            return cleanText || '[No VRID]';

        } catch (error) {
            console.error('Error extracting VRID data:', error);
            return '[No VRID]';
        }
    }

    function generateTicket(elementIndex) {
        // Usuń istniejący bilet jeśli istnieje
        const existingTicket = document.getElementById('driver-ticket');
        if (existingTicket) existingTicket.remove();

        // Pobierz dane z elementów
        const locationInputs = document.querySelectorAll('input[id^="search-field-"]');
        const vridContainers = document.querySelectorAll('.css-1tjbqgb');

        const location = locationInputs[elementIndex]?.value.trim() || '[No Location]';
        const vrid = vridContainers[elementIndex] ? extractVridData(vridContainers[elementIndex]) : '[No VRID]';

        const selectOptions = [
            'Dock / Rampe',
            'Parking',
            'Drop-Off',
            'Pick-Up',
            'Drop-Off 1 x SB',
            'Drop-Off 2 x SB',
            'Pick-Up 1 x SB',
            'Pick-Up 2 x SB',
            'Trailer Service',
            'Bobtail / Solo Exit'
        ];

        const ticket = document.createElement('div');
        ticket.id = 'driver-ticket';
        ticket.style.position = 'fixed';
        ticket.style.top = '50px';
        ticket.style.right = '20px';
        ticket.style.width = '350px';
        ticket.style.backgroundColor = '#fff';
        ticket.style.border = '3px solid #000';
        ticket.style.borderRadius = '10px';
        ticket.style.padding = '20px';
        ticket.style.zIndex = '1500';
        ticket.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        ticket.style.fontFamily = 'Arial, sans-serif';
        ticket.style.fontSize = '16px';

        // Formatuj VRID dla wyświetlania (zamień \n na <br>)
        const vridForDisplay = vrid.replace(/\n/g, '<br>');

        ticket.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px; height: 80px; border: 2px solid #000; padding: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa;">
                <img src="https://drive.corp.amazon.com/view/nowaratn@/amazon-logo.png" alt="Amazon Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>

            <div style="text-align: center; margin-bottom: 15px; border: 2px solid #333; padding: 12px; border-radius: 8px; background-color: #f8f9fa;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">VRID</div>
                <div class="vrid-value" style="font-size: 18px; font-weight: bold; color: #000; line-height: 1.4;">${vridForDisplay}</div>
            </div>

            <div style="text-align: center; margin-bottom: 15px; border: 2px solid #333; padding: 12px; border-radius: 8px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 8px;">TYP AKCJI</div>
                <select id="action-type-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; text-align: center;">
                    ${selectOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
                </select>
            </div>

            <div style="text-align: center; margin-bottom: 15px; border: 2px solid #333; padding: 12px; border-radius: 8px; background-color: #f8f9fa;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">LOKALIZACJA</div>
                <div class="location-value" style="font-size: 18px; font-weight: bold; color: #000;">${location}</div>
            </div>

            <hr style="border: none; border-top: 3px solid #000; margin: 25px 0; opacity: 0.8;">

            <div style="text-align: center; margin-bottom: 15px; border: 2px solid #333; padding: 12px; border-radius: 8px; background-color: #f8f9fa;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">VRID</div>
                <div class="vrid-value2" style="font-size: 18px; font-weight: bold; color: #000; line-height: 1.4;">${vridForDisplay}</div>
            </div>

            <div style="text-align: center; margin-bottom: 15px; border: 2px solid #333; padding: 12px; border-radius: 8px;">
                <div style="font-size: 14px; color: #666; margin-bottom: 8px;">TYP AKCJI</div>
                <select id="dock-door-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; text-align: center;">
                    ${selectOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
                </select>
            </div>

            <div style="text-align: center; margin-bottom: 20px; border: 2px solid #333; padding: 12px; border-radius: 8px; background-color: #f8f9fa;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">LOKALIZACJA</div>
                <div class="location-value2" style="font-size: 18px; font-weight: bold; color: #000;">${location}</div>
            </div>

            <div style="text-align: center; margin-top: 20px; border-top: 2px solid #000; padding-top: 15px;">
                <button id="print-ticket" style="padding: 12px 24px; margin-right: 10px; background-color: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">🖨️ Wydrukuj bilet</button>
                <button id="close-ticket" style="padding: 12px 24px; background-color: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">❌ Zamknij</button>
            </div>
        `;

        document.body.appendChild(ticket);

        // Event listeners dla przycisków biletu
        document.getElementById('print-ticket').addEventListener('click', () => {
            printTicket();
        });

        document.getElementById('close-ticket').addEventListener('click', () => {
            ticket.remove();
        });
    }

    function printTicket() {
        const ticket = document.getElementById('driver-ticket');
        if (!ticket) return;

        const actionType = document.getElementById('action-type-select').value;
        const dockDoor = document.getElementById('dock-door-select').value;

        // Pobierz dane z biletu za pomocą klas (usuń HTML tags)
        const vridElement = ticket.querySelector('.vrid-value');
        const vrid = vridElement ? vridElement.textContent || vridElement.innerText : '[No VRID]';
        const location = ticket.querySelector('.location-value').textContent;

        // Stwórz okno do druku
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title></title>
                <style>
                    @page {
                        margin: 0;
                        size: A4 portrait;
                    }

                    @media print {
                        html {
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        body {
                            margin: 0 !important;
                            padding: 0 !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .no-print {
                            display: none !important;
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }

                    html, body {
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        background: white;
                    }

                    .print-container {
                        width: 100%;
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        padding-top: 250px;
                        box-sizing: border-box;
                        background: white;
                    }

                    .ticket {
                        width: 380px;
                        border: 4px solid #000;
                        border-radius: 12px;
                        padding: 35px;
                        background: white;
                        box-shadow: none;
                        page-break-inside: avoid;
                    }

                    .ticket-header {
                        text-align: center;
                        margin-bottom: 30px;
                        height: 100px;
                        border: 3px solid #000;
                        padding: 15px;
                        border-radius: 10px;
                        background-color: #f8f9fa;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .ticket-logo {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                    }

                    .ticket-field {
                        text-align: center;
                        margin-bottom: 20px;
                        border: 3px solid #333;
                        padding: 20px;
                        border-radius: 10px;
                        background-color: #f8f9fa;
                        min-height: 25px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .ticket-field-value {
                        font-size: 26px;
                        font-weight: bold;
                        color: #000;
                        line-height: 1.3;
                        word-break: break-word;
                        white-space: pre-line;
                    }

                    .separator {
                        border: none;
                        border-top: 4px solid #000;
                        margin: 30px 0;
                        opacity: 0.8;
                    }

                    /* Zwiększone marginesy dla druku */
                    @media print {
                        .print-container {
                            padding-top: 100px;
                            height: auto;
                            min-height: 100vh;
                            padding-bottom: 50px;
                        }

                        .ticket {
                            page-break-inside: avoid;
                            margin-bottom: 0;
                        }

                        .ticket-field:last-of-type {
                            margin-bottom: 0;
                        }

                        .ticket-field-value {
                            font-size: 30px;
                        }

                        .separator {
                            border-top: 5px solid #000;
                            margin: 35px 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-container">
                    <div class="ticket">
                        <div class="ticket-header">
                            <img src="https://drive.corp.amazon.com/view/nowaratn@/amazon-logo.png" alt="Amazon Logo" class="ticket-logo">
                        </div>

                        <div class="ticket-field">
                            <div class="ticket-field-value">${vrid}</div>
                        </div>

                        <div class="ticket-field">
                            <div class="ticket-field-value">${actionType}</div>
                        </div>

                        <div class="ticket-field">
                            <div class="ticket-field-value">${location}</div>
                        </div>

                        <hr class="separator">

                        <div class="ticket-field">
                            <div class="ticket-field-value">${vrid}</div>
                        </div>

                        <div class="ticket-field">
                            <div class="ticket-field-value">${dockDoor}</div>
                        </div>

                        <div class="ticket-field">
                            <div class="ticket-field-value">${location}</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();

        // Poczekaj na załadowanie i wydrukuj
        printWindow.onload = function() {
            printWindow.focus();

            // Dodatkowe style do usunięcia nagłówków/stopek
            const additionalCSS = printWindow.document.createElement('style');
            additionalCSS.innerHTML = `
                @page {
                    margin: 0 !important;
                }
                @media print {
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        overflow: visible;
                    }
                }
            `;
            printWindow.document.head.appendChild(additionalCSS);

            // Opcjonalnie: automatyczne drukowanie po 500ms
            setTimeout(() => {
                printWindow.print();
                // Zamknij okno po wydrukowaniu (opcjonalne)
                setTimeout(() => {
                    printWindow.close();
                }, 1000);
            }, 500);
        };
    }

    function checkElements() {
        createTicketButton();
    }

    window.addEventListener('load', () => {
        console.log("Driver Ticket Generator loaded");
        setTimeout(() => {
            setInterval(checkElements, 500);
        }, 2000);
    });

})();
