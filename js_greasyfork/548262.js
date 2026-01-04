// ==UserScript==
// @name          MusicBrainz: Compare AcoustIDs easier!
// @namespace     https://musicbrainz.org/user/chaban
// @version       1.1.2
// @tag           ai-created
// @description   Displays AcoustID fingerprints in more places at MusicBrainz.
// @author        otringal, chaban
// @license       MIT
// @match         *://*.musicbrainz.org/artist/*/recordings*
// @match         *://*.musicbrainz.org/artist/*/*edits*
// @match         *://*.musicbrainz.org/collection/*/*
// @match         *://*.musicbrainz.org/edit/*
// @match         *://*.musicbrainz.org/recording/*
// @match         *://*.musicbrainz.org/release-group/*
// @match         *://*.musicbrainz.org/release/*
// @match         *://*.musicbrainz.org/search/*
// @match         *://*.musicbrainz.org/user/*/edits*
// @match         *://*.musicbrainz.org/user/*/votes*
// @exclude       *musicbrainz.org/release/*/edit*
// @exclude       *musicbrainz.org/release/*/edit-relationships*
// @icon          https://acoustid.org/static/acoustid-wave-12.png
// @connect       api.acoustid.org
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/548262/MusicBrainz%3A%20Compare%20AcoustIDs%20easier%21.user.js
// @updateURL https://update.greasyfork.org/scripts/548262/MusicBrainz%3A%20Compare%20AcoustIDs%20easier%21.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -- USER SETTINGS --
  const enableMiniIcons = false;
  const enableAcoustList = true;
  const addShowHideButton = true;
  const alwaysShowIds = 5;
  const numCharacters = 6;

  // -- STYLES --
  const css = document.createElement('style');
  css.textContent = `
    td > a[href^='//acoustid.org/track/'] > code {
      display: inline-block;
      white-space: nowrap;
      overflow-x: hidden;
      width: ${numCharacters}ch;
      vertical-align: bottom;
    }
    .hidelist,
    .hidelist + br {
      display: none;
    }
    .showids span {
      white-space: nowrap;
      margin: 0.4em 0;
      padding: 0.1em 0.3em;
      font-size: smaller;
      text-transform: uppercase;
      font-weight: 600;
      background-color: rgba(250, 200, 35, 0.5);
      cursor: pointer;
    }
    .acoustid-icon {
      float: right;
    }
  `;
  document.head.appendChild(css);

  // -- UTILITY FUNCTIONS --

  /** Generates a random hex color code. */
  function getRandomColor() {
    const letters = '89ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  /** Extracts the recording MBID from a URL. */
  function extractRecordingMBID(link) {
    if (link?.href) {
      const parts = link.href.split('/');
      if (parts[3] === 'recording') return parts[4];
    }
  }

  // -- API FUNCTIONS --

  /** Fetches AcoustID data for a list of MBIDs. Always returns an array. */
  async function fetchAcoustIDData(mbids) {
    if (mbids.length === 0) return [];
    const params = new URLSearchParams({ format: 'json', batch: '1' });
    mbids.forEach((mbid) => params.append('mbid', mbid));

    const response = await fetch(
      `//api.acoustid.org/v2/track/list_by_mbid?${params.toString()}`,
      {
        referrerPolicy: 'strict-origin-when-cross-origin',
      }
    );

    if (!response.ok) {
      throw new Error(`AcoustID API request failed: ${response.status}`);
    }
    const json = await response.json();
    if (json.status !== 'ok' || !Array.isArray(json.mbids)) {
      console.error(
        'AcoustID API returned an error:',
        json.error?.message || 'Unexpected format'
      );
      return []; // Return an empty array to prevent TypeErrors
    }
    return json.mbids;
  }

  // -- CORE LOGIC --

  /** Processes API data to find duplicates and map colors. */
  function processAcoustIDData(apiData) {
    const counts = {};
    const colorMap = {};
    for (const mbidData of apiData) {
      if (mbidData.tracks) {
        for (const track of mbidData.tracks) {
          counts[track.id] = (counts[track.id] || 0) + 1;
        }
      }
    }
    for (const acoustID in counts) {
      if (counts[acoustID] > 1) {
        colorMap[acoustID] = getRandomColor();
      }
    }
    return { colorMap };
  }

  /** Creates a DOM fragment of AcoustID links for a single recording. */
  function createAcoustIDFragment(tracks, colorMap) {
    const fragment = document.createDocumentFragment();
    tracks.sort((a, b) => a.id.localeCompare(b.id));

    tracks.forEach((track, index) => {
      const link = document.createElement('a');
      link.href = `//acoustid.org/track/${track.id}`;
      const code = document.createElement('code');
      code.textContent = track.id;
      link.appendChild(code);

      const color = colorMap[track.id];
      if (color) link.style.backgroundColor = color;

      if (addShowHideButton && index >= alwaysShowIds) {
        link.classList.add('hidelist');
      }

      fragment.appendChild(link);
      fragment.appendChild(document.createElement('br'));
    });

    if (addShowHideButton && tracks.length > alwaysShowIds) {
      const hiddenCount = tracks.length - alwaysShowIds;
      const toggleButton = document.createElement('div');
      toggleButton.className = 'showids allids';
      const span = document.createElement('span');
      span.textContent = `show all (+${hiddenCount})`;
      toggleButton.appendChild(span);
      fragment.appendChild(toggleButton);
    }
    return fragment;
  }

  /** Injects AcoustID icons on artist recording and release pages. */
  async function updateArtistRecordingsPage() {
    const recordingCells = document.querySelectorAll('.tbl tr td + td:not(.video)');
    const mbids = [...recordingCells]
      .map((cell) => extractRecordingMBID(cell.querySelector('a')))
      .filter(Boolean);
    if (mbids.length === 0) return;

    try {
      const acoustidData = await fetchAcoustIDData(mbids);
      const dataByMBID = new Map(acoustidData.map((d) => [d.mbid, d]));

      recordingCells.forEach((cell) => {
        const mbid = extractRecordingMBID(cell.querySelector('a'));
        const mbidData = dataByMBID.get(mbid);
        if (mbidData?.tracks?.length > 0) {
          mbidData.tracks.forEach((track) => {
            const link = document.createElement('a');
            link.href = `//acoustid.org/track/${track.id}`;

            const img = document.createElement('img');
            img.src = '//acoustid.org/static/acoustid-wave-12.png';
            img.title = track.id;
            img.alt = 'AcoustID';
            img.className = 'acoustid-icon';
            link.appendChild(img);

            cell.querySelector('a:first-of-type').after(link);
          });
        }
      });
    } catch (error) {
      console.error('AcoustID Script Error (Artist Page):', error);
    }
  }

  /** Injects a new table column with AcoustIDs on merge edit pages. */
  async function updateMergeOrEdits() {
    const allMBIDs = [
      ...document.querySelectorAll(
        '.details.merge-recordings .tbl a[href*="/recording/"]'
      ),
    ]
      .map(extractRecordingMBID)
      .filter(Boolean);

    if (allMBIDs.length === 0) return;

    try {
      const acoustidData = await fetchAcoustIDData(allMBIDs);
      const { colorMap } = processAcoustIDData(acoustidData);
      const dataByMBID = new Map(acoustidData.map((d) => [d.mbid, d]));

      document.querySelectorAll('.details.merge-recordings table.tbl').forEach((table) => {
        const header = table.querySelector('thead tr th:nth-child(2)');
        const dataCells = table.querySelectorAll('tbody tr td:nth-child(1)');

        if (!header || dataCells.length === 0) return;

        const newHeader = document.createElement('th');
        newHeader.textContent = 'AcoustIDs';
        header.insertAdjacentElement('afterend', newHeader);

        dataCells.forEach((cell) => {
          const mbid = extractRecordingMBID(cell.querySelector('a'));
          const mbidData = dataByMBID.get(mbid);
          const acoustidCell = document.createElement('td');
          if (mbidData?.tracks?.length > 0) {
            acoustidCell.appendChild(createAcoustIDFragment(mbidData.tracks, colorMap));
          }
          cell.nextElementSibling.insertAdjacentElement('afterend', acoustidCell);
        });
      });
    } catch (error) {
      console.error('AcoustID Script Error (Merge Page):', error);
    }
  }

  /** Applies colors to existing AcoustID links. */
  function colorizeMergePageLinks() {
    const links = document.querySelectorAll('.tbl .acoustids a[href*="/track/"]');
    if (links.length === 0) return;

    const counts = {};
    links.forEach((link) => {
      const parts = link.href.split('/');
      const id = parts[parts.length - 1];
      counts[id] = (counts[id] || 0) + 1;
    });

    const colorMap = {};
    for (const id in counts) {
      if (counts[id] > 1) {
        colorMap[id] = getRandomColor();
      }
    }

    links.forEach((link) => {
      const parts = link.href.split('/');
      const id = parts[parts.length - 1];
      if (colorMap[id]) {
        link.style.backgroundColor = colorMap[id];
      }
    });
  }

  /** Observes the table for React updates and triggers highlighting. */
  function setupMergePageObserver() {
    colorizeMergePageLinks();

    const targetNode = document.querySelector('#content') || document.body;

    let timeout;
    const observer = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some(mutation =>
        mutation.addedNodes.length > 0 &&
        (mutation.target.classList.contains('acoustids') ||
         mutation.target.closest('.acoustids') ||
         mutation.target.closest('.tbl'))
      );

      if (shouldUpdate) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
             colorizeMergePageLinks();
        }, 200);
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
  }

  // -- UI EVENT HANDLING --

  function setupShowHideListener() {
    if (document.body.dataset.showhideListenerAttached) return;
    document.body.dataset.showhideListenerAttached = 'true';

    document.body.addEventListener('click', (event) => {
      const buttonContainer = event.target.closest('.showids');
      if (!buttonContainer) return;

      const parent = buttonContainer.parentElement;
      const hiddenItems = parent.querySelectorAll('.hidelist');

      if (buttonContainer.classList.contains('allids')) {
        buttonContainer.classList.replace('allids', 'lessids');
        buttonContainer.querySelector('span').textContent = 'show less';
        hiddenItems.forEach((el) => {
          el.style.display = 'inline';
          const br = el.nextElementSibling;
          if (br?.tagName === 'BR') br.style.display = 'inline';
        });
      } else {
        buttonContainer.classList.replace('lessids', 'allids');
        buttonContainer.querySelector('span').textContent = `show all (+${hiddenItems.length})`;
        hiddenItems.forEach((el) => {
          el.style.display = 'none';
          const br = el.nextElementSibling;
          if (br?.tagName === 'BR') br.style.display = 'none';
        });
      }
    });
  }

  // -- MAIN ROUTER --

  function main() {
    const path = window.location.href;
    console.log('[AcoustID Script] Main executing. Path:', path);

    if (path.includes('/recording/merge')) {
       // React-based page: Needs Observer
       setupMergePageObserver();
    } else if (
      enableMiniIcons &&
      (path.includes('/recordings') || path.includes('/release/'))
    ) {
      updateArtistRecordingsPage();
    } else if (enableAcoustList && (path.includes('/edit') || path.includes('/votes'))) {
      updateMergeOrEdits();
      setupShowHideListener();
    }
  }

  main();
})();
