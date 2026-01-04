// ==UserScript==
// @name        Bandcamp Album Duration
// @namespace   Violentmonkey Scripts
// @match       https://*.bandcamp.com/album/*
// @grant       none
// @version     1.0
// @author      Gemini
// @description Calculates and displays the total duration of a Bandcamp album on its page.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/550375/Bandcamp%20Album%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/550375/Bandcamp%20Album%20Duration.meta.js
// ==/UserScript==

(() => {
  // --- SCRIPT START ---

  // Find the table containing the track list.
  const trackTable = document.getElementById('track_table');
  if (!trackTable) {
    console.log("Bandcamp Album Duration: Could not find track table.");
    return;
  }

  // Find the body of the table where tracks are listed.
  const trackTableBody = trackTable.querySelector('tbody');
  if (!trackTableBody) {
    console.log("Bandcamp Album Duration: Could not find track table body.");
    return;
  }

  // Select all elements that contain track durations.
  // Bandcamp uses a <span> with the class 'time' for this.
  const timeElements = trackTable.querySelectorAll('tr.track_row_view .time');
  if (timeElements.length === 0) {
    console.log("Bandcamp Album Duration: No track times found on this page.");
    return;
  }

  let totalSeconds = 0;

  // Iterate over each time element to sum up the duration.
  timeElements.forEach(timeEl => {
    // Get the time string (e.g., "03:40") and remove whitespace.
    const timeString = timeEl.textContent.trim();
    const parts = timeString.split(':');

    // Make sure the format is correct (MM:SS) before parsing.
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);

      // Add the duration of the current track (in seconds) to the total.
      if (!isNaN(minutes) && !isNaN(seconds)) {
        totalSeconds += (minutes * 60) + seconds;
      }
    }
  });

  // Function to format the total seconds back into a readable HH:MM:SS or MM:SS format.
  function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Helper to pad numbers with a leading zero if they are less than 10 (e.g., 5 -> "05").
    const pad = (num) => num.toString().padStart(2, '0');

    let formattedString = `${pad(minutes)}:${pad(seconds)}`;
    if (hours > 0) {
      formattedString = `${pad(hours)}:${formattedString}`;
    }

    return formattedString;
  }

  const formattedTime = formatDuration(totalSeconds);

  // --- Create and insert the new element ---

  // Create a new table row `<tr>` to hold our total duration info.
  const totalRow = document.createElement('tr');
  totalRow.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)'; // Add a subtle separator line.

  // Create a table cell `<td>`. We use colspan="3" so it spans across
  // the play button, track number, and title columns.
  const totalCell = document.createElement('td');
  totalCell.colSpan = 3;

  // Style the cell to align the text to the right, similar to the track times.
  totalCell.style.textAlign = 'right';
  totalCell.style.padding = '8px 8px 8px 0'; // Give it some spacing.
  totalCell.style.fontWeight = 'bold';

  // Create a `<span>` for the text itself.
  const textSpan = document.createElement('span');

  // Use the 'secondaryText' class from Bandcamp to match the font color and style.
  textSpan.className = 'secondaryText';
  textSpan.textContent = `Total duration: ${formattedTime}`;

  // Assemble the elements: span -> cell -> row.
  totalCell.appendChild(textSpan);
  totalRow.appendChild(totalCell);

  // Add an empty cell to align with the "buy track" column.
  const emptyCell = document.createElement('td');
  emptyCell.colSpan = 2;
  totalRow.appendChild(emptyCell);

  // Append the newly created row to the end of the track list.
  trackTableBody.appendChild(totalRow);

  // --- SCRIPT END ---
})();