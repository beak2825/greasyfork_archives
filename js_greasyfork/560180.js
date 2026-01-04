// ==UserScript==
// @name         Relay - Bughouse Game Links
// @namespace    https://bughouse.aronteh.com
// @version      1.1.0
// @description  Adds "Ellipviewer" buttons to bughouse games on chess.com game history pages and live game pages, allowing quick access to the Relay bughouse analysis tool.
// @author       Aron Teh
// @license      GPL-3.0
// @match        https://www.chess.com/game/live/*
// @match        https://www.chess.com/member/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560180/Relay%20-%20Bughouse%20Game%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/560180/Relay%20-%20Bughouse%20Game%20Links.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Constants
  const APP_BASE_URL = 'https://bughouse.aronteh.com/?gameid=';
  const BUTTON_TEXT = 'Ellipviewer';
  const BUTTON_CLASSES = 'cc-button-component cc-button-secondary cc-button-medium cc-bg-secondary';
  const BUTTON_ID_PREFIX = 'openInEllipAppBtn';

  // CSS class selectors for chess.com DOM elements
  const GAME_HISTORY_TABLE_CLASS = 'table-responsive';
  const SINGLE_GAME_BUTTONS_CLASS = 'new-game-buttons-buttons';

  // Polling interval in milliseconds (check every second)
  const POLLING_INTERVAL_MS = 1000;

  /**
   * Extracts the game ID from a chess.com game URL.
   * Handles both full URLs and partial paths like "/game/live/123456789012".
   *
   * @param {string} url - The chess.com game URL or path
   * @returns {string|null} The 12-digit game ID, or null if extraction fails
   */
  function extractGameId(url) {
    if (!url) return null;

    try {
      // Remove '/game/live/' prefix if present
      const withoutPrefix = url.replace(/^.*\/game\/live\//, '');

      // Extract the 12-digit game ID (chess.com game IDs are always 12 digits)
      const match = withoutPrefix.match(/^(\d{12})/);
      if (match && match[1]) {
        return match[1];
      }

      return null;
    } catch (error) {
      console.error('[Relay Bughouse Links] Error extracting game ID:', error);
      return null;
    }
  }

  /**
   * Opens a game in the Relay bughouse analysis application.
   *
   * @param {string} gameId - The chess.com game ID (12-digit number as string)
   */
  function openInRelayApp(gameId) {
    if (!gameId) {
      console.error('[Relay Bughouse Links] No game ID provided');
      return;
    }

    const url = APP_BASE_URL + gameId;
    window.open(url, '_blank');
  }

  /**
   * Creates a button element that opens the game in Relay.
   *
   * @param {string} gameId - The chess.com game ID
   * @param {string} uniqueId - A unique identifier for the button element
   * @returns {HTMLButtonElement} The created button element
   */
  function createButton(gameId, uniqueId) {
    const button = document.createElement('button');
    button.id = uniqueId;
    button.innerText = BUTTON_TEXT;
    button.className = BUTTON_CLASSES;
    button.addEventListener('click', () => {
      openInRelayApp(gameId);
    });
    return button;
  }

  /**
   * Determines if a game row represents a bughouse game.
   *
   * Bughouse games on chess.com have a specific structure where the 4th cell
   * (index 3) is typically empty or contains minimal content, unlike regular
   * chess games which have move count or other data in that cell.
   *
   * @param {HTMLTableRowElement} row - The table row element to check
   * @returns {boolean} True if the row appears to be a bughouse game
   */
  function isBughouseGame(row) {
    try {
      const cells = row.querySelectorAll('td');

      // Bughouse games should have at least 4 cells
      if (cells.length < 4) {
        return false;
      }

      // The 4th cell (index 3) should be empty or have minimal content for bughouse games
      const fourthCell = cells[3];
      const cellText = fourthCell ? fourthCell.textContent.trim() : '';

      // Check if the cell is empty or contains only whitespace
      // This is the current heuristic for identifying bughouse games
      return cellText.length === 0;
    } catch (error) {
      console.error('[Relay Bughouse Links] Error checking if bughouse game:', error);
      return false;
    }
  }

  /**
   * Processes a single game history row, adding an Ellipviewer button if it's a bughouse game.
   * This function is idempotent - it can be called multiple times safely without creating duplicates.
   *
   * @param {HTMLTableRowElement} row - The table row element to process
   */
  function processGameHistoryRow(row) {
    // Skip if not a bughouse game
    if (!isBughouseGame(row)) {
      return;
    }

    try {
      const cells = row.querySelectorAll('td');
      if (cells.length < 4) {
        return;
      }

      const targetCell = cells[3];

      // Find the link to the game
      const linkElement = targetCell.querySelector('a');
      if (!linkElement) {
        // If there's no link, check if we already added a button
        const existingButton = targetCell.querySelector(`button[id^="${BUTTON_ID_PREFIX}"]`);
        if (existingButton) {
          // Button already exists, nothing to do
          return;
        }
        // No link and no button - can't process this row
        return;
      }

      const href = linkElement.getAttribute('href');
      if (!href) {
        return;
      }

      // Extract game ID from the link
      const gameId = extractGameId(href);
      if (!gameId) {
        console.warn('[Relay Bughouse Links] Could not extract game ID from:', href);
        return;
      }

      // Generate unique button ID using game ID to avoid duplicates
      const uniqueButtonId = BUTTON_ID_PREFIX + '_' + gameId;

      // Check if button already exists for this game ID
      const existingButton = targetCell.querySelector(`#${uniqueButtonId}`);
      if (existingButton) {
        // Button already exists, nothing to do
        return;
      }

      // Remove the original link and add our button
      linkElement.remove();
      const button = createButton(gameId, uniqueButtonId);
      targetCell.appendChild(button);
    } catch (error) {
      console.error('[Relay Bughouse Links] Error processing game history row:', error);
    }
  }

  /**
   * Processes all game history rows in the table.
   * This function is idempotent and can be called repeatedly safely.
   */
  function processGameHistoryRows() {
    try {
      const table = document.querySelector('.' + GAME_HISTORY_TABLE_CLASS);
      if (!table) {
        return;
      }

      const rows = table.querySelectorAll('tbody tr');
      if (!rows || rows.length === 0) {
        return;
      }

      rows.forEach((row) => {
        processGameHistoryRow(row);
      });
    } catch (error) {
      console.error('[Relay Bughouse Links] Error processing game history rows:', error);
    }
  }

  /**
   * Sets up continuous polling to process game history rows.
   * This brute-force approach works reliably with single-page applications
   * where the DOM may be completely replaced during navigation.
   * The function checks every second and processes any unprocessed rows.
   */
  function setupGameHistoryPolling() {
    // Start polling immediately
    processGameHistoryRows();

    // Continue polling every second
    setInterval(() => {
      processGameHistoryRows();
    }, POLLING_INTERVAL_MS);
  }

  /**
   * Adds an Ellipviewer button to a single live game page.
   * This is used when viewing an individual game (not the game history list).
   * Uses polling to handle single-page application navigation.
   */
  function setupSingleGameButton() {
    // Poll continuously to handle SPA navigation
    setInterval(() => {
      const targetDiv = document.querySelector('.' + SINGLE_GAME_BUTTONS_CLASS);
      if (!targetDiv) {
        return;
      }

      // Check if button already exists
      const existingButton = targetDiv.querySelector(`#${BUTTON_ID_PREFIX}`);
      if (existingButton) {
        return;
      }

      try {
        const currentUrl = window.location.href;
        const gameId = extractGameId(currentUrl);

        if (gameId) {
          const button = createButton(gameId, BUTTON_ID_PREFIX);
          targetDiv.appendChild(button);
        }
      } catch (error) {
        console.error('[Relay Bughouse Links] Error setting up single game button:', error);
      }
    }, POLLING_INTERVAL_MS);
  }

  /**
   * Main initialization function.
   * Determines which page type we're on and sets up the appropriate handlers.
   */
  function init() {
    const currentUrl = window.location.href;

    if (currentUrl.includes('/game/live')) {
      setupSingleGameButton();
    } else if (currentUrl.includes('/member/')) {
      setupGameHistoryPolling();
    }
  }

  // Initialize when the script loads
  init();
})();
