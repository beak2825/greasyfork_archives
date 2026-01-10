// ==UserScript==
// @name         Bitcointalk 120-Day Merits Tracker (Dynamic Range)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Recupera e visualizza i merits ricevuti negli ultimi 120 giorni nel profilo Bitcointalk
// @author       Ace
// @match        https://bitcointalk.org/index.php?action=profile;u=*
// @grant        GM_xmlhttpRequest
// @connect      bitlist.co
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562160/Bitcointalk%20120-Day%20Merits%20Tracker%20%28Dynamic%20Range%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562160/Bitcointalk%20120-Day%20Merits%20Tracker%20%28Dynamic%20Range%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per calcolare la data di 120 giorni fa
    function getDate120DaysAgo() {
        const date = new Date();
        date.setDate(date.getDate() - 120);
        return date.toISOString().split('T')[0];
    }

    // Funzione per recuperare i merits dall'endpoint
    function fetchMerits(userUid, dateMin, dateMax) {
        const url = `https://bitlist.co/trpc/legacy.userMerits?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22userUid%22%3A${userUid}%2C%22dateMin%22%3A%22${dateMin}%22%2C%22dateMax%22%3A%22${dateMax}%22%2C%22page%22%3A1%7D%7D%7D`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const meritsData = data[0]?.result?.data?.json?.merits_received_per_day;
                        if (Array.isArray(meritsData)) {
                            resolve(meritsData);
                        } else {
                            console.error("Struttura dati inattesa per merits_received_per_day:", data);
                            reject("Struttura dati inattesa");
                        }
                    } catch (e) {
                        console.error("Errore nel parsing della risposta:", e, response.responseText);
                        reject("Errore nel parsing della risposta");
                    }
                },
                onerror: function(error) {
                    console.error("Errore nella richiesta:", error);
                    reject("Errore nella richiesta: " + error);
                }
            });
        });
    }

    // Funzione per filtrare i dati degli ultimi 120 giorni
    function filterLast120Days(meritsData) {
        const cutoffDate = new Date(getDate120DaysAgo());
        return meritsData.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= cutoffDate;
        });
    }

    // Funzione per calcolare la somma dei merits negli ultimi 120 giorni
    function calculateTotalMerits(meritsData) {
        const filteredData = filterLast120Days(meritsData);
        return filteredData.reduce((total, entry) => total + entry.sum, 0);
    }

    // Funzione per visualizzare i risultati nella pagina
    function displayMerits(totalMerits) {
        const meritRow = document.querySelector('td:first-child > b > a[href*="action=merit"]');
        if (meritRow) {
            const row = meritRow.closest('tr');
            if (row) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td><b>Merits (120 days):</b></td>
                    <td>${totalMerits}</td>
                `;
                row.after(newRow);
            }
        }
    }

    // Esecuzione principale
    async function main() {
        const userUid = window.location.search.match(/u=(\d+)/)[1];
        const dateMin = getDate120DaysAgo(); // Data minima dinamica (120 giorni fa)
        const dateMax = new Date().toISOString().split('T')[0]; // Data massima = oggi

        try {
            const meritsData = await fetchMerits(userUid, dateMin, dateMax);
            const totalMerits = calculateTotalMerits(meritsData);
            displayMerits(totalMerits);
        } catch (error) {
            console.error("Errore:", error);
        }
    }

    // Avvia lo script quando la pagina è caricata
    window.addEventListener('load', main);
})();
