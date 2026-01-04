// ==UserScript==
// @name         MyFitnessPal Exercise Duplicate Remover
// @namespace    http://tampermonkey.net/
// @version      2025-11-15
// @author       Rolodor
// @description  Finds duplicate exercises by name/time, keeps the one with lowest kcal, asks for confirmation, removes others, and recursively checks previous days.
// @match        https://www.myfitnesspal.com/exercise/diary*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myfitnesspal.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552067/MyFitnessPal%20Exercise%20Duplicate%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/552067/MyFitnessPal%20Exercise%20Duplicate%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Fetches the edit page for a single exercise entry to get its precise start time.
     * @param {HTMLElement} row - The table row element of the exercise.
     * @returns {Promise<Object|null>} A promise that resolves with the exercise's details or null if an error occurs.
     */
    async function getEntryDetails(row) {
        try {
            const name = row.querySelector('td:nth-child(1) a').textContent.trim();
            const calories = row.querySelector('td:nth-child(3)').textContent.trim();
            const deleteUrl = row.querySelector('td.delete a').href;
            const editUrl = deleteUrl.replace('/remove/', '/edit_entry/');

            const response = await fetch(editUrl);
            if (!response.ok) {
                console.error(`Failed to fetch details for ${name}. Status: ${response.status}`);
                return null;
            }
            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            const year = doc.getElementById('exercise_entry_start_time_1i')?.value;
            const month = doc.getElementById('exercise_entry_start_time_2i')?.value;
            const day = doc.getElementById('exercise_entry_start_time_3i')?.value;
            const hour = doc.getElementById('exercise_entry_start_time_4i')?.value;
            const minute = doc.getElementById('exercise_entry_start_time_5i')?.value;

            let fullStartTime = 0;
            if (!year || !month || !day || !hour || !minute) {
                console.error(`Could not parse start time for '${name}' from its edit page.`);
            } else {
                fullStartTime = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
            }

            return { name, calories, startTime: fullStartTime, deleteUrl };
        } catch (error) {
            console.error('Error fetching entry details:', error);
            return null;
        }
    }

    /**
     * Main function to find, confirm, and remove duplicate exercises.
     */
    async function processDuplicates() {
        const button = document.getElementById('removeDuplicatesBtn');
        button.textContent = 'Gathering Details... (0%)';
        button.disabled = true;

        // --- 1. Asynchronously fetch details for EVERY entry on the page ---
        const exerciseRows = document.querySelectorAll('#cardio-diary tbody tr:not(.bottom)');
        const totalRows = exerciseRows.length;

        let fetchedCount = 0;
        const detailPromises = Array.from(exerciseRows).map(row =>
            getEntryDetails(row).then(result => {
                fetchedCount++;
                button.textContent = `Gathering Details... (${Math.round((fetchedCount / totalRows) * 100)}%)`;
                return result;
            })
        );

        const allEntries = (await Promise.all(detailPromises)).filter(Boolean);
        button.textContent = 'Scanning for duplicates...';

        // --- 2. Find duplicates (by same name/time, keep lowest calories) ---
        const entriesToKeep = new Map();
        const duplicatesToDelete = [];

        allEntries.forEach(entry => {
            // Create a group key based on name and start time
            const groupKey = `${entry.name}|${entry.startTime}`;

            // Make sure calories are numeric for comparison
            const currentCalories = parseInt(entry.calories, 10);

            // Handle non-numeric calorie entries
            if (isNaN(currentCalories)) {
                // Don't try to compare NaN calories. Just keep the first one.
                if (!entriesToKeep.has(groupKey)) {
                    entriesToKeep.set(groupKey, entry); // Keep this first one
                } else {
                    duplicatesToDelete.push(entry); // Delete this new one
                }
                return; // Move to the next entry
            }

            // Check if we've already seen an entry for this group
            const existingEntry = entriesToKeep.get(groupKey);

            if (!existingEntry) {
                // This is the first entry for this group, keep it for now.
                entriesToKeep.set(groupKey, entry);
            } else {
                // We have a potential duplicate. Compare calories.
                const existingCalories = parseInt(existingEntry.calories, 10);

                // If existing is NaN, replace it
                if (isNaN(existingCalories)) {
                    duplicatesToDelete.push(existingEntry);
                    entriesToKeep.set(groupKey, entry);
                }
                else if (currentCalories < existingCalories) {
                    // This new entry is better (lower kcal).
                    // Mark the *existing* one for deletion.
                    duplicatesToDelete.push(existingEntry);
                    // And replace it in the map with the new, better one.
                    entriesToKeep.set(groupKey, entry);
                } else {
                    // The existing entry is better (or equal).
                    // Mark this *current* entry for deletion.
                    duplicatesToDelete.push(entry);
                }
            }
        });


        // Find and add the first zero-calorie adjustment
        for (const row of exerciseRows) {
            const hasAdjustmentClass = row.querySelector('.exercise-description');
            const caloriesCell = row.querySelector('td:nth-child(3)');
            const hasZeroCalories = caloriesCell && caloriesCell.textContent.trim() === '0';

            if (hasAdjustmentClass && hasZeroCalories) {
                const deleteUrl = row.querySelector('td.delete a').href;
                if (!duplicatesToDelete.some(dup => dup.deleteUrl === deleteUrl)) {
                    const name = row.querySelector('td:nth-child(1) a').textContent.trim();
                    duplicatesToDelete.unshift({ name, calories: '0', startTime: 'N/A', deleteUrl });
                }
                break;
            }
        }

        // --- 3. Confirmation and Deletion ---
        if (duplicatesToDelete.length === 0) {
            if (sessionStorage.getItem('isRecursiveDeleteActive') === 'true') {
                const summary = JSON.parse(sessionStorage.getItem('deletionSummary') || '{}');
                let summaryMessage = 'Recursive deletion complete.\n\nSummary:\n';
                const entries = Object.entries(summary);
                if (entries.length > 0) {
                    entries.forEach(([date, count]) => {
                        summaryMessage += `- ${date}: ${count} entries deleted\n`;
                    });
                } else {
                    summaryMessage += 'No entries were deleted during the process.';
                }
                alert(summaryMessage);

                sessionStorage.removeItem('isRecursiveDeleteActive');
                sessionStorage.removeItem('deletionSummary');
            } else {
                alert('No duplicates found based on name and start time.');
            }

            button.textContent = 'Remove Duplicates';
            button.disabled = false;
            return;
        }

        const isRecursiveRun = sessionStorage.getItem('isRecursiveDeleteActive') === 'true';
        if (!isRecursiveRun) {
            let confirmationMessage = `The following ${duplicatesToDelete.length} duplicate exercise(s) will be removed (keeping the lowest calorie version for each group):\n\n`;
            duplicatesToDelete.forEach(dup => {
                const time = dup.startTime === 'N/A' ? 'N/A' : new Date(dup.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                confirmationMessage += `- ${dup.name} (${dup.calories} cal @ ${time})\n`;
            });
            confirmationMessage += '\n\nProceed and continue checking previous days until no duplicates are found?';

            if (!confirm(confirmationMessage)) {
                alert('Operation cancelled.');
                button.textContent = 'Remove Duplicates';
                button.disabled = false;
                return;
            }

            sessionStorage.setItem('isRecursiveDeleteActive', 'true');
            sessionStorage.setItem('deletionSummary', JSON.stringify({}));
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken) {
            alert('Error: Could not find security token (CSRF token). Cannot proceed.');
            button.textContent = 'Remove Duplicates';
            button.disabled = false;
            return;
        }

        let deletedCount = 0;
        const totalToDelete = duplicatesToDelete.length;
        button.textContent = `Deleting... (0/${totalToDelete})`;

        const deletePromises = duplicatesToDelete.map(dup => {
            return fetch(dup.deleteUrl, {
                method: 'DELETE',
                headers: { 'X-CSRF-Token': csrfToken, 'X-Requested-With': 'XMLHttpRequest' }
            }).catch(error => console.error(`Failed to delete '${dup.name}':`, error))
              .finally(() => {
                deletedCount++;
                button.textContent = `Deleting... (${deletedCount}/${totalToDelete})`;
            });
        });

        try {
            await Promise.all(deletePromises);

            const summary = JSON.parse(sessionStorage.getItem('deletionSummary') || '{}');
            const currentDate = document.querySelector('span.date time').textContent.trim();
            summary[currentDate] = (summary[currentDate] || 0) + duplicatesToDelete.length;
            sessionStorage.setItem('deletionSummary', JSON.stringify(summary));

            const prevDayButton = document.querySelector('#date_controls a.prev');
            if (prevDayButton) {
                prevDayButton.click();
            } else {
                console.error("Could not find the 'previous day' button. Ending process.");
                alert('Could not navigate to the previous day. Process stopped. Refresh to see the summary of deleted items.');
                sessionStorage.setItem('isRecursiveDeleteActive', 'false');
            }
        } catch (error) {
            console.error('An error occurred during deletion:', error);
            alert('An error occurred. Check the console for details.');
            button.textContent = 'Remove Duplicates';
            button.disabled = false;
        }
    }

    /**
     * Creates and injects the button into the page.
     */
    function createAndInjectButton() {
        const targetContainer = document.querySelector('div.diary');
        if (targetContainer) {
            const button = document.createElement('button');
            button.textContent = 'Remove Duplicates';
            button.id = 'removeDuplicatesBtn';

            Object.assign(button.style, {
                padding: '8px 12px', marginTop: '10px', marginLeft: '15px', cursor: 'pointer',
                backgroundColor: '#d9534f', color: 'white', border: '1px solid #d43f3a',
                borderRadius: '3px', fontSize: '14px', fontWeight: 'bold'
            });

            button.addEventListener('click', processDuplicates);
            targetContainer.appendChild(button);
        }
    }

    // --- Script Entry Point ---
    if (sessionStorage.getItem('isRecursiveDeleteActive') === 'true') {
        setTimeout(processDuplicates, 500);
    }
    createAndInjectButton();
})();