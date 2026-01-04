// ==UserScript==
// @name        Photofeeler Average Score
// @namespace   Violentmonkey Scripts
// @match       https://www.photofeeler.com/my-tests*
// @grant       none
// @version     1.0
// @author      Alexander Mortasen | axmortasen@gmail.com
// @license MIT
// @description This script adds 4th bar on Photofeeler all results page - Average
// @downloadURL https://update.greasyfork.org/scripts/557351/Photofeeler%20Average%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/557351/Photofeeler%20Average%20Score.meta.js
// ==/UserScript==

/**
 * Calculates the average score from existing score rows within a panel
 * and appends a new row displaying this average.
 *
 * @param {HTMLElement} panelElement - The parent DOM element (e.g., div.test-box-panel).
 */
function addAverageScoreBar(panelElement) {
  // 1. Find all score value elements within the provided panel
  const scoreValueElements = panelElement.querySelectorAll('.test-score-row .score-value');

  // 2. Extract scores and calculate the sum
  let totalScore = 0;
  let validScoreCount = 0;
  scoreValueElements.forEach(element => {
    const score = parseFloat(element.textContent);
    // Only include valid numbers in the average
    if (!isNaN(score)) {
      totalScore += score;
      validScoreCount++;
    } else {
      console.warn("Skipping non-numeric score value:", element.textContent);
    }
  });

  // 3. Calculate the average (avoid division by zero)
  if (validScoreCount === 0) {
    console.warn("No valid scores found to calculate an average.");
    return; // Exit if no scores were found
  }
  const averageScore = totalScore / validScoreCount;

  // 4. Format the average score and calculate bar width
  const averageScoreFormatted = averageScore.toFixed(1); // Format to one decimal place
  const averageScoreWidth = (averageScore * 10).toFixed(1) + '%'; // Calculate percentage width

  // 5. Create the new elements for the average score row
  const newScoreRow = document.createElement('div');
  newScoreRow.className = 'test-score-row average-score-row'; // Add extra class for potential styling

  const newScoreBar = document.createElement('div');
  newScoreBar.className = 'score-bar';

  const newScoreFill = document.createElement('div');
  // Use a distinct class for the average bar fill
  newScoreFill.className = 'score-bar-fill average';
  newScoreFill.style.width = averageScoreWidth;
  newScoreFill.style.background = 'linear-gradient(90deg, #ce88e6 0, #7f53d0 100%)'

  const newScoreText = document.createElement('div');
  newScoreText.className = 'score-text';

  const newScoreTrait = document.createElement('div');
  newScoreTrait.className = 'score-trait';
  newScoreTrait.textContent = "Average"; // Label for the new bar

  const spacer = document.createElement('div');
  spacer.style.flexGrow = '1'; // Keep the spacer logic

  const newScoreValue = document.createElement('div');
  newScoreValue.className = 'score-value';
  newScoreValue.textContent = averageScoreFormatted;

  // 6. Assemble the new elements
  newScoreBar.appendChild(newScoreFill);

  newScoreText.appendChild(newScoreTrait);
  newScoreText.appendChild(spacer);
  newScoreText.appendChild(newScoreValue);

  newScoreRow.appendChild(newScoreBar);
  newScoreRow.appendChild(newScoreText);

  // 7. Append the new row to the original panel element
  panelElement.appendChild(newScoreRow);

  if (averageScore < 6.4) {
    let boxEl = panelElement.closest(".test-box-2024")
    boxEl.style = "filter: brightness(.75);"
  }
}

// --- Example Usage ---
// Assuming you have the HTML structure in your document
// and can select the main panel:

// const panel = document.querySelector('.test-box-panel');
// if (panel) {
//  addAverageScoreBar(panel);
// } else {
//  console.error("Could not find the test panel element.");
// }

// Or, if you have the element directly (e.g., passed from an event):
// addAverageScoreBar(yourPanelElement);

document.querySelectorAll('.test-box-panel').forEach(el => addAverageScoreBar(el));