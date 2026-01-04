// ==UserScript==
// @name         Strava - Wyświetlenie i export pełnej listy osób obserwujących na Strava
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Poprawiono błąd obcinania pliku przez znak '#'. Używa średnika i jest w pełni kompatybilna z Excelem i nietypowymi danymi.
// @author       JOUKI & AI Assistant
// @match        https://www.strava.com/athletes/*/follow*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552884/Strava%20-%20Wy%C5%9Bwietlenie%20i%20export%20pe%C5%82nej%20listy%20os%C3%B3b%20obserwuj%C4%85cych%20na%20Strava.user.js
// @updateURL https://update.greasyfork.org/scripts/552884/Strava%20-%20Wy%C5%9Bwietlenie%20i%20export%20pe%C5%82nej%20listy%20os%C3%B3b%20obserwuj%C4%85cych%20na%20Strava.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOAD_DELAY_MS = 3000;
    let intersectionObserver;
    let allAthletesData = [];
    let processedUrls = new Set();

    function createExportButton() {
        if (document.getElementById('export-csv-button')) return;

        const container = document.querySelector('.tab-content');
        if (container) {
            const button = document.createElement('button');
            button.innerText = 'Eksportuj 0 użytkowników do CSV';
            button.id = 'export-csv-button';
            button.className = 'btn btn-primary';
            button.style.display = 'block';
            button.style.width = '100%';
            button.style.marginBottom = '20px';
            button.style.padding = '10px';
            button.style.fontSize = '16px';

            button.onclick = function() {
                exportToCsv();
            };
            container.prepend(button);
        } else {
            console.error("Skrypt nie mógł znaleźć kontenera '.tab-content' do umieszczenia przycisku.");
        }
    }

    function exportToCsv() {
        if (allAthletesData.length === 0) {
            alert('Lista jest pusta lub dane nie zostały jeszcze zebrane.');
            return;
        }

        let csvContent = "\uFEFF";
        csvContent += "Nazwa Użytkownika;Link do Profilu\n"; // Używamy średnika

        allAthletesData.forEach(athlete => {
            const name = `"${athlete.name.replace(/"/g, '""')}"`;
            const profileLink = `"${athlete.profileLink}"`;
            csvContent += [name, profileLink].join(';') + '\n';
        });

        // --- KLUCZOWA ZMIANA TUTAJ ---
        // Używamy encodeURIComponent, aby poprawnie zakodować znaki specjalne, takie jak '#'
        const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
        // --------------------------

        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);

        const today = new Date().toISOString().slice(0, 10);
        const filename = `strava_followers_uproszczony_${today}.csv`;
        link.setAttribute('download', filename);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function collectDataFromElements(elements) {
        const exportButton = document.getElementById('export-csv-button');
        elements.forEach(li => {
            const nameElement = li.querySelector('.text-callout a');
            const profileLink = nameElement ? `https://www.strava.com${nameElement.getAttribute('href')}` : null;

            if (!profileLink || processedUrls.has(profileLink)) {
                return;
            }
            processedUrls.add(profileLink);

            const name = nameElement ? nameElement.innerText : 'Brak danych';
            allAthletesData.push({ name, profileLink });
        });

        if (exportButton) {
            exportButton.innerText = `Eksportuj ${allAthletesData.length} użytkowników do CSV`;
        }
    }

    async function loadNextPage() {
        const paginationElement = document.querySelector('.pagination');
        const nextPageLink = paginationElement ? paginationElement.querySelector('a[rel="next"]') : null;

        if (!nextPageLink) {
            if (intersectionObserver) intersectionObserver.disconnect();
            if (paginationElement) paginationElement.innerHTML = '<div style="text-align: center; padding: 20px; font-weight: bold;">Wszyscy użytkownicy załadowani.</div>';
            return;
        }

        const url = nextPageLink.href;
        if (paginationElement) paginationElement.innerHTML = `<div style="text-align: center; padding: 20px; font-weight: bold;">Ładowanie kolejnych (pauza ${LOAD_DELAY_MS / 1000}s)...</div>`;

        try {
            await new Promise(resolve => setTimeout(resolve, LOAD_DELAY_MS));
            const response = await fetch(url);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const newAthletes = doc.querySelectorAll('.following.list-athletes > li');
            const currentAthleteList = document.querySelector('.following.list-athletes');

            if (newAthletes.length > 0 && currentAthleteList) {
                collectDataFromElements(newAthletes);
                newAthletes.forEach(athlete => currentAthleteList.appendChild(athlete));
            }

            const newPagination = doc.querySelector('.pagination');
            if (paginationElement && newPagination) {
                paginationElement.parentNode.replaceChild(newPagination, paginationElement);
                setupObserver(newPagination);
            } else if (paginationElement) {
                paginationElement.remove();
                if (intersectionObserver) intersectionObserver.disconnect();
            }
        } catch (error) {
            console.error('Błąd podczas ładowania następnej strony:', error);
            const currentPagination = document.querySelector('.pagination');
            if (currentPagination) currentPagination.innerHTML = '<div style="text-align: center; padding: 20px; color: red; font-weight: bold;">Wystąpił błąd.</div>';
        }
    }

    function setupObserver(element) {
        if (intersectionObserver) intersectionObserver.disconnect();
        intersectionObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                intersectionObserver.unobserve(entries[0].target);
                loadNextPage();
            }
        }, { threshold: 0.5 });
        intersectionObserver.observe(element);
    }

    const initialLoadObserver = new MutationObserver((mutations, obs) => {
        const mainContainer = document.querySelector('.tab-content');
        if (mainContainer) {
            createExportButton();
            collectDataFromElements(document.querySelectorAll('.following.list-athletes > li'));
            const pagination = document.querySelector('.pagination');
            if (pagination) {
                setupObserver(pagination);
            }
            obs.disconnect();
        }
    });

    initialLoadObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

})();