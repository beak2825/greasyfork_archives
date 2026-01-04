// ==UserScript==
// @name         LSS Massen-Personalwerber & Zielsetzer
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Setzt Personal-Soll auf 400, startet/erneuert die 3-tägige Werbung und zeigt den Status farblich an.
// @author       ED
// @license      BSD 3
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550336/LSS%20Massen-Personalwerber%20%20Zielsetzer.user.js
// @updateURL https://update.greasyfork.org/scripts/550336/LSS%20Massen-Personalwerber%20%20Zielsetzer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nonPersonnelBuildingTypes = [1, 3, 7, 10, 14, 16, 27];

    /**
     * Prüft den Zustand aller Gebäude und passt die Farbe des Buttons an.
     */
    async function checkStateAndSetButtonColor() {
        const actionButton = document.getElementById('gemini-mass-action-btn');
        if (!actionButton) return;

        try {
            const response = await fetch('https://www.leitstellenspiel.de/api/buildings');
            if (!response.ok) throw new Error('API nicht erreichbar');
            const buildings = await response.json();

            const needsTargetUpdate = buildings.some(b =>
                b.personal_count_target !== 400 &&
                !nonPersonnelBuildingTypes.includes(b.building_type)
            );

            // GEÄNDERT: Auch hier wird jetzt der Gebäudetyp geprüft!
            const needsHiringUpdate = buildings.some(b =>
                b.personal_count < b.personal_count_target &&
                b.hiring_phase < 3 &&
                !nonPersonnelBuildingTypes.includes(b.building_type)
            );

            actionButton.classList.remove('btn-primary', 'btn-success', 'btn-danger');

            if (needsTargetUpdate || needsHiringUpdate) {
                actionButton.classList.add('btn-danger');
            } else {
                actionButton.classList.add('btn-success');
            }
        } catch (error) {
            console.error('Fehler bei der Hintergrundprüfung des Button-Status:', error);
            actionButton.classList.remove('btn-success', 'btn-danger');
            actionButton.classList.add('btn-primary');
        }
    }

    /**
     * Hauptfunktion, die bei Klick ausgeführt wird.
     */
    async function startMassActions() {
        const actionButton = document.getElementById('gemini-mass-action-btn');
        if (!actionButton) return;

        actionButton.disabled = true;
        actionButton.textContent = 'Prüfe Gebäude...';

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            if (!csrfToken) throw new Error('CSRF-Token nicht gefunden.');

            const response = await fetch('https://www.leitstellenspiel.de/api/buildings');
            if (!response.ok) throw new Error(`API-Fehler: Status ${response.status}`);
            const buildings = await response.json();

            const buildingsToUpdateTarget = buildings.filter(b =>
                b.personal_count_target !== 400 &&
                !nonPersonnelBuildingTypes.includes(b.building_type)
            );

            // GEÄNDERT: Auch hier wird jetzt der Gebäudetyp geprüft!
            const buildingsToHireIn = buildings.filter(b =>
                b.hiring_phase < 3 &&
                b.personal_count < b.personal_count_target &&
                !nonPersonnelBuildingTypes.includes(b.building_type)
            );

            if (buildingsToHireIn.length === 0 && buildingsToUpdateTarget.length === 0) {
                 alert('Alles ist bereits auf dem neuesten Stand!');
                 return;
            }

            let updatedTargetCount = 0;
            if (buildingsToUpdateTarget.length > 0) {
                actionButton.textContent = `Setze ${buildingsToUpdateTarget.length} Ziele...`;
                const updatePromises = buildingsToUpdateTarget.map(building => {
                    const updateUrl = `/buildings/${building.id}`;
                    const formData = new URLSearchParams({ '_method': 'patch', 'building[personal_count_target]': '400' });
                    return fetch(updateUrl, {
                        method: 'POST',
                        headers: { 'X-CSRF-Token': csrfToken, 'X-Requested-With': 'XMLHttpRequest' },
                        body: formData
                    });
                });
                const updateResults = await Promise.allSettled(updatePromises);
                updatedTargetCount = updateResults.filter(res => res.status === 'fulfilled' && res.value.ok).length;
            }

            let successfulHires = 0;
            if(buildingsToHireIn.length > 0){
                actionButton.textContent = `Werbe für ${buildingsToHireIn.length}...`;
                const hirePromises = buildingsToHireIn.map(building => fetch(`/buildings/${building.id}/hire_do/3`));
                const hireResults = await Promise.allSettled(hirePromises);
                successfulHires = hireResults.filter(res => res.status === 'fulfilled' && res.value.ok).length;
            }

            let finalMessage = "Aktionen abgeschlossen!\n\n";
            if (updatedTargetCount > 0) finalMessage += `Personalziel für ${updatedTargetCount} Gebäude aktualisiert.\n`;
            if (successfulHires > 0) finalMessage += `3-Tage-Werbung für ${successfulHires} Gebäude gestartet/erneuert.`;

            if (updatedTargetCount > 0 || successfulHires > 0) {
                alert(finalMessage.trim());
            }

        } catch (error) {
            console.error('Ein Fehler ist bei der Massen-Aktion aufgetreten:', error);
            alert('Es ist ein Fehler aufgetreten. Bitte prüfe die Entwicklerkonsole (F12) für mehr Details.');
        } finally {
            actionButton.disabled = false;
            actionButton.textContent = 'Alle Werben/Ziele';
            checkStateAndSetButtonColor();
        }
    }

    function createUI() {
        const logoLink = document.querySelector('a.navbar-brand');
        if (logoLink && logoLink.parentElement) {
            const actionButton = document.createElement('button');
            actionButton.id = 'gemini-mass-action-btn';
            actionButton.textContent = 'Alle Werben/Ziele';
            actionButton.title = 'Personalziel auf 400 setzen & 3-Tage-Werbung für alle unterbesetzten Wachen starten/erneuern';
            actionButton.className = 'btn btn-primary btn-sm';
            actionButton.style.margin = '8px 10px 0 15px';
            actionButton.style.float = 'left';
            actionButton.addEventListener('click', startMassActions);
            logoLink.parentElement.insertBefore(actionButton, logoLink);
            checkStateAndSetButtonColor();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();