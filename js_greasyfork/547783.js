// ==UserScript==
// @name         [GC] Unlockables Checklist [BETA]
// @namespace    https://www.grundos.cafe/
// @version      3.1.2
// @description  Avatar, Site Themes, and Relics checklist for Grundo's Cafe, visit https://www.grundos.cafe/~FloofALoof
// @author       soupfaerie, supercow64, arithmancer
// @match        https://www.grundos.cafe/~FloofALoof*
// @match        https://www.grundos.cafe/~floofaloof*
// @match        https://www.grundos.cafe/~FLOOFALOOF*
// @match        https://www.grundos.cafe/~Tyco*
// @match        https://www.grundos.cafe/~tyco*
// @match        https://www.grundos.cafe/~TYCO*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547783/%5BGC%5D%20Unlockables%20Checklist%20%5BBETA%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/547783/%5BGC%5D%20Unlockables%20Checklist%20%5BBETA%5D.meta.js
// ==/UserScript==

const textToHTML = (text) => new DOMParser().parseFromString(text, "text/html");

/**
 * Normalizes text by removing extra whitespace, newlines, and other special characters.
 * This helps ensure consistent comparison between strings that might have different formatting.
 *
 * @param {string} text The text to normalize
 * @returns {string} The normalized text
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    // Convert to lowercase first
    .toLowerCase()
    // Replace special quotes/apostrophes with standard ones
    .replace(/[''""`´]/g, "'")
    // Remove all punctuation except apostrophes
    .replace(/[^\w\s']/g, ' ')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Trim leading/trailing whitespace
    .trim();
};

/**
 * Analyse the HTML select element for a list of avatars the user has collected.
 *
 * @param {Node} node The root node (default: document)
 * @returns {string[]} the list of avatars as an array of basenames
 */
const getCollectedAvatars = (node = document) => {
  // The list of avatars is partitioned into default avatars
  // and collected secret avatars. The option with the text ---
  // (6 dashes) is the inclusive cutoff. All avatars at and below
  // the cutoff are collected secret avatars
  const allAvatars = Array.from(
    node.querySelectorAll(`[name="new_avatar"] option`)
  );
  const i = allAvatars.findIndex((e) => e.textContent.includes("---"));
  return allAvatars.slice(i).map((e) => e.value);
};

/**
 * Analyse the HTML select element for all site themes available to the user.
 *
 * @param {Node} node The root node (default: document)
 * @returns {string[]} all site themes as an array of theme names
 */
const getAllSiteThemes = (node = document) => {
  // Find all options in the site_theme select element
  const themeOptions = Array.from(node.querySelectorAll(`[name="site_theme"] option`));
  if (!themeOptions.length) return [];

  // Return the text content of each option
  return themeOptions
    .map(option => option.textContent.trim())
    .filter(themeName => themeName); // Filter out any empty theme names
};

/**
 * Returns a Promise that resolves to a list of avatars
 * the user has collected.
 *
 * @returns {string[]} list of collected avatars
 */
const getCollectedAvatarsAsync = () =>
  fetch("/neoboards/preferences/")
    .then((res) => res.text())
    .then(textToHTML)
    .then(getCollectedAvatars);

/**
 * Returns a Promise that resolves to all site themes
 * available to the user.
 *
 * @returns {string[]} all site themes as an array of theme names
 */
const getAllSiteThemesAsync = () =>
  fetch("/help/siteprefs")
    .then((res) => res.text())
    .then(textToHTML)
    .then(getAllSiteThemes);

/**
 * Analyse the HTML response to identify logged relics.
 *
 * @param {Node} node The root node (default: document)
 * @returns {string[]} the list of logged relics as an array of relic names
 */
const getLoggedRelics = (node = document) => {
  // Find all relic divs
  const relicDivs = Array.from(
    node.querySelectorAll(`.flex-column.small-gap.center-items`)
  );
  if (!relicDivs.length) return [];

  // Extract the names of relics that don't have the not-redeemed class
  const loggedRelics = relicDivs
    .map(relic => {
      const img = relic.querySelector('img');

      // Check if the image doesn't have the not-redeemed class (meaning it's logged)
      if (img && !img.classList.contains('not-redeemed')) {
        // Use the title attribute of the image which contains the relic name
        if (img.title) {
          return normalizeText(img.title);
        }

        // If title is not available, try to get the name from the span element
        const span = relic.querySelector('span.medfont strong');
        if (span) {
          return normalizeText(span.textContent);
        }
      }

      // If the image has the not-redeemed class or no name could be found, return null
      return null;
    })
    .filter(name => name); // Filter out any null values

  return loggedRelics;
};

/**
 * Analyse the HTML response to identify unlogged relics.
 *
 * @param {Node} node The root node (default: document)
 * @returns {string[]} the list of unlogged relics as an array of relic names
 */
const getUnloggedRelics = (node = document) => {
  // Find all relic divs
  const relicDivs = Array.from(
    node.querySelectorAll(`.flex-column.small-gap.center-items`)
  );
  if (!relicDivs.length) return [];

  // Extract the names of relics that have the not-redeemed class
  const unloggedRelics = relicDivs
    .map(relic => {
      const img = relic.querySelector('img');

      // Check if the image has the not-redeemed class (meaning it's not logged)
      if (img && img.classList.contains('not-redeemed')) {
        // Use the title attribute of the image which contains the relic name
        if (img.title) {
          return normalizeText(img.title);
        }

        // If title is not available, try to get the name from the span element
        const span = relic.querySelector('span.medfont strong');
        if (span) {
          return normalizeText(span.textContent);
        }
      }

      // If the image doesn't have the not-redeemed class or no name could be found, return null
      return null;
    })
    .filter(name => name); // Filter out any null values

  return unloggedRelics;
};

/**
 * Returns a Promise that resolves to a list of logged relics.
 *
 * @returns {string[]} list of logged relics as an array of relic names
 */
const getLoggedRelicsAsync = () =>
  fetch("/space/warehouse/relics/")
    .then((res) => res.text())
    .then(textToHTML)
    .then(getLoggedRelics);

/**
 * Returns a Promise that resolves to a list of unlogged relics.
 *
 * @returns {string[]} list of unlogged relics as an array of relic names
 */
const getUnloggedRelicsAsync = () =>
  fetch("/space/warehouse/relics/")
    .then((res) => res.text())
    .then(textToHTML)
    .then(getUnloggedRelics);

/**
 * For static assets, returns the basename of the asset indicated
 * in the url.
 *
 * ```js
 * basename("https://example.com/foo/bar/baz.gif") == "baz.gif"
 * ```
 *
 * @param {string} url path to the file with slashes
 * @returns {string} the basename
 */
const basename = (url) => url.split("/").slice(-1)[0];



/**
 * Move collected avatar cards into their section's <details> element.
 *
 * The tracker page groups avatars by section. Each section is a <div>
 * directly under the #avatars container. Within each section there are one or
 * more `.avatar-grid` containers followed by a <details> element containing an
 * empty `.avatar-grid`. Collected avatars should be appended to that grid.
 *
 * @param {string[]} collectedAvatars basenames of the user's collected avatars
 */
function moveCollectedAvatars(collectedAvatars) {
  const sections = document.querySelectorAll('#avatars > *');
  // Create a set to track which collected avatars are found on the page
  const foundAvatars = new Set();

  sections.forEach((section) => {
    const foundGrid = section.querySelector('details .avatar-grid');
    if (!foundGrid) return;

    const cards = section.querySelectorAll(':scope > .avatar-grid > .avatar-card');
    cards.forEach((card) => {
      const img = card.querySelector('img');
      if (!img) return; // site theme cards currently lack images

      const avatarName = basename(img.src);
      if (collectedAvatars.includes(avatarName)) {
        card.classList.add('check');
        foundGrid.appendChild(card);
        foundAvatars.add(avatarName);
      }
    });
  });

  // Log any collected avatars that weren't found on the page
  collectedAvatars.forEach(avatar => {
    if (!foundAvatars.has(avatar)) {
      console.log(`Collected avatar not found on page: ${avatar}`);
    }
  });
}

/**
 * Move collected site theme cards into the themes section's <details> element.
 *
 * The site themes section has a <details> element containing an empty `.avatar-grid`.
 * All site themes from the site_theme select element should be appended to that grid.
 *
 * @param {string[]} collectedThemes names of all available site themes
 */
function moveCollectedSiteThemes(collectedThemes) {
  const themesSection = document.querySelector('#themes');
  if (!themesSection) return;

  const foundGrid = themesSection.querySelector('details .avatar-grid');
  if (!foundGrid) return;

  // Create a set to track which collected themes are found on the page
  const foundThemes = new Set();

  const cards = themesSection.querySelectorAll(':scope > .avatar-grid > .avatar-card');
  cards.forEach((card) => {
    const nameElement = card.querySelector('.avatar-name');
    if (!nameElement) return;

    // Get the theme name directly from the card
    const themeName = nameElement.textContent.trim();

    // Check if this theme is in the collected themes list
    if (collectedThemes.includes(themeName)) {
      card.classList.add('done');
      foundGrid.appendChild(card);
      foundThemes.add(themeName);
    } else {
      if (themeName === "Tyrannia" && collectedThemes.includes("Tyrannian Night")) {
        card.classList.add('done');
        foundGrid.appendChild(card);
        foundThemes.add(themeName);
      }
    }
  });

  // Log any collected themes that weren't found on the page
  collectedThemes.forEach(theme => {
    if (!foundThemes.has(theme)) {
      console.log(`Collected site theme not found on page: ${theme}`);
    }
  });
}

/**
 * Move logged relic cards into their section's <details> element and track unlogged relics.
 *
 * The relics section has a <details> element containing an empty `.avatar-grid`.
 * Logged relics should be appended to that grid and marked with the "redeemed" class.
 * This function also tracks which unlogged relics are found on the page.
 *
 * @param {string[]} loggedRelics names of logged relics
 * @param {string[]} unloggedRelics names of unlogged relics
 */
function moveLoggedRelics(loggedRelics, unloggedRelics = []) {
  const relicsSection = document.querySelector('#relics');
  if (!relicsSection) {
    console.log('Could not find #relics section');
    return;
  }

  // Find all relic sections (rdailies, rgames, etc.)
  const sections = relicsSection.querySelectorAll('[id^="r"]');

  // Create a map of section IDs to their details grid elements
  const sectionGrids = new Map();

  // Find the details grid in each section
  sections.forEach(section => {
    const sectionId = section.id;
    const details = section.querySelector('details');
    if (details) {
      const grid = details.querySelector('.avatar-grid');
      if (grid) {
        sectionGrids.set(sectionId, grid);
      }
    }
  });

  if (sectionGrids.size === 0) {
    console.log('Could not find any details .avatar-grid in any relic section');
    return;
  }

  // Create sets to track which relics are found on the page
  const foundLoggedRelics = new Set();
  const foundUnloggedRelics = new Set();

  // Process each section separately
  sections.forEach(section => {
    const sectionId = section.id;
    const detailsGrid = sectionGrids.get(sectionId);

    // Skip sections without a details grid
    if (!detailsGrid) return;

    // Find all relic cards in this section
    const cards = section.querySelectorAll('.avatar-grid > .avatar-card');

    cards.forEach((card) => {
      const nameElement = card.querySelector('.avatar-name');
      if (!nameElement) return;

      // Get the relic name directly from the card and normalize it
      const relicName = normalizeText(nameElement.textContent);

      // Check if this relic is in the logged relics list using direct comparison
      const loggedMatchIndex = loggedRelics.findIndex((relic) =>
        normalizeText(relic) === normalizeText(relicName)
      );

      if (loggedMatchIndex !== -1) {
        const originalRelicName = loggedRelics[loggedMatchIndex];
        card.classList.add('redeemed');
        detailsGrid.appendChild(card);
        foundLoggedRelics.add(originalRelicName);
      }

      // Check if this relic is in the unlogged relics list using direct comparison
      const unloggedMatchIndex = unloggedRelics.findIndex((relic) =>
        normalizeText(relic) === normalizeText(relicName)
      );

      if (unloggedMatchIndex !== -1) {
        const originalRelicName = unloggedRelics[unloggedMatchIndex];
        foundUnloggedRelics.add(originalRelicName);
      }
    });
  });

  // Log any logged relics that weren't found on the page
  loggedRelics.forEach(relic => {
    if (!foundLoggedRelics.has(relic)) {
      console.log(`Logged relic not found on page: ${relic}`);
    }
  });

  // Log any unlogged relics that weren't found on the page
  unloggedRelics.forEach(relic => {
    if (!foundUnloggedRelics.has(relic)) {
      console.log(`Unlogged relic not found on page: ${relic}`);
    }
  });
}

// Fetch avatar, site theme, and relic data and move the collected cards
Promise.all([
  getCollectedAvatarsAsync().then(moveCollectedAvatars),
  getAllSiteThemesAsync().then(moveCollectedSiteThemes),
  // Fetch both logged and unlogged relics and pass them to moveLoggedRelics
  Promise.all([
    getLoggedRelicsAsync(),
    getUnloggedRelicsAsync()
  ]).then(([loggedRelics, unloggedRelics]) => {
    moveLoggedRelics(loggedRelics, unloggedRelics);
  })
]);
